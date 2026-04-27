"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../../../../../components/ImageUpload'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    image: '',
    author: '',
    tags: '',
    date: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
  })

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`)
        if (res.ok) {
          const found = await res.json()
          setFormData({
            title: found.title || '',
            excerpt: found.excerpt || '',
            body: found.body || '',
            image: found.image || '',
            author: found.author || '',
            tags: found.tags || '',
            date: found.date ? found.date.slice(0, 10) : '',
            status: found.status || 'draft',
            metaTitle: found.metaTitle || '',
            metaDescription: found.metaDescription || '',
            metaKeywords: found.metaKeywords || '',
            ogImage: found.ogImage || '',
          })
        } else {
          alert('Blog not found')
          router.push('/admin/blogs')
        }
      } catch {
        alert('Failed to load blog')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData }),
      })
      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        alert('Failed to save changes')
      }
    } catch {
      alert('Error saving changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="admin-card p-6 space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Edit Blog Post</h1>
          <p className="admin-section-subtitle truncate max-w-sm text-gray-400">{formData.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {formData.title && (
            <a href={`/blog/${slugify(formData.title)}`} target="_blank" rel="noopener noreferrer"
              className="admin-btn admin-btn-ghost px-4 py-2 text-sm flex items-center gap-1.5 text-green-700 border-green-200 hover:bg-green-50">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              View Live
            </a>
          )}
          <Link href="/admin/blogs" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">← Back to Blogs</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Post Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input w-full" placeholder="Blog post title..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Excerpt</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="admin-input w-full" placeholder="Short summary shown in listings..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="admin-input w-full" placeholder="Author name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Publish Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="admin-input w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tags</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="admin-input w-full" placeholder="temple, spirituality, devotion" />
              <p className="mt-1 text-xs text-gray-400">Comma-separated tags</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="admin-input w-full">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Media &amp; Content</h2>

          <ImageUpload
            value={formData.image}
            onChange={url => setFormData(prev => ({ ...prev, image: url }))}
            folder="sarvdev/blogs"
            label="Cover Image"
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Body Content</label>
            <textarea name="body" value={formData.body} onChange={handleChange} rows={16} className="admin-input w-full font-mono text-sm" placeholder="Full blog post content..." />
            <p className="mt-1 text-xs text-gray-400">Markdown supported</p>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card p-6 space-y-5">
          <div>
            <h2 className="admin-section-title">SEO &amp; Social Sharing</h2>
            <p className="text-xs text-gray-400 mt-0.5">Leave blank to auto-generate from title / excerpt</p>
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
            <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="temple, blog, spirituality, hindi" className="admin-input w-full" />
            <p className="mt-1 text-xs text-gray-400">Comma-separated keywords</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">OG Image URL <span className="font-normal text-gray-400">(Social sharing — 1200×630px recommended)</span></label>
            <input type="text" name="ogImage" value={formData.ogImage} onChange={handleChange} placeholder="https://... (leave blank to use cover image)" className="admin-input w-full" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/blogs" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
