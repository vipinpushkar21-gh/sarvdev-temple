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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const shaniMantras = [
  {
    title: 'Shani Mantra For Success',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: ॐ श्री शनिदेवाय नमो नमः।
ॐ श्री शनिदेवाय शान्तिं भव।
ॐ श्री शनिदेवाय शुभं फलम्।
ॐ श्री शनिदेवाय फल प्राप्तिः फलम् ॥

Transliteration: Om Śrī Śanidevaaya namo namaḥ।
Om Śrī Śanidevaaya śaantiṁ bhava।
Om Śrī Śanidevaaya śubhaṁ phalam।
Om Śrī Śanidevaaya phala praaptiḥ phalam ॥

Translation: Om, Salutations to Lord Shani Dev. Om, May Lord Shani bring peace. Om, May Lord Shani grant auspicious results. Om, May Lord Shani grant fruition of desires.`,
    description: 'Shani mantra for success, peace, and auspicious results in life'
  },
  {
    title: 'Shani Maha Mantra (Dhyan Mantra)',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: नीलाञ्जनसमाभासं रविपुत्रं यमाग्रजम्।
छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम् ॥

Transliteration: Nīlāñjana-samābhāsaṁ ravi-putraṁ yamāgrajam।
Chāyā-mārtaṇḍa-sambhūtaṁ taṁ namāmi śanaiścharam ॥

Translation: I bow to Lord Shani, who has the complexion of blue collyrium, who is the son of Surya (Sun) and elder brother of Yama (God of Death), and who is born of Chaya (shadow) and the Sun.`,
    description: 'Main meditation mantra describing Lord Shani\'s divine form and lineage'
  },
  {
    title: 'Shani Beej Mantra',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॥

Transliteration: Om prāṁ prīṁ prauṁ saḥ śanaiścharāya namaḥ ॥

Translation: Om, salutations to Lord Shani with his seed syllables prāṁ prīṁ prauṁ saḥ.`,
    description: 'Powerful seed mantra of Lord Shani for protection and removing obstacles'
  },
  {
    title: 'Shani Gayatri Mantra',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: ॐ काकध्वजाय विद्महे
खड्गहस्ताय धीमहि।
तन्नो मन्दः प्रचोदयात् ॥

Transliteration: Om kākadhvajāya vidmahe
khaḍgahastāya dhīmahi।
Tanno mandaḥ prachodayāt ॥

Translation: Om, Let me meditate on him who has a crow on his flag, let me concentrate on him who has a sword in his hand. May Lord Shani (the slow-moving one) inspire and illumine my mind.`,
    description: 'Gayatri mantra for Lord Shani for wisdom and enlightenment'
  },
  {
    title: 'Shani Moola Mantra',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: ॐ शं शनैश्चराय नमः ॥

Transliteration: Om śaṁ śanaiścharāya namaḥ ॥

Translation: Om, Salutations to Lord Shani, the slow-moving planet.`,
    description: 'Root mantra of Lord Shani for daily worship and protection'
  },
  {
    title: 'Shani Vedic Mantra',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: ॐ शनैश्चराय विद्महे सूर्यपुत्राय धीमहि।
तन्नो मन्दः प्रचोदयात् ॥

Transliteration: Om śanaiścharāya vidmahe sūryaputrāya dhīmahi।
Tanno mandaḥ prachodayāt ॥

Translation: Om, Let us meditate on the slow-moving one (Saturn), let us concentrate on the son of the Sun. May Lord Shani inspire and illumine our minds.`,
    description: 'Vedic mantra for Lord Shani from ancient scriptures'
  },
  {
    title: 'Shani Kavach Mantra',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: दशास्यः शनिदोषाय शङ्करस्य प्रसादतः।
शनैश्चरः प्रसन्नोऽस्तु प्रसीद प्रसीद मे ॥

Transliteration: Daśāsyaḥ śanidoṣāya śaṅkarasya prasādataḥ।
Śanaiścharaḥ prasanno'stu prasīda prasīda me ॥

Translation: By the grace of Lord Shankara (Shiva), may the malefic effects of Shani be removed. May Lord Shani be pleased with me, please be pleased with me.`,
    description: 'Protective mantra invoking Lord Shiva\'s grace to appease Shani'
  },
  {
    title: 'Shani Shanti Mantra',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: ॐ नीलाम्बरः सदा शान्तः करुणापूरितेक्षणः।
शनैश्चरः प्रसीदेत् मे सर्वकार्येषु सर्वदा ॥

Transliteration: Om nīlāmbaraḥ sadā śāntaḥ karuṇāpūritekṣaṇaḥ।
Śanaiścharaḥ prasīdet me sarvakāryeṣu sarvadā ॥

Translation: Om, The one clad in blue who is always peaceful and whose eyes are filled with compassion. May Lord Shani always be pleased with me in all my endeavors.`,
    description: 'Peace mantra to invoke Shani\'s benevolent aspect and compassion'
  },
  {
    title: 'Shani Stotra Mantra',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: कोणस्थः पिंगलो बभ्रुः कृष्णो रौद्रोऽन्तको यमः।
सौरिः शनैश्चरो मन्दः पिप्पलादेन संस्तुतः ॥

Transliteration: Koṇasthaḥ piṅgalo babhruḥ kṛṣṇo raudro'ntako yamaḥ।
Sauriḥ śanaiścharo mandaḥ pippalādena saṁstutaḥ ॥

Translation: He who dwells in the corner, tawny-colored, dark-complexioned, fierce destroyer Yama, son of Surya, slow-moving Saturn - praised by sage Pippalada.`,
    description: 'Hymn listing the nine names and attributes of Lord Shani'
  },
  {
    title: 'Shani Ashtottara (108 Names) Opening',
    deity: 'Shani',
    category: 'Mantra',
    subCategory: 'Navagraha',
    lyrics: `Sanskrit: ॐ शनैश्चराय नमः। ॐ शान्ताय नमः।
ॐ सर्वाभीष्टप्रदाय नमः। ॐ शरण्याय नमः।
ॐ वरेण्याय नमः। ॐ सर्वेशाय नमः।
ॐ सौम्याय नमः। ॐ सुरवन्दिताय नमः ॥

Transliteration: Om śanaiścharāya namaḥ। Om śāntāya namaḥ।
Om sarvābhīṣṭapradāya namaḥ। Om śaraṇyāya namaḥ।
Om vareṇyāya namaḥ। Om sarveśāya namaḥ।
Om saumyāya namaḥ। Om suranditāya namaḥ ॥

Translation: Salutations to the slow-moving one, to the peaceful one, to the giver of all desires, to the refuge-giver, to the most worthy, to the lord of all, to the benevolent one, to the one worshipped by gods.`,
    description: 'Opening verses from the 108 names (Ashtottara Shatanamavali) of Shani'
  }
];

async function addShaniMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const mantra of shaniMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Shani Mantras added successfully!');
    console.log(`Total mantras added: ${shaniMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- नमो नमः (corrected from नमों)');
    console.log('- शान्तिं भव (corrected grammar)');
    console.log('- शुभं फलम् (corrected from शुभम फलः)');
    console.log('- नीलाञ्जन (correct conjunct)');
    console.log('- छायामार्तण्ड (proper compound)');
    console.log('- प्रां प्रीं प्रौं (correct long vowels)');
    console.log('- शं (correct seed syllable)');
    console.log('- Added 5 additional important Shani mantras');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Shani mantras:', error);
    process.exit(1);
  }
}

addShaniMantras();
