'use client'

import { useEffect, useState, useCallback } from 'react'

interface AuditSummary {
  totalRecords: number
  totalImages: number
  cloudinaryCount: number
  localCount: number
  externalCount: number
  emptyCount: number
  qualityIssueCount: number
  criticalIssueCount: number
  issueBreakdown: Record<string, number>
  domainsFound: string[]
  domainBreakdown: Record<string, number>
}

interface ExternalImage {
  templeId: string
  title: string
  status: string
  field: string
  url: string
  domain: string
  classification: string
}

interface ImageIssue {
  templeId: string
  title: string
  status: string
  field: string
  url: string
  issueType: string
  severity: 'warning' | 'critical'
  details: string
  width?: number
  height?: number
  bytes?: number
  aspectRatio?: number
}

interface AuditData {
  summary: AuditSummary
  externalImages: ExternalImage[]
  qualityIssues: ImageIssue[]
}

export default function ImageAuditPage() {
  const [data, setData] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cleaning, setCleaning] = useState(false)
  const [cleanResult, setCleanResult] = useState<{ recordsCleaned: number; cleanedTitles: string[] } | null>(null)
  const [error, setError] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [brokenPreviews, setBrokenPreviews] = useState<Set<string>>(new Set())

  const fetchAudit = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/image-audit', { credentials: 'include' })
      if (res.status === 401) throw new Error('Please login as admin again')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e: any) {
      setError(e.message || 'Failed to load audit')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAudit() }, [fetchAudit])

  const runCleanup = async () => {
    if (!confirm('This will replace all external image URLs with Cloudinary fallback in the database. Continue?')) return
    setCleaning(true)
    setCleanResult(null)
    try {
      const res = await fetch('/api/admin/image-audit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' }),
      })
      const result = await res.json()
      if (res.status === 401) throw new Error('Please login as admin again')
      if (!res.ok) throw new Error(result.error || 'Cleanup failed')
      setCleanResult(result)
      await fetchAudit()
    } catch (e: any) {
      setError(e.message || 'Cleanup failed')
    } finally {
      setCleaning(false)
    }
  }

  const filtered = data?.externalImages.filter(
    img => selectedDomain === 'all' || img.domain === selectedDomain
  ) ?? []
  const qualityIssues = data?.qualityIssues ?? []
  const issueBreakdown = data?.summary.issueBreakdown ?? {}
  const issueCount = (type: string) => issueBreakdown[type] || 0

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-muted">Scanning image URLs across all temple records…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">Image Audit</h1>
          <p className="text-ink-muted mt-1 text-sm">
            Scan temple records for low-quality images, risky crops, broken URLs, external URLs, oversized files, and Cloudinary delivery status.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>{error}</span>
            {error === 'Please login as admin again' && (
              <a href="/login" className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors">
                Login
              </a>
            )}
          </div>
        )}

        {cleanResult && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 font-semibold">✅ Cleanup complete — {cleanResult.recordsCleaned} records updated</p>
            {cleanResult.cleanedTitles.length > 0 && (
              <p className="text-green-700 text-xs mt-1">{cleanResult.cleanedTitles.slice(0, 10).join(', ')}{cleanResult.cleanedTitles.length > 10 ? ` +${cleanResult.cleanedTitles.length - 10} more` : ''}</p>
            )}
          </div>
        )}

        {data && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Temple Records', value: data.summary.totalRecords, color: 'bg-blue-50 text-blue-700' },
                { label: 'Total Images', value: data.summary.totalImages, color: 'bg-gray-100 text-gray-700' },
                { label: 'Cloudinary Status', value: `${data.summary.cloudinaryCount}/${data.summary.totalImages}`, color: 'bg-green-50 text-green-700' },
                { label: 'Missing Card Image', value: issueCount('missing-card-image'), color: issueCount('missing-card-image') > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700' },
                { label: 'Missing Hero Image', value: issueCount('missing-hero-image'), color: issueCount('missing-hero-image') > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700' },
                { label: 'Low Quality', value: issueCount('low-resolution') + issueCount('blurry'), color: issueCount('low-resolution') + issueCount('blurry') > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700' },
                { label: 'Risky Crops', value: issueCount('dangerous-crop') + issueCount('wrong-aspect-ratio') + issueCount('risky-card-composition') + issueCount('risky-hero-composition'), color: issueCount('dangerous-crop') + issueCount('wrong-aspect-ratio') + issueCount('risky-card-composition') + issueCount('risky-hero-composition') > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700' },
                { label: 'Broken URLs', value: issueCount('broken-url'), color: issueCount('broken-url') > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700' },
                { label: 'External URLs', value: data.summary.externalCount, color: data.summary.externalCount > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700' },
                { label: 'Oversized Images', value: issueCount('oversized-file'), color: issueCount('oversized-file') > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700' },
                { label: 'Empty / None', value: data.summary.emptyCount, color: 'bg-yellow-50 text-yellow-700' },
                { label: 'Critical Issues', value: data.summary.criticalIssueCount || 0, color: (data.summary.criticalIssueCount || 0) > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700' },
              ].map(c => (
                <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                  <div className="text-2xl font-bold">{c.value}</div>
                  <div className="text-xs font-medium mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Domain breakdown */}
            {data.summary.domainsFound.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 className="font-semibold text-ink mb-3">External Domains Found</h2>
                <div className="flex flex-wrap gap-2">
                  {data.summary.domainsFound.map(domain => (
                    <span key={domain}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => setSelectedDomain(d => d === domain ? 'all' : domain)}
                      style={{ outline: selectedDomain === domain ? '2px solid #ef4444' : 'none' }}
                    >
                      {domain}
                      <span className="bg-red-200 text-red-800 rounded-full px-1.5 py-0.5 text-[10px]">
                        {data.summary.domainBreakdown[domain]}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {qualityIssues.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 className="font-semibold text-ink mb-3">Image Quality Risks</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.summary.issueBreakdown || {}).map(([issue, count]) => (
                    <span key={issue} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      {issue.replace(/-/g, ' ')}
                      <span className="bg-amber-200 text-amber-800 rounded-full px-1.5 py-0.5 text-[10px]">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cleanup CTA */}
            {data.summary.externalCount > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-amber-900">
                    ⚠️ {data.summary.externalCount} external image URL{data.summary.externalCount !== 1 ? 's' : ''} found across {new Set(data.externalImages.map(i => i.templeId)).size} temple records
                  </p>
                  <p className="text-amber-700 text-sm mt-1">
                    Cleanup will replace external URLs with Cloudinary fallback. Existing Cloudinary images are kept. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={runCleanup}
                  disabled={cleaning}
                  className="flex-shrink-0 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {cleaning ? 'Cleaning…' : '🧹 Run DB Cleanup'}
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
                <p className="text-green-800 font-semibold">✅ Source check passed — only Cloudinary or local sources found.</p>
              </div>
            )}

            {/* External image table */}
            {filtered.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-ink">
                    External Images {selectedDomain !== 'all' && `— ${selectedDomain}`}
                    <span className="ml-2 text-sm text-ink-muted font-normal">({filtered.length})</span>
                  </h2>
                  {selectedDomain !== 'all' && (
                    <button onClick={() => setSelectedDomain('all')} className="text-xs text-primary hover:underline">Show all</button>
                  )}
                </div>

                <div className="divide-y divide-gray-50">
                  {filtered.map((img, idx) => (
                    <div key={idx} className="px-5 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                      {/* Preview */}
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {brokenPreviews.has(img.url) ? (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">broken</div>
                        ) : (
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={() => setBrokenPreviews(s => new Set(s).add(img.url))}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-ink text-sm truncate">{img.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${img.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {img.status}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{img.field}</span>
                        </div>
                        <p className="text-xs text-red-600 mt-1 truncate max-w-xl">{img.url}</p>
                        <p className="text-[10px] text-ink-muted mt-0.5">{img.domain}</p>
                      </div>

                      {/* Edit link */}
                      <a
                        href={`/admin/temples/edit/${img.templeId}`}
                        className="flex-shrink-0 text-xs text-primary hover:underline whitespace-nowrap"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Edit →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {qualityIssues.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-8">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-ink">
                    Quality Audit Findings
                    <span className="ml-2 text-sm text-ink-muted font-normal">({qualityIssues.length})</span>
                  </h2>
                </div>

                <div className="divide-y divide-gray-50">
                  {qualityIssues.slice(0, 120).map((issue, idx) => (
                    <div key={`${issue.url}-${idx}`} className="px-5 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {brokenPreviews.has(issue.url) ? (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">review</div>
                        ) : (
                          <img
                            src={issue.url}
                            alt=""
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            onError={() => setBrokenPreviews(s => new Set(s).add(issue.url))}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-ink text-sm truncate">{issue.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${issue.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {issue.severity}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{issue.field}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">{issue.issueType}</span>
                        </div>
                        <p className="text-xs text-ink-muted mt-1">{issue.details}</p>
                        {issue.width && issue.height && (
                          <p className="text-[10px] text-ink-muted mt-0.5">
                            {issue.width}x{issue.height}px {issue.aspectRatio ? `- ratio ${issue.aspectRatio}` : ''}
                            {issue.bytes ? ` - ${(issue.bytes / 1024 / 1024).toFixed(1)}MB` : ''}
                          </p>
                        )}
                      </div>

                      <a
                        href={`/admin/temples/edit/${issue.templeId}`}
                        className="flex-shrink-0 text-xs text-primary hover:underline whitespace-nowrap"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Edit &gt;
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
