"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { FULL_CATEGORIES } from '@/app/devotionals/components/categories'

function createSlug(title: string): string {
  const englishMatch = title.match(/\(([^)]+)\)/)
  let text = englishMatch ? englishMatch[1] : title
  let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  if (!slug || slug === '-') {
    slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }
  return slug || 'devotional'
}

export default function NewDevotionalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    titleHi: '',
    slug: '',
    description: '',
    descriptionHi: '',
    category: 'Bhajan',
    subcategory: '',
    language: 'Hindi',
    deity: '',
    audio: '',
    lyrics: '',
    duration: '',
    artist: '',
    featured: false,
    status: 'approved',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    image: '',
  })

  const slugPreview = useMemo(() => formData.slug || createSlug(formData.title), [formData.title, formData.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { ...formData, slug: slugPreview }
      const res = await fetch('/api/devotionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert('Devotional added successfully!')
        router.push('/admin/devotionals')
      } else {
        alert('Failed to add devotional')
      }
    } catch {
      alert('Error adding devotional')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value, ...(name === 'category' ? { subcategory: '' } : {}) })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Add New Devotional</h1>
          <p className="admin-section-subtitle">Fill in the devotional details below</p>
        </div>
        <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back to Devotionals</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Basic Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input w-full" placeholder="e.g. Shiv Tandav Stotram" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title <span className="text-orange-500 font-normal">(Hindi)</span></label>
            <input type="text" name="titleHi" value={formData.titleHi} onChange={handleChange} className="admin-input w-full" placeholder="e.g. शिव तांडव स्तोत्रम्" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              URL Slug
              <span className="ml-2 text-xs text-gray-400 font-normal">leave blank to auto-generate</span>
            </label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="admin-input w-full font-mono text-sm" placeholder={slugPreview || 'auto-generated from title'} />
            {formData.title && (
              <p className="mt-1 text-xs text-gray-400">Preview: <code className="bg-gray-100 px-1 rounded">/devotionals/{slugPreview}</code></p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-input w-full">
                {FULL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label} - {cat.hindi}</option>
                ))}
                <option value="108 Namavali">108 Namavali - १०८ नामावली</option>
                <option value="Other">Other - अन्य</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Language</label>
              <input type="text" name="language" value={formData.language} onChange={handleChange} className="admin-input w-full" placeholder="Hindi, Sanskrit, etc." />
            </div>
          </div>

          {(formData.category === 'Aarti' || formData.category === 'Mantra') && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{formData.category} Subcategory</label>
              <select name="subcategory" value={formData.subcategory} onChange={handleChange} required={formData.category === 'Mantra'} className="admin-input w-full">
                <option value="">— Select Subcategory —</option>
                {FULL_CATEGORIES.find((cat) => cat.id === formData.category)?.subcategories?.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Deity</label>
              <input type="text" name="deity" value={formData.deity} onChange={handleChange} className="admin-input w-full" placeholder="e.g. Lord Shiva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Artist</label>
              <input type="text" name="artist" value={formData.artist} onChange={handleChange} className="admin-input w-full" placeholder="Artist name" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="admin-input w-full" placeholder="e.g. 5:30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="admin-input w-full">
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 rounded accent-orange-500" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-600">Featured (show in featured listings)</label>
          </div>
        </div>

        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Media &amp; Content</h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
            Public devotional pages currently use one optimized fallback image for speed. Devotional-specific and deity images are ignored on the public devotional UI for now.
          </div>
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            folder="devotionals"
            label="Devotional Image"
            guidance="devotionalCard"
          />
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Audio URL</label>
            <input type="url" name="audio" value={formData.audio} onChange={handleChange} className="admin-input w-full" placeholder="https://example.com/audio.mp3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="admin-input w-full" placeholder="Brief description of the devotional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description <span className="text-orange-500 font-normal">(Hindi)</span></label>
            <textarea name="descriptionHi" value={formData.descriptionHi} onChange={handleChange} rows={3} className="admin-input w-full" placeholder="Hindi devotional description..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Lyrics (Optional)</label>
            <textarea name="lyrics" value={formData.lyrics} onChange={handleChange} rows={6} className="admin-input w-full" placeholder="Devotional lyrics..." />
          </div>
        </div>

        <div className="admin-card p-6 space-y-5">
          <div>
            <h2 className="admin-section-title">SEO &amp; Social Sharing</h2>
            <p className="text-xs text-gray-400 mt-0.5">Leave blank to auto-generate from title / description</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Meta Title <span className="font-normal text-gray-400">(max 60 chars)</span></label>
            <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} maxLength={60} placeholder="Custom title for search engines..." className="admin-input w-full" />
            <p className="mt-1 text-xs text-gray-400">{formData.metaTitle.length}/60 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Meta Description <span className="font-normal text-gray-400">(max 160 chars)</span></label>
            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} maxLength={160} placeholder="Brief description shown in search results..." className="admin-input w-full" />
            <p className="mt-1 text-xs text-gray-400">{formData.metaDescription.length}/160 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Keywords</label>
            <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="bhajan, shiva, stotra, hindi devotional" className="admin-input w-full" />
            <p className="mt-1 text-xs text-gray-400">Comma-separated keywords</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
            OG images currently use the same optimized devotional fallback image for stable, fast rendering.
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="admin-btn admin-btn-primary px-6 py-2.5 text-sm">Add Devotional</button>
          <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
