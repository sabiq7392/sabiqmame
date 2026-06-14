'use client'

import { useState, useEffect } from 'react'
import { Typography, Divider } from 'antd'
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { homeData } from '@/data/home.data'

const { Title, Text } = Typography

const calculateDynamicDuration = (periodStr: string, fallbackDuration: string): string => {
  const parts = periodStr.split(/[–-]/).map(p => p.trim())
  if (parts.length < 2) return fallbackDuration

  const endPart = parts[1].toLowerCase()
  if (endPart !== 'present' && endPart !== 'saat ini') {
    return fallbackDuration
  }

  const startPart = parts[0]
  const startSplit = startPart.split(/\s+/)
  if (startSplit.length < 2) return fallbackDuration

  const startMonthStr = startSplit[0]
  const startYearStr = startSplit[1]

  const monthsMap: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    okt: 9
  }

  const monthKey = startMonthStr.substring(0, 3).toLowerCase()
  const startMonth = monthsMap[monthKey]
  if (startMonth === undefined) return fallbackDuration

  const startYear = parseInt(startYearStr, 10)
  if (isNaN(startYear)) return fallbackDuration

  const startDate = new Date(startYear, startMonth, 1)
  const endDate = new Date()

  const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())

  const years = Math.floor(diffMonths / 12)
  const months = diffMonths % 12

  const yearsStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : ''
  const monthsStr = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : ''

  return [yearsStr, monthsStr].filter(Boolean).join(' ') || '1 mo'
}

export default function ExperienceSection() {
  const { experiences } = homeData
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = (expIdx: number, roleIdx: number) => {
    const key = `${expIdx}-${roleIdx}`
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section className="w-full py-4 fade-in">
      <div className="mb-8">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">
          Experience
        </Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !mt-4 !mb-0" />
      </div>

      <div className="space-y-10">
        {experiences.map((exp, expIdx) => (
          <div key={expIdx}>
            {/* Company Header */}
            <div className="flex items-center gap-4 mb-6">
              {exp.logo && (
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-white/10 shadow-sm"
                />
              )}
              <Title level={3} className="!m-0 text-gray-900 dark:text-white text-xl md:text-2xl font-semibold">
                {exp.company}
              </Title>
            </div>

            {/* Roles */}
            <div className="ml-0 md:ml-16 space-y-4 border-l-2 border-gray-200 dark:border-white/[0.08] pl-6 md:pl-8">
              {exp.roles.map((role, roleIdx) => {
                const key = `${expIdx}-${roleIdx}`
                const isOpen = expanded[key] === true
                const displayDuration = mounted ? calculateDynamicDuration(role.period, role.duration) : role.duration

                return (
                  <div key={roleIdx} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[31px] md:-left-[37px] top-4 w-3 h-3 rounded-full bg-gray-300 dark:bg-white/20 border-2 border-white dark:border-dark-bg" />

                    <div
                      className="p-5 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] hover:border-gray-200 dark:hover:border-white/[0.15] cursor-pointer transition-all"
                      onClick={() => toggle(expIdx, roleIdx)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Title level={4} className="!m-0 text-gray-900 dark:text-white text-base md:text-lg font-semibold">
                            {role.title}
                          </Title>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-white/50">
                            <span className="flex items-center gap-1.5">
                              <CalendarOutlined />
                              {role.period}
                            </span>
                            <span className="text-gray-300 dark:text-white/20">·</span>
                            <span>{displayDuration}</span>
                            {role.location && (
                              <>
                                <span className="text-gray-300 dark:text-white/20">·</span>
                                <span className="flex items-center gap-1.5">
                                  <EnvironmentOutlined />
                                  {role.location}
                                </span>
                              </>
                            )}
                            {role.type && (
                              <>
                                <span className="text-gray-300 dark:text-white/20">·</span>
                                <span>{role.type}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-400 dark:text-white/30 mt-1 flex-shrink-0">
                          {isOpen ? <UpOutlined /> : <DownOutlined />}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                          <ul className="space-y-2.5">
                            {role.achievements.map((ach, achIdx) => (
                              <li key={achIdx} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                                <span className="text-primary-blue dark:text-primary-blue-light mt-1.5 flex-shrink-0">▸</span>
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {role.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-white/[0.05] text-gray-500 dark:text-white/50 text-xs font-medium border border-gray-100 dark:border-white/[0.05]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
