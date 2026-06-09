/**
 * lib/sacred-category-registry.ts
 *
 * Enriched single source of truth for all sacred category metadata.
 * Extends lib/sacred-categories.ts with: id, priority, seoTitle,
 * seoDescription, descriptionHi, and superGroups classification.
 *
 * Existing code that imports from lib/sacred-categories.ts is unaffected.
 * New features (integrity tool, category SEO, sitemap) import from here.
 */

import {
  SACRED_CATEGORIES,
  CATEGORY_GROUPS,
  type SacredCategory,
  type CategoryGroup,
  getCategoryBySlug,
  getCategoryByName,
  getSlugForCategoryName,
} from './sacred-categories'

export {
  getCategoryBySlug,
  getCategoryByName,
  getSlugForCategoryName,
  CATEGORY_GROUPS,
  type SacredCategory,
  type CategoryGroup,
}

// ── Super-group types ─────────────────────────────────────────────────────────

export type SuperGroup = {
  key: string
  label: string
  labelHi: string
  description: string
  order: number
}

export type SacredCategoryEntry = SacredCategory & {
  id: string            // Stable identifier — slug uppercased with underscores
  priority: number      // Global sort weight: groupOrder*100 + categoryOrder
  seoTitle: string      // Optimized page title for Google
  seoDescription: string // 155-char meta description
  descriptionHi: string // Hindi description (auto-derived from nameHi when not specified)
  superGroups: string[] // Keys from REGISTRY_SUPER_GROUPS
}

// ── Super-groups ──────────────────────────────────────────────────────────────

export const REGISTRY_SUPER_GROUPS: SuperGroup[] = [
  { key: 'jyotirlinga',         label: 'Jyotirlinga',           labelHi: 'ज्योतिर्लिंग',        description: 'Sacred Shiva shrines associated with the 12 Jyotirlingas and related circuits.',           order: 1 },
  { key: 'shakti-peetha',       label: 'Shakti Peetha',         labelHi: 'शक्ति पीठ',           description: 'Goddess temples of the Shakti Peetha tradition including Maha Peethas and Siddha Peethas.', order: 2 },
  { key: 'divya-desam',         label: 'Divya Desam',           labelHi: 'दिव्य देसम',          description: '108 Vishnu temples glorified by the Alwar poet-saints and related circuits.',              order: 3 },
  { key: 'char-dham',           label: 'Char Dham',             labelHi: 'चार धाम',             description: 'The four sacred abodes (Char Dham) and Chota Char Dham pilgrimage circuits.',              order: 4 },
  { key: 'pancha-bhoota',       label: 'Pancha Bhoota',         labelHi: 'पंच भूत',             description: 'Five Shiva temples representing the five elements of nature.',                             order: 5 },
  { key: 'ashta-vinayak',       label: 'Ashta Vinayak',         labelHi: 'अष्ट विनायक',         description: 'Eight ancient Ganesha temples and other Vinayaka pilgrimage circuits.',                    order: 6 },
  { key: 'navagraha',           label: 'Navagraha',             labelHi: 'नवग्रह',              description: 'Nine planetary deity shrines and Nakshatra/Rashi temple traditions.',                      order: 7 },
  { key: 'sapta-puri',          label: 'Sapta Puri',            labelHi: 'सप्त पुरी',           description: 'The seven sacred moksha-granting cities of ancient India.',                               order: 8 },
  { key: 'pilgrimage-circuits', label: 'Pilgrimage Circuits',   labelHi: 'तीर्थयात्रा सर्किट', description: 'Organised multi-stop pilgrimage routes across India.',                                      order: 9 },
  { key: 'temple-traditions',   label: 'Temple Traditions',     labelHi: 'मंदिर परंपराएं',      description: 'Specific spiritual traditions, sampradayas and organised temple movements.',               order: 10 },
  { key: 'regional',            label: 'Regional Categories',   labelHi: 'क्षेत्रीय श्रेणियां', description: 'State-level and regional temple circuits, dynasties and architectural traditions.',         order: 11 },
  { key: 'deity-categories',    label: 'Deity Categories',      labelHi: 'देवता श्रेणियां',     description: 'Temples organised by specific deity, avatar or divine form.',                             order: 12 },
  { key: 'river-temples',       label: 'River Temples',         labelHi: 'नदी मंदिर',           description: 'Temples on sacred river banks, confluences and river-origin sites.',                      order: 13 },
  { key: 'mountain-temples',    label: 'Mountain Temples',      labelHi: 'पर्वत मंदिर',         description: 'Himalayan and hilltop temples and high-altitude pilgrimage circuits.',                    order: 14 },
  { key: 'forest-temples',      label: 'Forest Temples',        labelHi: 'वन मंदिर',            description: 'Ancient temples in sacred groves and forest landscapes.',                                 order: 15 },
  { key: 'coastal-temples',     label: 'Coastal Temples',       labelHi: 'तटीय मंदिर',          description: 'Temples on sea shores, coastal circuits and ocean-facing sacred sites.',                  order: 16 },
  { key: 'island-temples',      label: 'Island Temples',        labelHi: 'द्वीप मंदिर',         description: 'Temples on river islands, lake islands or sea-surrounded sites.',                        order: 17 },
  { key: 'rare-temples',        label: 'Rare Temples',          labelHi: 'दुर्लभ मंदिर',        description: 'Uncommon, mysterious or rarely-worshipped deity shrines.',                                order: 18 },
  { key: 'unique-deities',      label: 'Unique Deities',        labelHi: 'विशिष्ट देवता',       description: 'Composite or unusual divine forms with unique iconography.',                             order: 19 },
  { key: 'kuldevi',             label: 'Kuldevi / Kuldevata',   labelHi: 'कुलदेवी / कुलदेवता', description: 'Ancestral family deity temples worshipped across Indian communities.',                    order: 20 },
  { key: 'gram-devata',         label: 'Gram Devata',           labelHi: 'ग्राम देवता',         description: 'Village guardian deity temples across rural India.',                                      order: 21 },
  { key: 'future',              label: 'Future Categories',     labelHi: 'भविष्य की श्रेणियां', description: 'Placeholder for future sacred category additions.',                                       order: 22 },
]

// ── Super-group assignment per category slug ──────────────────────────────────
// Key = category slug, Value = array of superGroup keys

const SUPER_GROUP_MAP: Record<string, string[]> = {
  // Shaiva — Jyotirlinga family
  'jyotirlinga':              ['jyotirlinga', 'pilgrimage-circuits'],
  'panch-kedar':              ['pilgrimage-circuits', 'mountain-temples'],
  'pancha-bhoota-stalam':     ['pancha-bhoota', 'pilgrimage-circuits'],
  '108-shiva-temples':        ['temple-traditions'],
  'panch-kailash':            ['pilgrimage-circuits', 'mountain-temples'],
  'panch-badri':              ['pilgrimage-circuits', 'mountain-temples'],
  'pancharama-kshetras':      ['pilgrimage-circuits'],
  'pancha-sabhai':            ['pilgrimage-circuits', 'temple-traditions'],
  'himalayan-shiva-circuit':  ['pilgrimage-circuits', 'mountain-temples'],
  'nandi-temples':            ['deity-categories'],
  'amarnath-yatra-circuit':   ['pilgrimage-circuits', 'mountain-temples'],
  'kailash-mansarovar-circuit': ['pilgrimage-circuits', 'mountain-temples'],
  // Shakti — Shakti Peetha family
  'shakti-peeth':             ['shakti-peetha', 'pilgrimage-circuits'],
  '18-maha-shakti-peethas':   ['shakti-peetha', 'pilgrimage-circuits'],
  'nava-durga-temples':       ['shakti-peetha', 'deity-categories'],
  'dasha-mahavidya-temples':  ['shakti-peetha', 'temple-traditions'],
  'siddha-peeths':            ['shakti-peetha', 'pilgrimage-circuits'],
  'lalita-tripura-sundari-temples': ['deity-categories'],
  'tantra-peethas':           ['temple-traditions', 'shakti-peetha'],
  'himalayan-devi-circuit':   ['pilgrimage-circuits', 'mountain-temples'],
  // Vaishnav — Divya Desam family
  'divya-desam':              ['divya-desam', 'pilgrimage-circuits'],
  'pancha-ranga-kshetras':    ['divya-desam', 'pilgrimage-circuits'],
  'pancha-dwarka':            ['char-dham', 'pilgrimage-circuits'],
  'krishna-circuit':          ['pilgrimage-circuits'],
  'radha-krishna-temples':    ['temple-traditions', 'deity-categories'],
  'narasimha-temples':        ['deity-categories'],
  'kurma-kshetras':           ['deity-categories', 'rare-temples'],
  'varaha-kshetras':          ['deity-categories', 'rare-temples'],
  'nava-tirupati':            ['divya-desam'],
  'sleeping-vishnu-temples':  ['deity-categories'],
  'iskcon':                   ['temple-traditions'],
  // Rama / Hanuman
  'ramayana-circuit':         ['pilgrimage-circuits'],
  'hanuman-temples':          ['deity-categories'],
  'panch-mukhi-hanuman-temples': ['deity-categories'],
  'rama-kshetras':            ['pilgrimage-circuits'],
  'mahabharata-temples':      ['pilgrimage-circuits'],
  // Ganesha / Murugan
  'ashta-vinayak':            ['ashta-vinayak', 'pilgrimage-circuits'],
  '21-ganesh-temples':        ['temple-traditions', 'deity-categories'],
  'siddhivinayak-temples':    ['deity-categories'],
  'arupadai-veedu':           ['pilgrimage-circuits'],
  'murugan-hill-temples':     ['mountain-temples', 'deity-categories'],
  // Sacred Geography
  'char-dham':                ['char-dham', 'pilgrimage-circuits'],
  'chota-char-dham':          ['char-dham', 'pilgrimage-circuits', 'mountain-temples'],
  'sapta-puri':               ['sapta-puri', 'pilgrimage-circuits'],
  'panch-prayag':             ['river-temples', 'pilgrimage-circuits'],
  'navagraha':                ['navagraha', 'temple-traditions'],
  'sapta-ganga':              ['river-temples'],
  'sacred-river-temples':     ['river-temples'],
  'river-origin-temples':     ['river-temples', 'mountain-temples'],
  'ganga-origin-circuit':     ['river-temples', 'pilgrimage-circuits'],
  'temple-ghats':             ['river-temples'],
  'himalayan-temples':        ['mountain-temples'],
  'cave-temples':             ['regional'],
  'rock-cut-temples':         ['regional'],
  'temple-towns':             ['regional'],
  // Saint / Sampradaya
  'saptarishi-ashrams':       ['temple-traditions'],
  'adi-shankaracharya-maths': ['temple-traditions', 'pilgrimage-circuits'],
  'nath-sampradaya-temples':  ['temple-traditions'],
  'jain-tirthas':             ['temple-traditions', 'pilgrimage-circuits'],
  'buddhist-sacred-circuits': ['temple-traditions', 'pilgrimage-circuits'],
  // Blessings
  'marriage-blessing-temples': ['temple-traditions'],
  'child-blessing-temples':   ['temple-traditions'],
  'education-temples':        ['deity-categories'],
  'wealth-prosperity-temples': ['deity-categories'],
  'healing-temples':          ['temple-traditions'],
  'protection-temples':       ['temple-traditions'],
  'black-magic-removal-temples': ['rare-temples'],
  'fertility-temples':        ['rare-temples'],
  // Historical / Architecture
  'unesco-temple-sites':      ['regional'],
  'chola-temples':            ['regional', 'temple-traditions'],
  'kerala-temple-circuit':    ['regional'],
  'ancient-temple-kingdoms':  ['regional'],
  'temple-architecture-styles': ['regional'],
  // Unique Deities & Avatars
  'brahma-temples':           ['rare-temples', 'deity-categories'],
  'surya-temples':            ['deity-categories'],
  'saraswati-temples':        ['deity-categories'],
  'bhairava-temples':         ['deity-categories', 'rare-temples'],
  'dattatreya-temples':       ['rare-temples', 'deity-categories'],
  'sapta-matrika-temples':    ['unique-deities', 'deity-categories'],
  'dashavatara-temples':      ['deity-categories'],
  'ardhanarishvara-temples':  ['unique-deities'],
  'harihara-temples':         ['unique-deities'],
  'garuda-temples':           ['deity-categories'],
  'ayyappa-temples':          ['pilgrimage-circuits'],
  'naga-devata-temples':      ['deity-categories', 'rare-temples'],
  'sita-mata-temples':        ['deity-categories'],
  'chitragupta-yama-temples': ['rare-temples', 'deity-categories'],
  // Regional, Cultural & Nature
  'kuldevi-kuldevata-temples': ['kuldevi'],
  'grama-devata-temples':     ['gram-devata'],
  'desert-temple-circuit':    ['regional'],
  'coastal-sea-shore-temples': ['coastal-temples'],
  'island-temples':           ['island-temples'],
  'vana-kshetras-forest-temples': ['forest-temples'],
  'patal-subterranean-temples': ['rare-temples'],
  'parashurama-kshetras':     ['coastal-temples', 'regional'],
  // Specialized Traditions
  'ashta-veeratta-stalas':    ['temple-traditions'],
  'sapta-vitanka-stalas':     ['temple-traditions'],
  'chausath-yogini-temples':  ['rare-temples', 'shakti-peetha'],
  'swaminarayan-temples':     ['temple-traditions'],
  'nakshatra-temples':        ['navagraha', 'temple-traditions'],
  'rashi-temples':            ['navagraha', 'temple-traditions'],
  'kumbh-mela-sites':         ['pilgrimage-circuits'],
  'ashta-lakshmi-temples':    ['deity-categories'],
  'panchayatana-temples':     ['temple-traditions'],
  'swayambhu-temples':        ['rare-temples'],
  'jeeva-samadhi-temples':    ['rare-temples', 'temple-traditions'],
  'rath-yatra-temples':       ['temple-traditions'],
  // Other
  'other-sacred-group':       ['future'],
}

// ── Registry build ────────────────────────────────────────────────────────────

function buildSeoTitle(cat: SacredCategory): string {
  const base = `${cat.name} — Sacred Temple Circuit | Sarvdev`
  return base.length <= 70 ? base : `${cat.name} | Sarvdev`
}

function buildSeoDescription(cat: SacredCategory): string {
  const raw = (cat.longDescription || cat.description || '').replace(/\s+/g, ' ').trim()
  return raw.length > 155 ? raw.slice(0, 154) + '\u2026' : raw
}

function buildId(slug: string): string {
  return slug.toUpperCase().replace(/-/g, '_')
}

function buildPriority(cat: SacredCategory): number {
  const groupOrder = CATEGORY_GROUPS.find(g => g.key === cat.group)?.order ?? 99
  return groupOrder * 100 + (cat.order ?? 99)
}

export const REGISTRY: SacredCategoryEntry[] = SACRED_CATEGORIES.map(cat => ({
  ...cat,
  id:              buildId(cat.slug),
  priority:        buildPriority(cat),
  seoTitle:        buildSeoTitle(cat),
  seoDescription:  buildSeoDescription(cat),
  descriptionHi:   `${cat.nameHi} — ${cat.description}`,
  superGroups:     SUPER_GROUP_MAP[cat.slug] ?? ['pilgrimage-circuits'],
}))

// ── Index maps ────────────────────────────────────────────────────────────────

const _registryBySlug = new Map<string, SacredCategoryEntry>(REGISTRY.map(e => [e.slug, e]))
const _registryById   = new Map<string, SacredCategoryEntry>(REGISTRY.map(e => [e.id,   e]))

export function getRegistryEntry(slug: string): SacredCategoryEntry | undefined {
  return _registryBySlug.get(slug)
}

export function getRegistryEntryById(id: string): SacredCategoryEntry | undefined {
  return _registryById.get(id)
}

export function getEntriesBySuperGroup(superGroupKey: string): SacredCategoryEntry[] {
  return REGISTRY.filter(e => e.isActive && e.superGroups.includes(superGroupKey))
    .sort((a, b) => a.priority - b.priority)
}

export function getGroupedRegistry(): { superGroup: SuperGroup; entries: SacredCategoryEntry[] }[] {
  return REGISTRY_SUPER_GROUPS.map(sg => ({
    superGroup: sg,
    entries: getEntriesBySuperGroup(sg.key),
  })).filter(g => g.entries.length > 0)
}

/** All valid category slugs for import validation. */
export const ALL_REGISTRY_SLUGS = new Set<string>(REGISTRY.map(e => e.slug))

/** All valid category names (lowercase) for import validation. */
export const ALL_REGISTRY_NAMES = new Map<string, string>(
  REGISTRY.map(e => [e.name.toLowerCase(), e.slug])
)

/**
 * Validate a list of raw category values (name or slug) from CSV import.
 * Returns { valid, unknown } — unknown entries are warnings, not errors.
 */
export function validateImportCategories(values: string[]): {
  valid: string[]
  unknown: string[]
} {
  const valid: string[] = []
  const unknown: string[] = []
  for (const raw of values) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    const lower = trimmed.toLowerCase()
    const slug  = lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (ALL_REGISTRY_SLUGS.has(slug) || ALL_REGISTRY_NAMES.has(lower)) {
      valid.push(trimmed)
    } else {
      unknown.push(trimmed)
    }
  }
  return { valid, unknown }
}
