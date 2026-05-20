"use client"

import { Fragment, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Priority = 'high' | 'medium' | 'low'

type MissingDataSummary = {
  totalTemples: number
  templesWithIssues: number
  missingImage: number
  missingEnglishDescription: number
  missingHindiDescription: number
  weakEnglishDescription: number
  weakHindiDescription: number
  missingDeity: number
  missingTimings: number
  missingLocation: number
  missingSEO: number
}

type TempleIssue = {
  id: string
  title: string
  city?: string
  state?: string
  deity?: string
  image?: string
  issueCount: number
  issues: string[]
  suggestedPriority: Priority
}

type SuggestionValue = string | string[]

type SuggestionEntry = {
  value: SuggestionValue
  confidence: Priority
  reason: string
}

type SuggestionResponse = {
  temple: {
    id: string
    title: string
    city?: string
    state?: string
    deity?: string
    image?: string
  }
  suggestions: Record<string, SuggestionEntry>
}

type ApplyResult = {
  ok: boolean
  applied: string[]
  skipped: { field: string; reason: string }[]
  templeId: string
  logCreated: boolean
}

type AiPreviewResponse = {
  temple: {
    id: string
    title: string
    deity?: string
    city?: string
    state?: string
  }
  model: string
  preview: {
    description: string
    descriptionHi: string
    speciality: string
    specialityHi: string
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
  }
  logCreated: boolean
}

type AiPreviewField = keyof AiPreviewResponse['preview']

type AiApplyResult = {
  ok: boolean
  applied: string[]
  skipped: { field: string; reason: string }[]
  logCreated: boolean
}

type AuditResponse = {
  summary: MissingDataSummary
  issues: TempleIssue[]
}

const EMPTY_SUMMARY: MissingDataSummary = {
  totalTemples: 0,
  templesWithIssues: 0,
  missingImage: 0,
  missingEnglishDescription: 0,
  missingHindiDescription: 0,
  weakEnglishDescription: 0,
  weakHindiDescription: 0,
  missingDeity: 0,
  missingTimings: 0,
  missingLocation: 0,
  missingSEO: 0,
}

function priorityBadge(priority: Priority): string {
  if (priority === 'high') return 'admin-badge-red'
  if (priority === 'medium') return 'admin-badge-yellow'
  return 'admin-badge-blue'
}

function issueBadge(issue: string): string {
  if (issue.includes('Missing')) return 'admin-badge-red'
  if (issue.includes('Weak')) return 'admin-badge-yellow'
  return 'admin-badge-orange'
}

function suggestionLabel(field: string): string {
  const labels: Record<string, string> = {
    deity: 'Deity',
    templeType: 'Temple type',
    sacredCategories: 'Sacred categories',
    metaTitle: 'SEO title',
    metaDescription: 'SEO description',
    metaKeywords: 'SEO keywords',
    speciality: 'Speciality',
    timingSlots: 'Timing slots',
    imagePrompt: 'Image prompt',
  }

  return labels[field] || field
}

function suggestionValue(value: SuggestionValue) {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map(item => <span key={item} className="admin-badge-blue">{item}</span>)}
      </div>
    )
  }

  return <p className="text-sm text-gray-700 leading-relaxed break-words">{value}</p>
}

function isApplyableSuggestion(field: string): boolean {
  return field !== 'imagePrompt'
}

const AI_PREVIEW_FIELDS: AiPreviewField[] = [
  'description',
  'descriptionHi',
  'speciality',
  'specialityHi',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
]

function aiPreviewFieldLabel(field: AiPreviewField): string {
  const labels: Record<AiPreviewField, string> = {
    description: 'English description',
    descriptionHi: 'Hindi description',
    speciality: 'Speciality',
    specialityHi: 'Hindi speciality',
    metaTitle: 'SEO title',
    metaDescription: 'SEO description',
    metaKeywords: 'SEO keywords',
  }

  return labels[field]
}

function pickAiPreviewFields(preview: AiPreviewResponse['preview'], fields: AiPreviewField[]) {
  const selected: Partial<AiPreviewResponse['preview']> = {}

  for (const field of fields) {
    ;(selected as Record<string, unknown>)[field] = preview[field]
  }

  return selected
}

export default function TempleMissingDataPage() {
  const [data, setData] = useState<AuditResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [search, setSearch] = useState('')
  const [openSuggestionId, setOpenSuggestionId] = useState('')
  const [suggestionsByTemple, setSuggestionsByTemple] = useState<Record<string, SuggestionResponse>>({})
  const [suggestionLoadingId, setSuggestionLoadingId] = useState('')
  const [suggestionErrors, setSuggestionErrors] = useState<Record<string, string>>({})
  const [selectedSuggestions, setSelectedSuggestions] = useState<Record<string, string[]>>({})
  const [applyLoadingId, setApplyLoadingId] = useState('')
  const [applyErrors, setApplyErrors] = useState<Record<string, string>>({})
  const [applyResults, setApplyResults] = useState<Record<string, ApplyResult>>({})
  const [applyNotice, setApplyNotice] = useState('')
  const [openAiPreviewId, setOpenAiPreviewId] = useState('')
  const [aiPreviewByTemple, setAiPreviewByTemple] = useState<Record<string, AiPreviewResponse>>({})
  const [aiLoadingId, setAiLoadingId] = useState('')
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({})
  const [selectedAiFields, setSelectedAiFields] = useState<Record<string, string[]>>({})
  const [aiApplyLoadingId, setAiApplyLoadingId] = useState('')
  const [aiApplyErrors, setAiApplyErrors] = useState<Record<string, string>>({})
  const [aiApplyResults, setAiApplyResults] = useState<Record<string, AiApplyResult>>({})
  const [aiApplyNotice, setAiApplyNotice] = useState('')

  async function loadAudit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/temples/missing-data', { cache: 'no-store' })
      if (!res.ok) throw new Error('Unable to load temple audit')
      setData(await res.json())
    } catch (err) {
      console.error('Failed to load temple missing data audit:', err)
      setError('Unable to load temple audit. Please try again from an admin account.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAudit()
  }, [])

  async function previewSuggestions(id: string) {
    if (openSuggestionId === id) {
      setOpenSuggestionId('')
      return
    }

    setOpenSuggestionId(id)
    if (suggestionsByTemple[id]) return

    setSuggestionLoadingId(id)
    setSuggestionErrors(prev => ({ ...prev, [id]: '' }))

    try {
      const res = await fetch(`/api/admin/temples/suggestions?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Unable to load suggestions')
      const payload = await res.json()
      setSuggestionsByTemple(prev => ({ ...prev, [id]: payload }))
      setSelectedSuggestions(prev => ({ ...prev, [id]: [] }))
    } catch (err) {
      console.error('Failed to load temple suggestions:', err)
      setSuggestionErrors(prev => ({ ...prev, [id]: 'Unable to load deterministic suggestions.' }))
    } finally {
      setSuggestionLoadingId('')
    }
  }

  function toggleSuggestionField(templeId: string, field: string) {
    if (!isApplyableSuggestion(field)) return

    setSelectedSuggestions(prev => {
      const current = prev[templeId] || []
      const next = current.includes(field)
        ? current.filter(item => item !== field)
        : [...current, field]

      return { ...prev, [templeId]: next }
    })
  }

  async function applySelectedSuggestions(templeId: string, title: string) {
    const fields = selectedSuggestions[templeId] || []
    if (fields.length === 0) {
      setApplyErrors(prev => ({ ...prev, [templeId]: 'Select at least one suggestion to apply.' }))
      return
    }

    setApplyLoadingId(templeId)
    setApplyErrors(prev => ({ ...prev, [templeId]: '' }))
    setApplyNotice('')

    try {
      const res = await fetch('/api/admin/temples/apply-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templeId, fields }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Unable to apply suggestions')

      setApplyResults(prev => ({ ...prev, [templeId]: payload }))
      setApplyNotice(`${title}: applied ${payload.applied.length} field${payload.applied.length === 1 ? '' : 's'}, skipped ${payload.skipped.length}. ${payload.logCreated ? 'Suggestion apply action logged.' : 'Audit log could not be created.'}`)
      setSuggestionsByTemple(prev => {
        const next = { ...prev }
        delete next[templeId]
        return next
      })
      setSelectedSuggestions(prev => ({ ...prev, [templeId]: [] }))
      setOpenSuggestionId('')
      await loadAudit()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to apply suggestions.'
      setApplyErrors(prev => ({ ...prev, [templeId]: message }))
    } finally {
      setApplyLoadingId('')
    }
  }

  async function previewAiDescription(templeId: string) {
    if (openAiPreviewId === templeId) {
      setOpenAiPreviewId('')
      return
    }

    setOpenAiPreviewId(templeId)
    if (aiPreviewByTemple[templeId]) return

    setAiLoadingId(templeId)
    setAiErrors(prev => ({ ...prev, [templeId]: '' }))

    try {
      const res = await fetch(`/api/admin/temples/ai-preview?id=${encodeURIComponent(templeId)}`, { cache: 'no-store' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Unable to generate AI preview')
      setAiPreviewByTemple(prev => ({ ...prev, [templeId]: payload }))
      setSelectedAiFields(prev => ({ ...prev, [templeId]: [] }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate AI preview.'
      setAiErrors(prev => ({ ...prev, [templeId]: message }))
    } finally {
      setAiLoadingId('')
    }
  }

  function toggleAiField(templeId: string, field: AiPreviewField) {
    setSelectedAiFields(prev => {
      const current = prev[templeId] || []
      const next = current.includes(field)
        ? current.filter(item => item !== field)
        : [...current, field]

      return { ...prev, [templeId]: next }
    })
  }

  async function applySelectedAiFields(templeId: string, title: string) {
    const preview = aiPreviewByTemple[templeId]?.preview
    const fields = (selectedAiFields[templeId] || [])
      .filter((field): field is AiPreviewField => AI_PREVIEW_FIELDS.includes(field as AiPreviewField))

    if (!preview) {
      setAiApplyErrors(prev => ({ ...prev, [templeId]: 'Generate an AI preview before applying fields.' }))
      return
    }

    if (fields.length === 0) {
      setAiApplyErrors(prev => ({ ...prev, [templeId]: 'Select at least one AI field to apply.' }))
      return
    }

    setAiApplyLoadingId(templeId)
    setAiApplyErrors(prev => ({ ...prev, [templeId]: '' }))
    setAiApplyNotice('')

    try {
      const res = await fetch('/api/admin/temples/apply-ai-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templeId,
          preview: pickAiPreviewFields(preview, fields),
          fields,
        }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Unable to apply AI preview')

      setAiApplyResults(prev => ({ ...prev, [templeId]: payload }))
      setAiApplyNotice(`${title}: applied ${payload.applied.length} AI field${payload.applied.length === 1 ? '' : 's'}, skipped ${payload.skipped.length}. ${payload.logCreated ? 'AI apply action logged.' : 'Audit log could not be created.'}`)
      setSelectedAiFields(prev => ({ ...prev, [templeId]: [] }))
      await loadAudit()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to apply AI preview.'
      setAiApplyErrors(prev => ({ ...prev, [templeId]: message }))
    } finally {
      setAiApplyLoadingId('')
    }
  }

  const summary = data?.summary || EMPTY_SUMMARY

  const summaryCards = [
    { label: 'Total temples', value: summary.totalTemples },
    { label: 'With issues', value: summary.templesWithIssues },
    { label: 'Missing images', value: summary.missingImage },
    { label: 'Missing English', value: summary.missingEnglishDescription },
    { label: 'Missing Hindi', value: summary.missingHindiDescription },
    { label: 'Weak English', value: summary.weakEnglishDescription },
    { label: 'Weak Hindi', value: summary.weakHindiDescription },
    { label: 'Missing deity', value: summary.missingDeity },
    { label: 'Missing timings', value: summary.missingTimings },
    { label: 'Missing location', value: summary.missingLocation },
    { label: 'Missing SEO', value: summary.missingSEO },
  ]

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (data?.issues || []).filter(item => {
      if (priorityFilter && item.suggestedPriority !== priorityFilter) return false
      if (!query) return true

      const haystack = [
        item.title,
        item.city,
        item.state,
        item.deity,
        ...item.issues,
      ].filter(Boolean).join(' ').toLowerCase()

      return haystack.includes(query)
    })
  }, [data, priorityFilter, search])

  if (loading && !data) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="admin-page-title">Temple Missing Data</h1>
            <p className="admin-section-subtitle">Dry-run metadata audit</p>
          </div>
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Back to Temples</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Temple Missing Data</h1>
          <p className="admin-section-subtitle">
            Review missing data and apply only selected empty or weak deterministic suggestions.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadAudit} disabled={loading} className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50">
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

      {applyNotice && (
        <div className="admin-card p-4" style={{ background: '#ECFDF5', borderColor: 'rgba(5,150,105,0.15)' }}>
          <p className="text-sm font-semibold text-green-700">{applyNotice}</p>
          <p className="mt-1 text-xs text-green-600">The audit list was refreshed after applying the selected fields.</p>
        </div>
      )}

      {aiApplyNotice && (
        <div className="admin-card p-4" style={{ background: '#ECFDF5', borderColor: 'rgba(5,150,105,0.15)' }}>
          <p className="text-sm font-semibold text-green-700">{aiApplyNotice}</p>
          <p className="mt-1 text-xs text-green-600">The audit list was refreshed after applying the selected AI fields.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {summaryCards.map(card => (
          <div key={card.label} className="admin-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-filter-bar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title, city, deity, issue..."
            className="admin-input md:col-span-2"
          />
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="admin-input">
            <option value="">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Temple</th>
                <th>Location</th>
                <th>Deity</th>
                <th>Image</th>
                <th>Priority</th>
                <th>Issues</th>
                <th>Suggestions</th>
                <th>AI Preview</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(item => (
                <Fragment key={item.id}>
                  <tr>
                    <td>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.issueCount} issue{item.issueCount === 1 ? '' : 's'}</div>
                    </td>
                    <td className="text-gray-500">
                      {[item.city, item.state].filter(Boolean).join(', ') || 'Missing'}
                    </td>
                    <td className="text-gray-500">{item.deity || 'Missing'}</td>
                    <td>
                      <span className={item.image ? 'admin-badge-green' : 'admin-badge-red'}>
                        {item.image ? 'Present' : 'Missing'}
                      </span>
                    </td>
                    <td>
                      <span className={priorityBadge(item.suggestedPriority)}>
                        {item.suggestedPriority}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1.5 max-w-3xl">
                        {item.issues.map(issue => (
                          <span key={issue} className={issueBadge(issue)}>{issue}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => previewSuggestions(item.id)}
                        disabled={suggestionLoadingId === item.id}
                        className="admin-btn admin-btn-ghost px-3 py-1.5 text-xs disabled:opacity-50 whitespace-nowrap"
                      >
                        {suggestionLoadingId === item.id
                          ? 'Loading...'
                          : openSuggestionId === item.id
                            ? 'Hide Suggestions'
                            : 'Preview Suggestions'}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => previewAiDescription(item.id)}
                        disabled={aiLoadingId === item.id}
                        className="admin-btn admin-btn-ghost px-3 py-1.5 text-xs disabled:opacity-50 whitespace-nowrap"
                      >
                        {aiLoadingId === item.id
                          ? 'Generating...'
                          : openAiPreviewId === item.id
                            ? 'Hide AI Preview'
                            : 'AI Preview'}
                      </button>
                    </td>
                  </tr>
                  {openSuggestionId === item.id && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50/70">
                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Deterministic suggestions</p>
                              <p className="text-xs text-gray-400">Only checked empty or weak fields can be updated. The server recomputes suggestions before saving.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {suggestionsByTemple[item.id] && (
                                <span className="admin-badge-blue">
                                  {Object.keys(suggestionsByTemple[item.id].suggestions).length} suggestion{Object.keys(suggestionsByTemple[item.id].suggestions).length === 1 ? '' : 's'}
                                </span>
                              )}
                              {suggestionsByTemple[item.id] && Object.entries(suggestionsByTemple[item.id].suggestions).some(([field]) => isApplyableSuggestion(field)) && (
                                <button
                                  type="button"
                                  onClick={() => applySelectedSuggestions(item.id, item.title)}
                                  disabled={applyLoadingId === item.id || (selectedSuggestions[item.id] || []).length === 0}
                                  className="admin-btn admin-btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
                                >
                                  {applyLoadingId === item.id ? 'Applying...' : 'Apply selected suggestions'}
                                </button>
                              )}
                            </div>
                          </div>

                          {suggestionLoadingId === item.id && (
                            <div className="text-sm text-gray-400">Loading suggestions...</div>
                          )}

                          {suggestionErrors[item.id] && (
                            <div className="text-sm font-semibold text-red-600">{suggestionErrors[item.id]}</div>
                          )}

                          {applyErrors[item.id] && (
                            <div className="mb-3 text-sm font-semibold text-red-600">{applyErrors[item.id]}</div>
                          )}

                          {applyResults[item.id] && (
                            <div className="mb-3 rounded-lg border border-green-100 bg-green-50 p-3">
                              <p className="text-sm font-semibold text-green-700">
                                Applied {applyResults[item.id].applied.length} field{applyResults[item.id].applied.length === 1 ? '' : 's'}.
                              </p>
                              {applyResults[item.id].applied.length > 0 && (
                                <p className="mt-1 text-xs text-green-700">Updated: {applyResults[item.id].applied.join(', ')}</p>
                              )}
                              {applyResults[item.id].skipped.length > 0 && (
                                <p className="mt-1 text-xs text-green-700">Skipped: {applyResults[item.id].skipped.map(item => `${item.field} (${item.reason})`).join('; ')}</p>
                              )}
                            </div>
                          )}

                          {suggestionsByTemple[item.id] && Object.keys(suggestionsByTemple[item.id].suggestions).length === 0 && (
                            <div className="text-sm text-gray-400">No conservative rule-based suggestions are available for this temple.</div>
                          )}

                          {suggestionsByTemple[item.id] && Object.entries(suggestionsByTemple[item.id].suggestions).length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {Object.entries(suggestionsByTemple[item.id].suggestions).map(([field, suggestion]) => (
                                <div key={field} className="rounded-lg border border-gray-100 p-3">
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={(selectedSuggestions[item.id] || []).includes(field)}
                                        disabled={!isApplyableSuggestion(field) || applyLoadingId === item.id}
                                        onChange={() => toggleSuggestionField(item.id, field)}
                                        className="rounded"
                                      />
                                      <span className="text-sm font-semibold text-gray-900">{suggestionLabel(field)}</span>
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                      {!isApplyableSuggestion(field) && <span className="admin-badge-orange">Preview only</span>}
                                      <span className={priorityBadge(suggestion.confidence)}>{suggestion.confidence}</span>
                                    </div>
                                  </div>
                                  {suggestionValue(suggestion.value)}
                                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">{suggestion.reason}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {openAiPreviewId === item.id && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50/70">
                        <div className="rounded-xl border border-amber-200 bg-white p-4">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">AI description preview</p>
                              <p className="text-xs text-amber-700 mt-1">AI-generated content must be reviewed before applying.</p>
                            </div>
                            {aiPreviewByTemple[item.id] && (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="admin-badge-purple">{aiPreviewByTemple[item.id].model}</span>
                                <span className={aiPreviewByTemple[item.id].logCreated ? 'admin-badge-green' : 'admin-badge-yellow'}>
                                  {aiPreviewByTemple[item.id].logCreated ? 'Preview logged' : 'Log unavailable'}
                                </span>
                              </div>
                            )}
                          </div>

                          {aiLoadingId === item.id && (
                            <div className="text-sm text-gray-400">Generating bilingual description preview...</div>
                          )}

                          {aiErrors[item.id] && (
                            <div className="text-sm font-semibold text-red-600">{aiErrors[item.id]}</div>
                          )}

                          {aiApplyErrors[item.id] && (
                            <div className="mb-3 text-sm font-semibold text-red-600">{aiApplyErrors[item.id]}</div>
                          )}

                          {aiApplyResults[item.id] && (
                            <div className="mb-3 rounded-lg border border-green-100 bg-green-50 p-3">
                              <p className="text-sm font-semibold text-green-700">
                                Applied {aiApplyResults[item.id].applied.length} AI field{aiApplyResults[item.id].applied.length === 1 ? '' : 's'}.
                              </p>
                              {aiApplyResults[item.id].applied.length > 0 && (
                                <p className="mt-1 text-xs text-green-700">Updated: {aiApplyResults[item.id].applied.join(', ')}</p>
                              )}
                              {aiApplyResults[item.id].skipped.length > 0 && (
                                <p className="mt-1 text-xs text-green-700">Skipped: {aiApplyResults[item.id].skipped.map(skipped => `${skipped.field} (${skipped.reason})`).join('; ')}</p>
                              )}
                            </div>
                          )}

                          {aiPreviewByTemple[item.id] && (
                            <div className="space-y-4">
                              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-amber-900">Only selected empty/weak fields will be updated.</p>
                                    <p className="mt-1 text-xs text-amber-700">Review the generated text, select fields, then apply manually.</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => applySelectedAiFields(item.id, item.title)}
                                    disabled={aiApplyLoadingId === item.id || (selectedAiFields[item.id] || []).length === 0}
                                    className="admin-btn admin-btn-primary px-3 py-1.5 text-xs disabled:opacity-50 whitespace-nowrap"
                                  >
                                    {aiApplyLoadingId === item.id ? 'Applying...' : 'Apply selected AI fields'}
                                  </button>
                                </div>

                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                  {AI_PREVIEW_FIELDS.map(field => (
                                    <label key={field} className="flex items-center gap-2 rounded-md border border-amber-100 bg-white px-3 py-2 text-sm font-semibold text-gray-800">
                                      <input
                                        type="checkbox"
                                        checked={(selectedAiFields[item.id] || []).includes(field)}
                                        disabled={aiApplyLoadingId === item.id}
                                        onChange={() => toggleAiField(item.id, field)}
                                        className="rounded"
                                      />
                                      <span>{aiPreviewFieldLabel(field)}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-lg border border-gray-100 p-3">
                                <p className="text-sm font-semibold text-gray-900 mb-2">English description</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{aiPreviewByTemple[item.id].preview.description}</p>
                              </div>

                              <div className="rounded-lg border border-gray-100 p-3">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Hindi description</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{aiPreviewByTemple[item.id].preview.descriptionHi}</p>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                <div className="rounded-lg border border-gray-100 p-3">
                                  <p className="text-sm font-semibold text-gray-900 mb-2">Speciality</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{aiPreviewByTemple[item.id].preview.speciality}</p>
                                  <p className="mt-3 text-sm font-semibold text-gray-900 mb-2">Hindi speciality</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{aiPreviewByTemple[item.id].preview.specialityHi}</p>
                                </div>

                                <div className="rounded-lg border border-gray-100 p-3">
                                  <p className="text-sm font-semibold text-gray-900 mb-2">SEO preview</p>
                                  <p className="text-xs font-semibold text-gray-500">Title</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{aiPreviewByTemple[item.id].preview.metaTitle}</p>
                                  <p className="mt-2 text-xs font-semibold text-gray-500">Description</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{aiPreviewByTemple[item.id].preview.metaDescription}</p>
                                  <p className="mt-2 text-xs font-semibold text-gray-500">Keywords</p>
                                  <div className="mt-1 flex flex-wrap gap-1.5">
                                    {aiPreviewByTemple[item.id].preview.metaKeywords.map(keyword => (
                                      <span key={keyword} className="admin-badge-blue">{keyword}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                    No temple issues match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
