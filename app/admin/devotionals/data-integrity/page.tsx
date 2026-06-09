"use client"

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Database, Play, RefreshCw, Shield } from 'lucide-react'

type AuditCheck = {
  count: number
  sample?: any[]
  invalidValues?: string[]
  note?: string
}

type AuditResult = {
  total: number
  generatedAt: string
  audit: Record<string, AuditCheck>
  summary: { dbDeityCount: number; categoryValues: string[] }
}

type FailedRecord = {
  id: string
  title: string
  errorCode?: number | string
  errorMsg: string
}

type MigrateResult = {
  dryRun: boolean
  totalProcessed: number
  totalUpdated: number
  slugDuplicates: { id: string; title: string; slug: string }[]
  changes: { id: string; title: string; fields: string[] }[]
  failedRecords: FailedRecord[]
}

function StatusDot({ count, warn = false }: { count: number; warn?: boolean }) {
  if (count === 0) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
  if (warn) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
  return <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
}

function AuditRow({
  label, check, renderSample, warn = false,
}: {
  label: string
  check: AuditCheck
  renderSample?: (item: any) => string
  warn?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const hasSample = (check.sample?.length ?? 0) > 0 || (check.invalidValues?.length ?? 0) > 0
  const isOk = check.count === 0

  return (
    <div className={`rounded-xl border p-3.5 transition-colors ${
      isOk ? 'border-emerald-100 bg-emerald-50/40' : warn ? 'border-amber-100 bg-amber-50/40' : 'border-red-100 bg-red-50/40'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <StatusDot count={check.count} warn={warn} />
          <span className="text-sm font-semibold text-stone-800">{label}</span>
          {check.note && <span className="hidden sm:inline text-xs text-stone-400 italic">— {check.note}</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-sm font-black tabular-nums ${isOk ? 'text-emerald-600' : warn ? 'text-amber-700' : 'text-red-700'}`}>
            {check.count.toLocaleString()}
          </span>
          {hasSample && !isOk && (
            <button type="button" onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-0.5 text-xs text-stone-400 hover:text-stone-700 px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200">
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              sample
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="mt-3 space-y-1.5 pl-5 border-l-2 border-stone-200">
          {check.invalidValues && check.invalidValues.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {check.invalidValues.map((v, i) => (
                <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{v}</span>
              ))}
            </div>
          )}
          {check.sample?.map((item, i) => (
            <div key={i} className="text-xs text-stone-600 bg-white rounded-lg px-3 py-2 border border-stone-100 font-mono">
              {renderSample ? renderSample(item) : item.title || item._id || JSON.stringify(item).slice(0, 120)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700 mt-5 mb-2 first:mt-0">{children}</p>
}

export default function DataIntegrityPage() {
  const [auditLoading, setAuditLoading] = useState(false)
  const [migrateLoading, setMigrateLoading] = useState(false)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [migrateResult, setMigrateResult] = useState<MigrateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [migrationDone, setMigrationDone] = useState(false)

  async function runAudit() {
    setAuditLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/devotionals/audit')
      if (res.status === 401) { setError('Not authorised — log in as admin first.'); return }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError('Audit failed (HTTP ' + res.status + '): ' + (body?.message || body?.error || 'Check server logs.'))
        return
      }
      setAuditResult(await res.json())
    } catch (e: any) {
      setError('Network error running audit: ' + (e?.message || String(e)))
    } finally { setAuditLoading(false) }
  }

  async function runDryRun() {
    setMigrateLoading(true)
    setError(null)
    setMigrationDone(false)
    try {
      const res = await fetch('/api/admin/devotionals/migrate')
      if (res.status === 401) { setError('Not authorised — log in as admin first.'); return }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError('Dry run failed (HTTP ' + res.status + '): ' + (body?.message || body?.error || 'Check server logs.'))
        return
      }
      setMigrateResult(await res.json())
    } catch (e: any) {
      setError('Network error running dry run: ' + (e?.message || String(e)))
    } finally { setMigrateLoading(false) }
  }

  async function executeMigration() {
    setShowConfirm(false)
    setMigrateLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/devotionals/migrate', { method: 'POST' })
      if (res.status === 401) { setError('Not authorised — log in as admin first.'); return }
      // Accept 200 (full success) and 207 (partial success with some failures)
      if (res.status !== 200 && res.status !== 207) {
        const body = await res.json().catch(() => ({}))
        setError('Migration failed (HTTP ' + res.status + '): ' + (body?.message || body?.error || 'Check server logs.'))
        return
      }
      const data = await res.json()
      setMigrateResult(data)
      setMigrationDone(true)
      if (res.status === 207) {
        setError('Migration completed with ' + (data.failedRecords?.length ?? 0) + ' write error(s). Check server logs for details.')
      }
    } catch (e: any) {
      setError('Network error running migration: ' + (e?.message || String(e)))
    } finally { setMigrateLoading(false) }
  }

  const a = auditResult?.audit

  return (
    <>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-stone-900">Run Migration?</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  This will fill <strong>only missing canonical fields</strong> (slug, categorySlug, categoryHi, deitySlug, source) using bulkWrite.
                </p>
                <p className="mt-2 text-sm text-stone-600">
                  <strong>Protected — never touched:</strong> title, titleHi, content, lyrics, audio, audioUrl, images.
                </p>
                {migrateResult && migrateResult.dryRun && (
                  <p className="mt-2 text-sm font-semibold text-amber-700">
                    Dry run showed {migrateResult.totalUpdated.toLocaleString()} records would be updated.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowConfirm(false)} className="admin-btn admin-btn-ghost px-5 py-2 text-sm">Cancel</button>
              <button type="button" onClick={executeMigration} className="admin-btn admin-btn-primary px-5 py-2 text-sm">Yes, Run Migration</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="admin-page-title flex items-center gap-2.5">
              <Database className="w-6 h-6 text-orange-600" />
              Devotionals Data Integrity
            </h1>
            <p className="admin-section-subtitle">Audit canonical fields and run safe migrations across all devotional records.</p>
          </div>
          <Link href="/admin/devotionals" className="admin-btn admin-btn-ghost px-4 py-2 text-sm shrink-0">Back to Devotionals</Link>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-900">
          <Shield className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <strong>Migration is safe-only.</strong> Fills missing fields (slug, categorySlug, categoryHi, deitySlug, source) and never overwrites existing title, content, audio, or images.
            Slug collisions are detected and skipped. Always run <strong>Dry Run</strong> first. If any individual write fails, remaining records continue — failures are reported separately.
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="break-words">{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-700 text-xl leading-none shrink-0 ml-2">&times;</button>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={runAudit} disabled={auditLoading}
            className="admin-btn admin-btn-ghost px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
            {auditLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {auditLoading ? 'Running Audit...' : 'Run Audit'}
          </button>
          <button type="button" onClick={runDryRun} disabled={migrateLoading}
            className="admin-btn admin-btn-ghost px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60 border-blue-200 text-blue-700 hover:bg-blue-50">
            {migrateLoading && !migrationDone ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Migration Dry Run
          </button>
          <button type="button" onClick={() => setShowConfirm(true)} disabled={migrateLoading}
            className="admin-btn admin-btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
            <Shield className="w-4 h-4" />
            Run Migration
          </button>
        </div>

        {auditResult && a && (
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="admin-section-title">Audit Results</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {auditResult.total.toLocaleString()} total devotionals &middot; generated {new Date(auditResult.generatedAt).toLocaleString()}
                </p>
              </div>
              {(() => {
                const issues = Object.values(a).filter(c => c.count > 0).length
                return issues === 0 ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All clean
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" /> {issues} issue type{issues !== 1 ? 's' : ''}
                  </span>
                )
              })()}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Devotionals', value: auditResult.total, hi: false },
                { label: 'Missing Slug', value: a.missingSlug?.count ?? 0, hi: true },
                { label: 'Missing catSlug', value: a.missingCategorySlug?.count ?? 0, hi: true },
                { label: 'Missing deitySlug', value: a.missingDeitySlug?.count ?? 0, hi: false },
              ].map(({ label, value, hi }) => (
                <div key={label} className={`rounded-xl p-3.5 border ${value === 0 ? 'bg-emerald-50 border-emerald-100' : hi ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <p className={`text-2xl font-black tabular-nums ${value === 0 ? 'text-emerald-700' : hi ? 'text-red-700' : 'text-amber-700'}`}>{value.toLocaleString()}</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <SectionLabel>Slugs</SectionLabel>
              <AuditRow label="Missing slug" check={a.missingSlug ?? { count: 0 }}
                renderSample={item => String(item.title || '') + '  (id: ' + String(item._id || '') + ')'} />
              <AuditRow label="Duplicate slugs" check={a.duplicateSlugs ?? { count: 0 }}
                renderSample={item => 'slug: "' + String(item._id) + '"  — ' + String(item.count) + ' records'} />

              <SectionLabel>Titles</SectionLabel>
              <AuditRow label="Missing Hindi title (titleHi)" check={a.missingTitleHi ?? { count: 0 }} warn
                renderSample={item => String(item.title || '—')} />
              <AuditRow label="Duplicate titles" check={a.duplicateTitles ?? { count: 0 }} warn
                renderSample={item => '"' + String(item.sample || item._id) + '"  — ' + String(item.count) + ' copies'} />

              <SectionLabel>Categories</SectionLabel>
              <AuditRow label="Missing categorySlug" check={a.missingCategorySlug ?? { count: 0 }}
                renderSample={item => String(item.title || '—') + '  (category: ' + String(item.category || 'none') + ')'} />
              <AuditRow label="Invalid category values" check={a.invalidCategory ?? { count: 0 }} warn
                renderSample={item => String(item.title || '—') + '  (category: "' + String(item.category) + '")'} />

              <SectionLabel>Deities</SectionLabel>
              <AuditRow label="Missing deitySlug" check={a.missingDeitySlug ?? { count: 0 }} warn
                renderSample={item => String(item.title || '—') + '  (deity: ' + String(item.deity || 'none') + ')'} />
              <AuditRow label="Unmatched deitySlug (slug set but not in DB)" check={a.unmatchedDeitySlug ?? { count: 0 }}
                renderSample={item => String(item.title || '—') + '  (deitySlug: "' + String(item.deitySlug) + '")'} />

              <SectionLabel>Content &amp; Media</SectionLabel>
              <AuditRow label="Missing language" check={a.missingLanguage ?? { count: 0 }}
                renderSample={item => String(item.title || '—')} />
              <AuditRow label="Missing content / lyrics" check={a.missingContent ?? { count: 0 }} warn
                renderSample={item => String(item.title || '—')} />
              <AuditRow label="Missing audio (audioUrl + audio both empty)" check={a.missingAudio ?? { count: 0 }} warn
                renderSample={item => String(item.title || '—')} />
            </div>

            {auditResult.summary?.categoryValues?.length > 0 && (
              <div className="mt-5 rounded-xl border border-stone-100 bg-stone-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">
                  All distinct category values in DB ({auditResult.summary.categoryValues.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {auditResult.summary.categoryValues.map((v, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700">{v || '(empty)'}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {migrateResult && (
          <div className={`admin-card p-6 space-y-4 ${migrationDone && (migrateResult.failedRecords?.length ?? 0) === 0 ? 'border-emerald-200' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="admin-section-title">{migrateResult.dryRun ? 'Migration Dry Run' : 'Migration Executed'}</h2>
              {migrationDone && (migrateResult.failedRecords?.length ?? 0) === 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
              {migrationDone && (migrateResult.failedRecords?.length ?? 0) > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" /> Partial — {migrateResult.failedRecords.length} failed
                </span>
              )}
              {migrateResult.dryRun && !migrationDone && (
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">Dry Run — no changes made</span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Scanned', value: migrateResult.totalProcessed },
                { label: migrateResult.dryRun ? 'Would update' : 'Updated', value: migrateResult.totalUpdated },
                { label: 'Slug collisions skipped', value: migrateResult.slugDuplicates?.length ?? 0 },
                { label: 'Write errors', value: migrateResult.failedRecords?.length ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-stone-50 border border-stone-100 p-3.5">
                  <p className="text-2xl font-black tabular-nums text-stone-800">{value.toLocaleString()}</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {(migrateResult.failedRecords?.length ?? 0) > 0 && (
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-red-700 mb-2">Write Errors (check server logs for full detail)</p>
                <div className="space-y-1.5">
                  {migrateResult.failedRecords.map((f, i) => (
                    <div key={i} className="text-xs bg-white rounded-lg px-3 py-2 border border-red-100">
                      <span className="font-semibold text-stone-800">{f.title || f.id}</span>
                      {f.errorCode && <span className="ml-2 text-red-600 font-mono">code {f.errorCode}</span>}
                      <span className="ml-2 text-red-600">{f.errorMsg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(migrateResult.slugDuplicates?.length ?? 0) > 0 && (
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">Slug Collisions — skipped, manual fix needed</p>
                <div className="space-y-1.5">
                  {migrateResult.slugDuplicates.map((d, i) => (
                    <div key={i} className="text-xs bg-white rounded-lg px-3 py-2 border border-amber-100 font-mono">
                      {d.title} &rarr; &quot;{d.slug}&quot; (already exists)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(migrateResult.changes?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">
                  Sample records {migrateResult.dryRun ? 'that would be updated' : 'updated'} (first {migrateResult.changes.length})
                </p>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {migrateResult.changes.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs bg-stone-50 rounded-xl px-3 py-2.5 border border-stone-100">
                      <span className="font-semibold text-stone-800 min-w-0 truncate flex-1">{c.title || c.id}</span>
                      <div className="flex flex-wrap gap-1 shrink-0">
                        {c.fields.map(f => (
                          <span key={f} className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">{f}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {migrateResult.dryRun && migrateResult.totalUpdated > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                <p className="text-sm text-blue-800">Ready to apply <strong>{migrateResult.totalUpdated.toLocaleString()} updates</strong>?</p>
                <button type="button" onClick={() => setShowConfirm(true)}
                  className="admin-btn admin-btn-primary px-4 py-2 text-sm ml-4 shrink-0">
                  Run Migration
                </button>
              </div>
            )}

            {migrateResult.dryRun && migrateResult.totalUpdated === 0 && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                All canonical fields already populated — no migration needed.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}