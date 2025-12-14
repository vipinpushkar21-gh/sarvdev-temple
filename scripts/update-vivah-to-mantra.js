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

async function updateVivahToMantra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all Vivah category mantras
    const vivahMantras = await Devotional.find({ category: 'Vivah' });
    console.log(`Found ${vivahMantras.length} mantras in Vivah category\n`);

    // Update each one to Mantra category with subCategory 'Vivah Mantra'
    for (const mantra of vivahMantras) {
      await Devotional.updateOne(
        { _id: mantra._id },
        { 
          $set: { 
            category: 'Mantra',
            subCategory: 'Vivah Mantra'
          } 
        }
      );
      console.log(`✓ Moved to Mantra: ${mantra.title} (Deity: ${mantra.deity})`);
    }

    console.log('\n✓ All Vivah mantras moved to Mantra category with subCategory "Vivah Mantra"!');
    console.log('These mantras can be filtered using subCategory on Mantra page.');

    // Verify
    const mantraCount = await Devotional.countDocuments({ category: 'Mantra' });
    const vivahCount = await Devotional.countDocuments({ category: 'Vivah' });
    const vivahMantraCount = await Devotional.countDocuments({ subCategory: 'Vivah Mantra' });
    console.log(`\nTotal Mantra category: ${mantraCount}`);
    console.log(`Remaining in Vivah category: ${vivahCount}`);
    console.log(`Total Vivah Mantra (subCategory): ${vivahMantraCount}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error updating categories:', error);
    process.exit(1);
  }
}

updateVivahToMantra();
