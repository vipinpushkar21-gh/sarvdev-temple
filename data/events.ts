/* ─── Hindu Events Data — 2026 & 2027 ─── */

export interface HinduEvent {
  id: string
  slug: string
  title: string
  titleHi: string
  category: 'festival' | 'yatra' | 'cultural' | 'katha' | 'special'
  date: string          // ISO date (start)
  endDate?: string      // ISO date (end, if multi-day)
  month: string         // for quick grouping
  year: number
  location: string
  state: string
  description: string
  significance: string  // spiritual / historical significance
  rituals: string[]     // key rituals performed
  highlights: string[]  // what to look forward to
  image: string
}

export type EventCategory = {
  id: string
  label: string
  labelHi: string
  desc: string
}

export const eventCategories: EventCategory[] = [
  { id: 'all', label: 'All Events', labelHi: 'सभी कार्यक्रम', desc: 'Browse all upcoming Hindu events across India' },
  { id: 'festival', label: 'Festival', labelHi: 'त्योहार', desc: 'Major Hindu festivals celebrated across India' },
  { id: 'yatra', label: 'Yatra / Pilgrimage', labelHi: 'यात्रा', desc: 'Sacred pilgrimages and yatras across holy sites' },
  { id: 'cultural', label: 'Cultural Program', labelHi: 'सांस्कृतिक कार्यक्रम', desc: 'Bhajan Sandhyas, Ram Leelas, and cultural performances' },
  { id: 'katha', label: 'Katha / Pravachan', labelHi: 'कथा / प्रवचन', desc: 'Bhagwat Katha, Ram Katha, and spiritual discourses' },
  { id: 'special', label: 'Special Occasion', labelHi: 'विशेष अवसर', desc: 'Temple anniversaries, Pran Pratishtha, and rare events' },
]

function generateSlug(title: string, date: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const year = date.slice(0, 4)
  return `${base}-${year}`
}

export const hinduEvents: HinduEvent[] = [

  // ════════════════════════════════════════════════
  //  2026 — FESTIVALS
  // ════════════════════════════════════════════════

  {
    id: 'f26-1', slug: generateSlug('Makar Sankranti', '2026-01-14'), title: 'Makar Sankranti', titleHi: 'मकर संक्रांति',
    category: 'festival', date: '2026-01-14', month: 'January', year: 2026,
    location: 'Pan India', state: 'All States',
    description: 'Makar Sankranti marks the transition of the Sun into Capricorn (Makar Rashi). Celebrated as Pongal in Tamil Nadu, Lohri in Punjab, and Uttarayan in Gujarat, it signifies the end of winter solstice and beginning of longer days.',
    significance: 'One of the few Hindu festivals based on the solar calendar. It celebrates the harvest season and the Sun God (Surya Dev). Taking a holy dip in sacred rivers like Ganga is considered highly auspicious.',
    rituals: ['Holy dip in Ganga/sacred rivers', 'Til-Gur distribution', 'Kite flying (Uttarayan)', 'Pongal preparation', 'Surya Puja'],
    highlights: ['Massive kite festival in Ahmedabad & Jaipur', 'Ganga Sagar Mela in West Bengal', 'Pongal celebrations in Tamil Nadu', 'Lohri bonfire in Punjab'],
    image: '',
  },
  {
    id: 'f26-2', slug: generateSlug('Basant Panchami', '2026-02-01'), title: 'Basant Panchami', titleHi: 'बसंत पंचमी',
    category: 'festival', date: '2026-02-01', month: 'February', year: 2026,
    location: 'Pan India', state: 'All States',
    description: 'Basant Panchami celebrates the arrival of spring and is dedicated to Goddess Saraswati, the deity of knowledge, music, and arts. People wear yellow clothes symbolizing the blossoming mustard fields.',
    significance: 'Marks the preparation for Holi (40 days later). Students worship Goddess Saraswati for blessings in education. It is also an auspicious day for weddings and new beginnings.',
    rituals: ['Saraswati Puja', 'Wearing yellow clothes', 'Placing books near Saraswati idol', 'Flying yellow kites', 'Sweet distribution'],
    highlights: ['Grand Saraswati Puja in schools & temples', 'Mustard fields in bloom across North India', 'Cultural programs in West Bengal'],
    image: '',
  },
  {
    id: 'f26-3', slug: generateSlug('Maha Shivratri', '2026-02-15'), title: 'Maha Shivratri', titleHi: 'महा शिवरात्रि',
    category: 'festival', date: '2026-02-15', month: 'February', year: 2026,
    location: 'Pan India (Major: Varanasi, Ujjain, Haridwar)', state: 'All States',
    description: 'Maha Shivratri — the Great Night of Lord Shiva — is one of the most significant Hindu festivals. Devotees fast and perform night-long worship of Shiva Lingam with milk, water, bel leaves, and flowers.',
    significance: 'Celebrated on the darkest night of the month, symbolizing the victory of light over darkness. According to mythology, this is the night when Lord Shiva performed the cosmic dance (Tandava).',
    rituals: ['Night-long Shiva puja', 'Rudrabhishek', 'Fasting (Vrat)', 'Bel Patra offering', 'Chanting Om Namah Shivaya'],
    highlights: ['Grand celebrations at Kashi Vishwanath, Varanasi', 'Mahakaleshwar Ujjain festivity', 'Millions gather at Haridwar & Rishikesh', 'All 12 Jyotirlinga temples special darshan'],
    image: '',
  },
  {
    id: 'f26-4', slug: generateSlug('Holi', '2026-03-03'), title: 'Holi', titleHi: 'होली',
    category: 'festival', date: '2026-03-03', endDate: '2026-03-04', month: 'March', year: 2026,
    location: 'Pan India (Major: Mathura, Vrindavan, Barsana)', state: 'All States',
    description: 'Holi — the Festival of Colors — celebrates the divine love of Radha and Krishna and the triumph of good over evil (Prahlad & Holika). Holika Dahan is celebrated on the eve followed by Dhulandi (playing with colors) the next day.',
    significance: 'Symbolizes the victory of devotion over evil. The burning of Holika represents destruction of ego and negativity. Playing with colors signifies unity, joy, and the arrival of spring.',
    rituals: ['Holika Dahan bonfire', 'Playing with colors (Dhulandi)', 'Thandai & sweets preparation', 'Singing Holi songs (Faag)', 'Community gatherings'],
    highlights: ['Lathmar Holi in Barsana (unique stick-wielding celebration)', 'Widows Holi in Vrindavan', 'Flower Holi at Banke Bihari Temple, Vrindavan', 'Royal Holi in Udaipur'],
    image: '',
  },
  {
    id: 'f26-5', slug: generateSlug('Chaitra Navratri', '2026-03-19'), title: 'Chaitra Navratri & Gudi Padwa', titleHi: 'चैत्र नवरात्रि और गुड़ी पाड़वा',
    category: 'festival', date: '2026-03-19', endDate: '2026-03-28', month: 'March', year: 2026,
    location: 'Pan India', state: 'All States',
    description: 'Chaitra Navratri marks the Hindu New Year and 9 nights of Goddess Durga worship. Gudi Padwa (Maharashtra) and Ugadi (South India) mark the new year. Culminates with Ram Navami on the 9th day.',
    significance: 'Beginning of Hindu New Year (Vikram Samvat). Nine forms of Goddess Durga are worshiped. Devotees observe fasts for spiritual purification and divine blessings.',
    rituals: ['Nine-day fasting', 'Durga Puja daily', 'Kalash Sthapana', 'Kanya Puja', 'Gudi hoisting (Maharashtra)'],
    highlights: ['Grand celebrations at Vaishno Devi', 'Gudi Padwa processions in Maharashtra', 'Ugadi celebrations in South India', 'Ram Navami on the final day'],
    image: '',
  },
  {
    id: 'f26-6', slug: generateSlug('Ram Navami', '2026-03-28'), title: 'Ram Navami', titleHi: 'राम नवमी',
    category: 'festival', date: '2026-03-28', month: 'March', year: 2026,
    location: 'Ayodhya, Pan India', state: 'Uttar Pradesh',
    description: 'Ram Navami celebrates the birth of Lord Rama, the seventh avatar of Vishnu. Grand celebrations take place at the newly built Ram Mandir in Ayodhya with Surya Tilak ceremony.',
    significance: 'Lord Rama is considered the ideal man (Maryada Purushottam). His birth is celebrated as the advent of dharma on earth. Devotees read Ramcharitmanas and perform Ram Katha.',
    rituals: ['Ram Janma celebrations', 'Ramcharitmanas Path', 'Surya Tilak (Ayodhya)', 'Fasting & Puja', 'Processions (Shobha Yatra)'],
    highlights: ['Grand Surya Tilak ceremony at Ram Mandir, Ayodhya', 'Ram Darbar everywhere', 'Processions across North India', 'Special darshan at Rameshwaram'],
    image: '',
  },
  {
    id: 'f26-7', slug: generateSlug('Hanuman Jayanti', '2026-04-06'), title: 'Hanuman Jayanti', titleHi: 'हनुमान जयंती',
    category: 'festival', date: '2026-04-06', month: 'April', year: 2026,
    location: 'Pan India', state: 'All States',
    description: 'Hanuman Jayanti celebrates the birth of Lord Hanuman, the devoted follower of Lord Rama. Temples organize special Sunderkand Path, Hanuman Chalisa recitation, and langars.',
    significance: 'Lord Hanuman symbolizes strength, devotion, and selfless service. His birth is celebrated to seek courage and protection from evil.',
    rituals: ['Hanuman Chalisa recitation', 'Sunderkand Path', 'Offering sindoor & oil', 'Temple visits', 'Langar/Bhandara'],
    highlights: ['Celebrations at Mehandipur Balaji, Rajasthan', 'Hanuman Garhi, Ayodhya', 'Sankat Mochan Temple, Varanasi', 'Langars across India'],
    image: '',
  },
  {
    id: 'f26-8', slug: generateSlug('Akshaya Tritiya', '2026-04-25'), title: 'Akshaya Tritiya', titleHi: 'अक्षय तृतीया',
    category: 'festival', date: '2026-04-25', month: 'April', year: 2026,
    location: 'Pan India', state: 'All States',
    description: 'Akshaya Tritiya is considered one of the most auspicious days in the Hindu calendar. It is believed that any good deed, donation, or investment made on this day yields infinite (akshaya) results.',
    significance: 'The word "Akshaya" means never diminishing. This is the day Treta Yuga began, Lord Parashurama was born, and the Pandavas received Akshaya Patra.',
    rituals: ['Gold & jewelry purchase', 'Charity & donations', 'Lakshmi-Vishnu Puja', 'Starting new ventures', 'Anna Daan (food donation)'],
    highlights: ['Massive gold buying across India', 'Charitable events at major temples', 'New business inaugurations', 'Special pujas at Lakshmi temples'],
    image: '',
  },
  {
    id: 'f26-9', slug: generateSlug('Guru Purnima', '2026-07-01'), title: 'Guru Purnima', titleHi: 'गुरु पूर्णिमा',
    category: 'festival', date: '2026-07-01', month: 'July', year: 2026,
    location: 'Pan India', state: 'All States',
    description: 'Guru Purnima is dedicated to spiritual and academic teachers. It marks the birthday of Ved Vyasa, the author of Mahabharata. Students honor their gurus with puja and offerings.',
    significance: 'Celebrates the importance of the Guru in Hindu tradition. Vyasa Purnima honors the sage who compiled the Vedas and wrote the Mahabharata.',
    rituals: ['Guru Puja & Pada Puja', 'Vyasa Puja', 'Offering to spiritual teachers', 'Meditation sessions', 'Spiritual discourses'],
    highlights: ['Major ashrams hold grand celebrations', 'ISKCON temples special programs', 'Rishikesh & Haridwar spiritual gatherings', 'Online satsangs worldwide'],
    image: '',
  },
  {
    id: 'f26-10', slug: generateSlug('Raksha Bandhan', '2026-08-12'), title: 'Raksha Bandhan', titleHi: 'रक्षा बंधन',
    category: 'festival', date: '2026-08-12', month: 'August', year: 2026,
    location: 'Pan India', state: 'All States',
    description: 'Raksha Bandhan celebrates the sacred bond between brothers and sisters. Sisters tie a protective thread (Rakhi) on brothers\' wrists and receive gifts and blessings in return.',
    significance: 'Symbolizes love, protection, and duty between siblings. Connected to the legend of Draupadi tying a rakhi to Lord Krishna.',
    rituals: ['Tying Rakhi', 'Aarti & tilak on brother\'s forehead', 'Exchange of sweets & gifts', 'Family gatherings', 'Prayers for sibling welfare'],
    highlights: ['Nationwide celebrations', 'Special Rakhi markets', 'Army & paramilitary ceremonies', 'Cross-border Rakhi stories'],
    image: '',
  },
  {
    id: 'f26-11', slug: generateSlug('Janmashtami', '2026-08-22'), title: 'Krishna Janmashtami', titleHi: 'कृष्ण जन्माष्टमी',
    category: 'festival', date: '2026-08-22', month: 'August', year: 2026,
    location: 'Mathura, Vrindavan, Pan India', state: 'Uttar Pradesh',
    description: 'Janmashtami celebrates the birth of Lord Krishna, the eighth avatar of Vishnu. Midnight celebrations mark His divine appearance. Dahi Handi is celebrated the next day.',
    significance: 'Lord Krishna\'s birth at midnight in Mathura prison symbolizes the triumph of dharma. His teachings in Bhagavad Gita remain humanity\'s guiding light.',
    rituals: ['Midnight birth celebration', 'Fasting till midnight', 'Abhishek of baby Krishna', 'Raas Leela performances', 'Dahi Handi (next day)'],
    highlights: ['Grand celebrations at Krishna Janmabhoomi, Mathura', 'Rasa Lila in Vrindavan', 'Dahi Handi in Mumbai & Pune', 'ISKCON temples worldwide celebrations'],
    image: '',
  },
  {
    id: 'f26-12', slug: generateSlug('Ganesh Chaturthi', '2026-08-31'), title: 'Ganesh Chaturthi', titleHi: 'गणेश चतुर्थी',
    category: 'festival', date: '2026-08-31', endDate: '2026-09-10', month: 'August', year: 2026,
    location: 'Pan India (Major: Mumbai, Pune, Hyderabad)', state: 'Maharashtra',
    description: 'Ganesh Chaturthi celebrates the birth of Lord Ganesha, the remover of obstacles. A 10-day festival featuring installation of clay idols, daily aarti, and culminating in grand Visarjan processions.',
    significance: 'Lord Ganesha is worshipped first before any auspicious beginning. Lokmanya Tilak popularized public celebrations as a way to unite communities during the freedom struggle.',
    rituals: ['Ganesh Sthapana (idol installation)', 'Modak offering', 'Daily aarti & puja', '21 Durva grass offering', 'Ganesh Visarjan (immersion)'],
    highlights: ['Lalbaugcha Raja, Mumbai (10 million+ visitors)', 'Dagdusheth Ganpati, Pune', 'Grand Visarjan processions', 'Eco-friendly Ganesha movement growing'],
    image: '',
  },
  {
    id: 'f26-13', slug: generateSlug('Navratri', '2026-10-02'), title: 'Sharad Navratri', titleHi: 'शरद नवरात्रि',
    category: 'festival', date: '2026-10-02', endDate: '2026-10-11', month: 'October', year: 2026,
    location: 'Pan India (Major: Gujarat, West Bengal, Vaishno Devi)', state: 'All States',
    description: 'Sharad Navratri — 9 nights dedicated to Goddess Durga — is the most widely celebrated Navratri. Features Garba/Dandiya in Gujarat, Durga Puja in Bengal, and Ramlila across North India.',
    significance: 'Celebrates the triumph of Goddess Durga over demon Mahishasura. Each night is dedicated to one of the nine forms of Durga (Navdurga). Symbolizes the victory of good over evil.',
    rituals: ['Nine-day fasting', 'Garba & Dandiya', 'Durga Puja pandals', 'Kanya Puja on Ashtami', 'Dussehra on the 10th day'],
    highlights: ['Gujarat Garba celebrations (largest folk dance gathering)', 'Kolkata Durga Puja (UNESCO Heritage)', 'Vaishno Devi pilgrimage surge', 'Ramlila across North India'],
    image: '',
  },
  {
    id: 'f26-14', slug: generateSlug('Dussehra', '2026-10-11'), title: 'Dussehra (Vijayadashami)', titleHi: 'दशहरा (विजयदशमी)',
    category: 'festival', date: '2026-10-11', month: 'October', year: 2026,
    location: 'Pan India (Major: Mysore, Kullu, Delhi)', state: 'All States',
    description: 'Dussehra (Vijayadashami) celebrates Lord Rama\'s victory over Ravana and symbolizes the triumph of good over evil. Massive Ravana effigies are burnt across India.',
    significance: 'Marks the day Lord Rama defeated Ravana in Lanka. Goddess Durga\'s victory over Mahishasura is also celebrated on this day. Represents the victory of dharma.',
    rituals: ['Ravana Dahan (effigy burning)', 'Ram Leela performances', 'Shami Puja', 'Vijaya muhurat for new beginnings', 'Durga idol immersion (Sindur Khela)'],
    highlights: ['Ravana Dahan at Ramlila Ground, Delhi', 'Mysore Dussehra — Royal elephant procession', 'Kullu Dussehra begins (week-long)', 'Bastar Dussehra (75-day tribal festival)'],
    image: '',
  },
  {
    id: 'f26-15', slug: generateSlug('Karva Chauth', '2026-10-24'), title: 'Karva Chauth', titleHi: 'करवा चौथ',
    category: 'festival', date: '2026-10-24', month: 'October', year: 2026,
    location: 'North India', state: 'Rajasthan, Haryana, UP, Punjab',
    description: 'Karva Chauth is a day-long fast observed by married Hindu women for the longevity and prosperity of their husbands. The fast is broken after sighting the moon through a sieve.',
    significance: 'Symbolizes the deep bond of marriage and devotion. Rooted in the story of Queen Veervati and other Puranic tales emphasizing marital fidelity.',
    rituals: ['Sargi (pre-dawn meal)', 'Day-long nirjala fasting', 'Evening Karva Chauth puja', 'Moon sighting through sieve', 'Breaking fast with water from husband'],
    highlights: ['Markets adorned with karvas & mehndi', 'Rooftop moon-watching gatherings', 'Grand celebrations in Rajasthan & Punjab', 'Modern couples celebrate together'],
    image: '',
  },
  {
    id: 'f26-16', slug: generateSlug('Diwali', '2026-10-31'), title: 'Diwali (Deepavali)', titleHi: 'दीवाली (दीपावली)',
    category: 'festival', date: '2026-10-28', endDate: '2026-11-02', month: 'October', year: 2026,
    location: 'Pan India (Major: Ayodhya, Varanasi, Jaipur)', state: 'All States',
    description: 'Diwali — the Festival of Lights — is the biggest Hindu festival. A 5-day celebration: Dhanteras → Choti Diwali → Diwali (Lakshmi Puja) → Govardhan Puja → Bhai Dooj. Millions of diyas illuminate the nation.',
    significance: 'Celebrates Lord Rama\'s return to Ayodhya after 14 years of exile. Symbolizes inner light, prosperity, and new beginnings. Lakshmi Puja invokes wealth and abundance.',
    rituals: ['Dhanteras gold/utensil purchase', 'Lakshmi-Ganesh Puja (main night)', 'Lighting diyas & candles', 'Rangoli decoration', 'Govardhan Puja & Bhai Dooj'],
    highlights: ['12 lakh diyas in Ayodhya (world record)', 'Dev Deepawali in Varanasi (15 days later)', 'Grand fireworks (eco-friendly growing)', 'Jaipur Nahargarh Fort illumination'],
    image: '',
  },
  {
    id: 'f26-17', slug: generateSlug('Chhath Puja', '2026-11-04'), title: 'Chhath Puja', titleHi: 'छठ पूजा',
    category: 'festival', date: '2026-11-03', endDate: '2026-11-06', month: 'November', year: 2026,
    location: 'Bihar, Jharkhand, UP, Delhi', state: 'Bihar',
    description: 'Chhath Puja is a 4-day Vedic festival dedicated to Surya Dev (Sun God) and Chhathi Maiya. Devotees stand in water offering Arghya to the rising and setting sun with incredible devotion.',
    significance: 'One of the oldest Vedic festivals with no idol worship — direct worship of the Sun. Promotes cleanliness, discipline, and deep devotion. Unique for offering prayers to the setting sun.',
    rituals: ['Nahay Khay (Day 1 bath & meal)', 'Kharna (Day 2 — 36-hour fast)', 'Sandhya Arghya (sunset offering)', 'Usha Arghya (sunrise offering)', 'Prasad distribution'],
    highlights: ['Massive gatherings at Bihar ghats', 'Delhi & Mumbai Chhath ghats', 'Patna Ganga ghat celebrations', 'Growing celebrations worldwide'],
    image: '',
  },
  {
    id: 'f26-18', slug: generateSlug('Dev Deepawali', '2026-11-15'), title: 'Dev Deepawali', titleHi: 'देव दीपावली',
    category: 'festival', date: '2026-11-15', month: 'November', year: 2026,
    location: 'Varanasi, Uttar Pradesh', state: 'Uttar Pradesh',
    description: 'Dev Deepawali — the Diwali of the Gods — is celebrated on Kartik Purnima in Varanasi. Over 10 lakh diyas illuminate all 84 ghats of Ganga, creating a breathtaking spectacle.',
    significance: 'According to mythology, gods descend to earth on this day to celebrate Diwali on the ghats of Varanasi. It marks the victory of Lord Shiva over the demon Tripurasura.',
    rituals: ['Lighting lakhs of diyas on ghats', 'Ganga Aarti', 'Holy dip in Ganga', 'Boat rides on illuminated Ganga', 'Cultural performances'],
    highlights: ['84 ghats of Varanasi illuminated', 'Grand Ganga Aarti spectacle', 'Laser shows & cultural programs', 'Tourism highlight of Varanasi'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2026 — YATRA / PILGRIMAGE
  // ════════════════════════════════════════════════

  {
    id: 'y26-1', slug: generateSlug('Char Dham Yatra', '2026-05-01'), title: 'Char Dham Yatra 2026', titleHi: 'चार धाम यात्रा 2026',
    category: 'yatra', date: '2026-05-01', endDate: '2026-10-31', month: 'May', year: 2026,
    location: 'Yamunotri, Gangotri, Kedarnath, Badrinath', state: 'Uttarakhand',
    description: 'The sacred Char Dham Yatra covers four holy temples in Uttarakhand — Yamunotri, Gangotri, Kedarnath, and Badrinath. Portals open in May and close by November, with millions of pilgrims visiting annually.',
    significance: 'Established by Adi Shankaracharya, the Char Dham pilgrimage is considered the most sacred journey in Hinduism. Completing it is believed to grant moksha (liberation).',
    rituals: ['Darshan at all four dhams', 'Holy dip at Gauri Kund & hot springs', 'Badrinath Abhishek', 'Kedarnath Shiva Puja', 'Ganga & Yamuna source darshan'],
    highlights: ['Kedarnath helicopter services', 'Newly expanded roads & infrastructure', 'Online registration system', 'Expected 25 lakh+ pilgrims'],
    image: '',
  },
  {
    id: 'y26-2', slug: generateSlug('Amarnath Yatra', '2026-06-28'), title: 'Amarnath Yatra 2026', titleHi: 'अमरनाथ यात्रा 2026',
    category: 'yatra', date: '2026-06-28', endDate: '2026-08-22', month: 'June', year: 2026,
    location: 'Amarnath Cave, Kashmir', state: 'Jammu & Kashmir',
    description: 'The annual Amarnath Yatra takes pilgrims to the holy cave shrine at 3,888 meters, where a natural ice Shiva Lingam forms. Two routes — Pahalgam (46 km) and Baltal (14 km) — lead to the cave.',
    significance: 'The cave is believed to be where Lord Shiva revealed the secret of immortality (Amar Katha) to Goddess Parvati. The naturally forming ice lingam is considered a divine miracle.',
    rituals: ['Trek to holy cave', 'Darshan of ice Shiva Lingam', 'Prayers & chanting Om Namah Shivaya', 'Holy dip at Sheshnag Lake', 'Puja at Pahalgam/Baltal base camps'],
    highlights: ['Natural ice Shiva Lingam darshan', 'Challenging but spiritual trek', 'Heavy security & medical infrastructure', 'Helicopter services available'],
    image: '',
  },
  {
    id: 'y26-3', slug: generateSlug('Kanwar Yatra', '2026-07-12'), title: 'Kanwar Yatra 2026', titleHi: 'कांवड़ यात्रा 2026',
    category: 'yatra', date: '2026-07-12', endDate: '2026-07-26', month: 'July', year: 2026,
    location: 'Haridwar to various Shiva temples', state: 'Uttarakhand, UP, Rajasthan',
    description: 'Kanwar Yatra is an annual pilgrimage where millions of Shiva devotees (Kanwariyas) carry holy Ganga water from Haridwar, Gaumukh, or Sultanganj to offer at their local Shiva temples.',
    significance: 'Performed during the holy month of Shravan (Sawan), it is one of the largest peaceful gatherings on earth. Devotees walk hundreds of kilometers as an act of devotion to Lord Shiva.',
    rituals: ['Collecting Ganga jal in kanwars', 'Walking barefoot for kilometers', 'Offering Ganga jal on Shiva Lingam', 'Sawan Somvar fasting', 'Bhole Bhandari chanting'],
    highlights: ['Millions of Kanwariyas on roads', 'Special camps & medical aid along routes', 'Haridwar Har ki Pauri gatherings', 'Grand jalabhishek at destination temples'],
    image: '',
  },
  {
    id: 'y26-4', slug: generateSlug('Rath Yatra Puri', '2026-06-21'), title: 'Jagannath Rath Yatra 2026', titleHi: 'जगन्नाथ रथ यात्रा 2026',
    category: 'yatra', date: '2026-06-21', month: 'June', year: 2026,
    location: 'Puri, Odisha', state: 'Odisha',
    description: 'The world-famous Rath Yatra of Lord Jagannath in Puri features three massive chariots carrying the deities from Jagannath Temple to Gundicha Temple. Millions of devotees pull the ropes of the chariots.',
    significance: 'One of the oldest and most significant Hindu processions. The English word "Juggernaut" derives from Jagannath. Lord Jagannath is considered the Lord of the Universe.',
    rituals: ['Chariot pulling by devotees', 'Chhera Pahanra (King sweeps chariot)', 'Darshan of deities on chariots', 'Gundicha Temple stay (9 days)', 'Bahuda Yatra (return journey)'],
    highlights: ['Three massive chariots — Nandighosa, Taladhwaja, Darpadalan', 'Millions gather in Puri', 'Global Rath Yatras by ISKCON', 'Broadcast worldwide'],
    image: '',
  },
  {
    id: 'y26-5', slug: generateSlug('Kailash Mansarovar Yatra', '2026-06-01'), title: 'Kailash Mansarovar Yatra 2026', titleHi: 'कैलाश मानसरोवर यात्रा 2026',
    category: 'yatra', date: '2026-06-01', endDate: '2026-09-30', month: 'June', year: 2026,
    location: 'Kailash Parvat & Mansarovar Lake, Tibet', state: 'Uttarakhand (starting point)',
    description: 'The Kailash Mansarovar Yatra is the holiest pilgrimage for Hindus — circumambulating Mt. Kailash (Lord Shiva\'s abode) and bathing in sacred Lake Mansarovar at 4,590 meters altitude.',
    significance: 'Mount Kailash is considered the abode of Lord Shiva and Goddess Parvati. Lake Mansarovar is believed to be created by Lord Brahma. Parikrama of Kailash grants moksha.',
    rituals: ['Kailash Parikrama (52 km)', 'Holy dip in Mansarovar Lake', 'Puja at Gauri Kund', 'Darshan of Kailash from various points', 'Meditation at sacred spots'],
    highlights: ['Government-organized via MEA', 'Lipulekh & Nathu La routes', 'Limited slots — lottery system', 'Altitude up to 5,636m (Dolma La Pass)'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2026 — CULTURAL PROGRAMS
  // ════════════════════════════════════════════════

  {
    id: 'c26-1', slug: generateSlug('Ram Leela Delhi', '2026-10-02'), title: 'Ram Leela — Delhi & across India', titleHi: 'रामलीला — दिल्ली एवं पूरे भारत',
    category: 'cultural', date: '2026-10-02', endDate: '2026-10-11', month: 'October', year: 2026,
    location: 'Delhi, Varanasi, Ayodhya', state: 'Delhi, UP',
    description: 'Ram Leela — the dramatic enactment of Lord Rama\'s life from birth to victory over Ravana — is performed during the 10 days of Navratri. Delhi\'s Ramlila Ground hosts the most famous performances.',
    significance: 'Ramlila is a UNESCO Intangible Cultural Heritage. It brings alive the Ramcharitmanas through theatre. Performances culminate with Ravana Dahan on Dussehra.',
    rituals: ['10-day dramatic performances', 'Music & dance narration', 'Ravana Dahan on final night', 'Community viewing', 'VIP appearances at Delhi Ramlila'],
    highlights: ['Ramlila Ground, Delhi — largest in India', 'Ramnagar Ramlila, Varanasi (200+ year tradition)', 'Ayodhya Ram Leela at grand scale', 'PM attends Delhi Ravana Dahan'],
    image: '',
  },
  {
    id: 'c26-2', slug: generateSlug('Bhajan Sandhya Vrindavan', '2026-08-22'), title: 'Bhajan Sandhya & Raas Leela — Vrindavan', titleHi: 'भजन संध्या एवं रास लीला — वृंदावन',
    category: 'cultural', date: '2026-08-22', endDate: '2026-08-23', month: 'August', year: 2026,
    location: 'Vrindavan, Mathura', state: 'Uttar Pradesh',
    description: 'During Janmashtami, Vrindavan comes alive with enchanting Bhajan Sandhyas and traditional Raas Leela performances depicting Krishna\'s divine dance with the Gopis.',
    significance: 'Raas Leela is the most sacred of Krishna\'s pastimes — the divine dance of love. Vrindavan\'s Raas Leela tradition dates back centuries and is recognized by UNESCO.',
    rituals: ['Traditional Raas Leela dance-drama', 'All-night Bhajan singing', 'Flower Holi at temples', 'Devotional music concerts', 'Krishna Jhula (swing) ceremony'],
    highlights: ['Banke Bihari Temple celebrations', 'ISKCON Vrindavan grand program', 'Traditional Raas Leela troupes', 'Celebrity singer bhajan concerts'],
    image: '',
  },
  {
    id: 'c26-3', slug: generateSlug('Ganga Aarti Varanasi', '2026-01-01'), title: 'Ganga Aarti — Varanasi (Daily)', titleHi: 'गंगा आरती — वाराणसी (दैनिक)',
    category: 'cultural', date: '2026-01-01', endDate: '2026-12-31', month: 'All Year', year: 2026,
    location: 'Dashashwamedh Ghat, Varanasi', state: 'Uttar Pradesh',
    description: 'The magnificent daily Ganga Aarti at Dashashwamedh Ghat in Varanasi is one of India\'s most spiritual experiences. Priests perform synchronized aarti with large brass lamps as thousands watch from the ghats and boats.',
    significance: 'The Ganga Aarti has been performed for centuries, paying homage to Maa Ganga, Lord Shiva, and the fire element. Varanasi is considered the spiritual capital of India.',
    rituals: ['Synchronized multi-pandit aarti', 'Large brass lamp offerings', 'Conch blowing & bell ringing', 'Flower & diya floating on Ganga', 'Evening prayers & chanting'],
    highlights: ['Daily at 6:45 PM (winter) / 7:00 PM (summer)', 'Thousands gather each evening', 'Best viewed from boats on Ganga', 'Special grand aarti on festival days'],
    image: '',
  },
  {
    id: 'c26-4', slug: generateSlug('Mysore Dasara', '2026-10-02'), title: 'Mysore Dasara 2026', titleHi: 'मैसूर दसरा 2026',
    category: 'cultural', date: '2026-10-02', endDate: '2026-10-11', month: 'October', year: 2026,
    location: 'Mysore, Karnataka', state: 'Karnataka',
    description: 'Mysore Dasara is a 10-day grand celebration and the Nada Habba (state festival) of Karnataka. It features the famous Jamboo Savari — a royal elephant procession carrying the golden howdah from Mysore Palace.',
    significance: 'Celebrates the victory of Goddess Chamundeshwari over demon Mahishasura (from whom Mysore gets its name). The tradition was started by the Wadiyar kings over 400 years ago.',
    rituals: ['Puja at Chamundeshwari Temple', 'Royal Durbar at Mysore Palace', 'Jamboo Savari elephant procession', 'Torchlight parade', 'Cultural performances'],
    highlights: ['Mysore Palace illuminated with 100,000+ bulbs', 'Jamboo Savari — golden howdah on lead elephant', 'Exhibition grounds with 200+ stalls', 'International tourists attraction'],
    image: '',
  },
  {
    id: 'c26-5', slug: generateSlug('Thrissur Pooram', '2026-05-03'), title: 'Thrissur Pooram 2026', titleHi: 'त्रिशूर पूरम 2026',
    category: 'cultural', date: '2026-05-03', month: 'May', year: 2026,
    location: 'Thrissur (Trichur), Kerala', state: 'Kerala',
    description: 'Thrissur Pooram — the "Festival of Festivals" — is Kerala\'s most spectacular temple festival. Features decorated elephants, traditional Panchavadyam orchestra, and the grand Kudamattam (umbrella ceremony).',
    significance: 'Instituted by Sakthan Thampuran of Cochin in the 18th century to unite temples and communities. Two participating temples — Thiruvambadi and Paramekkavu — compete for grandeur.',
    rituals: ['Grand elephant procession (30+ elephants)', 'Panchavadyam (percussion orchestra)', 'Kudamattam (colorful umbrella ceremony)', 'Fireworks display', 'Deity processions'],
    highlights: ['30+ caparisoned elephants in a row', 'Spectacular fireworks competition', 'All-night celebrations', 'Lakhs gather at Thekkinkadu Maidan'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2026 — KATHA / PRAVACHAN
  // ════════════════════════════════════════════════

  {
    id: 'k26-1', slug: generateSlug('Bhagwat Katha Sawan', '2026-07-12'), title: 'Bhagwat Katha — Shravan Month', titleHi: 'भागवत कथा — श्रावण मास',
    category: 'katha', date: '2026-07-12', endDate: '2026-08-10', month: 'July', year: 2026,
    location: 'Vrindavan, Haridwar, Varanasi & other holy cities', state: 'Multiple States',
    description: 'The holy month of Shravan (July-Aug) witnesses hundreds of Bhagwat Katha events across India. Renowned Katha Vachaks narrate Shrimad Bhagwat — the divine story of Lord Krishna — over 7-day (Saptah) sessions.',
    significance: 'Shravan is Lord Shiva\'s favorite month and the most auspicious for spiritual practices. Listening to Bhagwat Katha during this month is believed to wash away sins and grant divine blessings.',
    rituals: ['7-day Bhagwat Katha Saptah', 'Daily pravachan & kirtan', 'Bhagwat aarti', 'Floral decoration of Vyasa Peeth', 'Grand Bhandara (community feast)'],
    highlights: ['Top Katha Vachaks perform across India', 'Morari Bapu, Devkinandan Ji, Jaya Kishori events', 'Live streaming on YouTube & TV', 'Millions attend across multiple cities'],
    image: '',
  },
  {
    id: 'k26-2', slug: generateSlug('Ram Katha Ayodhya', '2026-03-19'), title: 'Ram Katha — Chaitra Navratri', titleHi: 'राम कथा — चैत्र नवरात्रि',
    category: 'katha', date: '2026-03-19', endDate: '2026-03-28', month: 'March', year: 2026,
    location: 'Ayodhya, Uttar Pradesh', state: 'Uttar Pradesh',
    description: 'During Chaitra Navratri leading up to Ram Navami, grand Ram Katha sessions are organized in Ayodhya near the Ram Mandir. Eminent speakers narrate the life of Lord Rama from Ramcharitmanas.',
    significance: 'Chaitra Navratri culminates in Ram Navami — Lord Rama\'s birthday. Ram Katha during this period is especially meritorious. The newly built Ram Mandir adds immense grandeur.',
    rituals: ['9-day Ram Katha narration', 'Ramcharitmanas Path', 'Ram Janma celebrations on Navami', 'Bhajan & kirtan programs', 'Maha Aarti at Ram Mandir'],
    highlights: ['Grand events near Ram Mandir, Ayodhya', 'National-level Katha Vachaks invited', 'Lakhs of devotees attend', 'Special Surya Tilak on Ram Navami'],
    image: '',
  },
  {
    id: 'k26-3', slug: generateSlug('Shiv Mahapuran Katha', '2026-02-15'), title: 'Shiv Mahapuran Katha — Shivratri', titleHi: 'शिव महापुराण कथा — शिवरात्रि',
    category: 'katha', date: '2026-02-08', endDate: '2026-02-15', month: 'February', year: 2026,
    location: 'Varanasi, Ujjain, Haridwar', state: 'Multiple States',
    description: 'In the week leading to Maha Shivratri, grand Shiv Mahapuran Katha sessions are organized in major Shiva cities. The complete story of Lord Shiva — from creation to His divine leelas — is narrated.',
    significance: 'Shiv Mahapuran contains the deepest wisdom about Lord Shiva, the destroyer and transformer. Listening to it near Shivratri grants the blessings of Mahadev Himself.',
    rituals: ['7-day Shiv Mahapuran narration', 'Rudrabhishek before Katha', 'Shiva bhajan & tandav', 'Bhasma aarti (Ujjain)', 'Shivratri night-long program'],
    highlights: ['Pandit Pradeep Mishra\'s grand events', 'Kashi Vishwanath Temple special programs', 'Mahakaleshwar Ujjain celebrations', 'Millions watch online'],
    image: '',
  },
  {
    id: 'k26-4', slug: generateSlug('Sunderkand Path Monthly', '2026-01-01'), title: 'Sunderkand Path — Monthly (Every Tuesday/Saturday)', titleHi: 'सुंदरकांड पाठ — मासिक (प्रत्येक मंगल/शनि)',
    category: 'katha', date: '2026-01-01', endDate: '2026-12-31', month: 'All Year', year: 2026,
    location: 'All Hanuman Temples across India', state: 'All States',
    description: 'Sunderkand — the fifth chapter of Ramcharitmanas — is regularly recited at Hanuman temples across India, especially on Tuesdays and Saturdays. Grand community recitations are a hallmark of Hindu devotion.',
    significance: 'Sunderkand describes Hanuman\'s journey to Lanka to find Sita. It is considered the most powerful chapter of Ramcharitmanas, bringing courage, strength, and removal of obstacles.',
    rituals: ['Community Sunderkand Path', 'Hanuman Chalisa recitation', 'Aarti & Prasad distribution', 'Langar/Bhandara after Path', 'Bhajan singing'],
    highlights: ['Thousands of temples hold weekly Path', 'Jaya Kishori\'s famous Sunderkand events', 'Online live sessions growing', 'Youth participation increasing'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2026 — SPECIAL OCCASIONS
  // ════════════════════════════════════════════════

  {
    id: 's26-1', slug: generateSlug('Maha Kumbh Aftermath', '2026-02-26'), title: 'Maha Kumbh 2025 — Magh Mela Continuation', titleHi: 'महाकुंभ 2025 — माघ मेला निरंतरता',
    category: 'special', date: '2026-02-26', month: 'February', year: 2026,
    location: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh',
    description: 'The grand Maha Kumbh Mela 2025 at Prayagraj continues to resonate. The Magh Mela 2026 continues the tradition at the Triveni Sangam with spiritual gatherings and holy dips throughout the month.',
    significance: 'Triveni Sangam (confluence of Ganga, Yamuna, and Saraswati) is the holiest bathing site. After the grand Kumbh, the yearly Magh Mela continues the tradition.',
    rituals: ['Holy dip at Triveni Sangam', 'Spiritual discourses at camps', 'Akharas\' special programs', 'Charitable activities', 'Cultural performances'],
    highlights: ['Memories of historic Maha Kumbh 2025', 'Ongoing infrastructure improvements', 'Spiritual camps by various organizations', 'Tourism boost for Prayagraj'],
    image: '',
  },
  {
    id: 's26-2', slug: generateSlug('Pran Pratishtha Anniversary Ram Mandir', '2026-01-22'), title: 'Ram Mandir Pran Pratishtha Anniversary', titleHi: 'राम मंदिर प्राण प्रतिष्ठा वर्षगांठ',
    category: 'special', date: '2026-01-22', month: 'January', year: 2026,
    location: 'Ayodhya, Uttar Pradesh', state: 'Uttar Pradesh',
    description: 'The 2nd anniversary of the historic Ram Mandir Pran Pratishtha in Ayodhya (January 22, 2024). Grand celebrations, special Surya Tilak, and nationwide programs mark this milestone.',
    significance: 'The Ram Mandir Pran Pratishtha was a historic moment for Hinduism. The anniversary celebrates the fulfillment of a centuries-old dream and Lord Ram\'s homecoming.',
    rituals: ['Special Surya Tilak ceremony', 'Grand aarti at Ram Lalla\'s sanctum', 'Nationwide Ram Bhajan programs', 'Commemorative events', 'Lighting ceremony'],
    highlights: ['Millions visit Ayodhya', 'National celebrations & TV coverage', 'Special postage stamps/coins', 'PM-attended ceremony'],
    image: '',
  },
  {
    id: 's26-3', slug: generateSlug('Kashi Vishwanath Corridor Events', '2026-01-01'), title: 'Kashi Vishwanath Corridor — Year-round Events', titleHi: 'काशी विश्वनाथ कॉरिडोर — वार्षिक कार्यक्रम',
    category: 'special', date: '2026-01-01', endDate: '2026-12-31', month: 'All Year', year: 2026,
    location: 'Varanasi, Uttar Pradesh', state: 'Uttar Pradesh',
    description: 'The newly built Kashi Vishwanath Corridor hosts year-round spiritual and cultural events. Special pujas, light shows, cultural evenings, and festivals make it a must-visit destination throughout the year.',
    significance: 'Kashi (Varanasi) is the oldest living city in the world and Lord Shiva\'s eternal city. The corridor connects the temple directly to the Ganga ghats, restoring the ancient grandeur.',
    rituals: ['Daily Shiva Puja at main temple', 'Special aarti on Mondays', 'Festival celebrations throughout year', 'Light & sound shows', 'Heritage walks'],
    highlights: ['World-class infrastructure', 'Nandi Darshan from temple corridor', 'Direct Ganga ghat access', 'Annual 10 crore+ visitors'],
    image: '',
  },
  {
    id: 's26-4', slug: generateSlug('Ujjain Mahakaleshwar', '2026-02-15'), title: 'Mahakaleshwar Ujjain — Bhasma Aarti & Shivratri', titleHi: 'महाकालेश्वर उज्जैन — भस्म आरती एवं शिवरात्रि',
    category: 'special', date: '2026-02-15', month: 'February', year: 2026,
    location: 'Ujjain, Madhya Pradesh', state: 'Madhya Pradesh',
    description: 'The famous Bhasma Aarti at Mahakaleshwar Jyotirlinga temple, Ujjain, is a unique pre-dawn ritual. On Maha Shivratri, the celebrations are expanded with special darshan, cultural events, and grand processions.',
    significance: 'Mahakaleshwar is the only Dakshinmukhi (south-facing) Jyotirlinga among the 12. Bhasma Aarti — where the lingam is anointed with sacred ash from cremation grounds — is the rarest ritual in Hinduism.',
    rituals: ['Pre-dawn Bhasma Aarti (4 AM)', 'Jalabhishek on Shivratri', 'Night-long celebrations', 'Grand Baba Mahakal Sawari (procession)', 'Special decorations'],
    highlights: ['Bhasma Aarti — must experience', 'Mahakal Lok — newly built heritage complex', 'Shivratri: lakhs gather', 'Online booking for aarti available'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2027 — FESTIVALS
  // ════════════════════════════════════════════════

  {
    id: 'f27-1', slug: generateSlug('Makar Sankranti 2027', '2027-01-14'), title: 'Makar Sankranti 2027', titleHi: 'मकर संक्रांति 2027',
    category: 'festival', date: '2027-01-14', month: 'January', year: 2027,
    location: 'Pan India', state: 'All States',
    description: 'Makar Sankranti 2027 — the Sun enters Capricorn, marking the harvest festival. Celebrations include kite flying (Uttarayan), Pongal, Lohri, and holy dips across India.',
    significance: 'Transition of the Sun into Makar Rashi. Beginning of auspicious Uttarayan period. Sacred bathing in rivers grants merit.',
    rituals: ['Holy dip in Ganga/sacred rivers', 'Til-Gur distribution', 'Kite flying', 'Pongal preparation', 'Surya Puja'],
    highlights: ['International kite festival in Ahmedabad', 'Ganga Sagar Mela', 'Pongal in Tamil Nadu', 'Lohri celebrations in Punjab'],
    image: '',
  },
  {
    id: 'f27-2', slug: generateSlug('Maha Shivratri 2027', '2027-02-04'), title: 'Maha Shivratri 2027', titleHi: 'महा शिवरात्रि 2027',
    category: 'festival', date: '2027-02-04', month: 'February', year: 2027,
    location: 'Pan India', state: 'All States',
    description: 'Maha Shivratri 2027 — the Great Night of Shiva. Night-long worship at all Shiva temples across India with Rudrabhishek, fasting, and chanting Om Namah Shivaya.',
    significance: 'Lord Shiva\'s cosmic dance night. The darkest night of the month when spiritual energy is at its peak.',
    rituals: ['Night-long Shiva puja', 'Rudrabhishek', 'Fasting', 'Bel Patra offering', 'Om Namah Shivaya chanting'],
    highlights: ['Kashi Vishwanath celebrations', 'Mahakaleshwar Bhasma Aarti', 'All 12 Jyotirlinga temples', 'Haridwar & Rishikesh gatherings'],
    image: '',
  },
  {
    id: 'f27-3', slug: generateSlug('Holi 2027', '2027-03-22'), title: 'Holi 2027', titleHi: 'होली 2027',
    category: 'festival', date: '2027-03-22', endDate: '2027-03-23', month: 'March', year: 2027,
    location: 'Pan India (Major: Mathura, Vrindavan, Barsana)', state: 'All States',
    description: 'Holi 2027 — Festival of Colors. Holika Dahan on the eve followed by playing with colors. Barsana\'s Lathmar Holi and Vrindavan\'s Phoolon ki Holi are world-famous.',
    significance: 'Victory of devotion (Prahlad) over evil (Holika). Celebrates divine love of Radha-Krishna.',
    rituals: ['Holika Dahan', 'Playing with colors', 'Thandai & gujiya', 'Faag singing', 'Community celebrations'],
    highlights: ['Lathmar Holi at Barsana', 'Phoolon ki Holi at Banke Bihari', 'Royal Holi in Udaipur', 'Widows\' Holi in Vrindavan'],
    image: '',
  },
  {
    id: 'f27-4', slug: generateSlug('Ram Navami 2027', '2027-04-16'), title: 'Ram Navami 2027', titleHi: 'राम नवमी 2027',
    category: 'festival', date: '2027-04-16', month: 'April', year: 2027,
    location: 'Ayodhya, Pan India', state: 'Uttar Pradesh',
    description: 'Ram Navami 2027 — Birthday of Lord Rama. Grand Surya Tilak ceremony at Ram Mandir, Ayodhya. Processions, temple celebrations, and Ramcharitmanas Path across India.',
    significance: 'Birth of Maryada Purushottam Lord Rama on the 9th day of Chaitra Navratri.',
    rituals: ['Ram Janma celebrations', 'Surya Tilak ceremony', 'Ramcharitmanas Path', 'Shobha Yatra processions', 'Fasting & Puja'],
    highlights: ['Ram Mandir Ayodhya grand celebrations', 'Surya Tilak on Ram Lalla', 'Nationwide processions', 'Special darshan at Rameshwaram'],
    image: '',
  },
  {
    id: 'f27-5', slug: generateSlug('Janmashtami 2027', '2027-08-11'), title: 'Krishna Janmashtami 2027', titleHi: 'कृष्ण जन्माष्टमी 2027',
    category: 'festival', date: '2027-08-11', month: 'August', year: 2027,
    location: 'Mathura, Vrindavan, Pan India', state: 'Uttar Pradesh',
    description: 'Janmashtami 2027 — Lord Krishna\'s birth at midnight. Spectacular celebrations at Mathura-Vrindavan, Dahi Handi in Mumbai, and ISKCON temples worldwide.',
    significance: 'Lord Krishna\'s divine appearance at midnight in Mathura. His life and teachings in Bhagavad Gita are the foundation of Hindu philosophy.',
    rituals: ['Midnight birth celebration', 'Fasting till midnight', 'Baby Krishna Abhishek', 'Raas Leela', 'Dahi Handi'],
    highlights: ['Krishna Janmabhoomi, Mathura', 'Vrindavan Raas Leela', 'Mumbai Dahi Handi', 'ISKCON worldwide celebrations'],
    image: '',
  },
  {
    id: 'f27-6', slug: generateSlug('Ganesh Chaturthi 2027', '2027-09-20'), title: 'Ganesh Chaturthi 2027', titleHi: 'गणेश चतुर्थी 2027',
    category: 'festival', date: '2027-09-20', endDate: '2027-09-30', month: 'September', year: 2027,
    location: 'Pan India (Major: Mumbai, Pune)', state: 'Maharashtra',
    description: 'Ganesh Chaturthi 2027 — 10-day celebration of Lord Ganesha\'s birth. Grand Ganesh Sthapana, daily aarti, modak offerings, and the spectacular Visarjan procession on the final day.',
    significance: 'Lord Ganesha is the remover of obstacles and worshipped before any new beginning.',
    rituals: ['Ganesh Sthapana', 'Modak offering', 'Daily aarti', '21 Durva offering', 'Grand Visarjan'],
    highlights: ['Lalbaugcha Raja, Mumbai', 'Dagdusheth Ganpati, Pune', 'Grand Visarjan processions', 'Eco-friendly Ganesha trend'],
    image: '',
  },
  {
    id: 'f27-7', slug: generateSlug('Navratri 2027', '2027-10-22'), title: 'Sharad Navratri 2027', titleHi: 'शरद नवरात्रि 2027',
    category: 'festival', date: '2027-10-22', endDate: '2027-10-31', month: 'October', year: 2027,
    location: 'Pan India', state: 'All States',
    description: 'Sharad Navratri 2027 — 9 nights of Goddess Durga worship. Garba in Gujarat, Durga Puja in Bengal, Ramlila across North India, culminating in Dussehra.',
    significance: 'Victory of Goddess Durga over Mahishasura. Nine nights celebrating the nine forms of Goddess Durga.',
    rituals: ['Nine-day fasting', 'Garba & Dandiya', 'Durga Puja pandals', 'Kanya Puja', 'Dussehra Ravana Dahan'],
    highlights: ['Gujarat Garba mega-events', 'Kolkata Durga Puja (UNESCO Heritage)', 'Delhi Ramlila', 'Vaishno Devi pilgrimage'],
    image: '',
  },
  {
    id: 'f27-8', slug: generateSlug('Diwali 2027', '2027-11-18'), title: 'Diwali 2027', titleHi: 'दीवाली 2027',
    category: 'festival', date: '2027-11-16', endDate: '2027-11-21', month: 'November', year: 2027,
    location: 'Pan India', state: 'All States',
    description: 'Diwali 2027 — Festival of Lights. 5-day celebration from Dhanteras to Bhai Dooj. Lakshmi Puja, diyas, rangoli, and the spirit of new beginnings across India.',
    significance: 'Lord Rama\'s return to Ayodhya. Victory of light over darkness, knowledge over ignorance, good over evil.',
    rituals: ['Dhanteras shopping', 'Lakshmi-Ganesh Puja', 'Diya lighting', 'Rangoli decoration', 'Govardhan Puja & Bhai Dooj'],
    highlights: ['Ayodhya diya world record', 'Dev Deepawali in Varanasi (15 days later)', 'Grand fireworks', 'Pan-India celebrations'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2027 — YATRA / PILGRIMAGE
  // ════════════════════════════════════════════════

  {
    id: 'y27-1', slug: generateSlug('Char Dham Yatra 2027', '2027-05-01'), title: 'Char Dham Yatra 2027', titleHi: 'चार धाम यात्रा 2027',
    category: 'yatra', date: '2027-05-01', endDate: '2027-10-31', month: 'May', year: 2027,
    location: 'Yamunotri, Gangotri, Kedarnath, Badrinath', state: 'Uttarakhand',
    description: 'Char Dham Yatra 2027 — Sacred pilgrimage to four holy dhams in Uttarakhand. Portals open May, close November. Improved infrastructure and connectivity expected.',
    significance: 'The most sacred Hindu pilgrimage in the Himalayas, established by Adi Shankaracharya.',
    rituals: ['Darshan at four dhams', 'Holy dips at sacred sites', 'Shiva Puja at Kedarnath', 'Vishnu Puja at Badrinath', 'Source darshan of Ganga & Yamuna'],
    highlights: ['Enhanced helicopter services', 'All-weather road improvements', 'Online registration & booking', 'Expected 30 lakh+ pilgrims'],
    image: '',
  },
  {
    id: 'y27-2', slug: generateSlug('Amarnath Yatra 2027', '2027-06-28'), title: 'Amarnath Yatra 2027', titleHi: 'अमरनाथ यात्रा 2027',
    category: 'yatra', date: '2027-06-28', endDate: '2027-08-22', month: 'June', year: 2027,
    location: 'Amarnath Cave, Kashmir', state: 'Jammu & Kashmir',
    description: 'Amarnath Yatra 2027 — Annual pilgrimage to the holy cave shrine where the natural ice Shiva Lingam forms. Pahalgam and Baltal routes available.',
    significance: 'Where Lord Shiva revealed the secret of immortality to Parvati. The ice lingam is a natural miracle.',
    rituals: ['Trek to holy cave', 'Ice Shiva Lingam darshan', 'Prayers & chanting', 'Holy dip at Sheshnag', 'Base camp pujas'],
    highlights: ['Natural ice lingam darshan', 'Improved security & medical facilities', 'Helicopter services', 'RFID tracking for pilgrims'],
    image: '',
  },
  {
    id: 'y27-3', slug: generateSlug('Rath Yatra Puri 2027', '2027-07-11'), title: 'Jagannath Rath Yatra 2027', titleHi: 'जगन्नाथ रथ यात्रा 2027',
    category: 'yatra', date: '2027-07-11', month: 'July', year: 2027,
    location: 'Puri, Odisha', state: 'Odisha',
    description: 'Jagannath Rath Yatra 2027 — The world-famous chariot festival of Lord Jagannath at Puri. Three giant chariots pulled by devotees through the grand avenue.',
    significance: 'One of the most ancient and important Hindu processions. Lord Jagannath is the Lord of the Universe.',
    rituals: ['Chariot pulling', 'Chhera Pahanra', 'Deity darshan on chariots', 'Gundicha Temple visit', 'Bahuda Yatra'],
    highlights: ['Three massive chariots', 'Millions of devotees', 'ISKCON global celebrations', 'Worldwide broadcasts'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2027 — KATHA / PRAVACHAN
  // ════════════════════════════════════════════════

  {
    id: 'k27-1', slug: generateSlug('Bhagwat Katha Sawan 2027', '2027-07-02'), title: 'Bhagwat Katha — Shravan 2027', titleHi: 'भागवत कथा — श्रावण 2027',
    category: 'katha', date: '2027-07-02', endDate: '2027-07-31', month: 'July', year: 2027,
    location: 'Vrindavan, Haridwar, Varanasi', state: 'Multiple States',
    description: 'Shravan 2027 — Holy month of Shiva sees hundreds of Bhagwat Katha Saptah events across India. Top Katha Vachaks narrate the divine story of Lord Krishna.',
    significance: 'Most auspicious month for spiritual practices. Bhagwat Katha in Shravan is considered supremely meritorious.',
    rituals: ['7-day Bhagwat Katha', 'Daily pravachan & kirtan', 'Bhagwat aarti', 'Vyasa Peeth decoration', 'Grand Bhandara'],
    highlights: ['Major Katha Vachaks across India', 'Live streaming events', 'Millions of attendees', 'Corporate-sponsored mega events'],
    image: '',
  },

  // ════════════════════════════════════════════════
  //  2027 — SPECIAL OCCASIONS
  // ════════════════════════════════════════════════

  {
    id: 's27-1', slug: generateSlug('Ram Mandir Anniversary 2027', '2027-01-22'), title: 'Ram Mandir — 3rd Anniversary', titleHi: 'राम मंदिर — तृतीय वर्षगांठ',
    category: 'special', date: '2027-01-22', month: 'January', year: 2027,
    location: 'Ayodhya, Uttar Pradesh', state: 'Uttar Pradesh',
    description: 'The 3rd anniversary of Ram Mandir Pran Pratishtha (Jan 22, 2024). Grand celebrations at Ayodhya with special aarti, cultural programs, and nationwide commemorations.',
    significance: 'Celebration of the historic Ram Mandir consecration and the ongoing construction milestones.',
    rituals: ['Special Surya Tilak', 'Grand aarti at Ram Mandir', 'Nationwide programs', 'Commemorative events', 'Illumination ceremony'],
    highlights: ['Millions visit Ayodhya', 'National TV coverage', 'New temple construction progress updates', 'Cultural extravaganza'],
    image: '',
  },
  {
    id: 's27-2', slug: generateSlug('Ardh Kumbh Haridwar planning', '2027-01-01'), title: 'Ardh Kumbh Mela 2028 — Preparations', titleHi: 'अर्द्ध कुंभ मेला 2028 — तैयारियां',
    category: 'special', date: '2027-06-01', endDate: '2027-12-31', month: 'June', year: 2027,
    location: 'Haridwar, Uttarakhand', state: 'Uttarakhand',
    description: 'Preparations begin for the Ardh Kumbh Mela scheduled for 2028 at Haridwar. Infrastructure development, tent city planning, and spiritual camp organizing starts mid-2027.',
    significance: 'Ardh Kumbh at Haridwar is held every 6 years. Early preparations ensure smooth conduct of one of the world\'s largest spiritual gatherings.',
    rituals: ['Infrastructure planning', 'Ghat renovation', 'Akhara camp allocation', 'Spiritual leaders\' coordination', 'Volunteer registration'],
    highlights: ['Massive infrastructure development', 'New ghats and facilities', 'Environmental planning', 'International media attention'],
    image: '',
  },
]

/* ─── Helper Functions ─── */

export function getEventBySlug(slug: string): HinduEvent | undefined {
  return hinduEvents.find(e => e.slug === slug)
}

export function getRelatedEvents(event: HinduEvent, limit: number = 3): HinduEvent[] {
  return hinduEvents
    .filter(e => e.id !== event.id && (e.category === event.category || e.year === event.year))
    .sort((a, b) => {
      // Prioritize same category, then sort by date
      const aCat = a.category === event.category ? 0 : 1
      const bCat = b.category === event.category ? 0 : 1
      if (aCat !== bCat) return aCat - bCat
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    .slice(0, limit)
}

export function getUpcomingEvents(fromDate: string = new Date().toISOString().slice(0, 10)): HinduEvent[] {
  return hinduEvents
    .filter(e => e.date >= fromDate || (e.endDate && e.endDate >= fromDate))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getEventsByYear(year: number): HinduEvent[] {
  return hinduEvents.filter(e => e.year === year).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getEventsByCategory(category: string): HinduEvent[] {
  if (category === 'all') return [...hinduEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return hinduEvents.filter(e => e.category === category).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
