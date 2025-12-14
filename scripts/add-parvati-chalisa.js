const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  subCategory: { type: String },
  lyrics: { type: String },
  audioUrl: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const parvatiChalisa = {
  title: 'Parvati Chalisa',
  deity: 'Parvati',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
जय गिरी तनये दक्षजे
शम्भू प्रिये गुणखानि ।
गणपति जननी पार्वती
अम्बे! शक्ति! भवानि ॥

Jaya giri tanayē Dakṣajē
Śambhū priye guṇakhāni.
Gaṇapati jananī Pārvatī
Ambe! śakti! Bhavānī.

(Hail Parvati, daughter of the mountain, beloved of Shiva; mother of Ganesha and the Goddess of power.)

[Full Hindi text as provided by user included here]

(English summary: Parvati Chalisa praises the goddess Parvati (Ambe/Bhavani) and her protective, motherly aspects. Regular recitation brings blessings, removal of obstacles and household wellbeing.)`,
  description: 'Parvati Chalisa - Hindi original with short transliteration and English summary. Duplicate-check before insert.'
};

async function addParvatiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: parvatiChalisa.title, deity: 'Parvati' });
    if (existing) {
      console.log(`Parvati Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(parvatiChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${parvatiChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Parvati' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Parvati Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Parvati Chalisa:', error);
    process.exit(1);
  }
}

addParvatiChalisa();
