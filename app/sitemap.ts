import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sarvdev.com'
  const now = new Date()

  const staticPages = [
    '',
    '/temples',
    '/devotionals',
    '/events',
    '/blog',
    '/panchang',
    '/daily-darshan',
    '/booking',
    '/deities',
    '/spiritual-icons',
    '/sacred-categories',
    '/bookmarks',
    '/contact',
    '/help',
    '/list-temple',
    '/about',
    '/privacy',
    '/terms',
  ]

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : path === '/temples' || path === '/devotionals' ? 0.9 : 0.7,
  }))
}
