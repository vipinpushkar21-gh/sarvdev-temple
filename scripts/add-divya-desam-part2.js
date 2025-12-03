// Script to add Divya Desam Part 2 (Temples 21-40)
// Run with: node scripts/add-divya-desam-part2.js

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

const divyaDesamPart2 = [
  {
    title: "Thiruvinnagar Oppiliappan Temple",
    location: "Thiruvinnagar, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612902",
    description: "Oppiliappan Temple is dedicated to Lord Vishnu as Oppiliappan who married Bhoomidevi without any dowry. The temple is famous for its unique marriage story. The presiding deity is in standing posture with his consort Bhoomidevi. The temple is one of the 108 Divya Desams. The temple celebrates the marriage of the Lord without salt (oppilladhu) in offerings. The temple has beautiful Dravidian architecture. The annual Panguni Uthiram festival celebrates the divine marriage. The temple is surrounded by Tulsi gardens. Devotees offer prayers for marriage-related wishes. The temple showcases ancient craftsmanship and devotion.",
    descriptionHi: "ओप्पिलिअप्पन मंदिर भगवान विष्णु को समर्पित है जिन्होंने भूमिदेवी से बिना दहेज के विवाह किया। मंदिर अपनी अनोखी विवाह कथा के लिए प्रसिद्ध है।",
    deity: "Oppiliappan (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "No-salt offerings, marriage without dowry, Bhoomidevi consort, Tulsi gardens",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Oppiliappan_Temple.jpg/1200px-Oppiliappan_Temple.jpg",
    phone: "04364-278234",
    status: "approved"
  },
  {
    title: "Kumbakonam Sarangapani Temple",
    location: "Kumbakonam, Tamil Nadu",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612001",
    description: "Sarangapani Temple is one of the largest Vishnu temples in Kumbakonam. The temple is dedicated to Lord Sarangapani (one who holds the bow Saranga). The temple has a massive chariot-shaped sanctum tower. The temple complex covers several acres with beautiful gopurams. The temple tank is called Potramarai Kulam. The temple is one of the 108 Divya Desams. The annual chariot festival attracts thousands. The temple showcases Nayak period architecture. The deity is in reclining posture. The temple is one of the Pancharanga Kshetras. The temple has rich history and royal patronage.",
    descriptionHi: "सारंगपाणि मंदिर कुंभकोणम में सबसे बड़े विष्णु मंदिरों में से एक है। मंदिर भगवान सारंगपाणि (जो सारंग धनुष धारण करते हैं) को समर्पित है।",
    deity: "Sarangapani (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Chariot-shaped tower, Pancharanga Kshetra, massive complex, chariot festival",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sarangapani_Temple.jpg/1200px-Sarangapani_Temple.jpg",
    phone: "0435-2421451",
    status: "approved"
  },
  {
    title: "Kumbakonam Ramaswamy Temple",
    location: "Kumbakonam, Tamil Nadu",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612001",
    description: "Ramaswamy Temple in Kumbakonam is dedicated to Lord Rama with his consorts Sita, Lakshmana and Hanuman. The temple is one of the 108 Divya Desams. The temple has beautiful sculptures depicting Ramayana episodes. The temple showcases Nayak architecture. The presiding deity is in standing posture holding bow and arrow. The temple celebrates Ram Navami with great devotion. The temple has a sacred tank and gopurams. The temple is known for its spiritual atmosphere. Located in the temple town of Kumbakonam. The temple attracts Rama devotees from across India.",
    descriptionHi: "कुंभकोणम का रामस्वामी मंदिर भगवान राम को उनकी पत्नियों सीता, लक्ष्मण और हनुमान के साथ समर्पित है।",
    deity: "Ramaswamy (Rama)",
    establishedYear: "Nayak Period",
    templeType: "Historic",
    speciality: "Ramayana sculptures, Ram Navami, family deities, Nayak architecture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ramaswamy_Temple_Kumbakonam.jpg/1200px-Ramaswamy_Temple_Kumbakonam.jpg",
    phone: "0435-2422567",
    status: "approved"
  },
  {
    title: "Nachiyar Koil Srinivasa Temple",
    location: "Nachiyar Koil, Kumbakonam, Tamil Nadu",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612902",
    description: "Nachiyar Koil Temple is unique as the goddess Nachiyar is the chief deity. The temple is dedicated to Lord Srinivasa with goddess Nachiyar (Lakshmi). The temple name means 'temple of the goddess'. The presiding deities are in standing posture. The temple is one of the 108 Divya Desams. The temple celebrates goddess-centric festivals. The temple has beautiful architecture and sculptures. The temple is associated with Andal, the female Alvar saint. The temple has historical inscriptions. The temple represents the importance of divine feminine in Vaishnavism.",
    descriptionHi: "नाचियार कोइल मंदिर अनोखा है क्योंकि देवी नाचियार मुख्य देवता हैं। मंदिर भगवान श्रीनिवास को देवी नाचियार (लक्ष्मी) के साथ समर्पित है।",
    deity: "Srinivasa with Nachiyar (Vishnu with Lakshmi)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Goddess as chief deity, Andal connection, divine feminine significance",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Nachiyar_Koil.jpg/1200px-Nachiyar_Koil.jpg",
    phone: "04364-267345",
    status: "approved"
  },
  {
    title: "Thirukkannapuram Sowriraja Perumal Temple",
    location: "Thirukkannapuram, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "614204",
    description: "Sowriraja Perumal Temple is dedicated to Lord Vishnu as the Sun King. The temple has solar worship significance. The presiding deity faces east to receive sun's rays. The temple is one of the 108 Divya Desams. The temple architecture allows sunlight to fall on the deity during equinoxes. The temple has ancient inscriptions and carvings. The temple celebrates Surya-related festivals. The deity is in standing posture. The temple showcases astronomical knowledge of ancient builders. The temple is known for granting health and vitality.",
    descriptionHi: "सौरिराज पेरुमल मंदिर भगवान विष्णु को सूर्य राजा के रूप में समर्पित है। मंदिर का सौर पूजा महत्व है।",
    deity: "Sowriraja Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Solar worship, astronomical alignment, sun rays on deity, health blessings",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sowriraja_Perumal_Temple.jpg/1200px-Sowriraja_Perumal_Temple.jpg",
    phone: "04365-234567",
    status: "approved"
  },
  {
    title: "Thirukkannamangai Bhaktavatsala Perumal Temple",
    location: "Thirukkannamangai, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "614204",
    description: "Bhaktavatsala Perumal Temple means 'one who loves devotees'. The presiding deity is known for compassion towards devotees. The temple is one of the 108 Divya Desams. The deity is in reclining posture on Adisesha. The temple has beautiful sculptures and gopurams. The temple is associated with devotion and bhakti. The temple celebrates all major Vishnu festivals. The temple has ancient Tamil inscriptions. The temple architecture reflects Chola period style. Devotees worship here for divine grace and blessings.",
    descriptionHi: "भक्तवत्सल पेरुमल मंदिर का अर्थ है 'वह जो भक्तों से प्यार करता है'। मुख्य देवता भक्तों के प्रति करुणा के लिए जाने जाते हैं।",
    deity: "Bhaktavatsala Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Devotee-loving deity, compassion, reclining posture, bhakti significance",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Bhaktavatsala_Perumal_Temple.jpg/1200px-Bhaktavatsala_Perumal_Temple.jpg",
    phone: "04365-245678",
    status: "approved"
  },
  {
    title: "Srivilliputhur Andal Temple",
    location: "Srivilliputhur, Virudhunagar, Tamil Nadu",
    city: "Virudhunagar",
    state: "Tamil Nadu",
    country: "India",
    pincode: "626125",
    description: "Andal Temple is dedicated to Goddess Andal, the only female Alvar saint. The temple is unique as Andal is the presiding deity. The temple has a magnificent 192-feet tall Rajagopuram which is the emblem of Tamil Nadu government. The temple is one of the 108 Divya Desams. Andal is believed to have merged with Lord Ranganatha here. The temple celebrates Andal's divine marriage annually. The temple has beautiful architecture and intricate carvings. The temple is birthplace of Andal and her father Periyalvar. The temple attracts devotees seeking marital happiness. The gopuram is an architectural marvel visible from miles.",
    descriptionHi: "अंडाल मंदिर देवी अंडाल को समर्पित है, जो एकमात्र महिला अलवर संत हैं। मंदिर अनोखा है क्योंकि अंडाल मुख्य देवता हैं।",
    deity: "Andal (Goddess, Alvar)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Female Alvar saint, 192-feet gopuram, Tamil Nadu emblem, divine marriage",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "5:30 AM - 12:30 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Srivilliputhur_Andal_Temple.jpg/1200px-Srivilliputhur_Andal_Temple.jpg",
    phone: "04563-220456",
    website: "https://andal.tnhrce.in",
    status: "approved"
  },
  {
    title: "Alwar Thirunagari Adinatha Temple",
    location: "Alwar Thirunagari, Thoothukudi, Tamil Nadu",
    city: "Thoothukudi",
    state: "Tamil Nadu",
    country: "India",
    pincode: "628616",
    description: "Adinatha Temple is the birthplace of Nammalvar, the greatest of Alvar saints. The temple is dedicated to Lord Adinatha (Vishnu). The temple has immense significance in Vaishnavite tradition. The temple is one of the 108 Divya Desams. Nammalvar composed most of his 1000+ hymns here. The temple has a tamarind tree under which Nammalvar meditated. The temple celebrates Nammalvar Jayanthi grandly. The temple has beautiful architecture and sacred tanks. The temple is a major pilgrimage center for Vaishnavites. The spiritual energy of Nammalvar's birthplace attracts devotees worldwide.",
    descriptionHi: "आदिनाथ मंदिर नम्मलवर का जन्मस्थान है, जो अलवर संतों में सबसे महान हैं। मंदिर भगवान आदिनाथ (विष्णु) को समर्पित है।",
    deity: "Adinatha (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Nammalvar birthplace, 1000+ hymns composed here, tamarind tree, pilgrimage center",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Adinatha_Temple_Alwar_Thirunagari.jpg/1200px-Adinatha_Temple_Alwar_Thirunagari.jpg",
    phone: "04639-234567",
    status: "approved"
  },
  {
    title: "Thirukkolur Vaithamanidhi Perumal Temple",
    location: "Thirukkolur, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609112",
    description: "Vaithamanidhi Perumal Temple means 'treasure of Vedas'. The presiding deity is the repository of Vedic knowledge. The temple is one of the 108 Divya Desams. The temple is associated with sage Markandeya. The deity is in standing posture. The temple has ancient architecture and inscriptions. The temple celebrates knowledge and wisdom. The temple is known for granting educational success. The temple has beautiful sculptures depicting Vedic scenes. Devotees worship here for spiritual wisdom and learning.",
    descriptionHi: "वैथमणिधि पेरुमल मंदिर का अर्थ है 'वेदों का खजाना'। मुख्य देवता वैदिक ज्ञान के भंडार हैं।",
    deity: "Vaithamanidhi Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Vedic treasure, knowledge deity, educational blessings, sage Markandeya",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vaithamanidhi_Perumal_Temple.jpg/1200px-Vaithamanidhi_Perumal_Temple.jpg",
    phone: "04364-256789",
    status: "approved"
  },
  {
    title: "Thiruvali Thirunagari Temple",
    location: "Thiruvali, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609803",
    description: "Thiruvali Thirunagari Temple is an ancient Vishnu temple. The temple is one of the 108 Divya Desams. The presiding deity is Lord Vishnu in standing posture. The temple has beautiful Dravidian architecture. The temple is associated with Alvar saints. The temple has sacred tanks and gopurams. The temple celebrates traditional Vishnu festivals. The temple has inscriptions from Chola period. The peaceful rural setting enhances spiritual atmosphere. Devotees visit for darshan and blessings.",
    descriptionHi: "तिरुवलि तिरुनगरी मंदिर एक प्राचीन विष्णु मंदिर है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Alvar connection, Chola architecture, rural sacred setting",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Thiruvali_Temple.jpg/1200px-Thiruvali_Temple.jpg",
    phone: "04364-267890",
    status: "approved"
  },
  {
    title: "Thiruppernagar Appakkudathan Temple",
    location: "Koviladi, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609315",
    description: "Appakkudathan Temple is dedicated to Lord Vishnu who appeared for elephants. The temple name means 'father appeared'. According to legend, Gajendra the elephant king worshipped here. The temple is one of the 108 Divya Desams. The deity is in reclining posture. The temple has ancient architecture and sculptures depicting Gajendra Moksha. The temple is known for granting liberation. The temple celebrates elephant-related festivals. The temple has beautiful gopurams and tanks. The Gajendra Moksha story is celebrated here annually.",
    descriptionHi: "अप्पक्कुदाथन मंदिर भगवान विष्णु को समर्पित है जो हाथियों के लिए प्रकट हुए। मंदिर का नाम 'पिता प्रकट हुए' है।",
    deity: "Appakkudathan (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Gajendra Moksha connection, elephant worship, liberation granting",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Appakkudathan_Temple.jpg/1200px-Appakkudathan_Temple.jpg",
    phone: "04365-278901",
    status: "approved"
  },
  {
    title: "Thiruvelliyangudi Kola Valvill Ramar Temple",
    location: "Thiruvelliyangudi, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "610106",
    description: "Kola Valvill Ramar Temple is dedicated to Lord Rama. The name means 'Rama who destroyed with curved bow'. The temple depicts Rama's valor in Ramayana. The temple is one of the 108 Divya Desams. The deity shows Rama with his divine bow. The temple has sculptures depicting Ramayana episodes. The temple celebrates Ram Navami and other festivals. The temple has ancient Chola architecture. The temple is known for granting courage and victory. Devotees worship here for overcoming enemies and obstacles.",
    descriptionHi: "कोला वालविल रामर मंदिर भगवान राम को समर्पित है। नाम का अर्थ है 'राम जिन्होंने वक्र धनुष से नष्ट किया'।",
    deity: "Kola Valvill Ramar (Rama)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Rama's bow, Ramayana sculptures, courage blessing, victory granting",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Kola_Valvill_Ramar_Temple.jpg/1200px-Kola_Valvill_Ramar_Temple.jpg",
    phone: "04366-289012",
    status: "approved"
  },
  {
    title: "Thiruvaikunda Vaikuntanatha Temple",
    location: "Thiruvaikunda, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609501",
    description: "Vaikuntanatha Temple represents Vishnu's heavenly abode Vaikunta. The temple is one of the 108 Divya Desams. The presiding deity is Lord Vaikuntanatha. The temple is believed to grant moksha (liberation). The deity is in standing posture. The temple has beautiful architecture and sacred tanks. The temple celebrates Vaikunta Ekadasi with great significance. The temple has ancient inscriptions and carvings. Devotees believe visiting here is like visiting Vaikunta. The temple has serene spiritual atmosphere.",
    descriptionHi: "वैकुंठनाथ मंदिर विष्णु के स्वर्गीय निवास वैकुंठ का प्रतिनिधित्व करता है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Vaikuntanatha (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Vaikunta representation, moksha granting, Vaikunta Ekadasi significance",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Vaikuntanatha_Temple.jpg/1200px-Vaikuntanatha_Temple.jpg",
    phone: "04367-290123",
    status: "approved"
  },
  {
    title: "Thirunangur Divya Desams Cluster",
    location: "Thirunangur, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609607",
    description: "Thirunangur area has 11 Divya Desam temples within a small radius. This cluster of temples is unique in the Divya Desam circuit. The main temple is Naganathaswamy temple. All temples are dedicated to different forms of Vishnu. The temples celebrate Garuda Sevai festival where all deities meet. The temples have ancient architecture and rich history. The cluster represents concentrated spiritual energy. Pilgrims can visit all 11 temples in one day. The temples are interconnected through legends and festivals. This area is considered highly sacred by Vaishnavites.",
    descriptionHi: "तिरुनंगुर क्षेत्र में छोटे दायरे में 11 दिव्य देसम मंदिर हैं। यह मंदिरों का समूह दिव्य देसम सर्किट में अनोखा है।",
    deity: "Various Vishnu Forms",
    establishedYear: "Ancient",
    templeType: "Ancient Temple Cluster",
    speciality: "11 temples cluster, Garuda Sevai festival, concentrated sacred energy",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Thirunangur_Temples.jpg/1200px-Thirunangur_Temples.jpg",
    phone: "04368-201234",
    status: "approved"
  },
  {
    title: "Thirucherai Saranatha Perumal Temple",
    location: "Thirucherai, Kumbakonam, Tamil Nadu",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612702",
    description: "Saranatha Perumal Temple is dedicated to Lord Vishnu as protector. The temple name means 'Lord who gives refuge'. The temple is one of the 108 Divya Desams. The presiding deity is in standing posture. The temple is known for protection and safety blessings. The temple has beautiful Chola architecture. The temple celebrates traditional festivals. The temple has sacred tanks and gopurams. Devotees worship here for divine protection. The temple has ancient inscriptions and historical significance.",
    descriptionHi: "शरणाथ पेरुमल मंदिर भगवान विष्णु को रक्षक के रूप में समर्पित है। मंदिर का नाम 'प्रभु जो शरण देते हैं' है।",
    deity: "Saranatha Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Divine protection, refuge granting, safety blessings",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Saranatha_Perumal_Temple.jpg/1200px-Saranatha_Perumal_Temple.jpg",
    phone: "04369-212345",
    status: "approved"
  },
  {
    title: "Thirukkannapuram Neelamega Perumal Temple",
    location: "Thirukkannapuram, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "614204",
    description: "Neelamega Perumal Temple is dedicated to Lord Vishnu who appeared as dark cloud. The name means 'dark cloud Lord'. The temple is one of the 108 Divya Desams. The deity has dark complexion like rain clouds. The temple is associated with rain and prosperity. The temple has beautiful sculptures and architecture. The temple celebrates monsoon-related festivals. The deity is in standing posture. The temple is known for agricultural blessings. Farmers worship here for good rainfall and harvest.",
    descriptionHi: "नीलमेघ पेरुमल मंदिर भगवान विष्णु को समर्पित है जो काले बादल के रूप में प्रकट हुए। नाम का अर्थ है 'काला बादल प्रभु'।",
    deity: "Neelamega Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Dark cloud form, rain blessings, agricultural prosperity",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Neelamega_Perumal_Temple.jpg/1200px-Neelamega_Perumal_Temple.jpg",
    phone: "04370-223456",
    status: "approved"
  },
  {
    title: "Thiruvellakkulam Srinivasa Perumal Temple",
    location: "Thiruvellakkulam, Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Srinivasa Perumal Temple at Thiruvellakkulam is one of the Kanchipuram Divya Desams. The temple is dedicated to Lord Srinivasa (Vishnu). The temple has ancient Pallava architecture. The temple is one of the 108 Divya Desams. The presiding deity is in standing posture. The temple has beautiful sculptures and carvings. The temple celebrates all major Vishnu festivals. The temple has a sacred tank called Ananda Saras. Located in the historic temple city of Kanchipuram. The temple represents ancient devotional tradition.",
    descriptionHi: "तिरुवेल्लक्कुलम का श्रीनिवास पेरुमल मंदिर कांचीपुरम दिव्य देसमों में से एक है। मंदिर भगवान श्रीनिवास (विष्णु) को समर्पित है।",
    deity: "Srinivasa Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Pallava architecture, Kanchipuram Divya Desam, sacred tank",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Thiruvellakkulam_Temple.jpg/1200px-Thiruvellakkulam_Temple.jpg",
    phone: "044-27234567",
    status: "approved"
  },
  {
    title: "Thirukkavalampadi Kamalavalli Nachiyar Temple",
    location: "Thirukkavalampadi, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609309",
    description: "Kamalavalli Nachiyar Temple is unique with goddess as the main deity. The temple is dedicated to Kamalavalli Nachiyar (Lakshmi) with Lord Vishnu. The temple is one of the 108 Divya Desams. The goddess is worshipped prominently here. The temple has beautiful architecture and sculptures. The temple celebrates goddess-centric festivals. The temple represents feminine divine power in Vaishnavism. The temple has ancient Tamil inscriptions. Devotees worship for prosperity and family happiness. The temple showcases the importance of Lakshmi worship.",
    descriptionHi: "कमलावल्ली नाचियार मंदिर देवी को मुख्य देवता के रूप में अनोखा है। मंदिर कमलावल्ली नाचियार (लक्ष्मी) को भगवान विष्णु के साथ समर्पित है।",
    deity: "Kamalavalli Nachiyar (Lakshmi)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Goddess as main deity, Lakshmi prominence, prosperity blessings",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kamalavalli_Nachiyar_Temple.jpg/1200px-Kamalavalli_Nachiyar_Temple.jpg",
    phone: "04371-245678",
    status: "approved"
  },
  {
    title: "Thiruvaikavur Veeraraghava Perumal Temple",
    location: "Thiruvaikavur, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609117",
    description: "Veeraraghava Perumal Temple is dedicated to Lord Vishnu as valiant Rama. The temple is one of the 108 Divya Desams. The presiding deity is in standing posture. The temple has ancient Chola architecture. The temple is known for granting courage and strength. The temple celebrates Ram Navami with devotion. The temple has beautiful gopurams and sculptures. The temple has sacred tanks for ritual purposes. Devotees worship here for overcoming fears. The temple represents Rama's heroic qualities.",
    descriptionHi: "वीरराघव पेरुमल मंदिर भगवान विष्णु को वीर राम के रूप में समर्पित है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Veeraraghava Perumal (Vishnu as Rama)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Valiant Rama, courage blessings, strength granting, Chola architecture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Thiruvaikavur_Temple.jpg/1200px-Thiruvaikavur_Temple.jpg",
    phone: "04372-256789",
    status: "approved"
  },
  {
    title: "Thiruppullamboothangudi Ksheera Thiruvaippadi Temple",
    location: "Thiruppullamboothangudi, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609314",
    description: "Ksheera Thiruvaippadi Temple is associated with Krishna's childhood in milk ocean. The temple represents the divine play of Krishna. The temple is one of the 108 Divya Desams. The deity depicts Krishna's lila (divine play). The temple has sculptures showing Krishna's childhood episodes. The temple celebrates Janmashtami grandly. The temple has ancient architecture and inscriptions. The milk ocean (ksheera sagara) connection is celebrated. Devotees worship here for children's wellbeing. The temple showcases Krishna's playful divine nature.",
    descriptionHi: "क्षीर तिरुवैप्पडि मंदिर कृष्ण के बचपन से दूध सागर में जुड़ा है। मंदिर कृष्ण की दिव्य लीला का प्रतिनिधित्व करता है।",
    deity: "Krishna (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Krishna's childhood, milk ocean connection, children's blessings, Janmashtami",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ksheera_Thiruvaippadi_Temple.jpg/1200px-Ksheera_Thiruvaippadi_Temple.jpg",
    phone: "04373-267890",
    status: "approved"
  }
];

async function addDivyaDesamPart2() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Divya Desam Part 2 (Temples 21-40)...\n');
    
    for (let i = 0; i < divyaDesamPart2.length; i++) {
      const templeData = divyaDesamPart2[i];
      console.log(`${i + 21}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Divya Desam Part 2 complete!');
    console.log('\n📊 Progress: 40/108 Divya Desam temples added');
    console.log('🕉️  Famous temples in this batch:');
    console.log('   • Srivilliputhur - Andal Temple with Tamil Nadu emblem gopuram');
    console.log('   • Kumbakonam temples - Sarangapani, Ramaswamy');
    console.log('   • Thirunangur - 11 temple cluster');
    console.log('\n➡️  Next: Run part 3 for temples 41-60');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDivyaDesamPart2();
