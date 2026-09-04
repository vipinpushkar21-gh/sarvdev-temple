import { sanitizeImageUrl } from './imageGuard'
import { resolveMediaOriginal, type SarvdevMediaInput } from './media-asset'

type DevotionalMediaRecord = {
  cardMedia?: SarvdevMediaInput
  primaryMedia?: SarvdevMediaInput
  heroMedia?: SarvdevMediaInput
  galleryMedia?: SarvdevMediaInput[]
  imageCard?: string
  image?: string
  imageHero?: string
}

/**
 * A devotional counts as illustrated only when a managed asset resolves to a real URL.
 * Display fallbacks must never be presented as devotional artwork.
 */
export function hasUsableDevotionalMedia(record: Record<string, unknown> | null | undefined) {
  if (!record) return false
  return [record.primaryMedia, record.cardMedia, record.heroMedia]
    .some((media) => Boolean(sanitizeImageUrl(resolveMediaOriginal(media as SarvdevMediaInput), '')))
}

export function getDevotionalGalleryMedia(record: Record<string, unknown> | null | undefined) {
  const gallery = Array.isArray(record?.galleryMedia) ? record?.galleryMedia : []
  return gallery.filter((media) => Boolean(sanitizeImageUrl(resolveMediaOriginal(media as SarvdevMediaInput), '')))
}

/** One restrained supporting visual: managed media first, then legitimate legacy artwork. */
export function getDevotionalSupportingMedia(record: DevotionalMediaRecord | null | undefined): SarvdevMediaInput | null {
  if (!record) return null

  const candidates: SarvdevMediaInput[] = [
    record.cardMedia,
    record.primaryMedia,
    record.heroMedia,
    ...(record.galleryMedia || []),
    record.imageCard,
    record.image,
    record.imageHero,
  ]

  return candidates.find((media) => Boolean(sanitizeImageUrl(resolveMediaOriginal(media), ''))) ?? null
}
