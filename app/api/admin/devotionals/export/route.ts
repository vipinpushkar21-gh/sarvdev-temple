import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import { categoryNameToSlug } from '@/lib/devotional-categories'
import { expandQuery } from '@/lib/transliteration'

export const dynamic = 'force-dynamic'

const EXPORT_HEADERS = [
  'ID',
  'Title',
  'TitleHi',
  'Slug',
  'Category',
  'CategorySlug',
  'CategoryHi',
  'Deity',
  'DeityHi',
  'DeitySlug',
  'Language',
  'Description',
  'DescriptionHi',
  'Content',
  'ContentHi',
  'Lyrics',
  'Audio',
  'AudioUrl',
  'Duration',
  'Artist',
  'Tags',
  'Aliases',
  'Featured',
  'Status',
  'Source',
  'IsCustomized',
  'MetaTitle',
  'MetaDescription',
  'MetaKeywords',
  'Image',
  'ImageCard',
  'ImageHero',
  'OgImage',
  'Thumbnail',
  'CoverImage',
  'CreatedAt',
  'UpdatedAt',
] as const

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function csvEscape(value: unknown) {
  const normalized = Array.isArray(value)
    ? value.filter(Boolean).join('; ')
    : value instanceof Date
      ? value.toISOString()
      : String(value ?? '')
  return `"${normalized.replace(/"/g, '""')}"`
}

function buildSearchRegex(value: string) {
  const terms = Array.from(new Set([value, ...expandQuery(value)].map((term) => term.trim()).filter(Boolean)))
  const pattern = terms.map(escapeRegex).join('|')
  return new RegExp(pattern || escapeRegex(value), 'i')
}

function buildFilter(searchParams: URLSearchParams) {
  const search = searchParams.get('search') || searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const status = searchParams.get('status') || ''
  const language = searchParams.get('language') || ''
  const deity = searchParams.get('deity') || ''

  const conditions: Record<string, unknown>[] = []

  if (search) {
    const regex = buildSearchRegex(search)
    conditions.push({
      $or: [
        { title: regex },
        { titleHi: regex },
        { slug: regex },
        { deity: regex },
        { deityHi: regex },
        { deitySlug: regex },
        { category: regex },
        { categoryHi: regex },
        { categorySlug: regex },
        { tags: regex },
        { aliases: regex },
      ],
    })
  }

  if (category) {
    const catSlug = categoryNameToSlug(category)
    const catOr: Record<string, unknown>[] = [{ category }]
    if (catSlug) catOr.push({ categorySlug: catSlug })
    if (category.toLowerCase() === 'namavali') catOr.push({ category: '108 Namavali' })
    conditions.push({ $or: catOr })
  }

  if (status) conditions.push({ status })
  if (language) conditions.push({ language })
  if (deity) conditions.push({ deity: { $regex: new RegExp(escapeRegex(deity), 'i') } })

  if (conditions.length === 0) return {}
  if (conditions.length === 1) return conditions[0]
  return { $and: conditions }
}

function rowForDevotional(doc: Record<string, any>) {
  return [
    doc._id?.toString?.() || '',
    doc.title,
    doc.titleHi,
    doc.slug,
    doc.category,
    doc.categorySlug,
    doc.categoryHi,
    doc.deity,
    doc.deityHi,
    doc.deitySlug,
    doc.language,
    doc.description,
    doc.descriptionHi,
    doc.content,
    doc.contentHi,
    doc.lyrics,
    doc.audio || doc.audioUrl,
    doc.audioUrl,
    doc.duration,
    doc.artist,
    doc.tags,
    doc.aliases,
    doc.featured ? 'true' : 'false',
    doc.status || 'approved',
    doc.source,
    doc.isCustomized ? 'true' : 'false',
    doc.metaTitle,
    doc.metaDescription,
    doc.metaKeywords,
    doc.image,
    doc.imageCard,
    doc.imageHero,
    doc.ogImage,
    doc.thumbnail,
    doc.coverImage,
    doc.createdAt,
    doc.updatedAt,
  ]
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { searchParams } = new URL(request.url)
  const filter = buildFilter(searchParams)
  const docs = await Devotional.find(filter, { __v: 0 })
    .sort({ createdAt: -1, _id: -1 })
    .lean()

  const csv = [
    EXPORT_HEADERS.join(','),
    ...docs.map((doc: any) => rowForDevotional(doc).map(csvEscape).join(',')),
  ].join('\n')

  const filename = `devotionals-export-${new Date().toISOString().slice(0, 10)}.csv`
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
