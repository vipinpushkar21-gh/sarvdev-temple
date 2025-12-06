const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

async function moveRashiToMantra() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    const db = mongoose.connection.db;
    const devotionalsCollection = db.collection('devotionals');

    console.log('\n--- Moving Rashi mantras to Mantra category ---\n');

    // Update all documents with category "Rashi" to "Mantra"
    const result = await devotionalsCollection.updateMany(
      { category: 'Rashi' },
      { $set: { category: 'Mantra' } }
    );

    console.log(`✓ Updated ${result.modifiedCount} Rashi mantras to Mantra category`);
    console.log('\nNow all Rashi mantras will appear in:');
    console.log('- Main page: /devotionals/mantra');
    console.log('- With deity filters: Vishnu, Krishna, Brahma, Hanuman, Shiva, Narasimha');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

moveRashiToMantra();
