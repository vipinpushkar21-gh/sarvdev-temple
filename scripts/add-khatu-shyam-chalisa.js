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

const khatuShyamChalisa = {
  title: 'Khatu Shyam Chalisa',
  deity: 'Khatu Shyam',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा॥
श्री गुरु पदरज शीशधर प्रथम सुमिरू गणेश ॥
ध्यान शारदा ह्रदयधर भजुँ भवानी महेश ॥
चरण शरण विप्लव पड़े हनुमत हरे कलेश ।
श्याम चालीसा भजत हुँ जयति खाटू नरेश ॥

॥ चौपाई ॥
वन्दहुँ श्याम प्रभु दुःख भंजन ।
विपत विमोचन कष्ट निकंदन ॥

Vandahūṁ Śyām Prabhu duḥkha bhanjana.
Vipat vimōcana kaṣṭa nikandana.

(I bow to Lord Shyam, dispeller of sorrow,
Remover of difficulties and deliverer from distress.)

सांवल रूप मदन छविहारी ।
केशर तिलक भाल दुतिकारी ॥

Sānvala rūpa madana chavihārī.
Keśara tilaka bhāla dutikārī.

(Dark-hued, charming like Cupid's beauty;
Saffron tilak on forehead, appearance radiant.)

मौर मुकुट केसरिया बागा ।
गल वैजयंति चित अनुरागा ॥

Maur mukuṭa kesarīyā bāgā.
Gala Vaijayantī chita anurāgā.

(Crest with peacock feathers, saffron robes;
Garland of Vaijayanti around the neck, heart full of devotion.)

नील अश्व मौरछडी प्यारी ।
करतल त्रय बाण दुःख हारी ॥

Nīla aśva maurachhaḍī pyārī.
Karatal traya bāṇa duḥkha hārī.

(Rider of a dark horse, peacock-feathered staff beloved;
Three arrows in palm that defeat sorrow.)

सूर्यवर्च वैष्णव अवतारे ।
सुर मुनि नर जन जयति पुकारे ॥

Sūryavarca vaiṣṇava avatāre.
Sura muni nara jana jayati pukāre.

(Shining like the sun, a Vaishnava incarnation;
Devas, sages and people all acclaim Him.)

पिता घटोत्कच मोर्वी माता ।
पाण्डव वंशदीप सुखदाता ॥

Pitā Ghaṭotkaca, Morvī mātā.
Pāṇḍava vaṁśadīpa sukha dātā.

(He is son of Ghatotkacha; mother is Morvi;
Light of the Pandava lineage, giver of joy.)

बर्बर केश स्वरूप अनूपा ।
बर्बरीक अतुलित बल भूपा ॥

Barbara keśa svarūpa anūpā.
Barbarīk atulit bala bhūpā.

(Barbarik with extraordinary hair and incomparable strength;
Barbarik, the mighty one.)

कृष्ण तुम्हे सुह्रदय पुकारे ।
नारद मुनि मुदित हो निहारे ॥

Kṛṣṇa tumhe suhrdaya pukāre.
Nārada muni mudita ho nihāre.

(Krishna calls you beloved of the heart;
Narada and sages gaze with joy.)

मौर्वे पूछत कर अभिवन्दन ।
जीवन लक्ष्य कहो यदुनन्दन ॥

Maurve pūchata kara abhivandana.
Jīvana lakṣya kaho Yadu-nandana.

(People salute and ask Barbarik his purpose;
Speak of the goal of life, O joy of the Yadu clan.)

गुप्त क्षेत्र देवी अराधना ।
दुष्ट दमन कर साधु साधना ॥

Gupta kṣetra devī ārādhanā.
Duṣṭa damana kara sādhu sādhana.

(Secret shrine adored by the goddess;
He vanquishes demons and blesses the pious.)

बर्बरीक बाल ब्रह्मचारी ।
कृष्ण वचन हर्ष शिरोधारी ॥

Barbarīk bāla brahmacārī.
Kṛṣṇa vacana harṣa śirodhārī.

(Barbarik, the celibate youth; he received Krishna's words and rejoiced.)

तप कर सिद्ध देवियाँ कीन्हा ।
प्रबल तेज अथाह बल लीन्हा ॥

Tapa kara siddha deviyāṁ kīnhā.
Prabala teja athāha bala līnhā.

(He performed austerities and attained divine powers;
Gained immense radiance and boundless strength.)

यज्ञ करे विजय विप्र सुजाना ।
रक्षा बर्बरीक करे प्राना ॥

Yajña kare vijaya vipra sujānā.
Rakṣā Barbarīk kare prānā.

(He performed sacrifices and won wise brahmanas; Barbarik protects life itself.)

नव कोटि दैत्य पलाशि मारे ।
नागलोक वासुकि भय हारे ॥

Nava koṭi daitya palāśi māre.
Nāga-loka Vāsuki bhaya hāre.

(He slew nine crore demons; Vāsuki of Nagaloka surrendered in fear.)

सिद्ध हुआ चँडी अनुष्ठाना ।
बर्बरीक बलनिधि जग जाना ॥

Siddha huā Chaṇḍī anuṣṭhānā.
Barbarīk bala-nidhi jag jānā.

(Chandi rites succeeded; Barbarik's store of strength is known throughout the world.)

वीर मोर्वेय निजबल परखन ।
चले महाभारत रण देखन ॥

Vīra Morveya nijabala parakhana.
Cale Mahābhārata raṇa dekhan.

(The brave Morveya (Barbarik) came to test his strength and to see the Mahabharata battlefield.)

माँगत वचन माँ मोर्वि अम्बा ।
पराजित प्रति पाद अवलम्बा ॥

Māngata vacana māṁ Morvi ambā.
Parājita prati pāda avalambā.

(He asked for a boon from his mother Morvi;
For the vanquished he showed compassion and became their refuge.)

आगे मिले माधव मुरारे ।
पूछे वीर क्युँ समर पधारे ॥

Āge mile Mādhava Murāre.
Pūchhe vīra kyuṁ samara padhāre.

(He met Madhava (Krishna); Krishna asked why the warrior had come to war.)

रण देखन अभिलाषा भारी ।
हारे का सदैव हितकारी ॥

Raṇa dekhan abhilāṣā bhārī.
Hāre kā sadaiva hitakārī.

(He desired to witness the battle; he wished always to help the defeated.)

तीर एक तीहुँ लोक हिलाये ।
बल परख श्री कृष्ण सँकुचाये ॥

Tīra eka tihūṁ loka hilāe.
Bala parakha Shri Kṛṣṇa saṅkucāe.

(One arrow could shake the three worlds; Krishna was humbled by his strength.)

यदुपति ने माया से जाना ।
पार अपार वीर को पाना ॥

Yadu-pati ne māyā se jānā.
Pār apār vīra ko pānā.

(The Yadu-lord (Krishna) recognized the illusion and embraced the boundless hero.)

धर्म युद्ध की देत दुहाई ।
माँगत शीश दान यदुराई ॥

Dharma yuddha kī deta duhāī.
Māngata śīśa dān Yadu-rāī.

(In the name of dharma he urged war; Barbarik offered his head as donation to Krishna.)

मनसा होगी पूर्ण तिहारी ।
रण देखोगे कहे मुरारी ॥

Manasā hogī pūrṇa tihārī.
Raṇa dekho ge kahe Murārī.

(Murari (Krishna) said: your wish will be fulfilled in spirit; you may witness the battle.)

शीश दान बर्बरीक दीन्हा ।
अमृत बर्षा सुरग मुनि कीन्हा ॥

Śīśa dāna Barbarīk dīnhā.
Amṛta varṣā sura muni kīnhā.

(Barbarik gave his head in charity; the gods and sages showered ambrosia.)

देवी शीश अमृत से सींचत ।
केशव धरे शिखर जहँ पर्वत ॥

Devī śīśa amṛta se sīñchat.
Keśava dhare śikhar jahan parvata.

(The goddess watered his head with amrita; Keshava placed it on a peak where mountains stand.)

जब तक नभ मण्डल मे तारे ।
सुर मुनि जन पूजेंगे सारे ॥

Jab tak nabha maṇḍala me tārē.
Sura muni jana pūjēṅgē sāre.

(Until the stars remain in the sky, devas and sages will worship him.)

दिव्य शीश मुद मंगल मूला ।
भक्तन हेतु सदा अनुकूला ॥

Divya śīśa muda maṅgala mūlā.
Bhaktan hetu sadā anukūlā.

(His divine head is a source of auspiciousness, always favorable to devotees.)

रण विजयी पाण्डव गर्वाये ।
बर्बरीक तब न्याय सुनाये ॥

Raṇa vijayī Pāṇḍava garvāyē.
Barbarīk taba nyāya sunāyē.

(The victorious Pandavas boasted; then Barbarik pronounced justice.)

सर काटे था चक्र सुदर्शन ।
रणचण्डी करती लहू भक्षन ॥

Sara kāṭē thā Cakra Sūdarśana.
Raṇa chandi karatī lahu bhakṣana.

(Udder: The Sundarśana chakra beheaded him? (text poetic) The war-maiden consumed blood.)

न्याय सुनत हर्षित जन सारे ।
जग में गूँजे जय जयकारे ॥

Nyāya sunata harṣita jana sāre.
Jag meṁ gūnjē jay jaykārē.

(When justice was declared all people rejoiced and victory cries echoed.)

श्याम नाम घनश्याम दीन्हा ।
अजर अमर अविनाशी कीन्हा ॥

Śyām nāma Ghanaśyām dīnhā.
Ajar amar avināśī kīnhā.

(He was given the name Shyam, dark and eternal, imperishable.)

जन हित प्रकटे खाटू धामा ।
लख दाता दानी प्रभु श्यामा ॥

Jana hita prakāṭē Khāṭū dhāmā.
Lakh dātā dānī Prabhu Śyāmā.

(For public welfare the Khatu Dham was revealed;
Lord Shyama is giver of millions and generous.)

खाटू धाम मौक्ष का द्वारा ।
श्याम कुण्ड बहे अमृत धारा ॥

Khāṭū dhām maukṣa kā dvārā.
Śyām kuṇḍa bahe amṛta dhārā.

(Khatu Dham is the gateway to liberation; Shyam Kund flows with ambrosial waters.)

शुदी द्वादशी फाल्गुण मेला ।
खाटू धाम सजे अलबेला ॥

Śudī dvādaśī Phālguna mēlā.
Khāṭū dhām saje alabēlā.

(On the bright twelfth of Phalguna the fair assembles; Khatu Dham is beautifully adorned.)

एकादशी व्रत ज्योत द्वादशी ।
सबल काय परलोक सुधरशी ॥

Ekādaśī vrat jyota dvādaśī.
Sabal kāya paralōka sudharaśī.

(Observing Ekadashi and lighting on Dwadashi uplifts the body and the other world.)

खीर चूरमा भोग लगत हैं ।
दुःख दरिद्र कलेश कटत हैं ॥

Khīra chūramā bhōga lagata hai.
Duḥkha daridra kaleśa kaṭata hai.

(Kheer and churma offerings are served; sorrow, poverty and distress are removed.)

श्याम बहादुर सांवल ध्याये ।
आलु सिँह ह्रदय श्याम बसाये ॥

Śyām bahādura sāval dhyāyē.
Ālu siṁha hṛdaya Śyām basāyē.

(Meditate on brave dark Shyam; install Shyam in the heart like a lion.)

मोहन मनोज विप्लव भाँखे ।
श्याम धणी म्हारी पत राखे ॥

Mohan manōja viplava bhānkhē.
Śyām dhaṇī mhārī pata rakhē.

(Mohankara and Manoja delight in ecstasy; Shyam, my lord, keeps his promise.)

नित प्रति जो चालीसा गावे ।
सकल साध सुख वैभव पावे ॥

Nita prati jo chālīsā gāvē.
Sakala sādha sukha vaibhava pāvē.

(Whoever sings this Chalisa daily attains all the saints' happiness and grandeur.)

श्याम नाम सम सुख जग नाहीं ।
भव भय बन्ध कटत पल माहीं ॥

Śyām nāma sama sukha jag nāhīṁ.
Bhava bhaya bandha kaṭata pal māhīṁ.

(No joy in the world equals the name Shyam; worldly fear and bondage are cut in a moment.)

॥ दोहा॥
त्रिबाण दे त्रिदोष मुक्ति दर्श दे आत्म ज्ञान ।
चालीसा दे प्रभु भुक्ति सुमिरण दे कल्यान ॥

Tribāṇa dē tridōṣa mukti darśa dē ātma jñāna.
Chālīsā dē prabhu bhukti sumiraṇa dē kalyāṇa.

(Grant release from threefold faults with the three-pointed weapon; show liberation and self-knowledge.
May the Chalisa grant devotion and remembrance of the Lord for welfare.)

खाटू नगरी धन्य हैं श्याम नाम जयगान ।
अगम अगोचर श्याम हैं विरदहिं स्कन्द पुरान ॥

Khāṭū nagarī dhanya haiṁ Śyām nāma jayagān.
Agama agōcara Śyām haiṁ virada hiṁ Skanda Purāṇa.

(Khatu town is blessed by the praise of Shyam's name;
The inaccessible Shyam is praised in ancient Skanda Purana.)` ,
  description: 'Khatu Shyam / Barbarik Chalisa - Contains Hindi original, Roman transliteration and English translation. Depicts life of Barbarik (Barbarik/Morvar/Barbariik), his devotion to Krishna, his head-offering (sheesh-daan), and Khatu Dham significance. Benefits: protection, fulfillment of wishes, liberation, removal of poverty and sorrow. Duplicate-check before insert.'
};

async function addKhatuShyamChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: khatuShyamChalisa.title, deity: 'Khatu Shyam' });
    if (existing) {
      console.log(`Khatu Shyam Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(khatuShyamChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${khatuShyamChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const count = await Devotional.find({ category: 'Chalisa', deity: 'Khatu Shyam' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Khatu Shyam Chalisas: ${count.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Khatu Shyam Chalisa:', error);
    process.exit(1);
  }
}

addKhatuShyamChalisa();
