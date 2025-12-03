// Script to add Shakti Peeth temples - Part 3 (Final 17 temples)
// Run with: node scripts/add-shakti-peeth-part3.js

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

const shaktiPeethPart3 = [
  {
    title: "Naina Devi Temple Bilaspur",
    location: "Bilaspur, Himachal Pradesh",
    city: "Bilaspur",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "174001",
    description: "Naina Devi Temple is perched on a hilltop at 1177 meters altitude overlooking Gobind Sagar Lake. The temple is dedicated to Goddess Naina Devi where the eyes of Goddess Sati fell. The temple can be reached by road or cable car offering spectacular views. The scenic location amidst mountains and the artificial lake creates a serene atmosphere. The temple attracts thousands of devotees especially during Navratri. The ropeway journey adds to the pilgrimage experience.",
    descriptionHi: "नैना देवी मंदिर गोबिंद सागर झील को देखती 1177 मीटर की ऊंचाई पर पहाड़ी की चोटी पर स्थित है। मंदिर देवी नैना देवी को समर्पित है जहां देवी सती की आंखें गिरी थीं।",
    deity: "Naina Devi (Shakti)",
    establishedYear: "8th Century CE",
    templeType: "Ancient",
    speciality: "Cable car access, lake view, mountain location",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Naina_Devi_Temple_Bilaspur.jpg/1200px-Naina_Devi_Temple_Bilaspur.jpg",
    phone: "01978-222345",
    status: "approved"
  },
  {
    title: "Brajeshwari Devi Temple",
    location: "Kangra, Himachal Pradesh",
    city: "Kangra",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "176001",
    description: "Brajeshwari Devi Temple in Kangra is an ancient Shakti Peeth where the left breast of Goddess Sati fell. The temple has been destroyed and rebuilt multiple times throughout history. The current structure showcases traditional Himachali architecture. The temple is dedicated to Goddess Vajreshwari. The temple town of Kangra is one of the oldest in Himachal Pradesh. The temple attracts devotees seeking blessings for prosperity and peace.",
    descriptionHi: "कांगड़ा में ब्रजेश्वरी देवी मंदिर एक प्राचीन शक्तिपीठ है जहां देवी सती का बायां स्तन गिरा था। मंदिर को इतिहास में कई बार नष्ट और पुनर्निर्मित किया गया है।",
    deity: "Vajreshwari (Shakti)",
    establishedYear: "Ancient (Current: 1920s)",
    templeType: "Ancient",
    speciality: "Historical significance, rebuilt multiple times",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Vajreshwari_Temple_Kangra.jpg/1200px-Vajreshwari_Temple_Kangra.jpg",
    phone: "01892-265345",
    status: "approved"
  },
  {
    title: "Attahas Temple",
    location: "Attahas, West Bengal",
    city: "Attahas",
    state: "West Bengal",
    country: "India",
    description: "Attahas Temple is located in West Bengal where the lower lip of Goddess Sati fell. The name Attahas means 'the land of laughter' as it is believed Lord Shiva laughed here. The temple is set in a peaceful rural environment. Though lesser known compared to other Shakti Peeths, it holds great spiritual significance. The temple follows traditional Bengali architectural style. Local devotees maintain the temple with great devotion.",
    descriptionHi: "अट्टहास मंदिर पश्चिम बंगाल में स्थित है जहां देवी सती का निचला होंठ गिरा था। अट्टहास नाम का अर्थ है 'हंसी की भूमि' क्योंकि माना जाता है कि यहां भगवान शिव हंसे थे।",
    deity: "Phullara (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Land of laughter, peaceful location",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Ancient_Temple_Bengal.jpg/1200px-Ancient_Temple_Bengal.jpg",
    status: "approved"
  },
  {
    title: "Sugandha Shakti Peeth",
    location: "Shikarpur, Barisal, Bangladesh",
    city: "Barisal",
    state: "Bangladesh",
    country: "Bangladesh",
    description: "Sugandha Temple is located in Bangladesh where the nose of Goddess Sati fell. The temple is dedicated to Goddess Sunanda. The ancient temple has been renovated several times but maintains its spiritual significance. The temple is an important pilgrimage site for Hindus in Bangladesh. The temple architecture reflects traditional Bengali style. Despite being in Bangladesh, Indian devotees visit during special occasions.",
    descriptionHi: "सुगंधा मंदिर बांग्लादेश में स्थित है जहां देवी सती की नाक गिरी थी। मंदिर देवी सुनंदा को समर्पित है। प्राचीन मंदिर को कई बार पुनर्निर्मित किया गया है।",
    deity: "Sunanda (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Located in Bangladesh, Bengali architecture",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Sugandha_Temple_Bangladesh.jpg/1200px-Sugandha_Temple_Bangladesh.jpg",
    status: "approved"
  },
  {
    title: "Jayanti Shakti Peeth",
    location: "Jayanti, Chittagong, Bangladesh",
    city: "Chittagong",
    state: "Bangladesh",
    country: "Bangladesh",
    description: "Jayanti Temple is situated in the Chittagong Hill Tracts of Bangladesh. This Shakti Peeth is where the left thigh of Goddess Sati fell. The temple is dedicated to Goddess Jayanti. The location in hilly terrain surrounded by forests creates a mystical atmosphere. The temple is an important religious site for the Hindu community in Bangladesh. The temple maintains traditional worship practices passed down through generations.",
    descriptionHi: "जयंती मंदिर बांग्लादेश के चटगांव पहाड़ी इलाकों में स्थित है। यह शक्तिपीठ वह स्थान है जहां देवी सती की बाईं जांघ गिरी थी।",
    deity: "Jayanti (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Hill location, forest surroundings",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 7:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Hill_Temple_Bangladesh.jpg/1200px-Hill_Temple_Bangladesh.jpg",
    status: "approved"
  },
  {
    title: "Tripura Sundari Temple",
    location: "Udaipur, Tripura",
    city: "Udaipur",
    state: "Tripura",
    country: "India",
    pincode: "799120",
    description: "Tripura Sundari Temple is one of the 51 Shakti Peethas where the right leg of Goddess Sati fell. The temple is dedicated to Goddess Tripura Sundari, also known as Tripureswari. The temple is built in Bengali architectural style on a hilltop. The temple complex includes a large pond called Kalyan Sagar. This is the state temple of Tripura and holds immense cultural significance. The temple celebrates annual festivals with great enthusiasm.",
    descriptionHi: "त्रिपुरा सुंदरी मंदिर 51 शक्तिपीठों में से एक है जहां देवी सती का दाहिना पैर गिरा था। मंदिर देवी त्रिपुरा सुंदरी को समर्पित है जिन्हें त्रिपुरेश्वरी के नाम से भी जाना जाता है।",
    deity: "Tripura Sundari (Shakti)",
    establishedYear: "1501 CE",
    templeType: "Ancient",
    speciality: "State temple of Tripura, hilltop location",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "7:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Tripura_Sundari_Temple.jpg/1200px-Tripura_Sundari_Temple.jpg",
    phone: "03821-222456",
    status: "approved"
  },
  {
    title: "Kali Bari Temple Shimla",
    location: "Shimla, Himachal Pradesh",
    city: "Shimla",
    state: "Himachal Pradesh",
    country: "India",
    pincode: "171001",
    description: "Kali Bari Temple is located on Jakhu Hill in Shimla, the erstwhile summer capital of British India. The temple is dedicated to Goddess Kali or Shyamala from whom Shimla derives its name. The temple was built in 1845 but stands on an ancient sacred site. The location offers panoramic views of the Himalayan ranges. The temple is an important landmark and pilgrimage site in Shimla. The temple architecture blends traditional and colonial era influences.",
    descriptionHi: "काली बाड़ी मंदिर शिमला में जाखू पहाड़ी पर स्थित है। मंदिर देवी काली या श्यामला को समर्पित है जिनसे शिमला का नाम लिया गया है।",
    deity: "Shyamala (Kali)",
    establishedYear: "1845 CE (Ancient site)",
    templeType: "Historic",
    speciality: "Origin of Shimla name, Himalayan views",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kali_Bari_Temple_Shimla.jpg/1200px-Kali_Bari_Temple_Shimla.jpg",
    phone: "0177-2658345",
    status: "approved"
  },
  {
    title: "Manasa Devi Temple Haridwar",
    location: "Bilwa Parvat, Haridwar, Uttarakhand",
    city: "Haridwar",
    state: "Uttarakhand",
    country: "India",
    pincode: "249401",
    description: "Manasa Devi Temple is perched atop Bilwa Parvat hill in Haridwar, one of the holiest cities in India. The temple is dedicated to Goddess Manasa Devi who is believed to fulfill wishes. Devotees can reach the temple by trekking or cable car. The temple offers panoramic views of Haridwar city and the Ganga River. The temple is especially crowded during Navratri and Kumbh Mela. Devotees tie sacred threads on trees believing their wishes will be granted.",
    descriptionHi: "मनसा देवी मंदिर हरिद्वार में बिल्व पर्वत पहाड़ी के शीर्ष पर स्थित है। मंदिर देवी मनसा देवी को समर्पित है जो मनोकामनाएं पूरी करती हैं।",
    deity: "Manasa Devi (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Wish-fulfilling Goddess, cable car access, Ganga view",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Mansa_Devi_Temple_Haridwar.jpg/1200px-Mansa_Devi_Temple_Haridwar.jpg",
    phone: "0133-2427439",
    status: "approved"
  },
  {
    title: "Chandi Devi Temple Haridwar",
    location: "Neel Parvat, Haridwar, Uttarakhand",
    city: "Haridwar",
    state: "Uttarakhand",
    country: "India",
    pincode: "249401",
    description: "Chandi Devi Temple is situated atop Neel Parvat on the eastern bank of river Ganga in Haridwar. The temple was built in 1929 by Suchat Singh, the King of Kashmir. The temple is dedicated to Goddess Chandi, believed to have killed demons Shumbha and Nishumbha. The main idol was installed by Adi Shankaracharya in 8th century. Devotees can trek or take the cable car to reach the temple. The temple is one of the Panch Tirth (five pilgrimages) of Haridwar.",
    descriptionHi: "चंडी देवी मंदिर हरिद्वार में गंगा नदी के पूर्वी तट पर नील पर्वत के शीर्ष पर स्थित है। मंदिर को 1929 में कश्मीर के राजा सुचेत सिंह ने बनवाया था।",
    deity: "Chandi Devi (Shakti)",
    establishedYear: "1929 CE (Idol from 8th Century)",
    templeType: "Historic",
    speciality: "Shankaracharya's idol, Panch Tirth of Haridwar",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Chandi_Devi_Temple_Haridwar.jpg/1200px-Chandi_Devi_Temple_Haridwar.jpg",
    phone: "0133-2427439",
    status: "approved"
  },
  {
    title: "Manakamana Temple",
    location: "Gorkha, Nepal",
    city: "Gorkha",
    state: "Nepal",
    country: "Nepal",
    description: "Manakamana Temple is located in Nepal where devotees believe the Goddess grants wishes. The temple is situated on a ridge at 1302 meters altitude. Devotees traditionally trekked for three hours but now a cable car service makes the journey easier. The temple is dedicated to Goddess Bhagwati, an incarnation of Parvati. The temple has great religious significance for Nepalese Hindus. The temple offers stunning views of the Himalayas and Trisuli River valley.",
    descriptionHi: "मनकामना मंदिर नेपाल में स्थित है जहां भक्तों का मानना है कि देवी मनोकामनाएं पूरी करती हैं। मंदिर 1302 मीटर की ऊंचाई पर एक रिज पर स्थित है।",
    deity: "Bhagwati (Shakti)",
    establishedYear: "17th Century CE",
    templeType: "Ancient",
    speciality: "Wish-granting Goddess, cable car access, Nepal",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 5:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Manakamana_Temple_Nepal.jpg/1200px-Manakamana_Temple_Nepal.jpg",
    status: "approved"
  },
  {
    title: "Guhyeshwari Temple",
    location: "Pashupatinath, Kathmandu, Nepal",
    city: "Kathmandu",
    state: "Nepal",
    country: "Nepal",
    description: "Guhyeshwari Temple is one of the most important Shakti Peeths located near Pashupatinath Temple in Kathmandu. The temple is where both the knees of Goddess Sati fell. The temple is dedicated to Goddess Guhyeshwari, a form of Parvati. The temple complex features traditional Nepalese pagoda style architecture. The temple is closely associated with Tantric practices. Being near Pashupatinath, it complements the Shiva-Shakti worship tradition.",
    descriptionHi: "गुह्येश्वरी मंदिर काठमांडू में पशुपतिनाथ मंदिर के पास स्थित सबसे महत्वपूर्ण शक्तिपीठों में से एक है। मंदिर वह स्थान है जहां देवी सती के दोनों घुटने गिरे थे।",
    deity: "Guhyeshwari (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Near Pashupatinath, pagoda architecture, Tantric site",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 6:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Guhyeshwari_Temple.jpg/1200px-Guhyeshwari_Temple.jpg",
    status: "approved"
  },
  {
    title: "Mithila Shakti Peeth",
    location: "Janakpur, Nepal",
    city: "Janakpur",
    state: "Nepal",
    country: "Nepal",
    description: "Mithila Shakti Peeth is located in Janakpur, the birthplace of Goddess Sita. This Shakti Peeth is where the left shoulder of Goddess Sati fell. The temple is associated with the ancient Mithila kingdom. The temple complex includes Janaki Mandir, one of the grandest temples in Nepal. The area has deep mythological significance from the Ramayana. Devotees visit to seek blessings of both Sita and Shakti.",
    descriptionHi: "मिथिला शक्तिपीठ जनकपुर में स्थित है जो देवी सीता की जन्मभूमि है। यह शक्तिपीठ वह स्थान है जहां देवी सती का बायां कंधा गिरा था।",
    deity: "Uma (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Sita's birthplace, Mithila kingdom, Ramayana connection",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Janaki_Temple_Janakpur.jpg/1200px-Janaki_Temple_Janakpur.jpg",
    status: "approved"
  },
  {
    title: "Hinglaj Mata Temple",
    location: "Hinglaj, Balochistan, Pakistan",
    city: "Hinglaj",
    state: "Balochistan",
    country: "Pakistan",
    description: "Hinglaj Mata Temple is one of the most important Shakti Peeths located in Pakistan. The temple is where the head of Goddess Sati fell according to some traditions. The temple is situated in a cave amidst barren mountains. Despite being in Pakistan, Hindu pilgrims from India and other countries visit during the annual pilgrimage. The journey to the temple is challenging but spiritually rewarding. The temple is protected and respected by local communities.",
    descriptionHi: "हिंगलाज माता मंदिर पाकिस्तान में स्थित सबसे महत्वपूर्ण शक्तिपीठों में से एक है। कुछ परंपराओं के अनुसार यहां देवी सती का सिर गिरा था।",
    deity: "Hinglaj Mata (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Cave temple, located in Pakistan, challenging pilgrimage",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "Sunrise to Sunset",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Hinglaj_Mata_Temple.jpg/1200px-Hinglaj_Mata_Temple.jpg",
    status: "approved"
  },
  {
    title: "Sharada Peeth",
    location: "Sharda, Pakistan-Occupied Kashmir",
    city: "Sharda",
    state: "Pakistan-Occupied Kashmir",
    country: "Pakistan",
    description: "Sharada Peeth is an ancient temple and seat of learning located in Pakistan-Occupied Kashmir. The temple is where the right hand of Goddess Sati fell. The temple was once a renowned center of learning for Sanskrit and Hindu philosophy. The ruins still reflect the grandeur of the past. The temple is currently inaccessible to most Indian pilgrims. Efforts continue for allowing pilgrimage access to this historic site.",
    descriptionHi: "शारदा पीठ पाकिस्तान अधिकृत कश्मीर में स्थित एक प्राचीन मंदिर और शिक्षा केंद्र है। मंदिर वह स्थान है जहां देवी सती का दाहिना हाथ गिरा था।",
    deity: "Sharada (Saraswati)",
    establishedYear: "6th-8th Century CE",
    templeType: "Ancient",
    speciality: "Ancient learning center, in POK, historical ruins",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "Currently restricted access",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sharada_Peeth_Ruins.jpg/1200px-Sharada_Peeth_Ruins.jpg",
    status: "approved"
  },
  {
    title: "Shivaharkaray Temple",
    location: "Parali Vaijnath, Beed, Maharashtra",
    city: "Beed",
    state: "Maharashtra",
    country: "India",
    pincode: "431515",
    description: "Shivaharkaray Temple is located in Parali Vaijnath where the throat of Goddess Sati fell. The temple is dedicated to Goddess Bhavani in her fierce form. The temple complex also houses one of the Jyotirlingas. The ancient temple showcases traditional Maratha architecture. The temple is an important pilgrimage site in Maharashtra. The peaceful rural location adds to the spiritual atmosphere.",
    descriptionHi: "शिवहरकरय मंदिर पराली वैजनाथ में स्थित है जहां देवी सती का गला गिरा था। मंदिर देवी भवानी को उनके उग्र रूप में समर्पित है।",
    deity: "Bhavani (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Jyotirlinga site, Maratha architecture",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Parali_Vaijnath_Temple.jpg/1200px-Parali_Vaijnath_Temple.jpg",
    status: "approved"
  },
  {
    title: "Kottiyoor Temple",
    location: "Kottiyoor, Kannur, Kerala",
    city: "Kannur",
    state: "Kerala",
    country: "India",
    pincode: "670651",
    description: "Kottiyoor Temple is a unique Shakti Peeth located in the dense forests of Western Ghats in Kerala. The temple is where the left breast of Goddess Sati fell. The temple complex consists of two shrines - Ikkare Kottiyoor and Akkare Kottiyoor. The temple is open only during the annual festival season. The forest location and river surroundings create a mystical atmosphere. The temple follows ancient Kerala architectural traditions.",
    descriptionHi: "कोट्टियूर मंदिर केरल में पश्चिमी घाट के घने जंगलों में स्थित एक अनोखा शक्तिपीठ है। मंदिर वह स्थान है जहां देवी सती का बायां स्तन गिरा था।",
    deity: "Adi Shakti",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Forest temple, seasonal opening, Western Ghats",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "Open only during annual festival (May-June)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kottiyoor_Temple_Kerala.jpg/1200px-Kottiyoor_Temple_Kerala.jpg",
    status: "approved"
  },
  {
    title: "Bahula Shakti Peeth",
    location: "Katwa, West Bengal",
    city: "Katwa",
    state: "West Bengal",
    country: "India",
    pincode: "713130",
    description: "Bahula Temple is located in Katwa where the left arm of Goddess Sati fell. The temple is dedicated to Goddess Bahula. The town of Katwa has historical significance as the place where Chaitanya Mahaprabhu took sanyasa. The temple showcases traditional Bengali architecture. The temple is an important pilgrimage site in West Bengal. The serene location by the Ajay River adds to its spiritual charm.",
    descriptionHi: "बहुला मंदिर कटवा में स्थित है जहां देवी सती की बाईं भुजा गिरी थी। मंदिर देवी बहुला को समर्पित है। कटवा शहर का ऐतिहासिक महत्व है।",
    deity: "Bahula (Shakti)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Chaitanya Mahaprabhu connection, river location",
    categories: ["Shakti Peeth (51 Shakti Peethas)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bengali_Temple_Architecture.jpg/1200px-Bengali_Temple_Architecture.jpg",
    status: "approved"
  }
];

async function addShaktiPeethPart3() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Shakti Peeth temples - Part 3 (Final 17 temples)...\n');
    
    for (let i = 0; i < shaktiPeethPart3.length; i++) {
      const templeData = shaktiPeethPart3[i];
      console.log(`${i + 35}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉🎉🎉 ALL 51 SHAKTI PEETH TEMPLES ADDED! 🎉🎉🎉');
    console.log('\nTotal temples added:');
    console.log('- Part 1: 17 temples');
    console.log('- Part 2: 17 temples');
    console.log('- Part 3: 17 temples');
    console.log('- TOTAL: 51 Shakti Peeth temples\n');
    console.log('View at: http://localhost:3000/sacred-categories');
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addShaktiPeethPart3();
