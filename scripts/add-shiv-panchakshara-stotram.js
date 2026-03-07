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

const shivPanchaksharaStotram = {
  title: 'शिव पञ्चाक्षर स्तोत्रम् (Shiv Panchakshara Stotram)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shiv Panchakshara Stotram is a sacred hymn composed by Adi Shankaracharya dedicated to Lord Shiva. It glorifies the five sacred syllables "Na-Ma-Shi-Va-Ya" (Om Namah Shivaya), with each verse explaining the significance of one syllable. This stotram extols Lord Shiva as the supreme being adorned with serpents, smeared with sacred ash, worshipped by great sages, and the eternal lord of the universe.',
  lyrics: `॥ शिव पञ्चाक्षर स्तोत्रम् ॥

नागेन्द्रहाराय त्रिलोचनायभस्माङ्गरागाय महेश्वराय।
नित्याय शुद्धाय दिगम्बरायतस्मै न काराय नमः शिवाय॥1॥

मन्दाकिनीसलिलचन्दनचर्चितायनन्दीश्वरप्रमथनाथमहेश्वराय।
मन्दारपुष्पबहुपुष्पसुपूजितायतस्मै म काराय नमः शिवाय॥2॥

शिवाय गौरीवदनाब्जवृन्दसूर्याय दक्षाध्वरनाशकाय।
श्रीनीलकण्ठाय वृषध्वजायतस्मै शि काराय नमः शिवाय्॥3॥

वसिष्ठकुम्भोद्भवगौतमार्यमुनीन्द्रदेवार्चितशेखराय।
चन्द्रार्कवैश्वानरलोचनायतस्मै व काराय नमः शिवाय॥4॥

यक्षस्वरूपाय जटाधरायपिनाकहस्ताय सनातनाय।
दिव्याय देवाय दिगम्बरायतस्मै य काराय नमः शिवाय॥5॥

पञ्चाक्षरमिदं पुण्यं यः पठेच्छिवसन्निधौ।
शिवलोकमवाप्नोति शिवेन सह मोदते॥6॥

॥ इति श्रीमच्छङ्कराचार्यविरचितं शिवपञ्चाक्षरस्तोत्रं सम्पूर्णम्। ॥

---

|| Shiv Panchakshara Stotram ||

Nagendraharaya Trilochanaya-bhasmangaragaya Maheshvaraya.
Nityaya Shuddhaya Digambaraya-tasmai Na Karaya Namah Shivaya. ||1||

Mandakini-salila-chandana-charchitaya-nandishvara-pramathanatha-maheshvaraya.
Mandara-pushpa-bahu-pushpa-supujitaya-tasmai Ma Karaya Namah Shivaya. ||2||

Shivaya Gauri-vadanabja-vrinda-suryaya Dakshadhvara-nashakaya.
Shri Nilakanthaya Vrishadhvajaya-tasmai Shi Karaya Namah Shivaya. ||3||

Vasishtha-kumbhodbhava-gautamarya-munindra-devarchita-shekharaya.
Chandrarka-vaishvanara-lochanaya-tasmai Va Karaya Namah Shivaya. ||4||

Yaksha-svarupaya Jatadharaya-pinaka-hastaya Sanatanaya.
Divyaya Devaya Digambaraya-tasmai Ya Karaya Namah Shivaya. ||5||

Panchaksharam-idam Punyam Yah Pathechchhiva-sannidhau.
Shivalokam-avapnoti Shivena Saha Modate. ||6||

|| Iti Shrimach-chhankaracharya-virachitam Shiv Panchakshara Stotram Sampurnam ||`
};

async function addShivPanchaksharaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: shivPanchaksharaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shiv Panchakshara Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(shivPanchaksharaStotram);
      await doc.save();
      console.log('✓  Added: ' + shivPanchaksharaStotram.title);
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

addShivPanchaksharaStotram();
