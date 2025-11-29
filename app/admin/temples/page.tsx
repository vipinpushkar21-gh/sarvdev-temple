"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type TempleRow = {
  _id: string
  title: string
  deity?: string
  state?: string
  type?: string
  location?: string
  status?: 'approved' | 'pending' | 'rejected'
}

export default function AdminTemplesPage() {
  const [rows, setRows] = useState<TempleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deityFilter, setDeityFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  
  useEffect(() => {
    fetchTemples()
  }, [])
  
  async function fetchTemples() {
    try {
      const res = await fetch('/api/temples')
      if (res.ok) {
        const data = await res.json()
        setRows(data)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    } finally {
      setLoading(false)
    }
  }

  const deities = useMemo(() => Array.from(new Set(rows.map(r => r.deity).filter(Boolean))), [rows])
  const states = useMemo(() => Array.from(new Set(rows.map(r => r.state).filter(Boolean))), [rows])
  const types = useMemo(() => Array.from(new Set(rows.map(r => r.type).filter(Boolean))), [rows])

  const filtered = rows.filter(r => {
    if (deityFilter && r.deity !== deityFilter) return false
    if (stateFilter && r.state !== stateFilter) return false
    if (typeFilter && r.type !== typeFilter) return false
    return true
  })

  const approve = async (id: string) => {
    try {
      const res = await fetch('/api/temples', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x))
      }
    } catch (error) {
      alert('Failed to approve temple')
    }
  }
  
  const reject = async (id: string) => {
    try {
      const res = await fetch('/api/temples', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      })
      if (res.ok) {
        setRows(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x))
      }
    } catch (error) {
      alert('Failed to reject temple')
    }
  }
  
  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this temple?')) return
    try {
      const res = await fetch('/api/temples', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setRows(r => r.filter(x => x._id !== id))
      }
    } catch (error) {
      alert('Failed to delete temple')
    }
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8">Loading temples...</div>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Temples</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="px-3 py-2 bg-slate-200 rounded-md">Back</Link>
          <Link href="/admin/temples/new" className="px-3 py-2 bg-emerald-600 text-white rounded-md">New Temple</Link>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select value={deityFilter} onChange={(e) => setDeityFilter(e.target.value)} className="rounded-md border p-2">
            <option value="">Filter by Deity</option>
            {deities.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-md border p-2">
            <option value="">Filter by State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-md border p-2">
            <option value="">Filter by Type</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/60 dark:bg-slate-900/60 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Deity</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.location}</td>
                <td className="px-4 py-3">{r.deity}</td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-rose-100 text-rose-800'}`}>
                    {r.status}
                  </span>
                </td>
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
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">No temples match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
