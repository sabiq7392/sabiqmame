'use client'

import { Card, Typography } from 'antd'
import { FileTextOutlined, FileImageOutlined, DiffOutlined, CodeOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title } = Typography

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  href?: string
}

const tools: Tool[] = [
  // {
  //   id: 'convert-image',
  //   name: 'Convert Image',
  //   description: 'Convert and optimize your images between different formats',
  //   icon: <FileImageOutlined />,
  // },
  // {
  //   id: 'cv-maker',
  //   name: 'CV Maker',
  //   description: 'Create and customize your professional CV easily',
  //   icon: <FileTextOutlined />,
  //   href: '/tools/cv-maker',
  // },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    description: 'Compare and find differences between two JSON objects',
    icon: <DiffOutlined />,
    href: '/tools/json-diff',
  },
  {
    id: 'json-beautifier',
    name: 'JSON Beautifier',
    description: 'Format and beautify your JSON with syntax highlighting',
    icon: <CodeOutlined />,
    href: '/tools/json-beautifier',
  },
]

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {tools.map((tool) => (
          <Link key={tool.id} href={tool.href || '#'}>
            <Card
              className="rounded-2xl glass hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-blue/20 transition-all cursor-pointer group h-full"
            >
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 rounded-full bg-primary-blue/20 border border-primary-blue/50 flex items-center justify-center mb-4 group-hover:bg-primary-blue/30 group-hover:border-primary-blue transition-all">
                <span className="text-4xl text-primary-blue-light">
                  {tool.icon}
                </span>
              </div>
              <Title level={3} className="!m-0 !mb-2 text-gray-900 dark:text-white text-2xl font-semibold">
                {tool.name}
              </Title>
              <p className="text-gray-600 dark:text-white/70 text-base leading-relaxed mb-0">
                {tool.description}
              </p>
            </div>
          </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
