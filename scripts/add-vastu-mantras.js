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

const vastuMantras = [
  {
    title: 'Vastu Purusha Mantra',
    deity: 'Vastu Purusha',
    category: 'Vastu',
    status: 'approved',
    lyrics: `Sanskrit: नमस्ते वास्तु पुरुषाय भूशय्या भीरत प्रभो।
मद्गृहं धन धान्यादि समृद्धं कुरु सर्वदा ॥

Transliteration: Namaste vāstu puruṣāya bhūśayyā bhīrata prabho।
Madgṛhaṁ dhana dhānyādi samṛddhaṁ kuru sarvadā ॥

Translation: Salutations to the Lord of Vastu (Vastu Purusha) who lies on the earth. O Lord, please make my home always prosperous with wealth, grains, and abundance.`,
    description: 'Main mantra for Vastu Purusha, the deity of architectural and spatial harmony'
  },
  {
    title: 'Vastu Dosha Nivaran Mantra 1',
    deity: 'Vastu Purusha',
    category: 'Vastu',
    status: 'approved',
    lyrics: `Sanskrit: ॐ वास्तोष्पते प्रति जानीह्यस्मान् स्वावेशो अनमीवो भवान्।
यत्त्वे महे प्रतितन्नो जुषस्व शं नो भव द्विपदे शं चतुष्पदे स्वाहा ॥

Transliteration: Om vāstoṣpate prati jānīhyasmān svāveśo anamīvo bhavān।
Yattve mahe pratitanno juṣasva śaṁ no bhava dvipade śaṁ chatuṣpade svāhā ॥

Translation: Om, O Lord of Dwelling (Vastu), recognize us and be our protector without disease. As we honor you, please accept our offerings. Be auspicious for us, for both two-legged and four-legged beings. Svaha.`,
    description: 'Vedic mantra from Rig Veda for removing Vastu doshas (architectural defects) and bringing harmony'
  },
  {
    title: 'Vastu Dosha Nivaran Mantra 2',
    deity: 'Vastu Purusha',
    category: 'Vastu',
    status: 'approved',
    lyrics: `Sanskrit: ॐ वास्तोष्पते प्रतरणो न एधि गयस्फानो गोभिः अश्वेभिः इन्दो।
अजरासस्ते सख्ये स्याम पितेव पुत्रान् प्रतिन्नो जुषस्व शं नो भव द्विपदे शं चतुष्पदे स्वाहा ॥

Transliteration: Om vāstoṣpate prataraṇo na edhi gayasphāno gobhiḥ aśvebhiḥ indo।
Ajarāsaste sakhye syāma piteva putrān pratinno juṣasva śaṁ no bhava dvipade śaṁ chatuṣpade svāhā ॥

Translation: Om, O Lord of Dwelling, be our protector and advance us. May we prosper with cows and horses. May we remain in your friendship without aging. Like a father protects his sons, protect us. Be auspicious for us, for both two-legged and four-legged beings. Svaha.`,
    description: 'Second Vedic Vastu mantra for protection, prosperity, and eternal friendship with Vastu Purusha'
  },
  {
    title: 'Vastu Dosha Nivaran Mantra 3',
    deity: 'Vastu Purusha',
    category: 'Vastu',
    status: 'approved',
    lyrics: `Sanskrit: ॐ वास्तोष्पते शग्मया सं गृग् सदाते सक्षीम हिरण्यया गातुमन्धा।
चहिक्षेम उतयोगे वरन्नो यूयं पात स्वस्तिभिः सदा नः स्वाहा।
अमी वहा वास्तोष्पते विश्वरूपा शया विशन् सखा सुशेव एधि नः स्वाहा ॥

Transliteration: Om vāstoṣpate śagmayā saṁ gṛg sadāte sakṣīma hiraṇyayā gātummandhā।
Chahikṣema utayoge varanno yūyaṁ pāta svastibhiḥ sadā naḥ svāhā।
Amī vahā vāstoṣpate viśvarūpā śayā viśan sakhā suśeva edhi naḥ svāhā ॥

Translation: Om, O Lord of Dwelling, with auspiciousness unite us always. Grant us the golden path and protect us. May we prosper in both acquisition and preservation. You who are the protector, always guard us with well-being. O Vastu Lord of universal form, lying encompassing all, be our good friend and prosper us. Svaha.`,
    description: 'Extended Vastu mantra for comprehensive protection, prosperity in all forms of wealth'
  },
  {
    title: 'Vastu Dosha Nivaran Mantra 4',
    deity: 'Vastu Purusha',
    category: 'Vastu',
    status: 'approved',
    lyrics: `Sanskrit: ॐ वास्तोष्पते ध्रुवास्थूणां सनं सौभाग्यानां द्रप्सो भेत्ता पुरां शाश्वतीनां।
इन्क्षे मुनीनां सखा स्वाहा ॥

Transliteration: Om vāstoṣpate dhruvāsthūṇāṁ sanaṁ saubhāgyānāṁ drapso bhettā purāṁ śāśvatīnām।
Iṅkṣe munīnāṁ sakhā svāhā ॥

Translation: Om, O Lord of Dwelling, you are the firm pillar, the establisher of good fortune, the bestower of drops of nectar, the protector of eternal cities. You are the friend of sages and the wise. Svaha.`,
    description: 'Vastu mantra honoring Vastu Purusha as the eternal foundation and friend of the wise'
  }
];

async function addVastuMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mantra of vastuMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All Vastu Mantras added successfully!');
    console.log(`Total mantras added: ${vastuMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- भूशय्या भीरत (corrected from भिरत)');
    console.log('- प्रति जानीह्यस्मान् (proper sandhi)');
    console.log('- अनमीवो (corrected spelling)');
    console.log('- प्रतरणो (correct spelling)');
    console.log('- अश्वेभिः (proper instrumental case)');
    console.log('- शग्मया (corrected from शग्मया)');
    console.log('- सौभाग्यानां (corrected from सौभ्या नां)');
    console.log('- All mantras set to approved status');
    console.log('- Created new "Vastu" category');

    // Verify total count
    const allVastu = await Devotional.find({ category: 'Vastu' });
    console.log(`\nTotal Vastu mantras in database: ${allVastu.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Vastu mantras:', error);
    process.exit(1);
  }
}

addVastuMantras();
