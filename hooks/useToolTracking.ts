import { useRef } from 'react'
import { trackToolUsage } from '@/utils/toolsTracking'

export const useToolTracking = (toolId: string, toolName: string, toolHref: string) => {
  const hasTracked = useRef(false)

  const track = () => {
    if (!hasTracked.current) {
      trackToolUsage(toolId, toolName, toolHref)
      hasTracked.current = true
    }
  }

  return { track }
}

