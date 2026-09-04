/**
 * imageGuard.ts — Sarvdev Image Safety Layer
 *
 * Single source of truth for allowed image hosts.
 * All image rendering in the app should pass through these helpers
 * to ensure only Cloudinary or local assets are ever displayed.
 */

/** The only allowed remote image hostname */
export const CLOUDINARY_HOST = 'res.cloudinary.com'

/** Local, explicitly generic placeholders. They never represent uploaded content. */
export const CONTENT_PLACEHOLDERS = {
  temple: '/images/placeholders/temple.svg',
  deity: '/images/placeholders/deity.svg',
  devotional: '/images/placeholders/devotional.svg',
  blog: '/images/placeholders/story.svg',
  event: '/images/placeholders/event.svg',
  darshan: '/images/placeholders/darshan.svg',
  spiritualIcon: '/images/placeholders/spiritual-icon.svg',
  generic: '/images/placeholders/generic.svg',
} as const

export type PlaceholderContentType = keyof typeof CONTENT_PLACEHOLDERS
export const FALLBACK_IMAGE = CONTENT_PLACEHOLDERS.generic
export const LOCAL_PLACEHOLDER = CONTENT_PLACEHOLDERS.temple

export function getContentPlaceholder(type: PlaceholderContentType = 'generic'): string {
  return CONTENT_PLACEHOLDERS[type]
}

/**
 * Returns true only for:
 *   - Cloudinary URLs  (res.cloudinary.com or *.cloudinary.com)
 *   - Local paths      (/images/..., /public/...)
 */
export function isAllowedImageHost(url: string | undefined | null): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed) return false
  // Allow local paths
  if (trimmed.startsWith('/')) return true
  // Allow relative paths (e.g. blob: in admin previews)
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) return true
  try {
    const { hostname } = new URL(trimmed)
    return hostname === CLOUDINARY_HOST || hostname.endsWith('.cloudinary.com')
  } catch {
    return false
  }
}

/**
 * Returns the URL unchanged if it is allowed, otherwise returns `fallback`.
 * Defaults to empty string so callers can chain with `|| FALLBACK_IMAGE`.
 */
export function sanitizeImageUrl(
  url: string | undefined | null,
  fallback = ''
): string {
  return isAllowedImageHost(url) ? (url as string).trim() : fallback
}

/**
 * Safe temple image — always returns a renderable URL.
 * Returns Cloudinary URL if allowed, otherwise FALLBACK_IMAGE.
 */
export function getSafeTempleImage(url?: string | null): string {
  return sanitizeImageUrl(url, CONTENT_PLACEHOLDERS.temple)
}

/**
 * Safe deity image — always returns a renderable URL.
 * Returns Cloudinary URL if allowed, otherwise FALLBACK_IMAGE.
 */
export function getSafeDeityImage(url?: string | null): string {
  return sanitizeImageUrl(url, CONTENT_PLACEHOLDERS.deity)
}

/**
 * Returns the canonical fallback URL.
 * Convenience alias for components that need a hardcoded fallback.
 */
export function getDefaultImage(): string {
  return CONTENT_PLACEHOLDERS.generic
}
