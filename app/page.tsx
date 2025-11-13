import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import HomeSection from '@/components/HomeSection'

export const metadata: Metadata = {
  title: 'Sabiq Mame | Full-Stack Engineer',
  description: 'Full-Stack Engineer portfolio showcasing skills, experience, projects, and tools. Specializing in React, Next.js, TypeScript, and backend development.',
  openGraph: {
    title: 'Sabiq Mame | Full-Stack Engineer Portfolio',
    description: 'Full-Stack Engineer portfolio showcasing skills, experience, projects, and tools.',
    url: '/',
  },
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sabiq Mame',
    jobTitle: 'Full-Stack Engineer',
    description: 'Full-Stack Engineer with expertise in website and backend development. Specializing in building efficient, scalable, and well-structured systems.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sabiq.pro',
    sameAs: [
      'https://www.linkedin.com/in/sabiq-muhammad-6b314a210/',
      'https://github.com/sabiq7392',
    ],
    email: 'sabiqmuhammad98@gmail.com',
    knowsAbout: [
      'Full-Stack Development',
      'Web Development',
      'Backend Development',
      'Frontend Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
    ],
  }

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
