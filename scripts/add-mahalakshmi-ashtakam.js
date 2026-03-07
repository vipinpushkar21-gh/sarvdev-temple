const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Ashtaka' },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const mahalakshmiAshtakam = {
  title: 'महालक्ष्म्यष्टकम् (Mahalakshmi Ashtakam)',
  deity: 'Lakshmi',
  category: 'Ashtaka',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Mahalakshmi Ashtakam is a sacred hymn of eight verses composed by Lord Indra in praise of Goddess Mahalakshmi. It glorifies the divine qualities of Goddess Lakshmi — the supreme mother, destroyer of sins, bestower of liberation, wisdom and prosperity. Reciting this ashtakam daily removes sins, destroys enemies and brings the eternal grace of Goddess Mahalakshmi.',
  lyrics: `॥ महालक्ष्म्यष्टकम् ॥

नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।
शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तुते॥१॥

नमस्ते गरुडारूढे कोलासुरभयङ्करि।
सर्वपापहरे देवि महालक्ष्मि नमोऽस्तुते॥२॥

सर्वज्ञे सर्ववरदे सर्वदुष्टभयङ्करि।
सर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तुते॥३॥

सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि।
मन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तुते॥४॥

आद्यन्तरहिते देवि आद्यशक्तिमहेश्वरि।
योगजे योगसम्भूते महालक्ष्मि नमोऽस्तुते॥५॥

स्थूलसूक्ष्ममहारौद्रे महाशक्तिमहोदरे।
महापापहरे देवि महालक्ष्मि नमोऽस्तुते॥६॥

पद्मासनस्थिते देवि परब्रह्मस्वरूपिणि।
परमेशि जगन्मातर्महालक्ष्मि नमोऽस्तुते॥७॥

श्वेताम्बरधरे देवि नानालङ्कारभूषिते।
जगत्स्थिते जगन्मातर्महालक्ष्मि नमोऽस्तुते॥८॥

महालक्ष्म्यष्टकं स्तोत्रं यः पठेद्भक्तिमान्नरः।
सर्वसिद्धिमवाप्नोति राज्यं प्राप्नोति सर्वदा॥९॥

एककाले पठेन्नित्यं महापापविनाशनम्।
द्विकालं यः पठेन्नित्यं धनधान्यसमन्वितः॥१०॥

त्रिकालं यः पठेन्नित्यं महाशत्रुविनाशनम्।
महालक्ष्मीर्भवेन्नित्यं प्रसन्ना वरदा शुभा॥११॥

॥ इति इन्द्रकृतं महालक्ष्म्यष्टकं सम्पूर्णम् ॥

---

॥ Mahalakshmi Ashtakam ॥

Namastestu Mahamaye Shripeethe Surapujite |
Shankhachakragadahaste Mahalakshmi Namostute ||1||

Namaste Garudarudhe Kolasurabhayanakari |
Sarvapapaahare Devi Mahalakshmi Namostute ||2||

Sarvajne Sarvarade Sarvadushtabhayankari |
Sarvadukhahare Devi Mahalakshmi Namostute ||3||

Siddhibuddhiprade Devi Bhuktimuktipradayini |
Mantramurte Sada Devi Mahalakshmi Namostute ||4||

Adyantarahite Devi Adyashaktimaheshwari |
Yogaje Yogasambhute Mahalakshmi Namostute ||5||

Sthulasukshmamaharaudre Mahashaktimahoodare |
Mahapapahare Devi Mahalakshmi Namostute ||6||

Padmasanasthite Devi Parabrahmaswarupini |
Parameshi Jaganmatarmahalakshmi Namostute ||7||

Shwetambaradhare Devi Nanalankarabhushite |
Jagatsthite Jaganmatarmahalakshmi Namostute ||8||

Mahalakshmyashtakam Stotram Yah Pathedbhaktiman Narah |
Sarvasiddhimavapnoti Rajyam Prapnoti Sarvada ||9||

Ekakale Pathennityam Mahapapavinashanam |
Dvikalam Yah Pathennityam Dhanadhanyasamanvitah ||10||

Trikalam Yah Pathennityam Mahashatruvinashanam |
Mahalakshmibhavennityam Prasanna Varada Shubha ||11||

॥ Iti Indrakritam Mahalakshmyashtakam Sampurnam ॥`
};

async function addMahalakshmiAshtakam() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: mahalakshmiAshtakam.title, category: 'Ashtaka' });
    if (existing) {
      console.log('⏭  Mahalakshmi Ashtakam already exists, skipping.');
    } else {
      const doc = new Devotional(mahalakshmiAshtakam);
      await doc.save();
      console.log('✓  Added: ' + mahalakshmiAshtakam.title);
    }

    const total = await Devotional.countDocuments({ category: 'Ashtaka' });
    console.log(`\nTotal Ashtakas in DB: ${total}`);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

addMahalakshmiAshtakam();
