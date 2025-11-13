import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import ThemeWrapper from '@/components/ThemeWrapper'
import NextTopLoader from 'nextjs-toploader'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sabiq.pro'),
  title: {
    default: 'Sabiq Mame | Full-Stack Engineer',
    template: '%s | Sabiq Mame'
  },
  description: 'Full-Stack Engineer with expertise in website and backend development. Specializing in building efficient, scalable, and well-structured systems. Currently working at PT. Quantum Teknologi Nusantara.',
  keywords: ['Full-Stack Engineer', 'Web Developer', 'Backend Developer', 'Frontend Developer', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Portfolio'],
  authors: [{ name: 'Sabiq Mame' }],
  creator: 'Sabiq Mame',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Sabiq Mame',
    title: 'Sabiq Mame | Full-Stack Engineer',
    description: 'Full-Stack Engineer with expertise in website and backend development. Specializing in building efficient, scalable, and well-structured systems.',
    images: [
      {
        url: '/me/me.jpg',
        width: 1200,
        height: 630,
        alt: 'Sabiq Mame',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabiq Mame | Full-Stack Engineer',
    description: 'Full-Stack Engineer with expertise in website and backend development.',
    images: ['/me/me.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/me/logo.svg" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://sabiq.pro'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <NextTopLoader />
        <StyledComponentsRegistry>
          <ThemeWrapper>
            <div className="min-h-screen w-full relative pt-24">
              <Navbar />
              <main className="max-w-[1200px] mx-auto min-h-[calc(100vh-96px)] p-8 md:p-4">
                {children}
              </main>
            </div>
          </ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
