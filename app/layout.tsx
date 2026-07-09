import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import ThemeWrapper from '@/components/ThemeWrapper'
import NextTopLoader from 'nextjs-toploader'
import LayoutShell from '@/components/v1/LayoutShell'
import { Analytics } from '@vercel/analytics/next';
import { Config } from '@/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(Config.siteUrl),
  title: {
    default: `${Config.me.alias} | ${Config.work.title}`,
    template: `%s | ${Config.me.alias}`
  },
  description: Config.work.description,
  keywords: Config.keywords,
  authors: [{ name: Config.me.alias }],
  creator: Config.me.alias,
  openGraph: Config.openGraph,
  twitter: Config.twitter,
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
        <link rel="canonical" href={Config.siteUrl} />
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
              {children}
          </ThemeWrapper>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  )
}
