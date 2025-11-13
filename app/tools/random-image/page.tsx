import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { RandomImageGallery } from '@/components/RandomImageGallery'
import ToolsMenu from '@/components/tools/ToolsMenu'

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
    <>
      <ToolsMenu />
      <RandomImageGallery />
    </>
  )
}

