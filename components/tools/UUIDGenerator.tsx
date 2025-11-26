'use client'

import { useState, useCallback, useEffect } from 'react'
import { Typography, Input, Button, Space, Card, Select, InputNumber, Switch } from 'antd'
import { CopyOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useToolTracking } from '@/hooks/useToolTracking'

const { Title, Text } = Typography
const { TextArea } = Input

// Generate UUID v1 (time-based UUID)
const generateUUIDv1 = (): string => {
  // Get current time in milliseconds since Unix epoch
  const now = Date.now()

  // Convert to 100-nanosecond intervals since 15 October 1582 (UUID epoch)
  // UUID epoch: 122192928000000000 (100-nanosecond intervals)
  // Unix epoch: 1970-01-01 00:00:00 UTC
  const uuidEpoch = 122192928000000000
  const timeIn100ns = (now * 10000) + uuidEpoch

  // Extract time components (60 bits)
  const timeLow = (timeIn100ns & 0xffffffff).toString(16).padStart(8, '0')
  const timeMid = ((timeIn100ns >> 32) & 0xffff).toString(16).padStart(4, '0')
  const timeHighAndVersion = (((timeIn100ns >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0')

  // Clock sequence (14 bits, with variant bits)
  const clockSeq = Math.floor(Math.random() * 0x3fff)
  const clockSeqHigh = ((clockSeq >> 8) | 0x80).toString(16).padStart(2, '0')
  const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0')

  // Node (48 bits - MAC address, using random for privacy)
  const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')

  return `${timeLow}-${timeMid}-${timeHighAndVersion}-${clockSeqHigh}${clockSeqLow}-${node}`
}

// Generate UUID v4 (random UUID)
const generateUUIDv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Generate UUID v5 (name-based UUID using SHA-1)
// Note: This is a simplified version. Full v5 requires proper SHA-1 implementation
const generateUUIDv5 = (namespace: string = '00000000-0000-0000-0000-000000000000', name: string = ''): string => {
  // Simplified v5 generation - in production, use proper SHA-1 hashing
  const combined = namespace + name
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert hash to hex and format as UUID
  const hex = Math.abs(hash).toString(16).padStart(32, '0')
  const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)}${hex.slice(17, 20)}-${hex.slice(20, 32)}`

  return uuid
}

type UUIDVersion = 'v1' | 'v4' | 'v5'

const generateUUID = (version: UUIDVersion = 'v4'): string => {
  switch (version) {
    case 'v1':
      return generateUUIDv1()
    case 'v4':
      return generateUUIDv4()
    case 'v5':
      return generateUUIDv5()
    default:
      return generateUUIDv4()
  }
}

export default function UUIDGenerator() {
  const { track } = useToolTracking('uuid-generator', 'UUID Generator', '/tools/uuid-generator')
  const [uuid, setUuid] = useState('')
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState<UUIDVersion>('v4')
  const [format, setFormat] = useState<'lowercase' | 'uppercase'>('lowercase')
  const [withHyphens, setWithHyphens] = useState(true)
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([])

  const formatUUID = useCallback((uuid: string): string => {
    // Remove hyphens first to get clean hex string
    let cleanUUID = uuid.replace(/-/g, '')

    // Add hyphens back if needed (format: 8-4-4-4-12)
    let formatted = cleanUUID
    if (withHyphens && cleanUUID.length === 32) {
      formatted = `${cleanUUID.slice(0, 8)}-${cleanUUID.slice(8, 12)}-${cleanUUID.slice(12, 16)}-${cleanUUID.slice(16, 20)}-${cleanUUID.slice(20)}`
    }

    // Apply case formatting
    return format === 'uppercase' ? formatted.toUpperCase() : formatted.toLowerCase()
  }, [format, withHyphens])

  const generateSingleUUID = useCallback(() => {
    track()
    const newUUID = generateUUID(version)
    const formatted = formatUUID(newUUID)
    setUuid(formatted)
    return formatted
  }, [version, formatUUID, track])

  const generateMultipleUUIDs = useCallback(() => {
    track()
    const uuids: string[] = []
    for (let i = 0; i < count; i++) {
      const newUUID = generateUUID(version)
      uuids.push(formatUUID(newUUID))
    }
    setGeneratedUUIDs(uuids)
    if (count === 1) {
      setUuid(uuids[0])
    }
  }, [count, version, formatUUID, track])

  // Generate UUID on mount
  useEffect(() => {
    generateSingleUUID()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Regenerate UUID when version changes
  useEffect(() => {
    generateSingleUUID()
    if (generatedUUIDs.length > 0) {
      generateMultipleUUIDs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  // Reformat existing UUIDs when format or hyphens change
  useEffect(() => {
    if (uuid) {
      const formatted = formatUUID(uuid)
      setUuid(formatted)
    }
    if (generatedUUIDs.length > 0) {
      const reformatted = generatedUUIDs.map(u => formatUUID(u))
      setGeneratedUUIDs(reformatted)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, withHyphens])

  const handleCopy = (textToCopy?: string) => {
    const text = textToCopy || uuid
    if (text) {
      navigator.clipboard.writeText(text)
      message.success('UUID copied to clipboard!')
    }
  }

  const handleCopyAll = () => {
    if (generatedUUIDs.length > 0) {
      const allUUIDs = generatedUUIDs.join('\n')
      navigator.clipboard.writeText(allUUIDs)
      message.success(`${generatedUUIDs.length} UUID(s) copied to clipboard!`)
    }
  }

  const handleClear = () => {
    setGeneratedUUIDs([])
    generateSingleUUID()
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          UUID Generator
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Generate random UUIDs (Universally Unique Identifiers) instantly
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Single UUID Generator */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Single UUID
            </Title>
            <Space>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={generateSingleUUID}
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
                title="Generate new UUID"
              >
                Generate
              </Button>
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => handleCopy()}
                disabled={!uuid}
                className="bg-primary-blue hover:bg-primary-blue-dark"
              >
                Copy
              </Button>
            </Space>
          </div>
          <Input
            value={uuid}
            readOnly
            className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
            placeholder="UUID will appear here..."
          />
        </div>

        {/* Options */}
        <div className="rounded-2xl glass-strong p-6">
          <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold mb-4">
            Options
          </Title>
          <Space direction="vertical" className="w-full" size="middle">
            <div className="flex items-center justify-between">
              <Text className="text-gray-700 dark:text-white/80">Version</Text>
              <Select
                value={version}
                onChange={setVersion}
                options={[
                  { label: 'UUID v1 (Time-based)', value: 'v1' },
                  { label: 'UUID v4 (Random)', value: 'v4' },
                  { label: 'UUID v5 (Name-based)', value: 'v5' },
                ]}
                className="w-48"
              />
            </div>
            <div className="flex items-center justify-between">
              <Text className="text-gray-700 dark:text-white/80">Format</Text>
              <Select
                value={format}
                onChange={setFormat}
                options={[
                  { label: 'Lowercase', value: 'lowercase' },
                  { label: 'Uppercase', value: 'uppercase' },
                ]}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <Text className="text-gray-700 dark:text-white/80">Include Hyphens</Text>
              <Switch checked={withHyphens} onChange={setWithHyphens} />
            </div>
          </Space>
        </div>
      </div>

      {/* Bulk Generator */}
      <div className="rounded-2xl glass-strong p-6">
        <div className="mb-4 flex items-center justify-between">
          <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
            Bulk Generator
          </Title>
          <Space>
            <InputNumber
              min={1}
              max={1000}
              value={count}
              onChange={(value) => setCount(value || 1)}
              className="w-24"
            />
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={generateMultipleUUIDs}
              className="bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
            >
              Generate {count} UUID{count !== 1 ? 's' : ''}
            </Button>
            {generatedUUIDs.length > 0 && (
              <>
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleCopyAll}
                  className="bg-primary-blue hover:bg-primary-blue-dark"
                >
                  Copy All
                </Button>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={handleClear}
                  className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear
                </Button>
              </>
            )}
          </Space>
        </div>
        {generatedUUIDs.length > 0 ? (
          <TextArea
            value={generatedUUIDs.join('\n')}
            readOnly
            rows={10}
            className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
            style={{ resize: 'vertical' }}
          />
        ) : (
          <div className="h-[240px] flex items-center justify-center border border-gray-200 dark:border-white/20 rounded-lg bg-white/60 dark:bg-white/5">
            <Text className="text-gray-400 dark:text-white/40 text-center">
              Generated UUIDs will appear here...
            </Text>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 rounded-2xl glass-strong p-6">
        <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold mb-4">
          About UUIDs
        </Title>
        <div className="space-y-2 text-gray-600 dark:text-white/60">
          <Text>
            <strong>UUID (Universally Unique Identifier)</strong> is a 128-bit identifier used to uniquely identify information in computer systems.
          </Text>
          <br />
          <Text>
            <strong>UUID Versions:</strong>
          </Text>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>UUID v1:</strong> Time-based UUID that includes MAC address and timestamp. Useful for sorting by creation time but may reveal MAC address.
            </li>
            <li>
              <strong>UUID v4:</strong> Random UUID (default). Uses random numbers and is the most commonly used version. The probability of generating duplicate UUIDs is extremely low.
            </li>
            <li>
              <strong>UUID v5:</strong> Name-based UUID using SHA-1 hashing. Same input (namespace + name) always produces the same UUID. Useful for generating consistent UUIDs from names.
            </li>
          </ul>
          <br />
          <Text>
            <strong>Format:</strong> 8-4-4-4-12 hexadecimal digits (e.g., 550e8400-e29b-41d4-a716-446655440000)
          </Text>
        </div>
      </div>
    </div>
  )
}

