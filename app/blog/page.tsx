"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Hero from '../../components/Hero'

type Blog = {
  _id: string
  title: string
  excerpt?: string
  date?: string
  image?: string
  status?: string
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs')
        if (res.ok) {
          const data = await res.json()
          // Only show approved blogs
          const approved = data.filter((b: Blog) => b.status === 'approved')
          setPosts(approved)
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <>
        <Hero title="Blog" subtitle="Articles and guides about temples, rituals, and visiting tips." />
        <main className="page-container section-sm">
          <div className="text-center text-ink-muted">Loading blogs...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Hero title="Blog" subtitle="Articles and guides about temples, rituals, and visiting tips." />
      <main className="page-container section-sm">

      <section>
        {posts.length === 0 ? (
          <div className="text-center py-12 text-ink-muted">
            No blog posts available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p: Blog) => (
              <article key={p._id} className="card-interactive overflow-hidden">
                {p.image && <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />}
                <div className="p-5">
                  <h3 className="text-h4 font-serif"><Link href={`/blog/${p._id}`} className="text-secondary-700 no-underline hover:text-primary-600 hover:no-underline">{p.title}</Link></h3>
                  {p.date && <div className="text-caption text-ink-muted mt-1 mb-2">{new Date(p.date).toLocaleDateString()}</div>}
                  <p className="text-body-sm text-ink-muted">{p.excerpt}</p>
                  <div className="mt-3">
                    <Link href={`/blog/${p._id}`} className="text-body-sm font-medium text-primary-600 no-underline hover:underline">Read more →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </main>
    </>
  )
}

