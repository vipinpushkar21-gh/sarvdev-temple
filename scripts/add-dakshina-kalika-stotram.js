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

const dakshinaKalikaStotram = {
  title: 'दक्षिण कालिका स्तोत्रम् (Dakshina Kalika Stotram)',
  deity: 'Durga',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Dakshina Kalika Stotram is a powerful hymn dedicated to Goddess Dakshina Kali, a fierce form of Durga. This stotra invokes the goddess for protection, wisdom, prosperity, and liberation, describing her terrifying yet compassionate aspects. Reciting it is believed to remove obstacles, grant boons, and bestow spiritual and material success.',
  lyrics: `॥ दक्षिण कालिका स्तोत्रम् ॥

ॐ कृशोदरि महाचण्डि मुक्तकेशि बलिप्रिये।
कुलाचारप्रसन्नास्ये नमस्ते शङ्करप्रिये॥1॥

घोरदंष्ट्रे कोटराक्षि गीतिशब्द-प्रसाधिनि।
घुरघोरारवास्फारे नमस्ते चित्तवासिनि॥2॥

बन्धूकपुष्प-सङ्काशे त्रिपुरे भयनाशिनि।
भाग्योदय-समुत्पन्ने नमस्ते वरवर्णिनि॥3॥

जय देवि जगद्धात्रि त्रिपुराद्ये त्रिदेवते।
भक्तेभ्यो वरदे देवि महिषघ्नि नमोऽस्तुते॥4॥

घोरविघ्न-विनाशाय कुलाचार-समृद्धये।
नमामि वरदे देवि मुण्डमाला-विभूषणे॥5॥

रक्तधारा-समाकीर्णे कलकाञ्ची-विभूषिते।
सर्वविघ्नहरे कालि नमस्ते भैरवप्रिये॥6॥

नमस्ते दक्षिणामूर्त्ते कालि त्रिपुरभैरवि।
भिन्नाञ्जन-चयप्रख्ये प्रवीण-शवसंस्थिते॥7॥

गलच्छोणित-धाराभिः स्मेरानन-सरोरुहे।
पीनोन्नत-कुचद्बन्द्वे नमस्ते घोरदक्षिणे॥8॥

आरक्तमुखशान्ताभिर्नेत्रालिभिर्विराजिते।
शवद्वय-कृतोत्तंसे नमस्ते मदविह्वले॥9॥

पञ्चाशन्मुण्ड-घटितमाला-लोहितलोहिते।
नानामणि-विशोभाढ्ये नमस्ते ब्रह्मसेविते॥10॥

शवास्थि-कृतकेयूरे शङ्ख-कङ्कण-मण्डिते।
शववक्षःसमारूढे नमस्ते विष्णुपूजिते॥11॥

शवमांसकृतग्रासे साट्टहासे मुहुर्मुहुः।
मुखशीघ्र-स्मितामोदे नमस्ते शिववन्दिते॥12॥

खड्गमुण्डधरे वामे सव्येऽभयवरप्रदे।
दन्तुरे च महारौद्रे नमस्ते चण्डनायिके॥13॥

त्वं गतिः परमा देवि त्वं माता परमेश्वरि।
त्राहि मां करुणासार्द्रे नमस्ते चण्डनायिके॥14॥

नमस्ते कालिके देवि नमस्ते भक्तवत्सले।
मूर्खतां हर मे देवि प्रतिभा-जयदायिनि॥15॥

गद्यपद्यमयीं वाणीं तर्क-व्याकरणादिकम्।
अनधीतागतां विद्यां देहि दक्षिणकालिके॥16॥

जयं देहि सभामध्ये धनं देहि धनागमे।
देहि मे चिरजीवित्वं कालिके रक्ष दक्षिणे॥17॥

राज्यं देहि यशो देहि पुत्रान् दारान् धनं तथा।
देहान्ते देहि मे मुक्तिं जगन्मातः प्रसीद मे॥18॥

ॐ मङ्गला भैरवी दुर्गा कालिका त्रिदशेश्वरी।
उमा हैमवती कन्या कल्याणी भैरवेश्वरी॥19॥

काली ब्राह्मी च माहेशी कौमारी वैष्णवी तथा।
वाराही वासवी चण्डी त्वां जगुर्मुनयः सदा॥20॥

उग्रतारेति तारेति शिवेत्येकजटेति च।
लोकोत्तरेति कालीति गीयसे कृतिभिः सदा॥21॥

यथा काली तथा तारा तथा छिन्ना च कुल्लुका।
एकमूर्त्तिश्चतुर्भेदा देवि त्वं कालिका पुरा॥22॥

एकद्वि-त्रिविधा देवी कोटिधानन्तरूपिणी।
अङ्गाङ्गिकैर्नामभेदैः कालिकेति प्रगीयते॥23॥

शम्भुः पञ्चमुखेनैव गुणान् वक्तुं न ते क्षमः।
चापल्यैर्यत्कृतं स्तोत्रं क्षमस्व वरदा भव॥24॥

प्राणान् रक्ष यशो रक्ष पुत्रान् दारान् धनं तथा।
सर्वकाले सर्वदेशे पाहि दक्षिणकालिके॥25॥

यः सम्पूज्य पठेत् स्तोत्रं दिवा वा रात्रिसन्ध्ययोः।
धनं धान्यं तथा पुत्रं लभते नात्र संशयः॥26॥

॥ इति दक्षिणकालिकास्तोत्रं सम्पूर्णम् ॥

---

॥ Dakṣiṇa Kālika Stotram ॥

Om kṛiśhodari mahāchaṇḍi muktakeśhi balipriye.
Kulāchāraprasannāsye namaste shaṅkarapriye.॥1॥

Ghoradaṃṣhṭre koṭarākṣhi gītiśhabda-prasādhini.
Ghuraghorāravāsphāre namaste chittavāsini.॥2॥

Bandhūkapuṣhpa-saṅkāśhe tripure bhayanāśhini.
Bhāgyodaya-samutpanne namaste varavarṇini.॥3॥

Jaya devi jagaddhātri tripurādye tridevate.
Bhaktebhyo varade devi mahiṣhaghni namo'stute.॥4॥

Ghoravighna-vināshāya kulāchāra-samṛiddhaye.
Namāmi varade devi muṇḍamālā-vibhūṣhaṇe.॥5॥

Raktadhārā-samākīrṇe kalakāñchī-vibhūṣhite.
Sarvavighnahare kāli namaste bhairavapriye.॥6॥

Namaste dakṣiṇāmūrtte kāli tripurabhairavi.
Bhinnāñjana-chayaprakhye pravīṇa-shavasaṃsthite.॥7॥

Galachchoṇita-dhārābhiḥ smerānana-saroruhe.
Pīnonnata-kuchadbandve namaste ghoradakṣiṇe.॥8॥

Āraktamukhashāntābhirnetrālibhirvirājite.
Shavadvaya-kṛitottaṃse namaste madavihvale.॥9॥

Pañchāśanmuṇḍa-ghaṭitamālā-lohitalohite.
Nānāmaṇi-vishoḍhāḍhye namaste brahmasevite.॥10॥

Shavāsthi-kṛitakeyūre shaṅkha-kaṅkaṇa-maṇḍite.
Shavavakṣhaḥsamārūḍhe namaste viṣṇupūjite.॥11॥

Shavamāṃsakṛitagrāse sāṭṭahāse muhurmuhuḥ.
Mukhaśhīghra-smitāmode namaste shivavandite.॥12॥

Khaḍgamuṇḍadhare vāme savye'bhayavaraprade.
Danture cha mahāraudre namaste chaṇḍanāyike.॥13॥

Tvaṃ gatiḥ paramā devi tvaṃ mātā parameśhvari.
Trāhi māṃ karuṇāsārdre namaste chaṇḍanāyike.॥14॥

Namaste kālike devi namaste bhaktavatsale.
Mūrkhatāṃ hara me devi pratibhā-jayadāyini.॥15॥

Gadyapadyamayīṃ vāṇīṃ tarka-vyākaraṇādikam.
Anadhītāgatāṃ vidyāṃ dehi dakṣiṇakālike.॥16॥

Jayaṃ dehi sabhāmadhye dhanaṃ dehi dhanāgame.
Dehi me chirajīvitvaṃ kālike rakṣha dakṣiṇe.॥17॥

Rājyaṃ dehi yasho dehi putrān dārān dhanaṃ tathā.
Dehānte dehi me muktiṃ jaganmātaḥ prasīda me.॥18॥

Om maṅgalā bhairavī durgā kālikā tridaśheśhvari.
Umā haimavatī kanyā kalyāṇī bhairaveśhvari.॥19॥

Kālī brāhmī cha māheśhī kaumārī vaiṣṇavī tathā.
Vārāhī vāsavī chaṇḍī tvāṃ jagurmunayaḥ sadā.॥20॥

Ugratāreti tāreti shivetyekajaṭeti cha.
Lokottareti kālīti gīyase kṛitibhiḥ sadā.॥21॥

Yathā kālī tathā tārā tathā chhinnā cha kullukā.
Ekamūrttiśchaturbhedā devi tvaṃ kālikā purā.॥22॥

Ekadvi-trividhā devī koṭidhānantarūpiṇī.
Aṅgāṅgikairnāmabhedaiḥ kāliketi pragīyate.॥23॥

Shaṃbhuḥ pañchamukhenaiva guṇān vaktuṃ na te kṣhamaḥ.
Chāpalyairyatkṛitaṃ stotraṃ kṣhamasva varadā bhava.॥24॥

Prāṇān rakṣha yasho rakṣha putrān dārān dhanaṃ tathā.
Sarvakāle sarvadeśhe pāhi dakṣiṇakālike.॥25॥

Yaḥ sampūjya paṭhet stotraṃ divā vā rātrisandhyayoḥ.
Dhanaṃ dhānyaṃ tathā putraṃ labhate nātra saṃśayaḥ.॥26॥

॥ Iti Dakṣiṇakālikāstotraṃ sampūrṇam ॥`
};

async function addDakshinaKalikaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: dakshinaKalikaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Dakshina Kalika Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(dakshinaKalikaStotram);
      await doc.save();
      console.log('✓  Added: ' + dakshinaKalikaStotram.title);
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

addDakshinaKalikaStotram();
