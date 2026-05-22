import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { connectDB } from '@/lib/db'
import { getStaticSpiritualIconsForSeed, normalizeSpiritualIcon } from '@/lib/spiritual-icons'
import SpiritualIcon from '@/models/SpiritualIcon'
import { getTempleHeroImage } from '@/lib/temple-image'

export const revalidate = 300

const BASE = 'https://sarvdev.com'

type Params = { params: Promise<{ slug: string }> }

async function getIconBySlug(slug: string) {
  try {
    await connectDB()
    const dbIcon = await SpiritualIcon.findOne({ slug, status: 'active' }, { __v: 0 }).lean()
    if (dbIcon) return normalizeSpiritualIcon(dbIcon)
  } catch {}

  return getStaticSpiritualIconsForSeed().find((icon) => icon.slug === slug) || null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const icon = await getIconBySlug(slug)

  if (!icon) {
    return {
      title: 'Spiritual Icon - Sarvdev',
      description: 'Explore spiritual icons, katha vachaks, bhajan gayaks, pandits and gurus on Sarvdev.',
    }
  }

  const url = `${BASE}/spiritual-icons/${icon.slug}`
  const title = icon.metaTitle || `${icon.name} - ${icon.category || 'Spiritual Icon'} | Sarvdev`
  const description = icon.metaDescription
    || icon.shortBio
    || icon.fullBio
    || `Explore ${icon.name}${icon.title ? `, ${icon.title}` : ''} on Sarvdev.`
  const image = getTempleHeroImage({
    imageHero: icon.ogImage || icon.imageHero || icon.imageCard || icon.image || '',
    image: icon.ogImage || icon.imageHero || icon.imageCard || icon.image || '',
  }).src

  return {
    title,
    description: description.slice(0, 180),
    keywords: [
      icon.name,
      icon.nameHi,
      icon.category,
      icon.title,
      icon.state,
      icon.city,
      ...(icon.languages || []),
      ...(icon.specializations || []),
      'Sarvdev',
    ].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description.slice(0, 180),
      url,
      type: 'profile',
      siteName: 'Sarvdev',
      images: [{ url: image, width: 1200, height: 630, alt: icon.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 180),
      images: [image],
    },
  }
}

export default function SpiritualIconSlugLayout({ children }: { children: ReactNode }) {
  return children
}
