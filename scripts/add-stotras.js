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

// ──────────────────────────────────────────────────────────────
// All stotras below are ancient Sanskrit texts (public domain).
// Presented in Devanagari + Roman English transliteration.
// ──────────────────────────────────────────────────────────────

const stotras = [

// ── 1. Shri Ganesh Stotram ──
{
  title: 'श्री गणेश स्तोत्रम् (Shri Ganesh Stotram)',
  deity: 'Ganesha',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'A sacred hymn dedicated to Lord Ganesha, the remover of obstacles. Recited before beginning any new venture or prayer to invoke his blessings.',
  lyrics: `॥ श्री गणेश स्तोत्रम् ॥

प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम् ।
भक्तावासं स्मरेन्नित्यं आयुःकामार्थसिद्धये ॥१॥

प्रथमं वक्रतुण्डं च एकदन्तं द्वितीयकम् ।
तृतीयं कृष्णपिङ्गाक्षं गजवक्त्रं चतुर्थकम् ॥२॥

लम्बोदरं पञ्चमं च षष्ठं विकटमेव च ।
सप्तमं विघ्नराजेन्द्रं धूम्रवर्णं तथाष्टमम् ॥३॥

नवमं भालचन्द्रं च दशमं तु विनायकम् ।
एकादशं गणपतिं द्वादशं तु गजाननम् ॥४॥

द्वादशैतानि नामानि त्रिसन्ध्यं यः पठेन्नरः ।
न च विघ्नभयं तस्य सर्वसिद्धिकरं प्रभो ॥५॥

---

॥ Shri Ganesh Stotram ॥

Pranamya Shirasa Devam Gauriputram Vinayakam |
Bhaktavasam Smarennityam Ayuhkamartha Siddhaye ||1||

Prathamam Vakratundam Cha Ekadantam Dvitiyakam |
Tritiyam Krishnapingaksham Gajavaktram Chaturthakam ||2||

Lambodaram Panchamam Cha Shashtham Vikatameva Cha |
Saptamam Vighnarajendram Dhumravarnam Tathashtamam ||3||

Navamam Bhalachandram Cha Dashamam Tu Vinayakam |
Ekadasham Ganapatim Dvadasham Tu Gajananam ||4||

Dvadashetani Namani Trisandhyam Yah Pathennarah |
Na Cha Vighnabhayam Tasya Sarvasiddhikaram Prabho ||5||`
},

// ── 2. Shiv Tandav Stotram ──
{
  title: 'शिव ताण्डव स्तोत्रम् (Shiv Tandav Stotram)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Composed by Ravana, the Shiv Tandav Stotram describes the power and beauty of Lord Shiva\'s cosmic dance (Tandava). One of the most powerful Shiva stotras.',
  lyrics: `॥ शिव ताण्डव स्तोत्रम् ॥

जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥१॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी-
-विलोलवीचिवल्लरीविराजमानमूर्धनि ।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥२॥

धराधरेन्द्रनन्दिनीविलासबन्धुबन्धुर
स्फुरद्दिगन्तसन्ततिप्रमोदमानमानसे ।
कृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि
क्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि ॥३॥

जटाभुजङ्गपिङ्गलस्फुरत्फणामणिप्रभा
कदम्बकुङ्कुमद्रवप्रलिप्तदिग्वधूमुखे ।
मदान्धसिन्धुरस्फुरत्त्वगुत्तरीयमेदुरे
मनो विनोदमद्भुतं बिभर्तु भूतभर्तरि ॥४॥

सहस्रलोचनप्रभृत्यशेषलेखशेखर
प्रसूनधूलिधोरणी विधूसराङ्घ्रिपीठभूः ।
भुजङ्गराजमालया निबद्धजाटजूटक
श्रियै चिराय जायतां चकोरबन्धुशेखरः ॥५॥

---

॥ Shiv Tandav Stotram ॥

Jatatavigalajjala Pravahapavitasthale
Gale'valambya Lambitam Bhujanga Tungamalikam |
Damaddamaddamaddamanninadavaddamarvayam
Chakara Chandatandavam Tanotu Nah Shivah Shivam ||1||

Jatakataha Sambhrama Bhramannilimpanirjhari
Vilola Vichi Vallari Virajamana Murdhani |
Dhagaddhagaddhagajjvalallalata Pattapavake
Kishorachandrashekare Ratih Pratikshanam Mama ||2||

Dharadharendranandini Vilasabandhubandhu-
Ra Sphuraddiganta Santati Pramodamanamanase |
Kripakataксhadhorani Niruddhadurdharapadi
Kvachiddigambare Mano Vinodametu Vastuni ||3||

Jatabhujangapingala Sphuratphanamaniprabha
Kadambakunkumadravapralipta Digvadhumukhe |
Madandhasindhu Rasphurat Tvaguttariyamedure
Mano Vinodam Adbhutam Bibhartu Bhutabhar­tari ||4||

Sahasra Lochana Prabhritya Sheshalekha Shekhara
Prasunadhuli Dhorani Vidhusaranghri Pithabhuh |
Bhujangarajamalaya Nibaddhajatajutaka
Shriyai Chiraya Jayatam Chakorabandhu Shekharah ||5||`
},

// ── 3. Lingashtakam ──
{
  title: 'लिङ्गाष्टकम् (Lingashtakam)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Lingashtakam is a sacred hymn of eight verses praising Lord Shiva in the form of the Lingam. It describes the divine qualities of the Shiva Lingam.',
  lyrics: `॥ लिङ्गाष्टकम् ॥

ब्रह्ममुरारिसुरार्चितलिङ्गं
निर्मलभासितशोभितलिङ्गम् ।
जन्मजदुःखविनाशकलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥१॥

देवमुनिप्रवरार्चितलिङ्गं
कामदहनकरुणाकरलिङ्गम् ।
रावणदर्पविनाशनलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥२॥

सर्वसुगन्धिसुलेपितलिङ्गं
बुद्धिविवर्धनकारणलिङ्गम् ।
सिद्धसुरासुरवन्दितलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥३॥

कनकमहामणिभूषितलिङ्गं
फणिपतिवेष्टितशोभितलिङ्गम् ।
दक्षसुयज्ञविनाशनलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥४॥

कुङ्कुमचन्दनलेपितलिङ्गं
पङ्कजहारसुशोभितलिङ्गम् ।
सञ्चितपापविनाशनलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥५॥

देवगणार्चितसेवितलिङ्गं
भावैर्भक्तिभिरेव च लिङ्गम् ।
दिनकरकोटिप्रभाकरलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥६॥

अष्टदलोपरिवेष्टितलिङ्गं
सर्वसमुद्भवकारणलिङ्गम् ।
अष्टदरिद्रविनाशनलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥७॥

सुरगुरुसुरवरपूजितलिङ्गं
सुरवनपुष्पसदार्चितलिङ्गम् ।
परात्परं परमात्मकलिङ्गं
तत्प्रणमामि सदाशिवलिङ्गम् ॥८॥

लिङ्गाष्टकमिदं पुण्यं यः पठेच्छिवसन्निधौ ।
शिवलोकमवाप्नोति शिवेन सह मोदते ॥

---

॥ Lingashtakam ॥

Brahma Murari Surarchita Lingam
Nirmala Bhasita Shobhita Lingam |
Janmaja Duhkha Vinashaka Lingam
Tat Pranamami Sadashiva Lingam ||1||

Deva Muni Pravararchita Lingam
Kamadahana Karunakara Lingam |
Ravana Darpa Vinashana Lingam
Tat Pranamami Sadashiva Lingam ||2||

Sarva Sugandhi Sulepita Lingam
Buddhi Vivardhana Karana Lingam |
Siddha Surasura Vandita Lingam
Tat Pranamami Sadashiva Lingam ||3||

Kanaka Mahamani Bhushita Lingam
Phanipati Veshtita Shobhita Lingam |
Daksha Suyajna Vinashana Lingam
Tat Pranamami Sadashiva Lingam ||4||

Kumkuma Chandana Lepita Lingam
Pankaja Hara Sushobhita Lingam |
Sanchita Papa Vinashana Lingam
Tat Pranamami Sadashiva Lingam ||5||

Deva Ganarchita Sevita Lingam
Bhavairbhaktibhireva Cha Lingam |
Dinakara Koti Prabhakara Lingam
Tat Pranamami Sadashiva Lingam ||6||

Ashtadalo Pariveshtita Lingam
Sarva Samudbhava Karana Lingam |
Ashtadaridra Vinashana Lingam
Tat Pranamami Sadashiva Lingam ||7||

Suraguru Suravara Pujita Lingam
Suravana Pushpa Sadarchita Lingam |
Paratparam Paramatmaka Lingam
Tat Pranamami Sadashiva Lingam ||8||

Lingashtakamidam Punyam Yah Pathech Chiva Sannidhau |
Shivalokamavapnoti Shivena Saha Modate ||`
},

// ── 4. Sri Vishnu Sahasranama Stotram (Key Verses) ──
{
  title: 'श्री विष्णु सहस्रनाम स्तोत्रम् - फलश्रुति (Vishnu Sahasranama Stotram - Phalashruti)',
  deity: 'Vishnu',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Phalashruti (fruit of recitation) section of the Vishnu Sahasranama from the Mahabharata. It describes the immense benefits of chanting the thousand names of Lord Vishnu.',
  lyrics: `॥ श्री विष्णु सहस्रनाम स्तोत्रम् - फलश्रुति ॥

इतीदं कीर्तनीयस्य केशवस्य महात्मनः ।
नाम्नां सहस्रं दिव्यानां अशेषेण प्रकीर्तितम् ॥१॥

य इदं शृणुयान्नित्यं यश्चापि परिकीर्तयेत् ।
नाशुभं प्राप्नुयात्किंचित् सोऽमुत्रेह च मानवः ॥२॥

वेदान्तगो ब्राह्मणः स्यात् क्षत्रियो विजयी भवेत् ।
वैश्यो धनसमृद्धः स्यात् शूद्रः सुखमवाप्नुयात् ॥३॥

धर्मार्थी प्राप्नुयाद्धर्ममर्थार्थी चार्थमाप्नुयात् ।
कामानवाप्नुयात्कामी प्रजार्थी चाप्नुयात्प्रजाम् ॥४॥

भक्तिमान् यः सदोत्थाय शुचिस्तद्गतमानसः ।
सहस्रं वासुदेवस्य नाम्नामेतत्प्रकीर्तयेत् ॥५॥

---

॥ Shri Vishnu Sahasranama Stotram - Phalashruti ॥

Itidam Kirtaniyasya Keshavasya Mahatmanah |
Namnam Sahasram Divyanam Asheshena Prakirtitam ||1||

Ya Idam Shrunuyannityam Yashchapi Parikirtayet |
Nashubham Prapnuyatkinchit Somutre Ha Cha Manavah ||2||

Vedantago Brahmanah Syat Kshatriyo Vijayi Bhavet |
Vaishyo Dhanasamriddhah Syat Shudrah Sukhamavapnuyat ||3||

Dharmarthi Prapnuyaddharmamarkarthi Charthamapnuyat |
Kamanavapnuyatkami Prajarthi Chapnuyat Prajam ||4||

Bhaktiman Yah Sadotthaya Shuchistadgatamanasah |
Sahasram Vasudevasya Namnametatprakirtayet ||5||`
},

// ── 5. Sri Lakshmi Stotram ──
{
  title: 'श्री लक्ष्मी स्तोत्रम् (Shri Lakshmi Stotram)',
  deity: 'Lakshmi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'A powerful hymn to Goddess Lakshmi, the goddess of wealth, fortune, and prosperity. Regular recitation brings abundance and peace.',
  lyrics: `॥ श्री लक्ष्मी स्तोत्रम् ॥

नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।
शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥१॥

नमस्ते गरुडारूढे कोलासुरभयङ्करि ।
सर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥२॥

सर्वज्ञे सर्ववरदे सर्वदुष्टभयङ्करि ।
सर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते ॥३॥

सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि ।
मन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥४॥

आद्यन्तरहिते देवि आद्यशक्तिमहेश्वरि ।
योगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते ॥५॥

स्थूलसूक्ष्ममहारौद्रे महाशक्तिमहोदरे ।
महापापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥६॥

पद्मासनस्थिते देवि परब्रह्मस्वरूपिणि ।
परमेशि जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥७॥

श्वेताम्बरधरे देवि नानालङ्कारभूषिते ।
जगत्स्थिते जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥८॥

---

॥ Shri Lakshmi Stotram ॥

Namastestu Mahamaye Shripeethe Surapujite |
Shankha Chakra Gadahaste Mahalakshmi Namostu Te ||1||

Namaste Garudarudhe Kolasurabhayankarim |
Sarva Papahare Devi Mahalakshmi Namostu Te ||2||

Sarvajne Sarvavarade Sarvadushtabhayankarim |
Sarva Duhkhahare Devi Mahalakshmi Namostu Te ||3||

Siddhi Buddhi Prade Devi Bhukti Mukti Pradayini |
Mantramurte Sada Devi Mahalakshmi Namostu Te ||4||

Adyantarahite Devi Adyashakti Maheshwari |
Yogaje Yogasambhute Mahalakshmi Namostu Te ||5||

Sthula Sukshma Maharaudre Mahashakti Mahodare |
Mahapapahare Devi Mahalakshmi Namostu Te ||6||

Padmasanasthite Devi Parabrahma Svarupini |
Parameshi Jaganmatar Mahalakshmi Namostu Te ||7||

Shvetambaradhare Devi Nanalankarabhusite |
Jagatsthite Jaganmatar Mahalakshmi Namostu Te ||8||`
},

// ── 6. Durga Stotram (Argala Stotram) ──
{
  title: 'अर्गला स्तोत्रम् (Argala Stotram)',
  deity: 'Durga',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Argala Stotram from the Durga Saptashati. It is a powerful prayer to Goddess Durga seeking protection, wealth, fame, and the destruction of enemies.',
  lyrics: `॥ अर्गला स्तोत्रम् ॥

ॐ जयन्ती मङ्गला काली भद्रकाली कपालिनी ।
दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥

जय त्वं देवि चामुण्डे जय भूतापहारिणि ।
जय सर्वगतेऽदेवि खड्गखेटकधारिणि ॥१॥

जयन्ती मङ्गला काली भद्रकाली कपालिनी ।
दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥

रूपं देहि जयं देहि यशो देहि द्विषो जहि ।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥२॥

महिषासुरनिर्णाशविधात्रि वरदे नमः ।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥३॥

---

॥ Argala Stotram ॥

Om Jayanti Mangala Kali Bhadrakali Kapalini |
Durga Kshama Shiva Dhatri Svaha Svadha Namostu Te ||

Jaya Tvam Devi Chamunde Jaya Bhutapaharini |
Jaya Sarvagate Devi Khadga Khetaka Dharini ||1||

Jayanti Mangala Kali Bhadrakali Kapalini |
Durga Kshama Shiva Dhatri Svaha Svadha Namostu Te ||

Rupam Dehi Jayam Dehi Yasho Dehi Dvisho Jahi |
Rupam Dehi Jayam Dehi Yasho Dehi Dvisho Jahi ||2||

Mahishasura Nirnasha Vidhatri Varade Namah |
Rupam Dehi Jayam Dehi Yasho Dehi Dvisho Jahi ||3||`
},

// ── 7. Aditya Hridayam (Key Verses) ──
{
  title: 'आदित्य हृदयम् (Aditya Hridayam)',
  deity: 'Surya',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Aditya Hridayam from the Ramayana, taught by sage Agastya to Lord Rama before the battle with Ravana. A powerful hymn to the Sun God for victory and strength.',
  lyrics: `॥ आदित्य हृदयम् ॥

ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।
रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥१॥

दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।
उपागम्याब्रवीद्राममगस्त्यो भगवान् ऋषिः ॥२॥

राम राम महाबाहो शृणु गुह्यं सनातनम् ।
येन सर्वानरीन् वत्स समरे विजयिष्यसि ॥३॥

आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।
जयावहं जपेन्नित्यं अक्षय्यं परमं शिवम् ॥४॥

सर्वमङ्गलमाङ्गल्यं सर्वपापप्रणाशनम् ।
चिन्ताशोकप्रशमनं आयुर्वर्धनमुत्तमम् ॥५॥

रश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम् ।
पूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम् ॥६॥

---

॥ Aditya Hridayam ॥

Tato Yuddha Parishrantam Samare Chintaya Sthitam |
Ravanam Chagrato Drishtva Yuddhaya Samupasthitam ||1||

Daivataischa Samagamya Drashtumabhyagato Ranam |
Upagamyabravidramam Agastyo Bhagavan Rishiph ||2||

Rama Rama Mahabaho Shrinu Guhyam Sanatam |
Yena Sarvanarin Vatsa Samare Vijayishyasi ||3||

Adityahridayam Punyam Sarvashatru Vinashanam |
Jayavaham Japennityam Akshayam Paramam Shivam ||4||

Sarvamangala Mangalyam Sarvapapa Pranashanam |
Chintashoka Prashamanam Ayurvardhanam Uttamam ||5||

Rashmimantam Samudyantam Devasura Namaskritam |
Pujayasva Vivasvantam Bhaskaram Bhuvaneshvaram ||6||`
},

// ── 8. Hanuman Stotram ──
{
  title: 'श्री हनुमान स्तोत्रम् (Shri Hanuman Stotram)',
  deity: 'Hanuman',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'A powerful stotra dedicated to Lord Hanuman. Reciting this stotra grants courage, strength, wisdom, and removes fear and obstacles.',
  lyrics: `॥ श्री हनुमान स्तोत्रम् ॥

गोष्पदीकृतवारीशं मशकीकृतराक्षसम् ।
रामायणमहामालारत्नं वन्देऽनिलात्मजम् ॥१॥

अञ्जनानन्दनं वीरं जानकीशोकनाशनम् ।
कपीशमक्षहन्तारं वन्दे लङ्काभयङ्करम् ॥२॥

महावीरं महाभीमं महाबलपराक्रमम् ।
महादुःखप्रशमनं वन्दे लङ्काभयङ्करम् ॥३॥

उल्लङ्घ्य सिन्धोः सलिलं सलीलं
यः शोकवह्निं जनकात्मजायाः ।
आदाय तेनैव ददाह लङ्कां
नमामि तं प्राञ्जलिराञ्जनेयम् ॥४॥

मनोजवं मारुततुल्यवेगं
जितेन्द्रियं बुद्धिमतां वरिष्ठम् ।
वातात्मजं वानरयूथमुख्यं
श्रीरामदूतं शरणं प्रपद्ये ॥५॥

---

॥ Shri Hanuman Stotram ॥

Goshpadikrita Varisham Mashakikrita Rakshasam |
Ramayana Mahamala Ratnam Vande Anilatmajam ||1||

Anjana Nandanam Viram Janaki Shoka Nashanam |
Kapisham Aksha Hantaram Vande Lanka Bhayankaram ||2||

Mahaviram Mahabhimam Mahabala Parakramam |
Mahaduhkha Prashamanam Vande Lanka Bhayankaram ||3||

Ullanghya Sindhoh Salilam Salilam
Yah Shokavahnim Janakatmajayah |
Adaya Tenaiva Dadaha Lankam
Namami Tam Pranjalir Anjaneyam ||4||

Manojavam Marutatulyavegam
Jitendriyam Buddhimatam Varishtham |
Vatatmajam Vanarayuthamukhyam
Shri Ramadutam Sharanam Prapadye ||5||`
},

// ── 9. Sri Suktam ──
{
  title: 'श्री सूक्तम् (Shri Suktam)',
  deity: 'Lakshmi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Sri Suktam is a Vedic hymn from the Rigveda Khilani, dedicated to Goddess Lakshmi. It is one of the most ancient and sacred hymns for invoking wealth and prosperity.',
  lyrics: `॥ श्री सूक्तम् ॥

ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् ।
चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥१॥

तां म आवह जातवेदो लक्ष्मीमनपगामिनीम् ।
यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम् ॥२॥

अश्वपूर्वां रथमध्यां हस्तिनादप्रबोधिनीम् ।
श्रियं देवीमुपह्वये श्रीर्मा देवी जुषताम् ॥३॥

कां सोस्मितां हिरण्यप्राकारामार्द्रां ज्वलन्तीं तृप्तां तर्पयन्तीम् ।
पद्मे स्थितां पद्मवर्णां तामिहोपह्वये श्रियम् ॥४॥

चन्द्रां प्रभासां यशसा ज्वलन्तीं श्रियं लोके देवजुष्टामुदाराम् ।
तां पद्मिनीमीं शरणमहं प्रपद्येऽलक्ष्मीर्मे नश्यतां त्वां वृणे ॥५॥

---

॥ Shri Suktam ॥

Om Hiranyavarnam Harinim Suvarnarajatasrajam |
Chandram Hiranmayim Lakshmim Jatavedo Ma Avaha ||1||

Tam Ma Avaha Jatavedo Lakshmimanapagaminim |
Yasyam Hiranyam Vindeyam Gamashvam Purushaanaham ||2||

Ashvapurvam Rathamadhyam Hastinadaprabodhinim |
Shriyam Devimupahvaye Shrirma Devi Jushatam ||3||

Kam Sosmitam Hiranyaprakaraam Ardram Jvalantim Truptam Tarpayantim |
Padme Sthitam Padmavarnam Tamihopahvaye Shriyam ||4||

Chandram Prabhasam Yashasa Jvalantim Shriyam Loke Devajushtamudaram |
Tam Padminiim Sharanam Aham Prapadye Alakshmirme Nashyatam Tvam Vrine ||5||`
},

// ── 10. Narayana Suktam ──
{
  title: 'नारायण सूक्तम् (Narayana Suktam)',
  deity: 'Vishnu',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Narayana Suktam is a sacred Vedic hymn from the Yajurveda, praising Lord Narayana (Vishnu) as the supreme reality who pervades the entire universe.',
  lyrics: `॥ नारायण सूक्तम् ॥

ॐ सहस्रशीर्षं देवं विश्वाक्षं विश्वशम्भुवम् ।
विश्वं नारायणं देवमक्षरं परमं पदम् ॥१॥

विश्वतः परमान्नित्यं विश्वं नारायणं हरिम् ।
विश्वमेवेदं पुरुषस्तद्विश्वमुपजीवति ॥२॥

पतिं विश्वस्यात्मेश्वरं शाश्वतं शिवमच्युतम् ।
नारायणं महाज्ञेयं विश्वात्मानं परायणम् ॥३॥

नारायणपरो ज्योतिरात्मा नारायणः परः ।
नारायणपरं ब्रह्म तत्त्वं नारायणः परः ॥४॥

नारायणपरो ध्याता ध्यानं नारायणः परः ।
नारायणपरा गतिर्गतिः नारायणः परः ॥५॥

---

॥ Narayana Suktam ॥

Om Sahasrashirsham Devam Vishvaksham Vishvashambhuvam |
Vishvam Narayanam Devamaksharam Paramam Padam ||1||

Vishvatah Paramannityam Vishvam Narayanam Harim |
Vishvamevedam Purusha Tadvishvamupajivati ||2||

Patim Vishvasyatmeshvaram Shashvatam Shivamachyutam |
Narayanam Mahajneyam Vishvatmanam Parayanam ||3||

Narayanaparo Jyotiratma Narayanah Parah |
Narayanaparam Brahma Tattvam Narayanah Parah ||4||

Narayanaparo Dhyata Dhyanam Narayanah Parah |
Narayanapara Gatirgati Narayanah Parah ||5||`
},

// ── 11. Rudrashtakam ──
{
  title: 'रुद्राष्टकम् (Rudrashtakam)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Rudrashtakam is composed by Goswami Tulsidas. It consists of eight verses glorifying Lord Shiva (Rudra) and his divine attributes.',
  lyrics: `॥ रुद्राष्टकम् ॥

नमामीशमीशान निर्वाणरूपं
विभुं व्यापकं ब्रह्मवेदस्वरूपम् ।
निजं निर्गुणं निर्विकल्पं निरीहं
चिदाकाशमाकाशवासं भजेऽहम् ॥१॥

निराकारमोंकारमूलं तुरीयं
गिरा ज्ञानगोतीतमीशं गिरीशम् ।
करालं महाकालकालं कृपालं
गुणागारसंसारपारं नतोऽहम् ॥२॥

तुषाराद्रिसंकाशगौरं गभीरं
मनोभूतकोटिप्रभाश्रीशरीरम् ।
स्फुरन्मौलिकल्लोलिनी चारुगङ्गा
लसद्भालबालेन्दु कण्ठे भुजङ्गा ॥३॥

चलत्कुण्डलं भ्रूसुनेत्रं विशालं
प्रसन्नाननं नीलकण्ठं दयालम् ।
मृगाधीशचर्माम्बरं मुण्डमालं
प्रियं शङ्करं सर्वनाथं भजामि ॥४॥

प्रचण्डं प्रकृष्टं प्रगल्भं परेशं
अखण्डं अजं भानुकोटिप्रकाशम् ।
त्रयःशूलनिर्मूलनं शूलपाणिं
भजेऽहं भवानीपतिं भावगम्यम् ॥५॥

कलातीतकल्याणकल्पान्तकारी
सदा सज्जनानन्ददाता पुरारी ।
चिदानन्दसन्दोह मोहापहारी
प्रसीद प्रसीद प्रभो मन्मथारी ॥६॥

न यावत् उमानाथपादारविन्दं
भजन्तीह लोके परे वा नराणाम् ।
न तावत्सुखं शान्ति सन्तापनाशं
प्रसीद प्रभो सर्वभूताधिवासम् ॥७॥

न जानामि योगं जपं नैव पूजां
नतोऽहं सदा सर्वदा शम्भु तुभ्यम् ।
जरा जन्म दुःखौघ तातप्यमानं
प्रभो पाहि आपन्नमामीश शम्भो ॥८॥

---

॥ Rudrashtakam ॥

Namamisha Mishana Nirvana Rupam
Vibhum Vyapakam Brahma Veda Svarupam |
Nijam Nirgunam Nirvikalpam Niriham
Chidakashamakashvasam Bhaje'ham ||1||

Nirakaram Onkara Mulam Turiyam
Gira Jnana Gotitam Isham Girisham |
Karalam Mahakala Kalam Kripalam
Gunagara Samsara Param Nato'ham ||2||

Tusharadri Sankasha Gauram Gabhiram
Manobhuta Koti Prabhashri Shariram |
Sphuranmauli Kallolini Charu Ganga
Lasadbhala Balendu Kanthe Bhujanga ||3||

Chalat Kundalam Bhru Sunetram Vishalam
Prasannanam Nilakantham Dayalam |
Mrigadhisha Charmambaram Mundamalam
Priyam Shankaram Sarvanatham Bhajami ||4||

Prachandam Prakrishtam Pragalbham Paresham
Akhandam Ajam Bhanukoti Prakasham |
Trayah Shula Nirmulanam Shulapanim
Bhaje'ham Bhavanipati Bhavagamyam ||5||

Kalatita Kalyana Kalpanta Kari
Sada Sajjanananda Data Purari |
Chidananda Sandoha Mohaphari
Prasida Prasida Prabho Manmathari ||6||

Na Yavat Umanatha Padaaravindam
Bhajantiha Loke Pare Va Naranam |
Na Tavatsukham Shanti Santapa Nasham
Prasida Prabho Sarvabhutadhivasam ||7||

Na Janami Yogam Japam Naiva Pujam
Nato'ham Sada Sarvada Shambhu Tubhyam |
Jara Janma Duhkhaugha Tatapyamanam
Prabho Pahi Apannamamesha Shambho ||8||`
},

// ── 12. Saraswati Stotram (Complete 16 verses) ──
{
  title: 'श्री सरस्वती स्तोत्रम् (Shri Saraswati Stotram)',
  deity: 'Saraswati',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'A prayer to Goddess Saraswati, the deity of knowledge, music, arts, and learning. This complete 16-verse stotra enhances intellect, wisdom, and removes ignorance.',
  lyrics: `॥ श्री सरस्वती स्तोत्रम् ॥

या कुन्देन्दु-तुषारहार-धवला या शुभ्र-वस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।
या ब्रह्माच्युत-शङ्कर-प्रभृतिभिर्देवैः सदा पूजिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥१॥

दोर्भिर्युक्ता चतुर्भिः स्फटिकमणिमयीमक्षमालां दधाना
हस्तेनैकेन पद्मं सितमपि च शुकं पुस्तकं चापरेण।
भासा कुन्देन्दु-शङ्खस्फटिकमणिनिभा भासमानाऽसमाना
सा मे वाग्देवतेयं निवसतु वदने सर्वदा सुप्रसन्ना॥२॥

आशासु राशी भवदंगवल्लि भासैव दासीकृत-दुग्धसिन्धुम्।
मन्दस्मितैर्निन्दित-शारदेन्दुं वन्देऽरविन्दासन-सुन्दरि त्वाम्॥३॥

शारदा शारदाम्बोजवदना वदनाम्बुजे।
सर्वदा सर्वदास्माकं सन्निधिं सन्निधिं क्रियात्॥४॥

सरस्वतीं च तां नौमि वागधिष्ठातृ-देवताम्।
देवत्वं प्रतिपद्यन्ते यदनुग्रहतो जनाः॥५॥

पातु नो निकषग्रावा मतिहेम्नः सरस्वती।
प्राज्ञेतरपरिच्छेदं वचसैव करोति या॥६॥

शुद्धां ब्रह्मविचारसारपरमा-माद्यां जगद्व्यापिनीं
वीणापुस्तकधारिणीमभयदां जाड्यान्धकारापहाम्।
हस्ते स्पाटिकमालिकां विदधतीं पद्मासने संस्थितां
वन्दे तां परमेश्वरीं भगवतीं बुद्धिप्रदां शारदाम्॥७॥

वीणाधरे विपुलमंगलदानशीले
भक्तार्तिनाशिनि विरिंचिहरीशवन्द्ये।
कीर्तिप्रदेऽखिलमनोरथदे महार्हे
विद्याप्रदायिनि सरस्वति नौमि नित्यम्॥८॥

श्वेताब्जपूर्ण-विमलासन-संस्थिते हे
श्वेताम्बरावृतमनोहरमंजुगात्रे।
उद्यन्मनोज्ञ-सितपंकजमंजुलास्ये
विद्याप्रदायिनि सरस्वति नौमि नित्यम्॥९॥

मातस्त्वदीय-पदपंकज-भक्तियुक्ता
ये त्वां भजन्ति निखिलानपरान्विहाय।
ते निर्जरत्वमिह यान्ति कलेवरेण
भूवह्नि-वायु-गगनाम्बु-विनिर्मितेन॥१०॥

मोहान्धकार-भरिते हृदये मदीये
मातः सदैव कुरु वासमुदारभावे।
स्वीयाखिलावयव-निर्मलसुप्रभाभिः
शीघ्रं विनाशय मनोगतमन्धकारम्॥११॥

ब्रह्मा जगत् सृजति पालयतीन्दिरेशः
शम्भुर्विनाशयति देवि तव प्रभावैः।
न स्यात्कृपा यदि तव प्रकटप्रभावे
न स्युः कथंचिदपि ते निजकार्यदक्षाः॥१२॥

लक्ष्मिर्मेधा धरा पुष्टिर्गौरी तृष्टिः प्रभा धृतिः।
एताभिः पाहि तनुभिरष्टभिर्मां सरस्वती॥१३॥

सरस्वत्यै नमो नित्यं भद्रकाल्यै नमो नमः।
वेद-वेदान्त-वेदांग-विद्यास्थानेभ्य एव च॥१४॥

सरस्वति महाभागे विद्ये कमललोचने।
विद्यारूपे विशालाक्षि विद्यां देहि नमोस्तु ते॥१५॥

यदक्षर-पदभ्रष्टं मात्राहीनं च यद्भवेत्।
तत्सर्वं क्षम्यतां देवि प्रसीद परमेश्वरि॥१६॥

॥ इति श्रीसरस्वती स्तोत्रम् संपूर्णं ॥

---

॥ Shri Saraswati Stotram ॥

Ya Kundendu-Tusharahara-Dhavala Ya Shubhra-Vastravrita
Ya Veena-Vara-Danda-Mandita-Kara Ya Shveta-Padmasana |
Ya Brahmachyuta-Shankara-Prabhritibhir-Devaih Sada Pujita
Sa Mam Patu Sarasvati Bhagavati Nihshesha-Jadyapaha ||1||

Dorbhiryukta Chaturbhih Sphatika-Mani-Mayim-Akshamalam Dadhana
Hastenaikena Padmam Sitamapi Cha Shukam Pustakam Chaparena |
Bhasa Kundendu-Shankha-Sphatika-Mani-Nibha Bhasamana-Asamana
Sa Me Vagdevateyam Nivasatu Vadane Sarvada Suprasanna ||2||

Ashasu Rashi Bhavadanga-Valli Bhasaiva Dasikrita-Dugdha-Sindhum |
Mandasmitair-Nindita-Sharadendu Vande-Arvindasan-Sundari Tvam ||3||

Sharada Sharadamboja-Vadana Vadanambuje |
Sarvada Sarvadasmakam Sannidhim Sannidhim Kriyat ||4||

Sarasvatim Cha Tam Naumi Vagadhishtatri-Devatam |
Devatvam Pratipadyante Yadanugrahato Janah ||5||

Patu No Nikasha-Grava Mati-Hemnah Sarasvati |
Prajnetara-Parichchhedam Vachasaiva Karoti Ya ||6||

Shuddham Brahma-Vichara-Sara-Parama-Madyam Jagadvyapinim
Veena-Pustaka-Dharinim-Abhayadam Jadyandhkarapham |
Haste Spatika-Malikam Vidadhatim Padmasane Samsthitam
Vande Tam Parameshvarim Bhagavatim Buddhipradam Sharadam ||7||

Veenadharae Vipula-Mangala-Dana-Sheele
Bhaktarti-Nashini Virinchi-Harisha-Vandye |
Kirti-Prade-Akhila-Manorathade Maharhe
Vidya-Pradayini Sarasvati Naumi Nityam ||8||

Shvetabja-Purna-Vimalasana-Samsthite He
Shvetambara-Avrita-Manohara-Manju-Gatre |
Udyan-Manojna-Sita-Pankaja-Manjulasye
Vidya-Pradayini Sarasvati Naumi Nityam ||9||

Matas-Tvadiya-Pada-Pankaja-Bhakti-Yukta
Ye Tvam Bhajanti Nikhilan-Aparan-Vihaya |
Te Nirjaratvam-Iha Yanti Kalevarena
Bhuvahni-Vayu-Gaganambu-Vinirmitena ||10||

Mohandhkara-Bharite Hridaye Madiye
Matah Sadaiva Kuru Vasamudara-Bhave |
Sviya-Akhilavayava-Nirmala-Suprabhabhih
Shighram Vinashaya Manogatam-Andhakaram ||11||

Brahma Jagat Srijati Palayatindireshah
Shambhur-Vinashayati Devi Tava Prabhavaih |
Na Syat-Kripa Yadi Tava Prakata-Prabhave
Na Syuh Kathamchid-Api Te Nijakarya-Dakshah ||12||

Lakshmirmedha Dhara Pushtir-Gauri Trishtih Prabha Dhritih |
Etabhih Pahi Tanubhir-Ashtabhirmam Sarasvati ||13||

Sarasvatyai Namo Nityam Bhadrakalyai Namo Namah |
Veda-Vedanta-Vedanga-Vidyasthanebhya Eva Cha ||14||

Sarasvati Mahabhage Vidye Kamala-Lochane |
Vidya-Rupe Vishalakshi Vidyam Dehi Namostu Te ||15||

Yadakshara-Pada-Bhrashtam Matra-Hinam Cha Yad-Bhavet |
Tat-Sarvam Kshamyatam Devi Prasida Parameshvari ||16||

॥ Iti Shri Saraswati Stotram Sampurnam ॥`
},

// ── 13. Krishna Stotram ──
{
  title: 'श्री कृष्ण स्तोत्रम् (Shri Krishna Stotram)',
  deity: 'Krishna',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'A beautiful hymn praising Lord Krishna, describing his divine qualities and seeking his blessings for peace and devotion.',
  lyrics: `॥ श्री कृष्ण स्तोत्रम् ॥

कृष्णाय वासुदेवाय देवकीनन्दनाय च ।
नन्दगोपकुमाराय गोविन्दाय नमो नमः ॥१॥

नमः पङ्कजनाभाय नमः पङ्कजमालिने ।
नमः पङ्कजनेत्राय नमस्ते पङ्कजाङ्घ्रये ॥२॥

वसुदेवसुतं देवं कंसचाणूरमर्दनम् ।
देवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम् ॥३॥

आकाशात् पतितं तोयं यथा गच्छति सागरम् ।
सर्वदेवनमस्कारः केशवं प्रतिगच्छति ॥४॥

कृष्णाय यादवेन्द्राय ज्ञानमुद्राय योगिने ।
नाथाय रुक्मिणीशाय नमो वेदान्तवेदिने ॥५॥

---

॥ Shri Krishna Stotram ॥

Krishnaya Vasudevaya Devaki Nandanaya Cha |
Nandagopa Kumaraya Govindaya Namo Namah ||1||

Namah Pankajanabhaya Namah Pankajamaline |
Namah Pankajanetraya Namaste Pankajanghraye ||2||

Vasudevasutam Devam Kamsachanura Mardanam |
Devaki Paramananda Krishnam Vande Jagadgurum ||3||

Akashat Patitam Toyam Yatha Gachchhati Sagaram |
Sarvadeva Namaskarah Keshavam Pratigachchhati ||4||

Krishnaya Yadavendraya Jnana Mudraya Yogine |
Nathaya Rukminishaya Namo Vedanta Vedine ||5||`
},

// ── 14. Rama Stotram ──
{
  title: 'श्री राम स्तोत्रम् (Shri Rama Stotram)',
  deity: 'Rama',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'A sacred stotra praising Lord Rama, the embodiment of dharma. Chanting this stotra brings peace, courage, and righteousness.',
  lyrics: `॥ श्री राम स्तोत्रम् ॥

श्रीरामं रघुवंशशेखरमणिं श्रीजानकीवल्लभं
श्रीरामं रघुनायकं सुरगुरुं श्रीरामचन्द्रं भजे ॥१॥

रामो राजमणिः सदा विजयते रामं रमेशं भजे
रामेणाभिहता निशाचरचमू रामाय तस्मै नमः ।
रामान्नास्ति परायणं परतरं रामस्य दासोस्म्यहं
रामे चित्तलयः सदा भवतु मे भो राम मामुद्धर ॥२॥

आपदामपहर्तारं दातारं सर्वसम्पदाम् ।
लोकाभिरामं श्रीरामं भूयो भूयो नमाम्यहम् ॥३॥

राम रामेति रामेति रमे रामे मनोरमे ।
सहस्रनाम तत्तुल्यं रामनाम वरानने ॥४॥

---

॥ Shri Rama Stotram ॥

Shri Ramam Raghuvansha Shekharamanim Shri Janaki Vallabham
Shri Ramam Raghunayakam Suragurum Shri Ramachandram Bhaje ||1||

Ramo Rajamanih Sada Vijayate Ramam Ramesham Bhaje
Ramenabhihata Nishachara Chamu Ramaya Tasmai Namah |
Ramannasti Parayanam Parataram Ramasya Dasosmyaham
Rame Chittalayah Sada Bhavatu Me Bho Rama Mamuddhara ||2||

Apadamapahartaram Dataram Sarvasampadam |
Lokabhiramam Shri Ramam Bhuyo Bhuyo Namamyaham ||3||

Rama Rameti Rameti Rame Rame Manorame |
Sahasranama Tattulyam Ramanama Varanane ||4||`
},

// ── 15. Devi Stotram (Mahishasura Mardini Stotram - Key Verses) ──
{
  title: 'महिषासुरमर्दिनी स्तोत्रम् (Mahishasura Mardini Stotram)',
  deity: 'Durga',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The Mahishasura Mardini Stotram glorifies Goddess Durga who slayed the demon Mahishasura. A powerful and melodious hymn from the Devi Bhagavatam.',
  lyrics: `॥ महिषासुरमर्दिनी स्तोत्रम् ॥

अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दनुते
गिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते ।
भगवति हे शितिकण्ठकुटुम्बिनि भूरिकुटुम्बिनि भूरिकृते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥१॥

सुरवरवर्षिणि दुर्धरधर्षिणि दुर्मुखमर्षिणि हर्षरते
त्रिभुवनपोषिणि शङ्करतोषिणि किल्बिषमोषिणि घोषरते ।
दनुजनिरोषिणि दितिसुतरोषिणि दुर्मदशोषिणि सिन्धुसुते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥२॥

अयि जगदम्ब मदम्ब कदम्ब वनप्रियवासिनि हासरते
शिखरि शिरोमणि तुङ्गहिमालय शृङ्गनिजालय मध्यगते ।
मधुमधुरे मधुकैटभगञ्जिनि कैटभभञ्जिनि रासरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥३॥

---

॥ Mahishasura Mardini Stotram ॥

Ayi Girinandini Nanditamedini Vishvavinodini Nandanute
Girivara Vindhyashiro'dhinivasini Vishnuvilasini Jishnunute |
Bhagavati He Shitikantha Kutumbini Bhurikutumbini Bhurikrite
Jaya Jaya He Mahishasura Mardini Ramyakapa­rdini Shailasute ||1||

Suravaravarshini Durdharadharshini Durmukhamarshini Harsharate
Tribhuvana Poshini Shankara Toshini Kilbisha Moshini Ghosharate |
Danuja Niroshini Ditisuta Roshini Durmada Shoshini Sindhusute
Jaya Jaya He Mahishasura Mardini Ramyakapardini Shailasute ||2||

Ayi Jagadamba Madamba Kadamba Vanapriyavasini Hasarate
Shikhari Shiromani Tungahimalaya Shringanijalia Madhyagate |
Madhumadhure Madhukaitabha Ganjini Kaitabha Bhanjini Rasarate
Jaya Jaya He Mahishasura Mardini Ramyakapardini Shailasute ||3||`
},

];

async function addStotras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let added = 0;
    let skipped = 0;

    for (const stotra of stotras) {
      const existing = await Devotional.findOne({ title: stotra.title, category: 'Stotra' });
      if (existing) {
        console.log(`⏭  Already exists: ${stotra.title}`);
        skipped++;
      } else {
        const doc = new Devotional(stotra);
        await doc.save();
        console.log(`✓  Added: ${stotra.title}`);
        added++;
      }
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`\n══════════════════════════════════`);
    console.log(`Added: ${added} | Skipped: ${skipped} | Total Stotras: ${total}`);
    console.log(`══════════════════════════════════`);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

addStotras();
