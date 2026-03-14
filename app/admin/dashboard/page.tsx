'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Stats = {
  counts: {
    temples: number; approvedTemples: number; pendingTemples: number
    devotionals: number; blogs: number; events: number; users: number
    visitors: number; todayVisitors: number; weekVisitors: number; monthVisitors: number
  }
  categoryCounts: { _id: string; count: number }[]
  recent: {
    temples: { _id: string; title: string; status?: string; createdAt: string }[]
    devotionals: { _id: string; title: string; category?: string; createdAt: string }[]
    blogs: { _id: string; title: string; status?: string; createdAt: string }[]
    events: { _id: string; title: string; date?: string; status?: string; createdAt: string }[]
  }
  dailyVisitors: { _id: string; count: number }[]
}

const STAT_CONFIG: { key: string; label: string; icon: string; gradient: string; href?: string }[] = [
  { key: 'temples', label: 'Temples', icon: '🛕', gradient: 'from-blue-500 to-blue-600', href: '/admin/temples' },
  { key: 'devotionals', label: 'Devotionals', icon: '🎵', gradient: 'from-orange-500 to-amber-500', href: '/admin/devotionals' },
  { key: 'blogs', label: 'Blogs', icon: '📝', gradient: 'from-purple-500 to-violet-500', href: '/admin/blogs' },
  { key: 'events', label: 'Events', icon: '📅', gradient: 'from-emerald-500 to-green-500', href: '/admin/events' },
  { key: 'users', label: 'Users', icon: '👥', gradient: 'from-indigo-500 to-blue-500', href: '/admin/users' },
  { key: 'visitors', label: 'Total Visitors', icon: '👁️', gradient: 'from-teal-500 to-cyan-500', href: '/admin/analytics' },
  { key: 'todayVisitors', label: 'Today', icon: '📊', gradient: 'from-amber-500 to-yellow-500' },
  { key: 'pendingTemples', label: 'Pending', icon: '⏳', gradient: 'from-rose-500 to-pink-500', href: '/admin/temples' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function statusBadge(status?: string) {
  const s = status || 'approved'
  const cls = s === 'approved' ? 'admin-badge-green' : s === 'pending' ? 'admin-badge-yellow' : 'admin-badge-red'
  return <span className={cls}>{s}</span>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => { if (data.counts) setStats(data) })
      .catch(err => console.error('Dashboard stats error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-section-subtitle">Loading your overview...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="admin-stat animate-pulse">
              <div className="h-4 bg-gray-200 rounded-lg w-20 mb-3" />
              <div className="h-8 bg-gray-200 rounded-lg w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#FEF2F2' }}>
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">Failed to load dashboard</p>
        <p className="text-sm text-gray-500 mt-1">Check your API connection and try refreshing</p>
      </div>
    )
  }

  const { counts, categoryCounts, recent, dailyVisitors } = stats
  const maxDaily = Math.max(...dailyVisitors.map(d => d.count), 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-section-subtitle">Real-time overview of your Sarvdev platform</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/temples/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Content
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CONFIG.map((s) => {
          const value = counts[s.key as keyof typeof counts] ?? 0
          const inner = (
            <div key={s.key} className="admin-stat group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-value mt-1">{value.toLocaleString()}</p>
                </div>
                <div className={`stat-icon bg-gradient-to-br ${s.gradient} shadow-lg`} style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                  <span className="text-xl">{s.icon}</span>
                </div>
              </div>
            </div>
          )
          return s.href ? <Link key={s.key} href={s.href}>{inner}</Link> : <div key={s.key}>{inner}</div>
        })}
      </div>

      {/* Charts & Category row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor chart */}
        <div className="lg:col-span-2 admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="admin-section-title">Visitors — Last 7 Days</h2>
              <p className="text-xs text-gray-400 mt-0.5">Daily traffic overview</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-gray-500">Week: <strong className="text-gray-900">{counts.weekVisitors.toLocaleString()}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-gray-500">Month: <strong className="text-gray-900">{counts.monthVisitors.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
          {dailyVisitors.length > 0 ? (
            <div className="flex items-end gap-2 h-44">
              {dailyVisitors.map((d) => (
                <div key={d._id} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[11px] font-semibold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                    style={{
                      height: `${Math.max((d.count / maxDaily) * 100, 4)}%`,
                      background: 'linear-gradient(to top, #FF9933, #FFB347)',
                    }}
                  />
                  <span className="text-[10px] font-medium text-gray-400">{d._id.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-44 text-gray-400">
              <p>No visitor data for last 7 days</p>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="admin-card p-6">
          <h2 className="admin-section-title mb-5">Devotional Categories</h2>
          <div className="space-y-4">
            {categoryCounts.slice(0, 8).map((c) => {
              const pct = Math.round((c.count / counts.devotionals) * 100)
              return (
                <div key={c._id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{c._id || 'Other'}</span>
                    <span className="text-gray-400 tabular-nums">{c.count} <span className="text-gray-300">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #FF9933, #FFB347)' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Temples */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="admin-section-title">Recent Temples</h2>
            <Link href="/admin/temples" className="admin-btn admin-btn-ghost text-[11px]">View all →</Link>
          </div>
          <ul className="space-y-0">
            {recent.temples.map((t) => (
              <li key={t._id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(t.createdAt)}</p>
                </div>
                {statusBadge(t.status)}
              </li>
            ))}
            {recent.temples.length === 0 && (
              <li className="text-center py-8 text-gray-400 text-sm">No temples added yet</li>
            )}
          </ul>
        </div>

        {/* Recent Devotionals */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="admin-section-title">Recent Devotionals</h2>
            <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost text-[11px]">View all →</Link>
          </div>
          <ul className="space-y-0">
            {recent.devotionals.map((d) => (
              <li key={d._id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{d.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {d.category && <span className="admin-badge-orange mr-1.5 text-[10px] py-0.5 px-1.5">{d.category}</span>}
                    {timeAgo(d.createdAt)}
                  </p>
                </div>
              </li>
            ))}
            {recent.devotionals.length === 0 && (
              <li className="text-center py-8 text-gray-400 text-sm">No devotionals added yet</li>
            )}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/temples/new', icon: '🛕', label: 'Add Temple', color: 'from-blue-50 to-blue-100', text: 'text-blue-700' },
            { href: '/admin/devotionals/new', icon: '🎵', label: 'Add Devotional', color: 'from-orange-50 to-amber-50', text: 'text-orange-700' },
            { href: '/admin/temples', icon: '✅', label: 'Approve Temples', color: 'from-green-50 to-emerald-50', text: 'text-green-700' },
            { href: '/admin/activity', icon: '📋', label: 'Activity Log', color: 'from-purple-50 to-violet-50', text: 'text-purple-700' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-br ${action.color} ${action.text} text-sm font-semibold hover:-translate-y-0.5 transition-all duration-200`}
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <span className="text-lg">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
