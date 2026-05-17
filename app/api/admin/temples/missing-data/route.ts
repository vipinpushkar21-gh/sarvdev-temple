import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

type Priority = 'high' | 'medium' | 'low'

type TempleRecord = {
  _id: unknown
  title?: unknown
  titleHi?: unknown
  deity?: unknown
  templeType?: unknown
  templeTypes?: unknown
  description?: unknown
  descriptionHi?: unknown
  establishedYear?: unknown
  speciality?: unknown
  specialityHi?: unknown
  categories?: unknown
  sacredCategories?: unknown
  location?: unknown
  city?: unknown
  state?: unknown
  pincode?: unknown
  mapsLink?: unknown
  googleMapsUrl?: unknown
  timings?: unknown
  timingSlots?: unknown
  image?: unknown
  festivals?: unknown
  phone?: unknown
  email?: unknown
  website?: unknown
  metaTitle?: unknown
  metaDescription?: unknown
  metaKeywords?: unknown
  ogImage?: unknown
}

type TempleIssue = {
  id: string
  title: string
  city?: string
  state?: string
  deity?: string
  image?: string
  issueCount: number
  issues: string[]
  suggestedPriority: Priority
}

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function hasValue(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.some(item => hasValue(item))
  return value !== null && value !== undefined
}

function hasArrayValue(value: unknown): boolean {
  return Array.isArray(value) && value.some(item => {
    if (typeof item === 'string') return item.trim().length > 0
    if (item && typeof item === 'object') {
      return Object.values(item as Record<string, unknown>).some(v => hasValue(v))
    }
    return Boolean(item)
  })
}

function hasFestivalValue(value: unknown): boolean {
  if (!Array.isArray(value)) return false
  return value.some(item => {
    if (typeof item === 'string') return item.trim().length > 0
    if (!item || typeof item !== 'object') return false
    const festival = item as { name?: unknown; description?: unknown }
    return hasValue(festival.name) || hasValue(festival.description)
  })
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function wordCount(value: unknown): number {
  const text = stringValue(value)
  if (!text) return 0
  return stripHtml(text).split(/\s+/).filter(Boolean).length
}

function hindiTokenCount(value: unknown): number {
  const text = stringValue(value)
  if (!text) return 0
  return stripHtml(text).match(/[\u0900-\u097F\w]+/g)?.length ?? 0
}

function getPriority(issues: string[]): Priority {
  const highSignals = new Set([
    'Missing title',
    'Missing English description',
    'Missing deity',
    'Missing image',
    'Missing timings',
  ])

  if (issues.some(issue => highSignals.has(issue)) || issues.length >= 10) {
    return 'high'
  }

  if (
    issues.length >= 4 ||
    issues.some(issue => issue.includes('Weak') || issue.startsWith('Missing SEO'))
  ) {
    return 'medium'
  }

  return 'low'
}

function sortPriority(priority: Priority): number {
  if (priority === 'high') return 0
  if (priority === 'medium') return 1
  return 2
}

/**
 * GET /api/admin/temples/missing-data
 *
 * Dry-run temple data audit. This endpoint only reads temple records and reports
 * missing or weak metadata for future safe enhancement work.
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const temples = (await Temple.find({})
      .select([
        'title',
        'titleHi',
        'deity',
        'templeType',
        'templeTypes',
        'description',
        'descriptionHi',
        'establishedYear',
        'speciality',
        'specialityHi',
        'categories',
        'sacredCategories',
        'location',
        'city',
        'state',
        'pincode',
        'mapsLink',
        'googleMapsUrl',
        'timings',
        'timingSlots',
        'image',
        'festivals',
        'phone',
        'email',
        'website',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
        'ogImage',
        'createdAt',
      ].join(' '))
      .sort({ createdAt: -1 })
      .lean()) as TempleRecord[]

    const summary = {
      totalTemples: temples.length,
      templesWithIssues: 0,
      missingImage: 0,
      missingEnglishDescription: 0,
      missingHindiDescription: 0,
      weakEnglishDescription: 0,
      weakHindiDescription: 0,
      missingDeity: 0,
      missingTimings: 0,
      missingLocation: 0,
      missingSEO: 0,
    }

    const results: TempleIssue[] = temples
      .map((temple): TempleIssue | null => {
        const issues: string[] = []

        const missingTitle = !hasValue(temple.title)
        const missingTitleHi = !hasValue(temple.titleHi)
        const missingDeity = !hasValue(temple.deity)
        const missingTempleType = !hasValue(temple.templeType) && !hasArrayValue(temple.templeTypes)
        const missingDescription = !hasValue(temple.description)
        const missingDescriptionHi = !hasValue(temple.descriptionHi)
        const weakDescription = !missingDescription && wordCount(temple.description) < 300
        const weakDescriptionHi = !missingDescriptionHi && hindiTokenCount(temple.descriptionHi) < 250
        const missingCategories = !hasArrayValue(temple.categories) && !hasArrayValue(temple.sacredCategories)
        const missingLocation = !hasValue(temple.location)
        const missingCity = !hasValue(temple.city)
        const missingState = !hasValue(temple.state)
        const missingPincode = !hasValue(temple.pincode)
        const missingMaps = !hasValue(temple.mapsLink) && !hasValue(temple.googleMapsUrl)
        const missingTimings = !hasValue(temple.timings) && !hasArrayValue(temple.timingSlots)
        const missingImage = !hasValue(temple.image)
        const missingSEO =
          !hasValue(temple.metaTitle) ||
          !hasValue(temple.metaDescription) ||
          !hasValue(temple.metaKeywords) ||
          !hasValue(temple.ogImage)

        if (missingTitle) issues.push('Missing title')
        if (missingTitleHi) issues.push('Missing Hindi title')
        if (missingDeity) issues.push('Missing deity')
        if (missingTempleType) issues.push('Missing temple type')
        if (missingDescription) issues.push('Missing English description')
        if (weakDescription) issues.push('Weak English description')
        if (missingDescriptionHi) issues.push('Missing Hindi description')
        if (weakDescriptionHi) issues.push('Weak Hindi description')
        if (!hasValue(temple.establishedYear)) issues.push('Missing established year')
        if (!hasValue(temple.speciality)) issues.push('Missing speciality')
        if (!hasValue(temple.specialityHi)) issues.push('Missing Hindi speciality')
        if (missingCategories) issues.push('Missing sacred categories')
        if (missingLocation) issues.push('Missing location')
        if (missingCity) issues.push('Missing city')
        if (missingState) issues.push('Missing state')
        if (missingPincode) issues.push('Missing pincode')
        if (missingMaps) issues.push('Missing maps link')
        if (missingTimings) issues.push('Missing timings')
        if (missingImage) issues.push('Missing image')
        if (!hasFestivalValue(temple.festivals)) issues.push('Missing festivals')
        if (!hasValue(temple.phone)) issues.push('Missing phone')
        if (!hasValue(temple.email)) issues.push('Missing email')
        if (!hasValue(temple.website)) issues.push('Missing website')
        if (!hasValue(temple.metaTitle)) issues.push('Missing SEO title')
        if (!hasValue(temple.metaDescription)) issues.push('Missing SEO description')
        if (!hasValue(temple.metaKeywords)) issues.push('Missing SEO keywords')
        if (!hasValue(temple.ogImage)) issues.push('Missing OG image')

        if (issues.length === 0) return null

        summary.templesWithIssues += 1
        if (missingImage) summary.missingImage += 1
        if (missingDescription) summary.missingEnglishDescription += 1
        if (missingDescriptionHi) summary.missingHindiDescription += 1
        if (weakDescription) summary.weakEnglishDescription += 1
        if (weakDescriptionHi) summary.weakHindiDescription += 1
        if (missingDeity) summary.missingDeity += 1
        if (missingTimings) summary.missingTimings += 1
        if (missingLocation || missingCity || missingState || missingPincode || missingMaps) {
          summary.missingLocation += 1
        }
        if (missingSEO) summary.missingSEO += 1

        const suggestedPriority = getPriority(issues)

        return {
          id: String(temple._id),
          title: stringValue(temple.title) || 'Untitled temple',
          city: stringValue(temple.city) || undefined,
          state: stringValue(temple.state) || undefined,
          deity: stringValue(temple.deity) || undefined,
          image: stringValue(temple.image) || undefined,
          issueCount: issues.length,
          issues,
          suggestedPriority,
        }
      })
      .filter((item): item is TempleIssue => item !== null)
      .sort((a, b) => {
        const priorityDiff = sortPriority(a.suggestedPriority) - sortPriority(b.suggestedPriority)
        if (priorityDiff !== 0) return priorityDiff
        return b.issueCount - a.issueCount
      })

    return NextResponse.json({
      summary,
      issues: results,
    })
  } catch (error) {
    console.error('Temple missing data audit error:', error)
    return NextResponse.json({ error: 'Temple missing data audit failed' }, { status: 500 })
  }
}
