"use client"

import { useState } from "react"

type FormState = {
  name: string
  location: string
  description: string
  imageUrl: string
  timings: string
  contact: string
}

export default function ListTemplePage() {
  const [form, setForm] = useState<FormState>({ name: "", location: "", description: "", imageUrl: "", timings: "", contact: "" })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = "Temple name is required"
    if (!form.location.trim()) e.location = "Location is required"
    if (!form.description.trim() || form.description.trim().length < 20) e.description = "Description is required (min 20 chars)"
    if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl)) e.imageUrl = "Image URL must be a valid http(s) URL"
    if (!form.timings.trim()) e.timings = "Timings are required"
    if (form.contact && !/^\+?[0-9\-()\s]{6,}$/.test(form.contact)) e.contact = "Contact looks invalid"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(false)
    if (!validate()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.name,
          location: form.location,
          description: form.description,
          image: form.imageUrl,
          timings: form.timings,
          contact: form.contact,
          status: 'pending'
        }),
      })
      
      if (res.ok) {
        setSubmitted(true)
        setForm({ name: "", location: "", description: "", imageUrl: "", timings: "", contact: "" })
      } else {
        alert('Failed to submit temple. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12" suppressHydrationWarning>
      <h1 className="text-2xl font-semibold mb-2">List a Temple</h1>
      <p className="text-sm text-slate-600 mb-6">Share details about a temple you'd like to add. We'll review submissions before publishing.</p>

      <form onSubmit={onSubmit} noValidate className="space-y-6 bg-white/60 dark:bg-slate-900/60 p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Temple Name*</label>
          <input value={form.name} onChange={(e) => onChange("name", e.target.value)} className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-emerald-200"}`} />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location*</label>
          <input value={form.location} onChange={(e) => onChange("location", e.target.value)} className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.location ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-emerald-200"}`} />
          {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description*</label>
          <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={5} className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.description ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-emerald-200"}`} />
          {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input value={form.imageUrl} onChange={(e) => onChange("imageUrl", e.target.value)} placeholder="https://example.com/photo.jpg" className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.imageUrl ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-emerald-200"}`} />
          {errors.imageUrl && <p className="mt-1 text-xs text-rose-600">{errors.imageUrl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Timings*</label>
          <input value={form.timings} onChange={(e) => onChange("timings", e.target.value)} placeholder="e.g. 06:00 AM - 08:00 PM" className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.timings ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-emerald-200"}`} />
          {errors.timings && <p className="mt-1 text-xs text-rose-600">{errors.timings}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Info</label>
          <input value={form.contact} onChange={(e) => onChange("contact", e.target.value)} placeholder="Phone number or email" className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.contact ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-emerald-200"}`} />
          {errors.contact && <p className="mt-1 text-xs text-rose-600">{errors.contact}</p>}
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {submitted && <div className="text-sm text-emerald-700">Thank you! Your temple submission has been received and is pending approval.</div>}
        </div>
      </form>
    </main>
  )
}

