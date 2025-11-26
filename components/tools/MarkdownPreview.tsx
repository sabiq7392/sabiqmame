'use client'

import { useState, useEffect } from 'react'
import { Typography, Input, Button, Space } from 'antd'
import { ClearOutlined, CopyOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTheme } from '@/contexts/ThemeContext'
import { message } from 'antd'
import { useToolTracking } from '@/hooks/useToolTracking'

const { Title, Text } = Typography
const { TextArea } = Input

const STORAGE_KEY = 'markdown-preview-input'

const defaultMarkdown = `# Markdown Preview

## Features

- **Bold text**
- *Italic text*
- \`Inline code\`
- [Links](https://example.com)

## Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Lists

1. First item
2. Second item
3. Third item

- Unordered item
- Another item

## Blockquote

> This is a blockquote

## Table

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
`

export default function MarkdownPreview() {
  const { theme } = useTheme()
  const { track } = useToolTracking('markdown-preview', 'Markdown Preview', '/tools/markdown-preview')
  const [markdown, setMarkdown] = useState('')
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setMarkdown(saved)
      } else {
        setMarkdown(defaultMarkdown)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
      setMarkdown(defaultMarkdown)
    }
  }, [])

  // Save to localStorage whenever markdown changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mounted) return

    try {
      if (markdown.trim()) {
        localStorage.setItem(STORAGE_KEY, markdown)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [markdown, mounted])

  const handleCopy = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown)
      message.success('Markdown copied to clipboard!')
    }
  }

  const handleClear = () => {
    setMarkdown('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
  }

  return (
    <div className="">
      <div className="mb-8">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          Markdown Preview
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Write Markdown and see live preview with GitHub Flavored Markdown support
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Section */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Markdown Input
            </Title>
            <Space>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={!markdown}
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              >
                Copy
              </Button>
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClear}
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              >
                Clear
              </Button>
            </Space>
          </div>
          <TextArea
            value={markdown}
            onChange={(e) => {
              const value = e.target.value
              setMarkdown(value)
              // Track tool usage on input
              if (value.trim()) {
                track()
              }
            }}
            onPaste={(e) => {
              const pastedText = e.clipboardData.getData('text')
              // Track tool usage on paste
              if (pastedText.trim()) {
                track()
              }
            }}
            placeholder="Write your Markdown here..."
            rows={25}
            className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Preview Section */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Preview
            </Title>
          </div>
          <div
            className="markdown-preview rounded-lg p-6 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/20 overflow-auto"
            style={{
              minHeight: '500px',
              maxHeight: '600px',
            }}
          >
            {mounted ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="markdown-content"
                components={{
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  table: ({ children }: any) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }: any) => (
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }: any) => (
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {children}
                    </td>
                  ),
                  blockquote: ({ children }: any) => (
                    <blockquote className="border-l-4 border-primary-blue pl-4 italic text-gray-700 dark:text-gray-300 my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }: any) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-blue hover:text-primary-blue-dark underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {markdown || '*Start typing Markdown to see preview...*'}
              </ReactMarkdown>
            ) : (
              <Text className="text-gray-400 dark:text-white/40">
                Loading preview...
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

