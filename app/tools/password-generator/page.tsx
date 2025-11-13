import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import PasswordGenerator from '@/components/tools/PasswordGenerator'
import ToolsMenu from '@/components/tools/ToolsMenu'

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Free online password generator. Create strong, secure, and random passwords with customizable options. Choose length, character types, and generate passwords instantly. No registration required.',
  openGraph: {
    title: 'Password Generator | Secure Random Password Creator | Sabiq Mame',
    description: 'Free online password generator. Create strong, secure, and random passwords with customizable options.',
    url: '/tools/password-generator',
  },
  keywords: ['Password Generator', 'Random Password', 'Secure Password', 'Password Creator', 'Strong Password', 'Password Tool', 'Online Password Generator'],
}

export default function PasswordGeneratorPage() {
  return (
    <>
      <ToolsMenu />
      <PasswordGenerator />
    </>
  )
}

