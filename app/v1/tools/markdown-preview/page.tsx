import type { Metadata } from 'next'
import MarkdownPreview from '@/components/tools/MarkdownPreview'
import ToolsMenu from '@/components/tools/ToolsMenu'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: 'Markdown Preview',
  description: 'Free online Markdown preview tool. Write Markdown and see live preview with GitHub Flavored Markdown support. Perfect for writing documentation, README files, and more. No registration required.',
  openGraph: {
    title: `Markdown Preview | Live Markdown Editor | ${Config.me.alias}`,
    description: 'Free online Markdown preview tool. Write Markdown and see live preview with GitHub Flavored Markdown support.',
    url: '/tools/markdown-preview',
  },
  keywords: ['Markdown Preview', 'Markdown Editor', 'Markdown Viewer', 'Live Markdown', 'GitHub Flavored Markdown', 'Markdown Tool', 'Online Markdown Editor'],
}

export default function MarkdownPreviewPage() {
  return (
    <>
      <ToolsMenu />
      <MarkdownPreview />
    </>
  )
}

