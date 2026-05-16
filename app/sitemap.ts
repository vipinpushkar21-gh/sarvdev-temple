import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Blog from '@/models/Blog'
import Devotional from '@/models/Devotional'
import { hinduEvents } from '@/data/events'

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
    { url: `${BASE}/upcoming-events`, lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/blog`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/panchang`,        lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/daily-darshan`,   lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/sacred-categories`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/forum`,           lastModified: now, changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE}/booking`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/deities`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/spiritual-icons`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`,         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/list-temple`,     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/help`,            lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/stories`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/stories/top-shiva-temples-in-india`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/best-krishna-temples-in-india`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/most-powerful-hanuman-temples`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/famous-durga-devi-temples`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/ancient-temples-of-south-india`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/sacred-temples-of-uttarakhand`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/holy-temples-of-varanasi`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/ganesh-temples-in-india`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/ram-temples-in-india`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stories/jyotirlinga-temples`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/disclaimer`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/editorial-policy`, lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/contributors`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]

  // ── Festival/Event pages from static data ──
  const festivalPages: MetadataRoute.Sitemap = hinduEvents
    .filter(e => e.slug)
    .map(e => ({
      url: `${BASE}/events/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  try {
    await connectDB()

    const [temples, blogs, devotionals] = await Promise.all([
      Temple.find({ status: 'approved' }, 'title slug state city deity image createdAt').lean() as Promise<any[]>,
      Blog.find({}, 'title slug createdAt').lean() as Promise<any[]>,
      Devotional.find({ status: 'approved' }, 'title createdAt').lean() as Promise<any[]>,
    ])

    const templePages: MetadataRoute.Sitemap = temples.map((t: any) => ({
      url: `${BASE}/temples/${t.slug || slugify(t.title)}`,
      lastModified: new Date(t.createdAt || now),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      ...(t.image && { images: [t.image] }),
    }))

    const blogPages: MetadataRoute.Sitemap = blogs.map((b: any) => ({
      url: `${BASE}/blog/${b.slug || b._id.toString()}`,
      lastModified: new Date(b.createdAt || now),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    const devotionalPages: MetadataRoute.Sitemap = devotionals.map((d: any) => ({
      url: `${BASE}/devotionals/${d._id.toString()}`,
      lastModified: new Date(d.createdAt || now),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    // ── State-wise landing pages ──
    const states = Array.from(new Set(temples.map((t: any) => t.state).filter(Boolean))) as string[]
    const statePages: MetadataRoute.Sitemap = states.map(s => ({
      url: `${BASE}/temples/state/${slugify(s)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // ── Deity-wise landing pages ──
    const deities = Array.from(new Set(temples.map((t: any) => t.deity).filter(Boolean))) as string[]
    const deityPages: MetadataRoute.Sitemap = deities.map(d => ({
      url: `${BASE}/temples/deity/${slugify(d)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // ── City-wise landing pages ──
    const cities = Array.from(new Set(temples.map((t: any) => t.city).filter(Boolean))) as string[]
    const cityPages: MetadataRoute.Sitemap = cities.map(c => ({
      url: `${BASE}/temples/city/${slugify(c)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // ── Pilgrimage cluster pages ──
    const pilgrimageSlugs = [
      'jyotirlinga', 'char-dham', 'shakti-peeth', 'chota-char-dham',
      'panch-kedar', 'divya-desam', 'ashta-vinayak', 'navagraha',
      'pancha-bhoota-stalam', 'sapta-puri',
      'iskcon', 'ramayana-circuit', 'panch-prayag', 'arupadai-veedu', '108-shiva-temples',
    ]
    const pilgrimagePages: MetadataRoute.Sitemap = pilgrimageSlugs.map(s => ({
      url: `${BASE}/temples/pilgrimage/${s}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // ── District-level landing pages (aliases city pages for broader coverage) ──
    const districtPages: MetadataRoute.Sitemap = cities.map(c => ({
      url: `${BASE}/temples/district/${slugify(c)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // ── Pilgrimage index hub ──
    const pilgrimageHub: MetadataRoute.Sitemap = [{
      url: `${BASE}/temples/pilgrimage`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }]

    // ── Near-me / local discovery pages ──
    const nearMePages: MetadataRoute.Sitemap = cities.map(c => ({
      url: `${BASE}/temples/near/${slugify(c)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // ── Regional network pages ──
    const regionSlugs = ['north-india', 'south-india', 'east-india', 'west-india', 'central-india']
    const regionPages: MetadataRoute.Sitemap = regionSlugs.map(r => ({
      url: `${BASE}/temples/region/${r}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // ── Story collection pages (Discover) ──
    const storySlugs = [
      'top-shiva-temples-in-india', 'best-krishna-temples-in-india', 'most-powerful-hanuman-temples',
      'famous-durga-devi-temples', 'ancient-temples-of-south-india', 'sacred-temples-of-uttarakhand',
      'holy-temples-of-varanasi', 'ganesh-temples-in-india', 'ram-temples-in-india', 'jyotirlinga-temples',
      'iskcon-temples-in-india', 'shakti-peeth-temples', 'temples-in-rajasthan', 'temples-in-maharashtra', 'temples-near-rivers',
    ]
    const storyPages: MetadataRoute.Sitemap = [
      { url: `${BASE}/stories`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
      ...storySlugs.map(s => ({
        url: `${BASE}/stories/${s}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      })),
    ]

    // ── Forum pages ──
    const forumPages: MetadataRoute.Sitemap = [{
      url: `${BASE}/forum`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }]

    return [...staticPages, ...festivalPages, ...statePages, ...deityPages, ...cityPages, ...districtPages, ...pilgrimageHub, ...pilgrimagePages, ...nearMePages, ...regionPages, ...storyPages, ...forumPages, ...templePages, ...blogPages, ...devotionalPages]
  } catch {
    return [...staticPages, ...festivalPages]
  }
}
