// Script to add Shakti Peeth temples - Part 1 (17 temples)
// Run with: node scripts/add-shakti-peeth-part1.js

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

const shaktiPeethPart1 = [
  {
    title: "Kamakhya Temple",
    location: "Nilachal Hill, Guwahati, Assam",
    city: "Guwahati",
    state: "Assam",
    country: "India",
    pincode: "781010",
    description: "Kamakhya Temple is one of the most revered Shakti Peeths where the womb and genitals of Goddess Sati fell. Located atop Nilachal Hill, this ancient temple is a major pilgrimage site for Tantric worshippers. The temple does not have an idol but a natural stone formation representing the Goddess. The annual Ambubachi Mela celebrates the menstruation cycle of the Goddess, attracting thousands of devotees. The temple complex consists of ten structures with distinct Nilachal architectural style.",
    descriptionHi: "कामाख्या मंदिर सबसे पूजनीय शक्तिपीठों में से एक है जहां देवी सती की योनि गिरी थी। नीलाचल पहाड़ी के शीर्ष पर स्थित यह प्राचीन मंदिर तांत्रिक उपासकों के लिए एक प्रमुख तीर्थ स्थल है।",
    deity: "Kamakhya Devi (Shakti)",
    establishedYear: "8th-9th Century CE",
    templeType: "Ancient",
    speciality: "Most powerful Shakti Peeth, Tantric worship center",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:30 AM - 1:00 PM, 2:30 PM - 5:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Kamakhya_Temple.jpg/1200px-Kamakhya_Temple.jpg",
    phone: "0361-2608867",
    status: "approved"
  },
  {
    title: "Kalighat Temple",
    location: "Kalighat, Kolkata, West Bengal",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    pincode: "700026",
    description: "Kalighat Temple is where the toes of the right foot of Goddess Sati fell. This 200-year-old temple is one of the most visited pilgrimage sites in Kolkata. The deity is represented as Goddess Kali with a golden tongue and large eyes. The temple is mentioned in several ancient texts and has been a center of devotion for centuries. The area around the temple has given the city its English name 'Calcutta'. Daily animal sacrifice rituals are performed here as part of traditional worship.",
    descriptionHi: "कालीघाट मंदिर वह स्थान है जहां देवी सती के दाहिने पैर की उंगलियां गिरी थीं। यह 200 साल पुराना मंदिर कोलकाता में सबसे अधिक देखे जाने वाले तीर्थ स्थलों में से एक है।",
    deity: "Kali (Shakti)",
    establishedYear: "1809 CE (Ancient origins)",
    templeType: "Ancient",
    speciality: "Origin of Calcutta name, animal sacrifice tradition",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Kalighat_Kali_Temple.jpg/1200px-Kalighat_Kali_Temple.jpg",
    phone: "033-2454-1010",
    status: "approved"
  },
  {
    title: "Dakshineswar Kali Temple",
    location: "Dakshineswar, Kolkata, West Bengal",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    pincode: "700076",
    description: "Dakshineswar Kali Temple is a famous Hindu temple where Sri Ramakrishna Paramahamsa served as a priest. Built in 1855 by Rani Rashmoni, this nine-spired temple complex is dedicated to Goddess Bhavatarini. The temple architecture follows traditional Bengali style with a courtyard surrounded by twelve Shiva temples. Located on the eastern bank of Hooghly River, the temple offers a peaceful spiritual environment. The temple became internationally known through the spiritual teachings of Ramakrishna.",
    descriptionHi: "दक्षिणेश्वर काली मंदिर एक प्रसिद्ध हिंदू मंदिर है जहां श्री रामकृष्ण परमहंस ने एक पुजारी के रूप में सेवा की। 1855 में रानी रासमणि द्वारा निर्मित यह मंदिर देवी भवतारिणी को समर्पित है।",
    deity: "Bhavatarini (Kali)",
    establishedYear: "1855 CE",
    templeType: "Historic",
    speciality: "Ramakrishna's worship place, Bengali architecture",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 12:30 PM, 3:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Dakshineshwar_Kali_Temple.jpg/1200px-Dakshineshwar_Kali_Temple.jpg",
    phone: "033-2564-1154",
    status: "approved"
  },
  {
    title: "Tarapith Temple",
    location: "Tarapith, Birbhum, West Bengal",
    city: "Birbhum",
    state: "West Bengal",
    country: "India",
    pincode: "731123",
    description: "Tarapith is a major Shakti Peeth where the eyeball of Goddess Sati fell. The temple is famous for Tantric worship and is associated with the renowned saint Bamakhepa. The deity Tara is worshipped in her fierce form with four arms. The temple is situated near a cremation ground which adds to its Tantric significance. Devotees believe that wishes made here with true devotion are always fulfilled. The temple has a unique tradition of non-vegetarian offerings.",
    descriptionHi: "तारापीठ एक प्रमुख शक्तिपीठ है जहां देवी सती की आंख की पुतली गिरी थी। मंदिर तांत्रिक पूजा के लिए प्रसिद्ध है और प्रसिद्ध संत बामाखेपा से जुड़ा है।",
    deity: "Tara (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Tantric worship, Bamakhepa association",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tarapith_Temple.jpg/1200px-Tarapith_Temple.jpg",
    phone: "03461-255080",
    status: "approved"
  },
  {
    title: "Jwalamukhi Temple",
    location: "Jwalamukhi, Kangra, Himachal Pradesh",
    city: "Jwalamukhi",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "176081",
    description: "Jwalamukhi Temple is a unique Shakti Peeth where the tongue of Goddess Sati fell. The temple is famous for its nine eternal flames that burn without any fuel source, considered manifestations of the Goddess. There is no idol in the temple, only these natural flames burning from rock fissures. According to legend, even Emperor Akbar tried to extinguish these flames but failed. The temple attracts thousands of devotees who come to witness this natural phenomenon.",
    descriptionHi: "ज्वालामुखी मंदिर एक अद्वितीय शक्तिपीठ है जहां देवी सती की जीभ गिरी थी। मंदिर नौ शाश्वत ज्वालाओं के लिए प्रसिद्ध है जो बिना किसी ईंधन के जलती हैं।",
    deity: "Jwalamukhi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Eternal flames without fuel, natural phenomenon",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Jwalamukhi_Temple_Kangra.jpg/1200px-Jwalamukhi_Temple_Kangra.jpg",
    phone: "01970-222231",
    status: "approved"
  },
  {
    title: "Chamunda Devi Temple",
    location: "Dharamshala, Kangra, Himachal Pradesh",
    city: "Dharamshala",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "176057",
    description: "Chamunda Devi Temple is situated on the banks of Baner river in the Dhauladhar ranges. The temple is dedicated to Goddess Chamunda, a fierce form of Durga. The idol shows the Goddess seated on a corpse and adorned with a garland of severed heads. The temple offers panoramic views of the surrounding mountains and valleys. According to legend, this is where the hair of Goddess Sati fell. The temple is an important pilgrimage site in the Kangra valley.",
    descriptionHi: "चामुंडा देवी मंदिर धौलाधार पर्वत श्रृंखला में बनेर नदी के तट पर स्थित है। मंदिर देवी चामुंडा को समर्पित है जो दुर्गा का एक उग्र रूप है।",
    deity: "Chamunda (Shakti)",
    establishedYear: "16th Century CE",
    templeType: "Ancient",
    speciality: "Mountain location, fierce Goddess form",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Chamunda_Devi_Temple_Dharamshala.jpg/1200px-Chamunda_Devi_Temple_Dharamshala.jpg",
    phone: "01892-221943",
    status: "approved"
  },
  {
    title: "Chhinnamasta Temple",
    location: "Rajrappa, Ramgarh, Jharkhand",
    city: "Ramgarh",
    state: "Jharkhand",
    country: "India",
    pincode: "825106",
    description: "Chhinnamasta Temple is located at the confluence of Bhera and Damodar rivers. The temple is dedicated to Goddess Chhinnamasta, depicted as a self-decapitated deity. This rare form of the Goddess represents self-sacrifice and kundalini awakening. The temple is an important center for Tantric worship. The scenic location at the river confluence adds to the spiritual atmosphere. The temple celebrates a major fair during Chaitra Navratri.",
    descriptionHi: "छिन्नमस्ता मंदिर भेड़ा और दामोदर नदियों के संगम पर स्थित है। मंदिर देवी छिन्नमस्ता को समर्पित है जो स्व-शिरच्छेदित देवता के रूप में चित्रित की गई हैं।",
    deity: "Chhinnamasta (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Self-decapitated Goddess, river confluence",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 6:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chhinnamasta_Temple_Rajrappa.jpg/1200px-Chhinnamasta_Temple_Rajrappa.jpg",
    status: "approved"
  },
  {
    title: "Naina Devi Temple",
    location: "Nainital, Uttarakhand",
    city: "Nainital",
    state: "Uttarakhand",
    country: "India",
    pincode: "263001",
    description: "Naina Devi Temple is built on the northern shore of Naini Lake where the eyes of Goddess Sati fell. The temple is situated at an altitude giving devotees a beautiful view of the lake and surrounding hills. The town of Nainital derives its name from this temple. The two-eyed idol of the Goddess is the main deity. The temple becomes especially crowded during the Nanda Devi festival. The peaceful lakeside location makes it a popular pilgrimage and tourist destination.",
    descriptionHi: "नैना देवी मंदिर नैनी झील के उत्तरी किनारे पर बना है जहां देवी सती की आंखें गिरी थीं। नैनीताल शहर का नाम इसी मंदिर से लिया गया है।",
    deity: "Naina Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Lakeside location, origin of Nainital name",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Naina_Devi_Temple_Nainital.jpg/1200px-Naina_Devi_Temple_Nainital.jpg",
    status: "approved"
  },
  {
    title: "Vaishno Devi Temple",
    location: "Katra, Reasi, Jammu and Kashmir",
    city: "Katra",
    state: "Jammu and Kashmir",
    country: "India",
    pincode: "182301",
    description: "Vaishno Devi Temple is one of the most visited pilgrimage sites in India, located in the Trikuta Mountains. The temple is dedicated to Goddess Vaishno Devi, a manifestation of Shakti. The main shrine consists of three natural rock formations called pindies. Devotees undertake a 13-kilometer trek from Katra to reach the holy cave. The temple is open throughout the year and receives millions of visitors annually. The journey to the shrine is considered a spiritual awakening experience.",
    descriptionHi: "वैष्णो देवी मंदिर भारत में सबसे अधिक देखे जाने वाले तीर्थ स्थलों में से एक है। त्रिकुटा पर्वत में स्थित यह मंदिर देवी वैष्णो देवी को समर्पित है।",
    deity: "Vaishno Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "13km trek, millions of pilgrims, holy cave",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "Open 24 hours",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Vaishno_Devi_Bhawan.jpg/1200px-Vaishno_Devi_Bhawan.jpg",
    phone: "01991-232008",
    website: "https://www.maavaishnodevi.org",
    status: "approved"
  },
  {
    title: "Ambaji Temple",
    location: "Ambaji, Banaskantha, Gujarat",
    city: "Ambaji",
    state: "Gujarat",
    country: "India",
    pincode: "385110",
    description: "Ambaji Temple is located near the Gujarat-Rajasthan border in the Aravalli hills. This ancient temple is where the heart of Goddess Sati fell. Uniquely, the temple has no idol but instead houses a Visa Yantra inscribed on marble. The temple is considered one of the 51 Shakti Peeths and attracts millions during the Bhadarvi Poonam fair. The temple complex has been renovated with modern facilities while maintaining its spiritual essence.",
    descriptionHi: "अंबाजी मंदिर अरावली पहाड़ियों में गुजरात-राजस्थान सीमा के पास स्थित है। यह प्राचीन मंदिर वह स्थान है जहां देवी सती का हृदय गिरा था।",
    deity: "Ambaji (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Visa Yantra worship, no idol, Bhadarvi fair",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ambaji_Temple_Gujarat.jpg/1200px-Ambaji_Temple_Gujarat.jpg",
    phone: "02749-232628",
    status: "approved"
  },
  {
    title: "Tuljabhavani Temple",
    location: "Tuljapur, Osmanabad, Maharashtra",
    city: "Tuljapur",
    state: "Maharashtra",
    country: "India",
    pincode: "413601",
    description: "Tuljabhavani Temple is a major Shakti Peeth where the head of Goddess Sati fell. The temple is dedicated to Goddess Bhavani, the family deity of the Maratha warrior Chhatrapati Shivaji. The idol shows the Goddess with eight arms holding weapons. The temple has a rich history dating back centuries and features traditional Maratha architecture. The temple complex sits on a hill providing panoramic views. Major festivals include Navratri celebrations.",
    descriptionHi: "तुलजाभवानी मंदिर एक प्रमुख शक्तिपीठ है जहां देवी सती का सिर गिरा था। मंदिर देवी भवानी को समर्पित है जो मराठा योद्धा छत्रपति शिवाजी की कुलदेवी थीं।",
    deity: "Bhavani (Shakti)",
    establishedYear: "12th Century CE",
    templeType: "Ancient",
    speciality: "Shivaji's family deity, Maratha architecture",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:30 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tuljabhavani_Temple.jpg/1200px-Tuljabhavani_Temple.jpg",
    phone: "02471-252288",
    status: "approved"
  },
  {
    title: "Mahalakshmi Temple Mumbai",
    location: "Breach Candy, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400006",
    description: "Mahalakshmi Temple is one of Mumbai's most famous temples built around 1785. The temple houses three idols - Mahalakshmi, Mahakali, and Mahasaraswati, each adorned with nose rings and heavy gold jewelry. The temple is believed to be built on the site where the arms of Goddess Sati fell. The temple offers a view of the Arabian Sea and is a major landmark in South Mumbai. During Navratri, the temple attracts thousands of devotees.",
    descriptionHi: "महालक्ष्मी मंदिर मुंबई के सबसे प्रसिद्ध मंदिरों में से एक है जो 1785 के आसपास बनाया गया था। मंदिर में तीन मूर्तियां हैं - महालक्ष्मी, महाकाली और महासरस्वती।",
    deity: "Mahalakshmi (Shakti)",
    establishedYear: "1785 CE",
    templeType: "Historic",
    speciality: "Three Goddesses, Arabian Sea view, Mumbai landmark",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Mahalaxmi_Temple_Mumbai.jpg/1200px-Mahalaxmi_Temple_Mumbai.jpg",
    phone: "022-2352-5965",
    status: "approved"
  },
  {
    title: "Kanaka Durga Temple",
    location: "Indrakeeladri Hill, Vijayawada, Andhra Pradesh",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "520001",
    description: "Kanaka Durga Temple is located on Indrakeeladri Hill on the banks of Krishna River. This ancient temple is where the back of Goddess Sati fell. The temple is dedicated to Goddess Kanaka Durga in her supreme form with eight arms. The Navaratri celebrations here are grand and attract devotees from across India. The temple provides a magnificent view of Vijayawada city and the Krishna River. The deity changes her attire according to different times of the day.",
    descriptionHi: "कनक दुर्गा मंदिर कृष्णा नदी के तट पर इंद्रकीलाद्रि पहाड़ी पर स्थित है। यह प्राचीन मंदिर वह स्थान है जहां देवी सती की पीठ गिरी थी।",
    deity: "Kanaka Durga (Shakti)",
    establishedYear: "Ancient (8th-9th Century)",
    templeType: "Ancient",
    speciality: "Krishna River location, changing attire tradition",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "4:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Kanaka_Durga_Temple_Vijayawada.jpg/1200px-Kanaka_Durga_Temple_Vijayawada.jpg",
    phone: "0866-2577766",
    status: "approved"
  },
  {
    title: "Shringeri Sharadamba Temple",
    location: "Shringeri, Chikmagalur, Karnataka",
    city: "Shringeri",
    state: "Karnataka",
    country: "India",
    pincode: "577139",
    description: "Shringeri Sharadamba Temple is one of the four Advaita Vedanta mathas established by Adi Shankaracharya. The temple is dedicated to Goddess Saraswati as Sharadamba. Originally established in 8th century, the temple houses a sandalwood idol installed by Shankaracharya. The temple is situated on the banks of river Tunga in the Western Ghats. The serene location surrounded by forests makes it a perfect place for spiritual learning and meditation.",
    descriptionHi: "शृंगेरी शारदाम्बा मंदिर आदि शंकराचार्य द्वारा स्थापित चार अद्वैत वेदांत मठों में से एक है। मंदिर देवी सरस्वती को शारदाम्बा के रूप में समर्पित है।",
    deity: "Sharadamba (Saraswati)",
    establishedYear: "8th Century CE",
    templeType: "Ancient",
    speciality: "Shankaracharya's matha, Tunga river location",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:30 AM - 1:00 PM, 3:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Sharadamba_Temple_Shringeri.jpg/1200px-Sharadamba_Temple_Shringeri.jpg",
    phone: "08265-250012",
    status: "approved"
  },
  {
    title: "Bhadrakali Temple Warangal",
    location: "Hanamkonda, Warangal, Telangana",
    city: "Warangal",
    state: "Telangana",
    country: "India",
    pincode: "506001",
    description: "Bhadrakali Temple in Warangal is dedicated to Goddess Bhadrakali, built between a boulder and a hillock. The temple dates back to the Chalukya period around 625 CE. The idol is carved from a single stone and depicts the Goddess in a fierce warrior form. The temple lake nearby is believed to have healing properties. This Shakti Peeth holds great significance in Telangana's cultural heritage. The temple architecture reflects the ancient Kakatiya dynasty style.",
    descriptionHi: "वारंगल में भद्रकाली मंदिर देवी भद्रकाली को समर्पित है जो एक चट्टान और पहाड़ी के बीच बना है। मंदिर चालुक्य काल का है जो लगभग 625 ईस्वी का है।",
    deity: "Bhadrakali (Shakti)",
    establishedYear: "625 CE",
    templeType: "Ancient",
    speciality: "Single stone idol, Kakatiya architecture",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bhadrakali_Temple_Warangal.jpg/1200px-Bhadrakali_Temple_Warangal.jpg",
    phone: "0870-2428252",
    status: "approved"
  },
  {
    title: "Bhramaramba Mallikarjuna Temple",
    location: "Srisailam, Kurnool, Andhra Pradesh",
    city: "Srisailam",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "518101",
    description: "Bhramaramba Temple is part of the Srisailam temple complex, one of the rare places combining both Jyotirlinga and Shakti Peeth. The temple is dedicated to Goddess Bhramaramba, where the neck of Goddess Sati fell. The temple is surrounded by Nallamala forests and wildlife. The Dravidian architecture with intricate carvings is magnificent. The temple is an important pilgrimage site mentioned in ancient scriptures. The Krishna River flows nearby adding to the spiritual atmosphere.",
    descriptionHi: "भ्रामरांबा मंदिर श्रीशैलम मंदिर परिसर का हिस्सा है, जो ज्योतिर्लिंग और शक्तिपीठ दोनों को संयोजित करने वाले दुर्लभ स्थानों में से एक है।",
    deity: "Bhramaramba (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Jyotirlinga and Shakti Peeth combined",
    categories: ["Shakti Peeth (51 Shakti Peethas)", "Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "4:30 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Bhramaramba_Temple_Srisailam.jpg/1200px-Bhramaramba_Temple_Srisailam.jpg",
    phone: "08524-287333",
    status: "approved"
  },
  {
    title: "Kumari Amman Temple",
    location: "Kanyakumari, Tamil Nadu",
    city: "Kanyakumari",
    state: "Tamil Nadu",
    country: "India",
    pincode: "629702",
    description: "Kumari Amman Temple is located at the southernmost tip of India where three seas meet. The temple is dedicated to Goddess Kumari, the virgin form of Parvati. According to legend, the Goddess performed penance here to marry Lord Shiva. The temple is located on the seashore offering stunning ocean views. The diamond nose ring of the deity is said to be visible from the sea. The temple is an important pilgrimage site and tourist attraction in Tamil Nadu.",
    descriptionHi: "कुमारी अम्मन मंदिर भारत के सबसे दक्षिणी छोर पर स्थित है जहां तीन समुद्र मिलते हैं। मंदिर देवी कुमारी को समर्पित है जो पार्वती का कुंवारी रूप है।",
    deity: "Kumari Amman (Shakti)",
    establishedYear: "Ancient (3000 years old)",
    templeType: "Ancient",
    speciality: "Southernmost temple, three seas confluence",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "4:30 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kumari_Amman_Temple.jpg/1200px-Kumari_Amman_Temple.jpg",
    phone: "04652-246243",
    status: "approved"
  }
];

async function addShaktiPeethPart1() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Shakti Peeth temples - Part 1 (17 temples)...\n');
    
    for (let i = 0; i < shaktiPeethPart1.length; i++) {
      const templeData = shaktiPeethPart1[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Part 1 complete - 17 Shakti Peeth temples added!');
    console.log('\nNext: Run part 2 script for next 17 temples');
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addShaktiPeethPart1();
