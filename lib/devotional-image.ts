import { FALLBACK_IMAGE } from './imageGuard'
import { getOGImage, getTempleCardImage, getTempleHeroImage, type SarvdevImageSource } from './temple-image'

export const DEVOTIONAL_FALLBACK_IMAGE = FALLBACK_IMAGE

export function getDevotionalCardImage(_input?: unknown): SarvdevImageSource {
  return getTempleCardImage(DEVOTIONAL_FALLBACK_IMAGE)
}

export function getDevotionalHeroImage(_input?: unknown): SarvdevImageSource {
  return getTempleHeroImage(DEVOTIONAL_FALLBACK_IMAGE)
}

export function getDevotionalOGImage(_input?: unknown): SarvdevImageSource {
  return getOGImage(DEVOTIONAL_FALLBACK_IMAGE)
}

export function getDevotionalHeroUrl(input?: unknown): string {
  return getDevotionalHeroImage(input).src
}
