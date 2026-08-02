// Mapping of Aarti titles to their subcategories
// Used to update existing devotionals with proper subcategory assignments
// Includes both Hindi-only titles and titles with English translations in parentheses

export const AARTI_SUBCATEGORY_MAPPING: Record<string, string> = {
  // शिव परिवार (Shiva & Family)
  'हर महादेव आरती: सत्य, सनातन, सुंदर': 'shiv-parivar',
  'हर महादेव आरती: सत्य, सनातन, सुंदर (Har Mahadev Aarti: Satya Sanatan Sundar)': 'shiv-parivar',
  'शिव आरती – ॐ जय गंगाधर': 'shiv-parivar',
  'शिव आरती – ॐ जय गंगाधर (Shiv Aarti – Om Jai Gangadhar)': 'shiv-parivar',
  'शिव आरती – ॐ जय शिव ओंकारा': 'shiv-parivar',
  'शिव आरती (ॐ जय शिव ओंकारा)': 'shiv-parivar',
  'जय हो जय जय है गौरी नंदन – आरती': 'shiv-parivar',
  'जय हो जय जय है गौरी नंदन – आरती (Jai Ho Jai Jai Hai Gauri Nandan – Aarti)': 'shiv-parivar',
  'श्री गणेश आरती': 'shiv-parivar',
  'माता पार्वती जी की आरती': 'shiv-parivar',
  'माता पार्वती जी की आरती (Mata Parvati Ji Ki Aarti)': 'shiv-parivar',
  'स्कन्दमाता जी की आरती': 'shiv-parivar',
  'श्री भैरव देव जी की आरती': 'shiv-parivar',

  // श्री विष्णु एवं अवतार (Vishnu & Avatars)
  'श्री विष्णु आरती (ॐ जय जगदीश हरे)': 'vishnu-avtar',
  'आरती कुंजबिहारी की': 'vishnu-avtar',
  'आरती बाल कृष्ण की कीजै': 'vishnu-avtar',
  'आरती बाल कृष्ण की कीजै (Aarti Bal Krishna Ki Keejai)': 'vishnu-avtar',
  'श्री सीता माता आरती': 'vishnu-avtar',
  'श्री सीता माता आरती (Shri Sita Mata Aarti)': 'vishnu-avtar',
  'श्री सत्यनारायण जी की आरती': 'vishnu-avtar',
  'श्री सत्यनारायण जी की आरती (Shri Satyanarayan Ji Ki Aarti)': 'vishnu-avtar',
  'श्री सालासर बालाजी जी की आरती': 'vishnu-avtar',
  'श्री बालाजी जी की आरती': 'vishnu-avtar',
  'श्री बालाजी जी की आरती (Shri Balaji Ji Ki Aarti)': 'vishnu-avtar',
  'श्री हनुमान आरती (शुद्ध हिंदी रूप)': 'vishnu-avtar',
  'गीत गोविंद जगन्नाथ आरती': 'vishnu-avtar',

  // दुर्गा व शक्ति (Durga & Shakti)
  'जय अम्बे गौरी आरती': 'durga-shakti',
  'जय अम्बे गौरी आरती (Jai Ambe Gauri Aarti)': 'durga-shakti',
  'माँ दुर्गा / माँ काली आरती': 'durga-shakti',
  'देवी शैलपुत्री जी की आरती': 'durga-shakti',
  'देवी ब्रह्मचारिणी जी की आरती': 'durga-shakti',
  'माँ चन्द्रघण्टा जी की आरती': 'durga-shakti',
  'देवी कात्यायनी जी की आरती': 'durga-shakti',
  'श्री बगलामुखी माता जी की आरती': 'durga-shakti',
  'श्री चामुण्डा माता आरती': 'durga-shakti',

  // लक्ष्मी व अन्य देवियाँ (Wealth & Prosperity)
  'श्री लक्ष्मी माता आरती (ॐ जय लक्ष्मी माता)': 'lakshmi-devi',
  'श्री लक्ष्मी माता आरती (Shri Lakshmi Mata Aarti)': 'lakshmi-devi',
  'अन्नपूर्णा माता आरती': 'lakshmi-devi',
  'अन्नपूर्णा माता आरती (Annapurna Mata Aarti)': 'lakshmi-devi',
  'संतोषी माता आरती': 'lakshmi-devi',
  'श्री कुबेर जी आरती – जय कुबेर स्वामी': 'lakshmi-devi',

  // नवग्रह (Navgrah)
  'श्री सूर्य देव जी की आरती': 'navgrah',
  'श्री सूर्य देव जी की आरती (Shri Surya Dev Ji Ki Aarti)': 'navgrah',
  'चन्द्र देव आरती': 'navgrah',
  'चन्द्र देव आरती (Chandra Dev Aarti)': 'navgrah',
  'श्री शनिदेव आरती': 'navgrah',
  'श्री बृहस्पति देव जी की आरती': 'navgrah',

  // पवित्र नदियाँ (Holy Rivers & Nature)
  'श्री गंगा मैया आरती': 'pavitra-nadiyan',
  'श्री गंगा मैया आरती (Shri Ganga Maiya Aarti)': 'pavitra-nadiyan',
  'नर्मदा जी की आरती': 'pavitra-nadiyan',
  'तुलसी माता आरती': 'pavitra-nadiyan',
  'तुलसी माता आरती (Tulsi Mata Aarti)': 'pavitra-nadiyan',

  // ग्रंथ व एकादशी (Texts & Tithi)
  'भगवद्‍ गीता आरती': 'granth-ekadashi',
  'भगवद्‍ गीता आरती (Bhagavad Gita Aarti)': 'granth-ekadashi',
  'एकादशी माता की आरती': 'granth-ekadashi',

  // धाम व संत (Pilgrimages & Saints)
  'खाटू श्याम जी की आरती': 'dham-sant',
}

// Helper function to get subcategory from title
export function getAartiSubcategory(title: string): string | undefined {
  return AARTI_SUBCATEGORY_MAPPING[title]
}
