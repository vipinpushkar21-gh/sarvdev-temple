"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-slate-600">Loading blogs...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="text-slate-700 dark:text-slate-200 text-base mt-2">Articles and guides about temples, rituals, and visiting tips.</p>
      </header>

      <section>
        {posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No blog posts available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p: Blog) => (
              <article key={p._id} className="bg-white/60 dark:bg-slate-900/60 rounded-lg shadow-sm overflow-hidden">
                {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1"><Link href={`/blog/${p._id}`} className="hover:underline">{p.title}</Link></h3>
                  {p.date && <div className="text-xs text-slate-500 mb-2">{new Date(p.date).toLocaleDateString()}</div>}
                  <p className="text-sm text-slate-700">{p.excerpt}</p>
                  <div className="mt-3">
                    <Link href={`/blog/${p._id}`} className="text-emerald-600 hover:underline">Read more →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

