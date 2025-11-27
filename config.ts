const me = {
  name: 'Sabiq Muhammad Antebing Mame',
  alias: 'Sabiq Mame',
};

const work = {
  title: 'Full-Stack Engineer',
  description: 'Need a dev who can build a cool app, make the backend fly, and not panic when it’s time to deploy to cloud? Say less. I don’t promise perfect, but I promise done 😎',
  company: 'PT. Quantum Teknologi Nusantara',
  companyUrl: 'https://quantumteknologi.com',
};

export const Config = {
  siteUrl: 'https://sabiq.pro',
  socialMedia: {
    github: 'github.sabiq.pro',
    linkedin: 'linkedin.sabiq.pro',
    email: 'me@sabiq.pro',
  },
  me,
  work,
  keywords: [
    'Full-Stack Engineer',
    'Web Developer',
    'Backend Developer',
    'Frontend Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Portfolio',
    'Full-Stack Engineer Portfolio',
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

