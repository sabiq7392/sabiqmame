const STORAGE_KEY = 'recent-tools'

export interface RecentTool {
  id: string
  name: string
  href: string
  timestamp: number
}

export const trackToolUsage = (toolId: string, toolName: string, toolHref: string) => {
  if (typeof window === 'undefined') return

  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    let recentTools: RecentTool[] = existing ? JSON.parse(existing) : []

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

    const recentTools: RecentTool[] = JSON.parse(existing)
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

