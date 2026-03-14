"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditDevotionalPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
    deity: '',
    audio: '',
    lyrics: '',
    duration: '',
    artist: '',
    status: 'approved'
  })

  useEffect(() => {
    async function fetchDevotional() {
      try {
        const res = await fetch('/api/devotionals')
        if (res.ok) {
          const all = await res.json()
          const found = all.find((d: any) => d._id === id)
          if (found) {
            setFormData({
              title: found.title || '',
              description: found.description || '',
              category: found.category || '',
              language: found.language || '',
              deity: found.deity || '',
              audio: found.audio || '',
              lyrics: found.lyrics || '',
              duration: found.duration || '',
              artist: found.artist || '',
              status: found.status || 'approved',
            })
          } else {
            alert('Devotional not found')
            router.push('/admin/devotionals')
          }
        }
      } catch {
        alert('Failed to load devotional')
      } finally {
        setLoading(false)
      }
    }
    fetchDevotional()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
        router.push('/admin/devotionals')
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
          <h1 className="admin-page-title">Edit Devotional</h1>
          <p className="admin-section-subtitle truncate max-w-sm text-gray-400">{formData.title}</p>
        </div>
        <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">← Back</Link>
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
