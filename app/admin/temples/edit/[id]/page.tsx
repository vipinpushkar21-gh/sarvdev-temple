"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ImageUpload from "../../../../../components/ImageUpload"

type FormState = {
  title: string
  location: string
  mapsLink: string
  city: string
  state: string
  pincode: string
  description: string
  descriptionHi: string
  deity: string
  establishedYear: string
  templeType: string
  speciality: string
  image: string
  timings: string
  contact: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
  status: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh"
]

const deities = [
  "Shiva", "Vishnu", "Durga", "Ganesha", "Hanuman", "Krishna", "Rama",
  "Lakshmi", "Saraswati", "Kali", "Murugan", "Brahma", "Other"
]

const templeTypes = ["North Indian", "South Indian", "Modern", "Ancient", "Cave Temple", "Hill Temple"]

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function EditTemplePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("")
  const [form, setForm] = useState<FormState>({ 
    title: "", location: "", mapsLink: "", city: "", state: "", pincode: "", description: "", 
    descriptionHi: "", deity: "", establishedYear: "", templeType: "", speciality: "",
    image: "", timings: "", contact: "", phone: "", email: "", website: "", 
    facebook: "", instagram: "", status: "pending",
    metaTitle: "", metaDescription: "", metaKeywords: "", ogImage: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetchTemple(p.id)
    })
  }, [params])

  async function fetchTemple(templeId: string) {
    try {
      const res = await fetch(`/api/temples?t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      if (res.ok) {
        const temples = await res.json()
        const temple = temples.find((t: any) => t._id === templeId)
        if (temple) {
          setForm({
            title: temple.title || "",
            location: temple.location || "",
            mapsLink: temple.mapsLink || "",
            city: temple.city || "",
            state: temple.state || "",
            pincode: temple.pincode || "",
            description: temple.description || "",
            descriptionHi: temple.descriptionHi || "",
            deity: temple.deity || "",
            establishedYear: temple.establishedYear || "",
            templeType: temple.templeType || "",
            speciality: temple.speciality || "",
            image: temple.image || "",
            timings: temple.timings || "",
            contact: temple.contact || "",
            phone: temple.phone || "",
            email: temple.email || "",
            website: temple.website || "",
            facebook: temple.facebook || "",
            instagram: temple.instagram || "",
            status: temple.status || "pending",
            metaTitle: temple.metaTitle || "",
            metaDescription: temple.metaDescription || "",
            metaKeywords: temple.metaKeywords || "",
            ogImage: temple.ogImage || "",
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch temple:', error)
    } finally {
      setLoading(false)
    }
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const submitData = { id, ...form }
      
      const res = await fetch('/api/temples', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })
      
      if (res.ok) {
        showToast('success', 'Temple updated successfully!')
      } else {
        const error = await res.json().catch(() => ({}))
        showToast('error', error?.error || 'Failed to update temple')
      }
    } catch {
      showToast('error', 'Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="space-y-5"><h1 className="admin-page-title">Edit Temple</h1><div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div></div>
  }

  return (
    <div className="max-w-3xl space-y-6" suppressHydrationWarning>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
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
          <h1 className="admin-page-title">Edit Temple</h1>
          <p className="admin-section-subtitle">Update temple details below</p>
        </div>
        <div className="flex items-center gap-2">
          {form.title && (
            <a href={`/temples/${slugify(form.title)}`} target="_blank" rel="noopener noreferrer"
              className="admin-btn admin-btn-ghost px-4 py-2 text-sm flex items-center gap-1.5 text-green-700 border-green-200 hover:bg-green-50">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              View Live
            </a>
          )}
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">← Back to Temples</Link>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        
        {/* Basic Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Temple Name*</label>
            <input value={form.title} onChange={(e) => onChange("title", e.target.value)} className="admin-input w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🕉️ Deity</label>
              <select value={form.deity} onChange={(e) => onChange("deity", e.target.value)} className="admin-input w-full">
                <option value="">Select Deity</option>
                {deities.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🏛️ Temple Type</label>
              <select value={form.templeType} onChange={(e) => onChange("templeType", e.target.value)} className="admin-input w-full">
                <option value="">Select Type</option>
                {templeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description*</label>
            <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={4} className="admin-input w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description (Hindi)</label>
            <textarea value={form.descriptionHi} onChange={(e) => onChange("descriptionHi", e.target.value)} rows={4} placeholder="मंदिर का विवरण हिंदी में दर्ज करें..." className="admin-input w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📅 Established Year</label>
              <input type="number" value={form.establishedYear} onChange={(e) => onChange("establishedYear", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🌟 Speciality</label>
              <input value={form.speciality} onChange={(e) => onChange("speciality", e.target.value)} className="admin-input w-full" />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Location Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Street Address</label>
            <input value={form.location} onChange={(e) => onChange("location", e.target.value)} className="admin-input w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">🗺️ Google Maps Link</label>
            <input 
              value={form.mapsLink} 
              onChange={(e) => onChange("mapsLink", e.target.value)} 
              placeholder="https://maps.app.goo.gl/..." 
              className="admin-input w-full" 
            />
            <p className="mt-1 text-xs text-gray-500">Paste Google Maps URL for this temple location</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📍 City*</label>
              <input value={form.city} onChange={(e) => onChange("city", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🗺️ State*</label>
              <select value={form.state} onChange={(e) => onChange("state", e.target.value)} className="admin-input w-full">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📮 Pincode</label>
              <input type="number" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} className="admin-input w-full" />
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Visit Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">⏰ Timings*</label>
              <input value={form.timings} onChange={(e) => onChange("timings", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <ImageUpload
                label="🖼️ Temple Image"
                value={form.image}
                onChange={url => onChange("image", url)}
                folder="sarvdev/temples"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📞 Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📧 Email</label>
              <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">General Contact</label>
              <input value={form.contact} onChange={(e) => onChange("contact", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🌐 Website</label>
              <input type="url" value={form.website} onChange={(e) => onChange("website", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📱 Facebook</label>
              <input type="url" value={form.facebook} onChange={(e) => onChange("facebook", e.target.value)} className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📱 Instagram</label>
              <input type="url" value={form.instagram} onChange={(e) => onChange("instagram", e.target.value)} className="admin-input w-full" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card p-6 space-y-5">
          <div>
            <h2 className="admin-section-title">SEO &amp; Social Sharing</h2>
            <p className="text-xs text-gray-400 mt-0.5">Leave blank to auto-generate from title / description</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Meta Title <span className="font-normal text-gray-400">(max 60 chars)</span>
            </label>
            <input value={form.metaTitle} onChange={e => onChange("metaTitle", e.target.value)} maxLength={60} placeholder="Custom title for search engines..." className="admin-input w-full" />
            <p className="mt-1 text-xs text-gray-400">{form.metaTitle.length}/60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Meta Description <span className="font-normal text-gray-400">(max 160 chars)</span>
            </label>
            <textarea value={form.metaDescription} onChange={e => onChange("metaDescription", e.target.value)} rows={3} maxLength={160} placeholder="Brief description shown in search results..." className="admin-input w-full" />
            <p className="mt-1 text-xs text-gray-400">{form.metaDescription.length}/160 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Keywords</label>
            <input value={form.metaKeywords} onChange={e => onChange("metaKeywords", e.target.value)} placeholder="temple, shiva, varanasi, kashi vishwanath" className="admin-input w-full" />
            <p className="mt-1 text-xs text-gray-400">Comma-separated keywords</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              OG Image URL <span className="font-normal text-gray-400">(Social sharing — 1200×630px recommended)</span>
            </label>
            <input value={form.ogImage} onChange={e => onChange("ogImage", e.target.value)} placeholder="https://... (leave blank to use temple image)" className="admin-input w-full" />
          </div>
        </div>

        {/* Status */}
        <div className="admin-card p-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select value={form.status} onChange={(e) => onChange("status", e.target.value)} className="admin-input w-full">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Temple'}
          </button>
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
