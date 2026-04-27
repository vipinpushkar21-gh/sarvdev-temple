import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/temples/avno1ltpdyzpzsby1mll.jpg'

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

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const { id } = await params
    await connectDB()
    const devotionals = await Devotional.find(
      { status: 'approved' },
      'title description category deity language'
    ).lean() as any[]

    const devotional = devotionals.find((d: any) => devotionalSlug(d.title) === id)

    if (!devotional) {
      return {
        title: 'Devotional — Sarvdev',
        description: 'Listen to bhajans, aartis and mantras on Sarvdev.',
      }
    }

    const url = `${BASE}/devotionals/${id}`
    const categoryLabel = devotional.category || 'Devotional'
    const deityLabel = devotional.deity ? ` — ${devotional.deity}` : ''
    const title = `${devotional.title} ${categoryLabel}${deityLabel} — Sarvdev`
    const description = devotional.description
      ? devotional.description.slice(0, 155)
      : `${devotional.title} — ${categoryLabel} lyrics, meaning and audio${devotional.deity ? ` dedicated to ${devotional.deity}` : ''}. Stream on Sarvdev.`
    const keywords = [
      devotional.title,
      devotional.deity,
      devotional.category,
      devotional.language,
      'bhajan', 'aarti', 'mantra', 'devotional lyrics', 'Sarvdev',
    ].filter(Boolean) as string[]

    return {
      title,
      description,
      keywords,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        siteName: 'Sarvdev',
        images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630, alt: devotional.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [DEFAULT_IMAGE],
      },
    }
  } catch {
    return { title: 'Devotional — Sarvdev' }
  }
}

export default function DevotionalIdLayout({ children }: { children: React.ReactNode }) {
  return children
}
