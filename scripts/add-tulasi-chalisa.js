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

const tulasiChalisa = {
  title: 'Tulasi Chalisa',
  deity: 'Tulasi',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `दोहा:
जय जय तुलसी भगवती सत्यवती सुखदानी।
नमो नमो हरि प्रेयसी श्री वृन्दा गुन खानी॥

Jaya jaya tulasī bhagavatī satyavatī sukhadānī।
Namo namo hari preyasī śrī vṛndā guna khānī॥

(Victory to Goddess Tulasi, truthful one, giver of happiness. Salutations to beloved of Hari, Shri Vrinda, treasure of virtues)

श्री हरि शीश बिरजिनी, देहु अमर वर अम्ब।
जनहित हे वृन्दावनी अब न करहु विलम्ब॥

Śrī hari śīśa birajinī, dehu amara vara amba।
Janahita he vṛndāvanī aba na karahu vilamba॥

(One who adorns Hari's head, grant immortal boon O mother. For people's welfare O Vrindavan's goddess, now don't delay)

चौपाई:
धन्य धन्य श्री तुलसी माता। महिमा अगम सदा श्रुति गाता॥
Dhanya dhanya śrī tulasī mātā। Mahimā agama sadā śruti gātā॥
(Blessed is Mother Tulasi, incomprehensible glory always sung by Vedas)

हरि के प्राणहु से तुम प्यारी। हरीहीं हेतु कीन्हो तप भारी॥
Hari ke prāṇahu se tuma pyārī। Harīhīṁ hetu kīnho tapa bhārī॥
(Dearer than life to Hari, performed great penance for Hari's sake)

जब प्रसन्न है दर्शन दीन्ह्यो। तब कर जोरी विनय उस कीन्ह्यो॥
Jaba prasanna hai darśana dīnhyo। Taba kara jorī vinaya usa kīnhyo॥
(When pleased He gave darshan, then with folded hands she made humble request)

हे भगवन्त कन्त मम होहू। दीन जानी जनि छाडाहू छोहु॥
He bhagavanta kanta mama hohū। Dīna jānī jani chhāḍāhū chhohu॥
(O Lord, be my husband, knowing me as meek don't abandon your affection) [4]

सुनी लक्ष्मी तुलसी की बानी। दीन्हो श्राप कध पर आनी॥
Sunī lakṣmī tulasī kī bānī। Dīnho śrāpa kadha para ānī॥
(Hearing Tulasi's words, Lakshmi became angry and cursed)

उस अयोग्य वर मांगन हारी। होहू विटप तुम जड़ तनु धारी॥
Usa ayogya vara māṅgana hārī। Hohū viṭapa tuma jaṛa tanu dhārī॥
(You who asked for unworthy boon, become a plant taking inert body)

सुनी तुलसी हीं श्राप्यो तेहिं ठामा। करहु वास तुहू नीचन धामा॥
Sunī tulasī hīṁ śrāpyo tehiṁ ṭhāmā। Karahu vāsa tuhū nīchana dhāmā॥
(Hearing this, Tulasi also cursed her then, you also dwell in lowly abode)

दियो वचन हरि तब तत्काला। सुनहु सुमुखी जनि होहू बिहाला॥
Diyo vachana hari taba tatkālā। Sunahu sumukhī jani hohū bihālā॥
(Hari gave word then immediately, listen beautiful one, don't be distressed) [8]

समय पाई व्हौ रौ पाती तोरा। पुजिहौ आस वचन सत मोरा॥
Samaya pāī vhau rau pātī torā। Pujihau āsa vachana sata morā॥
(Getting time I will be your husband, I will worship, true is my word of hope)

तब गोकुल मह गोप सुदामा। तासु भई तुलसी तू बामा॥
Taba gokula maha gopa sudāmā। Tāsu bhaī tulasī tū bāmā॥
(Then in Gokul lived cowherd Sudama, his wife became you, O Tulasi)

कृष्ण रास लीला के माही। राधे शक्यो प्रेम लखी नाही॥
Kṛṣṇa rāsa līlā ke māhī। Rādhe śakyo prema lakhī nāhī॥
(In Krishna's Raas Leela, Radha couldn't tolerate seeing the love)

दियो श्राप तुलसिह तत्काला। नर लोकही तुम जन्महु बाला॥
Diyo śrāpa tulasih tatkālā। Nara lokhī tuma janmahu bālā॥
(Gave curse to Tulasi immediately, you be born in human world, girl) [12]

यो गोप वह दानव राजा। शङ्ख चूड़ नामक शिर ताजा॥
Yo gopa vaha dānava rājā। Śaṅkha chūṛa nāmaka śira tājā॥
(This cowherd became demon king, named Shankhchuda, fresh head crown)

तुलसी भई तासु की नारी। परम सती गुण रूप अगारी॥
Tulasī bhaī tāsu kī nārī। Parama satī guṇa rūpa agārī॥
(Tulasi became his wife, supreme chaste one, virtuous and beautiful)

अस द्वै कल्प बीत जब गयऊ। कल्प तृतीय जन्म तब भयऊ॥
Asa dvai kalpa bīta jaba gayaū। Kalpa tṛtīya janma taba bhayaū॥
(When two such eras passed, in third era then birth occurred)

वृन्दा नाम भयो तुलसी को। असुर जलन्धर नाम पति को॥
Vṛndā nāma bhayo tulasī ko। Asura jalandhara nāma pati ko॥
(Tulasi's name became Vrinda, husband's name was demon Jalandhar) [16]

करि अति द्वन्द अतुल बलधामा। लीन्हा शंकर से संग्राम॥
Kari ati dvanda atula baladhāmā। Līnhā śaṅkara se saṅgrāma॥
(Creating great conflict, with incomparable strength, took battle with Shankar)

जब निज सैन्य सहित शिव हारे। मरही न तब हर हरिही पुकारे॥
Jaba nija sainya sahita śiva hāre। Marahi na taba hara harihī pukāre॥
(When Shiva with his army was losing, couldn't kill him, Har called Hari)

पतिव्रता वृन्दा थी नारी। कोऊ न सके पतिहि संहारी॥
Pativratā vṛndā thī nārī। Koū na sake patih saṁhārī॥
(Vrinda was devoted wife, no one could kill her husband)

तब जलन्धर ही भेष बनाई। वृन्दा ढिग हरि पहुच्यो जाई॥
Taba jalandhara hī bheṣa banāī। Vṛndā ḍhiga hari pahuchyo jāī॥
(Then taking Jalandhar's form, Hari reached near Vrinda) [20]

शिव हित लही करि कपट प्रसंगा। कियो सतीत्व धर्म तोही भंगा॥
Śiva hita lahī kari kapaṭa prasaṅgā। Kiyo satītva dharma tohī bhaṅgā॥
(For Shiva's welfare through deceptive act, broke her chastity dharma)

भयो जलन्धर कर संहारा। सुनी उर शोक अपारा॥
Bhayo jalandhara kara saṁhārā। Sunī ura śoka apārā॥
(Jalandhar was destroyed, hearing this, boundless sorrow in heart)

तिही क्षण दियो कपट हरि टारी। लखी वृन्दा दुःख गिरा उचारी॥
Tihī kṣaṇa diyo kapaṭa hari ṭārī। Lakhī vṛndā duḥkha girā uchārī॥
(In that moment Hari removed deception, seeing Vrinda spoke words of sorrow)

जलन्धर जस हत्यो अभीता। सोई रावन तस हरिही सीता॥
Jalandhara jasa hatyo abhītā। Soī rāvana tasa harihī sītā॥
(As you killed Jalandhar fearlessly, same way Ravana will take Hari's Sita) [24]

अस प्रस्तर सम ह्रदय तुम्हारा। धर्म खण्डी मम पतिहि संहारा॥
Asa prastara sama hṛdaya tumhārā। Dharma khaṇḍī mama patihi saṁhārā॥
(Such stone-like is your heart, breaker of dharma, killed my husband)

यही कारण लही श्राप हमारा। होवे तनु पाषाण तुम्हारा॥
Yahī kāraṇa lahī śrāpa hamārā। Hove tanu pāṣāṇa tumhārā॥
(For this reason receive my curse, let your body become stone)

सुनी हरि तुरतहि वचन उचारे। दियो श्राप बिना विचारे॥
Sunī hari turatahi vachana uchāre। Diyo śrāpa binā vichāre॥
(Hearing this, Hari immediately spoke words, gave curse without thinking)

लख्यो न निज करतूती पति को। छलन चह्यो जब पारवती को॥
Lakhyo na nija karatūtī pati ko। Chhalan chahyo jaba pāravatī ko॥
(Didn't see your husband's deeds, when he tried to deceive Parvati) [28]

जड़मति तुहु अस हो जड़रूपा। जग मह तुलसी विटप अनूपा॥
Jaṛamati tuhu asa ho jaṛarūpā। Jaga maha tulasī viṭapa anūpā॥
(Dull-minded you, become inert form, in world become incomparable Tulasi plant)

धग्व रूप हम शालिग्रामा। नदी गण्डकी बीच ललामा॥
Dhagva rūpa hama śāligrāmā। Nadī gaṇḍakī bīcha lalāmā॥
(In stone form we become Shaligram, in middle of Gandaki river shining)

जो तुलसी दल हमही चढ़ईहैं। सब सुख भोगी परम पद पईहै॥
Jo tulasī dala hamahī chaṛaīhaiṁ। Saba sukha bhogī parama pada paīhai॥
(Whoever offers Tulasi leaves to me, enjoys all happiness, attains supreme position)

बिनु तुलसी हरि जलत शरीरा। अतिशय उठत शीश उर पीरा॥
Binu tulasī hari jalata śarīrā। Atiśaya uṭhata śīśa ura pīrā॥
(Without Tulasi Hari's body burns, excessive pain arises in head and chest) [32]

जो तुलसी दल हरि शिर धारत। सो सहस्त्र घट अमृत डारत॥
Jo tulasī dala hari śira dhārata। So sahastra ghaṭa amṛta ḍārata॥
(One who places Tulasi leaf on Hari's head, pours thousand pots of nectar)

तुलसी हरि मन रञ्जनी हारी। रोग दोष दुःख भंजनी हारी॥
Tulasī hari mana rañjanī hārī। Roga doṣa duḥkha bhañjanī hārī॥
(Tulasi delights Hari's mind, destroyer of diseases, faults and sorrows)

प्रेम सहित हरि भजन निरन्तर। तुलसी राधा में नाही अन्तर॥
Prema sahita hari bhajana nirantara। Tulasī rādhā meṁ nāhī antara॥
(With love constantly worshipping Hari, no difference between Tulasi and Radha)

व्यन्जन हो छप्पनहु प्रकारा। बिनु तुलसी दल न हरीहि प्यारा॥
Vyañjana ho chhappanahu prakārā। Binu tulasī dala na harīhi pyārā॥
(Even if there are fifty-six types of dishes, without Tulasi leaf not dear to Hari) [36]

सकल तीर्थ तुलसी तरु छाही। लहत मुक्ति जन संशय नाही॥
Sakala tīrtha tulasī taru chhāhī। Lahata mukti jana sanśaya nāhī॥
(All pilgrimage places are under Tulasi tree's shade, one attains liberation, no doubt)

कवि सुन्दर इक हरि गुण गावत। तुलसिहि निकट सहसगुण पावत॥
Kavi sundara ika hari guṇa gāvata। Tulasih nikaṭa sahasaguṇa pāvata॥
(Poet Sundar sings one virtue of Hari, near Tulasi receives thousand-fold virtue)

बसत निकट दुर्बासा धामा। जो प्रयास ते पूर्व ललामा॥
Basata nikaṭa durbāsā dhāmā। Jo prayāsa te pūrva lalāmā॥
(Dwells near Durvasa's abode, who by effort shines before)

पाठ करहि जो नित नर नारी। होही सुख भाषहि त्रिपुरारी॥
Pāṭha karahi jo nita nara nārī। Hohī sukha bhāṣahi tripurārī॥
(Men and women who recite daily, attain happiness says Tripurari) [40]

दोहा:
तुलसी चालीसा पढ़ही तुलसी तरु ग्रह धारी।
दीपदान करि पुत्र फल पावही बन्ध्यहु नारी॥

Tulasī chālīsā paṛahī tulasī taru graha dhārī।
Dīpadāna kari putra phala pāvahī bandhyahu nārī॥

(One who reads Tulasi Chalisa, keeps Tulasi plant at home, donating lamp, even barren woman gets son)

सकल दुःख दरिद्र हरि हार ह्वै परम प्रसन्न।
आशिय धन जन लड़हि ग्रह बसही पूर्णा अत्र॥

Sakala duḥkha daridra hari hāra hvai parama prasanna।
Āśiya dhana jana laṛahi graha basahī pūrṇā atra॥

(All sorrows and poverty Hari removes, becoming supremely pleased. With wealth, people, children at home, dwelling becomes complete here)

लाही अभिमत फल जगत मह लाही पूर्ण सब काम।
जेई दल अर्पही तुलसी तंह सहस बसही हरीराम॥

Lāhī abhimata phala jagata maha lāhī pūrṇa saba kāma।
Jeī dala arpahī tulasī taṁha sahasa basahī harīrāma॥

(Attains desired fruit in world, all works become complete. Wherever Tulasi leaves are offered, there thousand times dwells Hari-Ram)

तुलसी महिमा नाम लख तुलसी सूत सुखराम।
मानस चालीस रच्यो जग महं तुलसीदास॥

Tulasī mahimā nāma lakha tulasī sūta sukharāma।
Mānasa chālīsa rachyo jaga mahaṁ tulasīdāsa॥

(Seeing Tulasi's glory and name, son of Tulasi, Sukhram. In the world Tulsidas composed this Manas Chalisa)`,
  description: 'Tulasi Chalisa - 40 verses glorifying Holy Tulasi (Tulsi plant), most sacred to Lord Vishnu/Krishna. Narrates the divine story: Tulasi\'s devotion to Lord Vishnu, curse by Lakshmi to become a plant, birth as Vrinda (wife of demon Jalandhar), Lord Vishnu\'s deception for Shiva\'s welfare, her curse to Vishnu (Shaligram stone), and transformation into sacred Tulasi plant. Without Tulasi leaf, Lord Vishnu feels pain. Offering Tulasi equals thousand pots of nectar. No difference between Tulasi and Radha. All pilgrimage places dwell under Tulasi. Reciting daily brings happiness, removes poverty, grants children to barren women, fulfills all desires. Essential worship plant for Vaishnavites. Composed by Tulsidas.'
};

async function addTulasiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const newChalisa = new Devotional(tulasiChalisa);
    await newChalisa.save();
    console.log(`✓ Added: ${tulasiChalisa.title}`);

    console.log('\n✓ Tulasi Chalisa added successfully!');
    console.log('\nDetails:');
    console.log('- Category: Chalisa');
    console.log('- Deity: Tulasi (Holy Basil plant)');
    console.log('- Language: Hindi with English transliteration and translation');
    console.log('- Composed by: Tulsidas');
    console.log('\nTulasi\'s Divine Names:');
    console.log('- Tulasi/Tulsi - Holy Basil');
    console.log('- Vrinda - In Vrindavan form');
    console.log('- Satyavati - Truthful one');
    console.log('- Hari Preyasi - Beloved of Hari');
    console.log('- Vrindavani - Goddess of Vrindavan');
    console.log('\nDivine Story:');
    console.log('1. Tulasi performed penance for Lord Vishnu');
    console.log('2. Lakshmi cursed her to become a plant');
    console.log('3. Tulasi cursed Lakshmi to dwell in lowly abode');
    console.log('4. Born as wife of cowherd Sudama in Gokul');
    console.log('5. Radha cursed her to take human birth');
    console.log('6. Born as Vrinda, wife of demon king Shankhchuda/Jalandhar');
    console.log('7. Lord Vishnu deceived Vrinda for Shiva\'s welfare');
    console.log('8. Vrinda cursed Vishnu to become stone (Shaligram)');
    console.log('9. Transformed into sacred Tulasi plant');
    console.log('10. Lord declared Tulasi essential for His worship');
    console.log('\nSpiritual Significance:');
    console.log('- Without Tulasi, Vishnu\'s body burns with pain');
    console.log('- Offering one Tulasi leaf = 1000 pots of nectar');
    console.log('- No difference between Tulasi and Radha');
    console.log('- All pilgrimage places reside under Tulasi tree');
    console.log('- 56 dishes without Tulasi are not dear to Hari');
    console.log('- Vishnu resides 1000 times where Tulasi is offered');
    console.log('\nBenefits of Recitation:');
    console.log('- Removes all sorrows and poverty');
    console.log('- Grants children to childless couples');
    console.log('- Brings wealth, people, and prosperity');
    console.log('- Fulfills all desires');
    console.log('- Grants liberation (moksha)');
    console.log('- Destroys diseases, faults, and sorrows');
    console.log('- Pleases Lord Vishnu/Krishna supremely');
    console.log('\nHow to Practice:');
    console.log('- Recite daily near Tulasi plant');
    console.log('- Keep Tulasi plant at home');
    console.log('- Water daily (preferably in morning)');
    console.log('- Light lamp (diya) near Tulasi');
    console.log('- Offer prayers to Tulasi Devi');
    console.log('- Never pluck leaves on Sunday or Ekadashi');
    console.log('- Offer Tulasi leaves to Lord Vishnu/Krishna');
    console.log('\nNote: Tulasi is most sacred plant in Hinduism,');
    console.log('especially for Vaishnavites. Essential for all Vishnu worship.');

    // Verify total count
    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const tulasiChalisas = await Devotional.find({ category: 'Chalisa', deity: 'Tulasi' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Tulasi Chalisas: ${tulasiChalisas.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Tulasi Chalisa:', error);
    process.exit(1);
  }
}

addTulasiChalisa();
