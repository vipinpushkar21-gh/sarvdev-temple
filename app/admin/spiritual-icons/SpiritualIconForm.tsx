"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '../../../components/ImageUpload'
import { SPIRITUAL_ICON_CATEGORIES } from '../../../data/spiritual-icon-categories'
import { slugifySpiritualIcon, type SpiritualIconRecord } from '../../../lib/spiritual-icons'

type FormValues = {
  name: string
  nameHi: string
  slug: string
  categorySlug: string
  title: string
  titleHi: string
  shortBio: string
  shortBioHi: string
  fullBio: string
  fullBioHi: string
  image: string
  imageCard: string
  imageHero: string
  galleryImages: string
  location: string
  city: string
  state: string
  country: string
  languages: string
  specializations: string
  sampradaya: string
  organization: string
  yearsActive: string
  notableWorks: string
  contactPhone: string
  contactEmail: string
  website: string
  youtube: string
  instagram: string
  facebook: string
  twitter: string
  bookingAvailable: boolean
  verified: boolean
  featured: boolean
  status: 'active' | 'inactive' | 'draft'
  priority: string
  metaTitle: string
  metaDescription: string
  ogImage: string
}

const DEFAULT_FORM: FormValues = {
  name: '',
  nameHi: '',
  slug: '',
  categorySlug: 'katha-vachak',
  title: '',
  titleHi: '',
  shortBio: '',
  shortBioHi: '',
  fullBio: '',
  fullBioHi: '',
  image: '',
  imageCard: '',
  imageHero: '',
  galleryImages: '',
  location: '',
  city: '',
  state: '',
  country: 'India',
  languages: '',
  specializations: '',
  sampradaya: '',
  organization: '',
  yearsActive: '',
  notableWorks: '',
  contactPhone: '',
  contactEmail: '',
  website: '',
  youtube: '',
  instagram: '',
  facebook: '',
  twitter: '',
  bookingAvailable: false,
  verified: false,
  featured: false,
  status: 'draft',
  priority: '999',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
}

function listToString(value?: string[]) {
  return Array.isArray(value) ? value.join(', ') : ''
}

export function iconToForm(icon?: Partial<SpiritualIconRecord>): FormValues {
  if (!icon) return DEFAULT_FORM
  return {
    ...DEFAULT_FORM,
    name: icon.name || '',
    nameHi: icon.nameHi || '',
    slug: icon.slug || '',
    categorySlug: icon.categorySlug || 'katha-vachak',
    title: icon.title || '',
    titleHi: icon.titleHi || '',
    shortBio: icon.shortBio || '',
    shortBioHi: icon.shortBioHi || '',
    fullBio: icon.fullBio || '',
    fullBioHi: icon.fullBioHi || '',
    image: icon.image || '',
    imageCard: icon.imageCard || '',
    imageHero: icon.imageHero || '',
    galleryImages: listToString(icon.galleryImages),
    location: icon.location || '',
    city: icon.city || '',
    state: icon.state || '',
    country: icon.country || 'India',
    languages: listToString(icon.languages),
    specializations: listToString(icon.specializations),
    sampradaya: icon.sampradaya || '',
    organization: icon.organization || '',
    yearsActive: icon.yearsActive || '',
    notableWorks: listToString(icon.notableWorks),
    contactPhone: icon.contactPhone || '',
    contactEmail: icon.contactEmail || '',
    website: icon.website || '',
    youtube: icon.youtube || '',
    instagram: icon.instagram || '',
    facebook: icon.facebook || '',
    twitter: icon.twitter || '',
    bookingAvailable: Boolean(icon.bookingAvailable),
    verified: Boolean(icon.verified),
    featured: Boolean(icon.featured),
    status: icon.status || 'draft',
    priority: String(icon.priority ?? 999),
    metaTitle: icon.metaTitle || '',
    metaDescription: icon.metaDescription || '',
    ogImage: icon.ogImage || '',
  }
}

type Props = {
  mode: 'create' | 'edit'
  id?: string
  initialValues?: FormValues
}

export default function SpiritualIconForm({ mode, id, initialValues }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormValues>(initialValues || DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const category = useMemo(() => SPIRITUAL_ICON_CATEGORIES.find((item) => item.slug === form.categorySlug), [form.categorySlug])

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateName(value: string) {
    setForm((current) => ({ ...current, name: value, slug: current.slug || slugifySpiritualIcon(value) }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required.' })
      return
    }

    const payload = {
      ...form,
      slug: form.slug || slugifySpiritualIcon(form.name),
      category: category?.name || '',
      galleryImages: splitList(form.galleryImages),
      languages: splitList(form.languages),
      specializations: splitList(form.specializations),
      notableWorks: splitList(form.notableWorks),
      priority: Number(form.priority) || 999,
      image: form.imageCard || form.image || '',
    }

    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(mode === 'edit' ? `/api/admin/spiritual-icons/${id}` : '/api/admin/spiritual-icons', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Save failed.' })
        return
      }
      setMessage({ type: 'success', text: mode === 'edit' ? 'Spiritual icon updated.' : 'Spiritual icon created.' })
      setTimeout(() => router.push('/admin/spiritual-icons'), 700)
    } catch {
      setMessage({ type: 'error', text: 'Network error while saving.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">{mode === 'edit' ? 'Edit Spiritual Icon' : 'Create Spiritual Icon'}</h1>
          <p className="admin-section-subtitle">Manage public profiles, media, categories, contact, and SEO.</p>
        </div>
        <Link href="/admin/spiritual-icons" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back</Link>
      </div>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <Section title="Basic Info" subtitle="Name, category, role, and location.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" required value={form.name} onChange={updateName} />
            <Field label="Hindi Name" value={form.nameHi} onChange={(value) => setField('nameHi', value)} />
            <Field label="Slug" value={form.slug} onChange={(value) => setField('slug', slugifySpiritualIcon(value))} />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Category</label>
              <select value={form.categorySlug} onChange={(e) => setField('categorySlug', e.target.value)} className="admin-input w-full">
                {SPIRITUAL_ICON_CATEGORIES.map((item) => (
                  <option key={item.slug} value={item.slug}>{item.name}</option>
                ))}
              </select>
            </div>
            <Field label="Title" value={form.title} onChange={(value) => setField('title', value)} placeholder="e.g. Ram Katha narrator" />
            <Field label="Hindi Title" value={form.titleHi} onChange={(value) => setField('titleHi', value)} />
            <Field label="City" value={form.city} onChange={(value) => setField('city', value)} />
            <Field label="State" value={form.state} onChange={(value) => setField('state', value)} />
            <Field label="Country" value={form.country} onChange={(value) => setField('country', value)} />
            <Field label="Location" value={form.location} onChange={(value) => setField('location', value)} />
          </div>
        </Section>

        <Section title="Biography" subtitle="Short cards and full detail profile copy.">
          <TextArea label="Short Bio" value={form.shortBio} onChange={(value) => setField('shortBio', value)} rows={3} />
          <TextArea label="Short Bio Hindi" value={form.shortBioHi} onChange={(value) => setField('shortBioHi', value)} rows={3} />
          <TextArea label="Full Bio" value={form.fullBio} onChange={(value) => setField('fullBio', value)} rows={6} />
          <TextArea label="Full Bio Hindi" value={form.fullBioHi} onChange={(value) => setField('fullBioHi', value)} rows={6} />
        </Section>

        <Section title="Expertise" subtitle="Languages, specializations, lineage, and notable works.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Languages" value={form.languages} onChange={(value) => setField('languages', value)} placeholder="Hindi, Sanskrit, Gujarati" />
            <Field label="Specializations" value={form.specializations} onChange={(value) => setField('specializations', value)} placeholder="Ram Katha, Bhagwat Katha" />
            <Field label="Sampradaya" value={form.sampradaya} onChange={(value) => setField('sampradaya', value)} />
            <Field label="Organization" value={form.organization} onChange={(value) => setField('organization', value)} />
            <Field label="Years Active" value={form.yearsActive} onChange={(value) => setField('yearsActive', value)} />
            <Field label="Notable Works" value={form.notableWorks} onChange={(value) => setField('notableWorks', value)} />
          </div>
        </Section>

        <Section title="Media" subtitle="Use Cloudinary/local images only. Keep face and body centered.">
          <ImageUpload value={form.imageCard} onChange={(url) => setField('imageCard', url)} folder="sarvdev/spiritual-icons/cards" label="Card Image" guidance="card" />
          <ImageUpload value={form.imageHero} onChange={(url) => setField('imageHero', url)} folder="sarvdev/spiritual-icons/heroes" label="Hero Image" guidance="hero" />
          <Field label="Gallery Images" value={form.galleryImages} onChange={(value) => setField('galleryImages', value)} placeholder="Comma-separated Cloudinary/local URLs" />
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            Card image: 3000 x 3000 square safe. Hero image: 3360 x 1440 panoramic. Keep face/body centered, not cropped.
          </p>
        </Section>

        <Section title="Contact & Social" subtitle="Optional public contact and social links.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Phone" value={form.contactPhone} onChange={(value) => setField('contactPhone', value)} />
            <Field label="Email" type="email" value={form.contactEmail} onChange={(value) => setField('contactEmail', value)} />
            <Field label="Website" value={form.website} onChange={(value) => setField('website', value)} />
            <Field label="YouTube" value={form.youtube} onChange={(value) => setField('youtube', value)} />
            <Field label="Instagram" value={form.instagram} onChange={(value) => setField('instagram', value)} />
            <Field label="Facebook" value={form.facebook} onChange={(value) => setField('facebook', value)} />
            <Field label="Twitter" value={form.twitter} onChange={(value) => setField('twitter', value)} />
          </div>
        </Section>

        <Section title="Display Control" subtitle="Publishing, verification, order, and booking.">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value as FormValues['status'])} className="admin-input w-full">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Field label="Priority" type="number" value={form.priority} onChange={(value) => setField('priority', value)} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Toggle label="Verified" checked={form.verified} onChange={(value) => setField('verified', value)} />
            <Toggle label="Featured" checked={form.featured} onChange={(value) => setField('featured', value)} />
            <Toggle label="Booking Available" checked={form.bookingAvailable} onChange={(value) => setField('bookingAvailable', value)} />
          </div>
        </Section>

        <Section title="SEO" subtitle="Optional metadata for search and sharing.">
          <Field label="Meta Title" value={form.metaTitle} onChange={(value) => setField('metaTitle', value)} maxLength={70} />
          <TextArea label="Meta Description" value={form.metaDescription} onChange={(value) => setField('metaDescription', value)} rows={3} maxLength={180} />
          <ImageUpload value={form.ogImage} onChange={(url) => setField('ogImage', url)} folder="sarvdev/spiritual-icons/og" label="OG Image" guidance="card" />
        </Section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? 'Saving...' : mode === 'edit' ? 'Save Spiritual Icon' : 'Create Spiritual Icon'}
          </button>
          <Link href="/admin/spiritual-icons" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

function splitList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="admin-card space-y-5 p-6">
      <div>
        <h2 className="admin-section-title">{title}</h2>
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, required, maxLength }: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-600">{label}{required ? '*' : ''}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} maxLength={maxLength} className="admin-input w-full" />
      {maxLength && <p className="mt-1 text-xs text-gray-400">{value.length}/{maxLength}</p>}
    </div>
  )
}

function TextArea({ label, value, onChange, rows, maxLength }: {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
  maxLength?: number
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-600">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} maxLength={maxLength} className="admin-input w-full" />
      {maxLength && <p className="mt-1 text-xs text-gray-400">{value.length}/{maxLength}</p>}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded accent-orange-500" />
      {label}
    </label>
  )
}
