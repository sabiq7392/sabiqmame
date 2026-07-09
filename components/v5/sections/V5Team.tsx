'use client'

import { useEffect, useRef, useState } from 'react'

const team = [
  {
    id: 1,
    initials: 'SM',
    name: 'Sabiq Mame',
    role: 'Tech Lead — Nexiusai & BSMR',
    specialty: 'Full Stack · AI Systems · Distributed Architecture',
    bio: 'Generalist Software Engineer at PT. Quantum Teknologi Nusantara. Leading two products simultaneously — an AI accounting platform (Nexiusai) and a government certification system (BSMR). Owns the full stack from architecture to deployment.',
    accent: '#E5FF00',
    accentText: '#0A0A0A',
    tags: ['Python', 'RabbitMQ', 'Celery', 'LLM', 'Docker', 'Elasticsearch'],
    social: {
      github: 'https://github.com/sabiq7392',
      linkedin: 'https://www.linkedin.com/in/sabiq-muhammad-6b314a210/',
    },
    highlight: true,
    period: 'Jan 2025 – Present',
  },
  {
    id: 2,
    initials: 'FS',
    name: 'Full Stack Engineer',
    role: 'POLRI SuperApp & Patroli Perintis',
    specialty: 'Mobile · Web · Real-time Systems',
    bio: 'Built core features for Indonesia\'s national police public services app — SKCK, SIM, STNK, E-Tilang, eSurvey, and SP2HP. Also engineered the Patroli Perintis real-time patrol tracking system with Google Maps API and SOS response.',
    accent: '#FF2D55',
    accentText: '#FFFFFF',
    tags: ['Flutter', 'Firebase', 'Google Maps API', 'Elasticsearch', 'Dukcapil'],
    social: null,
    highlight: false,
    period: 'Jan 2022 – Oct 2025',
  },
  {
    id: 3,
    initials: 'GD',
    name: 'Instructor & Leader',
    role: 'GDSC STT Nurul Fikri',
    specialty: 'Frontend Lead · Bootcamp Mentor · Speaker',
    bio: 'Frontend Lead at Google Developer Student Club. Organized and managed the frontend team, led a 3-month bootcamp teaching frontend development, and spoke at the Frontend Intermediate Workshop on best practices.',
    accent: '#00D4FF',
    accentText: '#0A0A0A',
    tags: ['Frontend', 'Leadership', 'Teaching', 'JavaScript', 'Bootstrap'],
    social: null,
    highlight: false,
    period: 'Dec 2022 – Aug 2023',
  },
]

function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden cursor-pointer"
      style={{
        border: `2px solid ${hovered ? member.accent : 'rgba(255,255,255,0.08)'}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s, border-color 0.2s`,
        backgroundColor: hovered ? `${member.accent}10` : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent stripe */}
      <div
        className="h-1.5 w-full"
        style={{
          backgroundColor: member.accent,
          opacity: hovered ? 1 : 0.3,
          transition: 'opacity 0.2s',
        }}
      />

      <div className="p-8">
        {/* Avatar */}
        <div
          className="w-16 h-16 flex items-center justify-center text-xl font-black mb-6 border-2"
          style={{
            backgroundColor: hovered ? member.accent : 'rgba(255,255,255,0.05)',
            color: hovered ? member.accentText : member.accent,
            borderColor: member.accent,
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          {member.initials}
        </div>

        {/* Ghost number */}
        <div
          className="text-8xl font-black leading-none select-none mb-2"
          style={{
            color: hovered ? `${member.accent}20` : 'rgba(255,255,255,0.03)',
            transition: 'color 0.2s',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Name */}
        <h3
          className="text-xl font-black uppercase tracking-tight mb-1"
          style={{ color: hovered ? member.accent : '#FFFFFF', transition: 'color 0.2s' }}
        >
          {member.name}
        </h3>
        <div
          className="text-[10px] font-black uppercase tracking-widest mb-0.5"
          style={{ color: member.accent }}
        >
          {member.role}
        </div>
        <div
          className="text-[10px] font-bold uppercase tracking-wider mb-1"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-space)' }}
        >
          {member.specialty}
        </div>
        <div
          className="text-[10px] font-medium mb-5"
          style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-space)' }}
        >
          {member.period}
        </div>

        {/* Bio */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-space)' }}
        >
          {member.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border"
              style={{
                borderColor: hovered ? `${member.accent}60` : 'rgba(255,255,255,0.15)',
                color: hovered ? member.accent : 'rgba(255,255,255,0.45)',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Social */}
        {member.social && (
          <div className="flex gap-3">
            <a
              href={member.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-widest px-4 py-2.5 border-2 cursor-pointer"
              style={{
                borderColor: '#E5FF00',
                backgroundColor: hovered ? '#E5FF00' : 'transparent',
                color: hovered ? '#0A0A0A' : '#E5FF00',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              GitHub →
            </a>
            <a
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-widest px-4 py-2.5 border-2 cursor-pointer"
              style={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFFFFF'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              }}
            >
              LinkedIn →
            </a>
          </div>
        )}

        {/* GDSC Badge for main member */}
        {member.highlight && (
          <div
            className="mt-6 border-l-4 pl-4"
            style={{ borderColor: '#E5FF00' }}
          >
            <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: 'rgba(229,255,0,0.6)' }}>
              Also
            </div>
            <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-space)' }}>
              GDSC Instructor & Frontend Lead · 2022–2023
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function V5Team() {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="team"
      style={{ backgroundColor: '#0D0D0D', fontFamily: 'var(--font-archivo)', borderTop: '4px solid #1A1A1A', borderBottom: '4px solid #1A1A1A' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s, transform 0.7s',
          }}
        >
          <span
            className="text-[10px] font-black uppercase tracking-[0.35em] pb-1 inline-block"
            style={{ color: '#FF2D55', borderBottom: '2px solid #FF2D55' }}
          >
            Experience
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-3">
            <h2
              className="font-black uppercase leading-[0.88] tracking-tighter"
              style={{ fontSize: 'clamp(3rem,9vw,8rem)', color: '#FFFFFF' }}
            >
              ROLES &amp;<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '3px #E5FF00' }}>WORK</span>
            </h2>
            <p
              className="text-base font-medium max-w-xs pb-2 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-space)' }}
            >
              Real roles, real products, real impact. PT. Quantum Teknologi Nusantara · GDSC · STT Nurul Fikri.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* Tagline */}
        <div
          className="mt-8 p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-2"
          style={{ borderColor: 'rgba(229,255,0,0.2)', backgroundColor: 'rgba(229,255,0,0.04)' }}
        >
          <p
            className="font-black uppercase text-base tracking-tight"
            style={{ color: '#E5FF00' }}
          >
            4+ years · 10+ projects delivered · PT. Quantum Teknologi Nusantara
          </p>
          <button
            className="text-[10px] font-black uppercase tracking-widest px-6 py-3 cursor-pointer border-2"
            style={{
              backgroundColor: '#E5FF00',
              color: '#0A0A0A',
              borderColor: '#E5FF00',
              boxShadow: '4px 4px 0px #FF2D55',
              transition: 'transform 0.12s, box-shadow 0.12s',
            }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px,2px)'
              e.currentTarget.style.boxShadow = '2px 2px 0px #FF2D55'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0,0)'
              e.currentTarget.style.boxShadow = '4px 4px 0px #FF2D55'
            }}
          >
            Work with us →
          </button>
        </div>
      </div>
    </section>
  )
}
