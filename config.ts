const me = {
  name: 'Sabiq Muhammad Antebing Mame',
  alias: 'Sabiq Mame',
};

const work = {
  title: 'Generalist Software Engineer',
  description: 'Generalist Software Engineer with a strong track record of delivering MVPs, applications, and business-critical features under aggressive timelines. Adapting quickly to new challenges, from idea to production.',
  company: 'PT. Quantum Teknologi Nusantara',
  companyUrl: 'https://quantumteknologi.com',
};

export const Config = {
  siteUrl: 'https://sabiq.id',
  socialMedia: {
    github: 'https://github.com/sabiq7392',
    linkedin: 'https://www.linkedin.com/in/sabiq-muhammad-6b314a210/',
    email: 'sabiqmuhammad98@gmail.com',
  },
  me,
  work,
  keywords: [
    'Generalist Software Engineer',
    'Software Engineer',
    'Web Developer',
    'Backend Developer',
    'Frontend Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'RabbitMQ',
    'Celery',
    'Docker',
    'Portfolio',
    'Generalist Software Engineer Portfolio',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: me.alias,
    title: `${me.alias} | ${work.title}`,
    description: work.description,
    images: [
      {
        url: '/me/me.jpg',
        width: 1200,
        height: 630,
        alt: me.alias,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${me.alias} | ${work.title}`,
    description: work.description,
    images: ['/me/me.jpg'],
  },
};

