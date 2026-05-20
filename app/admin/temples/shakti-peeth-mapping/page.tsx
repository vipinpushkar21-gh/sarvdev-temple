"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type CanonicalEntry = {
  key: string
  name: string
  aliases: string[]
  state: string
  country: string
  shaktiName?: string
  bhairavName?: string
  bodyPart?: string
}

type TempleSummary = {
  id: string
  title: string
  slug?: string
  deity?: string
  city?: string
  state?: string
  country?: string
  status?: string
  canonicalShaktiPeeth?: boolean
  canonicalShaktiPeethKey?: string
  canonicalShaktiPeethName?: string
  canonicalMatch?: { key: string; name: string } | null
  mappedMatch?: { key: string; name: string } | null
}

type Candidate = {
  temple: TempleSummary
  score: number
  reasons: string[]
}

type MappingEntry = {
  entry: CanonicalEntry
  matched: boolean
  matchedBy: 'metadata' | 'matcher' | null
  matchedTemple: TempleSummary | null
  candidates: Candidate[]
}

type MappingResponse = {
  ok: boolean
  summary: {
    matchedCanonicalCount: number
    unmatchedCanonicalCount: number
    extraTaggedNonCanonicalCount: number
    mappedTodayCount: number
  }
  entries: MappingEntry[]
  extraTaggedNonCanonicalTemples: TempleSummary[]
}

const CREATE_LATER = '__create_later'
const IGNORE = '__ignore'

function place(temple?: TempleSummary | null): string {
  if (!temple) return ''
  return [temple.city, temple.state, temple.country].filter(Boolean).join(', ')
}

function statusBadge(entry: MappingEntry): string {
  if (!entry.matched) return 'admin-badge-yellow'
  return entry.matchedBy === 'metadata' ? 'admin-badge-green' : 'admin-badge-blue'
}

export default function ShaktiPeethMappingPage() {
  const [data, setData] = useState<MappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingKey, setSavingKey] = useState('')
  const [selection, setSelection] = useState<Record<string, string>>({})
  const [localDecisions, setLocalDecisions] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')

  async function loadMapping() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/temples/shakti-peeth-mapping', { cache: 'no-store' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Unable to load Shakti Peeth mapping')
      setData(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load Shakti Peeth mapping.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMapping()
  }, [])

  const entries = data?.entries || []
  const unmatchedEntries = useMemo(() => entries.filter(item => !item.matched), [entries])

  async function confirmMapping(item: MappingEntry) {
    const templeId = selection[item.entry.key]
    if (!templeId || templeId === CREATE_LATER || templeId === IGNORE) {
      setLocalDecisions(prev => ({
        ...prev,
        [item.entry.key]: templeId === CREATE_LATER ? 'Create later selected. No database changes made.' : templeId === IGNORE ? 'Ignored for now. No database changes made.' : 'Select an existing temple first.',
      }))
      return
    }

    const candidate = item.candidates.find(row => row.temple.id === templeId)
    const templeTitle = candidate?.temple.title || 'selected temple'
    if (!confirm(`Map "${templeTitle}" to "${item.entry.name}"? Existing title, description and images will not be changed.`)) {
      return
    }

    setSavingKey(item.entry.key)
    setNotice('')
    setLocalDecisions(prev => ({ ...prev, [item.entry.key]: '' }))

    try {
      const res = await fetch('/api/admin/temples/shakti-peeth-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canonicalKey: item.entry.key,
          templeId,
        }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Unable to save mapping')

      setNotice(`${payload.temple.title} mapped to ${payload.canonical.name}. ${payload.logCreated ? 'Audit log created.' : 'Audit log unavailable.'}`)
      setSelection(prev => ({ ...prev, [item.entry.key]: '' }))
      await loadMapping()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save mapping.'
      setLocalDecisions(prev => ({ ...prev, [item.entry.key]: message }))
    } finally {
      setSavingKey('')
    }
  }

  if (loading && !data) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="admin-page-title">Shakti Peeth Mapping</h1>
            <p className="admin-section-subtitle">Loading canonical mapping assistant...</p>
          </div>
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back to Temples</Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Shakti Peeth Mapping</h1>
          <p className="admin-section-subtitle">Human-reviewed canonical mapping for the Sarvdev 51 list.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadMapping} disabled={loading} className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50">
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back to Temples</Link>
        </div>
      </div>

      {error && (
        <div className="admin-card p-4" style={{ background: '#FEF2F2', borderColor: 'rgba(220,38,38,0.15)' }}>
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {notice && (
        <div className="admin-card p-4" style={{ background: '#ECFDF5', borderColor: 'rgba(5,150,105,0.15)' }}>
          <p className="text-sm font-semibold text-green-700">{notice}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="admin-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Matched canonical</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.summary.matchedCanonicalCount || 0}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Unmatched canonical</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.summary.unmatchedCanonicalCount || 0}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Extra tagged</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.summary.extraTaggedNonCanonicalCount || 0}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Mapped today</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data?.summary.mappedTodayCount || 0}</p>
        </div>
      </div>

      <div className="admin-card p-4" style={{ background: '#FFFBEB', borderColor: 'rgba(217,119,6,0.16)' }}>
        <p className="text-sm font-semibold text-amber-900">Mapping only adds canonical metadata.</p>
        <p className="mt-1 text-xs text-amber-700">It does not rename temples, rewrite descriptions, replace images, delete records, or merge duplicates.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {entries.map(item => (
          <div key={item.entry.key} className="admin-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">{item.entry.name}</h2>
                  <span className={statusBadge(item)}>
                    {item.matched ? item.matchedBy === 'metadata' ? 'Mapped' : 'Matched' : 'Unmatched'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{item.entry.state}, {item.entry.country}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.entry.aliases.slice(0, 5).map(alias => (
                    <span key={alias} className="admin-badge-blue">{alias}</span>
                  ))}
                </div>
              </div>
            </div>

            {item.matchedTemple ? (
              <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Matched temple</p>
                <p className="mt-1 text-sm font-bold text-green-900">{item.matchedTemple.title}</p>
                <p className="text-xs text-green-700">{place(item.matchedTemple) || 'Location not set'}{item.matchedTemple.deity ? ` · ${item.matchedTemple.deity}` : ''}</p>
                {item.matchedBy === 'matcher' && (
                  <p className="mt-2 text-xs text-green-700">This is a code-level match. Use the controls below only for unmatched canonical entries.</p>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Admin decision</label>
                  <select
                    value={selection[item.entry.key] || ''}
                    onChange={event => setSelection(prev => ({ ...prev, [item.entry.key]: event.target.value }))}
                    className="admin-input w-full"
                    disabled={savingKey === item.entry.key}
                  >
                    <option value="">Select existing temple...</option>
                    {item.candidates.map(candidate => (
                      <option key={candidate.temple.id} value={candidate.temple.id}>
                        {candidate.temple.title} ({candidate.score}) {place(candidate.temple) ? `- ${place(candidate.temple)}` : ''}
                      </option>
                    ))}
                    <option value={CREATE_LATER}>Create Later</option>
                    <option value={IGNORE}>Ignore</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => confirmMapping(item)}
                  disabled={savingKey === item.entry.key}
                  className="admin-btn admin-btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
                >
                  {savingKey === item.entry.key ? 'Saving...' : 'Confirm decision'}
                </button>

                {localDecisions[item.entry.key] && (
                  <p className="text-xs font-semibold text-amber-700">{localDecisions[item.entry.key]}</p>
                )}

                {item.candidates.length > 0 ? (
                  <div className="space-y-2">
                    {item.candidates.map(candidate => (
                      <div key={candidate.temple.id} className="rounded-lg border border-gray-100 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{candidate.temple.title}</p>
                            <p className="text-xs text-gray-500">{place(candidate.temple) || 'Location not set'}{candidate.temple.deity ? ` · ${candidate.temple.deity}` : ''}</p>
                          </div>
                          <span className="admin-badge-purple">{candidate.score}</span>
                        </div>
                        {candidate.reasons.length > 0 && (
                          <p className="mt-2 text-xs text-gray-400">{candidate.reasons.join('; ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No strong existing temple candidates found.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {unmatchedEntries.length === 0 && (
        <div className="admin-card p-6 text-center">
          <p className="text-sm font-semibold text-green-700">All canonical entries currently have a DB match.</p>
        </div>
      )}
    </div>
  )
}
