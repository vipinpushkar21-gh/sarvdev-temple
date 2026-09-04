import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import { resolveMediaOriginal } from '@/lib/media-asset'

export const STORY_PAGE_SIZE = 24
export const PUBLIC_STORY_FILTER = { status: { $in: ['published', 'approved'] } }
export const STORY_CARD_PROJECTION = 'title titleHi slug excerpt excerptHi category tags author publishedAt date createdAt featured image imageCard imageHero primaryMedia cardMedia heroMedia ogImage ogMedia'

export function hasStoryMedia(story: Record<string, any>) {
  return [story.cardMedia, story.primaryMedia, story.heroMedia, story.ogMedia, story.imageCard, story.image, story.imageHero, story.ogImage].some((value) => Boolean(resolveMediaOriginal(value)))
}

export async function getStoryListing({ query = '', category = '', page = 1 }: { query?: string; category?: string; page?: number }) {
  await connectDB()
  const filter: Record<string, any> = { ...PUBLIC_STORY_FILTER }
  if (category) filter.category = category
  if (query) {
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ title: regex }, { titleHi: regex }, { excerpt: regex }, { excerptHi: regex }, { category: regex }, { tags: regex }]
  }
  const safePage = Math.max(1, page)
  const [stories, total, categories] = await Promise.all([
    Blog.find(filter, STORY_CARD_PROJECTION).sort({ featured: -1, publishedAt: -1, createdAt: -1 }).skip((safePage - 1) * STORY_PAGE_SIZE).limit(STORY_PAGE_SIZE).lean(),
    Blog.countDocuments(filter), Blog.distinct('category', PUBLIC_STORY_FILTER),
  ])
  return { stories: stories as any[], total, categories: categories.filter(Boolean).sort(), page: safePage, pages: Math.max(1, Math.ceil(total / STORY_PAGE_SIZE)) }
}

export async function getPublishedStory(slug: string) { await connectDB(); return Blog.findOne({ ...PUBLIC_STORY_FILTER, slug }).lean() as Promise<any> }

export async function getRelatedStories(story: Record<string, any>) {
  const tags = Array.isArray(story.tags) ? story.tags : String(story.tags || '').split(',').map((item) => item.trim()).filter(Boolean)
  const relation = [{ category: story.category }, ...(tags.length ? [{ tags: { $in: tags } }] : [])].filter((item) => Object.values(item)[0])
  if (!relation.length) return []
  await connectDB()
  return Blog.find({ ...PUBLIC_STORY_FILTER, _id: { $ne: story._id }, $or: relation }, STORY_CARD_PROJECTION).sort({ publishedAt: -1, createdAt: -1 }).limit(4).lean() as Promise<any[]>
}
