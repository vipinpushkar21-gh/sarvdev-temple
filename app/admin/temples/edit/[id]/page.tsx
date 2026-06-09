"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ImageUpload from "../../../../../components/ImageUpload"
import { getGroupedCategories } from '../../../../../lib/sacred-categories'

type FormState = {
  title: string
  titleHi: string
  slug: string
  location: string
  locationHi: string
  mapsLink: string
  city: string
  cityHi: string
  district: string
  state: string
  stateHi: string
  country: string
  pincode: string
  pincodeHi: string
  latitude: string
  longitude: string
  description: string
  descriptionHi: string
  tags: string
  history: string
  historyHi: string
  architecture: string
  architectureHi: string
  religiousImportance: string
  religiousImportanceHi: string
  festivalsHi: string
  bestTimeToVisit: string
  bestTimeToVisitHi: string
  nearbyTemples: string
  faqs: string
  sourceUrls: string
  deity: string
  deityHi: string
  establishedYear: string
  establishedYearHi: string
  templeType: string
  templeTypes: string[]
  sacredCategories: string[]
  speciality: string
  specialityHi: string
  primaryImage: string
  image: string
  imageCard: string
  imageHero: string
  imageGallery: string
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
  keywords: string
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

const sacredCategoryGroups = getGroupedCategories()

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const splitList = (value: string) => value.split(/\r?\n|,/).map(item => item.trim()).filter(Boolean)
const stringifyList = (value: unknown) => Array.isArray(value) ? value.filter(Boolean).join(', ') : String(value || '')
const parseFaqs = (value: string) =>
  value
    .split(/\r?\n|;/)
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const [question, ...answerParts] = item.split('|')
      return { question: (question || '').trim(), answer: answerParts.join('|').trim() }
    })
    .filter(item => item.question || item.answer)
const stringifyFaqs = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item: any) => [item?.question, item?.answer].filter(Boolean).join('|')).filter(Boolean).join('\n')
    : String(value || '')
const hasEnglishLetters = (value: string) => /[A-Za-z]/.test(value)

export default function EditTemplePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("")
  const [form, setForm] = useState<FormState>({ 
    title: "", titleHi: "", slug: "", location: "", locationHi: "", mapsLink: "", city: "", cityHi: "", district: "", state: "", stateHi: "", country: "India", pincode: "", pincodeHi: "", latitude: "", longitude: "",
    description: "", descriptionHi: "", tags: "", history: "", historyHi: "", architecture: "", architectureHi: "", religiousImportance: "", religiousImportanceHi: "",
    festivalsHi: "", bestTimeToVisit: "", bestTimeToVisitHi: "", nearbyTemples: "", faqs: "", sourceUrls: "", deity: "", deityHi: "", establishedYear: "", establishedYearHi: "", templeType: "", templeTypes: [], sacredCategories: [], speciality: "", specialityHi: "",
    primaryImage: "", image: "", imageCard: "", imageHero: "", imageGallery: "", timings: "", contact: "", phone: "", email: "", website: "", 
    facebook: "", instagram: "", status: "pending",
    metaTitle: "", metaDescription: "", metaKeywords: "", keywords: "", ogImage: ""
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
      const res = await fetch(`/api/temples/${encodeURIComponent(templeId)}?admin=1&t=${Date.now()}`, { 
        credentials: 'include',
        cache: 'no-store',
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      if (res.ok) {
        const temple = await res.json()
        if (temple) {
          setForm({
            title: temple.title || "",
            titleHi: temple.titleHi || "",
            slug: temple.slug || "",
            location: temple.location || "",
            locationHi: temple.locationHi || "",
            mapsLink: temple.googleMapUrl || temple.googleMapsUrl || temple.mapsLink || "",
            city: temple.city || "",
            cityHi: temple.cityHi || "",
            district: temple.district || "",
            state: temple.state || "",
            stateHi: temple.stateHi || "",
            country: temple.country || "India",
            pincode: temple.pincode || "",
            pincodeHi: temple.pincodeHi || "",
            latitude: temple.latitude !== undefined && temple.latitude !== null ? String(temple.latitude) : "",
            longitude: temple.longitude !== undefined && temple.longitude !== null ? String(temple.longitude) : "",
            description: temple.description || "",
            descriptionHi: temple.descriptionHi || "",
            tags: stringifyList(temple.tags),
            history: temple.history || "",
            historyHi: temple.historyHi || "",
            architecture: temple.architecture || temple.architectureHighlights || "",
            architectureHi: temple.architectureHi || "",
            religiousImportance: temple.religiousImportance || temple.sacredImportance || "",
            religiousImportanceHi: temple.religiousImportanceHi || temple.sacredImportanceHi || "",
            festivalsHi: temple.festivalsHi || (Array.isArray(temple.festivals) ? temple.festivals.map((f: any) => f?.nameHi).filter(Boolean).join(';') : ""),
            bestTimeToVisit: temple.bestTimeToVisit || temple.bestSeason || "",
            bestTimeToVisitHi: temple.bestTimeToVisitHi || "",
            nearbyTemples: stringifyList(Array.isArray(temple.nearbyTemples) && temple.nearbyTemples.length > 0 ? temple.nearbyTemples : temple.nearbySacredPlaces),
            faqs: stringifyFaqs(temple.faqs),
            sourceUrls: stringifyList(temple.sourceUrls),
            deity: temple.deity || "",
            deityHi: temple.deityHi || "",
            establishedYear: temple.establishedYear || "",
            establishedYearHi: temple.establishedYearHi || "",
            templeType: temple.templeType || "",
            templeTypes: Array.isArray(temple.templeTypes) && temple.templeTypes.length > 0
              ? temple.templeTypes
              : (temple.templeType ? [temple.templeType] : []),
            sacredCategories: Array.isArray(temple.sacredCategories) && temple.sacredCategories.length > 0
              ? temple.sacredCategories
              : (Array.isArray(temple.categories) && temple.categories.length > 0
                  ? temple.categories
                  : []),
            speciality: temple.speciality || "",
            specialityHi: temple.specialityHi || "",
            primaryImage: temple.primaryImage || temple.image || "",
            image: temple.image || "",
            imageCard: temple.imageCard || "",
            imageHero: temple.imageHero || temple.heroImage || "",
            imageGallery: Array.isArray(temple.imageGallery) && temple.imageGallery.length > 0
              ? temple.imageGallery.join('\n')
              : (Array.isArray(temple.galleryImages) ? temple.galleryImages.join('\n') : ""),
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
            metaKeywords: temple.metaKeywords || stringifyList(temple.keywords),
            keywords: stringifyList(temple.keywords),
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

  function toggleTempleType(type: string) {
    setForm(s => ({
      ...s,
      templeTypes: s.templeTypes.includes(type)
        ? s.templeTypes.filter(t => t !== type)
        : [...s.templeTypes, type]
    }))
  }

  function toggleSacredCategory(category: string) {
    setForm(s => ({
      ...s,
      sacredCategories: s.sacredCategories.includes(category)
        ? s.sacredCategories.filter(c => c !== category)
        : [...s.sacredCategories, category]
    }))
  }

  function autoGenerateSEO() {
    const title = form.title || ''
    const deity = form.deity || ''
    const city = form.city || ''
    const state = form.state || ''
    const type = form.templeType || ''

    const rawMetaTitle = deity
      ? `${title} — ${deity} Temple, ${city} | Sarvdev`
      : `${title} — ${city}, ${state} | Sarvdev`
    const metaTitle = rawMetaTitle.slice(0, 60)

    const metaDescription = (
      deity
        ? `Visit ${title}, a sacred ${type || 'temple'} dedicated to ${deity} in ${city}, ${state}. Explore timings, photos and more on Sarvdev.`
        : `Explore ${title} in ${city}, ${state}. Find timings, location, photos and history on Sarvdev.`
    ).slice(0, 160)

    const titleWords = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w: string) => w.length > 2)
    const keywordSet = [
      ...titleWords,
      ...(deity ? [deity.toLowerCase(), `${deity.toLowerCase()} temple`] : []),
      ...(city ? [city.toLowerCase()] : []),
      ...(state ? [state.toLowerCase()] : []),
      'temple', 'india', 'sarvdev',
    ]
    const metaKeywords = [...new Set(keywordSet)].join(', ')
    const ogImage = form.ogImage || form.imageHero || form.imageCard || form.primaryImage || form.image || ''

    setForm(prev => ({ ...prev, metaTitle, metaDescription, metaKeywords, ogImage }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      // Sync both categories and sacredCategories fields
      const submitData = {
        id,
        ...form,
        tags: splitList(form.tags),
        keywords: splitList(form.keywords || form.metaKeywords),
        metaKeywords: form.metaKeywords || form.keywords,
        religiousImportance: form.religiousImportance,
        religiousImportanceHi: form.religiousImportanceHi,
        sacredImportance: form.religiousImportance,
        sacredImportanceHi: form.religiousImportanceHi,
        architecture: form.architecture,
        architectureHi: form.architectureHi,
        architectureHighlights: form.architecture,
        bestTimeToVisit: form.bestTimeToVisit,
        bestTimeToVisitHi: form.bestTimeToVisitHi,
        bestSeason: form.bestTimeToVisit,
        nearbyTemples: splitList(form.nearbyTemples),
        nearbySacredPlaces: splitList(form.nearbyTemples),
        faqs: parseFaqs(form.faqs),
        sourceUrls: splitList(form.sourceUrls),
        latitude: form.latitude,
        longitude: form.longitude,
        googleMapUrl: form.mapsLink,
        googleMapsUrl: form.mapsLink,
        mapsLink: form.mapsLink,
        primaryImage: form.primaryImage,
        image: form.primaryImage || form.image || form.imageCard || form.imageHero,
        heroImage: form.imageHero,
        imageGallery: form.imageGallery.split(/\r?\n|,/).map(url => url.trim()).filter(Boolean),
        galleryImages: form.imageGallery.split(/\r?\n|,/).map(url => url.trim()).filter(Boolean),
        categories: form.sacredCategories, // Keep both fields in sync
      }

      const res = await fetch('/api/temples', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (res.ok) {
        showToast('success', 'Temple updated successfully!')
        // Re-fetch to confirm saved data
        await fetchTemple(id)
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
            <a href={`/temples/${form.slug || slugify(form.title)}`} target="_blank" rel="noopener noreferrer"
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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Hindi Temple Name (Devanagari)</label>
            <input value={form.titleHi} onChange={(e) => onChange("titleHi", e.target.value)} className="admin-input w-full" placeholder="जैसे श्री विष्णु मंदिर" />
            <p className="mt-1 text-xs text-gray-400">Optional. Leave blank if the Hindi name is not available.</p>
            {form.titleHi.trim() && hasEnglishLetters(form.titleHi) && (
              <p className="mt-1 text-xs text-amber-600">Use Devanagari only in this field. English name belongs in Temple Name.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Slug</label>
            <input value={form.slug} onChange={(e) => onChange("slug", e.target.value)} className="admin-input w-full" placeholder="temple-url-slug" />
            <p className="mt-1 text-xs text-gray-400">Keep existing slugs stable unless intentionally changing the public URL.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🕉️ Deity</label>
              <input value={form.deity} onChange={(e) => onChange("deity", e.target.value)} className="admin-input w-full" placeholder="e.g. Shiva, Vishnu, Durga..." />
              <input value={form.deityHi} onChange={(e) => onChange("deityHi", e.target.value)} className="admin-input w-full mt-2" placeholder="Deity name in Hindi" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">🏛️ Temple Type <span className="text-gray-400 font-normal">(ek ya zyada select karo)</span></label>
              <div className="flex flex-wrap gap-2">
                {templeTypes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTempleType(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      form.templeTypes.includes(t)
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {form.templeTypes.includes(t) && <span className="mr-1">✓</span>}{t}
                  </button>
                ))}
              </div>
              {form.templeTypes.length === 0 && <p className="mt-1 text-xs text-gray-400">Koi type select nahi hai</p>}
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
              <label className="block text-sm font-medium text-gray-600 mb-1">📅 Established Year / Era</label>
              <textarea value={form.establishedYear} onChange={(e) => onChange("establishedYear", e.target.value)} rows={3} className="admin-input w-full" placeholder="e.g. 1970 OR Ancient (Inscriptional evidence dates back to 2nd Century AD...)" />
              <textarea value={form.establishedYearHi} onChange={(e) => onChange("establishedYearHi", e.target.value)} rows={2} className="admin-input w-full mt-2" placeholder="हिन्दी में स्थापना वर्ष / काल" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🌟 Speciality</label>
              <input value={form.speciality} onChange={(e) => onChange("speciality", e.target.value)} className="admin-input w-full" />
              <input value={form.specialityHi} onChange={(e) => onChange("specialityHi", e.target.value)} className="admin-input w-full mt-2" placeholder="विशेषता हिन्दी में" />
            </div>
          </div>
        </div>

        {/* Sacred Categories */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Sacred Categories</h2>
          <p className="text-xs text-gray-400 mt-0.5">Sacred pilgrimage groups and temple categories (select multiple if applicable)</p>
          
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {sacredCategoryGroups.map(({ group, categories }) => (
              <div key={group.key}>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => toggleSacredCategory(cat.name)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        form.sacredCategories.includes(cat.name)
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      {form.sacredCategories.includes(cat.name) && <span className="mr-1">✓</span>}{cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {form.sacredCategories.length === 0 && <p className="mt-1 text-xs text-gray-400">No sacred categories selected</p>}
        </div>

        {/* Location Details */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">Location Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Street Address</label>
            <input value={form.location} onChange={(e) => onChange("location", e.target.value)} className="admin-input w-full" />
            <input value={form.locationHi} onChange={(e) => onChange("locationHi", e.target.value)} className="admin-input w-full mt-2" placeholder="पता हिन्दी में" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">GoogleMapUrl</label>
            <textarea
              value={form.mapsLink}
              rows={3}
              onChange={(e) => {
                const val = e.target.value
                // Auto-extract src URL if user pastes full <iframe> HTML
                const srcMatch = val.match(/src="([^"]*google\.com\/maps\/embed[^"]*)"/)
                onChange("mapsLink", srcMatch ? srcMatch[1] : val)
              }}
              placeholder={'Yahan poora <iframe> code paste karo — URL apne aap extract ho jaayega\nYA sirf src URL paste karo: https://www.google.com/maps/embed?pb=...'}
              className="admin-input w-full font-mono text-xs"
            />
            <p className="mt-1 text-xs text-gray-500">
              Google Maps → Location → <strong>Share → Embed a map</strong> → poora iframe code copy karke yahan paste karo
            </p>
            {form.mapsLink && form.mapsLink.includes('google.com/maps/embed') && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200" style={{ height: '220px' }}>
                <iframe src={form.mapsLink} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Latitude</label>
              <input type="number" step="any" value={form.latitude} onChange={(e) => onChange("latitude", e.target.value)} className="admin-input w-full" placeholder="25.3176" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Longitude</label>
              <input type="number" step="any" value={form.longitude} onChange={(e) => onChange("longitude", e.target.value)} className="admin-input w-full" placeholder="82.9739" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📍 City*</label>
              <input value={form.city} onChange={(e) => onChange("city", e.target.value)} className="admin-input w-full" />
              <input value={form.cityHi} onChange={(e) => onChange("cityHi", e.target.value)} className="admin-input w-full mt-2" placeholder="शहर हिन्दी में" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🗺️ State*</label>
              <select value={form.state} onChange={(e) => onChange("state", e.target.value)} className="admin-input w-full">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input value={form.stateHi} onChange={(e) => onChange("stateHi", e.target.value)} className="admin-input w-full mt-2" placeholder="राज्य हिन्दी में" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">📮 Pincode</label>
              <input type="number" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} className="admin-input w-full" />
              <input value={form.pincodeHi} onChange={(e) => onChange("pincodeHi", e.target.value)} className="admin-input w-full mt-2" placeholder="पिनकोड हिन्दी में (वैकल्पिक)" />
            </div>
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">District</label>
              <input value={form.district} onChange={(e) => onChange("district", e.target.value)} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
              <input value={form.country} onChange={(e) => onChange("country", e.target.value)} className="admin-input w-full" />
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

            <div className="md:col-span-2 space-y-6">
              <ImageUpload
                label="Primary Image"
                value={form.primaryImage}
                onChange={url => onChange("primaryImage", url)}
                folder="sarvdev/temples"
                guidance="card"
              />
              <ImageUpload
                label="Card Image"
                value={form.imageCard}
                onChange={url => onChange("imageCard", url)}
                folder="sarvdev/temples/cards"
                guidance="card"
              />
              <ImageUpload
                label="Hero Image"
                value={form.imageHero}
                onChange={url => onChange("imageHero", url)}
                folder="sarvdev/temples/heroes"
                guidance="hero"
              />
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gallery Images <span className="font-normal text-gray-400">(optional, one URL per line)</span></label>
                <textarea value={form.imageGallery} onChange={(e) => onChange("imageGallery", e.target.value)} rows={3} className="admin-input w-full" placeholder="https://..." />
                <p className="mt-1 text-xs text-gray-400">Optional multi-image gallery. Recommended 2400px+ wide, sacred elements away from edges.</p>
              </div>
              <ImageUpload
                label="Legacy Image"
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

        {/* Spiritual Content */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">🕉️ Spiritual Content</h2>
          <p className="text-xs text-gray-400">Add rich spiritual content — renders automatically on the temple page when filled.</p>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Religious Importance (English)</label>
            <textarea value={form.religiousImportance} onChange={e => onChange("religiousImportance", e.target.value)} rows={3} className="admin-input w-full" placeholder="Why is this temple spiritually significant?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Religious Importance (Hindi)</label>
            <textarea value={form.religiousImportanceHi} onChange={e => onChange("religiousImportanceHi", e.target.value)} rows={3} className="admin-input w-full" placeholder="Spiritual importance in Hindi..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Temple History (English)</label>
              <textarea value={form.history} onChange={e => onChange("history", e.target.value)} rows={4} className="admin-input w-full" placeholder="Historical background..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Temple History (Hindi)</label>
              <textarea value={form.historyHi} onChange={e => onChange("historyHi", e.target.value)} rows={4} className="admin-input w-full" placeholder="History in Hindi..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mythology (English)</label>
              <textarea value={(form as any).mythology || ""} onChange={e => setForm(s => ({ ...s, mythology: e.target.value }))} rows={4} className="admin-input w-full" placeholder="Mythological connection..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Temple Legend (English)</label>
              <textarea value={(form as any).templeLegend || ""} onChange={e => setForm(s => ({ ...s, templeLegend: e.target.value }))} rows={4} className="admin-input w-full" placeholder="Local legend or story..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sacred Mystery</label>
            <textarea value={(form as any).sacredMystery || ""} onChange={e => setForm(s => ({ ...s, sacredMystery: e.target.value }))} rows={3} className="admin-input w-full" placeholder="Any unexplained mystery or special phenomenon..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Secondary Deities</label>
              <input value={(form as any).secondaryDeities?.join(', ') || ""} onChange={e => setForm(s => ({ ...s, secondaryDeities: e.target.value.split(',').map((x: string) => x.trim()).filter(Boolean) }))} className="admin-input w-full" placeholder="e.g. Nandi, Parvati, Ganesha" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Sampradaya / Tradition</label>
              <input value={(form as any).sampradaya || ""} onChange={e => setForm(s => ({ ...s, sampradaya: e.target.value }))} className="admin-input w-full" placeholder="e.g. Shaiva, Vaishnava, Shakta" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Special Rituals</label>
              <textarea value={(form as any).specialRituals || ""} onChange={e => setForm(s => ({ ...s, specialRituals: e.target.value }))} rows={2} className="admin-input w-full" placeholder="e.g. Rudrabhishek, Mangal Aarti..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Prasadam Info</label>
              <textarea value={(form as any).prasadamInfo || ""} onChange={e => setForm(s => ({ ...s, prasadamInfo: e.target.value }))} rows={2} className="admin-input w-full" placeholder="What prasadam is distributed?" />
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">🏛️ Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Architecture</label>
              <textarea value={form.architecture} onChange={e => onChange("architecture", e.target.value)} rows={3} className="admin-input w-full" placeholder="Architectural summary and highlights..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Architecture (Hindi)</label>
              <textarea value={form.architectureHi} onChange={e => onChange("architectureHi", e.target.value)} rows={3} className="admin-input w-full" placeholder="Architecture summary in Hindi..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Architecture Style</label>
              <input value={(form as any).architectureStyle || ""} onChange={e => setForm(s => ({ ...s, architectureStyle: e.target.value }))} className="admin-input w-full" placeholder="e.g. Dravidian, Nagara, Vesara" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Built By</label>
              <input value={(form as any).builtBy || ""} onChange={e => setForm(s => ({ ...s, builtBy: e.target.value }))} className="admin-input w-full" placeholder="King / ruler / community" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Dynasty</label>
              <input value={(form as any).dynasty || ""} onChange={e => setForm(s => ({ ...s, dynasty: e.target.value }))} className="admin-input w-full" placeholder="e.g. Chola, Pallava, Maratha" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Temple Area</label>
              <input value={(form as any).templeArea || ""} onChange={e => setForm(s => ({ ...s, templeArea: e.target.value }))} className="admin-input w-full" placeholder="e.g. 40 acres" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Gopuram Count</label>
              <input value={(form as any).gopuramCount || ""} onChange={e => setForm(s => ({ ...s, gopuramCount: e.target.value }))} className="admin-input w-full" placeholder="e.g. 21 gopurams" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mandapam Details</label>
              <input value={(form as any).mandapamDetails || ""} onChange={e => setForm(s => ({ ...s, mandapamDetails: e.target.value }))} className="admin-input w-full" placeholder="e.g. 1000-pillar mandapam" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Architecture Highlights</label>
            <textarea value={(form as any).architectureHighlights || ""} onChange={e => setForm(s => ({ ...s, architectureHighlights: e.target.value }))} rows={3} className="admin-input w-full" placeholder="Notable architectural features..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Renovations</label>
            <input value={(form as any).renovations || ""} onChange={e => setForm(s => ({ ...s, renovations: e.target.value }))} className="admin-input w-full" placeholder="e.g. Renovated by ABC in 1920" />
          </div>
        </div>

        {/* Pilgrimage & Visitor Guide */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="admin-section-title">🛕 Pilgrimage & Visitor Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Pilgrimage Circuit</label>
              <input value={(form as any).pilgrimageCircuit || ""} onChange={e => setForm(s => ({ ...s, pilgrimageCircuit: e.target.value }))} className="admin-input w-full" placeholder="e.g. Char Dham, Jyotirlinga" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Best Time To Visit</label>
              <input value={form.bestTimeToVisit} onChange={e => onChange("bestTimeToVisit", e.target.value)} className="admin-input w-full" placeholder="e.g. October-March" />
              <input value={form.bestTimeToVisitHi} onChange={e => onChange("bestTimeToVisitHi", e.target.value)} className="admin-input w-full mt-2" placeholder="Best time to visit in Hindi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Avg. Visit Duration</label>
              <input value={(form as any).averageVisitDuration || ""} onChange={e => setForm(s => ({ ...s, averageVisitDuration: e.target.value }))} className="admin-input w-full" placeholder="e.g. 2–3 hours" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Crowd Level</label>
              <select value={(form as any).crowdLevel || ""} onChange={e => setForm(s => ({ ...s, crowdLevel: e.target.value }))} className="admin-input w-full">
                <option value="">— Select —</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="very-high">Very High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Dress Code</label>
              <input value={(form as any).dressCode || ""} onChange={e => setForm(s => ({ ...s, dressCode: e.target.value }))} className="admin-input w-full" placeholder="e.g. Traditional attire required" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Photography</label>
              <select value={(form as any).photographyAllowed || ""} onChange={e => setForm(s => ({ ...s, photographyAllowed: e.target.value }))} className="admin-input w-full">
                <option value="">— Select —</option>
                <option value="yes">Allowed</option>
                <option value="restricted">Restricted</option>
                <option value="no">Not Allowed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nearby Temples (comma-separated)</label>
            <input value={form.nearbyTemples} onChange={e => onChange("nearbyTemples", e.target.value)} className="admin-input w-full" placeholder="e.g. Kashi Vishwanath, Sankat Mochan" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Temple Rules</label>
            <textarea value={(form as any).templeRules || ""} onChange={e => setForm(s => ({ ...s, templeRules: e.target.value }))} rows={2} className="admin-input w-full" placeholder="Entry restrictions, mobile policy..." />
          </div>
        </div>

        {/* Travel Guide */}
        <div className="admin-card p-6 space-y-4">
          <h2 className="admin-section-title">✈️ Travel Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nearest Airport</label>
              <input value={(form as any).nearestAirport || ""} onChange={e => setForm(s => ({ ...s, nearestAirport: e.target.value }))} className="admin-input w-full" placeholder="e.g. Varanasi Airport (15 km)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nearest Railway Station</label>
              <input value={(form as any).nearestRailwayStation || ""} onChange={e => setForm(s => ({ ...s, nearestRailwayStation: e.target.value }))} className="admin-input w-full" placeholder="e.g. Varanasi Junction (3 km)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nearest Bus Stand</label>
              <input value={(form as any).nearestBusStand || ""} onChange={e => setForm(s => ({ ...s, nearestBusStand: e.target.value }))} className="admin-input w-full" placeholder="e.g. Varanasi Bus Stand (2 km)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Parking</label>
              <input value={(form as any).parkingAvailable || ""} onChange={e => setForm(s => ({ ...s, parkingAvailable: e.target.value }))} className="admin-input w-full" placeholder="e.g. Available, 500 vehicles" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Wheelchair Access</label>
              <input value={(form as any).wheelchairAccess || ""} onChange={e => setForm(s => ({ ...s, wheelchairAccess: e.target.value }))} className="admin-input w-full" placeholder="e.g. Ramp available at main gate" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Local Transport</label>
              <input value={(form as any).localTransport || ""} onChange={e => setForm(s => ({ ...s, localTransport: e.target.value }))} className="admin-input w-full" placeholder="e.g. Auto, e-rickshaw available" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Accommodation Info</label>
            <textarea value={(form as any).accommodationInfo || ""} onChange={e => setForm(s => ({ ...s, accommodationInfo: e.target.value }))} rows={2} className="admin-input w-full" placeholder="Hotels, dharamshalas, ashrams nearby..." />
          </div>
        </div>

        {/* Admin SEO Import Extras */}
        <div className="admin-card p-6 space-y-5">
          <div>
            <h2 className="admin-section-title">Admin SEO Import Extras</h2>
            <p className="text-xs text-gray-400 mt-0.5">Optional fields used by CSV import/export and rich SEO pages.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tags</label>
            <input value={form.tags} onChange={e => onChange("tags", e.target.value)} className="admin-input w-full" placeholder="vishnu, darshan, uttar pradesh" />
            <p className="mt-1 text-xs text-gray-400">Comma-separated tags.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Festivals (Hindi summary)</label>
            <input value={form.festivalsHi} onChange={e => onChange("festivalsHi", e.target.value)} className="admin-input w-full" placeholder="Hindi festival names or summary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">FAQs</label>
            <textarea value={form.faqs} onChange={e => onChange("faqs", e.target.value)} rows={3} className="admin-input w-full" placeholder="Question?|Answer; Another question?|Another answer" />
            <p className="mt-1 text-xs text-gray-400">Use one FAQ per line or semicolon. Separate question and answer with |.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Source URLs</label>
            <textarea value={form.sourceUrls} onChange={e => onChange("sourceUrls", e.target.value)} rows={2} className="admin-input w-full" placeholder="https://example.com/source" />
            <p className="mt-1 text-xs text-gray-400">Comma-separated or one URL per line.</p>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="admin-section-title">SEO &amp; Social Sharing</h2>
              <p className="text-xs text-gray-400 mt-0.5">Leave blank to auto-generate from title / description</p>
            </div>
            <button
              type="button"
              onClick={autoGenerateSEO}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary-700 hover:bg-primary/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              Auto-generate
            </button>
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
