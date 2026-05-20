export type SuggestionConfidence = 'high' | 'medium' | 'low'

export type TempleSuggestion<T = string | string[]> = {
  value: T
  confidence: SuggestionConfidence
  reason: string
}

export type TempleSuggestionInput = {
  title?: unknown
  name?: unknown
  deity?: unknown
  templeType?: unknown
  templeTypes?: unknown
  categories?: unknown
  sacredCategories?: unknown
  city?: unknown
  state?: unknown
  metaTitle?: unknown
  metaDescription?: unknown
  metaKeywords?: unknown
  speciality?: unknown
  timings?: unknown
  timingSlots?: unknown
  image?: unknown
}

export type TempleSuggestions = Partial<{
  deity: TempleSuggestion<string>
  templeType: TempleSuggestion<string>
  sacredCategories: TempleSuggestion<string[]>
  metaTitle: TempleSuggestion<string>
  metaDescription: TempleSuggestion<string>
  metaKeywords: TempleSuggestion<string>
  speciality: TempleSuggestion<string>
  timingSlots: TempleSuggestion<string[]>
  imagePrompt: TempleSuggestion<string>
}>

const DEITY_ALIAS_RULES = [
  {
    deity: 'Shiva',
    aliases: [
      'shiva', 'shiv', 'mahadev', 'mahadeva', 'shankar', 'bholenath',
      'linga', 'jyotirlinga', 'somnath', 'mallikarjuna', 'mahakaleshwar',
      'omkareshwar', 'vaidyanath', 'bhimashankar', 'rameshwaram',
      'nageshwar', 'trimbakeshwar', 'tryambakeshwar', 'grishneshwar',
      'vishwanath', 'kedarnath', 'amarnath', 'pashupatinath', 'neelkanth',
    ],
  },
  {
    deity: 'Vishnu',
    aliases: [
      'vishnu', 'narayan', 'narayana', 'venkatesh', 'venkateswara',
      'balaji', 'tirupati', 'jagannath', 'badrinath', 'ranganath',
      'padmanabha', 'varadaraja', 'perumal', 'govindaraja',
    ],
  },
  {
    deity: 'Durga',
    aliases: [
      'durga', 'devi', 'mata', 'maa', 'shakti', 'jagdamba', 'amba',
      'ambaji', 'vaishno', 'vaishnodevi', 'vaishno devi', 'chamunda',
      'mansa', 'chandi', 'naina devi', 'jwala',
    ],
  },
  {
    deity: 'Ganesha',
    aliases: [
      'ganesh', 'ganesha', 'ganapati', 'vinayak', 'vinayaka',
      'siddhivinayak', 'ashta vinayak', 'ashtavinayak', 'vighnaharta',
    ],
  },
  {
    deity: 'Hanuman',
    aliases: [
      'hanuman', 'bajrang', 'bajrangbali', 'maruti', 'anjaneya',
      'pawanputra', 'sankat mochan', 'salasar',
    ],
  },
  {
    deity: 'Krishna',
    aliases: [
      'krishna', 'krsna', 'kanha', 'govind', 'gopal', 'dwarkadhish',
      'banke bihari', 'radha krishna', 'radhakrishna', 'vrindavan',
      'mathura',
    ],
  },
  {
    deity: 'Rama',
    aliases: ['rama', 'ram', 'shri ram', 'sita ram', 'sitaram', 'raghunath', 'ayodhya'],
  },
  {
    deity: 'Lakshmi',
    aliases: ['lakshmi', 'laxmi', 'mahalakshmi'],
  },
  {
    deity: 'Saraswati',
    aliases: ['saraswati', 'sharda'],
  },
  {
    deity: 'Kali',
    aliases: ['kali', 'mahakali', 'kalighat'],
  },
  {
    deity: 'Murugan',
    aliases: ['murugan', 'kartikeya', 'subramanya', 'subramanian', 'palani'],
  },
  {
    deity: 'Sai Baba',
    aliases: ['sai baba', 'shirdi sai', 'shirdi'],
  },
  {
    deity: 'Ayyappa',
    aliases: ['ayyappa', 'sabarimala'],
  },
  {
    deity: 'Surya',
    aliases: ['surya', 'sun temple', 'konark'],
  },
]

const SACRED_CATEGORY_RULES = [
  {
    category: 'Dwadash Jyotirlinga (12 Jyotirlingas)',
    explicit: ['jyotirlinga', '12 jyotirlinga', 'dwadash jyotirlinga'],
    landmarks: [
      'somnath', 'mallikarjuna', 'mahakaleshwar', 'omkareshwar', 'vaidyanath',
      'bhimashankar', 'rameshwaram', 'nageshwar', 'vishwanath',
      'trimbakeshwar', 'tryambakeshwar', 'grishneshwar', 'kedarnath',
    ],
  },
  {
    category: 'Shakti Peeth (51 Shakti Peethas)',
    explicit: ['shakti peeth', 'shaktipeeth', '51 shakti peeth'],
    landmarks: ['kamakhya', 'kalighat', 'jwala', 'naina devi', 'chamunda'],
  },
  {
    category: 'Char Dham',
    explicit: ['char dham'],
    landmarks: ['badrinath', 'dwarka', 'dwarkadhish', 'jagannath puri', 'rameshwaram'],
  },
  {
    category: 'Chota Char Dham (Uttarakhand)',
    explicit: ['chota char dham'],
    landmarks: ['kedarnath', 'badrinath', 'gangotri', 'yamunotri'],
  },
  {
    category: 'Panch Kedar',
    explicit: ['panch kedar'],
    landmarks: ['kedarnath', 'tungnath', 'rudranath', 'madhyamaheshwar', 'kalpeshwar'],
  },
  {
    category: 'Panch Prayag',
    explicit: ['panch prayag'],
    landmarks: ['devprayag', 'rudraprayag', 'karnaprayag', 'nandprayag', 'vishnuprayag'],
  },
  {
    category: 'Arupadai Veedu (6 Abodes of Murugan)',
    explicit: ['arupadai veedu', 'six abodes of murugan', '6 abodes of murugan'],
    landmarks: ['palani', 'tiruchendur', 'swamimalai', 'tiruttani', 'pazhamudircholai', 'thiruparankundram'],
  },
  {
    category: 'Navagraha Temples',
    explicit: ['navagraha', 'navagraha temple'],
    landmarks: ['suryanar', 'thingalur', 'alanganallur', 'kanjanur', 'thirunageswaram'],
  },
  {
    category: 'Divya Desam (108 Vishnu Temples)',
    explicit: ['divya desam', '108 vishnu'],
    landmarks: ['srirangam', 'tirupati', 'badrinath', 'ranganath', 'padmanabha', 'varadaraja'],
  },
  {
    category: 'Pancha Bhoota Stalam',
    explicit: ['pancha bhoota', 'panch bhoota'],
    landmarks: ['ekambareswarar', 'jambukeswarar', 'arunachaleswarar', 'chidambaram', 'kalahasti'],
  },
  {
    category: 'Ashta Vinayak',
    explicit: ['ashta vinayak', 'ashtavinayak'],
    landmarks: ['mayureshwar', 'siddhivinayak', 'ballaleshwar', 'varadavinayak', 'chintamani', 'girijatmaj', 'vighneshwar', 'mahaganapati'],
  },
  {
    category: 'Sapta Puri (7 Sacred Cities)',
    explicit: ['sapta puri', 'seven sacred cities'],
    landmarks: ['ayodhya', 'mathura', 'haridwar', 'varanasi', 'kashi', 'kanchi', 'ujjain', 'dwarka'],
  },
  {
    category: '108 Shiva Temples',
    explicit: ['108 shiva'],
    landmarks: [],
  },
]

const SOUTH_INDIAN_STATES = new Set(['andhra pradesh', 'karnataka', 'kerala', 'tamil nadu', 'telangana'])
const NORTH_INDIAN_STATES = new Set([
  'delhi', 'haryana', 'himachal pradesh', 'jammu and kashmir', 'ladakh',
  'punjab', 'rajasthan', 'uttar pradesh', 'uttarakhand',
])

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function normalize(value: unknown): string {
  return stringValue(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function fieldList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(item => stringValue(item)).filter(Boolean)
}

function hasText(value: unknown): boolean {
  return stringValue(value).length > 0
}

function hasList(value: unknown): boolean {
  return fieldList(value).length > 0
}

function isWeakText(value: unknown, minLength: number): boolean {
  const text = stringValue(value)
  return !text || text.length < minLength
}

function titleOf(temple: TempleSuggestionInput): string {
  return stringValue(temple.title) || stringValue(temple.name)
}

function categoriesOf(temple: TempleSuggestionInput): string[] {
  return [...fieldList(temple.sacredCategories), ...fieldList(temple.categories)]
}

function placeOf(temple: TempleSuggestionInput): string {
  return [stringValue(temple.city), stringValue(temple.state)].filter(Boolean).join(', ')
}

function containsAlias(source: string, alias: string): boolean {
  const normalizedSource = ` ${normalize(source)} `
  const normalizedAlias = normalize(alias)
  return normalizedAlias.length > 0 && normalizedSource.includes(` ${normalizedAlias} `)
}

function findAlias(source: string, aliases: string[]): string | null {
  return aliases.find(alias => containsAlias(source, alias)) || null
}

function compactUnique(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const trimmed = value.trim()
    const key = trimmed.toLowerCase()
    if (!trimmed || seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }

  return result
}

function limitText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  const clipped = value.slice(0, maxLength - 1).trimEnd()
  return clipped.replace(/[,\s]+$/g, '')
}

function safeDeity(temple: TempleSuggestionInput): string {
  const existing = stringValue(temple.deity)
  if (existing && existing.toLowerCase() !== 'other') return existing
  return suggestDeity(temple)?.value || ''
}

function categorySuggestionValues(temple: TempleSuggestionInput): string[] {
  const existing = categoriesOf(temple)
  if (existing.length > 0) return existing
  return suggestSacredCategories(temple)?.value || []
}

export function suggestDeity(temple: TempleSuggestionInput): TempleSuggestion<string> | undefined {
  const existing = stringValue(temple.deity)
  if (existing && existing.toLowerCase() !== 'other') return undefined

  const title = titleOf(temple)
  const categoryText = categoriesOf(temple).join(' ')

  for (const rule of DEITY_ALIAS_RULES) {
    const titleAlias = findAlias(title, rule.aliases)
    if (titleAlias) {
      return {
        value: rule.deity,
        confidence: 'high',
        reason: `Matched "${titleAlias}" in the temple title.`,
      }
    }

    const categoryAlias = findAlias(categoryText, rule.aliases)
    if (categoryAlias) {
      return {
        value: rule.deity,
        confidence: 'medium',
        reason: `Matched "${categoryAlias}" in the sacred category context.`,
      }
    }
  }

  return undefined
}

export function suggestTempleType(temple: TempleSuggestionInput): TempleSuggestion<string> | undefined {
  if (hasText(temple.templeType) || hasList(temple.templeTypes)) return undefined

  const title = titleOf(temple)
  const deity = safeDeity(temple)
  const categories = categorySuggestionValues(temple)
  const source = `${title} ${deity} ${categories.join(' ')}`
  const state = normalize(temple.state)

  if (findAlias(source, ['cave', 'gufa', 'guha'])) {
    return { value: 'Cave Temple', confidence: 'high', reason: 'The title or category includes a cave temple keyword.' }
  }

  if (findAlias(source, ['hill', 'parvat', 'pahad', 'giri', 'malai', 'kedar', 'badrinath', 'amarnath'])) {
    return { value: 'Hill Temple', confidence: 'medium', reason: 'The title or category suggests a hill or mountain shrine.' }
  }

  if (categories.some(category => /jyotirlinga|shakti peeth|char dham|divya desam|ashta vinayak|pancha bhoota|panch kedar|sapta puri/i.test(category))) {
    return { value: 'Ancient', confidence: 'medium', reason: 'The sacred category is traditionally associated with historic pilgrimage temples.' }
  }

  if (SOUTH_INDIAN_STATES.has(state) || findAlias(title, ['kovil', 'koil'])) {
    return { value: 'South Indian', confidence: 'medium', reason: 'The temple location or title matches a South Indian temple signal.' }
  }

  if (NORTH_INDIAN_STATES.has(state)) {
    return { value: 'North Indian', confidence: 'low', reason: 'The temple state is commonly grouped with North Indian temple traditions.' }
  }

  return undefined
}

export function suggestSacredCategories(temple: TempleSuggestionInput): TempleSuggestion<string[]> | undefined {
  if (hasList(temple.sacredCategories) || hasList(temple.categories)) return undefined

  const title = titleOf(temple)
  const deity = safeDeity(temple)
  const source = `${title} ${deity} ${stringValue(temple.city)} ${stringValue(temple.state)}`
  const matches: { category: string; confidence: SuggestionConfidence; reason: string }[] = []

  for (const rule of SACRED_CATEGORY_RULES) {
    const explicitAlias = findAlias(source, rule.explicit)
    if (explicitAlias) {
      matches.push({
        category: rule.category,
        confidence: 'high',
        reason: `Matched explicit sacred grouping keyword "${explicitAlias}".`,
      })
      continue
    }

    const landmarkAlias = findAlias(source, rule.landmarks)
    if (landmarkAlias) {
      matches.push({
        category: rule.category,
        confidence: 'medium',
        reason: `Matched known sacred place keyword "${landmarkAlias}".`,
      })
    }
  }

  if (matches.length === 0) return undefined

  const confidence = matches.some(match => match.confidence === 'high') ? 'high' : 'medium'
  return {
    value: compactUnique(matches.map(match => match.category)),
    confidence,
    reason: compactUnique(matches.map(match => match.reason)).join(' '),
  }
}

export function suggestMetaTitle(temple: TempleSuggestionInput): TempleSuggestion<string> | undefined {
  if (!isWeakText(temple.metaTitle, 15)) return undefined

  const title = titleOf(temple)
  if (!title) return undefined

  const place = placeOf(temple)
  const city = stringValue(temple.city)
  const state = stringValue(temple.state)
  const candidates = compactUnique([
    place ? `${title} - ${place} | Sarvdev` : '',
    city ? `${title} - ${city} | Sarvdev` : '',
    state ? `${title} - ${state} | Sarvdev` : '',
    `${title} | Sarvdev`,
  ])
  const value = candidates.find(candidate => candidate.length <= 60) || limitText(`${title} | Sarvdev`, 60)

  return {
    value,
    confidence: place ? 'high' : 'medium',
    reason: place ? 'Built from temple title with city/state context.' : 'Built from temple title because location is missing.',
  }
}

export function suggestMetaDescription(temple: TempleSuggestionInput): TempleSuggestion<string> | undefined {
  if (!isWeakText(temple.metaDescription, 70)) return undefined

  const title = titleOf(temple)
  if (!title) return undefined

  const deity = safeDeity(temple)
  const place = placeOf(temple)
  const deityPart = deity ? ` dedicated to ${deity}` : ''
  const placePart = place ? ` in ${place}` : ''
  const value = limitText(`Visit ${title}${deityPart}${placePart}. Find timings, location, photos and temple details on Sarvdev.`, 155)

  return {
    value,
    confidence: deity && place ? 'high' : 'medium',
    reason: 'Created from existing title, deity and location fields without adding new long-form content.',
  }
}

export function suggestMetaKeywords(temple: TempleSuggestionInput): TempleSuggestion<string> | undefined {
  const existingKeywords = stringValue(temple.metaKeywords)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  if (existingKeywords.length >= 3) return undefined

  const title = titleOf(temple)
  if (!title) return undefined

  const deity = safeDeity(temple)
  const categories = categorySuggestionValues(temple)
  const values = compactUnique([
    title,
    `${title} temple`,
    deity,
    deity ? `${deity} temple` : '',
    stringValue(temple.city),
    stringValue(temple.state),
    ...categories.map(category => category.replace(/\s*\([^)]*\)/g, '')),
    'hindu temple',
    'sarvdev',
  ]).slice(0, 10)

  return {
    value: values.join(', '),
    confidence: values.length >= 5 ? 'high' : 'medium',
    reason: 'Composed from existing title, deity, location and sacred category signals.',
  }
}

export function suggestSpeciality(temple: TempleSuggestionInput): TempleSuggestion<string> | undefined {
  if (!isWeakText(temple.speciality, 12)) return undefined

  const categories = categorySuggestionValues(temple)
  const deity = safeDeity(temple)

  const categorySpeciality = categories.find(category => /jyotirlinga/i.test(category))
    ? 'Jyotirlinga darshan and Shiva worship'
    : categories.find(category => /shakti peeth/i.test(category))
      ? 'Shakti Peeth darshan and Devi worship'
      : categories.find(category => /char dham/i.test(category))
        ? 'Char Dham pilgrimage'
        : categories.find(category => /ashta vinayak/i.test(category))
          ? 'Ashta Vinayak darshan'
          : categories.find(category => /divya desam/i.test(category))
            ? 'Divya Desam darshan and Vishnu worship'
            : ''

  if (categorySpeciality) {
    return {
      value: categorySpeciality,
      confidence: 'high',
      reason: 'Based on a recognized sacred category signal.',
    }
  }

  const deityMap: Record<string, string> = {
    Shiva: 'Shiva worship and darshan',
    Vishnu: 'Vishnu worship and Vaishnava devotion',
    Durga: 'Devi worship and Shakti devotion',
    Ganesha: 'Ganesha worship and auspicious beginnings',
    Hanuman: 'Hanuman devotion and strength prayers',
    Krishna: 'Krishna bhakti and darshan',
    Rama: 'Rama bhakti and dharmic worship',
    Lakshmi: 'Lakshmi worship and prosperity prayers',
    Saraswati: 'Saraswati worship and learning blessings',
    Kali: 'Kali worship and Shakti devotion',
    Murugan: 'Murugan worship and pilgrimage',
  }

  if (deityMap[deity]) {
    return {
      value: deityMap[deity],
      confidence: 'medium',
      reason: 'Based on the detected or existing presiding deity.',
    }
  }

  return undefined
}

export function suggestTimingSlots(temple: TempleSuggestionInput): TempleSuggestion<string[]> | undefined {
  if (hasText(temple.timings) || hasList(temple.timingSlots)) return undefined

  return {
    value: ['6:00 AM \u2013 12:00 PM', '4:00 PM \u2013 9:00 PM'],
    confidence: 'low',
    reason: 'Generic temple darshan slots suggested only because no timings exist.',
  }
}

export function suggestImagePrompt(temple: TempleSuggestionInput): TempleSuggestion<string> | undefined {
  if (hasText(temple.image)) return undefined

  const title = titleOf(temple)
  if (!title) return undefined

  const deity = safeDeity(temple)
  const place = placeOf(temple)
  const deityPart = deity ? ` dedicated to ${deity}` : ''
  const placePart = place ? ` in ${place}` : ''

  return {
    value: `Reference image needed: clear exterior photo of ${title}${deityPart}${placePart}, showing the temple facade, entrance and surroundings in natural daylight.`,
    confidence: place ? 'medium' : 'low',
    reason: 'This is only a human-review image brief because the temple image field is empty.',
  }
}

export function buildTempleSuggestions(temple: TempleSuggestionInput): TempleSuggestions {
  const suggestions: TempleSuggestions = {}
  const deity = suggestDeity(temple)
  const templeType = suggestTempleType(temple)
  const sacredCategories = suggestSacredCategories(temple)
  const metaTitle = suggestMetaTitle(temple)
  const metaDescription = suggestMetaDescription(temple)
  const metaKeywords = suggestMetaKeywords(temple)
  const speciality = suggestSpeciality(temple)
  const timingSlots = suggestTimingSlots(temple)
  const imagePrompt = suggestImagePrompt(temple)

  if (deity) suggestions.deity = deity
  if (templeType) suggestions.templeType = templeType
  if (sacredCategories) suggestions.sacredCategories = sacredCategories
  if (metaTitle) suggestions.metaTitle = metaTitle
  if (metaDescription) suggestions.metaDescription = metaDescription
  if (metaKeywords) suggestions.metaKeywords = metaKeywords
  if (speciality) suggestions.speciality = speciality
  if (timingSlots) suggestions.timingSlots = timingSlots
  if (imagePrompt) suggestions.imagePrompt = imagePrompt

  return suggestions
}
