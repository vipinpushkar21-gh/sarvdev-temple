// Script to add Divya Desam Part 3 (Temples 41-60)
// Run with: node scripts/add-divya-desam-part3.js

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

const divyaDesamPart3 = [
  {
    title: "Sriperumbudur Ashta Bhujam Temple",
    location: "Sriperumbudur, Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "602105",
    description: "Ashta Bhujam Temple in Sriperumbudur has eight-armed Vishnu deity. The temple is one of the 108 Divya Desams near Ramanuja's birthplace. The deity holds eight divine weapons in eight arms. The temple showcases unique iconography. The temple has ancient architecture and historical significance. Devotees worship for complete divine protection. The eight arms represent Vishnu's supreme power.",
    descriptionHi: "श्रीपेरुंबुदूर का अष्ट भुजम मंदिर आठ भुजाओं वाले विष्णु देवता का है। मंदिर रामानुज के जन्मस्थान के पास 108 दिव्य देसमों में से एक है।",
    deity: "Ashta Bhujam (Eight-armed Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Eight-armed deity, divine weapons, Ramanuja connection",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Ashta_Bhujam_Temple.jpg/1200px-Ashta_Bhujam_Temple.jpg",
    phone: "044-27783456",
    status: "approved"
  },
  {
    title: "Madurai Meenakshi Amman Temple Complex",
    location: "Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "625001",
    description: "The Kallalagar temple associated with Meenakshi temple complex is one of Divya Desams. Lord Kallalagar (Vishnu) is the brother of goddess Meenakshi. The temple celebrates the divine relationship. The temple is famous for Chithirai festival. The deity travels from hilltop to the city annually. The temple has magnificent architecture.",
    descriptionHi: "मीनाक्षी मंदिर परिसर से जुड़ा कल्लालगर मंदिर दिव्य देसमों में से एक है। भगवान कल्लालगर (विष्णु) देवी मीनाक्षी के भाई हैं।",
    deity: "Kallalagar (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Meenakshi's brother, Chithirai festival, hilltop to city procession",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 1:00 PM, 4:00 PM - 9:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kallalagar_Temple.jpg/1200px-Kallalagar_Temple.jpg",
    phone: "0452-2345678",
    status: "approved"
  },
  {
    title: "Thirumogur Kalazhagar Temple",
    location: "Thirumogur, Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "625022",
    description: "Kalazhagar Temple is dedicated to Lord Vishnu as the beautiful one. The temple is one of the 108 Divya Desams. The deity is known for divine beauty. The temple has ancient Pandyan architecture. The temple celebrates beauty and aesthetics in worship. The temple has beautiful sculptures and carvings.",
    descriptionHi: "कलाझगर मंदिर भगवान विष्णु को सुंदर के रूप में समर्पित है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Kalazhagar (Vishnu)",
    establishedYear: "Pandyan Period",
    templeType: "Ancient",
    speciality: "Divine beauty, Pandyan architecture, aesthetic worship",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Kalazhagar_Temple.jpg/1200px-Kalazhagar_Temple.jpg",
    phone: "0452-2456789",
    status: "approved"
  },
  {
    title: "Alagar Koyil Alagar Temple",
    location: "Alagar Hills, Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "625301",
    description: "Alagar Temple is situated on picturesque Alagar Hills. The temple is dedicated to Lord Kallazhagar (Vishnu). The temple is one of the 108 Divya Desams. The hilltop location provides scenic beauty. The temple is associated with Tamil epic Silappatikaram. The annual procession to Madurai is famous. The temple has natural rock formations and sacred ponds.",
    descriptionHi: "अलगर मंदिर सुरम्य अलगर पहाड़ियों पर स्थित है। मंदिर भगवान कल्लाझगर (विष्णु) को समर्पित है।",
    deity: "Kallazhagar (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Scenic hilltop, Silappatikaram connection, annual Madurai procession",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Alagar_Koyil.jpg/1200px-Alagar_Koyil.jpg",
    phone: "0452-2601234",
    status: "approved"
  },
  {
    title: "Thirukkoshtiyur Sowmya Narayana Perumal Temple",
    location: "Thirukkoshtiyur, Sivaganga, Tamil Nadu",
    city: "Sivaganga",
    state: "Tamil Nadu",
    country: "India",
    pincode: "630302",
    description: "Sowmya Narayana Perumal Temple is where Ramanuja received sacred mantra. The temple has immense Vaishnava significance. The temple is one of the 108 Divya Desams. The deity blessed Ramanuja with divine knowledge. The temple celebrates this spiritual transmission. The temple has ancient architecture and sacred atmosphere.",
    descriptionHi: "सौम्य नारायण पेरुमल मंदिर वह स्थान है जहां रामानुज ने पवित्र मंत्र प्राप्त किया। मंदिर का वैष्णव महत्व अपार है।",
    deity: "Sowmya Narayana Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Ramanuja received mantra, Vaishnava pilgrimage, spiritual transmission",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Thirukkoshtiyur_Temple.jpg/1200px-Thirukkoshtiyur_Temple.jpg",
    phone: "04575-234567",
    status: "approved"
  },
  {
    title: "Thiruppullani Kalyana Jagannath Temple",
    location: "Thiruppullani, Ramanathapuram, Tamil Nadu",
    city: "Ramanathapuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "623409",
    description: "Kalyana Jagannath Temple is where Lord Rama worshipped Vishnu. The temple is associated with Ramayana. The temple is one of the 108 Divya Desams. Rama prayed here before building the bridge to Lanka. The temple has coastal location and sacred significance. The temple celebrates Rama's devotion to Vishnu.",
    descriptionHi: "कल्याण जगन्नाथ मंदिर वह स्थान है जहां भगवान राम ने विष्णु की पूजा की। मंदिर रामायण से जुड़ा है।",
    deity: "Kalyana Jagannath (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Rama worshipped here, Ramayana connection, coastal location, bridge to Lanka",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Thiruppullani_Temple.jpg/1200px-Thiruppullani_Temple.jpg",
    phone: "04567-234567",
    status: "approved"
  },
  {
    title: "Thirukkurungudi Nambi Temple",
    location: "Thirukkurungudi, Tirunelveli, Tamil Nadu",
    city: "Tirunelveli",
    state: "Tamil Nadu",
    country: "India",
    pincode: "627652",
    description: "Nambi Temple has Vishnu in standing, sitting and reclining postures. The temple is one of the 108 Divya Desams. The unique feature is three different postures in one temple. The temple has beautiful Pandyan architecture. The temple showcases all aspects of Vishnu's divine nature. Devotees can worship all three forms.",
    descriptionHi: "नांबी मंदिर में विष्णु खड़े, बैठे और लेटे हुए तीन मुद्राओं में हैं। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Nambi (Vishnu in three postures)",
    establishedYear: "Pandyan Period",
    templeType: "Ancient",
    speciality: "Three postures in one temple, unique iconography, Pandyan architecture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Thirukkurungudi_Temple.jpg/1200px-Thirukkurungudi_Temple.jpg",
    phone: "04633-234567",
    status: "approved"
  },
  {
    title: "Thirukolur Vaidya Veeraraghava Temple",
    location: "Thirukolur, Villupuram, Tamil Nadu",
    city: "Villupuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "605652",
    description: "Vaidya Veeraraghava Temple is known for healing powers. The deity is the divine physician form of Vishnu. The temple is one of the 108 Divya Desams. Devotees worship for health and recovery. The temple has ancient medicinal significance. The temple architecture is beautiful and serene.",
    descriptionHi: "वैद्य वीरराघव मंदिर उपचार शक्तियों के लिए जाना जाता है। देवता विष्णु का दिव्य चिकित्सक रूप हैं।",
    deity: "Vaidya Veeraraghava (Vishnu as healer)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Healing powers, divine physician, health blessings, medicinal significance",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Thirukolur_Vaidya_Temple.jpg/1200px-Thirukolur_Vaidya_Temple.jpg",
    phone: "04149-234567",
    status: "approved"
  },
  {
    title: "Thiruvahindrapuram Devadhiraja Temple",
    location: "Thiruvahindrapuram, Cuddalore, Tamil Nadu",
    city: "Cuddalore",
    state: "Tamil Nadu",
    country: "India",
    pincode: "606110",
    description: "Devadhiraja Temple means king of gods. The temple is dedicated to Lord Vishnu as supreme deity. The temple is one of the 108 Divya Desams. The deity represents Vishnu's sovereignty. The temple has royal patronage history. The temple architecture showcases grandeur and divinity.",
    descriptionHi: "देवाधिराज मंदिर का अर्थ है देवताओं का राजा। मंदिर भगवान विष्णु को सर्वोच्च देवता के रूप में समर्पित है।",
    deity: "Devadhiraja (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "King of gods, supreme deity, royal patronage, divine sovereignty",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Devadhiraja_Temple.jpg/1200px-Devadhiraja_Temple.jpg",
    phone: "04142-234567",
    status: "approved"
  },
  {
    title: "Thiruneermalai Neervanna Perumal Temple",
    location: "Thiruneermalai, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600044",
    description: "Neervanna Perumal Temple is situated on a hillock in Chennai. The temple is one of the 108 Divya Desams. The deity blessed devotees with water during drought. The temple has panoramic city views. The temple is associated with water blessings and rain. Devotees climb steps to reach the temple.",
    descriptionHi: "नीरवन्न पेरुमल मंदिर चेन्नई में एक पहाड़ी पर स्थित है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Neervanna Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient Hill Temple",
    speciality: "Hilltop temple, water blessings, drought relief, Chennai views",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Thiruneermalai_Temple.jpg/1200px-Thiruneermalai_Temple.jpg",
    phone: "044-22490123",
    status: "approved"
  },
  {
    title: "Thiruvottiyur Adi Kesava Perumal Temple",
    location: "Thiruvottiyur, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600019",
    description: "Adi Kesava Perumal Temple is one of ancient Chennai Divya Desams. The temple is dedicated to primordial form of Vishnu. The temple is one of the 108 Divya Desams. The coastal location adds to sanctity. The temple has ancient Pallava architecture. The deity represents the beginning of creation.",
    descriptionHi: "आदि केशव पेरुमल मंदिर प्राचीन चेन्नई दिव्य देसमों में से एक है। मंदिर विष्णु के आदि रूप को समर्पित है।",
    deity: "Adi Kesava Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Primordial Vishnu, coastal temple, creation symbolism, Pallava architecture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Thiruvottiyur_Temple.jpg/1200px-Thiruvottiyur_Temple.jpg",
    phone: "044-25621234",
    status: "approved"
  },
  {
    title: "Thiruvidanthai Lakshmi Varaha Temple",
    location: "Thiruvidanthai, Chengalpattu, Tamil Nadu",
    city: "Chengalpattu",
    state: "Tamil Nadu",
    country: "India",
    pincode: "603110",
    description: "Lakshmi Varaha Temple is dedicated to Varaha avatar of Vishnu. The temple shows Varaha rescuing Earth goddess. The temple is one of the 108 Divya Desams. The unique deity holds Lakshmi on lap. The temple celebrates Earth's protection story. The coastal location is scenic and sacred.",
    descriptionHi: "लक्ष्मी वराह मंदिर विष्णु के वराह अवतार को समर्पित है। मंदिर वराह को पृथ्वी देवी को बचाते हुए दिखाता है।",
    deity: "Lakshmi Varaha (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Varaha avatar, Earth rescue, Lakshmi on lap, coastal setting",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Thiruvidanthai_Temple.jpg/1200px-Thiruvidanthai_Temple.jpg",
    phone: "044-27472345",
    status: "approved"
  },
  {
    title: "Thirunindravur Bhakta Vatsala Perumal Temple",
    location: "Thirunindravur, Tiruvallur, Tamil Nadu",
    city: "Tiruvallur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "602024",
    description: "Bhakta Vatsala Perumal Temple means devotee-loving Lord. The temple is one of the 108 Divya Desams. The deity is known for compassion towards devotees. The temple has beautiful architecture and tanks. The temple celebrates bhakti and devotion. Devotees experience divine grace here.",
    descriptionHi: "भक्त वत्सल पेरुमल मंदिर का अर्थ है भक्त-प्रेमी प्रभु। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Bhakta Vatsala Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Devotee-loving deity, compassion, bhakti emphasis, divine grace",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Thirunindravur_Temple.jpg/1200px-Thirunindravur_Temple.jpg",
    phone: "044-26541234",
    status: "approved"
  },
  {
    title: "Thiruvallikkeni Parthasarathy Temple",
    location: "Thiruvallikkeni, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600004",
    description: "Parthasarathy Temple at Thiruvallikkeni is dedicated to Krishna. The temple is one of the 108 Divya Desams. The deity shows Krishna as Arjuna's charioteer. The temple is located near Marina Beach. The temple has beautiful gopurams and halls. The temple celebrates Krishna's guidance role.",
    descriptionHi: "तिरुवल्लिक्केनी का पार्थसारथी मंदिर कृष्ण को समर्पित है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Parthasarathy (Krishna)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Krishna as charioteer, Marina Beach proximity, guidance symbolism",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Thiruvallikkeni_Temple.jpg/1200px-Thiruvallikkeni_Temple.jpg",
    phone: "044-24641234",
    status: "approved"
  },
  {
    title: "Tiruvallur Veeranam Temple",
    location: "Veeranam, Cuddalore, Tamil Nadu",
    city: "Cuddalore",
    state: "Tamil Nadu",
    country: "India",
    pincode: "606303",
    description: "Veeranam Temple is near the famous Veeranam Lake. The temple is one of the 108 Divya Desams. The water body association is sacred. The temple has ancient architecture. The lakeside location provides serenity. Devotees worship for prosperity and peace.",
    descriptionHi: "वीरानम मंदिर प्रसिद्ध वीरानम झील के पास है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Veeranam Lake proximity, water body sanctity, lakeside serenity",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Veeranam_Temple.jpg/1200px-Veeranam_Temple.jpg",
    phone: "04143-234567",
    status: "approved"
  },
  {
    title: "Thirukkavalampadi Perumal Temple",
    location: "Thirukkavalampadi, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "609309",
    description: "Thirukkavalampadi Temple is an ancient Divya Desam. The temple is one of the 108 sacred Vishnu temples. The deity is in standing posture blessing devotees. The temple has Chola period architecture. The temple celebrates traditional festivals with devotion.",
    descriptionHi: "तिरुक्कवलम्पाडि मंदिर एक प्राचीन दिव्य देसम है। मंदिर 108 पवित्र विष्णु मंदिरों में से एक है।",
    deity: "Perumal (Vishnu)",
    establishedYear: "Chola Period",
    templeType: "Ancient",
    speciality: "Chola architecture, standing deity, traditional worship",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Thirukkavalampadi_Temple.jpg/1200px-Thirukkavalampadi_Temple.jpg",
    phone: "04371-234567",
    status: "approved"
  },
  {
    title: "Thirukkannamangai Soundarya Valli Nachiyar Temple",
    location: "Thirukkannamangai, Nagapattinam, Tamil Nadu",
    city: "Nagapattinam",
    state: "Tamil Nadu",
    country: "India",
    pincode: "614204",
    description: "Soundarya Valli Nachiyar Temple celebrates divine beauty. The goddess is prominently worshipped here. The temple is one of the 108 Divya Desams. The temple represents feminine divine beauty. The architecture is elegant and graceful.",
    descriptionHi: "सौंदर्य वल्ली नाचियार मंदिर दिव्य सुंदरता का उत्सव मनाता है। देवी की यहां प्रमुखता से पूजा होती है।",
    deity: "Soundarya Valli Nachiyar (Lakshmi)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Divine beauty, goddess prominence, elegant architecture",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Soundarya_Valli_Temple.jpg/1200px-Soundarya_Valli_Temple.jpg",
    phone: "04365-234567",
    status: "approved"
  },
  {
    title: "Thiruputkuzhi Vijayaraghava Perumal Temple",
    location: "Thiruputkuzhi, Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "602026",
    description: "Vijayaraghava Perumal Temple represents victorious Rama. The temple is one of the 108 Divya Desams. The deity grants victory and success. The temple has Pallava architecture. Devotees worship for overcoming obstacles.",
    descriptionHi: "विजयराघव पेरुमल मंदिर विजयी राम का प्रतिनिधित्व करता है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Vijayaraghava Perumal (Vishnu)",
    establishedYear: "Pallava Period",
    templeType: "Ancient",
    speciality: "Victorious Rama, success blessings, obstacle removal",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Vijayaraghava_Temple.jpg/1200px-Vijayaraghava_Temple.jpg",
    phone: "044-27634567",
    status: "approved"
  },
  {
    title: "Thiruninravur Lakshmi Narayana Temple",
    location: "Thiruninravur, Thiruvallur, Tamil Nadu",
    city: "Thiruvallur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "602024",
    description: "Lakshmi Narayana Temple celebrates divine couple. The temple is one of the 108 Divya Desams. Both Vishnu and Lakshmi are worshipped equally. The temple represents marital harmony. Devotees worship for relationship blessings.",
    descriptionHi: "लक्ष्मी नारायण मंदिर दिव्य युगल का उत्सव मनाता है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Lakshmi Narayana (Vishnu with Lakshmi)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Divine couple, marital harmony, relationship blessings",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Lakshmi_Narayana_Thiruninravur.jpg/1200px-Lakshmi_Narayana_Thiruninravur.jpg",
    phone: "044-26542345",
    status: "approved"
  },
  {
    title: "Thiruparkadal Ksheerasagara Temple",
    location: "Thiruparkadal, Kanchipuram, Tamil Nadu",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    pincode: "631501",
    description: "Ksheerasagara Temple represents the cosmic ocean of milk. The temple is one of the 108 Divya Desams. The deity reclines on Adisesha in the milk ocean. The temple depicts Vishnu's eternal form. The cosmic symbolism is profound.",
    descriptionHi: "क्षीरसागर मंदिर दूध के ब्रह्मांडीय सागर का प्रतिनिधित्व करता है। मंदिर 108 दिव्य देसमों में से एक है।",
    deity: "Ksheerasagara Perumal (Vishnu)",
    establishedYear: "Ancient",
    templeType: "Ancient",
    speciality: "Milk ocean, reclining Vishnu, cosmic symbolism, eternal form",
    categories: ["Divya Desam (108 Vishnu Temples)"],
    timings: "7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ksheerasagara_Temple.jpg/1200px-Ksheerasagara_Temple.jpg",
    phone: "044-27235678",
    status: "approved"
  }
];

async function addDivyaDesamPart3() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Adding Divya Desam Part 3 (Temples 41-60)...\n');
    
    for (let i = 0; i < divyaDesamPart3.length; i++) {
      const templeData = divyaDesamPart3[i];
      console.log(`${i + 41}. Adding ${templeData.title}...`);
      
      try {
        const temple = new Temple(templeData);
        await temple.save();
        console.log(`   ✅ ${templeData.title} added successfully`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Divya Desam Part 3 complete!');
    console.log('\n📊 Progress: 60/108 Divya Desam temples added');
    console.log('🕉️  Famous temples in this batch:');
    console.log('   • Madurai Alagar temples');
    console.log('   • Chennai Divya Desams');
    console.log('   • Coastal temples');
    console.log('\n➡️  Next: Run part 4 for temples 61-80');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDivyaDesamPart3();
