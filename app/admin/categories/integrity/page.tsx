'use client'

import { useCallback, useEffect, useState } from 'react'
import { REGISTRY } from '@/lib/sacred-category-registry'

type RegistryStat = { slug: string; count: number }
type OrphanSlug   = { slug: string; count: number; canonicalSlug?: string }
type UnclassifiedTemple = { id: string; title: string; slug: string; city: string; state: string }

type IntegrityData = {
  totalApproved: number
  unclassifiedCount: number
  totalRegistryCategories: number
  usedRegistryCategories: number
  unusedCategories: RegistryStat[]
  orphanSlugs: OrphanSlug[]
  registryStats: RegistryStat[]
}

type UnclassifiedPage = {
  temples: UnclassifiedTemple[]
  total: number
  page: number
  pages: number
}

type DryRunResult = {
  dryRun: boolean
  aliasMap: Record<string, string>
  totalAffected: number
  affected: { _id: string; title: string; city?: string; state?: string; aliasesFound: string[]; current: string[]; normalized: string[] }[]
}

type ExecuteResult = {
  updated: number
  errors: number
  message: string
  errorDetails?: { id: string; title: string; error: string }[]
}

const registryBySlug = new Map(REGISTRY.map(e => [e.slug, e]))

type TabKey = 'overview' | 'unclassified' | 'unused' | 'orphan' | 'all'

export default function CategoryIntegrityPage() {
  const [data, setData]       = useState<IntegrityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [tab, setTab]         = useState<TabKey>('overview')

  // Unclassified tab state
  const [uPage, setUPage]                 = useState(1)
  const [uData, setUData]                 = useState<UnclassifiedPage | null>(null)
  const [uLoading, setULoading]           = useState(false)
  const [uError, setUError]               = useState<string | null>(null)

  // Normalize flow state
  const [dryRun, setDryRun]               = useState<DryRunResult | null>(null)
  const [dryRunLoading, setDryRunLoading] = useState(false)
  const [dryRunError, setDryRunError]     = useState<string | null>(null)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [execResult, setExecResult]       = useState<ExecuteResult | null>(null)
  const [execLoading, setExecLoading]     = useState(false)
  const [execError, setExecError]         = useState<string | null>(null)

  // Load main stats
  useEffect(() => {
    fetch('/api/admin/category-integrity')
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d) })
      .catch(() => setError('Failed to load integrity data'))
      .finally(() => setLoading(false))
  }, [])

  // Load unclassified temples when that tab is active
  const fetchUnclassified = useCallback((page: number) => {
    setULoading(true)
    setUError(null)
    fetch(`/api/admin/category-integrity?tab=unclassified&page=${page}`)
      .then(r => r.json())
      .then(d => { if (d.error) setUError(d.error); else setUData(d) })
      .catch(() => setUError('Failed to load unclassified temples'))
      .finally(() => setULoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'unclassified') fetchUnclassified(uPage)
  }, [tab, uPage, fetchUnclassified])

  // Dry-run
  const runDryRun = () => {
    setDryRunLoading(true)
    setDryRunError(null)
    setDryRun(null)
    setExecResult(null)
    setShowConfirm(false)
    fetch('/api/admin/migrate-category-slugs')
      .then(r => r.json())
      .then(d => { if (d.error) setDryRunError(d.error); else { setDryRun(d); if (d.totalAffected > 0) setShowConfirm(true) } })
      .catch(() => setDryRunError('Dry-run request failed'))
      .finally(() => setDryRunLoading(false))
  }

  // Execute
  const runExecute = () => {
    setExecLoading(true)
    setExecError(null)
    setShowConfirm(false)
    fetch('/api/admin/migrate-category-slugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ execute: true }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) setExecError(d.error)
        else {
          setExecResult(d)
          // Reload main stats to reflect changes
          setLoading(true)
          fetch('/api/admin/category-integrity')
            .then(r => r.json())
            .then(d2 => { if (!d2.error) setData(d2) })
            .finally(() => setLoading(false))
        }
      })
      .catch(() => setExecError('Execute request failed'))
      .finally(() => setExecLoading(false))
  }

  if (loading && !data) {
    return (
      <div className="p-8 text-center text-ink-muted">
        <div className="animate-pulse text-2xl mb-2">⏳</div>
        Running category integrity audit…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-600">
        <div className="text-2xl mb-2">⚠️</div>
        {error || 'Unknown error'}
      </div>
    )
  }

  const classifiedPct = data.totalApproved
    ? (((data.totalApproved - data.unclassifiedCount) / data.totalApproved) * 100).toFixed(1)
    : '0'

  const aliasOrphans  = data.orphanSlugs.filter(o => !!o.canonicalSlug)
  const trueOrphans   = data.orphanSlugs.filter(o => !o.canonicalSlug)

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview',      label: 'Overview' },
    { key: 'unclassified',  label: `Unclassified (${data.unclassifiedCount.toLocaleString()})` },
    { key: 'unused',        label: `Unused (${data.unusedCategories.length})` },
    { key: 'orphan',        label: `Orphan slugs (${data.orphanSlugs.length})` },
    { key: 'all',           label: `All (${data.registryStats.length})` },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-800 mb-1">Category Integrity Audit</h1>
        <p className="text-sm text-ink-muted">Admin-only. Queries live approved-temple data.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Approved Temples"   value={data.totalApproved.toLocaleString()}           color="blue"   />
        <StatCard label="Unclassified"       value={data.unclassifiedCount.toLocaleString()}        color={data.unclassifiedCount > 0 ? 'red' : 'green'}    />
        <StatCard label="Classified %"       value={`${classifiedPct}%`}                           color="green"  />
        <StatCard label="Unused Categories"  value={data.unusedCategories.length.toLocaleString()} color={data.unusedCategories.length > 20 ? 'yellow' : 'green'} />
        <StatCard label="Orphan Slugs"       value={data.orphanSlugs.length.toLocaleString()}      color={data.orphanSlugs.length > 0 ? 'red' : 'green'}    />
        <StatCard label="Alias Orphans"      value={aliasOrphans.length.toLocaleString()}          color={aliasOrphans.length > 0 ? 'yellow' : 'green'}      />
        <StatCard label="Categories In Use"  value={data.usedRegistryCategories.toLocaleString()}  color="blue"   />
        <StatCard label="Registry Total"     value={data.totalRegistryCategories.toLocaleString()} color="blue"   />
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
          <Section title="Summary">
            <ul className="text-sm space-y-1.5 text-ink">
              <li>✅ <strong>{data.usedRegistryCategories}</strong> of {data.totalRegistryCategories} registry categories have at least one temple.</li>
              <li className={data.unclassifiedCount > 0 ? 'text-red-600' : ''}>
                {data.unclassifiedCount > 0 ? '⚠️' : '✅'}{' '}
                <strong>{data.unclassifiedCount.toLocaleString()}</strong> approved temples have no sacredCategorySlugs.
              </li>
              <li className={aliasOrphans.length > 0 ? 'text-yellow-700' : ''}>
                {aliasOrphans.length > 0 ? '🔄' : '✅'}{' '}
                <strong>{aliasOrphans.length}</strong> orphan slug(s) are known aliases (normalizable).
              </li>
              <li className={trueOrphans.length > 0 ? 'text-red-600' : ''}>
                {trueOrphans.length > 0 ? '❌' : '✅'}{' '}
                <strong>{trueOrphans.length}</strong> true orphan slug(s) have no registry mapping.
              </li>
              <li>📊 Coverage: <strong>{classifiedPct}%</strong> of temples are classified.</li>
            </ul>
          </Section>
          <Section title="Top 20 Most-Used Categories">
            <SlugTable rows={data.registryStats.slice(0, 20)} showName />
          </Section>
        </div>
      )}

      {/* ── Unclassified ── */}
      {tab === 'unclassified' && (
        <Section title={`Temples with no sacredCategorySlugs (${data.unclassifiedCount.toLocaleString()} total)`}>
          {data.unclassifiedCount === 0 ? (
            <p className="text-sm text-green-600">All approved temples are classified. ✅</p>
          ) : uLoading ? (
            <p className="text-sm text-ink-muted animate-pulse py-4">Loading…</p>
          ) : uError ? (
            <p className="text-sm text-red-600">{uError}</p>
          ) : uData ? (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-sunken text-ink-muted text-left">
                      <th className="px-3 py-2 border border-surface-border font-medium">Title</th>
                      <th className="px-3 py-2 border border-surface-border font-medium">City</th>
                      <th className="px-3 py-2 border border-surface-border font-medium">State</th>
                      <th className="px-3 py-2 border border-surface-border font-medium">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uData.temples.map(t => (
                      <tr key={t.id} className="border-b border-surface-border hover:bg-surface-sunken">
                        <td className="px-3 py-2 border border-surface-border font-medium">{t.title}</td>
                        <td className="px-3 py-2 border border-surface-border text-ink-muted">{t.city || '—'}</td>
                        <td className="px-3 py-2 border border-surface-border text-ink-muted">{t.state || '—'}</td>
                        <td className="px-3 py-2 border border-surface-border">
                          <a
                            href={`/admin/temples?id=${t.id}`}
                            className="text-xs text-primary-600 hover:underline"
                            target="_blank" rel="noreferrer"
                          >Edit →</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {uData.pages > 1 && (
                <div className="flex items-center gap-3 text-sm">
                  <button
                    disabled={uPage <= 1}
                    onClick={() => setUPage(p => p - 1)}
                    className="px-3 py-1.5 rounded border border-surface-border disabled:opacity-40 hover:bg-surface-sunken transition-colors"
                  >← Prev</button>
                  <span className="text-ink-muted">Page {uPage} of {uData.pages}</span>
                  <button
                    disabled={uPage >= uData.pages}
                    onClick={() => setUPage(p => p + 1)}
                    className="px-3 py-1.5 rounded border border-surface-border disabled:opacity-40 hover:bg-surface-sunken transition-colors"
                  >Next →</button>
                </div>
              )}
            </>
          ) : null}
        </Section>
      )}

      {/* ── Unused ── */}
      {tab === 'unused' && (
        <Section title={`${data.unusedCategories.length} Registry Categories With 0 Temples`}>
          {data.unusedCategories.length === 0
            ? <p className="text-sm text-green-600">All registry categories have at least one temple. ✅</p>
            : <SlugTable rows={data.unusedCategories} emptyLabel="None" showName />
          }
        </Section>
      )}

      {/* ── Orphan slugs ── */}
      {tab === 'orphan' && (
        <div className="space-y-6">
          {data.orphanSlugs.length === 0 ? (
            <p className="text-sm text-green-600">No orphan slugs. ✅</p>
          ) : (
            <>
              {/* Known aliases section */}
              {aliasOrphans.length > 0 && (
                <Section title={`${aliasOrphans.length} Known Alias Slug(s) — normalizable to canonical`}>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-yellow-50 text-yellow-700 text-left">
                          <th className="px-3 py-2 border border-yellow-100 font-medium">Orphan Slug (in DB)</th>
                          <th className="px-3 py-2 border border-yellow-100 font-medium">Maps to</th>
                          <th className="px-3 py-2 border border-yellow-100 font-medium w-24">Temples</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aliasOrphans.map(o => (
                          <tr key={o.slug} className="border-b border-yellow-100 hover:bg-yellow-50">
                            <td className="px-3 py-2 border border-yellow-100 font-mono text-xs text-red-600">{o.slug}</td>
                            <td className="px-3 py-2 border border-yellow-100 font-mono text-xs text-green-700">→ {o.canonicalSlug}</td>
                            <td className="px-3 py-2 border border-yellow-100 text-right font-semibold">{o.count.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Normalize button + flow */}
                  {!execResult && (
                    <div className="mt-4">
                      <button
                        onClick={runDryRun}
                        disabled={dryRunLoading || execLoading}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                      >
                        {dryRunLoading ? 'Running dry-run…' : '🔄 Normalize Known Aliases (dry-run first)'}
                      </button>
                      {dryRunError && <p className="mt-2 text-sm text-red-600">{dryRunError}</p>}
                    </div>
                  )}

                  {/* Dry-run results + confirmation */}
                  {dryRun && !execResult && (
                    <div className="mt-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                      <p className="text-sm font-semibold text-yellow-800 mb-2">
                        Dry-run complete — <strong>{dryRun.totalAffected}</strong> temple(s) would be updated.
                      </p>
                      {dryRun.totalAffected === 0 ? (
                        <p className="text-sm text-green-700">No changes needed. DB is already clean. ✅</p>
                      ) : (
                        <>
                          <div className="max-h-48 overflow-y-auto mb-3">
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="bg-yellow-100 text-yellow-700 text-left">
                                  <th className="px-2 py-1 border border-yellow-200">Temple</th>
                                  <th className="px-2 py-1 border border-yellow-200">Aliases found</th>
                                  <th className="px-2 py-1 border border-yellow-200">After</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dryRun.affected.map(t => (
                                  <tr key={t._id} className="border-b border-yellow-100">
                                    <td className="px-2 py-1 border border-yellow-200">{t.title} {t.city ? `(${t.city})` : ''}</td>
                                    <td className="px-2 py-1 border border-yellow-200 font-mono text-red-600">{t.aliasesFound.join(', ')}</td>
                                    <td className="px-2 py-1 border border-yellow-200 font-mono text-green-700">{t.normalized.join(', ')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {showConfirm && (
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-medium text-red-700">
                                ⚠️ This will update {dryRun.totalAffected} temple record(s). Continue?
                              </span>
                              <button
                                onClick={runExecute}
                                disabled={execLoading}
                                className="px-4 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                              >
                                {execLoading ? 'Executing…' : 'Confirm & Execute'}
                              </button>
                              <button
                                onClick={() => { setShowConfirm(false); setDryRun(null) }}
                                className="px-4 py-1.5 text-sm font-medium rounded-lg border border-surface-border hover:bg-surface-sunken transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {execError && <p className="mt-2 text-sm text-red-600">{execError}</p>}
                        </>
                      )}
                    </div>
                  )}

                  {/* Execute result */}
                  {execResult && (
                    <div className={`mt-4 p-4 rounded-lg border ${execResult.errors === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className={`text-sm font-semibold ${execResult.errors === 0 ? 'text-green-800' : 'text-red-800'}`}>
                        {execResult.errors === 0 ? '✅' : '⚠️'} {execResult.message}
                      </p>
                      {execResult.errorDetails && execResult.errorDetails.length > 0 && (
                        <ul className="mt-2 text-xs text-red-700 list-disc list-inside">
                          {execResult.errorDetails.map(e => <li key={e.id}>{e.title}: {e.error}</li>)}
                        </ul>
                      )}
                    </div>
                  )}
                </Section>
              )}

              {/* True orphans section */}
              {trueOrphans.length > 0 && (
                <Section title={`${trueOrphans.length} True Orphan Slug(s) — no registry mapping`}>
                  <p className="text-sm text-ink-muted mb-3">
                    These slugs have no alias entry. Add them to <code className="bg-surface-sunken px-1 rounded">lib/sacred-categories.ts</code> SLUG_ALIASES or to SACRED_CATEGORIES.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-red-50 text-red-700 text-left">
                          <th className="px-3 py-2 border border-red-100 font-medium">Unknown Slug</th>
                          <th className="px-3 py-2 border border-red-100 font-medium w-24">Temples</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trueOrphans.map(o => (
                          <tr key={o.slug} className="border-b border-red-100 hover:bg-red-50">
                            <td className="px-3 py-2 border border-red-100 font-mono text-xs text-red-700">{o.slug}</td>
                            <td className="px-3 py-2 border border-red-100 text-right font-semibold">{o.count.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}
            </>
          )}
        </div>
      )}

      {/* ── All categories ── */}
      {tab === 'all' && (
        <Section title="All Registry Categories (sorted by temple count)">
          <SlugTable rows={data.registryStats} showName />
        </Section>
      )}
    </div>
  )
}

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

function SlugTable({ rows, emptyLabel, showName }: { rows: RegistryStat[]; emptyLabel?: string; showName?: boolean }) {
  if (!rows.length) return <p className="text-sm text-ink-muted">{emptyLabel ?? 'None'}</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-surface-sunken text-ink-muted text-left">
            <th className="px-3 py-2 border border-surface-border font-medium">Slug</th>
            {showName && <th className="px-3 py-2 border border-surface-border font-medium">Name</th>}
            <th className="px-3 py-2 border border-surface-border font-medium w-24">Temples</th>
            {showName && <th className="px-3 py-2 border border-surface-border font-medium">Group</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const entry = registryBySlug.get(row.slug)
            return (
              <tr key={row.slug} className={`border-b border-surface-border hover:bg-surface-sunken ${row.count === 0 ? 'text-ink-muted' : ''}`}>
                <td className="px-3 py-2 border border-surface-border font-mono text-xs">{row.slug}</td>
                {showName && <td className="px-3 py-2 border border-surface-border">{entry?.name ?? <span className="text-red-500 text-xs">Not in registry</span>}</td>}
                <td className="px-3 py-2 border border-surface-border text-right font-medium">
                  {row.count === 0 ? <span className="text-ink-faint">—</span> : row.count.toLocaleString()}
                </td>
                {showName && <td className="px-3 py-2 border border-surface-border text-xs text-ink-muted">{entry?.group ?? '—'}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
