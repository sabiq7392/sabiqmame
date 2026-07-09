import type { Metadata } from 'next'
import DateTimeConverter from '@/components/tools/DateTimeConverter'
import ToolsMenu from '@/components/tools/ToolsMenu'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: 'Date & Time Converter',
  description: 'Free online date and time converter. Convert dates between formats, Unix timestamps, timezones, and calculate date differences. Perfect for developers and anyone working with dates. No registration required.',
  openGraph: {
    title: `Date & Time Converter | Online Date Tool | ${Config.me.alias}`,
    description: 'Free online date and time converter. Convert dates between formats, Unix timestamps, timezones, and calculate date differences.',
    url: '/tools/datetime-converter',
  },
  keywords: ['Date Converter', 'Time Converter', 'Unix Timestamp', 'Timezone Converter', 'Date Calculator', 'Date Format', 'Time Format', 'Online Date Tool'],
}

export default function DateTimeConverterPage() {
  return (
    <>
      <ToolsMenu />
      <DateTimeConverter />
    </>
  )
}

