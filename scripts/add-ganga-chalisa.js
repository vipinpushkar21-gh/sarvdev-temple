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

const gangaChalisa = {
  title: 'Ganga Chalisa',
  deity: 'Ganga',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `दोहा:
जय जय जय जग पавनी,
जयति देवसरि गंग ।
जय शिव जटा निवासिनी,
अनुपम तुंग तरंग ॥

Jaya jaya jaya jag pāvanī,
Jayati devasarī gaṅg.
Jaya śiva jaṭā nivāsinī,
Anupam tunga taraṅg. 

(Hail, hail, hail — purifier of the world,
Hail the divine river Ganga.
Hail she who dwells in Shiva's matted hair,
Her waves are unmatched and high.)

चौपाई:
जय जय जननी हराना अघखानी ।
आनंद करनी गंगा महारानी ॥

Jaya jaya jananī harānā aghakhānī.
Ānanda karanī gaṅgā mahārānī.

(Hail, hail, Mother who removes sins;
Ganga, the great queen who brings joy.)

जय भगीरथी सुरसरि माता ।
कलिमल मूल डालिनी विख्याता ॥

Jaya bhagīrathī surasari mātā.
Kali-mala mūla ḍālinī vikhyātā.

(Hail Bhagirathi, the river-mother;
Renowned for washing away the roots of sin and impurity.)

जय जय जहानु सुता अघ हनानी ।
भीष्म की माता जगा जननी ॥

Jaya jaya Jahnū sutā agha hanānī.
Bhīṣma kī mātā jagā jananī.

(Hail Jahnavi, the daughter of Jahnu who destroys sins;
Mighty Bhishma calls her mother of the world.)

धवल कमल दल मम तनु सजे ।
लखी शत शरद चंद्र छवि लजाई ॥ ४ ॥

Dhavala kamala dala mama tanu saje,
Lakhī śata śarad candra chavi lajaī.

(Adorned like a white lotus, my body is beautified;
Like the cool autumn moon, her radiance causes modesty.)

वहां मकर विमल शुची सोहें ।
अमिया कलश कर लखी मन मोहें ॥

Vahāṁ makara vimal śucī sohe,
Amiya kalaśa kara lakhī mana mohe.

(There, the crocodile looks pure and beautiful;
The nectar-filled pot attracts the mind.)

जदिता रत्ना कंचन आभूषण ।
हिय मणि हर, हरानितम दूषण ॥

Jaditā ratnā kan̄cana ābhūṣaṇa,
Hiya maṇi hara, harānitam dūṣaṇa.

(Splendid with gems and gold ornaments;
Her heart is the jewel of Hari, remover of taint.)

जग पावनी त्रय ताप नासवनी ।
तरल तरंग तुंग मन भावनी ॥

Jag pāvanī traya tāpa nāsavānī,
Tarala taraṅga tunga mana bhāvanī.

(Purifier of the world, destroyer of the threefold sufferings;
Her flowing waves uplift the heart.)

जो गणपति अति पूज्य प्रधान ।
इहूं ते प्रथम गंगा अस्नाना ॥ ८ ॥

Jo gaṇapati ati pūjya pradhān,
Ihuṁ te pratham gaṅgā asnānā.

(Respected even by Ganapati, foremost of the revered;
Bathing here is the foremost Ganga-purification.)

ब्रह्मा कमंडल वासिनी देवी ।
श्री प्रभु पद पंकज सुख सेवि ॥

Brahmā kamaṇḍala vāsinī devī,
Śrī prabhu padha paṅkaja sukha sevi.

(She who dwells in Brahma's water pot,
Serves as the lotus for the Lord's feet and gives bliss.)

साथी सहस्त्र सागर सुत तरयो ।
गंगा सागर तीरथ धरयो ॥

Sāthī sahastra sāgara suta tarayō,
Gaṅgā sāgara tīrtha dharayō.

(With thousands of ocean-dwelling sons and companions,
Ganga established the sacred shores and tirthas.)

अगम तरंग उठ्यो मन भवन ।
लखी तीरथ हरिद्वार सुहावन ॥

Agama taraṅga uṭhyo mana bhavan,
Lakhī tīrtha Haridvār suhāvan.

(Rare waves arise that stir the mind;
Many pilgrimages like Haridwar are pleasant there.)

तीरथ राज प्रयाग अक्षैवेता ।
धरयो मातु पुनि काशी करवत ॥ १२ ॥

Tīrtha rāj Prayāga Akṣaivetā,
Dharayo mātu puni Kāśī karavat.

(Prayag, king of tirthas and immortal witness;
Mother Ganga carried on to Kashi likewise.)

धनी धनी सुरसरि स्वर्ग की सीधी ।
तरनी अमिता पितु पड़ पिरही ॥

Dhanī dhanī surasari svarga kī sīdhī,
Taranī amita pitu paḍa pirahī.

(Rich, rich is the divine river, straight path to heaven;
Boundless are the ferries to cross to the other shore.)

भागीरथी ताप कियो उपारा ।
दियो ब्रह्म तव सुरसरि धारा ॥

Bhāgīrathī tāpa kiyo upārā,
Diyo Brahma tava surasari dhārā.

(Bhagirthi endured great austerities;
Brahma bestowed this divine river flow.)

जब जग जननी चल्यो हहराई ।
शम्भु जाता महं रह्यो समाई ॥

Jaba jag jananī chalyō haharāī,
Śambhu jātā mahaṁ rahyō samāī.

(When the world's mother started to move, Shiva's presence became absorbed.)

वर्षा पर्यंत गंगा महारानी ।
रहीं शम्भू के जाता भुलानी ॥ १६ ॥

Varṣā paryanta gaṅgā mahārānī,
Rahīṁ Śambhū ke jātā bhulānī.

(Through the rainy season the great queen Ganga kept on,
Yet Shiva forgot to accompany her.)

पुनि भागीरथी शम्भुहीं ध्यायो ।
तब इक बूंद जटा से पायो ॥

Puni Bhāgīrathī Śambhūhīṁ dhyāyō,
Tab ika būnḍa jaṭā se pāyō.

(Then Bhagirathi meditated on Shiva and obtained a single drop from his matted hair.)

ताते मातु भें त्रय धारा ।
मृत्यु लोक, नाभा, अरु पातारा ॥

Tāte mātu bheṁ traya dhārā,
Mṛtyu loka, nābhā, aru pātārā.

(From that arose three streams: one to the realm of death, the navel, and the lower regions.)

गईं पाताल प्रभावती नामा ।
मन्दाकिनी गई गगन ललामा ॥

Gaīṁ pātāla prabhāvatī nāmā,
Mandākinī gaī gagana lalāmā.

(One went to the netherworld as Prabhavati,
Mandakini ascended and sparkled in the sky.)

मृत्यु लोक जाह्नवी सुहावनी ।
कलिमल हरनी अगम जग पावनि ॥ २० ॥

Mṛtyu loka Jāhnavī suhāvanī,
Kali-mala haranī agama jag pāvani.

(Jahnavi beautified the realm of death;
Ganga removes the filth of the age and is the purifier of the world.)

धनि मइया तब महिमा भारी ।
धर्मं धुरी कलि कलुष कुठारी ॥

Dhani maiya tab mahimā bhārī,
Dharmaṁ dhurī kali kaluṣa kuṭhārī.

(Then the wealthy mother bore great glory;
She became the pillar of dharma, breaking the corruption of Kali.)

मातु प्रभवति धनि मंदाकिनी ।
धनि सुर सरित सकल भयनासिनी ॥

Mātu prabhavati dhani Mandākinī,
Dhani sura sarita sakal bhaya-nāsinī.

(Mother Mandakini became glorified; the divine river removes all fears.)

पन करत निर्मल गंगा जल ।
पावत मन इच्छित अनंत फल ॥

Pan karat nirmala gaṅgā jal,
Pāvat mana icchita ananta phala.

(The pure water of Ganga grants the endless fruit wished by the mind.)

पुरव जन्म पुण्य जब जागत ।
तबहीं ध्यान गंगा महं लागत ॥ २४ ॥

Purava janma puṇya jaba jāgat,
Tabahīṁ dhyāna gaṅgā mahan lāgāt.

(When past life's merit awakens,
Then one naturally meditates on the great Ganga.)

जई पगु सुरसरी हेतु उठावही ।
तई जगि अश्वमेघ फल पावहि ॥

Jaī pagu surasari hetu uṭhāvahi,
Taī jagi aśvamegha phala pāvahi.

(Whoever lifts their foot for the divine river obtains the fruit of an Ashvamedha sacrifice.)

महा पतित जिन कहू न तारे ।
तिन तारे इक नाम तिहारे ॥

Mahā patita jina kaho na tāre,
Tin tāre ika nāma tihāre.

(Even the greatest fallen ones are not rescued except by your one name.)

शत योजन हूं से जो ध्यावहिं ।
निशचाई विष्णु लोक पद पावहीं ॥

Śata yojan hūṁ se jo dhyāvahiṁ,
Niśchāyī Viṣṇu loka pada pāvahiṁ.

(Whoever meditates from a hundred yojanas away surely attains Vishnu's realm.)

नाम भजत अगणित अघ नाशै ।
विमल ज्ञान बल बुद्धि प्रकाशे ॥ २८ ॥

Nāma bhajata agaṇit agha nāśai,
Vimala jñāna bala buddhi prakāśe.

(By repeating the name innumerable sins are destroyed;
Pure knowledge, strength and intellect shine forth.)

जिमी धन मूल धर्मं अरु दाना ।
धर्मं मूल गंगाजल पाना ॥

Jimī dhana mūla dharmaṁ aru dānā,
Dharmaṁ mūla gaṅgājala pānā.

(Though wealth is the root of charity, the root of dharma is Ganga's water.)

तब गुन गुणन करत दुख भाजत ।
गृह गृह सम्पति सुमति विराजत ॥

Tab guna guṇan karat dukha bhājat,
Gṛha gṛha sampati sumati virājat.

(Then virtues multiply, sorrows vanish;
Households fill with prosperity and wise counsel.)

गंगहि नेम सहित नित ध्यावत ।
दुर्जनहूं सज्जन पद पावत ॥

Gaṅgahi nema sahit nita dhyāvat,
Durjanahūṁ sajjan pada pāvat.

(Those who regularly observe Ganga's rules attain the company of the virtuous and avoid the wicked.)

उद्दिहिन विद्या बल पावै ।
रोगी रोग मुक्त हवे जावै ॥ ३२ ॥

Uddihina vidyā bala pāvai,
Rogī roga mukt have jāvai.

(One gains awakened knowledge and strength;
The sick are freed from disease.)

गंगा गंगा जो नर कहहीं ।
भूखा नंगा कभुहुह न रहहि ॥

Gaṅgā Gaṅgā jo nara kahahīṁ,
Bhūkhā naṅgā kabhuhu na rahahi.

(Whoever calls 'Ganga! Ganga!' no longer suffers hunger or nakedness.)

निकसत ही मुख गंगा माई ।
श्रवण दाबी यम चलहिं पराई ॥

Nikasata hī mukha gaṅgā māī,
Śravaṇa dābī yam calahiṁ parāī.

(When Ganga's mouth opens, Yama's claims are silenced;
Hearing her name even Yama turns away.)

महं अघिन अधमन कहं तारे ।
भए नरका के बंद किवारें ॥

Mahaṁ aghina adhaman kahan tāre,
Bhae narkā ke banda kivārēṁ.

(She rescues from the greatest sins and wickedness;
Those bound for hell are freed from their bonds.)

जो नर जपी गंग शत नामा ।
सकल सिद्धि पूरण ह्वै कामा ॥ ३६ ॥

Jo nara japī gaṅga śata nāmā,
Sakala siddhi pūraṇa hvai kāmā.

(Whoever repeats Ganga's name a hundred times has all accomplishments fulfilled.)

सब सुख भोग परम पद पावहीं ।
आवागमन रहित ह्वै जावहीं ॥

Saba sukha bhoga parama pada pāvahiṁ,
Āvāgaman rahita hvai jāvahiṁ.

(They enjoy all pleasures and attain the supreme abode;
Their comings and goings cease.)

धनि मइया सुरसरि सुख दैनि ।
धनि धनि तीरथ राज त्रिवेणी ॥

Dhani maiyā surasari sukha daini,
Dhani dhani tīrtha rāj Triveṇī.

(Wealthy mother Ganga bestows happiness;
The Triveni is the royalest of pilgrimages.)

ककरा ग्राम ऋषि दुर्वासा ।
सुन्दरदास गंगा कर दासा ॥

Kakarā grāma ṛṣi Durbāsā,
Sundaradāsa gaṅgā kara dāsā.

(At Kakra village sage Durvasa and Sundardas served Ganga.)

जो यह पढ़े गंगा चालीसा ।
मिली भक्ति अविरल वागीसा ॥ ४० ॥

Jo yaha paḍhe gaṅgā chālīsā,
Milī bhakti aviral vāgīsā.

(Whoever reads this Ganga Chalisa gains uninterrupted devotion and eloquence.)

दोहा:
नित नए सुख सम्पति लहैं, धरें गंगा का ध्यान ।
अंत समाई सुर पुर बसल, सदर बैठी विमान ॥

Nita naye sukha sampati lahaīṁ, dhareṁ gaṅgā kā dhyāna.
Anta samāī sur pura basala, sadar baiṭhī vimāna.

(Regular meditation on Ganga brings new joys and prosperity;
At the end one dwells in the celestial city and sits in the seat of bliss.)

संवत भुत नभ्दिशी, राम जन्म दिन चैत्र ।
पूरण चालीसा किया, हरी भक्तन हित नेत्र ॥

Samvat bhūta nabhdiśī, Rāma janma din Chetar.
Pūraṇa chālīsā kiyā, Harī bhaktan hita netra.

(The chalisa completed in the year noted, on Lord Rama's birth date in Chaitra—
May it benefit devotees of Hari.)` ,
  description: 'Ganga Chalisa - 40 verses praising Mother Ganga (Jahnavi/Bhagirati). Includes story of Bhagiratha, Jahnavi, Mandakini, and spiritual benefits of Ganga water and her name. Provides practice notes and benefits: purification, removal of sins, attaining punya, liberation, healing, prosperity. Inserted with Hindi lyrics plus transliteration and English translation.'
};

async function addGangaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: gangaChalisa.title, deity: 'Ganga' });
    if (existing) {
      console.log(`Ganga Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(gangaChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${gangaChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const gangaChalisas = await Devotional.find({ category: 'Chalisa', deity: 'Ganga' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Ganga Chalisas: ${gangaChalisas.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Ganga Chalisa:', error);
    process.exit(1);
  }
}

addGangaChalisa();
