import type { Metadata } from 'next'
import ColorsTools from '@/components/tools/ColorsTools'
import ToolsMenu from '@/components/tools/ToolsMenu'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: 'Colors Tools',
  description: 'Free online color tools. Pick colors, generate palettes, create gradients, and convert color formats. Perfect for designers and developers. No registration required.',
  openGraph: {
    title: `Colors Tools | Color Picker & Generator | ${Config.me.alias}`,
    description: 'Free online color tools. Pick colors, generate palettes, create gradients, and convert color formats.',
    url: '/tools/colors',
  },
  keywords: ['Color Picker', 'Color Palette', 'Gradient Generator', 'Color Converter', 'HEX RGB HSL', 'Color Tools', 'Online Color Tool'],
}

export default function ColorsToolsPage() {
  return (
    <>
      <ToolsMenu />
      <ColorsTools />
    </>
  )
}

