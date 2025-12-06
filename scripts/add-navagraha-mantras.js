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

const navagrahaMantras = [
  {
    title: 'Surya Mantra (Sun)',
    description: 'Beej mantra for Lord Surya (Sun God), the king of all planets. Chanting this mantra removes darkness from life, grants vitality, health, confidence, leadership qualities, and success. Beneficial for father\'s health, government jobs, and authority positions. Strengthens Sun in horoscope.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ह्रीं ह्रौं सूर्याय नमः

Transliteration:
Om Hreem Hraum Suryaya Namah

Translation:
Om, salutations to Lord Surya (the Sun God) with seed syllables Hreem and Hraum.`,
    status: 'approved'
  },
  {
    title: 'Chandra Mantra (Moon)',
    description: 'Beej mantra for Lord Chandra (Moon God). This mantra brings mental peace, emotional balance, intuition, and calmness. Beneficial for mother\'s health, mental clarity, creativity, and controlling emotions. Strengthens Moon in horoscope and removes anxiety.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ऐं क्लीं सोमाय नमः

Transliteration:
Om Aing Kleem Somaya Namah

Translation:
Om, salutations to Lord Soma (Chandra/Moon) with seed syllables Aing and Kleem.`,
    status: 'approved'
  },
  {
    title: 'Mangal Mantra (Mars)',
    description: 'Beej mantra for Lord Mangal (Mars God). Chanting this mantra grants courage, strength, energy, determination, and removes Mangal Dosha. Beneficial for property, siblings, blood-related issues, and sports. Strengthens Mars and reduces aggression.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ हूं श्रीं भौमाय नमः

Transliteration:
Om Hum Shreem Bhaumaya Namah

Translation:
Om, salutations to Lord Bhauma (Mangal/Mars) with seed syllables Hum and Shreem.`,
    status: 'approved'
  },
  {
    title: 'Budh Mantra (Mercury)',
    description: 'Beej mantra for Lord Budh (Mercury God). This mantra enhances intelligence, communication skills, business acumen, wit, and learning abilities. Beneficial for students, businessmen, writers, and speakers. Strengthens Mercury and improves analytical thinking.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ऐं श्रीं श्रीं बुधाय नमः

Transliteration:
Om Aing Shreem Shreem Budhaya Namah

Translation:
Om, salutations to Lord Budha (Mercury) with seed syllables Aing and Shreem (repeated for emphasis).`,
    status: 'approved'
  },
  {
    title: 'Guru Mantra (Jupiter)',
    description: 'Beej mantra for Lord Guru/Brihaspati (Jupiter God). Chanting this mantra brings wisdom, knowledge, wealth, prosperity, children, and spiritual growth. Beneficial for teachers, scholars, marriage, and progeny. Strengthens Jupiter and removes obstacles in education.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ह्रीं क्लीं हूं बृहस्पतये नमः

Transliteration:
Om Hreem Kleem Hum Brihaspataye Namah

Translation:
Om, salutations to Lord Brihaspati (Guru/Jupiter) with seed syllables Hreem, Kleem and Hum.`,
    status: 'approved'
  },
  {
    title: 'Shukra Mantra (Venus)',
    description: 'Beej mantra for Lord Shukra (Venus God). This mantra attracts love, beauty, luxury, artistic talents, marital happiness, and material comforts. Beneficial for relationships, marriage, arts, and vehicles. Strengthens Venus and brings refinement.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ह्रीं श्रीं शुक्राय नमः

Transliteration:
Om Hreem Shreem Shukraya Namah

Translation:
Om, salutations to Lord Shukra (Venus) with seed syllables Hreem and Shreem.`,
    status: 'approved'
  },
  {
    title: 'Shani Mantra (Saturn)',
    description: 'Beej mantra for Lord Shani (Saturn God). Chanting this mantra removes Shani Dosha, reduces hardships during Sade Sati, brings justice, discipline, and removes obstacles. Very powerful for protection from Saturn\'s malefic effects and karmic lessons.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ऐं ह्रीं श्रीं शनैश्चराय नमः

Transliteration:
Om Aing Hreem Shreem Shanaishcharaya Namah

Translation:
Om, salutations to Lord Shanaishchara (Shani/Saturn, the slow-moving one) with seed syllables Aing, Hreem and Shreem.`,
    status: 'approved'
  },
  {
    title: 'Rahu Mantra (North Node)',
    description: 'Beej mantra for Lord Rahu (North Lunar Node). This mantra removes Rahu Dosha, confusion, illusions, and sudden obstacles. Grants success in foreign lands, technology, research, and unconventional fields. Reduces fear and mental disturbances.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ऐं ह्रीं राहवे नमः

Transliteration:
Om Aing Hreem Rahave Namah

Translation:
Om, salutations to Lord Rahu (the shadow planet) with seed syllables Aing and Hreem.`,
    status: 'approved'
  },
  {
    title: 'Ketu Mantra (South Node)',
    description: 'Beej mantra for Lord Ketu (South Lunar Node). Chanting this mantra removes Ketu Dosha, brings spiritual enlightenment, moksha, psychic abilities, and removes past life karmas. Beneficial for occult sciences, healing, and detachment.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Navagraha',
    lyrics: `Sanskrit:
ॐ ह्रीं ऐं केतवे नमः

Transliteration:
Om Hreem Aing Ketave Namah

Translation:
Om, salutations to Lord Ketu (the shadow planet) with seed syllables Hreem and Aing.`,
    status: 'approved'
  }
];

async function addNavagrahaMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding Navagraha Mantras ---\n');

    for (const mantra of navagrahaMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 9 Navagraha Mantras added successfully!');
    console.log(`Total mantras added: ${navagrahaMantras.length}`);
    console.log('\nNavagraha (Nine Planets) Mantras:');
    console.log('1. Surya (Sun) - सूर्य - Vitality, health, authority');
    console.log('2. Chandra (Moon) - चन्द्र - Mental peace, emotions');
    console.log('3. Mangal (Mars) - मंगल - Courage, energy, property');
    console.log('4. Budh (Mercury) - बुध - Intelligence, communication');
    console.log('5. Guru (Jupiter) - गुरु/बृहस्पति - Wisdom, wealth, children');
    console.log('6. Shukra (Venus) - शुक्र - Love, beauty, luxury');
    console.log('7. Shani (Saturn) - शनि - Discipline, removes obstacles');
    console.log('8. Rahu (North Node) - राहु - Foreign success, technology');
    console.log('9. Ketu (South Node) - केतु - Spirituality, moksha');
    console.log('\nCorrections made:');
    console.log('- Fixed Shukra: श्रृंग → श्रीं (correct seed syllable)');
    console.log('- Fixed Guru: Cling → Kleem (proper transliteration)');
    console.log('- Standardized all transliterations');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addNavagrahaMantras();
