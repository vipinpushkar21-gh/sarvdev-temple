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

const radhaChalisa = {
  title: 'Radha Chalisa',
  deity: 'Radha',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
श्री राधे वुषभानुजा,
भक्तनि प्राणाधार ।
वृन्दाविपिन विहारिणी,
प्रानावौ बारम्बार ॥

Śrī Rādhē Vṛṣabhānuja,
Bhaktani prāṇādhāra.
Vṛndāvipin vihāriṇī,
Prānāvau bārambar.

(Hail Radha, daughter of Vṛṣabhānu; support of devotees' lives.
She roams in Vṛndāvana's groves, soul-breathing again and again.)

जैसो तैसो रावरौ,
कृष्ण प्रिया सुखधाम ।
चरण शरण निज दीजिये,
सुन्दर सुखद ललाम ॥

Jaiso taiso rāvarau,
Kṛṣṇa priyā sukhadhāma.
Caraṇa śaraṇa nija dījiē,
Sundar sukha-da lalām.

(As it is, so it is that heart’s delight; beloved of Krishna, abode of bliss.
Grant me refuge at your feet, O beautiful giver of joy.)

॥ चौपाई ॥
जय वृषभान कुँवरी श्री श्यामा ।
कीरति नंदिनी शोभा धामा ॥

Jaya Vṛṣabhāna kumvarī Śrī Śyāmā.
Kīrti Nandinī śobhā dhāmā.

(Hail maiden of Vṛṣabhānu, O Shyama; fame-bearing Nandini, splendid abode.)

नित्य विहारिनि श्याम अधारा ।
अमित मोद मंगल दातारा ॥

Nitya vihāriṇi Śyāma adhārā.
Amit moda maṅgala dātārā.

(Always roaming with Shyama, she bestows boundless joy and auspiciousness.)

रास विलासिनि रस विस्तारिनि ।
सहचरि सुभग यूथ मन भावनि ॥

Rāsa vilāsini rasa vistārini.
Sahacari subhag yūtha mana bhāvanī.

(Dancing in Rasa, spreading blissful emotion;
With fair companions her band enchants the heart.)

नित्य किशोरी राधा गोरी ।
श्याम प्राणधन अति जिय भोरी ॥

Nitya kiśorī Rādhā gōrī.
Śyāma prāṇadhana ati jiya bhōrī.

(Ever a young maiden, fair Radha; she is the very life-treasure of Shyama.)

करुणा सागर हिय उमंगिनी ।
ललितादिक सखियन की संगिनी ॥

Karuṇā sāgara hiya umanginī.
Lalitādik sakhiyān kī sanganī.

(A sea of compassion with joyful heart; companion to Lalita and other friends.)

दिनकर कन्या कूल विहारिनि ।
कृष्ण प्राण प्रिय हिय हुलसावनि ॥

Dinkara kanyā kūla vihāriṇi.
Kṛṣṇa prāṇa priya hiya hulasāvani.

(Daughter of the sun-clan, roaming in pastures;
Beloved of Krishna, she fills hearts with delight.)

नित्य श्याम तुमरौ गुण गावैं ।
राधा राधा कहि हरषावैं ॥

Nitya Śyāma tumarō guṇa gāvēṁ.
Rādhā Rādhā kahi haraṣāvaiṁ.

(Every day Shyama sings your virtues; shouting 'Radha Radha' they rejoice.)

मुरली में नित नाम उचारें ।
तुव कारण लीला वपु धारें ॥

Murali meṁ nita nāma uccāreṁ.
Tuva kāraṇa līlā vapu dhāreṁ.

(Always uttering your name in the flute’s tune; by your grace Krishna manifests play.)

प्रेम स्वरूपिणि अति सुकुमारी ।
श्याम प्रिया वृषभानु दुलारी ॥

Prema svarūpiṇi ati sukumārī.
Śyāma priyā Vṛṣabhānu dulārī.

(Embodiment of love, exceedingly gentle; beloved of Shyama, cherished of Vṛṣabhānu.)

नवल किशोरी अति छवि धामा ।
द्युति लघु लगै कोटि रति कामा ॥१०

Naval kiśorī ati chavi dhāmā.
Dyuti laghu lagai koṭi rati kāmā.

(New young maid, resplendent abode; her radiance seems like a millionfold delight.)

गौरांगी शशि निंदक बदना ।
सुभग चपल अनियारे नयना ॥

Gaurāṅgī śaśi nindaka badanā.
Subhag chapal aniyāre nayānā.

(Fair as the moon, cheek chidingly lovely; charming, restless eyes.)

जावक युत युग पंकज चरना ।
नूपुर धुनि प्रीतम मन हरना ॥

Jāvaka yuta yug pankaj charanā.
Nūpur dhuni prītam mana haranā.

(Steps like lotus through ages; anklet's music captures the lover’s heart.)

संतत सहचरि सेवा करहीं ।
महा मोद मंगल मन भरहीं ॥

Santata sahacari sevā karahīṁ.
Mahā moda maṅgala mana bharahīṁ.

(Ever attending with companions in service; great joy and auspiciousness fills the heart.)

रसिकन जीवन प्राण अधारा ।
राधा नाम सकल सुख सारा ॥

Rasikan jīvan prāṇ adhārā.
Rādhā nāma sakal sukha sārā.

(To connoisseurs, life and breath; Radha's name is the essence of all happiness.)

अगम अगोचर नित्य स्वरूपा ।
ध्यान धरत निशिदिन ब्रज भूपा ॥

Agama agōcara nitya svarūpā.
Dhyān dharat niśidin Braja bhūpā.

(Incomprehensible, ever-formed; the kings of Braj meditate on her day and night.)

उपजेउ जासु अंश गुण खानी ।
कोटिन उमा रमा ब्रह्मानी ॥

Upajeu jāsu anśa guṇa khānī.
Koṭin Umā Ramā Brahmānī.

(From her arose portions of divine qualities; she is like Umā, Rāma, Brahmā.)

नित्य धाम गोलोक विहारिणि ।
जन रक्षक दुख दोष नसावनि ॥

Nitya dhām Goloka vihāriṇi.
Jana rakṣaka duḥka doṣa nasāvani.

(Ever dwelling in Goloka, she protects people and removes sorrow and faults.)

शिव अज मुनि सनकादिक नारद ।
पार न पाँइ शेष अरु शारद ॥

Śiva aja muni Sanakādika Nārada.
Pār na pāiṁ Śeṣa aru Śārada.

(Shiva, the unborn, sages Sanaka etc. and Narada too cannot fully comprehend her.)

राधा शुभ गुण रूप उजारी ।
निरखि प्रसन्न होत बनवारी ॥

Rādhā śubha guṇa rūpa ujārī.
Nirakhi prasanna hota banvārī.

(Radha's auspicious virtues and radiant form; upon seeing, Banvari becomes pleased.)

ब्रज जीवन धन राधा रानी ।
महिमा अमित न जाय बखानी ॥२०

Braj jīvan dhana Rādhā rānī.
Mahimā amit na jāya bakhānī.

(Radha, queen and treasure of Braj-life; her greatness is immeasurable.)

प्रीतम संग देइ गलबाँही ।
बिहरत नित वृन्दावन माँही ॥

Prītam saṅga dēi galbānhī.
Biharata nita Vṛndāvana māhī.

(She embraces her beloved and stays daily in Vṛndāvana.)

राधा कृष्ण कृष्ण कहैं राधा ।
एक रूप दोउ प्रीति अगाधा ॥

Rādhā Kṛṣṇa Kṛṣṇa kahaiṁ Rādhā.
Eka rūpa dou prīti agādhā.

(Radha and Krishna call each other; one form, two hearts—love fathomless.)

श्री राधा मोहन मन हरनी ।
जन सुख दायक प्रफुलित बदनी ॥

Śrī Rādhā Mohan mana haraṇī.
Jana sukha dāyaka praphulit badanī.

(Sri Radha, enchantress of Mohan; her face brings joy to people's hearts.)

कोटिक रूप धरें नंद नंदा ।
दर्शन करन हित गोकुल चंदा ॥

Koṭik rūp dharēṁ Nanda Nandā.
Darśan karan hit Gokul chanda.

(Millions of forms she assumes; seeing her benefits Gokul and its people.)

रास केलि करि तुम्हें रिझावें ।
मान करौ जब अति दुःख पावें ॥

Rāsa keli kari tumheṁ rizhāvēṁ.
Mān karau jab ati duḥkha pāvēṁ.

(At the Rasa play she charms you; honor comes when great sorrow is found.)

प्रफुलित होत दर्श जब पावें ।
विविध भांति नित विनय सुनावें ॥

Praphulit hota darśa jab pāvēṁ.
Vividha bhānti nita vinaya sunāvēṁ.

(When devotees see her they rejoice, offering many forms of humble praise daily.)

वृन्दारण्य विहारिणि श्यामा ।
नाम लेत पूरण सब कामा ॥

Vṛndāraṇya vihāriṇi Śyāmā.
Nāma lēt pūraṇa sab kāmā.

(Queen of Vṛndāraṇya, by taking her name all desires are fulfilled.)

कोटिन यज्ञ तपस्या करहु ।
विविध नेम व्रत हिय में धरहु ॥

Koṭin yajña tapasya karahu.
Vividh nem vrat hiya meṁ dharahu.

(Observe countless sacrifices and vows; keep many disciplines in the heart.)

तऊ न श्याम भक्तहिं अपनावें ।
जब लगि राधा नाम न गावें ॥

Tau na Śyāma bhaktahiṁ apanāvēṁ.
Jab lagi Rādhā nāma na gāvēṁ.

(Then Shyama will not accept devotees who do not sing Radha's name.)

वृन्दाविपिन स्वामिनी राधा ।
लीला वपु तब अमित अगाधा ॥३०

Vṛndāvipin svāminī Rādhā.
Līlā vapu taba amit agādhā.

(Radha, mistress of Vṛndāvana's groves; her plays are boundless and unfathomable.)

स्वयं कृष्ण पावैं नहिं पारा ।
और तुम्हें को जानन हारा ॥

Svayam Kṛṣṇa pāvēṁ nahiṁ pārā.
Aur tumheṁ ko jānan hārā.

(Even Krishna cannot fully attain you; who else can know you?)

श्री राधा रस प्रीति अभेदा ।
सादर गान करत नित वेदा ॥

Śrī Rādhā rasa prīti abhedā.
Sādara gān karata nita Vēda.

(Sri Radha, essence of love without division; the Vedas chant her daily in reverence.)

राधा त्यागि कृष्ण को भजिहैं ।
ते सपनेहुँ जग जलधि न तरि हैं ॥

Rādhā tyāgi Kṛṣṇa ko bhajihaiṁ.
Tē sapnēhuṁ jag jaladhi na tari haiṁ.

(Radha, renouncing, yet worships Krishna; even oceans cannot wash away the world’s love.)

कीरति कुँवरि लाड़िली राधा ।
सुमिरत सकल मिटहिं भव बाधा ॥

Kīrti kumvarī lāḍilī Rādhā.
Sumirat sakal miṭahiṁ bhav bādhā.

(The famed maiden Radha, beloved and cherished; remembering her removes all worldly obstacles.)

नाम अमंगल मूल नसावन ।
त्रिविध ताप हर हरि मनभावन ॥

Nāma amangaḷ mūla nasāvan.
Trividha tāpa hara hari manbhāvan.

(The name removes all inauspicious roots; it dispels the threefold sufferings, pleasing to Hari.)

राधा नाम लेइ जो कोई ।
सहजहि दामोदर बस होई ॥

Rādhā nāma lēi jo koī.
Sahajahi Dāmodara bas hoi.

(Whoever utters Radha's name, Damodar naturally abides.)

राधा नाम परम सुखदाई ।
भजतहिं कृपा करहिं यदुराई ॥

Rādhā nāma param sukhadāī.
Bhajatahiṁ kṛpā karahiṁ Yadurāī.

(Radha's name is supremely bliss-giving; worshippers obtain Krishna's mercy.)

यशुमति नन्दन पीछे फिरिहैं ।
जो कोऊ राधा नाम सुमिरिहैं ॥

Yaśumati nandan pīchē phirihaṁ.
Jo kou Rādhā nāma sumirihaiṁ.

(The son of Yasoda follows those who remember Radha's name.)

रास विहारिणि श्यामा प्यारी ।
करहु कृपा बरसाने वारी ॥

Rāsa vihāriṇi Śyāmā pyārī.
Karahu kṛpā Barasānē vārī.

(Beloved Shyama, dancer in the Rasa—show mercy to the people of Barsana.)

वृन्दावन है शरण तिहारी ।
जय जय जय वृषभानु दुलारी ॥४०

Vṛndāvana hai śaraṇa tihārī.
Jaya jaya jaya Vṛṣabhānu dulārī.

(Vrindavan is your refuge; hail, hail, Radha, beloved of Vṛṣabhānu.)

॥ दोहा ॥
श्री राधा सर्वेश्वरी,
रसिकेश्वर धनश्याम ।
करहुँ निरंतर बास मैं,
श्री वृन्दावन धाम ॥

Śrī Rādhā sarvēśvarī,
Rasikēśvara Dhanaśyāma.
Karahu nirantara bās main,
Śrī Vṛndāvana dhāma.

(Sri Radha, sovereign of all; Lord of connoisseurs, Dhanashyama.
May I always dwell at the holy Vrindavan abode.)

॥ इति श्री राधा चालीसा ॥`,
  description: 'Radha Chalisa - 40 verses praising Sri Radha (Radha Rani). Includes Hindi original, Roman transliteration and concise English translations. Benefits: devotion to Radha-Krishna, removal of obstacles, spiritual bliss and protection. Duplicate-check before insert.'
};

async function addRadhaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: radhaChalisa.title, deity: 'Radha' });
    if (existing) {
      console.log(`Radha Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(radhaChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${radhaChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const radhaCount = await Devotional.find({ category: 'Chalisa', deity: 'Radha' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Radha Chalisas: ${radhaCount.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Radha Chalisa:', error);
    process.exit(1);
  }
}

addRadhaChalisa();
