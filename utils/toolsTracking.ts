const STORAGE_KEY = 'recent-tools'
const EXPIRY_DAYS = 3
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000 // 3 days in milliseconds

export interface RecentTool {
  id: string
  name: string
  href: string
  timestamp: number
}

// Helper function to check if a tool is expired
const isExpired = (timestamp: number): boolean => {
  const now = Date.now()
  return (now - timestamp) > EXPIRY_MS
}

// Helper function to filter expired tools
const filterExpiredTools = (tools: RecentTool[]): RecentTool[] => {
  return tools.filter(tool => !isExpired(tool.timestamp))
}

export const trackToolUsage = (toolId: string, toolName: string, toolHref: string) => {
  if (typeof window === 'undefined') return

  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    let recentTools: RecentTool[] = existing ? JSON.parse(existing) : []

    // Remove expired tools first
    recentTools = filterExpiredTools(recentTools)

    // Remove if already exists
    recentTools = recentTools.filter(tool => tool.id !== toolId)

    // Add new tool at the beginning
    const newTool: RecentTool = {
      id: toolId,
      name: toolName,
      href: toolHref,
      timestamp: Date.now()
    }

    recentTools.unshift(newTool)

    // Keep only last 3
    recentTools = recentTools.slice(0, 3)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentTools))
  } catch (e) {
    console.error('Failed to track tool usage:', e)
  }
}

export const getRecentTools = (): RecentTool[] => {
  if (typeof window === 'undefined') return []

  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (!existing) return []

    let recentTools: RecentTool[] = JSON.parse(existing)

    // Filter expired tools
    recentTools = filterExpiredTools(recentTools)

    // Save back to localStorage if expired tools were removed
    if (recentTools.length !== JSON.parse(existing).length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentTools))
    }

    return recentTools.sort((a, b) => b.timestamp - a.timestamp)
  } catch (e) {
    console.error('Failed to get recent tools:', e)
    return []
  }
}

export const clearRecentTools = () => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear recent tools:', e)
  }
}

