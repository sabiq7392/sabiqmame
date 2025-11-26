'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Typography, Card } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { getRecentTools, RecentTool } from '@/utils/toolsTracking'
import { toolItems } from './tools/ToolsMenu'

const { Title, Text } = Typography

// Helper function to get relative time string
const getRelativeTime = (timestamp: number, currentTime: number): string => {
  const diff = currentTime - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

export default function RecentTools() {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const refreshTools = () => {
      const tools = getRecentTools()
      setRecentTools(tools)
      setCurrentTime(Date.now()) // Update current time for relative time calculation
    }

    // Initial load
    refreshTools()

    // Update current time every minute to refresh relative time display
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60 * 1000) // Every minute

    // Refresh tools every 5 minutes to check for expired items
    const interval = setInterval(() => {
      refreshTools()
    }, 5 * 60 * 1000) // 5 minutes

    // Refresh when window gains focus (user comes back to tab)
    const handleFocus = () => {
      refreshTools()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(timeInterval)
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  if (recentTools.length === 0) {
    return null
  }

  // Map recent tools with full tool info
  const toolsWithInfo = recentTools.map(recent => {
    const toolInfo = toolItems.find(t => t.id === recent.id)
    return {
      ...recent,
      icon: toolInfo?.icon,
      description: toolInfo?.description || ''
    }
  })

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ClockCircleOutlined className="text-primary-blue text-lg" />
        <Title level={3} className="!m-0 text-gray-900 dark:text-white text-xl font-semibold">
          Recently Used Tools
        </Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {toolsWithInfo.map((tool) => (
          <Link key={tool.id} href={tool.href}>
            <div
              className="!px-4 !py-4 rounded-xl glass-strong border hover:border-primary-blue/50 border-gray-200 dark:border-white/20 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center  gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Title level={5} className="!m-0 text-gray-900 dark:text-white text-base font-semibold">
                      {tool.name}
                    </Title>
                  </div>
                  <Text className="text-gray-500 dark:text-white/50 text-xs mt-1 block">
                    {getRelativeTime(tool.timestamp, currentTime)}
                  </Text>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

