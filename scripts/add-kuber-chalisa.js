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

const kuberChalisa = {
  title: 'Kuber Chalisa',
  deity: 'Kuber',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
जैसे अटल हिमालय,
और जैसे अडिग सुमेर ।
ऐसे ही स्वर्ग द्वार पे,
अविचल खडे कुबेर ॥
विघ्न हरण मंगल करण,
सुनो शरणागत की टेर ।
भक्त हेतु वितरण करो,
धन माया के ढेर ॥

Jaise aṭal Himālaya,
Aur jaise aḍig Sumer.
Aise hī svarga dvār pe,
Avical khaṛe Kuber.

(Like the steadfast Himalaya and the immovable Sumeru,
Thus stands Kubera at the gates of heaven—unshaken.)

Vighna haran maṅgala karaṇ,
Suno śaraṇāgata kī ṭer.
Bhakta hetu vitaran karo,
Dhana māyā ke ḍher.

(Remover of obstacles and bestower of auspiciousness,
Hear the supplication of the surrendered; distribute wealth for devotees.)

॥ चौपाई ॥
जै जै जै श्री कुबेर भण्डारी ।
धन माया के तुम अधिकारी ॥

Jai jai jai Śrī Kuber Bhanḍārī.
Dhana māyā ke tum adhikārī.

(Hail, hail, hail Lord Kubera, treasurer of riches;
You are the lord of wealth and material abundance.)

तप तेज पुंज निर्भय भय हारी ।
पवन वेग सम सम तनु बलधारी ॥

Tap teja puñj nirbhaya bhaya hārī.
Pavana vega sama sama tanu baladhārī.

(Austerity's blaze—fearless and victorious;
Strength like the wind, power equal and steadfast.)

स्वर्ग द्वार की करें पहरे दारी ।
सेवक इंद्र देव के आज्ञाकारी ॥

Svarga dvār kī karēṁ pahare dārī.
Sevak Indra dev ke ājñākārī.

(He guards the gates of heaven, obedient captain of Indra's servants.)

यक्ष यक्षणी की है सेना भारी ।
सेनापति बने युद्ध में धनुधारी ॥

Yakṣa yakṣaṇī kī hai senā bhārī.
Senāpati bane yuddh meṁ dhanudhārī.

(His army of yakshas and yakshinis is mighty;
Their general bears arms in battle.)

महा योद्धा बन शस्त्र धारैं ।
युद्ध करैं शत्रु को मारैं ॥

Mahā yoddhā ban śastra dhārēṁ.
Yuddha karēṁ śatru ko mārēṁ.

(They become great warriors, wielding weapons and slaying foes.)

सदा विजयी कभी ना हारैं ।
भगत जनों के संकट टारैं ॥

Sadā vijayī kabhī nā hārēṁ.
Bhagat janōṁ ke saṅkaṭa ṭārēṁ.

(Always victorious, never defeated; they rescue devotees from danger.)

प्रपितामह हैं स्वयं विधाता ।
पुलिस्ता वंश के जन्म विख्याता ॥

Prapitāmah hain svayam vidhātā.
Pulistā vaṁś ke janma vikhyātā.

(He is the grandfatherly creator, famed as born in the Pulista line.)

विश्रवा पिता इडविडा जी माता ।
विभीषण भगत आपके भ्राता ॥

Vishrava pitā Iḍaviḍā jī mātā.
Vibhīṣaṇa bhagat āpke bhrātā.

(Vishrava as father, Idavida as mother; Vibhishana counted among your devotees.)

शिव चरणों में जब ध्यान लगाया ।
घोर तपस्या करी तन को सुखाया ॥

Śiva caraṇōṁ meṁ jab dhyān lagāyā.
Ghor tapasyā karī tana ko sukhāyā.

(When you meditated at Shiva's feet, you performed severe penances and purified the body.)

शिव वरदान मिले देवत्य पाया ।
अमृत पान करी अमर हुई काया ॥

Śiva vardān milē devatya pāyā.
Amṛta pān karī amar huī kāyā.

(You received Shiva's boon, tasted ambrosia, and your body became immortal.)

धर्म ध्वजा सदा लिए हाथ में ।
देवी देवता सब फिरैं साथ में ॥

Dharma dhvajā sadā liyē hāth meṁ.
Devī devatā sab phirēṁ sāth meṁ.

(You hold the banner of dharma; gods and goddesses accompany you.)

पीताम्बर वस्त्र पहने गात में ।
बल शक्ति पूरी यक्ष जात में ॥

Pītāmbara vastra pahnē gāt meṁ.
Bala śakti pūrī yakṣa jāta meṁ.

(Clad in yellow garments and full of power typical of the yaksha clan.)

स्वर्ण सिंहासन आप विराजैं ।
त्रिशूल गदा हाथ में साजैं ॥

Svaraṇa siṃhāsana āp virājēṁ.
Triśūla gadā hāth meṁ sājēṁ.

(You sit on a golden throne, holding trident and mace.)

शंख मृदंग नगारे बाजैं ।
गंधर्व राग मधुर स्वर गाजैं ॥

Śaṅkha mṛdaṅga nagārē bājēṁ.
Gandharva rāga madhura svara gājēṁ.

(Conch, drums and kettledrums resound, and gandharvas sing sweet melodies.)

चौंसठ योगनी मंगल गावैं ।
ऋद्धि-सिद्धि नित भोग लगावैं ॥

Chauṁsaṭh yōganī maṅgala gāvēṁ.
Riddhi-siddhi nita bhōga lagāvēṁ.

(Sixty-four yoginis sing auspiciously; Riddhi and Siddhi enjoy offerings daily.)

दास दासनी सिर छत्र फिरावैं ।
यक्ष यक्षणी मिल चंवर ढूलावैं ॥

Dās dāsanī sir chatra phirāvēṁ.
Yakṣa yakṣaṇī mil chaṁvar ḍhūlāvēṁ.

(Servants and maidens hold umbrellas and fan with chauris.)

ऋषियों में जैसे परशुराम बली हैं ।
देवन्ह में जैसे हनुमान बली हैं ॥

Ṛṣiōṁ meṁ jaise Paraśurām balī haiṁ.
Devanh meṁ jaise Hanumān balī haiṁ.

(Among rishis Parashurama is mighty; among gods Hanuman is strong.)

पुरुषों में जैसे भीम बली हैं ।
यक्षों में ऐसे ही कुबेर बली हैं ॥

Puruṣōṁ meṁ jaise Bhīma balī haiṁ.
Yakṣōṁ meṁ aisē hī Kuber balī haiṁ.

(Among men Bhima is powerful; among yakshas Kubera is mighty.)

भगतों में जैसे प्रहलाद बड़े हैं ।
पक्षियों में जैसे गरुड़ बड़े हैं ॥

Bhagatōṁ meṁ jaise Prahlāda baṛē haiṁ.
Pakṣiyōṁ meṁ jaise Garuḍa baṛē haiṁ.

(Among devotees Prahlada is great; among birds Garuda is supreme.)

नागों में जैसे शेष बड़े हैं ।
वैसे ही भगत कुबेर बड़े हैं ॥

Nāgōṁ meṁ jaise Śeṣa baṛē haiṁ.
Vaiśē hī bhagat Kuber baṛē haiṁ.

(Among serpents Shesha is great; likewise Kubera is great among devotees.)

कांधे धनुष हाथ में भाला ।
गले फूलों की पहनी माला ॥

Kāndhē dhanush hāth meṁ bhālā.
Galē phūlōṁ kī pahnī mālā.

(With bow slung on shoulder and a spear in hand; garland of flowers about the neck.)

स्वर्ण मुकुट अरु देह विशाला ।
दूर-दूर तक होए उजाला ॥

Svarṇa mukuta aru deha viśālā.
Dūr-dūr tak hōē ujalā.

(Golden crown and broad-bodied, his radiance spreads far.)

कुबेर देव को जो मन में धारे ।
सदा विजय हो कभी न हारे ॥

Kuber dēva kō jō man meṁ dhārē.
Sadā vijay hō kabhī nā hārē.

(Whoever keeps Kubera in heart is always victorious and never defeated.)

बिगड़े काम बन जाएं सारे ।
अन्न धन के रहें भरे भण्डारे ॥

Bigṛē kāma ban jāēṁ sāre.
Anna dhana kē rahēṁ bhare bhaṇḍārē.

(Broken tasks are completed; granaries remain full of food and wealth.)

कुबेर गरीब को आप उभारैं ।
कुबेर कर्ज को शीघ्र उतारैं ॥

Kuber garīb kō āp ubhārēṁ.
Kuber karj kō śīghra utārēṁ.

(Kubera uplifts the poor; he quickly removes debts.)

कुबेर भगत के संकट टारैं ।
कुबेर शत्रु को क्षण में मारैं ॥

Kuber bhagat kē saṅkaṭa ṭārēṁ.
Kuber śatru kō kṣaṇa mēṁ mārēṁ.

(He rescues devotees from trouble and strikes down enemies in an instant.)

शीघ्र धनी जो होना चाहे ।
क्युं नहीं यक्ष कुबेर मनाएं ॥

Śīghra dhanī jō hōnā cāhē.
Kyuṁ nahīṁ yakṣa Kuber manā'ēṁ.

(Those who wish to become wealthy quickly should invoke Yaksha Kubera.)

यह पाठ जो पढ़े पढ़ाएं ।
दिन दुगना व्यापार बढ़ाएं ॥

Yah pāṭh jō paṛhē paṛhā'ēṁ.
Din dugnā vyāpār baḍhā'ēṁ.

(Whoever reads and causes others to read this will double their business daily.)

भूत प्रेत को कुबेर भगावैं ।
अड़े काम को कुबेर बनावैं ॥

Bhūt prēt kō Kuber bhagāvēṁ.
Aṛē kāma kō Kuber banāvēṁ.

(He drives away spirits and resolves stalled affairs.)

रोग शोक को कुबेर नशावैं ।
कलंक कोढ़ को कुबेर हटावैं ॥

Rōg śōk kō Kuber naśāvēṁ.
Kalaṅka kōḍh kō Kuber haṭāvēṁ.

(He eradicates disease and grief; removes taints and leprosy.)

कुबेर चढ़े को और चढ़ादे ।
कुबेर गिरे को पुन: उठा दे ॥

Kuber chaṛhē kō aur chaṛhādē.
Kuber girē kō puna: uṭhā dē.

(Kubera elevates those who rise and raises those who have fallen.)

कुबेर भाग्य को तुरंत जगा दे ।
कुबेर भूले को राह बता दे ॥

Kuber bhāgya kō turant jagā dē.
Kuber bhūlē kō rāh batā dē.

(Kubera awakens fortune instantly and shows the lost their path.)

प्यासे की प्यास कुबेर बुझा दे ।
भूखे की भूख कुबेर मिटा दे ॥

Pyāsē kī pyās Kuber bujhā dē.
Bhūkhē kī bhūkh Kuber miṭā dē.

(Kubera quenches the thirsty and satisfies the hungry.)

रोगी का रोग कुबेर घटा दे ।
दुखिया का दुख कुबेर छुटा दे ॥

Rōgī kā rōg Kuber ghaṭā dē.
Dukhiyā kā dukh Kuber chuṭā dē.

(He reduces the disease of the sick and relieves the sorrowful.)

बांझ की गोद कुबेर भरा दे ।
कारोबार को कुबेर बढ़ा दे ॥

Bāñjh kī gōd Kuber bharā dē.
Kārōbār kō Kuber baḍhā dē.

(Fills the wombs of the barren and increases business.)

कारागार से कुबेर छुड़ा दे ।
चोर ठगों से कुबेर बचा दे ॥

Kārāgār sē Kuber chuṛā dē.
Chōr ṭhagōṁ sē Kuber bacā dē.

(He frees from prison and protects from thieves and frauds.)

कोर्ट केस में कुबेर जितावै ।
जो कुबेर को मन में ध्यावै ॥

Kōrṭ kēs meṁ Kuber jitāvai.
Jō Kuber kō man meṁ dhyāvai.

(He grants victory in court cases to those who meditate on him.)

चुनाव में जीत कुबेर करावैं ।
मंत्री पद पर कुबेर बिठावैं ॥

Chunāv meṁ jīt Kuber karāvai.
Mantrī pad par Kuber biṭhāvai.

(He grants victory in elections and places devotees in ministerial posts.)

पाठ करे जो नित मन लाई ।
उसकी कला हो सदा सवाई ॥

Pāṭh karē jō nit man lā'ī.
Uskī kalā hō sadā savā'ī.

(Whoever recites daily will always prosper in skill and art.)

जिसपे प्रसन्न कुबेर की माई ।
उसका जीवन चले सुखदाई ॥

Jispē prasanna Kuber kī māī.
Uskā jīvan calē sukhadā'ī.

(If Kubera's mother is pleased with someone, that person's life becomes joyful.)

जो कुबेर का पाठ करावै ।
उसका बेड़ा पार लगावै ॥

Jō Kuber kā pāṭh karāvai.
Uskā beṛā pāra lagāvai.

(Whoever causes this Chalisa to be read will have their boat carried across.):

उजड़े घर को पुन: बसावै ।
शत्रु को भी मित्र बनावै ॥

Ujaṛē ghar kō puna: basāvai.
Śatru kō bhī mitra banāvai.

(Restores ruined homes and even turns enemies into friends.)

सहस्त्र पुस्तक जो दान कराई ।
सब सुख भोद पदार्थ पाई ॥

Sahastra pustak jō dān karā'ī.
Sab sukh bhōda padārtha pā'ī.

(Whoever donates a thousand books gains all auspicious wealth.)

प्राण त्याग कर स्वर्ग में जाई ।
मानस परिवार कुबेर कीर्ति गाई ॥

Prāṇa tyāga kar svarga meṁ jā'ī.
Mānas parivār Kuber kīrti gā'ī.

(By giving up life one goes to heaven; the family sings Kubera's fame.)

॥ दोहा ॥
शिव भक्तों में अग्रणी,
श्री यक्षराज कुबेर ।
हृदय में ज्ञान प्रकाश भर,
कर दो दूर अंधेर ॥

Śiva bhaktōṁ meṁ agrāṇī,
Śrī Yakṣarāj Kuber.
Hṛdaya meṁ jñāna prakāśa bhara,
Kar do dūr andhar.

(Leader among Shiva's devotees, Lord Yaksha-king Kubera;
Fill the heart with luminous knowledge and dispel the darkness.)

कर दो दूर अंधेर अब,
जरा करो ना देर ।
शरण पड़ा हूं आपकी,
दया की दृष्टि फेर ॥

Kar do dūr andhar ab,
Jarā karo nā dēr.
Śaraṇ paṛā hūṁ āpkī,
Dayā kī dṛṣṭi phēr.

(Drive away darkness now; do not delay. I have taken refuge in you—turn your merciful gaze.)

नित्त नेम कर प्रातः ही,
पाठ करौं चालीसा ।
तुम मेरी मनोकामना,
पूर्ण करो जगदीश ॥

Nit nem kar prātaḥ hī,
Pāṭh karauṁ chālīsā.
Tum merī manōkāmanā,
Pūrṇa karō Jagadīś.

(Observe the daily rule at dawn; recite the Chalisa. Fulfill my wish, O Lord of the world.)

मगसर छठि हेमन्त ॠतु,
संवत चौसठ जान ।
अस्तुति चालीसा शिवहि,
पूर्ण कीन कल्याण ॥

Magasara chaṭhi hemanta r̥tu,
Samvat cā'usṭha jān.
Astuṭi chālīsā Śivahi,
Pūrṇa kīna kalyāṇa.

(May this Chalisa praise Shiva and accomplish auspiciousness.)`,
  description: 'Kuber Chalisa - Hindi original with Roman transliteration and English translation. Praises Lord Kuber (Yaksha-raj), benefits include wealth, protection, removal of obstacles and success. Duplicate-check before insert.'
};

async function addKuberChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: kuberChalisa.title, deity: 'Kuber' });
    if (existing) {
      console.log(`Kuber Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(kuberChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${kuberChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const kuberCount = await Devotional.find({ category: 'Chalisa', deity: 'Kuber' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Kuber Chalisas: ${kuberCount.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Kuber Chalisa:', error);
    process.exit(1);
  }
}

addKuberChalisa();
