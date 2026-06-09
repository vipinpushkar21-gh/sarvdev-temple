import type { Metadata } from 'next'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import { getOGImage } from '@/lib/temple-image'
import { getBlogExcerpt, getBlogPath } from '@/lib/blog-utils'
import { buildBlogSchema } from '@/lib/seo'

export const revalidate = 300

const BASE = 'https://sarvdev.com'

async function findBlog(slug: string) {
  await connectDB()
  const lookup: Record<string, any>[] = [{ slug }]
  if (mongoose.Types.ObjectId.isValid(slug)) lookup.push({ _id: slug })
  return Blog.findOne({ $or: lookup }).lean() as any
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    const blog = await findBlog(slug)

    if (!blog) {
      return {
        title: 'Blog - Sarvdev',
        description: 'Read spiritual articles and temple guides on Sarvdev.',
      }
    }

    const title = blog.metaTitle || `${blog.title} - Sarvdev Blog`
    const description = blog.metaDescription || getBlogExcerpt(blog) || `Read ${blog.title} on Sarvdev.`
    const image = getOGImage(blog).src
    const url = `${BASE}${getBlogPath(blog)}`
    const publishedAt = blog.publishedAt || blog.date || blog.createdAt

    return {
      title,
      description,
      keywords: Array.isArray(blog.metaKeywords) ? blog.metaKeywords : String(blog.metaKeywords || '').split(',').filter(Boolean),
      alternates: { canonical: blog.canonicalUrl || url },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        siteName: 'Sarvdev',
        publishedTime: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
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
    return { title: 'Blog - Sarvdev' }
  }
}

export default async function BlogSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  let schemas: object[] = []
  try {
    const { slug } = await params
    const blog = await findBlog(slug)
    if (blog) schemas = buildBlogSchema(blog, blog.slug ?? slug)
  } catch { /* silent */ }

  return (
    <>
      {schemas.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      {children}
    </>
  )
}
