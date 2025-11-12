'use client'

import { Card, Typography, Divider, Tag, Timeline } from 'antd'
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons'
import { homeData } from '@/data/home.data'
import { calculateDuration, calculateExperienceDuration } from '@/utils/date-utils'

const { Title, Text } = Typography

export default function ExperienceSection() {
  const { experiences } = homeData

  return (
    <section className="w-full fade-in">
      <div className="rounded-[20px] p-8 md:p-6 glass-strong shadow-md">
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
                  <Title level={3} className="!m-0 !mb-2 text-gray-900 dark:text-white text-xl md:text-lg font-semibold">
                    {experience.company}
                  </Title>
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

                    return (
                      <div key={roleIndex} className="relative">
                        <div className="p-4 rounded-xl glass-soft hover:shadow-lg transition-all">
                          <div className="mb-3">
                            <Title level={4} className="!m-0 !mb-2 text-gray-900 dark:text-white text-base md:text-sm font-semibold">
                              {role.title}
                            </Title>
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
                              {/* <Text className="text-xs text-gray-500 dark:text-white/60">
                                {role.skills.join(', ')}
                                {role.skills.length > 2 && ' dan +' + (role.skills.length - 2) + ' keahlian'}
                              </Text> */}
                              {role.skills.map((skill, skillIndex) => (
                                <Tag color="green" className="text-xs px-2 py-0.5 border-primary-blue/50 bg-primary-blue/10 text-primary-blue-light" key={skillIndex}>
                                  {skill}
                                </Tag>
                              ))}
                            </div>
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
