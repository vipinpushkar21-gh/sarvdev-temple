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

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-300">Loading devotionals...</div>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Devotionals Management</h1>
        <div className="flex gap-3">
          <Link href="/admin" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors">Back</Link>
          <Link href="/admin/devotionals/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">New Devotional</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Deity</th>
              <th className="px-6 py-4 font-semibold">Artist</th>
              <th className="px-6 py-4 font-semibold">Duration</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d._id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{d.title}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{d.category}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{d.deity}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{d.artist}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{d.duration}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    d.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    d.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {d.audio && (
                      <a href={d.audio} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Play
                      </a>
                    )}
                    <Link href={`/admin/devotionals/edit/${d._id}`} className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">Edit</Link>
                    <button onClick={() => approve(d._id)} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">Approve</button>
                    <button onClick={() => reject(d._id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Reject</button>
                    <button onClick={() => remove(d._id)} className="px-3 py-1 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No devotionals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
