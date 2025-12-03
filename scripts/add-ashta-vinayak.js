// Script to add Ashta Vinayak - 8 sacred Ganesha temples in Maharashtra
// Run with: node scripts/add-ashta-vinayak.js

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

const ashtaVinayak = [
  {
    title: "Moreshwar Temple, Morgaon",
    location: "Morgaon, Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "412405",
    description: "Moreshwar Temple at Morgaon is the first and foremost temple among the Ashta Vinayak temples. The idol of Lord Ganesha here is known as Mayureshwar or Moreshwar. According to legend, Lord Ganesha killed the demon Sindhu here. The temple faces north, which is unique among all Ashta Vinayak temples. The idol is flanked by his consorts Riddhi and Siddhi. The temple has a beautiful Nagar-style architecture with a deep water tank called Karnika Tirtha. Pilgrims traditionally begin the Ashta Vinayak yatra from Morgaon. The temple celebrates Ganesh Chaturthi with great fervor. The idol is believed to be self-manifested (Swayambhu). The temple complex includes a museum and facilities for devotees.",
    descriptionHi: "मोरगांव का मोरेश्वर मंदिर अष्ट विनायक मंदिरों में पहला और सबसे महत्वपूर्ण मंदिर है। यहां भगवान गणेश की मूर्ति मयूरेश्वर या मोरेश्वर के नाम से जानी जाती है।",
    deity: "Mayureshwar (Ganesha)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "First Ashta Vinayak, Mayureshwar, defeated demon Sindhu, starting point of yatra",
    categories: ["Ashta Vinayak"],
    timings: "5:30 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Morgaon_Ganesha_Temple.jpg/1200px-Morgaon_Ganesha_Temple.jpg",
    phone: "02113-284237",
    status: "approved"
  },
  {
    title: "Siddhivinayak Temple, Siddhatek",
    location: "Siddhatek, Ahmednagar, Maharashtra",
    city: "Ahmednagar",
    state: "Maharashtra",
    country: "India",
    pincode: "414102",
    description: "Siddhivinayak Temple at Siddhatek is located on the banks of River Bhima. The idol here is known as Siddhivinayak, meaning the one who grants wishes and success. The temple is believed to be the place where Lord Vishnu defeated demons Madhu and Kaitabha with Ganesha's blessings. The idol faces east and is considered extremely powerful for fulfilling devotees' desires. The temple has a unique six-pillared sabha mandap. The name Siddhatek itself means 'place of accomplishment'. The temple architecture is simple yet elegant. Devotees believe that worshipping here removes all obstacles and grants siddhis (spiritual powers). The temple is surrounded by scenic hills and the flowing Bhima river creates a serene atmosphere.",
    descriptionHi: "सिद्धटेक का सिद्धिविनायक मंदिर भीमा नदी के तट पर स्थित है। यहां की मूर्ति सिद्धिविनायक के नाम से जानी जाती है, जिसका अर्थ है इच्छाएं और सफलता प्रदान करने वाला।",
    deity: "Siddhivinayak (Ganesha)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Grants wishes and success, Vishnu defeated demons here, River Bhima banks",
    categories: ["Ashta Vinayak"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Siddhatek_Temple.jpg/1200px-Siddhatek_Temple.jpg",
    phone: "02487-222456",
    status: "approved"
  },
  {
    title: "Ballaleshwar Temple, Pali",
    location: "Pali, Raigad, Maharashtra",
    city: "Raigad",
    state: "Maharashtra",
    country: "India",
    pincode: "402301",
    description: "Ballaleshwar Temple at Pali is unique as it is the only Ganesha temple where the deity is known by his devotee's name. The temple is named after Ballal, a young devotee of Lord Ganesha. According to legend, Ballal was punished by his father for extreme devotion to Ganesha, and the Lord himself appeared to save him. The idol faces east and is believed to be very powerful. The temple has beautiful wooden architecture and a serene environment surrounded by hills. The original temple was built in 1760 by Nana Phadnavis. The temple complex has facilities for devotees including accommodation. The temple is known for granting wishes related to family harmony and children. The village of Pali offers a peaceful pilgrimage experience.",
    descriptionHi: "पाली का बल्लालेश्वर मंदिर अनोखा है क्योंकि यह एकमात्र गणेश मंदिर है जहां देवता को उनके भक्त के नाम से जाना जाता है। मंदिर का नाम भगवान गणेश के युवा भक्त बल्लाल के नाम पर है।",
    deity: "Ballaleshwar (Ganesha)",
    establishedYear: "1760 CE",
    templeType: "Historic",
    speciality: "Only Ganesha named after devotee, family harmony, beautiful wooden architecture",
    categories: ["Ashta Vinayak"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ballaleshwar_Temple_Pali.jpg/1200px-Ballaleshwar_Temple_Pali.jpg",
    phone: "02140-222345",
    status: "approved"
  },
  {
    title: "Varadavinayak Temple, Mahad",
    location: "Mahad, Raigad, Maharashtra",
    city: "Raigad",
    state: "Maharashtra",
    country: "India",
    pincode: "402301",
    description: "Varadavinayak Temple at Mahad houses the deity known as Varadavinayak, meaning 'the giver of bounty and success'. The temple is situated in a serene location surrounded by dense forests. The idol is believed to have been discovered in a nearby lake. The unique feature is that the idol's trunk turns towards the left, and it is made of black stone. The temple was renovated in 1725 CE. The main hall has a beautiful lamp tower with multiple tiers. The temple is known for granting boons related to wealth, prosperity, and business success. Legend says that Goddess Parvati worshipped Ganesha here to have him as her son. The temple architecture reflects traditional Maratha style. The peaceful environment makes it ideal for meditation.",
    descriptionHi: "महाड का वरदविनायक मंदिर वरदविनायक देवता का घर है, जिसका अर्थ है 'उदारता और सफलता देने वाला'। मंदिर घने जंगलों से घिरे शांत स्थान पर स्थित है।",
    deity: "Varadavinayak (Ganesha)",
    establishedYear: "1725 CE (renovated)",
    templeType: "Historic",
    speciality: "Grants wealth and prosperity, left-turning trunk, black stone idol, forest setting",
    categories: ["Ashta Vinayak"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Varadavinayak_Temple_Mahad.jpg/1200px-Varadavinayak_Temple_Mahad.jpg",
    phone: "02145-220456",
    status: "approved"
  },
  {
    title: "Chintamani Temple, Theur",
    location: "Theur, Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "412110",
    description: "Chintamani Temple at Theur is dedicated to Chintamani Vinayak, who removes all worries and anxieties. According to legend, Lord Ganesha recovered the sacred Chintamani jewel from the demon Gana and restored it to sage Kapila here. The idol is believed to fulfill all wishes and remove mental stress. The temple was built on the banks of Mula-Mutha river. The temple has a rich history and was patronized by Peshwa rulers. The main idol is self-manifested and is adorned with diamonds on special occasions. The temple celebrates all major Ganesha festivals with grandeur. The temple complex includes a beautiful garden and facilities for devotees. Theur is also associated with Sant Dnyaneshwar who meditated here.",
    descriptionHi: "थेऊर का चिंतामणि मंदिर चिंतामणि विनायक को समर्पित है, जो सभी चिंताओं और परेशानियों को दूर करता है। किंवदंती के अनुसार, भगवान गणेश ने यहां राक्षस गण से पवित्र चिंतामणि रत्न को पुनः प्राप्त किया।",
    deity: "Chintamani (Ganesha)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Removes worries and anxiety, Chintamani jewel legend, mental peace",
    categories: ["Ashta Vinayak"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Chintamani_Temple_Theur.jpg/1200px-Chintamani_Temple_Theur.jpg",
    phone: "020-26891235",
    status: "approved"
  },
  {
    title: "Girijatmaj Temple, Lenyadri",
    location: "Lenyadri, Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "410502",
    description: "Girijatmaj Temple at Lenyadri is unique as it is carved out of a single rock in a cave on a mountain. The temple is reached by climbing 283 steps. The deity is called Girijatmaj, meaning 'son of Girija (Parvati)'. This is believed to be the actual birthplace of Lord Ganesha where Goddess Parvati gave birth to him. The temple is one of the eight Ashtavinayak temples and also counted among the 18 Shakti Peethas. The cave temple dates back to the 1st century CE Buddhist era but was later converted to a Hindu shrine. The idol is installed in cave number 7 among several Buddhist caves. The temple offers panoramic views of the surrounding Sahyadri mountains. The natural cave setting provides a mystical spiritual experience.",
    descriptionHi: "लेण्याद्री का गिरिजात्मज मंदिर अनोखा है क्योंकि यह पहाड़ की गुफा में एक ही चट्टान से तराशा गया है। मंदिर तक पहुंचने के लिए 283 सीढ़ियां चढ़नी पड़ती हैं।",
    deity: "Girijatmaj (Ganesha)",
    establishedYear: "1st Century CE",
    templeType: "Ancient Cave Temple",
    speciality: "Cave temple, Ganesha's birthplace, 283 steps, mountain setting, Buddhist heritage",
    categories: ["Ashta Vinayak"],
    timings: "6:00 AM - 6:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Lenyadri_Girijatmaj_Temple.jpg/1200px-Lenyadri_Girijatmaj_Temple.jpg",
    phone: "02132-222567",
    status: "approved"
  },
  {
    title: "Vighnahar Temple, Ozar",
    location: "Ozar, Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "410507",
    description: "Vighnahar Temple at Ozar is dedicated to Vighnahar Vinayak, the remover of obstacles. According to legend, Lord Ganesha killed the demon Vignasur (obstacle demon) here, hence the name Vighnahar. The temple is believed to remove all obstacles from devotees' lives. The idol faces east and has a unique feature - the trunk turns to the left. The temple was built in the 18th century by Chimaji Appa of the Peshwa dynasty. The temple architecture showcases beautiful stone carvings and sculptures. A sacred lake called Pushkarini is located near the temple. The temple is surrounded by lush greenery and provides a peaceful atmosphere. Devotees offer modaks (sweet dumplings) to Lord Ganesha here. The temple sees huge crowds during Ganesh Chaturthi.",
    descriptionHi: "ओझर का विघ्नहर मंदिर विघ्नहर विनायक को समर्पित है, जो बाधाओं को दूर करने वाला है। किंवदंती के अनुसार, भगवान गणेश ने यहां विघ्नासुर राक्षस को मारा था।",
    deity: "Vighnahar (Ganesha)",
    establishedYear: "18th Century CE",
    templeType: "Historic",
    speciality: "Removes all obstacles, defeated Vignasur demon, left-turning trunk, Peshwa architecture",
    categories: ["Ashta Vinayak"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Vighnahar_Temple_Ozar.jpg/1200px-Vighnahar_Temple_Ozar.jpg",
    phone: "02132-222890",
    status: "approved"
  },
  {
    title: "Mahaganapati Temple, Ranjangaon",
    location: "Ranjangaon, Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "412220",
    description: "Mahaganapati Temple at Ranjangaon is the last temple in the Ashta Vinayak circuit and is considered very powerful. The deity here is called Mahaganapati, the Great Ganesha. According to legend, Lord Ganesha defeated the demon Tripurasura here at the request of the gods. The idol is unique as it has ten trunks and twenty hands, representing all ten avatars of Ganesha. The temple faces east and has magnificent architecture built during the Peshwa period. The temple has beautiful pillars and intricate carvings. The main sanctum has a golden dome. The temple is surrounded by seven layers of walls representing the seven chakras. Pilgrims traditionally end their Ashta Vinayak yatra at this temple. The temple holds great significance for removing all types of obstacles.",
    descriptionHi: "रंजनगांव का महागणपति मंदिर अष्ट विनायक सर्किट का अंतिम मंदिर है और बहुत शक्तिशाली माना जाता है। यहां के देवता को महागणपति, महान गणेश कहा जाता है।",
    deity: "Mahaganapati (Ganesha)",
    establishedYear: "Peshwa Period",
    templeType: "Historic",
    speciality: "Last Ashta Vinayak, ten trunks and twenty hands, defeated Tripurasura, powerful",
    categories: ["Ashta Vinayak"],
    timings: "6:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Mahaganapati_Temple_Ranjangaon.jpg/1200px-Mahaganapati_Temple_Ranjangaon.jpg",
    phone: "02138-222678",
    status: "approved"
  }
];

async function addAshtaVinayak() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Ashta Vinayak - 8 Sacred Ganesha Temples...\n');
    
    for (let i = 0; i < ashtaVinayak.length; i++) {
      const templeData = ashtaVinayak[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Ashta Vinayak complete!');
    console.log('\nAll Eight Sacred Ganesha Temples in Maharashtra:');
    console.log('1. 🏛️  Moreshwar (Morgaon) - First temple, yatra starting point');
    console.log('2. 🙏 Siddhivinayak (Siddhatek) - Grants success and wishes');
    console.log('3. 👦 Ballaleshwar (Pali) - Named after devotee Ballal');
    console.log('4. 💰 Varadavinayak (Mahad) - Wealth and prosperity');
    console.log('5. 💎 Chintamani (Theur) - Removes worries, Chintamani jewel');
    console.log('6. ⛰️  Girijatmaj (Lenyadri) - Cave temple, Ganesha birthplace, 283 steps');
    console.log('7. 🚫 Vighnahar (Ozar) - Removes all obstacles');
    console.log('8. 👑 Mahaganapati (Ranjangaon) - Last temple, 10 trunks & 20 hands!');
    console.log('\n🐘 Complete Ashta Vinayak yatra: Morgaon → Ranjangaon');
    console.log('🙏 Traditional pilgrimage circuit in Maharashtra for Lord Ganesha devotees!');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addAshtaVinayak();
