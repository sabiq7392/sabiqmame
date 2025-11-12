'use client'

import React from 'react'
import Image from 'next/image'
import { Card, Typography, Divider, Tag } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { homeData } from '@/data/home.data'
import { useTheme } from '@/contexts/ThemeContext'

const { Title, Text } = Typography

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  GlobalOutlined: GlobalOutlined,
}

export default function ProjectsSection() {
  const { projects } = homeData
  const { theme } = useTheme()

  return (
    <section className="w-full fade-in">
      <Card className="rounded-[20px] p-8 md:p-6 glass">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-2xl font-semibold">Key Projects</Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl glass-soft hover:-translate-y-1 dark:hover:shadow-lg dark:hover:shadow-primary-blue/20 transition-all flex flex-col"
            >
              {(project.image || project.image_light) && (
                <div className="mb-4 w-full flex items-center justify-start">
                  <Image
                    src={theme === 'light' && project.image_light ? project.image_light : (project.image || project.image_light || '')}
                    alt={project.title}
                    width={100}
                    height={100}
                    className="object-contain h-[100px]"
                  />
                </div>
              )}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <Title level={4} className="!m-0 text-gray-900 dark:text-white text-xl">{project.title}</Title>
                  {project.badge && (
                    <Tag color="green" className="bg-green-500/20 border-green-500/50 text-green-400 flex-shrink-0 ml-2">
                      {iconMap[project.badge.icon] && (
                        <span className="text-xs mr-1">
                          {React.createElement(iconMap[project.badge.icon])}
                        </span>
                      )}
                      {project.badge.label}
                    </Tag>
                  )}
                </div>
                <Text className="text-primary-blue-light text-sm">{project.company} · {project.period}</Text>
              </div>
              <Text className="text-gray-600 dark:text-white/70 text-base leading-relaxed block mb-3 flex-grow">
                {project.description}
              </Text>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag, tagIndex) => (
                  <Tag 
                    key={tagIndex}
                    color="blue" 
                    className="bg-primary-blue/20 border-primary-blue/50 text-primary-blue-light text-xs"
                  >
                    {tag.label}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

