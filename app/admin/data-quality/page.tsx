'use client'

import { useCallback, useEffect, useState } from 'react'
import { QUALITY_CRITERIA, TIER_CONFIG, getQualityTier, getQualityIssues, type QualityTier } from '@/lib/temple-quality'

type Distribution = { total: number; excellent: number; good: number; needsWork: number; poor: number; avgScore: number }
type OverviewData  = { tab: string; totalAll: number; distribution: Distribution; issueCounts: Record<string, number> }
type ListData      = { tab: string; temples: any[]; total: number; page: number; pages: number; nonCloudinaryCount?: number }
type DupData       = { slugDuplicates: any[]; titleCityDuplicates: any[]; coordDuplicates: any[]; mapsDuplicates: any[]; summary: Record<string, number> }
type TabKey        = 'overview' | 'seo' | 'location' | 'images' | 'duplicates' | 'queue' | 'export'

export function QualityBadge({ score }: { score: number }) {
  const cfg = TIER_CONFIG[getQualityTier(score)]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      {cfg.label} <span className="opacity-60 font-normal">{score}</span>
    </span>
  )
}

function Check({ ok }: { ok: boolean }) {
  return <td className={`px-3 py-2 border border-surface-border text-center text-sm ${ok ? 'text-green-600' : 'text-red-500'}`}>{ok ? '✓' : '✗'}</td>
}

function Spinner() { return <div className="p-8 text-center text-ink-muted animate-pulse">Loading…</div> }

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-green-50 text-green-700 border-green-100', red: 'bg-red-50 text-red-700 border-red-100', yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100' }
  return <div className={`rounded-lg border p-4 ${colors[color] ?? colors.blue}`}><div className="text-2xl font-bold">{value}</div><div className="text-xs mt-0.5 opacity-80">{label}</div></div>
}

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  return (
    <div className="flex gap-2 mt-4">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="px-3 py-1 text-sm border border-surface-border rounded disabled:opacity-40 hover:bg-surface-sunken">← Prev</button>
      <span className="px-3 py-1 text-sm text-ink-muted">Page {page} of {pages}</span>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="px-3 py-1 text-sm border border-surface-border rounded disabled:opacity-40 hover:bg-surface-sunken">Next →</button>
    </div>
  )
}

export default function DataQualityPage() {
  const [tab, setTab]           = useState<TabKey>('overview')
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [listData, setListData] = useState<ListData | null>(null)
  const [dupData, setDupData]   = useState<DupData | null>(null)
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(1)
  const [error, setError]       = useState<string | null>(null)

  const fetchOverview = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/data-quality').then(r => r.json()).then(d => d.error ? setError(d.error) : setOverview(d)).catch(() => setError('Failed')).finally(() => setLoading(false))
  }, [])

  const fetchList = useCallback((t: TabKey, p: number) => {
    setLoading(true)
    fetch(`/api/admin/data-quality?tab=${t}&page=${p}`).then(r => r.json()).then(d => d.error ? setError(d.error) : setListData(d)).catch(() => setError('Failed')).finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchOverview() }, [fetchOverview])

  useEffect(() => {
    setPage(1); setListData(null)
    if (tab === 'duplicates' && !dupData) {
      setLoading(true)
      fetch('/api/admin/data-quality/duplicates').then(r => r.json()).then(d => d.error ? setError(d.error) : setDupData(d)).catch(() => setError('Failed')).finally(() => setLoading(false))
    } else if (tab !== 'overview' && tab !== 'duplicates' && tab !== 'export') {
      fetchList(tab, 1)
    }
  }, [tab])

  useEffect(() => {
    if (tab !== 'overview' && tab !== 'duplicates' && tab !== 'export') fetchList(tab, page)
  }, [page])

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' }, { key: 'seo', label: 'SEO' },
    { key: 'location', label: 'Location' }, { key: 'images', label: 'Images' },
    { key: 'duplicates', label: 'Duplicates' }, { key: 'queue', label: 'Fix Queue' },
    { key: 'export', label: 'Export' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-800 mb-1">Data Quality Platform</h1>
        <p className="text-sm text-ink-muted">Read-only audit of temple data completeness and integrity.</p>
      </div>

      <div className="flex flex-wrap gap-1 mb-6 border-b border-surface-border">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t border-b-2 transition-colors ${tab === t.key ? 'border-primary-500 text-primary-600' : 'border-transparent text-ink-muted hover:text-ink'}`}
          >{t.label}</button>
        ))}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error} <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button></div>}

      {tab === 'overview' && (loading && !overview ? <Spinner /> : overview ? <OverviewTab data={overview} /> : null)}
      {(tab === 'seo' || tab === 'location' || tab === 'images' || tab === 'queue') && (loading && !listData ? <Spinner /> : listData ? <ListTab data={listData} tabKey={tab} page={page} onPage={setPage} /> : null)}
      {tab === 'duplicates' && (loading ? <Spinner /> : dupData ? <DuplicatesTab data={dupData} /> : null)}
      {tab === 'export' && <ExportTab />}
    </div>
  )
}

// ── Overview ──────────────────────────────────────────────────────────────────

function OverviewTab({ data }: { data: OverviewData }) {
  const d     = data.distribution
  const total = d.total || 1
  const DIST  = [
    { key: 'excellent' as const, tier: 'excellent'   as QualityTier },
    { key: 'good'      as const, tier: 'good'        as QualityTier },
    { key: 'needsWork' as const, tier: 'needs-work'  as QualityTier },
    { key: 'poor'      as const, tier: 'poor'        as QualityTier },
  ]
  const KEY_MAP: Record<string, string> = {
    cardImage: 'missingCardImage', heroImage: 'missingHeroImage', coordinates: 'missingCoords',
    city: 'missingCity', state: 'missingState', description: 'shortDescription',
    descriptionHi: 'missingDescHi', deity: 'missingDeity', sacredCategory: 'missingCategory',
    metaTitle: 'missingMetaTitle', metaDescription: 'missingMetaDesc', ogImage: 'missingOgImage',
    shortDescription: 'missingShortDesc', contact: 'noContact', timings: 'missingTimings',
  }
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Temples"      value={data.totalAll.toLocaleString()}                color="blue"   />
        <StatCard label="Avg Quality Score"  value={`${Math.round(d.avgScore ?? 0)}/100`}          color={(d.avgScore ?? 0) >= 70 ? 'green' : 'yellow'} />
        <StatCard label="Excellent (90+)"    value={d.excellent.toLocaleString()}                  color="green"  />
        <StatCard label="Good (70–89)"       value={d.good.toLocaleString()}                       color="blue"   />
        <StatCard label="Needs Work (50–69)" value={d.needsWork.toLocaleString()}                  color="yellow" />
        <StatCard label="Poor (<50)"         value={d.poor.toLocaleString()}                       color="red"    />
      </div>

      <div>
        <h2 className="text-base font-semibold text-secondary-700 mb-3">Quality Distribution</h2>
        <div className="flex gap-0.5 h-10 rounded-lg overflow-hidden border border-surface-border">
          {DIST.map(({ key, tier }) => {
            const count = d[key] as number
            const pct   = Math.round((count / total) * 100)
            const cfg   = TIER_CONFIG[tier]
            return pct > 0 ? (
              <div key={tier} title={`${cfg.label}: ${count} (${pct}%)`} style={{ width: `${pct}%` }}
                className={`${cfg.bg} ${cfg.color} flex items-center justify-center text-[11px] font-bold`}>
                {pct > 8 ? `${pct}%` : ''}
              </div>
            ) : null
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          {DIST.map(({ key, tier }) => {
            const count = d[key] as number
            const cfg   = TIER_CONFIG[tier]
            return (
              <div key={tier} className="flex items-center gap-1.5 text-sm">
                <span className={`w-3 h-3 rounded-sm ${cfg.bg} border ${cfg.border}`} />
                <span className="text-ink-muted">{cfg.label}</span>
                <span className="font-semibold">{count.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-secondary-700 mb-3">Issues by Criterion</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-surface-sunken text-ink-muted text-left text-xs uppercase">
                <th className="px-3 py-2 border border-surface-border">Issue</th>
                <th className="px-3 py-2 border border-surface-border w-16 text-right">Pts</th>
                <th className="px-3 py-2 border border-surface-border w-32 text-right">Temples Affected</th>
                <th className="px-3 py-2 border border-surface-border w-20 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {QUALITY_CRITERIA.map(c => {
                const count = data.issueCounts[KEY_MAP[c.id] ?? c.id] ?? 0
                const pct   = data.totalAll > 0 ? Math.round((count / data.totalAll) * 100) : 0
                return (
                  <tr key={c.id} className="border-b border-surface-border hover:bg-surface-sunken">
                    <td className="px-3 py-2 border border-surface-border text-ink">{c.issueLabel}</td>
                    <td className="px-3 py-2 border border-surface-border text-right text-ink-muted">{c.points}</td>
                    <td className={`px-3 py-2 border border-surface-border text-right font-semibold ${count > 0 ? 'text-red-600' : 'text-green-600'}`}>{count > 0 ? count.toLocaleString() : '✓'}</td>
                    <td className="px-3 py-2 border border-surface-border text-right text-xs text-ink-muted">{count > 0 ? `${pct}%` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── List Tab ──────────────────────────────────────────────────────────────────

function ListTab({ data, tabKey, page, onPage }: { data: ListData; tabKey: TabKey; page: number; onPage: (p: number) => void }) {
  return (
    <div>
      <p className="text-sm text-ink-muted mb-4">
        {data.total.toLocaleString()} temples with issues
        {tabKey === 'images' && data.nonCloudinaryCount != null && <span className="ml-3 text-yellow-700 font-semibold">· {data.nonCloudinaryCount.toLocaleString()} non-Cloudinary images</span>}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-surface-sunken text-ink-muted text-left text-xs uppercase">
              <th className="px-3 py-2 border border-surface-border">Temple</th>
              {tabKey === 'seo'      && <><th className="px-3 py-2 border border-surface-border w-24 text-center">Meta Title</th><th className="px-3 py-2 border border-surface-border w-24 text-center">Meta Desc</th><th className="px-3 py-2 border border-surface-border w-20 text-center">OG Image</th><th className="px-3 py-2 border border-surface-border w-20 text-center">Canonical</th></>}
              {tabKey === 'location' && <><th className="px-3 py-2 border border-surface-border w-32">City / State</th><th className="px-3 py-2 border border-surface-border w-24 text-center">Lat</th><th className="px-3 py-2 border border-surface-border w-24 text-center">Lng</th></>}
              {tabKey === 'images'   && <><th className="px-3 py-2 border border-surface-border w-24 text-center">Card Image</th><th className="px-3 py-2 border border-surface-border w-24 text-center">Hero Image</th></>}
              {tabKey === 'queue'    && <><th className="px-3 py-2 border border-surface-border w-24 text-right">Score</th><th className="px-3 py-2 border border-surface-border">Top Issues</th></>}
              <th className="px-3 py-2 border border-surface-border w-14">Edit</th>
            </tr>
          </thead>
          <tbody>
            {data.temples.map((t: any, i: number) => (
              <tr key={String(t._id) + i} className="border-b border-surface-border hover:bg-surface-sunken">
                <td className="px-3 py-2 border border-surface-border">
                  <div className="font-medium text-ink truncate max-w-[200px]">{t.title}</div>
                  <div className="text-xs text-ink-muted">{[t.city, t.state].filter(Boolean).join(', ')}</div>
                </td>
                {tabKey === 'seo' && <>
                  <Check ok={!!t.metaTitle} /><Check ok={!!t.metaDescription} />
                  <Check ok={!!t.ogImage} /><Check ok={!!t.canonicalUrl} />
                </>}
                {tabKey === 'location' && <>
                  <td className="px-3 py-2 border border-surface-border text-xs">{t.city || <span className="text-red-500">—</span>}{t.state ? `, ${t.state}` : ''}</td>
                  <td className={`px-3 py-2 border border-surface-border text-xs text-center ${t.latitude && t.latitude !== 0 ? 'text-green-600' : 'text-red-500'}`}>{t.latitude || '—'}</td>
                  <td className={`px-3 py-2 border border-surface-border text-xs text-center ${t.longitude && t.longitude !== 0 ? 'text-green-600' : 'text-red-500'}`}>{t.longitude || '—'}</td>
                </>}
                {tabKey === 'images' && <>
                  <Check ok={!!(t.imageCard || t.image)} />
                  <Check ok={!!(t.imageHero || t.heroImage)} />
                </>}
                {tabKey === 'queue' && <>
                  <td className="px-3 py-2 border border-surface-border text-right"><QualityBadge score={Math.round(t._qs ?? 0)} /></td>
                  <td className="px-3 py-2 border border-surface-border text-xs text-ink-muted">
                    {getQualityIssues(t).slice(0, 3).map(iss => <div key={iss.field}>· {iss.label}</div>)}
                  </td>
                </>}
                <td className="px-3 py-2 border border-surface-border text-center">
                  <a href={`/admin/temples?id=${t._id}`} className="text-primary-600 hover:underline text-xs font-medium">Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pages={data.pages} onPage={onPage} />
    </div>
  )
}

// ── Duplicates Tab ────────────────────────────────────────────────────────────

function DuplicatesTab({ data }: { data: DupData }) {
  const s = data.summary
  if (s.totalGroups === 0) return <p className="text-sm text-green-600 p-4">No duplicates found. ✅</p>
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Slug Duplicates"       value={s.slugGroups.toString()}      color={s.slugGroups > 0 ? 'red' : 'green'} />
        <StatCard label="Title+City Duplicates" value={s.titleCityGroups.toString()} color={s.titleCityGroups > 0 ? 'yellow' : 'green'} />
        <StatCard label="Coord Duplicates"      value={s.coordGroups.toString()}     color={s.coordGroups > 0 ? 'yellow' : 'green'} />
        <StatCard label="Maps URL Duplicates"   value={s.mapsGroups.toString()}      color={s.mapsGroups > 0 ? 'yellow' : 'green'} />
      </div>

      {data.slugDuplicates.length > 0 && (
        <DupSection title="Same Slug" rows={data.slugDuplicates.map((d: any) => ({ key: d.slug, count: d.count, detail: (d.titles ?? []).join(' · ') }))} />
      )}
      {data.titleCityDuplicates.length > 0 && (
        <DupSection title="Same Title + City" rows={data.titleCityDuplicates.map((d: any) => ({ key: `${d.title} / ${d.city}`, count: d.count, detail: (d.slugs ?? []).join(' · ') }))} />
      )}
      {data.coordDuplicates.length > 0 && (
        <DupSection title="Same GPS Coordinates" rows={data.coordDuplicates.map((d: any) => ({ key: `${d.lat}, ${d.lng}`, count: d.count, detail: (d.titles ?? []).join(' · ') }))} />
      )}
      {data.mapsDuplicates.length > 0 && (
        <DupSection title="Same Maps URL" rows={data.mapsDuplicates.map((d: any) => ({ key: String(d.mapsUrl).slice(0, 60) + '…', count: d.count, detail: (d.titles ?? []).join(' · ') }))} />
      )}
    </div>
  )
}

function DupSection({ title, rows }: { title: string; rows: { key: string; count: number; detail: string }[] }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-secondary-700 mb-2">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-surface-sunken text-ink-muted text-left text-xs uppercase">
              <th className="px-3 py-2 border border-surface-border">Key</th>
              <th className="px-3 py-2 border border-surface-border w-16">Count</th>
              <th className="px-3 py-2 border border-surface-border">Temples</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-surface-border hover:bg-surface-sunken">
                <td className="px-3 py-2 border border-surface-border font-mono text-xs">{r.key}</td>
                <td className="px-3 py-2 border border-surface-border text-center font-semibold text-red-600">{r.count}</td>
                <td className="px-3 py-2 border border-surface-border text-xs text-ink-muted truncate max-w-sm">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Export Tab ────────────────────────────────────────────────────────────────

function ExportTab() {
  const REPORTS = [
    { type: 'seo',        label: 'SEO Report',        desc: 'metaTitle, metaDescription, ogImage, canonical per temple' },
    { type: 'images',     label: 'Image Report',       desc: 'card image, hero image, Cloudinary status per temple' },
    { type: 'location',   label: 'Location Report',    desc: 'lat/lng, city, state, coordinate validity per temple' },
    { type: 'duplicates', label: 'Duplicates Report',  desc: 'slug, title+city, coordinate duplicate groups' },
  ]
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">CSV exports. Each file contains up to 5,000 temples. Admin-only.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map(r => (
          <div key={r.type} className="p-4 border border-surface-border rounded-lg bg-white">
            <p className="font-semibold text-ink mb-1">{r.label}</p>
            <p className="text-xs text-ink-muted mb-3">{r.desc}</p>
            <a href={`/api/admin/data-quality/export?type=${r.type}`} download
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-600 transition-colors">
              ↓ Download CSV
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
