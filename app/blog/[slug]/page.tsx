"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
        const res = await fetch('/api/blogs')
        if (res.ok) {
          const data = await res.json()
          const found = data.find((b: Blog) => b._id === slug && b.status === 'approved')
          setPost(found || null)
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
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center text-text">Loading...</div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-primary mb-4">Article not found</h1>
        <p className="text-text mb-6">We couldn't find the article you're looking for.</p>
        <Link href="/blog" className="hover:underline">Back to blog</Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold text-primary">{post.title}</h1>
          {post.date && <div className="text-sm text-text">{new Date(post.date).toLocaleDateString()}</div>}
        </header>

        {post.image && <img src={post.image} alt={post.title} className="w-full h-auto rounded-md object-cover" />}

        {post.body && (
          <section className="prose max-w-none">
            <div className="whitespace-pre-wrap">{post.body}</div>
          </section>
        )}

        <footer>
          <Link href="/blog" className="hover:underline">← Back to blog</Link>
        </footer>
      </article>
    </main>
  )
}
