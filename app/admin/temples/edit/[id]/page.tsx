"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type FormState = {
  title: string
  location: string
  city: string
  state: string
  pincode: string
  description: string
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

export default function EditTemplePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<string>("")
  const [form, setForm] = useState<FormState>({ 
    title: "", location: "", city: "", state: "", pincode: "", description: "", 
    deity: "", establishedYear: "", templeType: "", speciality: "",
    image: "", timings: "", contact: "", phone: "", email: "", website: "", 
    facebook: "", instagram: "", status: "pending"
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetchTemple(p.id)
    })
  }, [params])

  async function fetchTemple(templeId: string) {
    try {
      const res = await fetch('/api/temples')
      if (res.ok) {
        const temples = await res.json()
        const temple = temples.find((t: any) => t._id === templeId)
        if (temple) {
          setForm({
            title: temple.title || "",
            location: temple.location || "",
            city: temple.city || "",
            state: temple.state || "",
            pincode: temple.pincode || "",
            description: temple.description || "",
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
            status: temple.status || "pending"
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
      const res = await fetch('/api/temples', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...form }),
      })
      
      if (res.ok) {
        alert('Temple updated successfully!')
        router.push('/admin/temples')
      } else {
        alert('Failed to update temple')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-12">Loading temple...</div>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12" suppressHydrationWarning>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/temples" className="text-orange-600 hover:underline">← Back to Temples</Link>
        <h1 className="text-3xl font-bold text-orange-800">Edit Temple</h1>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-8 bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-2xl shadow-lg border border-orange-100">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Temple Name*</label>
            <input value={form.title} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">🕉️ Deity</label>
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
            <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📅 Established Year</label>
              <input type="number" value={form.establishedYear} onChange={(e) => onChange("establishedYear", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🌟 Speciality</label>
              <input value={form.speciality} onChange={(e) => onChange("speciality", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Location Details</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input value={form.location} onChange={(e) => onChange("location", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📍 City*</label>
              <input value={form.city} onChange={(e) => onChange("city", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🗺️ State*</label>
              <select value={form.state} onChange={(e) => onChange("state", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📮 Pincode</label>
              <input type="number" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Visit Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">⏰ Timings*</label>
              <input value={form.timings} onChange={(e) => onChange("timings", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🖼️ Image URL</label>
              <input value={form.image} onChange={(e) => onChange("image", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-700 border-b border-orange-200 pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📞 Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📧 Email</label>
              <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">General Contact</label>
              <input value={form.contact} onChange={(e) => onChange("contact", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🌐 Website</label>
              <input type="url" value={form.website} onChange={(e) => onChange("website", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📱 Facebook</label>
              <input type="url" value={form.facebook} onChange={(e) => onChange("facebook", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📱 Instagram</label>
              <input type="url" value={form.instagram} onChange={(e) => onChange("instagram", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={form.status} onChange={(e) => onChange("status", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={saving} className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all">
            {saving ? 'Saving...' : 'Update Temple'}
          </button>
          <Link href="/admin/temples" className="px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
