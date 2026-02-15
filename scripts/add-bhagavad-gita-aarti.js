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

async function addBhagavadGitaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'भगवद्‍ गीता आरती (Bhagavad Gita Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Bhagavad Gita', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `भगवद्‍ गीता आरती

जय भगवद् गीते,
जय भगवद् गीते ।
हरि-हिय-कमल-विहारिणि,
सुन्दर सुपुनीते ॥
कर्म-सुमर्म-प्रकाशिनि,
कामासक्ति हरा ।
तत्त्वज्ञान-विकाशिनि,
विद्या ब्रह्म परा ॥
जय भगवद् गीते...॥
निश्चल-भक्ति-विधायिनि,
निर्मल मलहारी ।
शरण-सहस्य-प्रदायिनि,
सब विधि सुखकारी ॥
जय भगवद् गीते...॥
राग-द्वेष-विदारिणि,
कारिणि मोद सदा ।
भव-भय-हारिणि,
तारिणि परमानन्दप्रदा ॥
जय भगवद् गीते...॥
आसुर-भाव-विनाशिनि,
नाशिनि तम रजनी ।
दैवी सद्गुणदायिनि,
हरि-रसिका सजनी ॥
जय भगवद् गीते...॥
समता, त्याग सिखावनि,
हरि-मुख की बानी ।
सकल शास्त्र की स्वामिनी,
श्रुतियों की रानी ॥
जय भगवद् गीते...॥
दया-सुधा बरसावनि,
मातु! कृपा कीजै ।
हरिपद-प्रेम दान कर,
अपनो कर लीजै ॥
जय भगवद् गीते...॥
जय भगवद् गीते,
जय भगवद् गीते ।
हरि-हिय-कमल-विहारिणि,
सुन्दर सुपुनीते ॥

Bhagwat Geeta Aarti

Jai Bhagwat Geete,
Jai Bhagwat Geete.
Hari-hiy-kamal-viharini,
Sundar supunite.
Karm-sumarm-prakashini,
Kaam-aasakti hara.
Tatvagyaan-vikashini,
Vidya Brahm para.
Jai Bhagwat Geete…
Nishchal-bhakti-vidhayini,
Nirmal malhaari.
Sharan-sahasya-pradayini,
Sab vidhi sukhkaari.
Jai Bhagwat Geete…
Raag-dvesh-vidaarini,
Kaarini mod sada.
Bhav-bhay-haarini,
Taarini paramaanand-prada.
Jai Bhagwat Geete…
Asur-bhaav-vinaashini,
Naashini tam rajani.
Daivi sadgun-daayini,
Hari-rusika sajani.
Jai Bhagwat Geete…
Samata, tyaag sikhavani,
Hari-mukh ki baani.
Sakal shaastr ki swaamini,
Shrutiyon ki raani.
Jai Bhagwat Geete…
Daya-sudha barsavani,
Maatu! Kripa kije.
Haripad-prem daan kar,
Apno kar leeje.
Jai Bhagwat Geete…
Jai Bhagwat Geete,
Jai Bhagwat Geete.
Hari-hiy-kamal-viharini,
Sundar supunite.`;

    const doc = new Devotional({
      title,
      description: 'Bhagavad Gita Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Bhagavad Gita',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Bhagavad Gita Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Bhagavad Gita Aarti:', err);
    process.exit(1);
  }
}

addBhagavadGitaAarti();
