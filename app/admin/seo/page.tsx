'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ── Palette ── */
const C = {
  card: '#FFFFFF', border: 'rgba(0,0,0,0.07)', ink: '#111827', muted: '#6B7280', faint: '#9CA3AF',
  saffron: '#FF9933', gold: '#D4AF37', success: '#10B981', warning: '#F59E0B', danger: '#EF4444',
  indigo: '#6366F1',
}

type SeoData = {
  counts: { temples: number; pendingTemples: number; devotionals: number; blogs: number; total: number }
  avgSeoScore: number
  distribution: { excellent: number; good: number; needsWork: number; poor: number }
  weakest: { id: string; title: string; score: number; type: string }[]
  coverage: Record<string, number>
  topStates: { state: string; count: number }[]
  topDeities: { deity: string; count: number }[]
  indexCoverage: { templePages: number; stateHubPages: number; cityHubPages: number; deityHubPages: number; pilgrimageClusters: number; blogPages: number; staticPages: number; estimatedTotalIndexable: number }
  ctrOpportunities: { id: string; title: string; missing: string[] }[]
}

type HealthData = {
  summary: {
    temples: { total: number; withIssues: number; missingImages: number; avgSeoScore: number }
    devotionals: { total: number; withIssues: number; missingAudio: number; avgSeoScore: number }
    blogs: { total: number; withIssues: number; missingImages: number; avgSeoScore: number }
    overallSeoScore: number
  }
  issues: { id: string; title: string; type: string; issues: string[]; seoScore: number }[]
}

/* ── Score Ring SVG ── */
function ScoreRing({ score, size = 120, label }: { score: number; size?: number; label?: string }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? C.success : score >= 60 ? C.warning : C.danger
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-extrabold tabular-nums" style={{ color }}>{score}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>/ 100</span>
      </div>
      {label && <span className="text-xs font-semibold mt-2" style={{ color: C.muted }}>{label}</span>}
    </div>
  )
}

/* ── Bar ── */
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

/* ── Card ── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      {children}
    </div>
  )
}

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoData | null>(null)
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'issues' | 'index' | 'authority'>('overview')
  const [issueFilter, setIssueFilter] = useState<'all' | 'temple' | 'devotional' | 'blog'>('all')

  const loadData = useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/admin/seo-analytics').then(r => r.json()),
      fetch('/api/admin/content-health').then(r => r.json()),
    ]).then(([s, h]) => {
      if (s.counts) setSeo(s)
      if (h.summary) setHealth(h)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadData() }, [loadData])

  if (loading) return (
    <div className="space-y-6">
      <div className="h-16 rounded-2xl animate-pulse" style={{ background: 'linear-gradient(135deg, #1A0A00, #3D1A00)' }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div className="h-3 w-20 rounded-full mb-3" style={{ background: '#E5E7EB' }} />
            <div className="h-8 w-16 rounded-xl" style={{ background: '#E5E7EB' }} />
          </div>
        ))}
      </div>
    </div>
  )

  if (!seo || !health) return (
    <div className="text-center py-16">
      <p className="text-lg font-bold" style={{ color: C.ink }}>Failed to load SEO data</p>
      <button onClick={loadData} className="mt-4 px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: C.saffron }}>Retry</button>
    </div>
  )

  const { counts, avgSeoScore, distribution, weakest, coverage, topStates, topDeities, indexCoverage, ctrOpportunities } = seo
  const distTotal = distribution.excellent + distribution.good + distribution.needsWork + distribution.poor || 1
  const filteredIssues = health.issues.filter(i => issueFilter === 'all' || i.type === issueFilter)

  return (
    <div className="space-y-6 pb-10">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl px-7 py-6"
        style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #2C1100 50%, #3D1A00 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,153,51,0.7)' }}>
              SEO Intelligence Center
            </p>
            <h1 className="text-2xl font-bold text-white">Search Engine Optimization</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {counts.total} content items · Avg score {avgSeoScore}/100
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Refresh
            </button>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #FF9933, #E67E22)', color: '#1A0A00' }}>
              Sitemap
            </a>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex rounded-xl overflow-hidden text-xs font-bold" style={{ border: `1px solid ${C.border}` }}>
        {([
          { key: 'overview', label: '📊 Overview' },
          { key: 'issues', label: `⚠️ Issues (${health.issues.length})` },
          { key: 'index', label: '🌐 Index Coverage' },
          { key: 'authority', label: '🏛️ Authority' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 px-4 py-2.5 transition-all text-center"
            style={tab === t.key ? { background: C.saffron, color: '#fff' } : { color: C.muted }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════ OVERVIEW TAB ════════ */}
      {tab === 'overview' && (
        <>
          {/* Score Ring + Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="p-6 flex flex-col items-center justify-center relative">
              <ScoreRing score={avgSeoScore} size={140} />
              <p className="text-sm font-bold mt-4" style={{ color: C.ink }}>Overall SEO Score</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Across {counts.total} items</p>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="text-sm font-bold mb-4" style={{ color: C.ink }}>Score Distribution</h3>
              <div className="space-y-3">
                {([
                  { label: 'Excellent (90-100)', value: distribution.excellent, color: '#10B981' },
                  { label: 'Good (70-89)', value: distribution.good, color: '#3B82F6' },
                  { label: 'Needs Work (50-69)', value: distribution.needsWork, color: '#F59E0B' },
                  { label: 'Poor (0-49)', value: distribution.poor, color: '#EF4444' },
                ]).map(d => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold" style={{ color: C.ink }}>{d.label}</span>
                      <span className="tabular-nums font-bold" style={{ color: d.color }}>{d.value} ({Math.round((d.value / distTotal) * 100)}%)</span>
                    </div>
                    <ProgressBar value={d.value} max={distTotal} color={d.color} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Content Health KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([
              { label: 'Temples', score: health.summary.temples.avgSeoScore, total: health.summary.temples.total, issues: health.summary.temples.withIssues, color: '#3B82F6', icon: '🛕' },
              { label: 'Devotionals', score: health.summary.devotionals.avgSeoScore, total: health.summary.devotionals.total, issues: health.summary.devotionals.withIssues, color: '#FF9933', icon: '🎵' },
              { label: 'Blogs', score: health.summary.blogs.avgSeoScore, total: health.summary.blogs.total, issues: health.summary.blogs.withIssues, color: '#10B981', icon: '📝' },
            ]).map(s => (
              <Card key={s.label} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm font-bold" style={{ color: C.ink }}>{s.label}</span>
                  </div>
                  <span className="text-2xl font-extrabold tabular-nums" style={{ color: s.score >= 80 ? C.success : s.score >= 60 ? C.warning : C.danger }}>{s.score}</span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2" style={{ color: C.muted }}>
                  <span>{s.total} total</span>
                  <span className="font-semibold" style={{ color: s.issues > 0 ? C.danger : C.success }}>{s.issues} with issues</span>
                </div>
                <ProgressBar value={s.total - s.issues} max={s.total} color={s.color} />
              </Card>
            ))}
          </div>

          {/* Coverage Stats */}
          <Card className="p-6">
            <h3 className="text-sm font-bold mb-4" style={{ color: C.ink }}>Content Coverage</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {([
                { label: 'Temples with images', value: coverage.templesWithImage, total: counts.temples },
                { label: 'Temples with descriptions', value: coverage.templesWithDescription, total: counts.temples },
                { label: 'Temples with slugs', value: coverage.templesWithSlug, total: counts.temples },
                { label: 'Blogs with images', value: coverage.blogsWithImage, total: counts.blogs },
                { label: 'Blogs with excerpts', value: coverage.blogsWithExcerpt, total: counts.blogs },
                { label: 'Devotionals with audio', value: coverage.devotionalsWithAudio, total: counts.devotionals },
              ]).map(c => {
                const pct = c.total > 0 ? Math.round((c.value / c.total) * 100) : 100
                return (
                  <div key={c.label} className="text-center p-3 rounded-xl" style={{ background: pct >= 80 ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)', border: `1px solid ${pct >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}` }}>
                    <div className="text-xl font-extrabold tabular-nums" style={{ color: pct >= 80 ? C.success : C.warning }}>{pct}%</div>
                    <div className="text-[10px] font-semibold mt-1" style={{ color: C.muted }}>{c.label}</div>
                    <div className="text-[10px]" style={{ color: C.faint }}>{c.value}/{c.total}</div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Weakest Content */}
          {weakest.length > 0 && (
            <Card className="overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
                <h3 className="text-sm font-bold" style={{ color: C.ink }}>Weakest Content (Needs Attention)</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: C.danger }}>
                  {weakest.length} items
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                {weakest.slice(0, 10).map(w => (
                  <div key={w.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                      <span className="text-sm">{w.type === 'temple' ? '🛕' : w.type === 'devotional' ? '🎵' : '📝'}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: C.ink }}>{w.title}</p>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize"
                          style={{ background: 'rgba(99,102,241,0.08)', color: C.indigo }}>{w.type}</span>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold tabular-nums flex-shrink-0"
                      style={{ color: w.score < 50 ? C.danger : C.warning }}>{w.score}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CTR Opportunities */}
          {ctrOpportunities.length > 0 && (
            <Card className="p-6">
              <h3 className="text-sm font-bold mb-3" style={{ color: C.ink }}>Rich Snippet Opportunities</h3>
              <p className="text-xs mb-4" style={{ color: C.muted }}>Good SEO score but missing elements for Google rich results</p>
              <div className="space-y-2">
                {ctrOpportunities.map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
                    <span className="text-sm font-semibold truncate" style={{ color: C.ink }}>{o.title}</span>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {o.missing.map(m => (
                        <span key={m} className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: 'rgba(245,158,11,0.1)', color: '#B45309' }}>
                          + {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ════════ ISSUES TAB ════════ */}
      {tab === 'issues' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'temple', 'devotional', 'blog'] as const).map(f => (
              <button key={f} onClick={() => setIssueFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize"
                style={issueFilter === f
                  ? { background: C.saffron, color: '#fff' }
                  : { background: 'rgba(0,0,0,0.04)', color: C.muted, border: `1px solid ${C.border}` }}>
                {f === 'all' ? `All (${health.issues.length})` : `${f}s`}
              </button>
            ))}
          </div>

          <Card className="overflow-hidden">
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {filteredIssues.slice(0, 50).map(iss => (
                <div key={iss.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-4">
                      <span>{iss.type === 'temple' ? '🛕' : iss.type === 'devotional' ? '🎵' : '📝'}</span>
                      <span className="text-sm font-bold truncate" style={{ color: C.ink }}>{iss.title}</span>
                    </div>
                    <span className="text-xs font-extrabold tabular-nums px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: iss.seoScore < 50 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: iss.seoScore < 50 ? C.danger : C.warning }}>
                      {iss.seoScore}/100
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {iss.issues.map((issue, j) => (
                      <span key={j} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.06)', color: '#B91C1C' }}>
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {filteredIssues.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-3xl">🎉</span>
                  <p className="text-sm font-bold mt-2" style={{ color: C.ink }}>No issues found!</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* ════════ INDEX COVERAGE TAB ════════ */}
      {tab === 'index' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6">
            <h3 className="text-sm font-bold mb-4" style={{ color: C.ink }}>Indexable Pages</h3>
            <div className="space-y-3">
              {([
                { label: 'Temple Pages', value: indexCoverage.templePages, icon: '🛕' },
                { label: 'State Hub Pages', value: indexCoverage.stateHubPages, icon: '🗺️' },
                { label: 'City Hub Pages', value: indexCoverage.cityHubPages, icon: '🏙️' },
                { label: 'Deity Hub Pages', value: indexCoverage.deityHubPages, icon: '🕉️' },
                { label: 'Pilgrimage Clusters', value: indexCoverage.pilgrimageClusters, icon: '🚶' },
                { label: 'Blog Pages', value: indexCoverage.blogPages, icon: '📝' },
                { label: 'Static Pages', value: indexCoverage.staticPages, icon: '📄' },
              ]).map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: C.ink }}>{item.label}</span>
                  </div>
                  <span className="text-sm font-extrabold tabular-nums" style={{ color: C.indigo }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="text-2xl font-extrabold" style={{ color: C.indigo }}>{indexCoverage.estimatedTotalIndexable}</p>
              <p className="text-xs font-semibold" style={{ color: C.muted }}>Estimated Total Indexable Pages</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold mb-4" style={{ color: C.ink }}>Quick Links</h3>
            <div className="space-y-3">
              {([
                { label: 'View Sitemap', href: '/sitemap.xml', icon: '🗂️' },
                { label: 'View Robots.txt', href: '/robots.txt', icon: '🤖' },
                { label: 'Google Search Console', href: 'https://search.google.com/search-console', icon: '🔍' },
                { label: 'PageSpeed Insights', href: 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fsarvdev.com', icon: '⚡' },
                { label: 'Rich Results Test', href: 'https://search.google.com/test/rich-results?url=https%3A%2F%2Fsarvdev.com', icon: '✨' },
                { label: 'Mobile-Friendly Test', href: 'https://search.google.com/test/mobile-friendly?url=https%3A%2F%2Fsarvdev.com', icon: '📱' },
              ]).map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                  style={{ border: `1px solid ${C.border}` }}>
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>{link.label}</span>
                  <svg className="w-3.5 h-3.5 ml-auto" style={{ color: C.faint }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ════════ AUTHORITY TAB ════════ */}
      {tab === 'authority' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6">
            <h3 className="text-sm font-bold mb-4" style={{ color: C.ink }}>Top States (Topical Authority)</h3>
            <div className="space-y-3">
              {topStates.map((s, i) => {
                const max = topStates[0]?.count || 1
                return (
                  <div key={s.state}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold" style={{ color: C.ink }}>{s.state}</span>
                      <span className="tabular-nums font-bold" style={{ color: C.muted }}>{s.count}</span>
                    </div>
                    <ProgressBar value={s.count} max={max} color={['#3B82F6','#8B5CF6','#10B981','#FF9933','#EF4444','#F59E0B','#6366F1','#EC4899','#0EA5E9','#14B8A6'][i % 10]} />
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold mb-4" style={{ color: C.ink }}>Top Deities (Content Clusters)</h3>
            <div className="space-y-3">
              {topDeities.map((d, i) => {
                const max = topDeities[0]?.count || 1
                return (
                  <div key={d.deity}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold" style={{ color: C.ink }}>{d.deity}</span>
                      <span className="tabular-nums font-bold" style={{ color: C.muted }}>{d.count}</span>
                    </div>
                    <ProgressBar value={d.count} max={max} color={['#FF9933','#8B5CF6','#3B82F6','#10B981','#EF4444','#EC4899','#F59E0B','#6366F1','#0EA5E9','#14B8A6'][i % 10]} />
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
