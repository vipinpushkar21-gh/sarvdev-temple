export type CategoryDef = {
  id: string
  label: string
  slug: string
  hindi?: string
  icon?: string
  emoji?: string
  description?: string
  subcategories?: SubcategoryDef[]
}

export type SubcategoryDef = {
  id: string
  label: string
  hindi: string
}

import { MANTRA_SUBCATEGORIES } from '@/lib/mantra-subcategories'
import { NAMAVALI_SUBCATEGORIES } from '@/lib/namavali-subcategories'

// Unified category config drawn from lib/devotional-categories.ts.
// slug is the URL-safe version; id/label is the canonical display name.
export const FULL_CATEGORIES: CategoryDef[] = [
  { 
    id: 'Aarti',      
    label: 'Aarti',      
    slug: 'aarti',      
    hindi: 'आरती',       
    emoji: '🪔', 
    description: 'Daily puja and evening lamp offerings for major deities.',
    subcategories: [
      { id: 'shiv-parivar', label: 'शिव परिवार', hindi: 'शिव परिवार' },
      { id: 'vishnu-avtar', label: 'विष्णु एवं अवतार', hindi: 'विष्णु एवं अवतार' },
      { id: 'hanuman-balaji', label: 'हनुमान व बालाजी', hindi: 'हनुमान व बालाजी' },
      { id: 'durga-shakti', label: 'दुर्गा व शक्ति', hindi: 'दुर्गा व शक्ति' },
      { id: 'lakshmi-devi', label: 'लक्ष्मी व अन्य देवियाँ', hindi: 'लक्ष्मी व अन्य देवियाँ' },
      { id: 'navgrah', label: 'नवग्रह', hindi: 'नवग्रह' },
      { id: 'pavitra-nadiyan', label: 'पवित्र नदियाँ', hindi: 'पवित्र नदियाँ' },
      { id: 'anya-devta-prakriti', label: 'अन्य देवी-देवता व प्रकृति', hindi: 'अन्य देवी-देवता व प्रकृति' },
      { id: 'granth-ekadashi', label: 'ग्रंथ व एकादशी', hindi: 'ग्रंथ व एकादशी' },
      { id: 'vrat-tyohar', label: 'व्रत-त्योहार', hindi: 'व्रत-त्योहार' },
      { id: 'dham-sant', label: 'धाम व संत', hindi: 'धाम व संत' },
    ]
  },
  { id: 'Bhajan',     label: 'Bhajan',     slug: 'bhajan',     hindi: 'भजन',        emoji: '🎵', description: 'Melodic devotional songs for listening, satsang and kirtan.' },
  { id: 'Chalisa',    label: 'Chalisa',    slug: 'chalisa',    hindi: 'चालीसा',     emoji: '📖', description: 'Forty-verse devotional paths with readable lyrics and audio support.' },
  {
    id: 'Mantra', label: 'Mantra', slug: 'mantra', hindi: 'मंत्र', emoji: '📿',
    description: 'Sacred chants for japa, meditation, focus and protection.',
    subcategories: MANTRA_SUBCATEGORIES.map((value) => ({ id: value, label: value, hindi: value })),
  },
  { id: 'Stotra',     label: 'Stotra',     slug: 'stotra',     hindi: 'स्तोत्र',    emoji: '🕉️', description: 'Classical hymns and suktams for recitation and contemplation.' },
  { id: 'Sukt',       label: 'Sukt',       slug: 'sukt',       hindi: 'सूक्त',      emoji: '📜', description: 'Vedic hymns and sacred suktas for recitation and contemplation.' },
  { id: 'Stuti',      label: 'Stuti',      slug: 'stuti',      hindi: 'स्तुति',     emoji: '🙏', description: 'Short praise hymns for daily remembrance.' },
  { id: 'Shloka',     label: 'Shloka',     slug: 'shloka',     hindi: 'श्लोक',      emoji: '📜', description: 'Concise Sanskrit verses with chanting-friendly presentation.' },
  { id: 'Ek Shloki',  label: 'Ek Shloki',  slug: 'ek-shloki',  hindi: 'एक श्लोकी',  emoji: '✨', description: 'Single-verse devotional summaries for quick daily recitation.' },
  { id: 'Ashtaka',    label: 'Ashtaka',    slug: 'ashtaka',    hindi: 'अष्टकम्',    emoji: '🌸', description: 'Eight-verse hymns for focused worship.' },
  { id: 'Path',       label: 'Path',       slug: 'path',       hindi: 'पाठ',        emoji: '📚', description: 'Long-form sacred readings and recitation content.' },
  {
    id: 'Namavali', label: 'Namavali', slug: 'namavali', hindi: 'नामावली', emoji: '🌺',
    description: 'Sacred name collections for archana and japa.',
    subcategories: NAMAVALI_SUBCATEGORIES.map((value) => ({ id: value, label: value, hindi: value })),
  },
  {
    id: 'Sahasranamavali', label: 'Sahasranamavali', slug: 'sahasranamavali', hindi: 'सहस्रनामावली', emoji: '🌼',
    description: 'Sacred thousand-name collections for archana and japa.',
    subcategories: NAMAVALI_SUBCATEGORIES.map((value) => ({ id: value, label: value, hindi: value })),
  },
  { id: 'Kavacham',   label: 'Kavacham',   slug: 'kavacham',   hindi: 'कवचम्',      emoji: '🛡️', description: 'Protective hymns and kavach paths for spiritual strength.' },
  { id: 'Prarthana',  label: 'Prarthana',  slug: 'prarthana',  hindi: 'प्रार्थना',  emoji: '🌿', description: 'Prayer collections for simple daily devotion.' },
  { id: 'Vrat Katha', label: 'Vrat Katha', slug: 'vrat-katha', hindi: 'व्रत कथा',   emoji: '📖', description: 'Vrat stories and readings connected to sacred observances.' },
]

// Categories to hide from Browse list.
export const EXCLUDED_CATEGORY_IDS = new Set<string>([
  'Rashi', 'Vastu', 'Durga', 'Kuber', 'Other',
])
