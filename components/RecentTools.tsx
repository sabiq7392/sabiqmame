'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Typography, Card } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { getRecentTools, RecentTool } from '@/utils/toolsTracking'
import { toolItems } from './tools/ToolsMenu'

const { Title, Text } = Typography

export default function RecentTools() {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([])

  useEffect(() => {
    const refreshTools = () => {
      const tools = getRecentTools()
      setRecentTools(tools)
    }

    // Initial load
    refreshTools()

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
                  <Title level={5} className="!m-0 !mb-1 text-gray-900 dark:text-white text-base font-semibold">
                    {tool.name}
                  </Title>
                  {/* {tool.description && (
                    <Text className="text-gray-600 dark:text-white/60 text-sm line-clamp-2">
                      {tool.description}
                    </Text> */}
                  {/* )} */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

