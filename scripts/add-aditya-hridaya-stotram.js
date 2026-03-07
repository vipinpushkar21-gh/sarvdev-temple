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

const adityaHridayaStotram = {
  title: 'आदित्य हृदय स्तोत्रम् (Aditya Hridaya Stotram)',
  deity: 'Sun',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Aditya Hridaya Stotram is a sacred hymn from the Yuddha Kanda of Valmiki Ramayana. It was taught by Sage Agastya to Lord Rama on the battlefield of Lanka before his final battle with Ravana. This powerful stotra praises Surya (the Sun God) as the supreme deity embodying Brahma, Vishnu and Shiva. Chanting Aditya Hridaya Stotram removes all sorrows, destroys enemies, bestows victory, and brings auspiciousness and long life.',
  lyrics: `॥ आदित्य हृदय स्तोत्रम् ॥

॥ विनियोग ॥

ॐ अस्य आदित्यहृदय स्तोत्रस्य
अगस्त्यऋषिः अनुष्टुप्छन्दः आदित्यहृदयभूतो।
भगवान् ब्रह्मा देवता निरस्ताशेषविघ्नतया
ब्रह्माविद्यासिद्धौ सर्वत्र जयसिद्धौ च विनियोगः॥

ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्।
रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्॥1॥

दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम्।
उपागम्याब्रवीद्रामम् अगस्त्यो भगवान् ऋषिः॥2॥

राम राम महाबाहो शृणु गुह्यं सनातनम्।
येन सर्वानरीन् वत्स समरे विजयिष्यसि॥3॥

आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम्।
जयावहं जपेन्नित्यम् अक्षय्यं परमं शिवम्॥4॥

सर्वमङ्गलमाङ्गल्यं सर्वपापप्रणाशनम्।
चिन्ताशोकप्रशमनम् आयुर्वर्धनमुत्तमम्॥5॥

रश्मिमंतं समुद्यन्तं देवासुरनमस्कृतम्।
पूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम्॥6॥

सर्वदेवात्मको ह्येष तेजस्वी रश्मिभावनः।
एष देवासुरगणाँल्लोकान्पाति गभस्तिभिः॥7॥

एष ब्रह्मा च विष्णुश्च शिवः स्कन्दः प्रजापतिः।
महेन्द्रो धनदः कालो यमः सोमो ह्यपां पतिः॥8॥

पितरो वसवः साध्या ह्यश्विनौ मरुतो मनुः।
वायुर्वह्निः प्रजाप्राण ऋतुकर्ता प्रभाकरः॥9॥

आदित्यः सविता सूर्यः खगः पूषा गभस्तिमान्।
सुवर्णसदृशो भानुर् हिरण्यरेता दिवाकरः॥10॥

हरिदश्वः सहस्रार्चिः सप्तसप्तिर्मरीचिमान्।
तिमिरोन्मथनः शम्भुस् त्वष्टा मार्ताण्ड अंशुमान्॥11॥

हिरण्यगर्भः शिशिरस् तपनो भास्करो रविः।
अग्निगर्भोऽदितेः पुत्रः शङ्खः शिशिरनाशनः॥12॥

व्योमनाथस्तमोभेदी ऋग्यजुःसामपारगः।
घनवृष्टिरपां मित्रो विन्ध्यवीथीप्लवङ्गमः॥13॥

आतपी मण्डली मृत्युः पिङ्गलः सर्वतापनः।
कविर्विश्वो महातेजाः रक्तः सर्वभवोद्भवः॥14॥

नक्षत्रग्रहताराणाम् अधिपो विश्वभावनः।
तेजसामपि तेजस्वी द्वादशात्मन् नमोऽस्तु ते॥15॥

नमः पूर्वाय गिरये पश्चिमायाद्रये नमः।
ज्योतिर्गणानां पतये दिनाधिपतये नमः॥16॥

जयाय जयभद्राय हर्यश्वाय नमो नमः।
नमो नमः सहस्रांशो आदित्याय नमो नमः॥17॥

नम उग्राय वीराय सारङ्गाय नमो नमः।
नमः पद्मप्रबोधाय मार्ताण्डाय नमो नमः॥18॥

ब्रह्मेशानाच्युतेशाय सूर्यायादित्यवर्चसे।
भास्वते सर्वभक्षाय रौद्राय वपुषे नमः॥19॥

तमोघ्नाय हिमघ्नाय शत्रुघ्नायामितात्मने।
कृतघ्नघ्नाय देवाय ज्योतिषां पतये नमः॥20॥

तप्तचामीकराभाय वह्नये विश्वकर्मणे।
नमस्तमोऽभिनिघ्नाय रुचये लोकसाक्षिणे॥21॥

नाशयत्येष वै भूतं तदेव सृजति प्रभुः।
पायत्येष तपत्येष वर्षत्येष गभस्तिभिः॥22॥

एष सुप्तेषु जागर्ति भूतेषु परिनिष्ठितः।
एष एवाग्निहोत्रं च फलं चैवाग्निहोत्रिणाम्॥23॥

वेदाश्च क्रतवश्चैव क्रतूनां फलमेव च।
यानि कृत्यानि लोकेषु सर्व एष रविः प्रभुः॥24॥

एनमापत्सु कृच्छ्रेषु कान्तारेषु भयेषु च।
कीर्तयन् पुरुषः कश्चिन् नावसीदति राघव॥25॥

पूजयस्वैनमेकाग्रो देवदेवं जगत्पतिम्।
एतत् त्रिगुणितं जप्त्वा युद्धेषु विजयिष्यसि॥26॥

अस्मिन् क्षणे महाबाहो रावणं त्वं वधिष्यसि।
एवमुक्त्वा तदागस्त्यो जगाम च यथागतम्॥27॥

एतच्छ्रुत्वा महातेजा नष्टशोकोऽभवत्तदा।
धारयामास सुप्रीतो राघवः प्रयतात्मवान्॥28॥

आदित्यं प्रेक्ष्य जप्त्वा तु परं हर्षमवाप्तवान्।
त्रिराचम्य शुचिर्भूत्वा धनुरादाय वीर्यवान्॥29॥

रावणं प्रेक्ष्य हृष्टात्मा युद्धाय समुपागमत्।
सर्वयत्नेन महता वधे तस्य धृतोऽभवत्॥30॥

अथ रविरवदन्निरीक्ष्य रामं
मुदितमनाः परमं प्रहृष्यमाणः।
निशिचरपतिसंक्षयं विदित्वा
सुरगणमध्यगतो वचस्त्वरेति॥31॥

॥ इति आदित्यहृदयम् सम्पूर्णम् ॥

---

॥ Aditya Hridaya Stotram ॥

॥ Viniyoga ॥

Om Asya Aditya Hridaya Stotrasya
Agastya Rishih Anushtup Chhandah Aditya Hridaya Bhuto.
Bhagavan Brahma Devata Nirastasheshavighnataya
Brahmavidyasiddhau Sarvatra Jayasiddhau Cha Viniyogah.

Tato Yuddhaparishrantam Samare Chintaya Sthitam.
Ravanam Chagrato Drishtva Yuddhaya Samupasthitam. ||1||

Daivataischa Samagamya Drashtumabhyagato Ranam.
Upagamyabraveedramam Agastyo Bhagavan Rishah. ||2||

Rama Rama Mahabaho Shrinu Guhyam Sanatanam.
Yena Sarvanarin Vatsa Samare Vijayishyasi. ||3||

Aditya Hridayam Punyam Sarvashatruvinashanam.
Jayavaham Japennityam Akshayam Paramam Shivam. ||4||

Sarvamangalamangyalyam Sarvapapapranashanam.
Chintashokprashamanam Ayurvardhanamuttamam. ||5||

Rashmimantam Samudyantam Devasuranmaskritam.
Pujayasva Vivasvantam Bhaskaram Bhuvaneshvaram. ||6||

Sarvadev Atmako Hyesha Tejaswi Rashmibhavanah.
Esha Devasuraganan Lokanpati Gabhastibhih. ||7||

Esha Brahma Cha Vishnushcha Shivah Skandah Prajapatih.
Mahendro Dhanadah Kalo Yamah Somo Hyapam Patih. ||8||

Pitaro Vasavah Sadhya Hyashvinau Maruto Manuh.
Vayurvahnih Prajaprana Ritukarta Prabhakarah. ||9||

Adityah Savita Suryah Khagah Pusha Gabhastiman.
Suvarnasadrisho Bhanur Hiranyareta Divakarah. ||10||

Haridashvah Sahasrarchih Saptasaptirmarichiman.
Timironmathanah Shambhus Tvashta Martanda Anshuman. ||11||

Hiranyagarbhah Shishiras Tapano Bhaskaro Ravih.
Agnigarbhoditeh Putrah Shankhah Shishiranaashanah. ||12||

Vyomanathastamobhedi Rigyajuhsamaparagah.
Ghanavrshtirapm Mitro Vindhyavithiplavangamah. ||13||

Atapi Mandali Mrityuh Pingalah Sarvatapanah.
Kavirviashvo Mahatejah Raktah Sarvabhavodbhavah. ||14||

Nakshtragrhataaranaam Adhipo Vishvabhavanah.
Tejasamapi Tejasvi Dvadashatman Namostute. ||15||

Namah Purvaya Giraye Pashchimaayadraye Namah.
Jyotirgananaam Pataye Dinadhipataye Namah. ||16||

Jayaya Jayabhadraya Haryashvaya Namo Namah.
Namo Namah Sahasramsho Adityaya Namo Namah. ||17||

Nama Ugraya Viraya Sarangaya Namo Namah.
Namah Padmaprabodhaya Martandaya Namo Namah. ||18||

Brahmeshanachyuteshaya Suryayadityavarchase.
Bhasvate Sarvabhakshaya Raudraya Vapushe Namah. ||19||

Tamoghnaaya Himaghnaaya Shatrugnayamitaatmane.
Kritaghnaghnaaya Devaya Jyotishaam Pataye Namah. ||20||

Taptachamikarabhaya Vahnaye Vishvakarmane.
Namastamoabhinighnaya Ruchaye Lokasaakshine. ||21||

Nashayatyesha Vai Bhutam Tadeva Srijati Prabhuh.
Payatyesha Tapatyesha Varshatyesha Gabhastibhih. ||22||

Esha Supteshu Jagarti Bhuteshu Parinishtitah.
Esha Evagnihotram Cha Phalam Chaivagnihotrinam. ||23||

Vedascha Kratavashchaiva Kratunam Phalameva Cha.
Yani Krityani Lokeshu Sarva Esha Ravih Prabhuh. ||24||

Enamaapatsu Krichreshu Kantareshu Bhayeshu Cha.
Kirtayan Purushah Kashchin Navasidati Raghava. ||25||

Pujayasvainamekagro Devadevam Jagatpatim.
Etat Trigunitam Japtva Yudheshu Vijayishyasi. ||26||

Asmin Kshane Mahabaho Ravanam Tvam Vadhishyasi.
Evamuktvaa Tadagastyo Jagaam Cha Yathagatam. ||27||

Etachchhrutva Mahateja Nashtashokobhavattada.
Dharayamasa Suprito Raghavah Prayatatmavan. ||28||

Adityam Prekshya Japtva Tu Param Harshamavaptavan.
Trirachamya Shuchirbhutva Dhanuradaya Viryavan. ||29||

Ravanam Prekshya Hrishtatma Yuddhaya Samupagamat.
Sarvayatnena Mahata Vadhe Tasya Dhritobhavat. ||30||

Atha Raviravadannirikshya Ramam
Muditamanah Paramam Prahrishyamanah.
Nishicharapatisankshyam Viditva
Suraganamadhyagato Vachastvareti. ||31||

॥ Iti Aditya Hridayam Sampurnam ॥`
};

async function addAdityaHridayaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: adityaHridayaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Aditya Hridaya Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(adityaHridayaStotram);
      await doc.save();
      console.log('✓  Added: ' + adityaHridayaStotram.title);
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`\nTotal Stotras in DB: ${total}`);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

addAdityaHridayaStotram();
