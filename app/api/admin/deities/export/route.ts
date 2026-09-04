import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Deity from '@/models/Deity'

export const dynamic = 'force-dynamic'

const HEADERS = [
  'ID', 'Name', 'NameHi', 'Slug', 'StaticSlug', 'Description', 'DescriptionHi', 'Mantra',
  'Attributes', 'Categories', 'Aliases', 'SlugAliases', 'Image', 'ImageCard', 'ImageHero',
  'Images', 'OgImage', 'Order', 'Status', 'Source', 'MetaTitle', 'MetaDescription', 'MetaKeywords',
] as const

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  return Boolean(token && verifyToken(token)?.role === 'admin')
}

function csvEscape(value: unknown) {
  const normalized = Array.isArray(value) ? value.join('; ') : value instanceof Date ? value.toISOString() : String(value ?? '')
  return `"${normalized.replace(/"/g, '""')}"`
}

function rowForDeity(deity: Record<string, any>) {
  return [
    deity._id, deity.name, deity.nameHi, deity.slug, deity.staticSlug, deity.description, deity.descriptionHi,
    deity.mantra, deity.attributes, deity.categories?.length ? deity.categories : deity.category, deity.aliases,
    deity.slugAliases, deity.image, deity.imageCard, deity.imageHero, deity.images, deity.ogImage, deity.order,
    deity.status, deity.source, deity.metaTitle, deity.metaDescription, deity.metaKeywords,
  ]
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const docs = await Deity.find({}, { __v: 0 }).sort({ order: 1, createdAt: -1 }).lean()
  const csv = [HEADERS.join(','), ...docs.map((deity: any) => rowForDeity(deity).map(csvEscape).join(','))].join('\n')
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="deities-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
