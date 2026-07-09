'use client'

import { useEffect, useState } from 'react'
import { homeData, StatData } from '@/data/home.data'

export default function StatsSection() {
  const [stats, setStats] = useState<StatData[]>(homeData.stats)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/track/cv-download/count')
        const data = await response.json()
        if (data.success && typeof data.count === 'number') {
          setStats(prev =>
            prev.map(s => (s.label === 'CV Downloads' ? { ...s, value: String(data.count) } : s))
          )
        }
      } catch {
        // silently fail
      }
    }
    fetchCount()
  }, [])

  return (
    <section className="w-full py-4 fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 md:p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] text-center hover:border-gray-200 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all"
          >
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-xl md:text-2xl font-semibold text-primary-blue dark:text-primary-blue-light">
                  {stat.suffix}
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-white/50 text-sm font-medium uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
