import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getCategoryDescription, getCategoryInfo } from '../../components/devotional-utils'

const BASE = 'https://sarvdev.com'
const OG = `${BASE}/opengraph-image`

function titleCase(slug: string) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryInfo(slug)
  const label = category?.label || titleCase(slug)
  const description = category?.description || getCategoryDescription(label)
  const url = `${BASE}/devotionals/category/${slug}`

  return {
    title: `${label} Lyrics, Audio and Devotionals - Sarvdev`,
    description,
    alternates: { canonical: url },
    keywords: [label, `${label} lyrics`, `${label} audio`, 'Hindi devotional lyrics', 'Sarvdev'],
    openGraph: {
      title: `${label} Devotionals - Sarvdev`,
      description,
      url,
      type: 'website',
      siteName: 'Sarvdev',
      images: [{ url: OG, width: 1200, height: 630, alt: `${label} Devotionals` }],
    },
    twitter: { card: 'summary_large_image', title: `${label} Devotionals - Sarvdev`, description, images: [OG] },
  }
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return children
}

