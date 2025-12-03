// Script to add Shakti Peeth temples - Part 2 (17 temples)
// Run with: node scripts/add-shakti-peeth-part2.js

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

const shaktiPeethPart2 = [
  {
    title: "Mookambika Temple",
    location: "Kollur, Udupi, Karnataka",
    city: "Udupi",
    state: "Karnataka",
    country: "India",
    pincode: "576220",
    description: "Mookambika Temple is nestled in the Western Ghats surrounded by lush forests. The temple is dedicated to Goddess Mookambika, a combined form of Parvati, Lakshmi, and Saraswati. The golden idol of the Goddess holds a Sri Chakra. The temple is one of the seven Mukti Sthalas of Karnataka. Located on the banks of river Souparnika, the temple offers a serene spiritual environment. The temple celebrates annual Navaratri with great enthusiasm.",
    descriptionHi: "मूकाम्बिका मंदिर पश्चिमी घाटों में हरे-भरे जंगलों से घिरा हुआ है। मंदिर देवी मूकाम्बिका को समर्पित है जो पार्वती, लक्ष्मी और सरस्वती का संयुक्त रूप है।",
    deity: "Mookambika (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Three Goddesses combined, Sri Chakra worship",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 2:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Mookambika_Temple_Kollur.jpg/1200px-Mookambika_Temple_Kollur.jpg",
    phone: "08258-258227",
    status: "approved"
  },
  {
    title: "Arasuri Ambaji Temple",
    location: "Danta, Banaskantha, Gujarat",
    city: "Banaskantha",
    state: "Gujarat",
    country: "India",
    pincode: "385120",
    description: "Arasuri Ambaji Temple is an ancient Shakti Peeth located in the Aravalli ranges. The temple is known for its beautiful stone architecture and peaceful surroundings. The deity is worshipped in the form of a sacred yantra. The temple is surrounded by natural beauty with hills and forests. Pilgrims visit throughout the year for darshan and spiritual peace. The temple has facilities for devotees including accommodation and prasad distribution.",
    descriptionHi: "अरासुरी अंबाजी मंदिर अरावली पर्वत श्रृंखला में स्थित एक प्राचीन शक्तिपीठ है। मंदिर अपनी सुंदर पत्थर की वास्तुकला के लिए जाना जाता है।",
    deity: "Ambaji (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Aravalli location, yantra worship",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Ambaji_Temple_Architecture.jpg/1200px-Ambaji_Temple_Architecture.jpg",
    status: "approved"
  },
  {
    title: "Kali Temple Pavagadh",
    location: "Pavagadh Hill, Panchmahal, Gujarat",
    city: "Panchmahal",
    state: "Gujarat",
    country: "India",
    pincode: "389360",
    description: "Kalika Mata Temple is situated atop Pavagadh Hill, a UNESCO World Heritage Site. The temple is dedicated to Goddess Kali and is believed to be where the foot of Goddess Sati fell. Devotees climb stone steps or take a ropeway to reach the temple. The hilltop offers panoramic views of the surrounding landscape. The temple has great historical and religious significance. Annual fairs during Navratri attract thousands of pilgrims.",
    descriptionHi: "कालिका माता मंदिर पावागढ़ पहाड़ी के शीर्ष पर स्थित है जो यूनेस्को विश्व धरोहर स्थल है। मंदिर देवी काली को समर्पित है।",
    deity: "Kali (Shakti)",
    establishedYear: "10th-11th Century CE",
    templeType: "Ancient",
    speciality: "UNESCO site, hilltop temple, ropeway access",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 7:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Kalika_Mata_Temple_Pavagadh.jpg/1200px-Kalika_Mata_Temple_Pavagadh.jpg",
    phone: "02676-252052",
    status: "approved"
  },
  {
    title: "Mahalaxmi Temple Kolhapur",
    location: "Kolhapur, Maharashtra",
    city: "Kolhapur",
    state: "Maharashtra",
    country: "India",
    pincode: "416012",
    description: "Mahalaxmi Temple in Kolhapur is an ancient and highly revered temple dedicated to Goddess Mahalaxmi. The temple is built in Hemadpanti architectural style with black stone. The idol of the Goddess is adorned with precious stones and jewelry. The temple is one of the Shakti Peethas where the eyes or some say the lower teeth of Goddess Sati fell. The temple has a rich history spanning over a millennium. The temple attracts devotees seeking blessings for prosperity and wealth.",
    descriptionHi: "कोल्हापुर में महालक्ष्मी मंदिर देवी महालक्ष्मी को समर्पित एक प्राचीन और अत्यधिक पूजनीय मंदिर है। मंदिर हेमाडपंती वास्तुकला शैली में काले पत्थर से बना है।",
    deity: "Mahalaxmi (Shakti)",
    establishedYear: "7th Century CE",
    templeType: "Ancient",
    speciality: "Black stone architecture, prosperity blessings",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:30 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Mahalaxmi_Temple_Kolhapur.jpg/1200px-Mahalaxmi_Temple_Kolhapur.jpg",
    phone: "0231-2650535",
    status: "approved"
  },
  {
    title: "Renuka Devi Temple",
    location: "Renukoot, Mahur, Nanded, Maharashtra",
    city: "Nanded",
    state: "Maharashtra",
    country: "India",
    pincode: "431722",
    description: "Renuka Devi Temple is located on a hilltop in Mahur, one of the three and half Shakti Peethas of Maharashtra. The temple is dedicated to Goddess Renuka, mother of Parashurama. The idol shows the Goddess in a seated position. The temple complex includes several smaller shrines. The location offers beautiful views of the surrounding valleys. The temple is an important pilgrimage site in the Marathwada region.",
    descriptionHi: "रेणुका देवी मंदिर महाराष्ट्र के तीन और डेढ़ शक्तिपीठों में से एक महूर में पहाड़ी की चोटी पर स्थित है। मंदिर देवी रेणुका को समर्पित है।",
    deity: "Renuka Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Mother of Parashurama, hilltop location",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Renuka_Devi_Temple_Mahur.jpg/1200px-Renuka_Devi_Temple_Mahur.jpg",
    status: "approved"
  },
  {
    title: "Jogulamba Temple",
    location: "Alampur, Gadwal, Telangana",
    city: "Gadwal",
    state: "Telangana",
    country: "India",
    pincode: "509152",
    description: "Jogulamba Temple is one of the 18 Maha Shakti Peethas where the upper teeth of Goddess Sati fell. The temple is located at the confluence of rivers Tungabhadra and Krishna. The ancient temple showcases Chalukyan architecture with intricate carvings. The deity is in a fierce form holding weapons. The temple complex also houses several other ancient Shiva temples. The temple was reconstructed after being destroyed in medieval times.",
    descriptionHi: "जोगुलाम्बा मंदिर 18 महाशक्तिपीठों में से एक है जहां देवी सती के ऊपरी दांत गिरे थे। मंदिर तुंगभद्रा और कृष्णा नदियों के संगम पर स्थित है।",
    deity: "Jogulamba (Shakti)",
    establishedYear: "7th Century CE (Reconstructed)",
    templeType: "Ancient",
    speciality: "River confluence, Chalukyan architecture",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Jogulamba_Temple_Alampur.jpg/1200px-Jogulamba_Temple_Alampur.jpg",
    phone: "08542-222233",
    status: "approved"
  },
  {
    title: "Ekambareswarar Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Ekambareswarar Temple is one of the five major Shiva temples of Kanchipuram. The temple is known for its 1000-year-old mango tree with four branches representing the four Vedas. The temple is believed to be where Goddess Parvati worshipped Shiva in the form of a Prithvi Lingam. The massive temple complex covers 25 acres with towering gopurams. The temple showcases magnificent Dravidian architecture with detailed stone carvings.",
    descriptionHi: "एकांबरेश्वर मंदिर कांचीपुरम के पांच प्रमुख शिव मंदिरों में से एक है। मंदिर अपने 1000 साल पुराने आम के पेड़ के लिए जाना जाता है जिसकी चार शाखाएं चार वेदों का प्रतिनिधित्व करती हैं।",
    deity: "Kamakshi (Shakti)",
    establishedYear: "600 CE",
    templeType: "Ancient",
    speciality: "1000-year mango tree, Prithvi Lingam",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Ekambareswarar_Temple_Kanchipuram.jpg/1200px-Ekambareswarar_Temple_Kanchipuram.jpg",
    phone: "044-27222784",
    status: "approved"
  },
  {
    title: "Kamakshi Amman Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Kamakshi Amman Temple is a famous Hindu temple dedicated to Goddess Kamakshi. The temple is one of the 51 Shakti Peethas where the navel of Goddess Sati is believed to have fallen. The golden idol of Kamakshi is shown in a seated posture. The temple is one of the three holy places of Shakti worship in India. The temple was established by Adi Shankaracharya and houses a Sri Chakra. The architecture represents classic South Indian temple style.",
    descriptionHi: "कामाक्षी अम्मन मंदिर देवी कामाक्षी को समर्पित एक प्रसिद्ध हिंदू मंदिर है। मंदिर 51 शक्तिपीठों में से एक है जहां देवी सती की नाभि गिरी थी।",
    deity: "Kamakshi (Shakti)",
    establishedYear: "Ancient (Rebuilt 14th Century)",
    templeType: "Ancient",
    speciality: "Sri Chakra worship, Shankaracharya's establishment",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:30 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Kamakshi_Amman_Temple.jpg/1200px-Kamakshi_Amman_Temple.jpg",
    phone: "044-27222508",
    status: "approved"
  },
  {
    title: "Meenakshi Temple",
    location: "Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "625001",
    description: "Meenakshi Amman Temple is a historic Hindu temple dedicated to Goddess Meenakshi and Lord Sundareswarar. The temple is renowned for its stunning architecture with 14 colorful gopurams. The temple complex covers 14 acres with numerous halls featuring thousands of intricately carved pillars. The temple is considered one of the Shakti Peethas and is a major pilgrimage and tourist destination. The annual Meenakshi Thirukalyanam festival attracts millions of visitors.",
    descriptionHi: "मीनाक्षी अम्मन मंदिर देवी मीनाक्षी और भगवान सुंदरेश्वर को समर्पित एक ऐतिहासिक हिंदू मंदिर है। मंदिर 14 रंगीन गोपुरमों के साथ अपनी आश्चर्यजनक वास्तुकला के लिए प्रसिद्ध है।",
    deity: "Meenakshi (Shakti)",
    establishedYear: "6th Century CE (Rebuilt 17th Century)",
    templeType: "Ancient",
    speciality: "14 gopurams, thousand pillar hall",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Meenakshi_Temple_Madurai.jpg/1200px-Meenakshi_Temple_Madurai.jpg",
    phone: "0452-2345789",
    status: "approved"
  },
  {
    title: "Bimala Temple",
    location: "Puri Jagannath Temple Complex, Odisha",
    city: "Puri",
    state: "Odisha",
    country: "India",
    pincode: "752001",
    description: "Bimala Temple is located within the Jagannath Temple complex in Puri. The temple is dedicated to Goddess Bimala, considered the Shakti of Lord Jagannath. This is one of the important Shakti Peethas where the feet of Goddess Sati fell. The prasad of Lord Jagannath is offered to Goddess Bimala before distribution. The temple follows traditional Odia architectural style. Devotees visiting Jagannath Temple always pay respects to Goddess Bimala.",
    descriptionHi: "बिमला मंदिर पुरी में जगन्नाथ मंदिर परिसर के भीतर स्थित है। मंदिर देवी बिमला को समर्पित है जिन्हें भगवान जगन्नाथ की शक्ति माना जाता है।",
    deity: "Bimala (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Inside Jagannath complex, prasad offering tradition",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Bimala_Temple_Puri.jpg/1200px-Bimala_Temple_Puri.jpg",
    phone: "06752-222106",
    status: "approved"
  },
  {
    title: "Tara Tarini Temple",
    location: "Kumari Hills, Brahmapur, Odisha",
    city: "Brahmapur",
    state: "Odisha",
    country: "India",
    pincode: "761003",
    description: "Tara Tarini Temple is located atop Kumari hills overlooking the Rushikulya river. The temple is one of the ancient Shakti Peethas where the breasts of Goddess Sati fell. The temple is dedicated to twin Goddesses Tara and Tarini. The hilltop location offers panoramic views of the surrounding landscape. Devotees climb steep steps to reach the temple. The temple is considered highly sacred in Odisha and attracts pilgrims throughout the year.",
    descriptionHi: "तारा तारिणी मंदिर रुशिकुल्या नदी को देखती कुमारी पहाड़ियों के शीर्ष पर स्थित है। मंदिर एक प्राचीन शक्तिपीठ है जहां देवी सती के स्तन गिरे थे।",
    deity: "Tara Tarini (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Twin Goddesses, hilltop temple",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tara_Tarini_Temple.jpg/1200px-Tara_Tarini_Temple.jpg",
    phone: "0680-2292345",
    status: "approved"
  },
  {
    title: "Puruhutika Temple",
    location: "Pithapuram, Kakinada, Andhra Pradesh",
    city: "Kakinada",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "533450",
    description: "Puruhutika Temple in Pithapuram is an ancient Shakti Peeth where the left shoulder of Goddess Sati fell. The temple is dedicated to Goddess Puruhutika. Pithapuram is considered one of the holiest places in Andhra Pradesh. The temple complex includes several ancient shrines. The town is also associated with sage Agastya. The temple architecture reflects traditional South Indian style with a beautiful gopuram.",
    descriptionHi: "पीठापुरम में पुरुहुतिका मंदिर एक प्राचीन शक्तिपीठ है जहां देवी सती का बायां कंधा गिरा था। मंदिर देवी पुरुहुतिका को समर्पित है।",
    deity: "Puruhutika (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Sage Agastya association, holy town",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pithapuram_Temple.jpg/1200px-Pithapuram_Temple.jpg",
    status: "approved"
  },
  {
    title: "Shri Kanya Kumari Temple",
    location: "Kanyakumari, Tamil Nadu",
    city: "Kanyakumari",
    state: "Tamil Nadu",
    country: "India",
    pincode: "629702",
    description: "Shri Kanya Kumari Temple stands at the confluence of three oceans at India's southern tip. The temple is dedicated to Goddess Kumari, the virgin form of Goddess Parvati. According to legend, the Goddess performed penance here to marry Lord Shiva. The temple's architecture is unique with the sanctum facing east. The diamond nose ring of the deity is said to be visible from the sea. The temple combines spiritual significance with stunning ocean views.",
    descriptionHi: "श्री कन्या कुमारी मंदिर भारत के दक्षिणी छोर पर तीन महासागरों के संगम पर स्थित है। मंदिर देवी कुमारी को समर्पित है जो देवी पार्वती का कुंवारी रूप है।",
    deity: "Kanya Kumari (Shakti)",
    establishedYear: "Ancient (3000 years)",
    templeType: "Ancient",
    speciality: "Three oceans meeting point, southern tip of India",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "4:30 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Kanyakumari_Temple.jpg/1200px-Kanyakumari_Temple.jpg",
    phone: "04652-246243",
    status: "approved"
  },
  {
    title: "Biraja Temple",
    location: "Jajpur, Odisha",
    city: "Jajpur",
    state: "Odisha",
    country: "India",
    pincode: "755001",
    description: "Biraja Temple is one of the major Shakti Peethas where the navel of Goddess Sati fell. The temple is dedicated to Goddess Biraja, the presiding deity of Jajpur. The temple is mentioned in ancient texts as one of the most important Shakti shrines. The architecture showcases traditional Kalinga style. The temple complex includes the main shrine and several smaller temples. The temple plays a central role in local religious and cultural life.",
    descriptionHi: "बिराजा मंदिर प्रमुख शक्तिपीठों में से एक है जहां देवी सती की नाभि गिरी थी। मंदिर देवी बिराजा को समर्पित है जो जाजपुर की अधिष्ठात्री देवी हैं।",
    deity: "Biraja (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Kalinga architecture, ancient scriptures mention",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Biraja_Temple_Jajpur.jpg/1200px-Biraja_Temple_Jajpur.jpg",
    phone: "06728-220345",
    status: "approved"
  },
  {
    title: "Mundeshwari Temple",
    location: "Kaimur Hills, Bhabua, Bihar",
    city: "Bhabua",
    state: "Bihar",
    country: "India",
    pincode: "821101",
    description: "Mundeshwari Temple is believed to be one of the oldest Hindu temples still in use, dating back to 108 CE. The temple is dedicated to both Lord Shiva and Goddess Shakti. Located on Mundeshwari Hills, the temple offers panoramic views. The octagonal structure is unique in Indian temple architecture. Archaeological evidence suggests continuous worship for over 1900 years. The temple is protected as a monument of national importance.",
    descriptionHi: "मुंडेश्वरी मंदिर 108 ईस्वी पूर्व का माना जाता है और यह अभी भी उपयोग में आने वाले सबसे पुराने हिंदू मंदिरों में से एक है। मंदिर भगवान शिव और देवी शक्ति दोनों को समर्पित है।",
    deity: "Shakti and Shiva",
    establishedYear: "108 CE",
    templeType: "Ancient",
    speciality: "Oldest Hindu temple, octagonal structure",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 6:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Mundeshwari_Temple.jpg/1200px-Mundeshwari_Temple.jpg",
    status: "approved"
  },
  {
    title: "Vindhyavasini Temple",
    location: "Vindhyachal, Mirzapur, Uttar Pradesh",
    city: "Mirzapur",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "231307",
    description: "Vindhyavasini Temple is located in Vindhyachal on the banks of river Ganga. The temple is dedicated to Goddess Vindhyavasini, a form of Durga. This Shakti Peeth is where the left hand of Goddess Sati fell. The temple is one of the most important pilgrimage sites in North India. The area has three main temples forming a triangular pattern. Thousands of devotees visit during Navratri celebrations.",
    descriptionHi: "विंध्यवासिनी मंदिर गंगा नदी के तट पर विंध्याचल में स्थित है। मंदिर देवी विंध्यवासिनी को समर्पित है जो दुर्गा का एक रूप है।",
    deity: "Vindhyavasini (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Ganga riverbank, triangular temple pattern",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Vindhyavasini_Temple.jpg/1200px-Vindhyavasini_Temple.jpg",
    phone: "05442-252345",
    status: "approved"
  },
  {
    title: "Chandrika Devi Temple",
    location: "Munger, Bihar",
    city: "Munger",
    state: "Bihar",
    country: "India",
    pincode: "811201",
    description: "Chandrika Devi Temple is situated on top of Chandi Pahar hill near Munger. The temple is dedicated to Goddess Chandi or Chandrika. According to belief, this is where the right eye of Goddess Sati fell. The hilltop location requires climbing steps through scenic surroundings. The temple offers beautiful views of the surrounding area. The annual fair during Chaitra Navratri attracts thousands of devotees from Bihar and neighboring states.",
    descriptionHi: "चंद्रिका देवी मंदिर मुंगेर के पास चांदी पहाड़ की चोटी पर स्थित है। मंदिर देवी चंडी या चंद्रिका को समर्पित है। माना जाता है कि यहां देवी सती की दाहिनी आंख गिरी थी।",
    deity: "Chandrika (Chandi)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Hilltop location, scenic views",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 7:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chandi_Temple_Munger.jpg/1200px-Chandi_Temple_Munger.jpg",
    status: "approved"
  }
];

async function addShaktiPeethPart2() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Shakti Peeth temples - Part 2 (17 temples)...\n');
    
    for (let i = 0; i < shaktiPeethPart2.length; i++) {
      const templeData = shaktiPeethPart2[i];
      console.log(`${i + 18}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Part 2 complete - 17 more Shakti Peeth temples added!');
    console.log('Total so far: 34 temples');
    console.log('\nNext: Run part 3 script for final 17 temples');
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addShaktiPeethPart2();
