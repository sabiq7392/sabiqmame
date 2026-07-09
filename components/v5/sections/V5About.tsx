'use client'

import { useEffect, useRef, useState } from 'react'

const skillGroups = [
  {
    label: 'Front-End',
    color: '#E5FF00',
    techs: ['TypeScript', 'JavaScript', 'Dart', 'NextJS', 'ReactJS', 'VueJS', 'Flutter', 'Figma'],
  },
  {
    label: 'Back-End',
    color: '#FF2D55',
    techs: ['Node.js', 'ExpressJS', 'NestJS', 'Python', 'Flask', 'REST API', 'GraphQL'],
  },
  {
    label: 'Database & DevOps',
    color: '#00D4FF',
    techs: ['MySQL', 'PostgreSQL', 'MongoDB', 'Elasticsearch', 'Docker', 'AWS', 'GitHub', 'Rancher'],
  },
  {
    label: 'Systems & Tools',
    color: '#FF8C00',
    techs: ['RabbitMQ', 'Celery', 'LLM / OCR', 'SSE', 'WebSockets', 'Cron Jobs', 'Linux', 'Figma'],
  },
]

const pillars = [
  { title: 'Generalist', sub: 'Comfortable across all tech stacks' },
  { title: 'Fast', sub: 'Ship MVPs in weeks' },
  { title: 'Reliable', sub: 'Production-grade quality, always' },
  { title: 'Owner', sub: 'Full responsibility, end-to-end' },
]


export default function V5About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ backgroundColor: '#111111', fontFamily: 'var(--font-archivo)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div
          className="grid lg:grid-cols-2 gap-0 border-2"
          style={{ borderColor: 'rgba(229,255,0,0.2)' }}
        >
          {/* ─── Left: Identity ─── */}
          <div
            className="p-10 md:p-16"
            style={{ borderRight: '2px solid rgba(229,255,0,0.2)' }}
          >
            <span
              className="text-[10px] font-black uppercase tracking-[0.35em] pb-1 inline-block"
              style={{ color: '#FF2D55', borderBottom: '2px solid #FF2D55' }}
            >
              About Me
            </span>

            <h2
              className="font-black uppercase leading-[0.88] tracking-tighter mt-4 mb-8"
              style={{
                fontSize: 'clamp(2.5rem,6vw,5rem)',
                color: '#E5FF00',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-24px)',
                transition: 'opacity 0.7s, transform 0.7s',
              }}
            >
              WHO<br />AM I?
            </h2>

            <div
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-space)' }}
            >
              <p className="mb-4">
                I&apos;m a{' '}
                <span className="font-black" style={{ color: '#E5FF00' }}>Generalist Software Engineer</span>{' '}
                with a strong track record of delivering MVPs, applications, and
                business-critical features under aggressive timelines.
              </p>
              <p className="mb-4">
                Currently at{' '}
                <span className="font-black" style={{ color: '#FF2D55' }}>PT. Quantum Teknologi Nusantara</span>{' '}
                as Tech Lead on Nexiusai and BSMR — architecting, building, and delivering
                full-stack solutions that matter.
              </p>
              <p>
                Comfortable working across different technologies, quickly adapting to new challenges,
                and taking{' '}
                <span className="font-black" style={{ color: '#E5FF00' }}>ownership from idea to production</span>.
                I thrive in fast-moving teams where execution, flexibility, and problem-solving are key.
              </p>
            </div>

            {/* Education */}
            <div
              className="border-l-4 pl-6 mb-10"
              style={{ borderColor: '#E5FF00' }}
            >
              <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#E5FF00' }}>
                Education
              </div>
              <div className="text-base font-black text-white">Bachelor of Computer Science</div>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space)' }}>
                Sekolah Tinggi Teknologi Terpadu Nurul Fikri · Jakarta · Sept 2020 – Sept 2024
              </div>
            </div>

            {/* 4 pillars */}
            <div className="grid grid-cols-2 gap-0 border-2" style={{ borderColor: 'rgba(229,255,0,0.2)' }}>
              {pillars.map((p, i) => (
                <div
                  key={p.title}
                  className="p-5"
                  style={{
                    borderRight: i % 2 === 0 ? '2px solid rgba(229,255,0,0.2)' : 'none',
                    borderBottom: i < 2 ? '2px solid rgba(229,255,0,0.2)' : 'none',
                  }}
                >
                  <div className="text-sm font-black uppercase tracking-wider mb-1" style={{ color: '#E5FF00' }}>
                    {p.title}
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-space)' }}>
                    {p.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right: Skills ─── */}
          <div className="p-10 md:p-16">
            <span
              className="text-[10px] font-black uppercase tracking-[0.35em] pb-1 inline-block"
              style={{ color: '#FF2D55', borderBottom: '2px solid #FF2D55' }}
            >
              Tech Arsenal
            </span>

            <h3
              className="font-black uppercase leading-[0.88] tracking-tighter mt-4 mb-10"
              style={{
                fontSize: 'clamp(2rem,4vw,3.5rem)',
                color: '#E5FF00',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(24px)',
                transition: 'opacity 0.7s 0.1s, transform 0.7s 0.1s',
              }}
            >
              TECH<br />STACK
            </h3>

            <div className="space-y-7">
              {skillGroups.map((group, gi) => (
                <div
                  key={group.label}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.5s ease-out ${gi * 0.1 + 0.15}s, transform 0.5s ease-out ${gi * 0.1 + 0.15}s`,
                  }}
                >
                  {/* Group label */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="block w-2.5 h-2.5 flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.25em]"
                      style={{ color: group.color }}
                    >
                      {group.label}
                    </span>
                  </div>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-2">
                    {group.techs.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-black uppercase tracking-wider px-3 py-1.5 border cursor-default"
                        style={{
                          borderColor: `${group.color}35`,
                          color: 'rgba(255,255,255,0.65)',
                          backgroundColor: `${group.color}08`,
                          transition: 'border-color 0.15s, color 0.15s, background-color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = group.color
                          e.currentTarget.style.color = group.color
                          e.currentTarget.style.backgroundColor = `${group.color}18`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `${group.color}35`
                          e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                          e.currentTarget.style.backgroundColor = `${group.color}08`
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
