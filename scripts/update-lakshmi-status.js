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

async function updateLakshmiStatus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check current status of Lakshmi mantras
    const lakshmiMantras = await Devotional.find({ deity: 'Lakshmi' });
    
    console.log('Current Lakshmi mantras status:');
    lakshmiMantras.forEach((mantra, index) => {
      console.log(`${index + 1}. ${mantra.title} - Status: ${mantra.status || 'NOT SET'}`);
    });

    // Update all Lakshmi mantras to approved status
    const result = await Devotional.updateMany(
      { deity: 'Lakshmi' },
      { $set: { status: 'approved' } }
    );

    console.log(`\n✓ Updated ${result.modifiedCount} Lakshmi mantras to 'approved' status`);

    // Verify
    const updated = await Devotional.find({ deity: 'Lakshmi' });
    console.log('\nVerifying updated status:');
    updated.forEach((mantra, index) => {
      console.log(`${index + 1}. ${mantra.title} - Status: ${mantra.status}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error updating Lakshmi mantras:', error);
    process.exit(1);
  }
}

updateLakshmiStatus();
