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

const shivDwadashJyotirlingaStotram = {
  title: 'शिव द्वादशज्योतिर्लिङ्ग स्तोत्रम् (Shiv Dwadash Jyotirlinga Stotram)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shiv Dwadash Jyotirlinga Stotram is a sacred hymn that praises the twelve sacred Jyotirlingas of Lord Shiva spread across India — Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Vaidyanath, Nageshwar, Kedareshwar, Trimbakeshwar, Rameshwaram, Bhimashankar, Vishwanath (Kashi), and Ghrishneshwar. Reciting this stotram with deep devotion is equivalent to visiting all twelve divine abodes and grants the blessings of Lord Shiva.',
  lyrics: `॥ शिव द्वादशज्योतिर्लिङ्ग स्तोत्रम् ॥

सौराष्ट्रदेशे विशदेऽतिरम्येज्योतिर्मयं चन्द्रकलावतंसम्।
भक्तिप्रदानाय कृपावतीर्णतं सोमनाथं शरणं प्रपद्ये॥1॥

श्रीशैलशृङ्गे विबुधातिसङ्गेतुलाद्रितुङ्गेऽपि मुदा वसन्तम्।
तमर्जुनं मल्लिकपूर्वमेकंनमामि संसारसमुद्रसेतुम्॥2॥

अवन्तिकायां विहितावतारंमुक्तिप्रदानाय च सज्जनानाम्।
अकालमृत्योः परिरक्षणार्थंवन्दे महाकालमहासुरेशम्॥3॥

कावेरिकानर्मदयोः पवित्रेसमागमे सज्जनतारणाय।
सदैव मान्धातृपुरे वसन्तमोङ्कारमीशं शिवमेकमीडे॥4॥

पूर्वोत्तरे प्रज्वलिकानिधानेसदा वसन्तं गिरिजासमेतम्।
सुरासुराराधितपादपद्मंश्रीवैद्यनाथं तमहं नमामि॥5॥

याम्ये सदङ्गे नगरेऽतिरम्येविभूषिताङ्गं विविधैश्च भोगैः।
सद्भक्तिमुक्तिप्रदमीशमेकंश्रीनागनाथं शरणं प्रपद्ये॥6॥

महाद्रिपार्श्वे च तटे रमन्तंसम्पूज्यमानं सततं मुनीन्द्रैः।
सुरासुरैर्यक्षमहोरगाद्यैःकेदारमीशं शिवमेकमीडे॥7॥

सह्याद्रिशीर्षे विमले वसन्तंगोदावरीतीरपवित्रदेशे।
यद्दर्शनात्पातकमाशु नाशंप्रयाति तं त्र्यम्बकमीशमीड॥8॥

सुताम्रपर्णीजलराशियोगेनिबध्य सेतुं विशिखैरसंख्यैः।
श्रीरामचन्द्रेण समर्पितं तंरामेश्वराख्यं नियतं नमामि॥9॥

यं डाकिनीशाकिनिकासमाजेनिषेव्यमाणं पिशिताशनैश्च।
सदैव भीमादिपदप्रसिद्धंतं शङ्करं भक्तहितं नमामि॥10॥

सानन्दमानन्दवने वसन्तमानन्दकन्दं हतपापवृन्दम्।
वाराणसीनाथमनाथनाथंश्रीविश्वनाथं शरणं प्रपद्ये॥11॥

इलापुरे रम्यविशालकेऽस्मिन्समुल्लसन्तं च जगद्वरेण्यम्।
वन्दे महोदारतरस्वभावंयरघृष्णेश्वराख्यं शरणं प्रपद्ये॥12॥

ज्योतिर्मयद्वादशलिङ्गकानांशिवात्मनां प्रोक्तमिदं क्रमेण।
स्तोत्रं पठित्वा मनुजोऽतिभक्त्याफलं तदालोक्य निजं भजेच्च॥13॥

॥ इति श्रीद्वादशज्योतिर्लिङ्गस्तोत्रम् सम्पूर्णम्। ॥

---

|| Shiv Dwadash Jyotirlinga Stotram ||

Saurashtra-deshe Vishade'tiraamye-jyotirmayam Chandrakala-vatamsam.
Bhakti-pradanaya Kripavatirna-tam Somanatham Sharanam Prapadye. ||1||

Shrishaila-shringe Vibudhatisange-tuladri-tunge'pi Muda Vasantam.
Tamarjunam Mallikapurvam-ekam-namami Samsara-samudra-setum. ||2||

Avantikayam Vihitavataram-muktipradanaya Cha Sajjananam.
Akala-mrityoh Pariraksha-nartham-vande Mahakala-mahasuresham. ||3||

Kaverika-narmadayoh Pavitre-samagame Sajjana-taranaya.
Sadaiva Mandhatri-pure Vasantam-onkaram-isham Shivam-ekam-ide. ||4||

Purvottare Prajvalika-nidhane-sada Vasantam Girija-sametam.
Surasura-aradhita-pada-padmam-shri-vaidyanatham Tamaham Namami. ||5||

Yamye Sadange Nagare'tiramye-vibhushitangam Vividhaishcha Bhogaih.
Sadbhakti-mukti-pradam-isham-ekam-shri-naganatham Sharanam Prapadye. ||6||

Mahadri-parshve Cha Tate Ramantam-sampujyamanam Satatam Munindraih.
Suraasurair-yaksha-mahoragadyaih-kedaram-isham Shivam-ekam-ide. ||7||

Sahyadri-shirshe Vimale Vasantam-godavari-tira-pavitra-deshe.
Yaddarshanat-patakam-ashu Nasham-prayati Tam Tryambakam-isham-ide. ||8||

Sutamraparnijala-rashi-yoge-nibadhya Setum Vishikhairasamkhyaih.
Shri-ramachandrena Samarpitam Tam-rameshvarakhyam Niyatam Namami. ||9||

Yam Dakini-shakinika-samaje-nishevyamanam Pishitashanaischa.
Sadaiva Bhimadi-pada-prasiddham-tam Shankaram Bhaktahitam Namami. ||10||

Sanandam-anandavane Vasantam-anandakandam Hata-papa-vrindam.
Varanasi-natham-anatha-natham-shri-vishvanatham Sharanam Prapadye. ||11||

Ilapure Ramya-vishalake'smin-samullasantam Cha Jagadvarenyam.
Vande Mahodara-tara-svabhavam-yaraghrishneshvarakhyam Sharanam Prapadye. ||12||

Jyotirmaya-dvadasha-lingakanam-shivatmanam Proktam-idam Kramena.
Stotram Pathitva Manujo'tibhaktya-phalam Tadalokya Nijam Bhajeccha. ||13||

|| Iti Shri Dwadash Jyotirlinga Stotram Sampurnam ||`
};

async function addShivDwadashJyotirlingaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: shivDwadashJyotirlingaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shiv Dwadash Jyotirlinga Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(shivDwadashJyotirlingaStotram);
      await doc.save();
      console.log('✓  Added: ' + shivDwadashJyotirlingaStotram.title);
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

addShivDwadashJyotirlingaStotram();
