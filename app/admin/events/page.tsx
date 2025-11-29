"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type EventRow = {
  _id: string
  title: string
  temple: string
  date?: string
  location?: string
  image?: string
  status?: 'approved' | 'pending' | 'rejected'
}

export default function AdminEventsPage() {
  const [rows, setRows] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [templeFilter, setTempleFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  useEffect(() => {
    fetchEvents()
  }, [])
  
  async function fetchEvents() {
    try {
      const res = await fetch('/api/events')
      if (res.ok) {
        const data = await res.json()
        setRows(data)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
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
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x))
      }
    } catch (error) {
      alert('Failed to approve event')
    }
  }
  
  const reject = async (id: string) => {
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x))
      }
    } catch (error) {
      alert('Failed to reject event')
    }
  }
  
  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      const res = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setRows(r => r.filter(x => x._id !== id))
      }
    } catch (error) {
      alert('Failed to delete event')
    }
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8">Loading events...</div>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Events</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="px-3 py-2 bg-slate-200 rounded-md">Back</Link>
          <Link href="/admin/events/new" className="px-3 py-2 bg-emerald-600 text-white rounded-md">New Event</Link>
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

      <div className="overflow-x-auto bg-white/60 dark:bg-slate-900/60 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3">{r.title}</td>
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">No events match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
