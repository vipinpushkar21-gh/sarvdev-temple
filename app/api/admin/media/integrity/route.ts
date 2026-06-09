// GET /api/admin/media/integrity
// Read-only media integrity audit across all content types.
// Never writes or deletes anything.

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import Temple from '@/models/Temple'
import Deity from '@/models/Deity'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import Event from '@/models/Event'
import Darshan from '@/models/Darshan'
import { isAllowedImageHost } from '@/lib/imageGuard'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

const CLOUDINARY_HOST = 'res.cloudinary.com'

function isCloudinary(url: string): boolean {
  if (!url) return false
  try {
    const { hostname } = new URL(url)
    return hostname === CLOUDINARY_HOST || hostname.endsWith('.cloudinary.com')
  } catch { return false }
}

function isExternalNonCloudinary(url: string): boolean {
  if (!url || url.startsWith('/') || url.startsWith('blob:') || url.startsWith('data:')) return false
  try {
    const { hostname } = new URL(url)
    return hostname !== CLOUDINARY_HOST && !hostname.endsWith('.cloudinary.com')
  } catch { return false }
}

function isValidHttpUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('/')) return true
  try {
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:'
  } catch { return false }
}

type Sample = { id: string; title: string; reason?: string; url?: string }

type ContentTypeReport = {
  total: number
  missingCard: number
  missingHero: number
  missingOG: number
  noImages: number
  legacyOnly: number
  nonCloudinary: number
  invalidUrl: number
  samples: Sample[]
}

const MAX_SAMPLES = 5

function pushSample(samples: Sample[], item: Sample) {
  if (samples.length < MAX_SAMPLES) samples.push(item)
}

function auditItem(
  doc: Record<string, any>,
  report: ContentTypeReport,
  titleField = 'title'
): void {
  const id = String(doc._id || '')
  const title = String(doc[titleField] || doc.title || doc.name || id).slice(0, 80)

  // Image field candidates
  const cardUrl = String(doc.imageCard || doc.image || '').trim()
  const heroUrl = String(doc.imageHero || doc.heroImage || '').trim()
  const ogUrl = String(doc.ogImage || '').trim()
  const legacyUrl = String(doc.image || '').trim()
  const thumbUrl = String(doc.thumbnail || '').trim()  // darshan

  // Effective card = imageCard OR image OR thumbnail
  const effectiveCard = cardUrl || thumbUrl
  const effectiveHero = heroUrl || effectiveCard
  const allUrls = [doc.imageCard, doc.image, doc.imageHero, doc.heroImage, doc.ogImage, doc.thumbnail]
    .filter(Boolean).map(String)
  const galleryUrls = [
    ...(Array.isArray(doc.galleryImages) ? doc.galleryImages : []),
    ...(Array.isArray(doc.images) ? doc.images : []),
    ...(Array.isArray(doc.imageGallery) ? doc.imageGallery : []),
  ].filter(Boolean).map(String)
  const allChecked = [...allUrls, ...galleryUrls]

  // Missing card
  if (!effectiveCard) {
    report.missingCard++
    pushSample(report.samples, { id, title, reason: 'no card image (imageCard + image both empty)' })
  }

  // Missing hero
  if (!effectiveHero) {
    report.missingHero++
  }

  // Missing OG
  if (!ogUrl) {
    report.missingOG++
  }

  // No images at all
  if (allChecked.length === 0) {
    report.noImages++
    pushSample(report.samples, { id, title, reason: 'no image fields populated at all' })
  }

  // Legacy only (has image but not imageCard)
  if (legacyUrl && !String(doc.imageCard || '').trim()) {
    report.legacyOnly++
    pushSample(report.samples, { id, title, reason: 'uses legacy `image` field but imageCard is empty' })
  }

  // Non-Cloudinary external URLs
  for (const url of allChecked) {
    if (isExternalNonCloudinary(url)) {
      report.nonCloudinary++
      pushSample(report.samples, { id, title, reason: 'non-Cloudinary external URL', url: url.slice(0, 120) })
      break
    }
  }

  // Invalid URL format
  for (const url of allChecked) {
    if (url && !isAllowedImageHost(url) && !isValidHttpUrl(url)) {
      report.invalidUrl++
      pushSample(report.samples, { id, title, reason: 'invalid URL format', url: url.slice(0, 120) })
      break
    }
  }
}

function emptyReport(): ContentTypeReport {
  return {
    total: 0, missingCard: 0, missingHero: 0, missingOG: 0,
    noImages: 0, legacyOnly: 0, nonCloudinary: 0, invalidUrl: 0,
    samples: [],
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const IMAGE_PROJECTION = 'title name slug image imageCard imageHero heroImage ogImage thumbnail galleryImages images imageGallery'

    const [temples, deities, devotionals, blogs, events, darshans] = await Promise.all([
      Temple.find({}, IMAGE_PROJECTION).lean() as Promise<any[]>,
      Deity.find({}, IMAGE_PROJECTION).lean() as Promise<any[]>,
      Devotional.find({}, IMAGE_PROJECTION).lean() as Promise<any[]>,
      Blog.find({}, IMAGE_PROJECTION).lean() as Promise<any[]>,
      Event.find({}, IMAGE_PROJECTION).lean() as Promise<any[]>,
      Darshan.find({}, IMAGE_PROJECTION).lean() as Promise<any[]>,
    ])

    const reports: Record<string, ContentTypeReport> = {
      temples:     emptyReport(),
      deities:     emptyReport(),
      devotionals: emptyReport(),
      blogs:       emptyReport(),
      events:      emptyReport(),
      darshan:     emptyReport(),
    }

    for (const doc of temples)     { reports.temples.total++;     auditItem(doc, reports.temples) }
    for (const doc of deities)     { reports.deities.total++;     auditItem(doc, reports.deities, 'name') }
    for (const doc of devotionals) { reports.devotionals.total++; auditItem(doc, reports.devotionals) }
    for (const doc of blogs)       { reports.blogs.total++;       auditItem(doc, reports.blogs) }
    for (const doc of events)      { reports.events.total++;      auditItem(doc, reports.events) }
    for (const doc of darshans)    { reports.darshan.total++;     auditItem(doc, reports.darshan) }

    const totalIssues = Object.values(reports).reduce(
      (sum, r) => sum + r.missingCard + r.noImages + r.nonCloudinary + r.invalidUrl, 0
    )

    const grandTotal = Object.values(reports).reduce((sum, r) => sum + r.total, 0)

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      grandTotal,
      totalIssues,
      reports,
    })
  } catch (err: any) {
    console.error('[media/integrity] error:', err?.message)
    return NextResponse.json(
      { error: 'Audit failed', message: err?.message ?? String(err) },
      { status: 500 }
    )
  }
}
