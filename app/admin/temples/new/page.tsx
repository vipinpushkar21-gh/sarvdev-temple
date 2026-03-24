"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUpload from "../../../../components/ImageUpload"
import { useTranslation } from '../../../../lib/translation'

type FormState = {
  name: string
  location: string
  mapsLink: string
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
  contact: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
}

type Festival = { name: string; description: string }

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

const i = "admin-input w-full"
const l = "block text-sm font-medium text-gray-600 mb-1"
const e = "mt-1 text-xs text-red-500"

const emptyForm = (): FormState => ({
  name: "", location: "", mapsLink: "", city: "", state: "", country: "India", pincode: "",
  description: "", descriptionHi: "", deity: "", establishedYear: "", templeType: "",
  speciality: "", categories: [], imageUrl: "", contact: "", phone: "", email: "",
  website: "", facebook: "", instagram: ""
})

export default function AdminNewTemplePage() {
  const router = useRouter()
  const { language } = useTranslation()
  const hi = language === 'hi'
  const T = {
    basicInfo: hi ? 'मूल जानकारी' : 'Basic Information',
    templeName: hi ? 'मंदिर का नाम' : 'Temple Name',
    deity: hi ? 'देवता/भगवान' : 'Deity/God',
    templeType: hi ? 'मंदिर प्रकार' : 'Temple Type',
    descEn: hi ? 'विवरण (अंग्रेजी)' : 'Description (English)',
    descHi: hi ? 'विवरण (हिंदी)' : 'Description (Hindi)',
    established: hi ? 'स्थापना वर्ष' : 'Established Year',
    speciality: hi ? 'विशेषता' : 'Speciality',
    sacredCats: hi ? 'पवित्र श्रेणियाँ' : 'Sacred Categories',
    locationDetails: hi ? 'स्थान विवरण' : 'Location Details',
    streetAddress: hi ? 'गली का पता' : 'Street Address',
    city: hi ? 'शहर' : 'City',
    state: hi ? 'राज्य' : 'State',
    pincode: hi ? 'पिनकोड' : 'Pincode',
    country: hi ? 'देश' : 'Country',
    mapsLink: hi ? 'गूगल मैप्स लिंक' : 'Google Maps Link',
    visitInfo: hi ? 'दर्शन जानकारी' : 'Visit Information',
    timings: hi ? 'समय' : 'Timings',
    addSlot: hi ? 'समय जोड़ें' : 'Add Slot',
    festivalsTitle: hi ? 'मंदिर के त्यौहार' : 'Temple Festivals',
    festivalsNote: hi ? 'यहाँ जोड़े गए त्यौहार Events पेज पर भी दिखेंगे' : 'Festivals added here will also appear on the Events page',
    addFestival: hi ? 'त्यौहार जोड़ें' : 'Add Festival',
    noFestivals: hi ? 'कोई त्यौहार नहीं जोड़ा गया।' : 'No festivals added yet. Click "Add Festival" to add temple festivals.',
    festival: hi ? 'त्यौहार' : 'Festival',
    festivalName: hi ? 'त्यौहार का नाम (जैसे महाशिवरात्रि)' : 'Festival name (e.g. Mahashivratri)',
    festivalDesc: hi ? 'इस त्यौहार का संक्षिप्त विवरण...' : 'Short description of this festival celebration...',
    contactInfo: hi ? 'संपर्क जानकारी' : 'Contact Information',
    phone: hi ? 'फ़ोन' : 'Phone',
    email: hi ? 'ईमेल' : 'Email',
    contact: hi ? 'सामान्य संपर्क' : 'General Contact',
    website: hi ? 'वेबसाइट' : 'Website',
    facebook: hi ? 'फेसबुक' : 'Facebook',
    instagram: hi ? 'इंस्टाग्राम' : 'Instagram',
    remove: hi ? 'हटाएं' : 'Remove',
    selectDeity: hi ? 'देवता चुनें' : 'Select Deity',
    selectType: hi ? 'प्रकार चुनें' : 'Select Type',
    selectState: hi ? 'राज्य चुनें' : 'Select State',
    addTemple: hi ? 'मंदिर जोड़ें' : 'Add Temple',
    submitting: hi ? 'जमा हो रहा है...' : 'Submitting...',
  }
  const [form, setForm] = useState<FormState>(emptyForm())
  const [timingSlots, setTimingSlots] = useState<string[]>([""])
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'timings', string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const err: Partial<Record<keyof FormState | 'timings', string>> = {}
    if (!form.name.trim()) err.name = "Temple name is required"
    if (!form.city.trim()) err.city = "City is required"
    if (!form.state.trim()) err.state = "State is required"
    if (!form.description.trim() || form.description.trim().length < 20) err.description = "Description is required (min 20 chars)"
    if (!timingSlots.some(s => s.trim())) err.timings = "At least one timing slot is required"
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Invalid email"
    if (form.phone && !/^\+?[0-9\-()\s]{6,}$/.test(form.phone)) err.phone = "Invalid phone number"
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm(s => ({ ...s, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitted(false)
    if (!validate()) return
    setLoading(true)
    try {
      const filledSlots = timingSlots.filter(s => s.trim())
      const res = await fetch('/api/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.name,
          location: [form.location, form.city, form.state, form.country, form.pincode ? `- ${form.pincode}` : ''].filter(Boolean).join(', '),
          mapsLink: form.mapsLink,
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
          timings: filledSlots.join(', '),
          timingSlots: filledSlots,
          festivals: festivals.filter(f => f.name.trim()),
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
        <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">â† Back to Temples</Link>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-6">

        {/* Basic Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
            {T.basicInfo}
          </h2>

          <div>
            <label className={l}>{T.templeName} *</label>
            <input value={form.name} onChange={ev => onChange("name", ev.target.value)} placeholder={hi ? 'जैसे श्री राम मंदिर' : 'e.g. Shri Ram Mandir'} className={`${i} ${errors.name ? 'border-red-400' : ''}`} />
            {errors.name && <p className={e}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={l}>{T.deity}</label>
              <select value={form.deity} onChange={ev => onChange("deity", ev.target.value)} className={i}>
                <option value="">{T.selectDeity}</option>
                {deities.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={l}>{T.templeType}</label>
              <select value={form.templeType} onChange={ev => onChange("templeType", ev.target.value)} className={i}>
                <option value="">{T.selectType}</option>
                {templeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={l}>{T.descEn} *</label>
            <textarea value={form.description} onChange={ev => onChange("description", ev.target.value)} rows={5} placeholder={hi ? 'मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें...' : "Describe the temple's history, significance, and features..."} className={`${i} ${errors.description ? 'border-red-400' : ''}`} />
            {errors.description && <p className={e}>{errors.description}</p>}
            <p className="mt-1 text-xs text-gray-400">{hi ? 'टिप: दो बार Enter दबाएं नया पैराग्राफ बनाने के लिए' : 'Tip: Press Enter twice for a new paragraph'}</p>
          </div>

          <div>
            <label className={l}>{T.descHi}</label>
            <textarea value={form.descriptionHi} onChange={ev => onChange("descriptionHi", ev.target.value)} rows={5} placeholder="मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें..." className={i} />
            <p className="mt-1 text-xs text-gray-400">{hi ? 'वैकल्पिक: द्विभाषी समर्थन के लिए हिंदी अनुवाद जोड़ें' : 'Optional: Add Hindi translation for bilingual support'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={l}>{T.established}</label>
              <input type="number" value={form.establishedYear} onChange={ev => onChange("establishedYear", ev.target.value)} placeholder={hi ? 'जैसे 1500' : 'e.g. 1500'} className={i} />
            </div>
            <div>
              <label className={l}>{T.speciality}</label>
              <input value={form.speciality} onChange={ev => onChange("speciality", ev.target.value)} placeholder={hi ? 'जैसे शिवरात्रि उत्सव के लिए प्रसिद्ध' : 'e.g. Famous for Shivratri celebration'} className={i} />
            </div>
          </div>

          <div>
            <label className={l}>{T.sacredCats}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2 p-4 rounded-xl bg-gray-50">
              {sacredCategories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-xl transition-colors text-sm">
                  <input type="checkbox" checked={form.categories.includes(cat)} onChange={ev => {
                    if (ev.target.checked) setForm(s => ({ ...s, categories: [...s.categories, cat] }))
                    else setForm(s => ({ ...s, categories: s.categories.filter(c => c !== cat) }))
                  }} className="w-4 h-4 rounded accent-orange-500" />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            {T.locationDetails}
          </h2>

          <div>
            <label className={l}>{T.streetAddress}</label>
            <input value={form.location} onChange={ev => onChange("location", ev.target.value)} placeholder={hi ? 'मंदिर मार्ग, रेलवे स्टेशन के पास' : 'Temple Road, Near Railway Station'} className={i} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={l}>{T.city} *</label>
              <input value={form.city} onChange={ev => onChange("city", ev.target.value)} placeholder={hi ? 'जैसे वाराणसी' : 'e.g. Varanasi'} className={`${i} ${errors.city ? 'border-red-400' : ''}`} />
              {errors.city && <p className={e}>{errors.city}</p>}
            </div>
            <div>
              <label className={l}>{T.state} *</label>
              <select value={form.state} onChange={ev => onChange("state", ev.target.value)} className={`${i} ${errors.state ? 'border-red-400' : ''}`}>
                <option value="">{T.selectState}</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className={e}>{errors.state}</p>}
            </div>
            <div>
              <label className={l}>{T.pincode}</label>
              <input type="number" value={form.pincode} onChange={ev => onChange("pincode", ev.target.value)} placeholder="e.g. 221001" className={i} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={l}>{T.country}</label>
              <select value={form.country} onChange={ev => onChange("country", ev.target.value)} className={i}>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={l}>{T.mapsLink}</label>
              <input value={form.mapsLink} onChange={ev => onChange("mapsLink", ev.target.value)} placeholder="https://maps.app.goo.gl/..." className={i} />
              <p className="mt-1 text-xs text-gray-400">{hi ? 'इस मंदिर का Google Maps URL पेस्ट करें' : 'Paste the Google Maps URL for this temple'}</p>
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {T.visitInfo}
          </h2>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={l}>{T.timings} * <span className="text-gray-400 font-normal">({hi ? 'प्रत्येक पंक्ति में एक स्लॉट' : 'add one slot per row'})</span></label>
              <button type="button" onClick={() => setTimingSlots(s => [...s, ""])} className="admin-btn admin-btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                {T.addSlot}
              </button>
            </div>
            <div className="space-y-2">
              {timingSlots.map((slot, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    value={slot}
                    onChange={ev => setTimingSlots(s => s.map((v, j) => j === idx ? ev.target.value : v))}
                    placeholder={idx === 0 ? (hi ? 'जैसे 5:00 AM – 12:00 PM' : 'e.g. 5:00 AM – 12:00 PM') : (hi ? 'जैसे 4:00 PM – 9:00 PM' : 'e.g. 4:00 PM – 9:00 PM')}
                    className={`${i} flex-1 ${errors.timings && idx === 0 ? 'border-red-400' : ''}`}
                  />
                  {timingSlots.length > 1 && (
                    <button type="button" onClick={() => setTimingSlots(s => s.filter((_, j) => j !== idx))} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.timings && <p className={e}>{errors.timings}</p>}
            <p className="mt-1 text-xs text-gray-400">{hi ? 'उदाहरण: "5:00 AM - 12:00 PM" और "4:00 PM - 9:00 PM" अलग-अलग स्लॉट में' : 'Examples: "5:00 AM – 12:00 PM" and "4:00 PM – 9:00 PM" as separate slots'}</p>
          </div>

          <ImageUpload
            label={hi ? 'मंदिर की छवि' : 'Temple Image'}
            value={form.imageUrl}
            onChange={url => onChange("imageUrl", url)}
            folder="sarvdev/temples"
          />
        </div>

        {/* Festivals */}
        <div className="admin-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="admin-section-title flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                {T.festivalsTitle}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{T.festivalsNote}</p>
            </div>
            <button type="button" onClick={() => setFestivals(s => [...s, { name: '', description: '' }])} className="admin-btn admin-btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              {T.addFestival}
            </button>
          </div>

          {festivals.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-400">{T.noFestivals}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {festivals.map((festival, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">{T.festival} {idx + 1}</span>
                    <button type="button" onClick={() => setFestivals(s => s.filter((_, j) => j !== idx))} className="text-xs text-red-500 hover:underline">{T.remove}</button>
                  </div>
                  <input
                    value={festival.name}
                    onChange={ev => setFestivals(s => s.map((f, j) => j === idx ? { ...f, name: ev.target.value } : f))}
                    placeholder={T.festivalName}
                    className={i}
                  />
                  <textarea
                    value={festival.description}
                    onChange={ev => setFestivals(s => s.map((f, j) => j === idx ? { ...f, description: ev.target.value } : f))}
                    rows={2}
                    placeholder={T.festivalDesc}
                    className={i}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            {T.contactInfo}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={l}>{T.phone}</label>
              <input type="tel" value={form.phone} onChange={ev => onChange("phone", ev.target.value)} placeholder="+91 98765 43210" className={`${i} ${errors.phone ? 'border-red-400' : ''}`} />
              {errors.phone && <p className={e}>{errors.phone}</p>}
            </div>
            <div>
              <label className={l}>{T.email}</label>
              <input type="email" value={form.email} onChange={ev => onChange("email", ev.target.value)} placeholder="temple@example.com" className={`${i} ${errors.email ? 'border-red-400' : ''}`} />
              {errors.email && <p className={e}>{errors.email}</p>}
            </div>
            <div>
              <label className={l}>{T.contact}</label>
              <input value={form.contact} onChange={ev => onChange("contact", ev.target.value)} placeholder="Priest name or admin contact" className={i} />
            </div>
            <div>
              <label className={l}>{T.website}</label>
              <input type="url" value={form.website} onChange={ev => onChange("website", ev.target.value)} placeholder="https://templewebsite.com" className={i} />
            </div>
            <div>
              <label className={l}>{T.facebook}</label>
              <input type="url" value={form.facebook} onChange={ev => onChange("facebook", ev.target.value)} placeholder="https://facebook.com/templepage" className={i} />
            </div>
            <div>
              <label className={l}>{T.instagram}</label>
              <input type="url" value={form.instagram} onChange={ev => onChange("instagram", ev.target.value)} placeholder="https://instagram.com/templepage" className={i} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</>
            ) : T.addTemple}
          </button>
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
