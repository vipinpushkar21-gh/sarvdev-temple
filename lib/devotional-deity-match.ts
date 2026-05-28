export type DeityImageSource = {
  _id?: string
  id?: string
  name?: string | null
  nameHi?: string | null
  slug?: string | null
  staticSlug?: string | null
  slugAliases?: string[] | null
  aliases?: string[] | null
  category?: string | null
  categories?: string[] | null
  image?: string | null
  imageCard?: string | null
  imageHero?: string | null
  status?: string | null
}

export type DevotionalDeityMatchInput = {
  title?: string | null
  titleHi?: string | null
  deity?: string | null
  deitySlug?: string | null
  category?: string | null
  tags?: string[] | string | null
  slug?: string | null
}

export type DevotionalWithMatchedDeity<T = DevotionalDeityMatchInput> = T & {
  matchedDeity?: DeityImageSource | null
  matchedDeityName?: string
  matchedDeitySlug?: string
  matchedDeityScore?: number
  matchedDeityReason?: string
}

export type DevotionalDeityMatch = {
  deity: DeityImageSource
  score: number
  reason: string
}

const HONORIFICS = new Set([
  'lord',
  'goddess',
  'bhagwan',
  'bhagavan',
  'shri',
  'sri',
  'ji',
  'maa',
  'mata',
  'devi',
  'dev',
  'god',
  'om',
  'aarti',
  'arti',
  'chalisa',
  'mantra',
  'stotra',
  'stotram',
  'bhajan',
  'path',
  'paath',
  'namavali',
  'kavach',
  'kavacham',
  'श्री',
  'जी',
  'माँ',
  'माता',
  'देवी',
  'देव',
  'भगवान',
])

const DEITY_ALIAS_GROUPS = [
  ['shiva', 'shiv', 'mahadev', 'shankar', 'bholenath', 'rudra', 'महादेव', 'शिव', 'शंकर'],
  ['vishnu', 'narayan', 'narayana', 'hari', 'विष्णु', 'नारायण', 'हरि'],
  ['krishna', 'kanha', 'gopal', 'govind', 'govinda', 'banke bihari', 'dwarkadhish', 'shyam', 'कृष्ण', 'कान्हा', 'गोपाल', 'गोविंद', 'द्वारकाधीश'],
  ['rama', 'ram', 'shri ram', 'sri ram', 'raghunath', 'sitaram', 'राम', 'श्रीराम', 'रघुनाथ'],
  ['hanuman', 'bajrangbali', 'bajrang bali', 'maruti', 'anjaneya', 'pavanputra', 'हनुमान', 'बजरंगबली', 'मारुति'],
  ['ganesha', 'ganesh', 'ganpati', 'ganapati', 'vinayak', 'vinayaka', 'गणेश', 'गणपति', 'विनायक'],
  ['durga', 'ambe', 'amba', 'jagdamba', 'jagdambe', 'दुर्गा', 'अम्बे', 'जगदम्बा'],
  ['lakshmi', 'laxmi', 'mahalakshmi', 'maha lakshmi', 'लक्ष्मी', 'महालक्ष्मी'],
  ['saraswati', 'sharada', 'sharda', 'सरस्वती', 'शारदा'],
  ['kali', 'mahakali', 'kalika', 'काली', 'महाकाली', 'कालिका'],
  ['parvati', 'gauri', 'uma', 'पार्वती', 'गौरी', 'उमा'],
  ['sai baba', 'shirdi sai', 'sai', 'साईं', 'साई'],
  ['surya', 'aditya', 'सूर्य', 'आदित्य'],
  ['shani', 'shanidev', 'shani dev', 'शनिदेव', 'शनि'],
  ['radha', 'radha rani', 'radharani', 'राधा', 'राधा रानी'],
  ['vishwakarma', 'विश्वकर्मा'],
  ['santoshi mata', 'santoshi', 'संतोषी'],
  ['sheetala mata', 'sheetala', 'shitala', 'शीतला'],
  ['tulsi mata', 'tulsi', 'तुलसी'],
]

function toList(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(',')
  return []
}

export function normalizeDevotionalMatchText(value: string | null | undefined) {
  return (value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[-_/|()[\]{}.,:;!?'"`~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value: string | null | undefined) {
  return normalizeDevotionalMatchText(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !HONORIFICS.has(token))
}

function addTerm(terms: Set<string>, value: string | null | undefined) {
  const normalized = normalizeDevotionalMatchText(value)
  if (!normalized || HONORIFICS.has(normalized)) return
  terms.add(normalized)
  for (const token of tokenize(normalized)) {
    if (token.length > 2) terms.add(token)
  }
}

function containsWholeTerm(haystack: string, term: string) {
  const normalizedHaystack = ` ${normalizeDevotionalMatchText(haystack)} `
  const normalizedTerm = normalizeDevotionalMatchText(term)
  if (!normalizedTerm || HONORIFICS.has(normalizedTerm)) return false
  return normalizedHaystack.includes(` ${normalizedTerm} `)
}

function getDeityIdentityTerms(deity: DeityImageSource) {
  const terms = new Set<string>()
  addTerm(terms, deity.slug)
  addTerm(terms, deity.staticSlug)
  addTerm(terms, deity.name)
  addTerm(terms, deity.nameHi)
  toList(deity.slugAliases || []).forEach((term) => addTerm(terms, term))
  toList(deity.aliases || []).forEach((term) => addTerm(terms, term))
  return terms
}

function getDeitySearchTerms(deity: DeityImageSource) {
  const terms = getDeityIdentityTerms(deity)
  const identityText = Array.from(terms).join(' ')

  for (const group of DEITY_ALIAS_GROUPS) {
    if (group.some((alias) => containsWholeTerm(identityText, alias) || containsWholeTerm(alias, identityText))) {
      group.forEach((alias) => addTerm(terms, alias))
    }
  }

  return Array.from(terms).sort((a, b) => b.length - a.length)
}

function getSourceText(input: DevotionalDeityMatchInput) {
  return {
    deitySlug: normalizeDevotionalMatchText(input.deitySlug || ''),
    deity: normalizeDevotionalMatchText(input.deity || ''),
    title: normalizeDevotionalMatchText([input.title, input.titleHi].filter(Boolean).join(' ')),
    metadata: normalizeDevotionalMatchText([
      input.slug,
      input.category,
      ...toList(input.tags || []),
    ].filter(Boolean).join(' ')),
  }
}

function scoreDeity(input: DevotionalDeityMatchInput, deity: DeityImageSource): DevotionalDeityMatch | null {
  const terms = getDeitySearchTerms(deity)
  if (terms.length === 0) return null

  const source = getSourceText(input)
  const slugTerms = [deity.slug, deity.staticSlug, ...(deity.slugAliases || [])]
    .map((term) => normalizeDevotionalMatchText(term))
    .filter(Boolean)

  if (source.deitySlug && slugTerms.includes(source.deitySlug)) {
    return { deity, score: 120, reason: 'exact deitySlug match' }
  }

  for (const term of terms) {
    if (source.deity && normalizeDevotionalMatchText(term) === source.deity) {
      return { deity, score: 112, reason: 'exact deity field match' }
    }
  }

  for (const term of terms) {
    if (term.length <= 2) continue
    if (source.deity && containsWholeTerm(source.deity, term)) {
      return { deity, score: 106, reason: `deity field contains "${term}"` }
    }
    if (source.deity && containsWholeTerm(term, source.deity) && source.deity.length > 2) {
      return { deity, score: 102, reason: `deity field matches "${term}"` }
    }
  }

  for (const term of terms) {
    if (term.length <= 2) continue
    if (source.title && containsWholeTerm(source.title, term)) {
      return { deity, score: 88, reason: `title contains "${term}"` }
    }
  }

  for (const term of terms) {
    if (term.length <= 2) continue
    if (source.metadata && containsWholeTerm(source.metadata, term)) {
      return { deity, score: 82, reason: `metadata contains "${term}"` }
    }
  }

  return null
}

export function getDevotionalDeityMatch(
  devotional: DevotionalDeityMatchInput | null | undefined,
  deities: DeityImageSource[] | null | undefined
): DevotionalDeityMatch | null {
  if (!devotional || !Array.isArray(deities) || deities.length === 0) return null

  const matches = deities
    .filter((deity) => deity && (deity.status === 'approved' || !deity.status))
    .map((deity) => scoreDeity(devotional, deity))
    .filter(Boolean) as DevotionalDeityMatch[]

  if (matches.length === 0) return null
  const [best, second] = matches.sort((a, b) => b.score - a.score)

  if (best.score < 82) return null
  if (second && best.score < 100 && best.score - second.score < 8) return null

  return best
}

export function attachMatchedDeity<T extends DevotionalDeityMatchInput>(
  devotional: T,
  deities: DeityImageSource[] | null | undefined
): DevotionalWithMatchedDeity<T> {
  const match = getDevotionalDeityMatch(devotional, deities)
  if (!match) return { ...devotional, matchedDeity: null }

  return {
    ...devotional,
    matchedDeity: match.deity,
    matchedDeityName: match.deity.name || match.deity.nameHi || match.deity.slug || undefined,
    matchedDeitySlug: match.deity.slug || undefined,
    matchedDeityScore: match.score,
    matchedDeityReason: match.reason,
  }
}

export function attachMatchedDeities<T extends DevotionalDeityMatchInput>(
  devotionals: T[],
  deities: DeityImageSource[] | null | undefined
): DevotionalWithMatchedDeity<T>[] {
  return devotionals.map((devotional) => attachMatchedDeity(devotional, deities))
}
