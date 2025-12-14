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

const suryaMantras = [
  {
    title: 'Surya Namaskar Mantra 1 - Om Mitraya Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ मित्राय नमः ॥

Transliteration: Om mitrāya namaḥ ॥

Translation: Om, salutations to the one who is a friend to all.`,
    description: 'First Surya Namaskar mantra - salutation to Sun as the universal friend'
  },
  {
    title: 'Surya Namaskar Mantra 2 - Om Ravaye Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ रवये नमः ॥

Transliteration: Om ravaye namaḥ ॥

Translation: Om, salutations to the shining one, the radiant one.`,
    description: 'Second Surya Namaskar mantra - salutation to the radiant Sun'
  },
  {
    title: 'Surya Namaskar Mantra 3 - Om Suryaya Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ सूर्याय नमः ॥

Transliteration: Om sūryāya namaḥ ॥

Translation: Om, salutations to the Sun God who induces activity.`,
    description: 'Third Surya Namaskar mantra - salutation to Surya, the supreme light'
  },
  {
    title: 'Surya Namaskar Mantra 4 - Om Bhanave Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ भानवे नमः ॥

Transliteration: Om bhānave namaḥ ॥

Translation: Om, salutations to the one who illumines and shines.`,
    description: 'Fourth Surya Namaskar mantra - salutation to the illuminator'
  },
  {
    title: 'Surya Namaskar Mantra 5 - Om Khagaya Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ खगाय नमः ॥

Transliteration: Om khagāya namaḥ ॥

Translation: Om, salutations to the one who moves across the sky.`,
    description: 'Fifth Surya Namaskar mantra - salutation to the celestial traveler'
  },
  {
    title: 'Surya Namaskar Mantra 6 - Om Pushne Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ पूष्णे नमः ॥

Transliteration: Om pūṣṇe namaḥ ॥

Translation: Om, salutations to the nourisher and sustainer of all.`,
    description: 'Sixth Surya Namaskar mantra - salutation to the cosmic nourisher'
  },
  {
    title: 'Surya Namaskar Mantra 7 - Om Hiranyagarbhaya Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ हिरण्यगर्भाय नमः ॥

Transliteration: Om hiraṇyagarbhāya namaḥ ॥

Translation: Om, salutations to the golden cosmic womb, source of creation.`,
    description: 'Seventh Surya Namaskar mantra - salutation to the golden embryo of creation'
  },
  {
    title: 'Surya Namaskar Mantra 8 - Om Marichaye Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ मरीचये नमः ॥

Transliteration: Om marīchaye namaḥ ॥

Translation: Om, salutations to the lord of the dawn, the rays of light.`,
    description: 'Eighth Surya Namaskar mantra - salutation to the rays of the Sun'
  },
  {
    title: 'Surya Namaskar Mantra 9 - Om Adityaya Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ आदित्याय नमः ॥

Transliteration: Om ādityāya namaḥ ॥

Translation: Om, salutations to the son of Aditi, the cosmic mother.`,
    description: 'Ninth Surya Namaskar mantra - salutation to Aditya, son of Aditi'
  },
  {
    title: 'Surya Namaskar Mantra 10 - Om Savitre Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ सवित्रे नमः ॥

Transliteration: Om savitre namaḥ ॥

Translation: Om, salutations to the stimulating and creative power of the Sun.`,
    description: 'Tenth Surya Namaskar mantra - salutation to Savitar, the stimulator'
  },
  {
    title: 'Surya Namaskar Mantra 11 - Om Arkaya Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ अर्काय नमः ॥

Transliteration: Om arkāya namaḥ ॥

Translation: Om, salutations to the one worthy of praise and glory.`,
    description: 'Eleventh Surya Namaskar mantra - salutation to the praiseworthy one'
  },
  {
    title: 'Surya Namaskar Mantra 12 - Om Bhaskaraya Namah',
    deity: 'Surya',
    category: 'Mantra',
    subCategory: 'Surya Namaskar',
    status: 'approved',
    lyrics: `Sanskrit: ॐ भास्कराय नमः ॥

Transliteration: Om bhāskarāya namaḥ ॥

Translation: Om, salutations to the one who leads to enlightenment and wisdom.`,
    description: 'Twelfth Surya Namaskar mantra - salutation to the giver of light and wisdom'
  },
  {
    title: 'Surya Beej Mantra',
    deity: 'Surya',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः ॥

Transliteration: Om hrāṁ hrīṁ hrauṁ saḥ sūryāya namaḥ ॥

Translation: Om, with seed syllables Hram, Hrim, Hraum, Sah - salutations to the Sun God.`,
    description: 'Powerful Surya seed mantra for health, vitality, and success - removes diseases and darkness'
  },
  {
    title: 'Surya Gayatri Mantra',
    deity: 'Surya',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ भास्कराय विद्महे महादुत्याथिकाराय धीमहि।
तन्नो आदित्यः प्रचोदयात् ॥

Transliteration: Om bhāskarāya vidmahe mahādutyāthikārāya dhīmahi।
Tanno ādityaḥ prachodayāt ॥

Translation: Om, let us meditate on the Sun God who illumines all. Let us contemplate the one with great brilliance. May Aditya inspire and illumine our intellect.`,
    description: 'Surya Gayatri mantra for enlightenment, wisdom, and removing darkness from mind'
  },
  {
    title: 'Surya Mantra for Health and Prosperity',
    deity: 'Surya',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: नमः सूर्याय शान्ताय सर्वरोग निवारिणे।
आयुरारोग्य मैश्वर्यं देहि देवः जगत्पते ॥

Transliteration: Namaḥ sūryāya śāntāya sarvaroga nivāriṇe।
Āyurārogya maiśvaryaṁ dehi devaḥ jagatpate ॥

Translation: Salutations to the peaceful Sun God, who removes all diseases. O Lord of the universe, grant me longevity, health, and prosperity.`,
    description: 'Surya mantra for removing all diseases and gaining longevity, health, and prosperity'
  },
  {
    title: 'Aditya Hridayam Mantra',
    deity: 'Surya',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: आदित्य हृदयं पुण्यं सर्व शत्रु विनाशनम्।
जयावहं जपे नित्यं अक्षयं परमं शिवम् ॥

Transliteration: Āditya hṛdayaṁ puṇyaṁ sarva śatru vināśanam।
Jayāvahaṁ jape nityaṁ akṣayaṁ paramaṁ śivam ॥

Translation: The sacred Aditya Hridayam destroys all enemies, brings victory when chanted daily - it is imperishable, supreme, and auspicious.`,
    description: 'Opening verse of Aditya Hridayam - most powerful Surya stotra for victory, courage, and destroying enemies. Taught by sage Agastya to Lord Rama'
  }
];

async function addSuryaMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    console.log('Adding Surya Mantras:\n');

    for (const mantra of suryaMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Surya Mantras added successfully!');
    console.log(`Total mantras added: ${suryaMantras.length}`);
    console.log('\n12 Surya Namaskar Mantras (in sequence):');
    console.log('1. Om Mitraya Namah → 2. Om Ravaye Namah → 3. Om Suryaya Namah');
    console.log('4. Om Bhanave Namah → 5. Om Khagaya Namah → 6. Om Pushne Namah');
    console.log('7. Om Hiranyagarbhaya Namah → 8. Om Marichaye Namah → 9. Om Adityaya Namah');
    console.log('10. Om Savitre Namah → 11. Om Arkaya Namah → 12. Om Bhaskaraya Namah');
    console.log('\nCorrections made:');
    console.log('- रवये (to Ravi, correct dative, not रावये)');
    console.log('- भानवे (to Bhanu, correct dative)');
    console.log('- पूष्णे (to Pushan, correct dative with ष्)');
    console.log('- हिरण्यगर्भाय (to Hiranyagarbha, proper compound)');
    console.log('- मरीचये (to Marichi, correct dative)');
    console.log('- भास्कराय (to Bhaskara, correct form)');
    console.log('- ह्रां ह्रीं ह्रौं (Hram Hrim Hraum, proper beej syllables)');
    console.log('- महादुत्याथिकाराय (to the one of great brilliance)');
    console.log('- आदित्यः प्रचोदयात् (may Aditya inspire, correct nominative)');
    console.log('- सर्वरोग निवारिणे (to the remover of all diseases)');
    console.log('- आयुरारोग्य मैश्वर्यं (longevity, health, prosperity - proper sandhi)');
    console.log('- आदित्य हृदयं (heart of Aditya, not ह्रुधाय)');
    console.log('- सर्व शत्रु विनाशनम् (destroyer of all enemies)');
    console.log('- जयावहं (bringing victory, correct accusative)');
    console.log('- जपे नित्यं (when chanted daily, proper locative)');
    console.log('- All mantras set to approved status');
    console.log('- Added to Mantra category with "Surya" deity filter');
    console.log('- 12 Surya Namaskar mantras have subCategory "Surya Namaskar"');

    // Verify total count
    const allSurya = await Devotional.find({ deity: 'Surya', category: 'Mantra' });
    const suryaNamaskar = await Devotional.find({ subCategory: 'Surya Namaskar' });
    console.log(`\nTotal Surya mantras in database: ${allSurya.length}`);
    console.log(`Surya Namaskar mantras: ${suryaNamaskar.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Surya mantras:', error);
    process.exit(1);
  }
}

addSuryaMantras();
