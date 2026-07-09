'use client'

import { useEffect, useRef } from 'react'

interface MarqueeReelProps {
  items: string[]
  speed?: number
  reverse?: boolean
  bg?: string
  textColor?: string
  separator?: string
  borderTop?: boolean
  borderBottom?: boolean
}

export default function MarqueeReel({
  items,
  speed = 30,
  reverse = false,
  bg = '#E5FF00',
  textColor = '#0A0A0A',
  separator = '◆',
  borderTop = true,
  borderBottom = true,
}: MarqueeReelProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const posRef = useRef(0)
  const isPausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const totalWidth = track.scrollWidth / 2
    let lastTime = performance.now()

    const animate = (now: number) => {
      if (!isPausedRef.current) {
        const delta = (now - lastTime) / 1000
        posRef.current += (speed * delta) * (reverse ? -1 : 1)
        if (!reverse && posRef.current >= totalWidth) posRef.current -= totalWidth
        if (reverse && posRef.current <= -totalWidth) posRef.current += totalWidth
        if (track) track.style.transform = `translateX(${-posRef.current}px)`
      }
      lastTime = now
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [speed, reverse])

  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden relative"
      style={{
        backgroundColor: bg,
        borderTop: borderTop ? '4px solid #0A0A0A' : 'none',
        borderBottom: borderBottom ? '4px solid #0A0A0A' : 'none',
        padding: '18px 0',
      }}
      onMouseEnter={() => { isPausedRef.current = true }}
      onMouseLeave={() => { isPausedRef.current = false }}
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform"
        style={{ fontFamily: 'var(--font-archivo)' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4"
          >
            <span
              className="text-sm font-black uppercase tracking-[0.15em] px-4"
              style={{ color: textColor }}
            >
              {item}
            </span>
            <span
              className="text-xs"
              style={{ color: textColor, opacity: 0.6 }}
            >
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
