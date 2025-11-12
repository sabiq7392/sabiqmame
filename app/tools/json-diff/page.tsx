import Navbar from '@/components/Navbar'
import JSONDiff from '@/components/tools/JSONDiff'

export default function JSONDiffPage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-8 md:p-4">
        <JSONDiff />
      </div>
    </main>
  )
}

