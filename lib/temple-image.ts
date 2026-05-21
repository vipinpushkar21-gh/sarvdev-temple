/**
 * Temple image fallback utility.
 *
 * Single source of truth for the placeholder image used when a temple
 * has no `image` field or its URL fails to load at runtime.
 * All URLs are sanitized through imageGuard so only Cloudinary or local
 * assets are ever returned.
 */

import { sanitizeImageUrl } from './imageGuard'

/** Path to the local placeholder SVG served from public/ */
export const TEMPLE_PLACEHOLDER = '/images/temple-placeholder.svg'

/**
 * Returns the temple's image URL, falling back to the local placeholder.
 * Non-Cloudinary / non-local URLs are silently replaced with the placeholder.
 */
export function getTempleImage(temple: { image?: string }): string {
  return sanitizeImageUrl(temple.image?.trim()) || TEMPLE_PLACEHOLDER
}
