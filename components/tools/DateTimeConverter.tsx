'use client'

import { useState, useEffect } from 'react'
import { Typography, Input, Button, Space, Select, DatePicker, Card, Divider, Alert } from 'antd'
import { ClearOutlined, CopyOutlined, SwapOutlined } from '@ant-design/icons'
import { message } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

const { Title, Text } = Typography
const { TextArea } = Input

const STORAGE_KEY = 'datetime-converter-input'

type ConversionType = 'format' | 'timestamp' | 'timezone' | 'calculator'

const DATE_FORMATS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-01-15)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (15/01/2024)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (01/15/2024)' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (15-01-2024)' },
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD (2024/01/15)' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (15 Jan 2024)' },
  { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY (January 15, 2024)' },
  { value: 'YYYY-MM-DD HH:mm:ss', label: 'YYYY-MM-DD HH:mm:ss' },
  { value: 'DD/MM/YYYY HH:mm', label: 'DD/MM/YYYY HH:mm' },
  { value: 'MMM DD, YYYY HH:mm A', label: 'MMM DD, YYYY HH:mm AM/PM' },
  { value: 'ISO', label: 'ISO 8601 (2024-01-15T10:30:00Z)' },
  { value: 'RFC2822', label: 'RFC 2822 (Mon, 15 Jan 2024 10:30:00 +0000)' },
]

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Jakarta',
  'Asia/Dubai',
  'Australia/Sydney',
  'Australia/Melbourne',
]

export default function DateTimeConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>('format')
  const [inputDate, setInputDate] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())
  const [outputFormat, setOutputFormat] = useState<string>('YYYY-MM-DD HH:mm:ss')
  const [timestamp, setTimestamp] = useState<string>('')
  const [toTimezone, setToTimezone] = useState<string>('Asia/Jakarta')
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Calculator states
  const [calcDays, setCalcDays] = useState<number>(0)
  const [calcMonths, setCalcMonths] = useState<number>(0)
  const [calcYears, setCalcYears] = useState<number>(0)
  const [calcHours, setCalcHours] = useState<number>(0)
  const [calcMinutes, setCalcMinutes] = useState<number>(0)

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    setMounted(true)
    try {
      const savedInput = localStorage.getItem(STORAGE_KEY)
      if (savedInput) {
        setInputDate(savedInput)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mounted) return

    try {
      if (inputDate.trim()) {
        localStorage.setItem(STORAGE_KEY, inputDate)
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [inputDate, mounted])

  // Convert based on type
  useEffect(() => {
    if (!mounted) return

    try {
      setError(null)

      if (conversionType === 'format') {
        if (!inputDate.trim()) {
          setOutput('')
          return
        }

        // Auto-detect date format
        let parsedDate = dayjs(inputDate)

        // If parsing failed, try ISO format
        if (!parsedDate.isValid()) {
          parsedDate = dayjs(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true)
        }

        if (!parsedDate.isValid()) {
          setError('Invalid date format. Please check your input.')
          setOutput('')
          return
        }

        let formatted = ''
        if (outputFormat === 'ISO') {
          formatted = parsedDate.toISOString()
        } else if (outputFormat === 'RFC2822') {
          formatted = parsedDate.format('ddd, DD MMM YYYY HH:mm:ss [GMT]ZZ')
        } else {
          formatted = parsedDate.format(outputFormat)
        }

        setOutput(formatted)
      } else if (conversionType === 'timestamp') {
        if (!timestamp.trim()) {
          setOutput('')
          return
        }

        const ts = parseFloat(timestamp)
        if (isNaN(ts)) {
          setError('Invalid timestamp. Please enter a valid number.')
          setOutput('')
          return
        }

        // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
        const date = ts < 10000000000 ? dayjs.unix(ts) : dayjs(ts)

        if (!date.isValid()) {
          setError('Invalid timestamp value.')
          setOutput('')
          return
        }

        setOutput(date.format('YYYY-MM-DD HH:mm:ss'))
        setInputDate(date.format('YYYY-MM-DD HH:mm:ss'))
      } else if (conversionType === 'timezone') {
        if (!inputDate.trim()) {
          setOutput('')
          return
        }

        // Auto-detect timezone: use browser's local timezone
        const localTimezone = dayjs.tz.guess()
        let parsedDate = dayjs.tz(inputDate, localTimezone)

        // If parsing failed, try without timezone (assume local)
        if (!parsedDate.isValid()) {
          parsedDate = dayjs(inputDate)
          if (parsedDate.isValid()) {
            // Convert from local to target timezone
            parsedDate = dayjs.tz(parsedDate.format('YYYY-MM-DD HH:mm:ss'), localTimezone)
          }
        }

        if (!parsedDate.isValid()) {
          setError('Invalid date format.')
          setOutput('')
          return
        }

        // Convert to target timezone
        const converted = parsedDate.tz(toTimezone)
        setOutput(converted.format('YYYY-MM-DD HH:mm:ss z'))
      } else if (conversionType === 'calculator') {
        if (!selectedDate) {
          setOutput('')
          return
        }

        let result = selectedDate.clone()

        result = result
          .add(calcYears, 'year')
          .add(calcMonths, 'month')
          .add(calcDays, 'day')
          .add(calcHours, 'hour')
          .add(calcMinutes, 'minute')

        setOutput(result.format('YYYY-MM-DD HH:mm:ss'))
        setInputDate(result.format('YYYY-MM-DD HH:mm:ss'))
      }
    } catch (e: any) {
      setError(e.message || 'Conversion failed')
      setOutput('')
    }
  }, [
    conversionType,
    inputDate,
    outputFormat,
    timestamp,
    toTimezone,
    selectedDate,
    calcDays,
    calcMonths,
    calcYears,
    calcHours,
    calcMinutes,
    mounted,
  ])

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      message.success(`${label} copied to clipboard!`)
    } catch (e) {
      message.error('Failed to copy to clipboard')
    }
  }

  const handleClear = () => {
    setInputDate('')
    setTimestamp('')
    setOutput('')
    setError(null)
    setSelectedDate(dayjs())
    setCalcDays(0)
    setCalcMonths(0)
    setCalcYears(0)
    setCalcHours(0)
    setCalcMinutes(0)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
  }

  const handleNow = () => {
    const now = dayjs()
    setInputDate(now.format('YYYY-MM-DD HH:mm:ss'))
    setSelectedDate(now)
    setTimestamp(now.unix().toString())
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          Date & Time Converter
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Convert, format, and calculate dates and times with ease
        </Text>
      </div>

      {/* Conversion Type Selector */}
      <div className="mb-6">
        <div className="rounded-2xl glass-strong p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                Conversion Type:
              </Text>
              <Select
                value={conversionType}
                onChange={setConversionType}
                className="w-full md:w-64"
                size="large"
                options={[
                  { value: 'format', label: 'Format Converter' },
                  { value: 'timestamp', label: 'Unix Timestamp' },
                  { value: 'timezone', label: 'Timezone Converter' },
                  { value: 'calculator', label: 'Date Calculator' },
                ]}
              />
            </div>
            <Space>
              <Button
                icon={<SwapOutlined />}
                onClick={handleNow}
                className="bg-primary-blue hover:bg-primary-blue-dark text-white"
                size="large"
              >
                Now
              </Button>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
                size="large"
              >
                Clear
              </Button>
            </Space>
          </div>
        </div>
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
        <Card className="rounded-2xl glass-strong border-0">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Input
            </Title>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => {
                if (conversionType === 'timestamp') {
                  handleCopy(timestamp, 'Timestamp')
                } else if (conversionType === 'calculator') {
                  handleCopy(selectedDate?.format('YYYY-MM-DD HH:mm:ss') || '', 'Date')
                } else {
                  handleCopy(inputDate, 'Input')
                }
              }}
              disabled={!inputDate && !timestamp && !selectedDate}
              className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            >
              Copy
            </Button>
          </div>

          {conversionType === 'format' && (
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                Date String (auto-detect format):
              </Text>
              <TextArea
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                placeholder="Enter date string (e.g., 2024-01-15 10:30:00, 15/01/2024, Jan 15, 2024)"
                rows={5}
                className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
              />
              <Text className="text-gray-500 dark:text-white/40 text-xs mt-2 block">
                Supports various date formats - will auto-detect automatically
              </Text>
            </div>
          )}

          {conversionType === 'timestamp' && (
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                Unix Timestamp (seconds or milliseconds):
              </Text>
              <Input
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="Enter timestamp (e.g., 1705312200)"
                className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
              />
              <Text className="text-gray-500 dark:text-white/40 text-xs mt-2 block">
                Current timestamp: {dayjs().unix()} (seconds) or {Date.now()} (milliseconds)
              </Text>
            </div>
          )}

          {conversionType === 'timezone' && (
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                Date & Time (auto-detect timezone):
              </Text>
              <TextArea
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                placeholder={`Enter date (e.g., 2024-01-15 10:30:00). Will use your local timezone: ${dayjs.tz.guess()}`}
                rows={5}
                className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
              />
              <Text className="text-gray-500 dark:text-white/40 text-xs mt-2 block">
                Detected timezone: {dayjs.tz.guess()} (your browser timezone)
              </Text>
            </div>
          )}

          {conversionType === 'calculator' && (
            <div className="space-y-4">
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                  Base Date:
                </Text>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  className="w-full"
                  size="large"
                />
              </div>
              <Divider className="my-4" />
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-4 block">
                  Add/Subtract:
                </Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-gray-600 dark:text-white/60 text-xs mb-1 block">Years</Text>
                    <Input
                      type="number"
                      value={calcYears}
                      onChange={(e) => setCalcYears(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-white/60 dark:bg-white/5"
                    />
                  </div>
                  <div>
                    <Text className="text-gray-600 dark:text-white/60 text-xs mb-1 block">Months</Text>
                    <Input
                      type="number"
                      value={calcMonths}
                      onChange={(e) => setCalcMonths(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-white/60 dark:bg-white/5"
                    />
                  </div>
                  <div>
                    <Text className="text-gray-600 dark:text-white/60 text-xs mb-1 block">Days</Text>
                    <Input
                      type="number"
                      value={calcDays}
                      onChange={(e) => setCalcDays(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-white/60 dark:bg-white/5"
                    />
                  </div>
                  <div>
                    <Text className="text-gray-600 dark:text-white/60 text-xs mb-1 block">Hours</Text>
                    <Input
                      type="number"
                      value={calcHours}
                      onChange={(e) => setCalcHours(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-white/60 dark:bg-white/5"
                    />
                  </div>
                  <div>
                    <Text className="text-gray-600 dark:text-white/60 text-xs mb-1 block">Minutes</Text>
                    <Input
                      type="number"
                      value={calcMinutes}
                      onChange={(e) => setCalcMinutes(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-white/60 dark:bg-white/5"
                    />
                  </div>
                </div>
                <Text className="text-gray-500 dark:text-white/40 text-xs mt-2 block">
                  Use negative values to subtract
                </Text>
              </div>
            </div>
          )}
        </Card>

        {/* Output Section */}
        <Card className="rounded-2xl glass-strong border-0">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Output
            </Title>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(output, 'Output')}
              disabled={!output}
              className="bg-primary-blue hover:bg-primary-blue-dark"
            >
              Copy
            </Button>
          </div>

          {conversionType === 'format' && (
            <div className="space-y-4">
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                  Output Format:
                </Text>
                <Select
                  value={outputFormat}
                  onChange={setOutputFormat}
                  className="w-full"
                  options={DATE_FORMATS}
                />
              </div>
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                  Formatted Date:
                </Text>
                <TextArea
                  value={output}
                  readOnly
                  placeholder="Formatted date will appear here..."
                  rows={5}
                  className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
                />
              </div>
              {output && (
                <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/20">
                  <Text className="text-gray-600 dark:text-white/60 text-xs">
                    Unix Timestamp: {dayjs(output, outputFormat === 'ISO' ? undefined : outputFormat).unix()} (seconds)
                  </Text>
                  <br />
                  <Text className="text-gray-600 dark:text-white/60 text-xs">
                    Relative: {dayjs(output, outputFormat === 'ISO' ? undefined : outputFormat).fromNow()}
                  </Text>
                </div>
              )}
            </div>
          )}

          {conversionType === 'timestamp' && (
            <div className="space-y-4">
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                  Converted Date:
                </Text>
                <TextArea
                  value={output}
                  readOnly
                  placeholder="Converted date will appear here..."
                  rows={5}
                  className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
                />
              </div>
              {output && (
                <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/20">
                  <Text className="text-gray-600 dark:text-white/60 text-xs">
                    Also in milliseconds: {dayjs(output).valueOf()}
                  </Text>
                  <br />
                  <Text className="text-gray-600 dark:text-white/60 text-xs">
                    Relative: {dayjs(output).fromNow()}
                  </Text>
                </div>
              )}
            </div>
          )}

          {conversionType === 'timezone' && (
            <div className="space-y-4">
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                  To Timezone:
                </Text>
                <Select
                  value={toTimezone}
                  onChange={setToTimezone}
                  className="w-full"
                  options={TIMEZONES.map((tz) => ({ value: tz, label: tz }))}
                />
              </div>
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                  Converted Date:
                </Text>
                <TextArea
                  value={output}
                  readOnly
                  placeholder="Converted date will appear here..."
                  rows={5}
                  className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {conversionType === 'calculator' && (
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                Result:
              </Text>
              <TextArea
                value={output}
                readOnly
                placeholder="Calculated date will appear here..."
                rows={5}
                className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
              />
              {output && (
                <div className="mt-4 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/20">
                  <Text className="text-gray-600 dark:text-white/60 text-xs">
                    Unix Timestamp: {dayjs(output).unix()} (seconds)
                  </Text>
                  <br />
                  <Text className="text-gray-600 dark:text-white/60 text-xs">
                    Relative: {dayjs(output).fromNow()}
                  </Text>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Info Section */}
      <Card className="rounded-2xl glass-strong border-0">
        <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold mb-4">
          About Date & Time Converter
        </Title>
        <div className="space-y-2 text-gray-700 dark:text-white/80">
          <p>
            This tool provides multiple date and time conversion utilities:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Format Converter:</strong> Convert dates between different formats</li>
            <li><strong>Unix Timestamp:</strong> Convert between timestamps and human-readable dates</li>
            <li><strong>Timezone Converter:</strong> Convert dates between different timezones</li>
            <li><strong>Date Calculator:</strong> Add or subtract time from a date</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

