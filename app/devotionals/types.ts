export type Devotional = {
  _id: string

  // Core identity
  title: string
  titleHi?: string
  slug?: string

  // Category
  category?: string
  categorySlug?: string
  categoryHi?: string

  // Deity
  deity?: string
  deityHi?: string
  deitySlug?: string

  // Content
  description?: string
  descriptionHi?: string
  content?: string
  contentHi?: string
  lyrics?: string

  // Media
  audioUrl?: string
  audio?: string
  duration?: string
  artist?: string

  // Images
  image?: string
  imageCard?: string
  imageHero?: string
  ogImage?: string

  // Classification
  language?: string
  tags?: string[] | string
  featured?: boolean

  // Admin / provenance
  source?: string
  isCustomized?: boolean
  status?: string

  // SEO
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string

  // Legacy fields
  type?: string
  names?: { sanskrit?: string; mantra?: string; english?: string }[]

  // Timestamps
  createdAt?: string
  updatedAt?: string
}
