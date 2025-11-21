import { MetadataRoute } from 'next'
import { Config } from '@/config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = Config.siteUrl

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

