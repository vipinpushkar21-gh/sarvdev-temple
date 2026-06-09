/**
 * lib/temple-quality.ts — Temple Data Quality Scoring Engine
 *
 * Pure functions — no Mongoose/DB imports.
 * Safe to import on both server (API routes) and client (admin UI).
 *
 * Scoring: 0–100 points across 15 criteria.
 * Tiers:   Excellent (90+) | Good (70–89) | Needs Work (50–69) | Poor (<50)
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type QualityTier = 'excellent' | 'good' | 'needs-work' | 'poor'

export type QualityIssue = {
  field: string
  label: string
  points: number
}

export type QualityCriterion = {
  id: string
  label: string
  points: number
  issueLabel: string
  check: (doc: Record<string, any>) => boolean
}

export type QualityResult = {
  score: number
  tier: QualityTier
  issues: QualityIssue[]
  passed: number
  failed: number
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function hasStr(v: any, minLen = 1): boolean {
  return typeof v === 'string' && v.trim().length >= minLen
}

function hasValidCoords(doc: Record<string, any>): boolean {
  const lat = doc.latitude
  const lng = doc.longitude
  return (
    typeof lat === 'number' && lat !== 0 &&
    typeof lng === 'number' && lng !== 0 &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  )
}

// ── Scoring criteria (total = 100 pts) ───────────────────────────────────────

export const QUALITY_CRITERIA: QualityCriterion[] = [
  {
    id: 'cardImage', label: 'Card Image', points: 8,
    issueLabel: 'Missing card image (imageCard / image)',
    check: (d) => hasStr(d.imageCard) || hasStr(d.image),
  },
  {
    id: 'heroImage', label: 'Hero Image', points: 7,
    issueLabel: 'Missing hero image (imageHero / heroImage)',
    check: (d) => hasStr(d.imageHero) || hasStr(d.heroImage),
  },
  {
    id: 'coordinates', label: 'GPS Coordinates', points: 12,
    issueLabel: 'Missing or invalid lat/lng coordinates',
    check: hasValidCoords,
  },
  {
    id: 'city', label: 'City', points: 5,
    issueLabel: 'Missing city',
    check: (d) => hasStr(d.city),
  },
  {
    id: 'state', label: 'State', points: 5,
    issueLabel: 'Missing state',
    check: (d) => hasStr(d.state),
  },
  {
    id: 'description', label: 'Description (EN)', points: 10,
    issueLabel: 'Missing or too-short description (min 50 chars)',
    check: (d) => hasStr(d.description, 50),
  },
  {
    id: 'descriptionHi', label: 'Description (HI)', points: 5,
    issueLabel: 'Missing Hindi description (min 30 chars)',
    check: (d) => hasStr(d.descriptionHi, 30),
  },
  {
    id: 'deity', label: 'Deity', points: 5,
    issueLabel: 'Missing deity',
    check: (d) => hasStr(d.deity),
  },
  {
    id: 'sacredCategory', label: 'Sacred Category', points: 10,
    issueLabel: 'Not classified in any sacred category',
    check: (d) => Array.isArray(d.sacredCategorySlugs) && d.sacredCategorySlugs.length > 0,
  },
  {
    id: 'metaTitle', label: 'Meta Title', points: 5,
    issueLabel: 'Missing SEO meta title',
    check: (d) => hasStr(d.metaTitle),
  },
  {
    id: 'metaDescription', label: 'Meta Description', points: 5,
    issueLabel: 'Missing SEO meta description',
    check: (d) => hasStr(d.metaDescription),
  },
  {
    id: 'ogImage', label: 'OG Image', points: 5,
    issueLabel: 'Missing Open Graph image',
    check: (d) => hasStr(d.ogImage),
  },
  {
    id: 'shortDescription', label: 'Short Description', points: 5,
    issueLabel: 'Missing short description / summary',
    check: (d) => hasStr(d.shortDescription),
  },
  {
    id: 'contact', label: 'Contact Info', points: 5,
    issueLabel: 'No contact info (phone / email / website)',
    check: (d) => hasStr(d.phone) || hasStr(d.email) || hasStr(d.website),
  },
  {
    id: 'timings', label: 'Timings', points: 3,
    issueLabel: 'Missing opening timings',
    check: (d) => hasStr(d.timings),
  },
]

export const MAX_QUALITY_SCORE = QUALITY_CRITERIA.reduce((s, c) => s + c.points, 0) // 100

// ── Public API ────────────────────────────────────────────────────────────────

/** Computes the 0–100 quality score for a lean temple document. */
export function computeQualityScore(doc: Record<string, any>): number {
  return QUALITY_CRITERIA.reduce((sum, c) => sum + (c.check(doc) ? c.points : 0), 0)
}

/** Returns the quality tier label for a score. */
export function getQualityTier(score: number): QualityTier {
  if (score >= 90) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'needs-work'
  return 'poor'
}

/** Returns the list of failed criteria (issues) for a lean temple document. */
export function getQualityIssues(doc: Record<string, any>): QualityIssue[] {
  return QUALITY_CRITERIA
    .filter((c) => !c.check(doc))
    .map((c) => ({ field: c.id, label: c.issueLabel, points: c.points }))
}

/** Runs a full quality evaluation and returns a structured result. */
export function evaluateTemple(doc: Record<string, any>): QualityResult {
  const issues = getQualityIssues(doc)
  const score = MAX_QUALITY_SCORE - issues.reduce((s, i) => s + i.points, 0)
  return {
    score,
    tier: getQualityTier(score),
    issues,
    passed: QUALITY_CRITERIA.length - issues.length,
    failed: issues.length,
  }
}

// ── Display constants ─────────────────────────────────────────────────────────

export const TIER_CONFIG: Record<QualityTier, { label: string; color: string; bg: string; border: string; min: number }> = {
  excellent:    { label: 'Excellent',   color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  min: 90 },
  good:         { label: 'Good',        color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   min: 70 },
  'needs-work': { label: 'Needs Work',  color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', min: 50 },
  poor:         { label: 'Poor',        color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    min: 0  },
}

export const TIER_ORDER: QualityTier[] = ['excellent', 'good', 'needs-work', 'poor']
