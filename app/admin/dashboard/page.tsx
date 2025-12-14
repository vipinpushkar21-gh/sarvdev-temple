'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type PendingTemple = {
  id: string
  title: string
  description: string
  image?: string
  location?: string
  timings?: string
  contact?: string
}

type PendingStorage = { temples: PendingTemple[]; darshans: any[]; events: any[] }

const STORAGE_KEY = 'sarvdev_admin_pending_v1'

export default function AdminDashboardPage() {
  const [pending, setPending] = useState<PendingStorage>({ temples: [], darshans: [], events: [] })
  const [visitorStats, setVisitorStats] = useState({ total: 0, today: 0 })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: PendingStorage = JSON.parse(raw)
        setPending({ temples: parsed.temples || [], darshans: parsed.darshans || [], events: parsed.events || [] })
      }
    } catch (e) {
      // ignore
    }

    // Fetch visitor stats
    fetch('/api/visitors')
      .then(res => res.json())
      .then(data => setVisitorStats(data))
      .catch(err => console.error('Failed to fetch visitor stats:', err))
  }, [])

  const approveTemple = (id: string) => {
    setPending((p) => {
      const next = { ...p, temples: p.temples.filter((t) => t.id !== id) }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch (e) {}
      return next
    })
    // In a real app we'd persist to the server and add to sarvdev.temples
  }

  const rejectTemple = (id: string) => {
    setPending((p) => {
      const next = { ...p, temples: p.temples.filter((t) => t.id !== id) }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch (e) {}
      return next
    })
  }

  // simple approve/reject for darshans and events (remove from pending)
  const removePending = (type: 'darshans' | 'events', id: string) => {
    setPending((p) => {
      const next = { ...p, [type]: (p as any)[type].filter((i: any) => i.id !== id) }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch (e) {}
      return next
    })
  }

  const totalTemples = 128

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-base text-gray-600 dark:text-gray-300">Overview of site activity and quick admin actions.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total temples</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalTemples}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pending submissions</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{pending.temples.length + pending.darshans.length + pending.events.length}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Visitors</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{visitorStats.total}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Today's Visitors</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{visitorStats.today}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending Temple Submissions</h2>
            <Link href="/admin/submissions" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">View all</Link>
          </div>

          <ul className="space-y-4">
            {pending.temples.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{p.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{p.location}</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => approveTemple(p.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">Approve</button>
                  <button onClick={() => rejectTemple(p.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Reject</button>
                </div>
              </li>
            ))}
            {pending.temples.length===0 && <li className="text-center py-8 text-gray-500 dark:text-gray-400">No pending temple submissions.</li>}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending Darshans & Events</h2>
            <Link href="/admin/logs" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">View logs</Link>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-lg font-medium text-gray-900 dark:text-white mb-3">Darshans</div>
              <ul className="space-y-3">
                {pending.darshans.map((d) => (
                  <li key={d.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{d.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{d.time} — {d.description?.slice(0,60)}</div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => removePending('darshans', d.id)} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">Approve</button>
                      <button onClick={() => removePending('darshans', d.id)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Reject</button>
                    </div>
                  </li>
                ))}
                {pending.darshans.length===0 && <li className="text-center py-4 text-gray-500 dark:text-gray-400">No pending darshans.</li>}
              </ul>
            </div>

            <div>
              <div className="text-lg font-medium text-gray-900 dark:text-white mb-3">Events</div>
              <ul className="space-y-3">
                {pending.events.map((ev) => (
                  <li key={ev.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{ev.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{ev.date} — {ev.description?.slice(0,60)}</div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => removePending('events', ev.id)} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">Approve</button>
                      <button onClick={() => removePending('events', ev.id)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Reject</button>
                    </div>
                  </li>
                ))}
                {pending.events.length===0 && <li className="text-center py-4 text-gray-500 dark:text-gray-400">No pending events.</li>}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Approve Temples</button>
          <button className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">View Booking Logs</button>
        </div>
      </section>
    </main>
  )
}
