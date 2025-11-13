import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import MarkdownPreview from '@/components/tools/MarkdownPreview'
import ToolsMenu from '@/components/tools/ToolsMenu'

export const metadata: Metadata = {
  title: 'Markdown Preview',
  description: 'Free online Markdown preview tool. Write Markdown and see live preview with GitHub Flavored Markdown support. Perfect for writing documentation, README files, and more. No registration required.',
  openGraph: {
    title: 'Markdown Preview | Live Markdown Editor | Sabiq Mame',
    description: 'Free online Markdown preview tool. Write Markdown and see live preview with GitHub Flavored Markdown support.',
    url: '/tools/markdown-preview',
  },
  keywords: ['Markdown Preview', 'Markdown Editor', 'Markdown Viewer', 'Live Markdown', 'GitHub Flavored Markdown', 'Markdown Tool', 'Online Markdown Editor'],
}

export default function MarkdownPreviewPage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="max-w-[1200px] mx-auto min-h-[calc(100vh-96px)] p-8 md:p-4">
        <ToolsMenu />
        <MarkdownPreview />
      </div>
    </main>
  )
}

