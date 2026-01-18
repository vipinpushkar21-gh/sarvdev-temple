const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Hindi' },
  deity: { type: String },
  lyrics: { type: String },
  audioUrl: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function addVishnuAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री विष्णु आरती (ॐ जय जगदीश हरे)';
    const existing = await Devotional.findOne({ title, deity: 'Vishnu', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री विष्णु आरती (ॐ जय जगदीश हरे) \n\nॐ जय जगदीश हरे,\nस्वामी जय जगदीश हरे ।\nभक्त जनों के संकट,\nदास जनों के संकट,\nक्षण में दूर करे ॥\n॥ ॐ जय जगदीश हरे..॥\nजो ध्यावे फल पावे,\nदुःख बिनसे मन का ।\nस्वामी दुःख बिनसे मन का ।\nसुख सम्पत्ति घर आवे,\nकष्ट मिटे तन का ॥\n॥ ॐ जय जगदीश हरे..॥\nमात पिता तुम मेरे,\nशरण गहूँ किसकी ।\nस्वामी शरण गहूँ मैं किसकी ।\nतुम बिन और न दूजा,\nआस करूँ मैं जिसकी ॥\n॥ ॐ जय जगदीश हरे..॥\nतुम पूरण परमात्मा,\nतुम अन्तर्यामी ।\nस्वामी तुम अन्तर्यामी ।\nपारब्रह्म परमेश्वर,\nतुम सबके स्वामी ॥\n॥ ॐ जय जगदीश हरे..॥\nतुम करुणा के सागर,\nतुम पालनकर्ता ।\nस्वामी तुम पालनकर्ता ।\nमैं मूर्ख फलकामी,\nमैं सेवक तुम स्वामी,\nकृपा करो भर्ता ॥\n॥ ॐ जय जगदीश हरे..॥\nतुम हो एक अगोचर,\nसबके प्राणपति ।\nस्वामी सबके प्राणपति ।\nकिस विधि मिलूँ दयामय,\nतुमको मैं कुमति ॥\n॥ ॐ जय जगदीश हरे..॥\nदीन-बन्धु दुःख-हर्ता,\nठाकुर तुम मेरे ।\nस्वामी रक्षक तुम मेरे ।\nअपने हाथ उठाओ,\nअपने शरण लगाओ,\nद्वार पड़ा तेरे ॥\n॥ ॐ जय जगदीश हरे..॥\nविषय-विकार मिटाओ,\nपाप हरो देवा ।\nस्वामी पाप हरो देवा ।\nश्रद्धा भक्ति बढ़ाओ,\nसन्तन की सेवा ॥\n॥ ॐ जय जगदीश हरे..॥\n\nShri Vishnu Aarti (Om Jai Jagdish Hare)\n\nOm Jai Jagdish Hare,\nSwami Jai Jagdish Hare.\nBhakt jano ke sankat,\nDaas jano ke sankat,\nKshan mein door kare.\nOm Jai Jagdish Hare…\nJo dhyaave phal paave,\nDukh binse man ka.\nSwami dukh binse man ka.\nSukh sampatti ghar aave,\nKasht mite tan ka.\nOm Jai Jagdish Hare…\nMaat pita tum mere,\nSharan gahu kiski.\nSwami sharan gahu main kiski.\nTum bin aur na dooja,\nAas karun main jiski.\nOm Jai Jagdish Hare…\nTum pooran parmatma,\nTum antaryaami.\nSwami tum antaryaami.\nParabrahm Parmeshwar,\nTum sab ke Swami.\nOm Jai Jagdish Hare…\nTum karuna ke saagar,\nTum paalan karta.\nSwami tum paalan karta.\nMain moorkh phal kaami,\nMain sevak tum Swami,\nKripa karo bharta.\nOm Jai Jagdish Hare…\nTum ho ek agochar,\nSabke praanpati.\nSwami sabke praanpati.\nKis vidhi milun dayamay,\nTumko main kumati.\nOm Jai Jagdish Hare…\nDeen-bandhu dukh-harta,\nThakur tum mere.\nSwami rakshak tum mere.\nApne haath uthao,\nApne sharan lagao,\nDwaar pada tere.\nOm Jai Jagdish Hare…\nVishay-vikaar mitaao,\nPaap haro Deva.\nSwami paap haro Deva.\nShraddha bhakti badhao,\nSantan ki seva.\nOm Jai Jagdish Hare…`;

    const doc = new Devotional({
      title,
      description: 'Shri Vishnu Aarti (Om Jai Jagdish Hare)',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Vishnu',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Vishnu Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Vishnu Aarti:', err);
    process.exit(1);
  }
}

addVishnuAarti();
