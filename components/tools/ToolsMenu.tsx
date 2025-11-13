'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Typography } from 'antd'
import {
  FileImageOutlined,
  DiffOutlined,
  CodeOutlined,
  EditOutlined,
  LockOutlined,
  TableOutlined
} from '@ant-design/icons'

const { Text } = Typography

interface Tool {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  href: string
}

export const toolItems: Tool[] = [
  {
    id: 'convert-image',
    name: 'Convert Image',
    description: 'Convert and optimize your images between different formats',
    icon: <img src="/icon/convert-image.png" alt="Convert Image" />,
    href: '/tools/convert-image',
  },
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
    icon: <img src="/icon/json-diff.png" alt="JSON Diff" />,
    href: '/tools/json-diff',
  },
  {
    id: 'json-beautifier',
    name: 'JSON Beautifier',
    description: 'Format and beautify your JSON with syntax highlighting',
    icon: <img src="/icon/json-beautifier.png" alt="JSON Beautifier" />,
    href: '/tools/json-beautifier',
  },
  {
    id: 'random-image',
    name: 'Random Image',
    description: 'Get a random image from the internet',
    icon: <img src="/icon/random-image.png" alt="Random Image" />,
    href: '/tools/random-image',
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Write Markdown and see live preview with GFM support',
    icon: <img src="/icon/markdown.png" alt="Markdown Preview" />,
    href: '/tools/markdown-preview',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure, random passwords with customizable options',
    icon: <LockOutlined />,
    href: '/tools/password-generator',
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    description: 'Convert JSON arrays to CSV format with nested object support',
    icon: <TableOutlined />,
    href: '/tools/json-to-csv',
  }
]

export default function ToolsMenu() {
  const pathname = usePathname()

  return (
    <div className="mb-6">
      <div className="">
        <div className="flex flex-wrap items-center gap-2">
          {toolItems.map((tool) => {
            const isActive = pathname === tool.href
            return (
              <Link key={tool.id} href={tool.href}>
                <div
                  className={`
                    flex items-center gap-2 px-1.5 py-0.5 rounded-lg
                    transition-all duration-200
                    text-xs font-medium
                    ${isActive
                      ? 'bg-primary-blue/30 text-primary-blue-dark border border-primary-blue/50'
                      : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-white/70 hover:bg-primary-blue/20 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/20'
                    }
                  `}
                >
                  <span className="text-base w-[20px] h-[20px]">{tool.icon}</span>
                  <span>{tool.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

