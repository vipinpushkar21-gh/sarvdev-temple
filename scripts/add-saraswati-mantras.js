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

const saraswatiMantras = [
  {
    title: 'Saraswati Dhyan Mantra',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ सरस्वती मया दृष्ट्वा वीणा पुस्तक धारिणीम्।
हंस वाहिनी समायुक्ता मां विद्या दान करोतु मे ॐ ॥

Transliteration: Om Sarasvatī mayā dṛṣṭvā vīṇā pustaka dhāriṇīm।
Haṁsa vāhinī samāyuktā māṁ vidyā dāna karotu me om ॥

Translation: Om, I have seen Goddess Saraswati holding the veena and books, riding on a swan. May she grant me the gift of knowledge. Om.`,
    description: 'Meditation mantra for visualizing Goddess Saraswati - invokes her blessings for knowledge and wisdom'
  },
  {
    title: 'Saraswati Beej Mantra 1',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ श्रीं ह्रीं सरस्वत्यै नमः ॥

Transliteration: Om śrīṁ hrīṁ sarasvatyai namaḥ ॥

Translation: Om, with seed syllables Shrim and Hrim, salutations to Goddess Saraswati.`,
    description: 'Powerful seed mantra combining prosperity (Shrim) and divine energy (Hrim) for Saraswati\'s blessings'
  },
  {
    title: 'Saraswati Beej Mantra 2',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं सरस्वत्यै ऐं नमः ॥

Transliteration: Om aiṁ sarasvatyai aiṁ namaḥ ॥

Translation: Om, with the seed syllable Aim, salutations to Goddess Saraswati. Aim.`,
    description: 'Classic Saraswati beej mantra with Aim syllable - most powerful for knowledge, arts, and speech'
  },
  {
    title: 'Saraswati Vidya Mantra (Knowledge Mantra)',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: सरस्वति नमस्तुभ्यं वरदे कामरूपिणि।
विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥

Transliteration: Sarasvati namastubhyaṁ varade kāmarūpiṇi।
Vidyārambhaṁ kariṣyāmi siddhirbhavatu me sadā ॥

Translation: Salutations to you, Goddess Saraswati, the giver of boons who takes any desired form. I am beginning my studies - may I always have success.`,
    description: 'Traditional mantra chanted before starting education or learning - ensures success in studies'
  },
  {
    title: 'Mahasaraswati Mantra',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं महासरस्वत्यै नमः ॥

Transliteration: Om aiṁ mahāsarasvatyai namaḥ ॥

Translation: Om, salutations to Great Goddess Saraswati with the seed syllable Aim.`,
    description: 'Mantra invoking Mahasaraswati, the great form of the goddess for supreme knowledge and wisdom'
  },
  {
    title: 'Saraswati Mantra for Powerful Speech',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: वद वद वाग्वादिनी स्वाहा ॥

Transliteration: Vada vada vāgvādinī svāhā ॥

Translation: Speak, speak, O goddess of speech. Svaha.`,
    description: 'Mantra for gaining powerful, eloquent and proper speech - ideal for speakers, teachers, and writers'
  },
  {
    title: 'Saraswati Mantra for Intelligence',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं ह्रीं श्रीं वाग्देव्यै सरस्वत्यै नमः ॥

Transliteration: Om aiṁ hrīṁ śrīṁ vāgdevyai sarasvatyai namaḥ ॥

Translation: Om, with seed syllables Aim, Hrim, Shrim - salutations to Goddess Saraswati, the deity of speech.`,
    description: 'Powerful mantra for enhancing intelligence, memory, and learning abilities'
  },
  {
    title: 'Saraswati Mantra for Wealth and Knowledge',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ अर्हं मुख कमल वासिनी पापात्म क्षयं कारी वद वद वाग्वादिनी सरस्वति ऐं ह्रीं नमः स्वाहा ॥

Transliteration: Om arhaṁ mukha kamala vāsinī pāpātma kṣayaṁ kārī vada vada vāgvādinī sarasvati aiṁ hrīṁ namaḥ svāhā ॥

Translation: Om, worthy one, who resides in the lotus of the face, destroyer of sins and ego, speak speak O goddess of speech Saraswati, Aim Hrim, salutations, Svaha.`,
    description: 'Combined mantra for both material prosperity and spiritual knowledge - removes sins and grants eloquence'
  },
  {
    title: 'Saraswati Vandana',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।
या ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा पूजिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा ॥

Transliteration: Yā kundendu tuṣārahāra dhavalā yā śubhravasstrāvṛtā
Yā vīṇāvaradaṇḍamaṇḍitakarā yā śvetapadmāsanā।
Yā brahmācyuta śaṅkara prabhṛtibhir devaiḥ sadā pūjitā
Sā māṁ pātu sarasvatī bhagavatī niḥśeṣa jāḍyāpahā ॥

Translation: She who is white as jasmine, moon, snow, and pearl necklace; who is dressed in white clothes; whose hands are adorned with veena and staff; who is seated on white lotus; who is always worshipped by Brahma, Vishnu, Shankara and other deities - may that Goddess Saraswati protect me and remove all my ignorance.`,
    description: 'Famous Saraswati Vandana praising the goddess\'s divine form - removes ignorance and grants wisdom'
  },
  {
    title: 'Saraswati Mantra for Knowledge 2',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: सरस्वति महाभागे विद्ये कमललोचने।
विश्वरूपे विशालाक्षि विद्यां देहि नमोऽस्तुते ॥

Transliteration: Sarasvati mahābhāge vidye kamalalochane।
Viśvarūpe viśālākṣi vidyāṁ dehi namo'stute ॥

Translation: O Goddess Saraswati, most fortunate one, O embodiment of knowledge with lotus eyes, O universal form, O large-eyed one, grant me knowledge. Salutations to you.`,
    description: 'Prayer to Goddess Saraswati specifically requesting the gift of knowledge and learning'
  },
  {
    title: 'Saraswati Puranokta Mantra',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: या देवी सर्वभूतेषु विद्यारूपेण संस्थिता।
नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥

Transliteration: Yā devī sarvabhūteṣu vidyārūpeṇa saṁsthitā।
Namastasyai namastasyai namastasyai namo namaḥ ॥

Translation: To the Goddess who resides in all beings in the form of knowledge - salutations to her, salutations to her, salutations to her, salutations again and again.`,
    description: 'Puranic mantra recognizing Saraswati as the divine knowledge present in all beings'
  },
  {
    title: 'Saraswati Mantra for Illumination',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: महो अर्णः सरस्वती प्रचेतयति केतुना।
धियो विश्वा विराजति ॥

Transliteration: Maho arṇaḥ sarasvatī prachetayati ketunā।
Dhiyo viśvā virājati ॥

Translation: The great and vast Saraswati illuminates with her flag/banner. She illumines all thoughts and makes them shine.`,
    description: 'Vedic mantra for spiritual illumination and enlightenment through Saraswati\'s grace'
  },
  {
    title: 'Saraswati Gayatri Mantra',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ वागीश्वर्यै विद्महे वाग्वादिन्यै धीमहे।
तन्नः सरस्वती प्रचोदयात् ॥

Transliteration: Om vāgīśvaryai vidmahe vāgvādinyai dhīmahe।
Tannaḥ sarasvatī prachodayāt ॥

Translation: Om, let us meditate on the goddess of speech, let us concentrate on the one who speaks. May Goddess Saraswati inspire and illumine our minds.`,
    description: 'Gayatri mantra dedicated to Saraswati for intellectual and spiritual enlightenment'
  },
  {
    title: 'Saraswati Ekakshar Mantra (One Syllable)',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ऐं ॥

Transliteration: Aiṁ ॥

Translation: Aim (the seed syllable of Saraswati).`,
    description: 'Single syllable seed mantra - most condensed and powerful form of Saraswati mantra'
  },
  {
    title: 'Saraswati Dvyakshar Mantra (Two Syllables)',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ऐं ल्रीं ॥

Transliteration: Aiṁ lrīṁ ॥

Translation: Aim Lrim (seed syllables for knowledge and divine play).`,
    description: 'Two syllable mantra combining knowledge (Aim) with divine play (Lrim)'
  },
  {
    title: 'Saraswati Tryakshar Mantra (Three Syllables)',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ऐं रुं सौं ॥

Transliteration: Aiṁ ruṁ sauṁ ॥

Translation: Aim Rum Saum (three seed syllables).`,
    description: 'Three syllable seed mantra for complete blessings of knowledge, energy, and cosmic consciousness'
  },
  {
    title: 'Saraswati Mantra - Om Aim Kleem Sauh',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं क्लीं सौः ॥

Transliteration: Om aiṁ klīṁ sauḥ ॥

Translation: Om Aim Kleem Sauh (combining seed syllables for knowledge, attraction, and cosmic energy).`,
    description: 'Powerful combination mantra for knowledge, creativity, and spiritual attraction'
  },
  {
    title: 'Saraswati Mantra - Om Aim Namah',
    deity: 'Saraswati',
    category: 'Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं नमः ॥

Transliteration: Om aiṁ namaḥ ॥

Translation: Om, salutations with the seed syllable Aim.`,
    description: 'Simple yet effective mantra for daily worship of Goddess Saraswati'
  }
];

async function addSaraswatiMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of saraswatiMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Saraswati Mantras added successfully!');
    console.log(`Total mantras added: ${saraswatiMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- धारिणीम् (correct feminine accusative, not धारणीम्)');
    console.log('- विश्वरूपे (universal form, not विद्यारूपे in that context)');
    console.log('- विशालाक्षि (large-eyed, correct form)');
    console.log('- वाग्वादिनी (goddess of speech, proper compound)');
    console.log('- शङ्करप्रभृतिभिः (by Shankara and others, correct instrumental)');
    console.log('- प्रचेतयति (illuminates, correct Vedic form)');
    console.log('- वाग्वादिन्यै (to the speaker, correct dative)');
    console.log('- ल्रीं (Lrim seed syllable, proper form)');
    console.log('- All mantras set to approved status');
    console.log('- Added to Mantra category with Saraswati deity filter');

    // Verify total count
    const allSaraswati = await Devotional.find({ deity: 'Saraswati', category: 'Mantra' });
    console.log(`\nTotal Saraswati mantras in database: ${allSaraswati.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Saraswati mantras:', error);
    process.exit(1);
  }
}

addSaraswatiMantras();
