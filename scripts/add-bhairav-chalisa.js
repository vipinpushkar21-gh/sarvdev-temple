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

const bhairavChalisa = {
  title: 'Bhairav Chalisa',
  deity: 'Bhairav',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
श्री गणपति गुरु गौरी पद
प्रेम सहित धरि माथ ।
चालीसा वंदन करो
श्री शिव भैरवनाथ ॥
श्री भैरव संकट हरण
मंगल करण कृपाल ।
श्याम वरण विकराल वपु
लोचन लाल विशाल ॥

Śrī Gaṇapati guru Gaurī pada
Prema sahit dhari mātha.
Chālīsā vandana karo
Śrī Śiva Bhairavānātha.

Śrī Bhairav saṅkaṭ hana
Maṅgala karaṇa kṛpāla.
Śyāma varṇa vikarāla vapu
Locana lāla viśāla.

(Praise Ganesha, the teacher and Gauri's feet; with love fold your head.
Begin the Chalisa in salutation to Shiva Bhairava — remover of troubles, merciful grantor of auspiciousness. Dark-hued, fierce-bodied, with large red eyes.)

॥ चौपाई ॥
जय जय श्री काली के लाला ।
जयति जयति काशी-कुतवाला ॥

Jaya jaya Śrī Kālī ke lālā.
Jayati jayati Kāśī-kotavālā.

(Hail, hail — son of Kali! Hail the renowned Kotwal of Kashi.)

जयति बटुक-भैरव भय हारी ।
जयति काल-भैरव बलकारी ॥

Jayati Baṭuk-Bhairav bhaya hārī.
Jayati Kāla-Bhairav balakārī.

(Hail Batuk-Bhairav who destroys fear; Hail Kala-Bhairav, the mighty one.)

जयति नाथ-भैरव विख्याता ।
जयति सर्व-भैरव सुखदाता ॥

Jayati Nātha-Bhairav vikhyātā.
Jayati sarva-Bhairav sukhadātā.

(Hail Lord Bhairav renowned everywhere; hail Bhairav who gives happiness to all.)

भैरव रूप कियो शिव धारण ।
भव के भार उतारण कारण ॥

Bhairav rūpa kiyo Śiva dhāraṇa.
Bhava ke bhāra utāraṇa kāraṇa.

(Shiva took the form of Bhairav to lift the burden of worldly existence.)

भैरव रव सुनि हवै भय दूरी ।
सब विधि होय कामना पूरी ॥

Bhairav rava suni havai bhaya dūrī.
Sab vidhi hoye kāmanā pūrī.

(The fame of Bhairav removes fear; all wishes are fulfilled in every way.)

शेष महेश आदि गुण गायो ।
काशी-कोतवाल कहलायो ॥

Śeṣa Maheśa ādi guṇa gāyo.
Kāśī-kotavāl kehlāyo.

(The attributes of Mahesha and the like are sung; he is hailed as the Kotwal (guardian) of Kashi.)

जटा जूट शिर चंद्र विराजत ।
बाला मुकुट बिजायठ साजत ॥

Jaṭā jūṭa śira candra virājat.
Bālā mukuṭa bijāyṭha sājata.

(Matted locks crowned with the moon shine on his head; child-crown and armaments adorn him.)

कटि करधनी घुंघरू बाजत ।
दर्शन करत सकल भय भाजत ॥

Kaṭi karadhani ghungharū bājata.
Darśana karata sakala bhaya bhājata.

(Bells on the waist and arm clamor; seeing him all fear disperses.)

जीवन दान दास को दीन्ह्यो ।
कीन्ह्यो कृपा नाथ तब चीन्ह्यो ॥

Jīvana dāna dāsa ko dīnhyo.
Kīnhyo kṛpā nātha taba cīnhyo.

(He bestowed life and gave mercy — devotees know him as protector.)

वसि रसना बनि सारद-काली ।
दीन्ह्यो वर राख्यो मम लाली ॥

Vasi rasnā bani sārada-kālī.
Dīnhyo vara rākhyō mama lālī.

(His speech becomes the essence of Saraswati and Kali; he granted boons and protected me.)

धन्य धन्य भैरव भय भंजन ।
जय मनरंजन खल दल भंजन ॥

Dhanya dhanya Bhairav bhaya bhajan.
Jaya manarañjana khal dal bhajan.

(Blest, blest is Bhairav who destroys fear; victory to the delight of the heart, scattering the wicked.)

कर त्रिशूल डमरू शुचि कोड़ा ।
कृपा कटाक्ष सुयश नहिं थोडा ॥

Kara triśūla damarū śuci koṛā.
Kṛpā kaṭākṣa suyaśa nahīṁ thōḍā.

(His hand holds trident, drum and staff; with a glance of mercy fame is not small.)

जो भैरव निर्भय गुण गावत ।
अष्टसिद्धि नव निधि फल पावत ॥

Jo Bhairav nirbhaya guṇa gāvat.
Aṣṭasiddhi nava nidhi phal pāvat.

(Whoever sings Bhairav's fearless virtues gains the eight siddhis and nine treasures.)

रूप विशाल कठिन दुख मोचन ।
क्रोध कराल लाल दुहुं लोचन ॥

Rūpa viśāla kaṭhina duḥkha mōcan.
Krodha karāla lāla duhuṁ locana.

(His vast form removes severe suffering; fearsome with red twin eyes and wrathful anger.)

अगणित भूत प्रेत संग डोलत ।
बम बम बम शिव बम बम बोलत ॥

Agaṇita bhūta preta saṅga ḍōlata.
Bam bam bam Śiva bam bam bolata.

(Countless spirits and ghosts accompany him chanting "Bam Bam Bam Shiva").

रुद्रकाय काली के लाला ।
महा कालहू के हो काला ॥

Rudrakāya Kālī ke lālā.
Mahā Kālahu ke ho kālā.

(He is Rudra-bodied, son of Kali; the great Kala himself, dark and fearsome.)

बटुक नाथ हो काल गंभीरा ।
श्‍वेत रक्त अरु श्याम शरीरा ॥

Baṭuk nātha ho kāla gambhīrā.
Śveta rakta aru śyāma sharīrā.

(Child-lord, solemn as Kala; white, red and dark complexions.)

करत नीनहूं रूप प्रकाशा ।
भरत सुभक्तन कहं शुभ आशा ॥

Karat nīnahūṁ rūpa prakāśā.
Bharata subhaktaṁ kahaṁ śubha āśā.

(Showing his manifest form, he gives good hope to true devotees.)

रत्‍न जड़ित कंचन सिंहासन ।
व्याघ्र चर्म शुचि नर्म सुआनन ॥

Ratna jaḍita kanchana siṁhāsana.
Vyāghra carma śuci narma su-ānana.

(Gold and gem-studded throne; tiger-hide seat and pure soft face.)

तुमहि जाइ काशिहिं जन ध्यावहिं ।
विश्वनाथ कहं दर्शन पावहिं ॥

Tumahi jāi Kāśihiṁ jana dhyāvahiṁ.
Viśvanātha kahaṁ darśana pāvahiṁ.

(Those who meditate on you in Kashi behold Visvanatha's vision.)

जय प्रभु संहारक सुनन्द जय ।
जय उन्नत हर उमा नन्द जय ॥

Jaya prabhu saṁhāraka sunanda jaya.
Jaya unnata hara umā nanda jaya.

(Victory to the Lord, the destroyer, praised by Sunanda; victory to the exalted, son of Uma, praise.)

भीम त्रिलोचन स्वान साथ जय ।
वैजनाथ श्री जगतनाथ जय ॥

Bhīma trilocana svān sātha jaya.
Vaijanātha śrī jagatanātha jaya.

(Hail the terrible three-eyed one with dogs at his side; hail Vaijnath, Lord of the world.)

महा भीम भीषण शरीर जय ।
रुद्र त्रयम्बक धीर वीर जय ॥

Mahā Bhīma bhīṣaṇa śarīra jaya.
Rudra Trayambaka dhīra vīra jaya.

(Hail the great terrifying Bhima; hail the steadfast Rudra Trayambaka.)

अश्‍वनाथ जय प्रेतनाथ जय ।
स्वानारुढ़ सयचंद्र नाथ जय ॥

Aśvanātha jaya prētanātha jaya.
Svānāruḍha saya-candra nātha jaya.

(Hail Ashvanatha, hail Pretanatha; hail Lord who rides dogs and moon.)

निमिष दिगंबर चक्रनाथ जय ।
गहत अनाथन नाथ हाथ जय ॥

Nimiṣa digambara cakranātha jaya.
Gahata anāthana nātha hātha jaya.

(Hail the naked one with the eye, the lord of the chakra; holding orphans in his hand.)

त्रेशलेश भूतेश चंद्र जय ।
क्रोध वत्स अमरेश नन्द जय ॥

Treśaleśa bhūteśa candra jaya.
Krodha vatsa amareśa nanda jaya.

(Hail Treshalesh, Bhutesh and Chandra; hail the wrathful son Amarendra.)

श्री वामन नकुलेश चण्ड जय ।
कृत्याऊ कीरति प्रचण्ड जय ॥

Śrī Vāmana Nakuleśa chaṇḍa jaya.
Kṛtyāu kīrti pracaṇḍa jaya.

(Hail Vamana, Nakulesh and fierce Chanda; hail the mighty famed ones.)

रुद्र बटुक क्रोधेश कालधर ।
चक्र तुण्ड दश पाणिव्याल धर ॥

Rudra baṭuk krodheśa kāladhara.
Cakra tuṇḍa daśa pāṇivyāla dhara.

(Rudra Batuk, Lord of anger Kalahdhara; the holder of the chakra-tunda and ten serpentine arms.)

करि मद पान शम्भु गुणगावत ।
चौंसठ योगिन संग नचावत ॥

Kari mad pāna Śambhu guṇagāvata.
Cauṁsaṭha yogin saṅga nacāvata.

(Drunk with divine nectar he sings Shiva's virtues; he dances with the sixty-four yoginis.)

करत कृपा जन पर बहु ढंगा ।
काशी कोतवाल अड़बंगा ॥

Karat kṛpā jana para bahu ḍhanga.
Kāśī kotavāl aḍbaṅga.

(He shows abundant grace to people; guardian Kotwal of Kashi, brave and strong.)

देयं काल भैरव जब सोटा ।
नसै पाप मोटा से मोटा ॥

Deyaṁ kāla Bhairav jab sōṭā.
Nasai pāpa mōṭā se mōṭā.

(When Kala Bhairav lashes, sins are worn away, great to greater.)

जनकर निर्मल होय शरीरा ।
मिटै सकल संकट भव पीरा ॥

Janakara nirmala hoya śarīrā.
Miṭai sakala saṅkaṭa bhava pīrā.

(One's body becomes purified and all worldly sufferings and crises are removed.)

श्री भैरव भूतों के राजा ।
बाधा हरत करत शुभ काजा ॥

Śrī Bhairav bhūtoṁ ke rājā.
Bādhā harata karata śubha kājā.

(Sri Bhairav is king of ghosts; he removes obstacles and accomplishes auspicious works.)

ऐलादी के दुख निवारयो ।
सदा कृपाकरि काज सम्हारयो ॥

Ailādi ke duḥkha nivāra yo.
Sadā kṛpākāri kāj sam'hāryo.

(He relieves the sorrows of ailment and always kindly oversees tasks.)

सुन्दर दास सहित अनुरागा ।
श्री दुर्वासा निकट प्रयागा ॥

Sundara dāsa sahita anurāgā.
Śrī Durvāsā nikaṭa Prayāgā.

(With Sundardas and devotees he draws near Durvasa to Prayag.)

श्री भैरव जी की जय लेख्यो ।
सकल कामना पूरण देख्यो ॥

Śrī Bhairav jī kī jaya lekhyo.
Sakala kāmanā pūraṇa dēkhyo.

(Praise be to Sri Bhairavji; see all desires fulfilled.)

॥ दोहा ॥
जय जय जय भैरव बटुक स्वामी संकट टार ।
कृपा दास पर कीजिए शंकर के अवतार ॥

Jaya jaya jaya Bhairav Baṭuk svāmī saṅkaṭa ṭār.
Kṛpā dāsa para kījīē Śaṁkara ke avatāra.

(Hail, hail, hail Bhairav Batuk Swami, remover of crises; show mercy on your servant as Shiva's incarnation.)
` ,
  description: 'Bhairav Chalisa - 40-verse Chalisa praising Bhairav/Bhairavnath (guardian of Kashi). Includes Hindi lyrics with Roman transliteration and English translation. Benefits: protection from fear and obstacles, removal of sins, fulfillment of wishes. Duplicate-check before insert.'
};

async function addBhairavChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: bhairavChalisa.title, deity: 'Bhairav' });
    if (existing) {
      console.log(`Bhairav Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(bhairavChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${bhairavChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const bhairavCount = await Devotional.find({ category: 'Chalisa', deity: 'Bhairav' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Bhairav Chalisas: ${bhairavCount.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Bhairav Chalisa:', error);
    process.exit(1);
  }
}

addBhairavChalisa();
