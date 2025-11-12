'use client'

import { useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Typography } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { CVData } from '@/data/cv-maker.data'
import { generateCVMarkdown } from '@/utils/cv-generator'
import { SectionId, SECTION_CONFIGS } from '@/utils/cv-section-order'

const { Title } = Typography

interface DraggableCVPreviewProps {
  cvData: CVData
  sectionOrder: SectionId[]
  onSectionOrderChange: (order: SectionId[]) => void
}

interface SortableSectionProps {
  id: SectionId
  children: React.ReactNode
}

function SortableSection({ id, children }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group cursor-move mb-6"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-start gap-3 p-3 rounded-lg border-2 border-transparent hover:border-dashed hover:border-gray-400 hover:bg-gray-50 transition-all cursor-grab active:cursor-grabbing"
      >
        <div className="flex-shrink-0 mt-1 p-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors">
          <HolderOutlined className="text-gray-600 text-base" />
        </div>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function DraggableCVPreview({
  cvData,
  sectionOrder,
  onSectionOrderChange,
}: DraggableCVPreviewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionId)
      const newIndex = sectionOrder.indexOf(over.id as SectionId)
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex)
      onSectionOrderChange(newOrder)
    }
  }

  // Generate sections in order
  const sections = useMemo(() => {
    const personalInfo = `# ${cvData.personalInfo.name}\n\n**Contact Information**\n- Phone: ${cvData.personalInfo.phone}\n- Email: ${cvData.personalInfo.email}\n- LinkedIn: [${cvData.personalInfo.linkedin}](${cvData.personalInfo.linkedin})\n\n`

    const sectionContent: Record<SectionId, string> = {
      profile: cvData.profile ? `## PROFILE\n\n${cvData.profile}\n\n` : '',
      projects: cvData.projects.length > 0
        ? (() => {
            let markdown = `## PROJECTS\n\n`
            const companyProjects = cvData.projects.reduce((acc, project) => {
              if (!acc[project.company]) {
                acc[project.company] = []
              }
              acc[project.company].push(project)
              return acc
            }, {} as Record<string, typeof cvData.projects>)

            Object.entries(companyProjects).forEach(([company, projects]) => {
              const firstProject = projects[0]
              markdown += `**${company}** | *${firstProject.period}*\n\n`

              projects.forEach((project, index) => {
                markdown += `### ${index + 1}. ${project.title}\n\n`
                markdown += `${project.description}\n\n`

                if (project.achievements && project.achievements.length > 0) {
                  const achievements = Array.isArray(project.achievements)
                    ? project.achievements
                    : typeof project.achievements === 'string'
                      ? project.achievements.split('\n').filter((line) => line.trim())
                      : []

                  achievements.forEach((achievement) => {
                    const trimmed = achievement.trim()
                    if (trimmed) {
                      markdown += `- ${trimmed}\n`
                    }
                  })
                  markdown += `\n`
                }

                if (project.availableOn) {
                  markdown += `*${project.availableOn}*\n\n`
                }
              })
            })
            return markdown
          })()
        : '',
      education: cvData.education.degree
        ? `## EDUCATION\n\n**${cvData.education.degree}**\n*${cvData.education.period}*\n\n${cvData.education.institution}\n${cvData.education.location}\n\n`
        : '',
      organization: cvData.organization.name
        ? (() => {
            let markdown = `## ORGANIZATION EXPERIENCE\n\n`
            markdown += `**${cvData.organization.name}** | *${cvData.organization.period}*\n`
            markdown += `${cvData.organization.institution}\n\n`

            const activities = Array.isArray(cvData.organization.activities)
              ? cvData.organization.activities
              : typeof cvData.organization.activities === 'string'
                ? cvData.organization.activities.split('\n').filter((line) => line.trim())
                : []

            activities.forEach((activity) => {
              const trimmed = activity.trim()
              if (trimmed) {
                markdown += `- ${trimmed}\n`
              }
            })
            markdown += `\n`
            return markdown
          })()
        : '',
      skills:
        cvData.skills.programming.length > 0 ||
        cvData.skills.database.length > 0 ||
        cvData.skills.others.length > 0
          ? (() => {
              let markdown = `## ADDITIONAL EXPERIENCE\n\n`
              if (cvData.skills.programming.length > 0) {
                markdown += `### Programming Language\n`
                markdown += `Experienced in using ${cvData.skills.programming.join(', ')}\n\n`
              }
              if (cvData.skills.database.length > 0) {
                markdown += `### Database\n`
                markdown += `Experienced in using ${cvData.skills.database.join(', ')}\n\n`
              }
              if (cvData.skills.others.length > 0) {
                markdown += `### Others\n`
                markdown += `Experienced in using ${cvData.skills.others.join(', ')}\n\n`
              }
              return markdown
            })()
          : '',
    }

    return sectionOrder
      .map((sectionId) => ({
        id: sectionId,
        content: sectionContent[sectionId],
      }))
      .filter((section) => section.content) // Only show sections with content
  }, [cvData, sectionOrder])

  return (
    <Card className="rounded-[20px] p-8 md:p-6 glass-strong h-full flex flex-col">
      <Title level={3} className="!mb-4 text-white text-2xl font-semibold flex-shrink-0">
        Preview
      </Title>
      <div className="bg-white rounded-lg shadow-lg p-8 overflow-y-auto flex-1 max-h-[calc(100vh-200px)]">
        <div className="cv-preview prose prose-slate max-w-none">
          {/* Personal Info - Always First */}
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">{children}</ul>
              ),
              li: ({ children }) => <li className="text-gray-700">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">{children}</strong>
              ),
              em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:text-primary-blue-dark underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {`# ${cvData.personalInfo.name}\n\n**Contact Information**\n- Phone: ${cvData.personalInfo.phone}\n- Email: ${cvData.personalInfo.email}\n- LinkedIn: [${cvData.personalInfo.linkedin}](${cvData.personalInfo.linkedin})\n\n`}
          </ReactMarkdown>

          {/* Draggable Sections */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((section) => (
                <SortableSection key={section.id} id={section.id}>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-4">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                      em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-blue hover:text-primary-blue-dark underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {section.content}
                  </ReactMarkdown>
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </Card>
  )
}

