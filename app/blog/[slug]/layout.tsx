import type { Metadata } from 'next'
import { getOGImage } from '@/lib/temple-image'
import { getBlogExcerpt } from '@/lib/blog-utils'
import { getPublishedStory, hasStoryMedia } from '@/lib/sacred-stories'

const BASE = 'https://sarvdev.com'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const story = await getPublishedStory(slug)
    if (!story) return { title: 'Sacred Story | Sarvdev' }
    const title = story.metaTitle || story.title
    const description = story.metaDescription || getBlogExcerpt(story) || undefined
    const url = `${BASE}/blog/${story.slug}`
    const image = hasStoryMedia(story) ? getOGImage(story).src : undefined
    return {
      title: `${title} | Sacred Stories | Sarvdev`, description,
      alternates: { canonical: url },
      openGraph: { title, description, url, type: 'article', ...(image ? { images: [{ url: image, alt: story.title }] } : {}) },
      twitter: { card: image ? 'summary_large_image' : 'summary', title, description, ...(image ? { images: [image] } : {}) },
    }
  } catch { return { title: 'Sacred Story | Sarvdev' } }
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) { return children }
