"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type DarshanRow = {
  _id: string
  title: string
  temple: string
  media?: string
  time?: string
  date?: string
  status?: 'approved' | 'pending' | 'rejected'
}

export default function AdminDarshanPage() {
  const [rows, setRows] = useState<DarshanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [templeFilter, setTempleFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  useEffect(() => {
    fetchDarshans()
  }, [])
  
  async function fetchDarshans() {
    try {
      const res = await fetch('/api/darshan')
      if (res.ok) {
        const data = await res.json()
        setRows(data)
      }
    } catch (error) {
      console.error('Failed to fetch darshans:', error)
    } finally {
      setLoading(false)
    }
  }

  const temples = useMemo(() => Array.from(new Set(rows.map(r => r.temple).filter(Boolean))), [rows])

  const filtered = rows.filter(r => {
    if (templeFilter && r.temple !== templeFilter) return false
    if (dateFilter && r.date !== dateFilter) return false
    return true
  })

  const approve = async (id: string) => {
    try {
      const res = await fetch('/api/darshan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x))
      }
    } catch (error) {
      alert('Failed to approve darshan')
    }
  }
  
  const reject = async (id: string) => {
    try {
      const res = await fetch('/api/darshan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x))
      }
    } catch (error) {
      alert('Failed to reject darshan')
    }
  }
  
  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this darshan?')) return
    try {
      const res = await fetch('/api/darshan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setRows(r => r.filter(x => x._id !== id))
      }
    } catch (error) {
      alert('Failed to delete darshan')
    }
  }

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8">Loading darshans...</div>

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Daily Darshan Submissions</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="px-3 py-2 bg-slate-200 rounded-md">Back</Link>
          <Link href="/admin/darshan/new" className="px-3 py-2 bg-emerald-600 text-white rounded-md">New Darshan</Link>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select value={templeFilter} onChange={(e) => setTempleFilter(e.target.value)} className="rounded-md border p-2">
            <option value="">Filter by Temple</option>
            {temples.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-md border p-2" />
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Temple</th>
              <th className="px-4 py-3">Media URL</th>
              <th className="px-4 py-3">Timing</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.temple}</td>
                <td className="px-4 py-3">{r.media || <span className="text-slate-400">(none)</span>}</td>
                <td className="px-4 py-3">{r.time}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-slate-200 rounded-md text-sm">View</button>
                    <button className="px-2 py-1 bg-slate-200 rounded-md text-sm">Edit</button>
                    <button onClick={() => approve(r._id)} className="px-2 py-1 bg-emerald-600 text-white rounded-md text-sm">Approve</button>
                    <button onClick={() => reject(r._id)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-sm">Reject</button>
                    <button onClick={() => remove(r._id)} className="px-2 py-1 bg-slate-700 text-white rounded-md text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">No darshan submissions match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
