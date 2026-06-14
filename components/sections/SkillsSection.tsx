'use client'

import React from 'react'
import { Typography, Divider } from 'antd'
import {
  DesktopOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import { homeData } from '@/data/home.data'

const { Title, Text } = Typography

const iconMap: Record<string, React.ComponentType<any>> = {
  DesktopOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
}

export default function SkillsSection() {
  const { skillGroups } = homeData

  return (
    <section className="w-full py-4 fade-in">
      <div className="mb-8">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">
          Skills & Technologies
        </Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !mt-4 !mb-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillGroups.map((group, index) => (
          <div
            key={index}
            className="p-6 md:p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] hover:border-gray-200 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center text-primary-blue dark:text-primary-blue-light text-xl">
                {iconMap[group.icon] && React.createElement(iconMap[group.icon])}
              </div>
              <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
                {group.title}
              </Title>
            </div>

            <Text className="text-gray-500 dark:text-white/50 text-sm mb-5 leading-relaxed">
              {group.description}
            </Text>

            <div className="flex flex-wrap gap-2 mt-auto">
              {group.techs.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/[0.05] text-gray-600 dark:text-white/70 text-xs font-medium border border-gray-100 dark:border-white/[0.05]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
