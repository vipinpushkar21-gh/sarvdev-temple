/**
 * lib/media.ts — Sarvdev Central Media Architecture
 *
 * Single entry-point for all image resolution, Cloudinary transforms,
 * fallback management and image metadata across every content type.
 *
 * Content types:  temple | deity | devotional | blog | event | darshan | spiritualIcon
 * Image roles:    card | hero | og | gallery
 *
 * Usage:
 *   import { getCardImage, getHeroImage, getFallbackImage } from '@/lib/media'
 */

// ── Re-export core primitives ─────────────────────────────────────────────────
export {
  CLOUDINARY_HOST,
  FALLBACK_IMAGE,
  LOCAL_PLACEHOLDER,
  isAllowedImageHost,
  sanitizeImageUrl,
  getSafeTempleImage,
  getSafeDeityImage,
  getDefaultImage,
} from './imageGuard'

export {
  getTempleHeroImage,
  getTempleCardImage,
  getDeityHeroImage,
  getDeityCardImage,
  getBlogHeroImage,
  getBlogCardImage,
  getGalleryImage,
  getOGImage,
  getTempleImage,
  isCloudinaryImageUrl,
  TEMPLE_PLACEHOLDER,
  type SarvdevImageSource,
  type ImageRenderMode,
} from './temple-image'

// ── Internal imports ──────────────────────────────────────────────────────────
import {
  FALLBACK_IMAGE,
  CLOUDINARY_HOST,
  isAllowedImageHost,
  sanitizeImageUrl,
} from './imageGuard'
import {
  getTempleHeroImage,
  getTempleCardImage,
  getDeityHeroImage,
  getDeityCardImage,
  getBlogHeroImage,
  getBlogCardImage,
  getOGImage,
  isCloudinaryImageUrl,
  type SarvdevImageSource,
} from './temple-image'
import { resolveMediaOriginal, type SarvdevMediaInput } from './media-asset'
export type { SarvdevMediaAsset, SarvdevMediaInput, SarvdevMediaKind } from './media-asset'
export { buildCloudinaryOriginalUrl, parseLegacyCloudinaryUrl } from './media-asset'

// ── Content-type fallback registry ───────────────────────────────────────────
// All currently point to the canonical Cloudinary fallback.
// Individual fallbacks can be swapped per content type when dedicated assets exist.
export const CONTENT_FALLBACKS: Record<string, string> = {
  temple:       FALLBACK_IMAGE,
  deity:        FALLBACK_IMAGE,
  devotional:   FALLBACK_IMAGE,
  blog:         FALLBACK_IMAGE,
  event:        FALLBACK_IMAGE,
  darshan:      FALLBACK_IMAGE,
  spiritualIcon: FALLBACK_IMAGE,
  generic:      FALLBACK_IMAGE,
}

// ── Image upload size guidance ────────────────────────────────────────────────
export type ImageSizeSpec = {
  label: string
  upload: string
  aiGen?: string
  note?: string
}

export const IMAGE_SIZE_GUIDE: Record<string, Record<string, ImageSizeSpec>> = {
  temple: {
    card:  { label: 'Temple Card',  upload: '1600 × 1200 px', aiGen: '2000 × 1500 px', note: '4:3 ratio' },
    hero:  { label: 'Temple Hero',  upload: '3200 × 1371 px', aiGen: '3360 × 1440 px', note: '~21:9 cinematic' },
    og:    { label: 'OG / Share',   upload: '1200 × 630 px',  note: '1.91:1 for social' },
    gallery: { label: 'Gallery',    upload: '2400 × 1800 px', note: '4:3 recommended' },
  },
  deity: {
    card:  { label: 'Deity Card',   upload: '2400 × 2400 px', aiGen: '3000 × 3000 px', note: '1:1 square' },
    hero:  { label: 'Deity Hero',   upload: '3200 × 1371 px', aiGen: '3360 × 1440 px', note: '~21:9 cinematic' },
    og:    { label: 'OG / Share',   upload: '1200 × 630 px',  note: '1.91:1 for social' },
  },
  devotional: {
    card:  { label: 'Devotional Card', upload: '1600 × 900 px', aiGen: '2000 × 1125 px', note: '16:9' },
    hero:  { label: 'Devotional Hero', upload: '1600 × 900 px', aiGen: '2000 × 1125 px', note: '16:9' },
    og:    { label: 'OG / Share',      upload: '1200 × 630 px', note: '1.91:1 for social' },
  },
  blog: {
    card:  { label: 'Blog Card',  upload: '1600 × 900 px', aiGen: '2000 × 1125 px', note: '16:9' },
    hero:  { label: 'Blog Hero',  upload: '1600 × 900 px', aiGen: '2000 × 1125 px', note: '16:9' },
    og:    { label: 'OG / Share', upload: '1200 × 630 px', note: '1.91:1 for social' },
  },
  event: {
    card:  { label: 'Event Card', upload: '1600 × 900 px', aiGen: '2000 × 1125 px', note: '16:9' },
    hero:  { label: 'Event Hero', upload: '1600 × 900 px', note: '16:9' },
    og:    { label: 'OG / Share', upload: '1200 × 630 px', note: '1.91:1 for social' },
  },
  darshan: {
    card:  { label: 'Darshan Image', upload: '1600 × 900 px', note: '16:9' },
    og:    { label: 'OG / Share',    upload: '1200 × 630 px', note: '1.91:1 for social' },
  },
  spiritualIcon: {
    card:  { label: 'Icon Card', upload: '2400 × 2400 px', aiGen: '3000 × 3000 px', note: '1:1 square' },
    hero:  { label: 'Icon Hero', upload: '3200 × 1371 px', note: '~21:9 cinematic' },
    og:    { label: 'OG / Share', upload: '1200 × 630 px', note: '1.91:1 for social' },
  },
}

// ── Cloudinary utilities ──────────────────────────────────────────────────────

/** Returns true if the URL is a Cloudinary URL (alias for isCloudinaryImageUrl). */
export function isCloudinaryUrl(url: string | undefined | null): boolean {
  return isCloudinaryImageUrl(url)
}

/**
 * Extracts the Cloudinary public_id from a delivery URL.
 * e.g. "https://res.cloudinary.com/dc2qg7bwr/image/upload/v1/temples/abc"
 *   → "temples/abc"
 */
export function getCloudinaryPublicId(url: string): string | null {
  if (!url) return null
  const marker = '/image/upload/'
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  const rest = url.slice(idx + marker.length)
  // Strip leading transformation segments (e.g. "f_auto,q_auto/v1234/")
  const parts = rest.split('/').filter(Boolean)
  const cleaned: string[] = []
  let pastTransforms = false
  for (const part of parts) {
    if (!pastTransforms && /^v\d+$/.test(part)) { pastTransforms = true; continue }
    if (!pastTransforms && /^[a-z_]+_/.test(part.split(',')[0])) continue
    pastTransforms = true
    cleaned.push(part)
  }
  return cleaned.join('/') || null
}

/**
 * Builds a Cloudinary delivery URL from a cloud_name, public_id and optional transforms.
 * transforms example: ['f_auto', 'q_auto:good', 'w_800', 'c_fill']
 */
export function buildCloudinaryUrl(
  publicId: string,
  transforms: string[] = [],
  cloudName = 'dc2qg7bwr'
): string {
  const t = transforms.filter(Boolean).join(',')
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t ? t + '/' : ''}${publicId}`
}

// ── URL normalization ─────────────────────────────────────────────────────────

/**
 * Returns the URL if allowed (Cloudinary or local), otherwise empty string.
 * Strips blob: / data: URLs for production use.
 */
export function normalizeImageUrl(url: SarvdevMediaInput): string {
  const t = resolveMediaOriginal(url)
  if (!t) return ''
  if (t.startsWith('blob:') || t.startsWith('data:')) return ''
  return isAllowedImageHost(t) ? t : ''
}

// ── Fallback helpers ──────────────────────────────────────────────────────────

/**
 * Returns the appropriate fallback image for a given content type.
 * Falls back to the generic Cloudinary fallback if type is unrecognised.
 */
export function getFallbackImage(contentType?: string): string {
  if (!contentType) return FALLBACK_IMAGE
  return CONTENT_FALLBACKS[contentType] ?? FALLBACK_IMAGE
}

// ── Alt text helper ───────────────────────────────────────────────────────────

/**
 * Derives an accessible alt text string from a content item.
 * Reads `name` / `title` / `slug` fields in priority order.
 */
export function getImageAlt(
  item: Record<string, any> | null | undefined,
  contentType?: string,
  role: 'card' | 'hero' | 'og' | 'gallery' = 'card'
): string {
  if (!item) return `${contentType ?? 'Sarvdev'} image`
  const name = String(item.name || item.title || item.slug || '').trim()
  if (!name) return `${contentType ?? 'Sarvdev'} image`
  const suffix = role === 'hero' ? ' — hero image' : role === 'og' ? ' — share image' : ''
  return `${name}${suffix}`
}

// ── Image resolution helpers ──────────────────────────────────────────────────
// These resolve the correct URL from a content item using canonical priority order.

type AnyItem = Record<string, any>

function mediaFields(item: AnyItem) {
  return {
    image: item.image, imageCard: item.imageCard, imageHero: item.imageHero,
    primaryMedia: item.primaryMedia, cardMedia: item.cardMedia, heroMedia: item.heroMedia,
  }
}

/**
 * Resolves the card image URL from a content item using canonical priority:
 *   imageCard → image → fallback
 */
export function resolveCardUrl(item: AnyItem | null | undefined, contentType?: string): string {
  if (!item) return getFallbackImage(contentType)
  const candidates = [item.cardMedia, item.imageCard, item.primaryMedia, item.image]
  for (const c of candidates) {
    const safe = normalizeImageUrl(c)
    if (safe) return safe
  }
  return getFallbackImage(contentType)
}

/**
 * Resolves the hero image URL from a content item using canonical priority:
 *   imageHero → heroImage → imageCard → image → fallback
 */
export function resolveHeroUrl(item: AnyItem | null | undefined, contentType?: string): string {
  if (!item) return getFallbackImage(contentType)
  // Card fields remain only as the final legacy fallback, never the preferred hero source.
  const candidates = [item.heroMedia, item.imageHero, item.heroImage, item.primaryMedia, item.primaryImage, item.image, item.cardMedia, item.imageCard]
  for (const c of candidates) {
    const safe = normalizeImageUrl(c)
    if (safe) return safe
  }
  return getFallbackImage(contentType)
}

/**
 * Resolves the OG image URL from a content item using canonical priority:
 *   ogImage → imageHero → heroImage → imageCard → image → fallback
 */
export function resolveOGUrl(item: AnyItem | null | undefined, contentType?: string): string {
  if (!item) return getFallbackImage(contentType)
  const candidates = [item.ogMedia, item.ogImage, item.heroMedia, item.imageHero, item.heroImage, item.primaryMedia, item.image, item.cardMedia, item.imageCard]
  for (const c of candidates) {
    const safe = normalizeImageUrl(c)
    if (safe) return safe
  }
  return getFallbackImage(contentType)
}

/**
 * Resolves gallery images from a content item using canonical priority:
 *   galleryImages → images → imageGallery → []
 * Returns only valid, sanitized URLs.
 */
export function getGalleryImages(item: AnyItem | null | undefined): string[] {
  if (!item) return []
  const legacy =
    (Array.isArray(item.galleryImages) && item.galleryImages.length > 0 ? item.galleryImages :
     Array.isArray(item.images)        && item.images.length > 0        ? item.images :
     Array.isArray(item.imageGallery)  && item.imageGallery.length > 0  ? item.imageGallery :
     []) as unknown[]
  const structured = Array.isArray(item.galleryMedia) ? item.galleryMedia : []
  const length = Math.max(legacy.length, structured.length)
  return Array.from({ length }, (_, index) => normalizeImageUrl(structured[index] || legacy[index] as SarvdevMediaInput))
    .filter(Boolean) as string[]
}

// ── Content-type-specific SarvdevImageSource getters ─────────────────────────
// These return full SarvdevImageSource objects (with srcSet, sizes, etc.)
// and correctly pass the item's image fields through to the Cloudinary engine.

/** Returns a full SarvdevImageSource for a devotional card image. */
export function getDevotionalCardImage(item?: AnyItem | string | null): SarvdevImageSource {
  // Devotionals share 16:9 blog card proportions
  return getBlogCardImage(
    typeof item === 'string' ? item :
    item ? mediaFields(item) :
    FALLBACK_IMAGE
  )
}

/** Returns a full SarvdevImageSource for a devotional hero image. */
export function getDevotionalHeroImage(item?: AnyItem | string | null): SarvdevImageSource {
  return getBlogHeroImage(
    typeof item === 'string' ? item :
    item ? mediaFields(item) :
    FALLBACK_IMAGE
  )
}

/** Returns a full SarvdevImageSource for an event card image. */
export function getEventCardImage(item?: AnyItem | string | null): SarvdevImageSource {
  return getBlogCardImage(
    typeof item === 'string' ? item :
    item ? mediaFields(item) :
    FALLBACK_IMAGE
  )
}

/** Returns a full SarvdevImageSource for an event hero image. */
export function getEventHeroImage(item?: AnyItem | string | null): SarvdevImageSource {
  return getBlogHeroImage(
    typeof item === 'string' ? item :
    item ? mediaFields(item) :
    FALLBACK_IMAGE
  )
}

/** Returns a full SarvdevImageSource for a darshan image. */
export function getDarshanCardImage(item?: AnyItem | string | null): SarvdevImageSource {
  return getBlogCardImage(
    typeof item === 'string' ? item :
    item ? {
      image: item.image ?? item.thumbnail,
      imageCard: item.imageCard,
      imageHero: item.imageHero,
      primaryMedia: item.primaryMedia,
      cardMedia: item.cardMedia,
      heroMedia: item.heroMedia,
    } :
    FALLBACK_IMAGE
  )
}

/** Returns a full SarvdevImageSource for a spiritual icon card (square). */
export function getSpiritualIconCardImage(item?: AnyItem | string | null): SarvdevImageSource {
  return getDeityCardImage(
    typeof item === 'string' ? item :
    item ? mediaFields(item) :
    FALLBACK_IMAGE
  )
}

/** Returns a full SarvdevImageSource for a spiritual icon hero image. */
export function getSpiritualIconHeroImage(item?: AnyItem | string | null): SarvdevImageSource {
  return getDeityHeroImage(
    typeof item === 'string' ? item :
    item ? mediaFields(item) :
    FALLBACK_IMAGE
  )
}

// ── Generic content-type dispatcher ──────────────────────────────────────────

type ContentType = 'temple' | 'deity' | 'devotional' | 'blog' | 'event' | 'darshan' | 'spiritualIcon'

/**
 * Returns a card SarvdevImageSource for any content type.
 * Prefer the type-specific helpers above for full type safety.
 */
export function getCardImage(contentType: ContentType, item: AnyItem | string | null | undefined): SarvdevImageSource {
  switch (contentType) {
    case 'temple':       return getTempleCardImage(item as any)
    case 'deity':        return getDeityCardImage(item as any)
    case 'devotional':   return getDevotionalCardImage(item as any)
    case 'blog':         return getBlogCardImage(item as any)
    case 'event':        return getEventCardImage(item as any)
    case 'darshan':      return getDarshanCardImage(item as any)
    case 'spiritualIcon': return getSpiritualIconCardImage(item as any)
  }
}

/**
 * Returns a hero SarvdevImageSource for any content type.
 */
export function getHeroImage(contentType: ContentType, item: AnyItem | string | null | undefined): SarvdevImageSource {
  switch (contentType) {
    case 'temple':       return getTempleHeroImage(item as any)
    case 'deity':        return getDeityHeroImage(item as any)
    case 'devotional':   return getDevotionalHeroImage(item as any)
    case 'blog':         return getBlogHeroImage(item as any)
    case 'event':        return getEventHeroImage(item as any)
    case 'darshan':      return getDarshanCardImage(item as any)
    case 'spiritualIcon': return getSpiritualIconHeroImage(item as any)
  }
}

/**
 * Returns an OG SarvdevImageSource for any content type.
 */
export function getOGImageForContent(contentType: ContentType, item: AnyItem | string | null | undefined): SarvdevImageSource {
  return getOGImage(item as any)
}

// ── Media metadata type (optional, future-safe) ───────────────────────────────
/** Optional structured media metadata. Old string fields remain fully supported. */
export type MediaMeta = {
  url: string
  publicId?: string
  width?: number
  height?: number
  format?: string
  source?: 'cloudinary' | 'local' | 'external'
  role?: 'card' | 'hero' | 'og' | 'gallery'
  alt?: string
}

/** Extracts a MediaMeta from any URL string. */
export function toMediaMeta(url: string, role?: MediaMeta['role']): MediaMeta {
  const isCloud = isCloudinaryUrl(url)
  return {
    url,
    publicId: isCloud ? (getCloudinaryPublicId(url) ?? undefined) : undefined,
    source: isCloud ? 'cloudinary' : url.startsWith('/') ? 'local' : 'external',
    role,
  }
}
