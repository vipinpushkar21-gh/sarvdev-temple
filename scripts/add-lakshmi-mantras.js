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

const lakshmiMantras = [
  {
    title: 'Lakshmi Mantra for Wealth and Prosperity',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्माकं दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ ॥

Transliteration: Om śrīṁ hrīṁ klīṁ tribhuvana mahālakṣmyai asmākaṁ dāridra nāśaya prachura dhana dehi dehi klīṁ hrīṁ śrīṁ om ॥

Translation: Om, O Goddess Mahalakshmi of the three worlds, destroy our poverty and bestow abundant wealth upon us. Grant us wealth, grant us wealth. Klim Hrim Shrim Om.`,
    description: 'Powerful mantra to remove poverty and attract wealth and prosperity'
  },
  {
    title: 'Lakshmi Mantra with Beej Aksharas',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ श्रीं ह्रीं क्लीं ऐं सौं ॐ ह्रीं क ए ई ल ह्रीं ह स क ह ल ह्रीं सकल ह्रीं सौं ऐं क्लीं ह्रीं श्रीं ॐ ॥

Transliteration: Om śrīṁ hrīṁ klīṁ aiṁ sauṁ om hrīṁ ka e ī la hrīṁ ha sa ka ha la hrīṁ sakala hrīṁ sauṁ aiṁ klīṁ hrīṁ śrīṁ om ॥

Translation: Om, sacred seed syllables invoking the complete divine power of Goddess Lakshmi through mystical sound vibrations.`,
    description: 'Advanced mantra with multiple seed syllables for invoking Lakshmi\'s complete blessings'
  },
  {
    title: 'Lakshmi Mantra for Home Prosperity',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ ह्रीं श्रीं क्रीं श्रीं क्रीं क्लीं श्रीं महालक्ष्मि मम गृहे धनं पूरय पूरय चिन्तायै दूरय दूरय स्वाहा ॥

Transliteration: Om hrīṁ śrīṁ krīṁ śrīṁ krīṁ klīṁ śrīṁ mahālakṣmi mama gṛhe dhanaṁ pūraya pūraya chintāyai dūraya dūraya svāhā ॥

Translation: Om, O Goddess Mahalakshmi, fill my home with wealth, fill it completely. Remove all worries, remove them completely. Svaha.`,
    description: 'Mantra to invoke Lakshmi\'s blessings for household prosperity and removal of anxieties'
  },
  {
    title: 'Mahalakshmi Mantra for Complete Blessings',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ सर्वाबाधा विनिर्मुक्तो धन धान्यः सुतान्वितः।
मनुष्यो मत्प्रसादेन भविष्यति न संशयः ॐ ॥

Transliteration: Om sarvābādhā vinirmukto dhana dhānyaḥ sutānvitaḥ।
Manuṣyo matprasādena bhaviṣyati na saṁśayaḥ om ॥

Translation: Om, By My grace, the person will be freed from all obstacles, blessed with wealth, grains, and progeny. This will happen without doubt. Om.`,
    description: 'Mahalakshmi\'s promise mantra for liberation from obstacles and complete prosperity'
  },
  {
    title: 'Lakshmi Gayatri Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ श्री महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि।
तन्नो लक्ष्मीः प्रचोदयात् ॐ ॥

Transliteration: Om śrī mahālakṣmyai cha vidmahe viṣṇupatnyai cha dhīmahi।
Tanno lakṣmīḥ prachodayāt om ॥

Translation: Om, Let us meditate on Goddess Mahalakshmi, let us concentrate on the consort of Lord Vishnu. May Goddess Lakshmi inspire and illumine our minds. Om.`,
    description: 'Gayatri mantra dedicated to Goddess Lakshmi for wisdom and prosperity'
  },
  {
    title: 'Lakshmi Beej Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ श्रीं श्रियै नमः ॥

Transliteration: Om śrīṁ śriyai namaḥ ॥

Translation: Om, Salutations to Goddess Shri (Lakshmi), the embodiment of prosperity.`,
    description: 'Simple yet powerful seed mantra of Goddess Lakshmi for daily recitation'
  },
  {
    title: 'Lakshmi Maha Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद।
श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः ॥

Transliteration: Om śrīṁ hrīṁ śrīṁ kamale kamalālaye prasīda prasīda।
Śrīṁ hrīṁ śrīṁ om mahālakṣmyai namaḥ ॥

Translation: Om, O Goddess who dwells in the lotus, be pleased with me, be pleased. Salutations to Goddess Mahalakshmi.`,
    description: 'Great mantra invoking Lakshmi in her lotus-dwelling form'
  },
  {
    title: 'Lakshmi Dhyan Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: वन्दे पद्मकरां प्रसन्नवदनां सौभाग्यदां भाग्यदाम्।
हस्ताभ्यां अभयप्रदां मणिगणैः नानारत्नैः भूषिताम् ॥

Transliteration: Vande padmakarāṁ prasannavadanāṁ saubhāgyadāṁ bhāgyadām।
Hastābhyāṁ abhayapradāṁ maṇigaṇaiḥ nānāratnaiḥ bhūṣitām ॥

Translation: I worship the one who holds a lotus, whose face is serene, who bestows good fortune and prosperity, whose hands grant fearlessness, who is adorned with various gems and jewels.`,
    description: 'Meditation mantra describing the beautiful form of Goddess Lakshmi'
  },
  {
    title: 'Lakshmi Ashtottara Opening',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: ॐ प्रकृत्यै नमः। ॐ विकृत्यै नमः।
ॐ विद्यायै नमः। ॐ सर्वभूतहितप्रदायै नमः।
ॐ श्रद्धायै नमः। ॐ विभूत्यै नमः।
ॐ सुरभ्यै नमः। ॐ परमात्मिकायै नमः ॥

Transliteration: Om prakṛtyai namaḥ। Om vikṛtyai namaḥ।
Om vidyāyai namaḥ। Om sarvabhūtahitapradāyai namaḥ।
Om śraddhāyai namaḥ। Om vibhūtyai namaḥ।
Om surabhyai namaḥ। Om paramātmikāyai namaḥ ॥

Translation: Salutations to Nature, to Transformation, to Knowledge, to the giver of welfare to all beings, to Faith, to Prosperity, to the Divine Cow, to the Supreme Soul.`,
    description: 'Opening verses from the 108 names (Ashtottara Shatanamavali) of Lakshmi'
  },
  {
    title: 'Kanakdhara Lakshmi Mantra',
    deity: 'Lakshmi',
    category: 'Mantra',
    lyrics: `Sanskrit: अङ्गं हरेः पुलकभूषणमाश्रयन्ती
भृङ्गाङ्गनेव मुकुलाभरणं तमालम्।
अङ्गीकृतांखिल विभूतिरपाङ्गलीला
माङ्गल्यदास्तु मम मङ्गलदेवतायाः ॥

Transliteration: Aṅgaṁ hareḥ pulakabhūṣaṇamāśrayantī
bhṛṅgāṅganeva mukulābharaṇaṁ tamālam।
Aṅgīkṛtāṁkhila vibhūtirapāṅgalīlā
māṅgalyadāstu mama maṅgaladevatāyāḥ ॥

Translation: She who rests on Lord Hari's chest adorned with goosebumps of joy, like a bee on a tamala tree adorned with buds. She who has accepted all prosperity with a playful glance - may that auspicious Goddess grant me auspiciousness.`,
    description: 'Opening verse of Kanakdhara Stotram by Adi Shankaracharya for wealth'
  }
];

async function addLakshmiMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const mantra of lakshmiMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Lakshmi Mantras added successfully!');
    console.log(`Total mantras added: ${lakshmiMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- अस्माकं (corrected from अस्मांक)');
    console.log('- दारिद्र्य (proper conjunct for poverty)');
    console.log('- चिन्तायै (correct case ending)');
    console.log('- विष्णुपत्न्यै (correct compound)');
    console.log('- श्रियै नमः (correct dative case)');
    console.log('- Added 4 additional important Lakshmi mantras');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Lakshmi mantras:', error);
    process.exit(1);
  }
}

addLakshmiMantras();
