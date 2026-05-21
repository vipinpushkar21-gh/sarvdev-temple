import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { isAllowedImageHost, FALLBACK_IMAGE } from '@/lib/imageGuard'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return false
    const user = verifyToken(token)
    return user?.role === 'admin'
  } catch {
    return false
  }
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

/** GET — scan all temple records and return an audit report */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const temples = await Temple.find(
    {},
    'title image heroImage galleryImages images status'
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

  const domainCount: Record<string, number> = {}
  let totalImages = 0
  let cloudinaryCount = 0
  let localCount = 0
  let externalCount = 0
  let emptyCount = 0

  for (const temple of temples) {
    const fieldsToCheck: { field: string; value: string | string[] | undefined }[] = [
      { field: 'image', value: temple.image },
      { field: 'heroImage', value: temple.heroImage },
      { field: 'galleryImages', value: temple.galleryImages },
      { field: 'images', value: temple.images },
    ]

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
        }
      }
    }
  }

  return NextResponse.json({
    summary: {
      totalRecords: temples.length,
      totalImages,
      cloudinaryCount,
      localCount,
      externalCount,
      emptyCount,
      domainsFound: Object.keys(domainCount).sort(),
      domainBreakdown: domainCount,
    },
    externalImages: report,
  })
}

/** POST — clean up external image URLs in the database */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  if (body?.action !== 'cleanup') {
    return NextResponse.json({ error: 'Invalid action. Use { action: "cleanup" }' }, { status: 400 })
  }

  await connectDB()

  const temples = await Temple.find(
    {},
    'title image heroImage galleryImages images'
  ).lean() as any[]

  let cleaned = 0
  const cleanedRecords: string[] = []

  for (const temple of temples) {
    const update: Record<string, any> = {}
    let dirty = false

    // Scalar image fields
    for (const field of ['image', 'heroImage'] as const) {
      const val = (temple as any)[field]
      if (val && !isAllowedImageHost(val)) {
        // If a valid Cloudinary image exists on `image`, use it; else fallback
        const existingCloudinary = isAllowedImageHost(temple.image) ? temple.image : FALLBACK_IMAGE
        update[field] = existingCloudinary
        dirty = true
      }
    }

    // Array image fields
    for (const field of ['galleryImages', 'images'] as const) {
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
