const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Stotra' },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const newStotra = {
  title: 'श्रीरामरक्षास्तोत्रम् (Shri Ram Raksha Stotram)',
  deity: 'Ram',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Ram Raksha Stotram is a powerful protective hymn composed by the sage Budha Kaushika. According to tradition, Lord Shiva himself revealed this stotram to Budha Kaushika in a dream. The stotra consists of 38 verses that invoke the divine protection of Lord Rama over every part of the devotee\'s body — from head to toe. It opens with a meditation (dhyanam) on Lord Rama seated in padmasana with Sita on his left, holding a bow and arrows. The stotram declares that even a single syllable of Rama\'s story destroys the greatest sins, and those protected by Rama\'s name are invisible to malevolent beings. It praises Rama as the jewel among kings, the ocean of compassion, the darling of Janaki, and the refuge of all. The concluding verses celebrate Rama as mother, father, master, friend and everything. This stotram is also known as the Vajra Panjara (diamond cage) kavach of Rama, granting invincibility and auspiciousness to the reciter.',
  lyrics: `॥ श्रीरामरक्षास्तोत्रम् ॥

श्रीगणेशायनमः।
अस्य श्रीरामरक्षास्तोत्रमन्त्रस्य।
बुधकौशिक ऋषिः।
श्रीसीतारामचन्द्रो देवता।
अनुष्टुप् छन्दः।
सीता शक्तिः।
श्रीमद्हनुमान् कीलकम्।
श्रीसीतारामचन्द्रप्रीत्यर्थे जपे विनियोगः॥

॥ अथ ध्यानम् ॥

ध्यायेदाजानुबाहुं धृतशरधनुषं बद्धपद्मासनस्थं।
पीतं वासो वसानं नवकमलदलस्पर्धिनेत्रं प्रसन्नम्॥
वामाङ्कारूढ-सीता-मुखकमल-मिलल्लोचनं नीरदाभं।
नानालङ्कारदीप्तं दधतमुरुजटामण्डनं रामचन्द्रम्॥

॥ इति ध्यानम् ॥

चरितं रघुनाथस्य शतकोटिप्रविस्तरम्।
एकैकमक्षरं पुंसां महापातकनाशनम्॥1॥

ध्यात्वा नीलोत्पलश्यामं रामं राजीवलोचनम्।
जानकीलक्ष्मणोपेतं जटामुकुटमण्डितम्॥2॥

सासितूणधनुर्बाणपाणिं नक्तं चरान्तकम्।
स्वलीलया जगत्त्रातुमाविर्भूतमजं विभुम्॥3॥

रामरक्षां पठेत्प्राज्ञः पापघ्नीं सर्वकामदाम्।
शिरो मे राघवः पातु भालं दशरथात्मजः॥4॥

कौसल्येयो दृशौ पातु विश्वामित्रप्रियः श्रुती।
घ्राणं पातु मखत्राता मुखं सौमित्रिवत्सलः॥5॥

जिव्हां विद्यानिधिः पातु कण्ठं भरतवन्दितः।
स्कन्धौ दिव्यायुधः पातु भुजौ भग्नेशकार्मुकः॥6॥

करौ सीतापतिः पातु हृदयं जामदग्न्यजित्।
मध्यं पातु खरध्वंसी नाभिं जाम्बवदाश्रयः॥7॥

सुग्रीवेशः कटी पातु सक्थिनी हनुमत्प्रभुः।
ऊरू रघूत्तमः पातु रक्षःकुलविनाशकृत्॥8॥

जानुनी सेतुकृत्पातु जङ्घे दशमुखान्तकः।
पादौ बिभीषणश्रीदः पातु रामोऽखिलं वपुः॥9॥

एतां रामबलोपेतां रक्षां यः सुकृती पठेत्।
स चिरायुः सुखी पुत्री विजयी विनयी भवेत्॥10॥

पाताल-भूतल-व्योम-चारिणश्छद्मचारिणः।
न द्रष्टुमपि शक्तास्ते रक्षितं रामनामभिः॥11॥

रामेति रामभद्रेति रामचन्द्रेति वा स्मरन्।
नरो न लिप्यते पापैः भुक्तिं मुक्तिं च विन्दति॥12॥

जगज्जेत्रैकमन्त्रेण रामनाम्नाऽभिरक्षितम्।
यः कण्ठे धारयेत्तस्य करस्थाः सर्वसिद्धयः॥13॥

वज्रपञ्जरनामेदं यो रामकवचं स्मरेत्।
अव्याहताज्ञः सर्वत्र लभते जयमङ्गलम्॥14॥

आदिष्टवान् यथा स्वप्ने रामरक्षामिमां हरः।
तथा लिखितवान् प्रातः प्रबुद्धो बुधकौशिकः॥15॥

आरामः कल्पवृक्षाणां विरामः सकलापदाम्।
अभिरामस्त्रिलोकानां रामः श्रीमान् स नः प्रभुः॥16॥

तरुणौ रूपसम्पन्नौ सुकुमारौ महाबलौ।
पुण्डरीकविशालाक्षौ चीरकृष्णाजिनाम्बरौ॥17॥

फलमूलशिनौ दान्तौ तापसौ ब्रह्मचारिणौ।
पुत्रौ दशरथस्यैतौ भ्रातरौ रामलक्ष्मणौ॥18॥

शरण्यौ सर्वसत्वानां श्रेष्ठौ सर्वधनुष्मताम्।
रक्षःकुलनिहन्तारौ त्रायेतां नो रघूत्तमौ॥19॥

आत्तसज्जधनुषा विषुस्पृशावक्षया शुगनिषङ्गसङ्गिनौ।
रक्षणाय मम रामलक्ष्मणावग्रतःपथि सदैव गच्छताम्॥20॥

संनद्धः कवचीखड्गी चापबाणधरो युवा।
गच्छन् मनोरथोऽस्माकं रामः पातु सलक्ष्मणः॥21॥

रामो दाशरथिः शूरो लक्ष्मणानुचरो बली।
काकुत्स्थः पुरुषः पूर्णः कौसल्येयो रघूत्तमः॥22॥

वेदान्तवेद्यो यज्ञेशः पुराणपुरुषोत्तमः।
जानकीवल्लभः श्रीमानप्रमेयपराक्रमः॥23॥

इत्येतानि जपेन्नित्यं मद्भक्तः श्रद्धयान्वितः।
अश्वमेधाधिकं पुण्यं सम्प्राप्नोति न संशयः॥24॥

रामं दूर्वादलश्यामं पद्माक्षं पीतवाससम्।
स्तुवन्ति नामभिर्दिव्यैर्न ते संसारिणो नरः॥25॥

रामं लक्ष्मण-पूर्वजं रघुवरं सीतापतिं सुन्दरं।
काकुत्स्थं करुणार्णवं गुणनिधिं विप्रप्रियं धार्मिकम्।
राजेन्द्रं सत्यसन्धं दशरथ-तनयं श्यामलं शान्तमूर्तिं।
वन्दे लोकाभिरामं रघुकुलतिलकं राघवं रावणारिम्॥26॥

रामाय रामभद्राय रामचन्द्राय वेधसे।
रघुनाथाय नाथाय सीतायाः पतये नमः॥27॥

श्रीराम राम रघुनन्दन राम राम।
श्रीराम राम भरताग्रज राम राम।
श्रीराम राम रणकर्कश राम राम।
श्रीराम राम शरणं भव राम राम॥28॥

श्रीरामचन्द्रचरणौ मनसा स्मरामि।
श्रीरामचन्द्रचरणौ वचसा गृणामि।
श्रीरामचन्द्रचरणौ शिरसा नमामि।
श्रीरामचन्द्रचरणौ शरणं प्रपद्ये॥29॥

माता रामो मत्पिता रामचन्द्रः।
स्वामी रामो मत्सखा रामचन्द्रः।
सर्वस्वं मे रामचन्द्रो दयालुर्।
नान्यं जाने नैव जाने न जाने॥30॥

दक्षिणे लक्ष्मणो यस्य वामे च जनकात्मजा।
पुरतो मारुतिर्यस्य तं वन्दे रघुनन्दनम्॥31॥

लोकाभिरामं रणरङ्गधीरं राजीवनेत्रं रघुवंशनाथम्।
कारुण्यरूपं करुणाकरं तं श्रीरामचन्द्रं शरणं प्रपद्ये॥32॥

मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।
वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥33॥

कूजन्तं राम-रामेति मधुरं मधुराक्षरम्।
आरुह्य कविताशाखां वन्दे वाल्मीकिकोकिलम्॥34॥

आपदामपहर्तारं दातारं सर्वसम्पदाम्।
लोकाभिरामं श्रीरामं भूयो भूयो नमाम्यहम्॥35॥

भर्जनं भवबीजानामर्जनं सुखसम्पदाम्।
तर्जनं यमदूतानां रामरामेति गर्जनम्॥36॥

रामो राजमणिः सदाविजयते रामं रमेशं भजे।
रामेणाभिहता निशाचरचमूरामाय तस्मै नमः।
रामान्नास्ति परायणं परतरं रामस्य दासोऽस्म्यहम्।
रामे चित्तलयः सदा भवतु मे भो राम मामुद्धर॥37॥

राम रामेति रामेति रमे रामे मनोरमे।
सहस्रनाम तत्तुल्यं रामनाम वरानने॥38॥

॥ इति श्रीबुधकौशिकमुनिविरचितं श्रीरामरक्षास्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Ram Raksha Stotram ॥

Shri Ganeshaya Namah.
Asya Shri Rama Raksha Stotra Mantrasya.
Budha Kaushika Rishih.
Shri Sitaramachandro Devata.
Anushtup Chhandah.
Sita Shaktih.
Shrimad Hanuman Keelakam.
Shri Sitaramachandra Prityarthe Jape Viniyogah.

॥ Atha Dhyanam ॥

Dhyayedajanubahum dhritasharadhanusham baddhapadmasanastham.
Pitam vaso vasanam navakamadalaspardhinetram prasannam.
Vamankaarudha-Sita-mukhakamala-milallochanam niradabham.
Nanalankaaradiptam dadhatamurujatamandanam Ramachandram.

॥ Iti Dhyanam ॥

Charitam Raghunāthasya shatakotipravistaram.
Ekaikamaksharam pumsam mahapatakanaashanam॥1॥

Dhyatva nilotpalashyamam Ramam rajivalochanam.
Janaki-Lakshmano-petam jatamukutamanditam॥2॥

Sasitūnadhanurbanapānim naktam charāntakam.
Svalilaya jagattrātumāvirbhūtamajam vibhum॥3॥

Ramarakshām pathetprajnah pāpaghnim sarvakāmadām.
Shiro me Rāghavah pātu bhālam Dasharathātmajah॥4॥

Kausalyeyo drishau pātu Vishvāmitrapriyah shruti.
Ghrānam pātu makhatrātā mukham Saumitrivatsalah॥5॥

Jihvām Vidyānidhih pātu kantham Bharatavandtitah.
Skandhau Divyāyudhah pātu bhujau Bhagneshakārmukah॥6॥

Karau Sitāpatih pātu hridayam Jāmadagnyajit.
Madhyam pātu Kharadhvamsi nābhim Jāmbavadāshrayah॥7॥

Sugrivesah kati pātu sakthini Hanumatprabhuh.
Uru Raghūttamah pātu rakshahkulavināshakrit॥8॥

Jānuni Setukritpātu janghe Dashamukhāntakah.
Pādau Bibhishanashridah pātu Rāmo'khilam vapuh॥9॥

Etām Rāmabalopetām rakshām yah sukriti pathet.
Sa chirāyuh sukhi putri vijayi vinayi bhavet॥10॥

Pātāla-bhūtala-vyoma-chārinashchhadmachārinah.
Na drashtumapi shaktāste rakshitam Rāmanāmabhih॥11॥

Rāmeti Rāmabhadreti Rāmachandreti vā smaran.
Naro na lipyate pāpaih bhuktim muktim cha vindati॥12॥

Jagajjaitraikamantrena Rāmanāmnā'bhirakshitam.
Yah kanthe dhārayettasya karasthāh sarvasiddhayah॥13॥

Vajrapanjaranāmedam yo Rāmakavacham smaret.
Avyāhatājnah sarvatra labhate jayamangalam॥14॥

Ādishtavān yathā svapne Rāmarakshāmimām Harah.
Tathā likhitavān prātah prabuddho Budhakaushikah॥15॥

Ārāmah kalpavrikshānām virāmah sakalāpadām.
Abhirāmastrilokānām Rāmah shrīmān sa nah prabhuh॥16॥

Tarunau rūpasampannau sukumārau mahābalau.
Pundarikavishalākshau chirakrishnājinambarau॥17॥

Phalamūlashinau dāntau tāpasau brahmachārinau.
Putrau Dasharathasyaitau bhrātarau Rāma-Lakshmanau॥18॥

Sharanyau sarvasatvānām shreshthou sarvadhanushtamām.
Rakshahkulanihantārau trāyetām no Raghūttamau॥19॥

Āttasajjadhanushā vishusprishāvakshayā shuganishangasanginau.
Rakshanāya mama Rāma-Lakshmanaavagrathah pathi sadaiva gachchhatām॥20॥

Sannaddhah kavachikhadgi chāpabānadharo yuvā.
Gachchhan manoratho'smākam Rāmah pātu Salakshmanalh॥21॥

Rāmo Dāsharathih shūro Lakshmanānucharo bali.
Kākutsthah purushah pūrnah Kausalyeyo Raghūttamah॥22॥

Vedāntavedyo Yajnēshah Purānapurushottamah.
Jānakivallabhah shrīmānaprameyaparākramah॥23॥

Ityetāni japennityam madbhaktah shraddhayānvitah.
Ashvamedhadhikam punyam samprāpnoti na samshayah॥24॥

Rāmam dūrvādalashyāmam padmāksham pitavāsasam.
Stuvanti nāmabhirdivyairna te samsārino narah॥25॥

Rāmam Lakshmana-pūrvajam Raghuvaram Sītāpatim sundaram.
Kākutstham karunārṇavam guṇanidhim viprapriyam dhārmikam.
Rājendram satyasandham Dasharatha-tanayam shyāmalam shāntamūrtim.
Vande lokābhirāmam Raghukulatilakam Rāghavam Rāvanārim॥26॥

Rāmāya Rāmabhadrāya Rāmachandrāya vedhase.
Raghunāthāya nāthāya Sītāyāh pataye namah॥27॥

Shri Rāma Rāma Raghunandana Rāma Rāma.
Shri Rāma Rāma Bharatāgraja Rāma Rāma.
Shri Rāma Rāma Ranakarkasha Rāma Rāma.
Shri Rāma Rāma sharanam bhava Rāma Rāma॥28॥

Shri Rāmachandracharanau manasā smarāmi.
Shri Rāmachandracharanau vachasā grinami.
Shri Rāmachandracharanau shirasā namāmi.
Shri Rāmachandracharanau sharanam prapadye॥29॥

Mātā Rāmo matpitā Rāmachandrah.
Svāmi Rāmo matsakha Rāmachandrah.
Sarvasvam me Rāmachandro dayālur.
Nānyam jāne naiva jāne na jāne॥30॥

Dakshine Lakshmano yasya vāme cha Janakātmajā.
Purato Mārutiryasya tam vande Raghunandanam॥31॥

Lokābhirāmam ranarangadhiram rājivanetram Raghuvamshanātham.
Kārunyarūpam karunākaram tam Shri Rāmachandram sharanam prapadye॥32॥

Manojavam Mārutatulyavegam jitendriyam buddhimatām varishtham.
Vātātmajam vānarayūthamukhyam Shri Rāmadūtam sharanam prapadye॥33॥

Kūjantam Rāma-Rāmeti madhuram madhurāksharam.
Āruhya kavitāshākhām vande Vālmikikokilam॥34॥

Āpadāmapahartāram dātāram sarvasampadām.
Lokābhirāmam Shri Rāmam bhūyo bhūyo namāmyaham॥35॥

Bharjanam bhavabijānāmarjanam sukhasampadām.
Tarjanam yamadūtānām Rāma-Rāmeti garjanam॥36॥

Rāmo rājamanihsadāvijayate Rāmam Ramesham bhaje.
Rāmenābhihatā nishācharachamūrāmāya tasmai namah.
Rāmannāsti parāyanam parataram Rāmasya dāso'smyaham.
Rāme chittalayah sadā bhavatu me bho Rāma māmudddhara॥37॥

Rāma Rāmeti Rāmeti rame Rāme manorame.
Sahasranāma tattulyam Rāmanāma varānane॥38॥

॥ Iti Shri Budhakaushikamuni Virachitam Shri Ram Raksha Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shri Ram Raksha Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Shri Ram Raksha Stotram added successfully!');
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`📜 Total Stotras in DB: ${total}`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addStotra();
