/**
 * Sarvdev premium image system.
 *
 * Cloudinary remains the primary image provider. These helpers turn stored
 * source URLs into responsive, cinematic, compression-safe delivery URLs while
 * preserving Sarvdev's sacred safe-framing rules.
 */

import { FALLBACK_IMAGE, LOCAL_PLACEHOLDER, sanitizeImageUrl } from './imageGuard'

/** Local emergency fallback served from public/. */
export const TEMPLE_PLACEHOLDER = LOCAL_PLACEHOLDER

const CLOUDINARY_UPLOAD_MARKER = '/image/upload/'
const DEFAULT_SAFE_POSITION = 'top center'
const DEITY_HERO_SAFE_POSITION = 'center 58%'

type ImageInput =
  | string
  | null
  | undefined
  | {
      image?: string | null
      primaryImage?: string | null
      imageCard?: string | null
      imageHero?: string | null
      heroImage?: string | null
      ogImage?: string | null
    }

type ImageRole = 'templeHero' | 'templeCard' | 'deityHero' | 'deityCard' | 'blogHero' | 'blogCard' | 'gallery' | 'galleryLightbox' | 'og'
export type ImageRenderMode = 'auto' | 'safe-cover' | 'safe-contain' | 'cinematic-cover' | 'focal-safe'

type ImagePreset = {
  role: ImageRole
  widths: number[]
  aspectRatio?: string
  sizes: string
  crop: 'fill' | 'limit'
  gravity?: 'auto' | 'north'
  objectPosition: string
  renderMode: ImageRenderMode
}

export type SarvdevImageSource = {
  src: string
  srcSet: string
  sizes: string
  placeholder: string
  fallback: string
  width: number
  height?: number
  aspectRatio?: string
  objectPosition: string
  role: ImageRole
  isCloudinary: boolean
  renderMode: ImageRenderMode
  sources?: {
    media: string
    srcSet: string
    sizes: string
  }[]
}

const PRESETS: Record<ImageRole, ImagePreset> = {
  templeHero: {
    role: 'templeHero',
    widths: [768, 1024, 1366, 1600, 1920, 2560],
    aspectRatio: '21:9',
    sizes: '100vw',
    crop: 'limit',
    gravity: 'north',
    objectPosition: DEFAULT_SAFE_POSITION,
    renderMode: 'auto',
  },
  templeCard: {
    role: 'templeCard',
    widths: [360, 480, 640, 768, 960],
    aspectRatio: '4:3',
    sizes: '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 24vw',
    crop: 'fill',
    gravity: 'auto',
    objectPosition: DEFAULT_SAFE_POSITION,
    renderMode: 'auto',
  },
  deityHero: {
    role: 'deityHero',
    widths: [640, 960, 1280, 1600, 1920],
    aspectRatio: '16:9',
    sizes: '100vw',
    crop: 'limit',
    gravity: 'north',
    objectPosition: DEITY_HERO_SAFE_POSITION,
    renderMode: 'auto',
  },
  deityCard: {
    role: 'deityCard',
    widths: [360, 480, 640, 768, 960, 1200],
    aspectRatio: '1:1',
    sizes: '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 24vw',
    crop: 'limit',
    gravity: 'north',
    objectPosition: DEFAULT_SAFE_POSITION,
    renderMode: 'auto',
  },
  blogHero: {
    role: 'blogHero',
    widths: [768, 1024, 1366, 1600, 1920, 2400],
    aspectRatio: '21:9',
    sizes: '100vw',
    crop: 'limit',
    gravity: 'north',
    objectPosition: 'center center',
    renderMode: 'auto',
  },
  blogCard: {
    role: 'blogCard',
    widths: [360, 480, 640, 768, 960, 1200],
    aspectRatio: '16:9',
    sizes: '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw',
    crop: 'fill',
    gravity: 'auto',
    objectPosition: 'center center',
    renderMode: 'auto',
  },
  gallery: {
    role: 'gallery',
    widths: [360, 520, 720, 960, 1280],
    aspectRatio: '4:3',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    crop: 'limit',
    gravity: 'auto',
    objectPosition: DEFAULT_SAFE_POSITION,
    renderMode: 'auto',
  },
  galleryLightbox: {
    role: 'galleryLightbox',
    widths: [960, 1280, 1600, 2048, 2560],
    sizes: '100vw',
    crop: 'limit',
    objectPosition: 'center center',
    renderMode: 'safe-contain',
  },
  og: {
    role: 'og',
    widths: [1200],
    aspectRatio: '1200:630',
    sizes: '1200px',
    crop: 'fill',
    gravity: 'north',
    objectPosition: DEFAULT_SAFE_POSITION,
    renderMode: 'safe-cover',
  },
}

function resolveImageUrl(input: ImageInput, preferred: 'image' | 'imageCard' | 'imageHero' | 'heroImage' | 'ogImage' = 'image') {
  const candidates =
    typeof input === 'string'
      ? [input]
      : preferred === 'ogImage'
        ? [input?.ogImage, input?.imageHero, input?.heroImage, input?.primaryImage, input?.imageCard, input?.image]
        : preferred === 'imageHero' || preferred === 'heroImage'
          ? [input?.imageHero, input?.heroImage, input?.primaryImage, input?.imageCard, input?.image]
          : preferred === 'imageCard'
            ? [input?.imageCard, input?.primaryImage, input?.image]
            : [input?.primaryImage, input?.image]

  for (const candidate of candidates) {
    const safeUrl = sanitizeImageUrl(candidate?.trim(), '')
    if (safeUrl) return safeUrl
  }

  return FALLBACK_IMAGE
}

export function isCloudinaryImageUrl(url: string | undefined | null): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'res.cloudinary.com' || parsed.hostname.endsWith('.cloudinary.com')
  } catch {
    return false
  }
}

function isTransformationSegment(segment: string): boolean {
  return segment.split(',').some((part) =>
    /^(ar|b|c|cs|dpr|e|f|fl|g|h|q|r|w|x|y|z)_/.test(part)
  )
}

function getCloudinaryAssetPath(rest: string): string {
  const parts = rest.split('/').filter(Boolean)
  while (parts.length > 1 && !/^v\d+/.test(parts[0]) && isTransformationSegment(parts[0])) {
    parts.shift()
  }
  return parts.join('/')
}

function transformCloudinaryUrl(url: string, transformations: string[]) {
  if (!isCloudinaryImageUrl(url)) return url
  const markerIndex = url.indexOf(CLOUDINARY_UPLOAD_MARKER)
  if (markerIndex === -1) return url

  const prefix = url.slice(0, markerIndex + CLOUDINARY_UPLOAD_MARKER.length)
  const rest = url.slice(markerIndex + CLOUDINARY_UPLOAD_MARKER.length)
  const assetPath = getCloudinaryAssetPath(rest)

  return `${prefix}${transformations.filter(Boolean).join(',')}/${assetPath}`
}

function getDimensionsFromAspectRatio(width: number, aspectRatio?: string) {
  if (!aspectRatio) return undefined
  const [w, h] = aspectRatio.split(':').map(Number)
  if (!w || !h) return undefined
  return Math.round((width * h) / w)
}

function buildTransform(preset: ImagePreset, width: number, aspectRatio = preset.aspectRatio) {
  const transformations = [
    'f_auto',
    'q_auto:best',
    'dpr_auto',
    preset.crop === 'fill' ? 'c_fill' : 'c_limit',
    preset.crop === 'fill' && preset.gravity ? `g_${preset.gravity}` : '',
    aspectRatio && preset.crop === 'fill' ? `ar_${aspectRatio}` : '',
    `w_${width}`,
    'fl_progressive',
    'cs_srgb',
    'e_auto_brightness',
    'e_auto_contrast',
    'e_auto_color',
    'e_sharpen:45',
  ]

  return transformations.filter(Boolean)
}

function buildSrcSet(url: string, preset: ImagePreset, aspectRatio = preset.aspectRatio) {
  if (!isCloudinaryImageUrl(url)) return ''
  return preset.widths
    .map((width) => `${transformCloudinaryUrl(url, buildTransform(preset, width, aspectRatio))} ${width}w`)
    .join(', ')
}

function getBlurPlaceholder(url: string) {
  if (!isCloudinaryImageUrl(url)) return TEMPLE_PLACEHOLDER
  return transformCloudinaryUrl(url, [
    'f_auto',
    'q_auto:eco',
    'w_48',
    'e_blur:900',
    'e_auto_brightness',
    'e_auto_color',
  ])
}

function getFallbackForPreset(preset: ImagePreset) {
  return transformCloudinaryUrl(FALLBACK_IMAGE, buildTransform(preset, preset.widths[0]))
}

function buildImageSource(
  input: ImageInput,
  preset: ImagePreset,
  preferred: 'image' | 'imageCard' | 'imageHero' | 'heroImage' | 'ogImage' = 'image'
): SarvdevImageSource {
  const source = resolveImageUrl(input, preferred)
  const isCloudinary = isCloudinaryImageUrl(source)
  const width = preset.widths[preset.widths.length - 1]
  const src = isCloudinary
    ? transformCloudinaryUrl(source, buildTransform(preset, width))
    : source

  const responsiveSources =
    preset.role === 'templeHero' || preset.role === 'blogHero'
      ? [
          {
            media: '(max-width: 640px)',
            srcSet: buildSrcSet(source, { ...preset, widths: [360, 480, 640, 768] }, '4:5'),
            sizes: '100vw',
          },
          {
            media: '(max-width: 1024px)',
            srcSet: buildSrcSet(source, { ...preset, widths: [768, 1024, 1280] }, '16:9'),
            sizes: '100vw',
          },
        ]
      : preset.role === 'deityHero'
        ? [
            {
              media: '(max-width: 640px)',
              srcSet: buildSrcSet(source, { ...preset, widths: [360, 480, 640, 768] }, '4:5'),
              sizes: '100vw',
            },
          ]
        : undefined

  return {
    src,
    srcSet: buildSrcSet(source, preset),
    sizes: preset.sizes,
    placeholder: getBlurPlaceholder(source),
    fallback: getFallbackForPreset(preset),
    width,
    height: getDimensionsFromAspectRatio(width, preset.aspectRatio),
    aspectRatio: preset.aspectRatio,
    objectPosition: preset.objectPosition,
    role: preset.role,
    isCloudinary,
    renderMode: preset.renderMode,
    sources: responsiveSources?.filter((sourceSet) => sourceSet.srcSet),
  }
}

export function getTempleHeroImage(input: ImageInput): SarvdevImageSource {
  return buildImageSource(input, PRESETS.templeHero, 'imageHero')
}

export function getTempleCardImage(input: ImageInput): SarvdevImageSource {
  return buildImageSource(input, PRESETS.templeCard, 'imageCard')
}

export function getDeityHeroImage(input: ImageInput): SarvdevImageSource {
  return buildImageSource(input, PRESETS.deityHero, 'imageHero')
}

export function getDeityCardImage(input: ImageInput): SarvdevImageSource {
  return buildImageSource(input, PRESETS.deityCard, 'imageCard')
}

export function getBlogHeroImage(input: ImageInput): SarvdevImageSource {
  return buildImageSource(input, PRESETS.blogHero, 'imageHero')
}

export function getBlogCardImage(input: ImageInput): SarvdevImageSource {
  return buildImageSource(input, PRESETS.blogCard, 'imageCard')
}

export function getGalleryImage(input: ImageInput, mode: 'thumb' | 'lightbox' = 'thumb'): SarvdevImageSource {
  return buildImageSource(input, mode === 'lightbox' ? PRESETS.galleryLightbox : PRESETS.gallery)
}

export function getOGImage(input: ImageInput): SarvdevImageSource {
  return buildImageSource(input, PRESETS.og, 'ogImage')
}

/**
 * Legacy helper used throughout the app. It now returns a premium Cloudinary
 * card URL, so older callers automatically benefit from the upgraded system.
 */
export function getTempleImage(temple: { image?: string | null }): string {
  return getTempleCardImage(temple).src
}
