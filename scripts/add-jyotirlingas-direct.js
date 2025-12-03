// Direct MongoDB script to add 12 Jyotirlinga temples
// Run with: node scripts/add-jyotirlingas-direct.js

const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

// Temple Schema
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

const jyotirlingas = [
  {
    title: "Somnath Temple",
    location: "Veraval, Saurashtra, Gujarat",
    city: "Veraval",
    state: "Gujarat",
    country: "India",
    pincode: "362268",
    description: "Somnath Temple stands as the first among the twelve Jyotirlingas of Lord Shiva. Located on the western coast of Gujarat, this ancient shrine has been rebuilt several times throughout history. The temple faces the Arabian Sea and represents eternal faith and devotion. Its architectural grandeur combines traditional Hindu temple design with modern construction techniques. The temple complex includes various shrines, a museum, and beautiful gardens overlooking the ocean.",
    descriptionHi: "सोमनाथ मंदिर भगवान शिव के बारह ज्योतिर्लिंगों में प्रथम है। गुजरात के पश्चिमी तट पर स्थित यह प्राचीन मंदिर इतिहास में कई बार पुनर्निर्मित किया गया है। मंदिर अरब सागर के सामने है और अनंत विश्वास और भक्ति का प्रतिनिधित्व करता है।",
    deity: "Shiva",
    establishedYear: "Ancient (Current structure: 1951)",
    templeType: "Ancient",
    speciality: "First Jyotirlinga, oceanfront location",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Somnath_Temple_-_Front_view.jpg/1200px-Somnath_Temple_-_Front_view.jpg",
    phone: "02876-231565",
    website: "https://www.somnath.org",
    status: "approved"
  },
  {
    title: "Mallikarjuna Jyotirlinga Temple",
    location: "Srisailam, Andhra Pradesh",
    city: "Srisailam",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "518101",
    description: "Mallikarjuna Temple is situated on the Srisailam hill beside the Krishna River in Andhra Pradesh. This sacred shrine is one of the rare temples where both Jyotirlinga and Shakti Peetha exist together. The temple is dedicated to Lord Mallikarjuna (Shiva) and Goddess Bhramaramba (Parvati). Surrounded by dense forests and wildlife, the temple offers a serene spiritual atmosphere. The architecture showcases Dravidian style with intricate carvings and towering gopurams.",
    descriptionHi: "मल्लिकार्जुन मंदिर आंध्र प्रदेश में कृष्णा नदी के किनारे श्रीशैलम पहाड़ी पर स्थित है। यह पवित्र मंदिर उन दुर्लभ मंदिरों में से एक है जहां ज्योतिर्लिंग और शक्तिपीठ दोनों एक साथ मौजूद हैं।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Jyotirlinga and Shakti Peetha combined",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)", "Shakti Peeth (51 Shakti Peethas)"],
    timings: "4:30 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mallikarjuna_Swamy_temple_Srisailam.jpg/1200px-Mallikarjuna_Swamy_temple_Srisailam.jpg",
    phone: "08524-287333",
    website: "https://www.srisailamonline.com",
    status: "approved"
  },
  {
    title: "Mahakaleshwar Jyotirlinga Temple",
    location: "Ujjain, Madhya Pradesh",
    city: "Ujjain",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "456001",
    description: "Mahakaleshwar Temple in Ujjain is one of the most sacred Jyotirlingas, known for its south-facing idol which is considered unique among all twelve. The temple is located on the banks of the holy Shipra River. The famous Bhasma Aarti performed every morning with sacred ash is a divine experience. Ujjain is also one of the four sites for the Kumbh Mela. The temple complex features stunning architecture with five levels and a large courtyard.",
    descriptionHi: "उज्जैन में महाकालेश्वर मंदिर सबसे पवित्र ज्योतिर्लिंगों में से एक है, जो अपनी दक्षिण-मुखी मूर्ति के लिए जाना जाता है। मंदिर पवित्र शिप्रा नदी के तट पर स्थित है। प्रतिदिन प्रातः काल होने वाली प्रसिद्ध भस्म आरती एक दिव्य अनुभव है।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "South-facing Jyotirlinga, Bhasma Aarti",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)", "Sapta Puri (7 Sacred Cities)"],
    timings: "4:00 AM - 11:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Mahakaleshwar_Temple_Ujjain.jpg/1200px-Mahakaleshwar_Temple_Ujjain.jpg",
    phone: "0734-2550563",
    website: "https://www.mahakaleshwar.nic.in",
    status: "approved"
  },
  {
    title: "Omkareshwar Jyotirlinga Temple",
    location: "Omkareshwar, Khandwa, Madhya Pradesh",
    city: "Khandwa",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "450554",
    description: "Omkareshwar Temple is situated on an island called Mandhata or Shivapuri in the Narmada River. The island is shaped like the Hindu sacred symbol Om, giving the temple its name. The temple showcases beautiful architecture in North Indian Nagara style. Pilgrims reach the temple by crossing bridges over the sacred Narmada. The peaceful atmosphere and river surroundings create a perfect environment for meditation and spiritual practices.",
    descriptionHi: "ओंकारेश्वर मंदिर नर्मदा नदी में मांधाता या शिवपुरी नामक द्वीप पर स्थित है। यह द्वीप हिंदू पवित्र प्रतीक ॐ के आकार का है, जिससे मंदिर को इसका नाम मिला है।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Om-shaped island, Narmada river location",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "5:00 AM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Omkareshwar_Temple.jpg/1200px-Omkareshwar_Temple.jpg",
    phone: "07280-271434",
    status: "approved"
  },
  {
    title: "Kedarnath Temple",
    location: "Kedarnath, Rudraprayag, Uttarakhand",
    city: "Kedarnath",
    state: "Uttarakhand",
    country: "India",
    pincode: "246445",
    description: "Kedarnath Temple is located in the Garhwal Himalayas at an elevation of 3,583 meters. This ancient temple is one of the Char Dhams and Panch Kedars. Built by Adi Shankaracharya, the temple withstands extreme weather conditions. The trek to Kedarnath offers breathtaking Himalayan views. Due to heavy snowfall, the temple remains open only from April to November. The massive stone structure and surrounding snow-capped peaks create an awe-inspiring sight.",
    descriptionHi: "केदारनाथ मंदिर गढ़वाल हिमालय में 3,583 मीटर की ऊंचाई पर स्थित है। यह प्राचीन मंदिर चार धामों और पंच केदारों में से एक है। आदि शंकराचार्य द्वारा निर्मित यह मंदिर चरम मौसम की स्थिति का सामना करता है।",
    deity: "Shiva",
    establishedYear: "8th Century CE",
    templeType: "Ancient",
    speciality: "Himalayan location, Char Dham, Panch Kedar",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)", "Char Dham", "Panch Kedar"],
    timings: "6:00 AM - 7:00 PM (Apr-Nov only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kedarnath.JPG/1200px-Kedarnath.JPG",
    phone: "01364-223204",
    website: "https://badarikedar.org",
    status: "approved"
  },
  {
    title: "Bhimashankar Temple",
    location: "Bhorgiri Village, Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "410509",
    description: "Bhimashankar Temple is nestled in the Sahyadri hills of Maharashtra, surrounded by dense forests and wildlife sanctuary. The temple is the source of the Bhima River. The architecture reflects the Nagara style with intricate carvings depicting various mythological stories. The temple complex includes several smaller shrines and a beautiful courtyard. The surrounding forest is home to rare species including the giant squirrel and is part of a biodiversity hotspot.",
    descriptionHi: "भीमाशंकर मंदिर महाराष्ट्र की सह्याद्री पहाड़ियों में घने जंगलों और वन्यजीव अभयारण्य से घिरा हुआ है। मंदिर भीमा नदी का स्रोत है।",
    deity: "Shiva",
    establishedYear: "Ancient (Rebuilt 18th Century)",
    templeType: "Ancient",
    speciality: "Source of Bhima River, wildlife sanctuary",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "5:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Bhimashankar_temple.jpg/1200px-Bhimashankar_temple.jpg",
    phone: "02132-224223",
    status: "approved"
  },
  {
    title: "Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "221001",
    description: "Kashi Vishwanath Temple in Varanasi is one of the most famous Hindu temples dedicated to Lord Shiva. Located on the western bank of the holy Ganga River, the temple has been a center of faith for millions. The current structure was built by Maharani Ahilyabai Holkar in 1780. The temple's golden spire and dome are iconic landmarks of Varanasi. The temple complex underwent major renovation and expansion recently, creating a grand corridor and visitor facilities.",
    descriptionHi: "वाराणसी में काशी विश्वनाथ मंदिर भगवान शिव को समर्पित सबसे प्रसिद्ध हिंदू मंदिरों में से एक है। पवित्र गंगा नदी के पश्चिमी तट पर स्थित यह मंदिर लाखों लोगों की आस्था का केंद्र रहा है।",
    deity: "Shiva",
    establishedYear: "1780 (Ancient origins)",
    templeType: "Ancient",
    speciality: "Golden temple, Ganga riverfront, holiest Jyotirlinga",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)", "Sapta Puri (7 Sacred Cities)"],
    timings: "2:30 AM - 11:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Kashi_Vishwanath_Temple_Banaras.jpg/1200px-Kashi_Vishwanath_Temple_Banaras.jpg",
    phone: "0542-2392059",
    website: "https://www.shrikashivishwanath.org",
    status: "approved"
  },
  {
    title: "Trimbakeshwar Temple",
    location: "Trimbak, Nashik, Maharashtra",
    city: "Nashik",
    state: "Maharashtra",
    country: "India",
    pincode: "422212",
    description: "Trimbakeshwar Temple is located at the source of the Godavari River in the Brahmagiri mountain range. The temple features unique three-faced lingam representing Brahma, Vishnu, and Mahesh. The temple architecture is in Hemadpanthi style with black stone construction and intricate carvings. The temple town is also famous for the Kumbh Mela held every twelve years. The natural spring Kushavarta, origin of Godavari, is within the temple complex.",
    descriptionHi: "त्र्यंबकेश्वर मंदिर ब्रह्मगिरि पर्वत श्रृंखला में गोदावरी नदी के उद्गम स्थल पर स्थित है। मंदिर में ब्रह्मा, विष्णु और महेश का प्रतिनिधित्व करने वाला अनोखा त्रिमुखी लिंग है।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Three-faced lingam, Godavari source",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "5:30 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Trimbakeshwar_Shiva_Temple.jpg/1200px-Trimbakeshwar_Shiva_Temple.jpg",
    phone: "02594-231350",
    status: "approved"
  },
  {
    title: "Vaidyanath Jyotirlinga Temple",
    location: "Deoghar, Jharkhand",
    city: "Deoghar",
    state: "Jharkhand",
    country: "India",
    pincode: "814112",
    description: "Vaidyanath Temple in Deoghar is also known as Baba Baidyanath Dham. The temple complex consists of the main temple and 21 other temples. During the holy month of Shravan, millions of devotees undertake the Kanwar Yatra, carrying water from the Ganga to offer at the temple. The temple architecture showcases traditional Indian design with a pyramidal shikhara. The town of Deoghar means 'abode of gods' and has been a pilgrimage center for centuries.",
    descriptionHi: "देवघर में वैद्यनाथ मंदिर को बाबा बैद्यनाथ धाम के नाम से भी जाना जाता है। मंदिर परिसर में मुख्य मंदिर और 21 अन्य मंदिर हैं। श्रावण के पवित्र महीने में लाखों भक्त कांवर यात्रा करते हैं।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Kanwar Yatra destination, 22 temple complex",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "4:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Baba_Baidyanath_Temple_Deoghar.jpg/1200px-Baba_Baidyanath_Temple_Deoghar.jpg",
    phone: "06432-232219",
    status: "approved"
  },
  {
    title: "Nageshwar Jyotirlinga Temple",
    location: "Dwarka, Gujarat",
    city: "Dwarka",
    state: "Gujarat",
    country: "India",
    pincode: "361335",
    description: "Nageshwar Temple is located on the route between Dwarka and Bet Dwarka island in Gujarat. The temple features a massive 25-meter tall statue of Lord Shiva in a seated meditation pose. The temple is mentioned in the Shiva Purana and is believed to protect devotees from all poisons and negative energies. The peaceful coastal location and modern temple complex make it a popular pilgrimage destination. The temple gardens and surroundings are well-maintained and offer a serene atmosphere.",
    descriptionHi: "नागेश्वर मंदिर गुजरात में द्वारका और बेट द्वारका द्वीप के बीच मार्ग पर स्थित है। मंदिर में ध्यान मुद्रा में बैठे भगवान शिव की विशाल 25 मीटर ऊंची मूर्ति है।",
    deity: "Shiva",
    establishedYear: "Ancient (Modern additions)",
    templeType: "Ancient",
    speciality: "25-meter Shiva statue, coastal location",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Nageshwar_Jyotirlinga_Temple.jpg/1200px-Nageshwar_Jyotirlinga_Temple.jpg",
    phone: "02892-234845",
    status: "approved"
  },
  {
    title: "Rameshwaram Jyotirlinga Temple",
    location: "Rameshwaram, Tamil Nadu",
    city: "Rameshwaram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "623526",
    description: "Rameshwaram Temple is located on Pamban Island and is one of the Char Dhams. The temple is famous for its magnificent architecture with the longest corridor among all Hindu temples. It has 22 wells (theerthams) within the temple complex. According to legend, Lord Rama worshipped Lord Shiva here before crossing to Lanka. The temple showcases Dravidian architecture with towering gopurams and intricate sculptures. The sea surrounding the island adds to the spiritual ambiance.",
    descriptionHi: "रामेश्वरम मंदिर पंबन द्वीप पर स्थित है और चार धामों में से एक है। मंदिर अपनी शानदार वास्तुकला के लिए प्रसिद्ध है जिसमें सभी हिंदू मंदिरों में सबसे लंबा गलियारा है।",
    deity: "Shiva",
    establishedYear: "12th Century CE",
    templeType: "Ancient",
    speciality: "Char Dham, longest corridor, 22 sacred wells",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)", "Char Dham"],
    timings: "5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Ramanathaswamy_Temple.jpg/1200px-Ramanathaswamy_Temple.jpg",
    phone: "04573-221223",
    website: "https://www.rameshwaramtemple.com",
    status: "approved"
  },
  {
    title: "Grishneshwar Jyotirlinga Temple",
    location: "Ellora Caves, Aurangabad, Maharashtra",
    city: "Aurangabad",
    state: "Maharashtra",
    country: "India",
    pincode: "431005",
    description: "Grishneshwar Temple is the smallest among the twelve Jyotirlingas but holds immense spiritual significance. Located near the famous Ellora Caves, a UNESCO World Heritage Site, the temple combines religious and historical importance. The temple was reconstructed by Ahilyabai Holkar in the 18th century. The red stone architecture with intricate carvings represents classic Hindu temple design. The temple's proximity to Ellora and Ajanta Caves makes it a popular pilgrimage and tourism destination.",
    descriptionHi: "घृष्णेश्वर मंदिर बारह ज्योतिर्लिंगों में सबसे छोटा है लेकिन अपार आध्यात्मिक महत्व रखता है। प्रसिद्ध एलोरा गुफाओं के पास स्थित यह मंदिर धार्मिक और ऐतिहासिक महत्व को जोड़ता है।",
    deity: "Shiva",
    establishedYear: "18th Century (Ancient origins)",
    templeType: "Ancient",
    speciality: "Smallest Jyotirlinga, near Ellora Caves",
    categories: ["Dwadash Jyotirlinga (12 Jyotirlingas)"],
    timings: "5:30 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Grishneshwar_temple.jpg/1200px-Grishneshwar_temple.jpg",
    phone: "02437-244472",
    status: "approved"
  }
];

async function addJyotirlingas() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Starting to add 12 Jyotirlinga temples...\n');
    
    for (let i = 0; i < jyotirlingas.length; i++) {
      const templeData = jyotirlingas[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed to add ${templeData.title}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 All 12 Jyotirlingas processed!');
    console.log('\nYou can now view them at:');
    console.log('- All temples: http://localhost:3000/temples');
    console.log('- Sacred categories: http://localhost:3000/sacred-categories');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
addJyotirlingas();
