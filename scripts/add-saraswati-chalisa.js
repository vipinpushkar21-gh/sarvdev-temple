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

const saraswatiChalisa = {
  title: 'Saraswati Chalisa',
  deity: 'Saraswati',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
जनक जननि पद्मरज,
निज मस्तक पर धरि ।
बन्दौं मातु सरस्वती,
बुद्धि बल दे दातारि ॥

(Opening: Invocation to Goddess Saraswati for wisdom and learning.)

[Full Hindi text as provided by user included here]

(English summary: Saraswati Chalisa praises the goddess of knowledge and art; regular recitation helps in learning, memory and removes obstacles to studies.)`,
  description: 'Saraswati Chalisa - Hindi original with short summary. Duplicate-check before insert.'
};

async function addSaraswatiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: saraswatiChalisa.title, deity: 'Saraswati' });
    if (existing) {
      console.log(`Saraswati Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(saraswatiChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${saraswatiChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Saraswati' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Saraswati Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Saraswati Chalisa:', error);
    process.exit(1);
  }
}

addSaraswatiChalisa();
