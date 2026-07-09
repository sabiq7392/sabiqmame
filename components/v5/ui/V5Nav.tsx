'use client'

import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export default function V5Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          backgroundColor: scrolled ? '#0A0A0A' : 'transparent',
          borderBottom: scrolled ? '3px solid #E5FF00' : 'none',
          fontFamily: 'var(--font-archivo)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-base font-black uppercase tracking-[0.15em] cursor-pointer"
            style={{ color: '#E5FF00', letterSpacing: '0.12em' }}
          >
            SABIQ<span style={{ color: '#FF2D55' }}>.</span>MAME
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-xs font-black uppercase tracking-widest cursor-pointer transition-colors duration-150"
                style={{ color: '#FFFFFF' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E5FF00' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF' }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#contact')}
              className="text-xs font-black uppercase tracking-widest px-5 py-2.5 border-2 cursor-pointer"
              style={{
                backgroundColor: '#E5FF00',
                color: '#0A0A0A',
                borderColor: '#E5FF00',
                boxShadow: '3px 3px 0px #FF2D55',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(2px,2px)'
                e.currentTarget.style.boxShadow = '1px 1px 0px #FF2D55'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0,0)'
                e.currentTarget.style.boxShadow = '3px 3px 0px #FF2D55'
              }}
            >
              Hire Me →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-0.5 transition-all duration-200"
              style={{
                backgroundColor: '#E5FF00',
                transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-200"
              style={{
                backgroundColor: '#E5FF00',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-200"
              style={{
                backgroundColor: '#E5FF00',
                transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center items-center md:hidden transition-all duration-300"
        style={{
          backgroundColor: '#0A0A0A',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        <div className="flex flex-col gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-4xl font-black uppercase tracking-tighter cursor-pointer"
              style={{ color: '#E5FF00' }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
