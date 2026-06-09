export type CategoryDef = {
  id: string
  label: string
  slug: string
  hindi?: string
  icon?: string
  emoji?: string
  description?: string
}

// Unified category config drawn from lib/devotional-categories.ts.
// slug is the URL-safe version; id/label is the canonical display name.
export const FULL_CATEGORIES: CategoryDef[] = [
  { id: 'Aarti',      label: 'Aarti',      slug: 'aarti',      hindi: 'आरती',       emoji: '🪔', description: 'Daily puja and evening lamp offerings for major deities.' },
  { id: 'Bhajan',     label: 'Bhajan',     slug: 'bhajan',     hindi: 'भजन',        emoji: '🎵', description: 'Melodic devotional songs for listening, satsang and kirtan.' },
  { id: 'Chalisa',    label: 'Chalisa',    slug: 'chalisa',    hindi: 'चालीसा',     emoji: '📖', description: 'Forty-verse devotional paths with readable lyrics and audio support.' },
  { id: 'Mantra',     label: 'Mantra',     slug: 'mantra',     hindi: 'मंत्र',      emoji: '📿', description: 'Sacred chants for japa, meditation, focus and protection.' },
  { id: 'Stotra',     label: 'Stotra',     slug: 'stotra',     hindi: 'स्तोत्र',    emoji: '🕉️', description: 'Classical hymns and suktams for recitation and contemplation.' },
  { id: 'Stuti',      label: 'Stuti',      slug: 'stuti',      hindi: 'स्तुति',     emoji: '🙏', description: 'Short praise hymns for daily remembrance.' },
  { id: 'Shloka',     label: 'Shloka',     slug: 'shloka',     hindi: 'श्लोक',      emoji: '📜', description: 'Concise Sanskrit verses with chanting-friendly presentation.' },
  { id: 'Ek Shloki',  label: 'Ek Shloki',  slug: 'ek-shloki',  hindi: 'एक श्लोकी',  emoji: '✨', description: 'Single-verse devotional summaries for quick daily recitation.' },
  { id: 'Ashtaka',    label: 'Ashtaka',    slug: 'ashtaka',    hindi: 'अष्टकम्',    emoji: '🌸', description: 'Eight-verse hymns for focused worship.' },
  { id: 'Path',       label: 'Path',       slug: 'path',       hindi: 'पाठ',        emoji: '📚', description: 'Long-form sacred readings and recitation content.' },
  { id: 'Namavali',   label: 'Namavali',   slug: 'namavali',   hindi: 'नामावली',    emoji: '🌺', description: 'Sacred name collections for archana and japa.' },
  { id: 'Kavacham',   label: 'Kavacham',   slug: 'kavacham',   hindi: 'कवचम्',      emoji: '🛡️', description: 'Protective hymns and kavach paths for spiritual strength.' },
  { id: 'Prarthana',  label: 'Prarthana',  slug: 'prarthana',  hindi: 'प्रार्थना',  emoji: '🌿', description: 'Prayer collections for simple daily devotion.' },
  { id: 'Vrat Katha', label: 'Vrat Katha', slug: 'vrat-katha', hindi: 'व्रत कथा',   emoji: '📖', description: 'Vrat stories and readings connected to sacred observances.' },
]

// Categories to hide from Browse list.
export const EXCLUDED_CATEGORY_IDS = new Set<string>([
  'Rashi', 'Vastu', 'Durga', 'Kuber', 'Other',
])
