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

const kartikeyaPrajnaVivardhanStotram = {
  title: 'कार्तिकेय प्रज्ञा विवर्धन स्तोत्रम् (Kartikeya Prajna Vivardhan Stotram)',
  deity: 'Kartikeya',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Kartikeya Prajna Vivardhan Stotram is a powerful hymn from the Rudrayamala Tantra, spoken by Lord Skanda (Kartikeya) himself. This stotram lists 28 sacred names of Lord Kartikeya and is renowned for its ability to enhance intelligence, wisdom, and speech. Lord Skanda declares that anyone who recites these 28 names with faith every morning at dawn shall attain eloquence even if mute, and gain immense wisdom (Maha Prajna). It is especially beneficial for students, scholars, and seekers of knowledge.',
  lyrics: `॥ श्रीकार्तिकेयप्रज्ञाविवर्धनस्तोत्रम् ॥

श्रीगणेशाय नमः।

स्कन्द उवाच।

योगीश्वरो महासेनः कार्तिकेयोऽग्निनन्दनः।
स्कन्दः कुमारः सेनानीः स्वामी शङ्करसम्भवः॥1॥

गाङ्गेयस्ताम्रचूडश्च ब्रह्मचारी शिखिध्वजः।
तारकारिरुमापुत्रः क्रौञ्चारिश्च षडाननः॥2॥

शब्दब्रह्मसमुद्रश्च सिद्धः सारस्वतो गुहः।
सनत्कुमारो भगवान् भोगमोक्षफलप्रदः॥3॥

शरजन्मा गणाधीशपूर्वजो मुक्तिमार्गकृत्।
सर्वागमप्रणेता च वाञ्छितार्थप्रदर्शनः॥4॥

अष्टाविंशतिनामानि मदीयानीतियः पठेत्।
प्रत्यूषं श्रद्धया युक्तो मूको वाचस्पतिर्भवेत्॥5॥

महामन्त्रमयानीति मम नामानुकीर्तनम्।
महाप्रज्ञामवाप्नोति नात्र कार्या विचारणा॥6॥

॥ इति श्रीरुद्रयामले प्रज्ञाविवर्धनाख्यं
श्रीमत्कार्तिकेयस्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Kartikeya Prajna Vivardhan Stotram ॥

Shri Ganeshaya Namah.

Skanda Uvacha.

Yogeeshvaro Mahasenah Kartikeyogninandanah.
Skandah Kumarah Senanih Swami Shankarasambhavah. ||1||

Gangeyastamrachudashcha Brahmachari Shikhidhvajah.
Tarakarir Umaputrah Kraunchaarish Cha Shadaananah. ||2||

Shabdabrahmasamudrashcha Siddhah Saarasvato Guhah.
Sanatkumaro Bhagavan Bhogamokshafalapradah. ||3||

Sharajanma Ganadhishapoorvajo Muktimargakrit.
Sarvagamapraneta Cha Vanchitarthapradarshanah. ||4||

Ashtavimshatinamani Madiyanitiayah Pathet.
Pratyusham Shraddhaya Yukto Mooko Vachaspatirbhavet. ||5||

Mahamantramayaneeti Mama Namaanukirtanam.
Mahaprajnaamavaapnoti Natra Karya Vicharana. ||6||

॥ Iti Shri Rudrayamale Prajnavivardhanakhyam
Shrimat Kartikeya Stotram Sampoornam ॥`
};

async function addKartikeyaPrajnaVivardhanStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: kartikeyaPrajnaVivardhanStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Kartikeya Prajna Vivardhan Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(kartikeyaPrajnaVivardhanStotram);
      await doc.save();
      console.log('✓  Added: ' + kartikeyaPrajnaVivardhanStotram.title);
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

addKartikeyaPrajnaVivardhanStotram();
