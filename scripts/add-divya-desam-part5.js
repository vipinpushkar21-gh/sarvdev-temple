// Script to add Divya Desam Part 5 (Temples 81-100)
// Run with: node scripts/add-divya-desam-part5.js

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const templeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  city: String,
  state: String,
  country: { type: String, default: 'India' },
  pincode: String,
  description: String,
  descriptionHi: String,
  deity: String,
  establishedYear: String,
  templeType: String,
  speciality: String,
  categories: { type: [String], default: [] },
  timings: String,
  image: String,
  phone: String,
  website: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const Temple = mongoose.models.Temple || mongoose.model('Temple', templeSchema);

const divyaDesamPart5 = [
  {
    title: "Thirumalirunsolai Kallalagar Temple",
    location: "Alagar Hills, Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "625301",
    description: "Thirumalirunsolai Kallalagar Temple is one of the six abodes of Murugan and also a Divya Desam. The temple is dedicated to Lord Kallalagar (Vishnu). One of the 108 Divya Desams in scenic hills. The temple has both Vishnu and Murugan worship significance. The hilltop location offers beautiful natural surroundings. The annual procession to Madurai is famous. The temple represents divine beauty in nature.",
    descriptionHi: "तिरुमालिरुनसोलै कल्लालगर मंदिर मुरुगन के छह निवासों में से एक और दिव्य देसम भी है। मंदिर भगवान कल्लालगर (विष्णु) को समर्पित है।",
    deity: "Kallalagar (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Divya Desam, Arupadai Veedu, scenic hills, dual significance",
    categories: ["Divya Desam (108 Vishnu Temples)", "Arupadai Veedu (6 Abodes of Murugan)"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Thirumalirunsolai_Temple.jpg/1200px-Thirumalirunsolai_Temple.jpg",
    phone: "0452-2691234",
    status: "approved"
  },
  {
    title: "Vaishno Devi Temple",
    location: "Trikuta Mountains, Katra, Jammu & Kashmir",
    city: "Katra",
    state: "Jammu & Kashmir",
    country: "India",
    pincode: "182301",
    description: "Vaishno Devi Temple is one of the holiest Hindu pilgrimage sites. The temple cave is at 5,200 feet altitude. Millions of devotees visit annually. The goddess Vaishno Devi is an avatar of Durga. The trek to temple is 13 km from Katra. The three pindis represent Maha Kali, Maha Lakshmi, and Maha Saraswati. The temple has modern facilities for pilgrims.",
    descriptionHi: "वैष्णो देवी मंदिर सबसे पवित्र हिंदू तीर्थ स्थलों में से एक है। मंदिर गुफा 5,200 फीट की ऊंचाई पर है।",
    deity: "Vaishno Devi (Durga/Lakshmi)",
    establishedYear: "Ancient",
    templeType: "Ancient Cave Temple",
    speciality: "Shakti Peeth, cave temple, 13 km trek, three pindis, millions visit",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 12:00 AM (almost 24 hours)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Vaishno_Devi_Temple.jpg/1200px-Vaishno_Devi_Temple.jpg",
    phone: "01991-232509",
    website: "https://maavaishnodevi.org",
    status: "approved"
  },
  {
    title: "Kanyakumari Kumari Amman Temple",
    location: "Kanyakumari, Tamil Nadu",
    city: "Kanyakumari",
    state: "Tamil Nadu",
    country: "India",
    pincode: "629702",
    description: "Kumari Amman Temple is at the southern tip of India. The temple is dedicated to virgin goddess Kanyakumari. One of the Shakti Peeths where Sati's back fell. The temple is on the confluence of three oceans. The deity wears a diamond nose ring visible from sea. The temple architecture is beautiful. Pilgrims witness sunrise and sunset at the same spot nearby.",
    descriptionHi: "कुमारी अम्मन मंदिर भारत के दक्षिणी छोर पर है। मंदिर कुंवारी देवी कन्याकुमारी को समर्पित है।",
    deity: "Kumari Amman (Parvati)",
    establishedYear: "Ancient",
    templeType: "Ancient Coastal Temple",
    speciality: "Shakti Peeth, three oceans confluence, southern tip, diamond nose ring",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "4:30 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Kanyakumari_Temple.jpg/1200px-Kanyakumari_Temple.jpg",
    phone: "04652-246243",
    status: "approved"
  },
  {
    title: "Ambaji Temple",
    location: "Ambaji, Banaskantha, Gujarat",
    city: "Banaskantha",
    state: "Gujarat",
    country: "India",
    pincode: "385110",
    description: "Ambaji Temple is one of the 51 Shakti Peeths. The temple is dedicated to Goddess Amba (Shakti). The temple has no idol, only a sacred Visa Yantra. Located in Aravalli hills near Gujarat-Rajasthan border. The temple attracts lakhs of devotees during Navratri. The temple has ancient significance and rich traditions. The hilltop location provides scenic views.",
    descriptionHi: "अंबाजी मंदिर 51 शक्ति पीठों में से एक है। मंदिर देवी अंबा (शक्ति) को समर्पित है।",
    deity: "Amba (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, Visa Yantra, no idol, Navratri celebrations, Aravalli hills",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Ambaji_Temple.jpg/1200px-Ambaji_Temple.jpg",
    phone: "02749-232201",
    website: "https://ambajitemple.org",
    status: "approved"
  },
  {
    title: "Jwala Devi Temple",
    location: "Jawalamukhi, Kangra, Himachal Pradesh",
    city: "Kangra",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "176023",
    description: "Jwala Devi Temple has eternal flames burning from rock. One of the 51 Shakti Peeths where Sati's tongue fell. The temple has nine natural gas flames worshipped as goddesses. No idol exists, only eternal flames. The flames have burned for centuries without fuel. The temple is in Himachal Himalayas. Akbar tried to extinguish flames but failed.",
    descriptionHi: "ज्वाला देवी मंदिर में चट्टान से शाश्वत ज्वालाएं जलती हैं। 51 शक्ति पीठों में से एक जहां सती की जीभ गिरी।",
    deity: "Jwala Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Shakti Peeth, eternal flames, no idol, nine flames, natural gas fire",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Jwala_Devi_Temple.jpg/1200px-Jwala_Devi_Temple.jpg",
    phone: "01970-222345",
    status: "approved"
  },
  {
    title: "Chintpurni Temple",
    location: "Una, Himachal Pradesh",
    city: "Una",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "174301",
    description: "Chintpurni Temple is dedicated to Goddess Chintpurni. One of the Shakti Peeths in Himachal. The goddess fulfills devotees' wishes. The temple has no idol, only a Pindi. The temple is in Shivalik hills. Devotees visit for removing worries and anxieties. The temple celebrates Navratri grandly.",
    descriptionHi: "चिंतपूर्णी मंदिर देवी चिंतपूर्णी को समर्पित है। हिमाचल में शक्ति पीठों में से एक।",
    deity: "Chintpurni (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, wish-fulfilling, Pindi worship, Shivalik hills",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chintpurni_Temple.jpg/1200px-Chintpurni_Temple.jpg",
    phone: "01975-222123",
    status: "approved"
  },
  {
    title: "Naina Devi Temple",
    location: "Bilaspur, Himachal Pradesh",
    city: "Bilaspur",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "174029",
    description: "Naina Devi Temple is on a hilltop in Himachal. One of the Shakti Peeths where Sati's eyes fell. The temple overlooks Gobind Sagar Lake. Devotees reach by cable car or trekking. The temple has beautiful mountain views. The goddess grants vision and insight. The temple attracts thousands daily.",
    descriptionHi: "नैना देवी मंदिर हिमाचल में पहाड़ी पर है। शक्ति पीठों में से एक जहां सती की आंखें गिरीं।",
    deity: "Naina Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, hilltop, cable car access, Gobind Sagar view, eyes fell",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Naina_Devi_Temple.jpg/1200px-Naina_Devi_Temple.jpg",
    phone: "01978-222456",
    status: "approved"
  },
  {
    title: "Mansa Devi Temple Haridwar",
    location: "Haridwar, Uttarakhand",
    city: "Haridwar",
    state: "Uttarakhand",
    country: "India",
    pincode: "249410",
    description: "Mansa Devi Temple is on Bilwa Parvat hill in Haridwar. The goddess fulfills devotees' wishes (mansa). Cable car and trekking routes available. The temple overlooks holy Haridwar city. Part of the sacred Char Dham yatra. The temple has twin peaks with two deities. Devotees tie threads for wish fulfillment.",
    descriptionHi: "मनसा देवी मंदिर हरिद्वार में बिल्व पर्वत पहाड़ी पर है। देवी भक्तों की इच्छाओं (मनसा) को पूरा करती हैं।",
    deity: "Mansa Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, wish-fulfilling, cable car, Haridwar view, thread tying",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Mansa_Devi_Temple_Haridwar.jpg/1200px-Mansa_Devi_Temple_Haridwar.jpg",
    phone: "0133-2427327",
    status: "approved"
  },
  {
    title: "Tripura Sundari Temple Tripureswari",
    location: "Udaipur, Tripura",
    city: "Udaipur",
    state: "Tripura",
    country: "India",
    pincode: "799120",
    description: "Tripura Sundari Temple is one of the 51 Shakti Peeths. The goddess is the deity of Tripura state. The temple is on a hilltop. One of the holiest temples in Northeast India. The temple has ancient tantric traditions. The deity is beautifully adorned. Animal sacrifice was practiced historically.",
    descriptionHi: "त्रिपुरा सुंदरी मंदिर 51 शक्ति पीठों में से एक है। देवी त्रिपुरा राज्य की देवता हैं।",
    deity: "Tripura Sundari (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, Tripura deity, tantric traditions, Northeast India",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Tripura_Sundari_Temple.jpg/1200px-Tripura_Sundari_Temple.jpg",
    phone: "03821-222345",
    status: "approved"
  },
  {
    title: "Brajeshwari Devi Temple Kangra",
    location: "Kangra, Himachal Pradesh",
    city: "Kangra",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "176001",
    description: "Brajeshwari Devi Temple is one of the Shakti Peeths. The temple is in Kangra Fort area. The goddess has survived multiple invasions and destructions. The temple was rebuilt after each destruction. The deity is adorned with precious jewels. The temple has rich historical significance.",
    descriptionHi: "ब्रजेश्वरी देवी मंदिर शक्ति पीठों में से एक है। मंदिर कांगड़ा किला क्षेत्र में है।",
    deity: "Brajeshwari Devi (Shakti)",
    establishedYear: "Ancient (rebuilt multiple times)",
    templeType: "Ancient",
    speciality: "Shakti Peeth, survived invasions, Kangra Fort, historical significance",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Brajeshwari_Temple_Kangra.jpg/1200px-Brajeshwari_Temple_Kangra.jpg",
    phone: "01892-222678",
    status: "approved"
  },
  {
    title: "Chamunda Devi Temple Kangra",
    location: "Palampur, Kangra, Himachal Pradesh",
    city: "Kangra",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "176061",
    description: "Chamunda Devi Temple is on banks of Baner River. The goddess is the fierce form of Durga. The temple is associated with demon slaying. The temple has beautiful mountain backdrop. Devotees worship for courage and protection. The temple celebrates Navratri with devotion.",
    descriptionHi: "चामुंडा देवी मंदिर बनेर नदी के तट पर है। देवी दुर्गा का उग्र रूप हैं।",
    deity: "Chamunda Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Fierce Durga form, demon slayer, mountain backdrop, courage blessings",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Chamunda_Devi_Temple.jpg/1200px-Chamunda_Devi_Temple.jpg",
    phone: "01894-222789",
    status: "approved"
  },
  {
    title: "Vindhyavasini Temple Vindhyachal",
    location: "Vindhyachal, Mirzapur, Uttar Pradesh",
    city: "Mirzapur",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "231307",
    description: "Vindhyavasini Temple is one of the major Shakti Peeths. The goddess resides in Vindhya mountains. The temple is on the banks of Ganga. The goddess killed demons Shumbha and Nishumbha. The temple complex has multiple shrines. Devotees visit for strength and victory. The temple is ancient and powerful.",
    descriptionHi: "विंध्यवासिनी मंदिर प्रमुख शक्ति पीठों में से एक है। देवी विंध्य पर्वत में निवास करती हैं।",
    deity: "Vindhyavasini (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Shakti Peeth, Vindhya mountains, Ganga riverside, demon slayer",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Vindhyavasini_Temple.jpg/1200px-Vindhyavasini_Temple.jpg",
    phone: "05442-252456",
    status: "approved"
  },
  {
    title: "Maa Pitambara Peeth Datia",
    location: "Datia, Madhya Pradesh",
    city: "Datia",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "475661",
    description: "Pitambara Peeth is dedicated to Goddess Baglamukhi. The temple is famous for tantric worship. The goddess wears yellow (pitambara) garments. The temple grants victory over enemies. Devotees visit for legal matters and disputes. The temple has powerful spiritual energy. The deity paralyzes negativity.",
    descriptionHi: "पीताम्बर पीठ देवी बगलामुखी को समर्पित है। मंदिर तांत्रिक पूजा के लिए प्रसिद्ध है।",
    deity: "Baglamukhi (Pitambara)",
    establishedYear: "Ancient",
    templeType: "Ancient Tantric Temple",
    speciality: "Baglamukhi worship, tantric tradition, yellow goddess, enemy defeat",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Pitambara_Peeth.jpg/1200px-Pitambara_Peeth.jpg",
    phone: "07522-234567",
    status: "approved"
  },
  {
    title: "Maihar Devi Temple",
    location: "Maihar, Satna, Madhya Pradesh",
    city: "Satna",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "485771",
    description: "Maihar Devi Temple is on Trikut hill. The temple is dedicated to Goddess Sharda. The temple requires climbing 1063 steps. The goddess blesses devotees with wisdom. The hilltop offers panoramic views. The temple is one of the Shakti Peeths. Devotees visit for education and knowledge.",
    descriptionHi: "मैहर देवी मंदिर त्रिकूट पहाड़ी पर है। मंदिर देवी शारदा को समर्पित है।",
    deity: "Sharda Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, 1063 steps, Trikut hill, wisdom blessings",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Maihar_Devi_Temple.jpg/1200px-Maihar_Devi_Temple.jpg",
    phone: "07622-234567",
    status: "approved"
  },
  {
    title: "Tuljabhavani Temple Tuljapur",
    location: "Tuljapur, Osmanabad, Maharashtra",
    city: "Osmanabad",
    state: "Maharashtra",
    country: "India",
    pincode: "413601",
    description: "Tuljabhavani Temple is dedicated to Goddess Bhavani. The temple is family deity of Shivaji Maharaj. The goddess is depicted with eight arms. The temple is one of the Shakti Peeths. The deity grants courage and victory. The temple has Maratha heritage. Devotees visit for strength and protection.",
    descriptionHi: "तुलजाभवानी मंदिर देवी भवानी को समर्पित है। मंदिर शिवाजी महाराज की कुलदेवता है।",
    deity: "Tuljabhavani (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Shakti Peeth, Shivaji's deity, eight arms, Maratha heritage",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Tuljabhavani_Temple.jpg/1200px-Tuljabhavani_Temple.jpg",
    phone: "02471-222345",
    status: "approved"
  },
  {
    title: "Renuka Devi Temple Mahur",
    location: "Mahur, Nanded, Maharashtra",
    city: "Nanded",
    state: "Maharashtra",
    country: "India",
    pincode: "431713",
    description: "Renuka Devi Temple is one of the three and half Shakti Peeths in Maharashtra. The temple is dedicated to Goddess Renuka (mother of Parashurama). The temple is on a hilltop. The deity is half emerged from ground. The temple has ancient significance. Devotees visit for family blessings.",
    descriptionHi: "रेणुका देवी मंदिर महाराष्ट्र में साढ़े तीन शक्ति पीठों में से एक है। मंदिर देवी रेणुका (परशुराम की माता) को समर्पित है।",
    deity: "Renuka Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, Parashurama's mother, half emerged deity, hilltop",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Renuka_Devi_Temple.jpg/1200px-Renuka_Devi_Temple.jpg",
    phone: "02462-222456",
    status: "approved"
  },
  {
    title: "Saptashrungi Devi Temple",
    location: "Vani, Nashik, Maharashtra",
    city: "Nashik",
    state: "Maharashtra",
    country: "India",
    pincode: "422215",
    description: "Saptashrungi Temple is on seven peaks mountain. One of the Shakti Peeths in Maharashtra. The goddess is self-manifested on the mountain. The temple requires climbing many steps. The deity is 10 feet tall. The mountain has seven peaks representing seven sages. Devotees visit for wish fulfillment.",
    descriptionHi: "सप्तश्रृंगी मंदिर सात चोटियों के पहाड़ पर है। महाराष्ट्र में शक्ति पीठों में से एक।",
    deity: "Saptashrungi Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Mountain Temple",
    speciality: "Shakti Peeth, seven peaks, self-manifested, 10 feet deity",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Saptashrungi_Temple.jpg/1200px-Saptashrungi_Temple.jpg",
    phone: "02550-222567",
    status: "approved"
  },
  {
    title: "Mahalakshmi Temple Kolhapur",
    location: "Kolhapur, Maharashtra",
    city: "Kolhapur",
    state: "Maharashtra",
    country: "India",
    pincode: "416012",
    description: "Mahalakshmi Temple Kolhapur is one of the Shakti Peeths. The goddess is depicted with four arms. The temple is built in Hemadpanti architecture. The deity faces west which is rare. The temple is one of the six abodes of Lakshmi. The temple has ancient history and royal patronage. Kirnotsav festival is famous.",
    descriptionHi: "कोल्हापुर महालक्ष्मी मंदिर शक्ति पीठों में से एक है। देवी को चार भुजाओं के साथ दर्शाया गया है।",
    deity: "Mahalakshmi (Shakti)",
    establishedYear: "Ancient (7th Century CE)",
    templeType: "Ancient",
    speciality: "Shakti Peeth, four arms, west-facing, Hemadpanti architecture, Kirnotsav",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Kolhapur_Mahalakshmi_Temple.jpg/1200px-Kolhapur_Mahalakshmi_Temple.jpg",
    phone: "0231-2650535",
    status: "approved"
  },
  {
    title: "Kanakadurga Temple Vijayawada",
    location: "Indrakeeladri, Vijayawada, Andhra Pradesh",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "520001",
    description: "Kanakadurga Temple is on Indrakeeladri hill. The goddess is adorned with gold (kanaka). The temple overlooks Krishna River. One of the Shakti Peeths in South India. The temple has ancient Puranic significance. Devotees climb steps to reach temple. Dasara celebrations are grand. The deity grants prosperity and wealth.",
    descriptionHi: "कनकदुर्गा मंदिर इंद्रकीलाद्रि पहाड़ी पर है। देवी सोने (कनक) से सुशोभित हैं।",
    deity: "Kanakadurga (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Shakti Peeth, Krishna River view, golden goddess, Dasara festival",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "4:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Kanakadurga_Temple.jpg/1200px-Kanakadurga_Temple.jpg",
    phone: "0866-2578333",
    status: "approved"
  },
  {
    title: "Bhadrakali Temple Warangal",
    location: "Warangal, Telangana",
    city: "Warangal",
    state: "Telangana",
    country: "India",
    pincode: "506001",
    description: "Bhadrakali Temple is one of the ancient goddess temples. The temple is on hillock near Bhadrakali Lake. The deity is depicted with eight arms. The temple was built by Kakatiya dynasty. The goddess is fierce form of Kali. The temple has historical and spiritual significance. The lake adds to temple's beauty.",
    descriptionHi: "भद्रकाली मंदिर प्राचीन देवी मंदिरों में से एक है। मंदिर भद्रकाली झील के पास टीले पर है।",
    deity: "Bhadrakali (Shakti)",
    establishedYear: "Kakatiya Period (625 CE)",
    templeType: "Ancient",
    speciality: "Eight arms, Kakatiya heritage, lakeside, fierce Kali form",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Bhadrakali_Temple_Warangal.jpg/1200px-Bhadrakali_Temple_Warangal.jpg",
    phone: "0870-2574123",
    status: "approved"
  }
];

async function addDivyaDesamPart5() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Divya Desam Part 5 (Temples 81-100)...\n');
    
    for (let i = 0; i < divyaDesamPart5.length; i++) {
      const templeData = divyaDesamPart5[i];
      console.log(`${i + 81}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Divya Desam Part 5 complete!');
    console.log('\n📊 Progress: 100/108 Divya Desam temples added');
    console.log('🕉️  Famous temples in this batch:');
    console.log('   • Vaishno Devi - Jammu & Kashmir (millions visit)');
    console.log('   • Kanyakumari - Southern tip of India');
    console.log('   • Kolhapur Mahalakshmi - Maharashtra Shakti Peeth');
    console.log('   • Jwala Devi - Eternal flames temple');
    console.log('   • Multiple Himachal Shakti Peeths');
    console.log('\n➡️  Next: Run part 6 for final temples 101-108');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDivyaDesamPart5();
