const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

async function checkExistingShivaMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    const db = mongoose.connection.db;
    const devotionalsCollection = db.collection('devotionals');

    console.log('\n--- Checking Existing Shiva Mantras ---\n');

    const existingShivaMantras = await devotionalsCollection.find({
      deity: 'Shiva',
      category: 'Mantra'
    }).toArray();

    console.log(`Found ${existingShivaMantras.length} existing Shiva mantras:\n`);
    
    existingShivaMantras.forEach((mantra, index) => {
      console.log(`${index + 1}. ${mantra.title}`);
    });

    console.log('\n--- Checking for Duplicates ---\n');

    const newMantras = [
      'Om Namah Shivaya',
      'Rudra Mantra',
      'Shiva Gayatri Mantra',
      'Shiv Dhyan Mantra',
      'Maha Mrityunjaya Mantra'
    ];

    const mantrasToAdd = [];

    newMantras.forEach(newTitle => {
      const isDuplicate = existingShivaMantras.some(existing => 
        existing.title.toLowerCase().includes(newTitle.toLowerCase()) ||
        newTitle.toLowerCase().includes(existing.title.toLowerCase())
      );

      if (isDuplicate) {
        console.log(`❌ DUPLICATE: "${newTitle}" already exists`);
      } else {
        console.log(`✅ NEW: "${newTitle}" will be added`);
        mantrasToAdd.push(newTitle);
      }
    });

    console.log(`\n${mantrasToAdd.length} new mantras to add`);
    console.log(`${newMantras.length - mantrasToAdd.length} duplicates skipped`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkExistingShivaMantras();
