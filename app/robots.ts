import type { MetadataRoute } from 'next'

const DISALLOW = [
  '/admin/',
  '/api/',
  '/login',
  '/maintenance',
  '/temple-portal',
  '/pandit-portal',
  '/online-booking',
  '/user/',
  '/bookmarks',
  '/import',
  '/search',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: DISALLOW,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: DISALLOW,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: 'https://sarvdev.com/sitemap.xml',
    host: 'https://sarvdev.com',
  }
}
