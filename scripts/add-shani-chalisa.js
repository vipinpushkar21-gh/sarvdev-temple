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

const shaniChalisa = {
  title: 'Shani Chalisa',
  deity: 'Shani',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `दोहा:
जय गणेश गिरिजा सुवन, मंगल करण कृपाल।
दीनन के दुख दूर करि, कीजै नाथ निहाल॥

Jaya gaṇeśa girijā suvana, maṅgala karaṇa kṛpāla।
Dīnana ke dukha dūra kari, kījai nātha nihāla॥

(Victory to Ganesha, son of Girija (Parvati), auspicious and merciful. Remove the sorrows of the meek, make us joyful O Lord)

जय जय श्री शनिदेव प्रभु, सुनहु विनय महाराज।
करहु कृपा हे रवि तनय, राखहु जन की लाज॥

Jaya jaya śrī śanideva prabhu, sunahu vinaya mahārāja।
Karahu kṛpā he ravi tanaya, rākhahu jana kī lāja॥

(Victory to Lord Shanidev, listen to this humble prayer O great king. Show mercy O son of Sun, protect the honor of your devotees)

चौपाई:
जयति जयति शनिदेव दयाला। करत सदा भक्तन प्रतिपाला॥
Jayati jayati śanideva dayālā। Karata sadā bhaktana pratipālā॥
(Victory to merciful Shanidev, always protects devotees)

चारि भुजा, तनु श्याम विराजै। माथे रतन मुकुट छबि छाजै॥
Chāri bhujā, tanu śyāma virājai। Māthe ratana mukuṭa chabi chhājai॥
(Four arms, dark complexioned body shines, jeweled crown adorns the forehead)

परम विशाल मनोहर भाला। टेढ़ी दृष्टि भृकुटि विकराला॥
Parama viśāla manohara bhālā। Ṭeṛhī dṛṣṭi bhṛkuṭi vikarālā॥
(Very broad enchanting forehead, slanted gaze and fierce eyebrows)

कुण्डल श्रवण चमाचम चमके। हिय माल मुक्तन मणि दमके॥
Kuṇḍala śravaṇa chamācham chamake। Hiya māla muktana maṇi damake॥
(Earrings shine brilliantly in ears, pearl and gem garlands sparkle on chest) [4]

कर में गदा त्रिशूल कुठारा। पल बिच करैं अरिहिं संहारा॥
Kara meṁ gadā triśūla kuṭhārā। Pala bicha karaiṁ arihiṁ saṁhārā॥
(In hands mace, trident and axe, destroys enemies in a moment)

पिंगल, कृष्णो, छाया नन्दन। यम, कोणस्थ, रौद्र, दुखभंजन॥
Piṅgala, kṛṣṇo, chhāyā nandana। Yama, koṇastha, raudra, dukhabhañjana॥
(Pingal, Krishno, son of Chhaya, Yama, Konasth, Raudra, destroyer of sorrows)

सौरी, मन्द, शनी, दश नामा। भानु पुत्र पूजहिं सब कामा॥
Saurī, manda, śanī, daśa nāmā। Bhānu putra pūjahiṁ saba kāmā॥
(Sauri, Mand, Shani - ten names, son of Sun worshipped for all desires)

जा पर प्रभु प्रसन्न ह्वैं जाहीं। रंकहुँ राव करैं क्षण माहीं॥
Jā para prabhu prasanna hvaiṁ jāhīṁ। Raṅkahūṁ rāva karaiṁ kṣaṇa māhīṁ॥
(Upon whom Lord becomes pleased, turns pauper into king in a moment) [8]

पर्वतहू तृण होई निहारत। तृणहू को पर्वत करि डारत॥
Parvatahū tṛṇa hoī nihārata। Tṛṇahū ko parvata kari ḍārata॥
(Makes mountain into grass in sight, turns grass into mountain)

राज मिलत बन रामहिं दीन्हयो। कैकेइहुँ की मति हरि लीन्हयो॥
Rāja milata bana rāmahiṁ dīnhayo। Kaikēihūṁ kī mati hari līnhayo॥
(Made Ram go to forest instead of getting kingdom, took away Kaikeyi's wisdom)

बनहूँ में मृग कपट दिखाई। मातु जानकी गई चुराई॥
Banahūṁ meṁ mṛga kapaṭa dikhāī। Mātu jānakī gaī churāī॥
(Showed deceptive deer in forest, Mother Janaki was abducted)

लखनहिं शक्ति विकल करि डारा। मचिगा दल में हाहाकारा॥
Lakhanahiṁ śakti vikala kari ḍārā। Machigā dala meṁ hāhākārā॥
(Made Lakshman unconscious with Shakti weapon, lamentation arose in the army) [12]

रावण की गति मति बौराई। रामचन्द्र सों बैर बढ़ाई॥
Rāvaṇa kī gati mati baurāī। Rāmachandra soṁ baira baṛhāī॥
(Made Ravana's mind deluded, increased enmity with Ramchandra)

दियो कीट करि कंचन लंका। बजि बजरंग बीर की डंका॥
Diyo kīṭa kari kañchana laṅkā। Baji bajaraṅga bīra kī ḍaṅkā॥
(Turned golden Lanka into insects, Bajrang Bali's drum sounded)

नृप विक्रम पर तुहि पगु धारा। चित्र मयूर निगलि गै हारा॥
Nṛpa vikrama para tuhi pagu dhārā। Chitra mayūra nigali gai hārā॥
(You stepped upon King Vikram, picture peacock swallowed the necklace)

हार नौलखा लाग्यो चोरी। हाथ पैर डरवाय तोरी॥
Hāra naulakhā lāgyo chorī। Hātha paira ḍaravāya torī॥
(Nine lakh necklace appeared stolen, hands and feet were cut off frightfully) [16]

भारी दशा निकृष्ट दिखायो। तेलिहिं घर कोल्हू चलवायो॥
Bhārī daśā nikṛṣṭa dikhāyo। Telihiṁ ghara kolhū chalavāyo॥
(Showed terrible bad period, made him turn oil-press in oil-maker's house)

विनय राग दीपक महं कीन्हयो। तब प्रसन्न प्रभु ह्वै सुख दीन्हयो॥
Vinaya rāga dīpaka mahaṁ kīnhayo। Taba prasanna prabhu hvai sukha dīnhayo॥
(Made humble Raag Deepak there, then Lord became pleased and gave happiness)

हरिश्चन्द्र नृप नारि बिकानी। आपहुं भरे डोम घर पानी॥
Hariśchandra nṛpa nāri bikānī। Āpahūṁ bhare ḍoma ghara pānī॥
(King Harishchandra's wife was sold, he himself carried water to Dome's house)

तैसे नल पर दशा सिरानी। भूंजी मीन कूद गई पानी॥
Taise nala para daśā sirānī। Bhūṁjī mīna kūda gaī pānī॥
(Similarly Shani period came upon Nal, roasted fish jumped back into water) [20]

श्री शंकरहिं गह्यो जब जाई। पारवती को सती कराई॥
Śrī śaṅkarahiṁ gahyo jaba jāī। Pāravatī ko satī karāī॥
(When caught hold of Lord Shankar, made Parvati become Sati)

तनिक विलोकत ही करि रीसा। नभ उड़ि गयो गौरिसुत सीसा॥
Tanika vilōkata hī kari rīsā। Nabha uṛi gayo gaurisuta sīsā॥
(Just by glancing with anger, Gauri's son's (Ganesha's) head flew to sky)

पाण्डव पर भै दशा तुम्हारी। बची द्रौपदी होति उघारी॥
Pāṇḍava para bhai daśā tumhārī। Bachī draupadī hoti ughārī॥
(Your period came upon Pandavas, Draupadi was saved from being disrobed)

कौरव के भी गति मति मारयो। युद्ध महाभारत करि डारयो॥
Kaurava ke bhī gati mati mārayu। Yuddha mahābhārata kari ḍārayo॥
(Also destroyed Kauravas' wisdom and fate, caused the great Mahabharat war) [24]

रवि कहँ मुख महँ धरि तत्काला। लेकर कूदि परयो पाताला॥
Ravi kahaṁ mukha mahaṁ dhari tatkālā। Lekara kūdi parayo pātālā॥
(Immediately held Sun in mouth, leapt and fell to nether world)

शेष देव लखि विनती लाई। रवि को मुख ते दियो छुड़ाई॥
Śeṣa deva lakhi vinatī lāī। Ravi ko mukha te diyo chhuṛāī॥
(Seeing this, gods prayed humbly, released Sun from the mouth)

वाहन प्रभु के सात सजाना। जग दिग्गज गर्दभ मृग स्वाना॥
Vāhana prabhu ke sāta sajānā। Jaga diggaja gardabha mṛga svānā॥
(Lord's seven vehicles are prepared: crow, elephant, donkey, deer, dog)

जम्बुक सिंह आदि नख धारी। सो फल ज्योतिष कहत पुकारी॥
Jambuka siṁha ādi nakha dhārī। So phala jyotiṣa kahata pukārī॥
(Jackal, lion etc. nail-bearing, those fruits astrology proclaims loudly) [28]

गज वाहन लक्ष्मी गृह आवैं। हय ते सुख सम्पति उपजावैं॥
Gaja vāhana lakṣmī gṛha āvaiṁ। Haya te sukha sampati upajāvaiṁ॥
(On elephant vehicle Lakshmi comes home, from horse happiness and wealth arise)

गर्दभ हानि करै बहु काजा। सिंह सिद्ध कर राज समाजा॥
Gardabha hāni karai bahu kājā। Siṁha siddha kara rāja samājā॥
(Donkey causes loss in many works, lion brings royal assembly with accomplishment)

जम्बुक बुद्धि नष्ट कर डारै। मृग दे कष्ट प्राण संहारै॥
Jambuka buddhi naṣṭa kara ḍārai। Mṛga de kaṣṭa prāṇa saṁhārai॥
(Jackal destroys intelligence, deer gives suffering and destroys life)

जब आवहिं प्रभु स्वान सवारी। चोरी आदि होय डर भारी॥
Jaba āvahiṁ prabhu svāna savārī। Chorī ādi hoya ḍara bhārī॥
(When Lord comes on dog vehicle, theft and great fear occurs) [32]

तैसहि चारि चरण यह नामा। स्वर्ण लौह चाँदी अरु तामा॥
Taisahi chāri charaṇa yaha nāmā। Svarṇa lauha chāṁdī aru tāmā॥
(Similarly four feet have these names: gold, iron, silver and copper)

लौह चरण पर जब प्रभु आवैं। धन जन सम्पत्ति नष्ट करावैं॥
Lauha charaṇa para jaba prabhu āvaiṁ। Dhana jana sampatti naṣṭa karāvaiṁ॥
(When Lord comes on iron foot, destroys wealth, people and property)

समता ताम्र रजत शुभकारी। स्वर्ण सर्व सर्व सुख मंगल भारी॥
Samatā tāmra rajata śubhakārī। Svarṇa sarva sarva sukha maṅgala bhārī॥
(Copper is moderate, silver is auspicious, gold brings all happiness and great auspiciousness)

जो यह शनि चरित्र नित गावै। कबहुं न दशा निकृष्ट सतावै॥
Jo yaha śani charitra nita gāvai। Kabahuṁ na daśā nikṛṣṭa satāvai॥
(One who daily sings this Shani character, bad period never troubles) [36]

अद्भुत नाथ दिखावैं लीला। करैं शत्रु के नशि बलि ढीला॥
Adbhuta nātha dikhāvaiṁ līlā। Karaiṁ śatru ke naśi bali ḍhīlā॥
(Wonderful Lord shows divine play, destroys enemy's strength making it weak)

जो पण्डित सुयोग्य बुलवाई। विधिवत शनि ग्रह शांति कराई॥
Jo paṇḍita suyogya bulavāī। Vidhivata śani graha śānti karāī॥
(Calling capable learned scholar, performing proper Shani planet pacification ritual)

पीपल जल शनि दिवस चढ़ावत। दीप दान दै बहु सुख पावत॥
Pīpala jala śani divasa chaṛhāvata। Dīpa dāna dai bahu sukha pāvata॥
(Offering water to Peepal on Saturday, giving lamp donation receives great happiness)

कहत राम सुन्दर प्रभु दासा। शनि सुमिरत सुख होत प्रकाशा॥
Kahata rāma sundara prabhu dāsā। Śani sumirata sukha hota prakāśā॥
(Says Ram Sundar, servant of Lord, remembering Shani happiness manifests) [40]

दोहा:
पाठ शनिश्चर देव को, की हों भक्त तैयार।
करत पाठ चालीस दिन, हो भवसागर पार॥

Pāṭha śaniśchara deva ko, kī hoṁ bhakta taiyāra।
Karata pāṭha chālīsa dina, ho bhavasāgara pāra॥

(Reciting to Shanidev, devotees should be prepared. Reciting for forty days, cross the ocean of worldly existence)`,
  description: 'Shani Chalisa - 40 verses in praise of Lord Shani (Saturn), son of Surya (Sun). Describes Shani\'s forms, powers, and effects during different periods (Sade Sati, Dhaiya). References stories from Ramayana and Mahabharata showing Shani\'s influence. Explains the seven vehicles (crow, elephant, donkey, deer, dog, jackal, lion) and four feet (gold, silver, copper, iron) representing different effects. Reciting for 40 consecutive days removes all troubles of Shani period, grants protection, and brings happiness. Best recited on Saturdays with offerings of water to Peepal tree and lamp donation.'
};

async function addShaniChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const newChalisa = new Devotional(shaniChalisa);
    await newChalisa.save();
    console.log(`✓ Added: ${shaniChalisa.title}`);

    console.log('\n✓ Shani Chalisa added successfully!');
    console.log('\nDetails:');
    console.log('- Category: Chalisa');
    console.log('- Deity: Shani (Saturn)');
    console.log('- Language: Hindi with English transliteration and translation');
    console.log('- Composed by: Ram Sundar Das');
    console.log('\nShani\'s Ten Names:');
    console.log('1. Pingal  2. Krishno  3. Chhaya Nandan  4. Yama  5. Konasth');
    console.log('6. Raudra  7. Dukhbhanjan  8. Sauri  9. Mand  10. Shani');
    console.log('\nSeven Vehicles & Their Effects:');
    console.log('- Crow (Kaga): Common effect');
    console.log('- Elephant (Gaj): Brings Lakshmi and wealth');
    console.log('- Horse (Hay): Happiness and prosperity');
    console.log('- Donkey (Gardabh): Loss in work');
    console.log('- Lion (Singh): Royal success');
    console.log('- Jackal (Jambuk): Destroys intelligence');
    console.log('- Dog (Swan): Theft and fear');
    console.log('\nFour Feet (Phases):');
    console.log('- Iron (Loh): Destroys wealth and property');
    console.log('- Copper (Tamra): Moderate effects');
    console.log('- Silver (Rajat): Auspicious');
    console.log('- Gold (Swarna): All happiness and auspiciousness');
    console.log('\nBenefits:');
    console.log('- Removes troubles of Sade Sati and Dhaiya');
    console.log('- Protects from Shani\'s bad effects');
    console.log('- Turns pauper into king');
    console.log('- Destroys enemies');
    console.log('- Grants all happiness');
    console.log('\nHow to Recite:');
    console.log('- Recite for 40 consecutive days');
    console.log('- Best day: Saturday (Shanivar)');
    console.log('- Offer water to Peepal tree');
    console.log('- Donate lamp/oil');
    console.log('- Perform Shani Shanti puja if possible');

    // Verify total count
    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const shaniChalisas = await Devotional.find({ category: 'Chalisa', deity: 'Shani' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Shani Chalisas: ${shaniChalisas.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Shani Chalisa:', error);
    process.exit(1);
  }
}

addShaniChalisa();
