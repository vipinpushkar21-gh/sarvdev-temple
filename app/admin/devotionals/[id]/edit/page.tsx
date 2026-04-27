"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../../../../../components/ImageUpload'

function createSlug(title: string): string {
  const englishMatch = title.match(/\(([^)]+)\)/)
  let text = englishMatch ? englishMatch[1] : title
  let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  if (!slug || slug === '-') {
    slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }
  return slug || 'devotional'
}

export default function EditDevotionalPage() {
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
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

  useEffect(() => {
    if (!id) return
    async function fetchDevotional() {
      try {
        const res = await fetch(`/api/devotionals?id=${id}`)
        if (res.ok) {
          const found = await res.json()
          if (found) {
            setFormData({
              title: found.title || '',
              description: found.description || '',
              category: found.category || '',
              language: found.language || '',
              deity: found.deity || '',
              image: found.image || '',
              audio: found.audio || '',
              lyrics: found.lyrics || '',
              duration: found.duration || '',
              artist: found.artist || '',
              status: found.status || 'approved',
              metaTitle: found.metaTitle || '',
              metaDescription: found.metaDescription || '',
              metaKeywords: found.metaKeywords || '',
              ogImage: found.ogImage || '',
            })
          } else {
            showToast('error', 'Devotional not found')
          }
        } else {
          showToast('error', 'Failed to load devotional')
        }
      } catch {
        showToast('error', 'Failed to load devotional')
      } finally {
        setLoading(false)
      }
    }
    fetchDevotional()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const autoGenerateSEO = () => {
    // Extract English title from parentheses if present, else use full title
    const englishMatch = formData.title.match(/\(([^)]+)\)/)
    const cleanTitle = englishMatch ? englishMatch[1] : formData.title.replace(/[^\x00-\x7F]/g, '').trim() || formData.title

    const deity = formData.deity || ''
    const category = formData.category || ''
    const language = formData.language || 'Hindi'

    // Meta Title (max 60)
    const rawMetaTitle = deity
      ? `${cleanTitle} — ${deity} ${category} | Sarvdev`
      : `${cleanTitle} — ${category} | Sarvdev`
    const metaTitle = rawMetaTitle.slice(0, 60)

    // Meta Description (max 160)
    const metaDescription = deity
      ? `Read and listen to ${cleanTitle} — a ${language} ${category} dedicated to ${deity}. Lyrics, meaning and audio on Sarvdev.`
      : `Read and listen to ${cleanTitle} — a ${language} ${category}. Full lyrics and audio available on Sarvdev.`

    // Keywords
    const titleWords = cleanTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)
    const keywordSet = [
      ...titleWords,
      ...(deity ? [deity.toLowerCase(), `${deity.toLowerCase()} ${category.toLowerCase()}`] : []),
      category.toLowerCase(),
      `${language.toLowerCase()} ${category.toLowerCase()}`,
      `${category.toLowerCase()} lyrics`,
      'sarvdev devotional',
    ]
    const metaKeywords = [...new Set(keywordSet)].join(', ')

    // OG Image — use cover image if available
    const ogImage = formData.ogImage || formData.image || ''

    setFormData(prev => ({ ...prev, metaTitle, metaDescription: metaDescription.slice(0, 160), metaKeywords, ogImage }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/devotionals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData })
      })
      if (res.ok) {
        // Re-fetch from DB to confirm what actually saved
        const fresh = await fetch(`/api/devotionals?id=${id}`)
        if (fresh.ok) {
          const found = await fresh.json()
          if (found) {
            setFormData({
              title: found.title || '',
              description: found.description || '',
              category: found.category || '',
              language: found.language || '',
              deity: found.deity || '',
              image: found.image || '',
              audio: found.audio || '',
              lyrics: found.lyrics || '',
              duration: found.duration || '',
              artist: found.artist || '',
              status: found.status || 'approved',
              metaTitle: found.metaTitle || '',
              metaDescription: found.metaDescription || '',
              metaKeywords: found.metaKeywords || '',
              ogImage: found.ogImage || '',
            })
          }
        }
        showToast('success', 'Changes saved successfully!')
      } else {
        const err = await res.json().catch(() => ({}))
        showToast('error', err?.error || 'Failed to save changes')
      }
    } catch {
      showToast('error', 'Network error, try again')
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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all animate-in slide-in-from-right-4 ${
          toast.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-1 opacity-75 hover:opacity-100">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Edit Devotional</h1>
          <p className="admin-section-subtitle truncate max-w-sm text-gray-400">{formData.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {formData.title && (
            <a href={`/devotionals/${createSlug(formData.title)}`} target="_blank" rel="noopener noreferrer"
              className="admin-btn admin-btn-ghost px-4 py-2 text-sm flex items-center gap-1.5 text-green-700 border-green-200 hover:bg-green-50">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              View Live
            </a>
          )}
          <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">← Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
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
                <option value="">— Select Category —</option>
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
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="admin-input w-full">
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Deity</label>
              <input type="text" name="deity" value={formData.deity} onChange={handleChange} className="admin-input w-full" placeholder="e.g. Lord Shiva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Language</label>
              <input type="text" name="language" value={formData.language} onChange={handleChange} className="admin-input w-full" placeholder="Hindi, Sanskrit, etc." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Artist</label>
              <input type="text" name="artist" value={formData.artist} onChange={handleChange} className="admin-input w-full" placeholder="Artist name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="admin-input w-full" placeholder="e.g. 5:30" />
            </div>
          </div>
        </div>

        {/* Media & Content */}
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
            {formData.audio && (
              <div className="mt-2 rounded-xl p-3 bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">Preview</p>
                <audio controls className="w-full h-8" src={formData.audio} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="admin-input w-full" placeholder="Brief description of the devotional" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Lyrics</label>
            <textarea name="lyrics" value={formData.lyrics} onChange={handleChange} rows={12} className="admin-input w-full font-mono text-sm" placeholder="Devotional lyrics..." />
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="admin-section-title">SEO &amp; Social Sharing</h2>
              <p className="text-xs text-gray-400 mt-0.5">Leave blank to auto-generate from title / description</p>
            </div>
            <button
              type="button"
              onClick={autoGenerateSEO}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary-700 border border-primary/30 hover:bg-primary/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              Auto-Generate
            </button>
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
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
