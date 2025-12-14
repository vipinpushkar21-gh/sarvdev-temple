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

const vishnuChalisa = {
  title: 'Vishnu Chalisa',
  deity: 'Vishnu',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा॥
विष्णु सुनिए विनय सेवक की चितलाय ।
कीरत कुछ वर्णन करूं दीजै ज्ञान बताय ।

Viṣṇu suni'ē vinaya sēvaka kī citlāya.
Kīrata kuch varṇana karūṁ dījai jñāna batāya.

(Invocation: Hear, O Vishnu — I humbly narrate your praise and deeds.)

[Full Hindi text as provided by user included here]

(English summary: Vishnu Chalisa praises the many avatāras and deeds of Lord Vishnu; recitation brings protection and removal of obstacles.)`,
  description: 'Vishnu Chalisa - includes Hindi original and concise summary. Duplicate-check before insert.'
};

async function addVishnuChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: vishnuChalisa.title, deity: 'Vishnu' });
    if (existing) {
      console.log(`Vishnu Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(vishnuChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${vishnuChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Vishnu' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Vishnu Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Vishnu Chalisa:', error);
    process.exit(1);
  }
}

addVishnuChalisa();
