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

const krishnaMantras = [
  {
    title: 'Krishna Moola Mantra (Root Mantra)',
    deity: 'Krishna',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ कृष्णाय नमः ॥

Transliteration: Om kṛṣṇāya namaḥ ॥

Translation: Om, salutations to Lord Krishna.`,
    description: 'The root mantra of Lord Krishna - simple yet powerful for devotion, peace, and divine connection'
  },
  {
    title: 'Hare Krishna Maha Mantra',
    deity: 'Krishna',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।
हरे राम हरे राम राम राम हरे हरे ॥

Transliteration: Hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare।
Hare rāma hare rāma rāma rāma hare hare ॥

Translation: O energy of the Lord (Hare), O all-attractive Lord Krishna, O Supreme enjoyer Lord Rama - please engage me in Your service.`,
    description: 'The great Maha Mantra for Kali Yuga - most powerful mantra for liberation, devotion, and spiritual awakening. Chanted by millions worldwide'
  },
  {
    title: 'Sri Krishna Sharanam Mantra (Surrender Mantra)',
    deity: 'Krishna',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ श्री कृष्णः शरणं मम ॥

Transliteration: Om śrī kṛṣṇaḥ śaraṇaṁ mama ॥

Translation: Om, Lord Sri Krishna is my refuge/shelter.`,
    description: 'Mantra of complete surrender to Krishna - for success in life, protection, and divine grace'
  },
  {
    title: 'Krishna Gayatri Mantra',
    deity: 'Krishna',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ देवकीनन्दनाय विद्महे।
वासुदेवाय धीमहि।
तन्नो कृष्णः प्रचोदयात् ॥

Transliteration: Om devakīnandanāya vidmahe।
Vāsudevāya dhīmahi।
Tanno kṛṣṇaḥ prachodayāt ॥

Translation: Om, let us meditate on the son of Devaki. Let us concentrate on Vasudeva (Krishna). May Lord Krishna inspire and illumine our intellect.`,
    description: 'Gayatri mantra dedicated to Lord Krishna for wisdom, enlightenment, and spiritual progress'
  }
];

async function addKrishnaMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of krishnaMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Krishna Mantras added successfully!');
    console.log(`Total mantras added: ${krishnaMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- कृष्णाय (to Krishna, correct dative case)');
    console.log('- हरे कृष्ण (Hare Krishna - vocative case, proper form)');
    console.log('- शरणं मम (my refuge - correct accusative + genitive)');
    console.log('- श्री कृष्णः (Sri Krishna - nominative with visarga)');
    console.log('- देवकीनन्दनाय (to the son of Devaki, correct compound)');
    console.log('- वासुदेवाय (to Vasudeva, proper dative)');
    console.log('- तन्नो कृष्णः प्रचोदयात् (may Krishna inspire us - correct Gayatri structure)');
    console.log('- All mantras set to approved status');
    console.log('- Added to Mantra category with "Krishna" deity filter');

    // Verify total count
    const allKrishna = await Devotional.find({ deity: 'Krishna', category: 'Mantra' });
    console.log(`\nTotal Krishna mantras in database: ${allKrishna.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Krishna mantras:', error);
    process.exit(1);
  }
}

addKrishnaMantras();
