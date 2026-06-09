/**
 * lib/transliteration.ts — Hindu deity alias + transliteration dictionary
 *
 * Maps common English spellings, regional aliases, and Devanagari variants
 * into a single expanded search set so users get correct results regardless
 * of input language or script.
 *
 * Usage:
 *   import { expandQuery, buildExpandedRegex, rankByRelevance } from '@/lib/transliteration'
 *
 *   const terms = expandQuery('shiv')
 *   // → ['shiv','shiva','mahadev','mahesh','shankar','bholenath','neelkanth','rudra','शिव','महादेव','शंकर',...]
 *
 *   const regex = buildExpandedRegex(terms)
 *   // → /(shiv|shiva|mahadev|शिव|...)/i
 */

// ── Alias group type ──────────────────────────────────────────────────────────

type AliasGroup = {
  id: string
  terms: string[]     // English spellings and aliases
  termsHi: string[]   // Hindi / Devanagari variants
}

// ── Master alias dictionary ───────────────────────────────────────────────────

export const ALIAS_GROUPS: AliasGroup[] = [
  // ── Shiva ─────────────────────────────────────────────────────────────────
  {
    id: 'shiva',
    terms: ['shiv', 'shiva', 'mahadev', 'mahesh', 'shankar', 'bholenath',
      'neelkanth', 'nataraja', 'pashupatinath', 'har', 'hara', 'rudra',
      'sambhu', 'ishwar', 'eshwar', 'trimbakeshwar', 'kedarnath'],
    termsHi: ['शिव', 'शिवा', 'महादेव', 'महेश', 'शंकर', 'भोलेनाथ',
      'नीलकंठ', 'नटराज', 'पशुपतिनाथ', 'हर', 'रुद्र', 'शम्भु',
      'ईश्वर', 'केदारनाथ'],
  },

  // ── Vishnu ────────────────────────────────────────────────────────────────
  {
    id: 'vishnu',
    terms: ['vishnu', 'narayan', 'narayana', 'hari', 'venkateswara',
      'venkatesh', 'balaji', 'tirupati', 'perumal', 'ranganatha',
      'trivikrama', 'vithoba', 'panduranga'],
    termsHi: ['विष्णु', 'नारायण', 'हरि', 'वेंकटेश्वर', 'वेंकटेश',
      'बालाजी', 'तिरुपति', 'पंढरपुर', 'विट्ठल'],
  },

  // ── Krishna ───────────────────────────────────────────────────────────────
  {
    id: 'krishna',
    terms: ['krishna', 'kanha', 'kanhaiya', 'govind', 'govinda', 'gopal',
      'gopala', 'murari', 'madhav', 'madhava', 'nandlal', 'dwarkadheesh',
      'nathdwara', 'banke bihari', 'bankebihari', 'shyam'],
    termsHi: ['कृष्ण', 'कन्हा', 'कन्हैया', 'गोविंद', 'गोपाल',
      'मुरारी', 'माधव', 'नंदलाल', 'द्वारकाधीश', 'बांके बिहारी',
      'श्याम'],
  },

  // ── Rama ──────────────────────────────────────────────────────────────────
  {
    id: 'rama',
    terms: ['ram', 'rama', 'shri ram', 'shriram', 'sita ram', 'sitaram',
      'raghu', 'raghunath', 'raghupati', 'ramchandra', 'ayodhya'],
    termsHi: ['राम', 'रामा', 'श्रीराम', 'सीताराम', 'रघुनाथ',
      'रामचंद्र', 'अयोध्या'],
  },

  // ── Hanuman ───────────────────────────────────────────────────────────────
  {
    id: 'hanuman',
    terms: ['hanuman', 'bajrangbali', 'bajrang', 'anjaneya', 'maruti',
      'pawanputra', 'pavanputra', 'kesarinandan', 'sankatmochan',
      'mahavir', 'veer hanuman'],
    termsHi: ['हनुमान', 'बजरंगबली', 'बजरंग', 'अंजनेय', 'मारुति',
      'पवनपुत्र', 'केसरीनंदन', 'संकटमोचन', 'महावीर'],
  },

  // ── Ganesh ────────────────────────────────────────────────────────────────
  {
    id: 'ganesh',
    terms: ['ganesh', 'ganesha', 'ganpati', 'ganapati', 'vinayak',
      'vinayaka', 'lambodara', 'vighnaharta', 'vighnesh', 'siddhivinayak',
      'ekdanta', 'pillayar'],
    termsHi: ['गणेश', 'गणपति', 'विनायक', 'लंबोदर', 'विघ्नहर्ता',
      'सिद्धिविनायक', 'एकदंत', 'पिल्लैयार'],
  },

  // ── Durga ─────────────────────────────────────────────────────────────────
  {
    id: 'durga',
    terms: ['durga', 'amba', 'ambe', 'jagdamba', 'jagdambe', 'bhavani',
      'parvati', 'shakti', 'kali', 'chandika', 'chamunda', 'chandi',
      'vaishno devi', 'vaishnodevi', 'mata', 'devi'],
    termsHi: ['दुर्गा', 'अंबा', 'अंबे', 'जगदम्बा', 'भवानी',
      'पार्वती', 'शक्ति', 'काली', 'चंडिका', 'चामुंडा', 'वैष्णो देवी',
      'माता', 'देवी'],
  },

  // ── Lakshmi ───────────────────────────────────────────────────────────────
  {
    id: 'lakshmi',
    terms: ['lakshmi', 'laxmi', 'mahalakshmi', 'mahalaxmi', 'kamala',
      'padma', 'shri', 'sri'],
    termsHi: ['लक्ष्मी', 'महालक्ष्मी', 'कमला', 'पद्मा', 'श्री'],
  },

  // ── Saraswati ─────────────────────────────────────────────────────────────
  {
    id: 'saraswati',
    terms: ['saraswati', 'sarasvati', 'vagdevi', 'sharada', 'sarda',
      'veenapani'],
    termsHi: ['सरस्वती', 'वागदेवी', 'शारदा', 'वीणापाणि'],
  },

  // ── Brahma ────────────────────────────────────────────────────────────────
  {
    id: 'brahma',
    terms: ['brahma', 'brahmadev', 'prajapati', 'pitamah'],
    termsHi: ['ब्रह्मा', 'ब्रह्मदेव', 'प्रजापति', 'पितामह'],
  },

  // ── Parvati ───────────────────────────────────────────────────────────────
  {
    id: 'parvati',
    terms: ['parvati', 'uma', 'gauri', 'haimavati', 'girija', 'sati'],
    termsHi: ['पार्वती', 'उमा', 'गौरी', 'गिरिजा', 'सती'],
  },

  // ── Kartikeya ─────────────────────────────────────────────────────────────
  {
    id: 'kartikeya',
    terms: ['kartikeya', 'murugan', 'subramanya', 'subramaniam', 'skanda',
      'kumara', 'senthil', 'arumugam'],
    termsHi: ['कार्तिकेय', 'मुरुगन', 'सुब्रह्मण्य', 'स्कंद', 'कुमार'],
  },

  // ── Surya ─────────────────────────────────────────────────────────────────
  {
    id: 'surya',
    terms: ['surya', 'sun', 'sun god', 'aditya', 'bhaskar', 'ravi',
      'divakara', 'konark'],
    termsHi: ['सूर्य', 'आदित्य', 'भास्कर', 'रवि', 'दिवाकर'],
  },

  // ── Radha ─────────────────────────────────────────────────────────────────
  {
    id: 'radha',
    terms: ['radha', 'radhe', 'radhika', 'radha krishna', 'radhakrishna'],
    termsHi: ['राधा', 'राधे', 'राधिका', 'राधाकृष्ण'],
  },

  // ── Sita ──────────────────────────────────────────────────────────────────
  {
    id: 'sita',
    terms: ['sita', 'seeta', 'janaki', 'vaidehi', 'maithili'],
    termsHi: ['सीता', 'जानकी', 'वैदेही', 'मैथिली'],
  },

  // ── Navagraha ─────────────────────────────────────────────────────────────
  {
    id: 'navagraha',
    terms: ['navagraha', 'navgraha', 'graha', 'shani', 'saturn', 'mangal',
      'mars', 'budh', 'mercury', 'guru', 'jupiter', 'rahu', 'ketu'],
    termsHi: ['नवग्रह', 'शनि', 'मंगल', 'बुध', 'गुरु', 'राहु', 'केतु'],
  },

  // ── Devotional concepts ───────────────────────────────────────────────────
  {
    id: 'aarti',
    terms: ['aarti', 'arti', 'aarathi', 'arthi', 'deep aarti'],
    termsHi: ['आरती', 'आरति', 'दीप आरती'],
  },
  {
    id: 'chalisa',
    terms: ['chalisa', 'chalisa path', 'chaalisa', 'chalisia', '40 verses'],
    termsHi: ['चालीसा', 'चालिसा'],
  },
  {
    id: 'mantra',
    terms: ['mantra', 'mantr', 'jap', 'jaap', 'mala jap'],
    termsHi: ['मंत्र', 'मन्त्र', 'जप', 'जाप'],
  },
  {
    id: 'bhajan',
    terms: ['bhajan', 'kirtan', 'kirtana', 'bhakti geet', 'devotional song'],
    termsHi: ['भजन', 'कीर्तन', 'भक्ति गीत'],
  },
  {
    id: 'stotra',
    terms: ['stotra', 'stotram', 'stuti', 'kavach', 'kavacham', 'ashtakam',
      'sahasranama'],
    termsHi: ['स्तोत्र', 'स्तुति', 'कवच', 'अष्टकम', 'सहस्रनाम'],
  },
  {
    id: 'puja',
    terms: ['puja', 'pooja', 'poojan', 'archana', 'havan', 'yagna',
      'abhishek'],
    termsHi: ['पूजा', 'पूजन', 'अर्चना', 'हवन', 'यज्ञ', 'अभिषेक'],
  },
  {
    id: 'darshan',
    terms: ['darshan', 'darshana', 'prasad', 'prasadam', 'naivedya'],
    termsHi: ['दर्शन', 'प्रसाद', 'नैवेद्य'],
  },

  // ── Sacred places ─────────────────────────────────────────────────────────
  {
    id: 'pushkar',
    terms: ['pushkar', 'pushkara', 'pushkar lake', 'brahma temple'],
    termsHi: ['पुष्कर', 'पुष्करा', 'ब्रह्मा मंदिर'],
  },
  {
    id: 'varanasi',
    terms: ['varanasi', 'kashi', 'benares', 'kasi', 'benaras',
      'kashi vishwanath'],
    termsHi: ['वाराणसी', 'काशी', 'बनारस', 'काशी विश्वनाथ'],
  },
  {
    id: 'vrindavan',
    terms: ['vrindavan', 'vrindavana', 'vrindaban', 'mathura vrindavan',
      'brindavan', 'brindaban'],
    termsHi: ['वृंदावन', 'वृन्दावन', 'मथुरा वृंदावन'],
  },
  {
    id: 'mathura',
    terms: ['mathura', 'mathuraji', 'krishna janmabhoomi'],
    termsHi: ['मथुरा', 'कृष्ण जन्मभूमि'],
  },
  {
    id: 'ayodhya',
    terms: ['ayodhya', 'ayodhyaji', 'ram janmabhoomi', 'ram mandir'],
    termsHi: ['अयोध्या', 'राम जन्मभूमि', 'राम मंदिर'],
  },
  {
    id: 'tirupati',
    terms: ['tirupati', 'tirupathi', 'tirumala', 'tirumala tirupati'],
    termsHi: ['तिरुपति', 'तिरुमाला'],
  },
  {
    id: 'haridwar',
    terms: ['haridwar', 'hardwar', 'haridwar ghat', 'har ki pauri'],
    termsHi: ['हरिद्वार', 'हर की पौड़ी'],
  },
  {
    id: 'rishikesh',
    terms: ['rishikesh', 'hrishikesh', 'rishikesh ashram'],
    termsHi: ['ऋषिकेश', 'हृषिकेश'],
  },
  {
    id: 'dwarka',
    terms: ['dwarka', 'dwaraka', 'dwarkadhish', 'dwarkadheesh'],
    termsHi: ['द्वारका', 'द्वारकाधीश'],
  },
  {
    id: 'puri',
    terms: ['puri', 'jagannath', 'jagannatha', 'puri jagannath',
      'jagannath puri'],
    termsHi: ['पुरी', 'जगन्नाथ', 'जगन्नाथ पुरी'],
  },
  {
    id: 'shirdi',
    terms: ['shirdi', 'sai baba', 'saibaba', 'shirdi sai'],
    termsHi: ['शिर्डी', 'साईं बाबा', 'साईबाबा'],
  },

  // ── Jyotirlinga ───────────────────────────────────────────────────────────
  {
    id: 'jyotirlinga',
    terms: ['jyotirlinga', 'jyotirling', 'jotirlinga', '12 jyotirlinga',
      'somnath', 'mallikarjuna', 'kedarnath', 'omkareshwar',
      'bhimashankar', 'kashi vishwanath', 'trimbakeshwar',
      'vaidyanath', 'nageshvara', 'rameshwaram', 'grishneshwar'],
    termsHi: ['ज्योतिर्लिंग', 'सोमनाथ', 'मल्लिकार्जुन',
      'केदारनाथ', 'ओंकारेश्वर', 'भीमाशंकर', 'त्र्यंबकेश्वर',
      'वैद्यनाथ', 'रामेश्वरम', 'घृष्णेश्वर'],
  },
]

// ── Build flat lookup index ───────────────────────────────────────────────────
// Maps every normalized variant → full list of all terms in its group

const _index = new Map<string, string[]>()

function _normalize(term: string): string {
  return term.toLowerCase().trim().replace(/\s+/g, ' ')
}

for (const group of ALIAS_GROUPS) {
  const all = [...group.terms, ...group.termsHi]
  for (const term of all) {
    _index.set(_normalize(term), all)
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Expands a user query to include all known aliases and Devanagari variants.
 *
 * @example
 * expandQuery('shiv')
 * // → ['shiv', 'shiva', 'mahadev', 'shankar', ..., 'शिव', 'महादेव', ...]
 *
 * expandQuery('आरती')
 * // → ['आरती', 'आरति', 'aarti', 'arti', ...]
 *
 * expandQuery('pushkar')
 * // → ['pushkar', 'pushkara', 'पुष्कर', ...]
 *
 * @returns deduplicated array of related search terms; if no alias found returns [q]
 */
export function expandQuery(q: string): string[] {
  const key = _normalize(q)

  // Exact dictionary hit
  if (_index.has(key)) {
    return [...new Set([q, ..._index.get(key)!])]
  }

  // Prefix / partial match — collect all groups where any key starts with query
  const accumulated: string[] = []
  for (const [k, terms] of _index) {
    if (k.startsWith(key) || key.startsWith(k)) {
      accumulated.push(...terms)
    }
  }

  if (accumulated.length > 0) {
    return [...new Set([q, ...accumulated])]
  }

  // No alias found — return original query only
  return [q]
}

/**
 * Returns true if `expandQuery` found any aliases for this query.
 */
export function hasAliases(q: string): boolean {
  const key = _normalize(q)
  if (_index.has(key)) return true
  for (const k of _index.keys()) {
    if (k.startsWith(key) || key.startsWith(k)) return true
  }
  return false
}

/**
 * Builds a single case-insensitive regex that matches ANY of the expanded terms.
 *
 * @example
 * buildExpandedRegex(['shiv', 'shiva', 'mahadev', 'शिव'])
 * // → /(shiv|shiva|mahadev|शिव)/i
 */
export function buildExpandedRegex(terms: string[]): RegExp {
  const escaped = terms
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  return new RegExp(escaped || '.^', 'i')
}

/**
 * Sorts results by relevance to the original query.
 *
 * Scoring (lower = better):
 *   0 — title exactly equals original query (case-insensitive)
 *   1 — title starts with original query
 *   2 — title contains original query
 *   3 — matched only via alias (still relevant, just ranked lower)
 *
 * @param results  - array of lean MongoDB docs
 * @param q        - original user query (not expanded)
 * @param titleFields - fields to check for scoring (first match wins)
 */
export function rankByRelevance<T extends Record<string, any>>(
  results: T[],
  q: string,
  titleFields: string[] = ['title', 'name']
): T[] {
  if (results.length <= 1) return results
  const qLower = q.toLowerCase().trim()

  return [...results].sort((a, b) => {
    return scoreDoc(a, qLower, titleFields) - scoreDoc(b, qLower, titleFields)
  })
}

function scoreDoc(
  doc: Record<string, any>,
  qLower: string,
  titleFields: string[]
): number {
  let best = 4
  for (const field of titleFields) {
    const val = String(doc[field] ?? '').toLowerCase().trim()
    if (!val) continue
    if (val === qLower)          { best = 0; break }
    if (val.startsWith(qLower))  { best = Math.min(best, 1) }
    else if (val.includes(qLower)) { best = Math.min(best, 2) }
    else                           { best = Math.min(best, 3) }
  }
  return best
}
