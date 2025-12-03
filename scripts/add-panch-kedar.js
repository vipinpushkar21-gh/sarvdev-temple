// Script to add Panch Kedar temples
// Run with: node scripts/add-panch-kedar.js

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

const panchKedar = [
  {
    title: "Tungnath Temple",
    location: "Tungnath, Rudraprayag, Uttarakhand",
    city: "Rudraprayag",
    state: "Uttarakhand",
    country: "India",
    pincode: "246439",
    description: "Tungnath Temple is the highest Shiva temple in the world at 3,680 meters altitude. It is the second temple in the Panch Kedar pilgrimage circuit where the arms of Lord Shiva appeared. The temple is believed to be over 1000 years old and was built by the Pandavas. The trek to Tungnath is 3.5 kilometers from Chopta through rhododendron forests. From here, devotees can trek further to Chandrashila peak for panoramic Himalayan views. The temple showcases traditional North Indian architectural style with stone construction. Due to heavy snowfall, the temple remains open from April to November.",
    descriptionHi: "तुंगनाथ मंदिर 3,680 मीटर की ऊंचाई पर दुनिया का सबसे ऊंचा शिव मंदिर है। यह पंच केदार तीर्थ यात्रा का दूसरा मंदिर है जहां भगवान शिव की भुजाएं प्रकट हुईं।",
    deity: "Shiva",
    establishedYear: "Ancient (1000+ years)",
    templeType: "Ancient",
    speciality: "Highest Shiva temple, Pandava built, Chandrashila peak",
    categories: ["Panch Kedar"],
    timings: "6:00 AM - 7:00 PM (Apr-Nov only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tungnath_Temple.jpg/1200px-Tungnath_Temple.jpg",
    phone: "01364-223204",
    website: "https://badarikedar.org",
    status: "approved"
  },
  {
    title: "Rudranath Temple",
    location: "Rudranath, Chamoli, Uttarakhand",
    city: "Chamoli",
    state: "Uttarakhand",
    country: "India",
    pincode: "246443",
    description: "Rudranath Temple is the third temple in the Panch Kedar circuit located at 2,286 meters altitude. This is where the face of Lord Shiva appeared to the Pandavas. The temple is surrounded by alpine meadows with stunning views of Nanda Devi, Trishul, and Nanda Ghunti peaks. The trek to Rudranath is challenging, covering about 24 kilometers from Gopeshwar. The temple area is known for rare Himalayan flora including the Brahma Kamal. Natural rock formations near the temple are believed to be impressions of Shiva's face. The temple is accessible from May to October.",
    descriptionHi: "रुद्रनाथ मंदिर 2,286 मीटर की ऊंचाई पर स्थित पंच केदार का तीसरा मंदिर है। यहां पांडवों को भगवान शिव का मुख दर्शन हुआ था।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Face of Shiva, alpine meadows, rare flora, challenging trek",
    categories: ["Panch Kedar"],
    timings: "6:00 AM - 6:00 PM (May-Oct only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Rudranath_Temple_Uttarakhand.jpg/1200px-Rudranath_Temple_Uttarakhand.jpg",
    phone: "01372-252241",
    website: "https://badarikedar.org",
    status: "approved"
  },
  {
    title: "Madhyamaheshwar Temple",
    location: "Madhyamaheshwar, Rudraprayag, Uttarakhand",
    city: "Rudraprayag",
    state: "Uttarakhand",
    country: "India",
    pincode: "246439",
    description: "Madhyamaheshwar Temple is the fourth temple in the Panch Kedar circuit at 3,490 meters altitude. Here, the navel portion of Lord Shiva appeared. The temple is also known as Madmaheshwar and is situated in a beautiful valley surrounded by snow-capped peaks. The temple architecture reflects traditional Garhwali style with stone and wood construction. The trek of 18 kilometers from Ransi village passes through dense forests and meadows. Chaukhamba peak dominates the skyline providing spectacular views. The temple is open from May to October due to harsh winter conditions.",
    descriptionHi: "मध्यमहेश्वर मंदिर 3,490 मीटर की ऊंचाई पर पंच केदार का चौथा मंदिर है। यहां भगवान शिव का नाभि भाग प्रकट हुआ था।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Navel of Shiva, Chaukhamba view, beautiful valley",
    categories: ["Panch Kedar"],
    timings: "6:00 AM - 7:00 PM (May-Oct only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Madhyamaheshwar_Temple.jpg/1200px-Madhyamaheshwar_Temple.jpg",
    phone: "01364-223204",
    website: "https://badarikedar.org",
    status: "approved"
  },
  {
    title: "Kalpeshwar Temple",
    location: "Urgam Valley, Chamoli, Uttarakhand",
    city: "Chamoli",
    state: "Uttarakhand",
    country: "India",
    pincode: "246443",
    description: "Kalpeshwar Temple is the fifth and last temple of the Panch Kedar circuit located at 2,200 meters. This is where the matted locks (jata) of Lord Shiva appeared. Unlike other Panch Kedar temples, Kalpeshwar remains open throughout the year. The temple is situated in Urgam valley near a cave where the Shiva lingam is naturally formed. The village setting and relatively easy accessibility make it unique among Panch Kedar temples. The temple is surrounded by dense forests of deodar and oak trees. Ancient stone idols and sculptures can be found in the temple premises.",
    descriptionHi: "कल्पेश्वर मंदिर 2,200 मीटर की ऊंचाई पर पंच केदार का पांचवां और अंतिम मंदिर है। यहां भगवान शिव की जटाएं प्रकट हुईं।",
    deity: "Shiva",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Jata of Shiva, open year-round, cave temple, easy access",
    categories: ["Panch Kedar"],
    timings: "6:00 AM - 8:00 PM (Open all year)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kalpeshwar_Temple.jpg/1200px-Kalpeshwar_Temple.jpg",
    phone: "01372-252241",
    website: "https://badarikedar.org",
    status: "approved"
  }
];

async function addPanchKedar() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Panch Kedar temples...\n');
    
    // Note: Kedarnath already exists, just update category
    console.log('Note: Kedarnath already exists with multiple categories.');
    console.log('Kedarnath is already marked as Panch Kedar from previous setup.\n');
    
    for (let i = 0; i < panchKedar.length; i++) {
      const templeData = panchKedar[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Panch Kedar complete!');
    console.log('\nAll Five Kedar temples:');
    console.log('1. Kedarnath - Hump of Shiva (3,583m) - Jyotirlinga');
    console.log('2. Tungnath - Arms of Shiva (3,680m) - Highest');
    console.log('3. Rudranath - Face of Shiva (2,286m)');
    console.log('4. Madhyamaheshwar - Navel of Shiva (3,490m)');
    console.log('5. Kalpeshwar - Jata of Shiva (2,200m) - Year-round');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPanchKedar();
