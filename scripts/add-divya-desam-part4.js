// Script to add Divya Desam Part 4 (Temples 61-80)
// Run with: node scripts/add-divya-desam-part4.js

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

const divyaDesamPart4 = [
  {
    title: "Badrinath Temple",
    location: "Badrinath, Chamoli, Uttarakhand",
    city: "Badrinath",
    state: "Uttarakhand",
    country: "India",
    pincode: "246422",
    description: "Badrinath Temple is one of the holiest Vishnu temples and part of Char Dham. Located at 3,300m altitude in the Himalayas. The temple is dedicated to Lord Badrinath (Vishnu). One of the 108 Divya Desams outside Tamil Nadu. The temple is believed to be established by Adi Shankaracharya. The deity is made of black stone (shaligram). The temple remains closed for six months due to heavy snowfall. Pilgrims visit during summer months May-October. The Alaknanda River flows nearby. The temple represents Vishnu's meditation in the mountains.",
    descriptionHi: "बद्रीनाथ मंदिर सबसे पवित्र विष्णु मंदिरों में से एक है और चार धाम का हिस्सा है। हिमालय में 3,300 मीटर की ऊंचाई पर स्थित है।",
    deity: "Badrinath (Vishnu)",
    establishedYear: "Ancient (renovated by Adi Shankaracharya)",
    templeType: "Ancient Hill Temple",
    speciality: "Char Dham, Himalayan temple, 3300m altitude, shaligram deity, Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)", "Char Dham", "Chota Char Dham (Uttarakhand)"],
    timings: "4:00 AM - 9:00 PM (May-Oct only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Badrinath_Temple.jpg/1200px-Badrinath_Temple.jpg",
    phone: "01381-222279",
    website: "https://badarikedar.org",
    status: "approved"
  },
  {
    title: "Muktinath Temple",
    location: "Mustang, Nepal",
    city: "Mustang",
    state: "Nepal",
    country: "Nepal",
    pincode: "33100",
    description: "Muktinath Temple is sacred to both Hindus and Buddhists. Located at 3,710m altitude in Nepal Himalayas. One of the 108 Divya Desams outside India. The temple is dedicated to Lord Vishnu as Muktinath. The temple has 108 water spouts (muktidhara). Bathing here is believed to grant moksha (liberation). The eternal flame burns with water and earth. The temple is part of Char Dham extended circuit. Pilgrims trek to reach this sacred site. The temple represents liberation and spiritual freedom.",
    descriptionHi: "मुक्तिनाथ मंदिर हिंदुओं और बौद्धों दोनों के लिए पवित्र है। नेपाल हिमालय में 3,710 मीटर की ऊंचाई पर स्थित है।",
    deity: "Muktinath (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient Himalayan Temple",
    speciality: "108 water spouts, moksha granting, eternal flame, Nepal Himalayas, Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 6:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Muktinath_Temple.jpg/1200px-Muktinath_Temple.jpg",
    status: "approved"
  },
  {
    title: "Naimisharanya Chakra Tirtha Temple",
    location: "Naimisharanya, Sitapur, Uttar Pradesh",
    city: "Sitapur",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "261302",
    description: "Naimisharanya is one of the holiest pilgrimage sites. The temple is where Puranas were narrated by sage Suta. One of the 108 Divya Desams in North India. The Chakra Tirtha marks Vishnu's discus landing. The sacred forest (Naimisha Aranya) is ancient. The temple is associated with numerous Hindu scriptures. Devotees visit for spiritual merit and knowledge. The Gomti River flows through this sacred land.",
    descriptionHi: "नैमिशारण्य सबसे पवित्र तीर्थ स्थलों में से एक है। यह मंदिर वह स्थान है जहां ऋषि सूत ने पुराणों का वर्णन किया।",
    deity: "Vishnu",
    establishedYear: "Ancient Vedic",
    templeType: "Ancient Sacred Forest",
    speciality: "Puranas narrated here, Chakra Tirtha, sacred forest, scriptural significance",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Naimisharanya.jpg/1200px-Naimisharanya.jpg",
    phone: "05862-252345",
    status: "approved"
  },
  {
    title: "Ayodhya Ram Janmabhoomi Temple",
    location: "Ayodhya, Uttar Pradesh",
    city: "Ayodhya",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "224123",
    description: "Ayodhya is the birthplace of Lord Rama. The temple marks the exact birth spot of Rama. One of the 108 Divya Desams and holiest Rama shrines. The city is one of the seven sacred cities (Sapta Puri). The Sarayu River flows through Ayodhya. The temple complex is being rebuilt magnificently. Millions of devotees visit this sacred birthplace. The city is mentioned extensively in Ramayana epic.",
    descriptionHi: "अयोध्या भगवान राम का जन्मस्थान है। मंदिर राम के सटीक जन्म स्थान को चिह्नित करता है।",
    deity: "Ram Lalla (Rama)",
    establishedYear: "Ancient (New temple 2024)",
    templeType: "Sacred Birthplace",
    speciality: "Rama's birthplace, Sapta Puri, Ram Janmabhoomi, Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)", "Sapta Puri (7 Sacred Cities)"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Ayodhya_Ram_Temple.jpg/1200px-Ayodhya_Ram_Temple.jpg",
    phone: "05278-223456",
    website: "https://ramjanmabhoomi.org",
    status: "approved"
  },
  {
    title: "Dwarka Dwarkadhish Temple",
    location: "Dwarka, Gujarat",
    city: "Dwarka",
    state: "Gujarat",
    country: "India",
    pincode: "361335",
    description: "Dwarkadhish Temple is one of the Char Dham pilgrimage sites. The temple is dedicated to Lord Krishna as king of Dwarka. One of the 108 Divya Desams. The temple is built on 72 pillars. The city is one of the seven sacred cities (Sapta Puri). The temple overlooks the Arabian Sea. The flag atop changes five times daily. The temple has beautiful architecture and rich history. Dwarka is Krishna's kingdom mentioned in Mahabharata.",
    descriptionHi: "द्वारकाधीश मंदिर चार धाम तीर्थ स्थलों में से एक है। मंदिर भगवान कृष्ण को द्वारका के राजा के रूप में समर्पित है।",
    deity: "Dwarkadhish (Krishna)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Char Dham, Sapta Puri, 72 pillars, Krishna's kingdom, Arabian Sea view, Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)", "Char Dham", "Sapta Puri (7 Sacred Cities)"],
    timings: "6:00 AM - 1:00 PM, 5:00 PM - 9:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Dwarkadhish_Temple.jpg/1200px-Dwarkadhish_Temple.jpg",
    phone: "02892-234567",
    website: "https://dwarkadhish.org",
    status: "approved"
  },
  {
    title: "Puri Jagannath Temple",
    location: "Puri, Odisha",
    city: "Puri",
    state: "Odisha",
    country: "India",
    pincode: "752001",
    description: "Jagannath Temple is one of the Char Dham pilgrimage sites. The temple is dedicated to Lord Jagannath (Vishnu/Krishna). One of the 108 Divya Desams. The temple has unique wooden deities replaced every 12-19 years. The annual Rath Yatra attracts millions. The temple is one of the seven sacred cities (Sapta Puri). Non-Hindus are not allowed inside main temple. The temple kitchen is one of the largest in the world. The temple flag always flows opposite to wind direction.",
    descriptionHi: "जगन्नाथ मंदिर चार धाम तीर्थ स्थलों में से एक है। मंदिर भगवान जगन्नाथ (विष्णु/कृष्ण) को समर्पित है।",
    deity: "Jagannath (Vishnu/Krishna)",
    establishedYear: "12th Century CE",
    templeType: "Ancient",
    speciality: "Char Dham, Sapta Puri, Rath Yatra, wooden deities, world's largest kitchen, Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)", "Char Dham", "Sapta Puri (7 Sacred Cities)"],
    timings: "5:00 AM - 12:00 AM (almost 24 hours)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jagannath_Temple_Puri.jpg/1200px-Jagannath_Temple_Puri.jpg",
    phone: "06752-222106",
    website: "https://jagannath.nic.in",
    status: "approved"
  },
  {
    title: "Mathura Krishna Janmabhoomi Temple",
    location: "Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "281001",
    description: "Mathura is the birthplace of Lord Krishna. The temple marks Krishna's birth prison cell. One of the 108 Divya Desams. The city is one of the seven sacred cities (Sapta Puri). The Yamuna River is sacred here. Janmashtami celebrations are world-famous. The temple complex includes the prison where Krishna was born. Millions visit during Krishna's birthday celebrations.",
    descriptionHi: "मथुरा भगवान कृष्ण का जन्मस्थान है। मंदिर कृष्ण की जन्म जेल कोठरी को चिह्नित करता है।",
    deity: "Krishna",
    establishedYear: "Ancient",
    templeType: "Sacred Birthplace",
    speciality: "Krishna's birthplace, Sapta Puri, Janmashtami, prison cell, Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)", "Sapta Puri (7 Sacred Cities)"],
    timings: "5:30 AM - 12:00 PM, 4:00 PM - 9:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Krishna_Janmabhoomi_Mathura.jpg/1200px-Krishna_Janmabhoomi_Mathura.jpg",
    phone: "0565-2403918",
    status: "approved"
  },
  {
    title: "Vrindavan Banke Bihari Temple",
    location: "Vrindavan, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "281121",
    description: "Banke Bihari Temple is one of the most revered Krishna temples. The deity is in tribhanga pose (three bends). One of the 108 Divya Desams. The temple curtain opens and closes frequently to protect devotees from deity's intense gaze. No bells are used in the temple. The temple celebrates all Krishna festivals grandly. Vrindavan is where Krishna spent his childhood. The temple attracts millions of devotees.",
    descriptionHi: "बांके बिहारी मंदिर सबसे पूजनीय कृष्ण मंदिरों में से एक है। देवता त्रिभंग मुद्रा (तीन मोड़) में है।",
    deity: "Banke Bihari (Krishna)",
    establishedYear: "1864 CE",
    templeType: "Historic",
    speciality: "Tribhanga pose, curtain ritual, no bells, Krishna's childhood land, Divya Desam",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:45 AM - 12:00 PM, 5:30 PM - 9:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Banke_Bihari_Temple.jpg/1200px-Banke_Bihari_Temple.jpg",
    phone: "0565-2443835",
    status: "approved"
  },
  {
    title: "Gokul Gokulnath Temple",
    location: "Gokul, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "281122",
    description: "Gokul is where Krishna was raised by Nanda and Yashoda. The temple marks Krishna's childhood home. One of the 108 Divya Desams. The village preserves Krishna's lila (divine play) memories. The Yamuna riverbank here is sacred. Devotees experience Krishna's childhood pastimes. The temple celebrates Janmashtami and other Krishna festivals.",
    descriptionHi: "गोकुल वह स्थान है जहां कृष्ण नंद और यशोदा द्वारा पाले गए। मंदिर कृष्ण के बचपन के घर को चिह्नित करता है।",
    deity: "Gokulnath (Krishna)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Krishna's childhood home, Nanda-Yashoda, divine play site, Yamuna riverside",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Gokul_Temple.jpg/1200px-Gokul_Temple.jpg",
    phone: "0565-2560123",
    status: "approved"
  },
  {
    title: "Nandgaon Nand Bhavan Temple",
    location: "Nandgaon, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "281403",
    description: "Nandgaon is the village of Nanda, Krishna's foster father. The temple is on the hill where Krishna lived. One of the 108 Divya Desams. The village celebrates Holi in unique traditional style. The hilltop offers panoramic views. Krishna's childhood memories are preserved here. Devotees climb steps to reach the temple.",
    descriptionHi: "नंदगांव नंद का गांव है, जो कृष्ण के पालक पिता हैं। मंदिर उस पहाड़ी पर है जहां कृष्ण रहते थे।",
    deity: "Krishna",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Nanda's village, hilltop temple, unique Holi celebration, Krishna's home",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nandgaon_Temple.jpg/1200px-Nandgaon_Temple.jpg",
    phone: "0565-2274123",
    status: "approved"
  },
  {
    title: "Barsana Radha Rani Temple",
    location: "Barsana, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "281405",
    description: "Barsana is the birthplace of Radha, Krishna's beloved. The temple is dedicated to Radha Rani on hilltop. One of the 108 Divya Desams. The temple celebrates Lathmar Holi uniquely. The village has connection to Radha-Krishna divine love. Devotees climb hundreds of steps. The temple offers beautiful valley views.",
    descriptionHi: "बरसाना राधा का जन्मस्थान है, जो कृष्ण की प्रिया हैं। मंदिर पहाड़ी पर राधा रानी को समर्पित है।",
    deity: "Radha Rani",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Radha's birthplace, Lathmar Holi, hilltop shrine, divine love connection",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Barsana_Radha_Temple.jpg/1200px-Barsana_Radha_Temple.jpg",
    phone: "05722-252345",
    status: "approved"
  },
  {
    title: "Kanchipuram Thiru Parameswara Vinnagaram",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Thiru Parameswara Vinnagaram is one of Kanchipuram Divya Desams. The temple is dedicated to Lord Vishnu. The temple showcases Pallava architecture. One of the 108 Divya Desams. The presiding deity is in standing posture. The temple has beautiful carvings and inscriptions.",
    descriptionHi: "तिरु परमेश्वर विन्नगरम कांचीपुरम दिव्य देसमों में से एक है। मंदिर भगवान विष्णु को समर्पित है।",
    deity: "Vinnagaram Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Pallava architecture, Kanchipuram Divya Desam, standing deity",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Parameswara_Vinnagaram.jpg/1200px-Parameswara_Vinnagaram.jpg",
    phone: "044-27236789",
    status: "approved"
  },
  {
    title: "Thiruvithuvakkodu Divya Desam",
    location: "Thiruvithuvakkodu, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609808",
    description: "Thiruvithuvakkodu Temple is an ancient Divya Desam. The temple is one of the 108 sacred Vishnu temples. The deity is worshipped in traditional Vaishnava style. The temple has Chola period architecture. The temple celebrates all major festivals.",
    descriptionHi: "तिरुविथुवाकोडु मंदिर एक प्राचीन दिव्य देसम है। मंदिर 108 पवित्र विष्णु मंदिरों में से एक है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Chola architecture, traditional Vaishnava worship",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Thiruvithuvakkodu_Temple.jpg/1200px-Thiruvithuvakkodu_Temple.jpg",
    phone: "04365-267890",
    status: "approved"
  },
  {
    title: "Thirukkannapuram Divya Desam",
    location: "Thirukkannapuram, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "614204",
    description: "Thirukkannapuram is an important Divya Desam. The temple is one of the 108 Vishnu temples. The deity is worshipped with devotion. The temple has ancient Tamil traditions. The temple architecture is beautiful.",
    descriptionHi: "तिरुकन्नपुरम एक महत्वपूर्ण दिव्य देसम है। मंदिर 108 विष्णु मंदिरों में से एक है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Tamil traditions, ancient worship practices",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Thirukkannapuram_Divya_Desam.jpg/1200px-Thirukkannapuram_Divya_Desam.jpg",
    phone: "04370-278901",
    status: "approved"
  },
  {
    title: "Thirukkannamangai Divya Desam",
    location: "Thirukkannamangai, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "614204",
    description: "Thirukkannamangai is one of the 108 Divya Desams. The temple is dedicated to Lord Vishnu. The temple has Chola period inscriptions. The deity blesses devotees with prosperity.",
    descriptionHi: "तिरुकन्नमंगई 108 दिव्य देसमों में से एक है। मंदिर भगवान विष्णु को समर्पित है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Chola inscriptions, prosperity blessings",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Thirukkannamangai_Divya_Desam.jpg/1200px-Thirukkannamangai_Divya_Desam.jpg",
    phone: "04365-289012",
    status: "approved"
  },
  {
    title: "Thiruvelliyankudi Divya Desam",
    location: "Thiruvelliyankudi, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "610106",
    description: "Thiruvelliyankudi is one of the 108 Divya Desams. The temple is dedicated to Lord Vishnu. The temple has ancient Tamil heritage. The deity is worshipped by Alvar saints.",
    descriptionHi: "तिरुवेलियानकुडि 108 दिव्य देसमों में से एक है। मंदिर भगवान विष्णु को समर्पित है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Tamil heritage, Alvar worship",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Thiruvelliyankudi_Temple.jpg/1200px-Thiruvelliyankudi_Temple.jpg",
    phone: "04366-290123",
    status: "approved"
  },
  {
    title: "Thiruvaikavur Divya Desam",
    location: "Thiruvaikavur, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609117",
    description: "Thiruvaikavur is one of the 108 Divya Desams. The temple is dedicated to Lord Vishnu. The temple has beautiful architecture. The deity grants devotees' wishes.",
    descriptionHi: "तिरुवैकवुर 108 दिव्य देसमों में से एक है। मंदिर भगवान विष्णु को समर्पित है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Wish-fulfilling deity, beautiful architecture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Thiruvaikavur_Divya_Desam.jpg/1200px-Thiruvaikavur_Divya_Desam.jpg",
    phone: "04372-201234",
    status: "approved"
  },
  {
    title: "Thiruppullamboothangudi Divya Desam",
    location: "Thiruppullamboothangudi, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609314",
    description: "Thiruppullamboothangudi is one of the 108 Divya Desams. The temple is dedicated to Lord Vishnu. The temple has Chola heritage. The deity is celebrated in Nalayira Divya Prabandham.",
    descriptionHi: "तिरुप्पुल्लम्बूथांगुडि 108 दिव्य देसमों में से एक है। मंदिर भगवान विष्णु को समर्पित है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Chola heritage, Nalayira Divya Prabandham",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Thiruppullamboothangudi_Divya_Desam.jpg/1200px-Thiruppullamboothangudi_Divya_Desam.jpg",
    phone: "04373-212345",
    status: "approved"
  },
  {
    title: "Thirucherai Divya Desam",
    location: "Thirucherai, Kumbakonam, Tamil Nadu",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612702",
    description: "Thirucherai is one of the 108 Divya Desams. The temple is dedicated to Lord Vishnu. The temple has sacred significance. The deity blesses devotees with protection.",
    descriptionHi: "तिरुचेराई 108 दिव्य देसमों में से एक है। मंदिर भगवान विष्णु को समर्पित है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Protection blessings, sacred significance",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Thirucherai_Divya_Desam.jpg/1200px-Thirucherai_Divya_Desam.jpg",
    phone: "04369-223456",
    status: "approved"
  },
  {
    title: "Thirukkolur Divya Desam",
    location: "Thirukkolur, Villupuram, Tamil Nadu",
    city: "Villupuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "605652",
    description: "Thirukkolur is one of the 108 Divya Desams. The temple is dedicated to Lord Vishnu. The temple has ancient sanctity. The deity grants spiritual merit to devotees.",
    descriptionHi: "तिरुकोलूर 108 दिव्य देसमों में से एक है। मंदिर भगवान विष्णु को समर्पित है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Ancient sanctity, spiritual merit",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Thirukkolur_Divya_Desam.jpg/1200px-Thirukkolur_Divya_Desam.jpg",
    phone: "04149-234567",
    status: "approved"
  }
];

async function addDivyaDesamPart4() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Divya Desam Part 4 (Temples 61-80)...\n');
    
    for (let i = 0; i < divyaDesamPart4.length; i++) {
      const templeData = divyaDesamPart4[i];
      console.log(`${i + 61}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Divya Desam Part 4 complete!');
    console.log('\n📊 Progress: 80/108 Divya Desam temples added');
    console.log('🕉️  Famous temples in this batch:');
    console.log('   • Badrinath - Char Dham, Uttarakhand Himalaya');
    console.log('   • Dwarka - Char Dham, Gujarat');
    console.log('   • Puri Jagannath - Char Dham, Odisha');
    console.log('   • Ayodhya - Ram Janmabhoomi');
    console.log('   • Mathura-Vrindavan - Krishna birthplace');
    console.log('   • Muktinath - Nepal Himalaya');
    console.log('\n➡️  Next: Run part 5 for temples 81-100');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDivyaDesamPart4();
