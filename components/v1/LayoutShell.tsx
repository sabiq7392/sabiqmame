'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isV2 = pathname.startsWith('/v2')
  const isV3 = pathname.startsWith('/v3')
  const isFullscreen = isV2 || isV3

  if (isV3) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen w-full relative pt-24">
      <Navbar />
      {isFullscreen ? (
        <main className="w-full min-h-[calc(100vh-96px)]">
          {children}
        </main>
      ) : (
        <main className="max-w-[1500px] mx-auto min-h-[calc(100vh-96px)] p-8 md:p-4">
          {children}
        </main>
      )}
    </div>
  )
}
