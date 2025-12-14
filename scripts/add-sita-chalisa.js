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

const sitaChalisa = {
  title: 'Sita Chalisa',
  deity: 'Sita',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `दोहा:
बन्दौ चरण सरोज निज जनक लली सुख धाम।
राम प्रिय किरपा करें सुमिरौं आठों धाम॥

Bandau charaṇa saroja nija janaka lalī sukha dhāma।
Rāma priya kirapā kareṁ sumirauṁ āṭhoṁ dhāma॥

(I bow to the lotus feet of daughter of Janak, abode of happiness. May Ram's beloved shower grace, I remember the eight divine abodes)

कीरति गाथा जो पढ़ें सुधरैं सगरे काम।
मन मन्दिर बासा करें दुःख भंजन सिया राम॥

Kīrati gāthā jo paṛheṁ sudhareṁ sagare kāma।
Mana mandira bāsā kareṁ duḥkha bhañjana siyā rāma॥

(One who reads this glory song, all works are accomplished. Sita-Ram reside in the temple of mind, destroying all sorrows)

चौपाई:
राम प्रिया रघुपति रघुराई। बैदेही की कीरत गाई॥
Rāma priyā raghupati raghurāī। Baidehī kī kīrata gāī॥
(Beloved of Ram, Lord of Raghus, singing the glory of Vaidehi)

चरण कमल बन्दों सिर नाई। सिय सुरसरि सब पाप नसाई॥
Charaṇa kamala bandoṁ sira nāī। Siya surasari saba pāpa nasāī॥
(I bow my head to lotus feet, Sita like Ganga destroys all sins)

जनक दुलारी राघव प्यारी। भरत लखन शत्रुहन वारी॥
Janaka dulārī rāghava pyārī। Bharata lakhana śatruhana vārī॥
(Beloved of Janak, dear to Raghav, sacrificed upon by Bharat, Lakshman, Shatrughan)

दिव्या धरा सों उपजी सीता। मिथिलेश्वर भयो नेह अतीता॥
Divyā dharā soṁ upajī sītā। Mithileśvara bhayo neha atītā॥
(Divine Sita emerged from earth, Mithilesh's love became boundless) [4]

सिया रूप भायो मनवा अति। रच्यो स्वयंवर जनक महीपति॥
Siyā rūpa bhāyo manavā ati। Rachyo svayaṁvara janaka mahīpati॥
(Sita's beauty pleased the heart greatly, King Janak arranged Swayamvar)

भारी शिव धनु खींचै जोई। सिय जयमाल साजिहैं सोई॥
Bhārī śiva dhanu khīṁchai joī। Siya jayamāla sājihaiṁ soī॥
(Whoever can draw heavy Shiva's bow, Sita will garland him)

भूपति नरपति रावण संगा। नाहिं करि सके शिव धनु भंगा॥
Bhūpati narapati rāvaṇa saṅgā। Nāhiṁ kari sake śiva dhanu bhaṅgā॥
(Kings, emperors, Ravana together, could not break Shiva's bow)

जनक निराश भए लखि कारन। जनम्यो नाहिं अवनिमोहि तारन॥
Janaka nirāśa bhae lakhi kārana। Janamyo nāhiṁ avanimo hi tārana॥
(Janak became hopeless seeing this, thinking no one born on earth can lift it) [8]

यह सुन विश्वामित्र मुस्काए। राम लखन मुनि सीस नवाए॥
Yaha suna viśvāmitra muskāe। Rāma lakhana muni sīsa navāe॥
(Hearing this Vishwamitra smiled, Ram and Lakshman bowed to the sage)

आज्ञा पाई उठे रघुराई। इष्ट देव गुरु हियहिं मनाई॥
Ājñā pāī uṭhe raghurāī। Iṣṭa deva guru hiyahiṁ manāī॥
(Getting permission, Raghuraj stood up, praying to deity and guru in heart)

जनक सुता गौरी सिर नावा। राम रूप उनके हिय भावा॥
Janaka sutā gaurī sira nāvā। Rāma rūpa unake hiya bhāvā॥
(Janak's daughter bowed to Gauri, Ram's form pleased her heart)

मारत पलक राम कर धनु लै। खंड खंड करि पटकिन भू पै॥
Mārata palaka rāma kara dhanu lai। Khaṇḍa khaṇḍa kari paṭakina bhū pai॥
(In a blink Ram took the bow, broke it to pieces throwing on ground) [12]

जय जयकार हुई अति भारी। आनन्दित भए सबैं नर नारी॥
Jaya jayakāra huī ati bhārī। Ānandit bhae sabaiṁ nara nārī॥
(Great victory cries arose, all men and women became joyful)

सिय चली जयमाल सम्हाले। मुदित होय ग्रीवा में डाले॥
Siya chalī jayamāla samhāle। Mudita hoya grīvā meṁ ḍāle॥
(Sita walked holding victory garland, joyfully placed it on his neck)

मंगल बाज बजे चहुँ ओरा। परे राम संग सिया के फेरा॥
Maṅgala bāja baje chahuṁ orā। Pare rāma saṅga siyā ke pherā॥
(Auspicious music played from all sides, Sita took wedding rounds with Ram)

लौटी बारात अवधपुर आई। तीनों मातु करैं नोराई॥
Lauṭī bārāta avadhapura āī। Tīnoṁ mātu karaiṁ norāī॥
(Wedding procession returned to Ayodhya, three mothers performed welcoming ritual) [16]

कैकेई कनक भवन सिय दीन्हा। मातु सुमित्रा गोदहि लीन्हा॥
Kaikēī kanaka bhavana siya dīnhā। Mātu sumitrā godahi līnhā॥
(Kaikeyi gave golden palace to Sita, mother Sumitra took her in lap)

कौशल्या सूत भेंट दियो सिय। हरख अपार हुए सीता हिय॥
Kauśalyā sūta bheṁṭa diyo siya। Harakha apāra hue sītā hiya॥
(Kausalya gave son's gift to Sita, Sita's heart filled with boundless joy)

सब विधि बांटी बधाई। राजतिलक कई युक्ति सुनाई॥
Saba vidhi bāṁṭī badhāī। Rājatilaka kaī yukti sunāī॥
(Congratulations distributed in all ways, arrangements for coronation were announced)

मंद मती मंथरा अडाइन। राम न भरत राजपद पाइन॥
Manda matī mantharā aḍāina। Rāma na bharata rājapada pāina॥
(Dull-minded Manthara created obstacle, saying not Ram but Bharat should get throne) [20]

कैकेई कोप भवन मा गइली। वचन पति सों अपनेई गहिली॥
Kaikēī kopa bhavana mā gaīlī। Vachana pati soṁ apaněī gahilī॥
(Kaikeyi went to anger chamber, took promise from her husband)

चौदह बरस कोप बनवासा। भरत राजपद देहि दिलासा॥
Chaudaha barasa kopa banavāsā। Bharata rājapada dehi dilāsā॥
(Fourteen years exile in forest, console by giving throne to Bharat)

आज्ञा मानि चले रघुराई। संग जानकी लक्षमन भाई॥
Ājñā māni chale raghurāī। Saṅga jānakī lakṣamana bhāī॥
(Obeying command Raghuraj went, with Janaki and brother Lakshman)

सिय श्री राम पथ पथ भटकैं। मृग मारीचि देखि मन अटकै॥
Siya śrī rāma patha patha bhaṭakaiṁ। Mṛga mārīchi dekhi mana aṭakai॥
(Sita and Shri Ram wandered path to path, seeing Maricha deer mind got stuck) [24]

राम गए माया मृग मारन। रावण साधु बन्यो सिय कारन॥
Rāma gae māyā mṛga mārana। Rāvaṇa sādhu banyo siya kārana॥
(Ram went to kill illusory deer, Ravana disguised as sage for Sita)

भिक्षा कै मिस लै सिय भाग्यो। लंका जाई डरावन लाग्यो॥
Bhikṣā kai misa lai siya bhāgyo। Laṅkā jāī ḍarāvana lāgyo॥
(Under pretext of alms abducted Sita, went to Lanka and started threatening)

राम वियोग सों सिय अकुलानी। रावण सों कही कर्कश बानी॥
Rāma viyoga soṁ siya akulānī। Rāvaṇa soṁ kahī karkaśa bānī॥
(Sita distressed in separation from Ram, spoke harsh words to Ravana)

हनुमान प्रभु लाए अंगूठी। सिय चूड़ामणि दिहिन अनूठी॥
Hanumāna prabhu lāe aṅgūṭhī। Siya chūṛāmaṇi dihina anūṭhī॥
(Hanuman brought Lord's ring, Sita gave unique head jewel) [28]

अष्ठसिद्धि नवनिधि वर पावा। महावीर सिय शीश नवावा॥
Aṣṭhasiddhi navanidhi vara pāvā। Mahāvīra siya śīśa navāvā॥
(Received boon of eight siddhis and nine treasures, Mahavir bowed head to Sita)

सेतु बाँधी प्रभु लंका जीती। भक्त विभीषण सों करि प्रीती॥
Setu bāṁdhī prabhu laṅkā jītī। Bhakta vibhīṣaṇa soṁ kari prītī॥
(Built bridge, Lord conquered Lanka, made friendship with devotee Vibhishan)

चढ़ि विमान सिय रघुपति आए। भरत भ्रात प्रभु चरण सुहाए॥
Chaṛhi vimāna siya raghupati āe। Bharata bhrāta prabhu charaṇa suhāe॥
(Riding aircraft Sita and Raghupati came, brother Bharat welcomed Lord's feet)

अवध नरेश पाई राघव से। सिय महारानी देखि हिय हुलसे॥
Avadha nareśa pāī rāghava se। Siya mahārānī dekhi hiya hulase॥
(Raghav became king of Ayodhya, heart rejoiced seeing Queen Sita) [32]

रजक बोल सुनी सिय बन भेजी। लखनलाल प्रभु बात सहेजी॥
Rajaka bola sunī siya bana bhejī। Lakhanalalāla prabhu bāta sahejī॥
(Hearing washerman's words sent Sita to forest, Lord Lakshman handled the matter)

बाल्मीक मुनि आश्रय दीन्यो। लवकुश जन्म वहाँ पै लीन्हो॥
Bālmīka muni āśraya dīnyo। Lavakuśa janma vahāṁ pai līnho॥
(Sage Valmiki gave shelter, Luv-Kush were born there)

विविध भाँती गुण शिक्षा दीन्हीं। दोनुह रामचरित रट लीन्ही॥
Vividha bhāṁtī guṇa śikṣā dīnhīṁ। Donuha rāmacharita raṭa līnhī॥
(Gave virtuous education in various ways, both learned Ramcharit by heart)

लरिकल कै सुनि सुमधुर बानी। रामसिया सुत दुई पहिचानी॥
Larikala kai suni sumadhura bānī। Rāmasiyā suta duī pahichānī॥
(Hearing children's sweet speech, Ram-Sita recognized the two sons) [36]

भूलमानि सिय वापस लाए। राम जानकी सबहि सुहाए॥
Bhūlamāni siya vāpasa lāe। Rāma jānakī sabahi suhāe॥
(Mistakenly brought Sita back, Ram and Janaki pleased everyone)

सती प्रमाणिकता केहि कारन। बसुंधरा सिय के हिय धारन॥
Satī pramāṇikatā kehi kārana। Basundharā siya ke hiya dhārana॥
(To prove her chastity as reason, Earth held Sita in her heart)

अवनि सुता अवनी मां सोई। राम जानकी यही विधि खोई॥
Avani sutā avanī māṁ soī। Rāma jānakī yahī vidhi khoī॥
(Daughter of earth merged in mother earth, Ram lost Janaki in this way)

पतिव्रता मर्यादित माता। सीता सती नवावों माथा॥
Pativratā maryādit mātā। Sītā satī navāvoṁ māthā॥
(Devoted to husband, dignified mother, I bow my head to chaste Sita) [40]

दोहा:
जनकसुत अवनिधिया राम प्रिया लवमात।
चरणकमल जेहि उन बसै सीता सुमिरै प्रात॥

Janakasuta avanidhiyā rāma priyā lavamāta।
Charaṇakamala jehi una basai sītā sumirai prāta॥

(Daughter of Janak, daughter of earth, beloved of Ram, mother of Luv. At whose lotus feet one should dwell, remember Sita in the morning)`,
  description: 'Sita Chalisa - 40 verses in praise of Goddess Sita (Janaki), divine consort of Lord Rama. Narrates the complete story: divine birth from earth, Swayamvar where Ram broke Shiva\'s bow, marriage, exile to forest, abduction by Ravana, rescue by Ram with help of Hanuman, return to Ayodhya, birth of Luv-Kush, and finally merging back into mother earth. Sita represents the ideal woman - devoted wife (Pativrata), dignified mother, and embodiment of purity and virtue. Reciting brings marital harmony, removes obstacles, fulfills desires, and bestows the blessings of the divine mother.'
};

async function addSitaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const newChalisa = new Devotional(sitaChalisa);
    await newChalisa.save();
    console.log(`✓ Added: ${sitaChalisa.title}`);

    console.log('\n✓ Sita Chalisa added successfully!');
    console.log('\nDetails:');
    console.log('- Category: Chalisa');
    console.log('- Deity: Sita (Janaki/Vaidehi)');
    console.log('- Language: Hindi with English transliteration and translation');
    console.log('\nSita\'s Divine Names:');
    console.log('- Janaki (daughter of Janak)');
    console.log('- Vaidehi (princess of Videha/Mithila)');
    console.log('- Bhoomija/Avani Suta (daughter of Earth)');
    console.log('- Ram Priya (beloved of Ram)');
    console.log('- Luv-Kush Mata (mother of Luv-Kush)');
    console.log('\nStory Summary:');
    console.log('1. Divine birth from earth in Mithila');
    console.log('2. Swayamvar - Ram breaks Shiva\'s bow');
    console.log('3. Marriage and life in Ayodhya');
    console.log('4. Fourteen years exile with Ram and Lakshman');
    console.log('5. Abduction by Ravana (Maricha deer)');
    console.log('6. Ashok Vatika - meeting with Hanuman');
    console.log('7. Hanuman receives blessing of Ashta Siddhi Nava Nidhi');
    console.log('8. Ram builds bridge, conquers Lanka');
    console.log('9. Return to Ayodhya, coronation');
    console.log('10. Second exile, birth of Luv-Kush at Valmiki ashram');
    console.log('11. Final test - merging back into mother earth');
    console.log('\nBenefits:');
    console.log('- Perfect for women seeking marital harmony');
    console.log('- Removes obstacles in marriage');
    console.log('- Grants virtue and purity');
    console.log('- Bestows good children');
    console.log('- Fulfills all desires');
    console.log('- Removes sins');
    console.log('- Grants divine grace of Mother Sita');
    console.log('\nIdeal Epitome:');
    console.log('- Pativrata (devoted wife)');
    console.log('- Maryada (dignified conduct)');
    console.log('- Sati (chaste and pure)');
    console.log('- Ideal mother');
    console.log('\nWhen to Recite:');
    console.log('- Daily in the morning');
    console.log('- Before marriage ceremonies');
    console.log('- For marital happiness');
    console.log('- On Vivah Panchami (Sita-Ram marriage day)');

    // Verify total count
    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const sitaChalisas = await Devotional.find({ category: 'Chalisa', deity: 'Sita' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Sita Chalisas: ${sitaChalisas.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Sita Chalisa:', error);
    process.exit(1);
  }
}

addSitaChalisa();
