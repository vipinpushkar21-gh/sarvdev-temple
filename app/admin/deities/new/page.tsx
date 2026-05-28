"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUpload from "../../../../components/ImageUpload"
import { getCategoryOptions } from "../../../../lib/deity-categories"

type FormState = {
  name: string
  nameHi: string
  description: string
  descriptionHi: string
  mantra: string
  attributes: string
  categories: string[]
  imageUrl: string
  imageCard: string
  imageHero: string
  images: string[]
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
}

const i = "admin-input w-full"
const l = "block text-sm font-medium text-gray-600 mb-1"
const e = "mt-1 text-xs text-red-500"

const emptyForm = (): FormState => ({
  name: "",
  nameHi: "",
  description: "",
  descriptionHi: "",
  mantra: "",
  attributes: "",
  categories: [],
  imageUrl: "",
  imageCard: "",
  imageHero: "",
  images: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogImage: ""
})

export default function AdminNewDeityPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(emptyForm())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field: keyof FormState, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Generate slug from name
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      const payload = {
        name: form.name,
        nameHi: form.nameHi,
        description: form.description,
        descriptionHi: form.descriptionHi,
        mantra: form.mantra,
        categories: form.categories,
        slug,
        image: form.imageUrl || form.imageCard || form.imageHero,
        attributes: form.attributes.split(',').map(a => a.trim()).filter(a => a),
        images: form.images,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords,
        ogImage: form.ogImage,
        status: "approved"
      }

      const res = await fetch('/api/deities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to create deity')

      router.push('/admin/deities')
    } catch (err) {
      setError("Failed to create deity. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-container section-sm">
      <div className="mb-8">
        <Link href="/admin/deities" className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block">
          ← Back to Deities
        </Link>
        <h1 className="text-display-sm font-serif text-secondary-800">Add New Deity</h1>
        <p className="text-body text-ink-muted mt-1">Create a new deity profile</p>
      </div>

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
                {getCategoryOptions(false).map(cat => (
                  <option key={cat.id} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple categories</p>
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
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 md:p-8">
          <h2 className="text-h3 font-serif text-secondary-800 mb-6">Images</h2>
          
          <div className="space-y-6">
            <ImageUpload
              label="Card Image"
              value={form.imageCard}
              onChange={(url) => handleChange('imageCard', url)}
              folder="sarvdev/deities/cards"
              guidance="card"
            />

            <ImageUpload
              label="Hero Image"
              value={form.imageHero}
              onChange={(url) => handleChange('imageHero', url)}
              folder="sarvdev/deities/heroes"
              guidance="hero"
            />

            <ImageUpload
              label="Legacy Main Image"
              value={form.imageUrl}
              onChange={(url) => handleChange('imageUrl', url)}
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
          <h2 className="text-h3 font-serif text-secondary-800 mb-6">SEO</h2>
          
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
              onChange={(url) => handleChange('ogImage', url)}
            />
          </div>
        </div>

        {error && <p className={e}>{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Deity'}
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
