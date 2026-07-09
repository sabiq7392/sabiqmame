'use client'

import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

// Initialize EmailJS on mount
if (typeof window !== 'undefined') {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!)
}

type FormState = {
  name: string
  email: string
  budget: string
  project: string
  message: string
}

const budgets = [
  'Under $5k',
  '$5k – $15k',
  '$15k – $50k',
  '$50k+',
  "Let's discuss",
]

const projectTypes = [
  'MVP Build',
  'Full Stack App',
  'System Architecture',
  'Backend APIs',
  'Mobile App',
  'Other',
]

function FloatingLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(229,255,0,0.7)' }}>
      {children}
    </label>
  )
}

export default function V5Contact() {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<FormState>({ name: '', email: '', budget: '', project: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  const validate = (): boolean => {
    const errs: Partial<FormState> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.message.trim()) errs.message = 'Tell me about your project'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    try {
      // Send email using EmailJS
      const SERVICE_ID = 'service_ukrobmv'
      const TEMPLATE_ID = 'template_k2iijvf'
      
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: 'sabiqmuhammad98@gmail.com',
          from_name: form.name,
          from_email: form.email,
          project_type: form.project || 'Not specified',
          budget: form.budget || 'Not specified',
          message: form.message,
          reply_to: form.email,
        }
      )

      setSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({
        message: 'Something went wrong. Please try again or email directly.',
      })
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
    if (field === 'message') setCharCount(value.length)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    borderBottom: '2px solid rgba(229,255,0,0.3)',
    color: '#FFFFFF',
    outline: 'none',
    paddingBottom: 8,
    fontSize: '1.125rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    fontFamily: 'var(--font-archivo)',
    transition: 'border-color 0.2s',
  }

  return (
    <section
      id="contact"
      style={{ backgroundColor: '#0A0A0A', fontFamily: 'var(--font-archivo)' }}
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
            Get in Touch
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-3">
            <h2
              className="font-black uppercase leading-[0.88] tracking-tighter"
              style={{ fontSize: 'clamp(3rem,9vw,8rem)', color: '#FFFFFF' }}
            >
              LET&apos;S<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '3px #E5FF00' }}>BUILD.</span>
            </h2>
            <div className="lg:max-w-sm pb-2">
              <p
                className="text-base leading-relaxed font-medium mb-6"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space)' }}
              >
                Have a project? Need an engineer who actually ships? Drop a message — I respond within 24 hours. No agencies, no middlemen.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'sabiqmuhammad98@gmail.com', href: 'mailto:sabiqmuhammad98@gmail.com' },
                  { label: 'github.com/sabiq7392', href: 'https://github.com/sabiq7392' },
                  { label: 'LinkedIn Profile', href: 'https://www.linkedin.com/in/sabiq-muhammad-6b314a210/' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xs font-black uppercase tracking-wider w-fit"
                    style={{ color: '#E5FF00', borderBottom: '2px solid rgba(229,255,0,0.3)', paddingBottom: 2 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E5FF00' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(229,255,0,0.3)' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form container — only render interactive content after client mount to avoid hydration mismatch */}
        <div
          className="border-2"
          style={{ borderColor: 'rgba(229,255,0,0.2)', backgroundColor: 'rgba(229,255,0,0.02)' }}
        >
          {!mounted ? (
            <div className="p-8 min-h-[400px]" aria-hidden />
          ) : submitted ? (
            <div className="py-24 text-center px-6">
              {/* Checkmark */}
              <div
                className="text-[8rem] font-black leading-none mb-6 select-none"
                style={{ color: '#E5FF00' }}
              >
                ✓
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-3" style={{ color: '#FFFFFF' }}>
                Message Received.
              </h3>
              <p
                className="text-base max-w-sm mx-auto mb-8"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space)' }}
              >
                Got it. I&apos;ll review your project and get back within 24 hours — no fluff, just a real conversation.
              </p>
              <button
                className="px-8 py-4 text-sm font-black uppercase tracking-widest border-2 cursor-pointer"
                style={{
                  backgroundColor: '#E5FF00',
                  color: '#0A0A0A',
                  borderColor: '#E5FF00',
                  boxShadow: '5px 5px 0px #FF2D55',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                }}
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', budget: '', project: '', message: '' }) }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #FF2D55' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '5px 5px 0px #FF2D55' }}
              >
                Send Another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Row 1: Name + Email */}
              <div
                className="grid md:grid-cols-2 border-b-2"
                style={{ borderColor: 'rgba(229,255,0,0.1)' }}
              >
                <div
                  className="p-8 border-b-2 md:border-b-0 md:border-r-2"
                  style={{ borderColor: 'rgba(229,255,0,0.1)' }}
                >
                  <FloatingLabel htmlFor="v5-name">01 — Your Name *</FloatingLabel>
                  <input
                    id="v5-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="John Doe"
                    aria-label="Your name"
                    suppressHydrationWarning
                    style={{
                      ...inputStyle,
                      borderColor: errors.name ? '#FF2D55' : form.name ? '#E5FF00' : 'rgba(229,255,0,0.3)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#E5FF00' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.name ? '#FF2D55' : form.name ? '#E5FF00' : 'rgba(229,255,0,0.3)' }}
                  />
                  {errors.name && <p className="mt-2 text-[10px] font-black uppercase tracking-wider" style={{ color: '#FF2D55' }}>{errors.name}</p>}
                </div>
                <div className="p-8">
                  <FloatingLabel htmlFor="v5-email">02 — Email Address *</FloatingLabel>
                  <input
                    id="v5-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="you@company.com"
                    aria-label="Email address"
                    suppressHydrationWarning
                    style={{
                      ...inputStyle,
                      borderColor: errors.email ? '#FF2D55' : form.email ? '#E5FF00' : 'rgba(229,255,0,0.3)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#E5FF00' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.email ? '#FF2D55' : form.email ? '#E5FF00' : 'rgba(229,255,0,0.3)' }}
                  />
                  {errors.email && <p className="mt-2 text-[10px] font-black uppercase tracking-wider" style={{ color: '#FF2D55' }}>{errors.email}</p>}
                </div>
              </div>

              {/* Row 2: Project Type */}
              <div
                className="p-8 border-b-2"
                style={{ borderColor: 'rgba(229,255,0,0.1)' }}
              >
                <FloatingLabel>03 — Project Type</FloatingLabel>
                <div className="flex flex-wrap gap-3">
                  {projectTypes.map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => set('project', pt)}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border cursor-pointer"
                      style={{
                        borderColor: form.project === pt ? '#E5FF00' : 'rgba(255,255,255,0.15)',
                        color: form.project === pt ? '#0A0A0A' : 'rgba(255,255,255,0.45)',
                        backgroundColor: form.project === pt ? '#E5FF00' : 'transparent',
                        boxShadow: form.project === pt ? '3px 3px 0px #FF2D55' : 'none',
                        transition: 'all 0.12s',
                      }}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Budget */}
              <div
                className="p-8 border-b-2"
                style={{ borderColor: 'rgba(229,255,0,0.1)' }}
              >
                <FloatingLabel>04 — Project Budget</FloatingLabel>
                <div className="flex flex-wrap gap-3">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => set('budget', b)}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border cursor-pointer"
                      style={{
                        borderColor: form.budget === b ? '#FF2D55' : 'rgba(255,255,255,0.15)',
                        color: form.budget === b ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                        backgroundColor: form.budget === b ? '#FF2D55' : 'transparent',
                        boxShadow: form.budget === b ? '3px 3px 0px #E5FF00' : 'none',
                        transition: 'all 0.12s',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Message */}
              <div
                className="p-8 border-b-2"
                style={{ borderColor: 'rgba(229,255,0,0.1)' }}
              >
                <div className="flex justify-between items-center mb-3">
                  <FloatingLabel htmlFor="v5-message">05 — Tell Me About Your Project *</FloatingLabel>
                  <span className="text-[10px] font-black" style={{ color: 'rgba(229,255,0,0.4)' }}>
                    {charCount}
                  </span>
                </div>
                <textarea
                  id="v5-message"
                  name="message"
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  placeholder="What are you building? What problems need solving? When do you need it done?"
                  rows={5}
                  aria-label="Project description"
                  className="w-full bg-transparent text-base outline-none resize-none leading-relaxed"
                  style={{
                    color: '#FFFFFF',
                    borderBottom: `2px solid ${errors.message ? '#FF2D55' : form.message ? '#E5FF00' : 'rgba(229,255,0,0.3)'}`,
                    paddingBottom: 8,
                    fontFamily: 'var(--font-space)',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#E5FF00' }}
                  onBlur={(e) => { e.target.style.borderColor = errors.message ? '#FF2D55' : form.message ? '#E5FF00' : 'rgba(229,255,0,0.3)' }}
                />
                {errors.message && <p className="mt-2 text-[10px] font-black uppercase tracking-wider" style={{ color: '#FF2D55' }}>{errors.message}</p>}
              </div>

              {/* Submit row */}
              <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-space)', maxWidth: 280 }}>
                  No spam. No sales calls. Just a direct conversation about your project.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-5 text-sm font-black uppercase tracking-widest border-2 cursor-pointer"
                  style={{
                    backgroundColor: loading ? '#333' : '#E5FF00',
                    color: loading ? 'rgba(255,255,255,0.5)' : '#0A0A0A',
                    borderColor: loading ? '#333' : '#E5FF00',
                    boxShadow: loading ? 'none' : '6px 6px 0px #FF2D55',
                    transition: 'transform 0.12s, box-shadow 0.12s, background-color 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translate(3px,3px)'
                      e.currentTarget.style.boxShadow = '3px 3px 0px #FF2D55'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translate(0,0)'
                      e.currentTarget.style.boxShadow = '6px 6px 0px #FF2D55'
                    }
                  }}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 border-2 border-current rounded-full"
                        style={{ borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }}
                      />
                      Sending...
                    </span>
                  ) : 'Send Message →'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div
          className="mt-10 pt-10 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '2px solid rgba(229,255,0,0.15)' }}
        >
          <div className="text-xl font-black uppercase tracking-tighter" style={{ color: '#FFFFFF' }}>
            SABIQ<span style={{ color: '#FF2D55' }}>.</span>
            <span style={{ color: '#E5FF00' }}>MAME</span>
          </div>
          <div
            className="text-[10px] font-medium uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-space)' }}
          >
            © 2026 — Sabiq Muhammad Antebing Mame
          </div>
          <div className="flex gap-8">
            {[
              { label: 'GitHub', href: 'https://github.com/sabiq7392' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sabiq-muhammad-6b314a210/' },
              { label: 'Email', href: 'mailto:sabiqmuhammad98@gmail.com' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E5FF00' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  )
}
