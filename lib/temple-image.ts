/**
 * Temple image fallback utility.
 *
 * Single source of truth for the placeholder image used when a temple
 * has no `image` field or its URL fails to load at runtime.
 */

/** Default Cloudinary image used when a temple has no image */
export const TEMPLE_PLACEHOLDER = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/temples/avno1ltpdyzpzsby1mll.jpg'

/**
 * Returns the temple's image URL, falling back to the local placeholder
 * when the image field is missing or empty.
 */
export function getTempleImage(temple: { image?: string }): string {
  return temple.image?.trim() || TEMPLE_PLACEHOLDER
}
