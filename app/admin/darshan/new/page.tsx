"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type FormState = {
  title: string
  description: string
  temple: string
  time: string
  date: string
  youtubeId: string
  isLive: boolean
  status: string
}

export default function NewDarshanPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    temple: "",
    time: "",
    date: "",
    youtubeId: "",
    isLive: false,
    status: "pending"
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function onChange<K extends keyof FormState>(key: K, value: string | boolean) {
    setForm(s => ({ ...s, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      alert("Title is required")
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/darshan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => router.push('/admin/darshan'), 1500)
      } else {
        alert('Failed to create darshan. Please try again.')
      }
    } catch {
      alert('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#ECFDF5' }}>
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Darshan Added Successfully!</h2>
        <p className="text-sm text-gray-500">Redirecting to darshan list...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Add New Darshan</h1>
          <p className="admin-section-subtitle">Add a new live or recorded darshan</p>
        </div>
        <Link href="/admin/darshan" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">← Back to Darshan</Link>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title*</label>
            <input value={form.title} onChange={(e) => onChange("title", e.target.value)} className="admin-input w-full" placeholder="e.g. Shri Ram Mandir Darshan" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={4} className="admin-input w-full" placeholder="Brief description of the darshan..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Temple Name*</label>
            <input value={form.temple} onChange={(e) => onChange("temple", e.target.value)} className="admin-input w-full" placeholder="e.g. Kashi Vishwanath Temple" />
          </div>
        </div>

        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">YouTube Live Stream</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">YouTube Video ID</label>
            <input 
              value={form.youtubeId} 
              onChange={(e) => onChange("youtubeId", e.target.value)} 
              className="admin-input w-full" 
              placeholder="e.g. Publ3XPOCpQ (from youtube.com/embed/Publ3XPOCpQ)" 
            />
            <p className="mt-1 text-xs text-gray-400">Extract the video ID from the YouTube embed URL. Example: https://www.youtube.com/embed/Publ3XPOCpQ → Publ3XPOCpQ</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isLive"
              checked={form.isLive}
              onChange={(e) => onChange("isLive", e.target.checked)}
              className="w-4 h-4 rounded accent-orange-500"
            />
            <label htmlFor="isLive" className="text-sm font-medium text-gray-700">Mark as Live Stream</label>
          </div>
        </div>

        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Schedule Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
              <input value={form.time} onChange={(e) => onChange("time", e.target.value)} className="admin-input w-full" placeholder="e.g. 5:00 AM - 12:00 PM" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => onChange("date", e.target.value)} className="admin-input w-full" />
            </div>
          </div>
        </div>

        <div className="admin-card p-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select value={form.status} onChange={(e) => onChange("status", e.target.value)} className="admin-input w-full">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
            {loading ? 'Submitting...' : 'Add Darshan'}
          </button>
          <Link href="/admin/darshan" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
