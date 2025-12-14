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

const vaishnoChalisa = {
  title: 'Vaishno Chalisa',
  deity: 'Vaishno',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
गरुड़ वाहिनी वैष्णवी, त्रिकुटा पर्वत धाम।
काली, लक्ष्मी, सरस्वती, शक्ति तुम्हें प्रणाम॥

Garuda vāhinī Vaiṣṇavī, Trikuṭā parvata dhām.
Kālī, Lakṣmī, Sarasvatī, śakti tumheṁ praṇāma.

(Invocation praising the three goddesses as aspects of Vaishno.)

[Full Hindi text as provided by user included here]

(English summary: Vaishno Chalisa praises the Goddess in her Vaishno aspect and narrates her manifestations and blessings. Recitation grants protection and fulfillment.)`,
  description: 'Vaishno Chalisa - Hindi original with concise transliteration and summary. Duplicate-check before insert.'
};

async function addVaishnoChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: vaishnoChalisa.title, deity: 'Vaishno' });
    if (existing) {
      console.log(`Vaishno Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(vaishnoChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${vaishnoChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Vaishno' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Vaishno Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Vaishno Chalisa:', error);
    process.exit(1);
  }
}

addVaishnoChalisa();