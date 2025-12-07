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

async function checkDuplicates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const lakshmiMantras = await Devotional.find({ deity: 'Lakshmi' });
    
    console.log('=== EXISTING LAKSHMI MANTRAS ===\n');
    lakshmiMantras.forEach((mantra, index) => {
      console.log(`${index + 1}. ${mantra.title}`);
    });
    
    console.log(`\nTotal existing: ${lakshmiMantras.length}`);
    
    // Check for specific mantras
    const newMantras = [
      'Jyesth Lakshmi',
      'Yakshini',
      'Nrisingh',
      'Ekadashakshar',
      'Dwadashakshar'
    ];
    
    console.log('\n=== CHECKING FOR DUPLICATES ===\n');
    newMantras.forEach(searchTerm => {
      const found = lakshmiMantras.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (found.length > 0) {
        console.log(`⚠️  "${searchTerm}" - FOUND ${found.length} match(es):`);
        found.forEach(m => console.log(`   - ${m.title}`));
      } else {
        console.log(`✓ "${searchTerm}" - Not found (safe to add)`);
      }
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDuplicates();
