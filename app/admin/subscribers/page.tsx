'use client'

import { useState, useEffect, useCallback } from 'react'

const C = {
  card: '#FFFFFF', border: 'rgba(0,0,0,0.07)', ink: '#111827', muted: '#6B7280', faint: '#9CA3AF',
  saffron: '#FF9933', success: '#10B981', warning: '#F59E0B', danger: '#EF4444',
}

type Sub = { _id: string; email: string; name?: string; source: string; status: string; subscribedAt: string }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [stats, setStats] = useState({ totalActive: 0, totalUnsubscribed: 0, recentWeek: 0 })
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/subscribers')
      .then(r => r.json())
      .then(d => {
        if (d.subscribers) setSubs(d.subscribers)
        if (d.stats) setStats(d.stats)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="space-y-6">
      <div className="h-12 rounded-2xl animate-pulse" style={{ background: 'linear-gradient(135deg, #1A0A00, #3D1A00)' }} />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div className="h-8 w-16 rounded-xl" style={{ background: '#E5E7EB' }} />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl px-7 py-5"
        style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #2C1100 50%, #3D1A00 100%)' }}>
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,153,51,0.7)' }}>Newsletter</p>
          <h1 className="text-xl font-bold text-white">Subscribers</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {stats.totalActive} active · {stats.recentWeek} this week
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {([
          { label: 'Active', value: stats.totalActive, color: C.success, icon: '📧' },
          { label: 'This Week', value: stats.recentWeek, color: C.saffron, icon: '📈' },
          { label: 'Unsubscribed', value: stats.totalUnsubscribed, color: C.danger, icon: '🚫' },
        ]).map(k => (
          <div key={k.label} className="p-5" style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>{k.label}</p>
                <p className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: C.ink }}>{k.value}</p>
              </div>
              <span className="text-2xl">{k.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h2 className="text-sm font-bold" style={{ color: C.ink }}>All Subscribers ({subs.length})</h2>
          <button onClick={load} className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors hover:bg-gray-100"
            style={{ color: C.muted, border: `1px solid ${C.border}` }}>Refresh</button>
        </div>
        {subs.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-3xl">📭</span>
            <p className="text-sm font-bold mt-2" style={{ color: C.ink }}>No subscribers yet</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Newsletter signups will appear here</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {subs.map(s => (
              <div key={s._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: s.status === 'active' ? C.success : C.danger }}>
                    {s.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: C.ink }}>{s.email}</p>
                    <p className="text-xs" style={{ color: C.faint }}>
                      {s.name || 'Anonymous'} · {s.source} · {timeAgo(s.subscribedAt)}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                  style={{
                    background: s.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: s.status === 'active' ? '#059669' : '#DC2626',
                  }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
