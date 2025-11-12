import { ThemeConfig } from 'antd'

export const getAntdTheme = (mode: 'light' | 'dark'): ThemeConfig => {
  const isDark = mode === 'dark'

  return {
    algorithm: isDark ? undefined : undefined, // Ant Design 5 uses default algorithm for light
    token: {
      colorPrimary: '#3b82f6',
      colorBgBase: isDark ? '#0a0e27' : '#ffffff',
      colorBgContainer: isDark ? '#111827' : '#f9fafb',
      colorText: isDark ? '#ffffff' : '#111827',
      colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 24, 39, 0.7)',
      colorBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: 12,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
      Menu: {
        itemBg: 'transparent',
        itemSelectedBg: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        itemActiveBg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
        itemHoverBg: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
        colorText: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(17, 24, 39, 0.8)',
        colorTextSelected: '#60a5fa',
        borderRadius: 8,
      },
      Button: {
        borderRadius: 12,
        fontWeight: 500,
      },
      Card: {
        borderRadius: 16,
      },
    },
  }
}

// Default export for backward compatibility (dark theme)
export const antdTheme = getAntdTheme('dark')
