'use client'

import { Menu, Button } from 'antd'
import { HomeOutlined, ToolOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link href="/">Home</Link>,
  },
  {
    key: '/tools',
    icon: <ToolOutlined />,
    label: <Link href="/tools">My Tools</Link>,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] w-full px-4 md:px-6 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-strong rounded-2xl px-6 py-3 shadow-[0_4px_20px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] backdrop-blur-[30px] border border-gray-200 dark:border-white/20 bg-white/90 dark:bg-white/10">
          <div className="flex items-center justify-between gap-6">
            {/* Logo Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20">
                <img 
                  src="/me/logo.svg" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg md:text-base font-semibold text-gray-900 dark:text-white hidden sm:block">
                Sabiq Mame
              </span>
            </div>

            {/* Menu Section */}
            <div className="flex-1 flex justify-end items-center gap-3">
              <Menu
                mode="horizontal"
                selectedKeys={[pathname || '/']}
                items={menuItems}
                className="!bg-transparent !border-none [&_.ant-menu-horizontal]:!border-none [&_.ant-menu-item]:!mx-1 [&_.ant-menu-item]:!rounded-xl [&_.ant-menu-item]:!px-5 [&_.ant-menu-item]:!h-10 [&_.ant-menu-item]:!flex [&_.ant-menu-item]:!items-center [&_.ant-menu-item-selected]:!bg-primary-blue/30 [&_.ant-menu-item-selected]:!text-primary-blue-light [&_.ant-menu-item-selected]:!border-none [&_.ant-menu-item-selected>a]:!text-primary-blue-light [&_.ant-menu-item]:!text-gray-700 dark:[&_.ant-menu-item]:!text-white/70 [&_.ant-menu-item>a]:!text-gray-700 dark:[&_.ant-menu-item>a]:!text-white/70 [&_.ant-menu-item:hover]:!bg-primary-blue/20 [&_.ant-menu-item:hover]:!text-gray-900 dark:[&_.ant-menu-item:hover]:!text-white [&_.ant-menu-item:hover>a]:!text-gray-900 dark:[&_.ant-menu-item:hover>a]:!text-white [&_.ant-menu-item]:!transition-all [&_.ant-menu-item]:!duration-300"
              />
              
              {/* Theme Toggle Button */}
              <Button
                type="text"
                icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className="!flex !items-center !justify-center !w-10 !h-10 !rounded-xl !text-gray-700 dark:!text-white/70 hover:!bg-primary-blue/10 dark:hover:!bg-primary-blue/20 hover:!text-gray-900 dark:hover:!text-white !transition-all !duration-300"
                aria-label="Toggle theme"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
