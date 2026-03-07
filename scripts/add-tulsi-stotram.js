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

const tulsiStotram = {
  title: 'तुलसी स्तोत्रम् (Tulsi Stotram)',
  deity: 'Tulsi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Tulsi Stotram is a revered hymn dedicated to Goddess Tulsi Mata, the beloved of Lord Vishnu. This stotra, attributed to Pundarika, extols the spiritual glory, purifying power, and divine status of Tulsi. Reciting it brings blessings, removes sins, and grants devotion and prosperity.',
  lyrics: `॥ तुलसी माता स्तोत्रम् ॥

जगद्धात्रि नमस्तुभ्यं विष्णोश्च प्रियवल्लभे।
यतो ब्रह्मादयो देवाः सृष्टिस्थित्यन्तकारिणः॥1॥

नमस्तुलसि कल्याणि नमो विष्णुप्रिये शुभे।
नमो मोक्षप्रदे देवि नमः सम्पत्प्रदायिके॥2॥

तुलसी पातु मां नित्यं सर्वापद्भ्योऽपि सर्वदा।
कीर्तितापि स्मृता वापि पवित्रयति मानवम्॥3॥

नमामि शिरसा देवीं तुलसीं विलसत्तनुम्।
यां दृष्ट्वा पापिनो मर्त्या मुच्यन्ते सर्वकिल्बिषात्॥4॥

तुलस्या रक्षितं सर्वं जगदेतच्चराचरम्।
या विनिहन्ति पापानि दृष्ट्वा वा पापिभिर्नरैः॥5॥

नमस्तुलस्यतितरां यस्यै बद्ध्वाञ्जलिं कलौ।
कलयन्ति सुखं सर्वं स्त्रियो वैश्यास्तथाऽपरे॥6॥

तुलस्या नापरं किञ्चिद् दैवतं जगतीतले।
यथा पवित्रितो लोको विष्णुसङ्गेन वैष्णवः॥7॥

तुलस्याः पल्लवं विष्णोः शिरस्यारोपितं कलौ।
आरोपयति सर्वाणि श्रेयांसि वरमस्तके॥8॥

तुलस्यां सकला देवा वसन्ति सततं यतः।
अतस्तामर्चयेल्लोके सर्वान् देवान् समर्चयन्॥9॥

नमस्तुलसि सर्वज्ञे पुरुषोत्तमवल्लभे।
पाहि मां सर्वपापेभ्यः सर्वसम्पत्प्रदायिके॥10॥

इति स्तोत्रं पुरा गीतं पुण्डरीकेण धीमता।
विष्णुमर्चयता नित्यं शोभनैस्तुलसीदलैः॥11॥

तुलसी श्रीर्महालक्ष्मीर्विद्याविद्या यशस्विनी।
धर्म्या धर्मानना देवी देवीदेवमनः प्रिया॥12॥

लक्ष्मीप्रियसखी देवी द्यौर्भूमिरचला चला।
षोडशैतानि नामानि तुलस्याः कीर्तयन्नरः॥13॥

लभते सुतरां भक्तिमन्ते विष्णुपदं लभेत्।
तुलसी भूर्महालक्ष्मीः पद्मिनी श्रीर्हरिप्रिया॥14॥

तुलसि श्रीसखि शुभे पापहारिणि पुण्यदे।
नमस्ते नारदनुते नारायणमनः प्रिये॥15॥

॥ इति श्रीपुण्डरीककृतं तुलसीस्तोत्रं सम्पूर्णम् ॥

---

॥ Tulsi Mata Stotram ॥

Jagaddhātri namastubhyam viṣhṇośhcha priyavallabhe.
Yato brahmādayo devāḥ sṛiṣṭisthityantakāriṇaḥ.॥1॥

Namastulasi kalyāṇi namo viṣṇupriye śubhe.
Namo mokṣhaprade devi namaḥ sampatpradāyike.॥2॥

Tulasi pātu māṃ nityaṃ sarvāpadbhyo'pi sarvadā.
Kīrtitāpi smṛitā vāpi pavitrayati mānavam.॥3॥

Namāmi śirasā devīṃ tulasīṃ vilasattanum.
Yāṃ dṛiṣṭvā pāpino martyā muchyante sarvakilbiṣhāt.॥4॥

Tulasya rakṣhitaṃ sarvaṃ jagadetaccharācharam.
Yā vinihanti pāpāni dṛiṣṭvā vā pāpibhirnaraiḥ.॥5॥

Namastulasyatitarāṃ yasyai baddhvāñjaliṃ kalau.
Kalayanti sukhaṃ sarvaṃ striyo vaiśhyāstathā'pare.॥6॥

Tulasya nāparaṃ kiñchid daivataṃ jagatītale.
Yathā pavitrito loko viṣṇusaṅgena vaiṣṇavaḥ.॥7॥

Tulasyaḥ pallavaṃ viṣṇoḥ shirasyāropitaṃ kalau.
Āropayati sarvāṇi śreyāṃsi varamastake.॥8॥

Tulasyaṃ sakalā devā vasanti satataṃ yataḥ.
Atastāmarcayelloke sarvān devān samarcayan.॥9॥

Namastulasi sarvajñe puruṣhottamavallabhe.
Pāhi māṃ sarvapāpebhyaḥ sarvasampatpradāyike.॥10॥

Iti stotraṃ purā gītaṃ puṇḍarīkeṇa dhīmatā.
Viṣṇumarcayatā nityaṃ śobhanaistulasīdalaiḥ.॥11॥

Tulasi śrīrmahālakṣhmīrvidyāvidyā yaśasvinī.
Dharmyā dharmānana devī devīdevamanaḥ priyā.॥12॥

Lakṣhmīpriyasakhī devī dyaurbhūmirachalā chalā.
Ṣhoḍaśaitāni nāmāni tulasyaḥ kīrtayannaraḥ.॥13॥

Labhate sutarāṃ bhaktimante viṣṇupadaṃ labhet.
Tulasi bhūrmahālakṣhmīḥ padminī śrīrharipriyā.॥14॥

Tulasi śrīsakhi śubhe pāpahāriṇi puṇyade.
Namaste nāradanute nārāyaṇamanaḥ priye.॥15॥

॥ Iti shrīpuṇḍarīkakṛtaṃ Tulasi Stotraṃ sampūrṇam ॥`
};

async function addTulsiStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: tulsiStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Tulsi Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(tulsiStotram);
      await doc.save();
      console.log('✓  Added: ' + tulsiStotram.title);
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

addTulsiStotram();
