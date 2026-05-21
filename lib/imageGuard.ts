/**
 * imageGuard.ts — Sarvdev Image Safety Layer
 *
 * Single source of truth for allowed image hosts.
 * All image rendering in the app should pass through these helpers
 * to ensure only Cloudinary or local assets are ever displayed.
 */

/** The only allowed remote image hostname */
export const CLOUDINARY_HOST = 'res.cloudinary.com'

/** Canonical Cloudinary fallback used across the entire site */
export const FALLBACK_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

/** Local SVG placeholder (public/images/temple-placeholder.svg) */
export const LOCAL_PLACEHOLDER = '/images/temple-placeholder.svg'

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
  return sanitizeImageUrl(url, FALLBACK_IMAGE)
}

/**
 * Safe deity image — always returns a renderable URL.
 * Returns Cloudinary URL if allowed, otherwise FALLBACK_IMAGE.
 */
export function getSafeDeityImage(url?: string | null): string {
  return sanitizeImageUrl(url, FALLBACK_IMAGE)
}

/**
 * Returns the canonical fallback URL.
 * Convenience alias for components that need a hardcoded fallback.
 */
export function getDefaultImage(): string {
  return FALLBACK_IMAGE
}
