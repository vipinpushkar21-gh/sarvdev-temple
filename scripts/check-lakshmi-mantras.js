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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function checkLakshmiMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check all Lakshmi mantras
    const lakshmiMantras = await Devotional.find({ deity: 'Lakshmi' }).sort({ createdAt: -1 });
    
    console.log(`Total Lakshmi mantras found: ${lakshmiMantras.length}\n`);
    
    if (lakshmiMantras.length > 0) {
      console.log('Lakshmi Mantras in database:');
      lakshmiMantras.forEach((mantra, index) => {
        console.log(`${index + 1}. ${mantra.title} (Category: ${mantra.category}, Deity: ${mantra.deity})`);
      });
    } else {
      console.log('No Lakshmi mantras found in database!');
    }

    // Check all categories
    console.log('\n--- Category Distribution ---');
    const allMantras = await Devotional.find({});
    const categoryCount = {};
    const deityCount = {};
    
    allMantras.forEach(mantra => {
      categoryCount[mantra.category] = (categoryCount[mantra.category] || 0) + 1;
      deityCount[mantra.deity] = (deityCount[mantra.deity] || 0) + 1;
    });
    
    console.log('Categories:', categoryCount);
    console.log('\nDeities:', deityCount);
    console.log(`\nTotal mantras in database: ${allMantras.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error checking Lakshmi mantras:', error);
    process.exit(1);
  }
}

checkLakshmiMantras();
