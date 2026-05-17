"use client"

import { useEffect, useMemo, useState } from 'react'
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

export default function TempleMissingDataPage() {
  const [data, setData] = useState<AuditResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [search, setSearch] = useState('')

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
            Dry-run audit only. No temple records are changed.
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
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(item => (
                <tr key={item.id}>
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
                </tr>
              ))}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
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
