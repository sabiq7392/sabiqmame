import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import JSONToCSV from '@/components/tools/JSONToCSV'
import ToolsMenu from '@/components/tools/ToolsMenu'

export const metadata: Metadata = {
  title: 'JSON to CSV Converter',
  description: 'Free online JSON to CSV converter. Convert JSON arrays to CSV format instantly. Supports nested objects, automatic flattening, and proper CSV escaping. Download or copy your converted CSV. No registration required.',
  openGraph: {
    title: 'JSON to CSV Converter | Convert JSON to CSV Online | Sabiq Mame',
    description: 'Free online JSON to CSV converter. Convert JSON arrays to CSV format instantly with nested object support.',
    url: '/tools/json-to-csv',
  },
  keywords: ['JSON to CSV', 'JSON CSV Converter', 'Convert JSON to CSV', 'JSON Array to CSV', 'CSV Converter', 'JSON Tool', 'Online CSV Converter'],
}

export default function JSONToCSVPage() {
  return (
    <>
      <ToolsMenu />
      <JSONToCSV />
    </>
  )
}

