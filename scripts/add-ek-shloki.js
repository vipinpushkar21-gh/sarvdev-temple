const mongoose = require('mongoose');

// Hardcoded connection string (mirrors other scripts)
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

// Schema aligned with app model fields used by UI
const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const ekShlokiItems = [
  {
    title: 'एक श्लोकी नवग्रह स्तोत्र (Navagraha Ek Shloki)',
    deity: 'Navagraha',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'Concise single-verse prayer honoring the nine planetary deities (Navagraha).',
    lyrics: [
      'आधारे प्रथमे सहस्रकिरणं ताराधवं स्वाश्रये।',
      'माहेयं मणिपूरके हृदि बुधं कण्ठे च वाचस्पतिम्॥',
      'भ्रूमध्ये भृगुनन्दनं दिनमणेः पुत्रं त्रिकूटस्थले।',
      'नाडीमर्मसु राहु-केतु-गुलिकान्नित्यं नमाम्यायुषे॥',
      '',
      'हिंदी भावार्थ',
      'मैं नवग्रहों को प्रणाम करता हूँ –',
      'सूर्य सहस्रकिरण, चन्द्र हृदय में, मंगल मणिपूर में, बुध कण्ठ में, बृहस्पति वाणी में, शुक्र भ्रूमध्य में, शनि त्रिकूटस्थल में, तथा राहु-केतु-गुलिक नाड़ियों में स्थित होकर आयु की रक्षा करते हैं।',
      '',
      'Aadhare prathame sahasrakiranam taaradhavam svaashraye,',
      'Maheyam manipoorake hridi Budham kanthe cha Vaachaspatim.',
      'Bhroomadhye Bhrigunandanam Dinamaner putram trikootasthale,',
      'Naadimarmasu Rahu-Ketu-Gulikan nityam namaamyaayushe.'
    ].join('\n')
  },
  {
    title: 'एक श्लोकी शंकर दिग्विजय स्तोत्र (Shankara Digvijaya Ek Shloki)',
    deity: 'Adi Shankaracharya',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'A single shloka summarizing Adi Shankaracharya\'s life and victories (Digvijaya).',
    lyrics: [
      'आर्याम्बाजठरे जनिर्द्विजसतीदारिद्र्यनिर्मूलनम्।',
      'सन्यासाश्रयणं गुरूपसदनं श्रीमण्डनादेर्जयः॥',
      'शिष्यौघग्रहणं सुभाष्यरचनं सर्वज्ञपीठाश्रयः।',
      'पीठानां रचनेति सङ्ग्रहमयी सैषा कथा शाङ्करी॥',
      '',
      'हिंदी भावार्थ',
      'शंकराचार्य की कथा – आर्याम्बा के गर्भ से जन्म, सन्यास ग्रहण, मण्डनमिश्र पर विजय, शिष्यों को स्वीकारना, सुभाष्य की रचना, सर्वज्ञपीठ पर आसीन होना और पीठों की स्थापना।',
      '',
      'Aaryaambaa jathare janir dvijasati daaridrya nirmoolanam,',
      'Sanyaasaashrayanam guruupasadanam Shrimandanader jayah.',
      'Shishyaughagrahanam Subhaashya rachanam Sarvajna Peethaashrayah,',
      'Peethaanaam rachaneti sangrahamayi saishaa kathaa Shaankari.'
    ].join('\n')
  },
  {
    title: 'एक श्लोकी दुर्गा सप्तशती (Durga Saptashati Ek Shloki)',
    deity: 'Durga',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'A condensed verse capturing the essence of Durga Saptashati and Divine Mother\'s victories.',
    lyrics: [
      'या ह्यम्बा मधुकैटभप्रमथिनी या माहिषोन्मूलिनी।',
      'या धूम्रेक्षणचण्डमुण्डमथिनी या रक्तबीजाशिनी॥',
      'शक्तिः शुम्भनिशुम्भदैत्यदलिनी या सिद्धिलक्ष्मीः परा।',
      'सा दुर्गा नवकोटिविश्वसहिता मां पातु विश्वेश्वरी॥',
      '',
      'हिंदी भावार्थ',
      'मधुकैटभ, महिषासुर, चण्ड-मुण्ड, रक्तबीज, शुम्भ-निशुम्भ का संहार करने वाली, सिद्धिलक्ष्मी स्वरूपा दुर्गा माँ मुझे विश्वेश्वरी रूप में रक्षा करें।',
      '',
      'Yaa Hyambaa Madhukaitabha pramathini yaa Maahishonmoolini,',
      'Yaa Dhoomrekshana Chandamunda mathini yaa Raktabeejaashini.',
      'Shaktih Shumbha-Nishumbha daityadalini yaa Siddhi Lakshmih Paraa,',
      'Saa Durgaa Navakoti vishvasahitaa maam paatu Vishveshwari.'
    ].join('\n')
  },
  {
    title: 'किं ज्योतिस्तव (Kim Jyotistava)',
    deity: 'Adi Shankaracharya',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'Philosophical verse on the supreme light (Param Jyoti) beyond all senses.',
    lyrics: [
      'किं ज्योतिस्तव भानुमानहनि मे रात्रौ प्रदीपादिकं।',
      'स्यादेवं रविदीपदर्शनविधौ किं ज्योतिराख्याहि मे॥',
      'चक्षुस्तस्य निमीलनादिसमये किं धीर्धियो दर्शने।',
      'किं तत्राहमतो भवान्परमकं ज्योतिस्तदस्मि प्रभो॥',
      '',
      'हिंदी भावार्थ',
      'हे प्रभो! दिन में सूर्य, रात में दीपक, नेत्र से दर्शन, बुद्धि से विचार – परंतु अंत में आप ही परम ज्योति हैं।',
      '',
      'Kim jyotistava bhaanumaan ahani me raatrau pradeepaadikam,',
      'Syaadevam Ravideepa darshanavidhau kim jyotiraakhyaahi me.',
      'Chakshustasya nimeelanadi samaye kim dheerdhiyo darshane,',
      'Kim tatraahamato bhavaan paramakam jyotistadasmi Prabho.'
    ].join('\n')
  },
  {
    title: 'एक श्लोकी सुंदरकांड (Sundarakanda Ek Shloki)',
    deity: 'Hanuman',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'Single-verse summary of Sundarakanda: Hanuman\'s heroic journey and deeds in Lanka.',
    lyrics: [
      'यस्य श्रीहनुमाननुग्रहबलात्तीर्णाम्बुधिर्लीलया।',
      'लङ्कां प्राप्य निशाम्य रामदयितां भङ्क्त्वा वनं राक्षसान्॥',
      'अक्षादीन् विनिहत्य वीक्ष्य दशकं दग्ध्वा पुरीं तां पुनः।',
      'तीर्णाब्धिः कपिभिर्युतो यमनमत् तं रामचन्द्रं भजे॥',
      '',
      'हिंदी भावार्थ',
      'हनुमानजी की कृपा से समुद्र पार कर लंका पहुँचना, सीता दर्शन, वन और राक्षसों का संहार, अक्षयकुमार वध, लंका दहन और पुनः लौटकर श्रीराम को समाचार देना – यही सुंदरकाण्ड है।',
      '',
      'Yasya Shri Hanumaan anugraha balaat teernaambudhir leelayaa,',
      'Lankaam praapya nishaamya Ramadayitaam bhanktvaa vanam raakshasaan.',
      'Akshaadeen vinihatya veekshya dashakam dagdhvaa purim taam punah,',
      'Teernaabdhih kapibhiryuto yamanamat tam Ramachandram bhaje.'
    ].join('\n')
  },
  {
    title: 'एक श्लोकी महाभारत (Mahabharata Ek Shloki)',
    deity: 'Krishna',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'A crisp single shloka summarizing the Mahabharata epic events.',
    lyrics: [
      'आदौ पाण्डवधार्तराष्ट्रजननं लाक्षागृहे दाहनम्।',
      'द्यूते श्रीहरणं वने विहरणं मत्स्यालये वर्तनम्॥',
      'लीलागोग्रहणं रणे विहरणं सन्धिक्रियाजृम्भणं।',
      'पश्चाद्भीष्मसुयोधनादिनिधनं ह्येतन्महाभारतम्॥',
      '',
      'हिंदी भावार्थ',
      'पाण्डव-कौरव जन्म, लाक्षागृह दहन, द्यूत, वनवास, विराट में निवास, गो-ग्रहण, युद्ध, संधि और अंत में भीष्म व दुर्योधन का निधन – यही महाभारत है।',
      '',
      'Aadau Paandava-Dhaartarashtra jananam Laakshaagrihe daahanam,',
      'Dyute Shriharanam vane viharanaam Matsyaalaye vartanam.',
      'Leelaa go-grahanam rane viharanaam Sandhikriyaa jrimbhanam,',
      'Pashchaad Bhishma-Suyodhanaa nidhanam hyetan Mahaabharatam.'
    ].join('\n')
  },
  {
    title: 'एक श्लोकी रामायण (Ramayana Ek Shloki)',
    deity: 'Rama',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'Single-verse summary of the Ramayana: exile, battles, Lanka and victory.',
    lyrics: [
      'आदौ रामतपोवनादिगमनं हत्वा मृगं काञ्चनं।',
      'वैदेहीहरणं जटायुमरणं सुग्रीवसम्भाषणम्॥',
      'बालीनिग्रहणं समुद्रतरणं लङ्कापुरीदाहनम्।',
      'पश्चाद्रावणकुम्भकर्णहननं चैतद्धि रामायणम्॥',
      '',
      'हिंदी भावार्थ',
      'राम का वनगमन, स्वर्णमृग वध, सीता हरण, जटायु का निधन, सुग्रीव से मित्रता, बाली वध, समुद्र पार, लंका दहन और अंत में रावण-कुम्भकर्ण वध – यही रामायण है।',
      '',
      'Aadau Rama tapovanaadi gamanam hatvaa mrugam kaanchanam,',
      'Vaidehi haranam Jataayu maranam Sugreeva sambhaashanam.',
      'Baalinigrahanam samudra taranam Lankaapuri daahanam,',
      'Pashchaad Raavana Kumbhakarna hananam chaitaddhi Ramayanam.'
    ].join('\n')
  },
  {
    title: 'एक श्लोकी भागवत (Bhagavat Ek Shloki)',
    deity: 'Krishna',
    category: 'Ek Shloki',
    language: 'Sanskrit',
    status: 'approved',
    description: 'A single verse summarizing the Bhagavata Purana and Shri Krishna\'s divine pastimes.',
    lyrics: [
      'आदौ देवकिदेविगर्भजननं गोपीगृहे वर्धनं।',
      'मायापूतनजीवितापहरणं गोवर्धनोद्धारणम्॥',
      'कंसच्छेदनकौरवादिहननं कुन्तीसुतापालनं।',
      'चैतद्भागवतं पुराणकथितं श्रीकृष्णलीलामृतम्॥',
      '',
      'हिंदी भावार्थ',
      '• श्रीकृष्ण का जन्म देवकी के गर्भ से हुआ।',
      '• वे नन्दगृह में गोपियों के बीच पले-बढ़े।',
      '• पूतना का वध किया और गोवर्धन पर्वत उठाया।',
      '• कंस का वध किया और आगे चलकर कौरव आदि का संहार किया।',
      '• पाण्डवों (कुन्तीपुत्रों) की रक्षा की।',
      '• यही श्रीकृष्ण की लीलाओं का अमृत है, जिसे भागवत पुराण कहा जाता है।',
      '',
      'Aadau Devaki-Devi garbha jananam Gopi-grihe vardhanam,',
      'Maayaa-Pootana jeevitaapaharanam Govardhanoddhaaranam.',
      'Kamsa-cchedana Kauravaadi hananam Kunti-sutaa paalanam,',
      'Chaitad Bhaagavatam Puraana kathitam Shri-Krishna Leelaamritam.'
    ].join('\n')
  }
];

async function addEkShloki() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const item of ekShlokiItems) {
      const existing = await Devotional.findOne({ title: item.title, category: 'Ek Shloki' });
      if (existing) {
        console.log(`• Skipping (exists): ${item.title}`);
        continue;
      }
      const doc = new Devotional(item);
      await doc.save();
      console.log(`✓ Added: ${item.title}`);
    }

    console.log(`\n✓ Ek Shloki items added/verified: ${ekShlokiItems.length}`);

    const count = await Devotional.countDocuments({ category: 'Ek Shloki' });
    console.log(`Total Ek Shloki in database: ${count}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Ek Shloki:', error);
    process.exit(1);
  }
}

addEkShloki();
