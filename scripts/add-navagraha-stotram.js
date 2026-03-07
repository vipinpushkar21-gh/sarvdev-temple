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

const navagrahaStotram = {
  title: 'नवग्रह स्तोत्रम् (Navagraha Stotram)',
  deity: 'Navagraha',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Navagraha Stotram is a sacred hymn composed by Sage Vyasa (Vedavyasa) to propitiate the nine celestial planets (Navagrahas) — Surya (Sun), Chandra (Moon), Mangal (Mars), Budha (Mercury), Guru/Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), Rahu, and Ketu. Chanting this powerful stotram daily removes the malefic effects of all nine planets, bestows peace, prosperity, good health, and spiritual progress. It is especially recommended during Navagraha Puja, planetary transits, and for those experiencing adverse planetary periods (dashas).',
  lyrics: `॥ नवग्रह स्तोत्रम् ॥

॥ भगवान सूर्य ॥

जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम्।
तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥1॥

॥ भगवान चन्द्र ॥

दधिशङ्खतुषाराभं क्षीरोदार्णवसंभवम्।
नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम्॥2॥

॥ भगवान मङ्गल ॥

धरणीगर्भसंभूतं विद्युत्कान्तिसमप्रभम्।
कुमारं शक्तिहस्तं तं मङ्गलं प्रणमाम्यहम्॥3॥

॥ भगवान बुध ॥

प्रियङ्गुकलिकाश्यामं रूपेणाप्रतिमं बुधम्।
सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम्॥4॥

॥ भगवान गुरु ॥

देवानां च ऋषीणां च गुरुं काञ्चनसंनिभम्।
बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम्॥5॥

॥ भगवान शुक्र ॥

हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम्।
सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम्॥6॥

॥ भगवान शनि ॥

नीलांजनसमाभासं रविपुत्रं यमाग्रजम्।
छायामार्तण्डसंभूतं तं नमामि शनैश्चरम्॥7॥

॥ नवग्रह राहु ॥

अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम्।
सिंहिकागर्भसंभूतं तं राहुं प्रणमाम्यहम्॥8॥

॥ नवग्रह केतु ॥

पलाशपुष्पसंकाशं तारकाग्रहमस्तकम्।
रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम्॥9॥

॥ इति श्रीवेदव्यासविरचितम् नवग्रहस्तोत्रं सम्पूर्णम् ॥

---

॥ Navagraha Stotram ॥

॥ Bhagavan Surya ॥

Japākusumasankāsham Kāshyapeyam Mahādyutim।
Tamo'rim Sarvapāpaghnam Praṇato'smi Divākaram॥1॥

॥ Bhagavan Chandra ॥

Dadhishaṅkhatuṣārābham Kṣīrodārṇavasambhavam।
Namāmi Shashinam Somam Shambhormukuṭabhūṣaṇam॥2॥

॥ Bhagavan Maṅgal ॥

Dharaṇīgarbhasambhūtam Vidyutkāntisamamaprabham।
Kumāram Shaktihastaṁ Tam Maṅgalam Praṇamāmyaham॥3॥

॥ Bhagavan Budha ॥

Priyaṅgukalikāshyāmam Rūpeṇāpratimam Budham।
Saumyam Saumyaguṇopetam Tam Budham Praṇamāmyaham॥4॥

॥ Bhagavan Guru ॥

Devānām Cha Ṛṣīṇām Cha Gurum Kāñchanasannibham।
Buddhibhūtam Trilokesham Tam Namāmi Bṛhaspatim॥5॥

॥ Bhagavan Shukra ॥

Himakundamṛṇālābham Daityānām Paramam Gurum।
Sarvashāstrapravaktāram Bhārgavam Praṇamāmyaham॥6॥

॥ Bhagavan Shani ॥

Nīlānjanasamābhāsam Raviputram Yamāgrajam।
Chāyāmārtaṇḍasambhūtam Tam Namāmi Shanaishcharam॥7॥

॥ Navagraha Rāhu ॥

Ardhakāyam Mahāvīryam Chandrādityavimardanam।
Simhikāgarbhasambhūtam Tam Rāhum Praṇamāmyaham॥8॥

॥ Navagraha Ketu ॥

Palāshapuṣpasankāsham Tārakāgrahamastakam।
Raudram Raudrātmakam Ghoram Tam Ketum Praṇamāmyaham॥9॥

॥ Iti Shrīvedavyāsavirachitam Navagrahastotram Sampūrṇam ॥`
};

async function addNavagrahaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: navagrahaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Navagraha Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(navagrahaStotram);
      await doc.save();
      console.log('✓  Added: ' + navagrahaStotram.title);
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

addNavagrahaStotram();
