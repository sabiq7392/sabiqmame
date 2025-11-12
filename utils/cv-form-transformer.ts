import { CVData } from '@/data/cv-maker.data'

export interface FormValues {
  name: string
  phone: string
  email: string
  linkedin: string
  profile: string
  projects: Array<{
    title: string
    company: string
    period: string
    description: string
    achievements: string | string[]
    availableOn?: string
  }>
  degree: string
  institution: string
  educationPeriod: string
  educationLocation: string
  orgName: string
  orgInstitution: string
  orgPeriod: string
  orgActivities: string | string[]
  programming: string
  database: string
  others: string
}

export function transformFormValuesToCVData(values: FormValues): CVData {
  return {
    personalInfo: {
      name: values.name || '',
      phone: values.phone || '',
      email: values.email || '',
      linkedin: values.linkedin || '',
    },
    profile: values.profile || '',
    projects: (values.projects || []).map((project) => ({
      ...project,
      achievements: project.achievements
        ? (typeof project.achievements === 'string'
            ? project.achievements.split('\n').filter((line: string) => line.trim())
            : Array.isArray(project.achievements)
              ? project.achievements
              : [])
        : [],
    })),
    education: {
      degree: values.degree || '',
      institution: values.institution || '',
      period: values.educationPeriod || '',
      location: values.educationLocation || '',
    },
    organization: {
      name: values.orgName || '',
      institution: values.orgInstitution || '',
      period: values.orgPeriod || '',
      activities: values.orgActivities
        ? (typeof values.orgActivities === 'string'
            ? values.orgActivities.split('\n').filter((line: string) => line.trim())
            : Array.isArray(values.orgActivities)
              ? values.orgActivities
              : [])
        : [],
    },
    skills: {
      programming: values.programming ? values.programming.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      database: values.database ? values.database.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      others: values.others ? values.others.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    },
  }
}

export function transformCVDataToFormValues(data: CVData): Partial<FormValues> {
  return {
    name: data.personalInfo?.name || '',
    phone: data.personalInfo?.phone || '',
    email: data.personalInfo?.email || '',
    linkedin: data.personalInfo?.linkedin || '',
    profile: data.profile || '',
    projects: data.projects?.map((project) => ({
      ...project,
      achievements: Array.isArray(project.achievements)
        ? project.achievements.join('\n')
        : project.achievements || '',
    })) || [],
    degree: data.education?.degree || '',
    institution: data.education?.institution || '',
    educationPeriod: data.education?.period || '',
    educationLocation: data.education?.location || '',
    orgName: data.organization?.name || '',
    orgInstitution: data.organization?.institution || '',
    orgPeriod: data.organization?.period || '',
    orgActivities: Array.isArray(data.organization?.activities)
      ? data.organization.activities.join('\n')
      : data.organization?.activities || '',
    programming: data.skills?.programming?.join(', ') || '',
    database: data.skills?.database?.join(', ') || '',
    others: data.skills?.others?.join(', ') || '',
  }
}

