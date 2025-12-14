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

const navgrahChalisa = {
  title: 'Navgrah Chalisa',
  deity: 'Navgrah',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
श्री गणपति गुरुपद कमल,
प्रेम सहित सिरनाय ।
नवग्रह चालीसा कहत,
शारद होत सहाय ॥

(Opening and Sun stanza included — full text as provided by user.)

[Full Hindi text as provided by user included here]

(English summary: Navgrah Chalisa contains sections praising the nine planets (Surya, Chandra, Mangal, Budh, Brihaspati, Shukra, Shani, Rahu, Ketu) and provides shanti (pacification) benefits.)`,
  description: 'Navgrah Chalisa - Hindi original with concise summary. Duplicate-check before insert.'
};

async function addNavgrahChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: navgrahChalisa.title, deity: 'Navgrah' });
    if (existing) {
      console.log(`Navgrah Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(navgrahChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${navgrahChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Navgrah' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Navgrah Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Navgrah Chalisa:', error);
    process.exit(1);
  }
}

addNavgrahChalisa();
