import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/temples/avno1ltpdyzpzsby1mll.jpg'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    await connectDB()
    const temples = await Temple.find(
      { status: 'approved' },
      'title description image city state deity templeType'
    ).lean() as any[]

    const temple = temples.find((t: any) => slugify(t.title) === slug)

    if (!temple) {
      return {
        title: 'Temple — Sarvdev',
        description: 'Explore sacred temples on Sarvdev.',
      }
    }

    const locationParts = [temple.city, temple.state].filter(Boolean)
    const location = locationParts.join(', ')
    const title = `${temple.title} — Sarvdev`
    const description = temple.description
      ? temple.description.replace(/<[^>]+>/g, '').slice(0, 155)
      : `Explore ${temple.title}${location ? ` in ${location}` : ''}${temple.deity ? `, dedicated to ${temple.deity}` : ''}. Find timings, history and more on Sarvdev.`
    const image = temple.image || DEFAULT_IMAGE
    const url = `${BASE}/temples/${slug}`
    const keywords = [
      temple.title,
      temple.deity,
      temple.city,
      temple.state,
      temple.templeType,
      'temple',
      'mandir',
      'darshan',
      'Hindu temple India',
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
        images: [{ url: image, width: 1200, height: 630, alt: temple.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    }
  } catch {
    return { title: 'Temple — Sarvdev' }
  }
}

export default function TempleSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
