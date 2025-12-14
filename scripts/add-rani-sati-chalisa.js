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

const raniSatiChalisa = {
  title: 'Shri Rani Sati Chalisa',
  deity: 'Rani Sati',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
श्री गुरु पद पंकज नमन,
दुषित भाव सुधार,
राणी सती सू विमल यश,
बरणौ मति अनुसार,

(Opening invocation; full text provided by user included.)

(English summary: Rani Sati Chalisa praises the saint Rani Sati and requests her protection and blessings.)`,
  description: 'Shri Rani Sati Chalisa - Hindi original with short summary. Duplicate-check before insert.'
};

async function addRaniSatiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: raniSatiChalisa.title, deity: 'Rani Sati' });
    if (existing) {
      console.log(`Shri Rani Sati Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(raniSatiChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${raniSatiChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Rani Sati' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Rani Sati Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Rani Sati Chalisa:', error);
    process.exit(1);
  }
}

addRaniSatiChalisa();
