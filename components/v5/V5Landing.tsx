'use client'

import V5Nav from './ui/V5Nav'
import MarqueeReel from './ui/MarqueeReel'
import V5Hero from './sections/V5Hero'
import V5Cases from './sections/V5Cases'
import V5About from './sections/V5About'
import V5Team from './sections/V5Team'
import V5Contact from './sections/V5Contact'

const reel1 = [
  'Full Stack Engineering',
  'System Architecture',
  'Tech Lead',
  'LLM Integration',
  'Distributed Systems',
  'React & Next.js',
  'Python & Flask',
  'Flutter & Dart',
  'Event-Driven Architecture',
  'API Design',
]

const reel2 = [
  'Execution Over Perfection.',
  'Idea to Production.',
  'Generalist by Nature.',
  'Specialist by Demand.',
  'Fast-moving Teams.',
  'Business-critical Features.',
  'Aggressive Timelines.',
  'Own It End-to-End.',
  'Adapt Quickly.',
  'Problem-solving is Key.',
]

const reel3 = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Dart',
  'Docker',
  'RabbitMQ',
  'Celery',
  'Elasticsearch',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'AWS',
  'Figma',
  'GraphQL',
  'REST API',
  'Flutter',
  'NextJS',
  'VueJS',
  'Rancher',
]

export default function V5Landing() {
  return (
    <div
      className="relative overflow-x-hidden"
      style={{ fontFamily: 'var(--font-archivo)' }}
    >
      <V5Nav />

      {/* ── Hero ── */}
      <V5Hero />

      {/* ── Marquee 1 — Skills reel ── */}
      <MarqueeReel
        items={reel1}
        speed={35}
        bg="#E5FF00"
        textColor="#0A0A0A"
        separator="◆"
      />

      {/* ── Case Studies ── */}
      <V5Cases />

      {/* ── Marquee 2 — Real bio reel ── */}
      <MarqueeReel
        items={reel2}
        speed={28}
        reverse
        bg="#FF2D55"
        textColor="#FFFFFF"
        separator="★"
      />

      {/* ── About / Skills ── */}
      <V5About />

      {/* ── Marquee 3 — Tech stack reel ── */}
      <MarqueeReel
        items={reel3}
        speed={40}
        bg="#0A0A0A"
        textColor="#E5FF00"
        separator="·"
        borderTop={true}
        borderBottom={true}
      />

      {/* ── Team ── */}
      <V5Team />

      {/* ── Marquee 4 — Closing reel ── */}
      <MarqueeReel
        items={['Jakarta, Indonesia', 'Available Now', 'sabiq.id', 'sabiqmuhammad98@gmail.com', 'github.com/sabiq7392', 'PT. Quantum Teknologi Nusantara', 'GDSC Alumni', 'STT Nurul Fikri']}
        speed={22}
        bg="#111111"
        textColor="rgba(229,255,0,0.6)"
        separator="✦"
      />

      {/* ── Contact ── */}
      <V5Contact />
    </div>
  )
}
