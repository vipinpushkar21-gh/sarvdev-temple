import { sanitizeImageUrl } from './imageGuard'
import { resolveMediaOriginal, type SarvdevMediaInput } from './media-asset'

/**
 * A temple only counts as illustrated when a managed asset resolves to a real URL.
 * Display fallbacks must never be presented as photography.
 */
export function hasUsableTempleMedia(record: Record<string, unknown> | null | undefined) {
  if (!record) return false
  return [record.primaryMedia, record.cardMedia, record.heroMedia]
    .some((media) => Boolean(sanitizeImageUrl(resolveMediaOriginal(media as SarvdevMediaInput), '')))
}

export function getTempleGalleryMedia(record: Record<string, unknown> | null | undefined) {
  const gallery = Array.isArray(record?.galleryMedia) ? record?.galleryMedia : []
  return gallery.filter((media) => Boolean(sanitizeImageUrl(resolveMediaOriginal(media as SarvdevMediaInput), '')))
}
