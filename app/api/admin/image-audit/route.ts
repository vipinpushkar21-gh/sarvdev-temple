import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { existsSync } from 'fs'
import path from 'path'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { isAllowedImageHost, FALLBACK_IMAGE } from '@/lib/imageGuard'
import { isCloudinaryImageUrl } from '@/lib/temple-image'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

function getAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function classifyUrl(url: string | undefined | null): 'cloudinary' | 'local' | 'external' | 'empty' {
  if (!url || !url.trim()) return 'empty'
  if (url.startsWith('/')) return 'local'
  if (isAllowedImageHost(url)) return 'cloudinary'
  return 'external'
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return 'invalid-url'
  }
}

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url)
    const marker = '/image/upload/'
    const index = parsed.pathname.indexOf(marker)
    if (index === -1) return null

    const rest = parsed.pathname.slice(index + marker.length)
    const parts = rest.split('/').filter(Boolean)
    while (parts.length > 1 && !/^v\d+/.test(parts[0]) && parts[0].includes('_')) {
      parts.shift()
    }
    if (parts[0] && /^v\d+/.test(parts[0])) parts.shift()

    return decodeURIComponent(parts.join('/')).replace(/\.[a-zA-Z0-9]+$/, '') || null
  } catch {
    return null
  }
}

function isBrokenLocalImage(url: string): boolean {
  try {
    const cleanPath = decodeURIComponent(url.split(/[?#]/)[0]).replace(/^\/+/, '')
    if (!cleanPath) return true

    const publicRoot = path.join(process.cwd(), 'public')
    const fullPath = path.normalize(path.join(publicRoot, cleanPath))
    if (!fullPath.startsWith(publicRoot)) return true

    return !existsSync(fullPath)
  } catch {
    return true
  }
}

async function checkRemoteImage(url: string): Promise<'ok' | 'broken' | 'unknown'> {
  try {
    new URL(url)
  } catch {
    return 'broken'
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)

  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
    })

    if (response.status === 405) {
      response = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        redirect: 'follow',
        signal: controller.signal,
        cache: 'no-store',
      })
    }

    return response.ok ? 'ok' : 'broken'
  } catch {
    return 'unknown'
  } finally {
    clearTimeout(timeout)
  }
}

type ImageIssue = {
  templeId: string
  title: string
  status: string
  field: string
  url: string
  issueType: 'missing-card-image' | 'missing-hero-image' | 'risky-card-composition' | 'risky-hero-composition' | 'low-resolution' | 'blurry' | 'wrong-aspect-ratio' | 'dangerous-crop' | 'external-url' | 'broken-url' | 'oversized-file' | 'uninspectable'
  severity: 'warning' | 'critical'
  details: string
  width?: number
  height?: number
  bytes?: number
  aspectRatio?: number
}

type ImageMeta = {
  width?: number
  height?: number
  bytes?: number
  focus?: number
  broken?: boolean
}

const metaCache = new Map<string, Promise<ImageMeta | null>>()

async function inspectCloudinaryImage(url: string): Promise<ImageMeta | null> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return null
  }

  const publicId = extractCloudinaryPublicId(url)
  if (!publicId) return null

  if (!metaCache.has(publicId)) {
    metaCache.set(publicId, cloudinary.api.resource(publicId, {
      resource_type: 'image',
      image_metadata: true,
      quality_analysis: true,
    }).then((resource: any) => ({
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      focus: resource.quality_analysis?.focus,
    })).catch(() => ({ broken: true })))
  }

  return metaCache.get(publicId) || null
}

function addQualityIssues(
  issues: ImageIssue[],
  base: { templeId: string; title: string; status: string; field: string; url: string },
  meta: ImageMeta | null
) {
  if (meta?.broken) {
    issues.push({
      ...base,
      issueType: 'broken-url',
      severity: 'critical',
      details: 'Cloudinary asset could not be found or loaded from the configured account.',
    })
    return
  }

  if (!meta?.width || !meta?.height) {
    issues.push({
      ...base,
      issueType: 'uninspectable',
      severity: 'warning',
      details: 'Cloudinary metadata could not be read. Review this image manually.',
    })
    return
  }

  const aspectRatio = meta.width / meta.height
  const megapixels = (meta.width * meta.height) / 1_000_000
  const shared = { width: meta.width, height: meta.height, bytes: meta.bytes, aspectRatio: Math.round(aspectRatio * 100) / 100 }

  if (meta.width < 1200 || meta.height < 700 || megapixels < 1.2) {
    issues.push({
      ...base,
      ...shared,
      issueType: 'low-resolution',
      severity: meta.width < 900 || meta.height < 600 ? 'critical' : 'warning',
      details: 'Source image is too small for premium retina temple/deity display.',
    })
  }

  if (typeof meta.focus === 'number' && meta.focus < 0.45) {
    issues.push({
      ...base,
      ...shared,
      issueType: 'blurry',
      severity: meta.focus < 0.3 ? 'critical' : 'warning',
      details: `Cloudinary focus score is low (${meta.focus.toFixed(2)}). Image may look blurry.`,
    })
  }

  if ((base.field === 'imageHero' || base.field === 'heroImage') && (aspectRatio < 1.75 || aspectRatio > 3.2)) {
    issues.push({
      ...base,
      ...shared,
      issueType: 'risky-hero-composition',
      severity: 'warning',
      details: 'Hero image is not close to the Sarvdev cinematic panoramic range.',
    })
  }

  if (base.field === 'imageCard' && (aspectRatio < 0.85 || aspectRatio > 1.25)) {
    issues.push({
      ...base,
      ...shared,
      issueType: 'risky-card-composition',
      severity: 'warning',
      details: 'Card image should be square-safe for listings, cards and mobile previews.',
    })
  }

  if (aspectRatio < 0.85 || aspectRatio > 3.4) {
    issues.push({
      ...base,
      ...shared,
      issueType: 'dangerous-crop',
      severity: aspectRatio < 0.65 || aspectRatio > 4 ? 'critical' : 'warning',
      details: 'Crown, shikhara, feet, aura, ornaments, wings or vahan may sit too close to the crop edge.',
    })
  }

  if (meta.bytes && meta.bytes > 8 * 1024 * 1024) {
    issues.push({
      ...base,
      ...shared,
      issueType: 'oversized-file',
      severity: meta.bytes > 14 * 1024 * 1024 ? 'critical' : 'warning',
      details: 'Original file is oversized. Delivery is optimized, but storage/source file should be reviewed.',
    })
  }
}

/** GET - scan all temple records and return an audit report */
export async function GET(req: NextRequest) {
  if (!getAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const temples = await Temple.find(
    {},
    'title image imageCard imageHero imageGallery heroImage galleryImages images festivalGallery architectureGallery deityGallery droneShots festivals status'
  ).lean() as any[]

  const report: {
    templeId: string
    title: string
    status: string
    field: string
    url: string
    domain: string
    classification: string
  }[] = []
  const qualityIssues: ImageIssue[] = []

  const domainCount: Record<string, number> = {}
  let totalImages = 0
  let cloudinaryCount = 0
  let localCount = 0
  let externalCount = 0
  let emptyCount = 0

  for (const temple of temples) {
    const fieldsToCheck: { field: string; value: string | string[] | undefined }[] = [
      { field: 'image', value: temple.image },
      { field: 'imageCard', value: temple.imageCard },
      { field: 'imageHero', value: temple.imageHero },
      { field: 'heroImage', value: temple.heroImage },
      { field: 'imageGallery', value: temple.imageGallery },
      { field: 'galleryImages', value: temple.galleryImages },
      { field: 'images', value: temple.images },
      { field: 'festivalGallery', value: temple.festivalGallery },
      { field: 'architectureGallery', value: temple.architectureGallery },
      { field: 'deityGallery', value: temple.deityGallery },
      { field: 'droneShots', value: temple.droneShots },
      { field: 'festivals.images', value: (temple.festivals || []).flatMap((festival: any) => festival.images || []) },
    ]

    if (!temple.imageCard) {
      qualityIssues.push({
        templeId: temple._id.toString(),
        title: temple.title,
        status: temple.status || 'unknown',
        field: 'imageCard',
        url: temple.image || '',
        issueType: 'missing-card-image',
        severity: 'warning',
        details: 'Dedicated card image is missing. The site will fall back to the legacy image.',
      })
    }

    if (!temple.imageHero) {
      qualityIssues.push({
        templeId: temple._id.toString(),
        title: temple.title,
        status: temple.status || 'unknown',
        field: 'imageHero',
        url: temple.heroImage || temple.image || '',
        issueType: 'missing-hero-image',
        severity: 'warning',
        details: 'Dedicated hero image is missing. The site will fall back to legacy hero/image.',
      })
    }

    for (const { field, value } of fieldsToCheck) {
      const urls = Array.isArray(value) ? value : [value]
      for (const url of urls) {
        totalImages++
        const classification = classifyUrl(url)

        if (classification === 'cloudinary') cloudinaryCount++
        else if (classification === 'local') localCount++
        else if (classification === 'external') externalCount++
        else emptyCount++

        if (classification === 'external' && url) {
          const domain = extractDomain(url)
          domainCount[domain] = (domainCount[domain] || 0) + 1
          report.push({
            templeId: temple._id.toString(),
            title: temple.title,
            status: temple.status || 'unknown',
            field,
            url,
            domain,
            classification,
          })
          qualityIssues.push({
            templeId: temple._id.toString(),
            title: temple.title,
            status: temple.status || 'unknown',
            field,
            url,
            issueType: 'external-url',
            severity: 'critical',
            details: 'External image URL bypasses the Sarvdev Cloudinary delivery pipeline.',
          })

          if (await checkRemoteImage(url) === 'broken') {
            qualityIssues.push({
              templeId: temple._id.toString(),
              title: temple.title,
              status: temple.status || 'unknown',
              field,
              url,
              issueType: 'broken-url',
              severity: 'critical',
              details: 'Image URL did not respond successfully during the audit.',
            })
          }
        }

        if (classification === 'local' && url && isBrokenLocalImage(url)) {
          qualityIssues.push({
            templeId: temple._id.toString(),
            title: temple.title,
            status: temple.status || 'unknown',
            field,
            url,
            issueType: 'broken-url',
            severity: 'critical',
            details: 'Local image path does not exist under the public assets folder.',
          })
        }

        if (classification === 'cloudinary' && url && isCloudinaryImageUrl(url)) {
          const meta = await inspectCloudinaryImage(url)
          addQualityIssues(qualityIssues, {
            templeId: temple._id.toString(),
            title: temple.title,
            status: temple.status || 'unknown',
            field,
            url,
          }, meta)
        }
      }
    }
  }

  const issueBreakdown = qualityIssues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue.issueType] = (acc[issue.issueType] || 0) + 1
    return acc
  }, {})

  return NextResponse.json({
    summary: {
      totalRecords: temples.length,
      totalImages,
      cloudinaryCount,
      localCount,
      externalCount,
      emptyCount,
      qualityIssueCount: qualityIssues.length,
      criticalIssueCount: qualityIssues.filter(issue => issue.severity === 'critical').length,
      issueBreakdown,
      domainsFound: Object.keys(domainCount).sort(),
      domainBreakdown: domainCount,
    },
    externalImages: report,
    qualityIssues,
  })
}

/** POST - clean up external image URLs in the database */
export async function POST(req: NextRequest) {
  if (!getAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  if (body?.action !== 'cleanup') {
    return NextResponse.json({ error: 'Invalid action. Use { action: "cleanup" }' }, { status: 400 })
  }

  await connectDB()

  const temples = await Temple.find(
    {},
    'title image imageCard imageHero imageGallery heroImage galleryImages images'
  ).lean() as any[]

  let cleaned = 0
  const cleanedRecords: string[] = []

  for (const temple of temples) {
    const update: Record<string, any> = {}
    let dirty = false

    // Scalar image fields
    for (const field of ['image', 'imageCard', 'imageHero', 'heroImage'] as const) {
      const val = (temple as any)[field]
      if (val && !isAllowedImageHost(val)) {
        // If a valid Cloudinary image exists on `image`, use it; else fallback
        const existingCloudinary = isAllowedImageHost(temple.image) ? temple.image : FALLBACK_IMAGE
        update[field] = existingCloudinary
        dirty = true
      }
    }

    // Array image fields
    for (const field of ['imageGallery', 'galleryImages', 'images'] as const) {
      const arr: string[] = (temple as any)[field] || []
      const safeArr = arr.filter(isAllowedImageHost)
      if (safeArr.length !== arr.length) {
        update[field] = safeArr
        dirty = true
      }
    }

    if (dirty) {
      await Temple.updateOne({ _id: (temple as any)._id }, { $set: update })
      cleaned++
      cleanedRecords.push((temple as any).title)
    }
  }

  return NextResponse.json({
    success: true,
    recordsCleaned: cleaned,
    cleanedTitles: cleanedRecords,
  })
}
