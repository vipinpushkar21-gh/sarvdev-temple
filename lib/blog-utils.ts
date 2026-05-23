export type BlogLike = {
  _id?: string
  title?: string
  titleHi?: string
  slug?: string
  excerpt?: string
  excerptHi?: string
  content?: string
  contentHi?: string
  body?: string
  category?: string
  tags?: string[] | string
  metaKeywords?: string[] | string
  status?: string
  publishedAt?: string | Date
  date?: string
  createdAt?: string | Date
  readingTime?: number
}

export const PUBLIC_BLOG_STATUSES = new Set(['published', 'approved'])
export const ADMIN_BLOG_STATUSES = ['draft', 'published', 'archived'] as const

export function isPublishedBlog(blog: BlogLike) {
  return PUBLIC_BLOG_STATUSES.has(String(blog.status || '').toLowerCase())
}

export function normalizeStatus(status?: string) {
  const raw = String(status || 'draft').toLowerCase()
  if (raw === 'approved') return 'published'
  if (raw === 'pending') return 'draft'
  if (raw === 'rejected') return 'archived'
  if (raw === 'published' || raw === 'archived' || raw === 'draft') return raw
  return 'draft'
}

export function slugifyBlog(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export function getBlogPath(blog: BlogLike) {
  return `/blog/${blog.slug || blog._id || ''}`
}

export function normalizeStringList(value: string[] | string | undefined | null): string[] {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean)
  if (!value) return []
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function listToCsv(value: string[] | string | undefined | null) {
  return normalizeStringList(value).join(', ')
}

export function getBlogContent(blog: BlogLike) {
  return blog.content || blog.body || ''
}

export function getBlogExcerpt(blog: BlogLike) {
  const excerpt = blog.excerpt || ''
  if (excerpt) return excerpt
  return getBlogContent(blog).replace(/\s+/g, ' ').slice(0, 155)
}

export function calculateReadingTime(input: string | BlogLike) {
  const text = typeof input === 'string'
    ? input
    : [input.title, input.excerpt, input.content, input.contentHi, input.body].filter(Boolean).join(' ')
  const words = text.replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 180))
}

export function getBlogDate(blog: BlogLike) {
  return blog.publishedAt || blog.date || blog.createdAt
}

export function formatBlogDate(blog: BlogLike) {
  const date = getBlogDate(blog)
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function buildBlogKeywords(blog: BlogLike) {
  return Array.from(new Set([
    ...normalizeStringList(blog.tags),
    ...normalizeStringList(blog.metaKeywords),
    blog.category,
    blog.title,
  ].filter(Boolean).map((item) => String(item))))
}

export function prepareBlogPayload(input: Record<string, any>) {
  const title = String(input.title || '').trim()
  const content = String(input.content || input.body || '').trim()
  const slug = String(input.slug || '').trim() || slugifyBlog(title)
  const tags = normalizeStringList(input.tags)
  const metaKeywords = normalizeStringList(input.metaKeywords)
  const status = normalizeStatus(input.status)
  const publishedAt = input.publishedAt || input.date || (status === 'published' ? new Date() : undefined)
  const readingTime = Number(input.readingTime) > 0 ? Number(input.readingTime) : calculateReadingTime({ ...input, content })

  return {
    title,
    titleHi: String(input.titleHi || '').trim(),
    slug,
    excerpt: String(input.excerpt || '').trim(),
    excerptHi: String(input.excerptHi || '').trim(),
    content,
    contentHi: String(input.contentHi || '').trim(),
    body: content,
    category: String(input.category || '').trim(),
    tags: tags.join(', '),
    author: String(input.author || 'Sarvdev Editorial').trim(),
    authorRole: String(input.authorRole || 'Editorial Team').trim(),
    image: String(input.image || input.imageCard || input.imageHero || '').trim(),
    imageCard: String(input.imageCard || '').trim(),
    imageHero: String(input.imageHero || '').trim(),
    ogImage: String(input.ogImage || '').trim(),
    featured: Boolean(input.featured),
    status,
    date: input.date || (publishedAt ? new Date(publishedAt).toISOString().slice(0, 10) : ''),
    publishedAt,
    readingTime,
    metaTitle: String(input.metaTitle || '').trim(),
    metaDescription: String(input.metaDescription || '').trim(),
    metaKeywords: metaKeywords.join(', '),
    canonicalUrl: String(input.canonicalUrl || '').trim(),
    relatedTempleSlugs: normalizeStringList(input.relatedTempleSlugs),
    relatedDeitySlugs: normalizeStringList(input.relatedDeitySlugs),
    relatedDevotionalSlugs: normalizeStringList(input.relatedDevotionalSlugs),
    imagePrompt: String(input.imagePrompt || '').trim(),
  }
}
