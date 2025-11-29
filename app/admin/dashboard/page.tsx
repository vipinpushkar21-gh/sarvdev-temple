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
  const donationTotals = { today: 123.5, month: 4520.0, lifetime: 98765.25 }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Overview of site activity and quick admin actions.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-500">Total temples</div>
          <div className="text-2xl font-bold">{totalTemples}</div>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-500">Pending submissions</div>
          <div className="text-2xl font-bold">{pending.temples.length + pending.darshans.length + pending.events.length}</div>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-500">Donation (month)</div>
          <div className="text-2xl font-bold">${donationTotals.month.toLocaleString()}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Pending Temple Submissions</h2>
            <Link href="/admin/submissions" className="text-emerald-600 hover:underline">View all</Link>
          </div>

          <ul className="space-y-3">
            {pending.temples.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-slate-500">{p.location}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveTemple(p.id)} className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm">Approve</button>
                  <button onClick={() => rejectTemple(p.id)} className="px-3 py-1 bg-rose-600 text-white rounded-md text-sm">Reject</button>
                </div>
              </li>
            ))}
            {pending.temples.length===0 && <li className="text-sm text-slate-500">No pending temple submissions.</li>}
          </ul>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Pending Darshans & Events</h2>
            <Link href="/admin/logs" className="text-emerald-600 hover:underline">View logs</Link>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-500 mb-2">Darshans</div>
              <ul className="space-y-2">
                {pending.darshans.map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{d.title}</div>
                      <div className="text-xs text-slate-500">{d.time} — {d.description?.slice(0,60)}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => removePending('darshans', d.id)} className="px-2 py-1 bg-emerald-600 text-white rounded-md text-sm">Approve</button>
                      <button onClick={() => removePending('darshans', d.id)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-sm">Reject</button>
                    </div>
                  </li>
                ))}
                {pending.darshans.length===0 && <li className="text-sm text-slate-500">No pending darshans.</li>}
              </ul>
            </div>

            <div>
              <div className="text-sm text-slate-500 mb-2">Events</div>
              <ul className="space-y-2">
                {pending.events.map((ev) => (
                  <li key={ev.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{ev.title}</div>
                      <div className="text-xs text-slate-500">{ev.date} — {ev.description?.slice(0,60)}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => removePending('events', ev.id)} className="px-2 py-1 bg-emerald-600 text-white rounded-md text-sm">Approve</button>
                      <button onClick={() => removePending('events', ev.id)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-sm">Reject</button>
                    </div>
                  </li>
                ))}
                {pending.events.length===0 && <li className="text-sm text-slate-500">No pending events.</li>}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Donations</h2>
          <Link href="/admin/donations" className="text-emerald-600 hover:underline">Manage donations</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-white/30 rounded-md">
            <div className="text-sm text-slate-500">Today</div>
            <div className="text-xl font-semibold">${donationTotals.today}</div>
          </div>
          <div className="p-3 bg-white/30 rounded-md">
            <div className="text-sm text-slate-500">Month</div>
            <div className="text-xl font-semibold">${donationTotals.month.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-white/30 rounded-md">
            <div className="text-sm text-slate-500">Lifetime</div>
            <div className="text-xl font-semibold">${donationTotals.lifetime.toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-md">Approve Temples</button>
          <button className="px-4 py-2 bg-slate-700 text-white rounded-md">View Booking Logs</button>
          <button className="px-4 py-2 bg-slate-700 text-white rounded-md">Manage Donations</button>
        </div>
      </section>
    </main>
  )
}
