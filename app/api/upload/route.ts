import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function safeFolderName(input: string) {
  const cleaned = input
    .split('/')
    .map((part) => part.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean)
    .join('/')

  return cleaned.startsWith('sarvdev') ? cleaned : `sarvdev/${cleaned || 'uploads'}`
}

function safePublicId(fileName: string) {
  const base = fileName
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)

  return `${base || 'sarvdev-image'}-${Date.now()}`
}

function getUploadWarnings(width?: number, height?: number, bytes?: number) {
  const warnings: string[] = []
  if (!width || !height) {
    warnings.push('Image dimensions could not be verified. Please review framing manually before saving.')
    return warnings
  }

  const ratio = width / height
  const megapixels = (width * height) / 1_000_000

  if (width < 1600 || height < 900) {
    warnings.push('Image is below the recommended 1600x900 minimum for crisp hero and retina display use.')
  }
  if (megapixels < 1.8) {
    warnings.push('Image resolution is low for premium temple/deity presentation.')
  }
  if (ratio < 0.85) {
    warnings.push('Portrait image is crop-risky for panoramic temple sections. Keep crown, head, feet, aura and ornaments away from edges.')
  }
  if (ratio > 3.2) {
    warnings.push('Ultra-wide image may lose sacred details in cards and mobile views. Verify shikhara/deity framing before saving.')
  }
  if (bytes && bytes > 8 * 1024 * 1024) {
    warnings.push('Original file is large. Cloudinary delivery will optimize it, but consider keeping source files below 8MB when possible.')
  }
  if (width < 2200 && ratio > 1.7) {
    warnings.push('Wide image may look soft on desktop hero displays. Prefer 2400px+ width for flagship temple images.')
  }

  return warnings
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const ip = getClientIp(request)
    const { ok } = checkRateLimit(`upload:${ip}`, 10, 60_000)
    if (!ok) return NextResponse.json({ error: 'Upload rate limit exceeded' }, { status: 429 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = safeFolderName((formData.get('folder') as string) || 'sarvdev')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be smaller than 15MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      public_id: safePublicId(file.name),
      resource_type: 'image',
      unique_filename: false,
      overwrite: false,
      invalidate: true,
      quality_analysis: true,
      phash: true,
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      assetId: result.asset_id,
      version: result.version,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
      folder,
      warnings: getUploadWarnings(result.width, result.height, result.bytes),
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
  }
}
