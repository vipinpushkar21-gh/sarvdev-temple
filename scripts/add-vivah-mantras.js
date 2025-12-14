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

const vivahMantras = [
  {
    title: 'Vivah Hetu Mantra - Katyayani (Marriage Mantra 1)',
    deity: 'Katyayani',
    category: 'Vivah',
    status: 'approved',
    lyrics: `Sanskrit: ॐ कात्यायनि महामाये महायोगिन्यधीश्वरि।
नन्दगोपसुतं देवि पतिं मे कुरु ते नमः ॥

Transliteration: Om kātyāyani mahāmāye mahāyoginy adhīśvari।
Nandagopasutaṁ devi patiṁ me kuru te namaḥ ॥

Translation: O Goddess Katyayani, O great illusion, O great yogini, O supreme ruler, O Devi, please make the son of Nanda Gopa (Lord Krishna) my husband. I bow to you.`,
    description: 'Sacred Katyayani mantra for marriage - chanted by Gopis to obtain Lord Krishna. Helps in finding ideal life partner and removing marriage obstacles.'
  },
  {
    title: 'Gauri Shankar Mantra for Marriage',
    deity: 'Parvati',
    category: 'Vivah',
    status: 'approved',
    lyrics: `Sanskrit: हे गौरी शङ्कराराधाङ्गिनि यथा त्वं शङ्करप्रिया।
तथा मां कुरु कल्याणि कान्तकान्तां सुदुर्लभाम् ॥

Transliteration: He gaurī śaṅkarārdhāṅgini yathā tvaṁ śaṅkarapriyā।
Tathā māṁ kuru kalyāṇi kāntakāntāṁ sudurlabhām ॥

Translation: O Gauri, who forms half the body of Shankara, just as you are extremely dear to Lord Shiva, O auspicious one, make me also very dear to my beloved.`,
    description: 'Powerful Gauri-Shankar mantra invoking the divine couple for harmonious marriage and conjugal bliss'
  },
  {
    title: 'Vivah Hetu Mantra - Indrani (Marriage Mantra 3)',
    deity: 'Indrani',
    category: 'Vivah',
    status: 'approved',
    lyrics: `Sanskrit: ॐ देवेन्द्राणि नमस्तुभ्यं देवेन्द्रप्रिय भामिनि।
विवाहं भाग्यमारोग्यं शीघ्रं च देहि मे ॥

Transliteration: Om devendrāṇi namastubhyaṁ devendrapriya bhāmini।
Vivāhaṁ bhāgyamārogyaṁ śīghraṁ cha dehi me ॥

Translation: Om, salutations to you, O Indrani (wife of Indra), O beloved consort of Indra, please grant me marriage, fortune, and good health quickly.`,
    description: 'Mantra to Goddess Indrani for quick marriage, good fortune, and health'
  },
  {
    title: 'Vivah Hetu Mantra - Shankara (Marriage Mantra 4)',
    deity: 'Shiva',
    category: 'Vivah',
    status: 'approved',
    lyrics: `Sanskrit: ॐ शं शङ्कराय सकल जन्मार्जित पाप विध्वंसनाय पुरुषार्थ चतुष्टय लाभाय च पतिं मे देहि कुरु-कुरु स्वाहा ॥

Transliteration: Om śaṁ śaṅkarāya sakala janmārjita pāpa vidhvaṁsanāya puruṣārtha chatuṣṭaya lābhāya cha patiṁ me dehi kuru-kuru svāhā ॥

Translation: Om, to Lord Shankara who destroys all sins accumulated over births, for attaining the four goals of human life (dharma, artha, kama, moksha), please grant me a husband. Do it, do it. Svaha.`,
    description: 'Shankara mantra for marriage that also removes past karmic obstacles and grants the four purusharthas'
  },
  {
    title: 'Surya Mantra for Delayed Marriage',
    deity: 'Surya',
    category: 'Vivah',
    status: 'approved',
    lyrics: `Sanskrit: ॐ देवेन्द्राणि नमस्तुभ्यं देवेन्द्रप्रिय भामिनि।
विवाहं भाग्यमारोग्यं शीघ्रलाभं च देहि मे ॥

Transliteration: Om devendrāṇi namastubhyaṁ devendrapriya bhāmini।
Vivāhaṁ bhāgyamārogyaṁ śīghralābhaṁ cha dehi me ॥

Translation: Om, salutations to you, O Indrani, beloved of Indra, please grant me marriage, fortune, good health, and quick attainment.`,
    description: 'Powerful mantra for those facing delays in marriage - removes obstacles and brings swift results'
  },
  {
    title: 'Uma Maheshwara Vivah Mantra',
    deity: 'Parvati',
    category: 'Vivah',
    status: 'approved',
    lyrics: `Sanskrit: ॐ उमायै नमः। ॐ महेश्वराय नमः।
उमा-महेश्वर विवाहं कुरु कुरु स्वाहा ॥

Transliteration: Om umāyai namaḥ। Om maheśvarāya namaḥ।
Umā-maheśvara vivāhaṁ kuru kuru svāhā ॥

Translation: Om, salutations to Uma. Om, salutations to Maheshwara (Shiva). Bless me with a marriage like that of Uma and Maheshwara. Do it, do it. Svaha.`,
    description: 'Mantra invoking the sacred union of Uma (Parvati) and Maheshwara (Shiva) for blessed marriage'
  },
  {
    title: 'Swayamvara Parvati Mantra',
    deity: 'Parvati',
    category: 'Vivah',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ह्रीं योगिनी योगिनी योगेश्वरी योग भयंकरी सर्व कामसमोहनी ममवशं कुरु कुरु स्वाहा॥

Transliteration: Om hrīṁ yoginī yoginī yogeśvarī yoga bhayaṅkarī sarva kāmasamohanī mamavaśaṁ kuru kuru svāhā॥

Translation: Om Hrim, O Yogini, Yogini, supreme goddess of yoga, fearsome in yoga, who enchants all desires - bring under my control, do it, do it. Svaha.`,
    description: 'Swayamvara Parvati mantra for attracting the right life partner and successful marriage'
  }
];

async function addVivahMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of vivahMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Vivah (Marriage) Mantras added successfully!');
    console.log(`Total mantras added: ${vivahMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- शङ्कराराधाङ्गिनि (Shankara\'s half-body, proper form)');
    console.log('- सुदुर्लभाम् (very rare/precious, correct case)');
    console.log('- देवेन्द्राणि (Indrani - correct form)');
    console.log('- विध्वंसनाय (for destruction, proper dative)');
    console.log('- पुरुषार्थ चतुष्टय (four purusharthas)');
    console.log('- शीघ्रलाभं (quick attainment)');
    console.log('- योगेश्वरी (supreme goddess of yoga)');
    console.log('- All mantras set to approved status');
    console.log('- Created new "Vivah" (Marriage) category');

    // Verify total count
    const allVivah = await Devotional.find({ category: 'Vivah' });
    console.log(`\nTotal Vivah mantras in database: ${allVivah.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Vivah mantras:', error);
    process.exit(1);
  }
}

addVivahMantras();
