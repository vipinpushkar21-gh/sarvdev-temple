/**
 * Temple image fallback utility.
 *
 * Single source of truth for the placeholder image used when a temple
 * has no `image` field or its URL fails to load at runtime.
 */

/** Path to the local placeholder SVG served from public/ */
export const TEMPLE_PLACEHOLDER = '/images/temple-placeholder.svg'

/**
 * Returns the temple's image URL, falling back to the local placeholder
 * when the image field is missing or empty.
 */
export function getTempleImage(temple: { image?: string }): string {
  return temple.image?.trim() || TEMPLE_PLACEHOLDER
}
