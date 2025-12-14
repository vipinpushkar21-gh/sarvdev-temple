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

const ramChalisa = {
  title: 'Shri Ram Chalisa',
  deity: 'Rama',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `दोहा:
आदौ राम तपोवनादि गमनं हत्वाह् मृगा काञ्चनं
वैदेही हरणं जटायु मरणं सुग्रीव संभाषणं।
बाली निर्दलं समुद्र तरणं लङ्कापुरी दाहनम्
पश्चद्रावनं कुम्भकर्णं हननं एतद्धि रामायणं॥

Transliteration:
Ādau rāma tapovanādi gamanam hatvāh mṛgā kāñchanam
Vaidehi haraṇam jaṭāyu maraṇam sugrīva sambhāṣaṇam।
Bāli nirdalam samudra taraṇam laṅkāpurī dāhanam
Paśchad rāvanam kumbhakarṇam hananam etaddhi rāmāyaṇam॥

Translation:
First Ram's journey to the forest and killing of the golden deer, abduction of Sita, death of Jatayu, conversation with Sugriva, destruction of Bali, crossing the ocean, burning of Lanka, and finally killing of Ravana and Kumbhakarna - this is the essence of Ramayana.

चौपाई:
श्री रघुबीर भक्त हितकारी। सुनि लीजै प्रभु अरज हमारी॥
Śrī raghubīr bhakta hitakārī। Suni lījai prabhu araja hamārī॥
(O Lord Raghubir, benefactor of devotees, please listen to our prayer)

निशि दिन ध्यान धरै जो कोई। ता सम भक्त और नहिं होई॥
Niśi dina dhyāna dharai jo koī। Tā sama bhakta aura nahiṁ hoī॥
(One who meditates day and night, no other devotee equals him)

ध्यान धरे शिवजी मन माहीं। ब्रह्मा इन्द्र पार नहिं पाहीं॥
Dhyāna dhare śivajī mana māhīṁ। Brahmā indra pāra nahiṁ pāhīṁ॥
(Even Shiva meditates in his heart, Brahma and Indra cannot fathom you)

जय जय जय रघुनाथ कृपाला। सदा करो सन्तन प्रतिपाला॥
Jaya jaya jaya raghunātha kṛpālā। Sadā karo santana pratipālā॥
(Victory to merciful Raghunath, always protect the saints)

दूत तुम्हार वीर हनुमाना। जासु प्रभाव तिहूँ पुर जाना॥
Dūta tumhāra vīra hanumānā। Jāsu prabhāva tihūṁ pura jānā॥
(Your messenger is brave Hanuman, whose glory is known in all three worlds)

तुव भुजदण्ड प्रचण्ड कृपाला। रावण मारि सुरन प्रतिपाला॥
Tuva bhujadaṇḍa pracaṇḍa kṛpālā। Rāvaṇa māri suran pratipālā॥
(Your mighty arms, O merciful one, killed Ravana and protected the gods)

तुम अनाथ के नाथ गोसाईं। दीनन के हो सदा सहाई॥
Tuma anātha ke nātha gosāīṁ। Dīnana ke ho sadā sahāī॥
(You are the lord of the helpless, always helper of the meek)

ब्रह्मादिक तव पार न पावैं। सदा ईश तुम्हरो यश गावैं॥
Brahmādika tava pāra na pāvaiṁ। Sadā īśa tumharo yaśa gāvaiṁ॥
(Even Brahma cannot fathom you, gods always sing your glory)

चारिउ वेद भरत हैं साखी। तुम भक्तन की लज्जा राखी॥
Chāriu veda bharata haiṁ sākhī। Tuma bhaktana kī lajjā rākhī॥
(Four Vedas bear witness, you protect the honor of devotees)

गुण गावत शारद मन माहीं। सुरपति ताको पार न पाहीं॥
Guṇa gāvata śārada mana māhīṁ। Surapati tāko pāra na pāhīṁ॥
(Saraswati sings your virtues, even Indra cannot comprehend) [10]

नाम तुम्हार लेत जो कोई। ता सम धन्य और नहिं होई॥
Nāma tumhāra leta jo koī। Tā sama dhanya aura nahiṁ hoī॥
(Whoever takes your name, none is more blessed than him)

राम नाम है अपरम्पारा। चारिहु वेदन जाहि पुकारा॥
Rāma nāma hai aparampārā। Chārihu vedana jāhi pukārā॥
(Ram's name is infinite, proclaimed by all four Vedas)

गणपति नाम तुम्हारो लीन्हों। तिनको प्रथम पूज्य तुम कीन्हों॥
Gaṇapati nāma tumhāro līnhoṁ। Tinako prathama pūjya tuma kīnhoṁ॥
(Ganapati took your name, you made him first to be worshipped)

शेष रटत नित नाम तुम्हारा। महि को भार शीश पर धारा॥
Śeṣa raṭata nita nāma tumhārā। Mahi ko bhāra śīśa para dhārā॥
(Shesha constantly chants your name, bearing Earth's burden on his head)

फूल समान रहत सो भारा। पावत कोउ न तुम्हरो पारा॥
Phūla samāna rahata so bhārā। Pāvata kau na tumharo pārā॥
(The burden remains light as a flower, none can fathom your limits)

भरत नाम तुम्हरो उर धारो। तासों कबहुँ न रण में हारो॥
Bharata nāma tumharo ura dhāro। Tāsoṁ kabahuṁ na raṇa meṁ hāro॥
(Bharat held your name in his heart, thus never lost in battle)

नाम शत्रुहन हृदय प्रकाशा। सुमिरत होत शत्रु कर नाशा॥
Nāma śatruhana hṛdaya prakāśā। Sumirata hota śatru kara nāśā॥
(Shatrughna's name shines in the heart, remembering destroys enemies)

लषन तुम्हारे आज्ञाकारी। सदा करत सन्तन रखवारी॥
Laṣana tumhāre ājñākārī। Sadā karata santana rakhavārī॥
(Lakshmana obeys your commands, always protects the saints)

ताते रण जीते नहिं कोई। युद्ध जुरे यमहूँ किन होई॥
Tāte raṇa jīte nahiṁ koī। Yuddha jure yamahūṁ kina hoī॥
(Therefore none defeats him in battle, even Yama cannot fight him)

महा लक्ष्मी धर अवतारा। सब विधि करत पाप को छारा॥
Mahā lakṣmī dhara avatārā। Saba vidhi karata pāpa ko chārā॥
(Mahalakshmi took incarnation, in all ways turns sins to ash) [20]

सीता राम पुनीता गायो। भुवनेश्वरी प्रभाव दिखायो॥
Sītā rāma punītā gāyo। Bhuvaneśvarī prabhāva dikhāyo॥
(Sita Ram sung as pure, showed the glory of Goddess of Universe)

घट सों प्रकट भई सो आई। जाको देखत चन्द्र लजाई॥
Ghaṭa soṁ prakaṭa bhaī so āī। Jāko dekhata chandra lajāī॥
(She emerged from the pot, seeing whom even moon feels shy)

सो तुमरे नित पांव पलोटत। नवो निद्धि चरणन में लोटत॥
So tumare nita pāṁva paloṭata। Navo niddhi charaṇana meṁ loṭata॥
(She serves your feet daily, nine treasures roll at your feet)

सिद्धि अठारह मंगल कारी। सो तुम पर जावै बलिहारी॥
Siddhi aṭhāraha maṅgala kārī। So tuma para jāvai balihārī॥
(Eighteen siddhis and auspiciousness, they all sacrifice themselves for you)

औरहु जो अनेक प्रभुताई। सो सीतापति तुमहिं बनाई॥
Aurahu jo aneka prabhutāī। So sītāpati tumahiṁ banāī॥
(And countless other powers, O consort of Sita, you created them)

इच्छा ते कोटिन संसारा। रचत न लागत पल की बारा॥
Ichchhā te koṭina sansārā। Rachata na lāgata pala kī bārā॥
(By mere will millions of worlds, you create without delay of a moment)

जो तुम्हरे चरनन चित लावै। ताको मुक्ति अवसि हो जावै॥
Jo tumhare charanana chita lāvai। Tāko mukti avasi ho jāvai॥
(One who focuses mind on your feet, liberation surely comes to him)

सुनहु राम तुम तात हमारे। तुमहिं भरत कुल-पूज्य प्रचारे॥
Sunahu rāma tuma tāta hamāre। Tumahiṁ bharata kula-pūjya prachāre॥
(Listen Ram, you are our father, you and Bharat lineage are worshipable)

तुमहिं देव कुल देव हमारे। तुम गुरु देव प्राण के प्यारे॥
Tumahiṁ deva kula deva hamāre। Tuma guru deva prāṇa ke pyāre॥
(You are our family deity, you are guru, beloved of our life)

जो कुछ हो सो तुमहीं राजा। जय जय जय प्रभु राखो लाजा॥
Jo kuchha ho so tumahīṁ rājā। Jaya jaya jaya prabhu rākho lājā॥
(Whatever exists, you are the king, victory to you Lord, protect our honor) [30]

रामा आत्मा पोषण हारे। जय जय जय दशरथ के प्यारे॥
Rāmā ātmā poṣaṇa hāre। Jaya jaya jaya daśaratha ke pyāre॥
(Ram, nourisher of souls, victory to beloved of Dasharatha)

जय जय जय प्रभु ज्योति स्वरूपा। निगुण ब्रह्म अखण्ड अनूपा॥
Jaya jaya jaya prabhu jyoti svarūpā। Niguṇa brahma akhaṇḍa anūpā॥
(Victory to Lord of light form, attributeless Brahman, undivided and unique)

सत्य सत्य जय सत्य-ब्रत स्वामी। सत्य सनातन अन्तर्यामी॥
Satya satya jaya satya-brata svāmī। Satya sanātana antaryāmī॥
(Truth, victory to Lord of truth vow, eternal truth, indweller of all)

सत्य भजन तुम्हरो जो गावै। सो निश्चय चारों फल पावै॥
Satya bhajana tumharo jo gāvai। So niśchaya chāroṁ phala pāvai॥
(One who truly sings your devotion, certainly attains all four fruits)

सत्य शपथ गौरीपति कीन्हीं। तुमने भक्तहिं सब सिद्धि दीन्हीं॥
Satya śapatha gaurīpati kīnhīṁ। Tumane bhaktahiṁ saba siddhi dīnhīṁ॥
(True is Shiva's oath, you gave all siddhis to devotees)

ज्ञान हृदय दो ज्ञान स्वरूपा। नमो नमो जय जापति भूपा॥
Jñāna hṛdaya do jñāna svarūpā। Namo namo jaya jāpati bhūpā॥
(Give knowledge to heart, O form of wisdom, salutations, victory to king of Yajnas)

धन्य धन्य तुम धन्य प्रतापा। नाम तुम्हार हरत संतापा॥
Dhanya dhanya tuma dhanya pratāpā। Nāma tumhāra harata santāpā॥
(Blessed are you, blessed is your glory, your name removes suffering)

सत्य शुद्ध देवन मुख गाया। बजी दुन्दुभी शंख बजाया॥
Satya śuddha devana mukha gāyā। Bajī dundubhī śaṅkha bajāyā॥
(Gods sang with pure truth, drums beat and conches sounded)

सत्य सत्य तुम सत्य सनातन। तुमहीं हो हमरे तन मन धन॥
Satya satya tuma satya sanātana। Tumahīṁ ho hamare tana mana dhana॥
(True, you are eternal truth, you alone are our body, mind and wealth)

याको पाठ करे जो कोई। ज्ञान प्रकट ताके उर होई॥
Yāko pāṭha kare jo koī। Jñāna prakaṭa tāke ura hoī॥
(Whoever recites this, knowledge manifests in his heart) [40]

आवागमन मिटै तिहि केरा। सत्य वचन माने शिव मेरा॥
Āvāgamana miṭai tihi kerā। Satya vachana māne śiva merā॥
(His cycle of birth-death ends, true are my words, says Shiva)

और आस मन में जो ल्यावै। तुलसी दल अरु फूल चढ़ावै॥
Aura āsa mana meṁ jo lyāvai। Tulasī dala aru phūla chaḍhāvai॥
(And one who brings hope in mind, offers Tulsi leaves and flowers)

साग पत्र सो भोग लगावै। सो नर सकल सिद्धता पावै॥
Sāga patra so bhoga lagāvai। So nara sakala siddhatā pāvai॥
(Offers vegetables and leaves as offering, that person attains all siddhis)

अन्त समय रघुबर पुर जाई। जहाँ जन्म हरि भक्त कहाई॥
Anta samaya raghubara pura jāī। Jahāṁ janma hari bhakta kahāī॥
(At end time goes to Ram's abode, wherever born is called devotee of Hari)

श्री हरि दास कहै अरु गावै। सो वैकुण्ठ धाम को पावै॥
Śrī hari dāsa kahai aru gāvai। So vaikuṇṭha dhāma ko pāvai॥
(Haridasa says and sings, he attains Vaikunth abode)

दोहा:
सात दिवस जो नेम कर पाठ करे चित लाय।
हरिदास हरिकृपा से अवसि भक्ति को पाय॥

Sāta divasa jo nema kara pāṭha kare chita lāya।
Haridāsa harikṛpā se avasi bhakti ko pāya॥

(One who makes it a vow for seven days and recites with concentration, by grace of Hari certainly attains devotion - says Haridasa)

राम चालीसा जो पढ़े रामचरण चित लाय।
जो इच्छा मन में करै सकल सिद्ध हो जाय॥

Rāma chālīsā jo paḍhe rāmacharaṇa chita lāya।
Jo ichchhā mana meṁ karai sakala siddha ho jāya॥

(One who reads Ram Chalisa with mind focused on Ram's feet, whatever desire he holds in mind, all become fulfilled)`,
  description: 'Shri Ram Chalisa - 40 verses in praise of Lord Rama. Begins with a Sanskrit doha summarizing the Ramayana, followed by chaupais extolling Ram\'s divine qualities, his role as protector of devotees, and the power of his holy name. Composed by Haridasa. Reciting with devotion for seven days brings divine grace, devotion, and fulfillment of all desires.'
};

async function addRamChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const newChalisa = new Devotional(ramChalisa);
    await newChalisa.save();
    console.log(`✓ Added: ${ramChalisa.title}`);

    console.log('\n✓ Ram Chalisa added successfully!');
    console.log('\nDetails:');
    console.log('- Category: Chalisa');
    console.log('- Deity: Rama (Lord Ram)');
    console.log('- Language: Hindi with English transliteration and translation');
    console.log('- Composed by: Haridasa');
    console.log('- Structure: Sanskrit summary Doha + 40 Chaupais + 2 Closing Dohas');
    console.log('- Opening verse: Sanskrit summary of entire Ramayana');
    console.log('\nBenefits:');
    console.log('- Grants knowledge and wisdom');
    console.log('- Removes cycle of birth and death');
    console.log('- Fulfills all desires');
    console.log('- Bestows all siddhis (powers)');
    console.log('- Leads to Vaikunth (divine abode)');
    console.log('- Protection from suffering');
    console.log('\nSpecial practice:');
    console.log('- Recite for 7 consecutive days for maximum benefit');
    console.log('- Offer Tulsi leaves and flowers');
    console.log('- Focus mind on Ram\'s lotus feet');

    // Verify total count
    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const ramChalisas = await Devotional.find({ category: 'Chalisa', deity: 'Rama' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Ram Chalisas: ${ramChalisas.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Ram Chalisa:', error);
    process.exit(1);
  }
}

addRamChalisa();
