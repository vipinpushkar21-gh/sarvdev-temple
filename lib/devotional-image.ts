import { getDeityCardImage, getDeityHeroImage, getOGImage, getTempleCardImage, getTempleHeroImage, type SarvdevImageSource } from './temple-image'
import type { DeityImageSource } from './devotional-deity-match'

type DevotionalImageInput = {
  matchedDeity?: DeityImageSource | null
  image?: string | null
  imageCard?: string | null
  imageHero?: string | null
  ogImage?: string | null
}

export function getDevotionalCardImage(input: DevotionalImageInput | string | null | undefined): SarvdevImageSource {
  if (typeof input === 'string') return getTempleCardImage(input)

  const deity = input?.matchedDeity
  if (deity) {
    return getDeityCardImage({
      imageCard: deity.imageCard || null,
      image: deity.image || null,
    })
  }

  return getTempleCardImage(null)
}

export function getDevotionalHeroImage(input: DevotionalImageInput | string | null | undefined): SarvdevImageSource {
  if (!input || typeof input === 'string') return getTempleHeroImage(input)

  const deity = input.matchedDeity
  if (deity) {
    return getDeityHeroImage({
      imageHero: deity.imageHero || deity.imageCard || deity.image || null,
      imageCard: deity.imageCard || null,
      image: deity.image || deity.imageCard || null,
    })
  }

  return getTempleHeroImage(null)
}

export function getDevotionalOGImage(input: DevotionalImageInput | string | null | undefined): SarvdevImageSource {
  if (typeof input === 'string') return getOGImage(input)

  const deity = input?.matchedDeity
  if (deity) {
    return getOGImage({
      imageHero: deity.imageHero || deity.imageCard || deity.image || null,
      imageCard: deity.imageCard || null,
      image: deity.image || deity.imageCard || null,
      ogImage: null,
    })
  }

  return getOGImage(null)
}

export function getDevotionalHeroUrl(input: DevotionalImageInput | string | null | undefined): string {
  return getDevotionalHeroImage(input).src
}
