export type ShaktiPeethReference = {
  key: string
  name: string
  aliases: string[]
  city: string
  state: string
  country: string
  shaktiName?: string
  bhairavName?: string
  bodyPart?: string
  description?: string
  descriptionHi?: string
  speciality?: string
  templeType: string
  sacredCategories: string[]
  timings?: string
  mapsLink?: string
}

export type ShaktiPeethTempleLike = {
  _id?: unknown
  id?: unknown
  slug?: unknown
  title?: unknown
  name?: unknown
  deity?: unknown
  city?: unknown
  state?: unknown
  country?: unknown
  categories?: unknown
  sacredCategories?: unknown
  templeType?: unknown
  templeTypes?: unknown
  canonicalShaktiPeeth?: unknown
  canonicalShaktiPeethKey?: unknown
  canonicalShaktiPeethName?: unknown
  shaktiPeethMeta?: unknown
}

export const SHAKTI_PEETH_CATEGORY = 'Shakti Peeth (52 Shakti Peethas)'
export const SHAKTI_PEETH_DISPLAY_TITLE = '52 Shakti Peethas'

// Backward-compatible slugs
export const SHAKTI_PEETH_SLUGS = ['shakti-peeth', 'shakti-peethas', '51-shakti-peethas', '52-shakti-peethas']

const C = 'Shakti Peeth (52 Shakti Peethas)'
const T = 'Shakti Peeth'

export const SHAKTI_PEETH_52: ShaktiPeethReference[] = [
  { key: 'hinglaj-mata', name: 'Hinglaj Mata Shakti Peeth', aliases: ['hinglaj', 'hinglaj mata', 'hingula', 'hinglaj shakti peeth', 'nani mandir'], city: 'Hinglaj', state: 'Balochistan', country: 'Pakistan', shaktiName: 'Kottari', bhairavName: 'Bhimalochan', bodyPart: 'Brahmarandhra (top of head)', description: 'One of the most revered Shakti Peethas, Hinglaj Mata temple is situated in the Hingol mountains of Balochistan. Devotees from across the subcontinent undertake the difficult pilgrimage. The Brahmarandhra (crown) of Goddess Sati is believed to have fallen here.', descriptionHi: 'हिंगलाज माता शक्ति पीठ बलोचिस्तान के हिंगोल पर्वत में स्थित सर्वाधिक पूज्य शक्ति पीठों में से एक है। माता सती का ब्रह्मरन्ध्र (सिर का ऊपरी भाग) यहाँ गिरा था।', speciality: 'Brahmarandhra Shakti Peeth — among the most ancient goddess shrines', templeType: T, sacredCategories: [C] },
  { key: 'kamakhya', name: 'Kamakhya Devi Shakti Peeth', aliases: ['kamakhya', 'kamakhya devi', 'kamakhya temple', 'kamakhya shakti peeth'], city: 'Guwahati', state: 'Assam', country: 'India', shaktiName: 'Kamakhya', bhairavName: 'Umanand', bodyPart: 'Yoni (womb)', description: 'Kamakhya temple on Nilachal Hill in Guwahati is the foremost Shakti Peeth where the yoni (womb) of Goddess Sati fell. The annual Ambubachi Mela celebrates the menstruation of the Goddess. No idol is worshipped here; a natural rock fissure symbolizes the Devi.', descriptionHi: 'गुवाहाटी के नीलाचल पर्वत पर स्थित कामाख्या मंदिर सर्वोच्च शक्ति पीठ है जहाँ माता सती का योनि भाग गिरा था। वार्षिक अम्बुबाची मेला देवी के ऋतुकाल का उत्सव है।', speciality: 'Yoni Peeth — foremost Tantric Shakti shrine', templeType: T, sacredCategories: [C], timings: '5:30 AM – 10:00 PM' },
  { key: 'kalighat-dakshina-kali', name: 'Kalighat Kali Shakti Peeth', aliases: ['kalighat', 'kalighat kali', 'dakshina kali kalighat', 'kalighat shakti peeth'], city: 'Kolkata', state: 'West Bengal', country: 'India', shaktiName: 'Dakshina Kali', bhairavName: 'Nakulesh', bodyPart: 'Toes of right foot', description: 'Kalighat Kali Temple in Kolkata is one of the 52 Shakti Peethas where the toes of the right foot of Goddess Sati fell. The city of Calcutta derives its name from Kalighat. The temple is one of the most famous Kali temples in the world.', descriptionHi: 'कोलकाता का कालीघाट काली मंदिर 52 शक्ति पीठों में से एक है जहाँ माता सती के दाहिने पैर की उँगलियाँ गिरी थीं। कलकत्ता शहर का नाम कालीघाट से ही पड़ा।', speciality: 'Toes of right foot — one of the most famous Kali temples in the world', templeType: T, sacredCategories: [C], timings: '5:00 AM – 10:30 PM' },
  { key: 'vishalakshi-varanasi', name: 'Vishalakshi Shakti Peeth', aliases: ['vishalakshi', 'vishalakshi varanasi', 'vishalakshi kashi', 'varanasi shakti peeth'], city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', shaktiName: 'Vishalakshi', bhairavName: 'Kaal Bhairav', bodyPart: 'Earrings / Kundal', description: 'Vishalakshi temple near the Manikarnika Ghat in Varanasi is a revered Shakti Peeth where the earrings (kundal) of Goddess Sati fell. Situated in the spiritual capital Kashi, it is among the most visited goddess shrines.', descriptionHi: 'वाराणसी के मणिकर्णिका घाट के निकट विशालाक्षी मंदिर एक पूज्य शक्ति पीठ है जहाँ माता सती के कुण्डल (कर्णफूल) गिरे थे।', speciality: 'Kundal (earrings) Shakti Peeth in the sacred city of Kashi', templeType: T, sacredCategories: [C] },
  { key: 'srisailam-bhramaramba', name: 'Bhramaramba Shakti Peeth, Srisailam', aliases: ['srisailam', 'sri sailam', 'bhramaramba', 'bhramaramba srisailam', 'srisailam shakti peeth'], city: 'Srisailam', state: 'Andhra Pradesh', country: 'India', shaktiName: 'Bhramaramba', bhairavName: 'Mallikarjuna', bodyPart: 'Neck', description: 'Bhramaramba temple at Srisailam is both a Shakti Peeth and a Jyotirlinga shrine. The neck of Goddess Sati is said to have fallen here. Srisailam is nestled in the Nallamala Hills along the Krishna river.', descriptionHi: 'श्रीशैलम में भ्रमराम्बा मंदिर शक्ति पीठ और ज्योतिर्लिंग दोनों है। माता सती का गला यहाँ गिरा था। श्रीशैलम कृष्णा नदी के किनारे नल्लामला पहाड़ियों में बसा है।', speciality: 'Neck Shakti Peeth — also a Jyotirlinga', templeType: T, sacredCategories: [C] },
  { key: 'jwalamukhi-jwala-ji', name: 'Jwalamukhi Devi Shakti Peeth', aliases: ['jwalamukhi', 'jwala ji', 'jawalamukhi', 'siddhida jwala', 'jwala devi'], city: 'Jwalamukhi', state: 'Himachal Pradesh', country: 'India', shaktiName: 'Siddhida (Ambika)', bhairavName: 'Unmatt Bhairav', bodyPart: 'Tongue', description: 'Jwalamukhi temple in Kangra, Himachal Pradesh is a Shakti Peeth where the tongue of Goddess Sati fell. Eternal natural flames emerge from the rock, worshipped as the Goddess. Emperor Akbar tried to extinguish them but failed.', descriptionHi: 'हिमाचल प्रदेश के कांगड़ा में ज्वालामुखी मंदिर शक्ति पीठ है जहाँ माता सती की जिह्वा गिरी थी। चट्टान से निकलती शाश्वत ज्वालाओं की देवी रूप में पूजा होती है।', speciality: 'Tongue Shakti Peeth — eternal natural flames worshipped as Devi', templeType: T, sacredCategories: [C], timings: '5:00 AM – 9:00 PM' },
  { key: 'prayag-lalita', name: 'Lalita Devi / Alopi Shakti Peeth, Prayagraj', aliases: ['prayag', 'prayagraj shakti peeth', 'lalita prayag', 'alopi devi', 'alopi shakti peeth'], city: 'Prayagraj', state: 'Uttar Pradesh', country: 'India', shaktiName: 'Lalita', bhairavName: 'Bhava', bodyPart: 'Fingers', description: 'Prayagraj has two Shakti Peeth traditions — Lalita Devi and Alopi Devi temples. The fingers of Goddess Sati are believed to have fallen here at the Triveni Sangam, the holy confluence of Ganga, Yamuna, and Saraswati.', descriptionHi: 'प्रयागराज में ललिता देवी और अलोपी देवी मंदिर शक्ति पीठ परम्परा से जुड़े हैं। त्रिवेणी संगम पर माता सती की उँगलियाँ गिरी थीं।', speciality: 'Fingers Shakti Peeth at the holy Triveni Sangam', templeType: T, sacredCategories: [C] },
  { key: 'tripura-sundari', name: 'Tripura Sundari Shakti Peeth', aliases: ['tripura sundari', 'tripura sundari shakti peeth', 'matabari', 'udaipur tripura sundari'], city: 'Udaipur', state: 'Tripura', country: 'India', shaktiName: 'Tripura Sundari', bhairavName: 'Tripuresh', bodyPart: 'Right foot', description: 'Tripura Sundari temple at Matabari near Udaipur, Tripura is one of the 52 Shakti Peethas where the right foot of Goddess Sati fell. It is one of the 51 Pithas mentioned in the Tantra texts and an important Tantric pilgrimage.', descriptionHi: 'त्रिपुरा के उदयपुर निकट माताबाड़ी में त्रिपुरा सुन्दरी मंदिर 52 शक्ति पीठों में से एक है जहाँ माता सती का दाहिना पैर गिरा था।', speciality: 'Right foot Shakti Peeth — important Tantric pilgrimage', templeType: T, sacredCategories: [C] },
  { key: 'amarnath-mahamaya', name: 'Mahamaya Shakti Peeth, Amarnath', aliases: ['amarnath', 'mahamaya amarnath', 'amarnath mahamaya', 'mahamaya shakti peeth amarnath'], city: 'Amarnath', state: 'Jammu & Kashmir', country: 'India', shaktiName: 'Mahamaya', bhairavName: 'Trisandhyeshwar', bodyPart: 'Throat', description: 'The Mahamaya Shakti Peeth at Amarnath in Kashmir is where the throat of Goddess Sati fell. The sacred Amarnath cave housing the naturally formed Shiva Lingam of ice is nearby, making this region doubly sacred.', descriptionHi: 'कश्मीर के अमरनाथ में महामाया शक्ति पीठ है जहाँ माता सती का कण्ठ गिरा था। समीप ही पवित्र अमरनाथ गुफा में हिमलिंग विराजित हैं।', speciality: 'Throat Shakti Peeth — near the sacred Amarnath cave', templeType: T, sacredCategories: [C] },
  { key: 'kanyakumari-sravani', name: 'Kanyakumari / Shravani Shakti Peeth', aliases: ['kanyakumari', 'kanya kumari', 'shri kanya kumari', 'kumari amman', 'sravani kanyakumari', 'kumari amman kanyakumari', 'kanyakumari shakti peeth'], city: 'Kanyakumari', state: 'Tamil Nadu', country: 'India', shaktiName: 'Shravani', bhairavName: 'Nimish', bodyPart: 'Upper back', description: 'The Kumari Amman temple at Kanyakumari, the southernmost tip of India, is a Shakti Peeth where the upper back of Goddess Sati fell. Three oceans meet here — the Bay of Bengal, Arabian Sea, and Indian Ocean.', descriptionHi: 'भारत के दक्षिणतम छोर कन्याकुमारी में कुमारी अम्मन मंदिर शक्ति पीठ है जहाँ माता सती की पीठ का ऊपरी भाग गिरा था।', speciality: 'Upper back Shakti Peeth at the confluence of three oceans', templeType: T, sacredCategories: [C] },
  { key: 'attahas-phullara', name: 'Attahas / Phullara Shakti Peeth', aliases: ['attahas', 'attahas phullara', 'phullara', 'phullara shakti peeth', 'labpur'], city: 'Labpur', state: 'West Bengal', country: 'India', shaktiName: 'Phullara', bhairavName: 'Vishwesh', bodyPart: 'Lower lip', description: 'Attahas or Phullara Shakti Peeth near Labpur in Birbhum, West Bengal is where the lower lip of Goddess Sati fell. The Goddess is worshipped as Phullara Devi here.', descriptionHi: 'पश्चिम बंगाल के बीरभूम जिले में लाभपुर के निकट अट्टहास शक्ति पीठ है जहाँ माता सती का निचला ओष्ठ गिरा था।', speciality: 'Lower lip Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'bahula', name: 'Bahula Shakti Peeth', aliases: ['bahula', 'bahula shakti peeth', 'bahula temple', 'ketugram'], city: 'Ketugram', state: 'West Bengal', country: 'India', shaktiName: 'Bahula', bhairavName: 'Bhiruk', bodyPart: 'Left arm', description: 'Bahula Shakti Peeth at Ketugram in Burdwan, West Bengal is where the left arm of Goddess Sati fell. The Goddess is worshipped as Bahula Devi.', descriptionHi: 'पश्चिम बंगाल के बर्दवान जिले में केतुग्राम में बहुला शक्ति पीठ है जहाँ माता सती का बाँया हाथ गिरा था।', speciality: 'Left arm Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'bakreshwar-mahishmardini', name: 'Bakreshwar / Mahishmardini Shakti Peeth', aliases: ['bakreshwar', 'bakreswar', 'mahishmardini bakreshwar', 'bakreshwar shakti peeth'], city: 'Bakreshwar', state: 'West Bengal', country: 'India', shaktiName: 'Mahishmardini', bhairavName: 'Vakranath', bodyPart: 'Mind / Manas', description: 'Bakreshwar Shakti Peeth in Birbhum, West Bengal is where the mind (manas) of Goddess Sati fell. Hot springs near the temple add to its sacred significance.', descriptionHi: 'पश्चिम बंगाल के बीरभूम में बक्रेश्वर शक्ति पीठ है जहाँ माता सती का मन (मानस) गिरा था। मंदिर के पास गर्म जल के झरने हैं।', speciality: 'Mind (Manas) Shakti Peeth — near hot springs', templeType: T, sacredCategories: [C] },
  { key: 'bhairav-parvat-avanti', name: 'Bhairav Parvat / Avanti Shakti Peeth', aliases: ['bhairav parvat', 'avanti shakti peeth', 'bhairav parvat avanti', 'ujjain shakti peeth'], city: 'Ujjain', state: 'Madhya Pradesh', country: 'India', shaktiName: 'Avanti', bhairavName: 'Lambkarna', bodyPart: 'Upper lip', description: 'Bhairav Parvat near Ujjain in Madhya Pradesh is a Shakti Peeth where the upper lip of Goddess Sati fell. The Goddess is worshipped as Avanti. Ujjain is also home to the Mahakaleshwar Jyotirlinga.', descriptionHi: 'मध्य प्रदेश में उज्जैन के निकट भैरव पर्वत शक्ति पीठ है जहाँ माता सती का ऊपरी ओष्ठ गिरा था। देवी अवन्ती रूप में पूजित हैं।', speciality: 'Upper lip Shakti Peeth near Mahakaleshwar', templeType: T, sacredCategories: [C] },
  { key: 'bhavanipur-aparna', name: 'Bhavanipur / Aparna Shakti Peeth', aliases: ['bhavanipur', 'bhabanipur', 'aparna bhavanipur', 'bhavanipur shakti peeth'], city: 'Bhavanipur', state: 'Rajshahi', country: 'Bangladesh', shaktiName: 'Aparna', bhairavName: 'Bhairav', bodyPart: 'Left ankle', description: 'Bhavanipur Shakti Peeth in Rajshahi, Bangladesh is where the left ankle of Goddess Sati fell. The Goddess is worshipped as Aparna Devi.', descriptionHi: 'बांग्लादेश के राजशाही में भवानीपुर शक्ति पीठ है जहाँ माता सती का बाँया टखना गिरा था। देवी अपर्णा रूप में पूजित हैं।', speciality: 'Left ankle Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'gandaki-chandi', name: 'Gandaki Chandi Shakti Peeth', aliases: ['gandaki chandi', 'gandaki shakti peeth', 'muktinath shakti peeth', 'gandaki'], city: 'Muktinath', state: 'Gandaki', country: 'Nepal', shaktiName: 'Gandaki Chandi', bhairavName: 'Chakrapani', bodyPart: 'Cheek / Ganda', description: 'Gandaki Chandi Shakti Peeth is near the Gandaki river in Nepal, in the Muktinath region. The cheek (ganda) of Goddess Sati is said to have fallen here.', descriptionHi: 'नेपाल में गण्डकी नदी के निकट मुक्तिनाथ क्षेत्र में गण्डकी चण्डी शक्ति पीठ है। माता सती का गण्ड (गाल) यहाँ गिरा था।', speciality: 'Cheek Shakti Peeth near the sacred Gandaki river', templeType: T, sacredCategories: [C] },
  { key: 'janasthan-bhramari', name: 'Saptashrungi / Bhramari Shakti Peeth', aliases: ['janasthan', 'janasthan bhramari', 'bhramari janasthan', 'saptashrungi', 'saptashrungi devi', 'saptashrungi shakti peeth'], city: 'Nashik', state: 'Maharashtra', country: 'India', shaktiName: 'Bhramari', bhairavName: 'Vikritaksha', bodyPart: 'Chin', description: 'Saptashrungi Devi temple near Nashik, Maharashtra is the Janasthan Shakti Peeth where the chin of Goddess Sati fell. The temple sits atop one of seven peaks and is a major pilgrimage in the Deccan.', descriptionHi: 'महाराष्ट्र में नासिक के निकट सप्तश्रृंगी देवी मंदिर जनस्थान शक्ति पीठ है जहाँ माता सती की ठोड़ी गिरी थी। सात शिखरों पर स्थित यह दक्कन का प्रमुख तीर्थ है।', speciality: 'Chin Shakti Peeth atop seven peaks', templeType: T, sacredCategories: [C] },
  { key: 'jayanti-nartiang', name: 'Jayanti / Nartiang Shakti Peeth', aliases: ['jayanti', 'nartiang', 'jayanti nartiang', 'nartiang durga', 'nartiang shakti peeth'], city: 'Nartiang', state: 'Meghalaya', country: 'India', shaktiName: 'Jayanti', bhairavName: 'Kramadishwar', bodyPart: 'Left thigh', description: 'Nartiang Durga temple in Jaintia Hills, Meghalaya is the Jayanti Shakti Peeth where the left thigh of Goddess Sati fell. Located in the northeastern hills, it combines Hindu and Khasi traditions.', descriptionHi: 'मेघालय की जयन्तिया पहाड़ियों में नारतियांग दुर्गा मंदिर जयन्ती शक्ति पीठ है जहाँ माता सती की बाँयी जंघा गिरी थी।', speciality: 'Left thigh Shakti Peeth in the Jaintia Hills', templeType: T, sacredCategories: [C] },
  { key: 'jeshoreshwari', name: 'Jeshoreshwari Shakti Peeth', aliases: ['jeshoreshwari', 'jessoreswari', 'jessore shakti peeth', 'jeshoreshwari kali'], city: 'Ishwaripur', state: 'Khulna', country: 'Bangladesh', shaktiName: 'Jeshoreshwari', bhairavName: 'Chanda', bodyPart: 'Palms and soles', description: 'Jeshoreshwari Shakti Peeth in Ishwaripur, Khulna, Bangladesh is where the palms and soles of Goddess Sati fell. Despite being in Bangladesh, Hindu devotees continue to visit this ancient shrine.', descriptionHi: 'बांग्लादेश के खुलना में ईश्वरीपुर में यशोरेश्वरी शक्ति पीठ है जहाँ माता सती की हथेलियाँ और तलवे गिरे थे।', speciality: 'Palms and soles Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'kalmadhav', name: 'Kalmadhav Shakti Peeth', aliases: ['kalmadhav', 'kalmadhav shakti peeth', 'kal madhav', 'amarkantak'], city: 'Amarkantak', state: 'Madhya Pradesh', country: 'India', shaktiName: 'Kali', bhairavName: 'Asitanag', bodyPart: 'Left buttock', description: 'Kalmadhav Shakti Peeth near Amarkantak in Madhya Pradesh is where the left buttock of Goddess Sati fell. The region is also the origin of the Narmada river.', descriptionHi: 'मध्य प्रदेश में अमरकंटक के निकट कालमाधव शक्ति पीठ है जहाँ माता सती का बाँया नितम्ब गिरा था। यह क्षेत्र नर्मदा नदी का उद्गम भी है।', speciality: 'Left buttock Shakti Peeth near Narmada origin', templeType: T, sacredCategories: [C] },
  { key: 'kankalitala-devgarbha', name: 'Kankalitala / Devgarbha Shakti Peeth', aliases: ['kankalitala', 'kankalitala shakti peeth', 'devgarbha kankalitala'], city: 'Bolpur', state: 'West Bengal', country: 'India', shaktiName: 'Devgarbha', bhairavName: 'Ruru', bodyPart: 'Bone / Kankaal', description: 'Kankalitala Shakti Peeth near Bolpur in Birbhum, West Bengal is where a bone (kankaal) of Goddess Sati fell. The temple is near Shantiniketan, the seat of Rabindranath Tagore.', descriptionHi: 'पश्चिम बंगाल के बीरभूम में बोलपुर के निकट कंकालीतला शक्ति पीठ है जहाँ माता सती की अस्थि (कंकाल) गिरी थी।', speciality: 'Bone (Kankaal) Shakti Peeth near Shantiniketan', templeType: T, sacredCategories: [C] },
  { key: 'chamundeshwari-chamundi-hills', name: 'Chamundeshwari Shakti Peeth, Mysuru', aliases: ['chamundeshwari', 'chamundi hills', 'chamundi hill', 'chamundeshwari shakti peeth', 'mysore chamundi'], city: 'Mysuru', state: 'Karnataka', country: 'India', shaktiName: 'Chamundeshwari', bhairavName: 'Mundiswara', bodyPart: 'Hair', description: 'Chamundeshwari temple atop Chamundi Hills in Mysuru, Karnataka is a Shakti Peeth where the hair of Goddess Sati fell. The Goddess killed the demon Mahishasura here. The Mysuru Dasara festival is centered around this temple.', descriptionHi: 'कर्नाटक के मैसूरु में चामुण्डी पहाड़ी पर चामुण्डेश्वरी मंदिर शक्ति पीठ है जहाँ माता सती के केश गिरे थे। यहाँ देवी ने महिषासुर का वध किया था।', speciality: 'Hair Shakti Peeth — Dasara festival center', templeType: T, sacredCategories: [C] },
  { key: 'kiriteswari-vimala', name: 'Kiriteswari Shakti Peeth', aliases: ['kiriteswari', 'kiritkona', 'kiriteswari shakti peeth', 'vimala kiriteswari', 'lalbag'], city: 'Lalbag', state: 'West Bengal', country: 'India', shaktiName: 'Vimala', bhairavName: 'Samvarta', bodyPart: 'Crown / Kirita', description: 'Kiriteswari Shakti Peeth at Lalbag in Murshidabad, West Bengal is where the crown (kirita) of Goddess Sati fell. The Goddess is worshipped as Vimala Devi.', descriptionHi: 'पश्चिम बंगाल के मुर्शिदाबाद में लालबाग में कीरीटेश्वरी शक्ति पीठ है जहाँ माता सती का मुकुट (कीरीट) गिरा था।', speciality: 'Crown (Kirita) Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'anandamayee-kumari', name: 'Anandamayee Shakti Peeth', aliases: ['anandamayee', 'anandamayi', 'anandamayee shakti peeth', 'kumari anandamayee'], city: 'Hajipur', state: 'West Bengal', country: 'India', shaktiName: 'Kumari (Anandamayee)', bodyPart: 'Right shoulder', description: 'Anandamayee Shakti Peeth is situated in the Hajipur area of Hooghly district, West Bengal, where the right shoulder of Goddess Sati fell.', descriptionHi: 'पश्चिम बंगाल के हुगली जिले में अनन्दमयी शक्ति पीठ है जहाँ माता सती का दाहिना कन्धा गिरा था।', speciality: 'Right shoulder Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'bhramari-bodaganj', name: 'Bhramari Shakti Peeth, Bodaganj', aliases: ['bodaganj', 'bhramari bodaganj', 'bodaganj shakti peeth', 'jalpaiguri bhramari'], city: 'Jalpaiguri', state: 'West Bengal', country: 'India', shaktiName: 'Bhramari', bhairavName: 'Ambar', bodyPart: 'Left foot', description: 'Bhramari Shakti Peeth at Bodaganj near Jalpaiguri in West Bengal is where the left foot of Goddess Sati fell. The Goddess is worshipped as Bhramari (the bee goddess).', descriptionHi: 'पश्चिम बंगाल में जलपाईगुड़ी के निकट बोदागंज में भ्रामरी शक्ति पीठ है जहाँ माता सती का बाँया पैर गिरा था।', speciality: 'Left foot Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'manasarovar-dakshayani', name: 'Manasarovar / Dakshayani Shakti Peeth', aliases: ['manasarovar', 'mansarovar', 'dakshayani manasarovar', 'manasarovar shakti peeth'], city: 'Manasarovar', state: 'Tibet', country: 'China', shaktiName: 'Dakshayani', bhairavName: 'Amar', bodyPart: 'Right hand', description: 'Manasarovar Shakti Peeth at Lake Manasarovar in Tibet is where the right hand of Goddess Sati fell. The sacred lake lies at the foot of Mount Kailash, the abode of Lord Shiva.', descriptionHi: 'तिब्बत में मानसरोवर झील पर शक्ति पीठ है जहाँ माता सती का दाहिना हाथ गिरा था। पवित्र झील कैलाश पर्वत — शिव के निवास — के चरणों में है।', speciality: 'Right hand Shakti Peeth at the foot of Mount Kailash', templeType: T, sacredCategories: [C] },
  { key: 'manibandh-gayatri-pushkar', name: 'Gayatri Shakti Peeth, Pushkar', aliases: ['manibandh', 'mani bandh', 'gayatri pushkar', 'pushkar gayatri', 'manibandh shakti peeth'], city: 'Pushkar', state: 'Rajasthan', country: 'India', shaktiName: 'Gayatri', bhairavName: 'Sarvanand', bodyPart: 'Wrist / Manibandh', description: 'The Gayatri Shakti Peeth at Pushkar, Rajasthan is where the wrist (manibandh) of Goddess Sati fell. Pushkar is also home to the only Brahma temple in India and the sacred Pushkar Lake.', descriptionHi: 'राजस्थान के पुष्कर में गायत्री शक्ति पीठ है जहाँ माता सती की कलाई (मणिबंध) गिरी थी। पुष्कर में भारत का एकमात्र ब्रह्मा मंदिर भी है।', speciality: 'Wrist Shakti Peeth at sacred Pushkar Lake', templeType: T, sacredCategories: [C] },
  { key: 'mithila-uma', name: 'Mithila / Uma Shakti Peeth', aliases: ['mithila', 'mithila shakti peeth', 'uma mithila', 'janakpur'], city: 'Janakpur', state: 'Province 2', country: 'Nepal', shaktiName: 'Uma', bhairavName: 'Mahodar', bodyPart: 'Left shoulder', description: 'Mithila Shakti Peeth is in the Janakpur region (historically Mithila) on the India-Nepal border, where the left shoulder of Goddess Sati fell. Janakpur is the birthplace of Goddess Sita.', descriptionHi: 'भारत-नेपाल सीमा पर जनकपुर (ऐतिहासिक मिथिला) क्षेत्र में मिथिला शक्ति पीठ है जहाँ माता सती का बाँया कन्धा गिरा था।', speciality: 'Left shoulder Shakti Peeth — birthplace of Sita', templeType: T, sacredCategories: [C] },
  { key: 'nainativu-nagapooshani', name: 'Nagapooshani Shakti Peeth, Nainativu', aliases: ['nainativu', 'nagapooshani', 'naga pooshani', 'nainativu nagapooshani'], city: 'Nainativu', state: 'Northern Province', country: 'Sri Lanka', shaktiName: 'Nagapooshani (Indrakshi)', bhairavName: 'Rakshaseshwar', bodyPart: 'Anklet / Nupur', description: 'Nagapooshani Amman temple on Nainativu island in Sri Lanka is a Shakti Peeth where the anklet (nupur) of Goddess Sati fell. The temple can only be reached by boat from Jaffna.', descriptionHi: 'श्रीलंका में नैनातिवु द्वीप पर नागपूषणी अम्मन मंदिर शक्ति पीठ है जहाँ माता सती का नूपुर (पायल) गिरा था।', speciality: 'Anklet Shakti Peeth on an island — reachable by boat only', templeType: T, sacredCategories: [C] },
  { key: 'guhyeshwari-mahashira', name: 'Guhyeshwari Shakti Peeth, Kathmandu', aliases: ['guhyeshwari', 'guheswari', 'mahashira guhyeshwari', 'guhyeshwari shakti peeth'], city: 'Kathmandu', state: 'Bagmati', country: 'Nepal', shaktiName: 'Mahashira (Mahakali)', bhairavName: 'Kapali', bodyPart: 'Both knees', description: 'Guhyeshwari temple near Pashupatinath in Kathmandu, Nepal is a Shakti Peeth where both knees of Goddess Sati fell. It is an important Tantric shrine and entry is restricted to Hindus only.', descriptionHi: 'नेपाल के काठमांडू में पशुपतिनाथ के निकट गुह्येश्वरी मंदिर शक्ति पीठ है जहाँ माता सती के दोनों घुटने गिरे थे।', speciality: 'Both knees Shakti Peeth near Pashupatinath', templeType: T, sacredCategories: [C] },
  { key: 'chandranath-bhavani', name: 'Chandranath / Bhavani Shakti Peeth', aliases: ['chandranath', 'chandranath bhavani', 'bhavani chandranath', 'chandranath shakti peeth', 'sitakunda'], city: 'Sitakunda', state: 'Chittagong', country: 'Bangladesh', shaktiName: 'Bhavani', bhairavName: 'Chandrashekar', bodyPart: 'Right arm', description: 'Chandranath temple at Sitakunda hill near Chittagong, Bangladesh is a Shakti Peeth where the right arm of Goddess Sati fell. It is one of the most visited Hindu temples in Bangladesh.', descriptionHi: 'बांग्लादेश में चट्टग्राम के निकट सीताकुण्ड पहाड़ी पर चन्द्रनाथ मंदिर शक्ति पीठ है जहाँ माता सती का दाहिना हाथ गिरा था।', speciality: 'Right arm Shakti Peeth — most visited Hindu temple in Bangladesh', templeType: T, sacredCategories: [C] },
  { key: 'panch-sagar-varahi', name: 'Panch Sagar / Varahi Shakti Peeth', aliases: ['panch sagar', 'panchsagar', 'varahi panch sagar', 'panch sagar shakti peeth'], city: 'Panchsagar', state: 'Uttar Pradesh', country: 'India', shaktiName: 'Varahi', bodyPart: 'Lower teeth', description: 'Panch Sagar Shakti Peeth in Uttar Pradesh is where the lower teeth of Goddess Sati fell. The Goddess is worshipped as Varahi Devi.', descriptionHi: 'उत्तर प्रदेश में पंचसागर शक्ति पीठ है जहाँ माता सती के निचले दाँत गिरे थे। देवी वाराही रूप में पूजित हैं।', speciality: 'Lower teeth Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'chandrabhaga', name: 'Chandrabhaga Shakti Peeth', aliases: ['chandrabhaga', 'chandrabhaga shakti peeth', 'chandra bhaga', 'junagadh'], city: 'Junagadh', state: 'Gujarat', country: 'India', shaktiName: 'Chandrabhaga', bodyPart: 'Stomach', description: 'Chandrabhaga Shakti Peeth near Junagadh, Gujarat is where the stomach of Goddess Sati fell. The region is also home to the Girnar mountain and Somnath Jyotirlinga.', descriptionHi: 'गुजरात में जूनागढ़ के निकट चंद्रभागा शक्ति पीठ है जहाँ माता सती का उदर गिरा था।', speciality: 'Stomach Shakti Peeth near Girnar', templeType: T, sacredCategories: [C] },
  { key: 'kurukshetra-savitri-bhadrakali', name: 'Bhadrakali / Savitri Shakti Peeth, Kurukshetra', aliases: ['kurukshetra', 'bhadrakali kurukshetra', 'savitri kurukshetra', 'bhadrakali shakti peeth kurukshetra'], city: 'Kurukshetra', state: 'Haryana', country: 'India', shaktiName: 'Savitri', bhairavName: 'Sthanu', bodyPart: 'Ankle bone', description: 'Bhadrakali temple at Kurukshetra, Haryana is a Shakti Peeth where the ankle bone of Goddess Sati fell. Kurukshetra is the sacred battlefield of the Mahabharata.', descriptionHi: 'हरियाणा के कुरुक्षेत्र में भद्रकाली मंदिर शक्ति पीठ है जहाँ माता सती की टखने की हड्डी गिरी थी। कुरुक्षेत्र महाभारत का पवित्र युद्धस्थल है।', speciality: 'Ankle bone Shakti Peeth on the Mahabharata battlefield', templeType: T, sacredCategories: [C] },
  { key: 'maihar-shivani', name: 'Maihar / Shivani Shakti Peeth', aliases: ['maihar', 'sharda maihar', 'shivani maihar', 'maihar shakti peeth', 'sharda devi'], city: 'Maihar', state: 'Madhya Pradesh', country: 'India', shaktiName: 'Shivani (Sharda)', bhairavName: 'Chanda', bodyPart: 'Necklace', description: 'Maihar Devi temple in Satna, Madhya Pradesh is a Shakti Peeth where the necklace of Goddess Sati fell. The temple sits atop a hill reached by climbing 1,063 steps. The legendary musicians Alha and Udal were devotees of Sharda Devi.', descriptionHi: 'मध्य प्रदेश के सतना में मैहर देवी मंदिर शक्ति पीठ है जहाँ माता सती का हार गिरा था। 1,063 सीढ़ियाँ चढ़कर पहाड़ी पर पहुँचा जाता है।', speciality: 'Necklace Shakti Peeth — 1,063 steps to the summit', templeType: T, sacredCategories: [C] },
  { key: 'nandikeshwari-nandini', name: 'Nandikeshwari Shakti Peeth', aliases: ['nandikeshwari', 'nandini nandikeshwari', 'nandikeshwari shakti peeth', 'sainthia nandikeshwari'], city: 'Sainthia', state: 'West Bengal', country: 'India', shaktiName: 'Nandini', bhairavName: 'Nandikeshwar', bodyPart: 'Bone of throat / Necklace bone', description: 'Nandikeshwari Shakti Peeth at Sainthia in Birbhum, West Bengal is where the throat bone (necklace bone) of Goddess Sati fell. The Goddess is worshipped as Nandini.', descriptionHi: 'पश्चिम बंगाल के बीरभूम में सैंथिया में नन्दिकेश्वरी शक्ति पीठ है जहाँ माता सती की कण्ठ अस्थि गिरी थी।', speciality: 'Throat bone Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'sarvashail-rakini-godavari', name: 'Sarvashail / Rakini Shakti Peeth', aliases: ['sarvashail', 'sarvashaila', 'rakini godavari', 'godavari shakti peeth', 'rajamahendravaram'], city: 'Rajamahendravaram', state: 'Andhra Pradesh', country: 'India', shaktiName: 'Rakini (Vishweshwari)', bhairavName: 'Vatsnabh', bodyPart: 'Cheeks / Ganda', description: 'Sarvashail Shakti Peeth at Rajamahendravaram (Rajahmundry) on the banks of the Godavari river is where the cheeks of Goddess Sati fell.', descriptionHi: 'आन्ध्र प्रदेश में गोदावरी नदी तट पर राजमहेन्द्रवरम (राजमुंद्री) में सर्वशैल शक्ति पीठ है जहाँ माता सती के गाल गिरे थे।', speciality: 'Cheeks Shakti Peeth on the Godavari river', templeType: T, sacredCategories: [C] },
  { key: 'shivaharkaray-mahishasuramardini', name: 'Shivaharkaray / Mahishasuramardini Shakti Peeth', aliases: ['shivaharkaray', 'shivaharkarai', 'mahishasuramardini shivaharkaray', 'shivaharkaray shakti peeth'], city: 'Shivaharkaray', state: 'Sindh', country: 'Pakistan', shaktiName: 'Mahishasuramardini', bhairavName: 'Krodhish', bodyPart: 'Head / Shir', description: 'Shivaharkaray Shakti Peeth in Sindh, Pakistan is where the head (shir) of Goddess Sati fell. The Goddess is worshipped as Mahishasuramardini.', descriptionHi: 'पाकिस्तान के सिन्ध में शिवहरकराय शक्ति पीठ है जहाँ माता सती का शीश गिरा था। देवी महिषासुरमर्दिनी रूप में पूजित हैं।', speciality: 'Head (Shir) Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'shondesh-narmada', name: 'Shondesh / Narmada Shakti Peeth', aliases: ['shondesh', 'sondesh', 'narmada shakti peeth', 'shondesh narmada', 'amarkantak narmada'], city: 'Shondesh', state: 'Madhya Pradesh', country: 'India', shaktiName: 'Narmada', bhairavName: 'Bhadrasen', bodyPart: 'Right buttock', description: 'Shondesh Shakti Peeth in Madhya Pradesh is where the right buttock of Goddess Sati fell. The Goddess is worshipped as Narmada Devi near the Narmada river.', descriptionHi: 'मध्य प्रदेश में शोणदेश शक्ति पीठ है जहाँ माता सती का दाहिना नितम्ब गिरा था। देवी नर्मदा रूप में पूजित हैं।', speciality: 'Right buttock Shakti Peeth near Narmada river', templeType: T, sacredCategories: [C] },
  { key: 'sri-shail-maha-lakshmi', name: 'Sri Shail / Maha Lakshmi Shakti Peeth', aliases: ['sri shail', 'sri shail mahalakshmi', 'maha lakshmi sri shail', 'sri shail shakti peeth'], city: 'Sri Shail', state: 'Sylhet', country: 'Bangladesh', shaktiName: 'Maha Lakshmi', bhairavName: 'Sambar', bodyPart: 'Neck', description: 'Sri Shail Shakti Peeth in the Sylhet region of Bangladesh is where the neck of Goddess Sati fell. The Goddess is worshipped as Maha Lakshmi.', descriptionHi: 'बांग्लादेश के सिलहट क्षेत्र में श्री शैल शक्ति पीठ है जहाँ माता सती का गला गिरा था। देवी महालक्ष्मी रूप में पूजित हैं।', speciality: 'Neck Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'suchindram-narayani', name: 'Suchindram / Narayani Shakti Peeth', aliases: ['suchindram', 'suchindram narayani', 'narayani suchindram', 'suchindram shakti peeth'], city: 'Suchindram', state: 'Tamil Nadu', country: 'India', shaktiName: 'Narayani', bhairavName: 'Sanhar', bodyPart: 'Upper teeth', description: 'Suchindram Shakti Peeth in Kanyakumari district, Tamil Nadu is where the upper teeth of Goddess Sati fell. The Sthanumalayan temple here is dedicated to Brahma, Vishnu, and Shiva.', descriptionHi: 'तमिलनाडु के कन्याकुमारी जिले में सुचीन्द्रम शक्ति पीठ है जहाँ माता सती के ऊपरी दाँत गिरे थे।', speciality: 'Upper teeth Shakti Peeth — Sthanumalayan Trimurthi temple', templeType: T, sacredCategories: [C] },
  { key: 'sugandha-sunanda', name: 'Sugandha / Sunanda Shakti Peeth', aliases: ['sugandha', 'sunanda sugandha', 'sugandha shakti peeth', 'shikarpur sugandha'], city: 'Shikarpur', state: 'Barisal', country: 'Bangladesh', shaktiName: 'Sunanda', bhairavName: 'Tryambak', bodyPart: 'Nose', description: 'Sugandha Shakti Peeth at Shikarpur in Barisal, Bangladesh is where the nose of Goddess Sati fell. The Goddess is worshipped as Sunanda (the fragrant one).', descriptionHi: 'बांग्लादेश के बरिसाल में शिकारपुर में सुगन्धा शक्ति पीठ है जहाँ माता सती की नासिका गिरी थी। देवी सुनन्दा रूप में पूजित हैं।', speciality: 'Nose Shakti Peeth — Goddess of fragrance', templeType: T, sacredCategories: [C] },
  { key: 'ujaani-mangal-chandi', name: 'Ujaani / Mangal Chandi Shakti Peeth', aliases: ['ujaani', 'ujani', 'mangal chandi ujaani', 'ujaani shakti peeth', 'guskara'], city: 'Guskara', state: 'West Bengal', country: 'India', shaktiName: 'Mangal Chandi', bhairavName: 'Kapilambar', bodyPart: 'Right wrist', description: 'Ujaani Shakti Peeth near Guskara in Burdwan, West Bengal is where the right wrist of Goddess Sati fell. The Goddess is worshipped as Mangal Chandi.', descriptionHi: 'पश्चिम बंगाल के बर्दवान में गुस्करा के निकट उजानी शक्ति पीठ है जहाँ माता सती की दाहिनी कलाई गिरी थी।', speciality: 'Right wrist Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'vibhash-kapalini', name: 'Vibhash / Kapalini Shakti Peeth (Bargabhima)', aliases: ['vibhash', 'vibhasa', 'kapalini vibhash', 'tamluk shakti peeth', 'bargabhima'], city: 'Tamluk', state: 'West Bengal', country: 'India', shaktiName: 'Kapalini (Bargabhima)', bhairavName: 'Sarvanand', bodyPart: 'Left ankle', description: 'Bargabhima temple at Tamluk in Purba Medinipur, West Bengal is the Vibhash Shakti Peeth where the left ankle of Goddess Sati fell. The Goddess is known as Kapalini or Bargabhima.', descriptionHi: 'पश्चिम बंगाल के पूर्व मेदिनीपुर में तमलुक में बर्गभीमा मंदिर विभाष शक्ति पीठ है जहाँ माता सती का बाँया टखना गिरा था।', speciality: 'Left ankle Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'bharatpur-ambika', name: 'Bharatpur / Ambika Shakti Peeth', aliases: ['bharatpur ambika', 'ambika bharatpur', 'bharatpur shakti peeth'], city: 'Bharatpur', state: 'Rajasthan', country: 'India', shaktiName: 'Ambika', bodyPart: 'Right foot toes', description: 'Bharatpur Shakti Peeth in Rajasthan is where the toes of the right foot of Goddess Sati fell. The Goddess is worshipped as Ambika.', descriptionHi: 'राजस्थान में भरतपुर शक्ति पीठ है जहाँ माता सती के दाहिने पैर की उँगलियाँ गिरी थीं। देवी अम्बिका रूप में पूजित हैं।', speciality: 'Right foot toes Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'vrindavan-uma-bhuteshwar', name: 'Vrindavan / Uma Shakti Peeth', aliases: ['vrindavan shakti peeth', 'bhuteshwar vrindavan', 'uma vrindavan', 'bhuteshwar shakti peeth'], city: 'Vrindavan', state: 'Uttar Pradesh', country: 'India', shaktiName: 'Uma', bhairavName: 'Bhutesh', bodyPart: 'Hair tuft / Chudamani', description: 'Vrindavan Shakti Peeth in Mathura, Uttar Pradesh is where the hair tuft (chudamani) of Goddess Sati fell. Vrindavan is the sacred land of Lord Krishna.', descriptionHi: 'उत्तर प्रदेश के मथुरा में वृन्दावन शक्ति पीठ है जहाँ माता सती की चूड़ामणि (शिखा) गिरी थी। वृन्दावन श्री कृष्ण की पावन भूमि है।', speciality: 'Hair tuft Shakti Peeth in the holy land of Krishna', templeType: T, sacredCategories: [C] },
  { key: 'ratnavali-kumari', name: 'Ratnavali / Kumari Shakti Peeth', aliases: ['ratnavali', 'ratnavali shakti peeth', 'kumari ratnavali', 'khanakul krishnanagar'], city: 'Khanakul', state: 'West Bengal', country: 'India', shaktiName: 'Kumari (Ratnavali)', bodyPart: 'Right shoulder', description: 'Ratnavali Shakti Peeth at Khanakul in Hooghly, West Bengal is where the right shoulder of Goddess Sati fell. The Goddess is worshipped as Kumari.', descriptionHi: 'पश्चिम बंगाल के हुगली में खानाकुल में रत्नावली शक्ति पीठ है जहाँ माता सती का दाहिना कन्धा गिरा था।', speciality: 'Right shoulder Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'trisrota-bhramari', name: 'Trisrota / Bhramari Shakti Peeth', aliases: ['trisrota', 'tristrota', 'bhramari trisrota', 'trisrota shakti peeth', 'jalpaiguri trisrota'], city: 'Jalpaiguri', state: 'West Bengal', country: 'India', shaktiName: 'Bhramari', bhairavName: 'Ishwar', bodyPart: 'Left foot', description: 'Trisrota Shakti Peeth at the confluence of three rivers near Jalpaiguri, West Bengal is where the left foot of Goddess Sati fell.', descriptionHi: 'पश्चिम बंगाल में जलपाईगुड़ी के निकट तीन नदियों के संगम पर त्रिस्रोता शक्ति पीठ है जहाँ माता सती का बाँया पैर गिरा था।', speciality: 'Left foot Shakti Peeth at triple river confluence', templeType: T, sacredCategories: [C] },
  { key: 'utkal-viraja-vimala', name: 'Vimala / Viraja Shakti Peeth, Puri', aliases: ['utkal', 'viraja', 'biraja', 'vimala puri', 'bimala', 'bimala temple', 'utkal shakti peeth', 'viraja shakti peeth'], city: 'Puri', state: 'Odisha', country: 'India', shaktiName: 'Vimala (Viraja)', bhairavName: 'Jagannath', bodyPart: 'Navel / Nabhi', description: 'Vimala temple inside the Jagannath temple complex at Puri, Odisha is the Utkal Shakti Peeth where the navel (nabhi) of Goddess Sati fell. Prasad offered to Jagannath is first offered to Vimala Devi.', descriptionHi: 'ओडिशा के पुरी में जगन्नाथ मंदिर परिसर में विमला मंदिर उत्कल शक्ति पीठ है जहाँ माता सती की नाभि गिरी थी।', speciality: 'Navel Shakti Peeth inside the Jagannath temple complex', templeType: T, sacredCategories: [C] },
  { key: 'nalhati-kalika', name: 'Nalhati / Kalika Shakti Peeth', aliases: ['nalhati', 'nalateswari', 'kalika nalhati', 'nalhati shakti peeth'], city: 'Nalhati', state: 'West Bengal', country: 'India', shaktiName: 'Kalika (Nalateswari)', bhairavName: 'Yogesh', bodyPart: 'Throat pipe / Nala', description: 'Nalateswari or Nalhati Shakti Peeth in Birbhum, West Bengal is where the throat pipe (nala) of Goddess Sati fell. The Goddess is worshipped as Kalika.', descriptionHi: 'पश्चिम बंगाल के बीरभूम में नलहाटी शक्ति पीठ है जहाँ माता सती की श्वासनली (नाल) गिरी थी। देवी कालिका रूप में पूजित हैं।', speciality: 'Throat pipe Shakti Peeth', templeType: T, sacredCategories: [C] },
  { key: 'lanka-shankari-devi', name: 'Lanka / Shankari Devi Shakti Peeth', aliases: ['lanka shankari', 'shankari devi', 'shankari devi lanka', 'shankari shakti peeth', 'trincomalee'], city: 'Trincomalee', state: 'Eastern Province', country: 'Sri Lanka', shaktiName: 'Shankari (Indrani)', bhairavName: 'Rakshaseshwar', bodyPart: 'Paayal / Anklet', description: 'Lanka Shakti Peeth, traditionally identified near Trincomalee in Sri Lanka, is where the anklet (paayal) of Goddess Sati fell. The Goddess is worshipped as Shankari or Indrani.', descriptionHi: 'श्रीलंका में त्रिंकोमाली के निकट लंका शक्ति पीठ है जहाँ माता सती की पायल गिरी थी। देवी शंकरी या इन्द्राणी रूप में पूजित हैं।', speciality: 'Anklet Shakti Peeth in Lanka', templeType: T, sacredCategories: [C] },
  // #52 — Danteshwari Shakti Peeth
  { key: 'danteshwari-dantewada', name: 'Danteshwari Shakti Peeth, Dantewada', aliases: ['danteshwari', 'danteshwari devi', 'danteshwari shakti peeth', 'dantewada', 'dantewara'], city: 'Dantewada', state: 'Chhattisgarh', country: 'India', shaktiName: 'Danteshwari', bhairavName: 'Dandpani', bodyPart: 'Dant (tooth)', description: 'Danteshwari temple in Dantewada, Chhattisgarh is the 52nd Shakti Peeth where the tooth (dant) of Goddess Sati fell. The city of Dantewada derives its name from the Goddess. She is the presiding deity (Kuldevi) of the Bastar royal family. The temple is an important cultural and religious center of the Bastar tribal region.', descriptionHi: 'छत्तीसगढ़ के दन्तेवाड़ा में दन्तेश्वरी मंदिर 52वाँ शक्ति पीठ है जहाँ माता सती का दाँत (दन्त) गिरा था। दन्तेवाड़ा शहर का नाम देवी से ही पड़ा है। वे बस्तर राजपरिवार की कुलदेवी हैं। यह मंदिर बस्तर आदिवासी क्षेत्र का महत्वपूर्ण सांस्कृतिक और धार्मिक केन्द्र है।', speciality: 'Tooth (Dant) Shakti Peeth — Kuldevi of Bastar royal family', templeType: T, sacredCategories: [C], timings: '6:00 AM – 8:00 PM' },
]

// Backward compatibility alias
export const SHAKTI_PEETH_51 = SHAKTI_PEETH_52

export function normalizeTempleName(value: unknown): string {
  return typeof value === 'string'
    ? value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
    : ''
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(item => normalizeTempleName(item)).filter(Boolean)
}

function categoryList(temple: ShaktiPeethTempleLike): string[] {
  return [
    ...normalizeList(temple.categories),
    ...normalizeList(temple.sacredCategories),
    normalizeTempleName(temple.templeType),
    ...normalizeList(temple.templeTypes),
  ].filter(Boolean)
}

export function isShaktiPeethCategory(value: unknown): boolean {
  const normalized = normalizeTempleName(value)
  return normalized === normalizeTempleName(SHAKTI_PEETH_CATEGORY) ||
    normalized === 'shakti peeth' ||
    normalized === '51 shakti peethas' ||
    normalized === '52 shakti peethas' ||
    normalized === 'shakti peeth 51 shakti peethas' ||
    normalized === 'shakti peeth 52 shakti peethas'
}

export function hasShaktiPeethCategoryTag(temple: ShaktiPeethTempleLike): boolean {
  return categoryList(temple).some(isShaktiPeethCategory)
}

function stateAliases(value: string): string[] {
  const state = normalizeTempleName(value)
  if (!state) return []
  return state.split(/\s*\/\s*/).flatMap(part => {
    const normalizedPart = normalizeTempleName(part)
    if (normalizedPart === 'jammu and kashmir') return [normalizedPart, 'jammu kashmir']
    if (normalizedPart === 'bihar nepal region') return [normalizedPart, 'bihar', 'nepal']
    if (normalizedPart === 'india nepal') return [normalizedPart, 'india', 'nepal']
    return [normalizedPart]
  })
}

function textHasPhrase(text: string, phrase: string): boolean {
  if (!text || !phrase) return false
  return text === phrase ||
    text.startsWith(`${phrase} `) ||
    text.endsWith(` ${phrase}`) ||
    text.includes(` ${phrase} `)
}

function locationCompatible(entry: ShaktiPeethReference, temple: ShaktiPeethTempleLike): boolean {
  const templeState = normalizeTempleName(temple.state)
  const templeCountry = normalizeTempleName(temple.country)
  const entryStates = stateAliases(entry.state)
  const entryCountries = stateAliases(entry.country)
  const countryMatches = Boolean(templeCountry) &&
    entryCountries.some(country => textHasPhrase(templeCountry, country) || textHasPhrase(country, templeCountry))

  if (templeCountry && !countryMatches) {
    return false
  }

  const entryStateIsCountry = entryStates.some(state => entryCountries.includes(state))
  if (!countryMatches || !entryStateIsCountry) {
    if (templeState && entryStates.length > 0 && !entryStates.some(state => textHasPhrase(templeState, state) || textHasPhrase(state, templeState))) {
      return false
    }
  }

  if (templeCountry && entryCountries.length > 0 && !countryMatches) {
    return false
  }

  return true
}

function entryAliases(entry: ShaktiPeethReference): string[] {
  return Array.from(new Set([
    entry.name,
    ...entry.aliases,
  ].map(normalizeTempleName).filter(alias => alias.length >= 4)))
}

function matchesEntry(temple: ShaktiPeethTempleLike, entry: ShaktiPeethReference): boolean {
  if (!locationCompatible(entry, temple)) return false

  const slug = normalizeTempleName(temple.slug)
  const title = normalizeTempleName(temple.title)
  const name = normalizeTempleName(temple.name)
  const generatedSlug = normalizeTempleName(typeof temple.title === 'string' ? temple.title.replace(/[^a-zA-Z0-9]+/g, '-') : '')
  const deity = normalizeTempleName(temple.deity)
  const city = normalizeTempleName(temple.city)
  const primaryFields = [slug, title, name, generatedSlug].filter(Boolean)
  const secondaryFields = [deity, city].filter(Boolean)

  return entryAliases(entry).some(alias => {
    const tokenCount = alias.split(' ').length
    const primaryMatch = primaryFields.some(field => textHasPhrase(field, alias))
    if (primaryMatch) return true

    if (tokenCount >= 2) {
      return secondaryFields.some(field => textHasPhrase(field, alias))
    }

    return false
  })
}

export function getMappedShaktiPeethEntry(temple: ShaktiPeethTempleLike): ShaktiPeethReference | null {
  if (temple.canonicalShaktiPeeth !== true) return null

  const key = typeof temple.canonicalShaktiPeethKey === 'string' ? temple.canonicalShaktiPeethKey.trim() : ''
  if (key) {
    return SHAKTI_PEETH_51.find(entry => entry.key === key) || null
  }

  const name = normalizeTempleName(temple.canonicalShaktiPeethName)
  if (!name) return null
  return SHAKTI_PEETH_51.find(entry => normalizeTempleName(entry.name) === name) || null
}

export function getShaktiPeethMatch(temple: ShaktiPeethTempleLike): ShaktiPeethReference | null {
  const mapped = getMappedShaktiPeethEntry(temple)
  if (mapped) return mapped

  return SHAKTI_PEETH_51.find(entry => matchesEntry(temple, entry)) || null
}

export function isCanonicalShaktiPeethTemple(temple: ShaktiPeethTempleLike): boolean {
  return getShaktiPeethMatch(temple) !== null
}

function uniqueTemples<T extends ShaktiPeethTempleLike>(temples: T[]): T[] {
  const seen = new Set<string>()
  const result: T[] = []

  for (const temple of temples) {
    const key = String(temple._id || temple.id || temple.slug || temple.title || result.length)
    if (seen.has(key)) continue
    seen.add(key)
    result.push(temple)
  }

  return result
}

export function getTemplesForSacredCategory<T extends ShaktiPeethTempleLike>(temples: T[], categoryName: string): T[] {
  if (isShaktiPeethCategory(categoryName)) {
    return uniqueTemples(temples.filter(isCanonicalShaktiPeethTemple))
  }

  const normalizedCategory = normalizeTempleName(categoryName)
  return uniqueTemples(
    temples.filter(temple => categoryList(temple).some(category => category === normalizedCategory))
  )
}

export function getShaktiPeethDebugReport<T extends ShaktiPeethTempleLike>(temples: T[]) {
  const allTemples = uniqueTemples(temples)
  const taggedTemples = allTemples.filter(hasShaktiPeethCategoryTag)
  const canonicalTemples = allTemples.filter(isCanonicalShaktiPeethTemple)
  const extraTaggedTemples = taggedTemples.filter(temple => !isCanonicalShaktiPeethTemple(temple))
  const missingCanonical = SHAKTI_PEETH_51.filter(entry => !allTemples.some(temple => getShaktiPeethMatch(temple)?.key === entry.key))

  return {
    taggedCount: taggedTemples.length,
    canonicalMatchedCount: canonicalTemples.length,
    extraTaggedCount: extraTaggedTemples.length,
    missingCanonicalCount: missingCanonical.length,
    taggedTemples,
    canonicalTemples,
    extraTaggedTemples,
    missingCanonical,
  }
}
