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

const gopalChalisa = {
  title: 'Gopal Chalisa',
  deity: 'Gopal',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा ॥
श्री राधापद कमल रज, सिर धरि यमुना कूल।
वरनो चालीसा सरस, सकल सुमंगल मूल॥

Śrī Rādhāpad kamal raja, sir dhari Yamunā kūl.
Varano Chālīsā saras, sakal sumangal mūl.

(Hail the lotus-born feet of Radha; with head by Yamuna's bank.
I recite this sweet Chalisa — source of every auspiciousness.)

॥ चौपाई ॥
जय जय पूरण ब्रह्म बिहारी। दुष्ट दलन लीला अवतारी॥
जो कोई तुम्हरी लीला गावै। बिन श्रम सकल पदारथ पावै॥

Jaya jaya pūraṇa Brahma Bihārī. Duṣṭa dalan līlā avatārī.
Jo koī tumharī līlā gāvẽ. Bin śram sakal padārtha pāvē.

(Hail, O complete one, entertainer of Brahma — avatar who destroys the wicked.
Whoever sings your play effortlessly attains all worldly possessions.)

श्री वसुदेव देवकी माता। प्रकट भये संग हलधर भ्राता॥
मथुरा सों प्रभु गोकुल आये। नन्द भवन में बजत बधाये॥

Śrī Vasudev Devakī mātā. Prakaṭ bhaye saṅg Haldhar bhrātā.
Mathurā sōṁ Prabhu Gokul āye. Nand bhavan meṁ bajat badhāye.

(Vasudeva and Devaki gave birth; Haldhar (Balarama) appeared as brother.
From Mathura the Lord came to Gokul; rejoicing in Nanda's house.)

जो विष देन पूतना आई। सो मुक्ति दै धाम पठाई॥
तृणावर्त राक्षस संहार्यौ। पग बढ़ाय सकटासुर मार्यौ॥

Jo viṣ den Pūtana āī. So mukti dai dhām paṭhāī.
Tṛṇāvarta rākṣas saṁhāryau. Pag baṛhāy Sakatāsur māryau.

(Pūtana who came with poisoned milk was vanquished and sent to liberation.
He destroyed the demon Tṛṇāvarta and set foot to kill Sakatāsura.)

खेल खेल में माटी खाई। मुख में सब जग दियो दिखाई॥
गोपिन घर घर माखन खायो। जसुमति बाल केलि सुख पायो॥

Khel khel meṁ māṭī khāī. Mukh meṁ sab jag diyo dikhaī.
Gopin ghar ghar mākhan khāyo. Jasumati bāl keli sukh pāyo.

(Playing, he ate mud for fun and showed the world in his mouth.
He stole butter from every Gopi's house, giving joy in the child Krishna's pastimes.)

ऊखल सों निज अंग बँधाई। यमलार्जुन जड़ योनि छुड़ाई॥
बका असुर की चोंच विदारी। विकट अघासुर दियो सँहारी॥

Ūkhal sōṁ nij aṅg baṁdhāī. Yamalārjun jaṛ yoni chuḍāī.
Bakā asur kī cōñc vidārī. Vikaṭ aghāsur diyo saṁhārī.

(He tied his limb with a pestle, freed Yamalārjun from a stuck womb.
He broke the beak of demon Bakā and destroyed the fierce Aghāsura.)

ब्रह्मा बालक वत्स चुराये। मोहन को मोहन हित आये॥
बाल वत्स सब बने मुरारी। ब्रह्मा विनय करी तब भारी॥

Brahmā bālak vats curāye. Mohan ko Mohan hit āye.
Bāl vats sab bane Murārī. Brahmā vinay karī tab bhārī.

(He stole Brahma's childlike affection; Mohan brought benefit to Mohan.
All the child-ones became Murari; Brahma himself then humbled.)

काली नाग नाथि भगवाना। दावानल को कीन्हों पाना॥
सखन संग खेलत सुख पायो। श्रीदामा निज कन्ध चढ़ायो॥

Kālī nāg nāthi Bhagavānā. Dāvanal kō kīnhõ pānā.
Sakhan saṅg khelat sukh pāyo. Śrīdāmā nij kandh chaṛhāyo.

(He subdued the black serpent and the lord of serpents; tamed the fire.
Playing with friends he found joy; Sridama climbed upon his shoulder.)

चीर हरन करि सीख सिखाई। नख पर गिरवर लियो उठाई॥
दरश यज्ञ पत्निन को दीन्हों। राधा प्रेम सुधा सुख लीन्हों॥

Cīr haran kari sīkh sikhāī. Nakh par girvar liyo uṭhāī.
Darśa yajña patnin kō dīnhõ. Rādhā prem sudhā sukh līnhõ.

(He taught lessons by tearing clothes, put a pearl on his nails.
He gifted sight at a sacrifice to a wife and received Radha's nectar of love and bliss.)

नन्दहिं वरुण लोक सों लाये। ग्वालन को निज लोक दिखाये॥
शरद चन्द्र लखि वेणु बजाई। अतिः सुख दीन्हों रास रचाई॥

Nandahiṁ Varuṇa lok sōṁ lāye. Gvalan kō nij lok dikhāye.
Sharad chandra lakho veṇu bajāī. Atiḥ sukh dīnhõ rās racāī.

(Nanda brought him from Varuna's realm; showed the cowherds his own realm.
He played the flute like the autumn moon and created the blissful Rasa.)

अजगर सों पितु चरण छुड़ायो। शंखचूड़ को मूड़ गिरायो॥
हने अरिष्टा सुर अरु केशी। व्योमासुर मार्यो छल वेषी॥

Ajagar sōṁ pitu charaṇ chuḍāyo. Śaṅkhacūṛ kō mūḍ girāyo.
Hane ariṣṭā sur aru kēśī. Vyomāsur māryo chala vēśī.

(He freed his father's foot from a great serpent and broke the conch-crested demon's head.
He killed the demon Arishta and Kesi, and in disguise slew Vyomāsura.)

व्याकुल ब्रज तजि मथुरा आये। मारी कंस यदुवंश बसाये॥
मात पिता की बन्दि छुड़ाई। सान्दीपनि गृह विद्या पाई॥

Vyākul Braj taji Mathurā āye. Mārī Kaṁs Yaduvaṁś basāye.
Māt pitā kī bandi chuḍāī. Sāndīpani griha vidyā pāī.

(He left restless Braj and came to Mathura, killed Kansa and settled the Yadu lineage.
He freed parents from bondage and received household learning.)

पुनि पठयौ ब्रज ऊधौ ज्ञानी। प्रेम देखि सुधि सकल भुलानी॥
कीन्हीं कुबरी सुन्दर नारी। हरि लाये रुक्मिणि सुकुमारी॥

Puni paṭhayō Braj ūdhõ gyānī. Prem dekhī sudhi sakal bhulānī.
Kīnhīṁ Kubarī sundar nārī. Hari lāye Rukmiṇī sukumārī.

(Then he taught Braj the wise; seeing love, all minds were bewildered.
He married the beautiful daughter of Kubera; brought Rukminī as a delicate bride.)

भौमासुर हनि भक्त छुड़ाये। सुरन जीति सुरतरु महि लाये॥
दन्तवक्र शिशुपाल संहारे। खग मृग नृग अरु बधिक उधारे॥

Bhaumāsur hani bhakt chuḍāye. Suran jīti surtaru mahi lāye.
Dantavakra Śiśupāl saṁhāre. Khaga mṛga nṛga aru badhik udhāre.

(He killed Bhaumasura and freed devotees; triumphed over gods and brought divine trees.
He slew Dantavakra and Shishupala, rescued birds, deer and other beings.)

दीन सुदामा धनपति कीन्हों। पारथ रथ सारथि यश लीन्हों॥
गीता ज्ञान सिखावन हारे। अर्जुन मोह मिटावन हारे॥

Dīn Sudāmā dhana-pati kīnhõ. Pārth rath sārathi yaś līnhõ.
Gītā jñān sikhāvan hāre. Arjun moh miṭāvan hāre.

(He made poor Sudama rich and became the charioteer of Partha, gaining fame.
He taught the Gita's wisdom and removed Arjun's delusion.)

केला भक्त बिदुर घर पायो। युद्ध महाभारत रचवायो॥
द्रुपद सुता को चीर बढ़ायो। गर्भ परीक्षित जरत बचायो॥

Kelā bhakt Bidur ghar pāyo. Yuddha Mahabharat racavāyo.
Drupad suta kō chīr baṛhāyo. Garbh Parīkṣit jarat bacāyo.

(He found devotees like Vidura; set the Mahabharata war in motion.
He restored Drupada's daughter and saved the burning Parikshit in womb.)

कच्छ मच्छ वाराह अहीशा। बावन कल्की बुद्धि मुनीशा॥
ह्वै नृसिंह प्रह्लाद उबार्यो। राम रुप धरि रावण मार्यो॥

Kacch macch Vārāha ahīśā. Bāvan Kalkī buddhi munīśā.
Hvai Nṛsiṁha Prahlad ubāryo. Rām rūp dhari Rāvaṇ māryo.

(From fish to boar to serpent—he assumes many forms; future Kalki's wisdom is in sages.
As Nrisimha he saved Prahlad; as Rama he killed Ravana.)

जय मधु कैटभ दैत्य हनैया। अम्बरीय प्रिय चक्र धरैया॥
ब्याध अजामिल दीन्हें तारी। शबरी अरु गणिका सी नारी॥

Jaya Madhu Kaitabh daitya Hanaiyā. Ambarīya priya chakra dharaiyā.
Byādh Ajāmil dīnhẽ tārī. Śabarī aru gaṇikā sī nārī.

(Hail who killed Madhu and Kaitabha; who carried the beloved discus of Ambariya.
He cured the diseased Ajamil; showed mercy even to Shabari and a courtesan.)

गरुड़ासन गज फन्द निकन्दन। देहु दरश ध्रुव नयनानन्दन॥
देहु शुद्ध सन्तन कर सङ्गा। बाढ़ै प्रेम भक्ति रस रङ्गा॥

Garuda-āsan gaj phand nikandan. Dehu darśa Dhruv nayanānandan.
Dehu śuddha santan kar saṅgā. Bāṛhai prem bhakti ras raṅgā.

(Seated on Garuda, slayer of elephant-traps; grant sight to Dhruva, delight of eyes.
Grant the company of pure saints; increase love and devotion's color.)

देहु दिव्य वृन्दावन बासा। छूटै मृग तृष्णा जग आशा॥
तुम्हरो ध्यान धरत शिव नारद। शुक सनकादिक ब्रह्म विशारद॥

Dehu divya Vṛndāvana bāsā. Chūṭai mṛg tṛṣṇā jag āśā.
Tumharo dhyān dharat Śiva Nārada. Śuk Sanakādik Brahma viśārad.

(Grant divine Vrindavan residence; free from worldly thirst and desires.
Your meditation grants Shiva, Narada, Shuk, Sanaka and Brahma's wisdom.)

जय जय राधारमण कृपाला। हरण सकल संकट भ्रम जाला॥
बिनसैं बिघन रोग दुःख भारी। जो सुमरैं जगपति गिरधारी॥

Jaya jaya Rādhāraman kṛpālā. Haraṇ sakal saṅkaṭ bhram jālā.
Binasaiṁ bighan rog duḥkh bhārī. Jo sumaraiṁ Jagapati Girdhārī.

(Hail, merciful lover of Radha, remover of all troubles and illusions.
All obstacles, disease and sorrow vanish for those who remember the Lord Girdhari.)

जो सत बार पढ़ै चालीसा। देहि सकल बाँछित फल शीशा॥

Jo sat bār paṛhai Chālīsā. Dehi sakal bāṁchit phal śīśā.

(Whoever reads this Chalisa a hundred times receives all desired fruits.)

॥ छन्द ॥
गोपाल चालीसा पढ़ै नित, नेम सों चित्त लावई।
सो दिव्य तन धरि अन्त महँ, गोलोक धाम सिधावई॥

Gopal Chālīsā paṛhai nit, nem sōṁ citt lāvaī.
So divya tan dhari anta mahṁ, Golok dhām sidhāvai.

(Reading Gopal Chalisa daily with discipline fixes the mind; one attains divine body and Goloka.)

संसार सुख सम्पत्ति सकल, जो भक्तजन सन महँ चहैं।
'जयरामदेव' सदैव सो, गुरुदेव दाया सों लहैं॥

Sansār sukh sampatti sakal, jo bhaktajan san mahṁ chahẽ.
'Jayrāmdev' sadaiv so, Gurudev dayā sōṁ lahen.

(All worldly happiness and wealth are desired by devotees; always chant 'Jai Ramdev' and receive Guru's grace.)

॥ दोहा ॥
प्रणत पाल अशरण शरण, करुणा-सिन्धु ब्रजेश।
चालीसा के संग मोहि, अपनावहु प्राणेश॥

Praṇat pāl aśaraṇ śaraṇ, karuṇā-sindhu Brajesh.
Chālīsā ke saṅg mohi, apanavahu prāṇesh.

(O protector and refuge, ocean of compassion of Brajesh—accept me with this Chalisa, O Lord of my life.)

॥ इति श्री गोपाल चालीसा ॥
` ,
  description: 'Gopal Chalisa - includes Hindi original, Roman transliteration and concise English translations. Benefits: devotion to Gopal (Krishna), removal of obstacles and attainment of spiritual blessings. Duplicate-check before insert.'
};

async function addGopalChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: gopalChalisa.title, deity: 'Gopal' });
    if (existing) {
      console.log(`Gopal Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(gopalChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${gopalChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const gopalCount = await Devotional.find({ category: 'Chalisa', deity: 'Gopal' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Gopal Chalisas: ${gopalCount.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Gopal Chalisa:', error);
    process.exit(1);
  }
}

addGopalChalisa();
