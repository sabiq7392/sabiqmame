'use client'

import { useEffect, useMemo } from 'react'
import { Card, Typography, Form, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useCVStorage } from '@/hooks/useCVStorage'
import { transformFormValuesToCVData, transformCVDataToFormValues } from '@/utils/cv-form-transformer'
import { downloadCV } from '@/utils/cv-generator'
import DraggableCVPreview from './DraggableCVPreview'
import PersonalInfoSection from './form-sections/PersonalInfoSection'
import ProfileSection from './form-sections/ProfileSection'
import ProjectsSection from './form-sections/ProjectsSection'
import EducationSection from './form-sections/EducationSection'
import OrganizationSection from './form-sections/OrganizationSection'
import SkillsSection from './form-sections/SkillsSection'
import { SectionId, SECTION_CONFIGS } from '@/utils/cv-section-order'

const { Title, Text } = Typography

// Map section ID to component factory
const sectionComponents: Record<SectionId, () => React.ReactNode> = {
  profile: () => <ProfileSection />,
  projects: () => <ProjectsSection />,
  education: () => <EducationSection />,
  organization: () => <OrganizationSection />,
  skills: () => <SkillsSection />,
}

export default function CVMakerForm() {
  const [form] = Form.useForm()
  const {
    cvData,
    setCvData,
    saveToLocalStorage,
    sectionOrder,
    setSectionOrder,
    saveSectionOrder,
    isLoaded,
    isClient,
  } = useCVStorage()

  // Load saved data into form on mount
  useEffect(() => {
    if (!isClient || !isLoaded) return

    const formValues = transformCVDataToFormValues(cvData)
    form.setFieldsValue(formValues)
  }, [form, cvData, isClient, isLoaded])

  // Auto-save on form change and update preview
  const handleValuesChange = () => {
    if (!isLoaded || !isClient) return

    const currentValues = form.getFieldsValue()
    const transformedData = transformFormValuesToCVData(currentValues)

    setCvData(transformedData)
    saveToLocalStorage(transformedData)
  }

  const handleFinish = (values: any) => {
    const data = transformFormValuesToCVData(values)

    setCvData(data)
    saveToLocalStorage(data)
    downloadCV(data, `${values.name || 'cv'}.md`, sectionOrder)
  }

  const handleSectionOrderChange = (newOrder: SectionId[]) => {
    setSectionOrder(newOrder)
    saveSectionOrder(newOrder)
  }

  // Render form sections in order
  const orderedFormSections = useMemo(() => {
    return sectionOrder.map((sectionId) => (
      <div key={sectionId}>
        {sectionComponents[sectionId]()}
      </div>
    ))
  }, [sectionOrder])

  // Prevent hydration mismatch by not rendering form until client-side
  if (!isClient) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8 fade-in">
          <Title level={1} className="!m-0 text-white text-4xl md:text-3xl font-bold mb-4">
            CV Maker
          </Title>
          <Title level={4} className="!m-0 text-white/60 text-lg md:text-base font-normal">
            Create and customize your professional CV easily
          </Title>
        </div>
        <Card className="rounded-[20px] p-8 md:p-6 glass">
          <div className="flex justify-center items-center py-20">
            <Text className="text-white/60">Loading...</Text>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="mb-8 fade-in">
        <Title level={1} className="!m-0 text-white text-4xl md:text-3xl font-bold mb-4">
          CV Maker
        </Title>
        <Title level={4} className="!m-0 text-white/60 text-lg md:text-base font-normal">
          Create and customize your professional CV easily
        </Title>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview - Left Side */}
        <div className="lg:sticky lg:top-24 order-2 lg:order-1">
          <DraggableCVPreview
            cvData={cvData}
            sectionOrder={sectionOrder}
            onSectionOrderChange={handleSectionOrderChange}
          />
        </div>

        {/* Input Form - Right Side */}
        <Card className="rounded-[20px] p-8 md:p-6 glass order-1 lg:order-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            onValuesChange={handleValuesChange}
            className="space-y-6"
          >
            <PersonalInfoSection />
            {orderedFormSections}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                icon={<DownloadOutlined />}
                className="h-12 px-12 text-base font-medium bg-gradient-blue border-0 shadow-blue hover:-translate-y-0.5 hover:shadow-blue-hover transition-all"
              >
                Generate & Download CV
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}
