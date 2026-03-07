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

const shivRamashtakamStotram = {
  title: 'श्री शिवरामाष्टकस्तोत्रम् (Shri Shiv Ramashtakam Stotram)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Shiv Ramashtakam Stotram is a sacred hymn composed by Shri Ramananda Swami that glorifies the unity of Lord Shiva and Lord Rama. Each verse ends with the refrain "Shiva Hare Vijayam Kuru Me Varam" — a prayer seeking victory and blessings. It is recited in the morning with devotion for the grace of both Shiva and Vishnu.',
  lyrics: `॥ श्री शिवरामाष्टकस्तोत्रम् ॥

शिवहरे शिवराम सखे प्रभो,त्रिविधताप-निवारण हे विभो।
अज जनेश्वर यादव पाहि मां,शिव हरे विजयं कुरू मे वरम्॥1॥

कमल लोचन राम दयानिधे,हर गुरो गजरक्षक गोपते।
शिवतनो भव शङ्कर पाहिमां,शिव हरे विजयं कुरू मे वरम्॥2॥

स्वजनरञ्जन मङ्गलमन्दिर,भजति तं पुरुषं परं पदम्।
भवति तस्य सुखं परमाद्भुतं,शिवहरे विजयं कुरू मे वरम्॥3॥

जय युधिष्ठिर-वल्लभ भूपते,जय जयार्जित-पुण्यपयोनिधे।
जय कृपामय कृष्ण नमोऽस्तुते,शिव हरे विजयं कुरू मे वरम्॥4॥

भवविमोचन माधव मापते,सुकवि-मानस हंस शिवारते।
जनक जारत माधव रक्षमां,शिव हरे विजयं कुरू मे वरम्॥5॥

अवनि-मण्डल-मङ्गल मापते,जलद सुन्दर राम रमापते।
निगम-कीर्ति-गुणार्णव गोपते,शिव हरे विजयं कुरू मे वरम्॥6॥

पतित-पावन-नाममयी लता,तव यशो विमलं परिगीयते।
तदपि माधव मां किमुपेक्षसे,शिव हरे विजयं कुरू मे वरम्॥7॥

अमर तापर देव रमापते,विनयतस्तव नाम धनोपमम्।
मयि कथं करुणार्णव जायते,शिव हरे विजयं कुरू मे वरम्॥8॥

हनुमतः प्रिय चाप कर प्रभो,सुरसरिद्-धृतशेखर हे गुरो।
मम विभो किमु विस्मरणं कृतं,शिव हरे विजयं कुरू मे वरम्॥9॥

नर हरेति परम् जन सुन्दरं,पठति यः शिवरामकृतस्तवम्।
विशति राम-रमा चरणाम्बुजे,शिव हरे विजयं कुरू मे वरम्॥10॥

प्रातरूथाय यो भक्त्या पठदेकाग्रमानसः।
विजयो जायते तस्य विष्णु सान्निध्यमाप्नुयात्॥11॥

॥ इति श्रीरामानन्दस्वामिना विरचितं श्रीशिवरामाष्टकं सम्पूर्णम् ॥

---

|| Shri Shiv Ramashtakam Stotram ||

Shivahare Shivarama Sakhe Prabho, Trividhatapa-nivarana He Vibho.
Aja Janeshvara Yadava Pahi Mam, Shiva Hare Vijayam Kuru Me Varam. ||1||

Kamala Lochana Rama Dayanidhe, Hara Guro Gajarakshaka Gopate.
Shivatano Bhava Shankara Pahimam, Shiva Hare Vijayam Kuru Me Varam. ||2||

Svajanaranjana Mangalamandir, Bhajati Tam Purusham Param Padam.
Bhavati Tasya Sukham Paramadbhutam, Shivahare Vijayam Kuru Me Varam. ||3||

Jaya Yudhishthira-vallabha Bhupate, Jaya Jayarjita-punyapayonidhe.
Jaya Kripamaya Krishna Namoastute, Shiva Hare Vijayam Kuru Me Varam. ||4||

Bhavavimochana Madhava Mapate, Sukavi-manasa Hamsa Shivarte.
Janaka Jarata Madhava Rakshamam, Shiva Hare Vijayam Kuru Me Varam. ||5||

Avani-mandala-mangala Mapate, Jalada Sundara Rama Ramapate.
Nigama-kirti-gunarnava Gopate, Shiva Hare Vijayam Kuru Me Varam. ||6||

Patita-pavana-namamayi Lata, Tava Yasho Vimalam Parigiyate.
Tadapi Madhava Mam Kimupekshase, Shiva Hare Vijayam Kuru Me Varam. ||7||

Amara Tapara Deva Ramapate, Vinayatastava Nama Dhanopamam.
Mayi Katham Karunarnava Jayate, Shiva Hare Vijayam Kuru Me Varam. ||8||

Hanumatah Priya Chapa Kara Prabho, Surasarid-dhritashekhara He Guro.
Mama Vibho Kimu Vismaranam Kritam, Shiva Hare Vijayam Kuru Me Varam. ||9||

Nara Hareti Param Jana Sundaram, Pathati Yah Shivaramakritastavam.
Vishati Rama-rama Charanambuje, Shiva Hare Vijayam Kuru Me Varam. ||10||

Prataroothaya Yo Bhaktya Pathadekagramanasah.
Vijayo Jayate Tasya Vishnu Sannidhyamapnuyat. ||11||

|| Iti Shri Ramananda Svamina Virachitam Shri Shiv Ramashtakam Sampurnam ||`
};

async function addShivRamashtakamStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: shivRamashtakamStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shiv Ramashtakam Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(shivRamashtakamStotram);
      await doc.save();
      console.log('✓  Added: ' + shivRamashtakamStotram.title);
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

addShivRamashtakamStotram();
