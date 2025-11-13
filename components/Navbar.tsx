'use client'

import { Button } from 'antd'
import { HomeOutlined, ToolOutlined, SunOutlined, MoonOutlined, AppstoreOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

const menuItems = [
  {
    key: '/',
    href: '/',
    icon: HomeOutlined,
    label: 'Home',
  },
  {
    key: '/tools',
    href: '/tools',
    icon: ToolOutlined,
    label: 'My Tools',
  },
  {
    key: '/gallery',
    href: '/gallery',
    icon: AppstoreOutlined,
    label: 'Just Gallery',
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] w-full px-4 md:px-6 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-strong rounded-2xl px-6 py-3 shadow-[0_4px_20px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] backdrop-blur-[30px] border border-gray-200 dark:border-white/20 bg-white/90 dark:bg-white/10">
          <div className="flex items-center justify-between gap-3 md:gap-6">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20">
                <img
                  src="/me/logo.svg"
                  alt="Logo"
                  className="w-full h-full object-cover bg-white"
                />
              </div>
              <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">
                Sabiq Mame
              </span>
            </Link>

            {/* Menu Section */}
            <div className="flex-1 flex justify-evenly md:justify-end items-center gap-2 md:gap-3 min-w-0">
              {/* Custom Menu */}
              <nav className="flex items-center justify-evenly md:justify-start gap-0.5 md:gap-1 flex-1 md:flex-none">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.key

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`
                        flex items-center justify-center gap-1.5 md:gap-2
                        h-10 px-3 md:px-5 rounded-xl
                        transition-all duration-300
                        text-sm
                        ${isActive
                          ? 'bg-primary-blue/30'
                          : 'text-gray-700 dark:text-white/70 hover:bg-primary-blue/20 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon />
                      <span className="hidden md:inline">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Theme Toggle Button */}
              <Button
                type="text"
                icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className="!flex !items-center !justify-center !w-9 !h-9 md:!w-10 md:!h-10 !rounded-xl !text-gray-700 dark:!text-white/70 hover:!bg-primary-blue/10 dark:hover:!bg-primary-blue/20 hover:!text-gray-900 dark:hover:!text-white !transition-all !duration-300 flex-shrink-0"
                aria-label="Toggle theme"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
