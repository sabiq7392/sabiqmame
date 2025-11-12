'use client'

import React from 'react'
import { Typography, Space, Button, Avatar, Tag } from 'antd'
import {
  LinkedinOutlined,
  GithubOutlined,
  MailOutlined,
  DownloadOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { homeData } from '@/data/home.data'

const { Title, Paragraph } = Typography

export default function HeroSection() {
  const { hero } = homeData

  return (
    <section className="w-full flex justify-center py-8 md:py-4 fade-in">
      <div className="w-full max-w-[800px] px-12 py-16 md:px-6 md:py-10 rounded-3xl text-center flex flex-col items-center gap-6 md:gap-4 glass-strong">
        <Avatar
          size={120}
          className="border-[3px] border-primary-blue/50 dark:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          src={hero.avatar}
        />
        <Title
          level={1}
          className="!m-0 bg-gradient-text bg-clip-text text-transparent text-4xl md:text-3xl font-bold"
        >
          {hero.name}
        </Title>
        <Title level={3} className="!m-0 text-gray-700 dark:text-white/80 md:text-lg font-normal">
          {hero.title}
        </Title>
        <Paragraph className="text-gray-600 dark:text-white/80 text-lg md:text-base leading-relaxed max-w-[600px] mx-auto !mb-0">
          {hero.description}
        </Paragraph>

        <Space size="large" className="mt-4 flex-col md:flex-row w-full md:w-auto">
          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            className="h-12 px-8 w-full md:w-auto text-base font-medium bg-gradient-blue border-0 shadow-blue hover:-translate-y-0.5 hover:shadow-blue-hover transition-all"
            onClick={() => {
              window.open(hero.cvUrl, '_blank')
            }}
          >
            Download CV
          </Button>
          <Button
            size="large"
            icon={<MailOutlined />}
            className="h-12 px-8 w-full md:w-auto text-base font-medium bg-transparent border-2 border-primary-blue/50 text-primary-blue-light hover:border-primary-blue hover:bg-primary-blue/10 hover:-translate-y-0.5 transition-all"
            onClick={() => window.location.href = hero.social.email}
          >
            Contact Me
          </Button>
        </Space>

        <Space size="large" className="mt-4">
          <a
            href={hero.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-600 dark:text-white/80 hover:text-primary-blue-light hover:scale-110 transition-all"
            title="LinkedIn"
          >
            <LinkedinOutlined />
          </a>
          <a
            href={hero.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-600 dark:text-white/80 hover:text-primary-blue-light hover:scale-110 transition-all"
            title="GitHub"
          >
            <GithubOutlined />
          </a>
          <a
            href={hero.social.email}
            className="text-2xl text-gray-600 dark:text-white/80 hover:text-primary-blue-light hover:scale-110 transition-all"
            title="Email"
          >
            <MailOutlined />
          </a>
          {/* <a
            href={hero.social.phone}
            className="text-2xl text-gray-600 dark:text-white/80 hover:text-primary-blue-light hover:scale-110 transition-all"
            title="Phone"
          >
            <PhoneOutlined />
          </a> */}
        </Space>

        {/* <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Tag color="blue" className="text-sm px-3 py-1 border-primary-blue/50 bg-primary-blue/10 text-primary-blue-light">
            <PhoneOutlined /> {hero.phone}
          </Tag>
          <Tag color="blue" className="text-sm px-3 py-1 border-primary-blue/50 bg-primary-blue/10 text-primary-blue-light">
            <MailOutlined /> {hero.email}
          </Tag>
        </div> */}
      </div>
    </section>
  )
}

