import type { Metadata } from 'next'
import UUIDGenerator from '@/components/tools/UUIDGenerator'
import ToolsMenu from '@/components/tools/ToolsMenu'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: 'UUID Generator',
  description: 'Free online UUID generator. Generate random UUIDs (Universally Unique Identifiers) instantly. Support for UUID v4, bulk generation, and customizable formatting options. No registration required.',
  openGraph: {
    title: `UUID Generator | Random UUID Creator | ${Config.me.alias}`,
    description: 'Free online UUID generator. Generate random UUIDs (Universally Unique Identifiers) instantly.',
    url: '/tools/uuid-generator',
  },
  keywords: ['UUID Generator', 'Random UUID', 'UUID v4', 'UUID Creator', 'Unique Identifier', 'UUID Tool', 'Online UUID Generator', 'GUID Generator'],
}

export default function UUIDGeneratorPage() {
  return (
    <>
      <ToolsMenu />
      <UUIDGenerator />
    </>
  )
}

