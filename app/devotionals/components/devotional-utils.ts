import type { Devotional } from '../types'
import { FULL_CATEGORIES } from './categories'

export function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function createDevotionalSlug(title: string): string {
  const englishMatch = title.match(/\(([^)]+)\)/)
  const text = englishMatch ? englishMatch[1] : title
  return slugify(text) || slugify(title) || 'devotional'
}

export function getDevotionalHref(devotional: Pick<Devotional, 'title' | '_id' | 'slug'>) {
  if (devotional.slug) return `/devotionals/${devotional.slug}`
  const slug = createDevotionalSlug(devotional.title || '')
  return `/devotionals/${slug === 'devotional' ? devotional._id : slug}`
}

export function categoryToSlug(category?: string) {
  if (!category) return 'other'
  if (category === '108 Namavali') return 'namavali'
  return category.toLowerCase().replace(/\s+/g, '-')
}

export function matchesCategory(devotional: Devotional, categorySlug: string) {
  if (categorySlug === 'namavali') return devotional.category === 'Namavali' || devotional.category === '108 Namavali'
  return categoryToSlug(devotional.category) === categorySlug
}

export function getCategoryInfo(categorySlug: string) {
  return FULL_CATEGORIES.find((category) => categoryToSlug(category.id) === categorySlug)
}

export function getCategoryDescription(category?: string) {
  const key = (category || '').toLowerCase()
  if (key.includes('aarti')) return 'Aartis for daily puja, temple worship, evening prayer and family devotional practice.'
  if (key.includes('mantra')) return 'Mantras for focused japa, meditation, protection, healing and morning remembrance.'
  if (key.includes('chalisa')) return 'Chalisa path collections with readable lyrics, audio support and deity-based discovery.'
  if (key.includes('stotra')) return 'Classical stotras and suktams for chanting, contemplation and sacred recitation.'
  if (key.includes('bhajan')) return 'Bhajans for kirtan, satsang, home prayer and devotional listening.'
  if (key.includes('kavach')) return 'Protective kavacham and kavach path entries for focused spiritual practice.'
  if (key.includes('namavali')) return 'Sacred name collections for archana, japa and deity remembrance.'
  return 'Curated devotional lyrics, chanting support and audio-friendly spiritual practice content.'
}

export function getCategoryPracticeTitle(category?: string) {
  const label = category || 'Devotional'
  return `How to use ${label} in daily practice`
}

export function normalizeDeity(deity?: string) {
  return (deity || '')
    .toLowerCase()
    .replace(/\blord\b|\bgoddess\b|\bbhagwan\b|\bshri\b|\bsri\b|\bji\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export type RelatedSuggestion = {
  title: string
  href: string
  type: 'devotional' | 'festival' | 'temple'
}

const DEITY_RULES: Record<string, { devotionals: string[]; festivals: string[]; temples: string }> = {
  shiva: {
    devotionals: ['Shiv Chalisa', 'Rudrashtakam', 'Mahamrityunjaya Mantra', 'Shiv Tandav Stotram'],
    festivals: ['Mahashivratri'],
    temples: 'Shiva temples',
  },
  ram: {
    devotionals: ['Ram Chalisa', 'Ram Aarti', 'Ram Raksha Stotra', 'Ram Stuti'],
    festivals: ['Ram Navami'],
    temples: 'Rama temples',
  },
  rama: {
    devotionals: ['Ram Chalisa', 'Ram Aarti', 'Ram Raksha Stotra', 'Ram Stuti'],
    festivals: ['Ram Navami'],
    temples: 'Rama temples',
  },
  ganesh: {
    devotionals: ['Ganesh Aarti', 'Ganesh Chalisa', 'Ganesh Mantra', 'Ganapati Atharvashirsha'],
    festivals: ['Ganesh Chaturthi'],
    temples: 'Ganesha temples',
  },
  ganesha: {
    devotionals: ['Ganesh Aarti', 'Ganesh Chalisa', 'Ganesh Mantra', 'Ganapati Atharvashirsha'],
    festivals: ['Ganesh Chaturthi'],
    temples: 'Ganesha temples',
  },
  hanuman: {
    devotionals: ['Hanuman Chalisa', 'Hanuman Aarti', 'Bajrang Baan', 'Sankat Mochan Hanuman Ashtak'],
    festivals: ['Hanuman Jayanti'],
    temples: 'Hanuman temples',
  },
  durga: {
    devotionals: ['Durga Aarti', 'Durga Chalisa', 'Durga Saptashati', 'Mahishasura Mardini Stotram'],
    festivals: ['Navratri', 'Durga Puja'],
    temples: 'Durga temples',
  },
  lakshmi: {
    devotionals: ['Lakshmi Aarti', 'Lakshmi Chalisa', 'Sri Suktam', 'Kanakadhara Stotram'],
    festivals: ['Diwali', 'Kojagari Lakshmi Puja'],
    temples: 'Lakshmi temples',
  },
  vishnu: {
    devotionals: ['Vishnu Sahasranamam', 'Vishnu Aarti', 'Narayana Stotram', 'Achyutam Keshavam'],
    festivals: ['Vaikuntha Ekadashi'],
    temples: 'Vishnu temples',
  },
  krishna: {
    devotionals: ['Krishna Aarti', 'Madhurashtakam', 'Achyutam Keshavam', 'Hare Krishna Mahamantra'],
    festivals: ['Janmashtami'],
    temples: 'Krishna temples',
  },
}

function ruleForDeity(deity?: string) {
  const normalized = normalizeDeity(deity)
  const key = Object.keys(DEITY_RULES).find((candidate) => normalized.includes(candidate))
  return key ? DEITY_RULES[key] : null
}

export function getRuleBasedRelatedContent(deity?: string): RelatedSuggestion[] {
  const rule = ruleForDeity(deity)
  if (!rule) return []

  const suggestions: RelatedSuggestion[] = rule.devotionals.map((title) => ({
    title,
    href: `/devotionals?search=${encodeURIComponent(title)}`,
    type: 'devotional',
  }))

  suggestions.push(
    ...rule.festivals.map((title) => ({
      title,
      href: `/events?search=${encodeURIComponent(title)}`,
      type: 'festival' as const,
    })),
    {
      title: rule.temples,
      href: `/temples?deity=${encodeURIComponent(deity || '')}`,
      type: 'temple',
    }
  )

  return suggestions
}

export function getDailyPracticeGroups(devotionals: Devotional[]) {
  const group = (label: string, predicate: (devotional: Devotional) => boolean) => ({
    label,
    items: devotionals.filter(predicate).slice(0, 4),
  })

  return [
    group('Morning Mantras', (d) => /mantra|gayatri|mahamrityunjaya|suprabhat/i.test(`${d.category} ${d.title}`)),
    group('Evening Aarti', (d) => /aarti/i.test(`${d.category} ${d.title}`)),
    group('Protection Kavach', (d) => /kavach|raksha|baan|protection/i.test(`${d.category} ${d.title}`)),
    group('Peaceful Stotras', (d) => /stotra|stuti|ashtak|sukt/i.test(`${d.category} ${d.title}`)),
  ]
}

export function getFeaturedDevotionals(devotionals: Devotional[]) {
  const priority = new Set(['Mantra', 'Chalisa', 'Aarti', 'Namavali', '108 Namavali', 'Stotra'])
  return devotionals
    .filter((d) => d.category && priority.has(d.category))
    .sort((a, b) => Number(Boolean(b.audio)) - Number(Boolean(a.audio)))
    .slice(0, 6)
}
