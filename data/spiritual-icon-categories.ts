export type SpiritualIconCategory = {
  name: string
  nameHi: string
  slug: string
  icon: string
  description: string
  descriptionHi: string
  sortOrder: number
  isActive: boolean
}

export const SPIRITUAL_ICON_CATEGORIES: SpiritualIconCategory[] = [
  {
    name: 'Katha Vachak',
    nameHi: 'कथा वाचक',
    slug: 'katha-vachak',
    icon: '🎙️',
    description: 'Narrators of sacred epics, Bhagwat Katha, Ram Katha, and scripture-based pravachan.',
    descriptionHi: 'पवित्र कथाओं, भागवत कथा, राम कथा और शास्त्र आधारित प्रवचन के वाचक।',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Bhajan Gayak',
    nameHi: 'भजन गायक',
    slug: 'bhajan-gayak',
    icon: '🎵',
    description: 'Devotional singers, kirtan artists, and bhajan voices loved by devotees.',
    descriptionHi: 'भजन, कीर्तन और भक्तिमय संगीत से भक्तों को जोड़ने वाले कलाकार।',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Pandit / Purohit',
    nameHi: 'पंडित / पुरोहित',
    slug: 'pandit',
    icon: '📿',
    description: 'Priests, purohits, ritual experts, and Vedic ceremony guides.',
    descriptionHi: 'पूजा, यज्ञ, संस्कार और वैदिक अनुष्ठानों के ज्ञाता।',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Sant / Mahatma',
    nameHi: 'संत / महात्मा',
    slug: 'sant-mahatma',
    icon: '🪔',
    description: 'Saints and spiritual leaders known for seva, satsang, and dharmic guidance.',
    descriptionHi: 'सेवा, सत्संग और धर्म मार्गदर्शन के लिए प्रसिद्ध संत और महात्मा।',
    sortOrder: 4,
    isActive: true,
  },
  {
    name: 'Guru / Acharya',
    nameHi: 'गुरु / आचार्य',
    slug: 'guru-acharya',
    icon: '🕉️',
    description: 'Gurus and acharyas preserving spiritual lineages and teaching sacred knowledge.',
    descriptionHi: 'गुरु परंपरा और शास्त्रीय ज्ञान को आगे बढ़ाने वाले गुरु और आचार्य।',
    sortOrder: 5,
    isActive: true,
  },
  {
    name: 'Jyotishacharya',
    nameHi: 'ज्योतिषाचार्य',
    slug: 'jyotishacharya',
    icon: '🌙',
    description: 'Astrology scholars and practitioners of Jyotish, muhurat, and horoscope guidance.',
    descriptionHi: 'ज्योतिष, मुहूर्त और कुंडली मार्गदर्शन के ज्ञाता।',
    sortOrder: 6,
    isActive: true,
  },
  {
    name: 'Yoga Guru',
    nameHi: 'योग गुरु',
    slug: 'yoga-guru',
    icon: '🧘',
    description: 'Yoga teachers and wellness guides rooted in dharma, pranayama, and inner discipline.',
    descriptionHi: 'योग, प्राणायाम और आध्यात्मिक अनुशासन सिखाने वाले योग गुरु।',
    sortOrder: 7,
    isActive: true,
  },
  {
    name: 'Vedic Scholar',
    nameHi: 'वैदिक विद्वान',
    slug: 'vedic-scholar',
    icon: '📚',
    description: 'Scholars of Vedas, Sanskrit, Vedanta, dharma shastra, and sacred literature.',
    descriptionHi: 'वेद, संस्कृत, वेदांत, धर्मशास्त्र और पवित्र ग्रंथों के विद्वान।',
    sortOrder: 8,
    isActive: true,
  },
  {
    name: 'Kirtan Mandali',
    nameHi: 'कीर्तन मंडली',
    slug: 'kirtan-mandali',
    icon: '🥁',
    description: 'Devotional groups performing kirtan, sankirtan, bhajan sandhya, and satsang music.',
    descriptionHi: 'कीर्तन, संकीर्तन, भजन संध्या और सत्संग संगीत करने वाली मंडलियां।',
    sortOrder: 9,
    isActive: true,
  },
  {
    name: 'Dharma Pracharak',
    nameHi: 'धर्म प्रचारक',
    slug: 'dharma-pracharak',
    icon: '🚩',
    description: 'Speakers and organizers dedicated to spreading Sanatan Dharma values and awareness.',
    descriptionHi: 'सनातन धर्म के मूल्य और जागरूकता फैलाने वाले वक्ता और आयोजक।',
    sortOrder: 10,
    isActive: true,
  },
]

export function getSpiritualIconCategory(slug?: string) {
  return SPIRITUAL_ICON_CATEGORIES.find((category) => category.slug === slug)
}
