import Navbar from '@/components/Navbar'
import Gallery from '@/components/Gallery'

export default function GalleryPage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-4 md:p-8">
        <Gallery />
      </div>
    </main>
  )
}

