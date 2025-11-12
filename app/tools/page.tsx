import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import ToolsGrid from '@/components/tools/ToolsGrid'

export const metadata: Metadata = {
  title: 'My Tools',
  description: 'Useful web development tools and utilities. Free online tools including CV Maker, JSON Diff, JSON Beautifier, and Random Image Gallery.',
  openGraph: {
    title: 'My Tools | Sabiq Mame',
    description: 'Useful web development tools and utilities. Free online tools for developers.',
    url: '/tools',
  },
  keywords: ['Tools', 'Web Tools', 'Developer Tools', 'CV Maker', 'JSON Tools', 'Online Tools', 'Free Tools'],
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-8 md:p-4">
        <ToolsGrid />
      </div>
    </main>
  )
}
