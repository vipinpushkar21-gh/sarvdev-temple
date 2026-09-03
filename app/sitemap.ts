/**
 * Scalable sitemap architecture using Next.js generateSitemaps().
 *
 * ID scheme:
 *   0  — static pages (landing + stories + festival events)
 *   1  — deities
 *   2  — devotionals
 *   3  — blogs
 *   4  — categories (states, cities, pilgrimage, regions, devotional cats)
 *   5+ — temple chunks (CHUNK_SIZE temples each)
 *
 * At 11L temples with CHUNK_SIZE=5000 → up to 220 temple sitemaps.
 * Next.js auto-builds a sitemap index at /sitemap.xml pointing to
 * /sitemap/0.xml … /sitemap/N.xml  (one per id returned by generateSitemaps).
 */

import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Blog from '@/models/Blog'
import Devotional from '@/models/Devotional'
import Deity from '@/models/Deity'
import { SACRED_CATEGORIES } from '@/lib/sacred-categories'
import { hinduEvents } from '@/data/events'
import { BASE_URL } from '@/lib/seo'

export const revalidate = 3600   // regenerate all sitemaps hourly

const CHUNK_SIZE    = 5000
const STATIC_ID     = 0
const DEITIES_ID    = 1
const DEVOTIONS_ID  = 2
const BLOGS_ID      = 3
const CATS_ID       = 4
const TEMPLES_OFFSET = 5
const SITEMAP_DB_TIMEOUT_MS = 8000

function sl(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function connectSitemapDB() {
  await Promise.race([
    connectDB(),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Sitemap DB connection timeout')), SITEMAP_DB_TIMEOUT_MS)
    }),
  ])
}

async function templeChunkCount(): Promise<number> {
  try {
    await connectSitemapDB()
    const n = await Temple.countDocuments({ status: 'approved' })
    return Math.max(1, Math.ceil(n / CHUNK_SIZE))
  } catch {
    return 1
  }
}

export async function generateSitemaps(): Promise<{ id: number }[]> {
  const maps: { id: number }[] = [
    { id: STATIC_ID },
    { id: DEITIES_ID },
    { id: DEVOTIONS_ID },
    { id: BLOGS_ID },
    { id: CATS_ID },
  ]
  const chunks = await templeChunkCount()
  for (let i = 0; i < chunks; i++) maps.push({ id: TEMPLES_OFFSET + i })
  return maps
}

export default async function sitemap(
  { id }: { id: number }
): Promise<MetadataRoute.Sitemap> {
  if (id === STATIC_ID)    return staticSitemap()
  if (id === DEITIES_ID)   return deitiesSitemap()
  if (id === DEVOTIONS_ID) return devotionalsSitemap()
  if (id === BLOGS_ID)     return blogsSitemap()
  if (id === CATS_ID)      return categoriesSitemap()
  return templesSitemap(id - TEMPLES_OFFSET)
}

// ── Static pages ──────────────────────────────────────────────────────────────

function staticSitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                         lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/temples`,            lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/devotionals`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/events`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/upcoming-events`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/blog`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/panchang`,           lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/daily-darshan`,      lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/live-darshan`,       lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/deities`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/spiritual-icons`,    lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/temples/pilgrimage`, lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE_URL}/stories`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/forum`,              lastModified: now, changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE_URL}/booking`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/about`,              lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/list-temple`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/help`,               lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms`,              lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/editorial-policy`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/contributors`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]

  const storySlugs = [
    'top-shiva-temples-in-india', 'best-krishna-temples-in-india', 'most-powerful-hanuman-temples',
    'famous-durga-devi-temples', 'ancient-temples-of-south-india', 'sacred-temples-of-uttarakhand',
    'holy-temples-of-varanasi', 'ganesh-temples-in-india', 'ram-temples-in-india',
    'jyotirlinga-temples', 'iskcon-temples-in-india', 'shakti-peeth-temples',
    'temples-in-rajasthan', 'temples-in-maharashtra', 'temples-near-rivers',
  ]
  storySlugs.forEach(s => pages.push({
    url: `${BASE_URL}/stories/${s}`, lastModified: now, changeFrequency: 'weekly', priority: 0.75,
  }))

  hinduEvents.filter(e => e.slug).forEach(e => pages.push({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return pages
}

// ── Deities ───────────────────────────────────────────────────────────────────

async function deitiesSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectSitemapDB()
    const docs = await Deity.find(
      { status: { $ne: 'rejected' }, slug: { $exists: true, $ne: '' } },
      'slug updatedAt createdAt'
    ).lean() as any[]
    return docs.map(d => ({
      url: `${BASE_URL}/deities/${d.slug}`,
      lastModified: new Date(d.updatedAt ?? d.createdAt ?? new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch { return [] }
}

// ── Devotionals ───────────────────────────────────────────────────────────────

async function devotionalsSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectSitemapDB()
    const docs = await Devotional.find(
      { status: 'approved' },
      '_id slug updatedAt createdAt'
    ).lean() as any[]
    return docs.map((d: any) => ({
      url: `${BASE_URL}/devotionals/${d.slug || d._id.toString()}`,
      lastModified: new Date(d.updatedAt ?? d.createdAt ?? new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch { return [] }
}

// ── Blogs ─────────────────────────────────────────────────────────────────────

async function blogsSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectSitemapDB()
    const docs = await Blog.find({}, '_id slug updatedAt createdAt').lean() as any[]
    return docs.map((b: any) => ({
      url: `${BASE_URL}/blog/${b.slug ?? b._id.toString()}`,
      lastModified: new Date(b.updatedAt ?? b.createdAt ?? new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch { return [] }
}

// ── Categories ────────────────────────────────────────────────────────────────

async function categoriesSitemap(): Promise<MetadataRoute.Sitemap> {
  const now   = new Date()
  const pages: MetadataRoute.Sitemap = []

  SACRED_CATEGORIES.filter(c => c.isActive).forEach(c => pages.push({
    url: `${BASE_URL}/temples/pilgrimage/${c.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8,
  }))
  ;['north-india', 'south-india', 'east-india', 'west-india', 'central-india'].forEach(r => pages.push({
    url: `${BASE_URL}/temples/region/${r}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8,
  }))

  try {
    await connectSitemapDB()
    const temples = await Temple.find({ status: 'approved' }, 'state city').lean() as any[]
    const states  = Array.from(new Set(temples.map((t: any) => t.state).filter(Boolean))) as string[]
    const cities  = Array.from(new Set(temples.map((t: any) => t.city).filter(Boolean))).slice(0, 2000) as string[]

    states.forEach(s => pages.push({ url: `${BASE_URL}/temples/state/${sl(s)}`,     lastModified: now, changeFrequency: 'weekly', priority: 0.8 }))
    cities.forEach(c => {
      pages.push({ url: `${BASE_URL}/temples/city/${sl(c)}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 })
      pages.push({ url: `${BASE_URL}/temples/near/${sl(c)}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 })
    })

    const devs    = await Devotional.find({ status: 'approved' }, 'category categorySlug').lean() as any[]
    const devCats = Array.from(new Set(devs.map((d: any) => d.categorySlug ?? sl(d.category ?? '')).filter(Boolean))) as string[]
    devCats.forEach(c => pages.push({ url: `${BASE_URL}/devotionals/category/${c}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 }))
  } catch { /* static categories still returned */ }

  return pages
}

// ── Temple chunks ─────────────────────────────────────────────────────────────

async function templesSitemap(chunk: number): Promise<MetadataRoute.Sitemap> {
  try {
    await connectSitemapDB()
    const docs = await Temple.find(
      { status: 'approved', slug: { $exists: true, $ne: '' } },
      'slug imageCard image updatedAt createdAt'
    )
      .sort({ createdAt: 1, _id: 1 })
      .skip(chunk * CHUNK_SIZE)
      .limit(CHUNK_SIZE)
      .lean() as any[]

    return docs.map((t: any) => ({
      url: `${BASE_URL}/temples/${t.slug}`,
      lastModified: new Date(t.updatedAt ?? t.createdAt ?? new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      ...(t.imageCard ?? t.image ? { images: [t.imageCard ?? t.image] } : {}),
    }))
  } catch { return [] }
}
