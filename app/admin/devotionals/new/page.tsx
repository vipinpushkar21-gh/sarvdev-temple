"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../../../../components/ImageUpload'

export default function NewDevotionalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Bhajan',
    language: 'Hindi',
    deity: '',
    image: '',
    audio: '',
    lyrics: '',
    duration: '',
    artist: '',
    status: 'approved',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/devotionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Devotional added successfully!')
        router.push('/admin/devotionals')
      } else {
        alert('Failed to add devotional')
      }
    } catch (error) {
      alert('Error adding devotional')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Add New Devotional</h1>
          <p className="admin-section-subtitle">Fill in the devotional details below</p>
        </div>
        <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">← Back to Devotionals</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Basic Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input w-full" placeholder="e.g. Shiv Tandav Stotram" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-input w-full">
                <option value="Aarti">Aarti - आरती</option>
                <option value="Bhajan">Bhajan - भजन</option>
                <option value="Chalisa">Chalisa - चालीसा</option>
                <option value="Mantra">Mantra - मंत्र</option>
                <option value="Stotra">Stotra - स्तोत्र</option>
                <option value="Stuti">Stuti - स्तुति</option>
                <option value="Shloka">Shloka - श्लोक</option>
                <option value="Ek Shloki">Ek Shloki - एक श्लोकी</option>
                <option value="Ashtaka">Ashtaka - अष्टक</option>
                <option value="Path">Path - पाठ</option>
                <option value="Namavali">Namavali - नामावली</option>
                <option value="108 Namavali">108 Namavali - १०८ नामावली</option>
                <option value="Kavacham">Kavacham - कवचम्</option>
                <option value="Prarthana">Prarthana - प्रार्थना</option>
                <option value="Vrat Katha">Vrat Katha - व्रत कथा</option>
                <option value="Other">Other - अन्य</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Language</label>
              <input type="text" name="language" value={formData.language} onChange={handleChange} className="admin-input w-full" placeholder="Hindi, Sanskrit, etc." />
            </div>
          </div>

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
        </div>

        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Media & Content</h2>
          <ImageUpload
            value={formData.image}
            onChange={url => setFormData(prev => ({ ...prev, image: url }))}
            folder="sarvdev/devotionals"
            label="Cover Image (Header pe dikhegi)"
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
            <label className="block text-sm font-medium text-gray-600 mb-1">Lyrics (Optional)</label>
            <textarea name="lyrics" value={formData.lyrics} onChange={handleChange} rows={6} className="admin-input w-full" placeholder="Devotional lyrics..." />
          </div>
        </div>

        {/* SEO */}
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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">OG Image URL <span className="font-normal text-gray-400">(Social sharing — 1200×630px recommended)</span></label>
            <input type="text" name="ogImage" value={formData.ogImage} onChange={handleChange} placeholder="https://... (leave blank to use cover image)" className="admin-input w-full" />
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
