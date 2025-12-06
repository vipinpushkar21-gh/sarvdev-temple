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

const shivaMantras = [
  {
    title: 'Atmonnati Rudra Gayatri Mantra',
    description: 'Powerful Gayatri mantra dedicated to Lord Rudra (Shiva). This mantra invokes the supreme consciousness and helps in spiritual advancement and self-realization.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात् ||

Transliteration:
Om Tatpurushaay Vidmahe Mahadevay Dheemahi Tanno Rudrah Prachodayat ||

Translation:
We meditate upon the Supreme Being (Tatpurusha), we contemplate the Great Lord (Mahadeva), may Rudra inspire and guide our intellect.`,
    status: 'approved'
  },
  {
    title: 'Rudra Mantra',
    description: 'Ancient Vedic mantra praising all forms of Lord Rudra - from the gentle to the fierce. This mantra offers salutations to all manifestations of Shiva.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ अघोरेभ्योऽथ घोरेभ्यो घोर घोरतरेभ्यः |
सर्वेभ्यः सर्व सर्वेभ्यो नमस्ते अस्तु रुद्र रूपेभ्यः ||
ॐ नमो भगवते रुद्राय ||

Transliteration:
Om Aghorebhyoath Ghorebhyo Ghor Ghoratrebhyah |
Sarvebhyah Sarv Sarvebhyo Namaste Astu Rudra Rupebhyah ||
Om Namo Bhagavate Rudraay ||

Translation:
Salutations to the non-terrifying forms, the terrifying forms, the most terrifying forms of Rudra. Salutations to all, absolutely all forms of Rudra. Om, salutations to Lord Rudra.`,
    status: 'approved'
  },
  {
    title: 'Tvarit Rudra Mantra',
    description: 'Vedic mantra acknowledging the omnipresence of Lord Rudra - in fire, in water, in herbs, and in all beings. Chanting this brings divine protection.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ यो रुद्रोऽङ्गौ योऽप्सु य ओषधीषु यो रुद्रो विश्वा भुवनानि आविवेश तस्मै रुद्राय नमोऽस्तु ||

Transliteration:
Om Yo Rudroangau Yoapsuy Oshadhishu Yo Rudro Vishvabhuvana-Vivesh Tasmai Rudray Namoastu ||

Translation:
Salutations to Rudra who is present in fire, in water, in herbs, who has entered all the worlds - to that Rudra, our salutations.`,
    status: 'approved'
  },
  {
    title: 'Laghu Mrityunjaya Mantra (Short Form)',
    description: 'Condensed beej (seed) form of the Mahamrityunjaya Mantra. This powerful three-syllable mantra provides protection from untimely death and diseases.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ ह्रौं जूं सः ||

Transliteration:
Om Hraung Jung Sah ||

Translation:
Sacred seed syllables invoking Lord Shiva's protective power against death and suffering.`,
    status: 'approved'
  },
  {
    title: 'Dashakshari Mantra (10-Syllable Mantra)',
    description: 'Ten-syllable protective mantra of Lord Shiva. Chanting this mantra invokes divine protection and blessings for well-being.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ जूं सः मां पालय पालय ||

Transliteration:
Om Jung Sah Mang Paalay-Paalay ||

Translation:
Om, protect me, protect me (O Lord Shiva).`,
    status: 'approved'
  },
  {
    title: 'Dvadashakshari Mantra (12-Syllable Mantra)',
    description: 'Twelve-syllable complete protection mantra. This palindromic mantra creates a protective shield around the devotee.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ जूं सः मां पालय पालय सः जूं ॐ ||

Transliteration:
Om Jung Sah Mang Paalay-Paalay Sah Jung Om ||

Translation:
Om, protect me, protect me, Om - a complete cycle of divine protection.`,
    status: 'approved'
  },
  {
    title: 'Mahamrityunjaya Mantra (Complete Form)',
    description: 'The most powerful mantra from Rigveda, dedicated to Lord Shiva as the conqueror of death. This mantra grants health, wealth, long life, peace, prosperity, and liberation. Also known as the Rudra Mantra or Tryambakam Mantra.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Shiva',
    lyrics: `Sanskrit:
ॐ ह्रौं ॐ जूं सः भूर्भुवः स्वः ॐ त्र्यम्बकम् यजामहे सुगन्धिम् पुष्टिवर्धनम् |
उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात् भूर्भुवः स्वरों जूं सः ह्रौं ॐ ||

Transliteration:
Om Hraung Om Jung Sah Bhurbhuvah Swah Om Tryambakam Yajamahe Sugandhim Pushtivardhanam |
Urvarukamiva Bandhanan Mrityormukshiya Maamritat Bhurbhuvah Swaraung Jung Sah Hraung Om ||

Translation:
We worship the Three-Eyed One (Lord Shiva), who is fragrant and nourishes all beings. May He liberate us from death for the sake of immortality, even as the cucumber is severed from its bondage to the creeper.`,
    status: 'approved'
  }
];

async function addShivaMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding Shiva/Rudra Mantras ---\n');

    for (const mantra of shivaMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 7 Shiva Mantras added successfully!');
    console.log(`Total mantras added: ${shivaMantras.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addShivaMantras();
