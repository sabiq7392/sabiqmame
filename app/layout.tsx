import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import ThemeWrapper from '@/components/ThemeWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sabiq Muhammad Antebing Mame | Full-Stack Developer',
  description: 'Full-Stack Developer with expertise in website and backend development. Specializing in building efficient, scalable, and well-structured systems. Currently working at PT. Quantum Teknologi Nusantara.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
