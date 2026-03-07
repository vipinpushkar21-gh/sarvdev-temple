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
  title: 'श्री सङ्कटनाशन गणेश स्तोत्रम् (Shri Sankatnashan Ganesh Stotram)',
  deity: 'Ganesh',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Sankatnashan Ganesh Stotram is a revered 8-verse hymn from the Narada Purana, narrated by Sage Narada. This powerful stotram invokes Lord Ganesha through his twelve sacred names — Vakratunda, Ekadanta, Krishna Pingaksha, Gajavaktra, Lambodara, Vikata, Vighnaraja, Dhumravarna, Bhalachandra, Vinayaka, Ganapati, and Gajanan. Reciting these twelve names at the three sandhyas (dawn, noon, dusk) daily removes all obstacles (vighna), bestows all siddhis, grants knowledge to students, wealth to seekers, sons to those desiring progeny, and liberation to the spiritually inclined. Six months of regular recitation yields visible results, and one year of practice grants complete siddhi. Sharing this stotram in writing with eight Brahmanas bestows all knowledge by the grace of Lord Ganesha.',
  lyrics: `॥ श्री सङ्कटनाशन गणेश स्तोत्रम् ॥

नारद उवाच

प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम्।
भक्तावासं स्मरेनित्यम् आय्ःकामार्थसिद्धये॥1॥

प्रथमं वक्रतुण्डं च एकदन्तं द्वितीयकम्।
तृतीयं कृष्णपिङ्गाक्षं गजवक्त्रं चतुर्थकम्॥2॥

लम्बोदरं पञ्चमं च षष्ठं विकटमेव च।
सप्तमं विघ्नराजं च धूम्रवर्णं तथाष्टकम्॥3॥

नवमं भालचन्द्रं च दशमं तु विनायकम।
एकादशं गणपतिं द्वादशं तु गजाननम॥4॥

द्वादशैतानि नामानि त्रिसन्ध्यं यः पठेन्नरः।
न च विघ्नभयं तस्य सर्वसिद्धिकरं प्रभो॥5॥

विद्यार्थी लभते विद्यां धनार्थी लभते धनम्।
पुत्रार्थी लभते पुत्रान् मोक्षार्थी लभते गतिम्॥6॥

जपेद्गणपतिस्तोत्रं षड्भिर्मासैः फलं लभेत्।
संवत्सरेण सिद्धिं च लभते नात्र संशयः॥7॥

अष्टभ्यो ब्राह्मणेभ्यश्च लिखित्वा यः समर्पयेत्।
तस्य विद्या भवेत्सर्वा गणेशस्य प्रसादतः॥8॥

॥ इति श्रीनारदपुराणे सङ्कटनाशनगणेशस्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Sankatnashan Ganesh Stotram ॥

Narada Uvacha

Pranamya shirasa devam gauriputram vinayakam.
Bhaktavasam smarenityam aayuhkamarthasiddhaye॥1॥

Prathamam vakratundam cha ekadantam dvitiyakam.
Tritiyam krishnapingaksham gajavaktram chaturthakam॥2॥

Lambodaram panchamam cha shashtham vikatameva cha.
Saptamam vighnarajam cha dhumravarnam tathashtakam॥3॥

Navamam bhalachandram cha dashamam tu vinayakam.
Ekadasham ganapatim dvadasham tu gajananam॥4॥

Dvadashaitani namani trisandhyam yah pathennarah.
Na cha vighnabhayam tasya sarvasiddhikaram prabho॥5॥

Vidyarthi labhate vidyam dhanarthi labhate dhanam.
Putrarthi labhate putran moksharthi labhate gatim॥6॥

Japedganapatistotram shadbhirmasaih phalam labhet.
Samvatsarena siddhim cha labhate natra samshayah॥7॥

Ashtabhyo brahmanebhyashcha likhitva yah samarparet.
Tasya vidya bhavetsarva ganeshasya prasadatah॥8॥

॥ Iti Shri Naradapurane Sankatnashan Ganesh Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Sankatnashan Ganesh Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Sankatnashan Ganesh Stotram added successfully!');
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
