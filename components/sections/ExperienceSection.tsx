'use client'

import { useState } from 'react'
import { Card, Typography, Divider, Tag, Timeline, Button } from 'antd'
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import { homeData } from '@/data/home.data'
import { calculateDuration, calculateExperienceDuration } from '@/utils/date-utils'

const { Title, Text } = Typography

export default function ExperienceSection() {
  const { experiences } = homeData
  const [collapsedRoles, setCollapsedRoles] = useState<Record<string, boolean>>({})

  const toggleRole = (expIndex: number, roleIndex: number) => {
    const key = `${expIndex}-${roleIndex}`
    setCollapsedRoles(prev => ({
      ...prev,
      [key]: prev[key] === false ? true : false
    }))
  }

  return (
    <section className="w-full fade-in">
      <div className="rounded-[20px] p-6 glass-strong shadow-sm">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-2xl font-semibold mb-6">
          Experience
        </Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !my-6" />

        <Timeline
          mode="left"
          className="[&_.ant-timeline-item-tail]:!border-l-2 [&_.ant-timeline-item-tail]:!border-primary-blue/30 dark:[&_.ant-timeline-item-tail]:!border-primary-blue/50"
        >
          {experiences.map((experience, expIndex) => (
            <Timeline.Item
              key={expIndex}
              dot={
                <div className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-primary-blue/20 dark:bg-primary-blue/30 border-2 border-primary-blue dark:border-primary-blue-light flex items-center justify-center">
                  <div className="w-3 h-3 md:w-2 md:h-2 rounded-full bg-primary-blue dark:bg-primary-blue-light"></div>
                </div>
              }
            >
              <div className="ml-4 md:ml-2">
                {/* Company Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {experience.logo && (
                      <img
                        src={experience.logo}
                        alt={experience.company}
                        className="w-12 h-12 md:w-10 md:h-10 rounded-lg object-cover border border-gray-200 dark:border-white/20"
                      />
                    )}
                    <Title level={3} className="!m-0 text-gray-900 dark:text-white text-xl md:text-lg font-semibold">
                      {experience.company}
                    </Title>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Tag color="blue" className="text-xs px-2 py-0.5 border-primary-blue/50 bg-primary-blue/10 text-primary-blue-light">
                      {experience.employmentType}
                    </Tag>
                    <Text className="text-gray-500 dark:text-white/60 text-sm">
                      {calculateExperienceDuration(experience.roles)}
                    </Text>
                  </div>
                </div>

                {/* Roles */}
                <div className="space-y-6">
                  {experience.roles.map((role, roleIndex) => {
                    const isLastRole = roleIndex === experience.roles.length - 1
                    const isLastExperience = expIndex === experiences.length - 1
                    const isLastItem = isLastExperience && isLastRole
                    const roleKey = `${expIndex}-${roleIndex}`
                    const isCollapsed = collapsedRoles[roleKey] !== false

                    return (
                      <div key={roleIndex} className="relative">
                        <div
                          className="p-4 rounded-xl glass-soft hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => toggleRole(expIndex, roleIndex)}
                        >
                          <div className="mb-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <Title level={4} className="!m-0 !mb-0 text-gray-900 dark:text-white text-base md:text-sm font-semibold flex-1">
                                {role.title}
                              </Title>
                              <Button
                                type="text"
                                icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleRole(expIndex, roleIndex)
                                }}
                                className="!flex !items-center !justify-center !w-8 !h-8 !p-0 !min-w-0 !text-gray-500 dark:!text-white/60 hover:!text-primary-blue-light hover:!bg-primary-blue/10"
                                aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                              />
                            </div>
                            {role.isCoreTeam && (
                              <Tag color="gold" className="text-xs px-2 py-0.5 mb-2">
                                <TeamOutlined /> Core Team
                              </Tag>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-white/60">
                              <span className="flex items-center gap-1">
                                <CalendarOutlined /> {role.period}
                              </span>
                              <span>· {calculateDuration(role.period)}</span>
                              {role.location && (
                                <span className="flex items-center gap-1">
                                  <EnvironmentOutlined /> {role.location}
                                </span>
                              )}
                              {role.type && (
                                <span>· {role.type}</span>
                              )}
                            </div>
                          </div>

                          {/* Collapsible Content */}
                          {!isCollapsed && (
                            <>
                              {/* Achievements */}
                              <ul className="space-y-2 mt-3">
                                {role.achievements.map((achievement, achIndex) => (
                                  <li key={achIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/80">
                                    <span className="text-primary-blue-light mt-1.5">•</span>
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Skills */}
                              {role.skills && role.skills.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                                  {role.skills.map((skill, skillIndex) => (
                                    <Tag color="green" className="text-xs px-2 py-0.5 border-primary-blue/50 bg-primary-blue/10 text-primary-blue-light" key={skillIndex}>
                                      {skill}
                                    </Tag>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </section>
  )
}
