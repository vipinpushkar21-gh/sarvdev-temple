// Script to add Panch Prayag - 5 sacred river confluences
// Run with: node scripts/add-panch-prayag.js

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

const panchPrayag = [
  {
    title: "Vishnuprayag",
    location: "Vishnuprayag, Chamoli, Uttarakhand",
    city: "Chamoli",
    state: "Uttarakhand",
    country: "India",
    pincode: "246443",
    description: "Vishnuprayag is the first of the Panch Prayag where the Dhauliganga River meets the Alaknanda River. Located at an altitude of 1,372 meters, this confluence is situated near the town of Joshimath. According to legend, Lord Vishnu appeared here to sage Narada, giving the place its name. The temple at Vishnuprayag is dedicated to Lord Vishnu. The confluence is surrounded by steep mountains and offers breathtaking views. The site holds immense religious significance for Hindu pilgrims traveling to Badrinath. The merging of the two rivers creates a spectacular natural sight with different colored waters joining together.",
    descriptionHi: "विष्णुप्रयाग पंच प्रयाग में पहला है जहां धौलीगंगा नदी अलकनंदा नदी से मिलती है। 1,372 मीटर की ऊंचाई पर स्थित यह संगम जोशीमठ शहर के पास है।",
    deity: "Vishnu",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "First Panch Prayag, Dhauliganga-Alaknanda confluence",
    categories: ["Panch Prayag"],
    timings: "6:00 AM - 7:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vishnuprayag_Confluence.jpg/1200px-Vishnuprayag_Confluence.jpg",
    phone: "01389-222334",
    status: "approved"
  },
  {
    title: "Nandaprayag",
    location: "Nandaprayag, Chamoli, Uttarakhand",
    city: "Chamoli",
    state: "Uttarakhand",
    country: "India",
    pincode: "246471",
    description: "Nandaprayag is the second Panch Prayag where the Nandakini River joins the Alaknanda River at 910 meters altitude. The town is named after King Nanda who performed a yajna here. The confluence is considered highly sacred and pilgrims take holy dips before proceeding to Badrinath. The ancient Gopalji temple is located near the confluence. The site offers panoramic views of snow-capped Himalayan peaks. According to mythology, sage Kanva meditated here. The town serves as an important stopover for Char Dham pilgrims. The serene environment and spiritual atmosphere make it a perfect place for meditation.",
    descriptionHi: "नंदप्रयाग दूसरा पंच प्रयाग है जहां नंदाकिनी नदी 910 मीटर की ऊंचाई पर अलकनंदा नदी में मिलती है। शहर का नाम राजा नंद के नाम पर रखा गया है।",
    deity: "Gopal (Krishna)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Second Panch Prayag, Nandakini-Alaknanda confluence, Gopalji temple",
    categories: ["Panch Prayag"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Nandaprayag_Confluence.jpg/1200px-Nandaprayag_Confluence.jpg",
    phone: "01372-252456",
    status: "approved"
  },
  {
    title: "Karnaprayag",
    location: "Karnaprayag, Chamoli, Uttarakhand",
    city: "Chamoli",
    state: "Uttarakhand",
    country: "India",
    pincode: "246419",
    description: "Karnaprayag is the third Panch Prayag where the Pindar River meets the Alaknanda River at 880 meters. The town is named after Karna, the legendary warrior from Mahabharata, who meditated here. According to legend, Karna performed penance and offered his protective armor (Kavacha) to Sun God at this confluence. The Uma Devi temple is located on a hillock overlooking the confluence. The town has historical significance and ancient temples dating back centuries. The confluence creates a beautiful sight with the clear Pindar waters merging into the Alaknanda. The location offers stunning views of the surrounding Himalayan valleys.",
    descriptionHi: "कर्णप्रयाग तीसरा पंच प्रयाग है जहां पिंडार नदी 880 मीटर पर अलकनंदा नदी से मिलती है। शहर का नाम महाभारत के योद्धा कर्ण के नाम पर है।",
    deity: "Uma Devi (Parvati)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Third Panch Prayag, Pindar-Alaknanda confluence, Karna meditation site",
    categories: ["Panch Prayag"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Karnaprayag_Confluence.jpg/1200px-Karnaprayag_Confluence.jpg",
    phone: "01363-223456",
    status: "approved"
  },
  {
    title: "Rudraprayag",
    location: "Rudraprayag, Uttarakhand",
    city: "Rudraprayag",
    state: "Uttarakhand",
    country: "India",
    pincode: "246171",
    description: "Rudraprayag is the fourth Panch Prayag where the Mandakini River joins the Alaknanda River at 610 meters altitude. The town is named after Lord Rudra (Shiva) who appeared here after being pleased by Narada's music. The Rudranath temple is located at the confluence dedicated to Lord Shiva. Rudraprayag serves as the junction for routes to Kedarnath and Badrinath. The confluence is considered highly auspicious and pilgrims perform religious ceremonies here. The town has several ancient temples and ashrams. The meeting of two sacred rivers creates a spiritually charged atmosphere. The district headquarters is also located here making it an important administrative center.",
    descriptionHi: "रुद्रप्रयाग चौथा पंच प्रयाग है जहां मंदाकिनी नदी 610 मीटर की ऊंचाई पर अलकनंदा नदी में मिलती है। शहर का नाम भगवान रुद्र (शिव) के नाम पर है।",
    deity: "Rudra (Shiva)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Fourth Panch Prayag, Mandakini-Alaknanda confluence, junction to Kedarnath-Badrinath",
    categories: ["Panch Prayag"],
    timings: "6:00 AM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Rudraprayag_Confluence.jpg/1200px-Rudraprayag_Confluence.jpg",
    phone: "01364-233456",
    status: "approved"
  },
  {
    title: "Devprayag",
    location: "Devprayag, Tehri Garhwal, Uttarakhand",
    city: "Tehri Garhwal",
    state: "Uttarakhand",
    country: "India",
    pincode: "249304",
    description: "Devprayag is the last and most important of the Panch Prayag where the Bhagirathi and Alaknanda rivers meet to form the holy Ganga River. Located at 830 meters, this is where the Ganga officially gets its name. The confluence is considered the holiest among all Panch Prayag. The Raghunath temple built by Adi Shankaracharya stands majestically overlooking the confluence. Pilgrims consider it extremely auspicious to take a dip at this sangam. The town is built in traditional Garhwali architectural style with narrow lanes and stone houses. The visual contrast of blue-green Bhagirathi and muddy Alaknanda waters merging is spectacular. All Char Dham pilgrims traditionally stop here to offer prayers.",
    descriptionHi: "देवप्रयाग पंच प्रयाग में अंतिम और सबसे महत्वपूर्ण है जहां भागीरथी और अलकनंदा नदियां मिलकर पवित्र गंगा नदी बनाती हैं। 830 मीटर पर स्थित यहीं से गंगा आधिकारिक रूप से अपना नाम पाती है।",
    deity: "Raghunath (Rama)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Fifth Panch Prayag, Birth of Ganga, Bhagirathi-Alaknanda confluence, holiest prayag",
    categories: ["Panch Prayag"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Devprayag_Confluence.jpg/1200px-Devprayag_Confluence.jpg",
    phone: "01352-252234",
    website: "https://badarikedar.org",
    status: "approved"
  }
];

async function addPanchPrayag() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Panch Prayag - 5 sacred river confluences...\n');
    
    for (let i = 0; i < panchPrayag.length; i++) {
      const templeData = panchPrayag[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Panch Prayag complete!');
    console.log('\nAll Five Sacred Confluences:');
    console.log('1. Vishnuprayag - Dhauliganga + Alaknanda (1,372m)');
    console.log('2. Nandaprayag - Nandakini + Alaknanda (910m)');
    console.log('3. Karnaprayag - Pindar + Alaknanda (880m)');
    console.log('4. Rudraprayag - Mandakini + Alaknanda (610m)');
    console.log('5. Devprayag - Bhagirathi + Alaknanda = GANGA (830m) ⭐');
    console.log('\n🌊 The Alaknanda collects 4 rivers and meets Bhagirathi to form Ganga!');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPanchPrayag();
