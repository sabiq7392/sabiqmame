import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Base64Encoder from '@/components/tools/Base64Encoder'
import ToolsMenu from '@/components/tools/ToolsMenu'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: 'Base64 Encoder / Decoder',
  description: 'Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 to text instantly. Supports UTF-8 encoding for Unicode characters. No registration required.',
  openGraph: {
    title: `Base64 Encoder / Decoder | Encode Decode Base64 Online | ${Config.me.alias}`,
    description: 'Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 to text instantly.',
    url: '/tools/base64-encoder',
  },
  keywords: ['Base64 Encoder', 'Base64 Decoder', 'Base64 Converter', 'Encode Base64', 'Decode Base64', 'Base64 Tool', 'Online Base64 Encoder'],
}

export default function Base64EncoderPage() {
  return (
    <>
      <ToolsMenu />
      <Base64Encoder />
    </>
  )
}

