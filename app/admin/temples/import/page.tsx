"use client"

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

type ImportResult = {
  ok?: boolean
  dryRun?: boolean
  importId?: string
  fileName?: string
  totalRows?: number
  validRows?: number
  invalidRows?: number
  duplicateRows?: number
  existingDbMatches?: number
  wouldCreate?: number
  wouldUpdateMissingFields?: number
  wouldMergeCategories?: number
  wouldSkip?: number
  created?: number
  updatedMissingFields?: number
  mergedCategories?: number
  skippedExisting?: number
  skippedDuplicate?: number
  failedRows?: number
  totalProcessed?: number
  errors?: { row: number; templeName?: string; reason: string }[]
  warnings?: { row: number; templeName?: string; reason: string }[]
  duplicateReport?: { row: number; templeName?: string; duplicateOf?: number; reason: string }[]
  error?: string
}

type ImportSession = {
  importId: string
  fileName?: string
  totalRows?: number
  created?: number
  updated?: number
  skipped?: number
  failed?: number
  status?: string
  startedAt?: string
  completedAt?: string
}

const TEMPLATE_COLUMNS = [
  'Title',
  'TempleNameHi',
  'UniqueKey',
  'Slug',
  'Location',
  'City',
  'District',
  'State',
  'Country',
  'Deity',
  'Type',
  'SacredCategories',
  'Tags',
  'MetaTitle',
  'MetaDescription',
  'Keywords',
  'Description',
  'DescriptionHi',
  'History',
  'HistoryHi',
  'Architecture',
  'ArchitectureHi',
  'ReligiousImportance',
  'ReligiousImportanceHi',
  'Festivals',
  'FestivalsHi',
  'BestTimeToVisit',
  'BestTimeToVisitHi',
  'NearbyTemples',
  'FAQs',
  'SourceUrls',
  'PrimaryImage',
  'GalleryImages',
  'Latitude',
  'Longitude',
  'Timings',
  'GoogleMapUrl',
  'Speciality',
  'SpecialityHi',
  'DataQuality',
  'Status',
  'Verified',
]

function csvEscape(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function downloadRows(fileName: string, rows: Record<string, unknown>[]) {
  const header = ['row', 'templeName', 'duplicateOf', 'reason']
  const csv = [
    header.join(','),
    ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function TempleLargeImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [loading, setLoading] = useState<'dry-run' | 'execute' | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dryRunReady, setDryRunReady] = useState(false)
  const [sessions, setSessions] = useState<ImportSession[]>([])
  const [sessionLoading, setSessionLoading] = useState(false)

  const hasFile = Boolean(fileInputRef.current?.files?.[0])
  const hasDryRun = Boolean(result?.dryRun && result.importId)

  useEffect(() => {
    loadSessions()
  }, [])

  async function loadSessions() {
    setSessionLoading(true)
    try {
      const res = await fetch('/api/admin/temples/import/sessions?limit=10', { credentials: 'include', cache: 'no-store' })
      if (res.ok) {
        const payload = await res.json()
        setSessions(payload.data || [])
      }
    } finally {
      setSessionLoading(false)
    }
  }

  function getFile() {
    return fileInputRef.current?.files?.[0] || null
  }

  async function runImport(mode: 'dry-run' | 'execute') {
    const file = getFile()
    if (!file) {
      alert('Please choose a CSV file first.')
      return
    }
    if (mode === 'execute' && !dryRunReady) {
      alert('Please run a dry-run first.')
      return
    }
    if (mode === 'execute' && !confirm('Execute import now? Existing manually edited temples will never be overwritten. Only missing normalized fields and categories may be merged.')) {
      return
    }

    setLoading(mode)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('chunkSize', '500')
      if (mode === 'execute' && result?.importId) form.append('dryRunImportId', result.importId)
      const endpoint = mode === 'dry-run'
        ? '/api/admin/temples/import/dry-run'
        : '/api/admin/temples/import/execute'
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const payload = await res.json().catch(() => ({}))
      setResult(payload)
      if (!res.ok && !payload.ok) throw new Error(payload.error || payload.errors?.[0]?.reason || 'Import failed')
      setDryRunReady(mode === 'dry-run' && Boolean(payload.ok))
      if (mode === 'execute') {
        setDryRunReady(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
        setSelectedFileName('')
      }
      await loadSessions()
    } catch (error: any) {
      setResult((prev) => prev || { ok: false, error: error?.message || 'Import failed' })
    } finally {
      setLoading(null)
    }
  }

  const summaryCards = useMemo(() => {
    if (!result) return []
    if (result.dryRun) {
      return [
        ['Total rows', result.totalRows || 0],
        ['Valid rows', result.validRows || 0],
        ['Invalid rows', result.invalidRows || 0],
        ['CSV duplicates', result.duplicateRows || 0],
        ['DB matches', result.existingDbMatches || 0],
        ['Would create', result.wouldCreate || 0],
        ['Would update missing fields', result.wouldUpdateMissingFields || 0],
        ['Would merge categories', result.wouldMergeCategories || 0],
        ['Would skip', result.wouldSkip || 0],
      ]
    }
    return [
      ['Total processed', result.totalProcessed || 0],
      ['Created', result.created || 0],
      ['Updated missing fields', result.updatedMissingFields || 0],
      ['Merged categories', result.mergedCategories || 0],
      ['Skipped existing', result.skippedExisting || 0],
      ['Skipped duplicate', result.skippedDuplicate || 0],
      ['Invalid rows', result.invalidRows || 0],
      ['Failed rows', result.failedRows || 0],
    ]
  }, [result])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/temples" className="text-sm font-semibold text-orange-700 hover:text-orange-900">
            Back to Temples
          </Link>
          <h1 className="admin-page-title mt-2">Temple Large Import</h1>
          <p className="admin-section-subtitle">Safe dry-run first CSV architecture for thousands to lakhs of temples.</p>
        </div>
        <a
          href="/api/admin/temples/import/template"
          className="admin-btn admin-btn-ghost px-4 py-2 text-sm"
        >
          Download CSV Template
        </a>
      </div>

      <div className="admin-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">Upload CSV</p>
            <p className="mt-1 max-w-3xl text-sm text-gray-600">
              Existing manually edited temples will never be overwritten. Dry-run checks duplicate rows, existing DB matches,
              invalid URLs, unknown categories, and safe category merges before any write.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="admin-btn admin-btn-ghost cursor-pointer px-4 py-2 text-sm">
              Choose CSV
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => {
                  setSelectedFileName(event.target.files?.[0]?.name || '')
                  setDryRunReady(false)
                  setResult(null)
                }}
              />
            </label>
            <button
              onClick={() => runImport('dry-run')}
              disabled={loading !== null || !hasFile}
              className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50"
            >
              {loading === 'dry-run' ? 'Checking...' : 'Dry Run'}
            </button>
            <button
              onClick={() => runImport('execute')}
              disabled={loading !== null || !dryRunReady || !hasDryRun}
              className="admin-btn admin-btn-primary px-4 py-2 text-sm disabled:opacity-50"
            >
              {loading === 'execute' ? 'Importing...' : 'Execute Import'}
            </button>
          </div>
        </div>
        {selectedFileName && <p className="mt-4 text-xs font-semibold text-gray-500">Selected: {selectedFileName}</p>}
      </div>

      <div className="admin-card p-5">
        <p className="text-sm font-bold text-gray-900">CSV Columns</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEMPLATE_COLUMNS.map((column) => (
            <span key={column} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
              {column}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">Multiple categories use semicolon format: Panch Badri;Char Dham;Divya Desam.</p>
      </div>

      {result && (
        <div className={`admin-card p-5 ${result.ok === false || result.error ? 'border-red-200 bg-red-50' : 'border-green-100 bg-green-50'}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className={`text-sm font-bold ${result.ok === false || result.error ? 'text-red-800' : 'text-green-800'}`}>
                {result.dryRun ? 'Dry Run Report' : 'Execute Import Report'}
              </p>
              {result.importId && <p className="mt-1 text-xs text-gray-500">Import ID: {result.importId}</p>}
              {result.error && <p className="mt-2 text-sm text-red-700">{result.error}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {(result.errors || []).length > 0 && (
                <button
                  onClick={() => downloadRows(`temple-import-failed-${result.importId || 'report'}.csv`, result.errors || [])}
                  className="admin-btn admin-btn-ghost px-3 py-2 text-xs"
                >
                  Download Failed Rows
                </button>
              )}
              {(result.duplicateReport || []).length > 0 && (
                <button
                  onClick={() => downloadRows(`temple-import-duplicates-${result.importId || 'report'}.csv`, result.duplicateReport || [])}
                  className="admin-btn admin-btn-ghost px-3 py-2 text-xs"
                >
                  Download Duplicate Report
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {summaryCards.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/70 bg-white/80 p-3">
                <p className="text-xs font-semibold text-gray-500">{label}</p>
                <p className="mt-1 text-xl font-black text-gray-950">{value}</p>
              </div>
            ))}
          </div>

          {(result.errors || []).length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-bold text-red-800">Errors</p>
              <div className="mt-2 max-h-60 overflow-auto rounded-xl border border-red-100 bg-white">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-red-50 text-red-900">
                    <tr><th className="p-2">Row</th><th className="p-2">Temple</th><th className="p-2">Reason</th></tr>
                  </thead>
                  <tbody>
                    {result.errors!.slice(0, 50).map((item, index) => (
                      <tr key={`${item.row}-${index}`} className="border-t border-red-50">
                        <td className="p-2">{item.row}</td>
                        <td className="p-2">{item.templeName || '-'}</td>
                        <td className="p-2">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(result.warnings || []).length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-bold text-yellow-800">Warnings</p>
              <div className="mt-2 max-h-52 overflow-auto rounded-xl border border-yellow-100 bg-white">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-yellow-50 text-yellow-900">
                    <tr><th className="p-2">Row</th><th className="p-2">Temple</th><th className="p-2">Reason</th></tr>
                  </thead>
                  <tbody>
                    {result.warnings!.slice(0, 50).map((item, index) => (
                      <tr key={`${item.row}-${index}`} className="border-t border-yellow-50">
                        <td className="p-2">{item.row}</td>
                        <td className="p-2">{item.templeName || '-'}</td>
                        <td className="p-2">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="admin-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">Recent Import Sessions</p>
            <p className="text-xs text-gray-500">Stored dry-run and execute reports for auditability.</p>
          </div>
          <button onClick={loadSessions} className="admin-btn admin-btn-ghost px-3 py-2 text-xs">
            {sessionLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">Import ID</th>
                <th className="p-3">File</th>
                <th className="p-3">Status</th>
                <th className="p-3">Rows</th>
                <th className="p-3">Created</th>
                <th className="p-3">Updated</th>
                <th className="p-3">Skipped</th>
                <th className="p-3">Failed</th>
                <th className="p-3">Started</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr><td className="p-4 text-gray-500" colSpan={9}>No import sessions yet.</td></tr>
              ) : sessions.map((session) => (
                <tr key={session.importId} className="border-t border-gray-100">
                  <td className="p-3 font-mono text-[11px]">{session.importId}</td>
                  <td className="p-3">{session.fileName || '-'}</td>
                  <td className="p-3">{session.status || '-'}</td>
                  <td className="p-3">{session.totalRows || 0}</td>
                  <td className="p-3">{session.created || 0}</td>
                  <td className="p-3">{session.updated || 0}</td>
                  <td className="p-3">{session.skipped || 0}</td>
                  <td className="p-3">{session.failed || 0}</td>
                  <td className="p-3">{session.startedAt ? new Date(session.startedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
