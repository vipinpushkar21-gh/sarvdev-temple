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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-surface-sunken" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-surface-sunken rounded w-3/4" />
                  <div className="h-3 bg-surface-sunken rounded w-1/3" />
                  <div className="h-3 bg-surface-sunken rounded w-full" />
                  <div className="h-3 bg-surface-sunken rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
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
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>
            </div>
            <p className="text-body text-ink-muted">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p: Blog) => (
              <article key={p._id} className="group card-interactive overflow-hidden">
                {p.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  {p.date && (
                    <div className="text-caption text-primary-600 font-semibold mb-2">
                      {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                  <h3 className="text-h4 font-serif">
                    <Link href={`/blog/${p._id}`} className="text-secondary-700 no-underline hover:text-primary-600 hover:no-underline transition-colors">{p.title}</Link>
                  </h3>
                  <p className="text-body-sm text-ink-muted mt-2 line-clamp-2">{p.excerpt}</p>
                  <div className="mt-4">
                    <Link href={`/blog/${p._id}`} className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary-600 no-underline hover:text-primary-700 hover:no-underline transition-colors group/link">
                      Read more
                      <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
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

