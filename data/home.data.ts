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
  image: string
  href: string
}

export interface OrganizationData {
  name: string
  institution: string
  period: string
  image: string
  activities: string[]
  href: string
}

export interface ExperienceRole {
  title: string
  period: string
  duration?: string
  location?: string
  type?: string
  achievements: string[]
  skills?: string[]
  isCoreTeam?: boolean
}

export interface ExperienceData {
  company: string
  employmentType: string
  logo?: string
  roles: ExperienceRole[]
}

export interface HomeData {
  hero: HeroData
  about: AboutData
  skills: SkillData[]
  projects: ProjectData[]
  education: EducationData
  organization: OrganizationData
  experiences: ExperienceData[]
}

export const homeData: HomeData = {
  hero: {
    name: 'Sabiq Muhammad Antebing Mame',
    title: 'Full-Stack Engineer',
    description: 'Need a dev who can build a cool app, make the backend fly, and not panic when it’s time to deploy to cloud? Say less. I don’t promise perfect, but I promise done 😎',
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
      "I'm a Full-Stack Engineer with expertise in website and backend development, specializing in building efficient, scalable, and well-structured systems. I'm skilled in database management, ensuring data integrity, eliminating duplication, and maintaining strict validation.",
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
    image: '/icon/stttnf.jpg',
    href: 'hhttps://nurulfikri.ac.id',
  },
  organization: {
    name: 'Google Developer Student Club (GDSC)',
    institution: 'STT Terpadu Nurul Fikri',
    period: 'Dec 2022 – Aug 2023',
    image: '/gallery/random/gdsc.webp',
    href: 'https://www.instagram.com/p/Cobie01r4Ls/',
    activities: [
      'Organized and managed frontend team',
      'Led 3-month bootcamp as instructor',
      'Speaker for Frontend Intermediate Workshop',
    ],
  },
  experiences: [
    {
      company: 'Quantum Teknologi (Nusantara)',
      employmentType: 'Purnawaktu',
      logo: '/icon/quantum.jpg',
      roles: [
        {
          title: 'Full Stack Engineer at National Certificate Management Project',
          period: 'Okt 2024 - Saat ini',
          location: 'Jakarta, Indonesia',
          type: 'Di lokasi',
          achievements: [
            'Developed a centralized logging system for all services, storing structured logs in Elasticsearch for monitoring and issue tracking.',
            'Deployed staging and production environments using Docker, ensuring isolated containers for backend services, MySQL, and Elasticsearch without version conflicts.',
            'Integrated payment features for certification applications, including invoice generation and payment proof uploads.',
            'Developed automated certification generation, producing official PDF certificates upon approval.',
            'Designed and implemented reporting features, displaying data in charts and tables with export options to PDF & XLSX.',
            'Implemented notifications to keep users updated on application status, payments, and certificate issuance.',
            'Implemented cron jobs for automated database backups on Ubuntu servers',
          ],
          skills: ['Back-End', 'Front-End', 'Cloud'],
        },
        {
          title: 'Full Stack Engineer at Kenangan E-Commerce Project',
          period: 'Jan 2022 - Saat ini',
          type: 'Gabungan',
          achievements: [
            'Implemented a comprehensive product purchasing system, streamlining the customer experience',
            'Designed and deployed functionality for reporting inappropriate comments on videos',
            'Developed user reporting mechanisms to enhance platform safety',
            'Created a robust user-blocking feature to ensure a secure environment',
            'Integrated advanced camera functionality with custom filters for enhanced user engagement',
            'Built an admin dashboard with detailed analytics to support data-driven decision-making',
            'Developed a merchant and shop management system for streamlined e-commerce operations',
            'Engineered a product management system for efficient catalog management',
            'Designed a customizable mobile application homepage tailored to individual user preferences',
            'Developed a dynamic content management system for articles',
            'Created a responsive and user-friendly landing page (https://kenangan.com)',
          ],
          skills: ['Back-End', 'Front-End'],
        },
        {
          title: 'Full Stack Engineer at Police Integration Service Application Project',
          period: 'Jan 2023 - Okt 2025',
          location: 'Jakarta Raya, Indonesia',
          type: 'Di lokasi',
          isCoreTeam: true,
          achievements: [
            'Developed an interactive dashboard to monitor and manage service integration in real-time',
            'Built a mobile application that enables quick and easy access to various public services',
            'Developed a landing page website designed to promote and provide information about the services',
            'Developed the web version of the mobile application to ensure broad accessibility for users across various devices',
          ],
          skills: ['Back-End', 'Front-End', 'Mobile'],
        },
      ],
    },
    {
      company: 'GDSC : STT Terpadu Nurul Fikri',
      employmentType: 'Frontend Lead',
      logo: '/icon/gdscnf.jpg',
      roles: [
        {
          title: 'Frontend Lead',
          period: 'Des 2022 - Agu 2023',
          achievements: [
            'Bootcamp Mentor GDSC Upskill Academy',
            'Speaker Workshop Frontend Intermediate',
          ],
          skills: ['Front-End', 'Teaching', 'Lead'],
        },
      ],
    },
    {
      company: 'Sekolah Tinggi Teknologi Terpadu Nurul Fikri',
      employmentType: 'Assistant Lecturer of Web Programming',
      logo: '/icon/stttnf.jpg',
      roles: [
        {
          title: 'Assistant Lecturer of Web Programming',
          period: 'Okt 2021 - Mar 2022',
          location: 'Jakarta Selatan, Jakarta Raya, Indonesia',
          achievements: [
            'Teach Frontend Development using JavaScript, CSS, Bootstrap Framework',
            'Provide assessments and check assignments to students',
          ],
          skills: ['Front-End', 'Teaching'],
        },
      ],
    },
  ],
}
