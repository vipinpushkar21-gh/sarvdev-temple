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

const ramdevChalisa = {
  title: 'Ramdev Chalisa',
  deity: 'Ramdev',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
श्री गुरु पद नमन करि, गिरा गनेश मनाय ।
कथूं रामदेव विमल यश, सुने पाप विनशाय ॥

(Opening: invocation to Guru and Ganesh; full text as provided.)

(English summary: Ramdev Chalisa praises the saint Ramdev and recounts his miracles; recitation brings protection and blessings.)`,
  description: 'Ramdev Chalisa - Hindi original with short summary. Duplicate-check before insert.'
};

async function addRamdevChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: ramdevChalisa.title, deity: 'Ramdev' });
    if (existing) {
      console.log(`Ramdev Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(ramdevChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${ramdevChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Ramdev' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Ramdev Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Ramdev Chalisa:', error);
    process.exit(1);
  }
}

addRamdevChalisa();
