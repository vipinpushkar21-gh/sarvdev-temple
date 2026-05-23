"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BlogForm, { mapBlogToForm, type BlogFormValues } from '../../BlogForm'
import { slugifyBlog } from '../../../../../lib/blog-utils'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [initialValues, setInitialValues] = useState<BlogFormValues | null>(null)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`, { cache: 'no-store' })
        if (!res.ok) {
          alert('Blog not found')
          router.push('/admin/blogs')
          return
        }
        const found = await res.json()
        setInitialValues(mapBlogToForm(found))
      } catch {
        alert('Failed to load blog')
        router.push('/admin/blogs')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id, router])

  const handleSubmit = async (values: BlogFormValues) => {
    setSaving(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...values }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || 'Failed to save changes')
        return
      }
      router.push('/admin/blogs')
    } catch {
      alert('Error saving changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !initialValues) {
    return (
      <div className="max-w-5xl space-y-6 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="admin-card p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-10 bg-gray-100 rounded-lg" />)}
        </div>
      </div>
    )
  }

  const liveSlug = initialValues.slug || slugifyBlog(initialValues.title)

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">Edit Blog Post</h1>
          <p className="admin-section-subtitle truncate max-w-lg text-gray-400">{initialValues.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {liveSlug && (
            <a href={`/blog/${liveSlug}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost px-4 py-2 text-sm text-green-700 border-green-200 hover:bg-green-50">
              View Public
            </a>
          )}
          <Link href="/admin/blogs" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back to Blogs</Link>
        </div>
      </div>

      <BlogForm mode="edit" initialValues={initialValues} onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}
