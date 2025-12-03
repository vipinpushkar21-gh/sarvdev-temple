// Script to add Arupadai Veedu - 6 Abodes of Lord Murugan
// Run with: node scripts/add-arupadai-veedu.js

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

const arupadaiVeedu = [
  {
    title: "Thiruparankundram Murugan Temple",
    location: "Thiruparankundram, Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "625005",
    description: "Thiruparankundram Temple is the first of the six Arupadai Veedu of Lord Murugan. This ancient rock-cut temple is where Lord Murugan married Goddess Deivayanai. The temple is carved out of a hill and showcases magnificent Dravidian architecture. The main sanctum is inside a cave with beautiful sculptures. This is the only Murugan temple where he is depicted in a married form. The temple has inscriptions dating back to the Pandya period. The temple chariot festival is celebrated with great fervor. The hilltop location offers panoramic views of Madurai city.",
    descriptionHi: "तिरुपरनकुंद्रम मंदिर भगवान मुरुगन के छह अरुपदै वीडु में पहला है। यह प्राचीन रॉक-कट मंदिर वह स्थान है जहां भगवान मुरुगन ने देवी देवयानै से विवाह किया था।",
    deity: "Murugan (Kartikeya)",
    establishedYear: "Ancient (Pandya period)",
    templeType: "Ancient",
    speciality: "First Arupadai Veedu, rock-cut cave temple, married form",
    categories: ["Arupadai Veedu (6 Abodes of Murugan)"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Thiruparankundram_Temple.jpg/1200px-Thiruparankundram_Temple.jpg",
    phone: "0452-2692572",
    status: "approved"
  },
  {
    title: "Thiruchendur Murugan Temple",
    location: "Thiruchendur, Thoothukudi, Tamil Nadu",
    city: "Thoothukudi",
    state: "Tamil Nadu",
    country: "India",
    pincode: "628215",
    description: "Thiruchendur Temple is the second Arupadai Veedu located on the seashore of Bay of Bengal. This is where Lord Murugan defeated the demon Soorapadman. The temple is one of the rare Murugan temples located by the sea. The main deity faces east towards the ocean. The temple has a 135-feet tall Raja Gopuram with intricate carvings. Devotees take a holy dip in the sea before entering the temple. The temple has been mentioned in ancient Sangam literature. The annual Soorasamharam festival reenacts Murugan's victory over the demon.",
    descriptionHi: "तिरुचेंदुर मंदिर बंगाल की खाड़ी के समुद्र तट पर स्थित दूसरा अरुपदै वीडु है। यहां भगवान मुरुगन ने राक्षस सूरपदमन को हराया था।",
    deity: "Murugan (Kartikeya)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Second Arupadai Veedu, seaside location, Soorapadman victory",
    categories: ["Arupadai Veedu (6 Abodes of Murugan)"],
    timings: "5:00 AM - 12:30 PM, 4:00 PM - 9:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Thiruchendur_Murugan_Temple.jpg/1200px-Thiruchendur_Murugan_Temple.jpg",
    phone: "04639-222229",
    status: "approved"
  },
  {
    title: "Palani Murugan Temple",
    location: "Palani Hills, Dindigul, Tamil Nadu",
    city: "Dindigul",
    state: "Tamil Nadu",
    country: "India",
    pincode: "624601",
    description: "Palani Temple is the third Arupadai Veedu situated atop the Palani Hills at 1500 feet. The main deity, Dandayudhapani, is made of an amalgam of nine poisonous herbs (Navapashanam) prepared by sage Bogar. The temple can be reached by climbing 659 steps or by rope car and winch. According to legend, Murugan came here after renouncing worldly pleasures. The idol is unique as it is made of medicinal substances. The temple receives millions of pilgrims annually. The Thaipoosam festival is celebrated with great devotion. The hill offers scenic views of the Western Ghats.",
    descriptionHi: "पलनी मंदिर 1500 फीट की ऊंचाई पर पलनी पहाड़ियों के शीर्ष पर स्थित तीसरा अरुपदै वीडु है। मुख्य देवता दंडायुधपाणि नौ जहरीली जड़ी-बूटियों के मिश्रण से बने हैं।",
    deity: "Murugan (Dandayudhapani)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Third Arupadai Veedu, Navapashanam idol, hilltop temple",
    categories: ["Arupadai Veedu (6 Abodes of Murugan)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Palani_Murugan_Temple.jpg/1200px-Palani_Murugan_Temple.jpg",
    phone: "04545-242277",
    status: "approved"
  },
  {
    title: "Swamimalai Murugan Temple",
    location: "Swamimalai, Thanjavur, Tamil Nadu",
    city: "Thanjavur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612302",
    description: "Swamimalai Temple is the fourth Arupadai Veedu where Lord Murugan explained the meaning of Om (Pranava Mantra) to his father Lord Shiva. The temple is located on a small hillock with 60 steps representing the 60 years of Tamil calendar. Murugan is worshipped here as Swaminatha Swamy, the teacher of Lord Shiva. The temple architecture showcases Chola period craftsmanship. The town is also famous for traditional bronze idol making using the lost-wax technique. The temple has beautiful murals depicting various legends of Murugan. The annual Vaikasi Visakam festival attracts thousands of devotees.",
    descriptionHi: "स्वामीमलाई मंदिर चौथा अरुपदै वीडु है जहां भगवान मुरुगन ने अपने पिता भगवान शिव को ॐ (प्रणव मंत्र) का अर्थ समझाया।",
    deity: "Murugan (Swaminatha)",
    establishedYear: "Ancient (Chola period)",
    templeType: "Ancient",
    speciality: "Fourth Arupadai Veedu, taught Shiva, 60 steps, bronze making",
    categories: ["Arupadai Veedu (6 Abodes of Murugan)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Swamimalai_Temple.jpg/1200px-Swamimalai_Temple.jpg",
    phone: "04374-253013",
    status: "approved"
  },
  {
    title: "Thiruthani Murugan Temple",
    location: "Thiruthani, Tiruvallur, Tamil Nadu",
    city: "Tiruvallur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631209",
    description: "Thiruthani Temple is the fifth Arupadai Veedu located on a hillock. The temple is accessed by climbing 365 steps, one for each day of the year. According to legend, Lord Murugan stayed here before proceeding to marry Valli. The temple offers panoramic views of the surrounding landscape. The presiding deity is Murugan in a standing posture with his consorts Valli and Deivayanai. The temple has inscriptions from various dynasties including Pallavas and Cholas. The annual Skanda Sashti festival is celebrated with great enthusiasm. The temple is an important stop for pilgrims traveling from Chennai.",
    descriptionHi: "तिरुथनी मंदिर एक पहाड़ी पर स्थित पांचवां अरुपदै वीडु है। मंदिर तक 365 सीढ़ियों से पहुंचा जाता है, साल के प्रत्येक दिन के लिए एक।",
    deity: "Murugan (Kartikeya)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Fifth Arupadai Veedu, 365 steps, before marrying Valli",
    categories: ["Arupadai Veedu (6 Abodes of Murugan)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Thiruthani_Temple.jpg/1200px-Thiruthani_Temple.jpg",
    phone: "044-27639223",
    status: "approved"
  },
  {
    title: "Pazhamudircholai Murugan Temple",
    location: "Pazhamudircholai, Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "625014",
    description: "Pazhamudircholai Temple is the sixth and final Arupadai Veedu located amidst dense forests and fruit groves. The name means 'forest of fruit trees'. This is where Lord Murugan is believed to have stayed with his consort Valli. The temple is situated on a hill in the Alagar Hills range. The natural beauty and serene environment make it a perfect place for meditation. The temple deity is called Solaimalai Kumaraswamy. The temple is surrounded by medicinal plants and herbs. The annual Chithirai festival attracts devotees from across Tamil Nadu. The location offers stunning views of Madurai city.",
    descriptionHi: "पझमुदिरचोलै मंदिर घने जंगलों और फलों के बगीचों के बीच स्थित छठा और अंतिम अरुपदै वीडु है। नाम का अर्थ है 'फलों के पेड़ों का जंगल'।",
    deity: "Murugan (Solaimalai)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Sixth Arupadai Veedu, forest temple, fruit groves, with Valli",
    categories: ["Arupadai Veedu (6 Abodes of Murugan)"],
    timings: "6:00 AM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Pazhamudircholai_Temple.jpg/1200px-Pazhamudircholai_Temple.jpg",
    phone: "0452-2537253",
    status: "approved"
  }
];

async function addArupadaiVeedu() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Arupadai Veedu - 6 Abodes of Lord Murugan...\n');
    
    for (let i = 0; i < arupadaiVeedu.length; i++) {
      const templeData = arupadaiVeedu[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Arupadai Veedu complete!');
    console.log('\nAll Six Abodes of Lord Murugan:');
    console.log('1. Thiruparankundram - Married Deivayanai');
    console.log('2. Thiruchendur - Defeated Soorapadman');
    console.log('3. Palani - Navapashanam idol, hilltop');
    console.log('4. Swamimalai - Taught Om to Shiva');
    console.log('5. Thiruthani - 365 steps, before marrying Valli');
    console.log('6. Pazhamudircholai - Forest temple with Valli');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addArupadaiVeedu();
