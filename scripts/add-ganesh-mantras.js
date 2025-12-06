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

const ganeshMantras = [
  {
    title: 'Vakratunda Mantra',
    description: 'Powerful opening prayer to Lord Ganesha, the remover of obstacles. This mantra describes Ganesha with curved trunk and massive body whose aura equals millions of suns. Chanted before starting any new work for success.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥

Transliteration:
Vakratunda Mahakaya Suryakoti Samaprabha
Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada

Translation:
O Lord with curved trunk and massive body, whose brilliance equals millions of suns, please remove all obstacles from all my endeavors, always.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Gayatri Mantra',
    description: 'Gayatri mantra dedicated to Lord Ganesha. Meditating on the single-tusked deity with curved trunk, this mantra grants wisdom and intellect.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि ।
तन्नो दन्ती प्रचोदयात् ॥

Transliteration:
Om Ekadantaya Vidmahe Vakratundaya Dhimahi
Tanno Danti Prachodayat

Translation:
We meditate on the single-tusked Lord, we contemplate the one with curved trunk. May that tusked deity illuminate our intellect.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Beej Mantra',
    description: 'The most basic and powerful seed mantra of Lord Ganesha. "Gam" is the beej (seed) syllable. Simple yet highly effective for daily worship.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ गं गणपतये नमः

Transliteration:
Om Gam Ganapataye Namah

Translation:
Om, salutations to Lord Ganapati (Ganesha) with his seed syllable Gam.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Ganadhyaksha',
    description: 'Salutation to Ganesha as Ganadhyaksha - the leader of Lord Shiva\'s attendants (ganas).',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ गणाध्यक्षाय नमः

Transliteration:
Om Ganadhyakshaya Namah

Translation:
Om, salutations to the leader of celestial attendants.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Gajanana',
    description: 'Salutation to Ganesha as Gajanana - the elephant-faced Lord.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ गजाननाय नमः

Transliteration:
Om Gajananaya Namah

Translation:
Om, salutations to the elephant-faced one.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Vighnanashana',
    description: 'Salutation to Ganesha as Vighnanashana - the destroyer of obstacles.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ विघ्ननाशनाय नमः

Transliteration:
Om Vighnanashanaya Namah

Translation:
Om, salutations to the destroyer of obstacles.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Lambodara',
    description: 'Salutation to Ganesha as Lambodara - the one with large belly, symbolizing the universe.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ लम्बोदराय नमः

Transliteration:
Om Lambodaraya Namah

Translation:
Om, salutations to the large-bellied one.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Sumukha',
    description: 'Salutation to Ganesha as Sumukha - the auspicious-faced Lord.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ सुमुखाय नमः

Transliteration:
Om Sumukhaya Namah

Translation:
Om, salutations to the one with an auspicious face.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Gajakarnika',
    description: 'Salutation to Ganesha as Gajakarnika - the one with elephant ears.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ गजकर्णिकाय नमः

Transliteration:
Om Gajakarnikaya Namah

Translation:
Om, salutations to the one with elephant ears.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Vikata',
    description: 'Salutation to Ganesha as Vikata - the formidable destroyer of obstacles.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ विकटाय नमः

Transliteration:
Om Vikataya Namah

Translation:
Om, salutations to the formidable one.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Namavali - Vinayaka',
    description: 'Salutation to Ganesha as Vinayaka - the supreme leader without a superior.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ विनायकाय नमः

Transliteration:
Om Vinayakaya Namah

Translation:
Om, salutations to the supreme leader.`,
    status: 'approved'
  },
  {
    title: 'Rinn Harta Mantra (Debt Remover)',
    description: 'Powerful mantra to remove debts and financial obstacles. "Rinn Harta" means debt destroyer. Chanting this helps clear financial burdens.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ गणेश ऋणं छिन्धि वरेण्यं हूं नमः फट्

Transliteration:
Om Ganesha Rinnam Chhindhi Varenyam Hum Namah Phat

Translation:
Om Ganesha, cut away my debts, O worthy one, Hum, salutations, Phat (mantra completion).`,
    status: 'approved'
  },
  {
    title: 'Siddhi Vinayak Mantra',
    description: 'Comprehensive mantra for success in all endeavors. Invokes Siddhi Vinayak (accomplishment provider) for removing obstacles, attracting all people, and achieving all tasks.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ नमो सिद्धि विनायकाय सर्व कार्य कर्त्रे सर्व विघ्न प्रशमनाय सर्वराज्य वश्यकर्णाय सर्वजन सर्वस्त्री पुरुष आकर्षणाय श्रीं ॐ स्वाहा

Transliteration:
Om Namo Siddhi Vinayakaya Sarva Karya Kartre Sarva Vighna Prashamanaya Sarvarajya Vashyakarnaya Sarva Jana Sarvastri Purusha Akarshanaaya Shreem Om Swaha

Translation:
Om, salutations to Siddhi Vinayaka, the doer of all works, remover of all obstacles, controller of all kingdoms, attractor of all people (men and women), Shreem Om Swaha.`,
    status: 'approved'
  },
  {
    title: 'Shaktivinayak Mantra',
    description: 'Short powerful beej mantra combining three seed syllables for invoking Ganesha\'s supreme power and energy.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ ह्रीं ग्रीं ह्रीं

Transliteration:
Om Hreem Greem Hreem

Translation:
Om, the three sacred seed syllables of power, maya, and Ganesha combined for supreme energy.`,
    status: 'approved'
  },
  {
    title: 'Ganesh Mool Mantra',
    description: 'The root (Mool) mantra of Ganesha - the most complete and powerful combination. Includes beej mantras, Gayatri, and prayers for blessings, prosperity, control over all beings, and peace.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Ganesha',
    lyrics: `Sanskrit:
ॐ श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा ।
तत्पुरुषाय विद्महे वक्रतुण्डाय धीमहि तन्नो दन्ती प्रचोदयात् ।
ॐ शान्तिः शान्तिः शान्तिः ॥

Transliteration:
Om Shreem Hreem Kleem Glaum Gam Ganapataye Vara Varada Sarvajanam Me Vashamanaya Swaha
Tatpurushaya Vidmahe Vakratundaya Dhimahi Tanno Danti Prachodayat
Om Shantih Shantih Shantih

Translation:
Om, with the sacred syllables Shreem, Hreem, Kleem, Glaum and Gam - to Lord Ganapati, the giver of boons and blessings, bring all people under my positive influence, Swaha. We know the Supreme Being, we meditate on the curved-trunked one, may that tusked deity guide us. Om, peace, peace, peace.`,
    status: 'approved'
  }
];

async function addGaneshMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding Ganesh Mantras ---\n');

    for (const mantra of ganeshMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 15 Ganesh Mantras added successfully!');
    console.log(`Total mantras added: ${ganeshMantras.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addGaneshMantras();
