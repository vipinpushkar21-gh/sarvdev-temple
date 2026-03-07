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

function StatCard({ label, value, icon, color, href }: { label: string; value: number; icon: string; color: string; href?: string }) {
  const inner = (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

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
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Failed to load dashboard stats.</div>
  }

  const { counts, categoryCounts, recent, dailyVisitors } = stats
  const maxDaily = Math.max(...dailyVisitors.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time overview of your Sarvdev website</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
            + Add Content
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Temples" value={counts.temples} icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" color="bg-blue-500" href="/admin/temples" />
        <StatCard label="Devotionals" value={counts.devotionals} icon="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" color="bg-orange-500" href="/admin/devotionals" />
        <StatCard label="Blogs" value={counts.blogs} icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" color="bg-purple-500" href="/admin/blogs" />
        <StatCard label="Events" value={counts.events} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" color="bg-green-500" href="/admin/events" />
        <StatCard label="Users" value={counts.users} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" color="bg-indigo-500" href="/admin/users" />
        <StatCard label="Total Visitors" value={counts.visitors} icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" color="bg-teal-500" href="/admin/analytics" />
        <StatCard label="Today" value={counts.todayVisitors} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-amber-500" />
        <StatCard label="Pending" value={counts.pendingTemples} icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" color="bg-yellow-500" href="/admin/temples" />
      </div>

      {/* Charts & Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visitors — Last 7 Days</h2>
          {dailyVisitors.length > 0 ? (
            <div className="flex items-end gap-2 h-40">
              {dailyVisitors.map((d) => (
                <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{d.count}</span>
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-md transition-all"
                    style={{ height: `${Math.max((d.count / maxDaily) * 100, 4)}%` }}
                  />
                  <span className="text-[10px] text-gray-400">{d._id.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">No visitor data for last 7 days</p>
          )}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
            <div><span className="text-gray-500">This week:</span> <span className="font-semibold text-gray-900 dark:text-white">{counts.weekVisitors.toLocaleString()}</span></div>
            <div><span className="text-gray-500">This month:</span> <span className="font-semibold text-gray-900 dark:text-white">{counts.monthVisitors.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Devotional Categories</h2>
          <div className="space-y-3">
            {categoryCounts.slice(0, 10).map((c) => {
              const pct = Math.round((c.count / counts.devotionals) * 100)
              return (
                <div key={c._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{c._id || 'Other'}</span>
                    <span className="text-gray-500">{c.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Temples</h2>
            <Link href="/admin/temples" className="text-sm text-orange-600 hover:text-orange-700 font-medium">View all</Link>
          </div>
          <ul className="space-y-3">
            {recent.temples.map((t) => (
              <li key={t._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</p>
                  <p className="text-xs text-gray-400">{timeAgo(t.createdAt)}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  t.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  t.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>{t.status || 'approved'}</span>
              </li>
            ))}
            {recent.temples.length === 0 && <li className="text-center py-4 text-gray-400 text-sm">No temples yet</li>}
          </ul>
        </div>

        {/* Recent Devotionals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Devotionals</h2>
            <Link href="/admin/devotionals" className="text-sm text-orange-600 hover:text-orange-700 font-medium">View all</Link>
          </div>
          <ul className="space-y-3">
            {recent.devotionals.map((d) => (
              <li key={d._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{d.title}</p>
                  <p className="text-xs text-gray-400">{d.category} · {timeAgo(d.createdAt)}</p>
                </div>
              </li>
            ))}
            {recent.devotionals.length === 0 && <li className="text-center py-4 text-gray-400 text-sm">No devotionals yet</li>}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/admin" className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Temple
          </Link>
          <Link href="/admin/devotionals/new" className="flex items-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Devotional
          </Link>
          <Link href="/admin/temples" className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Approve Temples
          </Link>
          <Link href="/admin/activity" className="flex items-center gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Activity Log
          </Link>
        </div>
      </div>
    </div>
  )
}
