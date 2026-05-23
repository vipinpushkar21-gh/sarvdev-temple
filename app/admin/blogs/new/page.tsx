"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BlogForm, { DEFAULT_BLOG_FORM, type BlogFormValues } from '../BlogForm'

export default function NewBlogPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (values: BlogFormValues) => {
    setSaving(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || 'Failed to create blog post')
        return
      }
      router.push('/admin/blogs')
    } catch {
      alert('Error creating blog post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="admin-page-title">New Blog Post</h1>
          <p className="admin-section-subtitle">Create a premium Sarvdev editorial article.</p>
        </div>
        <Link href="/admin/blogs" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back to Blogs</Link>
      </div>

      <BlogForm mode="create" initialValues={DEFAULT_BLOG_FORM} onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}
