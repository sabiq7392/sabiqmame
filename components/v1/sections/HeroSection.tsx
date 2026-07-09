'use client'

import React, { useState, useEffect } from 'react'
import { Typography, Button, Avatar, Badge } from 'antd'
import {
  LinkedinOutlined,
  GithubOutlined,
  MailOutlined,
  DownloadOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { homeData } from '@/data/home.data'

const { Title, Text, Paragraph } = Typography

export default function HeroSection() {
  const { hero } = homeData
  const [downloadCount, setDownloadCount] = useState<number>(0)

  useEffect(() => {
    const fetchDownloadCount = async () => {
      try {
        const response = await fetch('/api/track/cv-download/count')
        const data = await response.json()
        if (data.success && typeof data.count === 'number') {
          setDownloadCount(data.count)
        }
      } catch {
        // silently fail
      }
    }
    fetchDownloadCount()
  }, [])

  const handleDownloadCV = async () => {
    try {
      const response = await fetch('/api/track/cv-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        setDownloadCount(prev => prev + 1)
      }
    } catch {
      // silently fail
    }
    window.open(hero.cvUrl, '_blank')
  }

  return (
    <section className="w-full py-8 md:py-12 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text Content */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Text className="text-primary-blue dark:text-primary-blue-light text-sm font-semibold tracking-widest uppercase">
              {hero.subtitle}
            </Text>
            <Title
              level={1}
              className="!m-0 text-gray-900 dark:text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              {hero.name}
            </Title>
            <Title
              level={2}
              className="!m-0 text-gray-500 dark:text-white/60 text-xl md:text-2xl font-normal"
            >
              {hero.title}
            </Title>
          </div>

          <Paragraph className="text-gray-600 dark:text-white/70 text-base md:text-lg leading-relaxed !mb-0 max-w-[560px]">
            {hero.description}
          </Paragraph>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Badge
              count={downloadCount}
              overflowCount={9999}
              showZero={false}
              style={{ zIndex: 10 }}
              styles={{
                indicator: {
                  backgroundColor: '#ef4444',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                  border: '2px solid white',
                  fontSize: '10px',
                  fontWeight: 600,
                  minWidth: '24px',
                  height: '24px',
                  lineHeight: '20px',
                  padding: '0 6px',
                },
              }}
            >
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                className="h-12 px-8 text-base font-semibold bg-gray-900 dark:bg-white dark:text-gray-900 border-0 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 hover:-translate-y-0.5 transition-all shadow-lg shadow-gray-900/20 dark:shadow-white/10"
                onClick={handleDownloadCV}
              >
                Download CV
              </Button>
            </Badge>

            <Button
              size="large"
              icon={<ArrowRightOutlined />}
              className="h-12 px-8 text-base font-medium bg-transparent border-2 border-gray-300 dark:border-white/30 text-gray-700 dark:text-white/80 rounded-xl hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white hover:-translate-y-0.5 transition-all"
              onClick={() => (window.location.href = hero.social.email)}
            >
              Contact Me
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 mt-4 pt-6 border-t border-gray-200 dark:border-white/10">
            <a
              href={hero.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 dark:text-white/50 hover:text-primary-blue dark:hover:text-primary-blue-light transition-colors text-sm font-medium"
            >
              <LinkedinOutlined className="text-lg" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href={hero.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 dark:text-white/50 hover:text-primary-blue dark:hover:text-primary-blue-light transition-colors text-sm font-medium"
            >
              <GithubOutlined className="text-lg" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href={hero.social.email}
              className="flex items-center gap-2 text-gray-500 dark:text-white/50 hover:text-primary-blue dark:hover:text-primary-blue-light transition-colors text-sm font-medium"
            >
              <MailOutlined className="text-lg" />
              <span className="hidden sm:inline">Email</span>
            </a>
          </div>
        </div>

        {/* Right: Avatar */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Decorative background shape */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-white/5 rounded-[40px] rotate-6 scale-95" />
            <div className="absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-[40px] -rotate-3 scale-95" />
            <Avatar
              size={320}
              className="relative border-[4px] border-white dark:border-white/20 shadow-2xl rounded-[32px] md:!w-[320px] md:!h-[320px] max-sm:!w-[240px] max-sm:!h-[240px] max-sm:rounded-[24px]"
              src={hero.avatar}
              style={{ width: 320, height: 320 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
