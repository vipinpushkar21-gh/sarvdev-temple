"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import ImageUpload from '../../../components/ImageUpload'
import { calculateReadingTime, listToCsv, slugifyBlog } from '../../../lib/blog-utils'
import type { SarvdevMediaAsset } from '../../../lib/media-asset'

export type BlogFormValues = {
  title: string
  titleHi: string
  slug: string
  excerpt: string
  excerptHi: string
  content: string
  contentHi: string
  category: string
  tags: string
  author: string
  authorRole: string
  image: string
  primaryMedia: SarvdevMediaAsset | null
  imageCard: string
  cardMedia: SarvdevMediaAsset | null
  imageHero: string
  heroMedia: SarvdevMediaAsset | null
  ogImage: string
  ogMedia: SarvdevMediaAsset | null
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  date: string
  readingTime: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  canonicalUrl: string
  relatedTempleSlugs: string
  relatedDeitySlugs: string
  relatedDevotionalSlugs: string
  imagePrompt: string
}

export const DEFAULT_BLOG_FORM: BlogFormValues = {
  title: '',
  titleHi: '',
  slug: '',
  excerpt: '',
  excerptHi: '',
  content: '',
  contentHi: '',
  category: 'Spiritual Knowledge',
  tags: '',
  author: 'Sarvdev Editorial',
  authorRole: 'Editorial Team',
  image: '',
  primaryMedia: null,
  imageCard: '',
  cardMedia: null,
  imageHero: '',
  heroMedia: null,
  ogImage: '',
  ogMedia: null,
  featured: false,
  status: 'draft',
  date: new Date().toISOString().slice(0, 10),
  readingTime: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  canonicalUrl: '',
  relatedTempleSlugs: '',
  relatedDeitySlugs: '',
  relatedDevotionalSlugs: '',
  imagePrompt: '',
}

export function mapBlogToForm(blog: any): BlogFormValues {
  return {
    ...DEFAULT_BLOG_FORM,
    title: blog.title || '',
    titleHi: blog.titleHi || '',
    slug: blog.slug || '',
    excerpt: blog.excerpt || '',
    excerptHi: blog.excerptHi || '',
    content: blog.content || blog.body || '',
    contentHi: blog.contentHi || '',
    category: blog.category || DEFAULT_BLOG_FORM.category,
    tags: listToCsv(blog.tags),
    author: blog.author || DEFAULT_BLOG_FORM.author,
    authorRole: blog.authorRole || DEFAULT_BLOG_FORM.authorRole,
    image: blog.image || '',
    primaryMedia: blog.primaryMedia || null,
    imageCard: blog.imageCard || '',
    cardMedia: blog.cardMedia || null,
    imageHero: blog.imageHero || '',
    heroMedia: blog.heroMedia || null,
    ogImage: blog.ogImage || '',
    ogMedia: blog.ogMedia || null,
    featured: Boolean(blog.featured),
    status: blog.status === 'approved' ? 'published' : blog.status === 'rejected' ? 'archived' : blog.status === 'pending' ? 'draft' : blog.status || 'draft',
    date: blog.date ? String(blog.date).slice(0, 10) : blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 10) : '',
    readingTime: blog.readingTime ? String(blog.readingTime) : '',
    metaTitle: blog.metaTitle || '',
    metaDescription: blog.metaDescription || '',
    metaKeywords: listToCsv(blog.metaKeywords),
    canonicalUrl: blog.canonicalUrl || '',
    relatedTempleSlugs: listToCsv(blog.relatedTempleSlugs),
    relatedDeitySlugs: listToCsv(blog.relatedDeitySlugs),
    relatedDevotionalSlugs: listToCsv(blog.relatedDevotionalSlugs),
    imagePrompt: blog.imagePrompt || '',
  }
}

type Props = {
  mode: 'create' | 'edit'
  initialValues?: BlogFormValues
  onSubmit: (values: BlogFormValues) => Promise<void>
  saving?: boolean
}

const categories = [
  'Spiritual Knowledge',
  'Temple Traditions',
  'Temple Guides',
  'Daily Practice',
  'Worship',
  'Panchang',
  'Festivals',
  'Vrat and Festivals',
  'Deity Guides',
  'Sacred Places',
  'Mantras',
  'Pilgrimage',
  'Home Worship',
  'Sacred Traditions',
]

export default function BlogForm({ mode, initialValues = DEFAULT_BLOG_FORM, onSubmit, saving = false }: Props) {
  const [form, setForm] = useState<BlogFormValues>(initialValues)
  const autoReadingTime = useMemo(() => calculateReadingTime([form.title, form.excerpt, form.content, form.contentHi].join(' ')), [form.title, form.excerpt, form.content, form.contentHi])

  const setField = <K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'title' && !prev.slug) next.slug = slugifyBlog(value)
      return next
    })
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit({
      ...form,
      slug: form.slug || slugifyBlog(form.title),
      readingTime: form.readingTime || String(autoReadingTime),
      image: form.image || form.imageCard || form.imageHero || form.ogImage,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Basic Info">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title *"><input name="title" value={form.title} onChange={handleTextChange} required className="admin-input w-full" placeholder="Meaning of Om in Sanatan Dharma" /></Field>
          <Field label="Hindi Title"><input name="titleHi" value={form.titleHi} onChange={handleTextChange} className="admin-input w-full" placeholder="सनातन धर्म में ॐ का अर्थ" /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <Field label="Slug"><input name="slug" value={form.slug} onChange={handleTextChange} className="admin-input w-full" placeholder="meaning-of-om-in-sanatan-dharma" /></Field>
          <button type="button" onClick={() => setField('slug', slugifyBlog(form.title))} className="admin-btn admin-btn-ghost self-end px-4 py-2.5 text-sm">Regenerate</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Category">
            <select name="category" value={form.category} onChange={handleTextChange} className="admin-input w-full">
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Tags"><input name="tags" value={form.tags} onChange={handleTextChange} className="admin-input w-full" placeholder="Om, mantra, meditation" /></Field>
          <Field label="Author"><input name="author" value={form.author} onChange={handleTextChange} className="admin-input w-full" /></Field>
          <Field label="Author Role"><input name="authorRole" value={form.authorRole} onChange={handleTextChange} className="admin-input w-full" placeholder="Editorial Team" /></Field>
        </div>
      </Section>

      <Section title="Excerpt">
        <Field label="English Excerpt"><textarea name="excerpt" value={form.excerpt} onChange={handleTextChange} rows={3} className="admin-input w-full" placeholder="Short summary shown in cards and SEO snippets..." /></Field>
        <Field label="Hindi Excerpt"><textarea name="excerptHi" value={form.excerptHi} onChange={handleTextChange} rows={3} className="admin-input w-full font-devanagari" placeholder="हिंदी सारांश..." /></Field>
      </Section>

      <Section title="Content">
        <Field label="English Content">
          <textarea name="content" value={form.content} onChange={handleTextChange} rows={18} className="admin-input w-full font-mono text-sm" placeholder="Markdown-style content. Use ## headings, ### subheadings, > quote blocks, and - list items." />
        </Field>
        <Field label="Hindi Content / Summary">
          <textarea name="contentHi" value={form.contentHi} onChange={handleTextChange} rows={8} className="admin-input w-full font-devanagari text-sm" placeholder="Short Hindi summary or full Hindi article..." />
        </Field>
      </Section>

      <Section title="Images">
        <div className="grid gap-5 lg:grid-cols-3">
          <ImageUpload value={form.imageCard} media={form.cardMedia} onChange={(url) => setForm((prev) => ({ ...prev, imageCard: url, image: prev.image === prev.imageCard ? url : prev.image || url }))} onMediaChange={(media) => setField('cardMedia', media)} folder="sarvdev/blogs" label="Card Image" guidance="blogCard" kind="blog-photo" />
          <ImageUpload value={form.imageHero} media={form.heroMedia} onChange={(url) => setForm((prev) => ({ ...prev, imageHero: url, image: prev.image || url }))} onMediaChange={(media) => setField('heroMedia', media)} folder="sarvdev/blogs" label="Hero Image" guidance="blogHero" kind="blog-photo" />
          <ImageUpload value={form.ogImage} media={form.ogMedia} onChange={(url) => setField('ogImage', url)} onMediaChange={(media) => setField('ogMedia', media)} folder="sarvdev/blogs" label="OG Image" guidance="blogOg" kind="blog-photo" />
        </div>
        <Field label="Image Prompt Suggestion"><textarea name="imagePrompt" value={form.imagePrompt} onChange={handleTextChange} rows={2} className="admin-input w-full" placeholder="Optional prompt for future AI image generation..." /></Field>
      </Section>

      <Section title="Related Content">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Related Temple Slugs"><input name="relatedTempleSlugs" value={form.relatedTempleSlugs} onChange={handleTextChange} className="admin-input w-full" placeholder="kashi-vishwanath, somnath" /></Field>
          <Field label="Related Deity Slugs"><input name="relatedDeitySlugs" value={form.relatedDeitySlugs} onChange={handleTextChange} className="admin-input w-full" placeholder="shiva, hanuman" /></Field>
          <Field label="Related Devotional Slugs"><input name="relatedDevotionalSlugs" value={form.relatedDevotionalSlugs} onChange={handleTextChange} className="admin-input w-full" placeholder="shiv-chalisa, hanuman-aarti" /></Field>
        </div>
      </Section>

      <Section title="SEO">
        <Field label="Meta Title"><input name="metaTitle" value={form.metaTitle} onChange={handleTextChange} maxLength={70} className="admin-input w-full" placeholder="Custom title for search engines..." /></Field>
        <Field label="Meta Description"><textarea name="metaDescription" value={form.metaDescription} onChange={handleTextChange} rows={3} maxLength={170} className="admin-input w-full" placeholder="Brief description shown in search results..." /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Meta Keywords"><input name="metaKeywords" value={form.metaKeywords} onChange={handleTextChange} className="admin-input w-full" placeholder="temple, spirituality, hindi" /></Field>
          <Field label="Canonical URL"><input name="canonicalUrl" value={form.canonicalUrl} onChange={handleTextChange} className="admin-input w-full" placeholder="Optional canonical URL" /></Field>
        </div>
      </Section>

      <Section title="Publishing">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Status">
            <select name="status" value={form.status} onChange={handleTextChange} className="admin-input w-full">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Published Date"><input type="date" name="date" value={form.date} onChange={handleTextChange} className="admin-input w-full" /></Field>
          <Field label="Reading Time"><input name="readingTime" value={form.readingTime} onChange={handleTextChange} className="admin-input w-full" placeholder={`${autoReadingTime}`} /></Field>
          <label className="flex items-end gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
            <input type="checkbox" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} />
            Featured
          </label>
        </div>
        <p className="text-xs font-semibold text-gray-400">Auto reading time: {autoReadingTime} min. Draft posts remain hidden from public blog pages.</p>
      </Section>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
          {saving ? 'Saving...' : mode === 'create' ? 'Create Blog' : 'Save Blog'}
        </button>
        <Link href="/admin/blogs" className="admin-btn admin-btn-ghost px-6 py-2.5 text-sm">Cancel</Link>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-card p-6 space-y-5">
      <h2 className="admin-section-title">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-600">{label}</span>
      {children}
    </label>
  )
}
