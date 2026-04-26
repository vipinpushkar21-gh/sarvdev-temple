"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Hero from '../../components/Hero'

const CATEGORIES = [
  { value: '', label: 'Sab Posts', icon: '🕉️' },
  { value: 'general', label: 'General', icon: '💬' },
  { value: 'temples', label: 'Temples', icon: '🛕' },
  { value: 'festivals', label: 'Festivals', icon: '🪔' },
  { value: 'devotionals', label: 'Devotionals', icon: '🎵' },
  { value: 'rituals', label: 'Rituals', icon: '🔱' },
  { value: 'questions', label: 'Questions', icon: '🙏' },
]

type ForumPost = {
  _id: string
  title: string
  category: string
  authorName: string
  likes: number
  views: number
  replies: { _id: string }[]
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
  return `${days}d ago`
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: 'general', authorName: '', tags: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/forum?category=${category}&page=${page}&limit=15`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || [])
        setTotal(data.total || 0)
        setPages(data.pages || 1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, page])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setForm({ title: '', content: '', category: 'general', authorName: '', tags: '' })
        setShowForm(false)
        setPage(1)
        setCategory('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Hero title="Community Forum" subtitle="Devotees ka manch — apne anubhav, sawaal aur vichar share karein" />

      <main className="page-container section-sm">
        {submitted && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-body-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Aapki post publish ho gayi! 🙏
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-body-sm text-ink-muted">{total} posts</p>
              <button
                onClick={() => setShowForm(s => !s)}
                className="btn btn-primary btn-sm no-underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Naya Post
              </button>
            </div>

            {/* New post form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4">
                <h3 className="text-h4 font-serif text-secondary-700">Naya Discussion Shuru Karein</h3>
                <input
                  type="text"
                  placeholder="Vishay (Title) *"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-ink text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={200}
                  required
                />
                <textarea
                  placeholder="Apna vichar ya sawaal yahan likhein... *"
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-ink text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  rows={5}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-ink text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CATEGORIES.filter(c => c.value).map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Aapka naam (optional)"
                    value={form.authorName}
                    onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-ink text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-ink text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                    {submitting ? 'Publishing...' : 'Post Karein 🙏'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Posts list */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse space-y-3">
                    <div className="h-5 bg-surface-sunken rounded w-3/4" />
                    <div className="h-3 bg-surface-sunken rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-body text-ink-muted">Is category mein abhi koi post nahi hai. Pehle post karein!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map(post => (
                  <Link
                    key={post._id}
                    href={`/forum/${post._id}`}
                    className="card-interactive block p-5 no-underline hover:no-underline group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {post.isPinned && (
                            <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wide">📌 Pinned</span>
                          )}
                          <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wide bg-surface-sunken px-2 py-0.5 rounded-full">
                            {CATEGORIES.find(c => c.value === post.category)?.icon} {post.category}
                          </span>
                        </div>
                        <h3 className="text-body-sm font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-2">{post.title}</h3>
                        <div className="mt-2 flex items-center gap-3 text-caption text-ink-muted flex-wrap">
                          <span>by {post.authorName}</span>
                          <span>·</span>
                          <span>{timeAgo(post.createdAt)}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            {post.replies?.length ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {post.views}
                          </span>
                        </div>
                        {post.tags?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {post.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="text-[10px] text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-ink-muted group-hover:text-primary-500 transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline btn-sm disabled:opacity-40">Prev</button>
                <span className="btn btn-outline btn-sm pointer-events-none">{page} / {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn btn-outline btn-sm disabled:opacity-40">Next</button>
              </div>
            )}
          </div>

          {/* Sidebar — categories */}
          <aside className="lg:w-56 xl:w-64 shrink-0">
            <div className="card p-4 sticky top-24">
              <h3 className="text-body-sm font-semibold text-ink mb-3">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => { setCategory(cat.value); setPage(1) }}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm transition-colors ${
                      category === cat.value
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-ink hover:bg-surface-sunken'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
