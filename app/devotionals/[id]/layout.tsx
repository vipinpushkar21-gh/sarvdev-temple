import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import { getDevotionalOGImage } from '@/lib/devotional-image'
import { createDevotionalSlug } from '../components/devotional-utils'
import { buildDevotionalSchema } from '@/lib/seo'

export const revalidate = 300

const BASE = 'https://sarvdev.com'

const PROJ = 'title description category categorySlug deity language audio audioUrl metaTitle metaDescription metaKeywords imageCard image'

/** Efficient lookup: O(1) for ObjectId and stored slug, minimal-stub scan for legacy title slugs. */
async function findDevotional(id: string): Promise<any | null> {
  await connectDB()
  if (mongoose.Types.ObjectId.isValid(id)) {
    const doc = await Devotional.findOne({ _id: id, status: 'approved' }, PROJ).lean()
    if (doc) return doc
  }
  const bySlug = await Devotional.findOne({ slug: id, status: 'approved' }, PROJ).lean()
  if (bySlug) return bySlug

  const stubs = await Devotional.find({ status: 'approved' }, '_id title').lean() as any[]
  const match = stubs.find((s: any) => createDevotionalSlug(s.title ?? '') === id)
  if (!match) return null
  return Devotional.findOne({ _id: match._id, status: 'approved' }, PROJ).lean()
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const { id } = await params
    const devotional = await findDevotional(id)

    if (!devotional) {
      return {
        title: 'Devotional - Sarvdev',
        description: 'Listen to bhajans, aartis, mantras and devotional lyrics on Sarvdev.',
      }
    }

    const url = `${BASE}/devotionals/${id}`
    const categoryLabel = devotional.category ?? 'Devotional'
    const deityLabel = devotional.deity ? ` - ${devotional.deity}` : ''
    const title = devotional.metaTitle ?? `${devotional.title} ${categoryLabel}${deityLabel} - Sarvdev`
    const description = devotional.metaDescription
      ?? (devotional.description
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
      'bhajan', 'aarti', 'mantra', 'devotional lyrics', 'Sarvdev',
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
    const devotional = await findDevotional(id)
    if (devotional) schemas = buildDevotionalSchema(devotional, id)
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
