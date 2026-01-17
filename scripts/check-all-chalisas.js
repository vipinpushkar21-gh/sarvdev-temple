const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({}, {strict: false});
const Devotional = mongoose.model('Devotional', DevotionalSchema);

async function checkChalisaLyrics() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const chalisas = await Devotional.find({ category: 'Chalisa' }).sort({ createdAt: -1 });
    
    console.log(`Total Chalisas: ${chalisas.length}\n`);
    console.log('Checking lyrics length for all chalisas:\n');
    
    const incomplete = [];
    
    chalisas.forEach((chalisa, index) => {
      const lyricsLength = chalisa.lyrics ? chalisa.lyrics.length : 0;
      const isShort = lyricsLength < 500; // Chalisas should be longer than 500 chars
      
      if (isShort) {
        incomplete.push({
          title: chalisa.title,
          deity: chalisa.deity,
          length: lyricsLength,
          id: chalisa._id
        });
      }
      
      console.log(`${index + 1}. ${chalisa.title} (${chalisa.deity || 'N/A'})`);
      console.log(`   Lyrics: ${lyricsLength} chars ${isShort ? '❌ INCOMPLETE' : '✓'}`);
      console.log(`   ID: ${chalisa._id}`);
      console.log('');
    });
    
    if (incomplete.length > 0) {
      console.log(`\n⚠️  ${incomplete.length} Incomplete Chalisas Found:\n`);
      incomplete.forEach((c, i) => {
        console.log(`${i + 1}. ${c.title} - ${c.length} chars (ID: ${c.id})`);
      });
    } else {
      console.log('\n✓ All chalisas have complete lyrics!');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkChalisaLyrics();
