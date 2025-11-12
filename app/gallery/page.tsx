import Navbar from '@/components/Navbar'
import { MyGallery } from '@/components/MyGallery'

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

