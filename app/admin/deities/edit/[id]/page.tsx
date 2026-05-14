"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUpload from "../../../../../components/ImageUpload"

type FormState = {
  name: string
  nameHi: string
  description: string
  descriptionHi: string
  mantra: string
  attributes: string
  category: string
  categoryId: string
  imageUrl: string
  images: string[]
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  status: string
}

const categories = [
  "Tridev",
  "Tridevi",
  "Ashta Vasu",
  "Ekadash Rudra",
  "Dwadash Aditya",
  "Navagraha",
  "Other"
]

const i = "admin-input w-full"
const l = "block text-sm font-medium text-gray-600 mb-1"
const e = "mt-1 text-xs text-red-500"

export default function AdminEditDeityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    name: "",
    nameHi: "",
    description: "",
    descriptionHi: "",
    mantra: "",
    attributes: "",
    category: "Other",
    categoryId: "",
    imageUrl: "",
    images: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogImage: "",
    status: "pending"
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
        const response = await fetch('/api/deities')
        const deities = await response.json()
        const deity = deities.find((d: any) => d._id === id)
        
        if (deity) {
          setDeitySlug(deity.slug || "")
          setForm({
            name: deity.name || "",
            nameHi: deity.nameHi || "",
            description: deity.description || "",
            descriptionHi: deity.descriptionHi || "",
            mantra: deity.mantra || "",
            attributes: Array.isArray(deity.attributes) ? deity.attributes.join(', ') : "",
            category: deity.category || "Other",
            categoryId: deity.categoryId || "",
            imageUrl: deity.image || "",
            images: Array.isArray(deity.images) ? deity.images : [],
            metaTitle: deity.metaTitle || "",
            metaDescription: deity.metaDescription || "",
            metaKeywords: deity.metaKeywords || "",
            ogImage: deity.ogImage || "",
            status: deity.status || "pending"
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

  const handleChange = (field: keyof FormState, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const generateAutoSEO = () => {
    const metaTitle = `${form.nameHi} - ${form.name} | Sarvdev Temple`
    const metaDescription = `Learn about ${form.nameHi} (${form.name}). ${form.description || form.descriptionHi || ''}`.substring(0, 160)
    const metaKeywords = `${form.name}, ${form.nameHi}, ${form.category}, Hindu deity, worship, temple`
    
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
      
      // Generate slug from name
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setDeitySlug(slug)

      const payload = {
        id,
        ...form,
        slug,
        attributes: form.attributes.split(',').map(a => a.trim()).filter(a => a),
        images: form.images,
        image: form.imageUrl, // Map imageUrl to image for model
      }

      const res = await fetch('/api/deities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update deity')
      }

      setSuccess("Deity updated successfully!")
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
              <label className={l}>Category</label>
              <select
                className={i}
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={l}>Category ID</label>
              <input
                type="text"
                className={i}
                value={form.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                placeholder="e.g., tridev"
              />
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
              label="Main Image"
              value={form.imageUrl}
              onChange={(url) => handleChange('imageUrl', url)}
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
              onChange={(url) => handleChange('ogImage', url)}
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
