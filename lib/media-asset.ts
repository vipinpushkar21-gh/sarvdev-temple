export const MEDIA_KINDS = [
  'temple-photo',
  'deity-artwork',
  'devotional-artwork',
  'portrait',
  'blog-photo',
  'darshan',
  'icon',
  'other',
] as const

export type SarvdevMediaKind = (typeof MEDIA_KINDS)[number]

export type SarvdevMediaAsset = {
  url?: string
  publicId?: string
  assetId?: string
  version?: number
  width?: number
  height?: number
  format?: string
  bytes?: number
  folder?: string
  alt?: string
  kind?: SarvdevMediaKind
}

export type SarvdevMediaInput = string | SarvdevMediaAsset | null | undefined

const CLOUDINARY_UPLOAD_MARKER = '/image/upload/'

export function isMediaAsset(value: unknown): value is SarvdevMediaAsset {
  return Boolean(
    value && typeof value === 'object' && !Array.isArray(value) &&
    ('url' in value || 'publicId' in value || 'assetId' in value)
  )
}

/** Server-safe normalization for media objects received from admin forms. */
export function normalizeMediaAsset(value: unknown, defaultKind: SarvdevMediaKind = 'other'): SarvdevMediaAsset | undefined {
  if (!isMediaAsset(value)) return undefined
  const stringValue = (key: keyof SarvdevMediaAsset, max = 500) =>
    typeof value[key] === 'string' ? String(value[key]).trim().slice(0, max) : undefined
  const numberValue = (key: keyof SarvdevMediaAsset) => {
    const parsed = Number(value[key])
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
  }
  const explicitKind = stringValue('kind', 40)
  const kind = MEDIA_KINDS.includes(explicitKind as SarvdevMediaKind) ? explicitKind as SarvdevMediaKind : defaultKind
  const media: SarvdevMediaAsset = {
    url: stringValue('url'), publicId: stringValue('publicId'), assetId: stringValue('assetId'),
    version: numberValue('version'), width: numberValue('width'), height: numberValue('height'),
    format: stringValue('format', 20), bytes: numberValue('bytes'), folder: stringValue('folder', 200),
    alt: stringValue('alt', 300), kind,
  }
  if (!media.url && !media.publicId) return undefined
  return Object.fromEntries(Object.entries(media).filter(([, item]) => item !== undefined && item !== '')) as SarvdevMediaAsset
}

export function buildCloudinaryOriginalUrl(
  media: Pick<SarvdevMediaAsset, 'publicId' | 'version' | 'format'>,
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'dc2qg7bwr'
): string {
  if (!media.publicId || !cloudName) return ''
  const publicId = media.publicId.replace(/^\/+|\/+$/g, '')
  const version = media.version ? `v${media.version}/` : ''
  const extension = media.format && !publicId.toLowerCase().endsWith(`.${media.format.toLowerCase()}`)
    ? `.${media.format.toLowerCase()}`
    : ''
  return `https://res.cloudinary.com/${cloudName}/image/upload/${version}${publicId}${extension}`
}

/** Structured identity is authoritative; URL-only records remain fully supported. */
export function resolveMediaOriginal(input: SarvdevMediaInput): string {
  if (typeof input === 'string') return input.trim()
  if (!input) return ''
  return buildCloudinaryOriginalUrl(input) || input.url?.trim() || ''
}

/** Best-effort metadata for a future lazy migration. assetId cannot be inferred from a URL. */
export function parseLegacyCloudinaryUrl(url: string): SarvdevMediaAsset | null {
  try {
    const parsed = new URL(url)
    const markerIndex = parsed.pathname.indexOf(CLOUDINARY_UPLOAD_MARKER)
    if (!parsed.hostname.endsWith('cloudinary.com') || markerIndex < 0) return null
    const parts = parsed.pathname.slice(markerIndex + CLOUDINARY_UPLOAD_MARKER.length).split('/').filter(Boolean)
    while (parts.length > 1 && !/^v\d+$/.test(parts[0]) && parts[0].includes('_')) parts.shift()
    const versionPart = /^v\d+$/.test(parts[0] || '') ? parts.shift() : undefined
    const assetPath = parts.join('/')
    if (!assetPath) return null
    const dot = assetPath.lastIndexOf('.')
    return {
      url,
      publicId: dot > assetPath.lastIndexOf('/') ? assetPath.slice(0, dot) : assetPath,
      format: dot > assetPath.lastIndexOf('/') ? assetPath.slice(dot + 1) : undefined,
      version: versionPart ? Number(versionPart.slice(1)) : undefined,
    }
  } catch {
    return null
  }
}
