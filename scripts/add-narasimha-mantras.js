const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

// Devotional Schema
const devotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deity: { type: String, required: true },
  category: { type: String, required: true },
  lyrics: { type: String, required: true },
  audioUrl: String,
  description: String,
  subCategory: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', devotionalSchema);

const narasimhaMantras = [
  {
    title: 'Narasimha Maha Mantra',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ ह्रीं क्षौं उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्।
नृसिंहं भीषणं भद्रं मृत्योर्मृत्युं नमाम्यहम् ॥

Transliteration: Om hrīṁ kṣauṁ ugraṁ vīraṁ mahāviṣṇuṁ jvalantaṁ sarvatomukham।
Nṛsiṁhaṁ bhīṣaṇaṁ bhadraṁ mṛtyormṛtyuṁ namāmyaham ॥

Translation: Om, I bow to Lord Narasimha who is fierce and heroic like Lord Vishnu, who is radiant and has faces in all directions. He is terrifying to the wicked, auspicious to devotees, and is the death of death itself.`,
    description: 'The great mantra of Lord Narasimha, powerful for protection and removing fear'
  },
  {
    title: 'Narasimha Pranama Prayer',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit: नमस्ते नरसिंहाय प्रह्लादाह्लाददायिने।
हिरण्यकशिपोर्वक्षः शिलातङ्कनखालये ॥

Transliteration: Namaste narasiṁhāya prahlādāhlādadāyine।
Hiraṇyakaśiporvakṣaḥ śilātaṅkanakhālaye ॥

Translation: My salutations to Lord Narasimha who is the giver of joy to Prahlada, and whose nails tore the chest of Hiranyakashipu as though it was a stone.`,
    description: 'Prayer offering salutations to Lord Narasimha, the protector of devotee Prahlada'
  },
  {
    title: 'Dasavatara Stotra - Narasimha',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit: तव करकमलवरे नखमद्भुतशृङ्गं
दलितहिरण्यकशिपुतनुभृङ्गम्।
केशव धृतनरहरिरूप जय जगदीश हरे ॥

Transliteration: Tava karakamala-vare nakham adbhuta-śṛṅgaṁ
dalita-hiraṇyakaśipu-tanu-bhṛṅgam।
Keśava dhṛta-narahari-rūpa jaya jagadīśa hare ॥

Translation: O Keshava! O Lord of the universe! O Lord Hari, who have assumed the form of half-man, half-lion! All glories to You! Your nails are like wonderful horns that have ripped apart the wasp-like body of Hiranyakashipu.`,
    description: 'Verse from Dasavatara Stotra by Jayadeva, glorifying Narasimha avatar'
  },
  {
    title: 'Kamasikashtakam - Verse 1',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit: त्वयि रक्षति रक्षकैः किमन्यैः
त्वयि चरक्षति रक्षकैः किमन्यैः।
इति निश्चितधीः श्रयामि नित्यं
नृहरे वेगवति तटाश्रयं त्वाम् ॥

Transliteration: Tvayi rakṣati rakṣakaiḥ kimanyaiḥ
tvayi ca arakṣati rakṣakaiḥ kimanyaiḥ।
Iti niścita-dhīḥ śrayāmi nityaṁ
nṛhare vegavati taṭāśrayaṁ tvām ॥

Translation: When You protect, what is the need of other protectors? And when You do not protect, what can other protectors do? With this firm conviction, O Lord Narasimha who resides on the banks of river Vegavati, I always take shelter of You.`,
    description: 'First verse of Kamasikashtakam, expressing complete surrender to Lord Narasimha'
  },
  {
    title: 'Divya Prabandham - Narasimha',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit (Tamil): ஆதி ஆதி அகம் கரைந்து இசை பாடி பாடிக் கண்ணீர் மல்கி எங்கும் நாடி நாடி நரசிங்க என்று
வாடி வாடும் இவ்வல்லி நூதலே ॥

Transliteration: Ādi ādi agam karaindhu isai pāḍi pāḍik kaṇṇīr malgi eṅgum nāḍi nāḍi narasiṅga endru
vāḍi vāḍum ivvalli nūtalē ॥

Translation: My heart melts, I sing Your praises repeatedly with tears streaming down, searching everywhere, calling out "Narasimha! Narasimha!" - this is the forehead of this devoted creeper (devotee) that withers in separation.`,
    description: 'Verse from Divya Prabandham (Tamil Vaishnava scripture) expressing devotion to Narasimha'
  },
  {
    title: 'Narasimha Gayatri Mantra',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ नृसिंहाय विद्महे वज्रनखाय धीमहि तन्नो सिंहः प्रचोदयात्।
वज्र नखाय विद्महे तीक्ष्ण दंष्ट्राय धीमहि तन्नो नरसिंहः प्रचोदयात् ॥

Transliteration: Om nṛsiṁhāya vidmahe vajranakhāya dhīmahi tanno siṁhaḥ prachodayāt।
Vajra nakhāya vidmahe tīkṣṇa daṁṣṭrāya dhīmahi tanno narasiṁhaḥ prachodayāt ॥

Translation: Om, Let me meditate on Lord Narasimha, the one with diamond-hard nails. Let us meditate on the one with sharp teeth. May that Lion-man inspire and illumine our minds.`,
    description: 'Gayatri mantra dedicated to Lord Narasimha for protection and enlightenment'
  },
  {
    title: 'Sri Narasimha Maha Mantra (Alternate)',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit: उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्।
नृसिंहं भीषणं भद्रं मृत्युर्मृत्युं नमाम्यहम् ॥

Transliteration: Ugraṁ vīraṁ mahā-viṣṇuṁ jvalantaṁ sarvato mukham।
Nṛsiṁhaṁ bhīṣaṇaṁ bhadraṁ mṛtyur mṛtyuṁ namāmy aham ॥

Translation: I bow to Lord Narasimha who is ferocious and heroic like Lord Vishnu, effulgent and having faces in all directions. He is terrifying yet auspicious, and is death personified to death itself.`,
    description: 'Powerful Narasimha mantra for protection and destroying enemies and negativity'
  },
  {
    title: 'Narasimha Prapatti (Surrender Prayer)',
    deity: 'Narasimha',
    category: 'Mantra',
    lyrics: `Sanskrit: माता नरसिंह पिता नरसिंह
भ्राता नरसिंह सखा नरसिंह।
विद्या नरसिंह द्रविणं नरसिंह
स्वामी नरसिंह सकलं नरसिंह।
इतो नरसिंह परतो नरसिंह
यतो यतो याहि ततो नरसिंह।
नरसिंह देवात् परो न कश्चित्
तस्मान्नरसिंह शरणं प्रपद्ये ॥

Transliteration: Mātā narasiṁha pitā narasiṁha
bhrātā narasiṁha sakhā narasiṁha।
Vidyā narasiṁha draviṇaṁ narasiṁha
svāmī narasiṁha sakalaṁ narasiṁha।
Ito narasiṁha parato narasiṁha
yato yato yāhi tato narasiṁha।
Narasiṁha devāt paro na kaścit
tasmān narasiṁha śaraṇaṁ prapadye ॥

Translation: Narasimha is my mother, Narasimha is my father, Narasimha is my brother, Narasimha is my friend. Narasimha is my knowledge, Narasimha is my wealth, Narasimha is my Lord, Narasimha is my everything. Narasimha is here, Narasimha is there, wherever I go, there is Narasimha. There is none superior to Lord Narasimha, therefore I surrender unto Lord Narasimha.`,
    description: 'Complete surrender prayer (Prapatti) to Lord Narasimha, declaring Him as everything'
  }
];

async function addNarasimhaMantras() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add each mantra
    for (const mantra of narasimhaMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Narasimha Mantras added successfully!');
    console.log(`Total mantras added: ${narasimhaMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- ह्रीं क्षौं (proper bija mantras)');
    console.log('- नृसिंहं (correct Devanagari spelling)');
    console.log('- शृङ्गं (correct conjunct)');
    console.log('- तीक्ष्ण दंष्ट्राय (sharp teeth - correct spelling)');
    console.log('- Tamil verse included as original script');

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Narasimha mantras:', error);
    process.exit(1);
  }
}

// Run the function
addNarasimhaMantras();
