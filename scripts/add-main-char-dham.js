// Script to add Main Char Dham temples
// Run with: node scripts/add-main-char-dham.js

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

const mainCharDham = [
  {
    title: "Dwarkadhish Temple",
    location: "Dwarka, Gujarat",
    city: "Dwarka",
    state: "Gujarat",
    country: "India",
    pincode: "361335",
    description: "Dwarkadhish Temple is one of the four sacred Char Dham pilgrimage sites and is dedicated to Lord Krishna. The temple is believed to have been originally built by Lord Krishna's great-grandson Vajranabha over 2,500 years ago. The present temple structure dates back to the 15th-16th century. The temple is built in Chalukya style with 72 pillars supporting the main structure. The five-story building is made of limestone and sand. The temple flag changes five times a day and is 52 yards long. Located on the western coast, it represents the western direction in Char Dham. The temple complex includes several smaller shrines and offers views of the Arabian Sea.",
    descriptionHi: "द्वारकाधीश मंदिर चार पवित्र चार धाम तीर्थ स्थलों में से एक है और भगवान कृष्ण को समर्पित है। माना जाता है कि मूल मंदिर 2,500 साल पहले भगवान कृष्ण के पड़पोते वज्रनाभ द्वारा बनाया गया था।",
    deity: "Krishna",
    establishedYear: "15th-16th Century CE (Ancient origins)",
    templeType: "Ancient",
    speciality: "West direction Char Dham, Arabian Sea location, 72 pillars",
    categories: ["Char Dham"],
    timings: "6:00 AM - 1:00 PM, 5:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Dwarkadhish_Temple.jpg/1200px-Dwarkadhish_Temple.jpg",
    phone: "02892-234012",
    website: "https://www.dwarkadham.com",
    status: "approved"
  },
  {
    title: "Jagannath Temple Puri",
    location: "Puri, Odisha",
    city: "Puri",
    state: "Odisha",
    country: "India",
    pincode: "752001",
    description: "Jagannath Temple is one of the most sacred Char Dham pilgrimage sites dedicated to Lord Jagannath, a form of Vishnu. Built in the 12th century by King Anantavarman Chodaganga Deva, the temple showcases magnificent Kalinga architecture. The temple is famous for the annual Rath Yatra where deities are taken out in massive chariots. The temple has four gates in four cardinal directions with the eastern gate being the main entrance. The temple flag always flies in the opposite direction of wind, considered a miracle. Non-Hindus are not allowed inside the main temple. The temple kitchen is said to be the world's largest, feeding thousands daily. Located on the eastern coast, it represents the eastern direction in Char Dham.",
    descriptionHi: "जगन्नाथ मंदिर सबसे पवित्र चार धाम तीर्थ स्थलों में से एक है जो भगवान जगन्नाथ को समर्पित है। 12वीं शताब्दी में राजा अनंतवर्मन चोडगंगा देव द्वारा निर्मित यह मंदिर शानदार कलिंग वास्तुकला को प्रदर्शित करता है।",
    deity: "Jagannath (Vishnu)",
    establishedYear: "12th Century CE",
    templeType: "Ancient",
    speciality: "East direction Char Dham, Rath Yatra, world's largest kitchen",
    categories: ["Char Dham"],
    timings: "5:00 AM - 12:00 PM, 4:00 PM - 10:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Jagannath_Temple_Puri.jpg/1200px-Jagannath_Temple_Puri.jpg",
    phone: "06752-222106",
    website: "https://www.jagannath.nic.in",
    status: "approved"
  }
];

async function addMainCharDham() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Main Char Dham temples...\n');
    
    // Note: Badrinath and Rameshwaram already exist, just update categories
    console.log('Note: Badrinath already added with Char Dham category.');
    console.log('Note: Rameshwaram already exists from Jyotirlinga.');
    console.log('Updating Rameshwaram to include Char Dham category...\n');
    
    try {
      const rameshwaram = await Temple.findOne({ title: "Rameshwaram Jyotirlinga Temple" });
      if (rameshwaram) {
        if (!rameshwaram.categories.includes("Char Dham")) {
          rameshwaram.categories.push("Char Dham");
          await rameshwaram.save();
          console.log('✅ Rameshwaram updated with Char Dham category\n');
        } else {
          console.log('✅ Rameshwaram already has Char Dham category\n');
        }
      }
    } catch (error) {
      console.log('⚠️  Could not update Rameshwaram:', error.message, '\n');
    }
    
    for (let i = 0; i < mainCharDham.length; i++) {
      const templeData = mainCharDham[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Main Char Dham complete!');
    console.log('\nAll Four Dhams:');
    console.log('1. Badrinath (North - Uttarakhand) - Vishnu');
    console.log('2. Dwarka (West - Gujarat) - Krishna');
    console.log('3. Puri (East - Odisha) - Jagannath');
    console.log('4. Rameshwaram (South - Tamil Nadu) - Shiva');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addMainCharDham();
