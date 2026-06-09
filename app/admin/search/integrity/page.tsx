'use client'

import { useCallback, useEffect, useState } from 'react'
import { SYNONYM_GROUP_COUNT, SYNONYM_TERM_COUNT } from '@/lib/search-synonyms'
import { SUPPORTED_PROVIDERS, PROVIDER_META } from '@/lib/search-providers'

type TopQuery    = { query: string; count: number; avgResults: number; lastSeen: string }
type ZeroQuery   = { query: string; count: number; lastSeen: string }
type SlowQuery   = { query: string; maxMs: number; avgMs: number; count: number }
type ProviderInfo = { name: string; label: string; description: string; fuzzy: boolean; vector: boolean }

type StatsData = {
  totals:              { last24h: number; last7d: number; last30d: number }
  avgDurationMs:       number | null
  topQueries:          TopQuery[]
  zeroResultQueries:   ZeroQuery[]
  slowQueries:         SlowQuery[]
  provider:            ProviderInfo
  availableProviders:  { name: string; label: string; productionReady: boolean }[]
}

type PopularData = {
  period:     string
  topQueries: TopQuery[]
}

type TabKey = 'overview' | 'popular' | 'zero' | 'slow' | 'providers'
type Period = 'daily' | 'weekly' | 'monthly'

export default function SearchIntegrityPage() {
  const [stats, setStats]       = useState<StatsData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [tab, setTab]           = useState<TabKey>('overview')

  const [period, setPeriod]         = useState<Period>('weekly')
  const [popular, setPopular]       = useState<PopularData | null>(null)
  const [popLoading, setPopLoading] = useState(false)

  // Load main stats
  useEffect(() => {
    fetch('/api/admin/search')
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setStats(d) })
      .catch(() => setError('Failed to load search analytics'))
      .finally(() => setLoading(false))
  }, [])

  // Load popular queries for selected period
  const fetchPopular = useCallback((p: Period) => {
    setPopLoading(true)
    fetch(`/api/admin/search?tab=popular&period=${p}`)
      .then(r => r.json())
      .then(d => { if (!d.error) setPopular(d) })
      .catch(() => {})
      .finally(() => setPopLoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'popular') fetchPopular(period)
  }, [tab, period, fetchPopular])

  if (loading) {
    return (
      <div className="p-8 text-center text-ink-muted">
        <div className="animate-pulse text-2xl mb-2">⏳</div>
        Loading search analytics…
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-red-600">
        <div className="text-2xl mb-2">⚠️</div>
        {error || 'Unknown error'}
      </div>
    )
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview',  label: 'Overview' },
    { key: 'popular',   label: `Top Queries` },
    { key: 'zero',      label: `Zero Results (${stats.zeroResultQueries.length})` },
    { key: 'slow',      label: `Slow Queries (${stats.slowQueries.length})` },
    { key: 'providers', label: 'Providers' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-800 mb-1">Search Health Dashboard</h1>
        <p className="text-sm text-ink-muted">Admin-only. Live data from SearchLog collection.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Searches (24h)"   value={stats.totals.last24h.toLocaleString()}  color="blue"   />
        <StatCard label="Searches (7d)"    value={stats.totals.last7d.toLocaleString()}   color="blue"   />
        <StatCard label="Searches (30d)"   value={stats.totals.last30d.toLocaleString()}  color="blue"   />
        <StatCard label="Avg Duration"
          value={stats.avgDurationMs != null ? `${stats.avgDurationMs}ms` : '—'}
          color={stats.avgDurationMs != null && stats.avgDurationMs > 800 ? 'red' : 'green'}
        />
        <StatCard label="Provider"         value={stats.provider.name.toUpperCase()}       color="blue"   />
        <StatCard label="Synonym Groups"   value={SYNONYM_GROUP_COUNT.toString()}          color="green"  />
        <StatCard label="Synonym Terms"    value={SYNONYM_TERM_COUNT.toLocaleString()}     color="green"  />
        <StatCard label="Zero-Result (7d)" value={stats.zeroResultQueries.length.toString()} color={stats.zeroResultQueries.length > 5 ? 'yellow' : 'green'} />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-surface-border">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t border-b-2 transition-colors ${
              tab === t.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <Section title="Provider">
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Active:</span> {stats.provider.label}</p>
              <p className="text-ink-muted">{stats.provider.description}</p>
              <div className="flex gap-3 mt-2">
                <Badge active={true}>Full-text ✓</Badge>
                <Badge active={stats.provider.fuzzy}>Fuzzy</Badge>
                <Badge active={stats.provider.vector}>Vector</Badge>
              </div>
            </div>
          </Section>

          <Section title="Synonym Registry">
            <p className="text-sm text-ink-muted mb-3">
              <strong>{SYNONYM_GROUP_COUNT}</strong> synonym groups ·{' '}
              <strong>{SYNONYM_TERM_COUNT}</strong> indexed terms (English + Devanagari).
              Powers transliteration-aware search.
            </p>
            <div className="flex flex-wrap gap-2">
              {['shiv → mahadev → shankar', 'hanuman → bajrangbali → anjaneya',
                'ganesh → ganpati → vinayak', 'krishna → govind → kanha',
                'durga → amba → bhavani', 'saraswati → sharada'].map(ex => (
                <span key={ex} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-mono">
                  {ex}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Top 10 Searches (Last 7 Days)">
            <QueryTable rows={stats.topQueries.slice(0, 10)} showResults />
          </Section>
        </div>
      )}

      {/* ── Popular queries ── */}
      {tab === 'popular' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  period === p
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-surface-border text-ink-muted hover:bg-surface-sunken'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          {popLoading ? (
            <p className="text-sm text-ink-muted animate-pulse">Loading…</p>
          ) : popular ? (
            <Section title={`Top searches — ${popular.period}`}>
              <QueryTable rows={popular.topQueries} showResults />
            </Section>
          ) : null}
        </div>
      )}

      {/* ── Zero results ── */}
      {tab === 'zero' && (
        <Section title="Queries With Zero Results (Last 7 Days)">
          {stats.zeroResultQueries.length === 0 ? (
            <p className="text-sm text-green-600">No zero-result queries in the last 7 days. ✅</p>
          ) : (
            <>
              <p className="text-sm text-ink-muted mb-3">
                These queries returned 0 results. Consider adding synonym mappings or content.
              </p>
              <QueryTable rows={stats.zeroResultQueries} />
            </>
          )}
        </Section>
      )}

      {/* ── Slow queries ── */}
      {tab === 'slow' && (
        <Section title="Slow Queries > 800ms (Last 24 Hours)">
          {stats.slowQueries.length === 0 ? (
            <p className="text-sm text-green-600">No slow queries in the last 24 hours. ✅</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-surface-sunken text-ink-muted text-left">
                    <th className="px-3 py-2 border border-surface-border font-medium">Query</th>
                    <th className="px-3 py-2 border border-surface-border font-medium w-24">Max (ms)</th>
                    <th className="px-3 py-2 border border-surface-border font-medium w-24">Avg (ms)</th>
                    <th className="px-3 py-2 border border-surface-border font-medium w-20">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.slowQueries.map((r, i) => (
                    <tr key={i} className="border-b border-surface-border hover:bg-surface-sunken">
                      <td className="px-3 py-2 border border-surface-border font-mono text-xs">{r.query}</td>
                      <td className={`px-3 py-2 border border-surface-border text-right font-semibold ${r.maxMs > 2000 ? 'text-red-600' : 'text-yellow-700'}`}>{r.maxMs}</td>
                      <td className="px-3 py-2 border border-surface-border text-right">{r.avgMs}</td>
                      <td className="px-3 py-2 border border-surface-border text-right">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {/* ── Providers ── */}
      {tab === 'providers' && (
        <Section title="Available Search Providers">
          <div className="space-y-3">
            {SUPPORTED_PROVIDERS.map(pName => {
              const meta = PROVIDER_META[pName]
              const isActive = pName === stats.provider.name
              return (
                <div key={pName} className={`p-4 rounded-lg border ${isActive ? 'border-primary-300 bg-primary-50' : 'border-surface-border bg-white'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-ink">
                        {meta.label}
                        {isActive && <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">Active</span>}
                        {!meta.productionReady && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Coming soon</span>}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">{meta.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Badge active={meta.supportsFullText}>Full-text</Badge>
                      <Badge active={meta.supportsFuzzy}>Fuzzy</Badge>
                      <Badge active={meta.supportsVector}>Vector</Badge>
                    </div>
                  </div>
                  {meta.requiresEnv.length > 0 && (
                    <p className="mt-2 text-xs text-ink-muted font-mono">
                      Requires: {meta.requiresEnv.join(', ')}
                    </p>
                  )}
                  {pName === 'atlas' && (
                    <p className="mt-1 text-xs text-blue-600">
                      To activate: create Atlas Search indexes → set SEARCH_PROVIDER=atlas
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </Section>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string; color: 'blue' | 'green' | 'red' | 'yellow' }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    green:  'bg-green-50 text-green-700 border-green-100',
    red:    'bg-red-50 text-red-700 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  }
  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-0.5 opacity-80">{label}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-secondary-700 mb-3">{title}</h2>
      {children}
    </div>
  )
}

function Badge({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
      {children}
    </span>
  )
}

function QueryTable({ rows, showResults }: { rows: Array<{ query: string; count: number; avgResults?: number; lastSeen?: string }>; showResults?: boolean }) {
  if (!rows.length) return <p className="text-sm text-ink-muted">No data.</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-surface-sunken text-ink-muted text-left">
            <th className="px-3 py-2 border border-surface-border font-medium">#</th>
            <th className="px-3 py-2 border border-surface-border font-medium">Query</th>
            <th className="px-3 py-2 border border-surface-border font-medium w-20">Searches</th>
            {showResults && <th className="px-3 py-2 border border-surface-border font-medium w-24">Avg Results</th>}
            <th className="px-3 py-2 border border-surface-border font-medium w-28">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-surface-border hover:bg-surface-sunken">
              <td className="px-3 py-2 border border-surface-border text-ink-muted text-xs">{i + 1}</td>
              <td className="px-3 py-2 border border-surface-border font-mono text-xs font-semibold">{r.query}</td>
              <td className="px-3 py-2 border border-surface-border text-right font-semibold">{r.count.toLocaleString()}</td>
              {showResults && (
                <td className={`px-3 py-2 border border-surface-border text-right text-xs ${(r.avgResults ?? 1) === 0 ? 'text-red-500' : ''}`}>
                  {r.avgResults ?? '—'}
                </td>
              )}
              <td className="px-3 py-2 border border-surface-border text-xs text-ink-muted">
                {r.lastSeen ? new Date(r.lastSeen).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
