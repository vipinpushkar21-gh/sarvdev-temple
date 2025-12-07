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

const durgaMantras = [
  {
    title: 'Durga Mantra (Sarva Mangala)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥

Transliteration: Sarva maṅgala māṅgalye śive sarvārtha sādhike।
Śaraṇye tryambake gauri nārāyaṇi namo'stu te ॥

Translation: O Goddess, the auspicious one among the auspicious, the consort of Shiva, the fulfiller of all desires, the one who provides refuge, the three-eyed Gauri, O Narayani, salutations to you.`,
    description: 'Most popular Durga mantra for blessings, protection, and fulfillment of desires'
  },
  {
    title: 'Devi Stuti (Praise of the Goddess)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: या देवी सर्वभूतेषु शान्तिरूपेण संस्थिता।
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता।
या देवी सर्वभूतेषु मातृरूपेण संस्थिता।
या देवी सर्वभूतेषु बुद्धिरूपेण संस्थिता।
नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥

Transliteration: Yā devī sarvabhūteṣu śāntirūpeṇa saṁsthitā।
Yā devī sarvabhūteṣu śaktirūpeṇa saṁsthitā।
Yā devī sarvabhūteṣu mātṛrūpeṇa saṁsthitā।
Yā devī sarvabhūteṣu buddhirūpeṇa saṁsthitā।
Namastasyai namastasyai namastasyai namo namaḥ ॥

Translation: To the Goddess who resides in all beings as peace, as power, as mother, and as intellect - salutations to Her, salutations to Her, salutations to Her, salutations again and again.`,
    description: 'Sacred hymn from Devi Mahatmyam honoring the Divine Mother in her various forms'
  },
  {
    title: 'Durga Dhyan Mantra (Meditation on Durga)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: ॐ जटा जूट समायुक्तमर्धेन्दु कृत लक्षणाम्।
लोचनत्रय संयुक्तां पद्मेन्दुसद्यशाननाम् ॥

Transliteration: Om jaṭā jūṭa samāyuktamardhendukṛta lakṣaṇām।
Lochanatraya saṁyuktāṁ padmendu sadyaśānanām ॥

Translation: Om, I meditate on the one adorned with matted hair, marked with the crescent moon, possessing three eyes, and whose face is beautiful like the lotus and moon.`,
    description: 'Meditation mantra for visualizing the divine form of Goddess Durga'
  },
  {
    title: 'Durga Shatru Shanti Mantra (Mantra for Enemy Peace)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: रिपवः संक्षयं यान्ति कल्याणं चोपपद्यते।
नन्दते च कुलं पुंसां माहात्म्यं मम श्रृणुयान्मम ॥

Transliteration: Ripavaḥ saṅkṣayaṁ yānti kalyāṇaṁ choppadyate।
Nandate cha kulaṁ puṁsāṁ māhātmyaṁ mama śṛṇuyānmama ॥

Translation: Enemies are destroyed, auspiciousness comes, and the family rejoices - for those who listen to my glory.`,
    description: 'Powerful mantra for removing enemies and bringing peace and prosperity to the family'
  },
  {
    title: 'Durga Sarva Badha Mukti Mantra (Liberation from All Obstacles)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: ॐ सर्वाबाधा विनिर्मुक्तो धन धान्यः सुतान्वितः।
मनुष्यो मत्प्रसादेन भविष्यति न संशयः ॐ ॥

Transliteration: Om sarvābādhā vinirmukto dhana dhānyaḥ sutānvitaḥ।
Manuṣyo matprasādena bhaviṣyati na saṁśayaḥ om ॥

Translation: Om, By my grace, a person will be freed from all obstacles, blessed with wealth, grains, and children - this will happen without doubt. Om.`,
    description: 'Divine promise of Durga for complete liberation from obstacles and blessings of prosperity'
  },
  {
    title: 'Durga Duhswapna Nivaran Mantra (Protection from Bad Dreams)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: शान्तिकर्मणि सर्वत्र तथा दुःस्वप्नदर्शने।
ग्रहपीडासु चोग्रासु माहात्म्यं श्रृणुयान्मम ॥

Transliteration: Śāntikarmṇi sarvatra tathā duḥsvapnadarśane।
Grahapīḍāsu chogrāsu māhātmyaṁ śṛṇuyānmama ॥

Translation: In all peace rituals, in bad dreams and omens, and in severe planetary afflictions - one should listen to my glory.`,
    description: 'Mantra for protection from nightmares, bad omens, and planetary afflictions'
  },
  {
    title: 'Durga Shishu Shanti Mantra (Calming Restless Children)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: बालग्रहभिभूतानां बालानां शान्तिकारकम्।
सङ्घातभेदे च नृणां मैत्रीकरणमुत्तमम् ॥

Transliteration: Bālagrahābhibhūtānāṁ bālānāṁ śāntikārakam।
Saṅghātabhede cha nṛṇāṁ maitrīkaraṇamuttamam ॥

Translation: This brings peace to children afflicted by evil spirits and is excellent for creating friendship among people when there is discord.`,
    description: 'Protective mantra for calming fearful and restless children, and creating harmony'
  },
  {
    title: 'Shakti Mantra (Complete Durga Prayer)',
    deity: 'Durga',
    category: 'Durga',
    status: 'approved',
    lyrics: `Sanskrit: शरणागत दीनार्तपरित्राण परायणे।
सर्व्यस्यार्तिहरे देवि नारायणि नमोऽस्तु ते ॥

सर्वस्वरूपे सर्वेशे सर्वशक्तिसमन्विते।
भयेभ्यस्त्राहि नो देवि दुर्गे देवि नमोऽस्तु ते ॥

रोगानशेषानपहंसि तुष्टा।
रुष्टा तु कामान् सकलानभीष्टान्।
त्वामाश्रितानां न विपन्नराणां।
त्वामाश्रिता ह्याश्रयतां प्रयान्ति ॥

सर्वाबाधा प्रशमनं त्रैलोक्यस्याखिलेश्वरि।
एवमेव त्वया कार्यमस्मद्वैरिविनाशनम् ॥

सर्वाबाधा विनिर्मुक्तो धनधान्यसुतान्वितः।
मनुष्यो मत्प्रसादेन भविष्यति न संशयः ॥

देहि सौभाग्यमारोग्यं देहि देवि परं सुखम्।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥

जयन्ती मङ्गला काली भद्रकाली कपालिनी।
दुर्गा शिवा क्षमा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥

Transliteration: Śaraṇāgata dīnārta paritrāṇa parāyaṇe।
Sarvasyārtihare devi nārāyaṇi namo'stu te ॥

Sarvasvarūpe sarveśe sarvaśakti samanvite।
Bhayebhyastrāhi no devi durge devi namo'stu te ॥

Rogānaśeṣānapahaṁsi tuṣṭā।
Ruṣṭā tu kāmān sakalānabhīṣṭān।
Tvāmāśritānāṁ na vipannarāṇāṁ।
Tvāmāśritā hyāśrayatāṁ prayānti ॥

Sarvābādhā praśamanaṁ trailokyasyākhileśvari।
Evameva tvayā kāryamasmadvairināśanam ॥

Sarvābādhā vinirmukto dhanadhānyasutānvitaḥ।
Manuṣyo matprasādena bhaviṣyati na saṁśayaḥ ॥

Dehi saubhāgyamārogyaṁ dehi devi paraṁ sukham।
Rūpaṁ dehi jayaṁ dehi yaśo dehi dviṣo jahi ॥

Jayantī maṅgalā kālī bhadrakālī kapālinī।
Durgā śivā kṣamā dhātrī svāhā svadhā namo'stu te ॥

Translation: O Goddess who is devoted to protecting the surrendered and distressed, O Narayani who removes all suffering, salutations to You. O Goddess of all forms, ruler of all, possessing all powers, protect us from all fears. O Durga, salutations to You. When pleased, You remove all diseases; when angered, You destroy all desired objects. Those who take refuge in You never perish; indeed, they become the refuge of others. O ruler of the three worlds, remover of all obstacles, please destroy our enemies. By Your grace, a person becomes free from all obstacles, blessed with wealth, grains, and children - without doubt. Grant good fortune, health, supreme happiness, beauty, victory, fame - and destroy our enemies. Salutations to You as Jayanti, Mangala, Kali, Bhadrakali, Kapalini, Durga, Shiva, Kshama, Dhatri, Svaha, and Svadha.`,
    description: 'Comprehensive Shakti mantra from Devi Mahatmyam invoking all powers of Durga for complete protection and blessings'
  }
];

async function addDurgaMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of durgaMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Durga Mantras added successfully!');
    console.log(`Total mantras added: ${durgaMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- सर्वभूतेषु (corrected from सर्वभुतेषु)');
    console.log('- शान्तिरूपेण (corrected from क्षान्तिरूपेण)');
    console.log('- अर्धेन्दु (corrected from अर्धेंन्दु)');
    console.log('- लक्षणाम् (corrected case ending)');
    console.log('- दुःस्वप्नदर्शने (correct visarga)');
    console.log('- मैत्रीकरणमुत्तमम् (proper compound)');
    console.log('- सर्व्यस्यार्तिहरे (corrected from सर्वस्यातिहरे)');
    console.log('- All mantras set to approved status');
    console.log('- Created new "Durga" category');

    // Verify total count
    const allDurga = await Devotional.find({ category: 'Durga' });
    console.log(`\nTotal Durga mantras in database: ${allDurga.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Durga mantras:', error);
    process.exit(1);
  }
}

addDurgaMantras();
