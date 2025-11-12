'use client'

import { useState, useRef } from 'react'
import { Card, Typography, Input, Button, Space, Alert, Tabs } from 'antd'
import { SwapOutlined, ClearOutlined, CopyOutlined } from '@ant-design/icons'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/contexts/ThemeContext'

const { Title, Text } = Typography
const { TextArea } = Input

interface DiffResult {
  added: string[]
  removed: string[]
  modified: string[]
  unchanged: string[]
}

export default function JSONDiff() {
  const { theme } = useTheme()
  const [json1, setJson1] = useState('')
  const [json2, setJson2] = useState('')
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formattedJson1, setFormattedJson1] = useState('')
  const [formattedJson2, setFormattedJson2] = useState('')
  const formatTimeoutRef1 = useRef<NodeJS.Timeout | null>(null)
  const formatTimeoutRef2 = useRef<NodeJS.Timeout | null>(null)

  const formatJSON = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return jsonString
    }
  }

  const parseJSON = (jsonString: string): any => {
    try {
      return JSON.parse(jsonString)
    } catch (e: any) {
      throw new Error(`Invalid JSON: ${e.message}`)
    }
  }

  const compareJSON = () => {
    setError(null)
    setDiffResult(null)
    setFormattedJson1('')
    setFormattedJson2('')

    if (!json1.trim() || !json2.trim()) {
      setError('Please provide both JSON objects to compare')
      return
    }

    try {
      const obj1 = parseJSON(json1)
      const obj2 = parseJSON(json2)

      setFormattedJson1(formatJSON(json1))
      setFormattedJson2(formatJSON(json2))

      const result = findDifferences(obj1, obj2, '')
      setDiffResult(result)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const findDifferences = (obj1: any, obj2: any, path: string): DiffResult => {
    const added: string[] = []
    const removed: string[] = []
    const modified: string[] = []
    const unchanged: string[] = []

    const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})])

    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key
      const val1 = obj1?.[key]
      const val2 = obj2?.[key]

      if (!(key in obj1)) {
        added.push(currentPath)
      } else if (!(key in obj2)) {
        removed.push(currentPath)
      } else if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null && !Array.isArray(val1) && !Array.isArray(val2)) {
        const nested = findDifferences(val1, val2, currentPath)
        added.push(...nested.added)
        removed.push(...nested.removed)
        modified.push(...nested.modified)
        unchanged.push(...nested.unchanged)
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        modified.push(currentPath)
      } else {
        unchanged.push(currentPath)
      }
    }

    return { added, removed, modified, unchanged }
  }

  const swapJSONs = () => {
    const temp = json1
    setJson1(json2)
    setJson2(temp)
    setDiffResult(null)
    setError(null)
    setFormattedJson1('')
    setFormattedJson2('')
  }

  const clearAll = () => {
    setJson1('')
    setJson2('')
    setDiffResult(null)
    setError(null)
    setFormattedJson1('')
    setFormattedJson2('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatCurrentJSON = (jsonString: string, setter: (val: string) => void) => {
    try {
      const formatted = formatJSON(jsonString)
      setter(formatted)
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`)
    }
  }

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

  const handleJSONInput = (value: string, setter: (val: string) => void, timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    setter(value)
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Auto-format setelah user selesai mengetik (debounce)
    if (value.trim()) {
      timeoutRef.current = setTimeout(() => {
        const parsed = tryParseJSON(value)
        if (parsed !== null) {
          // Jika berhasil, format dan set
          const formatted = JSON.stringify(parsed, null, 2)
          // Hanya update jika berbeda (untuk menghindari loop)
          if (formatted !== value) {
            setter(formatted)
          }
        }
      }, 1000) // Wait 1 second after user stops typing
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, setter: (val: string) => void) => {
    const pastedText = e.clipboardData.getData('text')
    
    const parsed = tryParseJSON(pastedText)
    if (parsed !== null) {
      // Format JSON
      const formatted = JSON.stringify(parsed, null, 2)
      // Set formatted JSON
      e.preventDefault()
      setter(formatted)
    }
    // Jika tidak valid, biarkan paste normal
  }

  const highlightJSONWithDiff = (jsonString: string, diffResult: DiffResult, type: 'json1' | 'json2') => {
    try {
      const lines = jsonString.split('\n')
      const highlightedLines: JSX.Element[] = []

      // Create a map of paths to check
      const pathsToCheck = type === 'json1' 
        ? [...diffResult.removed, ...diffResult.modified]
        : [...diffResult.added, ...diffResult.modified]

      lines.forEach((line, lineIndex) => {
        let bgColor = ''
        let lineClass = ''
        let borderColor = ''

        // Check if this line contains any diff paths
        const checkPath = (path: string): boolean => {
          // Extract the key from path (last part)
          const pathParts = path.split('.')
          const key = pathParts[pathParts.length - 1]
          
          // Check if line contains the key with quotes
          const keyPattern = new RegExp(`"${key}"\\s*:`, 'g')
          return keyPattern.test(line)
        }

        const hasDiff = pathsToCheck.some(path => checkPath(path))
        
        if (hasDiff) {
          const isRemoved = type === 'json1' && diffResult.removed.some(path => checkPath(path))
          const isAdded = type === 'json2' && diffResult.added.some(path => checkPath(path))
          const isModified = diffResult.modified.some(path => checkPath(path))

          if (isRemoved) {
            bgColor = 'bg-red-500/20 dark:bg-red-500/20'
            lineClass = 'text-red-700 dark:text-red-300'
            borderColor = 'border-l-red-500'
          } else if (isAdded) {
            bgColor = 'bg-green-500/20 dark:bg-green-500/20'
            lineClass = 'text-green-700 dark:text-green-300'
            borderColor = 'border-l-green-500'
          } else if (isModified) {
            bgColor = 'bg-yellow-500/20 dark:bg-yellow-500/20'
            lineClass = 'text-yellow-700 dark:text-yellow-300'
            borderColor = 'border-l-yellow-500'
          }
        }

        highlightedLines.push(
          <div
            key={lineIndex}
            className={`${bgColor} ${lineClass} px-1 py-0.5 rounded min-h-[1.5rem] ${hasDiff ? `border-l-2 ${borderColor}` : ''}`}
          >
            <SyntaxHighlighter
              language="json"
              style={theme === 'dark' ? vscDarkPlus : vs}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              PreTag="span"
            >
              {line || ' '}
            </SyntaxHighlighter>
          </div>
        )
      })

      return <div className="space-y-0 font-mono">{highlightedLines}</div>
    } catch {
      return (
        <SyntaxHighlighter
          language="json"
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: 0,
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          {jsonString}
        </SyntaxHighlighter>
      )
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8 fade-in">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          JSON Diff
        </Title>
        <Text className="text-gray-600 dark:text-white/70 text-lg md:text-base">
          Compare two JSON objects and find the differences
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
        {/* JSON 1 */}
        <Card className="rounded-[20px] p-6 glass">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white">
              JSON 1
            </Title>
            <Space>
              <Button
                size="small"
                onClick={() => formatCurrentJSON(json1, setJson1)}
                disabled={!json1.trim()}
              >
                Format
              </Button>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(json1)}
                disabled={!json1.trim()}
              >
                Copy
              </Button>
            </Space>
          </div>
          <TextArea
            rows={15}
            value={json1}
            onChange={(e) => handleJSONInput(e.target.value, setJson1, formatTimeoutRef1)}
            onPaste={(e) => handlePaste(e, setJson1)}
            placeholder='{"name": "John", "age": 30} atau paste JSON stringified'
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 font-mono text-sm"
          />
        </Card>

        {/* JSON 2 */}
        <Card className="rounded-[20px] p-6 glass">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white">
              JSON 2
            </Title>
            <Space>
              <Button
                size="small"
                onClick={() => formatCurrentJSON(json2, setJson2)}
                disabled={!json2.trim()}
              >
                Format
              </Button>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(json2)}
                disabled={!json2.trim()}
              >
                Copy
              </Button>
            </Space>
          </div>
          <TextArea
            rows={15}
            value={json2}
            onChange={(e) => handleJSONInput(e.target.value, setJson2, formatTimeoutRef2)}
            onPaste={(e) => handlePaste(e, setJson2)}
            placeholder='{"name": "John", "age": 31} atau paste JSON stringified'
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 font-mono text-sm"
          />
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          type="primary"
          size="large"
          onClick={compareJSON}
          className="h-12 px-8 text-base font-medium bg-gradient-blue border-0 shadow-blue hover:-translate-y-0.5 hover:shadow-blue-hover transition-all"
        >
          Compare JSON
        </Button>
        <Button
          size="large"
          icon={<SwapOutlined />}
          onClick={swapJSONs}
          className="h-12 px-6 text-base font-medium"
        >
          Swap
        </Button>
        <Button
          size="large"
          icon={<ClearOutlined />}
          onClick={clearAll}
          className="h-12 px-6 text-base font-medium"
        >
          Clear All
        </Button>
      </div>

      {/* Diff Results */}
      {diffResult && (
        <Card className="rounded-[20px] p-6 glass">
          <Title level={3} className="!m-0 !mb-6 text-gray-900 dark:text-white text-2xl font-semibold">
            Differences
          </Title>

          <Tabs
            defaultActiveKey="side-by-side"
            items={[
              {
                key: 'side-by-side',
                label: 'Side by Side',
                children: (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* JSON 1 Side */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Title level={5} className="!m-0 text-gray-900 dark:text-white">
                            JSON 1
                          </Title>
                          <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(formattedJson1)}
                          >
                            Copy
                          </Button>
                        </div>
                        <div className="rounded-xl overflow-hidden p-4 bg-gray-50 dark:bg-dark-bg-secondary max-h-[600px] overflow-y-auto">
                          {highlightJSONWithDiff(formattedJson1 || '{}', diffResult, 'json1')}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-block mr-4">
                            <span className="inline-block w-3 h-3 rounded bg-red-500/20 dark:bg-red-500/20 mr-1"></span>
                            Removed
                          </span>
                          <span className="inline-block mr-4">
                            <span className="inline-block w-3 h-3 rounded bg-yellow-500/20 dark:bg-yellow-500/20 mr-1"></span>
                            Modified
                          </span>
                        </div>
                      </div>

                      {/* JSON 2 Side */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Title level={5} className="!m-0 text-gray-900 dark:text-white">
                            JSON 2
                          </Title>
                          <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(formattedJson2)}
                          >
                            Copy
                          </Button>
                        </div>
                        <div className="rounded-xl overflow-hidden p-4 bg-gray-50 dark:bg-dark-bg-secondary max-h-[600px] overflow-y-auto">
                          {highlightJSONWithDiff(formattedJson2 || '{}', diffResult, 'json2')}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-block mr-4">
                            <span className="inline-block w-3 h-3 rounded bg-green-500/20 dark:bg-green-500/20 mr-1"></span>
                            Added
                          </span>
                          <span className="inline-block mr-4">
                            <span className="inline-block w-3 h-3 rounded bg-yellow-500/20 dark:bg-yellow-500/20 mr-1"></span>
                            Modified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'summary',
                label: 'Summary',
                children: (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-green-500/10 dark:bg-green-500/10 border border-green-500/30">
                      <Text className="text-green-600 dark:text-green-400 font-semibold">
                        Added ({diffResult.added.length})
                      </Text>
                      {diffResult.added.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {diffResult.added.map((path, idx) => (
                            <li key={idx} className="text-gray-700 dark:text-green-300 text-sm font-mono">
                              + {path}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text className="block mt-2 text-gray-500 dark:text-gray-400 text-sm">
                          No fields added
                        </Text>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-red-500/10 dark:bg-red-500/10 border border-red-500/30">
                      <Text className="text-red-600 dark:text-red-400 font-semibold">
                        Removed ({diffResult.removed.length})
                      </Text>
                      {diffResult.removed.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {diffResult.removed.map((path, idx) => (
                            <li key={idx} className="text-gray-700 dark:text-red-300 text-sm font-mono">
                              - {path}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text className="block mt-2 text-gray-500 dark:text-gray-400 text-sm">
                          No fields removed
                        </Text>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-500/30">
                      <Text className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        Modified ({diffResult.modified.length})
                      </Text>
                      {diffResult.modified.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {diffResult.modified.map((path, idx) => (
                            <li key={idx} className="text-gray-700 dark:text-yellow-300 text-sm font-mono">
                              ~ {path}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text className="block mt-2 text-gray-500 dark:text-gray-400 text-sm">
                          No fields modified
                        </Text>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-gray-500/10 dark:bg-gray-500/10 border border-gray-500/30">
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold">
                        Unchanged ({diffResult.unchanged.length})
                      </Text>
                      {diffResult.unchanged.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {diffResult.unchanged.map((path, idx) => (
                            <li key={idx} className="text-gray-500 dark:text-gray-400 text-sm font-mono">
                              = {path}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text className="block mt-2 text-gray-500 dark:text-gray-400 text-sm">
                          No unchanged fields
                        </Text>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: 'formatted1',
                label: 'Formatted JSON 1',
                children: (
                  <div>
                    <div className="flex justify-end mb-2">
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(formattedJson1)}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-xl overflow-hidden p-4 bg-gray-50 dark:bg-dark-bg-secondary">
                      {highlightJSONWithDiff(formattedJson1 || '{}', diffResult, 'json1')}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-block mr-4">
                        <span className="inline-block w-3 h-3 rounded bg-red-500/20 dark:bg-red-500/20 mr-1"></span>
                        Removed
                      </span>
                      <span className="inline-block mr-4">
                        <span className="inline-block w-3 h-3 rounded bg-yellow-500/20 dark:bg-yellow-500/20 mr-1"></span>
                        Modified
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                key: 'formatted2',
                label: 'Formatted JSON 2',
                children: (
                  <div>
                    <div className="flex justify-end mb-2">
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(formattedJson2)}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-xl overflow-hidden p-4 bg-gray-50 dark:bg-dark-bg-secondary">
                      {highlightJSONWithDiff(formattedJson2 || '{}', diffResult, 'json2')}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-block mr-4">
                        <span className="inline-block w-3 h-3 rounded bg-green-500/20 dark:bg-green-500/20 mr-1"></span>
                        Added
                      </span>
                      <span className="inline-block mr-4">
                        <span className="inline-block w-3 h-3 rounded bg-yellow-500/20 dark:bg-yellow-500/20 mr-1"></span>
                        Modified
                      </span>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  )
}

