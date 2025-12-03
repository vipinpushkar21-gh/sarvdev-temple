// Script to add Pancha Bhoota Stalam - 5 element temples
// Run with: node scripts/add-pancha-bhoota-stalam.js

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

const panchaBhootaStalam = [
  {
    title: "Tiruvannamalai Arunachaleswarar Temple",
    location: "Tiruvannamalai, Tamil Nadu",
    city: "Tiruvannamalai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "606601",
    description: "Arunachaleswarar Temple is one of the largest temples in India and represents the Fire (Agni) element among the Pancha Bhoota Stalas. The temple is dedicated to Lord Shiva as Arunachaleswarar and Goddess Parvati as Unnamulai Amman. The sacred Arunachala Hill itself is considered a manifestation of fire. The temple covers 25 acres with massive gopurams, the tallest reaching 217 feet. The annual Karthigai Deepam festival sees a huge fire lit atop the hill, visible for miles. Saint Ramana Maharshi attained enlightenment here. The temple has four massive gateway towers and several prakarams (corridors). The Girivalam (circumambulation) of the 14 km hill path is considered highly sacred. Millions of devotees visit during full moon days and festivals.",
    descriptionHi: "अरुणाचलेश्वरर मंदिर भारत के सबसे बड़े मंदिरों में से एक है और पंच भूत स्थलों में अग्नि तत्व का प्रतिनिधित्व करता है।",
    deity: "Arunachaleswarar (Shiva)",
    establishedYear: "9th Century CE",
    templeType: "Ancient",
    speciality: "Fire element, largest temple complex, Karthigai Deepam, Ramana Maharshi, Girivalam",
    categories: ["Pancha Bhoota Stalam"],
    timings: "5:30 AM - 12:30 PM, 3:30 PM - 9:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Arunachaleswara_Temple_Tiruvannamalai.jpg/1200px-Arunachaleswara_Temple_Tiruvannamalai.jpg",
    phone: "04175-252056",
    website: "https://arulmigu-arunachaleswarar.tnhrce.in",
    status: "approved"
  },
  {
    title: "Chidambaram Nataraja Temple",
    location: "Chidambaram, Cuddalore, Tamil Nadu",
    city: "Chidambaram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "608001",
    description: "Thillai Nataraja Temple at Chidambaram represents the Sky/Space (Akasha) element and is one of the most sacred Shiva temples. The temple is famous for the cosmic dance of Lord Shiva as Nataraja in the Chit Sabha (Hall of Consciousness). The main deity is in the form of Akasha Linga, representing formless space. The temple is managed by hereditary priests called Dikshitars who perform ancient Vedic rituals. The temple architecture represents the human body with nine gopurams as nine apertures. The golden roof over the sanctum is a marvel of ancient engineering. The temple has five sabhas (halls) for various purposes. The annual Natyanjali dance festival attracts dancers worldwide. The temple is mentioned in ancient Tamil Shaivite literature.",
    descriptionHi: "चिदंबरम नटराज मंदिर आकाश तत्व का प्रतिनिधित्व करता है और सबसे पवित्र शिव मंदिरों में से एक है। भगवान शिव नटराज के रूप में ब्रह्मांडीय नृत्य करते हैं।",
    deity: "Nataraja (Shiva)",
    establishedYear: "10th Century CE",
    templeType: "Ancient",
    speciality: "Space element, Cosmic Dance, Akasha Linga, golden roof, Natyanjali festival",
    categories: ["Pancha Bhoota Stalam"],
    timings: "6:00 AM - 12:00 PM, 5:00 PM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chidambaram_Temple_Gopuram.jpg/1200px-Chidambaram_Temple_Gopuram.jpg",
    phone: "04144-222424",
    website: "https://chidambaramtemple.org",
    status: "approved"
  },
  {
    title: "Tiruvanaikaval Jambukeswarar Temple",
    location: "Tiruvanaikaval, Trichy, Tamil Nadu",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    country: "India",
    pincode: "620005",
    description: "Thiruvanaikaval Temple is dedicated to Lord Shiva as Jambukeswarar and represents the Water (Appu/Jala) element. The main deity is Appu Lingam, naturally formed and submerged in water that flows from an underground stream. The temple has five prakarams (corridors) covering 18 acres. Goddess Parvati as Akilandeswari is the chief deity here, unusually placed in a higher position than Shiva. According to legend, Goddess Parvati worshipped Shiva here under a Jambu tree. The lingam is always covered with water and special worship is done by priests standing in water. The temple has intricate carvings and sculptures. The innermost sanctum experiences perpetual water seepage. One of the largest temples in Tamil Nadu built by Chola kings.",
    descriptionHi: "तिरुवनैकावल मंदिर भगवान शिव जंबुकेश्वरर को समर्पित है और जल तत्व का प्रतिनिधित्व करता है। मुख्य देवता अप्पु लिंगम है जो पानी में डूबा रहता है।",
    deity: "Jambukeswarar (Shiva)",
    establishedYear: "2nd Century CE",
    templeType: "Ancient",
    speciality: "Water element, Appu Lingam, underground water stream, Akilandeswari",
    categories: ["Pancha Bhoota Stalam"],
    timings: "6:00 AM - 1:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Jambukeswarar_Temple_Trichy.jpg/1200px-Jambukeswarar_Temple_Trichy.jpg",
    phone: "0431-2770221",
    website: "https://jambukeswarar.tnhrce.in",
    status: "approved"
  },
  {
    title: "Kanchipuram Ekambareswarar Temple",
    location: "Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631502",
    description: "Ekambareswarar Temple at Kanchipuram represents the Earth (Prithvi) element among Pancha Bhoota Stalas. The main deity is Prithvi Lingam, believed to have been formed by Goddess Parvati herself from earth/sand. The temple is famous for its ancient 3,500-year-old mango tree with four branches representing the four Vedas. The tree still bears fruits of different tastes. The temple has a massive 59-meter tall Rajagopuram (main tower). The temple covers 25 acres and is one of the largest in Kanchipuram. The thousand-pillared hall is an architectural marvel. Goddess Kamakshi worshipped Shiva here under the mango tree. The temple represents one of the oldest Shiva temples in Tamil Nadu built during Pallava period.",
    descriptionHi: "कांचीपुरम एकंबरेश्वरर मंदिर पंच भूत स्थलों में पृथ्वी तत्व का प्रतिनिधित्व करता है। मुख्य देवता पृथ्वी लिंगम है जो देवी पार्वती ने मिट्टी से बनाया था।",
    deity: "Ekambareswarar (Shiva)",
    establishedYear: "6th Century CE",
    templeType: "Ancient",
    speciality: "Earth element, Prithvi Lingam, 3500-year-old mango tree, four Vedas branches",
    categories: ["Pancha Bhoota Stalam"],
    timings: "6:00 AM - 1:00 PM, 4:00 PM - 9:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Ekambareswarar_Temple_Kanchipuram.jpg/1200px-Ekambareswarar_Temple_Kanchipuram.jpg",
    phone: "044-27222784",
    website: "https://ekambareswarar.tnhrce.in",
    status: "approved"
  },
  {
    title: "Kalahasti Srikalahasteeswara Temple",
    location: "Srikalahasti, Chittoor, Andhra Pradesh",
    city: "Srikalahasti",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "517644",
    description: "Srikalahasteeswara Temple represents the Air/Wind (Vayu) element among Pancha Bhoota Stalas. The temple is famous for Vayu Linga which is worshipped by air itself - a flame inside the sanctum flickers constantly despite no wind source. This is considered a divine miracle. The temple is renowned for Rahu-Ketu pooja and sarpa dosha nivarana (snake curse removal). The temple is located on the banks of Swarnamukhi River at the foothills. Built in Dravidian architectural style with a 120-feet tall gopuram. The temple name comes from Sri (spider), Kala (serpent), and Hasti (elephant) who worshipped Shiva here. The inner sanctum is always closed and worship is done from outside. The temple is famous for Kalamkari art and cloth paintings. Millions visit for Rahu-Ketu pariharams.",
    descriptionHi: "श्रीकालहस्ती मंदिर पंच भूत स्थलों में वायु तत्व का प्रतिनिधित्व करता है। मंदिर वायु लिंगम के लिए प्रसिद्ध है जहां दीपक बिना हवा के लगातार हिलता रहता है।",
    deity: "Srikalahasteeswara (Shiva)",
    establishedYear: "5th Century CE",
    templeType: "Ancient",
    speciality: "Air element, Vayu Linga, self-flickering flame, Rahu-Ketu pooja, sarpa dosha removal",
    categories: ["Pancha Bhoota Stalam"],
    timings: "6:00 AM - 12:30 PM, 3:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Srikalahasti_Temple.jpg/1200px-Srikalahasti_Temple.jpg",
    phone: "08577-222777",
    website: "https://srikalahasti.org",
    status: "approved"
  }
];

async function addPanchaBhootaStalam() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Pancha Bhoota Stalam - 5 Element Temples...\n');
    
    for (let i = 0; i < panchaBhootaStalam.length; i++) {
      const templeData = panchaBhootaStalam[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Pancha Bhoota Stalam complete!');
    console.log('\nAll Five Element Temples (Pancha Bhoota):');
    console.log('1. 🔥 Tiruvannamalai - FIRE (Agni) - Arunachaleswarar Temple');
    console.log('2. 🌌 Chidambaram - SPACE (Akasha) - Nataraja Temple (Cosmic Dance)');
    console.log('3. 💧 Tiruvanaikaval - WATER (Appu) - Jambukeswarar Temple');
    console.log('4. 🌍 Kanchipuram - EARTH (Prithvi) - Ekambareswarar Temple');
    console.log('5. 💨 Kalahasti - AIR (Vayu) - Srikalahasteeswara Temple');
    console.log('\n⚡ Each temple represents one of the five elements (Pancha Bhoota)!');
    console.log('🕉️  Sacred Shiva temples manifesting nature\'s fundamental forces!');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPanchaBhootaStalam();
