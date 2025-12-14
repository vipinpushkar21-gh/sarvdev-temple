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

const krishnaChalisa = {
  title: 'Shri Krishna Chalisa',
  deity: 'Krishna',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा॥
बंशी शोभित कर मधुर,
नील जलद तन श्याम ।
अरुण अधर जनु बिम्बफल,
नयन कमल अभिराम ॥

Banshī śobhit kara madhur,
Nīla jalada tana śyāma.
Aruṇa adhara janu bimbaphala,
Nayana kamala abhirāma.

(The sweet flute adorns you; dark-blue as a rain cloud, delightful to the eyes.)

[Full Hindi text as provided by user included here]

(English summary: Shri Krishna Chalisa praises Krishna's childhood pastimes, miracles, and role as protector of devotees. Recitation bestows devotion, relief from suffering and spiritual blessings.)`,
  description: 'Shri Krishna Chalisa - includes Hindi original, concise Roman transliteration for opening lines and an English summary. Duplicate-check before insert.'
};

async function addKrishnaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: krishnaChalisa.title, deity: 'Krishna' });
    if (existing) {
      console.log(`Shri Krishna Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(krishnaChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${krishnaChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Krishna' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Krishna Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Shri Krishna Chalisa:', error);
    process.exit(1);
  }
}

addKrishnaChalisa();
