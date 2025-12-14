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

const brahmaChalisa = {
  title: 'Shri Brahma Chalisa',
  deity: 'Brahma',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
जय ब्रह्मा जय स्वयम्भू, चतुरानन सुखमूल।
करहु कृपा निज दास पै, रहहु सदा अनुकूल॥

(Opening stanza and full text as provided.)

(English summary: Brahma Chalisa praises the creator and requests blessings for wisdom and right action.)`,
  description: 'Shri Brahma Chalisa - Hindi original with short summary. Duplicate-check before insert.'
};

async function addBrahmaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: brahmaChalisa.title, deity: 'Brahma' });
    if (existing) {
      console.log(`Shri Brahma Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(brahmaChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${brahmaChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Brahma' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Brahma Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Shri Brahma Chalisa:', error);
    process.exit(1);
  }
}

addBrahmaChalisa();
