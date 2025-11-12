import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import JSONDiff from '@/components/tools/JSONDiff'

export const metadata: Metadata = {
  title: 'JSON Diff',
  description: 'Free online JSON diff tool. Compare two JSON objects and see the differences highlighted. Perfect for debugging and code review. No registration required.',
  openGraph: {
    title: 'JSON Diff Tool | Compare JSON Objects Online | Sabiq Mame',
    description: 'Free online JSON diff tool. Compare two JSON objects and see the differences highlighted.',
    url: '/tools/json-diff',
  },
  keywords: ['JSON Diff', 'JSON Compare', 'JSON Difference', 'JSON Tool', 'Compare JSON', 'JSON Validator', 'Online JSON Tool'],
}

export default function JSONDiffPage() {
  return (
    <main className="min-h-screen w-full relative pt-24">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-96px)] p-8 md:p-4">
        <JSONDiff />
      </div>
    </main>
  )
}

