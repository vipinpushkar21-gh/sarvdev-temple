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

const katyayaniMantras = [
  {
    title: 'Katyayani Mantra for Marriage',
    deity: 'Katyayani',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: कात्यायनि महामाये महायोगिन्यधीश्वरि।
नन्दगोपसुतं देवि पतिं मे कुरु ते नमः ॥

Transliteration: Kātyāyani mahāmāye mahāyoginy adhīśvari।
Nandagopasutaṁ devi patiṁ me kuru te namaḥ ॥

Translation: O Goddess Katyayani, O great illusion, O great yogini, O supreme ruler, O Devi, please make the son of Nanda Gopa (Lord Krishna) my husband. I bow to you.`,
    description: 'Sacred mantra chanted by Gopis to obtain Lord Krishna as husband. Goddess Katyayani, the sixth form of Navdurga, blesses devotees with ideal life partners.'
  },
  {
    title: 'Katyayani Beej Mantra',
    deity: 'Katyayani',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं कात्यायन्यै स्वाहा ॥

Transliteration: Om hrīṁ kātyāyanyai svāhā ॥

Translation: Om, with the seed syllable Hrim, salutations to Goddess Katyayani. Svaha.`,
    description: 'Simple yet powerful beej (seed) mantra of Goddess Katyayani for quick blessings'
  },
  {
    title: 'Katyayani Maha Mantra',
    deity: 'Katyayani',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं श्रीं कात्यायन्यै स्वाहा ॥

Transliteration: Om hrīṁ śrīṁ kātyāyanyai svāhā ॥

Translation: Om, with the seed syllables Hrim and Shrim, salutations to Goddess Katyayani. Svaha.`,
    description: 'Great mantra combining prosperity (Shrim) with divine energy (Hrim) for complete blessings of Katyayani'
  },
  {
    title: 'Katyayani Dhyan Mantra',
    deity: 'Katyayani',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: चन्द्रहासोज्ज्वलकरा शार्दूलवरवाहना।
कात्यायनी शुभं दद्याद् देवी दानवघातिनी ॥

Transliteration: Chandrahāsojjvalakarā śārdūlavaravāhanā।
Kātyāyanī śubhaṁ dadyād devī dānavaghātinī ॥

Translation: She whose hands shine with a curved sword, who rides on the excellent lion - may Goddess Katyayani, the destroyer of demons, bestow auspiciousness upon us.`,
    description: 'Meditation mantra describing the divine form of Katyayani for visualization during worship'
  },
  {
    title: 'Katyayani Gayatri Mantra',
    deity: 'Katyayani',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: ॐ कात्यायन्यै विद्महे कन्याकुमार्यै धीमहि।
तन्नो दुर्गिः प्रचोदयात् ॥

Transliteration: Om kātyāyanyai vidmahe kanyākumāryai dhīmahi।
Tanno durgiḥ prachodayāt ॥

Translation: Om, let us meditate on Goddess Katyayani, let us concentrate on the maiden goddess. May Durga inspire and illumine our minds.`,
    description: 'Gayatri mantra dedicated to Katyayani for spiritual enlightenment and divine grace'
  },
  {
    title: 'Parvati Beej Mantra',
    deity: 'Parvati',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं पार्वत्यै नमः ॥

Transliteration: Om hrīṁ pārvatyai namaḥ ॥

Translation: Om, salutations to Goddess Parvati with the seed syllable Hrim.`,
    description: 'Seed mantra of Goddess Parvati, the divine consort of Lord Shiva and mother of the universe'
  },
  {
    title: 'Parvati Mantra for Marriage',
    deity: 'Parvati',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: ॐ गौरी शङ्करार्धाङ्गी यथा वै शङ्करप्रिया।
तथा मां कुरु कल्याणि कान्तकान्तां सुदुर्लभाम् ॥

Transliteration: Om gaurī śaṅkarārdhāṅgī yathā vai śaṅkarapriyā।
Tathā māṁ kuru kalyāṇi kāntakāntāṁ sudurlabhām ॥

Translation: O Gauri, who forms half the body of Shankara, just as you are dear to Shiva, O auspicious one, make me also extremely dear to my beloved.`,
    description: 'Parvati mantra for obtaining an ideal life partner and harmonious married life'
  },
  {
    title: 'Parvati Dhyan Mantra',
    deity: 'Parvati',
    category: 'Katyayani',
    status: 'approved',
    lyrics: `Sanskrit: वन्दे शम्भोः कलत्रं भवानीं भवसागरतारिणीम्।
भुजैश्चतुर्भिः सुविलसद्रत्नाभरणभूषिताम् ॥

Transliteration: Vande śambhoḥ kalatraṁ bhavānīṁ bhavasāgaratāriṇīm।
Bhujaiśchaturbhiḥ suvilasadratnābharaṇabhūṣitām ॥

Translation: I bow to the consort of Shambhu (Shiva), Goddess Bhavani, who helps us cross the ocean of worldly existence, who possesses four arms adorned with beautiful jeweled ornaments.`,
    description: 'Meditation mantra on the divine form of Parvati/Bhavani for spiritual liberation'
  }
];

async function addKatyayaniMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of katyayaniMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Katyayani & Parvati Mantras added successfully!');
    console.log(`Total mantras added: ${katyayaniMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- नन्दगोपसुतं (proper compound, not नन्द गोपसुतं)');
    console.log('- कात्यायन्यै (correct dative case)');
    console.log('- पार्वत्यै (correct dative ending)');
    console.log('- शङ्करार्धाङ्गी (Shankara\'s half-body, proper compound)');
    console.log('- भवसागरतारिणीम् (liberator from ocean of existence)');
    console.log('- All mantras set to approved status');
    console.log('- Created new "Katyayani" category');

    // Verify total count
    const allKatyayani = await Devotional.find({ category: 'Katyayani' });
    console.log(`\nTotal Katyayani mantras in database: ${allKatyayani.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Katyayani mantras:', error);
    process.exit(1);
  }
}

addKatyayaniMantras();
