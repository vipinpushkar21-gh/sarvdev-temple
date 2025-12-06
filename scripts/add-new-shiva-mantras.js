const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  audio: { type: String },
  lyrics: { type: String },
  duration: { type: String },
  artist: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  createdAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const newShivaMantras = [
  {
    title: 'Om Namah Shivaya (Panchakshara Mantra)',
    description: 'The most sacred and powerful five-syllable (Panchakshara) mantra of Lord Shiva. This is the king of all Shiva mantras, representing the five elements and bringing peace, prosperity, and spiritual liberation. Chanting this mantra purifies the soul and grants divine consciousness.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ नमः शिवाय

Transliteration:
Om Namah Shivaya

Translation:
Om, salutations to Lord Shiva - the auspicious one, the destroyer of ignorance and negativity.`,
    status: 'approved'
  },
  {
    title: 'Shiva Gayatri Mantra (Tatpurusha)',
    description: 'Gayatri mantra dedicated to Lord Shiva in his Tatpurusha (Supreme Being) form. This powerful mantra follows the traditional Gayatri structure and invokes Mahadeva (Great Lord) for spiritual wisdom and enlightenment. Different from Rudra Gayatri, this focuses on Shiva\'s cosmic aspect.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात्

Transliteration:
Om Tatpurushaya Vidmahe Mahadevaya Dhimahi Tanno Rudrah Prachodayat

Translation:
Om, we meditate upon the Supreme Being (Tatpurusha), we contemplate the Great God (Mahadeva). May Rudra inspire and guide our intellect.`,
    status: 'approved'
  },
  {
    title: 'Shiva Dhyan Mantra (Forgiveness Prayer)',
    description: 'Beautiful prayer of surrender and forgiveness to Lord Shiva. This mantra asks Mahadeva Shambho (the auspicious Lord) to forgive all sins committed through body, speech, mind, hands, feet, ears, eyes - whether done knowingly or unknowingly. A powerful mantra for seeking divine grace and purification.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
करचरणकृतं वाक् कायजं कर्मजं वा श्रवणनयनजं वा मानसं वापराधम् ।
विहितं विहितं वा सर्व मेतत् क्षमस्व जय जय करुणाब्धे श्री महादेव शम्भो ॥

Transliteration:
Karcharankritam Vaa Kaayajam Karmajam Vaa Shravannayanajam Vaa Maanasam Vaa Paradham
Vihitam Avihitam Vaa Sarva Metat Kshamasva Jaya Jaya Karunaabdhe Shri Mahadeva Shambho

Translation:
O Lord Shiva, please forgive all sins committed by my hands, feet, body, actions, ears, eyes or mind - whether done knowingly or unknowingly. Victory, victory to you, O ocean of compassion, the great Lord Shambho!`,
    status: 'approved'
  }
];

async function addNewShivaMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding New Shiva Mantras ---\n');

    for (const mantra of newShivaMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 3 new Shiva Mantras added successfully!');
    console.log(`Total new mantras added: ${newShivaMantras.length}`);
    console.log('\nNew Shiva Mantras:');
    console.log('1. Om Namah Shivaya (Panchakshara) - The most sacred 5-syllable mantra');
    console.log('2. Shiva Gayatri Mantra - Tatpurusha form');
    console.log('3. Shiva Dhyan Mantra - Forgiveness prayer');
    console.log('\nSkipped Duplicates:');
    console.log('- Rudra Mantra (already exists)');
    console.log('- Maha Mrityunjaya Mantra (already exists as "Mahamrityunjaya Mantra Complete Form")');
    console.log('\nTotal Shiva Mantras in database: 10 (7 existing + 3 new)');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addNewShivaMantras();
