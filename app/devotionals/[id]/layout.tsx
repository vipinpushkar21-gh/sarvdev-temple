import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getDevotionalOGImage } from '@/lib/devotional-image'
import { findDevotionalByRoute } from '@/lib/devotional-discovery'
import { buildDevotionalSchema } from '@/lib/seo'

export const revalidate = 300

const BASE = 'https://sarvdev.com'

const META_FIELDS =
  'title titleHi slug description category categorySlug deity language audio audioUrl metaTitle metaDescription metaKeywords imageCard image primaryMedia cardMedia ogMedia'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const { id } = await params
    const devotional = await findDevotionalByRoute(id, META_FIELDS)

    if (!devotional) {
      return {
        title: 'Devotional - Sarvdev',
        description: 'Read aartis, chalisas, stotras and mantras in the Sarvdev Bhakti Library.',
      }
    }

    const canonicalId = devotional.slug || id
    const url = `${BASE}/devotionals/${canonicalId}`
    const categoryLabel = devotional.category ?? 'Devotional'
    const deityLabel = devotional.deity ? ` - ${devotional.deity}` : ''
    const title = devotional.metaTitle ?? `${devotional.title} ${categoryLabel}${deityLabel} - Sarvdev`
    const description = devotional.metaDescription
      ?? (devotional.description
        ? devotional.description.slice(0, 155)
        : `${devotional.title} - ${categoryLabel} text${devotional.deity ? ` dedicated to ${devotional.deity}` : ''}. Read on Sarvdev.`)
    const customKeywords = typeof devotional.metaKeywords === 'string'
      ? devotional.metaKeywords.split(',').map((item: string) => item.trim()).filter(Boolean)
      : []
    const keywords = [
      ...customKeywords,
      devotional.title,
      devotional.deity,
      devotional.category,
      devotional.language,
      'devotional text', 'lyrics', 'Sarvdev',
    ].filter(Boolean) as string[]
    const ogImage = getDevotionalOGImage(devotional).src

    return {
      title,
      description,
      keywords,
      alternates: { canonical: url },
      openGraph: {
        title, description, url,
        type: 'website',
        siteName: 'Sarvdev',
        images: [{ url: ogImage, width: 1200, height: 630, alt: devotional.title }],
      },
      twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    }
  } catch {
    return { title: 'Devotional - Sarvdev' }
  }
}

export default async function DevotionalIdLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ id: string }>
}) {
  let schemas: object[] = []
  try {
    const { id } = await params
    const devotional = await findDevotionalByRoute(id, META_FIELDS)
    if (devotional) schemas = buildDevotionalSchema(devotional, devotional.slug || id)
  } catch { /* silent */ }

  return (
    <>
      {schemas.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      {children}
    </>
  )
}
