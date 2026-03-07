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

const saraswatiStotram = {
  title: 'सरस्वती स्तोत्रम् (Saraswati Stotram)',
  deity: 'Saraswati',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Saraswati Stotram is a powerful devotional hymn composed by Sage Agastya, dedicated to Goddess Saraswati — the divine embodiment of knowledge, wisdom, arts, music, and speech. This sacred stotra contains 21 verses praising the goddess in her radiant white form, holding the veena and sacred texts. Regular recitation bestows eloquence, intelligence, removal of ignorance, academic success, and divine blessings of Vagdevi (Goddess of Speech).',
  lyrics: `॥ श्री सरस्वती स्तोत्रम् ॥
(अगस्त्यमुनिप्रोक्तम्)

या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।
या ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा पूजिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥1॥

दोर्भिर्युक्ता चतुर्भिः स्फटिकमणिनिभैरक्षमालान्दधाना
हस्तेनैकेन पद्मं सितमपि च शुकं पुस्तकं चापरेण।
भासा कुन्देन्दुशङ्खस्फटिकमणिनिभा भासमानाऽसमाना
सा मे वाग्देवतेयं निवसतु वदने सर्वदा सुप्रसन्ना॥2॥

सुरासुरसेवितपादपङ्कजा
करे विराजत्कमनीयपुस्तका।
विरिञ्चिपत्नी कमलासनस्थिता
सरस्वती नृत्यतु वाचि मे सदा॥3॥

सरस्वती सरसिजकेसरप्रभा
तपस्विनी सितकमलासनप्रिया।
घनस्तनी कमलविलोललोचना
मनस्विनी भवतु वरप्रसादिनी॥4॥

सरस्वति नमस्तुभ्यं वरदे कामरूपिणि।
विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा॥5॥

सरस्वति नमस्तुभ्यं सर्वदेवि नमो नमः।
शान्तरूपे शशिधरे सर्वयोगे नमो नमः॥6॥

नित्यानन्दे निराधारे निष्कलायै नमो नमः।
विद्याधरे विशालाक्षि शुद्धज्ञाने नमो नमः॥7॥

शुद्धस्फटिकरूपायै सूक्ष्मरूपे नमो नमः।
शब्दब्रह्मि चतुर्हस्ते सर्वसिद्ध्यै नमो नमः॥8॥

मुक्तालङ्कृतसर्वाङ्ग्यै मूलाधारे नमो नमः।
मूलमन्त्रस्वरूपायै मूलशक्त्यै नमो नमः॥9॥

मनो मणिमहायोगे वागीश्वरि नमो नमः।
वाग्भ्यै वरदहस्तायै वरदायै नमो नमः॥10॥

वेदायै वेदरूपायै वेदान्तायै नमो नमः।
गुणदोषविवर्जिन्यै गुणदीप्त्यै नमो नमः॥11॥

सर्वज्ञाने सदानन्दे सर्वरूपे नमो नमः।
सम्पन्नायै कुमार्यै च सर्वज्ञे नमो नमः॥12॥

योगानार्य उमादेव्यै योगानन्दे नमो नमः।
दिव्यज्ञान त्रिनेत्रायै दिव्यमूर्त्यै नमो नमः॥13॥

अर्धचन्द्रजटाधारि चन्द्रबिम्बे नमो नमः।
चन्द्रादित्यजटाधारि चन्द्रबिम्बे नमो नमः॥14॥

अणुरूपे महारूपे विश्वरूपे नमो नमः।
अणिमाद्यष्टसिद्ध्यायै आनन्दायै नमो नमः॥15॥

ज्ञानविज्ञानरूपायै ज्ञानमूर्ते नमो नमः।
नानाशास्त्रस्वरूपायै नानारूपे नमो नमः॥16॥

पद्मदा पद्मवंशा च पद्मरूपे नमो नमः।
परमेष्ठ्यै परामूर्त्यै नमस्ते पापनाशिनि॥17॥

महादेव्यै महाकाल्यै महालक्ष्म्यै नमो नमः।
ब्रह्मविष्णुशिवायै च ब्रह्मनार्यै नमो नमः॥18॥

कमलाकरपुष्पा च कामरूपे नमो नमः।
कपालि कर्मदीप्तायै कर्मदायै नमो नमः॥19॥

सायं प्रातः पठेन्नित्यं षण्मासात् सिद्धिरुच्यते।
चोरव्याघ्रभयं नास्ति पठतां शृण्वतामपि॥20॥

इत्थं सरस्वतीस्तोत्रम् अगस्त्यमुनिवाचकम्।
सर्वसिद्धिकरं नॄणां सर्वपापप्रणाशणम्॥21॥

॥ इति श्री अगस्त्यमुनिप्रोक्तं सरस्वतीस्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Saraswati Stotram ॥
(Agastyamuniprok‌tam)

Yaa Kundendu-Tushaara-Haara-Dhavalaa Yaa Shubhra-Vastraavritaa
Yaa Veenaa-Vara-Danda-Mandita-Karaa Yaa Shveta-Padmaasanaa.
Yaa Brahmaachyuta-Shankara-Prabhritibhir-Devaih Sadaa Poojitaa
Saa Maam Paatu Saraswati Bhagavati Nihshesha-Jaadyaapahaa.॥1॥

Dorbhir-Yuktaa Chaturbhih Sphatika-Mani-Nibhair-Akshamaalaan-Dadhaanaa
Hastenaiken Padmam Sitam-Api Cha Shukam Pustakam Chaapareṇa.
Bhaasaa Kundendu-Shankha-Sphatika-Mani-Nibhaa Bhasamaanaa-Samaanaa
Saa Me Vaagdevateyam Nivasatu Vadane Sarvadaa Suprasannaa.॥2॥

Suraasura-Sevita-Paada-Pankajaa
Kare Viraajat-Kamaneeya-Pustakaa.
Virinchi-Patnee Kamalaasana-Sthitaa
Saraswati Nrityatu Vaachi Me Sadaa.॥3॥

Saraswati Sarasija-Kesara-Prabhaa
Tapasvinee Sita-Kamalaasana-Priyaa.
Ghana-Stanee Kamala-Vilola-Lochanaa
Manasvinee Bhavatu Vara-Prasaadinee.॥4॥

Saraswati Namastubhyam Varade Kaamaroopini.
Vidyaarambham Karishyaami Siddhir-Bhavatu Me Sadaa.॥5॥

Saraswati Namastubhyam Sarvadevi Namo Namah.
Shaantaroope Shashidhare Sarvayoge Namo Namah.॥6॥

Nityaanande Niraadhare Nishkalaayai Namo Namah.
Vidyaadhare Vishaalaakshi Shuddha-Jnaane Namo Namah.॥7॥

Shuddha-Sphatika-Roopaayai Sookshma-Roope Namo Namah.
Shabda-Brahmi Chatur-Haste Sarva-Siddhyai Namo Namah.॥8॥

Muktaalankrita-Sarvaangyai Moolaadhare Namo Namah.
Moola-Mantra-Svaroopaayai Moola-Shaktyai Namo Namah.॥9॥

Mano Mani-Mahaa-Yoge Vaageeshvari Namo Namah.
Vaagbhyai Varada-Hastaayai Varadaayai Namo Namah.॥10॥

Vedaayai Veda-Roopaayai Vedaantaayai Namo Namah.
Guna-Dosha-Vivarjinyai Guna-Deeptyai Namo Namah.॥11॥

Sarva-Jnaane Sadaanande Sarva-Roope Namo Namah.
Sampannaayai Kumaaryai Cha Sarvajne Namo Namah.॥12॥

Yogaanaarya Umaadevi Yogaanande Namo Namah.
Divya-Jnaana Tri-Netraayai Divya-Moortyai Namo Namah.॥13॥

Ardha-Chandra-Jataa-Dhaari Chandra-Bimbe Namo Namah.
Chandraaditya-Jataa-Dhaari Chandra-Bimbe Namo Namah.॥14॥

Anu-Roope Mahaa-Roope Vishva-Roope Namo Namah.
Animaadyashta-Siddhyaayai Aanandaayai Namo Namah.॥15॥

Jnaana-Vijnaana-Roopaayai Jnaana-Moorte Namo Namah.
Naanaa-Shaastra-Svaroopaayai Naanaa-Roope Namo Namah.॥16॥

Padmadaa Padma-Vanshaa Cha Padma-Roope Namo Namah.
Parameshthyai Paraa-Moortyai Namaste Paapa-Naashini.॥17॥

Mahaadevyai Mahaakalyai Mahaalakshmyai Namo Namah.
Brahma-Vishnu-Shivaayai Cha Brahma-Naaryai Namo Namah.॥18॥

Kamalaakara-Pushpaa Cha Kaama-Roope Namo Namah.
Kapaali Karma-Deeptaayai Karma-Daayai Namo Namah.॥19॥

Saayam Praatah Pathennityam Shanmaasaat Siddhir-Uchyate.
Chora-Vyaaghra-Bhayam Naasti Pathataam Shrinvataam-Api.॥20॥

Ittham Saraswati-Stotram Agastya-Muni-Vaachakam.
Sarva-Siddhi-Karam Nrinaam Sarva-Paapa-Pranaashanam.॥21॥

॥ Iti Shri Agastyamuni-Proktam Saraswati Stotram Sampoornam ॥`
};

async function addSaraswatiStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: saraswatiStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Saraswati Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(saraswatiStotram);
      await doc.save();
      console.log('✅ Saraswati Stotram added successfully!');
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`📜 Total Stotras in DB: ${total}`);

    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addSaraswatiStotram();
