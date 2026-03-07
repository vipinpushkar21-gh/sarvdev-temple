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

const saraswatiDwadashNaamStotram = {
  title: 'सरस्वती द्वादशनाम स्तोत्रम् (Saraswati Dwadash Naam Stotram)',
  deity: 'Saraswati',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Saraswati Dwadash Naam Stotram is a sacred hymn that glorifies Goddess Saraswati through her twelve divine names — Bharati, Saraswati, Sharada, Hansavahini, Jagati Khyata, Vanishwari, Kaumari, Brahmacharini, Buddhidatri, Varadayini, Kshudraghanta, and Bhuvaneshwari. Regular recitation of these twelve names thrice daily bestows all siddhis (spiritual accomplishments), divine knowledge, eloquence, and the supreme blessings of Goddess Saraswati, who resides on the tip of the devotee\'s tongue in the form of Brahman.',
  lyrics: `॥ श्रीसरस्वतीद्वादशनामस्तोत्रम् ॥

सरस्वतीमहं वन्दे वीणापुस्तकधारिणीम्।
हंसवाहसमायुक्तां विद्यादानकरीं मम॥1॥

प्रथमं भारती नाम द्वितीयं च सरस्वती।
तृतीयं शारदा देवी चतुर्थं हंसवाहिनी॥2॥

पश्चमं जगति ख्याता षष्ठं वाणीश्वरी तथा।
कौमारी सप्तमं प्रोक्ता अष्टमं ब्रह्मचारिणी॥3॥

नवमं बुद्धिदात्री च दशमं वरदायिनी।
एकादशं क्षुद्रघण्टा द्वादशं भुवनेश्वरी॥4॥

ब्राह्मी द्वादशनामानि त्रिसन्ध्यं यः पठेन्नरः।
सर्वसिद्धिकरी तस्य प्रसन्ना परमेश्वरी।
सा मे वसतु जिह्वाग्रे ब्रह्मरूपा सरस्वती॥5॥

॥ इति सरस्वतीद्वादशनामस्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Saraswati Dwadash Naam Stotram ॥

Saraswatim-Aham Vande Veena-Pustaka-Dhaarineem.
Hamsa-Vaaha-Samaayuktaam Vidyaa-Daana-Kareem Mama.॥1॥

Prathamam Bhaarati Naama Dwitiyam Cha Saraswati.
Tritiyam Shaaradaa Devi Chaturtham Hamsa-Vaahinee.॥2॥

Panchamam Jagati Khyaataa Shashtham Vaaneeshvari Tathaa.
Kaumaari Saptamam Proktaa Ashtamam Brahma-Chaarinee.॥3॥

Navamam Buddhi-Daatri Cha Dashamam Vara-Daayinee.
Ekaadash Kshudra-Ghantaa Dwaadash Bhuvaneshvari.॥4॥

Braahmi Dwaadashanaamaani Tri-Sandhyam Yah Pathen-Narah.
Sarva-Siddhi-Kari Tasya Prasannaa Parameshvari.
Saa Me Vasatu Jihvaagre Brahma-Roopaa Saraswati.॥5॥

॥ Iti Saraswati Dwadash Naam Stotram Sampoornam ॥`
};

async function addSaraswatiDwadashNaamStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: saraswatiDwadashNaamStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Saraswati Dwadash Naam Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(saraswatiDwadashNaamStotram);
      await doc.save();
      console.log('✅ Saraswati Dwadash Naam Stotram added successfully!');
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

addSaraswatiDwadashNaamStotram();
