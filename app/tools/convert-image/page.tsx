import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import ImageConverter from '@/components/tools/ImageConverter'
import ToolsMenu from '@/components/tools/ToolsMenu'

export const metadata: Metadata = {
  title: 'Image Converter',
  description: 'Free online image converter. Convert images between JPEG, PNG, WebP, GIF, and BMP formats. Adjust quality settings and download your converted images instantly. No registration required.',
  openGraph: {
    title: 'Image Converter | Convert Images Online | Sabiq Mame',
    description: 'Free online image converter. Convert images between JPEG, PNG, WebP, GIF, and BMP formats.',
    url: '/tools/convert-image',
  },
  keywords: ['Image Converter', 'Image Format Converter', 'JPEG to PNG', 'PNG to WebP', 'Image Converter Online', 'Free Image Converter', 'Convert Image Format'],
}

export default function ConvertImagePage() {
  return (
    <>
      <ToolsMenu />
      <ImageConverter />
    </>
  )
}

