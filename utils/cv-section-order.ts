export type SectionId = 'profile' | 'projects' | 'education' | 'organization' | 'skills'

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'profile',
  'projects',
  'education',
  'organization',
  'skills',
]

export interface SectionConfig {
  id: SectionId
  label: string
  title: string
}

export const SECTION_CONFIGS: Record<SectionId, SectionConfig> = {
  profile: {
    id: 'profile',
    label: 'Profile',
    title: 'PROFILE',
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    title: 'PROJECTS',
  },
  education: {
    id: 'education',
    label: 'Education',
    title: 'EDUCATION',
  },
  organization: {
    id: 'organization',
    label: 'Organization',
    title: 'ORGANIZATION EXPERIENCE',
  },
  skills: {
    id: 'skills',
    label: 'Skills',
    title: 'ADDITIONAL EXPERIENCE',
  },
}

