// Script to add Chota Char Dham (Uttarakhand) temples
// Run with: node scripts/add-chota-char-dham.js

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

const chotaCharDham = [
  {
    title: "Yamunotri Temple",
    location: "Yamunotri, Uttarkashi, Uttarakhand",
    city: "Uttarkashi",
    state: "Uttarakhand",
    country: "India",
    pincode: "249141",
    description: "Yamunotri Temple is dedicated to Goddess Yamuna and marks the source of the Yamuna River. Located at an altitude of 3,293 meters in the Garhwal Himalayas, it is the westernmost shrine of the Chota Char Dham circuit. The temple was built by Maharaja Pratap Shah of Tehri Garhwal. Pilgrims trek 6 kilometers from Janki Chatti to reach the temple. The sacred Yamuna originates from the Champasar Glacier nearby. Due to heavy snowfall, the temple remains open only from May to November. The hot water springs at Surya Kund are used for cooking rice and potatoes as offerings.",
    descriptionHi: "यमुनोत्री मंदिर देवी यमुना को समर्पित है और यमुना नदी के स्रोत को चिह्नित करता है। गढ़वाल हिमालय में 3,293 मीटर की ऊंचाई पर स्थित यह छोटा चार धाम का सबसे पश्चिमी मंदिर है।",
    deity: "Yamuna (Goddess)",
    establishedYear: "19th Century CE",
    templeType: "Ancient",
    speciality: "Source of Yamuna River, hot springs, highest altitude",
    categories: ["Chota Char Dham (Uttarakhand)"],
    timings: "6:00 AM - 8:00 PM (May-Nov only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Yamunotri_Temple.jpg/1200px-Yamunotri_Temple.jpg",
    phone: "01374-222223",
    website: "https://badarikedar.org",
    status: "approved"
  },
  {
    title: "Gangotri Temple",
    location: "Gangotri, Uttarkashi, Uttarakhand",
    city: "Uttarkashi",
    state: "Uttarakhand",
    country: "India",
    pincode: "249135",
    description: "Gangotri Temple is dedicated to Goddess Ganga and is located near the origin of the holy Ganga River. Situated at 3,100 meters altitude, the temple was built by Gorkha General Amar Singh Thapa in the 18th century. The actual source of Ganga, Gaumukh glacier, is 19 kilometers away from the temple. According to mythology, King Bhagirath performed penance here to bring Ganga to earth. The temple is built in traditional Garhwali style with white granite. The temple opens from May to November due to extreme winter conditions. The sacred Bhagirathi Shila marks the spot where Ganga first descended.",
    descriptionHi: "गंगोत्री मंदिर देवी गंगा को समर्पित है और पवित्र गंगा नदी के उद्गम के पास स्थित है। 3,100 मीटर की ऊंचाई पर स्थित यह मंदिर 18वीं शताब्दी में गोरखा जनरल अमर सिंह थापा द्वारा बनाया गया था।",
    deity: "Ganga (Goddess)",
    establishedYear: "18th Century CE",
    templeType: "Ancient",
    speciality: "Source of Ganga, Bhagirathi Shila, Gaumukh glacier",
    categories: ["Chota Char Dham (Uttarakhand)"],
    timings: "6:00 AM - 9:00 PM (May-Nov only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Gangotri_Temple.jpg/1200px-Gangotri_Temple.jpg",
    phone: "01374-222222",
    website: "https://badarikedar.org",
    status: "approved"
  },
  {
    title: "Badrinath Temple",
    location: "Badrinath, Chamoli, Uttarakhand",
    city: "Chamoli",
    state: "Uttarakhand",
    country: "India",
    pincode: "246422",
    description: "Badrinath Temple is dedicated to Lord Vishnu and is one of the most important pilgrimage sites in Hinduism. Located at 3,300 meters in the Garhwal Himalayas, it is part of both Chota Char Dham and the main Char Dham. The temple was established by Adi Shankaracharya in the 8th century. The main deity is a 1-meter tall black stone idol of Lord Badrinarayan. The temple is situated between Nar and Narayan mountain ranges with the Neelkanth peak as backdrop. Tapt Kund, a natural hot water spring, is located below the temple. The temple opens from April to November and closes during winter when the deity is shifted to Joshimath.",
    descriptionHi: "बद्रीनाथ मंदिर भगवान विष्णु को समर्पित है और हिंदू धर्म में सबसे महत्वपूर्ण तीर्थ स्थलों में से एक है। गढ़वाल हिमालय में 3,300 मीटर की ऊंचाई पर स्थित यह छोटा चार धाम और मुख्य चार धाम दोनों का हिस्सा है।",
    deity: "Vishnu (Badrinarayan)",
    establishedYear: "8th Century CE",
    templeType: "Ancient",
    speciality: "Char Dham, Tapt Kund, Neelkanth peak view",
    categories: ["Chota Char Dham (Uttarakhand)", "Char Dham"],
    timings: "4:30 AM - 9:00 PM (Apr-Nov only)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Badrinath_Temple.jpg/1200px-Badrinath_Temple.jpg",
    phone: "01381-222277",
    website: "https://badarikedar.org",
    status: "approved"
  }
];

async function addChotaCharDham() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Chota Char Dham (Uttarakhand) temples...\n');
    
    // Note: Kedarnath already exists from Jyotirlinga, just need to update its categories
    console.log('Note: Kedarnath already exists with Jyotirlinga category.');
    console.log('Updating Kedarnath to include Chota Char Dham category...\n');
    
    try {
      const kedarnath = await Temple.findOne({ title: "Kedarnath Temple" });
      if (kedarnath) {
        if (!kedarnath.categories.includes("Chota Char Dham (Uttarakhand)")) {
          kedarnath.categories.push("Chota Char Dham (Uttarakhand)");
          await kedarnath.save();
          console.log('✅ Kedarnath updated with Chota Char Dham category\n');
        } else {
          console.log('✅ Kedarnath already has Chota Char Dham category\n');
        }
      }
    } catch (error) {
      console.log('⚠️  Could not update Kedarnath:', error.message, '\n');
    }
    
    for (let i = 0; i < chotaCharDham.length; i++) {
      const templeData = chotaCharDham[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Chota Char Dham complete!');
    console.log('\nTemples added:');
    console.log('1. Yamunotri (Yamuna source)');
    console.log('2. Gangotri (Ganga source)');
    console.log('3. Kedarnath (Updated with category)');
    console.log('4. Badrinath (Both Char Dhams)');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addChotaCharDham();
