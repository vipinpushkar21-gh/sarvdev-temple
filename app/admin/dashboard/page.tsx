'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  FileSearch,
  Image as ImageIcon,
  Mail,
  Music,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
} from 'lucide-react'
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminQuickActions,
  AdminSectionCard,
  AdminStatsCard,
  AdminStatusBadge,
} from '../../../components/admin/AdminKit'

type ActivityLog = {
  _id?: string
  action?: string
  entity?: string
  entityTitle?: string
  adminName?: string
  timestamp?: string
}

type Stats = {
  counts: {
    temples: number
    approvedTemples: number
    pendingTemples: number
    deities: number
    devotionals: number
    blogs: number
    events: number
    darshan: number
    spiritualIcons: number
    subscribers: number
    users: number
    pendingUsers: number
    visitors: number
    todayVisitors: number
    weekVisitors: number
    monthVisitors: number
  }
  growth: { visitors: number; visitorsMonth: number; users: number }
  categoryCounts: { _id: string; count: number }[]
  pendingList: { _id: string; title: string; city?: string; state?: string; deity?: string; createdAt: string }[]
  recent: {
    temples: { _id: string; title: string; status?: string; createdAt: string }[]
    devotionals: { _id: string; title: string; category?: string; createdAt: string }[]
    blogs: { _id: string; title: string; status?: string; createdAt: string }[]
    events: { _id: string; title: string; date?: string; status?: string; createdAt: string }[]
    activity?: ActivityLog[]
  }
  dailyVisitors: { _id: string; count: number }[]
  monthlyVisitors: { _id: string; count: number }[]
  topPages: { _id: string; count: number }[]
  health: { mongodb: string; cloudinary: boolean; tts: boolean; ga: boolean }
}

type ContentHealth = {
  summary: {
    temples: { total: number; withIssues: number; missingImages: number; avgSeoScore: number }
    devotionals: { total: number; withIssues: number; missingAudio: number; avgSeoScore: number }
    blogs: { total: number; withIssues: number; missingImages: number; avgSeoScore: number }
    overallSeoScore: number
  }
  issues: { id: string; title: string; type: string; issues: string[]; seoScore: number }[]
}

function timeAgo(date?: string) {
  if (!date) return 'recently'
  const diff = Date.now() - new Date(date).getTime()
  if (!Number.isFinite(diff)) return 'recently'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function AreaChart({ data }: { data: { _id: string; count: number }[] }) {
  if (!data.length) return <div className="flex h-48 items-center justify-center text-sm font-semibold text-gray-400">No traffic data yet</div>
  const width = 640
  const height = 180
  const max = Math.max(...data.map((item) => item.count), 1)
  const points = data.map((item, index) => ({
    x: data.length > 1 ? (index / (data.length - 1)) * width : width / 2,
    y: height - 18 - (item.count / max) * (height - 36),
  }))
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const area = `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="adminTrafficFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF9933" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((lineY) => (
        <line key={lineY} x1="0" x2={width} y1={height * lineY} y2={height * lineY} stroke="rgba(15,23,42,0.06)" />
      ))}
      <path d={area} fill="url(#adminTrafficFill)" />
      <path d={line} fill="none" stroke="#FF9933" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="4" fill="#FF9933" stroke="white" strokeWidth="2" />)}
    </svg>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [health, setHealth] = useState<ContentHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [range, setRange] = useState<'7d' | '30d'>('7d')

  const loadDashboard = useCallback(async () => {
    setRefreshing(true)
    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch('/api/admin/stats', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/admin/content-health', { credentials: 'include', cache: 'no-store' }),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (healthRes.ok) setHealth(await healthRes.json())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { loadDashboard() }, [loadDashboard])

  const chartData = range === '7d' ? stats?.dailyVisitors || [] : stats?.monthlyVisitors || []
  const contentTasks = useMemo(() => {
    if (!health) return []
    return health.issues
      .filter((issue) => issue.issues.length > 0)
      .sort((a, b) => a.seoScore - b.seoScore)
      .slice(0, 8)
  }, [health])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-3xl bg-white" />
        <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-3xl bg-white" />)}</div>
      </div>
    )
  }

  if (!stats) {
    return <AdminEmptyState title="Dashboard could not load" description="The admin stats API did not respond. Please check the server connection and try again." action={<button onClick={loadDashboard} className="admin-btn admin-btn-primary px-4 py-2 text-sm">Retry</button>} />
  }

  const pendingApprovals = stats.counts.pendingTemples + stats.counts.pendingUsers
  const systemCards = [
    { label: 'Database', ok: stats.health.mongodb === 'connected', detail: stats.health.mongodb === 'connected' ? 'Connected' : 'Needs attention' },
    { label: 'Cloudinary', ok: stats.health.cloudinary, detail: stats.health.cloudinary ? 'Configured' : 'Missing keys' },
    { label: 'Audio TTS', ok: stats.health.tts, detail: stats.health.tts ? 'Configured' : 'Optional key missing' },
    { label: 'Analytics', ok: stats.health.ga, detail: stats.health.ga ? 'Tracking active' : 'GA not set' },
  ]

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        eyebrow="Command Center"
        title="Dashboard"
        subtitle={pendingApprovals > 0 ? `${pendingApprovals} approval task${pendingApprovals === 1 ? '' : 's'} need review.` : 'All critical admin queues are clear.'}
        actions={
          <>
            <button onClick={loadDashboard} disabled={refreshing} className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link href="/admin/temples/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">Add Temple</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard label="Temples" value={stats.counts.temples} helper={`${stats.counts.pendingTemples} pending`} href="/admin/temples" tone="saffron" icon={<Sparkles className="h-5 w-5" />} />
        <AdminStatsCard label="Deities" value={stats.counts.deities} href="/admin/deities" tone="purple" icon={<Star className="h-5 w-5" />} />
        <AdminStatsCard label="Devotionals" value={stats.counts.devotionals} href="/admin/devotionals" tone="blue" icon={<Music className="h-5 w-5" />} />
        <AdminStatsCard label="Blogs" value={stats.counts.blogs} href="/admin/blogs" tone="green" icon={<BookOpenText className="h-5 w-5" />} />
        <AdminStatsCard label="Events" value={stats.counts.events} href="/admin/events" tone="gold" icon={<CalendarDays className="h-5 w-5" />} />
        <AdminStatsCard label="Darshan" value={stats.counts.darshan} href="/admin/darshan" tone="red" icon={<Video className="h-5 w-5" />} />
        <AdminStatsCard label="Spiritual Icons" value={stats.counts.spiritualIcons} href="/admin/spiritual-icons" tone="slate" icon={<ShieldCheck className="h-5 w-5" />} />
        <AdminStatsCard label="Subscribers" value={stats.counts.subscribers} href="/admin/subscribers" tone="blue" icon={<Mail className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <AdminSectionCard
          title="Traffic Overview"
          subtitle={`${stats.counts.weekVisitors.toLocaleString('en-IN')} visits this week, ${stats.growth.visitors}% vs previous week.`}
          actions={
            <div className="admin-tabs">
              <button className={range === '7d' ? 'active' : ''} onClick={() => setRange('7d')}>7 days</button>
              <button className={range === '30d' ? 'active' : ''} onClick={() => setRange('30d')}>30 days</button>
            </div>
          }
        >
          <AreaChart data={chartData} />
        </AdminSectionCard>

        <AdminSectionCard title="Content Health" subtitle={`Overall SEO score ${health?.summary.overallSeoScore ?? 0}%`}>
          <div className="grid gap-3">
            {[
              { label: 'Temples', value: health?.summary.temples.withIssues || 0, total: health?.summary.temples.total || 0, href: '/admin/temples/missing-data' },
              { label: 'Devotionals', value: health?.summary.devotionals.withIssues || 0, total: health?.summary.devotionals.total || 0, href: '/admin/devotionals' },
              { label: 'Blogs', value: health?.summary.blogs.withIssues || 0, total: health?.summary.blogs.total || 0, href: '/admin/blogs' },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 no-underline hover:border-orange-200 hover:bg-orange-50 hover:no-underline">
                <span>
                  <span className="block text-sm font-black text-gray-950">{item.label}</span>
                  <span className="text-xs font-semibold text-gray-500">{item.total} records scanned</span>
                </span>
                <span className={item.value ? 'admin-badge-yellow' : 'admin-badge-green'}>{item.value} issues</span>
              </Link>
            ))}
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <AdminSectionCard title="Quick Actions" subtitle="Frequent admin workflows.">
          <AdminQuickActions actions={[
            { href: '/admin/temples/new', label: 'Add Temple', description: 'Create a new temple listing', icon: <Sparkles className="h-5 w-5" />, tone: 'saffron' },
            { href: '/admin/deities/new', label: 'Add Deity', description: 'Create deity profile', icon: <Star className="h-5 w-5" />, tone: 'purple' },
            { href: '/admin/blogs/new', label: 'Add Blog', description: 'Publish editorial content', icon: <BookOpenText className="h-5 w-5" />, tone: 'green' },
            { href: '/admin/events', label: 'Events', description: 'Manage festivals and events', icon: <CalendarDays className="h-5 w-5" />, tone: 'gold' },
            { href: '/admin/darshan/new', label: 'Add Darshan', description: 'Create a darshan item', icon: <Video className="h-5 w-5" />, tone: 'red' },
            { href: '/admin/images/audit', label: 'Image Audit', description: 'Find weak or missing images', icon: <ImageIcon className="h-5 w-5" />, tone: 'blue' },
            { href: '/admin/temples/missing-data', label: 'Missing Temple Data', description: 'Improve temple completeness', icon: <FileSearch className="h-5 w-5" />, tone: 'slate' },
            { href: '/admin/seo', label: 'SEO Center', description: 'Review search health', icon: <SearchCheck className="h-5 w-5" />, tone: 'saffron' },
          ]} />
        </AdminSectionCard>

        <AdminSectionCard title="Pending Tasks" subtitle="Approval queues and low quality alerts.">
          <div className="space-y-3">
            {stats.pendingList.slice(0, 5).map((temple) => (
              <Link key={temple._id} href="/admin/temples" className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 no-underline hover:border-orange-200 hover:bg-orange-50 hover:no-underline">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-gray-950">{temple.title}</span>
                  <span className="text-xs font-semibold text-gray-500">{[temple.deity, temple.city, temple.state].filter(Boolean).join(' / ') || 'Temple submission'} / {timeAgo(temple.createdAt)}</span>
                </span>
                <AdminStatusBadge status="pending" />
              </Link>
            ))}
            {contentTasks.slice(0, 5).map((issue) => (
              <Link key={`${issue.type}-${issue.id}`} href={issue.type === 'temple' ? '/admin/temples/missing-data' : issue.type === 'blog' ? '/admin/blogs' : '/admin/devotionals'} className="flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3 no-underline hover:border-red-200 hover:bg-red-50 hover:no-underline">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-gray-950">{issue.title}</span>
                  <span className="line-clamp-1 text-xs font-semibold text-gray-500">{issue.issues.join(' / ')}</span>
                </span>
                <span className="admin-badge-red">{issue.seoScore}%</span>
              </Link>
            ))}
            {stats.pendingList.length === 0 && contentTasks.length === 0 && (
              <AdminEmptyState title="No urgent tasks" description="Approval queues and major content alerts are clear." />
            )}
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminSectionCard title="Top Sacred Categories" subtitle="Devotional distribution by category.">
          <div className="space-y-3">
            {stats.categoryCounts.slice(0, 8).map((category) => {
              const max = Math.max(...stats.categoryCounts.map((item) => item.count), 1)
              const width = Math.max(8, Math.round((category.count / max) * 100))
              return (
                <div key={category._id || 'Other'}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-gray-500">
                    <span className="truncate">{category._id || 'Other'}</span>
                    <span>{category.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              )
            })}
            {stats.categoryCounts.length === 0 && <p className="text-sm font-semibold text-gray-400">No category data yet.</p>}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="System Health" subtitle="Operational status for key services.">
          <div className="space-y-3">
            {systemCards.map((card) => (
              <div key={card.label} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-black text-gray-950">{card.label}</span>
                  <span className="text-xs font-semibold text-gray-500">{card.detail}</span>
                </span>
                {card.ok ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-amber-600" />}
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Recent Activity" subtitle="Latest admin actions and content changes.">
          <div className="space-y-3">
            {(stats.recent.activity || []).slice(0, 6).map((item) => (
              <div key={item._id || `${item.action}-${item.timestamp}`} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-600" />
                  <p className="truncate text-sm font-black text-gray-950">{item.action || 'admin-action'}</p>
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-gray-500">{[item.entityTitle, item.entity, item.adminName].filter(Boolean).join(' / ') || 'Admin activity'} / {timeAgo(item.timestamp)}</p>
              </div>
            ))}
            {(!stats.recent.activity || stats.recent.activity.length === 0) && (
              <p className="text-sm font-semibold text-gray-400">No activity log entries yet.</p>
            )}
          </div>
        </AdminSectionCard>
      </div>
    </div>
  )
}
