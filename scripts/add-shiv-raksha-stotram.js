const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Stotra' },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const shivRakshaStotram = {
  title: 'श्रीशिवरक्षास्तोत्रम् (Shri Shiv Raksha Stotram)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Shiv Raksha Stotram is a powerful protective hymn (kavach) composed by the great sage Yajnavalkya as instructed by Lord Narayana in a dream. It invokes the protection of Lord Shiva over every part of the body — from head to toe. The stotram declares that whoever recites it with devotion enjoys all desires and ultimately attains union with Lord Shiva. Evil spirits, ghosts, and planetary afflictions flee from the devotee who chants this divine armor of Shiva.',
  lyrics: `॥ श्रीशिवरक्षास्तोत्रम् ॥

॥ विनियोग ॥
श्री गणेशाय नमः॥

अस्य श्रीशिवरक्षास्तोत्रमन्त्रस्य याज्ञवल्क्य ऋषिः॥
श्री सदाशिवो देवता॥ अनुष्टुप् छन्दः॥
श्रीसदाशिवप्रीत्यर्थं शिवरक्षास्तोत्रजपे विनियोगः॥

॥ स्तोत्र पाठ ॥
चरितं देवदेवस्य महादेवस्य पावनम्।
अपारं परमोदारं चतुर्वर्गस्य साधनम्॥1॥

गौरीविनायकोपेतं पञ्चवक्त्रं त्रिनेत्रकम्।
शिवं ध्यात्वा दशभुजं शिवरक्षां पठेन्नरः॥2॥

गंगाधरः शिरः पातु भालं अर्धेन्दुशेखरः।
नयने मदनध्वंसी कर्णो सर्पविभूषण॥3॥

घ्राणं पातु पुरारातिः मुखं पातु जगत्पतिः।
जिह्वां वागीश्वरः पातु कंधरां शितिकंधरः॥4॥

श्रीकण्ठः पातु मे कण्ठं स्कन्धौ विश्वधुरन्धरः।
भुजौ भूभारसंहर्ता करौ पातु पिनाकधृक्॥5॥

हृदयं शंकरः पातु जठरं गिरिजापतिः।
नाभिं मृत्युञ्जयः पातु कटी व्याघ्राजिनाम्बरः॥6॥

सक्थिनी पातु दीनार्तशरणागतवत्सलः।
उरू महेश्वरः पातु जानुनी जगदीश्वरः॥7॥

जङ्घे पातु जगत्कर्ता गुल्फौ पातु गणाधिपः।
चरणौ करुणासिन्धुः सर्वाङ्गानि सदाशिवः॥8॥

एतां शिवबलोपेतां रक्षां यः सुकृती पठेत्।
स भुक्त्वा सकलान्कामान् शिवसायुज्यमाप्नुयात्॥9॥

ग्रहभूतपिशाचाद्यास्त्रैलोक्ये विचरन्ति ये।
दूरादाशु पलायन्ते शिवनामाभिरक्षणात्॥10॥

अभयङ्करनामेदं कवचं पार्वतीपतेः।
भक्त्या बिभर्ति यः कण्ठे तस्य वश्यं जगत्त्रयम्॥11॥

इमां नारायणः स्वप्ने शिवरक्षां यथाऽऽदिशत्।
प्रातरुत्थाय योगीन्द्रो याज्ञवल्क्यः तथाऽलिखत॥12॥

॥ इति श्रीयाज्ञवल्क्यप्रोक्तं शिवरक्षास्तोत्रं सम्पूर्णम् ॥

---

|| Shri Shiv Raksha Stotram ||

|| Viniyoga ||
Shri Ganeshaya Namah.

Asya Shri Shiva-raksha-stotra-mantrasya Yajnavalkya Rishiph.
Shri Sadashivo Devata. Anushtup Chhandah.
Shri Sadashiva-prityartham Shiva-raksha-stotra-jape Viniyogah.

|| Stotra Paath ||
Charitam Deva-devasya Mahadevasya Pavanam.
Aparam Paramodaram Chaturvargasya Sadhanam. ||1||

Gauri-vinayakopetam Panchavaktram Trinetrakam.
Shivam Dhyatva Dashabhujam Shivarakshaam Pathennnarah. ||2||

Gangadharah Shirah Patu Bhalam Ardhendu-shekharah.
Nayane Madanadhvamsi Karno Sarpa-vibhushanah. ||3||

Ghranam Patu Puraratih Mukham Patu Jagatpatih.
Jihvam Vagishvarah Patu Kandharam Shitikandharah. ||4||

Shrikanthah Patu Me Kantham Skandhau Vishva-dhurandharah.
Bhujau Bhubhara-samharta Karau Patu Pinakadhrik. ||5||

Hridayam Shankarah Patu Jatharam Girijapatih.
Nabhim Mrityunjayah Patu Kati Vyaghra-jinaambarah. ||6||

Sakthini Patu Dinarta-sharanagata-vatsalah.
Uru Maheshvarah Patu Januni Jagadishvarah. ||7||

Janghe Patu Jagatkarta Gulphau Patu Ganadhipah.
Charanau Karunasindhuh Sarvaangani Sadashivah. ||8||

Etam Shiva-balopetaam Raksham Yah Sukriti Pathet.
Sa Bhuktva Sakalan-kaman Shiva-sayujyam-apnuyat. ||9||

Graha-bhuta-pishachadyastrailokye Vicharanti Ye.
Duradaashu Palayante Shiva-namabhi-rakshanat. ||10||

Abhayankara-namedam Kavacham Parvatipateh.
Bhaktya Bibharti Yah Kanthe Tasya Vashyam Jagattrayam. ||11||

Imam Narayanah Svapne Shivaraksham Yathaa'dishat.
Pratarutthaya Yogindro Yajnavalkyah Tatha'likhat. ||12||

|| Iti Shri Yajnavalkya-proktam Shiv Raksha Stotram Sampurnam ||`
};

async function addShivRakshaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: shivRakshaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shiv Raksha Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(shivRakshaStotram);
      await doc.save();
      console.log('✓  Added: ' + shivRakshaStotram.title);
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`\nTotal Stotras in DB: ${total}`);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

addShivRakshaStotram();
