"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type FormState = {
  name: string
  location: string
  city: string
  state: string
  country: string
  pincode: string
  description: string
  descriptionHi: string
  deity: string
  establishedYear: string
  templeType: string
  speciality: string
  categories: string[]
  imageUrl: string
  timings: string
  contact: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh"
]

const countries = [
  "India", "Nepal", "Sri Lanka", "Bangladesh", "Bhutan", "Myanmar", "Thailand",
  "Indonesia", "Malaysia", "Singapore", "Cambodia", "Vietnam", "USA", "UK",
  "Canada", "Australia", "New Zealand", "South Africa", "UAE", "Other"
]

const deities = [
  "Shiva", "Vishnu", "Durga", "Ganesha", "Hanuman", "Krishna", "Rama",
  "Lakshmi", "Saraswati", "Kali", "Murugan", "Brahma", "Other"
]

const templeTypes = ["North Indian", "South Indian", "Modern", "Ancient", "Cave Temple", "Hill Temple"]

const sacredCategories = [
  "Dwadash Jyotirlinga (12 Jyotirlingas)",
  "Shakti Peeth (51 Shakti Peethas)",
  "Char Dham",
  "Chota Char Dham (Uttarakhand)",
  "Panch Kedar",
  "Panch Prayag",
  "Arupadai Veedu (6 Abodes of Murugan)",
  "Navagraha Temples",
  "Divya Desam (108 Vishnu Temples)",
  "Pancha Bhoota Stalam",
  "Ashta Vinayak",
  "Sapta Puri (7 Sacred Cities)",
  "108 Shiva Temples",
  "Other Sacred Group"
]

const inputCls = "admin-input w-full"
const labelCls = "block text-sm font-medium text-gray-600 mb-1"
const errorCls = "mt-1 text-xs text-red-500"

export default function AdminNewTemplePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    name: "", location: "", city: "", state: "", country: "India", pincode: "", description: "", descriptionHi: "",
    deity: "", establishedYear: "", templeType: "", speciality: "", categories: [],
    imageUrl: "", timings: "", contact: "", phone: "", email: "", website: "",
    facebook: "", instagram: ""
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = "Temple name is required"
    if (!form.city.trim()) e.city = "City is required"
    if (!form.state.trim()) e.state = "State is required"
    if (!form.description.trim() || form.description.trim().length < 20) e.description = "Description is required (min 20 chars)"
    if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl)) e.imageUrl = "Image URL must be a valid http(s) URL"
    if (!form.timings.trim()) e.timings = "Timings are required"
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email"
    if (form.phone && !/^\+?[0-9\-()\s]{6,}$/.test(form.phone)) e.phone = "Invalid phone number"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm(s => ({ ...s, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
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
          location: `${form.location}, ${form.city}, ${form.state}, ${form.country}${form.pincode ? ' - ' + form.pincode : ''}`,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: form.pincode,
          description: form.description,
          descriptionHi: form.descriptionHi,
          deity: form.deity,
          establishedYear: form.establishedYear,
          templeType: form.templeType,
          speciality: form.speciality,
          categories: form.categories,
          image: form.imageUrl,
          timings: form.timings,
          contact: form.contact,
          phone: form.phone,
          email: form.email,
          website: form.website,
          facebook: form.facebook,
          instagram: form.instagram,
          status: 'approved'
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => router.push('/admin/temples'), 1500)
      } else {
        alert('Failed to submit temple. Please try again.')
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
        <h2 className="text-xl font-bold text-gray-900">Temple Added Successfully!</h2>
        <p className="text-sm text-gray-500">Redirecting to temples list...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Add New Temple</h1>
          <p className="admin-section-subtitle">Fill in the temple details below</p>
        </div>
        <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">
          ← Back to Temples
        </Link>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-6">

        {/* Basic Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
            Basic Information
          </h2>

          <div>
            <label className={labelCls}>Temple Name *</label>
            <input value={form.name} onChange={e => onChange("name", e.target.value)} placeholder="e.g. Shri Ram Mandir" className={`${inputCls} ${errors.name ? 'border-red-400 dark:border-red-600' : ''}`} />
            {errors.name && <p className={errorCls}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Deity/God</label>
              <select value={form.deity} onChange={e => onChange("deity", e.target.value)} className={inputCls}>
                <option value="">Select Deity</option>
                {deities.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Temple Type</label>
              <select value={form.templeType} onChange={e => onChange("templeType", e.target.value)} className={inputCls}>
                <option value="">Select Type</option>
                {templeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description (English) *</label>
            <textarea value={form.description} onChange={e => onChange("description", e.target.value)} rows={4} placeholder="Describe the temple's history, significance, and features..." className={`${inputCls} ${errors.description ? 'border-red-400 dark:border-red-600' : ''}`} />
            {errors.description && <p className={errorCls}>{errors.description}</p>}
          </div>

          <div>
            <label className={labelCls}>Description (Hindi)</label>
            <textarea value={form.descriptionHi} onChange={e => onChange("descriptionHi", e.target.value)} rows={4} placeholder="मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें..." className={inputCls} />
            <p className="mt-1 text-xs text-gray-400">Optional: Add Hindi translation for bilingual support</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Established Year</label>
              <input type="number" value={form.establishedYear} onChange={e => onChange("establishedYear", e.target.value)} placeholder="e.g. 1500" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Speciality</label>
              <input value={form.speciality} onChange={e => onChange("speciality", e.target.value)} placeholder="e.g. Famous for Shivratri celebration" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Sacred Categories</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2 p-4 rounded-xl" style={{ background: '#F9FAFB' }}>
              {sacredCategories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-xl transition-colors text-sm">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat)}
                    onChange={e => {
                      if (e.target.checked) setForm(s => ({ ...s, categories: [...s.categories, cat] }))
                      else setForm(s => ({ ...s, categories: s.categories.filter(c => c !== cat) }))
                    }}
                    className="w-4 h-4 rounded accent-orange-500"
                  />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Select if this temple belongs to a sacred group</p>
          </div>
        </div>

        {/* Location Details */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            Location Details
          </h2>

          <div>
            <label className={labelCls}>Street Address</label>
            <input value={form.location} onChange={e => onChange("location", e.target.value)} placeholder="Temple Road, Near Railway Station" className={inputCls} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>City *</label>
              <input value={form.city} onChange={e => onChange("city", e.target.value)} placeholder="e.g. Varanasi" className={`${inputCls} ${errors.city ? 'border-red-400 dark:border-red-600' : ''}`} />
              {errors.city && <p className={errorCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <select value={form.state} onChange={e => onChange("state", e.target.value)} className={`${inputCls} ${errors.state ? 'border-red-400 dark:border-red-600' : ''}`}>
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className={errorCls}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelCls}>Pincode</label>
              <input type="number" value={form.pincode} onChange={e => onChange("pincode", e.target.value)} placeholder="e.g. 221001" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Country</label>
            <select value={form.country} onChange={e => onChange("country", e.target.value)} className={inputCls}>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Visit Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Visit Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Timings *</label>
              <input value={form.timings} onChange={e => onChange("timings", e.target.value)} placeholder="e.g. 06:00 AM - 08:00 PM" className={`${inputCls} ${errors.timings ? 'border-red-400 dark:border-red-600' : ''}`} />
              {errors.timings && <p className={errorCls}>{errors.timings}</p>}
            </div>
            <div>
              <label className={labelCls}>Image URL</label>
              <input value={form.imageUrl} onChange={e => onChange("imageUrl", e.target.value)} placeholder="https://example.com/temple.jpg" className={`${inputCls} ${errors.imageUrl ? 'border-red-400 dark:border-red-600' : ''}`} />
              {errors.imageUrl && <p className={errorCls}>{errors.imageUrl}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone</label>
              <input type="tel" value={form.phone} onChange={e => onChange("phone", e.target.value)} placeholder="+91 98765 43210" className={`${inputCls} ${errors.phone ? 'border-red-400 dark:border-red-600' : ''}`} />
              {errors.phone && <p className={errorCls}>{errors.phone}</p>}
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={e => onChange("email", e.target.value)} placeholder="temple@example.com" className={`${inputCls} ${errors.email ? 'border-red-400 dark:border-red-600' : ''}`} />
              {errors.email && <p className={errorCls}>{errors.email}</p>}
            </div>
            <div>
              <label className={labelCls}>General Contact</label>
              <input value={form.contact} onChange={e => onChange("contact", e.target.value)} placeholder="Priest name or admin contact" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Website</label>
              <input type="url" value={form.website} onChange={e => onChange("website", e.target.value)} placeholder="https://templewebsite.com" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Facebook</label>
              <input type="url" value={form.facebook} onChange={e => onChange("facebook", e.target.value)} placeholder="https://facebook.com/templepage" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Instagram</label>
              <input type="url" value={form.instagram} onChange={e => onChange("instagram", e.target.value)} placeholder="https://instagram.com/templepage" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Submitting...
              </>
            ) : 'Add Temple'}
          </button>
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
