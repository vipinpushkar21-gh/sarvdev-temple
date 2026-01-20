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

async function addParvatiAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'माता पार्वती जी की आरती (Mata Parvati Ji Ki Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Parvati', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `माता पार्वती जी की आरती\n\nजय पार्वती माता,\nजय पार्वती माता।\nब्रह्मा सनातन देवी,\nशुभ फल की दाता ॥\n॥ जय पार्वती माता... ॥\nअरिकुल कंटक नासनि,\nनिज सेवक त्राता।\nजगजननी जगदम्बा,\nहरिहर गुण गाता ॥\n॥ जय पार्वती माता... ॥\nसिंह को वाहन साजे,\nकुंडल है साथा।\nदेव वधू जस गावत,\nनृत्य करत ता था ॥\n॥ जय पार्वती माता... ॥\nसतयुग रूप शील अतिसुंदर,\nनाम सती कहलाता।\nहेमाचंल घर जन्मी,\nसखियाँ संगराता ॥\n॥ जय पार्वती माता... ॥\nशुम्भ निशुम्भ विदारे,\nहेमाचंल स्थाता।\nसहस्त्र भुजा तनु धरिके,\nचक्र लियो हाथा ॥\n॥ जय पार्वती माता... ॥\nसृष्टि रूप तुही है जननी,\nशिव संग रंगराता।\nनन्दी भृंगी बीन लही,\nसारा जग मदमाता \n॥ जय पार्वती माता... ॥\nदेवन अरज करत हम,\nचरण ध्यान लाता।\nतेरी कृपा रहे तो,\nमन नहीं भरमाता ॥\n॥ जय पार्वती माता... ॥\nमैया जी की आरती,\nभक्ति भाव से जो नर गाता।\nनित्य सुखी रह करके,\nसुख संपत्ति पाता ॥\n॥ जय पार्वती माता... ॥\nजय पार्वती माता,\nजय पार्वती माता।\nब्रह्मा सनातन देवी,\nशुभ फल की दाता ॥\n\nMata Parvati Ji Ki Aarti\n\nJai Parvati Mata,\nJai Parvati Mata.\nBrahma sanatan devi,\nShubh phal ki daata.\nJai Parvati Mata…\nArikul kantak naasani,\nNij sevak traata.\nJagjanani Jagdamba,\nHarihar gun gaata.\nJai Parvati Mata…\nSingh ko vahan saaje,\nKundal hai saatha.\nDev vadhu jas gaavat,\nNritya karat ta tha.\nJai Parvati Mata…\nSatayug roop sheel atisundar,\nNaam Sati kehlaata.\nHemachal ghar janmi,\nSakhiyaan sangraata.\nJai Parvati Mata…\nShumbh Nishumbh vidaare,\nHemachal sthata.\nSahastra bhuja tanu dharike,\nChakra liyo haatha.\nJai Parvati Mata…\nSrishti roop tuhi hai janani,\nShiv sang rangraata.\nNandi Bhringi been lahi,\nSaara jag madmaata.\nJai Parvati Mata…\nDevan arj karat hum,\nCharan dhyaan laata.\nTeri kripa rahe to,\nMan nahin bharmaata.\nJai Parvati Mata…\nMaiya ji ki aarti,\nBhakti bhaav se jo nar gaata.\nNitya sukhi rah karke,\nSukh sampatti paata.\nJai Parvati Mata…\nJai Parvati Mata,\nJai Parvati Mata.\nBrahma sanatan devi,\nShubh phal ki daata.`;

    const doc = new Devotional({
      title,
      description: 'Mata Parvati Ji Ki Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Parvati',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Parvati Mata Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Parvati Mata Aarti:', err);
    process.exit(1);
  }
}

addParvatiAarti();
