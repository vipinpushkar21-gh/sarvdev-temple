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

const shivMrityunjayaStotram = {
  title: 'शिव मृत्युञ्जय स्तोत्रम् (Shiv Mrityunjaya Stotram)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shiv Mrityunjaya Stotram is a powerful hymn from the Padma Purana (Uttara Khanda) dedicated to Lord Shiva as Chandrashekhar — the conqueror of death. Each verse describes the magnificent form and glories of Lord Shiva and ends with the refrain "Chandrashekharamashraye Mama Kim Karishyati Vai Yamah" — meaning "I take refuge in Chandrashekhar, what can Yama (the god of death) do to me?" This stotram grants protection from untimely death, fearlessness, and the blessings of Lord Shiva.',
  lyrics: `॥ शिव मृत्युञ्जय स्तोत्रम् ॥

रत्नसानुशरासनं रजताद्रिश‍ृङ्गनिकेतनं
शिञ्जिनीकृतपन्नगेश्वरमच्युतानलसायकम्।
क्षिप्रदग्धपुरत्रयं त्रिदशालयैरभिवन्दितं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥1॥

पञ्चपादपपुष्पगन्धिपदाम्बुजद्वयशोभितं
भाललोचनजातपावकदग्धमन्मथविग्रहम्।
भस्मदिग्धकलेवरं भवनाशिनं भवमव्ययं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥2॥

मत्तवारणमुख्यचर्मकृतोत्तरीयमनोहरं
पङ्कजासनपद्मलोचनपूजिताङ्घ्रिसरोरुहम्।
देवसिद्धतरङ्गिणी करसिक्तशीतजटाधरं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥3॥

कुण्डलीकृतकुण्डलीश्वरकुण्डलं वृषवाहनं
नारदादिमुनीश्वरस्तुतवैभवं भुवनेश्वरम्।
अन्धकान्तकमाश्रितामरपादपं शमनान्तकं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥4॥

यक्षराजसखं भगाक्षिहरं भुजङ्गविभूषणं
शैलराजसुतापरिष्कृतचारुवामकलेवरम्।
क्ष्वेडनीलगलं परश्वधधारिणं मृगधारिणं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥5॥

भेषजं भवरोगिणामखिलापदामपहारिणं
दक्षयज्ञविनाशिनं त्रिगुणात्मकं त्रिविलोचनम्।
भुक्तिमुक्तिफलप्रदं निखिलाघसङ्घनिबर्हणं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥6॥

भक्तवत्सलमर्चतां निधिमक्षयं हरिदम्बरं
सर्वभूतपतिं परात्परमप्रमेयमनूपमम्।
भूमिवारिनभोहुताशनसोमपालितस्वाकृतिं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥7॥

विश्वसृष्टिविधायिनं पुनरेव पालनतत्परं
संहरन्तमथ प्रपञ्चमशेषलोकनिवासिनम्।
क्रीडयन्तमहर्निशं गणनाथयूथसमाव्रतं
चन्द्रशेखरमाश्रये मम किं करिष्यति वै यमः॥8॥

रुद्रं पशुपतिं स्थाणुं नीलकण्ठमुमापतिम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥9॥

कालकण्ठं कलामूर्तिं कालाग्निं कालनाशनम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥10॥

नीलकण्ठं विरुपाक्षं निर्मलं निरूपद्रवम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥11॥

वामदेवं महादेवं लोकनाथं जगद्गुरुम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥12॥

देवदेवं जगन्नाथं देवेशमृषभध्वजम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥13॥

अनन्तमव्ययं शान्तमक्षमालाधरं हरम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥14॥

आनन्दं परमं नित्यं कैवल्यपदकारणम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥15॥

स्वर्गापवर्गदातारं सृष्टिस्थित्यन्तकारिणम्।
नमामि शिरसा देवं किं नो मृत्युः करिष्यति॥16॥

॥ इति श्रीपद्मपुराणान्तर्गत उत्तरखण्डे श्रीमृत्युञ्जयस्तोत्रं सम्पूर्णम्। ॥

---

|| Shiv Mrityunjaya Stotram ||

Ratnasanu-sharasanam Rajatadri-shringa-niketanam
Shinjini-krita-pannageshvaram-achyutanala-sayakam.
Kshipradagdha-puratrayam Tridashalayair-abhivanditam
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||1||

Panchapadapa-pushpa-gandhi-padambuja-dvaya-shobhitam
Bhala-lochana-jata-pavaka-dagdha-manmatha-vigraham.
Bhasmadigdha-kalevaram Bhava-nashinam Bhavam-avyayam
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||2||

Mattavarana-mukhya-charma-krita-uttariya-manoharam
Pankajasana-padma-lochana-pujitanghri-saroruham.
Devasiddha-tarangini Kara-sikta-shita-jatadharam
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||3||

Kundalikrita-kundalishvara-kundalam Vrisha-vahanam
Naradadi-munishvara-stuta-vaibhavam Bhuvaneshvaram.
Andhakantakam-ashrita-amara-padapam Shamanantakam
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||4||

Yaksharaja-sakham Bhagakshi-haram Bhujanga-vibhushanam
Shailaraja-suta-parishkrita-charu-vama-kalevaram.
Kshvedanila-galam Parashvadha-dharinam Mriga-dharinam
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||5||

Bheshajam Bhava-roginam-akhilapadam-apaharinam
Daksha-yajna-vinashinam Trigunaat-makam Tri-vilochanam.
Bhukti-mukti-phala-pradam Nikhilagha-sangha-nibarhanam
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||6||

Bhaktavatsalam-archataam Nidhim-akshayam Haridambaram
Sarva-bhutapatim Paratparam-aprameyam-anupamam.
Bhumi-vari-nabho-hutashana-soma-palita-svakritim
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||7||

Vishvasrishti-vidhayinam Punareva Palana-tatparam
Samharantam-atha Prapancham-ashesha-loka-nivasinam.
Kridayantam-aharnisham Gananatha-yutha-samavritam
Chandrashekharamashraye Mama Kim Karishyati Vai Yamah. ||8||

Rudram Pashupatim Sthanum Nilakantham-umapatim.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||9||

Kalakantham Kalamurtim Kalagnim Kalanashanam.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||10||

Nilakantham Virupaksham Nirmalam Nirupadravam.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||11||

Vamadevam Mahadevam Lokanatham Jagadgurum.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||12||

Devadevam Jagannatham Devesham-rishabha-dhvajam.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||13||

Anantam-avyayam Shantam-aksha-mala-dharam Haram.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||14||

Anandam Paramam Nityam Kaivalya-pada-karanam.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||15||

Svargapavarga-dataram Srishti-sthity-anta-karinam.
Namami Shirasa Devam Kim No Mrityuh Karishyati. ||16||

|| Iti Shri Padma Puranantargata Uttarakhande Shri Mrityunjaya Stotram Sampurnam ||`
};

async function addShivMrityunjayaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: shivMrityunjayaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shiv Mrityunjaya Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(shivMrityunjayaStotram);
      await doc.save();
      console.log('✓  Added: ' + shivMrityunjayaStotram.title);
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

addShivMrityunjayaStotram();
