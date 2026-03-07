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
  title: 'ऋणहर्ता श्री गणेश स्तोत्रम् (Rinaharta Shri Ganesh Stotram)',
  deity: 'Ganesh',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Rinaharta Shri Ganesh Stotram is a powerful sacred hymn from the Krishna Yamala Tantra, presented as a divine dialogue between Lord Shiva and Goddess Parvati (Uma-Maheshwara Samvada). Parvati asks Lord Shiva for a remedy to destroy debts (rina), and Shiva reveals this potent Ganesha stotram. The hymn recounts how Ganesha was worshipped by Brahma for creation, by Shambhu before destroying Tripura, by Vishnu before slaying Hiranyakashipu, by Devi before killing Mahishasura, by Kumara before defeating Taraka, by Surya for radiance, by Chandra for beauty, and by Vishwamitra for protection. Each verse concludes with the prayer: "May the son of Parvati destroy my debts." Regular daily recitation for one year is said to remove severe poverty and bestow wealth equal to Kubera. The stotra includes viniyoga, nyasa, and dhyana sections for complete ritualistic practice.',
  lyrics: `॥ ऋणहर्ता श्री गणेश स्तोत्रम् ॥

कैलाशपर्वते रम्ये शम्भुं चन्द्रार्धशेखरम्।
षडाम्नायसमायुक्तं पप्रच्छ नगकन्यका॥

॥ पार्वत्युवाच ॥

देवश परमेशान सर्वशास्त्रार्थपारग।
उपायमृणनाशस्य कृपया वद साम्प्रतम्॥

॥ शिव उवाच ॥

सम्यक् पृष्टं त्वया भद्रे लोकानां हिकाम्यया।
तत्सर्वं सम्प्रवक्ष्यामि सावधानावधारय॥

॥ विनियोग ॥

ॐ अस्य श्रीऋणहरणकर्तृगणपतिस्तोत्रमन्त्रस्य सदाशिव ऋषिः
अनुष्टुप् छन्दः श्रीऋणहरणकर्तृगणपतिर्देवता ग्लौं बीजम्
गः शक्तिः गों कीलकम्मम सकलऋणनाशने जपे विनियोगः।

॥ ऋष्यादिन्यास ॥

ॐ सदाशिवऋषये नमः शिरसि।
ॐ अनुष्टुप् छन्दसे नमः मुखे।
ॐ श्रीऋणहर्तृगणेश देवतायै नमः हृदि।
ॐ ग्लौं बीजाय नमः गुह्ये।
ॐ गः शक्तये नमः पादयोः।
ॐ गों कीलकाय नमः सर्वाङ्गे।

॥ करन्यास ॥

ॐ गणेश अङ्गुष्ठाभ्यां नमः।
ॐ ऋणं छिन्धि तर्जनीभ्यां नमः।
ॐ वरेण्यम् मध्यमाभ्यां नमः।
ॐ हुं अनामिकाभ्यां नमः।
ॐ नमः कनिष्ठिकाभ्यां नमः।
ॐ फट् करतलकर पृष्ठाभ्यां नमः।

॥ हृदयादिन्यास ॥

ॐ गणेश हृदयाय नमः।
ॐ ऋणं छिन्धि शिरसे स्वाहा।
ॐ वरेण्यम् शिखायै वषट्।
ॐ हुं कवचाय हुम्।
ॐ नमः नेत्रत्रयाय वौषट्।
ॐ फट् अस्त्राय फट्।

॥ ध्यान ॥

सिन्दूरवर्णं द्विभुजं गणेशं
लम्बोदरं पद्मदले निविष्टम्।
ब्रह्मादिदेवैः परिसेव्यमानं
सिद्धैर्युतं तं प्रणमामि देवम्॥

॥ स्तोत्र पाठ ॥

सृष्ट्यादौ ब्रह्मणा सम्यक् पूजितः फलसिद्धये।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

त्रिपुरस्य वधात्पूर्वं शम्भुना सम्यगर्चितः।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

हिरण्यकश्यपादीनां वधार्थे विष्णुनार्चितः।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

महिषस्य वधे देव्या गणनाथः प्रपूजितः।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

तारकस्य वधात्पूर्वं कुमारेण प्रपूजितः।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

भास्करेण गणेशस्तु पूजितश्छविसिद्धये।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

शशिना कान्तिसिद्ध्यर्थं पूजितो गणनायकः।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

पालनाय च तपसा विश्वामित्रेण पूजितः।
सदैव पार्वतीपुत्र ऋणनाशं करोतु मे॥

इदं त्वृणहरं स्तोत्रं तीव्रदारिद्र्यनाशनम्।
एकवारं पठेन्नित्यं वर्षमेकं समाहितः॥

दारिद्र्यं दारुणं त्यक्त्वा कुबेरसमतां व्रजेत्।
फडन्तोऽयं महामन्त्रः सार्धपञ्चदशाक्षरः॥

अस्यैवायुतसङ्ख्याभिः पुरश्चरणमीरितम।
सहस्रावर्तनात् सद्यो वाञ्छितं लभते फलम्॥

भूत-प्रेत-पिशाचानां नाशनं स्मृतिमात्रतः॥

॥ इति श्रीकृष्णयामलतन्त्रागत-उमामहेश्वरसंवादे
ऋणहर्ता श्री गणेश स्तोत्रम् सम्पूर्णम् ॥

---

॥ Rinaharta Shri Ganesh Stotram ॥

Kailashaparvate ramye shambhum chandrardhashekharam.
Shadamnayasamayuktam paprachchha nagakanyaka॥

॥ Parvatyuvacha ॥

Devesha parameshana sarvashastrarthapaaraga.
Upayamrinanashasya kripaya vada sampratam॥

॥ Shiva Uvacha ॥

Samyak prishtam tvaya bhadre lokanam hikamyaya.
Tatsarvam sampravakshyami savadhanavadharaya॥

॥ Viniyoga ॥

Om asya shri-rinaharanakartr-ganapatistotramantrasya sadashiva rishih
Anushtup chhandah shri-rinaharanakartr-ganapatirdevata glaum bijam
Gah shaktih gom kilakam-mama sakala-rina-naashane jape viniyogah.

॥ Rishyadinyasa ॥

Om sadashiva-rishaye namah shirasi.
Om anushtup chhandase namah mukhe.
Om shri-rinahartr-ganesha devataayai namah hridi.
Om glaum bijaya namah guhye.
Om gah shaktaye namah padayoh.
Om gom kilakaya namah sarvange.

॥ Karanyasa ॥

Om ganesha angushthabhyam namah.
Om rinam chhindhi tarjanibhyam namah.
Om varenyam madhyamabhyam namah.
Om hum anamikabhyam namah.
Om namah kanishtikabhyam namah.
Om phat karatala-kara prishtabhyam namah.

॥ Hridayadinyasa ॥

Om ganesha hridayaya namah.
Om rinam chhindhi shirase svaha.
Om varenyam shikhayai vashat.
Om hum kavachaya hum.
Om namah netratrayaya vaushat.
Om phat astraya phat.

॥ Dhyana ॥

Sindooravarnam dvibhujam ganesham
Lambodaram padmadale nivishtam.
Brahmadidevaiah parisevyamanam
Siddhairyutam tam pranamaami devam॥

॥ Stotra Patha ॥

Srishtyaadau brahmana samyak pujitah phalasiddhaye.
Sadaiva parvatiputra rinanasham karotu me॥

Tripurasya vadhatpurvam shambhuna samyagarchitah.
Sadaiva parvatiputra rinanasham karotu me॥

Hiranyakashypadinam vadharthe vishnunarchitah.
Sadaiva parvatiputra rinanasham karotu me॥

Mahishasya vadhe devya gananathah prapujitah.
Sadaiva parvatiputra rinanasham karotu me॥

Tarakasya vadhatpurvam kumarena prapujitah.
Sadaiva parvatiputra rinanasham karotu me॥

Bhaskarena ganeshstu pujitash-chhavi-siddhaye.
Sadaiva parvatiputra rinanasham karotu me॥

Shashina kantisiddhyartham pujito gananayakah.
Sadaiva parvatiputra rinanasham karotu me॥

Palanaya cha tapasa vishvamitrena pujitah.
Sadaiva parvatiputra rinanasham karotu me॥

Idam tvrinaharam stotram teevradaaridryanaashanam.
Ekavaram pathenityam varshamekam samahitah॥

Daridryam daarunam tyaktva kuberasamatam vrajet.
Phadanto-yam mahamantrah sardhapanchadashaksharah॥

Asyaivayutasankhyabhih purashcharanameeritam.
Sahasravartanat sadyo vaanchhitam labhate phalam॥

Bhuta-preta-pishachanam nashanam smritimatratah॥

॥ Iti Shri Krishnayamalatantragata-Umamaheshvarasamvade
Rinaharta Shri Ganesh Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Rinaharta Shri Ganesh Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Rinaharta Shri Ganesh Stotram added successfully!');
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
