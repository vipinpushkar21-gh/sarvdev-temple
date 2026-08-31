"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUpload from "../../../../../components/ImageUpload"
import { getCategoryOptions, resolveCanonicalCategoryId } from "../../../../../lib/deity-categories"
import { compactText } from "../../../../../lib/text-formatting"
import type { SarvdevMediaAsset } from "../../../../../lib/media-asset"

type FormState = {
  name: string
  nameHi: string
  slug: string
  staticSlug: string
  order: string
  description: string
  descriptionHi: string
  mantra: string
  attributes: string
  aliases: string
  slugAliases: string
  categories: string[]
  imageUrl: string
  primaryMedia: SarvdevMediaAsset | null
  imageCard: string
  cardMedia: SarvdevMediaAsset | null
  imageHero: string
  heroMedia: SarvdevMediaAsset | null
  images: string[]
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  ogMedia: SarvdevMediaAsset | null
  status: string
  source: string
}

const i = "admin-input w-full"
const l = "block text-sm font-medium text-gray-600 mb-1"
const e = "mt-1 text-xs text-red-500"

const BASE_CATEGORY_OPTIONS = getCategoryOptions(false)

function normalizeSelectedCategories(values: unknown[]) {
  return Array.from(new Set(
    values
      .map(value => String(value || '').trim())
      .filter(Boolean)
      .map(value => resolveCanonicalCategoryId(value) || value)
  ))
}

export default function AdminEditDeityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    name: "",
    nameHi: "",
    slug: "",
    staticSlug: "",
    order: "0",
    description: "",
    descriptionHi: "",
    mantra: "",
    attributes: "",
    aliases: "",
    slugAliases: "",
    categories: [],
    imageUrl: "",
    primaryMedia: null,
    imageCard: "",
    cardMedia: null,
    imageHero: "",
    heroMedia: null,
    images: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogImage: "",
    ogMedia: null,
    status: "pending",
    source: "manual"
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deitySlug, setDeitySlug] = useState("")

  useEffect(() => {
    async function fetchDeity() {
      try {
        const { id } = await params
        const response = await fetch(`/api/deities?admin=1&id=${encodeURIComponent(id)}`, { credentials: 'include', cache: 'no-store' })
        if (!response.ok) throw new Error("Deity not found")
        const deity = await response.json()

        if (deity) {
          setDeitySlug(deity.slug || "")

          // Support both new multi-category and legacy single-category fields
          let selectedCategories: string[] = []
          
          if (Array.isArray(deity.categories) && deity.categories.length > 0) {
            selectedCategories = deity.categories
          } else if (Array.isArray(deity.categoryIds) && deity.categoryIds.length > 0) {
            selectedCategories = deity.categoryIds
          } else if (deity.category) {
            selectedCategories = [deity.category]
          } else if (deity.categoryId) {
            selectedCategories = [deity.categoryId]
          }

          selectedCategories = normalizeSelectedCategories(selectedCategories)

          setForm({
            name: deity.name || "",
            nameHi: deity.nameHi || "",
            slug: deity.slug || "",
            staticSlug: deity.staticSlug || "",
            order: String(deity.order ?? 0),
            description: deity.description || "",
            descriptionHi: deity.descriptionHi || "",
            mantra: deity.mantra || "",
            attributes: Array.isArray(deity.attributes) ? deity.attributes.join(', ') : "",
            aliases: Array.isArray(deity.aliases) ? deity.aliases.join(', ') : "",
            slugAliases: Array.isArray(deity.slugAliases) ? deity.slugAliases.join(', ') : "",
            categories: selectedCategories,
            imageUrl: deity.image || "",
            primaryMedia: deity.primaryMedia || null,
            imageCard: deity.imageCard || "",
            cardMedia: deity.cardMedia || null,
            imageHero: deity.imageHero || "",
            heroMedia: deity.heroMedia || null,
            images: Array.isArray(deity.images) ? deity.images : [],
            metaTitle: deity.metaTitle || "",
            metaDescription: deity.metaDescription || "",
            metaKeywords: deity.metaKeywords || "",
            ogImage: deity.ogImage || "",
            ogMedia: deity.ogMedia || null,
            status: ['pending', 'approved', 'rejected'].includes(deity.status) ? deity.status : "approved",
            source: deity.source || "manual"
          })
        }
      } catch (err) {
        setError("Failed to load deity")
      } finally {
        setLoading(false)
      }
    }

    fetchDeity()
  }, [params])

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const categoryOptions = useMemo(() => {
    const knownValues = new Set(BASE_CATEGORY_OPTIONS.map(option => option.value))
    const legacyOptions = form.categories
      .filter(value => value && !knownValues.has(value))
      .map(value => ({
        id: `legacy-${value}`,
        value,
        label: `Existing/Legacy: ${value}`,
      }))

    return [...BASE_CATEGORY_OPTIONS, ...legacyOptions]
  }, [form.categories])

  const generateAutoSEO = () => {
    const metaTitle = `${form.nameHi} - ${form.name} | Sarvdev Temple`
    const metaDescription = compactText(`Learn about ${form.nameHi} (${form.name}). ${form.description || form.descriptionHi || ''}`).substring(0, 160)
    const metaKeywords = `${form.name}, ${form.nameHi}, ${form.categories.join(', ')}, Hindu deity, worship, temple`
    
    setForm(prev => ({
      ...prev,
      metaTitle,
      metaDescription,
      metaKeywords,
    }))
    setSuccess("SEO metadata auto-generated!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const { id } = await params

      const payload = {
        id,
        name: form.name,
        nameHi: form.nameHi,
        slug: form.slug,
        staticSlug: form.staticSlug,
        order: Number(form.order) || 0,
        description: form.description,
        descriptionHi: form.descriptionHi,
        mantra: form.mantra,
        aliases: form.aliases.split(',').map(value => value.trim()).filter(Boolean),
        slugAliases: form.slugAliases.split(',').map(value => value.trim()).filter(Boolean),
        categories: form.categories,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords,
        ogImage: form.ogImage,
        ogMedia: form.ogMedia,
        status: form.status,
        attributes: form.attributes.split(',').map(a => a.trim()).filter(a => a),
        images: form.images,
        image: form.imageUrl,
        primaryMedia: form.primaryMedia,
        imageCard: form.imageCard,
        cardMedia: form.cardMedia,
        imageHero: form.imageHero,
        heroMedia: form.heroMedia,
        allowSlugChange: true,
      }

      const res = await fetch('/api/deities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to update deity')
      }

      setSuccess("Deity updated successfully!")
      setDeitySlug(data.slug || deitySlug)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || "Failed to update deity. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-container section-sm">
        <div className="text-center py-20">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container section-sm">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/admin/deities" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Deities
          </Link>
          {deitySlug && (
            <Link
              href={`/deities/${deitySlug}`}
              target="_blank"
              className="btn-secondary px-6 py-2 rounded-lg font-medium"
            >
              View Page
            </Link>
          )}
        </div>
        <h1 className="text-display-sm font-serif text-secondary-800">Edit Deity</h1>
        <p className="text-body text-ink-muted mt-1">Update deity profile</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card p-6 md:p-8">
          <h2 className="text-h3 font-serif text-secondary-800 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={l}>Deity Name (English) *</label>
              <input
                type="text"
                className={i}
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="e.g., Shiva"
              />
            </div>

            <div>
              <label className={l}>Deity Name (Hindi) *</label>
              <input
                type="text"
                className={i}
                value={form.nameHi}
                onChange={(e) => handleChange('nameHi', e.target.value)}
                required
                placeholder="e.g., शिव"
              />
            </div>

            <div>
              <label className={l}>Public Slug</label>
              <input type="text" className={i} value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} />
            </div>

            <div>
              <label className={l}>Static Slug</label>
              <input type="text" className={i} value={form.staticSlug} onChange={(e) => handleChange('staticSlug', e.target.value)} />
            </div>

            <div>
              <label className={l}>Categories (Multiple Select)</label>
              <select
                multiple
                className={i}
                value={form.categories}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value)
                  handleChange('categories', selected)
                }}
                required
              >
                {categoryOptions.map(cat => (
                  <option key={cat.id} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple categories</p>
            </div>

            <div>
              <label className={l}>Status</label>
              <select
                className={i}
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className={l}>Display Order</label>
              <input type="number" className={i} value={form.order} onChange={(e) => handleChange('order', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6 md:p-8">
          <h2 className="text-h3 font-serif text-secondary-800 mb-6">Description</h2>
          
          <div className="space-y-6">
            <div>
              <label className={l}>Description (English)</label>
              <textarea
                className={i}
                rows={4}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Detailed description in English"
              />
              <p className="mt-2 text-xs text-gray-500">Press Enter twice for a new paragraph.</p>
            </div>

            <div>
              <label className={l}>Description (Hindi)</label>
              <textarea
                className={i}
                rows={4}
                value={form.descriptionHi}
                onChange={(e) => handleChange('descriptionHi', e.target.value)}
                placeholder="विस्तृत विवरण हिंदी में"
              />
              <p className="mt-2 text-xs text-gray-500">Press Enter twice for a new paragraph.</p>
            </div>
          </div>
        </div>

        {/* Attributes & Mantra */}
        <div className="card p-6 md:p-8">
          <h2 className="text-h3 font-serif text-secondary-800 mb-6">Attributes & Mantra</h2>
          
          <div className="space-y-6">
            <div>
              <label className={l}>Mantra</label>
              <textarea
                className={i}
                rows={2}
                value={form.mantra}
                onChange={(e) => handleChange('mantra', e.target.value)}
                placeholder="e.g., ॐ नमः शिवाय"
              />
            </div>

            <div>
              <label className={l}>Attributes (comma-separated)</label>
              <input
                type="text"
                className={i}
                value={form.attributes}
                onChange={(e) => handleChange('attributes', e.target.value)}
                placeholder="e.g., Destroyer, Trishul, Third Eye, Mount Kailash"
              />
            </div>

            <div>
              <label className={l}>Aliases (comma-separated)</label>
              <input type="text" className={i} value={form.aliases} onChange={(e) => handleChange('aliases', e.target.value)} placeholder="e.g., Mahadev, Bholenath" />
            </div>

            <div>
              <label className={l}>Slug Aliases (comma-separated)</label>
              <input type="text" className={i} value={form.slugAliases} onChange={(e) => handleChange('slugAliases', e.target.value)} placeholder="e.g., mahadev, bholenath" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 md:p-8">
          <h2 className="text-h3 font-serif text-secondary-800 mb-6">Images</h2>
          
          <div className="space-y-6">
            <ImageUpload
              label="Card Image"
              value={form.imageCard}
              media={form.cardMedia}
              onChange={(url) => handleChange('imageCard', url)}
              onMediaChange={(media) => handleChange('cardMedia', media)}
              kind="deity-artwork"
              folder="sarvdev/deities/cards"
              guidance="card"
            />

            <ImageUpload
              label="Hero Image"
              value={form.imageHero}
              media={form.heroMedia}
              onChange={(url) => handleChange('imageHero', url)}
              onMediaChange={(media) => handleChange('heroMedia', media)}
              kind="deity-artwork"
              folder="sarvdev/deities/heroes"
              guidance="hero"
            />

            <ImageUpload
              label="Legacy Main Image"
              value={form.imageUrl}
              media={form.primaryMedia}
              onChange={(url) => handleChange('imageUrl', url)}
              onMediaChange={(media) => handleChange('primaryMedia', media)}
              kind="deity-artwork"
              folder="sarvdev/deities"
            />

            <div>
              <label className={l}>Additional Images (comma-separated URLs)</label>
              <textarea
                className={i}
                rows={3}
                value={form.images.join(', ')}
                onChange={(e) => handleChange('images', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="Image URLs separated by commas"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 font-serif text-secondary-800">SEO</h2>
            <button
              type="button"
              onClick={generateAutoSEO}
              className="text-sm px-4 py-2 rounded-lg font-medium border border-primary-200 text-primary-700 hover:bg-primary-50"
            >
              Auto Generate SEO
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className={l}>Meta Title</label>
              <input
                type="text"
                className={i}
                value={form.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                placeholder="SEO title"
              />
            </div>

            <div>
              <label className={l}>Meta Description</label>
              <textarea
                className={i}
                rows={2}
                value={form.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="SEO description"
              />
            </div>

            <div>
              <label className={l}>Meta Keywords</label>
              <input
                type="text"
                className={i}
                value={form.metaKeywords}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                placeholder="Keywords separated by commas"
              />
            </div>

            <ImageUpload
              label="OG Image"
              value={form.ogImage}
              media={form.ogMedia}
              onChange={(url) => handleChange('ogImage', url)}
              onMediaChange={(media) => handleChange('ogMedia', media)}
              folder="sarvdev/deities"
              kind="deity-artwork"
            />
          </div>
        </div>

        {error && <p className={e}>{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/deities"
            className="btn-secondary px-8 py-3 rounded-lg font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
