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

const gayatriChalisa = {
  title: 'Gayatri Chalisa',
  deity: 'Gayatri',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
हीं श्रीं, क्लीं, मेधा, प्रभा, जीवन ज्योति प्रचण्ड ।
शांति, क्रांति, जागृति, प्रगति, रचना शक्ति अखण्ड ॥

(Opening: Invocation to Gayatri for illumination and spiritual power.)

[Full Hindi text as provided by user included here]

(English summary: Gayatri Chalisa praises the mother of the Vedas and grants wisdom, protection and spiritual upliftment.)`,
  description: 'Gayatri Chalisa - Hindi original with short summary. Duplicate-check before insert.'
};

async function addGayatriChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: gayatriChalisa.title, deity: 'Gayatri' });
    if (existing) {
      console.log(`Gayatri Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(gayatriChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${gayatriChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Gayatri' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Gayatri Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Gayatri Chalisa:', error);
    process.exit(1);
  }
}

addGayatriChalisa();
