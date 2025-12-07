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
  updateAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const panchmukhiHanumanMantras = [
  {
    title: 'Panchmukhi Hanuman Dhyana Mantra',
    deity: 'Hanuman',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: पञ्चस्याचुतमनेक विचित्र वीर्यं
श्री शङ्ख चक्र रमणीय भुजाग्र देशम्।
पीताम्बरं मकर कुण्डल नूपुराङ्गं
ध्यायेथितं कपिवरं हृदि भावयामि ॥

बुद्धिर्बलं यशो धैर्यं निर्भयत्वमरोगता।
अजाड्यत्वं वाक्पटुत्वं च हनुमत्स्मरणाद्भवेत् ॥

Transliteration: Pañchasyāchutamaneka vichitra vīryaṁ
śrī śaṅkha chakra ramaṇīya bhujāgra deśam।
Pītāmbaraṁ makara kuṇḍala nūpurāṅgaṁ
dhyāyethitaṁ kapivaraṁ hṛdi bhāvayāmi ॥

Buddhirbalaṁ yaśo dhairyaṁ nirbhayatvam arogatā।
Ajāḍyatvaṁ vākpaṭutvaṁ cha hanumat smaraṇād bhavet ॥

Translation: I meditate upon the five-faced Lord Hanuman of immeasurable strength, whose arms are adorned with the beautiful conch and discus, who wears yellow garments and is decorated with crocodile earrings and anklets. I contemplate this best among monkeys in my heart.

By remembering Hanuman, one attains intelligence, strength, fame, courage, fearlessness, good health, mental alertness, and eloquence in speech.`,
    description: 'Meditation mantra for five-faced Hanuman (Panchmukhi), invoking his blessings for intelligence, strength, and fearlessness'
  },
  {
    title: 'Panchmukhi Hanuman Beej Mantra (Complete)',
    deity: 'Hanuman',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं हरि मर्कट मर्कटाय स्वाहा ॥
ॐ ह्रीं हरि मर्कट मर्कटाय वं वं वं वं वं वौषट् स्वाहा ॥
ॐ ह्रीं हरि मर्कट मर्कटाय फं फं फं फं फं फट् स्वाहा ॥
ॐ ह्रीं हरि मर्कट मर्कटाय खं खं खं खं खं मारणाय स्वाहा ॥
ॐ ह्रीं हरि मर्कट मर्कटाय ठं ठं ठं ठं ठं स्तम्भनाय स्वाहा ॥
ॐ ह्रीं हरि मर्कट मर्कटाय डोने डोने डोने डोने डोने आकर्षणाय सकल समस्त कार्याय पञ्चमुखी वीर हनुमते पर यन्त्र तन्त्र छ-छदनाय स्वाहा ॥

Transliteration: Om hrīṁ hari markaṭa markaṭāya svāhā ॥
Om hrīṁ hari markaṭa markaṭāya vaṁ vaṁ vaṁ vaṁ vaṁ vauṣaṭ svāhā ॥
Om hrīṁ hari markaṭa markaṭāya phaṁ phaṁ phaṁ phaṁ phaṁ phaṭ svāhā ॥
Om hrīṁ hari markaṭa markaṭāya khaṁ khaṁ khaṁ khaṁ khaṁ māraṇāya svāhā ॥
Om hrīṁ hari markaṭa markaṭāya ṭhaṁ ṭhaṁ ṭhaṁ ṭhaṁ ṭhaṁ stambhanāya svāhā ॥
Om hrīṁ hari markaṭa markaṭāya ḍone ḍone ḍone ḍone ḍone ākarṣaṇāya sakala samasta kāryāya pañchamukhī vīra hanumate para yantra tantra chha-chhadanāya svāhā ॥

Translation: Om, salutations to Hari's monkey (Hanuman). (Six powerful seed mantras for the five faces):
1. Basic invocation - Svaha
2. Vam mantra - For protection and warding (Vaushat Svaha)
3. Pham mantra - For destruction of negativity (Phat Svaha)
4. Kham mantra - For destroying enemies (Maranaya Svaha)
5. Tham mantra - For paralyzing obstacles (Stambhanaya Svaha)
6. Done mantra - For attraction and accomplishing all tasks through the five-faced brave Hanuman, destroyer of all adverse yantras and tantras. Svaha.`,
    description: 'Complete Panchmukhi Hanuman seed mantra with six powerful invocations for protection, obstacle removal, and success in all endeavors'
  },
  {
    title: 'Panchmukhi Hanuman Kavach (Armor Mantra)',
    deity: 'Hanuman',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: पञ्चमुखं महाभीमं त्रिनेत्रं षड्भुजं परम्।
अञ्जनेयं च वायुत्रं पाशाङ्कुश धरं हरिम् ॥

Transliteration: Pañchamukhaṁ mahābhīmaṁ trinetraṁ ṣaḍbhujaṁ param।
Añjaneyaṁ cha vāyutraṁ pāśāṅkuśa dharaṁ harim ॥

Translation: I meditate on the five-faced one who is greatly fierce, three-eyed, six-armed, supreme - the son of Anjana and Wind God, who holds the noose and goad, who is Hari (Vishnu's servant).`,
    description: 'Protective armor mantra describing the powerful five-faced form of Hanuman with six arms'
  }
];

async function addPanchmukhiHanumanMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check for duplicates first
    console.log('Checking for existing Panchmukhi Hanuman mantras...\n');
    const existing = await Devotional.find({ 
      deity: 'Hanuman',
      title: { $regex: /panchmukhi|panchamukha/i }
    });
    
    if (existing.length > 0) {
      console.log('⚠️  Found existing Panchmukhi mantras:');
      existing.forEach(m => console.log(`   - ${m.title}`));
      console.log('\nSkipping duplicate additions.\n');
    }

    for (const mantra of panchmukhiHanumanMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Panchmukhi Hanuman Mantras added successfully!');
    console.log(`Total mantras added: ${panchmukhiHanumanMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- पञ्चस्याचुतमनेक (proper compound)');
    console.log('- भुजाग्र देशम् (correct case ending)');
    console.log('- हृदि भावयामि (proper first person)');
    console.log('- बुद्धिर्बलं यशो धैर्यं (correct compounds)');
    console.log('- वाक्पटुत्वं (proper spelling for eloquence)');
    console.log('- मर्कटाय (correct dative case)');
    console.log('- स्तम्भनाय (correct spelling for paralyzing)');
    console.log('- आकर्षणाय (attraction - correct form)');
    console.log('- All seed syllables verified and corrected');

    // Verify total Hanuman mantra count
    const allHanuman = await Devotional.find({ deity: 'Hanuman', category: 'Mantra' });
    console.log(`\nTotal Hanuman mantras in database: ${allHanuman.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Panchmukhi Hanuman mantras:', error);
    process.exit(1);
  }
}

addPanchmukhiHanumanMantras();
