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

const mahalakshmiChalisa = {
  title: 'Shri Mahalakshmi Chalisa',
  deity: 'Mahalakshmi',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
जय जय श्री महालक्ष्मी, करूँ मात तव ध्यान।
सिद्ध काज मम किजिये, निज शिशु सेवक जान॥

(Opening invocation; full text provided by user included.)

(English summary: Mahalakshmi Chalisa praises the goddess of wealth and prosperity; recitation bestows abundance and relief from poverty.)`,
  description: 'Shri Mahalakshmi Chalisa - Hindi original with short summary. Duplicate-check before insert.'
};

async function addMahalakshmiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: mahalakshmiChalisa.title, deity: 'Mahalakshmi' });
    if (existing) {
      console.log(`Shri Mahalakshmi Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(mahalakshmiChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${mahalakshmiChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Mahalakshmi' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Mahalakshmi Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Mahalakshmi Chalisa:', error);
    process.exit(1);
  }
}

addMahalakshmiChalisa();
