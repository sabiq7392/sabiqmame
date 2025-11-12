'use client'

import { ConfigProvider } from 'antd'
import { getAntdTheme } from '@/theme/antd-theme'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

function AntdConfigWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  
  return (
    <ConfigProvider theme={getAntdTheme(theme)}>
      {children}
    </ConfigProvider>
  )
}

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AntdConfigWrapper>
        {children}
      </AntdConfigWrapper>
    </ThemeProvider>
  )
}

