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

const durgaChalisa = {
  title: 'Durga Chalisa',
  deity: 'Durga',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `नमो नमो दुर्गे सुख करनी ।
नमो नमो दुर्गे दुःख हरनी ॥
निरंकार है ज्योति तुम्हारी ।
तिहूँ लोक फैली उजियारी ॥

Namo namo Durge sukha karanī.
Namo namo Durge duḥkha haranī.
Nirankāra hai jyoti tumhārī.
Tihūṁ loka phailī ujyārī.

(Salutations to Durga who grants happiness;
Salutations to Durga who removes sorrow.
Your light is formless and your radiance spreads through the three worlds.)

शशि ललाट मुख महाविशाला ।
नेत्र लाल भृकुटि विकराला ॥

Śaśi lalāṭ mukha mahāviśālā.
Netra lāl bhṛkuṭi vikarālā.

(Your forehead like the moon, a great expansive face;
Red eyes and formidable brows.)

रूप मातु को अधिक सुहावे ।
दरश करत जन अति सुख पावे ॥

Rūp mātū ko adhik suhavē.
Daraśa karata jana ati sukha pāvē.

(Mother's form is exceedingly beautiful;
Those who behold you receive great joy.)

तुम संसार शक्ति लै कीना ।
पालन हेतु अन्न धन दीना ॥

Tum sansār śakti lai kīnā.
Pālana hetu anna dhana dīnā.

(You took on the power of the universe;
For preservation you give food and wealth.)

अन्नपूर्णा हुई जग पाला ।
तुम ही आदि सुन्दरी बाला ॥

Annapūrṇā huī jaga pālā.
Tum hī ādi sundarī bālā.

(You became Annapurna who nourishes the world;
You are the original beautiful maiden.)

प्रलयकाल सब नाशन हारी ।
तुम गौरी शिवशंकर प्यारी ॥

Pralayakāla saba nāśana hārī.
Tum Gaurī Śiva-Śaṅkara pyārī.

(You are the destroyer of all at the time of dissolution;
You are Gauri, beloved of Shiva.)

शिव योगी तुम्हरे गुण गावें ।
ब्रह्मा विष्णु तुम्हें नित ध्यावें ॥

Śiva yogī tumhare guṇa gāvē.
Brahmā Viṣṇu tumheṁ nita dhyāvē.

(The yogi Shiva sings your virtues;
Brahma and Vishnu meditate on you constantly.)

रूप सरस्वती को तुम धारा ।
दे सुबुद्धि ऋषि मुनिन उबारा ॥

Rūp Sarasvatī ko tum dhārā.
De subuddhi ṛṣi munin ubārā.

(You assume the form of Saraswati;
Grant wise intellect and uplift the sages.)

धरयो रूप नरसिंह को अम्बा ।
परगट भई फाड़कर खम्बा ॥

Dharayo rūp Narasiṅha ko ambā.
Paragaṭa bhai phāṛakara khambā.

(You took the form of Narasimha mother;
Appeared and tore apart the pillar.)

रक्षा करि प्रह्लाद बचायो ।
हिरण्याक्ष को स्वर्ग पठायो ॥

Rakṣā kari Prahlāda bacāyo.
Hiraṇyākṣa ko svarga paṭhāyo.

(You protected Prahlada and sent Hiranyaksha to heaven.)

लक्ष्मी रूप धरो जग माहीं ।
श्री नारायण अंग समाहीं ॥

Lakṣmī rūpa dharo jaga māhī.
Śrī Nārāyaṇa aṅga samāhī.

(You took the form of Lakshmi in the world;
Sri Narayana embraced your person.)

क्षीरसिन्धु में करत विलासा ।
दयासिन्धु दीजै मन आसा ॥

Kṣīra-sindhu meṁ karata vilāsā.
Dayā-sindhu dījai mana āsā.

(You sport in the ocean of milk;
A sea of compassion gives hope to the heart.)

हिंगलाज में तुम्हीं भवानी ।
महिमा अमित न जात बखानी ॥

Hiṅgalāj meṁ tumhīṁ Bhavānī.
Mahimā amita na jāta bakhānī.

(At Hinglaj you are Bhavani;
Your glory is infinite and cannot be fully told.)

मातंगी अरु धूमावति माता ।
भुवनेश्वरी बगला सुख दाता ॥

Mātaṅgī aru Dhūmāvati mātā.
Bhuvaneśvarī bagalā sukha dātā.

(Mātangī and Dhumavati are mothers;
Bhuvaneshvari bestows happiness.)

श्री भैरव तारा जग तारिणी ।
छिन्न भाल भव दुःख निवारिणी ॥

Śrī Bhairava tārā jaga tāriṇī.
Chinna bhāl bhava duḥkha nivāriṇī.

(With Bhairava you are the savior of the world;
You remove the pains of the severed brow.)

केहरि वाहन सोह भवानी ।
लांगुर वीर चलत अगवानी ॥

Kehari vāhana soha Bhavānī.
Lāṅgura vīra calat agavānī.

(With the tortoise as mount you are beautiful Bhavani;
The brave monkey leads the charge.)

कर में खप्पर खड्ग विराजै ।
जाको देख काल डर भाजै ॥

Kara meṁ khappar khaḍga virājai.
Jāko dekh kāla ḍar bhājai.

(In your hand a bowl and sword shine;
He who sees you, fear of death flees.)

सोहै अस्त्र और त्रिशूला ।
जाते उठत शत्रु हिय शूला ॥

Sohai astra aur triśūlā.
Jāte uṭhat śatru hiya śūlā.

(Arms and trident adorn you;
Enemies pierced by your spear fall away.)

नगरकोट में तुम्हीं विराजत ।
तिहुँलोक में डंका बाजत ॥

Nagarakoṭ meṁ tumhīṁ virājat.
Tihūṁ-loka meṁ ḍaṅkā bājat.

(You dwell in the fortress of the city;
Your fame rings through the three worlds.)

शुम्भ निशुम्भ दानव तुम मारे ।
रक्तबीज शंखन संहारे ॥

Śumbha Niśumbha dānava tum mārē.
Rakta-bīja śaṅkhana saṁhāre.

(You slew the demons Shumbha and Nishumbha;
Destroyed the army sprung from Rakta-bija.)

महिषासुर नृप अति अभिमानी ।
जेहि अघ भार मही अकुलानी ॥

Mahiṣāsura nr̥pa ati abhimānī.
Jehi agha bhāra mahī akulānī.

(Mahishasura, the proud king, whose burden shook the earth.)

रूप कराल कालिका धारा ।
सेन सहित तुम तिहि संहारा ॥

Rūp karāl Kālika dhārā.
Sēna sahit tum tihi saṁhārā.

(You assume the terrible form of Kalika;
With armies you destroy them.)

परी गाढ़ सन्तन पर जब जब ।
भई सहाय मातु तुम तब तब ॥

Pari gāṛha santan para jaba jaba.
Bhai sahāya mātū tum taba taba.

(Whenever devotees are besieged, you become their help, O Mother.)

अमरपुरी अरु बासव लोका ।
तब महिमा सब रहें अशोका ॥

Amarpurī aru Bāsava lokā.
Tab mahimā saba rahēṁ aśokā.

(In immortal realms and Vasava's world your glory remains.)

ज्वाला में है ज्योति तुम्हारी ।
तुम्हें सदा पूजें नरनारी ॥

Jvālā meṁ hai jyoti tumhārī.
Tumheṁ sadā pūjeṁ nara-nārī.

(Your light is in the flame; men and women always worship you.)

प्रेम भक्ति से जो यश गावें ।
दुःख दारिद्र निकट नहिं आवें ॥

Prema bhakti se jo yaśa gāvē.
Duḥkha dāridra nikaṭa nahiṁ āvēṁ.

(Those who sing your praise with love and devotion,
Suffering and poverty never come near.)

ध्यावे तुम्हें जो नर मन लाई ।
जन्ममरण ताकौ छुटि जाई ॥

Dhyāve tumheṁ jo nara mana lāī.
Janma-maraṇa tākau chuṭi jāī.

(Whoever meditates on you with mind and heart,
Is freed from the cycle of birth and death.)

जोगी सुर मुनि कहत पुकारी ।
योग न हो बिन शक्ति तुम्हारी ॥

Yogī sur muni kahata pukārī.
Yōg na ho bina śakti tumhārī.

(Yogis, gods and sages proclaim: without your power no yoga is possible.)

शंकर आचारज तप कीनो ।
काम अरु क्रोध जीति सब लीनो ॥

Śaṅkara ācārāj tapa kīno.
Kāma aru krodha jīti saba līno.

(Shankar, the teacher, performed austerities;
Conquered desire and anger and subdued all.)

निशिदिन ध्यान धरो शंकर को ।
काहु काल नहिं सुमिरो तुमको ॥

Niśidin dhyān dharo Śaṅkara ko.
Kāhu kāla nahiṁ sumiro tumko.

(Day and night meditate on Shankar;
At no time forget you.)

शक्ति रूप का मरम न पायो ।
शक्ति गई तब मन पछितायो ॥

Śakti rūp kā maram na pāyo.
Śakti gaī taba mana pachtāyō.

(If one does not obtain the essence of Shakti's form,
When Shakti departs the mind regrets.)

शरणागत हुई कीर्ति बखानी ।
जय जय जय जगदम्ब भवानी ॥

Śaraṇāgata huī kīrti bakhānī.
Jaya jaya jaya Jagadamba Bhavānī.

(The glory of those who took refuge is sung;
Victory, victory, victory to Jagdamba Bhavani.)

भई प्रसन्न आदि जगदम्बा ।
दई शक्ति नहिं कीन विलम्बा ॥

Bhai prasanna ādi Jagadambā.
Dai śakti nahiṁ kīna vilambā.

(The primal mother Jagdamba became pleased;
She grants power without delay.)

मोको मातु कष्ट अति घेरो ।
तुम बिन कौन हरै दुःख मेरो ॥

Moko mātū kaṣṭa ati gherō.
Tum bin kaun harai duḥkha mērō.

(Mother, my troubles surround me;
Without you who removes my sorrow?)

आशा तृष्णा निपट सतावें ।
मोह मदादिक सब बिनशावें ॥

Āśā tṛṣṇā nipat satāvēṁ.
Moh madādik saba binaśāvēṁ.

(Hope and thirst torment; attachment, pride and the like are destroyed.)

शत्रु नाश कीजै महारानी ।
सुमिरौं इकचित तुम्हें भवानी ॥

Śatru nāśa kījai Mahārānī.
Sumiraūṁ ika-cit tumheṁ Bhavānī.

(O Great Queen, destroy my enemies;
I remember you with a single thought.)

करो कृपा हे मातु दयाला ।
ऋद्धिसिद्धि दै करहु निहाला ॥

Karo kṛpā he mātū dayālā.
Riddhi-siddhi dai karahu nihālā.

(Show mercy, O compassionate Mother;
Grant riches and spiritual attainments.)

जब लगि जिऊँ दया फल पाऊँ ।
तुम्हरो यश मैं सदा सुनाऊँ ॥

Jab lagi jīūṁ dayā phal pāūṁ.
Tumharo yaśa maiṁ sadā sunāūṁ.

(When I receive mercy and its fruit,
I will forever sing your praise.)

श्री दुर्गा चालीसा जो कोई गावै ।
सब सुख भोग परमपद पावै ॥४०

Śrī Durga Chālīsā jo koī gāvē.
Sab sukha bhoga paramapada pāvē.

(Whoever sings the Durga Chalisa enjoys all happiness and attains the supreme abode.)

देवीदास शरण निज जानी ।
कहु कृपा जगदम्ब भवानी ॥

Devīdāsa śaraṇa nija jānī.
Kahu kṛpā Jagadamba Bhavānī.

(Devīdas takes refuge; say, show mercy Jagadamba Bhavani.)

दोहा:
शरणागत रक्षा करे,
भक्त रहे नि:शंक ।
मैं आया तेरी शरण में,
मातु लिजिये अंक ॥

Śaraṇāgata rakṣā kare,
Bhakta rahe niśaṅka.
Main āyā terī śaraṇa meṁ,
Mātū lijiyē anka.

(Refuge protects the surrendered; the devotee remains without fear.
I have come into your shelter; Mother, take me under your care.)

॥ इति श्री दुर्गा चालीसा संपूर्ण ॥

(End of Sri Durga Chalisa)` ,
  description: 'Durga Chalisa - 40 verses praising Goddess Durga (Jagadamba/Bhavani). Includes Hindi lyrics with Roman transliteration and English translation, devotional context, benefits and insertion metadata. Inserted with duplicate-check to avoid multiple copies.'
};

async function addDurgaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: durgaChalisa.title, deity: 'Durga' });
    if (existing) {
      console.log(`Durga Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(durgaChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${durgaChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const durgaCount = await Devotional.find({ category: 'Chalisa', deity: 'Durga' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Durga Chalisas: ${durgaCount.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Durga Chalisa:', error);
    process.exit(1);
  }
}

addDurgaChalisa();
