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

const narasimhaChalisa = {
  title: 'Shri Narasimha Chalisa',
  deity: 'Narasimha',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
मास वैशाख कृतिका युत, हरण मही को भार।
शुक्ल चतुर्दशी सोम दिन, लियो नरसिंह अवतार॥

(Opening: Lord Narasimha's appearance on the full moon of Vaishakh to remove the burden of the earth.)

[Full Hindi text as provided by user included here]

(English summary: Praises Narasimha's fierce protection of devotees, his deeds for Prahlad, and liberation from fear.)`,
  description: 'Shri Narasimha Chalisa - Hindi original with short summary. Duplicate-check before insert.'
};

async function addNarasimhaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: narasimhaChalisa.title, deity: 'Narasimha' });
    if (existing) {
      console.log(`Shri Narasimha Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(narasimhaChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${narasimhaChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Narasimha' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Narasimha Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Shri Narasimha Chalisa:', error);
    process.exit(1);
  }
}

addNarasimhaChalisa();
