"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

type BlogRow = {
  _id: string
  title: string
  excerpt?: string
  date?: string
  status?: 'approved' | 'pending' | 'rejected'
}

export default function AdminBlogsPage() {
  const [rows, setRows] = useState<BlogRow[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchBlogs()
  }, [])
  
  async function fetchBlogs() {
    try {
      const res = await fetch('/api/blogs')
      if (res.ok) {
        const data = await res.json()
        setRows(data)
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id: string) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x))
      }
    } catch (error) {
      alert('Failed to approve blog')
    }
  }
  
  const reject = async (id: string) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x))
      }
    } catch (error) {
      alert('Failed to reject blog')
    }
  }
  
  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    try {
      const res = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setRows(r => r.filter(x => x._id !== id))
      }
    } catch (error) {
      alert('Failed to delete blog')
    }
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8">Loading blogs...</div>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="px-3 py-2 bg-slate-200 rounded-md">Back</Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/60 dark:bg-slate-900/60 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Excerpt</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.excerpt?.slice(0, 60)}...</td>
                <td className="px-4 py-3">{r.date ? new Date(r.date).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-rose-100 text-rose-800'}`}>
                    {r.status || 'pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => approve(r._id)} className="px-2 py-1 bg-emerald-600 text-white rounded-md text-sm">Approve</button>
                    <button onClick={() => reject(r._id)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-sm">Reject</button>
                    <button onClick={() => remove(r._id)} className="px-2 py-1 bg-slate-700 text-white rounded-md text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">No blog posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
