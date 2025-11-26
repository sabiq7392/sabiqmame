import { promises as fs } from 'fs'
import { join } from 'path'

const DB_DIR = join(process.cwd(), 'database', 'db')

// Ensure DB directory exists
const ensureDbDir = async () => {
  try {
    await fs.mkdir(DB_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

// Get file path for a model
const getModelPath = (modelName: string): string => {
  return join(DB_DIR, `${modelName}.json`)
}

// Read data from JSON file
const readData = async <T>(modelName: string): Promise<T[]> => {
  await ensureDbDir()
  const filePath = getModelPath(modelName)

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent) as T[]
  } catch (error: any) {
    // File doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

// Write data to JSON file
const writeData = async <T>(modelName: string, data: T[]): Promise<void> => {
  await ensureDbDir()
  const filePath = getModelPath(modelName)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// Generate ID (simple incrementing ID or UUID)
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export interface BaseModel {
  id: string
  createdAt?: string
  updatedAt?: string
}

export class JsonDB<T extends BaseModel> {
  private modelName: string

  constructor(modelName: string) {
    this.modelName = modelName
  }

  /**
   * Find all records matching the query
   * @param query - Object with key-value pairs to match, or function predicate
   */
  async find(query?: Partial<T> | ((item: T) => boolean)): Promise<T[]> {
    const data = await readData<T>(this.modelName)

    if (!query) {
      return data
    }

    if (typeof query === 'function') {
      return data.filter(query)
    }

    return data.filter(item => {
      return Object.keys(query).every(key => {
        const queryValue = query[key as keyof T]
        const itemValue = item[key as keyof T]
        return queryValue === itemValue
      })
    })
  }

  /**
   * Find one record matching the query
   */
  async findOne(query: Partial<T> | ((item: T) => boolean)): Promise<T | null> {
    const results = await this.find(query)
    return results.length > 0 ? results[0] : null
  }

  /**
   * Find record by ID
   */
  async findById(id: string): Promise<T | null> {
    return this.findOne({ id } as Partial<T>)
  }

  /**
   * Add a new record
   */
  async add(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const allData = await readData<T>(this.modelName)

    const newRecord: T = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T

    allData.push(newRecord)
    await writeData(this.modelName, allData)

    return newRecord
  }

  /**
   * Update records matching the query
   */
  async update(
    query: Partial<T> | ((item: T) => boolean),
    updates: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<T[]> {
    const allData = await readData<T>(this.modelName)
    const updatedRecords: T[] = []
    let hasChanges = false

    const isMatch = typeof query === 'function'
      ? query
      : (item: T) => Object.keys(query).every(key => {
        const queryValue = query[key as keyof T]
        const itemValue = item[key as keyof T]
        return queryValue === itemValue
      })

    const updatedData = allData.map(item => {
      if (isMatch(item)) {
        hasChanges = true
        const updated: T = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        } as T
        updatedRecords.push(updated)
        return updated
      }
      return item
    })

    if (hasChanges) {
      await writeData(this.modelName, updatedData)
    }

    return updatedRecords
  }

  /**
   * Update record by ID
   */
  async updateById(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    const results = await this.update({ id } as Partial<T>, updates)
    return results.length > 0 ? results[0] : null
  }

  /**
   * Delete records matching the query
   */
  async delete(query: Partial<T> | ((item: T) => boolean)): Promise<number> {
    const allData = await readData<T>(this.modelName)

    const isMatch = typeof query === 'function'
      ? query
      : (item: T) => Object.keys(query).every(key => {
        const queryValue = query[key as keyof T]
        const itemValue = item[key as keyof T]
        return queryValue === itemValue
      })

    const filteredData = allData.filter(item => !isMatch(item))
    const deletedCount = allData.length - filteredData.length

    if (deletedCount > 0) {
      await writeData(this.modelName, filteredData)
    }

    return deletedCount
  }

  /**
   * Delete record by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const deletedCount = await this.delete({ id } as Partial<T>)
    return deletedCount > 0
  }

  /**
   * Count records matching the query
   */
  async count(query?: Partial<T> | ((item: T) => boolean)): Promise<number> {
    const results = await this.find(query)
    return results.length
  }

  /**
   * Get all records
   */
  async all(): Promise<T[]> {
    return this.find()
  }

  /**
   * Clear all records
   */
  async clear(): Promise<void> {
    await writeData(this.modelName, [])
  }
}

// Helper function to create a model instance
export const createModel = <T extends BaseModel>(modelName: string): JsonDB<T> => {
  return new JsonDB<T>(modelName)
}

