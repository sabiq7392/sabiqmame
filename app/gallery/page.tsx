import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { MyGallery } from '@/components/MyGallery'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse through my collection of beautiful images and works. Explore random images and portfolio works in a beautiful masonry gallery layout.',
  openGraph: {
    title: `Gallery | ${Config.me.alias}`,
    description: 'Browse through my collection of beautiful images and works.',
    url: '/gallery',
  },
  keywords: ['Gallery', 'Portfolio', 'Images', 'Photography', 'Works'],
}

export default function GalleryPage() {
  return (
    <>
      <MyGallery />
    </>
  )
}

