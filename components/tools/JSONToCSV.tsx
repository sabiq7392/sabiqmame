'use client'

import { useState, useEffect } from 'react'
import { Typography, Input, Button, Space, Alert } from 'antd'
import { ClearOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useToolTracking } from '@/hooks/useToolTracking'

const { Title, Text } = Typography
const { TextArea } = Input

const STORAGE_KEY = 'json-to-csv-input'

const defaultJSON = `[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "Los Angeles",
    "email": "jane@example.com"
  }
]`

// Flatten nested objects
const flattenObject = (obj: any, prefix = '', result: any = {}): any => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result)
      } else {
        result[newKey] = obj[key]
      }
    }
  }
  return result
}

// Convert JSON to CSV
const jsonToCSV = (jsonData: any): string => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error('JSON must be an array of objects')
  }

  // Flatten all objects
  const flattened = jsonData.map(item => flattenObject(item))

  // Get all unique keys
  const allKeys = new Set<string>()
  flattened.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key))
  })

  const headers = Array.from(allKeys)

  // Create CSV rows
  const rows = flattened.map(item => {
    return headers.map(header => {
      const value = item[header]
      if (value === null || value === undefined) {
        return ''
      }
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
  })

  // Combine headers and rows
  const csvRows = [headers.join(','), ...rows.map(row => row.join(','))]

  return csvRows.join('\n')
}

export default function JSONToCSV() {
  const { track } = useToolTracking('json-to-csv', 'JSON to CSV', '/tools/json-to-csv')
  const [inputJson, setInputJson] = useState('')
  const [csvOutput, setCsvOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setInputJson(saved)
        convertJSON(saved)
      } else {
        setInputJson(defaultJSON)
        convertJSON(defaultJSON)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
      setInputJson(defaultJSON)
      convertJSON(defaultJSON)
    }
  }, [])

  // Save to localStorage whenever inputJson changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mounted) return

    try {
      if (inputJson.trim()) {
        localStorage.setItem(STORAGE_KEY, inputJson)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [inputJson, mounted])

  const convertJSON = (jsonString: string) => {
    setError(null)

    if (!jsonString.trim()) {
      setCsvOutput('')
      return
    }

    try {
      const parsed = JSON.parse(jsonString)

      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of objects')
      }

      if (parsed.length === 0) {
        throw new Error('Array cannot be empty')
      }

      const csv = jsonToCSV(parsed)
      setCsvOutput(csv)
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format')
      setCsvOutput('')
    }
  }

  const handleJSONInput = (value: string) => {
    setInputJson(value)
    // Track tool usage on input
    if (value.trim()) {
      track()
    }
    convertJSON(value)
  }

  const handleCopy = () => {
    if (csvOutput) {
      navigator.clipboard.writeText(csvOutput)
      message.success('CSV copied to clipboard!')
    }
  }

  const handleDownload = () => {
    if (!csvOutput) {
      message.error('No CSV to download')
      return
    }

    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'converted.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    message.success('CSV downloaded!')
  }

  const handleClear = () => {
    setInputJson('')
    setCsvOutput('')
    setError(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          JSON to CSV Converter
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Convert JSON array to CSV format. Supports nested objects and arrays.
        </Text>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          closable
          onClose={() => setError(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Section */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              JSON Input
            </Title>
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={handleClear}
              className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            >
              Clear
            </Button>
          </div>
          <TextArea
            value={inputJson}
            onChange={(e) => handleJSONInput(e.target.value)}
            onPaste={(e) => {
              const pastedText = e.clipboardData.getData('text')
              // Track tool usage on paste
              if (pastedText.trim()) {
                track()
              }
            }}
            placeholder="Paste your JSON array here..."
            rows={20}
            className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Output Section */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              CSV Output
            </Title>
            <Space>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={!csvOutput}
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              >
                Copy
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                disabled={!csvOutput}
                className="bg-primary-blue hover:bg-primary-blue-dark"
              >
                Download
              </Button>
            </Space>
          </div>
          <TextArea
            value={csvOutput}
            readOnly
            placeholder="CSV output will appear here..."
            rows={20}
            className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>

      <div className="rounded-2xl glass-strong p-6">
        <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold mb-4">
          How to Use
        </Title>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-white/80">
          <li>Paste a JSON array of objects in the input field</li>
          <li>Nested objects will be flattened with dot notation (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">user.name</code>)</li>
          <li>CSV will be generated automatically as you type</li>
          <li>Click "Copy" to copy CSV to clipboard or "Download" to save as file</li>
          <li>Values containing commas, quotes, or newlines will be properly escaped</li>
        </ul>
      </div>
    </div>
  )
}

