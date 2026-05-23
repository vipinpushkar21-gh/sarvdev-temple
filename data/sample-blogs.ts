export type SampleBlogSeed = {
  title: string
  titleHi: string
  slug: string
  excerpt: string
  excerptHi: string
  content: string
  contentHi: string
  category: string
  tags: string[]
  author: string
  authorRole: string
  status: 'draft' | 'published'
  featured: boolean
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  imagePrompt: string
}

const AUTHOR = 'Sarvdev Editorial'
const AUTHOR_ROLE = 'Editorial Team'

function article(
  title: string,
  titleHi: string,
  slug: string,
  excerpt: string,
  excerptHi: string,
  category: string,
  tags: string[],
  imagePrompt: string,
  featured = false
): SampleBlogSeed {
  const focus = tags[0] || category

  return {
    title,
    titleHi,
    slug,
    excerpt,
    excerptHi,
    category,
    tags,
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    status: 'draft',
    featured,
    metaTitle: `${title} | Sarvdev Blog`,
    metaDescription: excerpt.slice(0, 155),
    metaKeywords: [...tags, 'Sarvdev', 'Hindu spirituality', 'Sanatan Dharma'],
    imagePrompt,
    content: `## A gentle introduction

${excerpt}

In Hindu spiritual life, ${focus} is understood through devotion, discipline, and lived practice. The meaning is not limited to one ritual action. It becomes clearer when a devotee approaches it with respect, patience, and a willingness to learn from family traditions, temple guidance, and trusted sources.

## How devotees can practice

Begin with a clean space, a calm mind, and a simple sankalp, or intention. If a ritual is new to you, keep it modest and sincere. A short prayer, a few minutes of silence, or one meaningful offering can be more helpful than rushing through many actions without attention.

## Sarvdev note

This article is written as a safe educational guide. Local customs vary by region, sampradaya, family tradition, and temple practice, so devotees should follow the guidance of their elders, guru, or temple priest for specific ritual decisions.`,
    contentHi: `${titleHi} पर यह संक्षिप्त मार्गदर्शिका भक्तों को सरल और सम्मानपूर्ण समझ देती है। पूजा और साधना में भाव, शुद्धता और नियमितता को महत्वपूर्ण माना जाता है। अलग-अलग परिवारों, क्षेत्रों और मंदिर परंपराओं में रीति भिन्न हो सकती है, इसलिए विशेष अनुष्ठान के लिए अपने गुरु, परिवार के बड़ों या मंदिर के पुजारी से मार्गदर्शन लेना उचित है.`,
  }
}

export const SAMPLE_BLOGS: SampleBlogSeed[] = [
  article(
    'Meaning of Om in Sanatan Dharma',
    'सनातन धर्म में ॐ का अर्थ',
    'meaning-of-om-in-sanatan-dharma',
    'A simple guide to Om as a sacred sound used in prayer, meditation, and daily remembrance.',
    'प्रार्थना, ध्यान और स्मरण में ॐ के पवित्र महत्व की सरल व्याख्या।',
    'Spiritual Knowledge',
    ['Om', 'mantra', 'meditation'],
    'Cinematic devotional image of a glowing Om symbol near a temple lamp, warm gold light, no text near edges',
    true
  ),
  article(
    'Why Temples Have Bells',
    'मंदिरों में घंटी क्यों होती है',
    'why-temples-have-bells',
    'Learn why temple bells are rung before darshan and how sound helps focus the mind.',
    'दर्शन से पहले घंटी बजाने की परंपरा और मन को एकाग्र करने में ध्वनि का महत्व।',
    'Temple Traditions',
    ['temple bells', 'darshan', 'rituals'],
    'Temple bell in warm morning light with soft diya glow, realistic, centered subject'
  ),
  article(
    'Importance of Daily Darshan',
    'दैनिक दर्शन का महत्व',
    'importance-of-daily-darshan',
    'Daily darshan can become a peaceful habit that brings remembrance, gratitude, and spiritual rhythm.',
    'दैनिक दर्शन स्मरण, कृतज्ञता और आध्यात्मिक लय का सुंदर अभ्यास बन सकता है।',
    'Daily Practice',
    ['daily darshan', 'devotion', 'temple'],
    'Devotee watching peaceful temple darshan at sunrise, devotional atmosphere, no text',
    true
  ),
  article(
    'What is Panchang and Why It Matters',
    'पंचांग क्या है और क्यों महत्वपूर्ण है',
    'what-is-panchang-and-why-it-matters',
    'A beginner friendly explanation of tithi, nakshatra, yoga, karana, and weekday in Hindu timekeeping.',
    'तिथि, नक्षत्र, योग, करण और वार की सरल शुरुआती जानकारी।',
    'Panchang',
    ['panchang', 'tithi', 'hindu calendar'],
    'Traditional panchang book with diya and marigold flowers, premium devotional editorial style'
  ),
  article(
    'Significance of Aarti in Hindu Worship',
    'हिंदू पूजा में आरती का महत्व',
    'significance-of-aarti-in-hindu-worship',
    'Understand aarti as an offering of light, devotion, gratitude, and sacred presence.',
    'आरती को प्रकाश, भक्ति, कृतज्ञता और दिव्य उपस्थिति के अर्पण के रूप में समझें।',
    'Worship',
    ['aarti', 'puja', 'devotion'],
    'Aarti thali with diya flame in front of temple altar, cinematic warm gold light',
    true
  ),
  article(
    'Why We Light Diyas in Puja',
    'पूजा में दीपक क्यों जलाते हैं',
    'why-we-light-diyas-in-puja',
    'Diyas symbolize light, clarity, auspiciousness, and the devotee’s wish to remove inner darkness.',
    'दीपक प्रकाश, स्पष्टता, शुभता और भीतर के अंधकार को दूर करने की भावना का प्रतीक है।',
    'Worship',
    ['diya', 'puja', 'light'],
    'Close-up of brass diya flames with temple background, peaceful devotional realism'
  ),
  article(
    'Difference Between Mandir and Tirth',
    'मंदिर और तीर्थ में अंतर',
    'difference-between-mandir-and-tirth',
    'A clear overview of mandir as a place of worship and tirth as a sacred crossing or pilgrimage place.',
    'मंदिर को पूजा स्थल और तीर्थ को पवित्र यात्रा स्थल के रूप में समझने की सरल व्याख्या।',
    'Temple Guides',
    ['mandir', 'tirth', 'pilgrimage'],
    'Pilgrimage path leading to an ancient temple by a river, realistic sacred travel photography'
  ),
  article(
    'Meaning of Prasad',
    'प्रसाद का अर्थ',
    'meaning-of-prasad',
    'Prasad is received as grace after offering food, fruits, or sweets with devotion.',
    'भक्ति से अर्पित नैवेद्य को कृपा रूप में ग्रहण करना प्रसाद की भावना है।',
    'Worship',
    ['prasad', 'naivedya', 'puja'],
    'Temple prasad in leaf bowl with flowers and diya, clean devotional editorial image'
  ),
  article(
    'Importance of Tulsi in Hindu Homes',
    'हिंदू घरों में तुलसी का महत्व',
    'importance-of-tulsi-in-hindu-homes',
    'Tulsi is honored in many Hindu homes as a symbol of purity, devotion, and sacred household rhythm.',
    'कई हिंदू घरों में तुलसी को शुद्धता, भक्ति और गृहस्थ साधना का प्रतीक माना जाता है।',
    'Home Worship',
    ['Tulsi', 'home worship', 'devotion'],
    'Tulsi plant in traditional courtyard with morning diya, serene Indian home atmosphere'
  ),
  article(
    'Why Monday is Dedicated to Lord Shiva',
    'सोमवार भगवान शिव को क्यों समर्पित है',
    'why-monday-is-dedicated-to-lord-shiva',
    'Explore the devotional association of Monday, Shiva worship, calmness, and simple vrata practice.',
    'सोमवार, शिव पूजा, शांति और सरल व्रत परंपरा का भक्तिपूर्ण संबंध।',
    'Deity Guides',
    ['Shiva', 'Monday', 'vrat'],
    'Shiva lingam with bilva leaves and water offering, cinematic temple light',
    true
  ),
  article(
    'Why Tuesday is Connected with Hanuman Ji',
    'मंगलवार हनुमान जी से क्यों जुड़ा है',
    'why-tuesday-is-connected-with-hanuman-ji',
    'Tuesday is widely observed for Hanuman bhakti, courage, discipline, and protection prayers.',
    'मंगलवार को हनुमान भक्ति, साहस, अनुशासन और रक्षा प्रार्थना से जोड़ा जाता है।',
    'Deity Guides',
    ['Hanuman', 'Tuesday', 'bhakti'],
    'Hanuman temple flag and gada symbol at sunrise, devotional realistic image'
  ),
  article(
    'Ekadashi Vrat Meaning and Benefits',
    'एकादशी व्रत का अर्थ और महत्व',
    'ekadashi-vrat-meaning-and-benefits',
    'A respectful beginner guide to Ekadashi as a day of restraint, remembrance, and Vishnu devotion.',
    'एकादशी को संयम, स्मरण और विष्णु भक्ति के दिन के रूप में समझने की सरल मार्गदर्शिका।',
    'Vrat and Festivals',
    ['Ekadashi', 'Vishnu', 'vrat'],
    'Peaceful Vishnu temple scene with tulsi leaves and diya, no text'
  ),
  article(
    'Navratri: Nine Nights of Shakti',
    'नवरात्रि: शक्ति की नौ रातें',
    'navratri-nine-nights-of-shakti',
    'Navratri honors the divine feminine through worship, discipline, music, fasting, and community devotion.',
    'नवरात्रि में शक्ति की उपासना, संयम, संगीत, व्रत और सामूहिक भक्ति का महत्व।',
    'Festivals',
    ['Navratri', 'Shakti', 'Durga'],
    'Durga puja altar with lamps and flowers, cinematic devotional festival atmosphere',
    true
  ),
  article(
    'Understanding Jyotirlingas',
    'ज्योतिर्लिंगों को समझना',
    'understanding-jyotirlingas',
    'A simple introduction to Jyotirlingas as highly revered Shiva shrines across India.',
    'भारत के पूजनीय शिव तीर्थों के रूप में ज्योतिर्लिंगों की सरल जानकारी।',
    'Sacred Places',
    ['Jyotirlinga', 'Shiva temples', 'pilgrimage'],
    'Ancient Shiva temple shikhara with glowing evening sky, sacred travel editorial image'
  ),
  article(
    'What are Shakti Peethas',
    'शक्ति पीठ क्या हैं',
    'what-are-shakti-peethas',
    'Learn about Shakti Peethas as sacred places associated with Devi worship and regional traditions.',
    'देवी उपासना और क्षेत्रीय परंपराओं से जुड़े शक्ति पीठों की सरल जानकारी।',
    'Sacred Places',
    ['Shakti Peeth', 'Devi', 'pilgrimage'],
    'Devi temple sanctum with red flowers and lamps, respectful cinematic devotional image'
  ),
  article(
    'Role of Mantras in Spiritual Practice',
    'आध्यात्मिक साधना में मंत्रों की भूमिका',
    'role-of-mantras-in-spiritual-practice',
    'Mantras can support attention, devotion, breath rhythm, and a steady daily practice.',
    'मंत्र एकाग्रता, भक्ति, श्वास की लय और नियमित साधना में सहायक हो सकते हैं।',
    'Mantras',
    ['mantra', 'japa', 'meditation'],
    'Japa mala beads beside diya and scripture, calm devotional study setting'
  ),
  article(
    'Why Pilgrimage is Important',
    'तीर्थयात्रा क्यों महत्वपूर्ण है',
    'why-pilgrimage-is-important',
    'Pilgrimage invites humility, effort, remembrance, and a deeper relationship with sacred geography.',
    'तीर्थयात्रा विनम्रता, प्रयास, स्मरण और पवित्र स्थलों से गहरा संबंध बनाती है।',
    'Pilgrimage',
    ['pilgrimage', 'tirth yatra', 'temples'],
    'Devotees walking toward a temple in early morning mist, realistic spiritual travel image'
  ),
  article(
    'Significance of Ganga Jal',
    'गंगाजल का महत्व',
    'significance-of-ganga-jal',
    'Ganga Jal is treated with reverence in many rituals as a symbol of purity and sacred blessing.',
    'कई अनुष्ठानों में गंगाजल को पवित्रता और आशीर्वाद का प्रतीक माना जाता है।',
    'Sacred Traditions',
    ['Ganga Jal', 'purity', 'rituals'],
    'Brass kalash with Ganga water near river ghat and diya, peaceful devotional realism'
  ),
  article(
    'How to Prepare for Temple Visit',
    'मंदिर दर्शन की तैयारी कैसे करें',
    'how-to-prepare-for-temple-visit',
    'A practical guide for dressing respectfully, carrying offerings, and keeping a calm darshan mindset.',
    'सम्मानजनक वस्त्र, अर्पण सामग्री और शांत दर्शन भाव के लिए व्यावहारिक मार्गदर्शिका।',
    'Temple Guides',
    ['temple visit', 'darshan', 'travel tips'],
    'Devotee holding flowers before entering temple gate, premium spiritual travel photography'
  ),
  article(
    'Morning Spiritual Routine for Peace',
    'शांति के लिए सुबह की आध्यात्मिक दिनचर्या',
    'morning-spiritual-routine-for-peace',
    'A gentle morning routine with prayer, mantra, gratitude, and a few quiet minutes before the day begins.',
    'प्रार्थना, मंत्र, कृतज्ञता और शांत समय के साथ सरल सुबह की दिनचर्या।',
    'Daily Practice',
    ['morning routine', 'peace', 'daily practice'],
    'Morning puja corner with diya, flowers, and soft sunlight, serene devotional home image'
  ),
]
