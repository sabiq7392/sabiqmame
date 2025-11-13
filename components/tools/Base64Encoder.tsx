'use client'

import { useState, useEffect } from 'react'
import { Typography, Input, Button, Space, Radio, Alert, Image } from 'antd'
import { ClearOutlined, CopyOutlined, SwapOutlined, DownloadOutlined } from '@ant-design/icons'
import { message } from 'antd'

const { Title, Text } = Typography
const { TextArea } = Input

const STORAGE_KEY = 'base64-encoder-input'
const STORAGE_MODE_KEY = 'base64-encoder-mode'

type Mode = 'encode' | 'decode'

// Check if string is a Base64 image
const isBase64Image = (str: string): boolean => {
  return /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml|bmp);base64,/.test(str.trim())
}

// Extract Base64 data from data URI
const extractBase64Data = (str: string): string => {
  const match = str.match(/^data:([^;]+);base64,(.+)$/)
  return match ? match[2] : str
}

// Get MIME type from data URI
const getMimeType = (str: string): string => {
  const match = str.match(/^data:([^;]+);base64,/)
  return match ? match[1] : 'image/png'
}

// Get image data URI from Base64 string
const getImageDataURI = (base64: string, mimeType: string = 'image/png'): string => {
  if (base64.startsWith('data:')) {
    return base64
  }
  return `data:${mimeType};base64,${base64}`
}

// Get file extension from MIME type
const getFileExtension = (mimeType: string): string => {
  const mimeMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'application/pdf': 'pdf',
    'text/plain': 'txt',
    'application/json': 'json',
    'text/html': 'html',
    'text/css': 'css',
    'application/javascript': 'js',
    'text/xml': 'xml',
  }
  return mimeMap[mimeType] || 'bin'
}

export default function Base64Encoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isImageInput, setIsImageInput] = useState(false)
  const [isImageOutput, setIsImageOutput] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string>('image/png')

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    setMounted(true)
    try {
      const savedInput = localStorage.getItem(STORAGE_KEY)
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY) as Mode
      if (savedInput) {
        setInput(savedInput)
      }
      if (savedMode && (savedMode === 'encode' || savedMode === 'decode')) {
        setMode(savedMode)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
  }, [])

  // Save to localStorage whenever input or mode changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mounted) return

    try {
      if (input.trim()) {
        localStorage.setItem(STORAGE_KEY, input)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
      localStorage.setItem(STORAGE_MODE_KEY, mode)
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [input, mode, mounted])

  // Convert when input or mode changes
  useEffect(() => {
    if (!mounted) return

    if (!input.trim()) {
      setOutput('')
      setError(null)
      setIsImageInput(false)
      setIsImageOutput(false)
      setImagePreview(null)
      return
    }

    try {
      if (mode === 'encode') {
        // Check if input is an image file (data URI)
        if (isBase64Image(input)) {
          const base64Data = extractBase64Data(input)
          setOutput(base64Data)
          setIsImageInput(true)
          setIsImageOutput(false)
          setImagePreview(input)
          setError(null)
        } else {
          const encoded = btoa(unescape(encodeURIComponent(input)))
          setOutput(encoded)
          setIsImageInput(false)
          setIsImageOutput(false)
          setImagePreview(null)
          setError(null)
        }
      } else {
        try {
          // Check if input is a Base64 image (with or without data URI prefix)
          let base64String = input.trim()
          let imageDataURI = ''
          let isImage = false

          // Check if input has data URI prefix
          if (isBase64Image(base64String)) {
            imageDataURI = base64String
            const detectedMime = getMimeType(base64String)
            setMimeType(detectedMime)
            base64String = extractBase64Data(base64String)
            isImage = true
            setIsImageInput(true)
          } else {
            setIsImageInput(false)
            // Try to decode and check if it's binary/image data
            try {
              const decoded = decodeURIComponent(escape(atob(base64String)))
              // Check if decoded contains binary characters (likely image)
              const hasBinaryChars = /[\x00-\x08\x0E-\x1F]/.test(decoded)
              const isLongEnough = decoded.length > 100

              if (isLongEnough && hasBinaryChars) {
                // Likely an image, detect format from Base64 header
                let detectedFormat = 'image/png'
                if (base64String.startsWith('/9j/')) {
                  detectedFormat = 'image/jpeg'
                } else if (base64String.startsWith('iVBORw0KGgo')) {
                  detectedFormat = 'image/png'
                } else if (base64String.startsWith('R0lGODlh') || base64String.startsWith('R0lGODdh')) {
                  detectedFormat = 'image/gif'
                } else if (base64String.startsWith('UklGR')) {
                  detectedFormat = 'image/webp'
                }
                setMimeType(detectedFormat)
                imageDataURI = getImageDataURI(base64String, detectedFormat)
                isImage = true
              } else {
                // Regular text, decode normally
                setOutput(decoded)
                setIsImageOutput(false)
                setImagePreview(null)
                setError(null)
                return
              }
            } catch (decodeError) {
              // If decode fails, might be invalid Base64 or pure binary
              // Try as image anyway
              setMimeType('image/png')
              imageDataURI = getImageDataURI(base64String, 'image/png')
              isImage = true
            }
          }

          // If it's an image, show preview
          if (isImage) {
            if (!imageDataURI) {
              // Fallback: try to detect format
              let detectedFormat = 'image/png'
              if (base64String.startsWith('/9j/')) {
                detectedFormat = 'image/jpeg'
              } else if (base64String.startsWith('iVBORw0KGgo')) {
                detectedFormat = 'image/png'
              } else if (base64String.startsWith('R0lGODlh') || base64String.startsWith('R0lGODdh')) {
                detectedFormat = 'image/gif'
              } else if (base64String.startsWith('UklGR')) {
                detectedFormat = 'image/webp'
              }
              setMimeType(detectedFormat)
              imageDataURI = getImageDataURI(base64String, detectedFormat)
            }
            setOutput(`[Base64 Image Data]\nLength: ${base64String.length} characters\n\nTo view the image, use the preview below.`)
            setIsImageOutput(true)
            setImagePreview(imageDataURI)
            setError(null)
          }
        } catch (e) {
          throw new Error('Invalid Base64 string')
        }
      }
    } catch (e: any) {
      setError(e.message || 'Conversion failed')
      setOutput('')
      setIsImageInput(false)
      setIsImageOutput(false)
      setImagePreview(null)
    }
  }, [input, mode, mounted])

  const handleInputChange = (value: string) => {
    setInput(value)
  }

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    // Swap input and output when changing mode
    if (output) {
      setInput(output)
      setOutput('')
    }
  }

  const handleSwap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    if (output) {
      setInput(output)
      setOutput('')
    }
  }

  const handleCopy = (text: string, label: string) => {
    if (text) {
      navigator.clipboard.writeText(text)
      message.success(`${label} copied to clipboard!`)
    }
  }

  const handleDownload = () => {
    if (!imagePreview) {
      message.error('No image to download')
      return
    }

    try {
      // Extract Base64 data
      const base64Data = extractBase64Data(imagePreview)
      const mime = getMimeType(imagePreview)
      const extension = getFileExtension(mime)

      // Convert Base64 to blob
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mime })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `decoded-image.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      message.success('Image downloaded!')
    } catch (e) {
      message.error('Failed to download image')
      console.error('Download error:', e)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
    setIsImageInput(false)
    setIsImageOutput(false)
    setImagePreview(null)
    setMimeType('image/png')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          Base64 Encoder / Decoder
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Encode text to Base64 or decode Base64 to text instantly
        </Text>
      </div>

      {/* Mode Selector */}
      <div className="mb-6">
        <div className="rounded-2xl glass-strong p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                Mode:
              </Text>
              <Radio.Group
                value={mode}
                onChange={(e) => handleModeChange(e.target.value)}
                buttonStyle="solid"
                size="large"
              >
                <Radio.Button value="encode" className="bg-primary-blue hover:bg-primary-blue-dark">
                  Encode
                </Radio.Button>
                <Radio.Button value="decode" className="bg-primary-blue hover:bg-primary-blue-dark">
                  Decode
                </Radio.Button>
              </Radio.Group>
            </div>
            <Button
              icon={<SwapOutlined />}
              onClick={handleSwap}
              className="bg-primary-blue hover:bg-primary-blue-dark text-white"
              size="large"
            >
              Swap
            </Button>
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
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              {mode === 'encode' ? 'Text Input' : isImageInput ? 'Base64 Image Input' : 'Base64 Input'}
            </Title>
            <Space>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => handleCopy(input, 'Input')}
                disabled={!input}
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

          {mode === 'decode' && isImageInput && isBase64Image(input.trim()) ? (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-[#1e1e1e] p-4">
                <Image
                  src={input.trim()}
                  alt="Base64 Image Input Preview"
                  className="max-w-full"
                  preview={{
                    mask: 'Preview Image'
                  }}
                />
              </div>
              <TextArea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter Base64 image string (data:image/...;base64,...) or plain Base64..."
                rows={8}
                className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
                style={{ resize: 'vertical' }}
              />
            </div>
          ) : (
            <TextArea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode or paste Base64 image (data:image/...;base64,...)...' : 'Enter Base64 string to decode or paste Base64 image...'}
              rows={15}
              className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
              style={{ resize: 'vertical' }}
            />
          )}

          {input && (
            <div className="mt-2">
              <Text className="text-gray-500 dark:text-white/40 text-xs">
                Length: {input.length} characters
                {isImageInput && mode === 'decode' && ' (Image detected)'}
              </Text>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              {mode === 'encode' ? 'Base64 Output' : isImageOutput ? 'Image Preview' : 'Text Output'}
            </Title>
            <Space>
              {isImageOutput && imagePreview && (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Download
                </Button>
              )}
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => {
                  if (isImageOutput && imagePreview) {
                    handleCopy(imagePreview, 'Image Data URI')
                  } else {
                    handleCopy(output, 'Output')
                  }
                }}
                disabled={!output && !imagePreview}
                className="bg-primary-blue hover:bg-primary-blue-dark"
              >
                Copy
              </Button>
            </Space>
          </div>

          {isImageOutput && imagePreview ? (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-[#1e1e1e] p-4">
                <Image
                  src={imagePreview}
                  alt="Base64 Image Preview"
                  className="max-w-full"
                  preview={{
                    mask: 'Preview Image'
                  }}
                />
              </div>
              <TextArea
                value={output}
                readOnly
                placeholder="Image metadata..."
                rows={5}
                className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
              />
            </div>
          ) : (
            <TextArea
              value={output}
              readOnly
              placeholder={mode === 'encode' ? 'Base64 encoded text will appear here...' : 'Decoded text will appear here...'}
              rows={15}
              className="font-mono text-sm bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
              style={{ resize: 'vertical' }}
            />
          )}

          {output && !isImageOutput && (
            <div className="mt-2">
              <Text className="text-gray-500 dark:text-white/40 text-xs">
                Length: {output.length} characters
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-2xl glass-strong p-6">
        <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold mb-4">
          About Base64
        </Title>
        <div className="space-y-2 text-gray-700 dark:text-white/80">
          <p>
            <strong>Base64</strong> is an encoding scheme that converts binary data into ASCII text format.
            It's commonly used for:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Encoding data in URLs and HTML forms</li>
            <li>Storing binary data in JSON or XML</li>
            <li>Email attachments (MIME encoding)</li>
            <li>Data transmission over text-based protocols</li>
          </ul>
          <p className="mt-4">
            <strong>Note:</strong> This tool handles UTF-8 text encoding properly, so it can encode/decode
            Unicode characters including emojis and special characters.
          </p>
        </div>
      </div>
    </div>
  )
}

