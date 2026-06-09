/**
 * lib/search-synonyms.ts — Search Synonym Registry
 *
 * Purpose-built synonym API for search query expansion.
 * Built on top of lib/transliteration.ts ALIAS_GROUPS so there is
 * a single source of truth — no data duplication.
 *
 * Usage:
 *   import { getSynonyms, isSynonymOf, findSynonymGroup } from '@/lib/search-synonyms'
 *
 *   getSynonyms('shiv')
 *   // → ['shiva', 'mahadev', 'shankar', 'bholenath', 'शिव', 'महादेव', ...]
 *
 *   isSynonymOf('ganesh', 'vinayak')  // → true
 *   isSynonymOf('ganesh', 'krishna') // → false
 */

import { ALIAS_GROUPS } from '@/lib/transliteration'

// ── Synonym group type ────────────────────────────────────────────────────────

export type SynonymGroup = {
  id: string
  canonical: string      // primary/display name (first English term)
  canonicalHi: string    // primary Hindi name (first Hindi term)
  synonyms: string[]     // all alternate English terms
  synonymsHi: string[]   // all alternate Hindi/Devanagari terms
  all: string[]          // English + Hindi combined (for matching)
}

// ── Build registry from ALIAS_GROUPS ─────────────────────────────────────────

export const SYNONYM_REGISTRY: SynonymGroup[] = ALIAS_GROUPS.map((group) => ({
  id:          group.id,
  canonical:   group.terms[0] ?? group.id,
  canonicalHi: group.termsHi[0] ?? '',
  synonyms:    group.terms.slice(1),
  synonymsHi:  group.termsHi.slice(1),
  all:         [...group.terms, ...group.termsHi],
}))

// ── Flat lookup map ───────────────────────────────────────────────────────────
// normalized term → all terms in its group

export const SYNONYM_MAP = new Map<string, string[]>()

function _norm(t: string): string {
  return t.toLowerCase().trim().replace(/\s+/g, ' ')
}

for (const group of ALIAS_GROUPS) {
  const all = [...group.terms, ...group.termsHi]
  for (const term of all) {
    SYNONYM_MAP.set(_norm(term), all)
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns all known synonyms for a query term (excluding the query itself).
 * Returns [] if no synonyms found.
 *
 * @example
 * getSynonyms('hanuman') // → ['bajrangbali', 'anjaneya', 'maruti', 'हनुमान', ...]
 * getSynonyms('ganesh')  // → ['ganesha', 'ganpati', 'vinayak', 'गणेश', ...]
 */
export function getSynonyms(query: string): string[] {
  const key = _norm(query)
  const group = SYNONYM_MAP.get(key)
  if (group) return group.filter((t) => _norm(t) !== key)

  // Partial/prefix match
  for (const [k, terms] of SYNONYM_MAP) {
    if (k.startsWith(key) || key.startsWith(k)) {
      return terms.filter((t) => _norm(t) !== key)
    }
  }
  return []
}

/**
 * Returns true when a and b are synonyms of each other.
 *
 * @example
 * isSynonymOf('shiv', 'mahadev')  // → true
 * isSynonymOf('shiv', 'krishna') // → false
 */
export function isSynonymOf(a: string, b: string): boolean {
  const aKey = _norm(a)
  const bKey = _norm(b)
  const group = SYNONYM_MAP.get(aKey)
  if (!group) return false
  return group.some((t) => _norm(t) === bKey)
}

/**
 * Returns the full SynonymGroup for a query term, or null if not found.
 *
 * @example
 * findSynonymGroup('bajrangbali')?.canonical // → 'hanuman'
 */
export function findSynonymGroup(query: string): SynonymGroup | null {
  const key = _norm(query)
  return (
    SYNONYM_REGISTRY.find((g) =>
      g.all.some((t) => _norm(t) === key)
    ) ?? null
  )
}

/**
 * Returns all canonical names (first English term of each group).
 * Useful for building search facets or tag clouds.
 */
export function getAllCanonicalNames(): string[] {
  return SYNONYM_REGISTRY.map((g) => g.canonical)
}

/**
 * Checks if a query has any synonyms registered.
 */
export function hasSynonyms(query: string): boolean {
  const key = _norm(query)
  if (SYNONYM_MAP.has(key)) return true
  for (const k of SYNONYM_MAP.keys()) {
    if (k.startsWith(key) || key.startsWith(k)) return true
  }
  return false
}

export const SYNONYM_GROUP_COUNT = SYNONYM_REGISTRY.length
export const SYNONYM_TERM_COUNT  = SYNONYM_MAP.size
