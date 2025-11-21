import { MetadataRoute } from 'next'
import { Config } from '@/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = Config.siteUrl
  const now = new Date()

  // Define all pages with their priorities and change frequencies
  const pages = [
    {
      url: baseUrl,
      priority: 1.0,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/gallery`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      url: `${baseUrl}/tools`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    },
    // Tools pages
    {
      url: `${baseUrl}/tools/base64-encoder`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/colors`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/convert-image`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/cv-maker`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/datetime-converter`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/json-beautifier`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/json-diff`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/json-to-csv`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/markdown-preview`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/password-generator`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${baseUrl}/tools/random-image`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
  ]

  return pages.map((page) => ({
    url: page.url,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}

