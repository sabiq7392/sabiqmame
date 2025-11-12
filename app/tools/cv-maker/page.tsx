import Navbar from '@/components/Navbar'
import CVMakerForm from '@/components/tools/CVMakerForm'

export default function CVMakerPage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-8 md:p-4">
        <CVMakerForm />
      </div>
    </main>
  )
}
