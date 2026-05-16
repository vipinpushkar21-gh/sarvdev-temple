"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BlogPost {
  _id: string
  title: string
  excerpt?: string
  image?: string
  slug: string
  createdAt: string
}

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

export default function BlogHighlights() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    fetch('/api/blogs?limit=4')
      .then(r => r.ok ? r.json() : { blogs: [] })
      .then(data => setBlogs((data.blogs || []).slice(0, 4)))
      .catch(() => {})
  }, [])

  if (blogs.length === 0) return null

  return (
    <section className="py-16 md:py-20">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-h2 font-serif text-secondary-800">From the Blog</h2>
            <p className="text-body-sm text-ink-muted mt-1">Spiritual insights, temple guides, and sacred knowledge</p>
          </div>
          <Link href="/blog" className="btn btn-outline btn-sm no-underline hover:no-underline">
            All Articles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog, i) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="group card-interactive overflow-hidden no-underline hover:no-underline"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={blog.image || DEFAULT_IMAGE}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-body-sm font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="text-caption text-ink-muted mt-2 line-clamp-2">{blog.excerpt}</p>
                )}
                <p className="text-[10px] text-ink-faint mt-3 font-medium">
                  {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
