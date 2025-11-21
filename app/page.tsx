import type { Metadata } from 'next'
import HomeSection from '@/components/HomeSection'
import { Config } from '@/config'

export const metadata: Metadata = {
  title: `${Config.me.alias} | ${Config.work.title}`,
  description: Config.work.description,
  openGraph: Config.openGraph,
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: Config.me.alias,
    jobTitle: Config.work.title,
    description: Config.work.description,
    url: Config.siteUrl,
    sameAs: [
      `https://${Config.socialMedia.linkedin}`,
      `https://${Config.socialMedia.github}`,
    ],
    email: Config.socialMedia.email,
    knowsAbout: Config.keywords,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeSection />
    </>
  )
}
