'use client'

import { Typography } from 'antd'
import Link from 'next/link'
import { toolItems } from './ToolsMenu'

const { Title } = Typography



export default function ToolsGrid() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8 fade-in">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          My Tools
        </Title>
        <Title level={4} className="!m-0 text-gray-600 dark:text-white/60 text-lg md:text-base font-normal">
          Useful tools to help you with your daily tasks
        </Title>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mt-8">
        {toolItems.map((tool) => (
          <Link key={tool.id} href={tool.href || '#'}>
            <div
              className="rounded-lg md:rounded-xl lg:rounded-2xl glass-strong hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-blue/20 transition-all cursor-pointer group h-full"
            >
              <div className="flex flex-col items-center text-center p-3 md:p-4 lg:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border border-primary-gray/20 p-1 flex items-center justify-center mb-2 md:mb-3 lg:mb-4 group-hover:border-primary-blue transition-all">
                  <span className="text-2xl md:text-3xl lg:text-4xl text-primary-blue-light">
                    {tool.icon}
                  </span>
                </div>
                <p className="!m-0 !mb-0 md:!mb-1 lg:!mb-2 text-gray-900 dark:text-white text-sm md:text-base lg:text-xl xl:text-2xl font-semibold">
                  {tool.name}
                </p>
                <p className="hidden md:block text-gray-600 dark:text-white/70 text-sm lg:text-base leading-relaxed mb-0">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
