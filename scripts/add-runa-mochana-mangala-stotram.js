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

const runaMochanaMangalaStotram = {
  title: 'ऋणमोचन मङ्गल स्तोत्रम् (Runa Mochana Mangala Stotram)',
  deity: 'Mangal',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Runa Mochana Mangala Stotram is a sacred hymn from the Skanda Purana, spoken by Bhargava (Shukracharya). This powerful 12-verse stotram is dedicated to Lord Mangal (Mars/Kuja), the son of Mother Earth (Bhoomi Putra). It contains divine names and epithets of Mangal Graha — such as Lohita, Angaaraka, Dharaatmaja, Kumaara, and Graha Raja. Regular recitation with devotion frees one from debts (rina), removes poverty (daridra), bestows wealth and prosperity, wards off diseases, and protects from enemies and untimely death. It is especially beneficial for those suffering from Mangal Dosha or financial difficulties.',
  lyrics: `॥ ऋणमोचन मङ्गल स्तोत्रम् ॥

मङ्गलो भूमिपुत्रश्च ऋणहर्ता धनप्रदः।
स्थिरासनो महाकायः सर्वकामविरोधकः॥1॥

लोहितो लोहिताक्षश्च सामगानां कृपाकरः।
धरात्मजः कुजो भौमो भूतिदो भूमिनन्दनः॥2॥

अङ्गारको यमश्चैव सर्वरोगापहारकः।
वृष्टेः कर्ताऽपहर्ता च सर्वकामफलप्रदः॥3॥

एतानि कुजनामानि नित्यं यः श्रद्धया पठेत्।
ऋणं न जायते तस्य धनं शीघ्रमवाप्नुयात्॥4॥

धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम्।
कुमारं शक्तिहस्तं च मङ्गलं प्रणमाम्यहम्॥5॥

स्तोत्रमङ्गारकस्यैतत् पठनीयं सदा नृभिः।
न तेषां भौमजा पीडा स्वल्पापि भवति क्वचित्॥6॥

अङ्गारक महाभाग भगवन् भक्तवत्सल।
त्वां नमामि ममाशेषम् ऋणमाशु विनाशय॥7॥

ऋणरोगादिदारिद्र्यं ये चान्ये चापमृत्यवः।
भयक्लेशमनस्तापा नश्यन्तु मम सर्वदा॥8॥

अतिवक्रदुराराभोगमुक्तजितात्मनः।
तुष्टो ददासि साम्राज्यं रुष्टो हरसि तत्क्षणात्॥9॥

विरञ्चिशक्रविष्णूनां मनुष्याणां तु का कथा।
तेन त्वं सर्वसत्त्वेन ग्रहराजो महाबलः॥10॥

पुत्रान् देहि धनं देहि त्वामस्मि शरणं गतः।
ऋणदारिद्र्यदुःखेन शत्रुणां च भयात् ततः॥11॥

एभिर्द्वादशभिः श्लोकैर्यः स्तौति च धरासुतम्।
महतीं श्रियमाप्नोति ह्यपरो धनदो युवा॥12॥

॥ इति श्रीस्कन्दपुराणे भार्गवप्रोक्तं ऋणमोचन मङ्गल स्तोत्रं सम्पूर्णम् ॥

---

॥ Runa Mochana Mangala Stotram ॥

Mangalo Bhoomi-Putrashcha Rina-Hartaa Dhana-Pradah.
Sthiraasano Mahaa-Kaayah Sarva-Kaama-Virodhakah.॥1॥

Lohito Lohitaakshashcha Saama-Gaanaam Kripaakarah.
Dharaatmajah Kujo Bhaumo Bhootido Bhoomi-Nandanah.॥2॥

Angaarako Yamashchaiva Sarva-Rogaapaharakah.
Vrishhteh Kartaa-Pahartaa Cha Sarva-Kaama-Phala-Pradah.॥3॥

Etaani Kuja-Naamaani Nityam Yah Shraddhayaa Pathet.
Rinam Na Jaayate Tasya Dhanam Sheeghra-Mavaapnuyaat.॥4॥

Dharanee-Garbha-Sambhootam Vidyut-Kaanti-Sama-Prabham.
Kumaaram Shakti-Hastam Cha Mangalam Pranamaamyaham.॥5॥

Stotra-Mangaarakasyaitat Pathaniyam Sadaa Nribhih.
Na Teshaam Bhaumajaa Peedaa Swalpaapi Bhavati Kwachit.॥6॥

Angaaraka Mahaabhaaga Bhagavan Bhakta-Vatsala.
Tvaam Namaami Mamaashesham Rinamaashu Vinaashaya.॥7॥

Rina-Rogaadi-Daaridryam Ye Chaanye Chaapa-Mrityavah.
Bhaya-Klesha-Manastaapaa Nashyantu Mama Sarvadaa.॥8॥

Ativakra-Duraaraabhoga-Mukta-Jitaatmanah.
Tushto Dadaasi Saamraajyam Rushto Harasi Tatkshhanaat.॥9॥

Viranchi-Shakra-Vishnoonaam Manushyaanaam Tu Kaa Kathaa.
Tena Tvam Sarva-Sattvena Graha-Raajo Mahaabalah.॥10॥

Putraan Dehi Dhanam Dehi Tvaamasmi Sharanam Gatah.
Rina-Daaridra-Duhkhena Shatrunaam Cha Bhayaat Tatah.॥11॥

Ebhir-Dwaadashabhih Shlokaih Yah Stauti Cha Dharaa-Sutam.
Mahateem Shriyam-Aapnoti Hyaparo Dhanado Yuvaa.॥12॥

॥ Iti Shri Skanda-Puraane Bhaargava-Proktam Runa Mochana Mangala Stotram Sampoornam ॥`
};

async function addRunaMochanaMangalaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: runaMochanaMangalaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Runa Mochana Mangala Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(runaMochanaMangalaStotram);
      await doc.save();
      console.log('✅ Runa Mochana Mangala Stotram added successfully!');
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

addRunaMochanaMangalaStotram();
