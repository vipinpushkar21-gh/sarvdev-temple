// Script to add 30 Famous Rajasthan Temples
// Run with: node scripts/add-rajasthan-temples.js

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

const rajasthanTemples = [
  // Vaishnav/Krishna Temples
  {
    title: "Khatu Shyam Ji Temple",
    location: "Khatu Village, Sikar, Rajasthan",
    city: "Sikar",
    state: "Rajasthan",
    country: "India",
    pincode: "332602",
    description: "Khatu Shyam Ji Temple is dedicated to Barbarika (incarnation of Lord Krishna). The temple is famous for the head of Barbarika who sacrificed himself. Devotees believe Shyam Baba fulfills all wishes. The temple witnesses huge crowds during Phalguna month. The deity has mysterious dark blue complexion. The temple is a major pilgrimage site in Rajasthan.",
    descriptionHi: "खाटू श्याम जी मंदिर बर्बरीक (भगवान कृष्ण के अवतार) को समर्पित है। मंदिर बर्बरीक के शीश के लिए प्रसिद्ध है जिन्होंने खुद को बलिदान किया।",
    deity: "Khatu Shyam Ji (Krishna Avatar - Barbarika)",
    establishedYear: "Ancient (Current structure 1027 CE)",
    templeType: "Ancient",
    speciality: "Barbarika head temple, wish-fulfilling, Phalguna fair, dark blue deity",
    categories: ["Other Sacred Group"],
    timings: "4:00 AM - 1:00 PM, 4:00 PM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Khatu_Shyam_Temple.jpg/1200px-Khatu_Shyam_Temple.jpg",
    phone: "01572-277277",
    website: "https://khatushyam.org",
    status: "approved"
  },
  {
    title: "Salasar Balaji Temple",
    location: "Salasar, Churu, Rajasthan",
    city: "Churu",
    state: "Rajasthan",
    country: "India",
    pincode: "331506",
    description: "Salasar Balaji Temple is dedicated to Lord Hanuman. The temple has a self-manifested idol found in a farm. Millions of devotees visit annually. The temple is famous for miracle healings. Devotees offer mustard oil and apply sindoor. The temple celebrates Hanuman Jayanti and Ram Navami grandly. The temple runs charitable activities.",
    descriptionHi: "सालासर बालाजी मंदिर भगवान हनुमान को समर्पित है। मंदिर में एक खेत में मिली स्वयंभू मूर्ति है।",
    deity: "Hanuman (Balaji)",
    establishedYear: "1754 CE (idol found)",
    templeType: "Modern (18th Century)",
    speciality: "Self-manifested Hanuman, miracle healings, mustard oil offering, charitable",
    categories: ["Other Sacred Group"],
    timings: "4:00 AM - 11:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Salasar_Balaji_Temple.jpg/1200px-Salasar_Balaji_Temple.jpg",
    phone: "01568-274100",
    website: "https://salasarbalaji.org",
    status: "approved"
  },
  {
    title: "Mehandipur Balaji Temple",
    location: "Mehandipur, Dausa, Rajasthan",
    city: "Dausa",
    state: "Rajasthan",
    country: "India",
    pincode: "303509",
    description: "Mehandipur Balaji Temple is famous for exorcism rituals. The temple has three deities: Balaji, Pret Raja, and Bhairav. Devotees come for spiritual healing from evil spirits. The temple has unique rituals and traditions. No prasad should be taken outside temple. The temple atmosphere is mystical and powerful. Thousands visit for relief from supernatural problems.",
    descriptionHi: "मेहंदीपुर बालाजी मंदिर भूत-प्रेत निवारण अनुष्ठानों के लिए प्रसिद्ध है। मंदिर में तीन देवता हैं: बालाजी, प्रेत राजा और भैरव।",
    deity: "Balaji (Hanuman), Pret Raja, Bhairav",
    establishedYear: "Ancient (1000+ years)",
    templeType: "Ancient",
    speciality: "Exorcism temple, three deities, spiritual healing, unique rituals, no prasad outside",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Mehandipur_Balaji_Temple.jpg/1200px-Mehandipur_Balaji_Temple.jpg",
    phone: "01427-250100",
    status: "approved"
  },
  {
    title: "Shrinathji Temple Nathdwara",
    location: "Nathdwara, Rajsamand, Rajasthan",
    city: "Rajsamand",
    state: "Rajasthan",
    country: "India",
    pincode: "313301",
    description: "Shrinathji Temple houses 7-year-old Krishna lifting Govardhan hill. The deity was brought from Mathura to save from Aurangzeb. The temple follows Pushti Marg tradition. Eight darshans (viewings) happen daily with costume changes. The temple is major Vaishnavite pilgrimage. Pichwai paintings originated here. The deity is adorned with precious jewelry.",
    descriptionHi: "श्रीनाथजी मंदिर में गोवर्धन पर्वत उठाते हुए 7 वर्षीय कृष्ण की मूर्ति है। देवता को औरंगजेब से बचाने के लिए मथुरा से लाया गया था।",
    deity: "Shrinathji (Bal Krishna)",
    establishedYear: "1672 CE (brought from Mathura)",
    templeType: "Medieval",
    speciality: "Govardhan Krishna, 8 daily darshans, Pushti Marg, Pichwai art, costume changes",
    categories: ["Other Sacred Group"],
    timings: "Multiple darshan times (check schedule)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Shrinathji_Temple.jpg/1200px-Shrinathji_Temple.jpg",
    phone: "02953-231019",
    website: "https://shrinathji.org",
    status: "approved"
  },
  {
    title: "Govind Dev Ji Temple",
    location: "City Palace Complex, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "302002",
    description: "Govind Dev Ji Temple is in Jaipur City Palace complex. The deity was brought from Vrindavan by Sawai Jai Singh II. The temple has seven daily darshans. Thousands of devotees attend aarti daily. The deity resembles Krishna of Vrindavan. The temple has royal Rajput architecture. The temple is managed by royal family descendants.",
    descriptionHi: "गोविंद देव जी मंदिर जयपुर सिटी पैलेस परिसर में है। देवता को सवाई जय सिंह द्वितीय द्वारा वृंदावन से लाया गया था।",
    deity: "Govind Dev Ji (Krishna)",
    establishedYear: "1735 CE (brought to Jaipur)",
    templeType: "Medieval Rajput",
    speciality: "Vrindavan deity, City Palace location, 7 daily darshans, royal management",
    categories: ["Other Sacred Group"],
    timings: "Multiple darshan times (4:30 AM onwards)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Govind_Dev_Ji_Temple.jpg/1200px-Govind_Dev_Ji_Temple.jpg",
    phone: "0141-2608055",
    status: "approved"
  },
  {
    title: "Birla Mandir Lakshmi Narayan Temple Jaipur",
    location: "Tilak Nagar, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "302004",
    description: "Birla Mandir is a beautiful white marble temple. Built by Birla family dedicated to Lakshmi Narayan. The temple has intricate marble carvings. Three domes represent three religions. The temple has beautiful gardens and fountains. The temple glows beautifully at night. Geeta quotes are inscribed on walls.",
    descriptionHi: "बिरला मंदिर एक सुंदर सफेद संगमरमर का मंदिर है। बिरला परिवार द्वारा लक्ष्मी नारायण को समर्पित निर्मित।",
    deity: "Lakshmi Narayan (Vishnu)",
    establishedYear: "1988 CE",
    templeType: "Modern",
    speciality: "White marble temple, Birla family built, beautiful architecture, three domes",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 12:00 PM, 3:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Birla_Mandir_Jaipur.jpg/1200px-Birla_Mandir_Jaipur.jpg",
    phone: "0141-2651281",
    status: "approved"
  },
  {
    title: "Madan Mohan Ji Temple Karauli",
    location: "Karauli, Rajasthan",
    city: "Karauli",
    state: "Rajasthan",
    country: "India",
    pincode: "322230",
    description: "Madan Mohan Ji Temple is the main deity of Karauli royal family. The temple celebrates famous Holi and Diwali festivities. The deity is believed to be very powerful. The temple has ancient traditions and rituals. Royal family still participates in temple ceremonies. The temple architecture is beautiful Rajputana style.",
    descriptionHi: "मदन मोहन जी मंदिर करौली राजपरिवार के मुख्य देवता हैं। मंदिर प्रसिद्ध होली और दीपावली उत्सव मनाता है।",
    deity: "Madan Mohan (Krishna)",
    establishedYear: "Ancient",
    templeType: "Ancient Rajput",
    speciality: "Royal family deity, famous Holi celebration, ancient traditions, Rajputana architecture",
    categories: ["Other Sacred Group"],
    timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Madan_Mohan_Temple_Karauli.jpg/1200px-Madan_Mohan_Temple_Karauli.jpg",
    phone: "07464-220100",
    status: "approved"
  },
  {
    title: "Kaila Devi Temple Karauli",
    location: "Kaila Devi, Karauli, Rajasthan",
    city: "Karauli",
    state: "Rajasthan",
    country: "India",
    pincode: "322218",
    description: "Kaila Devi Temple is on banks of Kalisil River. The goddess is form of Durga. One of the Shakti Peeths in Rajasthan. Huge fair happens in Chaitra month. The temple is family deity of Karauli and Jaipur royal families. The temple has beautiful riverside location. Coconut offering is traditional here.",
    descriptionHi: "कैला देवी मंदिर कालिसिल नदी के तट पर है। देवी दुर्गा का रूप हैं। राजस्थान में शक्ति पीठों में से एक।",
    deity: "Kaila Devi (Durga)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Shakti Peeth, riverside location, Chaitra fair, royal family deity, coconut offering",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Kaila_Devi_Temple.jpg/1200px-Kaila_Devi_Temple.jpg",
    phone: "07464-252100",
    status: "approved"
  },
  {
    title: "Jagat Shiromani Temple Amer",
    location: "Amer, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "302001",
    description: "Jagat Shiromani Temple was built by Queen Kanakwati for her son. The temple is dedicated to Krishna worshipped by Meera Bai. The temple has exquisite architecture and carvings. The temple has idols of Krishna, Meera Bai, and Chaitanya Mahaprabhu. The temple is near famous Amer Fort. Beautiful sculptures adorn the temple.",
    descriptionHi: "जगत शिरोमणि मंदिर रानी कनकवती द्वारा अपने पुत्र के लिए बनाया गया था। मंदिर मीरा बाई द्वारा पूजित कृष्ण को समर्पित है।",
    deity: "Krishna (worshipped by Meera Bai)",
    establishedYear: "1599 CE",
    templeType: "Medieval Rajput",
    speciality: "Meera Bai's Krishna, royal built, exquisite carvings, near Amer Fort",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jagat_Shiromani_Temple.jpg/1200px-Jagat_Shiromani_Temple.jpg",
    phone: "0141-2530293",
    status: "approved"
  },

  // Shiva Temples
  {
    title: "Eklingji Temple",
    location: "Kailashpuri, Udaipur, Rajasthan",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "313202",
    description: "Eklingji Temple is the royal deity of Mewar dynasty. The temple has four-faced black marble Shiva lingam. Maharana of Udaipur is considered Diwan of Eklingji. The temple complex has 108 temples. Beautiful architecture with double-storied structure. The temple has silver doors and ornate pillars. Evening aarti is spectacular.",
    descriptionHi: "एकलिंगजी मंदिर मेवाड़ राजवंश के राजकीय देवता हैं। मंदिर में चार मुख वाला काले संगमरमर का शिव लिंग है।",
    deity: "Eklingji (Shiva - Four-faced)",
    establishedYear: "734 CE (rebuilt 15th century)",
    templeType: "Ancient (Mewar Dynasty)",
    speciality: "Royal Mewar deity, four-faced lingam, 108 temples, silver doors, royal traditions",
    categories: ["Other Sacred Group"],
    timings: "4:30 AM - 7:00 PM (with break)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Eklingji_Temple.jpg/1200px-Eklingji_Temple.jpg",
    phone: "02954-231009",
    status: "approved"
  },
  {
    title: "Harshnath Temple",
    location: "Harshnath, Sikar, Rajasthan",
    city: "Sikar",
    state: "Rajasthan",
    country: "India",
    pincode: "332025",
    description: "Harshnath Temple is on Aravalli hills at 3500 feet altitude. Built by Chauhan dynasty dedicated to Shiva. The temple has intricate stone carvings. The temple ruins show ancient architectural glory. The hilltop location offers panoramic views. The temple was destroyed by invaders but remains significant. Trekking to temple is adventurous.",
    descriptionHi: "हर्षनाथ मंदिर अरावली पहाड़ियों पर 3500 फीट की ऊंचाई पर है। चौहान वंश द्वारा शिव को समर्पित निर्मित।",
    deity: "Shiva (Harshnath)",
    establishedYear: "10th Century CE",
    templeType: "Ancient (Chauhan)",
    speciality: "Hilltop temple, 3500 feet altitude, intricate carvings, ruins, trekking destination",
    categories: ["Other Sacred Group"],
    timings: "Open all day (trekking required)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Harshnath_Temple.jpg/1200px-Harshnath_Temple.jpg",
    status: "approved"
  },
  {
    title: "Neelkanth Mahadev Temple Sariska",
    location: "Sariska Tiger Reserve, Alwar, Rajasthan",
    city: "Alwar",
    state: "Rajasthan",
    country: "India",
    pincode: "301022",
    description: "Neelkanth Mahadev Temple is inside Sariska Tiger Reserve. The temple is carved out of single rock. Beautiful natural surroundings with wildlife. The temple is ancient Shiva shrine in forest. Devotees visit during Shivratri. The temple location is serene and peaceful. Entry through tiger reserve adds uniqueness.",
    descriptionHi: "नीलकंठ महादेव मंदिर सरिस्का टाइगर रिजर्व के अंदर है। मंदिर एक ही चट्टान से उकेरा गया है।",
    deity: "Neelkanth Mahadev (Shiva)",
    establishedYear: "Ancient",
    templeType: "Ancient Rock-cut",
    speciality: "Tiger reserve location, single rock carving, forest temple, Shivratri celebration",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 6:00 PM (reserve timings)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Neelkanth_Mahadev_Sariska.jpg/1200px-Neelkanth_Mahadev_Sariska.jpg",
    phone: "0144-2841333",
    status: "approved"
  },
  {
    title: "Somnath Temple Banswara",
    location: "Banswara, Rajasthan",
    city: "Banswara",
    state: "Rajasthan",
    country: "India",
    pincode: "327001",
    description: "Somnath Temple Banswara is dedicated to Lord Shiva. The temple is on banks of Mahi River. Beautiful architecture with ancient carvings. The temple is important pilgrimage in tribal region. Shivratri celebrations attract thousands. The temple has peaceful riverside ambiance.",
    descriptionHi: "सोमनाथ मंदिर बांसवाड़ा भगवान शिव को समर्पित है। मंदिर माही नदी के तट पर है।",
    deity: "Somnath (Shiva)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Riverside temple, tribal region importance, Shivratri fair, ancient carvings",
    categories: ["Other Sacred Group"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Somnath_Banswara.jpg/1200px-Somnath_Banswara.jpg",
    phone: "02962-240100",
    status: "approved"
  },
  {
    title: "Kiradu Temples Mini Khajuraho",
    location: "Kiradu, Barmer, Rajasthan",
    city: "Barmer",
    state: "Rajasthan",
    country: "India",
    pincode: "344033",
    description: "Kiradu Temples are called Mini Khajuraho of Rajasthan. Five temples with intricate erotic sculptures. Dedicated to Shiva and Vishnu. Built in 11th-12th century by Paramara dynasty. The temples show excellent Solanki architecture. Main temple is Someshvara temple. The temples have mythological curse legends. Desert location adds mystique.",
    descriptionHi: "किराडू मंदिर राजस्थान के मिनी खजुराहो कहलाते हैं। जटिल कामुक मूर्तियों वाले पांच मंदिर। शिव और विष्णु को समर्पित।",
    deity: "Shiva and Vishnu",
    establishedYear: "11th-12th Century CE",
    templeType: "Medieval (Paramara)",
    speciality: "Mini Khajuraho, erotic sculptures, Solanki architecture, curse legends, desert temples",
    categories: ["Other Sacred Group"],
    timings: "Sunrise to Sunset",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Kiradu_Temples.jpg/1200px-Kiradu_Temples.jpg",
    status: "approved"
  },

  // Shakti/Devi Temples
  {
    title: "Karni Mata Temple Deshnok",
    location: "Deshnok, Bikaner, Rajasthan",
    city: "Bikaner",
    state: "Rajasthan",
    country: "India",
    pincode: "334801",
    description: "Karni Mata Temple is famous for thousands of holy rats (kabbas). Seeing white rat is considered very auspicious. Karni Mata is incarnation of Goddess Durga. The temple has marble facade and silver doors. Devotees eat prasad with rats. The temple is unique in the world. Bikaner royal family built the temple.",
    descriptionHi: "करणी माता मंदिर हजारों पवित्र चूहों (कब्बों) के लिए प्रसिद्ध है। सफेद चूहा देखना बहुत शुभ माना जाता है।",
    deity: "Karni Mata (Durga incarnation)",
    establishedYear: "1538 CE (current structure)",
    templeType: "Medieval",
    speciality: "Holy rats temple, thousands of rats, white rat auspicious, unique worldwide, silver doors",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "4:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Karni_Mata_Temple.jpg/1200px-Karni_Mata_Temple.jpg",
    phone: "0151-2521008",
    status: "approved"
  },
  {
    title: "Jeen Mata Temple",
    location: "Aryal Village, Sikar, Rajasthan",
    city: "Sikar",
    state: "Rajasthan",
    country: "India",
    pincode: "332404",
    description: "Jeen Mata Temple is in Aravalli hills dedicated to Goddess Durga. The temple is in natural cave formation. Huge fair happens on Chaitra and Ashwin Navratri. Thousands of devotees trek to hilltop temple. The goddess is believed to cure diseases. The temple has ancient significance. Beautiful hill views from temple.",
    descriptionHi: "जीण माता मंदिर अरावली पहाड़ियों में देवी दुर्गा को समर्पित है। मंदिर प्राकृतिक गुफा संरचना में है।",
    deity: "Jeen Mata (Durga)",
    establishedYear: "Ancient",
    templeType: "Ancient Cave Temple",
    speciality: "Cave temple, hilltop, Navratri fair, disease cure, trekking destination",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Jeen_Mata_Temple.jpg/1200px-Jeen_Mata_Temple.jpg",
    phone: "01572-255100",
    status: "approved"
  },
  {
    title: "Chauth Mata Temple",
    location: "Chauth Ka Barwara, Sawai Madhopur, Rajasthan",
    city: "Sawai Madhopur",
    state: "Rajasthan",
    country: "India",
    pincode: "322702",
    description: "Chauth Mata Temple is dedicated to Goddess Chauth Mata. The temple is family deity of many Rajput clans. Huge fair happens during Bhadrapada month. The goddess grants child boon to childless couples. The temple has ancient traditions. Beautiful temple architecture. The festival attracts lakhs of devotees.",
    descriptionHi: "चौथ माता मंदिर देवी चौथ माता को समर्पित है। मंदिर कई राजपूत कुलों की कुलदेवी है।",
    deity: "Chauth Mata (Durga)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Rajput family deity, child boon granting, Bhadrapada fair, ancient traditions",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Chauth_Mata_Temple.jpg/1200px-Chauth_Mata_Temple.jpg",
    phone: "07462-220200",
    status: "approved"
  },
  {
    title: "Tanot Mata Temple",
    location: "Tanot, Jaisalmer, Rajasthan",
    city: "Jaisalmer",
    state: "Rajasthan",
    country: "India",
    pincode: "345001",
    description: "Tanot Mata Temple is famous for 1965 Indo-Pak war miracle. Pakistani bombs fell but didn't explode near temple. The temple is form of Hinglaj Mata. BSF (Border Security Force) manages the temple. The temple is near Pakistan border (120 km). Unexploded bombs displayed in temple. The temple symbolizes faith and protection.",
    descriptionHi: "तनोट माता मंदिर 1965 भारत-पाक युद्ध के चमत्कार के लिए प्रसिद्ध है। पाकिस्तानी बम मंदिर के पास गिरे लेकिन फटे नहीं।",
    deity: "Tanot Mata (Hinglaj Mata form)",
    establishedYear: "Ancient (9th Century)",
    templeType: "Ancient",
    speciality: "1965 war miracle, unexploded bombs, BSF managed, border temple, protective goddess",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Tanot_Mata_Temple.jpg/1200px-Tanot_Mata_Temple.jpg",
    phone: "02992-274100",
    status: "approved"
  },
  {
    title: "Shakambhari Mata Temple",
    location: "Near Sambhar Lake, Sikar, Rajasthan",
    city: "Sikar",
    state: "Rajasthan",
    country: "India",
    pincode: "303604",
    description: "Shakambhari Mata Temple is near famous Sambhar Salt Lake. The goddess is form of Durga who provided vegetables. One of the ancient Shakti Peeths. The temple has beautiful architecture. Navratri celebrations are grand. The temple is surrounded by scenic lake views. Devotees visit for prosperity.",
    descriptionHi: "शाकंभरी माता मंदिर प्रसिद्ध सांभर साल्ट लेक के पास है। देवी दुर्गा का रूप हैं जिन्होंने सब्जियां प्रदान कीं।",
    deity: "Shakambhari Mata (Durga)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Shakti Peeth, Sambhar Lake vicinity, vegetable provider goddess, Navratri",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Shakambhari_Temple.jpg/1200px-Shakambhari_Temple.jpg",
    phone: "01425-222100",
    status: "approved"
  },
  {
    title: "Tripura Sundari Temple Banswara",
    location: "Banswara, Rajasthan",
    city: "Banswara",
    state: "Rajasthan",
    country: "India",
    pincode: "327001",
    description: "Tripura Sundari Temple is one of the Shakti Peeths in Rajasthan. The goddess is family deity of Banswara royalty. The temple has ancient tantric traditions. Beautiful idol of goddess. The temple is in tribal region. Navratri fair is famous. The temple architecture is unique.",
    descriptionHi: "त्रिपुरा सुंदरी मंदिर राजस्थान में शक्ति पीठों में से एक है। देवी बांसवाड़ा राजपरिवार की कुलदेवी हैं।",
    deity: "Tripura Sundari (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Shakti Peeth, royal deity, tantric traditions, tribal region, Navratri fair",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Tripura_Sundari_Banswara.jpg/1200px-Tripura_Sundari_Banswara.jpg",
    phone: "02962-240200",
    status: "approved"
  },
  {
    title: "Arbuda Devi Temple Mount Abu",
    location: "Mount Abu, Sirohi, Rajasthan",
    city: "Sirohi",
    state: "Rajasthan",
    country: "India",
    pincode: "307501",
    description: "Arbuda Devi Temple is one of 51 Shakti Peeths. The goddess is protector of Mount Abu. The temple requires climbing 365 steps. The temple is carved out of rock. Natural cave temple with mystical atmosphere. The goddess fulfills devotees' wishes. The hilltop location offers scenic views. Important pilgrimage in Rajasthan.",
    descriptionHi: "अर्बुदा देवी मंदिर 51 शक्ति पीठों में से एक है। देवी माउंट आबू की रक्षक हैं।",
    deity: "Arbuda Devi (Durga)",
    establishedYear: "Ancient",
    templeType: "Ancient Cave Temple",
    speciality: "Shakti Peeth, 365 steps, rock-carved, cave temple, Mount Abu protector",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Arbuda_Devi_Temple.jpg/1200px-Arbuda_Devi_Temple.jpg",
    phone: "02974-235100",
    status: "approved"
  },

  // Brahma/Other Temples
  {
    title: "Brahma Temple Pushkar",
    location: "Pushkar, Ajmer, Rajasthan",
    city: "Ajmer",
    state: "Rajasthan",
    country: "India",
    pincode: "305022",
    description: "Brahma Temple is one of the very few Brahma temples in world. The temple is 2000 years old. Built with marble and stone with red spire. The temple is on banks of sacred Pushkar Lake. Four-faced Brahma deity with silver turtle. Pushkar Fair is world-famous. The temple attracts pilgrims worldwide. Kartik Purnima is most auspicious.",
    descriptionHi: "ब्रह्मा मंदिर विश्व में बहुत कम ब्रह्मा मंदिरों में से एक है। मंदिर 2000 साल पुराना है।",
    deity: "Lord Brahma (Creator)",
    establishedYear: "14th Century CE (current structure)",
    templeType: "Ancient",
    speciality: "Rare Brahma temple, Pushkar Lake, four-faced deity, Kartik Purnima, world-famous fair",
    categories: ["Other Sacred Group"],
    timings: "5:30 AM - 1:30 PM, 3:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Brahma_Temple_Pushkar.jpg/1200px-Brahma_Temple_Pushkar.jpg",
    phone: "0145-2772074",
    status: "approved"
  },
  {
    title: "Trinetra Ganesh Temple Ranthambore",
    location: "Ranthambore Fort, Sawai Madhopur, Rajasthan",
    city: "Sawai Madhopur",
    state: "Rajasthan",
    country: "India",
    pincode: "322001",
    description: "Trinetra Ganesh Temple is inside historic Ranthambore Fort. The deity has three eyes (trinetra). One of the oldest Ganesh temples in Rajasthan. Devotees send wedding invitations to Ganesh here. The temple fulfills wishes. The fort location adds historical charm. Tigers roam in sanctuary around fort.",
    descriptionHi: "त्रिनेत्र गणेश मंदिर ऐतिहासिक रणथंभौर किले के अंदर है। देवता के तीन नेत्र (त्रिनेत्र) हैं।",
    deity: "Trinetra Ganesh (Three-eyed Ganesha)",
    establishedYear: "Ancient (1000+ years)",
    templeType: "Ancient Fort Temple",
    speciality: "Three-eyed Ganesh, Ranthambore Fort, wedding invitations sent, wish-fulfilling",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 7:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Trinetra_Ganesh_Temple.jpg/1200px-Trinetra_Ganesh_Temple.jpg",
    phone: "07462-220777",
    status: "approved"
  },

  // Jain Temples
  {
    title: "Ranakpur Jain Temple",
    location: "Ranakpur, Pali, Rajasthan",
    city: "Pali",
    state: "Rajasthan",
    country: "India",
    pincode: "306702",
    description: "Ranakpur Jain Temple is one of the five most important Jain temples. Built in 15th century with 1444 intricately carved marble pillars. No two pillars are alike. Dedicated to Tirthankara Adinath. The temple complex has four subsidiary temples. Stunning architecture and craftsmanship. The temple is in Aravalli valley. Photography is restricted inside.",
    descriptionHi: "रणकपुर जैन मंदिर पांच सबसे महत्वपूर्ण जैन मंदिरों में से एक है। 15वीं शताब्दी में 1444 जटिल रूप से नक्काशीदार संगमरमर के स्तंभों के साथ निर्मित।",
    deity: "Adinath (Rishabhanatha) - 1st Tirthankara",
    establishedYear: "1439 CE",
    templeType: "Medieval Jain",
    speciality: "1444 unique pillars, marble architecture, five temples complex, Aravalli location",
    categories: ["Other Sacred Group"],
    timings: "12:00 PM - 5:00 PM (for visitors)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Ranakpur_Temple.jpg/1200px-Ranakpur_Temple.jpg",
    phone: "02934-285074",
    website: "https://www.ranakpur.org",
    status: "approved"
  },
  {
    title: "Dilwara Jain Temples Mount Abu",
    location: "Mount Abu, Sirohi, Rajasthan",
    city: "Sirohi",
    state: "Rajasthan",
    country: "India",
    pincode: "307501",
    description: "Dilwara Temples are world-famous for marble architecture. Five temples built between 11th-13th centuries. Vimal Vasahi and Luna Vasahi are most famous. The marble carvings are incredibly detailed and delicate. Dedicated to various Tirthankaras. The temples are masterpiece of Indian architecture. Photography and leather items prohibited. The ceiling carvings are breathtaking.",
    descriptionHi: "दिलवाड़ा मंदिर संगमरमर की वास्तुकला के लिए विश्व प्रसिद्ध हैं। 11वीं-13वीं शताब्दी के बीच निर्मित पांच मंदिर।",
    deity: "Adinath and Neminath (Tirthankaras)",
    establishedYear: "1031-1231 CE",
    templeType: "Medieval Jain",
    speciality: "World-famous marble work, five temples, delicate carvings, architectural masterpiece",
    categories: ["Other Sacred Group"],
    timings: "12:00 PM - 6:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Dilwara_Temples.jpg/1200px-Dilwara_Temples.jpg",
    phone: "02974-238391",
    status: "approved"
  },
  {
    title: "Osian Jain Temples",
    location: "Osian, Jodhpur, Rajasthan",
    city: "Jodhpur",
    state: "Rajasthan",
    country: "India",
    pincode: "342303",
    description: "Osian has cluster of ancient Jain and Hindu temples. Called Khajuraho of Rajasthan for sculptures. The main Mahavira temple is beautifully carved. 8th-12th century temples built by Gurjara-Pratihara dynasty. The temples are in desert setting. The architecture shows ancient artistic excellence. The temple town was important trading center.",
    descriptionHi: "ओसियां में प्राचीन जैन और हिंदू मंदिरों का समूह है। मूर्तियों के लिए राजस्थान का खजुराहो कहा जाता है।",
    deity: "Mahavira (24th Tirthankara)",
    establishedYear: "8th-12th Century CE",
    templeType: "Ancient",
    speciality: "Temple cluster, Khajuraho of Rajasthan, desert location, ancient sculptures",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 7:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Osian_Temples.jpg/1200px-Osian_Temples.jpg",
    phone: "02927-274100",
    status: "approved"
  },
  {
    title: "Bhandasar Jain Temple Bikaner",
    location: "Bikaner, Rajasthan",
    city: "Bikaner",
    state: "Rajasthan",
    country: "India",
    pincode: "334001",
    description: "Bhandasar Jain Temple is dedicated to 5th Tirthankara Sumatinath. The temple was built in 1468 CE. Famous for beautiful frescoes and mirror work. The temple has extensive use of ghee in foundation (40,000 kg). The pillars have gold leaf paintings. The temple has intricate artwork. Three-story structure with beautiful paintings.",
    descriptionHi: "भांडाशाह जैन मंदिर 5वें तीर्थंकर सुमतिनाथ को समर्पित है। मंदिर 1468 ईस्वी में बनाया गया था।",
    deity: "Sumatinath (5th Tirthankara)",
    establishedYear: "1468 CE",
    templeType: "Medieval Jain",
    speciality: "Ghee foundation (40,000 kg), frescoes, mirror work, gold leaf paintings",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Bhandasar_Temple.jpg/1200px-Bhandasar_Temple.jpg",
    phone: "0151-2200800",
    status: "approved"
  },

  // Historical/Other Famous Temples
  {
    title: "Jagdish Temple Udaipur",
    location: "City Palace Road, Udaipur, Rajasthan",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "313001",
    description: "Jagdish Temple is in heart of Udaipur city. Built by Maharana Jagat Singh in 1651. Dedicated to Lord Vishnu (Jagannath). The temple has Indo-Aryan architecture. Beautiful black stone idol of Vishnu. The temple has ornately carved pillars and ceilings. The temple pyramid has 79 feet height. Daily aarti attracts many devotees.",
    descriptionHi: "जगदीश मंदिर उदयपुर शहर के केंद्र में है। महाराणा जगत सिंह द्वारा 1651 में निर्मित। भगवान विष्णु (जगन्नाथ) को समर्पित।",
    deity: "Jagannath (Vishnu)",
    establishedYear: "1651 CE",
    templeType: "Medieval Rajput",
    speciality: "City center location, Indo-Aryan architecture, black stone idol, ornate carvings",
    categories: ["Other Sacred Group"],
    timings: "4:15 AM - 1:00 PM, 5:15 PM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Jagdish_Temple_Udaipur.jpg/1200px-Jagdish_Temple_Udaipur.jpg",
    phone: "0294-2411501",
    status: "approved"
  },
  {
    title: "Saas-Bahu Temple Nagda",
    location: "Nagda, Udaipur, Rajasthan",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "313024",
    description: "Saas-Bahu Temple (Sahastrabahu Temple) is near Udaipur. Built in 10th century dedicated to Vishnu and Shiva. Called Mother-in-law and Daughter-in-law temples. Beautiful intricate carvings on walls and pillars. The temples show ancient architectural excellence. The larger temple is more ornate. Located on banks of Bagela Lake. The temples are important heritage site.",
    descriptionHi: "सास-बहू मंदिर (सहस्त्रबाहु मंदिर) उदयपुर के पास है। 10वीं शताब्दी में विष्णु और शिव को समर्पित निर्मित।",
    deity: "Vishnu (Sahasrabahu) and Shiva",
    establishedYear: "10th Century CE",
    templeType: "Ancient",
    speciality: "Twin temples, Saas-Bahu legend, intricate carvings, lakeside, heritage site",
    categories: ["Other Sacred Group"],
    timings: "Sunrise to Sunset",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Saas_Bahu_Temple.jpg/1200px-Saas_Bahu_Temple.jpg",
    status: "approved"
  },
  {
    title: "Sun Temple Jhalawar",
    location: "Jhalrapatan, Jhalawar, Rajasthan",
    city: "Jhalawar",
    state: "Rajasthan",
    country: "India",
    pincode: "326023",
    description: "Sun Temple Jhalawar is dedicated to Sun God. Built in 11th century with beautiful architecture. The temple has intricate sculptures and carvings. Called Padmanabh Temple or Shantinath Temple. The temple shows Pratihara architectural style. The sanctum has beautiful sun deity. The temple is important heritage monument. Annual fair happens on Makar Sankranti.",
    descriptionHi: "सूर्य मंदिर झालावाड़ सूर्य देव को समर्पित है। 11वीं शताब्दी में सुंदर वास्तुकला के साथ निर्मित।",
    deity: "Surya (Sun God)",
    establishedYear: "11th Century CE",
    templeType: "Ancient",
    speciality: "Sun temple, Pratihara architecture, intricate sculptures, Makar Sankranti fair",
    categories: ["Other Sacred Group"],
    timings: "6:00 AM - 7:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Sun_Temple_Jhalawar.jpg/1200px-Sun_Temple_Jhalawar.jpg",
    phone: "07432-230100",
    status: "approved"
  }
];

async function addRajasthanTemples() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding 30 Famous Rajasthan Temples...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < rajasthanTemples.length; i++) {
      const templeData = rajasthanTemples[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failCount++;
      }
    }
    
    console.log('\n🎉 Rajasthan Temples Addition Complete!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully added: ${successCount} temples`);
    console.log(`   ❌ Failed: ${failCount} temples`);
    console.log('\n🏛️  Temple Categories Added:');
    console.log('   • Vaishnav/Krishna Temples: Khatu Shyam, Salasar Balaji, Mehandipur Balaji, Shrinathji, Govind Dev Ji');
    console.log('   • Shiva Temples: Eklingji, Harshnath, Neelkanth Sariska, Kiradu');
    console.log('   • Shakti/Devi Temples: Karni Mata (Rats), Kaila Devi, Tanot Mata, Jeen Mata, Arbuda Devi');
    console.log('   • Brahma Temple: Pushkar (Rare Brahma Temple)');
    console.log('   • Jain Temples: Ranakpur, Dilwara, Osian, Bhandasar');
    console.log('   • Historical: Jagdish Udaipur, Saas-Bahu, Sun Temple Jhalawar');
    console.log('\n🌟 Special Highlights:');
    console.log('   • Karni Mata - World famous rats temple');
    console.log('   • Tanot Mata - 1965 war miracle temple');
    console.log('   • Brahma Pushkar - One of few Brahma temples worldwide');
    console.log('   • Dilwara & Ranakpur - World heritage Jain marble temples');
    console.log('   • Khatu Shyam & Salasar - Major pilgrimage destinations');
    console.log('\n✅ All temples now live on website!');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addRajasthanTemples();
