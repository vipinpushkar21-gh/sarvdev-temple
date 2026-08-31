import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const ALLOWED_FOLDERS = new Set([
  'sarvdev/temples', 'sarvdev/deities', 'sarvdev/devotionals', 'sarvdev/blogs',
  'sarvdev/darshan', 'sarvdev/spiritual-icons', 'sarvdev/events', 'sarvdev/uploads',
])

function normalizeFolder(value: unknown) {
  const requested = String(value || 'sarvdev/uploads').toLowerCase().replace(/^\/+|\/+$/g, '')
  const canonical = requested.startsWith('sarvdev/') ? requested : `sarvdev/${requested}`
  const folder = canonical.replace(/\/(cards|heroes|og|thumbnails)$/, '')
  return ALLOWED_FOLDERS.has(folder) ? folder : ''
}

function safePublicId(fileName: string) {
  const base = fileName.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^\w\s-]/g, '')
    .trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
  return `${base || 'sarvdev-image'}-${crypto.randomUUID()}`
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token || verifyToken(token)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
  const { ok } = checkRateLimit(`upload-signature:${getClientIp(request)}`, 20, 60_000)
  if (!ok) return NextResponse.json({ error: 'Upload rate limit exceeded' }, { status: 429 })

  const { fileName, mimeType, bytes, folder: requestedFolder } = await request.json()
  const folder = normalizeFolder(requestedFolder)
  if (!folder) return NextResponse.json({ error: 'Upload folder is not allowed' }, { status: 400 })
  if (!ALLOWED_MIME_TYPES.has(String(mimeType))) return NextResponse.json({ error: 'Image type is not allowed' }, { status: 400 })
  if (!Number.isFinite(bytes) || bytes <= 0 || bytes > MAX_BYTES) return NextResponse.json({ error: 'Image must be smaller than 15MB' }, { status: 400 })

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })

  const timestamp = Math.floor(Date.now() / 1000)
  const params = {
    timestamp,
    folder,
    public_id: safePublicId(String(fileName || 'sarvdev-image')),
    overwrite: false,
    unique_filename: false,
    quality_analysis: true,
    phash: true,
  }
  const signature = cloudinary.utils.api_sign_request(params, apiSecret)
  return NextResponse.json({ cloudName, apiKey, signature, params, expiresAt: timestamp + 300 })
}
