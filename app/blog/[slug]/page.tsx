"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/temples/avno1ltpdyzpzsby1mll.jpg'

type Blog = {
  _id: string
  title: string
  excerpt?: string
  date?: string
  image?: string
  body?: string
  status?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${slug}`)
        if (res.ok) {
          const data = await res.json()
          if (data.status === 'approved') {
            setPost(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch blog:', error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchBlog()
  }, [slug])

  if (loading) {
    return (
      <main className="content-container section-sm max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-sunken rounded w-3/4" />
          <div className="h-4 bg-surface-sunken rounded w-1/4" />
          <div className="h-64 bg-surface-sunken rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 bg-surface-sunken rounded w-full" />
            <div className="h-4 bg-surface-sunken rounded w-5/6" />
            <div className="h-4 bg-surface-sunken rounded w-4/6" />
          </div>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="content-container section-sm max-w-3xl mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
        </div>
        <h1 className="text-h2 font-serif text-secondary-800 mb-3">Article not found</h1>
        <p className="text-body-sm text-ink-muted mb-6">We couldn&apos;t find the article you&apos;re looking for.</p>
        <Link href="/blog" className="btn btn-primary no-underline hover:no-underline group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back to blog
        </Link>
      </main>
    )
  }

  return (
    <main className="content-container section-sm">
      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors no-underline hover:no-underline">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600 transition-colors no-underline hover:no-underline">Blog</Link>
          <span>/</span>
          <span className="text-ink font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-display-lg font-serif text-secondary-800 leading-tight">{post.title}</h1>
          {post.date && (
            <div className="mt-3 text-body-sm text-primary-600 font-semibold">
              {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
          <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </header>

        <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={post.image || DEFAULT_IMAGE}
            alt={post.title}
            className="w-full h-64 object-cover"
            onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
          />
        </div>

        {post.body && (
          <section className="prose max-w-none text-body text-ink-muted leading-relaxed">
            <div className="whitespace-pre-wrap">{post.body}</div>
          </section>
        )}

        <footer className="mt-10 pt-6 border-t border-surface-border">
          <Link href="/blog" className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary-600 no-underline hover:text-primary-700 hover:no-underline transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back to blog
          </Link>
        </footer>
      </article>
    </main>
  )
}
