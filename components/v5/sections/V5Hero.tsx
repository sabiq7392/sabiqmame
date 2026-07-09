'use client'

import { useEffect, useRef, useState } from 'react'

const roles = [
  'GENERALIST ENGINEER',
  'TECH LEAD',
  'FULL STACK ENGINEER',
  'SYSTEM ARCHITECT',
  'MVP BUILDER',
]

const floatingWords = [
  { text: 'SHIP IT', x: '8%', y: '20%', rotate: '-6deg', size: '1.1rem', color: '#FF2D55', opacity: 0.85 },
  { text: '99.9%', x: '75%', y: '12%', rotate: '4deg', size: '1rem', color: '#E5FF00', opacity: 0.9 },
  { text: 'FAST', x: '82%', y: '70%', rotate: '-3deg', size: '1.2rem', color: '#FF2D55', opacity: 0.8 },
  { text: '→ PROD', x: '5%', y: '75%', rotate: '7deg', size: '1rem', color: '#E5FF00', opacity: 0.7 },
  { text: '✦ MVP', x: '60%', y: '85%', rotate: '-5deg', size: '0.9rem', color: '#FFFFFF', opacity: 0.6 },
]

export default function V5Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [roleVisible, setRoleVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const magnetRef = useRef<HTMLButtonElement>(null)

  // Entry animation
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Role cycling
  useEffect(() => {
    const id = setInterval(() => {
      setRoleVisible(false)
      setTimeout(() => {
        setRoleIdx((p) => (p + 1) % roles.length)
        setRoleVisible(true)
      }, 180)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  // Custom cursor + parallax
  useEffect(() => {
    const hero = heroRef.current
    const cursor = cursorRef.current
    if (!hero || !cursor) return

    const onMove = (e: MouseEvent) => {
      const { clientX: cx, clientY: cy } = e
      const { innerWidth: w, innerHeight: h } = window
      const xPct = (cx / w - 0.5) * 2
      const yPct = (cy / h - 0.5) * 2

      // Custom cursor
      cursor.style.left = cx + 'px'
      cursor.style.top = cy + 'px'

      // Parallax layers
      const bg = hero.querySelector<HTMLElement>('[data-v5="bg"]')
      const mid = hero.querySelector<HTMLElement>('[data-v5="mid"]')
      const fg = hero.querySelector<HTMLElement>('[data-v5="fg"]')
      if (bg) bg.style.transform = `translate(${xPct * -16}px, ${yPct * -10}px)`
      if (mid) mid.style.transform = `translate(${xPct * 10}px, ${yPct * 6}px)`
      if (fg) fg.style.transform = `translate(${xPct * 22}px, ${yPct * 14}px)`

      // Magnetic CTA
      const mag = magnetRef.current
      if (mag) {
        const rect = mag.getBoundingClientRect()
        const dx = cx - (rect.left + rect.width / 2)
        const dy = cy - (rect.top + rect.height / 2)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          mag.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`
        } else {
          mag.style.transform = 'translate(0, 0)'
        }
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const scrollToWork = () => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0A0A0A', fontFamily: 'var(--font-archivo)' }}
    >
      {/* Custom cursor blob */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[200] rounded-full mix-blend-difference hidden lg:block"
        style={{
          width: 48,
          height: 48,
          backgroundColor: '#E5FF00',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.06s linear, top 0.06s linear',
          willChange: 'left, top',
        }}
      />

      {/* Background layer — large geometric shapes */}
      <div
        data-v5="bg"
        className="absolute inset-0 pointer-events-none"
        style={{ transition: 'transform 0.18s ease-out' }}
      >
        {/* Giant decorative typography */}
        <div
          className="absolute select-none font-black leading-none hidden lg:block"
          style={{
            fontSize: 'clamp(8rem,18vw,22rem)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(229,255,0,0.08)',
            top: '-4%',
            right: '-4%',
            fontFamily: 'var(--font-archivo)',
            transform: 'rotate(3deg)',
          }}
        >
          SM
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(229,255,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229,255,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />

        {/* Colored blocks */}
        <div
          className="absolute hidden xl:block"
          style={{ width: 200, height: 200, backgroundColor: '#FF2D55', top: '15%', right: '8%', border: '4px solid #FF2D55', opacity: 0.15, transform: 'rotate(15deg)' }}
        />
        <div
          className="absolute hidden lg:block"
          style={{ width: 120, height: 120, border: '4px solid #E5FF00', bottom: '20%', left: '5%', opacity: 0.2, transform: 'rotate(-8deg)' }}
        />
      </div>

      {/* Mid layer — floating sticker words */}
      <div
        data-v5="mid"
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ transition: 'transform 0.25s ease-out' }}
      >
        {floatingWords.map((w, i) => (
          <div
            key={i}
            className="absolute font-black uppercase"
            style={{
              left: w.x,
              top: w.y,
              fontSize: w.size,
              color: w.color,
              opacity: w.opacity,
              transform: `rotate(${w.rotate})`,
              letterSpacing: '0.12em',
              border: `2px solid ${w.color}`,
              padding: '4px 10px',
              backgroundColor: 'rgba(10,10,10,0.7)',
              backdropFilter: 'blur(2px)',
            }}
          >
            {w.text}
          </div>
        ))}
      </div>

      {/* Foreground accent layer */}
      <div
        data-v5="fg"
        className="absolute inset-0 pointer-events-none"
        style={{ transition: 'transform 0.3s ease-out' }}
      >
        <div
          className="absolute hidden lg:block"
          style={{
            width: 8,
            bottom: '30%',
            top: '20%',
            right: '22%',
            backgroundColor: '#E5FF00',
            opacity: 0.2,
          }}
        />
      </div>

      {/* Main content */}
      <div
        className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 pt-28 pb-20"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
        }}
      >
        {/* Status badge */}
        <div
          className="inline-flex items-center gap-3 mb-10 w-fit"
          style={{
            border: '2px solid #E5FF00',
            backgroundColor: 'rgba(229,255,0,0.08)',
            padding: '6px 16px',
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: '#00FF87', boxShadow: '0 0 8px #00FF87', animation: 'pulse 2s ease-in-out infinite' }}
          />
          <span className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: '#E5FF00' }}>
            Building scalable systems &amp; elegant interfaces
          </span>
        </div>

        {/* Hero name — super large */}
        <div className="mb-4 overflow-hidden">
          <h1
            className="font-black uppercase leading-[0.85] tracking-tighter"
            style={{
              fontSize: 'clamp(4rem,14vw,13rem)',
              color: '#FFFFFF',
              transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
              display: 'block',
            }}
          >
            SABIQ
          </h1>
        </div>
        <div className="mb-10 overflow-hidden">
          <h1
            className="font-black uppercase leading-[0.85] tracking-tighter"
            style={{
              fontSize: 'clamp(4rem,14vw,13rem)',
              color: 'transparent',
              WebkitTextStroke: '3px #E5FF00',
              transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              display: 'block',
            }}
          >
            MAME
          </h1>
        </div>

        {/* Animated role tag */}
        <div className="flex items-center gap-5 mb-8">
          <div style={{ width: 48, height: 3, backgroundColor: '#FF2D55', flexShrink: 0 }} />
          <span
            className="font-black uppercase"
            style={{
              fontSize: 'clamp(0.9rem,2.5vw,1.5rem)',
              color: '#E5FF00',
              letterSpacing: '0.18em',
              opacity: roleVisible ? 1 : 0,
              transform: roleVisible ? 'translateY(0) skewX(0deg)' : 'translateY(-10px) skewX(-4deg)',
              transition: 'opacity 0.18s, transform 0.18s',
            }}
          >
            {roles[roleIdx]}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-base md:text-xl font-medium leading-relaxed max-w-2xl mb-14"
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'var(--font-space)',
            borderLeft: '3px solid #FF2D55',
            paddingLeft: 20,
          }}
        >
          Generalist Software Engineer with a strong track record of delivering MVPs, applications,
          and business-critical features under aggressive timelines. Comfortable working across
          different technologies, quickly adapting to new challenges, and taking ownership from
          idea to production. I thrive in fast-moving teams where execution, flexibility, and
          problem-solving are key.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-5 mb-20">
          <button
            onClick={scrollToWork}
            className="relative px-9 py-5 text-sm font-black uppercase tracking-widest cursor-pointer"
            style={{
              backgroundColor: '#E5FF00',
              color: '#0A0A0A',
              border: '3px solid #E5FF00',
              boxShadow: '6px 6px 0px #FF2D55',
              transition: 'transform 0.12s, box-shadow 0.12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(3px,3px)'
              e.currentTarget.style.boxShadow = '3px 3px 0px #FF2D55'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0,0)'
              e.currentTarget.style.boxShadow = '6px 6px 0px #FF2D55'
            }}
          >
            View Case Studies ↓
          </button>

          <button
            ref={magnetRef}
            onClick={scrollToContact}
            className="px-9 py-5 text-sm font-black uppercase tracking-widest cursor-pointer"
            style={{
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: '6px 6px 0px rgba(229,255,0,0.3)',
              transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF'
              e.currentTarget.style.color = '#0A0A0A'
              e.currentTarget.style.borderColor = '#FFFFFF'
              e.currentTarget.style.boxShadow = '3px 3px 0px #E5FF00'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#FFFFFF'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.boxShadow = '6px 6px 0px rgba(229,255,0,0.3)'
            }}
          >
            Let&apos;s Build →
          </button>
        </div>

        {/* Stats — brutalist grid */}
        <div
          className="grid grid-cols-3 border-2 max-w-xl"
          style={{ borderColor: 'rgba(229,255,0,0.3)' }}
        >
          {[
            { num: '4+', label: 'Years Experience', accent: '#E5FF00' },
            { num: '10+', label: 'Projects Delivered', accent: '#FF2D55' },
            { num: '20+', label: 'Technologies', accent: '#E5FF00' },
          ].map((stat, i) => (
            <div
              key={i}
              className="py-6 text-center"
              style={{
                borderRight: i < 2 ? '2px solid rgba(229,255,0,0.3)' : 'none',
                backgroundColor: i === 1 ? 'rgba(255,45,85,0.1)' : 'transparent',
              }}
            >
              <div
                className="text-3xl md:text-4xl font-black leading-none"
                style={{ color: stat.accent }}
              >
                {stat.num}
              </div>
              <div
                className="text-xs font-bold uppercase tracking-wider mt-2"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(229,255,0,0.6)' }}>
          Scroll
        </span>
        <div
          className="w-px h-12"
          style={{ background: 'linear-gradient(to bottom, #E5FF00, transparent)' }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </section>
  )
}
