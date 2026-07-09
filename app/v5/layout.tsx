import { Archivo, Space_Grotesk } from 'next/font/google'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export default function V5Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${archivo.variable} ${spaceGrotesk.variable}`}>
      {children}
    </div>
  )
}
