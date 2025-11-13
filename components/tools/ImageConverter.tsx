'use client'

import { useState, useRef } from 'react'
import { Card, Typography, Upload, Button, Select, Slider, Space, Alert, Image } from 'antd'
import { UploadOutlined, DownloadOutlined, ClearOutlined } from '@ant-design/icons'
import { message } from 'antd'
import type { UploadFile, UploadProps } from 'antd'

const { Title, Text } = Typography
const { Option } = Select

const SUPPORTED_FORMATS = [
  { value: 'image/jpeg', label: 'JPEG (.jpg)', extension: 'jpg' },
  { value: 'image/png', label: 'PNG (.png)', extension: 'png' },
  { value: 'image/webp', label: 'WebP (.webp)', extension: 'webp' },
  { value: 'image/gif', label: 'GIF (.gif)', extension: 'gif' },
  { value: 'image/bmp', label: 'BMP (.bmp)', extension: 'bmp' },
]

export default function ImageConverter() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>('image/jpeg')
  const [quality, setQuality] = useState<number>(0.92)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload: UploadProps['beforeUpload'] = (file) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      message.error('Please upload an image file')
      return false
    }

    setOriginalFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImageUrl(e.target?.result as string)
      setConvertedImageUrl(null)
    }
    reader.readAsDataURL(file)
    return false // Prevent auto upload
  }

  const convertImage = () => {
    if (!originalImageUrl || !originalFile) {
      message.error('Please upload an image first')
      return
    }

    setLoading(true)
    const canvas = canvasRef.current
    if (!canvas) {
      setLoading(false)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setLoading(false)
      return
    }

    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw image on canvas
      ctx.drawImage(img, 0, 0)

      // Convert to desired format
      const outputExtension = SUPPORTED_FORMATS.find(f => f.value === outputFormat)?.extension || 'jpg'
      let mimeType = outputFormat
      let qualityValue = quality

      // Adjust quality based on format
      if (outputFormat === 'image/png' || outputFormat === 'image/gif' || outputFormat === 'image/bmp') {
        // These formats don't support quality parameter
        qualityValue = undefined as any
      }

      try {
        const dataUrl = canvas.toDataURL(mimeType, qualityValue)
        setConvertedImageUrl(dataUrl)
        message.success('Image converted successfully!')
      } catch (error) {
        message.error('Failed to convert image. Please try again.')
        console.error('Conversion error:', error)
      } finally {
        setLoading(false)
      }
    }

    img.onerror = () => {
      message.error('Failed to load image')
      setLoading(false)
    }

    img.src = originalImageUrl
  }

  const downloadImage = () => {
    if (!convertedImageUrl || !originalFile) {
      message.error('No converted image to download')
      return
    }

    const outputExtension = SUPPORTED_FORMATS.find(f => f.value === outputFormat)?.extension || 'jpg'
    const originalName = originalFile.name.split('.')[0]
    const fileName = `${originalName}.${outputExtension}`

    const link = document.createElement('a')
    link.href = convertedImageUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    message.success('Image downloaded!')
  }

  const handleClear = () => {
    setOriginalFile(null)
    setOriginalImageUrl(null)
    setConvertedImageUrl(null)
    setOutputFormat('image/jpeg')
    setQuality(0.92)
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  const supportsQuality = outputFormat === 'image/jpeg' || outputFormat === 'image/webp'

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8 fade-in">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          Image Converter
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Convert images between different formats (JPEG, PNG, WebP, GIF, BMP)
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upload Section */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Upload Image
            </Title>
            {originalFile && (
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClear}
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              >
                Clear
              </Button>
            )}
          </div>

          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
            accept="image/*"
            className="w-full"
          >
            <Button
              icon={<UploadOutlined />}
              className="w-full h-32 bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 hover:border-primary-blue dark:hover:border-primary-blue"
            >
              Click or drag image to upload
            </Button>
          </Upload>

          {originalFile && (
            <div className="mt-4">
              <Text className="text-gray-600 dark:text-white/60 text-sm">
                File: {originalFile.name} ({(originalFile.size / 1024).toFixed(2)} KB)
              </Text>
            </div>
          )}

          {originalImageUrl && (
            <div className="mt-4">
              <Text className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">
                Original Image:
              </Text>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/20 grid place-items-center">
                <Image
                  src={originalImageUrl}
                  alt="Original"
                  className="w-full"
                  preview={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Conversion Settings & Result */}
        <div className="rounded-2xl glass-strong p-6">
          <div className="mb-4">
            <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
              Conversion Settings
            </Title>
          </div>

          <Space direction="vertical" className="w-full" size="large">
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                Output Format:
              </Text>
              <Select
                value={outputFormat}
                onChange={setOutputFormat}
                className="w-full"
                size="large"
              >
                {SUPPORTED_FORMATS.map((format) => (
                  <Option key={format.value} value={format.value}>
                    {format.label}
                  </Option>
                ))}
              </Select>
            </div>

            {supportsQuality && (
              <div>
                <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2 block">
                  Quality: {Math.round(quality * 100)}%
                </Text>
                <Slider
                  min={0.1}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={setQuality}
                  tooltip={{ formatter: (value) => `${Math.round((value || 0) * 100)}%` }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-white/40 mt-1">
                  <span>Lower size</span>
                  <span>Higher quality</span>
                </div>
              </div>
            )}

            <Button
              type="primary"
              onClick={convertImage}
              loading={loading}
              disabled={!originalImageUrl}
              className="w-full bg-primary-blue hover:bg-primary-blue-dark"
              size="large"
            >
              Convert Image
            </Button>

            {convertedImageUrl && (
              <>
                <div>
                  <Text className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">
                    Converted Image:
                  </Text>
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/20">
                    <Image
                      src={convertedImageUrl}
                      alt="Converted"
                      className="w-full"
                      preview={false}
                    />
                  </div>
                </div>

                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={downloadImage}
                  className="w-full bg-primary-blue hover:bg-primary-blue-dark"
                  size="large"
                >
                  Download Converted Image
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>

      {/* Hidden canvas for conversion */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

