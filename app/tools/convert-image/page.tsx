import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import ImageConverter from '@/components/tools/ImageConverter'

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
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-8 md:p-4">
        <ImageConverter />
      </div>
    </main>
  )
}

