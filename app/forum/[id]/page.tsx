"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Hero from '../../../components/Hero'

type Reply = {
  _id: string
  content: string
  authorName: string
  likes: number
  createdAt: string
}

type ForumPost = {
  _id: string
  title: string
  content: string
  category: string
  authorName: string
  likes: number
  views: number
  replies: Reply[]
  isPinned: boolean
  tags: string[]
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ForumThreadPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [post, setPost] = useState<ForumPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [replyForm, setReplyForm] = useState({ content: '', authorName: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/forum/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setPost(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  async function handleLike() {
    if (liked || !post) return
    setLiked(true)
    const res = await fetch(`/api/forum/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like' }),
    })
    if (res.ok) {
      const data = await res.json()
      setPost(p => p ? { ...p, likes: data.likes } : p)
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyForm.content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/forum/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyForm),
      })
      if (res.ok) {
        const updated = await res.json()
        setPost(updated)
        setReplyForm({ content: '', authorName: '' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Hero title="Forum" />
        <main className="page-container section-sm">
          <div className="max-w-3xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-surface-sunken rounded w-3/4" />
            <div className="h-40 bg-surface-sunken rounded" />
          </div>
        </main>
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Hero title="Forum" />
        <main className="page-container section-sm text-center py-16">
          <p className="text-body text-ink-muted">Post nahi mili. Shayad delete ho gayi.</p>
          <Link href="/forum" className="btn btn-primary mt-4 no-underline hover:no-underline">Forum par Wapis Jayein</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Hero title="Forum" />
      <main className="page-container section-sm">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back */}
          <Link href="/forum" className="inline-flex items-center gap-1.5 text-body-sm text-ink-muted hover:text-primary-600 transition-colors no-underline hover:no-underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Forum par Wapis
          </Link>

          {/* Main post */}
          <article className="card p-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wide bg-surface-sunken px-2.5 py-1 rounded-full">
                {post.category}
              </span>
              {post.isPinned && (
                <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase">📌 Pinned</span>
              )}
            </div>

            <h1 className="text-h3 font-serif text-secondary-700 leading-snug">{post.title}</h1>

            <div className="flex items-center gap-3 text-caption text-ink-muted flex-wrap">
              <span className="font-medium text-ink">{post.authorName}</span>
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
              <span>·</span>
              <span>{post.views} views</span>
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(tag => (
                  <span key={tag} className="text-caption text-primary-600 bg-primary-50 px-2 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-surface-border text-body text-ink whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>

            {/* Like */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-1.5 text-body-sm font-medium transition-colors ${liked ? 'text-primary-600' : 'text-ink-muted hover:text-primary-600'}`}
              >
                <svg className={`w-5 h-5 ${liked ? 'fill-primary-500 stroke-primary-500' : 'fill-none stroke-current'}`} viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {post.likes} likes
              </button>
              <span className="text-body-sm text-ink-muted">{post.replies.length} replies</span>
            </div>
          </article>

          {/* Replies */}
          {post.replies.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-h4 font-serif text-secondary-700">{post.replies.length} Replies</h2>
              {post.replies.map((reply, idx) => (
                <div key={reply._id || idx} className="card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-caption text-ink-muted">
                    <span className="font-semibold text-ink">{reply.authorName}</span>
                    <span>·</span>
                    <span>{timeAgo(reply.createdAt)}</span>
                  </div>
                  <p className="text-body-sm text-ink leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}
            </section>
          )}

          {/* Reply form */}
          <section className="card p-6 space-y-4">
            <h2 className="text-h4 font-serif text-secondary-700">Reply Karein</h2>
            <form onSubmit={handleReply} className="space-y-3">
              <input
                type="text"
                placeholder="Aapka naam (optional)"
                value={replyForm.authorName}
                onChange={e => setReplyForm(f => ({ ...f, authorName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-ink text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                placeholder="Apna vichar yahan likhein... 🙏"
                value={replyForm.content}
                onChange={e => setReplyForm(f => ({ ...f, content: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-ink text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={4}
                required
              />
              <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                {submitting ? 'Posting...' : 'Reply Karein 🙏'}
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}
