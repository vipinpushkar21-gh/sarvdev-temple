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

export function devanagariToLatin(text: string): string {
  // Simple char-by-char mapping; not linguistically accurate
  return Array.from(text).map(ch => devanagariToLatinMap[ch] ?? ch).join('');
}

export function renderBilingualTitle(title: string): { primary: string, secondary?: string } {
  if (!title) return { primary: '' };
  if (isDevanagari(title)) {
    return { primary: title, secondary: devanagariToLatin(title) };
  }
  // If not Devanagari, show original as primary; no reliable auto Hindi available without a service
  return { primary: title };
}
