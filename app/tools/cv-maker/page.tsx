import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import CVMakerForm from '@/components/tools/CVMakerForm'

export const metadata: Metadata = {
  title: 'CV Maker',
  description: 'Free online CV/Resume maker tool. Create professional CVs and resumes with drag-and-drop interface. Export to Markdown format. No registration required.',
  openGraph: {
    title: 'CV Maker | Free Online Resume Builder | Sabiq Mame',
    description: 'Free online CV/Resume maker tool. Create professional CVs and resumes with drag-and-drop interface.',
    url: '/tools/cv-maker',
  },
  keywords: ['CV Maker', 'Resume Builder', 'CV Generator', 'Resume Creator', 'Free CV Tool', 'Online Resume Maker', 'Markdown CV'],
}

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
