"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '../../../components/ImageUpload'
import type { SarvdevMediaAsset } from '../../../lib/media-asset'

export type DarshanFormValues = {
  title: string
  titleHi: string
  slug: string
  templeName: string
  templeNameHi: string
  deity: string
  deityHi: string
  location: string
  city: string
  state: string
  description: string
  descriptionHi: string
  videoUrl: string
  youtubeUrl: string
  provider: 'youtube' | 'direct' | 'other'
  contentType: 'photo' | 'video' | 'live'
  thumbnail: string
  primaryMedia: SarvdevMediaAsset | null
  imageCard: string
  cardMedia: SarvdevMediaAsset | null
  imageHero: string
  heroMedia: SarvdevMediaAsset | null
  galleryMedia: SarvdevMediaAsset[]
  darshanType: 'live' | 'recorded' | 'upcoming'
  isLive: boolean
  isFeatured: boolean
  priority: string
  status: 'active' | 'inactive' | 'draft' | 'approved' | 'pending' | 'rejected'
  darshanDate: string
  startTime: string
  endTime: string
  repeatDays: string[]
  timezone: string
  scheduleRule: 'one-time' | 'recurring'
  festivalTag: string
  templeSlug: string
  deitySlug: string
  relatedDevotionalSlug: string
  externalUrl: string
  metaTitle: string
  metaDescription: string
  ogImage: string
  ogMedia: SarvdevMediaAsset | null
}

const DEFAULT_VALUES: DarshanFormValues = {
  title: '',
  titleHi: '',
  slug: '',
  templeName: '',
  templeNameHi: '',
  deity: '',
  deityHi: '',
  location: '',
  city: '',
  state: '',
  description: '',
  descriptionHi: '',
  videoUrl: '',
  youtubeUrl: '',
  provider: 'youtube',
  contentType: 'photo',
  thumbnail: '',
  primaryMedia: null,
  imageCard: '',
  cardMedia: null,
  imageHero: '',
  heroMedia: null,
  galleryMedia: [],
  darshanType: 'recorded',
  isLive: false,
  isFeatured: false,
  priority: '999',
  status: 'draft',
  darshanDate: '',
  startTime: '',
  endTime: '',
  repeatDays: [],
  timezone: 'Asia/Kolkata',
  scheduleRule: 'one-time',
  festivalTag: '',
  templeSlug: '',
  deitySlug: '',
  relatedDevotionalSlug: '',
  externalUrl: '',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  ogMedia: null,
}

const REPEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function normalizeDarshanForForm(data: any): DarshanFormValues {
  return {
    ...DEFAULT_VALUES,
    title: data?.title || '',
    titleHi: data?.titleHi || '',
    slug: data?.slug || '',
    templeName: data?.templeName || data?.temple || '',
    templeNameHi: data?.templeNameHi || '',
    deity: data?.deity || '',
    deityHi: data?.deityHi || '',
    location: data?.location || '',
    city: data?.city || '',
    state: data?.state || '',
    description: data?.description || '',
    descriptionHi: data?.descriptionHi || '',
    videoUrl: data?.videoUrl || data?.video || data?.media || '',
    youtubeUrl: data?.youtubeUrl || '',
    provider: data?.provider || 'youtube',
    contentType: data?.contentType || (data?.darshanType === 'live' ? 'live' : (data?.videoUrl || data?.youtubeUrl ? 'video' : 'photo')),
    thumbnail: data?.thumbnail || '',
    primaryMedia: data?.primaryMedia || null,
    imageCard: data?.imageCard || data?.image || '',
    cardMedia: data?.cardMedia || null,
    imageHero: data?.imageHero || '',
    heroMedia: data?.heroMedia || null,
    galleryMedia: Array.isArray(data?.galleryMedia) ? data.galleryMedia : [],
    darshanType: data?.darshanType || data?.type || (data?.isLive ? 'live' : 'recorded'),
    isLive: Boolean(data?.isLive),
    isFeatured: Boolean(data?.isFeatured ?? data?.featured),
    priority: String(data?.priority ?? 999),
    status: data?.status || 'draft',
    darshanDate: data?.darshanDate || data?.date || '',
    startTime: data?.startTime || data?.time || '',
    endTime: data?.endTime || '',
    repeatDays: Array.isArray(data?.repeatDays) ? data.repeatDays : [],
    timezone: data?.timezone || 'Asia/Kolkata',
    scheduleRule: data?.scheduleRule === 'recurring' ? 'recurring' : 'one-time',
    festivalTag: data?.festivalTag || '',
    templeSlug: data?.templeSlug || '',
    deitySlug: data?.deitySlug || '',
    relatedDevotionalSlug: data?.relatedDevotionalSlug || '',
    externalUrl: data?.externalUrl || '',
    metaTitle: data?.metaTitle || '',
    metaDescription: data?.metaDescription || '',
    ogImage: data?.ogImage || '',
    ogMedia: data?.ogMedia || null,
  }
}

type Props = {
  mode: 'create' | 'edit'
  id?: string
  initialValues?: Partial<DarshanFormValues>
}

export default function DarshanForm({ mode, id, initialValues }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<DarshanFormValues>(() => ({ ...DEFAULT_VALUES, ...initialValues }))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const pageTitle = mode === 'edit' ? 'Edit Darshan' : 'Add New Darshan'
  const submitLabel = mode === 'edit' ? 'Save Darshan' : 'Create Darshan'
  const imagePreviewSeed = useMemo(() => form.imageHero || form.imageCard || form.thumbnail, [form.imageHero, form.imageCard, form.thumbnail])

  function setField<K extends keyof DarshanFormValues>(key: K, value: DarshanFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function setContentType(value: DarshanFormValues['contentType']) { setForm((current) => ({ ...current, contentType: value, darshanType: value === 'live' ? 'live' : 'recorded' })) }

  function toggleRepeatDay(day: string) {
    setForm((current) => ({
      ...current,
      repeatDays: current.repeatDays.includes(day)
        ? current.repeatDays.filter((item) => item !== day)
        : [...current.repeatDays, day],
    }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required.' })
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/darshan', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(mode === 'edit' ? { id } : {}),
          ...form,
          temple: form.templeName,
          date: form.darshanDate,
          time: form.startTime,
          type: form.darshanType,
          featured: form.isFeatured,
          image: imagePreviewSeed,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Failed to save darshan.' })
        return
      }

      setMessage({ type: 'success', text: mode === 'edit' ? 'Darshan updated.' : 'Darshan created.' })
      setTimeout(() => router.push('/admin/darshan'), 700)
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">{pageTitle}</h1>
          <p className="admin-section-subtitle">Manage the public Daily Darshan experience from one place.</p>
        </div>
        <Link href="/admin/darshan" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back to Darshan</Link>
      </div>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <FormSection title="Identity" subtitle="Stable titles and canonical URL identity.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" required value={form.title} onChange={(value) => setField('title', value)} placeholder="e.g. Kashi Vishwanath Morning Darshan" />
            <Field label="Hindi Title" value={form.titleHi} onChange={(value) => setField('titleHi', value)} placeholder="Hindi title" />
            <Field label="Slug (generated from title when blank)" value={form.slug} onChange={(value) => setField('slug', value)} placeholder="kashi-vishwanath-morning-darshan" />
          </div>
        </FormSection>

        <FormSection title="Temple, Deity & Location" subtitle="Link known records by canonical slug; leave a relationship blank when it is not known.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Temple Name" value={form.templeName} onChange={(value) => setField('templeName', value)} placeholder="e.g. Kashi Vishwanath Temple" />
            <Field label="Hindi Temple Name" value={form.templeNameHi} onChange={(value) => setField('templeNameHi', value)} placeholder="Hindi temple name" />
            <Field label="Deity" value={form.deity} onChange={(value) => setField('deity', value)} placeholder="Shiva, Vishnu, Krishna..." />
            <Field label="Hindi Deity" value={form.deityHi} onChange={(value) => setField('deityHi', value)} placeholder="Hindi deity name" />
            <Field label="City" value={form.city} onChange={(value) => setField('city', value)} placeholder="Varanasi" />
            <Field label="State" value={form.state} onChange={(value) => setField('state', value)} placeholder="Uttar Pradesh" />
          </div>
          <Field label="Location" value={form.location} onChange={(value) => setField('location', value)} placeholder="City, State or full public location" />
          <TextArea label="Description" value={form.description} onChange={(value) => setField('description', value)} rows={4} />
          <TextArea label="Hindi Description" value={form.descriptionHi} onChange={(value) => setField('descriptionHi', value)} rows={4} />
        </FormSection>

        <FormSection title="Darshan Content" subtitle="Photo Darshan is primary. A stream URL never verifies a live broadcast.">
          <div><label className="mb-1 block text-sm font-medium text-gray-600">Content type</label><select value={form.contentType} onChange={(e) => setContentType(e.target.value as DarshanFormValues['contentType'])} className="admin-input w-full"><option value="photo">Photo Darshan</option><option value="video">Recorded Video</option><option value="live">Live Stream</option></select></div>
          {form.contentType === 'photo' && <PhotoGallery gallery={form.galleryMedia} onChange={(galleryMedia) => setField('galleryMedia', galleryMedia)} />}
          {form.contentType !== 'photo' && <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium text-gray-600">Provider</label><select value={form.provider} onChange={(e) => setField('provider', e.target.value as DarshanFormValues['provider'])} className="admin-input w-full"><option value="youtube">YouTube</option><option value="direct">Direct video</option><option value="other">Other external source</option></select></div>
            <Field label="YouTube URL" value={form.youtubeUrl} onChange={(value) => setField('youtubeUrl', value)} placeholder="https://www.youtube.com/watch?v=..." />
            <Field label="Video URL" value={form.videoUrl} onChange={(value) => setField('videoUrl', value)} placeholder="Hosted video URL" />
            <Field label="External URL" value={form.externalUrl} onChange={(value) => setField('externalUrl', value)} placeholder="Official temple/live page URL" />
          </div>}
          <p className="text-xs text-gray-500">Card media resolves as card media, primary media, then the first gallery image, then legacy image fields.</p>
        </FormSection>

        <FormSection title="Media" subtitle="Managed media for the Darshan card and detail presentation.">
          <ImageUpload
            value={form.thumbnail}
            media={form.primaryMedia}
            onChange={(url) => setField('thumbnail', url)}
            onMediaChange={(media) => setField('primaryMedia', media)}
            folder="sarvdev/darshan/thumbnails"
            label="Thumbnail"
            guidance="darshanCard"
            kind="darshan"
          />
          <ImageUpload
            value={form.imageCard}
            media={form.cardMedia}
            onChange={(url) => setField('imageCard', url)}
            onMediaChange={(media) => setField('cardMedia', media)}
            folder="sarvdev/darshan/cards"
            label="Card Image"
            guidance="darshanCard"
            kind="darshan"
          />
          <ImageUpload
            value={form.imageHero}
            media={form.heroMedia}
            onChange={(url) => setField('imageHero', url)}
            onMediaChange={(media) => setField('heroMedia', media)}
            folder="sarvdev/darshan/heroes"
            label="Hero Image"
            guidance="darshanHero"
            kind="darshan"
          />
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            Thumbnail/Card: recommended 1600 x 900, AI target 2000 x 1125. Hero: recommended 3360 x 1440 with cinematic safe framing and no crop-risk.
          </p>
        </FormSection>

        <FormSection title="Publishing & Display Control" subtitle="Control how this appears on the public Daily Darshan page.">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Darshan Type</label>
              <select value={form.darshanType} onChange={(e) => setField('darshanType', e.target.value as DarshanFormValues['darshanType'])} className="admin-input w-full">
                <option value="live">Live</option>
                <option value="recorded">Recorded</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value as DarshanFormValues['status'])} className="admin-input w-full">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved (legacy active)</option>
                <option value="pending">Pending (legacy)</option>
                <option value="rejected">Rejected (legacy)</option>
              </select>
            </div>
            <Field label="Priority / Order" type="number" value={form.priority} onChange={(value) => setField('priority', value)} placeholder="1 shows first" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Toggle label="Manual live state" checked={form.isLive} onChange={(checked) => setField('isLive', checked)} />
            <Toggle label="Featured" checked={form.isFeatured} onChange={(checked) => setField('isFeatured', checked)} />
          </div>
        </FormSection>

        <FormSection title="Schedule" subtitle="Date, timing, repeat days, timezone, and festival context.">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Darshan Date" type="date" value={form.darshanDate} onChange={(value) => setField('darshanDate', value)} />
            <Field label="Start Time" type="time" value={form.startTime} onChange={(value) => setField('startTime', value)} />
            <Field label="End Time" type="time" value={form.endTime} onChange={(value) => setField('endTime', value)} />
            <Field label="Timezone" value={form.timezone} onChange={(value) => setField('timezone', value)} placeholder="Asia/Kolkata" />
            <div><label className="mb-1 block text-sm font-medium text-gray-600">Schedule type</label><select value={form.scheduleRule} onChange={(e) => setField('scheduleRule', e.target.value as DarshanFormValues['scheduleRule'])} className="admin-input w-full"><option value="one-time">One-time</option><option value="recurring">Recurring</option></select></div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">Repeat Days</label>
            <div className="flex flex-wrap gap-2">
              {REPEAT_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleRepeatDay(day)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${form.repeatDays.includes(day) ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <Field label="Festival / Vrat Tag" value={form.festivalTag} onChange={(value) => setField('festivalTag', value)} placeholder="e.g. Mahashivratri, Janmashtami" />
        </FormSection>

        <FormSection title="Related Links" subtitle="Connect darshan to temples, deities, devotionals, and external sources.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Temple Slug" value={form.templeSlug} onChange={(value) => setField('templeSlug', value)} placeholder="kashi-vishwanath-temple-varanasi" />
            <Field label="Deity Slug" value={form.deitySlug} onChange={(value) => setField('deitySlug', value)} placeholder="shiva" />
            <Field label="Related Devotional Slug" value={form.relatedDevotionalSlug} onChange={(value) => setField('relatedDevotionalSlug', value)} placeholder="mahamrityunjaya-mantra" />
          </div>
        </FormSection>

        <FormSection title="SEO" subtitle="Optional search and social sharing metadata.">
          <Field label="Meta Title" value={form.metaTitle} maxLength={80} onChange={(value) => setField('metaTitle', value)} />
          <TextArea label="Meta Description" value={form.metaDescription} maxLength={180} onChange={(value) => setField('metaDescription', value)} rows={3} />
          <ImageUpload
            value={form.ogImage}
            media={form.ogMedia}
            onChange={(url) => setField('ogImage', url)}
            onMediaChange={(media) => setField('ogMedia', media)}
            folder="sarvdev/darshan/og"
            label="OG Image"
            guidance="darshanCard"
            kind="darshan"
          />
        </FormSection>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? 'Saving...' : submitLabel}
          </button>
          <Link href="/admin/darshan" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

function FormSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  maxLength?: number
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-600">
        {label}{required ? '*' : ''}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        className="admin-input w-full"
        placeholder={placeholder}
      />
      {maxLength && <p className="mt-1 text-xs text-gray-400">{value.length}/{maxLength}</p>}
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  maxLength,
}: {
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

function PhotoGallery({ gallery, onChange }: { gallery: SarvdevMediaAsset[]; onChange: (gallery: SarvdevMediaAsset[]) => void }) {
  const update = (index: number, media: SarvdevMediaAsset | null) => onChange(gallery.map((item, itemIndex) => itemIndex === index ? media : item).filter(Boolean) as SarvdevMediaAsset[])
  return <div className="space-y-4 rounded-xl border border-orange-100 bg-orange-50/40 p-4"><div><p className="text-sm font-semibold text-gray-700">Today&apos;s Darshan photos</p><p className="mt-1 text-xs text-gray-500">Upload one or more managed photos. No video or stream is required.</p></div>{gallery.map((media, index) => <div key={`${media.publicId || media.url || index}-${index}`}><ImageUpload value={media.url || ''} media={media} onChange={() => undefined} onMediaChange={(next) => update(index, next)} folder="sarvdev/darshan/gallery" label={`Photo ${index + 1}`} guidance="darshanCard" kind="darshan" /><button type="button" className="mt-2 text-xs font-semibold text-red-600" onClick={() => onChange(gallery.filter((_, itemIndex) => itemIndex !== index))}>Remove photo</button></div>)}<button type="button" className="admin-btn admin-btn-ghost px-3 py-2 text-xs" onClick={() => onChange([...gallery, {} as SarvdevMediaAsset])}>Add photo</button></div>
}
