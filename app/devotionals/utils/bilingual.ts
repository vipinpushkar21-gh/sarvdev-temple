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
  // Only use Hindi as primary if conversion is complete (no leftover Latin chars)
  // Allow digits, spaces, punctuation — but reject if any a-z letters remain
  const hasLatinLeftover = /[a-zA-Z]/.test(hindiApprox);
  if (hindiApprox && !hasLatinLeftover) {
    return { primary: hindiApprox, secondary: title };
  }
  // Incomplete conversion — show English title as primary, no broken Hindi
  return { primary: title };
}

// English → Hindi approximate mapping for common devotional terms and deities
const englishToHindiWordMap: Record<string, string> = {
  // honorifics and forms
  'shri': 'श्री', 'sri': 'श्री',
  // categories / types
  'aarti': 'आरती', 'chalisa': 'चालीसा', 'mantra': 'मंत्र', 'stotra': 'स्तोत्र', 'namavali': 'नामावली',
  'stotram': 'स्तोत्रम्', 'suktam': 'सूक्तम्', 'sukt': 'सूक्त', 'sukta': 'सूक्त',
  'ashtakam': 'अष्टकम्', 'ashtaka': 'अष्टक', 'kavacham': 'कवचम्', 'kavach': 'कवच',
  'stuti': 'स्तुति', 'shloka': 'श्लोक', 'sloka': 'श्लोक', 'bhajan': 'भजन',
  'path': 'पाठ', 'prarthana': 'प्रार्थना', 'vandana': 'वंदना',
  'sahasranama': 'सहस्रनाम', 'sahasranamam': 'सहस्रनामम्',
  'suprabhatam': 'सुप्रभातम्', 'suprabhat': 'सुप्रभात',
  'pancharatnam': 'पंचरत्नम्', 'pancharatna': 'पंचरत्न',
  'tandav': 'तांडव', 'tandava': 'तांडव',
  'avatara': 'अवतार', 'avatar': 'अवतार',
  'kirtanam': 'कीर्तनम्', 'kirtan': 'कीर्तन',
  'archana': 'अर्चना', 'puja': 'पूजा', 'havan': 'हवन',
  'vrat': 'व्रत', 'katha': 'कथा',
  // deities and proper nouns
  'narasimha': 'नरसिंह', 'narasimhi': 'नरसिंही', 'rani': 'रानी', 'sati': 'सती',
  'brahma': 'ब्रह्मा', 'ramdev': 'रामदेव',
  'mahalakshmi': 'महालक्ष्मी', 'lakshmi': 'लक्ष्मी', 'laxmi': 'लक्ष्मी',
  'navgrah': 'नवग्रह', 'navagraha': 'नवग्रह', 'navgraha': 'नवग्रह',
  'navadurga': 'नवदुर्गा', 'navdurga': 'नवदुर्गा',
  'gayatri': 'गायत्री', 'saraswati': 'सरस्वती', 'parvati': 'पार्वती', 'vaishno': 'वैष्णो',
  'vishnu': 'विष्णु', 'vinshnu': 'विष्णु', 'krishna': 'कृष्ण', 'gopal': 'गोपाल',
  'govinda': 'गोविन्द', 'govindashtakam': 'गोविन्दाष्टकम्',
  'radha': 'राधा', 'kuber': 'कुबेर', 'kubera': 'कुबेर',
  'khatu': 'खाटू', 'shyam': 'श्याम', 'bhairav': 'भैरव', 'bhairava': 'भैरव',
  'durga': 'दुर्गा', 'surya': 'सूर्य',
  'ganga': 'गंगा', 'gangashtakam': 'गंगाष्टकम्', 'yamuna': 'यमुना', 'yamunashtakam': 'यमुनाष्टकम्',
  'tulsi': 'तुलसी', 'tulasi': 'तुलसी', 'sita': 'सीता', 'shani': 'शनि',
  'mehandipur': 'मेहंदीपुर', 'balaji': 'बालाजी', 'ram': 'राम', 'rama': 'राम',
  'shiva': 'शिव', 'shiv': 'शिव', 'shankar': 'शंकर', 'shankara': 'शंकराचार्य',
  'ganesh': 'गणेश', 'ganesha': 'गणेश', 'hanuman': 'हनुमान',
  'devi': 'देवी', 'deva': 'देव', 'dev': 'देव', 'mata': 'माता', 'maa': 'माँ',
  'murugan': 'मुरुगन', 'kartikeya': 'कार्तिकेय', 'skanda': 'स्कन्द',
  'kali': 'काली', 'kalika': 'कालिका', 'kalaratri': 'कालरात्री',
  'katyayani': 'कात्यायनी', 'kushmanda': 'कूष्माण्डा',
  'chandraghanta': 'चन्द्रघण्टा', 'skandamata': 'स्कन्दमाता',
  'siddhidatri': 'सिद्धिदात्री', 'mahagauri': 'महागौरी',
  'shailaputri': 'शैलपुत्री', 'brahmacharini': 'ब्रह्मचारिणी',
  'narayana': 'नारायण', 'narayan': 'नारायण',
  'madhura': 'मधुर', 'madhurashtakam': 'मधुराष्टकम्',
  'krishnashtakam': 'कृष्णाष्टकम्', 'rudra': 'रुद्र',
  'linga': 'लिंग', 'lingam': 'लिंगम्', 'vishvanath': 'विश्वनाथ',
  'gauri': 'गौरी', 'gaurishashtakam': 'गौरीशाष्टकम्',
  'achyuta': 'अच्युत', 'achyutashtakam': 'अच्युताष्टकम्',
  'pashupati': 'पशुपति', 'dinabandhu': 'दीनबन्धु',
  'kamalapati': 'कमलापति', 'lakshminarayana': 'लक्ष्मीनारायण',
  'sundarkand': 'सुन्दरकाण्ड', 'sundarkanda': 'सुन्दरकाण्ड',
  'vindhyeshwari': 'विन्ध्येश्वरी', 'bhagavati': 'भगवती',
  'siddhakunjika': 'सिद्धकुञ्जिका',
  'dakshina': 'दक्षिण', 'nag': 'नाग', 'naga': 'नाग',
  'sai': 'साई', 'baba': 'बाबा', 'ji': 'जी',
  'lord': '', 'god': '', 'goddess': '', 'goddesses': '',
  'kalabhairava': 'कालभैरव', 'shitala': 'शीतला',
  'hari': 'हरि', 'sharanashtakam': 'शरणाष्टकम्',
  'narayanashtakam': 'नारायणाष्टकम्',
  'durgashtakam': 'दुर्गाष्टकम्', 'bhavanyashtakam': 'भवान्यष्टकम्',
  'kalikashtakam': 'कालिकाष्टकम्', 'shivashtakam': 'शिवाष्टकम्',
  'ramashtakam': 'रामाष्टकम्',
  'name': 'नाम', 'namaste': 'नमस्ते', 'namo': 'नमो',
  'om': 'ॐ', 'aum': 'ॐ',
  'adi': 'आदि', 'krit': 'कृत',
  'matrika': 'मातृका', 'matrikas': 'मातृकाएँ',
  'ananta': 'अनन्त', 'dayanidhi': 'दयानिधि', 'paresha': 'परेश',
  'english': '', '108': '१०८',
  'rani sati': 'रानी सती', 'khatu shyam': 'खाटू श्याम'
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
  // Normalize extra spaces from empty mappings (lord, god, etc.)
  out = out.replace(/\s+/g, ' ').replace(/[–—]\s*$/g, '').trim();
  return out;
}
