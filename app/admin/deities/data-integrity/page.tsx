"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { DEITY_CATEGORIES } from "@/app/deities/page"
import { findBestDeityMatch, normalizeDeityIdentity } from "@/lib/deity-identity"

export default function DeityDataIntegrityPage() {
  const [dbDeities, setDbDeities] = useState<any[]>([])
  const [categoryReport, setCategoryReport] = useState<any>(null)
  const [repairing, setRepairing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/deities", { credentials: "include", cache: "no-store" })
        if (!response.ok) throw new Error("Failed to load deity records")
        const data = await response.json()
        setDbDeities(Array.isArray(data) ? data : [])
        const reportResponse = await fetch("/api/admin/deities/integrity-report", { credentials: "include", cache: "no-store" })
        if (reportResponse.ok) setCategoryReport(await reportResponse.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function repairCategoryIds() {
    if (!confirm("Repair invalid deity Category ID values to canonical category slugs? No deity records or images will be deleted.")) return
    setRepairing(true)
    try {
      const response = await fetch("/api/admin/deities/integrity-report", {
        method: "POST",
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Repair failed")
      setCategoryReport(data.after)
      alert(`Repaired ${data.repaired || 0} deity category records.`)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Repair failed")
    } finally {
      setRepairing(false)
    }
  }

  const report = useMemo(() => {
    const staticDeities = DEITY_CATEGORIES.flatMap((category: any) =>
      category.deities.map((deity: any) => ({ ...deity, category: category.title, categoryId: category.id }))
    )

    const usedDbIds = new Set<string>()
    const matched = staticDeities.map((staticDeity: any) => {
      const match = findBestDeityMatch(staticDeity, dbDeities, usedDbIds)
      if (match?.deity?._id) usedDbIds.add(String(match.deity._id))
      return { staticDeity, match }
    })

    const missingStatic = matched.filter((item) => !item.match)
    const dbWithoutStatic = dbDeities.filter((deity) => !usedDbIds.has(String(deity._id || "")))
    const duplicateSlugs = collectDuplicates(dbDeities, (item) => String(item.slug || "").toLowerCase())
    const duplicateNames = collectDuplicates(dbDeities, (item) => normalizeDeityIdentity(item.name || item.slug))
    const customized = dbDeities.filter((item) => item.isCustomized)
    const cloudinaryImages = dbDeities.filter((item) => [item.image, item.imageCard, item.imageHero, item.ogImage].some((value) => String(value || "").includes("res.cloudinary.com")))
    const atRisk = dbDeities.filter((item) => !item.staticSlug && !item.isCustomized && [item.image, item.imageCard, item.imageHero].some(Boolean))

    return {
      staticTotal: staticDeities.length,
      dbTotal: dbDeities.length,
      matchedCount: matched.length - missingStatic.length,
      missingStatic,
      dbWithoutStatic,
      duplicateSlugs,
      duplicateNames,
      customized,
      cloudinaryImages,
      atRisk,
    }
  }, [dbDeities])

  if (loading) {
    return <div className="admin-container section-sm">Loading deity integrity report...</div>
  }

  return (
    <div className="admin-container section-sm space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/deities" className="text-primary-600 hover:text-primary-700 font-medium">Back to Deities</Link>
          <h1 className="mt-3 text-display-sm font-serif text-secondary-800">Deity Data Integrity</h1>
          <p className="text-body text-ink-muted mt-1">DB/static matching, duplicates, image safety, and records at risk.</p>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Static deities" value={report.staticTotal} />
        <Stat label="DB records" value={report.dbTotal} />
        <Stat label="Static matched" value={report.matchedCount} />
        <Stat label="Missing in DB" value={report.missingStatic.length} />
        <Stat label="Unmatched DB" value={report.dbWithoutStatic.length} />
        <Stat label="Customized" value={report.customized.length} />
        <Stat label="Cloudinary media" value={report.cloudinaryImages.length} />
        <Stat label="At risk" value={report.atRisk.length} />
      </div>

      {categoryReport && (
        <section className="card p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">Category ID Safety</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Bad Category IDs: {categoryReport.badCategoryIdRecords?.length || 0} · Repairable category fields: {categoryReport.repairableCategoryRecords?.length || 0} · Invalid categories: {categoryReport.invalidCategoryRecords?.length || 0}
              </p>
            </div>
            <button
              type="button"
              disabled={repairing || !(categoryReport.badCategoryIdRecords?.length > 0)}
              onClick={repairCategoryIds}
              className="rounded-lg border border-amber-200 px-4 py-2 text-sm font-bold text-amber-700 disabled:opacity-50"
            >
              {repairing ? "Repairing..." : "Repair Category IDs"}
            </button>
          </div>
        </section>
      )}

      <ReportSection title="Static Missing In DB" items={report.missingStatic.map((item) => `${item.staticDeity.name} (${item.staticDeity.slug})`)} />
      <ReportSection title="DB Records Without Static Match" items={report.dbWithoutStatic.map((item) => `${item.name} (${item.slug})`)} />
      <ReportSection title="Duplicate Slugs" items={report.duplicateSlugs} />
      <ReportSection title="Duplicate Normalized Names" items={report.duplicateNames} />
      <ReportSection title="Records At Risk" items={report.atRisk.map((item) => `${item.name} (${item.slug}) has media but no staticSlug/customized marker`)} />
    </div>
  )
}

function collectDuplicates(items: any[], getKey: (item: any) => string) {
  const groups = new Map<string, any[]>()
  items.forEach((item) => {
    const key = getKey(item)
    if (!key) return
    groups.set(key, [...(groups.get(key) || []), item])
  })
  return Array.from(groups.entries())
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => `${key}: ${group.map((item) => item.slug || item.name).join(", ")}`)
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-gray-950 tabular-nums">{value.toLocaleString("en-IN")}</p>
    </div>
  )
}

function ReportSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">No issues found.</p>
      ) : (
        <ul className="mt-3 grid gap-2 text-sm text-ink-muted">
          {items.slice(0, 80).map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
    </section>
  )
}
