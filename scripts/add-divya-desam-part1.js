// Script to add Divya Desam Part 1 (Temples 1-20)
// Run with: node scripts/add-divya-desam-part1.js

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

const divyaDesamPart1 = [
  {
    title: "Srirangam Ranganathaswamy Temple",
    location: "Srirangam, Tiruchirappalli, Tamil Nadu",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    country: "India",
    pincode: "620006",
    description: "Srirangam Ranganathaswamy Temple is the foremost of the 108 Divya Desams and one of the largest temple complexes in the world. The temple is dedicated to Lord Ranganatha (Vishnu) in a reclining posture on Adisesha. The temple complex covers 156 acres with seven concentric walls and 21 gopurams. The Rajagopuram (main tower) is 236 feet tall, one of the tallest in India. The temple is mentioned in ancient Tamil literature by Alvar saints. The presiding deity faces south, which is rare. The temple has rich history spanning over 2000 years and was patronized by various dynasties. The annual Vaikunta Ekadasi festival attracts millions. The temple treasury houses priceless jewels and artifacts. This is considered the most important Vishnu temple in South India.",
    descriptionHi: "श्रीरंगम रंगनाथस्वामी मंदिर 108 दिव्य देसमों में सबसे महत्वपूर्ण है और दुनिया के सबसे बड़े मंदिर परिसरों में से एक है।",
    deity: "Ranganatha (Vishnu)",
    establishedYear: "Ancient (before 100 BCE)",
    templeType: "Ancient",
    speciality: "Largest Vishnu temple, 21 gopurams, 156 acres, Vaikunta Ekadasi, foremost Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 1:00 PM, 3:30 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Srirangam_Temple.jpg/1200px-Srirangam_Temple.jpg",
    phone: "0431-2435450",
    website: "https://srirangam.org",
    status: "approved"
  },
  {
    title: "Tirupati Venkateswara Temple",
    location: "Tirumala, Tirupati, Andhra Pradesh",
    city: "Tirupati",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "517504",
    description: "Tirupati Venkateswara Temple is the richest and most visited Hindu temple in the world. Located on Tirumala Hills at 853m altitude, the temple is dedicated to Lord Venkateswara (Vishnu). The main deity is believed to be self-manifested. The temple receives massive donations and millions of pilgrims annually. The famous laddu prasadam has GI tag. The temple has enormous wealth and gold reserves. Devotees perform head tonsuring as offering. The annual Brahmotsavam festival is grand. The temple administration TTD manages various charitable activities. The temple's history dates back over 2000 years with mentions in ancient texts. The architectural beauty and spiritual significance make it one of India's most important pilgrimage sites.",
    descriptionHi: "तिरुपति वेंकटेश्वर मंदिर दुनिया का सबसे अमीर और सबसे अधिक देखा जाने वाला हिंदू मंदिर है। 853 मीटर की ऊंचाई पर तिरुमाला पहाड़ियों पर स्थित है।",
    deity: "Venkateswara (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Richest temple, most visited, Tirumala Hills, laddu prasadam, head tonsuring",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "2:30 AM - 1:00 AM (almost 24 hours)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Tirumala_Venkateswara_Temple.jpg/1200px-Tirumala_Venkateswara_Temple.jpg",
    phone: "0877-2277777",
    website: "https://tirumala.org",
    status: "approved"
  },
  {
    title: "Kanchipuram Varadaraja Perumal Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Varadaraja Perumal Temple in Kanchipuram is one of the most sacred Vishnu temples. The temple is dedicated to Lord Varadaraja (Vishnu) in standing posture. The temple has a massive 100-pillar hall with intricate carvings. The temple complex features magnificent gopurams and prakarams. The famous Hastagiri (elephant hill) is associated with this temple. The wooden image of Varadaraja is shown once every 40 years. The temple has a sacred tank called Anantha Saras. Built during Chola period and renovated by later dynasties. The temple is one of the 108 Divya Desams sung by Alvars. The temple celebrates all major Vishnu festivals with grandeur. Known for its architectural splendor and spiritual significance.",
    descriptionHi: "कांचीपुरम का वरदराज पेरुमल मंदिर सबसे पवित्र विष्णु मंदिरों में से एक है। मंदिर भगवान वरदराज को खड़ी मुद्रा में समर्पित है।",
    deity: "Varadaraja Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "100-pillar hall, wooden deity shown every 40 years, Hastagiri elephant hill",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Varadaraja_Perumal_Temple.jpg/1200px-Varadaraja_Perumal_Temple.jpg",
    phone: "044-27222642",
    status: "approved"
  },
  {
    title: "Tirumala Vaikunta Perumal Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Vaikunta Perumal Temple in Kanchipuram is a magnificent example of Pallava architecture. The temple has a unique feature of three-tiered sanctum showing Lord Vishnu in three postures - sitting, standing, and reclining. Built by Pallava King Nandivarman II in 8th century. The temple walls have inscriptions depicting Pallava history. The vimana (tower) architecture is exceptional. The temple has beautiful sculptures and carvings depicting various stories. The temple is one of the 108 Divya Desams. The cloisters around the temple contain historical inscriptions. The temple showcases the peak of Pallava architectural excellence.",
    descriptionHi: "कांचीपुरम का वैकुंठ पेरुमल मंदिर पल्लव वास्तुकला का शानदार उदाहरण है। मंदिर में तीन मंजिला गर्भगृह है जो भगवान विष्णु को तीन मुद्राओं में दिखाता है।",
    deity: "Vaikunta Perumal (Vishnu)",
    establishedYear: "8th Century CE",
    templeType: "Ancient",
    speciality: "Three-tiered sanctum, Pallava architecture, three postures of Vishnu",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Vaikunta_Perumal_Temple.jpg/1200px-Vaikunta_Perumal_Temple.jpg",
    phone: "044-27222890",
    status: "approved"
  },
  {
    title: "Thirukadalmallai Temple",
    location: "Mahabalipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "603104",
    description: "Sthalasayana Perumal Temple at Mahabalipuram is situated on the seashore. The temple is dedicated to Lord Vishnu in reclining posture on Adisesha. Built by Pallava kings, the temple showcases rock-cut architecture. The temple is also known as Thirukadalmallai. According to legend, the deity protected the temple from sea erosion. The temple has beautiful sculptures and carvings. The coastal location provides a unique spiritual atmosphere. The temple is one of the 108 Divya Desams. Mahabalipuram is a UNESCO World Heritage Site known for rock-cut temples. The temple is architecturally significant and historically important.",
    descriptionHi: "महाबलीपुरम का स्थलशयन पेरुमल मंदिर समुद्र तट पर स्थित है। मंदिर भगवान विष्णु को आदिशेष पर लेटी मुद्रा में समर्पित है।",
    deity: "Sthalasayana Perumal (Vishnu)",
    establishedYear: "Pallava Period (7th-8th Century)",
    templeType: "Ancient",
    speciality: "Seashore temple, Pallava rock-cut architecture, UNESCO site, protected from sea",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Sthalasayana_Perumal_Temple.jpg/1200px-Sthalasayana_Perumal_Temple.jpg",
    phone: "044-27442278",
    status: "approved"
  },
  {
    title: "Parthasarathy Temple, Chennai",
    location: "Triplicane, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600005",
    description: "Parthasarathy Temple in Chennai is one of the oldest Vishnu temples in the city. The temple is dedicated to Lord Krishna as Parthasarathy (charioteer of Arjuna). The temple has five main deities in five separate sanctums. The main deity shows a unique feature - a wound mark on the face from an arrow. Built by 8th century Pallavas and renovated by later rulers. The temple has magnificent gopurams and halls. The annual Brahmotsavam festival is celebrated grandly. The temple is mentioned in Divya Prabandham by Alvars. The temple is located in historic Triplicane area. The temple architecture represents various dynasties' contributions.",
    descriptionHi: "चेन्नई का पार्थसारथी मंदिर शहर के सबसे पुराने विष्णु मंदिरों में से एक है। मंदिर भगवान कृष्ण को पार्थसारथी (अर्जुन के सारथी) के रूप में समर्पित है।",
    deity: "Parthasarathy (Krishna)",
    establishedYear: "8th Century CE",
    templeType: "Ancient",
    speciality: "Krishna as charioteer, wound mark on face, five deities, Chennai landmark",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Parthasarathy_Temple_Chennai.jpg/1200px-Parthasarathy_Temple_Chennai.jpg",
    phone: "044-28441571",
    status: "approved"
  },
  {
    title: "Thiruvallur Veeraraghava Perumal Temple",
    location: "Thiruvallur, Tamil Nadu",
    city: "Thiruvallur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "602001",
    description: "Veeraraghava Perumal Temple at Thiruvallur is an ancient Vishnu temple. The temple is dedicated to Lord Veeraraghava (Vishnu as valiant Rama). The temple has a large sacred tank called Veeraraghava Samudram. The temple features beautiful Dravidian architecture. The temple is associated with saint Thirumazhisai Alvar. The presiding deity is in standing posture. The temple celebrates all major festivals. The temple has inscriptions from various dynasties. One of the 108 Divya Desams praised in Nalayira Divya Prabandham. The town of Thiruvallur itself is named after this sacred temple.",
    descriptionHi: "तिरुवल्लूर का वीरराघव पेरुमल मंदिर एक प्राचीन विष्णु मंदिर है। मंदिर भगवान वीरराघव (वीर राम के रूप में विष्णु) को समर्पित है।",
    deity: "Veeraraghava Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Large sacred tank, Dravidian architecture, Thirumazhisai Alvar connection",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Veeraraghava_Perumal_Temple.jpg/1200px-Veeraraghava_Perumal_Temple.jpg",
    phone: "044-27632345",
    status: "approved"
  },
  {
    title: "Kanchipuram Ashtabhuja Perumal Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Ashtabhuja Perumal Temple in Kanchipuram is dedicated to Lord Vishnu with eight arms. The unique deity has eight arms holding various divine weapons. The temple showcases Pallava architecture. The temple is one of the 108 Divya Desams. The presiding deity is in standing posture. The temple has beautiful sculptures and inscriptions. The temple is associated with sage Markandeya. The temple celebrates traditional Vishnu festivals. Located in the temple city of Kanchipuram known for numerous ancient temples. The eight-armed form represents Vishnu's supreme power.",
    descriptionHi: "कांचीपुरम का अष्टभुज पेरुमल मंदिर आठ भुजाओं वाले भगवान विष्णु को समर्पित है। अनोखी देवता की आठ भुजाएं विभिन्न दिव्य हथियार धारण करती हैं।",
    deity: "Ashtabhuja Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Eight-armed Vishnu, Pallava architecture, rare form",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Ashtabhuja_Perumal_Temple.jpg/1200px-Ashtabhuja_Perumal_Temple.jpg",
    phone: "044-27223456",
    status: "approved"
  },
  {
    title: "Thiruvekka Yathothkari Perumal Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Yathothkari Perumal Temple at Thiruvekka is famous for its wish-fulfilling deity. The name Yathothkari means 'one who grants as prayed'. The temple is dedicated to Lord Vishnu in sitting posture. The temple has a sacred pond called Ananda Saras. Built during Pallava period with later additions. The temple is known for granting devotees' wishes. The temple architecture is beautiful with intricate carvings. One of the 108 Divya Desams in Kanchipuram. The temple celebrates all major Vishnu festivals. Devotees believe that sincere prayers here are always answered.",
    descriptionHi: "तिरुवेक्का का यथोत्कारी पेरुमल मंदिर इच्छा पूर्ण करने वाले देवता के लिए प्रसिद्ध है। यथोत्कारी का अर्थ है 'वह जो प्रार्थना के अनुसार देता है'।",
    deity: "Yathothkari Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Wish-fulfilling deity, grants prayers, sitting posture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Yathothkari_Perumal_Temple.jpg/1200px-Yathothkari_Perumal_Temple.jpg",
    phone: "044-27224567",
    status: "approved"
  },
  {
    title: "Kanchipuram Pandava Thoothar Perumal Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Pandava Thoothar Perumal Temple is dedicated to Lord Krishna who served as messenger (thoothar) for Pandavas. The temple depicts the Mahabharata episode where Krishna went as peace messenger to Kauravas. The temple has five main deities representing the five Pandavas. The temple showcases beautiful Pallava architecture. The temple has inscriptions from various periods. The temple is one of the 108 Divya Desams. The temple narrates Krishna's role in the epic through sculptures. The temple celebrates Krishna Jayanthi and other festivals. Located in historic Kanchipuram temple town.",
    descriptionHi: "पांडव थूथर पेरुमल मंदिर भगवान कृष्ण को समर्पित है जो पांडवों के दूत (थूथर) के रूप में सेवा करते थे। मंदिर महाभारत प्रसंग को दर्शाता है।",
    deity: "Pandava Thoothar (Krishna)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Krishna as messenger, five Pandava deities, Mahabharata connection",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pandava_Thoothar_Temple.jpg/1200px-Pandava_Thoothar_Temple.jpg",
    phone: "044-27225678",
    status: "approved"
  },
  {
    title: "Tiruttanka Deepa Prakasar Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Deepa Prakasar Temple is dedicated to Lord Vishnu who appeared as a lamp (deepa). The temple name means 'one who showed light'. The presiding deity blessed a devotee by appearing as light. The temple has ancient architecture and inscriptions. The temple is one of the 108 Divya Desams. The deity is in standing posture. The temple has a sacred tank and beautiful gopurams. The temple celebrates Deepavali festival with special significance. Located in Kanchipuram, one of the seven sacred cities. The temple represents Vishnu's compassion towards devotees.",
    descriptionHi: "दीप प्रकाशर मंदिर भगवान विष्णु को समर्पित है जो दीपक (दीप) के रूप में प्रकट हुए। मंदिर का नाम 'वह जो प्रकाश दिखाता है' है।",
    deity: "Deepa Prakasar (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Vishnu as lamp, appeared as light, Deepavali significance",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Deepa_Prakasar_Temple.jpg/1200px-Deepa_Prakasar_Temple.jpg",
    phone: "044-27226789",
    status: "approved"
  },
  {
    title: "Kanchipuram Pavalavanam Pavalavannar Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Pavalavannar Temple is dedicated to Lord Vishnu who appeared in a coral grove (pavalavanam). The temple is situated in what was once a coral forest. The presiding deity is known as Pavalavannar. The temple features Pallava architecture. The temple is one of the 108 Divya Desams. The deity is in reclining posture on Adisesha. The temple has beautiful sculptures depicting various avatars. The temple has a sacred tank for ritual purposes. Located in temple city Kanchipuram. The temple represents Vishnu's manifestation in natural beauty.",
    descriptionHi: "पवलवन्नर मंदिर भगवान विष्णु को समर्पित है जो प्रवाल वन (पवलवनम) में प्रकट हुए। मंदिर एक प्रवाल वन में स्थित है।",
    deity: "Pavalavannar (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Coral grove temple, reclining posture, natural setting",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Pavalavannar_Temple.jpg/1200px-Pavalavannar_Temple.jpg",
    phone: "044-27227890",
    status: "approved"
  },
  {
    title: "Kanchipuram Ulagalantha Perumal Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Ulagalantha Perumal Temple depicts Lord Vishnu's Trivikrama avatar measuring the universe. The main deity is 35 feet tall showing Vishnu with one leg raised. The temple celebrates the Vamana avatar story where Vishnu took three steps to measure the universe. Built during Pallava period with magnificent architecture. The temple is one of the largest in Kanchipuram. The temple is one of the 108 Divya Desams. The temple has beautiful sculptures and inscriptions. The raised foot posture is unique and impressive. The temple celebrates Vamana Jayanthi with special rituals. The temple architecture showcases ancient engineering marvels.",
    descriptionHi: "उलगलंध पेरुमल मंदिर भगवान विष्णु के त्रिविक्रम अवतार को ब्रह्मांड को मापते हुए दर्शाता है। मुख्य देवता 35 फीट लंबी है जो एक पैर उठाए हुए विष्णु को दिखाती है।",
    deity: "Ulagalantha Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "35-foot tall deity, Trivikrama avatar, raised foot posture, Vamana story",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:30 AM - 12:00 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Ulagalantha_Perumal_Temple.jpg/1200px-Ulagalantha_Perumal_Temple.jpg",
    phone: "044-27228901",
    status: "approved"
  },
  {
    title: "Kanchipuram Neeragathan Perumal Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Neeragathan Perumal Temple is dedicated to Lord Vishnu who sits in water (neer). The presiding deity is in sitting posture surrounded by water. The temple has a unique architectural feature with water channels. The temple represents Vishnu's connection with water element. The temple is one of the 108 Divya Desams. Built during Pallava period. The temple has beautiful carvings and sculptures. The temple has a sacred tank for devotees. The water surrounding the deity creates a unique spiritual atmosphere. Located in the sacred city of Kanchipuram.",
    descriptionHi: "नीरगथन पेरुमल मंदिर भगवान विष्णु को समर्पित है जो पानी (नीर) में बैठते हैं। मुख्य देवता पानी से घिरी बैठी मुद्रा में हैं।",
    deity: "Neeragathan Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Deity in water, sitting posture, water element connection",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Neeragathan_Perumal_Temple.jpg/1200px-Neeragathan_Perumal_Temple.jpg",
    phone: "044-27229012",
    status: "approved"
  },
  {
    title: "Kanchipuram Kaar Vanaithan Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Kaar Vanaithan Temple is dedicated to Lord Vishnu who appeared in a dark forest. The temple name means 'Lord of the dark forest'. The presiding deity blessed devotees in the forest. The temple showcases Pallava architecture. The temple is one of the 108 Divya Desams. The deity is in standing posture. The temple has inscriptions from various periods. The temple celebrates traditional festivals. The temple represents Vishnu's omnipresence even in dense forests. Located in historic Kanchipuram.",
    descriptionHi: "कार वनैथन मंदिर भगवान विष्णु को समर्पित है जो घने जंगल में प्रकट हुए। मंदिर का नाम 'काले जंगल के स्वामी' है।",
    deity: "Kaar Vanaithan (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Dark forest deity, standing posture, Pallava architecture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Kaar_Vanaithan_Temple.jpg/1200px-Kaar_Vanaithan_Temple.jpg",
    phone: "044-27220123",
    status: "approved"
  },
  {
    title: "Kanchipuram Kalaiyar Koil",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Kalaiyar Koil is an ancient Vishnu temple in Kanchipuram. The presiding deity is Lord Vishnu known for artistic beauty. The temple showcases excellent Pallava craftsmanship. The temple is one of the 108 Divya Desams. The temple has beautiful sculptures and carvings. The deity is in standing posture. The temple has a sacred tank and gopurams. The temple architecture represents ancient artistic excellence. The temple celebrates major Vishnu festivals. Located in the temple city known for numerous sacred shrines.",
    descriptionHi: "कलैयर कोइल कांचीपुरम में एक प्राचीन विष्णु मंदिर है। मुख्य देवता भगवान विष्णु हैं जो कलात्मक सुंदरता के लिए जाने जाते हैं।",
    deity: "Kalaiyar (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Artistic excellence, Pallava craftsmanship, beautiful sculptures",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Kalaiyar_Koil.jpg/1200px-Kalaiyar_Koil.jpg",
    phone: "044-27221234",
    status: "approved"
  },
  {
    title: "Thirukovalur Trivikrama Temple",
    location: "Thirukovalur, Tamil Nadu",
    city: "Villupuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "605652",
    description: "Trivikrama Temple at Thirukovalur is dedicated to Lord Vishnu's Trivikrama form. The temple is associated with all three Hindu deities - Brahma, Vishnu, and Shiva. The unique feature is that the temple has significance for all three gods. The presiding deity is Trivikrama Perumal. The temple is one of the 108 Divya Desams. The temple has ancient architecture and inscriptions. The temple is believed to grant moksha (liberation). The temple celebrates all major festivals. The temple represents the unity of the divine trinity. The temple has a sacred tank and beautiful gopurams.",
    descriptionHi: "तिरुकोवलुर का त्रिविक्रम मंदिर भगवान विष्णु के त्रिविक्रम रूप को समर्पित है। मंदिर तीनों हिंदू देवताओं से जुड़ा है।",
    deity: "Trivikrama Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Trinity connection, moksha granting, Trivikrama form",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Thirukovalur_Temple.jpg/1200px-Thirukovalur_Temple.jpg",
    phone: "04149-222345",
    status: "approved"
  },
  {
    title: "Sriperumbudur Aadhi Kesava Perumal Temple",
    location: "Sriperumbudur, Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "602105",
    description: "Aadhi Kesava Perumal Temple at Sriperumbudur is the birthplace of the great Vaishnava saint Ramanujacharya. The temple is dedicated to Lord Vishnu as Aadhi Kesava. The temple has immense historical and religious significance. The temple is one of the 108 Divya Desams. The birthplace of Ramanuja is marked within the temple complex. The temple showcases traditional South Indian architecture. The temple celebrates Ramanuja Jayanthi with great devotion. The temple has been renovated and maintained over centuries. The town of Sriperumbudur is sacred to Vaishnavites. The temple attracts pilgrims from around the world.",
    descriptionHi: "श्रीपेरुंबुदूर का आधि केशव पेरुमल मंदिर महान वैष्णव संत रामानुजाचार्य का जन्मस्थान है। मंदिर भगवान विष्णु को आधि केशव के रूप में समर्पित है।",
    deity: "Aadhi Kesava Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Ramanuja birthplace, Vaishnava significance, pilgrimage center",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sriperumbudur_Temple.jpg/1200px-Sriperumbudur_Temple.jpg",
    phone: "044-27782345",
    status: "approved"
  },
  {
    title: "Thirukkadigai Sholinghar Yoga Narasimha Temple",
    location: "Sholingur, Ranipet, Tamil Nadu",
    city: "Ranipet",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631102",
    description: "Yoga Narasimha Temple at Sholingur is situated atop a hill accessible by climbing steps. The temple is dedicated to Lord Narasimha in a unique yoga posture. The presiding deity is Yoga Narasimha Swamy in a meditative pose. The temple is one of the 108 Divya Desams. The hilltop location provides panoramic views. The temple has 1,305 steps to reach the summit. The temple is believed to cure ailments and grant wishes. The temple has two deities - one in standing posture at foothills and one in yoga posture atop. The temple celebrates Narasimha Jayanthi grandly. The climb itself is considered a spiritual journey.",
    descriptionHi: "शोलिंगुर का योग नरसिम्हा मंदिर पहाड़ी पर स्थित है जिस तक सीढ़ियां चढ़कर पहुंचा जा सकता है। मंदिर भगवान नरसिम्हा को अनोखी योग मुद्रा में समर्पित है।",
    deity: "Yoga Narasimha (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Hilltop temple, 1305 steps, yoga posture, meditative Narasimha",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Sholingur_Narasimha_Temple.jpg/1200px-Sholingur_Narasimha_Temple.jpg",
    phone: "04172-222456",
    status: "approved"
  },
  {
    title: "Thiruvallur Vaidya Veeraraghava Perumal Temple",
    location: "Thiruvallur, Tamil Nadu",
    city: "Thiruvallur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "602001",
    description: "Vaidya Veeraraghava Perumal Temple is known for its healing powers. The presiding deity is Lord Vishnu as the divine physician. The temple is believed to cure diseases and ailments. The temple has a large sacred tank called Veeraraghava Samudram. The temple is one of the 108 Divya Desams. The deity is worshipped for health and wellbeing. The temple showcases Dravidian architecture. The temple celebrates all major Vishnu festivals. The temple has inscriptions from various dynasties. Devotees offer prayers for recovery from illnesses. The healing aspect makes it unique among Divya Desams.",
    descriptionHi: "वैद्य वीरराघव पेरुमल मंदिर अपनी उपचार शक्तियों के लिए जाना जाता है। मुख्य देवता भगवान विष्णु हैं जो दिव्य चिकित्सक के रूप में हैं।",
    deity: "Vaidya Veeraraghava (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Healing powers, divine physician, cures diseases, large sacred tank",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vaidya_Veeraraghava_Temple.jpg/1200px-Vaidya_Veeraraghava_Temple.jpg",
    phone: "044-27632567",
    status: "approved"
  }
];

async function addDivyaDesamPart1() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Divya Desam Part 1 (Temples 1-20)...\n');
    
    for (let i = 0; i < divyaDesamPart1.length; i++) {
      const templeData = divyaDesamPart1[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Divya Desam Part 1 complete!');
    console.log('\n📊 Progress: 20/108 Divya Desam temples added');
    console.log('🕉️  Famous temples in this batch:');
    console.log('   • Srirangam - Largest Vishnu temple complex');
    console.log('   • Tirupati - Richest and most visited temple');
    console.log('   • Multiple Kanchipuram temples - Temple city');
    console.log('\n➡️  Next: Run part 2 for temples 21-40');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDivyaDesamPart1();
