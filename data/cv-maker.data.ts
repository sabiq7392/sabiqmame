export interface CVData {
  personalInfo: {
    name: string
    phone: string
    email: string
    linkedin: string
  }
  profile: string
  projects: CVProject[]
  education: CVEducation
  organization: CVOrganization
  skills: {
    programming: string[]
    database: string[]
    others: string[]
  }
}

export interface CVProject {
  title: string
  company: string
  period: string
  description: string
  achievements: string[]
  availableOn?: string
}

export interface CVEducation {
  degree: string
  institution: string
  period: string
  location: string
}

export interface CVOrganization {
  name: string
  institution: string
  period: string
  activities: string[]
}

export const defaultCVData: CVData = {
  personalInfo: {
    name: '',
    phone: '',
    email: '',
    linkedin: '',
  },
  profile: '',
  projects: [],
  education: {
    degree: '',
    institution: '',
    period: '',
    location: '',
  },
  organization: {
    name: '',
    institution: '',
    period: '',
    activities: [],
  },
  skills: {
    programming: [],
    database: [],
    others: [],
  },
}
