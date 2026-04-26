'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'

type PendingTemple = { _id: string; title: string; city?: string; state?: string; deity?: string; createdAt: string }

type Stats = {
  counts: {
    temples: number; approvedTemples: number; pendingTemples: number
    devotionals: number; blogs: number; events: number; users: number
    visitors: number; todayVisitors: number; weekVisitors: number; monthVisitors: number
    pendingUsers: number
  }
  growth: { visitors: number; visitorsMonth: number; users: number }
  categoryCounts: { _id: string; count: number }[]
  pendingList: PendingTemple[]
  recent: {
    temples: { _id: string; title: string; status?: string; createdAt: string }[]
    devotionals: { _id: string; title: string; category?: string; createdAt: string }[]
    blogs: { _id: string; title: string; status?: string; createdAt: string }[]
    events: { _id: string; title: string; date?: string; status?: string; createdAt: string }[]
  }
  dailyVisitors: { _id: string; count: number }[]
  monthlyVisitors: { _id: string; count: number }[]
  topPages: { _id: string; count: number }[]
  health: { mongodb: string; cloudinary: boolean; tts: boolean; ga: boolean }
}

/* ─── palette tokens ─── */
const C = {
  bg:        '#F6F7FB',
  card:      '#FFFFFF',
  border:    'rgba(0,0,0,0.07)',
  saffron:   '#FF9933',
  gold:      '#D4AF37',
  maroon:    '#9B1C1C',
  ink:       '#111827',
  muted:     '#6B7280',
  faint:     '#9CA3AF',
  success:   '#10B981',
  warning:   '#F59E0B',
  danger:    '#EF4444',
  indigo:    '#6366F1',
}

const KPI_META = [
  { key: 'temples',       label: 'Temples',        icon: '🛕', from: '#3B82F6', to: '#2563EB', href: '/admin/temples'    },
  { key: 'devotionals',   label: 'Devotionals',     icon: '🎵', from: '#FF9933', to: '#E67E22', href: '/admin/devotionals'},
  { key: 'blogs',         label: 'Blog Posts',      icon: '📝', from: '#8B5CF6', to: '#7C3AED', href: '/admin/blogs'      },
  { key: 'events',        label: 'Events',          icon: '📅', from: '#10B981', to: '#059669', href: '/admin/events'     },
  { key: 'users',         label: 'Registered Users',icon: '👤', from: '#6366F1', to: '#4F46E5', href: '/admin/users'      },
  { key: 'visitors',      label: 'Total Visitors',  icon: '👁', from: '#0EA5E9', to: '#0284C7', href: '/admin/analytics'  },
  { key: 'todayVisitors', label: 'Today Visitors',  icon: '📈', from: '#F59E0B', to: '#D97706', href: undefined           },
  { key: 'pendingTemples',label: 'Pending Temples', icon: '⏳', from: '#EF4444', to: '#DC2626', href: '/admin/temples'    },
  { key: 'pendingUsers',  label: 'Pending Users',   icon: '👥', from: '#F59E0B', to: '#D97706', href: '/admin/users'      },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || 'approved'
  const map: Record<string, { bg: string; color: string }> = {
    approved: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
    pending:  { bg: 'rgba(245,158,11,0.1)', color: '#B45309' },
    rejected: { bg: 'rgba(239,68,68,0.1)',  color: '#B91C1C' },
  }
  const style = map[s] || map.approved
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize"
      style={{ background: style.bg, color: style.color }}>
      {s}
    </span>
  )
}

function GrowthBadge({ pct }: { pct: number }) {
  if (pct === 0) return null
  const up = pct > 0
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
      style={{ background: up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: up ? '#059669' : '#DC2626' }}>
      {up ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )
}

/* Smooth SVG area chart */
function AreaChart({ data }: { data: { _id: string; count: number }[] }) {
  if (!data.length) return <div className="flex items-center justify-center h-full text-sm" style={{ color: C.faint }}>No data for this period</div>
  const W = 600; const H = 160
  const max = Math.max(...data.map(d => d.count), 1)
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - 12 - ((d.count / max) * (H - 24)),
    count: d.count,
    label: d._id.slice(5),
  }))

  const linePath = pts.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1]
    const cpx = (prev.x + p.x) / 2
    return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }).join(' ')

  const areaPath = linePath + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`

  return (
    <div className="relative w-full" style={{ height: 160 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9933" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={0} y1={H - 12 - t * (H - 24)} x2={W} y2={H - 12 - t * (H - 24)}
            stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
        ))}
        <path d={areaPath} fill="url(#chartGrad)" />
        <path d={linePath} fill="none" stroke="#FF9933" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#FF9933" stroke="white" strokeWidth={1.5} />
        ))}
      </svg>
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-0">
        {pts.filter((_, i) => data.length <= 10 || i % 3 === 0).map((p, i) => (
          <span key={i} className="text-[9px]" style={{ color: C.faint }}>{p.label}</span>
        ))}
      </div>
    </div>
  )
}

/* Live clock */
function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])
  return <span className="tabular-nums">{time}</span>
}

/* ─────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const [stats, setStats]         = useState<Stats | null>(null)
  const [loading, setLoading]     = useState(true)
  const [range, setRange]         = useState<'7d' | '30d'>('7d')
  const [approving, setApproving] = useState<Record<string, 'approve' | 'reject' | null>>({})
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [recentTab, setRecentTab] = useState<'temples' | 'devotionals' | 'blogs' | 'events'>('temples')
  const [spinning, setSpinning]   = useState(false)

  const loadStats = useCallback(() => {
    setLoading(true); setSpinning(true)
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { if (d.counts) setStats(d) })
      .catch(e => console.error('Dashboard stats error:', e))
      .finally(() => { setLoading(false); setTimeout(() => setSpinning(false), 600) })
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    setApproving(p => ({ ...p, [id]: action }))
    try {
      await fetch('/api/temples', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action === 'approve' ? 'approved' : 'rejected' }),
      })
      setDismissed(p => new Set([...p, id]))
      setStats(prev => prev ? {
        ...prev,
        counts: { ...prev.counts, pendingTemples: Math.max(0, prev.counts.pendingTemples - 1), approvedTemples: action === 'approve' ? prev.counts.approvedTemples + 1 : prev.counts.approvedTemples },
        pendingList: prev.pendingList.filter(t => t._id !== id),
      } : prev)
    } catch { /* silent */ }
    finally { setApproving(p => ({ ...p, [id]: null })) }
  }

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="space-y-6">
      <div className="h-20 rounded-2xl animate-pulse" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #E67E22 100%)' }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: C.card, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div className="h-3 w-20 rounded-full mb-3" style={{ background: '#E5E7EB' }} />
            <div className="h-8 w-16 rounded-xl" style={{ background: '#E5E7EB' }} />
          </div>
        ))}
      </div>
    </div>
  )

  /* ── Error state ── */
  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(239,68,68,0.08)' }}>
        <span className="text-3xl">⚠️</span>
      </div>
      <p className="text-lg font-bold" style={{ color: C.ink }}>Failed to load dashboard</p>
      <p className="text-sm mt-1 mb-6" style={{ color: C.muted }}>Check your API connection and try refreshing</p>
      <button onClick={loadStats} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: C.saffron }}>
        Retry
      </button>
    </div>
  )

  const { counts, growth, categoryCounts, pendingList, recent, dailyVisitors, monthlyVisitors, topPages, health } = stats
  const chartData      = range === '7d' ? dailyVisitors : monthlyVisitors
  const visiblePending = pendingList.filter(t => !dismissed.has(t._id))
  const totalPendingApprovals = (counts.pendingUsers || 0) + visiblePending.length
  const maxCat         = Math.max(...categoryCounts.map(c => c.count), 1)

  const exportCSV = (rows: (string | number)[][], filename: string) => {
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = filename; a.click()
  }

  /* ── Card wrapper ── */
  const Card = ({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div className={className} style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', ...style }}>
      {children}
    </div>
  )

  return (
    <div className="space-y-6 pb-10">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #2C1100 50%, #3D1A00 100%)' }}>
        {/* Saffron glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.18) 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
        <div className="absolute bottom-0 left-16 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)', transform: 'translateY(40%)' }} />

        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,153,51,0.7)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · <LiveClock />
          </p>
          <h1 className="text-2xl font-bold text-white">{getGreeting()} 🙏</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {totalPendingApprovals > 0
              ? `${counts.pendingTemples > 0 ? `${counts.pendingTemples} temple${counts.pendingTemples > 1 ? 's' : ''}` : ''}${counts.pendingTemples > 0 && counts.pendingUsers > 0 ? ' · ' : ''}${counts.pendingUsers > 0 ? `${counts.pendingUsers} user account${counts.pendingUsers > 1 ? 's' : ''}` : ''} awaiting your review`
              : 'All caught up — Sarvdev is running smoothly'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={loadStats}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <svg className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link href="/admin/temples/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF9933, #E67E22)', color: '#1A0A00', boxShadow: '0 4px 14px rgba(255,153,51,0.4)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Content
          </Link>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_META.map((m) => {
          const value    = counts[m.key as keyof typeof counts] ?? 0
          const growthPct = m.key === 'visitors' ? growth.visitors : m.key === 'users' ? growth.users : null
          const inner = (
            <Card className="p-5 group hover:-translate-y-0.5 transition-all duration-200 h-full" style={{ cursor: m.href ? 'pointer' : 'default' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color: C.muted }}>{m.label}</p>
                  <p className="text-3xl font-extrabold mt-2 tabular-nums leading-none" style={{ color: C.ink }}>
                    {value.toLocaleString('en-IN')}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {growthPct !== null && <GrowthBadge pct={growthPct} />}
                    {growthPct !== null && <span className="text-[10px]" style={{ color: C.faint }}>vs last week</span>}
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${m.from}, ${m.to})`, boxShadow: `0 4px 14px ${m.from}40` }}>
                  {m.icon}
                </div>
              </div>
              {/* Bottom accent line */}
              <div className="mt-4 h-0.5 rounded-full opacity-20 group-hover:opacity-60 transition-opacity"
                style={{ background: `linear-gradient(90deg, ${m.from}, ${m.to})` }} />
            </Card>
          )
          return m.href
            ? <Link key={m.key} href={m.href} className="block">{inner}</Link>
            : <div key={m.key}>{inner}</div>
        })}
      </div>

      {/* ── Pending Queue ── */}
      {visiblePending.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between gap-3"
            style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))', borderBottom: `1px solid rgba(245,158,11,0.15)` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.15)' }}>⏳</div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#92400E' }}>Pending Approval Queue</p>
                <p className="text-xs mt-0.5" style={{ color: C.warning }}>
                  {visiblePending.length} temple{visiblePending.length !== 1 ? 's' : ''} need review
                </p>
              </div>
            </div>
            <Link href="/admin/temples" className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-amber-50"
              style={{ color: C.warning, border: `1px solid rgba(245,158,11,0.3)` }}>
              View All →
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {visiblePending.map((t) => (
              <div key={t._id} className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: 'rgba(255,153,51,0.1)' }}>🛕</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: C.ink }}>{t.title}</p>
                    <p className="text-xs truncate" style={{ color: C.faint }}>
                      {[t.deity, t.city, t.state].filter(Boolean).join(' · ')} · {timeAgo(t.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href="/admin/temples" className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
                    style={{ color: C.indigo, background: 'rgba(99,102,241,0.06)' }}>View</Link>
                  <button onClick={() => handleApproval(t._id, 'reject')} disabled={!!approving[t._id]}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    style={{ color: C.danger, background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.2)` }}>
                    {approving[t._id] === 'reject' ? '…' : '✕ Reject'}
                  </button>
                  <button onClick={() => handleApproval(t._id, 'approve')} disabled={!!approving[t._id]}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${C.success}, #059669)`, boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}>
                    {approving[t._id] === 'approve' ? '…' : '✓ Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Visitor Chart + Category Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-bold" style={{ color: C.ink }}>Visitor Traffic</h2>
              <p className="text-xs mt-0.5" style={{ color: C.faint }}>
                {range === '7d' ? 'Last 7 days' : 'Last 30 days'} · Week total: <strong style={{ color: C.ink }}>{counts.weekVisitors.toLocaleString()}</strong>
                <span className="ml-2 inline-flex"><GrowthBadge pct={growth.visitors} /></span>
              </p>
            </div>
            <div className="flex rounded-xl overflow-hidden text-xs font-bold" style={{ border: `1px solid ${C.border}` }}>
              {(['7d', '30d'] as const).map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className="px-4 py-1.5 transition-all"
                  style={range === r
                    ? { background: C.saffron, color: '#fff' }
                    : { background: 'transparent', color: C.muted }}>
                  {r === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={chartData} />
        </Card>

        {/* Devotional Categories */}
        <Card className="p-6">
          <h2 className="text-base font-bold mb-5" style={{ color: C.ink }}>Devotional Categories</h2>
          <div className="space-y-3.5">
            {categoryCounts.slice(0, 8).map((c, i) => {
              const pct = Math.round((c.count / maxCat) * 100)
              const colors = ['#FF9933','#8B5CF6','#10B981','#3B82F6','#EF4444','#F59E0B','#6366F1','#EC4899']
              return (
                <div key={c._id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold truncate max-w-[55%]" style={{ color: C.ink }}>{c._id || 'Other'}</span>
                    <span className="tabular-nums" style={{ color: C.muted }}>{c.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              )
            })}
            {categoryCounts.length === 0 && <p className="text-sm text-center py-6" style={{ color: C.faint }}>No category data yet</p>}
          </div>
        </Card>
      </div>

      {/* ── Recent Activity ── */}
      <Card className="overflow-hidden">
        <div className="px-6 pt-5 pb-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h2 className="text-base font-bold" style={{ color: C.ink }}>Recent Activity</h2>
          <div className="flex rounded-xl overflow-hidden text-xs font-bold" style={{ border: `1px solid ${C.border}` }}>
            {([
              { key: 'temples',     label: '🛕', full: 'Temples'     },
              { key: 'devotionals', label: '🎵', full: 'Devotionals' },
              { key: 'blogs',       label: '📝', full: 'Blogs'       },
              { key: 'events',      label: '📅', full: 'Events'      },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setRecentTab(tab.key)}
                className="px-3 sm:px-4 py-1.5 transition-all"
                style={recentTab === tab.key
                  ? { background: C.saffron, color: '#fff' }
                  : { background: 'transparent', color: C.muted }}>
                <span>{tab.label}</span>
                <span className="hidden sm:inline ml-1">{tab.full}</span>
              </button>
            ))}
          </div>
        </div>
        <ul>
          {(recentTab === 'temples'     ? recent.temples     :
            recentTab === 'devotionals' ? recent.devotionals :
            recentTab === 'blogs'       ? recent.blogs       :
            recent.events).map((item: any) => (
            <li key={item._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/70 transition-colors"
              style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ background: recentTab === 'temples' ? 'rgba(59,130,246,0.1)' : recentTab === 'devotionals' ? 'rgba(255,153,51,0.1)' : recentTab === 'blogs' ? 'rgba(139,92,246,0.1)' : 'rgba(16,185,129,0.1)' }}>
                  {recentTab === 'temples' ? '🛕' : recentTab === 'devotionals' ? '🎵' : recentTab === 'blogs' ? '📝' : '📅'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: C.ink }}>{item.title}</p>
                  <p className="text-xs" style={{ color: C.faint }}>
                    {recentTab === 'devotionals' && item.category && <span className="mr-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: 'rgba(255,153,51,0.12)', color: '#C2410C' }}>{item.category}</span>}
                    {recentTab === 'events' && item.date && <span className="mr-2">📅 {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </li>
          ))}
          {recent[recentTab].length === 0 && (
            <li className="text-center py-10 text-sm" style={{ color: C.faint }}>No {recentTab} added yet</li>
          )}
        </ul>
      </Card>

      {/* ── Top Pages + System Health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Pages */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold" style={{ color: C.ink }}>Top Pages</h2>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', color: C.indigo }}>Last 30 days</span>
          </div>
          <div className="space-y-4">
            {topPages.slice(0, 6).map((p, i) => {
              const maxCount = topPages[0]?.count || 1
              const pct = Math.round((p.count / maxCount) * 100)
              const label = p._id === '/' ? '🏠 Home'
                : p._id.startsWith('/temples/') ? '🛕 ' + p._id.replace('/temples/', '')
                : p._id.startsWith('/devotionals') ? '🎵 ' + p._id
                : p._id.startsWith('/blog') ? '📝 ' + p._id
                : p._id
              const medal = ['🥇','🥈','🥉']
              return (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="text-base w-6 flex-shrink-0">{medal[i] || `${i+1}`}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold truncate max-w-[70%]" style={{ color: C.ink }}>{label}</span>
                      <span className="text-xs tabular-nums font-bold" style={{ color: C.muted }}>{p.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }} />
                    </div>
                  </div>
                </div>
              )
            })}
            {topPages.length === 0 && <p className="text-sm text-center py-6" style={{ color: C.faint }}>No page data yet</p>}
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold" style={{ color: C.ink }}>System Health</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.success }} />
              <span className="text-xs font-semibold" style={{ color: C.success }}>Operational</span>
            </div>
          </div>
          <div className="space-y-3">
            {([
              { label: 'MongoDB Database', icon: '🗄️', ok: health.mongodb === 'connected', detail: health.mongodb === 'connected' ? 'Connected & responding' : 'Connection issue' },
              { label: 'Cloudinary CDN',   icon: '🖼️', ok: health.cloudinary, detail: health.cloudinary ? 'API keys configured' : 'Not configured' },
              { label: 'Azure TTS',        icon: '🔊', ok: health.tts,        detail: health.tts ? 'API key active' : 'Not configured — TTS disabled' },
              { label: 'Google Analytics', icon: '📊', ok: health.ga,         detail: health.ga ? 'Tracking active' : 'GA ID not set' },
            ] as const).map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-3.5 rounded-2xl transition-colors"
                style={{ background: item.ok ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.06)', border: `1px solid ${item.ok ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.15)'}` }}>
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: C.ink }}>{item.label}</p>
                  <p className="text-xs" style={{ color: item.ok ? C.success : C.warning }}>{item.detail}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${item.ok ? '' : ''}`}
                  style={{ background: item.ok ? C.success : C.warning, boxShadow: item.ok ? '0 2px 8px rgba(16,185,129,0.35)' : '0 2px 8px rgba(245,158,11,0.35)' }}>
                  {item.ok ? '✓' : '!'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Quick Actions + Export ── */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-base font-bold" style={{ color: C.ink }}>Quick Actions</h2>
          <div className="flex gap-2">
            <button onClick={() => exportCSV([['Metric','Value'], ...Object.entries(counts)], `sarvdev-stats-${new Date().toISOString().slice(0,10)}.csv`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
              style={{ color: C.muted, border: `1px solid ${C.border}` }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Stats CSV
            </button>
            <button onClick={() => exportCSV([['Page','Visits'], ...topPages.map(p => [p._id, p.count])], `sarvdev-pages-${new Date().toISOString().slice(0,10)}.csv`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:bg-gray-100"
              style={{ color: C.muted, border: `1px solid ${C.border}` }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Pages CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/temples/new',    icon: '🛕', label: 'Add Temple',     from: '#3B82F6', to: '#2563EB' },
            { href: '/admin/devotionals/new',icon: '🎵', label: 'Add Devotional', from: '#FF9933', to: '#E67E22' },
            { href: '/admin/temples',         icon: '✅', label: 'Approve Temples',from: '#10B981', to: '#059669' },
            { href: '/admin/activity',        icon: '📋', label: 'Activity Log',  from: '#8B5CF6', to: '#7C3AED' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="group flex flex-col items-center gap-2 p-5 rounded-2xl text-white text-sm font-bold transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
              style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})`, boxShadow: `0 4px 14px ${a.from}40` }}>
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{a.icon}</span>
              <span className="text-center leading-tight text-xs">{a.label}</span>
            </Link>
          ))}
        </div>
      </Card>

    </div>
  )
}
