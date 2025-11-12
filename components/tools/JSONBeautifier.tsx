'use client'

import { useState, useRef } from 'react'
import { Card, Typography, Input, Button, Space, Alert } from 'antd'
import { ClearOutlined, CopyOutlined } from '@ant-design/icons'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/contexts/ThemeContext'
import { message } from 'antd'

const { Title, Text } = Typography
const { TextArea } = Input

export default function JSONBeautifier() {
  const { theme } = useTheme()
  const [inputJson, setInputJson] = useState('')
  const [formattedJson, setFormattedJson] = useState('')
  const [error, setError] = useState<string | null>(null)
  const formatTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const tryParseJSON = (text: string): any | null => {
    if (!text.trim()) return null
    
    const trimmed = text.trim()
    
    // Try 1: Parse langsung sebagai JSON object
    try {
      const parsed = JSON.parse(trimmed)
      // Jika hasilnya adalah object/array, return langsung
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
      // Jika hasilnya string, coba parse lagi (double stringified)
      if (typeof parsed === 'string') {
        try {
          const doubleParsed = JSON.parse(parsed)
          // Jika hasilnya object, return
          if (typeof doubleParsed === 'object' && doubleParsed !== null) {
            return doubleParsed
          }
          // Jika masih string, coba parse lagi (triple stringified)
          if (typeof doubleParsed === 'string') {
            return JSON.parse(doubleParsed)
          }
          return doubleParsed
        } catch {
          // String biasa, bukan JSON stringified
          return null
        }
      }
      return parsed
    } catch {
      // Try 2: Handle escaped JSON string (seperti {\"key\":\"value\"})
      // Jika text dimulai dengan { atau [ tapi tidak bisa di-parse, kemungkinan ada escape characters
      if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && trimmed.includes('\\"')) {
        try {
          // Pendekatan: Wrap dengan quotes dulu, parse sebagai string, lalu parse lagi
          // Ini handle case dimana JSON sudah di-stringify
          const wrapped = `"${trimmed.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
          try {
            const stringValue = JSON.parse(wrapped)
            if (typeof stringValue === 'string') {
              return JSON.parse(stringValue)
            }
          } catch {
            // Jika wrap dengan quotes gagal, coba unescape langsung
            // Strategy: Unescape \" menjadi " dan handle nested JSON string
            let cleaned = trimmed
            
            // Step 1: Unescape escaped quotes: \" -> "
            cleaned = cleaned.replace(/\\"/g, '"')
            
            // Step 2: Handle other escape sequences
            cleaned = cleaned
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\t/g, '\t')
              .replace(/\\b/g, '\b')
              .replace(/\\f/g, '\f')
              .replace(/\\\\/g, '\\')
            
            // Step 3: Parse JSON - jika gagal karena nested JSON string, fix manual
            try {
              return JSON.parse(cleaned)
            } catch (parseError: any) {
              // Parse gagal - kemungkinan karena nested JSON string
              // Fix: Escape quotes di dalam string values yang berisi JSON
              // Gunakan parser manual untuk handle nested structures
              let result = ''
              let inString = false
              let stringStartInResult = -1
              let stringStartInCleaned = -1
              let escapeNext = false
              let isValue = false
              let lastColonPos = -1
              
              for (let i = 0; i < cleaned.length; i++) {
                const char = cleaned[i]
                
                if (escapeNext) {
                  result += char
                  escapeNext = false
                  continue
                }
                
                if (char === '\\') {
                  escapeNext = true
                  result += char
                  continue
                }
                
                if (char === '"') {
                  if (!inString) {
                    // Start of string
                    inString = true
                    stringStartInResult = result.length
                    stringStartInCleaned = i
                    // Check if this is a value (after ":)
                    isValue = lastColonPos > 0 && i > lastColonPos && cleaned.substring(lastColonPos, i).trim() === ':'
                    result += char
                  } else {
                    // End of string
                    if (isValue) {
                      // This is a string value - check if it contains JSON
                      const stringContent = cleaned.substring(stringStartInCleaned + 1, i)
                      if ((stringContent.includes('{') || stringContent.includes('[')) && stringContent.includes('"')) {
                        // Escape quotes inside
                        const escaped = stringContent.replace(/"/g, '\\"')
                        // Replace the string content in result
                        result = result.substring(0, stringStartInResult + 1) + escaped + char
                      } else {
                        result += char
                      }
                    } else {
                      result += char
                    }
                    inString = false
                    isValue = false
                  }
                } else {
                  if (char === ':') {
                    lastColonPos = i
                  }
                  result += char
                }
              }
              
              try {
                return JSON.parse(result)
              } catch {
                return null
              }
            }
          }
        } catch {
          // Try 3: Handle case dimana text adalah string JSON yang di-wrap dengan quotes
          try {
            // Jika dimulai dan diakhiri dengan quote, remove outer quotes
            if ((trimmed.startsWith('"') && trimmed.endsWith('"')) && trimmed.length > 1) {
              let cleaned = trimmed.slice(1, -1)
              // Unescape: \\" -> ", \\\\ -> \
              cleaned = cleaned.replace(/\\\\/g, '\\').replace(/\\"/g, '"')
              return JSON.parse(cleaned)
            }
          } catch {
            return null
          }
        }
      }
      
      // Try 4: Jika text dimulai dengan quote, coba parse sebagai string lalu parse lagi
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) && trimmed.length > 1) {
        try {
          // Parse sebagai string JSON
          const stringValue = JSON.parse(trimmed)
          if (typeof stringValue === 'string') {
            // Parse string tersebut sebagai JSON
            return JSON.parse(stringValue)
          }
        } catch {
          return null
        }
      }
      
      return null
    }
  }

  const formatJSON = (jsonString: string): string => {
    try {
      const parsed = tryParseJSON(jsonString)
      if (parsed === null) {
        return jsonString
      }
      return JSON.stringify(parsed, null, 2)
    } catch {
      return jsonString
    }
  }

  const handleJSONInput = (value: string) => {
    setInputJson(value)
    setError(null)
    
    // Clear previous timeout
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current)
    }
    
    // Debounce formatting
    formatTimeoutRef.current = setTimeout(() => {
      if (!value.trim()) {
        setFormattedJson('')
        return
      }
      
      try {
        const formatted = formatJSON(value)
        setFormattedJson(formatted)
      } catch (e: any) {
        setError(`Invalid JSON: ${e.message}`)
        setFormattedJson('')
      }
    }, 300)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text')
    
    // Clear previous timeout
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current)
    }
    
    // Immediately format on paste
    setTimeout(() => {
      if (!pastedText.trim()) {
        setFormattedJson('')
        return
      }
      
      try {
        const formatted = formatJSON(pastedText)
        setFormattedJson(formatted)
      } catch (e: any) {
        setError(`Invalid JSON: ${e.message}`)
        setFormattedJson('')
      }
    }, 100)
  }

  const handleCopy = () => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson)
      message.success('Formatted JSON copied to clipboard!')
    }
  }

  const handleClear = () => {
    setInputJson('')
    setFormattedJson('')
    setError(null)
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto fade-in">
      <div className="mb-8">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          JSON Beautifier
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Format and beautify your JSON with automatic parsing and syntax highlighting
        </Text>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          closable
          onClose={() => setError(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Section */}
        <Card className="rounded-2xl glass">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Input JSON
            </Title>
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={handleClear}
              className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            >
              Clear
            </Button>
          </div>
          <TextArea
            value={inputJson}
            onChange={(e) => handleJSONInput(e.target.value)}
            onPaste={handlePaste}
            placeholder="Paste or type your JSON here..."
            rows={20}
            className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            style={{ resize: 'vertical' }}
          />
        </Card>

        {/* Formatted Output Section */}
        <Card className="rounded-2xl glass">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Formatted JSON
            </Title>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!formattedJson}
              className="bg-primary-blue hover:bg-primary-blue-dark"
            >
              Copy
            </Button>
          </div>
          <div className="relative">
            {formattedJson ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/20">
                <SyntaxHighlighter
                  language="json"
                  style={theme === 'dark' ? vscDarkPlus : vs}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                    maxHeight: '600px',
                    overflow: 'auto',
                  }}
                >
                  {formattedJson}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="h-[480px] flex items-center justify-center border border-gray-200 dark:border-white/20 rounded-lg bg-white/60 dark:bg-white/5">
                <Text className="text-gray-400 dark:text-white/40 text-center">
                  Formatted JSON will appear here...
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

