// lib/devotional-categories.ts
// Single source of truth for devotional categories.
// Shared by server APIs, admin forms, models, and migration tools.

export type DevotionalCategory = {
  id: string       // canonical display name, e.g. "Aarti"
  slug: string     // URL-safe slug, e.g. "aarti"
  nameHi: string   // Hindi name
  icon: string     // emoji icon
  description: string
}

export const DEVOTIONAL_CATEGORIES: DevotionalCategory[] = [
  { id: 'Aarti',      slug: 'aarti',      nameHi: 'आरती',       icon: '🪔', description: 'Daily puja and evening lamp offerings for major deities.' },
  { id: 'Bhajan',     slug: 'bhajan',     nameHi: 'भजन',        icon: '🎵', description: 'Melodic devotional songs for listening, satsang and kirtan.' },
  { id: 'Chalisa',    slug: 'chalisa',    nameHi: 'चालीसा',     icon: '📖', description: 'Forty-verse devotional paths with readable lyrics and audio support.' },
  { id: 'Mantra',     slug: 'mantra',     nameHi: 'मंत्र',      icon: '📿', description: 'Sacred chants for japa, meditation, focus and protection.' },
  { id: 'Stotra',     slug: 'stotra',     nameHi: 'स्तोत्र',    icon: '🕉️', description: 'Classical hymns and suktams for recitation and contemplation.' },
  { id: 'Sukt',       slug: 'sukt',       nameHi: 'सूक्त',      icon: '📜', description: 'Vedic hymns and sacred suktas for recitation and contemplation.' },
  { id: 'Stuti',      slug: 'stuti',      nameHi: 'स्तुति',     icon: '🙏', description: 'Short praise hymns for daily remembrance.' },
  { id: 'Shloka',     slug: 'shloka',     nameHi: 'श्लोक',      icon: '📜', description: 'Concise Sanskrit verses with chanting-friendly presentation.' },
  { id: 'Ek Shloki',  slug: 'ek-shloki',  nameHi: 'एक श्लोकी',  icon: '✨', description: 'Single-verse devotional summaries for quick daily recitation.' },
  { id: 'Ashtaka',    slug: 'ashtaka',    nameHi: 'अष्टकम्',    icon: '🌸', description: 'Eight-verse hymns for focused worship.' },
  { id: 'Path',       slug: 'path',       nameHi: 'पाठ',        icon: '📚', description: 'Long-form sacred readings and recitation content.' },
  { id: 'Namavali',   slug: 'namavali',   nameHi: 'नामावली',    icon: '🌺', description: 'Sacred name collections for archana and japa.' },
  { id: 'Sahasranamavali', slug: 'sahasranamavali', nameHi: 'सहस्रनामावली', icon: '🌼', description: 'Sacred thousand-name collections for archana and japa.' },
  { id: 'Kavacham',   slug: 'kavacham',   nameHi: 'कवचम्',      icon: '🛡️', description: 'Protective hymns and kavach paths for spiritual strength.' },
  { id: 'Prarthana',  slug: 'prarthana',  nameHi: 'प्रार्थना',  icon: '🌿', description: 'Prayer collections for simple daily devotion.' },
  { id: 'Vrat Katha', slug: 'vrat-katha', nameHi: 'व्रत कथा',   icon: '📖', description: 'Vrat stories and readings connected to sacred observances.' },
]

// Valid non-canonical legacy values that should not be flagged as invalid
export const LEGACY_CATEGORY_VALUES = new Set(['108 Namavali', 'Other'])

const _bySlug = new Map(DEVOTIONAL_CATEGORIES.map((c) => [c.slug, c]))
const _byName = new Map(DEVOTIONAL_CATEGORIES.map((c) => [c.id.toLowerCase(), c]))

export function getCategoryBySlug(slug: string): DevotionalCategory | undefined {
  if (slug === '108-namavali') return _bySlug.get('namavali')
  return _bySlug.get(slug)
}

export function getCategoryByName(name: string): DevotionalCategory | undefined {
  const key = (name || '').toLowerCase()
  if (['108 namavali', '108namavali', '108 namawali', '108namawali'].includes(key)) return _byName.get('namavali')
  if (key === 'sukt' || key === 'sukta' || key === 'suktam' || key === 'सूक्त' || key === 'सूक्तम्') return _byName.get('sukt')
  return _byName.get(key)
}

export function categoryNameToSlug(name: string): string {
  return getCategoryByName(name)?.slug ?? (name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function categorySlugToName(slug: string): string {
  return getCategoryBySlug(slug)?.id ?? slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function isValidCategoryName(name: string): boolean {
  if (!name) return false
  return getCategoryByName(name) !== undefined || LEGACY_CATEGORY_VALUES.has(name)
}
