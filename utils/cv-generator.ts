import { CVData } from '@/data/cv-maker.data'
import { SectionId, DEFAULT_SECTION_ORDER, SECTION_CONFIGS } from './cv-section-order'

// Helper function to generate section content
function generateSectionContent(sectionId: SectionId, data: CVData): string {
  switch (sectionId) {
    case 'profile':
      return data.profile ? `## PROFILE\n\n${data.profile}\n\n` : ''
    
    case 'projects':
      if (data.projects.length === 0) return ''
      
      let markdown = `## PROJECTS\n\n`
      const companyProjects = data.projects.reduce((acc, project) => {
        if (!acc[project.company]) {
          acc[project.company] = []
        }
        acc[project.company].push(project)
        return acc
      }, {} as Record<string, typeof data.projects>)
      
      Object.entries(companyProjects).forEach(([company, projects]) => {
        const firstProject = projects[0]
        markdown += `**${company}** | *${firstProject.period}*\n\n`
        
        projects.forEach((project, index) => {
          markdown += `### ${index + 1}. ${project.title}\n\n`
          markdown += `${project.description}\n\n`
          
          if (project.achievements && project.achievements.length > 0) {
            project.achievements.forEach((achievement: string) => {
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
    
    case 'education':
      if (!data.education.degree) return ''
      return `## EDUCATION\n\n**${data.education.degree}**\n*${data.education.period}*\n\n${data.education.institution}\n${data.education.location}\n\n`
    
    case 'organization':
      if (!data.organization.name) return ''
      
      let orgMarkdown = `## ORGANIZATION EXPERIENCE\n\n`
      orgMarkdown += `**${data.organization.name}** | *${data.organization.period}*\n`
      orgMarkdown += `${data.organization.institution}\n\n`
      
      data.organization.activities.forEach((activity: string) => {
        const trimmed = activity.trim()
        if (trimmed) {
          orgMarkdown += `- ${trimmed}\n`
        }
      })
      orgMarkdown += `\n`
      return orgMarkdown
    
    case 'skills':
      const hasSkills =
        data.skills.programming.length > 0 ||
        data.skills.database.length > 0 ||
        data.skills.others.length > 0
      
      if (!hasSkills) return ''
      
      let skillsMarkdown = `## ADDITIONAL EXPERIENCE\n\n`
      if (data.skills.programming.length > 0) {
        skillsMarkdown += `### Programming Language\n`
        skillsMarkdown += `Experienced in using ${data.skills.programming.join(', ')}\n\n`
      }
      if (data.skills.database.length > 0) {
        skillsMarkdown += `### Database\n`
        skillsMarkdown += `Experienced in using ${data.skills.database.join(', ')}\n\n`
      }
      if (data.skills.others.length > 0) {
        skillsMarkdown += `### Others\n`
        skillsMarkdown += `Experienced in using ${data.skills.others.join(', ')}\n\n`
      }
      return skillsMarkdown
    
    default:
      return ''
  }
}

export function generateCVMarkdown(data: CVData, sectionOrder: SectionId[] = DEFAULT_SECTION_ORDER): string {
  let markdown = `# ${data.personalInfo.name}\n\n`
  
  // Contact Information
  markdown += `**Contact Information**\n`
  markdown += `- Phone: ${data.personalInfo.phone}\n`
  markdown += `- Email: ${data.personalInfo.email}\n`
  markdown += `- LinkedIn: [${data.personalInfo.linkedin}](${data.personalInfo.linkedin})\n\n`
  
  // Generate sections in order
  sectionOrder.forEach((sectionId) => {
    const content = generateSectionContent(sectionId, data)
    if (content) {
      markdown += content
    }
  })
  
  return markdown
}

export function downloadCV(data: CVData, filename: string = 'cv.md', sectionOrder: SectionId[] = DEFAULT_SECTION_ORDER) {
  const markdown = generateCVMarkdown(data, sectionOrder)
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
