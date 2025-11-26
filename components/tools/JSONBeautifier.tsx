'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, Typography, Input, Button, Space, Alert } from 'antd'
import { ClearOutlined, CopyOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import { useTheme } from '@/contexts/ThemeContext'
import { message } from 'antd'
import { useToolTracking } from '@/hooks/useToolTracking'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const { Title, Text } = Typography
const { TextArea } = Input

const STORAGE_KEY = 'json-beautifier-input'

// Helper function to get line number from character position
const getLineNumber = (text: string, position: number): number => {
  if (position < 0 || position >= text.length) {
    return -1
  }
  const lines = text.substring(0, position).split('\n')
  return lines.length
}

// Helper function to get column number from character position
const getColumnNumber = (text: string, position: number): number => {
  if (position < 0 || position >= text.length) {
    return -1
  }
  const lastNewlineIndex = text.lastIndexOf('\n', position)
  return position - lastNewlineIndex
}

// Helper function to extract error position from JSON parse error
const extractErrorInfo = (error: Error, text: string): { line: number; column: number; message: string } => {
  const errorMessage = error.message || ''

  // Try to extract position from error message (format: "position X")
  const positionMatch = errorMessage.match(/position\s+(\d+)/i)
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10)
    const line = getLineNumber(text, position)
    const column = getColumnNumber(text, position)
    return { line, column, message: errorMessage }
  }

  // Try to extract position from error message (format: "at position X")
  const atPositionMatch = errorMessage.match(/at\s+position\s+(\d+)/i)
  if (atPositionMatch) {
    const position = parseInt(atPositionMatch[1], 10)
    const line = getLineNumber(text, position)
    const column = getColumnNumber(text, position)
    return { line, column, message: errorMessage }
  }

  // Try to extract position from error message (format: "Unexpected token X at position Y")
  const unexpectedMatch = errorMessage.match(/unexpected\s+.*?\s+at\s+position\s+(\d+)/i)
  if (unexpectedMatch) {
    const position = parseInt(unexpectedMatch[1], 10)
    const line = getLineNumber(text, position)
    const column = getColumnNumber(text, position)
    return { line, column, message: errorMessage }
  }

  // Try to extract position from error message (format: "at line X column Y")
  const lineColumnMatch = errorMessage.match(/at\s+line\s+(\d+)\s+column\s+(\d+)/i)
  if (lineColumnMatch) {
    const line = parseInt(lineColumnMatch[1], 10)
    const column = parseInt(lineColumnMatch[2], 10)
    return { line, column, message: errorMessage }
  }

  // If we can't extract position, return -1 for line/column
  return { line: -1, column: -1, message: errorMessage }
}

// Helper function to convert single quotes to double quotes for JSON parsing
const convertSingleQuotesToDouble = (text: string): string => {
  let result = ''
  let inSingleQuoteString = false
  let inDoubleQuoteString = false
  let escapeNext = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = i < text.length - 1 ? text[i + 1] : null

    if (escapeNext) {
      // If we're in a single-quoted string and encounter escaped single quote, convert to escaped double quote
      if (inSingleQuoteString && char === "'") {
        result += '\\"'
      } else {
        result += char
      }
      escapeNext = false
      continue
    }

    if (char === '\\') {
      escapeNext = true
      result += char
      continue
    }

    if (char === "'" && !inDoubleQuoteString) {
      if (!inSingleQuoteString) {
        // Start of single-quoted string - convert to double quote
        inSingleQuoteString = true
        result += '"'
      } else {
        // End of single-quoted string - convert to double quote
        inSingleQuoteString = false
        result += '"'
      }
    } else if (char === '"' && !inSingleQuoteString) {
      if (!inDoubleQuoteString) {
        // Start of double-quoted string
        inDoubleQuoteString = true
        result += char
      } else {
        // End of double-quoted string
        inDoubleQuoteString = false
        result += char
      }
    } else {
      // Regular character - keep as is
      result += char
    }
  }

  return result
}

const tryParseJSON = (text: string): any | null => {
  if (!text.trim()) return null

  const trimmed = text.trim()

  // Try 0: Check if text contains single quotes and convert them
  const hasSingleQuotes = trimmed.includes("'") && (trimmed.startsWith('{') || trimmed.startsWith('['))
  let textToParse = trimmed

  if (hasSingleQuotes) {
    try {
      // Convert single quotes to double quotes
      textToParse = convertSingleQuotesToDouble(trimmed)
    } catch {
      // If conversion fails, use original text
      textToParse = trimmed
    }
  }

  // Try 1: Parse langsung sebagai JSON object
  try {
    const parsed = JSON.parse(textToParse)
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

// Wrapper function to parse JSON with error line information
const parseJSONWithErrorInfo = (text: string): {
  parsed: any | null;
  error: string | null;
  line: number | null;
  column: number | null
} => {
  if (!text.trim()) {
    return { parsed: null, error: null, line: null, column: null }
  }

  const trimmed = text.trim()
  const originalText = text // Keep original for line calculation

  // Check if text contains single quotes and convert them
  const hasSingleQuotes = trimmed.includes("'") && (trimmed.startsWith('{') || trimmed.startsWith('['))
  let textToParse = trimmed

  if (hasSingleQuotes) {
    try {
      // Convert single quotes to double quotes
      textToParse = convertSingleQuotesToDouble(trimmed)
    } catch {
      // If conversion fails, use original text
      textToParse = trimmed
    }
  }

  // First, try direct JSON.parse to get precise error position
  try {
    const parsed = JSON.parse(textToParse)
    return { parsed, error: null, line: null, column: null }
  } catch (e: any) {
    const errorInfo = extractErrorInfo(e, trimmed)
    if (errorInfo.line > 0) {
      // Adjust line number if text was trimmed
      const linesBeforeTrim = text.substring(0, text.indexOf(trimmed)).split('\n').length - 1
      const adjustedLine = errorInfo.line + linesBeforeTrim
      return {
        parsed: null,
        error: errorInfo.message,
        line: adjustedLine,
        column: errorInfo.column
      }
    }

    // If we couldn't extract line from error message, try to find it manually
    // Try parsing incrementally to find where it fails
    let errorPosition = -1
    for (let i = 1; i <= textToParse.length; i++) {
      try {
        JSON.parse(textToParse.substring(0, i))
      } catch {
        errorPosition = i - 1
        break
      }
    }

    if (errorPosition >= 0) {
      // Map error position back to original text if single quotes were converted
      let mappedPosition = errorPosition
      if (hasSingleQuotes && textToParse !== trimmed) {
        // Try to map position back to original text
        // This is approximate - for exact mapping we'd need more complex logic
        mappedPosition = Math.min(errorPosition, trimmed.length - 1)
      }
      const line = getLineNumber(originalText, text.indexOf(trimmed) + mappedPosition)
      const column = getColumnNumber(originalText, text.indexOf(trimmed) + mappedPosition)
      return {
        parsed: null,
        error: errorInfo.message || 'Invalid JSON format',
        line: line > 0 ? line : null,
        column: column > 0 ? column : null
      }
    }
  }

  // If direct parse fails, try the complex parsing logic
  try {
    const parsed = tryParseJSON(text)
    if (parsed !== null) {
      return { parsed, error: null, line: null, column: null }
    }
  } catch (e: any) {
    const errorInfo = extractErrorInfo(e, text)
    return {
      parsed: null,
      error: errorInfo.message || 'Invalid JSON format',
      line: errorInfo.line > 0 ? errorInfo.line : null,
      column: errorInfo.column > 0 ? errorInfo.column : null
    }
  }

  // If tryParseJSON returns null but no error was thrown, try incremental parsing
  let lastValidPosition = 0
  const parseText = hasSingleQuotes ? textToParse : trimmed
  for (let i = 1; i <= parseText.length; i++) {
    try {
      JSON.parse(parseText.substring(0, i))
      lastValidPosition = i
    } catch {
      // Found the error position
      // Map back to original text position if single quotes were converted
      let mappedPosition = lastValidPosition
      if (hasSingleQuotes && textToParse !== trimmed) {
        mappedPosition = Math.min(lastValidPosition, trimmed.length - 1)
      }
      const errorPos = text.indexOf(trimmed) + mappedPosition
      const line = getLineNumber(text, errorPos)
      const column = getColumnNumber(text, errorPos)
      return {
        parsed: null,
        error: 'Invalid JSON format',
        line: line > 0 ? line : null,
        column: column > 0 ? column : null
      }
    }
  }

  return { parsed: null, error: 'Invalid JSON format', line: null, column: null }
}

export default function JSONBeautifier() {
  const { theme } = useTheme()
  const { track } = useToolTracking('json-beautifier', 'JSON Beautifier', '/tools/json-beautifier')
  const [inputJson, setInputJson] = useState('')
  const [formattedJson, setFormattedJson] = useState('')
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const [errorColumn, setErrorColumn] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const formatTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Track if component is mounted (client-side only)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setInputJson(saved)
        // Trigger formatting for saved input
        const result = parseJSONWithErrorInfo(saved)
        if (result.parsed !== null) {
          setParsedJson(result.parsed)
          const formatted = JSON.stringify(result.parsed, null, 2)
          setFormattedJson(formatted)
          setError(null)
          setErrorLine(null)
          setErrorColumn(null)
        } else {
          setParsedJson(null)
          setFormattedJson('')
          if (result.error) {
            let errorMessage = `Invalid JSON: ${result.error}`
            if (result.line !== null && result.line > 0) {
              errorMessage += `\nError pada baris ${result.line}`
              if (result.column !== null && result.column > 0) {
                errorMessage += `, kolom ${result.column}`
              }
            }
            setError(errorMessage)
            setErrorLine(result.line)
            setErrorColumn(result.column)
          }
        }
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
  }, [])

  // Save to localStorage whenever inputJson changes (but not on initial mount)
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    try {
      if (inputJson.trim()) {
        localStorage.setItem(STORAGE_KEY, inputJson)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [inputJson])

  const handleJSONInput = (value: string) => {
    setInputJson(value)
    setError(null)
    setErrorLine(null)
    setErrorColumn(null)

    // Track tool usage on first interaction
    if (value.trim()) {
      track()
    }

    // Clear previous timeout
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current)
    }

    // Debounce formatting
    formatTimeoutRef.current = setTimeout(() => {
      if (!value.trim()) {
        setFormattedJson('')
        setParsedJson(null)
        return
      }

      const result = parseJSONWithErrorInfo(value)
      if (result.parsed !== null) {
        setParsedJson(result.parsed)
        const formatted = JSON.stringify(result.parsed, null, 2)
        setFormattedJson(formatted)
        setError(null)
        setErrorLine(null)
        setErrorColumn(null)
      } else {
        setParsedJson(null)
        setFormattedJson('')
        if (result.error) {
          let errorMessage = `Invalid JSON: ${result.error}`
          if (result.line !== null && result.line > 0) {
            errorMessage += `\nError pada baris ${result.line}`
            if (result.column !== null && result.column > 0) {
              errorMessage += `, kolom ${result.column}`
            }
          }
          setError(errorMessage)
          setErrorLine(result.line)
          setErrorColumn(result.column)
        } else {
          setError(null)
          setErrorLine(null)
          setErrorColumn(null)
        }
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
        setParsedJson(null)
        setError(null)
        setErrorLine(null)
        setErrorColumn(null)
        return
      }

      const result = parseJSONWithErrorInfo(pastedText)
      if (result.parsed !== null) {
        setParsedJson(result.parsed)
        const formatted = JSON.stringify(result.parsed, null, 2)
        setFormattedJson(formatted)
        setError(null)
        setErrorLine(null)
        setErrorColumn(null)
      } else {
        setParsedJson(null)
        setFormattedJson('')
        if (result.error) {
          let errorMessage = `Invalid JSON: ${result.error}`
          if (result.line !== null && result.line > 0) {
            errorMessage += `\nError pada baris ${result.line}`
            if (result.column !== null && result.column > 0) {
              errorMessage += `, kolom ${result.column}`
            }
          }
          setError(errorMessage)
          setErrorLine(result.line)
          setErrorColumn(result.column)
        } else {
          setError(null)
          setErrorLine(null)
          setErrorColumn(null)
        }
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
    setParsedJson(null)
    setError(null)
    setErrorLine(null)
    setErrorColumn(null)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error('Failed to clear localStorage:', e)
      }
    }
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current)
    }
  }

  // Helper function to update JSON after edit/add/delete
  const updateJsonFromReactJson = (updatedSrc: any) => {
    try {
      // Update parsed JSON
      setParsedJson(updatedSrc)

      // Format and update formatted JSON
      const formatted = JSON.stringify(updatedSrc, null, 2)
      setFormattedJson(formatted)

      // Update input JSON to keep them in sync
      setInputJson(formatted)

      // Clear any errors
      setError(null)
      setErrorLine(null)
      setErrorColumn(null)

      // Show success message
      message.success('JSON updated successfully!')

      return true
    } catch (e: any) {
      message.error(`Failed to update JSON: ${e.message}`)
      return false
    }
  }

  // Handle edit in ReactJson
  const handleEdit = (edit: any) => {
    try {
      // edit.updated_src contains the updated JSON object
      if (edit.updated_src !== undefined) {
        return updateJsonFromReactJson(edit.updated_src)
      }
      return false
    } catch (e: any) {
      message.error(`Failed to edit JSON: ${e.message}`)
      return false
    }
  }

  // Handle add in ReactJson
  const handleAdd = (add: any) => {
    try {
      // add.updated_src contains the updated JSON object with new item
      if (add.updated_src !== undefined) {
        return updateJsonFromReactJson(add.updated_src)
      }
      return false
    } catch (e: any) {
      message.error(`Failed to add item: ${e.message}`)
      return false
    }
  }

  // Handle delete in ReactJson
  const handleDelete = (del: any) => {
    try {
      // del.updated_src contains the updated JSON object without deleted item
      if (del.updated_src !== undefined) {
        return updateJsonFromReactJson(del.updated_src)
      }
      return false
    } catch (e: any) {
      message.error(`Failed to delete item: ${e.message}`)
      return false
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto">
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
        <div className="rounded-2xl glass-strong p-6">
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
        </div>

        {/* Formatted Output Section */}
        <div className="rounded-2xl glass-strong p-6">
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
            {mounted && parsedJson ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-[#1e1e1e]">
                <div style={{ maxHeight: '600px', overflow: 'auto', padding: '16px' }}>
                  <ReactJson
                    src={parsedJson}
                    theme={theme === 'dark' ? 'monokai' : 'rjv-default'}
                    collapsed={false}
                    collapseStringsAfterLength={100}
                    displayDataTypes={false}
                    // @ts-ignore
                    displayArrayKey={false}
                    displayObjectSize={false}
                    enableClipboard={true}
                    enableEdit={true}
                    enableAdd={true}
                    enableDelete={true}
                    iconStyle="triangle"
                    indentWidth={2}
                    onEdit={handleEdit}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    name={null}
                    sortKeys={false}
                    style={{
                      fontSize: '14px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>
            ) : formattedJson ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-[#1e1e1e]">
                <div style={{ maxHeight: '600px', overflow: 'auto', padding: '16px' }}>
                  <pre style={{
                    margin: 0,
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    color: theme === 'dark' ? '#d4d4d4' : '#24292e',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {formattedJson}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-[480px] flex items-center justify-center border border-gray-200 dark:border-white/20 rounded-lg bg-white/60 dark:bg-white/5">
                <Text className="text-gray-400 dark:text-white/40 text-center">
                  Formatted JSON will appear here...
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

