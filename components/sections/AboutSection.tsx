'use client'

import { Card, Typography, Divider } from 'antd'
import { homeData } from '@/data/home.data'

const { Title } = Typography

export default function AboutSection() {
  const { about } = homeData

  return (
    <section className="w-full fade-in">
      <Card className="rounded-[20px] p-8 md:p-6 glass">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-2xl font-semibold">About Me</Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !my-6" />
        {about.paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className="text-gray-700 dark:text-white/80 text-lg md:text-base leading-relaxed mb-4 last:mb-0"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
      </Card>
    </section>
  )
}

