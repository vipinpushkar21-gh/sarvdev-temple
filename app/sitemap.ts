import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Blog from '@/models/Blog'
import Devotional from '@/models/Devotional'

const BASE = 'https://sarvdev.com'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const TRANSLIT: Record<string, string> = {
  'श्री': 'shri', 'गणेश': 'ganesh', 'आरती': 'aarti',
  'चालीसा': 'chalisa', 'मंत्र': 'mantra', 'स्तोत्र': 'stotra', 'भजन': 'bhajan',
}

function devotionalSlug(title: string): string {
  const englishMatch = title.match(/\(([^)]+)\)/)
  let text = englishMatch ? englishMatch[1] : title
  Object.entries(TRANSLIT).forEach(([hi, en]) => { text = text.replace(new RegExp(hi, 'g'), en) })
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/temples`,         lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/devotionals`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/events`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/blog`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/panchang`,        lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/daily-darshan`,   lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/sacred-categories`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/booking`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/deities`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/spiritual-icons`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`,         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/list-temple`,     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  try {
    await connectDB()

    const [temples, blogs, devotionals] = await Promise.all([
      Temple.find({ status: 'approved' }, 'title createdAt').lean() as Promise<any[]>,
      Blog.find({}, 'title createdAt').lean() as Promise<any[]>,
      Devotional.find({ status: 'approved' }, 'title createdAt').lean() as Promise<any[]>,
    ])

    const templePages: MetadataRoute.Sitemap = temples.map((t: any) => ({
      url: `${BASE}/temples/${slugify(t.title)}`,
      lastModified: new Date(t.createdAt || now),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    const blogPages: MetadataRoute.Sitemap = blogs.map((b: any) => ({
      url: `${BASE}/blog/${b._id.toString()}`,
      lastModified: new Date(b.createdAt || now),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    const devotionalPages: MetadataRoute.Sitemap = devotionals.map((d: any) => ({
      url: `${BASE}/devotionals/${devotionalSlug(d.title)}`,
      lastModified: new Date(d.createdAt || now),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticPages, ...templePages, ...blogPages, ...devotionalPages]
  } catch {
    return staticPages
  }
}
