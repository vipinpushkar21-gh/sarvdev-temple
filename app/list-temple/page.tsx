"use client"

import { useState, useRef } from "react"
import Hero from '../../components/Hero'
import { useTranslation } from '../../lib/translation'

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

const emptyForm = (): FormState => ({
  name: "", location: "", mapsLink: "", city: "", state: "", country: "India", pincode: "",
  description: "", descriptionHi: "", deity: "", establishedYear: "", templeType: "",
  speciality: "", categories: [], imageUrl: "", contact: "", phone: "", email: "",
  website: "", facebook: "", instagram: ""
})

export default function ListTemplePage() {
  const { language } = useTranslation()
  const hi = language === 'hi'
  const T = {
    basicInfo: hi ? 'मूल जानकारी' : 'Basic Information',
    templeName: hi ? 'मंदिर का नाम' : 'Temple Name',
    deity: hi ? 'देवता/भगवान' : 'Deity/God',
    templeType: hi ? 'मंदिर प्रकार' : 'Temple Type',
    descEn: hi ? 'विवरण (अंग्रेजी)' : 'Description (English)',
    descHi: hi ? 'विवरण (हिंदी)' : 'Description (Hindi)',
    descEnTip: hi ? 'टिप: दो बार Enter दबाएं नया पैराग्राफ बनाने के लिए' : 'Tip: Press Enter twice for a new paragraph',
    descHiNote: hi ? 'वैकल्पिक: द्विभाषी समर्थन के लिए हिंदी अनुवाद जोड़ें' : 'Optional: Add Hindi translation for bilingual support',
    established: hi ? 'स्थापना वर्ष' : 'Established Year',
    speciality: hi ? 'विशेषता' : 'Speciality',
    sacredCats: hi ? 'पवित्र श्रेणियाँ' : 'Sacred Categories',
    sacredNote: hi ? 'अगर यह मंदिर किसी पवित्र समूह में है तो चुनें' : 'Select if this temple belongs to a sacred group',
    locationDetails: hi ? 'स्थान विवरण' : 'Location Details',
    streetAddress: hi ? 'गली का पता' : 'Street Address',
    city: hi ? 'शहर' : 'City',
    state: hi ? 'राज्य' : 'State',
    pincode: hi ? 'पिनकोड' : 'Pincode',
    country: hi ? 'देश' : 'Country',
    mapsLink: hi ? 'गूगल मैप्स लिंक' : 'Google Maps Link',
    mapsNote: hi ? 'इस मंदिर का Google Maps URL पेस्ट करें' : 'Paste the Google Maps URL for this temple',
    visitInfo: hi ? 'दर्शन जानकारी' : 'Visit Information',
    timings: hi ? 'समय' : 'Timings',
    timingsNote: hi ? 'उदाहरण: "5:00 AM - 12:00 PM" और "4:00 PM - 9:00 PM" अलग-अलग स्लॉट में' : 'Examples: "5:00 AM – 12:00 PM" and "4:00 PM – 9:00 PM" as separate slots',
    addSlot: hi ? 'समय जोड़ें' : 'Add Slot',
    templeImage: hi ? 'मंदिर की छवि' : 'Temple Image',
    uploadImage: hi ? 'छवि अपलोड करें' : 'Upload Image',
    uploading: hi ? 'अपलोड हो रहा है...' : 'Uploading...',
    remove: hi ? 'हटाएं' : 'Remove',
    festivalsTitle: hi ? 'मंदिर के त्यौहार' : 'Temple Festivals',
    festivalsNote: hi ? 'यहाँ जोड़े गए त्यौहार Events पेज पर भी दिखेंगे' : 'Festivals added here will also appear on the Events page',
    addFestival: hi ? 'त्यौहार जोड़ें' : 'Add Festival',
    noFestivals: hi ? 'कोई त्यौहार नहीं जोड़ा गया। "त्यौहार जोड़ें" पर क्लिक करें।' : 'No festivals added yet. Click "Add Festival" to add temple festivals.',
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
    submitBtn: hi ? 'मंदिर जमा करें' : 'Submit Temple',
    submitting: hi ? 'जमा हो रहा है...' : 'Submitting...',
    successMsg: hi ? 'धन्यवाद! आपका मंदिर सबमिशन समीक्षा के लिए प्रतीक्षित है।' : 'Thank you! Your temple submission is pending approval.',
    heroTitle: hi ? 'मंदिर सूचीबद्ध करें' : 'List a Temple',
    heroSubtitle: hi ? 'मंदिर विवरण साझा करें और निर्देशिका में जोड़ें' : 'Share temple details to add to the directory',
    selectDeity: hi ? 'देवता चुनें' : 'Select Deity',
    selectType: hi ? 'प्रकार चुनें' : 'Select Type',
    selectState: hi ? 'राज्य चुनें' : 'Select State',
  }
  const [form, setForm] = useState<FormState>(emptyForm())
  const [timingSlots, setTimingSlots] = useState<string[]>([""])
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'timings', string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)

  function validate(): boolean {
    const e: Partial<Record<keyof FormState | 'timings', string>> = {}
    if (!form.name.trim()) e.name = "Temple name is required"
    if (!form.city.trim()) e.city = "City is required"
    if (!form.state.trim()) e.state = "State is required"
    if (!form.description.trim() || form.description.trim().length < 20) e.description = "Description is required (min 20 chars)"
    if (!timingSlots.some(s => s.trim())) e.timings = "At least one timing slot is required"
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email"
    if (form.phone && !/^\+?[0-9\-()\s]{6,}$/.test(form.phone)) e.phone = "Invalid phone number"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm(s => ({ ...s, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setImageError('Only image files allowed'); return }
    if (file.size > 10 * 1024 * 1024) { setImageError('File must be under 10MB'); return }
    setImageError('')
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'sarvdev/temples')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setForm(s => ({ ...s, imageUrl: data.url }))
      } else {
        setImageError(data.error || 'Upload failed')
      }
    } catch {
      setImageError('Network error, try again')
    } finally {
      setUploadingImage(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
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
          status: 'pending'
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setForm(emptyForm())
        setTimingSlots([""])
        setFestivals([])
      } else {
        alert('Failed to submit temple. Please try again.')
      }
    } catch {
      alert('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const sectionIcon = (path: string) => (
    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )

  return (
    <>
      <Hero title={T.heroTitle} subtitle={T.heroSubtitle} />
      <main className="content-container py-12" suppressHydrationWarning>
      <form onSubmit={onSubmit} noValidate className="space-y-8">

        {/* â”€â”€ Basic Information â”€â”€ */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                {sectionIcon("M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z")}
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">{T.basicInfo}</h2>
            </div>

            <div>
              <label className="label">{T.templeName} *</label>
              <input value={form.name} onChange={e => onChange("name", e.target.value)} placeholder={hi ? 'जैसे श्री राम मंदिर' : 'e.g. Shri Ram Mandir'} className={`input ${errors.name ? "border-semantic-error" : ""}`} />
              {errors.name && <p className="mt-1 text-caption text-semantic-error">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{T.deity}</label>
                <select value={form.deity} onChange={e => onChange("deity", e.target.value)} className="input">
                  <option value="">{T.selectDeity}</option>
                  {deities.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{T.templeType}</label>
                <select value={form.templeType} onChange={e => onChange("templeType", e.target.value)} className="input">
                  <option value="">{T.selectType}</option>
                  {templeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">{T.descEn} *</label>
              <textarea value={form.description} onChange={e => onChange("description", e.target.value)} rows={5} placeholder={hi ? 'मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें...' : "Describe the temple's history, significance, and features..."} className={`input ${errors.description ? "border-semantic-error" : ""}`} />
              {errors.description && <p className="mt-1 text-caption text-semantic-error">{errors.description}</p>}
              <p className="mt-1 text-caption text-ink-faint">{T.descEnTip}</p>
            </div>

            <div>
              <label className="label">{T.descHi}</label>
              <textarea value={form.descriptionHi} onChange={e => onChange("descriptionHi", e.target.value)} rows={5} placeholder="मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें..." className="input" />
              <p className="mt-1 text-caption text-ink-faint">{T.descHiNote}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{T.established}</label>
                <input type="number" value={form.establishedYear} onChange={e => onChange("establishedYear", e.target.value)} placeholder={hi ? 'जैसे 1500' : 'e.g. 1500'} className="input" />
              </div>
              <div>
                <label className="label">{T.speciality}</label>
                <input value={form.speciality} onChange={e => onChange("speciality", e.target.value)} placeholder={hi ? 'जैसे शिवरात्रि उत्सव के लिए प्रसिद्ध' : 'e.g. Famous for Shivratri celebration'} className="input" />
              </div>
            </div>

            <div>
              <label className="label mb-2">{T.sacredCats}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-surface-sunken rounded-xl">
                {sacredCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer hover:bg-surface-raised p-2.5 rounded-lg transition-colors">
                    <input type="checkbox" checked={form.categories.includes(cat)} onChange={e => {
                      if (e.target.checked) setForm(s => ({ ...s, categories: [...s.categories, cat] }))
                      else setForm(s => ({ ...s, categories: s.categories.filter(c => c !== cat) }))
                    }} className="w-4 h-4 accent-primary-500 rounded" />
                    <span className="text-body-sm text-ink">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Location Details ── */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-sm">
                {sectionIcon("M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z")}
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">{T.locationDetails}</h2>
            </div>

            <div>
              <label className="label">{T.streetAddress}</label>
              <input value={form.location} onChange={e => onChange("location", e.target.value)} placeholder={hi ? 'मंदिर मार्ग, रेलवे स्टेशन के पास' : 'Temple Road, Near Railway Station'} className="input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">{T.city} *</label>
                <input value={form.city} onChange={e => onChange("city", e.target.value)} placeholder={hi ? 'जैसे वाराणसी' : 'e.g. Varanasi'} className={`input ${errors.city ? "border-semantic-error" : ""}`} />
                {errors.city && <p className="mt-1 text-caption text-semantic-error">{errors.city}</p>}
              </div>
              <div>
                <label className="label">{T.state} *</label>
                <select value={form.state} onChange={e => onChange("state", e.target.value)} className={`input ${errors.state ? "border-semantic-error" : ""}`}>
                  <option value="">{T.selectState}</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="mt-1 text-caption text-semantic-error">{errors.state}</p>}
              </div>
              <div>
                <label className="label">{T.pincode}</label>
                <input type="number" value={form.pincode} onChange={e => onChange("pincode", e.target.value)} placeholder="e.g. 221001" className="input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{T.country}</label>
                <select value={form.country} onChange={e => onChange("country", e.target.value)} className="input">
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{T.mapsLink}</label>
                <input value={form.mapsLink} onChange={e => onChange("mapsLink", e.target.value)} placeholder="https://maps.app.goo.gl/..." className="input" />
                <p className="mt-1 text-caption text-ink-faint">{T.mapsNote}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Visit Information ── */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-sm">
                {sectionIcon("M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z")}
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">{T.visitInfo}</h2>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">{T.timings} * <span className="text-ink-faint font-normal text-caption">({hi ? 'प्रत्येक पंक्ति में एक स्लॉट' : 'add one slot per row'})</span></label>
                <button type="button" onClick={() => setTimingSlots(s => [...s, ""])} className="btn btn-sm text-xs px-3 py-1.5 bg-surface-raised border border-surface-border rounded-lg hover:bg-surface-sunken transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  {T.addSlot}
                </button>
              </div>
              <div className="space-y-2">
                {timingSlots.map((slot, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={slot}
                      onChange={e => setTimingSlots(s => s.map((v, idx) => idx === i ? e.target.value : v))}
                      placeholder={i === 0 ? (hi ? 'जैसे 5:00 AM – 12:00 PM' : 'e.g. 5:00 AM – 12:00 PM') : (hi ? 'जैसे 4:00 PM – 9:00 PM' : 'e.g. 4:00 PM – 9:00 PM')}
                      className={`input flex-1 ${errors.timings && i === 0 ? "border-semantic-error" : ""}`}
                    />
                    {timingSlots.length > 1 && (
                      <button type="button" onClick={() => setTimingSlots(s => s.filter((_, idx) => idx !== i))} className="w-8 h-8 flex items-center justify-center rounded-lg text-semantic-error hover:bg-red-50 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.timings && <p className="mt-1 text-caption text-semantic-error">{errors.timings}</p>}
              <p className="mt-2 text-caption text-ink-faint">{T.timingsNote}</p>
            </div>

            <div>
              <label className="label">{T.templeImage}</label>
              <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <input type="text" value={form.imageUrl} onChange={e => onChange("imageUrl", e.target.value)} placeholder="Paste image URL or upload below" className="input text-sm" />
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} className="btn btn-sm px-4 py-2 text-xs bg-surface-raised border border-surface-border rounded-lg hover:bg-surface-sunken transition-colors disabled:opacity-60 flex items-center gap-1.5">
                      {uploadingImage ? (
                        <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>{T.uploading}</>
                      ) : (
                        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>{T.uploadImage}</>
                      )}
                    </button>
                    {form.imageUrl && <button type="button" onClick={() => setForm(s => ({ ...s, imageUrl: '' }))} className="text-xs text-semantic-error hover:underline">Remove</button>}
                  </div>
                  {imageError && <p className="text-caption text-semantic-error">{imageError}</p>}
                </div>
                {form.imageUrl && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-surface-border flex-shrink-0 bg-surface-sunken">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>
        </div>

        {/* â”€â”€ Festivals â”€â”€ */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center shadow-sm">
                  {sectionIcon("M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5")}
                </div>
                <div>
                  <h2 className="text-h3 font-serif text-secondary-700">{T.festivalsTitle}</h2>
                  <p className="text-caption text-ink-faint">{T.festivalsNote}</p>
                </div>
              </div>
              <button type="button" onClick={() => setFestivals(s => [...s, { name: '', description: '' }])} className="btn btn-sm text-xs px-3 py-1.5 bg-surface-raised border border-surface-border rounded-lg hover:bg-surface-sunken transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                {T.addFestival}
              </button>
            </div>

            {festivals.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-surface-border rounded-xl">
                <p className="text-ink-muted text-body-sm">{T.noFestivals}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {festivals.map((festival, i) => (
                  <div key={i} className="p-4 bg-surface-sunken rounded-xl border border-surface-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-medium text-ink-muted">{T.festival} {i + 1}</span>
                      <button type="button" onClick={() => setFestivals(s => s.filter((_, idx) => idx !== i))} className="text-caption text-semantic-error hover:underline">{T.remove}</button>
                    </div>
                    <input
                      value={festival.name}
                      onChange={e => setFestivals(s => s.map((f, idx) => idx === i ? { ...f, name: e.target.value } : f))}
                      placeholder={T.festivalName}
                      className="input"
                    />
                    <textarea
                      value={festival.description}
                      onChange={e => setFestivals(s => s.map((f, idx) => idx === i ? { ...f, description: e.target.value } : f))}
                      rows={2}
                      placeholder={T.festivalDesc}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* â”€â”€ Contact Information â”€â”€ */}
        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                {sectionIcon("M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z")}
              </div>
              <h2 className="text-h3 font-serif text-secondary-700">{T.contactInfo}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{T.phone}</label>
                <input type="tel" value={form.phone} onChange={e => onChange("phone", e.target.value)} placeholder="+91 98765 43210" className={`input ${errors.phone ? "border-semantic-error" : ""}`} />
                {errors.phone && <p className="mt-1 text-caption text-semantic-error">{errors.phone}</p>}
              </div>
              <div>
                <label className="label">{T.email}</label>
                <input type="email" value={form.email} onChange={e => onChange("email", e.target.value)} placeholder="temple@example.com" className={`input ${errors.email ? "border-semantic-error" : ""}`} />
                {errors.email && <p className="mt-1 text-caption text-semantic-error">{errors.email}</p>}
              </div>
              <div>
                <label className="label">{T.contact}</label>
                <input value={form.contact} onChange={e => onChange("contact", e.target.value)} placeholder={hi ? 'पुजारी या प्रशासक का नाम' : 'Priest name or admin contact'} className="input" />
              </div>
              <div>
                <label className="label">{T.website}</label>
                <input type="url" value={form.website} onChange={e => onChange("website", e.target.value)} placeholder="https://templewebsite.com" className="input" />
              </div>
              <div>
                <label className="label">{T.facebook}</label>
                <input type="url" value={form.facebook} onChange={e => onChange("facebook", e.target.value)} placeholder="https://facebook.com/templepage" className="input" />
              </div>
              <div>
                <label className="label">{T.instagram}</label>
                <input type="url" value={form.instagram} onChange={e => onChange("instagram", e.target.value)} placeholder="https://instagram.com/templepage" className="input" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg disabled:opacity-60 group">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                {T.submitting}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {T.submitBtn}
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </span>
            )}
          </button>
          {submitted && (
            <div className="flex items-center gap-2 text-body-sm text-semantic-success font-medium bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {T.successMsg}
            </div>
          )}
        </div>
      </form>
      </main>
    </>
  )
}
