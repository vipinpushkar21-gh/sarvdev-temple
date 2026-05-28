import type { DeityImageSource } from '../../lib/devotional-deity-match'

export type Devotional = {
  _id: string
  title: string
  description?: string
  descriptionHi?: string
  category?: string
  language?: string
  deity?: string
  audio?: string
  lyrics?: string
  duration?: string
  artist?: string
  status?: string
  type?: string
  createdAt?: string
  image?: string
  imageCard?: string
  imageHero?: string
  ogImage?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  names?: { sanskrit?: string; mantra?: string; english?: string }[]
  tags?: string[] | string
  deitySlug?: string
  slug?: string
  matchedDeity?: DeityImageSource | null
  matchedDeityName?: string
  matchedDeitySlug?: string
  matchedDeityScore?: number
  matchedDeityReason?: string
}
