"use client"

import { useEffect, useState } from 'react'
import StarRating from './StarRating'

type Review = {
  _id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

export default function ReviewSection({ templeSlug }: { templeSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/reviews?slug=${encodeURIComponent(templeSlug)}`)
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [templeSlug])

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templeSlug, ...form }),
      })
      if (!res.ok) throw new Error('Failed')
      const newReview = await res.json()
      setReviews(prev => [newReview, ...prev])
      setForm({ name: '', rating: 5, comment: '' })
      setShowForm(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Review submit nahi hua. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card p-5 sm:p-6 mb-6 reveal">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-h4 font-serif text-secondary-700">Ratings & Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating value={avg} size="sm" />
                <span className="text-caption text-ink-muted">
                  {avg.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="btn btn-primary btn-sm shrink-0"
        >
          {showForm ? 'Cancel' : '+ Review'}
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-body-sm flex items-center gap-2">
          <span>✓</span> Review successfully submitted! Dhanyavaad 🙏
        </div>
      )}

      {/* Write Review Form */}
      {showForm && (
        <form onSubmit={submit} className="mb-6 p-4 rounded-xl bg-surface-sunken border border-surface-border space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-caption font-semibold text-ink-muted mb-1">Your Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Ramesh Kumar"
                maxLength={80}
                required
                className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-body text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-ink-muted mb-1">Rating *</label>
              <StarRating
                value={form.rating}
                size="lg"
                interactive
                onChange={v => setForm(p => ({ ...p, rating: v }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-caption font-semibold text-ink-muted mb-1">Review *</label>
            <textarea
              value={form.comment}
              onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
              placeholder="Apna anubhav likhein… (Write your experience)"
              rows={3}
              maxLength={1000}
              required
              className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-body text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary-300 transition resize-none"
            />
            <p className="text-caption text-ink-muted mt-1 text-right">{form.comment.length}/1000</p>
          </div>
          {error && <p className="text-caption text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn btn-primary btn-sm disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Submit Review 🙏'}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="p-4 rounded-xl bg-surface-sunken space-y-2">
              <div className="h-4 bg-surface-border rounded w-1/3" />
              <div className="h-3 bg-surface-border rounded w-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-ink-muted">
          <p className="text-2xl mb-2">🙏</p>
          <p className="text-body-sm">Pehle review likhne wale baniye!</p>
          <button onClick={() => setShowForm(true)} className="btn btn-outline btn-sm mt-3">
            Write First Review
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="p-4 rounded-xl bg-surface-sunken border border-surface-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-caption font-bold shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-body-sm font-semibold text-ink">{r.name}</p>
                    <StarRating value={r.rating} size="sm" />
                  </div>
                </div>
                <time className="text-caption text-ink-muted shrink-0">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </div>
              <p className="mt-2 text-body-sm text-ink leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
