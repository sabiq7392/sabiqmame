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
    <>
      <ToolsGrid />
    </>
  )
}
