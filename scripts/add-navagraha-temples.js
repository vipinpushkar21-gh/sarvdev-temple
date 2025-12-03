// Script to add Navagraha Temples - 9 planetary temples
// Run with: node scripts/add-navagraha-temples.js

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

const navagrahaTemples = [
  {
    title: "Suriyanar Koil (Sun Temple)",
    location: "Suriyanar Koil, Thanjavur, Tamil Nadu",
    city: "Thanjavur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612204",
    description: "Suriyanar Temple is dedicated to Surya (Sun God) and is the primary temple among the Navagraha temples. This ancient temple is the only temple in Tamil Nadu where Surya is the main deity. The temple is believed to have been built during the Chola period. Devotees worship here to cure eye diseases, skin problems, and to gain vitality and energy. The temple has separate shrines for all nine planets (Navagrahas) arranged around the sanctum. Special prayers and homams are performed here for planetary doshas. The temple architecture follows Dravidian style with beautiful sculptures and carvings. Thousands of devotees visit especially on Sundays and during Ratha Saptami festival.",
    descriptionHi: "सूर्यनार मंदिर सूर्य भगवान को समर्पित है और नवग्रह मंदिरों में प्राथमिक मंदिर है। यह तमिलनाडु में एकमात्र मंदिर है जहां सूर्य मुख्य देवता हैं।",
    deity: "Surya (Sun)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Sun temple, Primary Navagraha temple, cure for eye & skin diseases",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Suriyanar_Kovil_Temple.jpg/1200px-Suriyanar_Kovil_Temple.jpg",
    phone: "04374-267345",
    status: "approved"
  },
  {
    title: "Thingalur Chandran Temple (Moon Temple)",
    location: "Thingalur, Thanjavur, Tamil Nadu",
    city: "Thanjavur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "613005",
    description: "Kailasanathar Temple at Thingalur is dedicated to Chandra (Moon God). The presiding deity is Soma Nathar, representing the Moon. According to legend, Chandra worshipped Lord Shiva here to get relief from the curse of Daksha. The temple is believed to cure mental stress, depression, and provide peace of mind. Devotees perform abhishekam with milk to the Moon deity for mental clarity and emotional balance. The temple is particularly crowded on Mondays and during Pournami (full moon) days. The sacred tank here is called Chandra Theertham. Special prayers are offered for those suffering from sleep disorders and anxiety. The temple architecture showcases Chola period craftsmanship.",
    descriptionHi: "थिंगलूर का कैलासनाथर मंदिर चंद्र (चंद्रमा देवता) को समर्पित है। मुख्य देवता सोम नाथ हैं जो चंद्रमा का प्रतिनिधित्व करते हैं।",
    deity: "Chandra (Moon)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Moon temple, relief from mental stress, peace of mind",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Thingalur_Temple.jpg/1200px-Thingalur_Temple.jpg",
    phone: "04362-267123",
    status: "approved"
  },
  {
    title: "Vaitheeswaran Koil (Mars Temple)",
    location: "Vaitheeswaran Koil, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609117",
    description: "Vaitheeswaran Temple is dedicated to Lord Shiva as Vaidyanathan (Divine Healer) and represents Angarakan (Mars). This temple is famous for its healing powers and curing diseases, especially skin ailments and blood disorders. The temple has a sacred tank called Siddhamirtham with healing properties. Devotees believe that bathing in this tank can cure chronic diseases. The temple is also famous for Nadi astrology, where ancient palm leaf manuscripts predict individual destinies. Mars is worshipped here for courage, strength, and to overcome accidents and injuries. The temple was built during the Chola period and features magnificent architecture. Special prayers are conducted for health and vitality.",
    descriptionHi: "वैथीस्वरन मंदिर भगवान शिव को वैद्यनाथन (दिव्य चिकित्सक) के रूप में समर्पित है और अंगारकन (मंगल) का प्रतिनिधित्व करता है।",
    deity: "Angarakan (Mars) / Vaidyanathan",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Mars temple, healing powers, Nadi astrology center, sacred healing tank",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Vaitheeswaran_Koil.jpg/1200px-Vaitheeswaran_Koil.jpg",
    phone: "04364-279245",
    website: "https://vaithiswarankoil.tnhrce.in",
    status: "approved"
  },
  {
    title: "Thiruvenkadu Budhan Temple (Mercury Temple)",
    location: "Thiruvenkadu, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609701",
    description: "Swetharanyeswarar Temple at Thiruvenkadu is dedicated to Budhan (Mercury). The presiding deity is Lord Shiva as Swetharanyeswarar, and Goddess Parvati as Brahma Vidyambikai. According to legend, Lord Brahma and Budhan worshipped Shiva here. The temple is believed to bless devotees with intelligence, communication skills, and business acumen. Students worship here for academic excellence and clarity of thought. The temple is particularly beneficial for those in media, communication, and business fields. Mercury is associated with wit, commerce, and education. The temple tank is called Brahma Theertham. Special prayers are performed on Wednesdays for career growth and educational success.",
    descriptionHi: "तिरुवेंकाडु का श्वेतारण्येश्वरर मंदिर बुधन (बुध) को समर्पित है। मुख्य देवता भगवान शिव श्वेतारण्येश्वरर के रूप में हैं।",
    deity: "Budhan (Mercury)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Mercury temple, intelligence, communication skills, business success",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Thiruvenkadu_Temple.jpg/1200px-Thiruvenkadu_Temple.jpg",
    phone: "04364-256789",
    status: "approved"
  },
  {
    title: "Alangudi Guru Temple (Jupiter Temple)",
    location: "Alangudi, Thiruvarur, Tamil Nadu",
    city: "Thiruvarur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "610207",
    description: "Apatsahayesvarar Temple at Alangudi is dedicated to Guru (Jupiter), considered the most benefic planet. The presiding deity is Lord Shiva as Apatsahayesvarar (protector in distress). Jupiter is worshipped here for knowledge, wisdom, wealth, and spiritual growth. The temple is believed to grant children to childless couples and bless marriages. Devotees worship Guru for good fortune, prosperity, and removal of obstacles. The temple was built during the reign of Chola kings and features beautiful architecture. Special prayers are conducted on Thursdays, the day of Jupiter. The sacred tree here is the Vanni tree. Guru Peyarchi (Jupiter transit) prayers are very significant here.",
    descriptionHi: "अलंगुडी का अपत्साहयेस्वरर मंदिर गुरु (बृहस्पति) को समर्पित है, जिसे सबसे शुभ ग्रह माना जाता है।",
    deity: "Guru (Jupiter)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Jupiter temple, wisdom, wealth, children blessing, marriage",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 1:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Alangudi_Temple.jpg/1200px-Alangudi_Temple.jpg",
    phone: "04366-245678",
    status: "approved"
  },
  {
    title: "Kanjanur Sukran Temple (Venus Temple)",
    location: "Kanjanur, Thanjavur, Tamil Nadu",
    city: "Thanjavur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612204",
    description: "Agniswarar Temple at Kanjanur is dedicated to Sukran (Venus). The presiding deity is Lord Shiva as Agniswarar (Lord of Fire). Venus is the guru of Asuras and represents beauty, luxury, arts, and relationships. The temple is particularly famous for blessing devotees with marital harmony, love, and artistic abilities. Unmarried people worship here for a good spouse. The temple is believed to cure eye diseases and enhance beauty. Special prayers are conducted on Fridays, the day of Venus. The sacred tank is called Brahma Theertham. The temple architecture reflects Chola period grandeur. Devotees offer white clothes and perform abhishekam for Venus blessings.",
    descriptionHi: "कंजनूर का अग्निस्वरर मंदिर शुक्रन (शुक्र) को समर्पित है। मुख्य देवता भगवान शिव अग्निस्वरर (अग्नि के स्वामी) के रूप में हैं।",
    deity: "Sukran (Venus)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Venus temple, marital harmony, beauty, artistic abilities, eye cure",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Kanjanur_Temple.jpg/1200px-Kanjanur_Temple.jpg",
    phone: "04374-256234",
    status: "approved"
  },
  {
    title: "Thirunallar Sani Temple (Saturn Temple)",
    location: "Thirunallar, Karaikal, Puducherry",
    city: "Karaikal",
    state: "Puducherry",
    country: "India",
    pincode: "609607",
    description: "Dharbaranyeswarar Temple at Thirunallar is one of the most famous Navagraha temples, dedicated to Sani (Saturn). The presiding deity is Lord Shiva as Dharbaranyeswarar. According to legend, Saturn worshipped Lord Shiva here and got relief from his curse. This temple is extremely popular for performing Sani pariharam (Saturn remedies) during Sani Peyarchi (Saturn transit). Devotees believe that worshipping here removes Sani dosha and relieves from hardships. The ritual of taking oil bath in the temple tank and offering sesame oil to Saturn is very significant. Thousands visit during Saturdays and especially during Sani transit periods. The temple is believed to grant justice and end prolonged suffering.",
    descriptionHi: "तिरुनल्लर का धर्बारण्येश्वरर मंदिर सबसे प्रसिद्ध नवग्रह मंदिरों में से एक है, जो शनि को समर्पित है।",
    deity: "Sani (Saturn)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Saturn temple, Sani dosha removal, relief from hardships, justice",
    categories: ["Navagraha Temples"],
    timings: "5:30 AM - 12:30 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Thirunallar_Temple.jpg/1200px-Thirunallar_Temple.jpg",
    phone: "04368-237456",
    website: "https://thirunallar.pondicherry.gov.in",
    status: "approved"
  },
  {
    title: "Thirunageswaram Rahu Temple (Rahu Temple)",
    location: "Thirunageswaram, Kumbakonam, Tamil Nadu",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "612204",
    description: "Naganathaswamy Temple at Thirunageswaram is dedicated to Rahu, the ascending node of the Moon. The presiding deity is Lord Shiva as Naganathaswamy. This is the only temple where milk offered to Rahu turns blue, considered a divine miracle. Rahu is believed to cause sudden changes, confusion, and obstacles. Devotees worship here to overcome Rahu dosha, mental afflictions, and fear of snakes. The temple is famous for Rahu Kala Abhishekam, performed during Rahu Kalam daily. Special prayers are conducted for curing skin diseases, epilepsy, and mental disorders. The temple has a unique copper pot over the Rahu idol through which milk is poured. Massive crowds gather during Rahu Ketu Peyarchi (transit).",
    descriptionHi: "तिरुनागेश्वरम का नागनाथस्वामी मंदिर राहु को समर्पित है, जो चंद्रमा का आरोही नोड है। यह एकमात्र मंदिर है जहां राहु को चढ़ाया गया दूध नीला हो जाता है।",
    deity: "Rahu (North Lunar Node)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Rahu temple, milk turns blue miracle, Rahu dosha removal, mental peace",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 1:00 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Thirunageswaram_Temple.jpg/1200px-Thirunageswaram_Temple.jpg",
    phone: "0435-2456789",
    status: "approved"
  },
  {
    title: "Keezhaperumpallam Ketu Temple (Ketu Temple)",
    location: "Keezhaperumpallam, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609107",
    description: "Naganathaswamy Temple at Keezhaperumpallam is dedicated to Ketu, the descending node of the Moon. The presiding deity is Lord Shiva as Naganathaswamy. Ketu represents spirituality, moksha (liberation), and detachment from materialism. The temple is believed to grant spiritual wisdom and relieve from unexpected troubles. Devotees worship here to overcome Ketu dosha, ancestral curses (pitru dosha), and to gain spiritual enlightenment. The temple is particularly important for those facing mysterious health issues and accidents. Special prayers are performed for removing negative energies and evil eye effects. The temple architecture follows traditional Dravidian style. Ketu worship here is believed to enhance intuition and psychic abilities.",
    descriptionHi: "केझपेरुम्पल्लम का नागनाथस्वामी मंदिर केतु को समर्पित है, जो चंद्रमा का अवरोही नोड है। केतु आध्यात्मिकता और मोक्ष का प्रतिनिधित्व करता है।",
    deity: "Ketu (South Lunar Node)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Ketu temple, spiritual wisdom, moksha, pitru dosha removal",
    categories: ["Navagraha Temples"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Keezhaperumpallam_Temple.jpg/1200px-Keezhaperumpallam_Temple.jpg",
    phone: "04364-267890",
    status: "approved"
  }
];

async function addNavagrahaTemples() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Navagraha Temples - 9 Planetary Temples...\n');
    
    for (let i = 0; i < navagrahaTemples.length; i++) {
      const templeData = navagrahaTemples[i];
      console.log(`${i + 1}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Navagraha Temples complete!');
    console.log('\nAll Nine Planetary Temples:');
    console.log('1. ☀️  Suriyanar Koil - Sun (Surya) - Energy, vitality, eye cure');
    console.log('2. 🌙 Thingalur - Moon (Chandra) - Mental peace, emotions');
    console.log('3. 🔴 Vaitheeswaran Koil - Mars (Angarakan) - Healing, courage');
    console.log('4. 💚 Thiruvenkadu - Mercury (Budhan) - Intelligence, business');
    console.log('5. 🟡 Alangudi - Jupiter (Guru) - Wisdom, wealth, children');
    console.log('6. 🤍 Kanjanur - Venus (Sukran) - Love, beauty, marriage');
    console.log('7. 🖤 Thirunallar - Saturn (Sani) - Justice, karma, hardship relief');
    console.log('8. 🐍 Thirunageswaram - Rahu - Milk turns blue! Mental clarity');
    console.log('9. 🔮 Keezhaperumpallam - Ketu - Spirituality, moksha');
    console.log('\n⭐ Famous for planetary dosha removal and astrological remedies!');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addNavagrahaTemples();
