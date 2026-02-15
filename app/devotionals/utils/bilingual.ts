export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// Very basic Devanagari -> Latin transliteration (approximate)
// This is intentionally minimal and serves as a readable fallback.
const devanagariToLatinMap: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah',
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  '़': '', '्': '', 'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'm', 'ः': 'h', 'ँ': 'm'
};

// Common devotional word dictionary for cleaner transliteration
const wordMap: Record<string, string> = {
  'श्री': 'Shri',
  'तुलसी': 'Tulsi',
  'माता': 'Mata',
  'देवी': 'Devi',
  'भगवान': 'Bhagwan',
  'महादेव': 'Mahadev',
  'हनुमान': 'Hanuman',
  'गणेश': 'Ganesh',
  'लक्ष्मी': 'Lakshmi',
  'काली': 'Kali',
  'विष्णु': 'Vishnu',
  'शिव': 'Shiva',
  'आरती': 'Aarti',
  'चालीसा': 'Chalisa',
  'मंत्र': 'Mantra',
  'स्तोत्र': 'Stotra',
  'भजन': 'Bhajan',
};

function applyWordMap(text: string): string {
  let t = text;
  for (const [dev, lat] of Object.entries(wordMap)) {
    t = t.replace(new RegExp(dev, 'g'), lat);
  }
  return t;
}

function toTitleCase(text: string): string {
  return text
    .split(/\s+/)
    .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w)
    .join(' ')
    .trim();
}

export function devanagariToLatin(text: string): string {
  // Simple char-by-char mapping; not linguistically accurate
  // First, replace common words to preferred spellings
  const pre = applyWordMap(text);
  // Then transliterate remaining Devanagari characters
  const converted = Array.from(pre).map(ch => devanagariToLatinMap[ch] ?? ch).join('');
  // Normalize to title case for readability
  return toTitleCase(converted);
}

export function renderBilingualTitle(title: string): { primary: string, secondary?: string } {
  if (!title) return { primary: '' };
  // If title already contains English in parentheses, prefer that pairing
  const parenMatch = title.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    const hindi = parenMatch[1].trim();
    const english = parenMatch[2].trim();
    return { primary: hindi || title, secondary: english };
  }

  if (isDevanagari(title)) {
    return { primary: title, secondary: devanagariToLatin(title) };
  }
  // If not Devanagari, attempt an approximate Hindi rendering from common words
  const hindiApprox = englishToHindiApprox(title);
  return { primary: hindiApprox || title, secondary: title };
}

// English → Hindi approximate mapping for common devotional terms and deities
const englishToHindiWordMap: Record<string, string> = {
  // honorifics and forms
  'shri': 'श्री', 'sri': 'श्री',
  // categories
  'aarti': 'आरती', 'chalisa': 'चालीसा', 'mantra': 'मंत्र', 'stotra': 'स्तोत्र', 'namavali': 'नामावली',
  // deities and proper nouns
  'narasimha': 'नरसिंह', 'rani': 'रानी', 'sati': 'सती', 'brahma': 'ब्रह्मा', 'ramdev': 'रामदेव',
  'mahalakshmi': 'महालक्ष्मी', 'lakshmi': 'लक्ष्मी', 'navgrah': 'नवग्रह', 'navagraha': 'नवग्रह',
  'gayatri': 'गायत्री', 'saraswati': 'सरस्वती', 'parvati': 'पार्वती', 'vaishno': 'वैष्णो',
  'vishnu': 'विष्णु', 'krishna': 'कृष्ण', 'gopal': 'गोपाल', 'radha': 'राधा', 'kuber': 'कुबेर',
  'khatu': 'खाटू', 'shyam': 'श्याम', 'bhairav': 'भैरव', 'durga': 'दुर्गा', 'surya': 'सूर्य',
  'ganga': 'गंगा', 'tulsi': 'तुलसी', 'tulasi': 'तुलसी', 'sita': 'सीता', 'shani': 'शनि',
  'mehandipur': 'मेहंदीपुर', 'balaji': 'बालाजी', 'ram': 'राम', 'shiva': 'शिव', 'shiv': 'शिव',
  'ganesh': 'गणेश', 'ganesha': 'गणेश', 'hanuman': 'हनुमान', 'rani sati': 'रानी सती', 'khatu shyam': 'खाटू श्याम'
};

export function englishToHindiApprox(text: string): string {
  if (!text) return '';
  const lower = text.toLowerCase();
  // Try phrase matches first
  let out = lower;
  for (const [en, hi] of Object.entries(englishToHindiWordMap)) {
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`\\b${escaped}\\b`, 'g'), hi);
  }
  // Replace hyphens with spaces for readability
  out = out.replace(/-/g, ' ');
  // Title case is not applicable in Hindi; just return as-is trimmed
  return out.trim();
}
