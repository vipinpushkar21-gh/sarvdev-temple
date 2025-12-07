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

const kuberMantras = [
  {
    title: 'Shri Kubera Mantra (Main Wealth Mantra)',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये।
धनधान्यसमृद्धिं मे देहि दापय स्वाहा ॥

Transliteration: Om yakṣāya kuberāya vaiśravaṇāya dhanadhānyādhipataye।
Dhanadhānyasamṛddhiṁ me dehi dāpaya svāhā ॥

Translation: Om, to the Yaksha Kubera, also known as Vaishravana, the lord of wealth and grains - grant me abundance of wealth and grains, bestow this upon me. Svaha.`,
    description: 'Primary mantra of Lord Kubera, the treasurer of the gods, for attracting wealth and prosperity'
  },
  {
    title: 'Kubera Dhana Prapti Mantra (Wealth Acquisition)',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ श्रीं ह्रीं क्लीं श्रीं क्लीं वित्तेश्वराय नमः ॥

Transliteration: Om śrīṁ hrīṁ klīṁ śrīṁ klīṁ vitteśvarāya namaḥ ॥

Translation: Om, with the seed syllables Shrim, Hrim, and Klim, salutations to the Lord of Wealth (Kubera).`,
    description: 'Powerful beej mantra for quick acquisition of wealth and financial success'
  },
  {
    title: 'Lakshmi-Kubera Combined Mantra',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं श्रीं क्रीं श्रीं कुबेराय अष्टलक्ष्मी मम गृहे धनं पूरय पूरय नमः ॥

Transliteration: Om hrīṁ śrīṁ krīṁ śrīṁ kuberāya aṣṭalakṣmī mama gṛhe dhanaṁ pūraya pūraya namaḥ ॥

Translation: Om, O Kubera and the eight forms of Lakshmi, fill my home with wealth, fill it abundantly. Salutations.`,
    description: 'Combined invocation of Kubera and Ashta Lakshmi for complete prosperity in home and life'
  },
  {
    title: 'Kubera Gayatri Mantra',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ यक्षराजाय विद्महे अलकाधीशाय धीमहि।
तन्नो कुबेरः प्रचोदयात् ॥

Transliteration: Om yakṣarājāya vidmahe alakādhīśāya dhīmahi।
Tanno kuberaḥ prachodayāt ॥

Translation: Om, Let us meditate on the king of Yakshas, let us concentrate on the lord of Alaka (Kubera's celestial city). May Lord Kubera inspire and illumine our minds.`,
    description: 'Gayatri mantra for Lord Kubera for wisdom in wealth management and prosperity'
  },
  {
    title: 'Kubera Beej Mantra',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ श्रीं ॐ ह्रीं क्लीं श्रीं क्लीं कुबेराय नमः ॥

Transliteration: Om śrīṁ om hrīṁ klīṁ śrīṁ klīṁ kuberāya namaḥ ॥

Translation: Om Shrim, Om Hrim Klim Shrim Klim, salutations to Kubera.`,
    description: 'Simple seed mantra with powerful vibrations for invoking Kubera\'s blessings'
  },
  {
    title: 'Kubera Moola Mantra',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ यं कुबेराय नमः ॥

Transliteration: Om yaṁ kuberāya namaḥ ॥

Translation: Om Yam, salutations to Lord Kubera.`,
    description: 'Root mantra of Kubera with his seed syllable "Yam" for daily worship'
  },
  {
    title: 'Kubera Dhana Vriddhi Mantra (Wealth Multiplication)',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं श्रीं क्रीं श्रीं कुबेराय नमः।
धनं मे आगच्छ आगच्छ स्वाहा ॥

Transliteration: Om hrīṁ śrīṁ krīṁ śrīṁ kuberāya namaḥ।
Dhanaṁ me āgachchha āgachchha svāhā ॥

Translation: Om, salutations to Kubera. May wealth come to me, come to me. Svaha.`,
    description: 'Mantra for multiplying wealth and attracting continuous flow of prosperity'
  },
  {
    title: 'Kubera Ashta Lakshmi Mantra',
    deity: 'Kuber',
    category: 'Kuber',
    status: 'approved',
    lyrics: `Sanskrit: ॐ श्रीं ह्रीं क्लीं श्रीं क्लीं वित्तेश्वराय नमः।
ॐ श्रीं महालक्ष्म्यै च विद्महे कुबेराय च धीमहि।
तन्नो धनः प्रचोदयात् ॥

Transliteration: Om śrīṁ hrīṁ klīṁ śrīṁ klīṁ vitteśvarāya namaḥ।
Om śrīṁ mahālakṣmyai cha vidmahe kuberāya cha dhīmahi।
Tanno dhanaḥ prachodayāt ॥

Translation: Om, salutations to the Lord of Wealth. Om, Let us meditate on Mahalakshmi and Kubera together. May wealth inspire and bless us.`,
    description: 'Combined mantra invoking both Kubera and Mahalakshmi for eight forms of wealth'
  }
];

async function addKuberMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of kuberMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Kubera Mantras added successfully!');
    console.log(`Total mantras added: ${kuberMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- धनधान्याधिपतये (proper compound and case)');
    console.log('- वैश्रवणाय (correct spelling of Vaishravana)');
    console.log('- वित्तेश्वराय (Lord of Wealth - correct form)');
    console.log('- अष्टलक्ष्मी (corrected from अष्ट-लक्ष्मी)');
    console.log('- पूरय पूरय (correct imperative form)');
    console.log('- आगच्छ (proper Sanskrit verb form)');
    console.log('- All mantras set to approved status');
    console.log('- Created new "Kuber" category');

    // Verify total count
    const allKuber = await Devotional.find({ category: 'Kuber' });
    console.log(`\nTotal Kuber mantras in database: ${allKuber.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Kuber mantras:', error);
    process.exit(1);
  }
}

addKuberMantras();
