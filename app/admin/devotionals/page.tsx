"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  language?: string
  deity?: string
  audio?: string
  artist?: string
  duration?: string
  status?: 'approved' | 'pending' | 'rejected'
}

export default function AdminDevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchDevotionals()
  }, [])

  async function fetchDevotionals() {
    try {
      const res = await fetch('/api/devotionals')
      if (res.ok) {
        const data = await res.json()
        setDevotionals(data)
      }
    } catch (error) {
      console.error('Failed to fetch devotionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = devotionals.filter(d => {
    if (categoryFilter && d.category !== categoryFilter) return false
    return true
  })

  const categories = Array.from(new Set(devotionals.map(d => d.category).filter(Boolean)))

  const approve = async (id: string) => {
    try {
      const res = await fetch('/api/devotionals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      })
      if (res.ok) {
        setDevotionals(d => d.map(x => x._id === id ? { ...x, status: 'approved' } : x))
      }
    } catch (error) {
      alert('Failed to approve devotional')
    }
  }

  const reject = async (id: string) => {
    try {
      const res = await fetch('/api/devotionals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      })
      if (res.ok) {
        setDevotionals(d => d.map(x => x._id === id ? { ...x, status: 'rejected' } : x))
      }
    } catch (error) {
      alert('Failed to reject devotional')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this devotional?')) return
    try {
      const res = await fetch('/api/devotionals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setDevotionals(d => d.filter(x => x._id !== id))
      }
    } catch (error) {
      alert('Failed to delete devotional')
    }
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8">Loading devotionals...</div>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Devotionals</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="px-3 py-2 bg-slate-200 rounded-md">Back</Link>
          <Link href="/admin/devotionals/new" className="px-3 py-2 bg-emerald-600 text-white rounded-md">New Devotional</Link>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-md mb-6">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-md border p-2">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto bg-white/60 dark:bg-slate-900/60 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Deity</th>
              <th className="px-4 py-3">Artist</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d._id} className="border-t">
                <td className="px-4 py-3">{d.title}</td>
                <td className="px-4 py-3">{d.category}</td>
                <td className="px-4 py-3">{d.deity}</td>
                <td className="px-4 py-3">{d.artist}</td>
                <td className="px-4 py-3">{d.duration}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    d.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 
                    d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {d.audio && (
                      <a href={d.audio} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200">
                        Play
                      </a>
                    )}
                    <Link href={`/admin/devotionals/edit/${d._id}`} className="px-2 py-1 bg-slate-200 rounded-md text-sm hover:bg-slate-300">Edit</Link>
                    <button onClick={() => approve(d._id)} className="px-2 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700">Approve</button>
                    <button onClick={() => reject(d._id)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-sm hover:bg-rose-700">Reject</button>
                    <button onClick={() => remove(d._id)} className="px-2 py-1 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">No devotionals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
