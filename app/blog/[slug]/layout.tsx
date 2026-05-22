import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import { getOGImage } from '@/lib/temple-image'

export const revalidate = 300

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    await connectDB()
    const blog = await Blog.findById(slug).lean() as any

    if (!blog) {
      return {
        title: 'Blog — Sarvdev',
        description: 'Read spiritual articles and temple guides on Sarvdev.',
      }
    }

    const title = `${blog.title} — Sarvdev Blog`
    const description = blog.excerpt
      ? blog.excerpt.slice(0, 155)
      : `Read "${blog.title}" — spiritual insights and temple stories on Sarvdev.`
    const image = getOGImage(blog).src || DEFAULT_IMAGE
    const url = `${BASE}/blog/${slug}`
    const publishedAt = blog.date ? new Date(blog.date).toISOString() : new Date(blog.createdAt).toISOString()

    return {
      title,
      description,
      keywords: ['Hindu temple', 'spirituality', 'blog', 'Sarvdev', blog.title],
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        siteName: 'Sarvdev',
        publishedTime: publishedAt,
        images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    }
  } catch {
    return { title: 'Blog — Sarvdev' }
  }
}

export default async function BlogSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  let breadcrumbLd: object | null = null
  try {
    const { slug } = await params
    await connectDB()
    const blog = await Blog.findById(slug).lean() as any
    if (blog) {
      breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
          { '@type': 'ListItem', position: 3, name: blog.title, item: `${BASE}/blog/${slug}` },
        ],
      }
    }
  } catch { /* silent */ }

  return (
    <>
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      {children}
    </>
  )
}
