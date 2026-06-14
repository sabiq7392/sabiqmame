'use client'

import React from 'react'
import Image from 'next/image'
import { Typography, Divider, Tag } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { homeData } from '@/data/home.data'

const { Title, Text, Paragraph } = Typography

export default function ProjectsSection() {
  const { projects } = homeData

  return (
    <section className="w-full py-4 fade-in">
      <div className="mb-8">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">
          Featured Projects
        </Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !mt-4 !mb-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] overflow-hidden hover:border-gray-200 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all flex flex-col"
          >
            {/* Project Image */}
            <div className="relative w-full aspect-[16/10] bg-gray-50 dark:bg-white/[0.02] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {project.badge && (
                <div className="absolute top-3 right-3">
                  <Tag
                    color="green"
                    className="!m-0 bg-green-500/90 border-0 text-white text-xs font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm"
                  >
                    <GlobalOutlined className="mr-1" />
                    {project.badge}
                  </Tag>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-3">
                <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold">
                  {project.title}
                </Title>
                <Text className="text-gray-500 dark:text-white/50 text-xs font-medium uppercase tracking-wide">
                  {project.subtitle}
                </Text>
              </div>

              <Paragraph className="text-gray-600 dark:text-white/70 text-sm leading-relaxed !mb-0 flex-1">
                {project.description}
              </Paragraph>

              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.slice(0, 4).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-white/[0.05] text-gray-500 dark:text-white/50 text-xs font-medium border border-gray-100 dark:border-white/[0.05]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
