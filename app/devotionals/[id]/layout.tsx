import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import { getDevotionalOGImage } from '@/lib/devotional-image'
import { categoryToSlug, createDevotionalSlug } from '../components/devotional-utils'

export const revalidate = 300

const BASE = 'https://sarvdev.com'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const { id } = await params
    await connectDB()
    const devotionals = await Devotional.find(
      { status: 'approved' },
      'title description category deity language metaTitle metaDescription metaKeywords'
    ).lean() as any[]

    const foundDevotional = devotionals.find((item: any) => createDevotionalSlug(item.title || '') === id || item._id?.toString() === id)

    if (!foundDevotional) {
      return {
        title: 'Devotional - Sarvdev',
        description: 'Listen to bhajans, aartis, mantras and devotional lyrics on Sarvdev.',
      }
    }

    const devotional = foundDevotional
    const url = `${BASE}/devotionals/${id}`
    const categoryLabel = devotional.category || 'Devotional'
    const deityLabel = devotional.deity ? ` - ${devotional.deity}` : ''
    const title = devotional.metaTitle || `${devotional.title} ${categoryLabel}${deityLabel} - Sarvdev`
    const description = devotional.metaDescription
      || (devotional.description
        ? devotional.description.slice(0, 155)
        : `${devotional.title} - ${categoryLabel} lyrics, meaning and audio${devotional.deity ? ` dedicated to ${devotional.deity}` : ''}. Stream on Sarvdev.`)
    const customKeywords = typeof devotional.metaKeywords === 'string'
      ? devotional.metaKeywords.split(',').map((item: string) => item.trim()).filter(Boolean)
      : []
    const keywords = [
      ...customKeywords,
      devotional.title,
      devotional.deity,
      devotional.category,
      devotional.language,
      'bhajan',
      'aarti',
      'mantra',
      'devotional lyrics',
      'Sarvdev',
    ].filter(Boolean) as string[]
    const ogImage = getDevotionalOGImage(devotional).src

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
        images: [{ url: ogImage, width: 1200, height: 630, alt: devotional.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
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
  let breadcrumbLd: object | null = null
  try {
    const { id } = await params
    await connectDB()
    const devotionals = await Devotional.find({ status: 'approved' }, 'title category').lean() as any[]
    const devotional = devotionals.find((item: any) => createDevotionalSlug(item.title || '') === id || item._id?.toString() === id)
    if (devotional) {
      breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Devotionals', item: `${BASE}/devotionals` },
          ...(devotional.category ? [{
            '@type': 'ListItem',
            position: 3,
            name: devotional.category,
            item: `${BASE}/devotionals/category/${categoryToSlug(devotional.category)}`,
          }] : []),
          { '@type': 'ListItem', position: devotional.category ? 4 : 3, name: devotional.title, item: `${BASE}/devotionals/${id}` },
        ],
      }
    }
  } catch {}

  return (
    <>
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      {children}
    </>
  )
}
