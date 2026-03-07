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

const newStotra = {
  title: 'पुरुषसूक्तम् (Purusha Suktam)',
  deity: 'Vishnu',
  category: 'Stotra/Suktam',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Purusha Suktam is one of the most celebrated Vedic hymns, found in the Shukla Yajurveda (Chapter 31). This 16-verse hymn describes the cosmic sacrifice (Yajna) of the Purusha — the Supreme Cosmic Being (Vishnu/Narayana) — from whom the entire universe was created. The Purusha is described as having a thousand heads, a thousand eyes, and a thousand feet, pervading the earth on all sides and extending beyond it by ten fingers\' breadth. Only one-quarter of this Being manifests as all living beings, while three-quarters remain immortal in heaven. From this cosmic sacrifice arose the Rig Veda, Sama Veda, Yajur Veda, and the Chandas; horses, cattle, goats, and sheep were born. The moon was born from His mind, the sun from His eyes, Indra and Agni from His mouth, Vayu from His breath, the atmosphere from His navel, the sky from His head, the earth from His feet, and the directions from His ears. This hymn is recited in all major Vedic rituals and forms the foundation of Hindu cosmological understanding.',
  lyrics: `॥ अथ शुक्लयजुर्वेदीय पुरुषसूक्तम् ॥

हरिः ॐ
सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्।
स भूमिं सर्वत स्पृत्वाऽत्यतिष्ठद्दशाङ्गुलम्॥1॥

पुरुष एवेदं सर्वं यद्भूतं यच्च भाव्यम्।
उतामृतत्वस्येशानो यदन्नेनातिरोहति॥2॥

एतावानस्य महिमातो ज्यायाँश्च पूरुषः।
पादोऽस्य विश्वा भूतानि त्रिपादस्यामृतं दिवि॥3॥

त्रिपादूर्ध्व उदैत्पुरुषः पादोऽस्येहाभवत् पुनः।
ततो विष्वङ् व्यक्रामत्साशनानशने अभि॥4॥

ततो विराडजायत विराजो अधि पूरुषः।
स जातो अत्यरिच्यत पश्चाद्भूमिमथो पुरः॥5॥

तस्माद्यज्ञात् सर्वहुतः सम्भृतं पृषदाज्यम्।
पशूँस्ताँश्चक्रे वायव्यानारण्या ग्राम्याश्च ये॥6॥

तस्माद्यज्ञात् सर्वहुतः ऋचः सामानि जज्ञिरे।
छन्दांसि जज्ञिरे तस्माद्यजुस्तस्मादजायत॥7॥

तस्मादश्वा अजायन्त ये के चोभयादतः।
गावो ह जज्ञिरे तस्मात्तस्माज्जाता अजावयः॥8॥

तं यज्ञं बर्हिषि प्रौक्षन् पुरुषं जातमग्रतः।
तेन देवा अयजन्त साध्या ऋषयश्च ये॥9॥

यत्पुरुषं व्यदधुः कतिधा व्यकल्पयन्।
मुखं किमस्यासीत् किं बाहू किमूरू पादा उच्येते॥10॥

ब्राह्मणोऽस्य मुखमासीद्बाहू राजन्यः कृतः।
ऊरू तदस्य यद्वैश्यः पद्भ्यां शूद्रो अजायत॥11॥

चन्द्रमा मनसो जातश्चक्षोः सूर्यो अजायत।
श्रोत्राद्वायुश्च प्राणश्च मुखादग्निरजायत॥12॥

नाभ्या आसीदन्तरिक्षं शीर्ष्णो द्यौः समवर्तत।
पद्भ्यां भूमिर्दिशः श्रोत्रात्तथा लोकाँऽकल्पयन्॥13॥

यत्पुरुषेण हविषा देवा यज्ञमतन्वत।
वसन्तोऽस्यासीदाज्यं ग्रीष्म इध्मः शरद्धविः॥14॥

सप्तास्यासन् परिधयस्त्रिः सप्त समिधः कृताः।
देवा यद्यज्ञं तन्वाना अबध्नन् पुरुषं पशुम्॥15॥

यज्ञेन यज्ञमयजन्त देवास्तानि धर्माणि प्रथमान्यासन्।
ते ह नाकं महिमानः सचन्त यत्र पूर्वे साध्याः सन्ति देवाः॥16॥

॥ इति शुक्लयजुर्वेदीयपुरुषसूक्तं सम्पूर्णम् ॥

---

॥ Atha Shuklayajurvedeeya Purusha Suktam ॥

Harih Om
Sahasrasheershaa purushah sahasraakshah sahasrapaat.
Sa bhoomim sarvata sprutvatyatishthaddashangulam.||1||

Purusha evedam sarvam yadbhootam yachcha bhaavyam.
Utaamrutattvasyeshaano yadannenaaatirohati.||2||

Etaavaanasya mahimaato jyaayaamshcha poorushah.
Paado'sya vishvaa bhootaani tripaadasyaamrutam divi.||3||

Tripaadoordhva udaitpurushah paado'syehaabhavat punah.
Tato vishvang vyakraamatsaashanaaanashane abhii.||4||

Tato viraadajaayata viraajo adhi poorushah.
Sa jaato atyarichyata pashchaaddhoomimato purah.||5||

Tasmaadyajnyaat sarvahutah sambhrutam prushadaajyam.
Pashoomstaamschchakre vaayavyaanaaranyaa graamyaashcha ye.||6||

Tasmaadyajnyaat sarvahutah ruchah saamaani jajnyire.
Chhandaamsi jajnyire tasmaadyajustasmadajaayata.||7||

Tasmaadashvaa ajaayanta ye ke chobhayaadatah.
Gaavo ha jajnyire tasmaattasmaajjaataa ajaavayah.||8||

Tam yajnyam barhishi praukshan purusham jaatamagratah.
Tena devaa ayajanta saadhyaa rushayashcha ye.||9||

Yatpurusham vyadadhuh katidhaa vyakalpayan.
Mukham kimasya aaseet kim baahoo kimooroo paadaa uchyete.||10||

Braahmano'sya mukhamaaseedbahoo raajanyah krutah.
Ooroo tadasya yadvyaishyah padbhyaam shoodro ajaayata.||11||

Chandramaa manaso jaatashchakshoh sooryo ajaayata.
Shrotraadvaayushcha praanashcha mukhaadagniirajaayata.||12||

Naabhyaa aaseedantariksham sheershno dyauh samavartata.
Padbhyaam bhoomirdishaha shrotraattathaa lokaankalpayan.||13||

Yatpurushena havishaa devaa yajnyamatanvata.
Vasanto'syaaseedaajyam greeshma idhamah sharaddhavih.||14||

Saptaasyaasan paridhayasttrih sapta samidhah krutaah.
Devaa yadyajnyam tanvaanaa abadhnan purusham pashum.||15||

Yajnena yajnyamayajanta devaastanai dharmaani prathamaanyaasan.
Te ha naakam mahimaanah sachanta yatra poorve saadhyaah santi devaah.||16||

॥ Iti Shuklayajurvedeeya Purusha Suktam Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra/Suktam' });
    if (existing) {
      await Devotional.updateOne({ _id: existing._id }, { $set: newStotra });
      console.log('🔄 Purusha Suktam updated successfully!');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Purusha Suktam added successfully!');
    }

    const total = await Devotional.countDocuments({ category: 'Stotra/Suktam' });
    console.log(`📜 Total Suktas in DB: ${total}`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addStotra();
