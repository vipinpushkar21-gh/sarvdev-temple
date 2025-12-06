"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewDevotionalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Bhajan',
    language: 'Hindi',
    deity: '',
    audio: '',
    lyrics: '',
    duration: '',
    artist: '',
    status: 'approved'
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
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/devotionals" className="text-orange-600 hover:underline">← Back to Devotionals</Link>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Add New Devotional</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/60 dark:bg-slate-900/60 p-6 rounded-lg">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. Shiv Tandav Stotram"
          />
        </div>

        {/* Category & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Bhajan">Bhajan - भजन</option>
              <option value="Stotra">Stotra - स्तोत्र</option>
              <option value="Aarti">Aarti - आरती</option>
              <option value="Mantra">Mantra - मंत्र</option>
              <option value="Chalisa">Chalisa - चालीसा</option>
              <option value="Stuti">Stuti - स्तुति</option>
              <option value="Shloka">Shloka - श्लोक</option>
              <option value="Ek Shloki">Ek Shloki - एक श्लोकी</option>
              <option value="Ashtaka">Ashtaka - अष्टक</option>
              <option value="Sahasranama">Sahasranama - सहस्रनाम</option>
              <option value="Path">Path - पाठ</option>
              <option value="Rashi">Rashi - राशि</option>
              <option value="Other">Other - अन्य</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Hindi, Sanskrit, etc."
            />
          </div>
        </div>

        {/* Deity & Artist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Deity
            </label>
            <input
              type="text"
              name="deity"
              value={formData.deity}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Lord Shiva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Artist
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Artist name"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. 5:30"
          />
        </div>

        {/* Audio URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Audio URL
          </label>
          <input
            type="url"
            name="audio"
            value={formData.audio}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="https://example.com/audio.mp3"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Brief description of the devotional"
          />
        </div>

        {/* Lyrics */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Lyrics (Optional)
          </label>
          <textarea
            name="lyrics"
            value={formData.lyrics}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Devotional lyrics..."
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Devotional
          </button>
          <Link
            href="/admin/devotionals"
            className="px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
