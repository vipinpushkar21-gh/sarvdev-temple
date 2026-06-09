"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  RefreshCw,
  Shield,
} from 'lucide-react'

type Sample = { id: string; title: string; reason?: string; url?: string }

type ContentTypeReport = {
  total: number
  missingCard: number
  missingHero: number
  missingOG: number
  noImages: number
  legacyOnly: number
  nonCloudinary: number
  invalidUrl: number
  samples: Sample[]
}

type AuditResult = {
  generatedAt: string
  grandTotal: number
  totalIssues: number
  reports: Record<string, ContentTypeReport>
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  temples:     'Temples',
  deities:     'Deities',
  devotionals: 'Devotionals',
  blogs:       'Blog',
  events:      'Events',
  darshan:     'Daily Darshan',
}

const CONTENT_TYPE_ORDER = ['temples', 'deities', 'devotionals', 'blogs', 'events', 'darshan']

function pct(n: number, total: number) {
  if (!total) return '0%'
  return Math.round((n / total) * 100) + '%'
}

function IssueBar({ label, count, total, warn = false }: { label: string; count: number; total: number; warn?: boolean }) {
  const isOk = count === 0
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={`font-medium ${isOk ? 'text-stone-500' : warn ? 'text-amber-700' : 'text-red-700'}`}>{label}</span>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`tabular-nums font-black text-base ${isOk ? 'text-emerald-600' : warn ? 'text-amber-700' : 'text-red-700'}`}>
          {count.toLocaleString()}
        </span>
        {total > 0 && count > 0 && (
          <span className="text-xs text-stone-400 font-medium">{pct(count, total)}</span>
        )}
      </div>
    </div>
  )
}

function ContentTypeCard({ type, report }: { type: string; report: ContentTypeReport }) {
  const [showSamples, setShowSamples] = useState(false)
  const label = CONTENT_TYPE_LABELS[type] ?? type
  const issues = report.missingCard + report.noImages + report.nonCloudinary + report.invalidUrl
  const isClean = issues === 0

  return (
    <div className={`admin-card overflow-hidden ${isClean ? 'border-emerald-100' : ''}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${
            isClean ? 'bg-emerald-500' : issues > 10 ? 'bg-red-500' : 'bg-amber-400'
          }`} />
          <h3 className="font-black text-stone-900 text-sm">{label}</h3>
          <span className="text-xs text-stone-400 font-medium">{report.total.toLocaleString()} records</span>
        </div>
        {isClean ? (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Clean
          </span>
        ) : (
          <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
            {issues.toLocaleString()} issue{issues !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <IssueBar label="No card image"        count={report.missingCard}    total={report.total} />
        <IssueBar label="No hero image"        count={report.missingHero}    total={report.total} warn />
        <IssueBar label="No OG image"          count={report.missingOG}      total={report.total} warn />
        <IssueBar label="No images at all"     count={report.noImages}       total={report.total} />
        <IssueBar label="Legacy field only"    count={report.legacyOnly}     total={report.total} warn />
        <IssueBar label="Non-Cloudinary URL"   count={report.nonCloudinary}  total={report.total} />
        <IssueBar label="Invalid URL format"   count={report.invalidUrl}     total={report.total} />
      </div>

      {report.samples.length > 0 && (
        <div className="px-5 pb-4">
          <button
            type="button"
            onClick={() => setShowSamples((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition"
          >
            {showSamples ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            {showSamples ? 'Hide' : 'Show'} {report.samples.length} sample record{report.samples.length !== 1 ? 's' : ''}
          </button>
          {showSamples && (
            <div className="mt-3 space-y-1.5">
              {report.samples.map((s, i) => (
                <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2.5 text-xs">
                  <span className="font-semibold text-stone-800 mr-2">{s.title}</span>
                  {s.reason && <span className="text-stone-500">{s.reason}</span>}
                  {s.url && (
                    <span className="block mt-1 font-mono text-red-600 break-all opacity-80">{s.url}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const IMAGE_FIELD_GUIDE = [
  { field: 'imageCard',     priority: 1, role: 'Card',    note: 'Primary card/thumbnail image' },
  { field: 'imageHero',     priority: 2, role: 'Hero',    note: 'Full-width page hero' },
  { field: 'ogImage',       priority: 3, role: 'OG/SEO',  note: 'Social share / meta og:image' },
  { field: 'galleryImages', priority: 4, role: 'Gallery', note: 'Array of gallery images' },
  { field: 'image',         priority: 5, role: 'Legacy',  note: 'Fallback when imageCard missing' },
  { field: 'heroImage',     priority: 6, role: 'Legacy',  note: 'Fallback when imageHero missing' },
  { field: 'thumbnail',     priority: 7, role: 'Legacy',  note: 'Darshan thumbnail fallback' },
]

export default function MediaIntegrityPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runAudit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/media/integrity')
      if (res.status === 401) { setError('Not authorised — log in as admin first.'); return }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError('Audit failed (HTTP ' + res.status + '): ' + (body?.message || body?.error || 'Check server logs.'))
        return
      }
      setResult(await res.json())
    } catch (e: any) {
      setError('Network error: ' + (e?.message || String(e)))
    } finally {
      setLoading(false)
    }
  }

  const overallOk = result ? result.totalIssues === 0 : null

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-orange-600" />
            Media Integrity Audit
          </h1>
          <p className="admin-section-subtitle">
            Read-only scan across all content types. Reports missing images, legacy-only fields, and invalid URLs.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/media" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">
            Media Library
          </Link>
          <button
            type="button"
            onClick={runAudit}
            disabled={loading}
            className="admin-btn admin-btn-primary px-5 py-2 text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {loading ? 'Scanning...' : 'Run Audit'}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50/80 px-5 py-4 text-sm text-stone-700">
        <Shield className="w-5 h-5 shrink-0 mt-0.5 text-stone-400" />
        <div>
          <strong>Read-only.</strong> This audit never writes, modifies, or deletes any data.
          It scans all content records and reports image field completeness, URL validity, and Cloudinary compliance.
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-700 text-xl leading-none shrink-0">&times;</button>
        </div>
      )}

      {!result && !loading && (
        <div className="rounded-2xl border border-stone-100 bg-stone-50 px-8 py-16 text-center">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-sm font-semibold text-stone-400">Click Run Audit to scan all content types for media issues.</p>
        </div>
      )}

      {result && (
        <>
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="admin-section-title">Audit Summary</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {result.grandTotal.toLocaleString()} total records &middot; generated {new Date(result.generatedAt).toLocaleString()}
                </p>
              </div>
              {overallOk ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All clean
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" /> {result.totalIssues.toLocaleString()} issues found
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CONTENT_TYPE_ORDER.map((type) => {
                const r = result.reports[type]
                if (!r) return null
                const issues = r.missingCard + r.noImages + r.nonCloudinary + r.invalidUrl
                return (
                  <div key={type} className={`rounded-xl border p-3.5 ${issues === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-stone-50 border-stone-100'}`}>
                    <p className={`text-2xl font-black tabular-nums ${issues === 0 ? 'text-emerald-700' : 'text-stone-800'}`}>
                      {r.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">{CONTENT_TYPE_LABELS[type]}</p>
                    {issues > 0 && (
                      <p className="text-xs font-bold text-red-600 mt-1">{issues} issue{issues !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTENT_TYPE_ORDER.map((type) => {
              const r = result.reports[type]
              if (!r) return null
              return <ContentTypeCard key={type} type={type} report={r} />
            })}
          </div>

          <div className="admin-card p-6">
            <h2 className="admin-section-title mb-4">Canonical Image Field Priority</h2>
            <p className="text-sm text-stone-500 mb-4">
              All content types use this resolution order. Populate higher-priority fields to ensure cards, heroes and OG images render correctly.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2 pr-4 text-xs font-black uppercase tracking-wide text-stone-400">Priority</th>
                    <th className="text-left py-2 pr-4 text-xs font-black uppercase tracking-wide text-stone-400">Field</th>
                    <th className="text-left py-2 pr-4 text-xs font-black uppercase tracking-wide text-stone-400">Role</th>
                    <th className="text-left py-2 text-xs font-black uppercase tracking-wide text-stone-400">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {IMAGE_FIELD_GUIDE.map((row) => (
                    <tr key={row.field} className="border-b border-stone-50 last:border-0">
                      <td className="py-2.5 pr-4 text-stone-400 font-bold tabular-nums">{row.priority}</td>
                      <td className="py-2.5 pr-4">
                        <code className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                          row.priority <= 3 ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-stone-100 text-stone-600'
                        }`}>{row.field}</code>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          row.role === 'Card'    ? 'bg-blue-50 text-blue-700' :
                          row.role === 'Hero'    ? 'bg-purple-50 text-purple-700' :
                          row.role === 'OG/SEO'  ? 'bg-emerald-50 text-emerald-700' :
                          row.role === 'Gallery' ? 'bg-amber-50 text-amber-700' :
                          'bg-stone-100 text-stone-500'
                        }`}>{row.role}</span>
                      </td>
                      <td className="py-2.5 text-stone-500">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="admin-section-title mb-4">Image Size Guide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Deity / Spiritual Icon Card', upload: '2400 × 2400 px', aiGen: '3000 × 3000 px', note: '1:1 square' },
                { label: 'Deity / Temple Hero',          upload: '3200 × 1371 px', aiGen: '3360 × 1440 px', note: '~21:9 cinematic' },
                { label: 'Temple Card',                  upload: '1600 × 1200 px', aiGen: '2000 × 1500 px', note: '4:3' },
                { label: 'Devotional / Blog / Event Card', upload: '1600 × 900 px',  aiGen: '2000 × 1125 px', note: '16:9' },
                { label: 'OG / Social Share',            upload: '1200 × 630 px',  note: '1.91:1 — required for all types' },
                { label: 'Gallery Images',               upload: '2400 × 1800 px', note: '4:3 recommended' },
              ].map((spec) => (
                <div key={spec.label} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                  <p className="text-xs font-black text-stone-700 mb-2">{spec.label}</p>
                  <p className="text-sm font-bold text-orange-700 font-mono">{spec.upload}</p>
                  {spec.aiGen && <p className="text-xs text-stone-400 mt-0.5">AI gen: {spec.aiGen}</p>}
                  {spec.note && <p className="text-xs text-stone-400 mt-0.5">{spec.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
