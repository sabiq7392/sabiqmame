import type { Metadata } from 'next'
import JSONBeautifier from '@/components/tools/JSONBeautifier'
import ToolsMenu from '@/components/tools/ToolsMenu'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: 'JSON Beautifier',
  description: 'Free online JSON beautifier and formatter. Format, validate, and prettify JSON data with syntax highlighting. No registration required.',
  openGraph: {
    title: `JSON Beautifier | Format & Prettify JSON Online | ${Config.me.alias}`,
    description: 'Free online JSON beautifier and formatter. Format, validate, and prettify JSON data.',
    url: '/tools/json-beautifier',
  },
  keywords: ['JSON Beautifier', 'JSON Formatter', 'JSON Prettify', 'JSON Validator', 'Format JSON', 'JSON Tool', 'Online JSON Formatter'],
}

export default function JSONBeautifierPage() {
  return (
    <>
      <ToolsMenu />
      <JSONBeautifier />
    </>
  )
}

