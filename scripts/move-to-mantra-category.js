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
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function moveToMantraCategory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Move Vastu mantras to Mantra category
    const vastuResult = await Devotional.updateMany(
      { category: 'Vastu' },
      { $set: { category: 'Mantra', deity: 'Vastu Purusha' } }
    );
    console.log(`✓ Moved ${vastuResult.modifiedCount} Vastu mantras to Mantra category`);

    // Move Durga mantras to Mantra category
    const durgaResult = await Devotional.updateMany(
      { category: 'Durga' },
      { $set: { category: 'Mantra', deity: 'Durga' } }
    );
    console.log(`✓ Moved ${durgaResult.modifiedCount} Durga mantras to Mantra category`);

    // Move Kuber mantras to Mantra category
    const kuberResult = await Devotional.updateMany(
      { category: 'Kuber' },
      { $set: { category: 'Mantra', deity: 'Kuber' } }
    );
    console.log(`✓ Moved ${kuberResult.modifiedCount} Kuber mantras to Mantra category`);

    // Verify
    console.log('\n--- Verification ---');
    const vastuCount = await Devotional.countDocuments({ category: 'Mantra', deity: 'Vastu Purusha' });
    const durgaCount = await Devotional.countDocuments({ category: 'Mantra', deity: 'Durga' });
    const kuberCount = await Devotional.countDocuments({ category: 'Mantra', deity: 'Kuber' });
    const totalMantra = await Devotional.countDocuments({ category: 'Mantra' });

    console.log(`Vastu Purusha mantras in Mantra category: ${vastuCount}`);
    console.log(`Durga mantras in Mantra category: ${durgaCount}`);
    console.log(`Kuber mantras in Mantra category: ${kuberCount}`);
    console.log(`\nTotal Mantra category count: ${totalMantra}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error moving categories:', error);
    process.exit(1);
  }
}

moveToMantraCategory();
