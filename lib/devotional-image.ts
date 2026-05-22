import { getOGImage, getTempleCardImage, getTempleHeroImage, type SarvdevImageSource } from './temple-image'

type DevotionalImageInput = {
  image?: string | null
  imageCard?: string | null
  imageHero?: string | null
  ogImage?: string | null
}

export function getDevotionalCardImage(input: DevotionalImageInput | string | null | undefined): SarvdevImageSource {
  return getTempleCardImage(input)
}

export function getDevotionalHeroImage(input: DevotionalImageInput | string | null | undefined): SarvdevImageSource {
  if (!input || typeof input === 'string') return getTempleHeroImage(input)

  return getTempleHeroImage({
    imageHero: input.imageHero || input.imageCard || input.image || null,
    image: input.image || input.imageCard || null,
  })
}

export function getDevotionalOGImage(input: DevotionalImageInput | string | null | undefined): SarvdevImageSource {
  return getOGImage(input)
}

export function getDevotionalHeroUrl(input: DevotionalImageInput | string | null | undefined): string {
  return getDevotionalHeroImage(input).src
}

