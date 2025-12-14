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

async function updateKatyayaniToMantra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all Katyayani category mantras
    const katyayaniMantras = await Devotional.find({ category: 'Katyayani' });
    console.log(`Found ${katyayaniMantras.length} mantras in Katyayani category\n`);

    // Update each one to Mantra category
    for (const mantra of katyayaniMantras) {
      await Devotional.updateOne(
        { _id: mantra._id },
        { 
          $set: { 
            category: 'Mantra'
          } 
        }
      );
      console.log(`✓ Moved to Mantra: ${mantra.title} (Deity: ${mantra.deity})`);
    }

    console.log('\n✓ All Katyayani mantras moved to Mantra category!');
    console.log('Deity filters (Katyayani, Parvati) remain for filtering on Mantra page.');

    // Verify
    const mantraCount = await Devotional.countDocuments({ category: 'Mantra' });
    const katyayaniCount = await Devotional.countDocuments({ category: 'Katyayani' });
    console.log(`\nTotal Mantra category: ${mantraCount}`);
    console.log(`Remaining in Katyayani category: ${katyayaniCount}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error updating categories:', error);
    process.exit(1);
  }
}

updateKatyayaniToMantra();
