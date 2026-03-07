const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String, default: 'Stotra' },
  language:    { type: String, default: 'Sanskrit' },
  deity:       { type: String },
  lyrics:      { type: String },
  audio:       { type: String },
  status:      { type: String, default: 'approved' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const argalaStotram = {
  title: 'अर्गलास्तोत्रम् (Argala Stotram)',
  deity: 'Durga',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Argala Stotram is a powerful hymn from the Durga Saptashati (Devi Mahatmyam) recited before the main seven hundred verses. Composed by Sage Markandeya, it is an invocation to Goddess Chandika (Durga), seeking beauty, victory, glory, and the destruction of enemies. Each verse ends with the potent refrain "Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi" — Grant me beauty, grant me victory, grant me fame, and destroy my enemies. It is an essential part of the Navratri and Durga Saptashati recitation.',
  lyrics: `॥ अथार्गलास्तोत्रम् ॥

ॐ अस्य श्रीअर्गलास्तोत्रमन्त्रस्य विष्णुर्ऋषिः, अनुष्टुप् छन्दः,
श्रीमहालक्ष्मीर्देवता, श्रीजगदम्बाप्रीतये सप्तशतीपाठाङ्गत्वेन जपे विनियोगः॥

ॐ नमश्चण्डिकायै॥

मार्कण्डेय उवाच

ॐ जयन्ती मङ्गला काली भद्रकाली कपालिनी।
दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते॥1॥

जय त्वं देवि चामुण्डे जय भूतार्तिहारिणि।
जय सर्वगते देवि कालरात्रि नमोऽस्तु ते॥2॥

मधुकैटभविद्राविविधातृवरदे नमः।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥3॥

महिषासुरनिर्णाशि भक्तानां सुखदे नमः।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥4॥

रक्तबीजवधे देवि चण्डमुण्डविनाशिनि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥5॥

शुम्भस्यैव निशुम्भस्य धूम्राक्षस्य च मर्दिनि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥6॥

वन्दिताङ्घ्रियुगे देवि सर्वसौभाग्यदायिनि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥7॥

अचिन्त्यरूपचरिते सर्वशत्रुविनाशिनि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥8॥

नतेभ्यः सर्वदा भक्त्या चण्डिके दुरितापहे।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥9॥

स्तुवद्भ्यो भक्तिपूर्वं त्वां चण्डिके व्याधिनाशिनि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥10॥

चण्डिके सततं ये त्वामर्चयन्तीह भक्तितः।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥11॥

देहि सौभाग्यमारोग्यं देहि मे परमं सुखम्।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥12॥

विधेहि द्विषतां नाशं विधेहि बलमुच्चकैः।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥13॥

विधेहि देवि कल्याणं विधेहि परमां श्रियम्।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥14॥

सुरासुरशिरोरत्ननिघृष्टचरणेऽम्बिके।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥15॥

विद्यावन्तं यशस्वन्तं लक्ष्मीवन्तं जनं कुरु।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥16॥

प्रचण्डदैत्यदर्पघ्ने चण्डिके प्रणताय मे।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥17॥

चतुर्भुजे चतुर्वक्त्रसंस्तुते परमेश्वरि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥18॥

कृष्णेन संस्तुते देवि शश्वद्भक्त्या सदाम्बिके।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥19॥

हिमाचलसुतानाथसंस्तुते परमेश्वरि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥20॥

इन्द्राणीपतिसद्भावपूजिते परमेश्वरि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥21॥

देवि प्रचण्डदोर्दण्डदैत्यदर्पविनाशिनि।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥22॥

देवि भक्तजनोद्दामदत्तानन्दोदयेऽम्बिके।
रूपं देहि जयं देहि यशो देहि द्विषो जहि॥23॥

पत्नीं मनोरमां देहि मनोवृत्तानुसारिणीम्।
तारिणीं दुर्गसंसारसागरस्य कुलोद्भवाम्॥24॥

इदं स्तोत्रं पठित्वा तु महास्तोत्रं पठेन्नरः।
स तु सप्तशतीसङ्ख्यावरमाप्नोति सम्पदाम्॥25॥

॥ इति देव्या अर्गलास्तोत्रं सम्पूर्णम् ॥

---

॥ Athārgalāstotram ॥

Om asya shrīargalāstotramantrasya viṣhṇurṛṣhiḥ, anuṣhṭup chhandaḥ,
Shrīmahālakṣhmīrdevatā, shrījagadambāprītaye saptashatīpāṭhāṅgatvena jape viniyogaḥ.

Om namashchaṇḍikāyai.

Mārkaṇḍeya uvācha

Om jayantī maṅgalā kālī bhadrakālī kapālinī.
Durgā kṣhamā shivā dhātrī svāhā svadhā namo'stu te.॥1॥

Jaya tvaṃ devi chāmuṇḍe jaya bhūtārtihāriṇi.
Jaya sarvagate devi kālarātri namo'stu te.॥2॥

Madhukaiṭabhavidrāvividhātṛvarade namaḥ.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥3॥

Mahiṣhāsuranirṇāshi bhaktānāṃ sukhade namaḥ.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥4॥

Raktabījavadhe devi chaṇḍamuṇḍavināshinī.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥5॥

Shumbhasyaiva nishumbhasya dhūmrākṣhasya cha mardini.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥6॥

Vanditāṅghriyuge devi sarvasaubhāgyadāyini.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥7॥

Achintyarūpacharite sarvashatruvināshinī.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥8॥

Natebhyaḥ sarvadā bhaktyā chaṇḍike duritāpahe.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥9॥

Stuvadbhyo bhaktipūrvaṃ tvāṃ chaṇḍike vyādhināshinī.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥10॥

Chaṇḍike satataṃ ye tvāmarchayantīha bhaktitaḥ.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥11॥

Dehi saubhāgyamārogyaṃ dehi me paramaṃ sukham.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥12॥

Vidhehi dviṣhatāṃ nāshaṃ vidhehi balamuchcchakaiḥ.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥13॥

Vidhehi devi kalyāṇaṃ vidhehi paramāṃ shriyam.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥14॥

Surāsurashiroratnanighṛṣhṭacharaṇe'mbike.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥15॥

Vidyāvantaṃ yashasvantaṃ lakṣhmīvantaṃ janaṃ kuru.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥16॥

Prachaṇḍadaityadarpaghne chaṇḍike praṇatāya me.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥17॥

Chaturbhuje chaturvaktrasaṃstute parameshvari.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥18॥

Kṛṣhṇena saṃstute devi shashvadbhaktyā sadāmbike.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥19॥

Himāchalasutānāthasaṃstute parameshvari.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥20॥

Indrāṇīpatisadbhāvapūjite parameshvari.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥21॥

Devi prachaṇḍadordaṇḍadaityadarpavināshinī.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥22॥

Devi bhaktajanōddāmadattānandōdaye'mbike.
Rūpaṃ dehi jayaṃ dehi yasho dehi dviṣho jahi.॥23॥

Patnīṃ manoramāṃ dehi manovṛttānusāriṇīm.
Tāriṇīṃ durgasaṃsārasāgarasya kulodbhavām.॥24॥

Idaṃ stotraṃ paṭhitvā tu mahāstotraṃ paṭhennaraḥ.
Sa tu saptashatīsaṅkhyāvaramāpnoti sampadām.॥25॥

॥ Iti devyā Argalāstotraṃ sampūrṇam ॥`
};

async function addArgalaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: argalaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Argala Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(argalaStotram);
      await doc.save();
      console.log('✓  Added: ' + argalaStotram.title);
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`\nTotal Stotras in DB: ${total}`);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

addArgalaStotram();
