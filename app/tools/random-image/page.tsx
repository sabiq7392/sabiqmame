import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { RandomImageGallery } from '@/components/RandomImageGallery'

export const metadata: Metadata = {
  title: 'Random Image Gallery',
  description: 'Browse beautiful random images in a masonry gallery layout. Load more images with infinite scroll. Perfect for inspiration and design references.',
  openGraph: {
    title: 'Random Image Gallery | Sabiq Mame',
    description: 'Browse beautiful random images in a masonry gallery layout.',
    url: '/tools/random-image',
  },
  keywords: ['Random Images', 'Image Gallery', 'Masonry Gallery', 'Photo Gallery', 'Random Photos', 'Image Viewer'],
}

export default function RandomImagePage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-4 md:p-8 max-w-[1200px] mx-auto">
        <RandomImageGallery />
      </div>
    </main>
  )
}

