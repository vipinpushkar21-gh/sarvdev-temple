"use client"

import { useState } from "react"

type FormState = {
  name: string
  location: string
  city: string
  state: string
  pincode: string
  description: string
  deity: string
  establishedYear: string
  templeType: string
  speciality: string
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

const deities = [
  "Shiva", "Vishnu", "Durga", "Ganesha", "Hanuman", "Krishna", "Rama",
  "Lakshmi", "Saraswati", "Kali", "Murugan", "Brahma", "Other"
]

const templeTypes = ["North Indian", "South Indian", "Modern", "Ancient", "Cave Temple", "Hill Temple"]

export default function ListTemplePage() {
  const [form, setForm] = useState<FormState>({ 
    name: "", location: "", city: "", state: "", pincode: "", description: "", 
    deity: "", establishedYear: "", templeType: "", speciality: "",
    imageUrl: "", timings: "", contact: "", phone: "", email: "", website: "", 
    facebook: "", instagram: ""
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const e: Partial<FormState> = {}
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
          location: `${form.location}, ${form.city}, ${form.state}${form.pincode ? ' - ' + form.pincode : ''}`,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          description: form.description,
          deity: form.deity,
          establishedYear: form.establishedYear,
          templeType: form.templeType,
          speciality: form.speciality,
          image: form.imageUrl,
          timings: form.timings,
          contact: form.contact,
          phone: form.phone,
          email: form.email,
          website: form.website,
          facebook: form.facebook,
          instagram: form.instagram,
          status: 'pending'
        }),
      })
      
      if (res.ok) {
        setSubmitted(true)
        setForm({ 
          name: "", location: "", city: "", state: "", pincode: "", description: "", 
          deity: "", establishedYear: "", templeType: "", speciality: "",
          imageUrl: "", timings: "", contact: "", phone: "", email: "", website: "", 
          facebook: "", instagram: ""
        })
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
    <main className="max-w-4xl mx-auto px-4 py-12" suppressHydrationWarning>
      <h1 className="text-3xl font-bold mb-2 text-orange-800">List a Temple</h1>
      <p className="text-sm text-slate-600 mb-8">Share details about a temple you'd like to add. We'll review submissions before publishing.</p>

      <form onSubmit={onSubmit} noValidate className="space-y-8 bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-2xl shadow-lg border border-orange-100">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Temple Name*</label>
            <input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="e.g. Shri Ram Mandir" className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.name ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`} />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">🕉️ Deity/God*</label>
              <select value={form.deity} onChange={(e) => onChange("deity", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200">
                <option value="">Select Deity</option>
                {deities.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🏛️ Temple Type</label>
              <select value={form.templeType} onChange={(e) => onChange("templeType", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200">
                <option value="">Select Type</option>
                {templeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description*</label>
            <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={4} placeholder="Describe the temple's history, significance, and features..." className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.description ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`} />
            {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📅 Established Year</label>
              <input type="number" value={form.establishedYear} onChange={(e) => onChange("establishedYear", e.target.value)} placeholder="e.g. 1500" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🌟 Speciality</label>
              <input value={form.speciality} onChange={(e) => onChange("speciality", e.target.value)} placeholder="e.g. Famous for Shivratri celebration" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Location Details</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input value={form.location} onChange={(e) => onChange("location", e.target.value)} placeholder="Temple Road, Near Railway Station" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📍 City*</label>
              <input value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder="e.g. Varanasi" className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.city ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`} />
              {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🗺️ State*</label>
              <select value={form.state} onChange={(e) => onChange("state", e.target.value)} className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.state ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`}>
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📮 Pincode</label>
              <input type="number" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} placeholder="e.g. 221001" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Visit Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">⏰ Timings*</label>
              <input value={form.timings} onChange={(e) => onChange("timings", e.target.value)} placeholder="e.g. 06:00 AM - 08:00 PM" className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.timings ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`} />
              {errors.timings && <p className="mt-1 text-xs text-rose-600">{errors.timings}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🖼️ Image URL</label>
              <input value={form.imageUrl} onChange={(e) => onChange("imageUrl", e.target.value)} placeholder="https://example.com/temple.jpg" className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.imageUrl ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`} />
              {errors.imageUrl && <p className="mt-1 text-xs text-rose-600">{errors.imageUrl}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📞 Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+91 98765 43210" className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.phone ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`} />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📧 Email</label>
              <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="temple@example.com" className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.email ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:ring-orange-200"}`} />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">General Contact</label>
              <input value={form.contact} onChange={(e) => onChange("contact", e.target.value)} placeholder="Priest name or admin contact" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🌐 Website</label>
              <input type="url" value={form.website} onChange={(e) => onChange("website", e.target.value)} placeholder="https://templewebsite.com" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📱 Facebook</label>
              <input type="url" value={form.facebook} onChange={(e) => onChange("facebook", e.target.value)} placeholder="https://facebook.com/templepage" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📱 Instagram</label>
              <input type="url" value={form.instagram} onChange={(e) => onChange("instagram", e.target.value)} placeholder="https://instagram.com/templepage" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all">
            {loading ? 'Submitting...' : 'Submit Temple'}
          </button>
          {submitted && <div className="text-sm text-emerald-700 font-medium bg-emerald-50 px-4 py-2 rounded-lg">✓ Thank you! Your temple submission has been received and is pending approval.</div>}
        </div>
      </form>
    </main>
  )
}
