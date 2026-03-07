"use client"

import { useState } from "react"
import Hero from '../../components/Hero'

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

export default function ListTemplePage() {
  const [form, setForm] = useState<FormState>({ 
    name: "", location: "", city: "", state: "", country: "India", pincode: "", description: "", descriptionHi: "",
    deity: "", establishedYear: "", templeType: "", speciality: "", categories: [],
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
          status: 'pending'
        }),
      })
      
      if (res.ok) {
        setSubmitted(true)
        setForm({ 
          name: "", location: "", city: "", state: "", country: "India", pincode: "", description: "", descriptionHi: "",
          deity: "", establishedYear: "", templeType: "", speciality: "", categories: [],
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
    <>
      <Hero title="List a Temple" subtitle="Share temple details to add to the directory" />
      <main className="content-container py-12" suppressHydrationWarning>

      <form onSubmit={onSubmit} noValidate className="space-y-8">
        
        {/* Basic Information */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">Basic Information</h2>
            </div>
          
            <div>
              <label className="label">Temple Name *</label>
              <input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="e.g. Shri Ram Mandir" className={`input ${errors.name ? "border-semantic-error focus:ring-red-200" : ""}`} />
              {errors.name && <p className="mt-1 text-caption text-semantic-error">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Deity/God *</label>
                <select value={form.deity} onChange={(e) => onChange("deity", e.target.value)} className="input">
                  <option value="">Select Deity</option>
                  {deities.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Temple Type</label>
                <select value={form.templeType} onChange={(e) => onChange("templeType", e.target.value)} className="input">
                  <option value="">Select Type</option>
                  {templeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Description (English) *</label>
              <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={4} placeholder="Describe the temple's history, significance, and features..." className={`input ${errors.description ? "border-semantic-error focus:ring-red-200" : ""}`} />
              {errors.description && <p className="mt-1 text-caption text-semantic-error">{errors.description}</p>}
            </div>

            <div>
              <label className="label">Description (Hindi)</label>
              <textarea value={form.descriptionHi} onChange={(e) => onChange("descriptionHi", e.target.value)} rows={4} placeholder="मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें..." className="input" />
              <p className="mt-1 text-caption text-ink-faint">Optional: Add Hindi translation for bilingual support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Established Year</label>
                <input type="number" value={form.establishedYear} onChange={(e) => onChange("establishedYear", e.target.value)} placeholder="e.g. 1500" className="input" />
              </div>
              <div>
                <label className="label">Speciality</label>
                <input value={form.speciality} onChange={(e) => onChange("speciality", e.target.value)} placeholder="e.g. Famous for Shivratri celebration" className="input" />
              </div>
            </div>

            <div>
              <label className="label mb-2">Sacred Categories</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-surface-sunken rounded-xl">
                {sacredCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer hover:bg-surface-raised p-2.5 rounded-lg transition-colors">
                    <input 
                      type="checkbox" 
                      checked={form.categories.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(s => ({ ...s, categories: [...s.categories, cat] }))
                        } else {
                          setForm(s => ({ ...s, categories: s.categories.filter(c => c !== cat) }))
                        }
                      }}
                      className="w-4 h-4 accent-primary-500 rounded"
                    />
                    <span className="text-body-sm text-ink">{cat}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-caption text-ink-faint">Select if this temple belongs to a sacred group</p>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-sm">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">Location Details</h2>
            </div>
          
            <div>
              <label className="label">Street Address</label>
              <input value={form.location} onChange={(e) => onChange("location", e.target.value)} placeholder="Temple Road, Near Railway Station" className="input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">City *</label>
                <input value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder="e.g. Varanasi" className={`input ${errors.city ? "border-semantic-error" : ""}`} />
                {errors.city && <p className="mt-1 text-caption text-semantic-error">{errors.city}</p>}
              </div>
              <div>
                <label className="label">State *</label>
                <select value={form.state} onChange={(e) => onChange("state", e.target.value)} className={`input ${errors.state ? "border-semantic-error" : ""}`}>
                  <option value="">Select State</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="mt-1 text-caption text-semantic-error">{errors.state}</p>}
              </div>
              <div>
                <label className="label">Pincode</label>
                <input type="number" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} placeholder="e.g. 221001" className="input" />
              </div>
            </div>

            <div>
              <label className="label">Country *</label>
              <select value={form.country} onChange={(e) => onChange("country", e.target.value)} className="input">
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-sm">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">Visit Information</h2>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Timings *</label>
                <input value={form.timings} onChange={(e) => onChange("timings", e.target.value)} placeholder="e.g. 06:00 AM - 08:00 PM" className={`input ${errors.timings ? "border-semantic-error" : ""}`} />
                {errors.timings && <p className="mt-1 text-caption text-semantic-error">{errors.timings}</p>}
              </div>
              <div>
                <label className="label">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => onChange("imageUrl", e.target.value)} placeholder="https://example.com/temple.jpg" className={`input ${errors.imageUrl ? "border-semantic-error" : ""}`} />
                {errors.imageUrl && <p className="mt-1 text-caption text-semantic-error">{errors.imageUrl}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center shadow-sm">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">Contact Information</h2>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+91 98765 43210" className={`input ${errors.phone ? "border-semantic-error" : ""}`} />
                {errors.phone && <p className="mt-1 text-caption text-semantic-error">{errors.phone}</p>}
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="temple@example.com" className={`input ${errors.email ? "border-semantic-error" : ""}`} />
                {errors.email && <p className="mt-1 text-caption text-semantic-error">{errors.email}</p>}
              </div>
              <div>
                <label className="label">General Contact</label>
                <input value={form.contact} onChange={(e) => onChange("contact", e.target.value)} placeholder="Priest name or admin contact" className="input" />
              </div>
              <div>
                <label className="label">Website</label>
                <input type="url" value={form.website} onChange={(e) => onChange("website", e.target.value)} placeholder="https://templewebsite.com" className="input" />
              </div>
              <div>
                <label className="label">Facebook</label>
                <input type="url" value={form.facebook} onChange={(e) => onChange("facebook", e.target.value)} placeholder="https://facebook.com/templepage" className="input" />
              </div>
              <div>
                <label className="label">Instagram</label>
                <input type="url" value={form.instagram} onChange={(e) => onChange("instagram", e.target.value)} placeholder="https://instagram.com/templepage" className="input" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg disabled:opacity-60 group">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Submitting...
              </span>
            ) : (
              <>
                Submit Temple
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </>
            )}
          </button>
          {submitted && (
            <div className="flex items-center gap-2 text-body-sm text-semantic-success font-medium bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Thank you! Your temple submission has been received and is pending approval.
            </div>
          )}
        </div>
      </form>
      </main>
    </>
  )
}
