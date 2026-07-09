import type { Metadata } from 'next'
import HomeSection from '@/components/v1/HomeSection'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: `${Config.me.alias} | ${Config.work.title}`,
  description: Config.work.description,
  openGraph: Config.openGraph,
}

export default function V1Page() {
  return <HomeSection />
}
