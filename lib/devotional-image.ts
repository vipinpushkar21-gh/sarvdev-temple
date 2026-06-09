import { FALLBACK_IMAGE } from './imageGuard'
import {
  getDevotionalCardImage as _getDevotionalCardImage,
  getDevotionalHeroImage as _getDevotionalHeroImage,
  type SarvdevImageSource,
} from './media'
import { getOGImage } from './temple-image'

export const DEVOTIONAL_FALLBACK_IMAGE = FALLBACK_IMAGE

export function getDevotionalCardImage(input?: unknown): SarvdevImageSource {
  return _getDevotionalCardImage(input as any)
}

export function getDevotionalHeroImage(input?: unknown): SarvdevImageSource {
  return _getDevotionalHeroImage(input as any)
}

export function getDevotionalOGImage(input?: unknown): SarvdevImageSource {
  return getOGImage(input as any)
}

export function getDevotionalHeroUrl(input?: unknown): string {
  return getDevotionalHeroImage(input).src
}
