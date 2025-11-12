import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { MyGallery } from '@/components/MyGallery'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse through my collection of beautiful images and works. Explore random images and portfolio works in a beautiful masonry gallery layout.',
  openGraph: {
    title: 'Gallery | Sabiq Mame',
    description: 'Browse through my collection of beautiful images and works.',
    url: '/gallery',
  },
  keywords: ['Gallery', 'Portfolio', 'Images', 'Photography', 'Works'],
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-4 md:p-8">
        <MyGallery />
      </div>
    </main>
  )
}

