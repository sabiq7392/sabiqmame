export interface HeroData {
  name: string
  title: string
  subtitle: string
  description: string
  avatar: string
  cvUrl: string
  email: string
  social: {
    linkedin: string
    github: string
    email: string
    phone: string
  }
}

export interface StatData {
  label: string
  value: string
  suffix?: string
}

export interface TechStack {
  name: string
  icon?: string
  category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'database'
}

export interface SkillGroup {
  title: string
  description: string
  icon: string
  techs: string[]
}

export interface ExperienceRole {
  title: string
  period: string
  duration: string
  location?: string
  type?: string
  achievements: string[]
  skills: string[]
}

export interface ExperienceData {
  company: string
  logo?: string
  roles: ExperienceRole[]
}

export interface ProjectData {
  title: string
  subtitle: string
  description: string
  image: string
  tags: string[]
  badge?: string
  href?: string
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

export interface HomeData {
  hero: HeroData
  stats: StatData[]
  skillGroups: SkillGroup[]
  experiences: ExperienceData[]
  projects: ProjectData[]
  education: EducationData
  organization: OrganizationData
}

export const homeData: HomeData = {
  hero: {
    name: 'Sabiq Muhammad Antebing Mame',
    title: 'Generalist Software Engineer',
    subtitle: 'Building scalable systems & elegant interfaces',
    description:
      'Generalist Software Engineer with a strong track record of delivering MVPs, applications, and business-critical features under aggressive timelines. Comfortable working across different technologies, quickly adapting to new challenges, and taking ownership from idea to production. I thrive in fast-moving teams where execution, flexibility, and problem-solving are key.',
    avatar: '/me/me.jpg',
    cvUrl: '/me/cv.pdf',
    email: 'sabiqmuhammad98@gmail.com',
    social: {
      linkedin: 'https://www.linkedin.com/in/sabiq-muhammad-6b314a210/',
      github: 'https://github.com/sabiq7392',
      email: 'mailto:sabiqmuhammad98@gmail.com',
      phone: 'tel:+6285691550726',
    },
  },
  stats: [
    { label: 'Years Experience', value: '4', suffix: '+' },
    { label: 'Projects Delivered', value: '10', suffix: '+' },
    { label: 'Technologies', value: '20', suffix: '+' },
    { label: 'CV Downloads', value: '0', suffix: '' },
  ],
  skillGroups: [
    {
      title: 'Front-End',
      description: 'Crafting responsive, accessible, and performant user interfaces',
      icon: 'DesktopOutlined',
      techs: [
        'TypeScript',
        'JavaScript',
        'Dart',
        'NextJS',
        'ReactJS',
        'VueJS',
        'Flutter',
        'Figma',
      ],
    },
    {
      title: 'Back-End',
      description: 'Designing robust APIs and scalable server-side architectures',
      icon: 'CloudServerOutlined',
      techs: [
        'Node.js',
        'ExpressJS',
        'NestJS',
        'Python',
        'Flask',
        'REST API',
        'GraphQL',
      ],
    },
    {
      title: 'Database & DevOps',
      description: 'Managing data integrity, deployments, and infrastructure',
      icon: 'DatabaseOutlined',
      techs: [
        'MySQL',
        'Elasticsearch',
        'PostgreSQL',
        'MongoDB',
        'Docker',
        'AWS',
        'GitHub',
        'Rancher',
      ],
    },
  ],
  experiences: [
    {
      company: 'PT. Quantum Teknologi Nusantara',
      logo: '/icon/quantum.jpg',
      roles: [
        {
          title: 'Tech Lead — Nexiusai',
          period: 'Jan 2025 – Present',
          duration: '1 yr 5 mos',
          type: 'On-site',
          achievements: [
            'Design and implement an OCR-based document validation pipeline for PDF and Excel files, including duplicate detection, data normalization, and automated account metadata extraction prior to analysis.',
            'Building an asynchronous distributed processing architecture using RabbitMQ and Celery to orchestrate workflows for data extraction, transaction classification, result validation, and financial report generation.',
            'Developing a transaction classification engine based on the Large Language Model (LLM) that is capable of parsing each line of account mutations and automatically mapping transactions to the Chart of Accounts (COA).',
            'Design a report processing state machine workflow with end-to-end status tracking, including ingestion, payment validation, data extraction, ambiguity resolution, report generation, and delivery.',
            'Integrating Midtrans Payment Gateway through webhook-driven architecture to automate payment validation, free-trial quota management, and triggering background processing after payment is successfully received.',
            'Developed an event-driven processing mechanism that automatically publishes jobs to RabbitMQ and distributes them to Celery workers to improve scalability and fault tolerance.',
            'Building a human-in-the-loop validation system that allows admins and partners to correct extraction results and complete transactions with low confidence scores or ambiguous classifications.',
            'Implement real-time processing notification using Server-Sent Events (SSE) to monitor report processing progress directly by users.',
            'Developing a financial report generation engine that produces Balance Sheet, Profit and Loss, and Cash Flow in PDF and multi-sheet Excel formats based on validated transaction classification results.',
            'Optimize report processing through background job execution and asynchronous task orchestration to reduce user wait time and increase system throughput.',
          ],
          skills: ['Back-End', 'Celery', 'RabbitMQ', 'LLM', 'Python', 'OCR'],
        },
        {
          title: 'Tech Lead — BSMR (Badan Sertifikasi Manajemen Risiko)',
          period: 'Oct 2024 – Present',
          duration: '1 yr 8 mos',
          location: 'Jakarta, Indonesia',
          type: 'On-site',
          achievements: [
            'Developed a centralized logging system for all services, storing structured logs in Elasticsearch for monitoring and issue tracking.',
            'Deployed staging and production environments using Docker, ensuring isolated containers for backend services, MySQL, and Elasticsearch without version conflicts.',
            'Integrated payment features for certification applications, including invoice generation and payment proof uploads.',
            'Developed automated certification generation, producing official PDF certificates upon approval.',
            'Designed and implemented reporting features, displaying data in charts and tables with export options to PDF & XLSX.',
            'Implemented notifications to keep users updated on application status, payments, and certificate issuance.',
            'Implemented cron jobs for automated database backups on Ubuntu servers.',
          ],
          skills: ['Back-End', 'Front-End', 'Cloud', 'DevOps', 'Elasticsearch', 'Docker'],
        },
        {
          title: 'Full Stack Engineer — POLRI SuperApp',
          period: 'Jan 2023 – Oct 2025',
          duration: '2 yrs 10 mos',
          location: 'Greater Jakarta, Indonesia',
          type: 'On-site',
          achievements: [
            'Developed a dynamic form builder with a drag-and-drop interface, enabling effortless form creation and data organization through a dashboard, deployed on both web and mobile applications.',
            'Implemented SKCK service integration with BPJS, ensuring seamless data verification and reducing manual input errors.',
            'Integrated identity verification with Dukcapil, improving authentication for both users and the admin monitoring dashboard.',
            'Developed a logging system for services, storing structured logs in Elasticsearch for monitoring and analysis.',
            'Implemented real-time helpdesk chat.',
            'Implemented push notifications using Firebase, keeping users updated in real time.',
          ],
          skills: ['Back-End', 'Front-End', 'Mobile', 'Flutter', 'Firebase', 'Elasticsearch'],
        },
        {
          title: 'Full Stack Engineer — Patroli Perintis',
          period: 'Jan 2022 – Dec 2022',
          duration: '1 yr',
          type: 'On-site',
          achievements: [
            'Implemented a police patrol tracking system, assigning specific routes and coordinates using Google Maps API, allowing real-time tracking and task allocation.',
            'Developed an SOS feature that connects users with the nearest police officer, providing real-time route tracking for immediate response.',
          ],
          skills: ['Back-End', 'Front-End', 'Google Maps API', 'Real-time Tracking'],
        },
        {
          title: 'Full Stack Engineer — Kenangan App',
          period: 'Jan 2022 – Present',
          duration: '4 yrs 5 mos',
          type: 'Hybrid',
          achievements: [
            'Developed a dynamic homepage and shop page editor, allowing admins to customize the app’s using a drag-and-drop interface.',
            'Built a web dashboard for monitoring transactions, product availability, and blocked content.',
            'Implemented a wishlist feature, enabling users to save desired products for future purchases.',
            'Developed a user-to-user blocking feature to enhance user privacy and security.',
          ],
          skills: ['Back-End', 'Front-End', 'Mobile', 'E-Commerce', 'Drag & Drop'],
        },
      ],
    },
    {
      company: 'STT Terpadu Nurul Fikri',
      logo: '/icon/stttnf.jpg',
      roles: [
        {
          title: 'Assistant Lecturer — Web Programming',
          period: 'Oct 2021 – Mar 2022',
          duration: '6 mos',
          location: 'South Jakarta, Indonesia',
          type: 'Part-time',
          achievements: [
            'Taught Frontend Development using JavaScript, CSS, and Bootstrap Framework',
            'Provided assessments and checked student assignments',
          ],
          skills: ['Front-End', 'Teaching'],
        },
      ],
    },
    {
      company: 'GDSC STT Terpadu Nurul Fikri',
      logo: '/icon/gdscnf.jpg',
      roles: [
        {
          title: 'Frontend Lead',
          period: 'Dec 2022 – Aug 2023',
          duration: '9 mos',
          type: 'Volunteer',
          achievements: [
            'Served as Bootcamp Mentor for GDSC Upskill Academy',
            'Speaker at Frontend Intermediate Workshop',
            'Led and organized the frontend team',
          ],
          skills: ['Front-End', 'Teaching', 'Leadership'],
        },
      ],
    },
  ],
  projects: [
    {
      title: 'Nexiusai',
      subtitle: 'AI Assistant Accounting Platform',
      description:
        'AI-based assistant accounting platform that focuses on creating financial reports based on bank statements or Excel transaction data using OCR, RabbitMQ/Celery workflow orchestrations, and LLM-driven transaction classification.',
      image: '/projects/nexius.webp',
      tags: ['LLM', 'RabbitMQ', 'Celery', 'Python', 'OCR', 'Midtrans'],
      href: 'https://nexiusai.com',
    },
    {
      title: 'BSMR',
      subtitle: 'Badan Sertifikasi Manajemen Risiko',
      description:
        'Web-based certification system for training providers, streamlining application, payment, and certification issuance processes with automated PDF generation and Elasticsearch logging.',
      image: '/projects/showcase-bsmr.png',
      tags: ['Docker', 'Elasticsearch', 'PDF Generation', 'Payment Integration'],
    },
    {
      title: 'POLRI SuperApp',
      subtitle: 'Presisi — Police Public Services',
      description:
        'Comprehensive mobile application for Indonesian National Police services. Integrates SKCK, SIM, STNK, DUMAS, eSurvey, E-Tilang, and SP2HP into a single cross-platform Flutter app.',
      image: '/projects/showcase-presisi.png',
      tags: ['Flutter', 'Dynamic Forms', 'BPJS Integration', 'Push Notifications'],
      badge: 'App Store & Play Store',
    },
    {
      title: 'Patroli Perintis',
      subtitle: 'Police Patrol Tracking System',
      description:
        'Web-based monitoring system for police patrol tracking, enabling officers to monitor outgoing patrols, track assigned special operations, and analyze real-time movement using Google Maps API.',
      image: '/projects/patroli-perintis.png',
      tags: ['Google Maps API', 'Real-time Tracking', 'SOS Feature'],
    },
    {
      title: 'Kenangan',
      subtitle: 'E-Commerce Gift Platform',
      description:
        'Unique e-commerce platform enabling gift-giving without recipient addresses. Features drag-and-drop video editor, merchant management, product catalog, and a customizable homepage.',
      image: '/projects/showcase-kenangan.png',
      tags: ['E-Commerce', 'Drag & Drop Editor', 'Video Creation', 'Admin Dashboard'],
      badge: 'App Store & Play Store',
    },
  ],
  education: {
    degree: 'Bachelor of Computer Science',
    institution: 'Sekolah Tinggi Teknologi Terpadu Nurul Fikri',
    period: 'Sept 2020 – Sept 2024',
    location: 'Jakarta, Indonesia',
    image: '/icon/stttnf.jpg',
    href: 'https://nurulfikri.ac.id',
  },
  organization: {
    name: 'Google Developer Student Club (GDSC)',
    institution: 'STT Terpadu Nurul Fikri',
    period: 'Dec 2022 – Aug 2023',
    image: '/gallery/random/gdsc.webp',
    href: 'https://www.instagram.com/p/Cobie01r4Ls/',
    activities: [
      'Organized and managed frontend team members, assigning tasks and responsibilities.',
      'Led a 3-month bootcamp as an instructor, teaching frontend development concepts.',
      'Speaker for the Frontend Intermediate Workshop, delivering insights and best practices.',
    ],
  },
}
