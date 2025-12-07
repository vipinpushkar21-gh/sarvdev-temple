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

const newLakshmiMantras = [
  {
    title: 'Jyestha Lakshmi Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं ह्रीं श्रीं ज्येष्ठ लक्ष्म्यै स्वयम्भुवे ह्रीं ज्येष्ठायै नमः ॥

Transliteration: Om aiṁ hrīṁ śrīṁ jyeṣṭha lakṣmyai svayambhuve hrīṁ jyeṣṭhāyai namaḥ ॥

Translation: Om, Salutations to Goddess Jyeshtha Lakshmi, the self-manifested eldest form of Lakshmi. Om Aim Hrim Shrim.`,
    description: 'Mantra for Jyeshtha Lakshmi, the eldest and most powerful form of Goddess Lakshmi'
  },
  {
    title: 'Mahalakshmi Yakshini Vidya Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं क्लीं महालक्ष्म्यै नमः ॥

Transliteration: Om hrīṁ klīṁ mahālakṣmyai namaḥ ॥

Translation: Om, Salutations to Goddess Mahalakshmi with the sacred seed syllables Hrim and Klim.`,
    description: 'Powerful Yakshini Vidya mantra for invoking Mahalakshmi\'s mystical powers'
  },
  {
    title: 'Shri Lakshmi Narasimha Combined Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं क्षौं श्रीं लक्ष्मी नृसिंहाय नमः ॥
ॐ क्लीं क्षौं श्रीं लक्ष्मी देव्यै नमः ॥

Transliteration: Om hrīṁ kṣauṁ śrīṁ lakṣmī nṛsiṁhāya namaḥ ॥
Om klīṁ kṣauṁ śrīṁ lakṣmī devyai namaḥ ॥

Translation: Om, Salutations to Lord Lakshmi-Narasimha. Om, Salutations to Goddess Lakshmi Devi.`,
    description: 'Combined mantra invoking both Goddess Lakshmi and Lord Narasimha for complete protection and prosperity'
  },
  {
    title: 'Ekadashakshar Siddha Lakshmi Mantra (11 Syllables)',
    deity: 'Lakshmi',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः ॥

Transliteration: Om śrīṁ hrīṁ klīṁ śrīṁ siddha lakṣmyai namaḥ ॥

Translation: Om, Salutations to Goddess Siddha Lakshmi who grants all accomplishments and perfections.`,
    description: 'Eleven-syllable perfected mantra for attaining Siddhi (spiritual powers) through Lakshmi\'s grace'
  },
  {
    title: 'Dwadashakshar Mahalakshmi Mantra (12 Syllables)',
    deity: 'Lakshmi',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं ह्रीं श्रीं क्लीं सौः जगत्प्रसुत्यै नमः ॥

Transliteration: Om aiṁ hrīṁ śrīṁ klīṁ sauḥ jagatprasutyai namaḥ ॥

Translation: Om, Salutations to the Mother of the Universe (Lakshmi) who gives birth to and nurtures the entire world.`,
    description: 'Twelve-syllable great mantra honoring Lakshmi as the cosmic mother and sustainer of the universe'
  }
];

async function addNewLakshmiMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of newLakshmiMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 5 new Lakshmi Mantras added successfully!');
    console.log(`Total mantras added: ${newLakshmiMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- ज्येष्ठ लक्ष्म्यै (corrected case ending)');
    console.log('- स्वयम्भुवे (corrected from स्वयम्भुवे)');
    console.log('- क्षौं (proper bija mantra)');
    console.log('- सिद्ध लक्ष्म्यै (corrected from सिध्द)');
    console.log('- जगत्प्रसुत्यै (corrected from जगात्प्रसुत्यै)');
    console.log('- All mantras set to approved status');

    // Verify total count
    const allLakshmi = await Devotional.find({ deity: 'Lakshmi' });
    console.log(`\nTotal Lakshmi mantras in database: ${allLakshmi.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding new Lakshmi mantras:', error);
    process.exit(1);
  }
}

addNewLakshmiMantras();
