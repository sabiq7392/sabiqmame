'use client'

import { Card, Typography, Divider, Image } from 'antd'
import { homeData } from '@/data/home.data'
import Link from 'next/link'

const { Title, Text } = Typography

export default function EducationSection() {
  const { education, organization } = homeData

  return (
    <section className="w-full fade-in">
      <div className="rounded-[20px] p-6 glass-strong shadow-sm">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-2xl font-semibold">Education & Organization</Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl glass-soft">
            <Title level={4} className="!mb-2 text-gray-900 dark:text-white text-lg">Education</Title>
            <Link href={education.href} className="flex items-start gap-4" target="_blank">
              <Image src={education.image} alt={education.degree} width={130} className="border border-gray-200 dark:border-white/10 rounded-lg" />
              <div>
                <Text className="text-gray-800 dark:text-white/90 text-base font-semibold block mb-2">
                  {education.degree}
                </Text>
                <Text className="text-primary-blue-light text-sm block mb-1">
                  {education.institution}
                </Text>
                <Text className="text-gray-500 dark:text-white/60 text-sm">
                  {education.period} · {education.location}
                </Text>
              </div>
            </Link>
          </div>
          <div className="p-6 rounded-2xl glass-soft">
            <Title level={4} className="!mb-2 text-gray-900 dark:text-white text-lg">Organization</Title>
            <Link href={organization.href} className="flex items-start gap-4" target="_blank">
              <Image src={organization.image} alt={organization.name} width={130} className="border border-gray-200 dark:border-white/10 rounded-lg" />
              <div>
                <Text className="text-gray-800 dark:text-white/90 text-base font-semibold block mb-2">
                  {organization.name}
                </Text>
                <Text className="text-primary-blue-light text-sm block mb-1">
                  {organization.institution}
                </Text>
                <Text className="text-gray-500 dark:text-white/60 text-sm block mb-2">
                  {organization.period}
                </Text>
                <Text className="text-gray-600 dark:text-white/70 text-sm">
                  {organization.activities.map((activity, index) => (
                    <span key={index}>
                      • {activity}
                      {index < organization.activities.length - 1 && <br />}
                    </span>
                  ))}
                </Text>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

