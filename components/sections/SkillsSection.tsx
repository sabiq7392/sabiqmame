'use client'

import React from 'react'
import { Card, Typography, Divider } from 'antd'
import { 
  DesktopOutlined,
  CloudServerOutlined,
  MobileOutlined
} from '@ant-design/icons'
import { homeData } from '@/data/home.data'

const { Title, Text } = Typography

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  DesktopOutlined: DesktopOutlined,
  CloudServerOutlined: CloudServerOutlined,
  MobileOutlined: MobileOutlined,
}

export default function SkillsSection() {
  const { skills } = homeData

  return (
    <section className="w-full fade-in">
      <Card className="rounded-[20px] p-8 md:p-6 glass">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-2xl font-semibold">Skills</Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !my-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl glass-soft hover:-translate-y-1 dark:hover:shadow-lg dark:hover:shadow-primary-blue/20 transition-all text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary-blue/20 border border-primary-blue/50 flex items-center justify-center mb-4">
                {iconMap[skill.icon] && (
                  <span className="text-xl text-primary-blue-light">
                    {React.createElement(iconMap[skill.icon])}
                  </span>
                )}
              </div>
              <Title level={3} className="!mb-2 text-gray-900 dark:text-white text-xl font-semibold">{skill.title}</Title>
              <Text className="text-gray-600 dark:text-white/70 text-base leading-relaxed">
                {skill.description}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

