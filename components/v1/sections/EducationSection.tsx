'use client'

import { Typography, Divider, Image } from 'antd'
import { homeData } from '@/data/home.data'
import Link from 'next/link'

const { Title, Text } = Typography

export default function EducationSection() {
  const { education, organization } = homeData

  return (
    <section className="w-full py-4 fade-in">
      <div className="mb-8">
        <Title level={2} className="!m-0 text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">
          Education & Organization
        </Title>
        <Divider className="!border-gray-200 dark:!border-white/10 !mt-4 !mb-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <Link href={education.href} target="_blank" className="block group">
          <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] hover:border-gray-200 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all h-full">
            <Title level={4} className="!mb-4 text-gray-900 dark:text-white text-lg font-semibold">
              Education
            </Title>
            <div className="flex items-start gap-5">
              <div className="w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/[0.08]">
                <Image
                  src={education.image}
                  alt={education.degree}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  preview={false}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Text className="text-gray-900 dark:text-white text-base font-semibold">
                  {education.degree}
                </Text>
                <Text className="text-primary-blue dark:text-primary-blue-light text-sm font-medium">
                  {education.institution}
                </Text>
                <Text className="text-gray-500 dark:text-white/50 text-sm">
                  {education.period}
                </Text>
                <Text className="text-gray-400 dark:text-white/40 text-sm">
                  {education.location}
                </Text>
              </div>
            </div>
          </div>
        </Link>

        {/* Organization */}
        <Link href={organization.href} target="_blank" className="block group">
          <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] hover:border-gray-200 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all h-full">
            <Title level={4} className="!mb-4 text-gray-900 dark:text-white text-lg font-semibold">
              Organization
            </Title>
            <div className="flex items-start gap-5">
              <div className="w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/[0.08]">
                <Image
                  src={organization.image}
                  alt={organization.name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  preview={false}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Text className="text-gray-900 dark:text-white text-base font-semibold">
                  {organization.name}
                </Text>
                <Text className="text-primary-blue dark:text-primary-blue-light text-sm font-medium">
                  {organization.institution}
                </Text>
                <Text className="text-gray-500 dark:text-white/50 text-sm">
                  {organization.period}
                </Text>
                <div className="mt-1">
                  {organization.activities.map((activity, index) => (
                    <Text key={index} className="text-gray-500 dark:text-white/50 text-sm block leading-relaxed">
                      ▸ {activity}
                    </Text>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
