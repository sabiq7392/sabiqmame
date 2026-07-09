'use client'

import { useEffect, useRef, useState } from 'react'

const cases = [
  {
    id: '01',
    title: 'Nexiusai',
    subtitle: 'AI Assistant Accounting Platform',
    category: 'Tech Lead · Full Stack',
    tags: ['LLM', 'RabbitMQ', 'Celery', 'Python', 'OCR', 'Midtrans', 'SSE'],
    description:
      'AI-based assistant accounting platform that creates financial reports (Balance Sheet, P&L, Cash Flow) from bank statements or Excel transaction data using OCR document validation, RabbitMQ/Celery async orchestration, and LLM-driven transaction classification mapped to Chart of Accounts.',
    outcome: 'End-to-end automation',
    outcomeDetail: 'OCR → LLM → Report in minutes',
    accent: '#E5FF00',
    accentText: '#0A0A0A',
    year: 'Jan 2025 – Present',
    company: 'PT. Quantum Teknologi Nusantara',
  },
  {
    id: '02',
    title: 'BSMR',
    subtitle: 'Badan Sertifikasi Manajemen Risiko',
    category: 'Tech Lead · Full Stack',
    tags: ['Docker', 'Elasticsearch', 'MySQL', 'PDF Generation', 'Payment Integration'],
    description:
      'Web-based certification system for training providers, streamlining application, payment, and certification issuance processes. Features automated PDF certificate generation, centralized Elasticsearch logging, Docker-based deployment, and data export to PDF & XLSX.',
    outcome: 'Fully automated pipeline',
    outcomeDetail: 'Application → Payment → Certificate',
    accent: '#FF2D55',
    accentText: '#FFFFFF',
    year: 'Oct 2024 – Present',
    company: 'PT. Quantum Teknologi Nusantara',
  },
  {
    id: '03',
    title: 'POLRI SuperApp',
    subtitle: 'Presisi — Police Public Services',
    category: 'Full Stack Engineer',
    tags: ['Flutter', 'Dynamic Forms', 'BPJS Integration', 'Firebase', 'Elasticsearch'],
    description:
      "Comprehensive mobile application for Indonesian National Police public services: SKCK, SIM, STNK, DUMAS, eSurvey, E-Tilang, and SP2HP. Built a drag-and-drop form builder, BPJS/Dukcapil identity verification, real-time helpdesk chat, Elasticsearch logging, and Firebase push notifications.",
    outcome: 'App Store & Play Store',
    outcomeDetail: 'Live for millions of citizens',
    accent: '#00D4FF',
    accentText: '#0A0A0A',
    year: 'Jan 2023 – Oct 2025',
    company: 'PT. Quantum Teknologi Nusantara',
  },
  {
    id: '04',
    title: 'Patroli Perintis',
    subtitle: 'Police Patrol Tracking System',
    category: 'Full Stack Engineer',
    tags: ['Google Maps API', 'Real-time Tracking', 'SOS Feature'],
    description:
      'Web-based monitoring system for police patrol tracking. Enables officers to monitor outgoing patrols, assign routes and coordinates via Google Maps API, track special operations, and use an SOS feature that connects citizens with the nearest available officer in real time.',
    outcome: 'Real-time operations',
    outcomeDetail: 'Live GPS tracking at scale',
    accent: '#FF8C00',
    accentText: '#0A0A0A',
    year: 'Jan 2022 – Dec 2022',
    company: 'PT. Quantum Teknologi Nusantara',
  },
  {
    id: '05',
    title: 'Kenangan App',
    subtitle: 'E-Commerce Gift Platform',
    category: 'Full Stack Engineer',
    tags: ['E-Commerce', 'Drag & Drop Editor', 'Video Creation', 'Admin Dashboard'],
    description:
      'Unique e-commerce platform enabling gift-giving without requiring the recipient\'s address. Features a drag-and-drop homepage/shop editor, celebration video creator for weddings and birthdays, wishlist, merchant dashboard, product catalog, and a user-to-user blocking system.',
    outcome: 'App Store & Play Store',
    outcomeDetail: 'Live on both platforms',
    accent: '#A855F7',
    accentText: '#FFFFFF',
    year: 'Jan 2022 – Present',
    company: 'PT. Quantum Teknologi Nusantara',
  },
]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}

function CaseRow({ c, index }: { c: typeof cases[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className="relative border-b-4 group cursor-pointer overflow-hidden"
      style={{
        borderColor: '#1A1A1A',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover color fill */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: c.accent,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      <div
        className="relative max-w-7xl mx-auto px-6 py-10 md:py-14"
        style={{ zIndex: 1 }}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
          {/* ID */}
          <span
            className="text-7xl md:text-9xl font-black leading-none flex-shrink-0 select-none"
            style={{
              color: hovered ? `${c.accentText}18` : 'rgba(229,255,0,0.06)',
              transition: 'color 0.3s',
              fontFamily: 'var(--font-archivo)',
            }}
          >
            {c.id}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2"
                    style={{
                      borderColor: hovered ? c.accentText : '#E5FF00',
                      color: hovered ? c.accentText : '#E5FF00',
                      backgroundColor: 'transparent',
                    }}
                  >
                    {c.category}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: hovered ? c.accentText : 'rgba(255,255,255,0.4)' }}
                  >
                    {c.year}
                  </span>
                </div>
                <h3
                  className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none"
                  style={{ color: hovered ? c.accentText : '#FFFFFF' }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-sm font-bold uppercase tracking-wider mt-1"
                  style={{ color: hovered ? `${c.accentText}99` : 'rgba(255,255,255,0.4)' }}
                >
                  {c.subtitle}
                </p>
              </div>

              {/* Outcome badge */}
              <div
                className="hidden md:block border-2 px-5 py-4 flex-shrink-0"
                style={{
                  borderColor: hovered ? c.accentText : '#E5FF00',
                  minWidth: 160,
                }}
              >
                <div
                  className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: hovered ? `${c.accentText}80` : 'rgba(229,255,0,0.6)' }}
                >
                  Outcome
                </div>
                <div
                  className="text-base font-black uppercase leading-tight"
                  style={{ color: hovered ? c.accentText : '#E5FF00' }}
                >
                  {c.outcome}
                </div>
                <div
                  className="text-[10px] font-medium mt-1"
                  style={{ color: hovered ? `${c.accentText}70` : 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-space)' }}
                >
                  {c.outcomeDetail}
                </div>
              </div>
            </div>

            <p
              className="text-sm md:text-base leading-relaxed mb-5 max-w-3xl"
              style={{
                color: hovered ? `${c.accentText}cc` : 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-space)',
              }}
            >
              {c.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border"
                  style={{
                    borderColor: hovered ? `${c.accentText}60` : 'rgba(255,255,255,0.15)',
                    color: hovered ? `${c.accentText}cc` : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div
            className="hidden md:flex items-center self-center text-4xl font-black flex-shrink-0"
            style={{
              color: hovered ? c.accentText : 'rgba(229,255,0,0.3)',
              transform: hovered ? 'translateX(12px) rotate(-45deg)' : 'translateX(0) rotate(0deg)',
              transition: 'transform 0.25s, color 0.25s',
            }}
          >
            →
          </div>
        </div>
      </div>
    </div>
  )
}

export default function V5Cases() {
  const { ref: headerRef, visible: headerVisible } = useReveal()

  return (
    <section
      id="work"
      style={{ backgroundColor: '#0A0A0A', fontFamily: 'var(--font-archivo)' }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto px-6 pt-24 pb-12"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s, transform 0.7s',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span
              className="text-[10px] font-black uppercase tracking-[0.35em] pb-1 inline-block"
              style={{ color: '#FF2D55', borderBottom: '2px solid #FF2D55' }}
            >
              Selected Work
            </span>
            <h2
              className="font-black uppercase leading-[0.88] tracking-tighter mt-4"
              style={{ fontSize: 'clamp(3rem,9vw,8rem)', color: '#FFFFFF' }}
            >
              CASE<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '3px #E5FF00' }}>STUDIES</span>
            </h2>
          </div>
          <div className="md:max-w-sm pb-2">
            <p
              className="text-base leading-relaxed font-medium"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space)' }}
            >
              Real problems solved at production scale.
              Each case is a story of tight deadlines, hard decisions, and shipped results.
            </p>
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{ borderTop: '4px solid #1A1A1A' }}>
        {cases.map((c, i) => (
          <CaseRow key={c.id} c={c} index={i} />
        ))}
      </div>
    </section>
  )
}
