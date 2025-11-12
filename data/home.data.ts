export interface HeroData {
  name: string
  title: string
  description: string
  avatar: string
  cvUrl: string
  email: string
  phone: string
  social: {
    linkedin: string
    github: string
    email: string
    phone: string
  }
}

export interface AboutData {
  paragraphs: string[]
  company: {
    name: string
    startDate: string
  }
}

export interface SkillData {
  title: string
  description: string
  icon: string
}

export interface ProjectTag {
  label: string
}

export interface ProjectData {
  title: string
  company: string
  period: string
  description: string
  image?: string
  image_light?: string
  tags: ProjectTag[]
  badge?: {
    label: string
    icon: string
  }
}

export interface EducationData {
  degree: string
  institution: string
  period: string
  location: string
}

export interface OrganizationData {
  name: string
  institution: string
  period: string
  activities: string[]
}

export interface HomeData {
  hero: HeroData
  about: AboutData
  skills: SkillData[]
  projects: ProjectData[]
  education: EducationData
  organization: OrganizationData
}

export const homeData: HomeData = {
  hero: {
    name: 'Sabiq Muhammad Antebing Mame',
    title: 'Full-Stack Developer',
    description: 'Full-Stack Developer with expertise in website and backend development, specializing in building efficient, scalable, and well-structured systems. Skilled in database management, ensuring data integrity, and maintaining strict validation. Proficient in optimizing system performance and implementing seamless user experiences.',
    avatar: '/me/me.jpg',
    cvUrl: '/me/cv.pdf',
    email: 'sabiqmuhammad98@gmail.com',
    phone: '(+62) 85691550726',
    social: {
      linkedin: 'https://www.linkedin.com/in/sabiq-muhammad-6b314a210/',
      github: 'https://github.com/sabiq7392',
      email: 'mailto:sabiqmuhammad98@gmail.com',
      phone: 'tel:+6285691550726',
    },
  },
  about: {
    paragraphs: [
      "I'm a Full-Stack Developer with expertise in website and backend development, specializing in building efficient, scalable, and well-structured systems. I'm skilled in database management, ensuring data integrity, eliminating duplication, and maintaining strict validation.",
      "I'm proficient in optimizing system performance, implementing seamless user experiences, and integrating logging mechanisms for effective monitoring and issue resolution. I'm dedicated to developing secure, high-performance applications that align with business and user needs.",
      "Currently working at <strong>PT. Quantum Teknologi Nusantara</strong> since January 2022, where I've developed various web-based systems and mobile applications for government and commercial clients.",
    ],
    company: {
      name: 'PT. Quantum Teknologi Nusantara',
      startDate: 'January 2022',
    },
  },
  skills: [
    {
      title: 'Front-End Engineer',
      description: 'Building responsive and interactive user interfaces with modern frameworks',
      icon: 'DesktopOutlined',
    },
    {
      title: 'Back-End Engineer',
      description: 'Developing scalable server-side systems and APIs with robust architecture',
      icon: 'CloudServerOutlined',
    },
    {
      title: 'Mobile Engineer',
      description: 'Creating cross-platform mobile applications with native performance',
      icon: 'MobileOutlined',
    },
  ],
  projects: [
    {
      title: 'BSMR (Badan Sertifikasi Manajemen Risiko)',
      company: 'PT. Quantum Teknologi Nusantara',
      period: 'Jan 2022 - Now',
      description: 'Web-based certification system for training providers, streamlining application, payment, and certification issuance processes.',
      image: '/projects/bsmr.svg',
      image_light: '/projects/bsmr-light.svg',
      tags: [
        { label: 'Docker' },
        { label: 'Elasticsearch' },
        { label: 'PDF Generation' },
        { label: 'Payment Integration' },
      ],
    },
    {
      title: 'POLRI SuperApp',
      company: 'PT. Quantum Teknologi Nusantara',
      period: 'Jan 2022 - Now',
      description: 'Comprehensive mobile application for the public to access Indonesian National Police services, including SKCK, SIM, STNK, DUMAS, eSurvey, E-Tilang, SP2HP.',
      image: '/projects/presisi.webp',
      tags: [
        { label: 'Flutter' },
        { label: 'Dynamic Form Builder' },
        { label: 'BPJS Integration' },
        { label: 'Firebase Push Notifications' },
      ],
      badge: {
        label: 'App Store & Play Store',
        icon: 'GlobalOutlined',
      },
    },
    {
      title: 'Patroli Perintis',
      company: 'PT. Quantum Teknologi Nusantara',
      period: 'Jan 2022 - Now',
      description: 'Web-based monitoring system for police patrol tracking, enabling officers to monitor outgoing patrols, track assigned special operations, analyze real-time movement and reports.',
      image: '/projects/patroli-perintis.png',
      tags: [
        { label: 'Google Maps API' },
        { label: 'Real-time Tracking' },
        { label: 'SOS Feature' },
        { label: 'Route Tracking' },
      ],
    },
    {
      title: 'Kenangan App',
      company: 'PT. Quantum Teknologi Nusantara',
      period: 'Jan 2022 - Now',
      description: 'Unique e-commerce platform for seamless gift-giving. Enables sending gifts without needing recipient addresses, shopping for various products, and creating celebration videos.',
      image: '/projects/kenangan.svg',
      image_light: '/projects/kenangan-light.svg',
      tags: [
        { label: 'E-Commerce' },
        { label: 'Drag & Drop Editor' },
        { label: 'Video Creation' },
      ],
      badge: {
        label: 'App Store & Play Store',
        icon: 'GlobalOutlined',
      },
    },
  ],
  education: {
    degree: 'Bachelor of Computer Science',
    institution: 'Sekolah Tinggi Teknologi Terpadu Nurul Fikri',
    period: 'Sept 2020 – Sept 2024',
    location: 'Jakarta, Indonesia',
  },
  organization: {
    name: 'Google Developer Student Club (GDSC)',
    institution: 'STT Terpadu Nurul Fikri',
    period: 'Dec 2022 – Aug 2023',
    activities: [
      'Organized and managed frontend team',
      'Led 3-month bootcamp as instructor',
      'Speaker for Frontend Intermediate Workshop',
    ],
  },
}
