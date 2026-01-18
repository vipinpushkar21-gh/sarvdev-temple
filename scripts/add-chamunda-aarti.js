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

async function addChamundaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री चामुण्डा माता आरती';
    const existing = await Devotional.findOne({ title, deity: 'Chamunda', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री चामुण्डा माता आरती\n\nॐ जय चामुण्डा माता,\nमैया जय चामुण्डा माता।\nशरण आए जो तेरे,\nसब कुछ पा जाता॥\nॐ जय चामुण्डा माता…॥\nचण्ड-मुण्ड दो राक्षस हुए हैं बलशाली,\nउनको तुमने मारा क्रोध दृष्टि डाली॥\nॐ जय चामुण्डा माता…॥\nचौंसठ योगिनी आकर तांडव नृत्य करें,\nबावन भैरव झूमे विपदा आन हरे॥\nॐ जय चामुण्डा माता…॥\nशक्ति धाम कहलाती पीछे शिव मंदिर,\nब्रह्मा, विष्णु, नारद मंत्र जपें अंदर॥\nॐ जय चामुण्डा माता…॥\nसिंहराज यहाँ रहते घंटा ध्वनि बाजे,\nनिर्मल धारा जल की वंडेर नदी साजे॥\nॐ जय चामुण्डा माता…॥\nक्रोध रूप में खप्पर खाली नहीं रहता,\nशांत रूप जो ध्यावे आनंद भर देता॥\nॐ जय चामुण्डा माता…॥\nहनुमत बाला योगी ठाढ़े बलशाली,\nकारज पूरण करती दुर्गा महाकाली॥\nॐ जय चामुण्डा माता…॥\nरिद्धि-सिद्धि देकर जन के पाप हरे,\nशरणागत जो होता आनंद राज्य करे॥\nॐ जय चामुण्डा माता…॥\nशुभ गुण मंदिर वाली ‘ॐ’ कृपा कीजै,\nदुख जीवन के संकट आकर हर लीजै॥\nॐ जय चामुण्डा माता…॥\nॐ जय चामुण्डा माता,\nमैया जय चामुण्डा माता।\nशरण आए जो तेरे,\nसब कुछ पा जाता॥\nॐ जय चामुण्डा माता…॥\nइति चामुण्डा माता आरती संपूर्णम्॥\n\nShri Chamunda Mata Aarti\n\nOm Jai Chamunda Mata,\nMaiya Jai Chamunda Mata.\nSharan aaye jo tere,\nSab kuch pa jaata.\nOm Jai Chamunda Mata…\nChand-Mund do raakshas hue hain balshaali,\nUnko tumne maara krodh drishti daali.\nOm Jai Chamunda Mata…\nChaunsath yogini aakar taandav nritya karen,\nBawan Bhairav jhoome vipda aan hare.\nOm Jai Chamunda Mata…\nShakti dhaam kehlaati peeche Shiv mandir,\nBrahma, Vishnu, Narad mantra japen andar.\nOm Jai Chamunda Mata…\nSimhraj yahan rahte ghanta dhvani baje,\nNirmal dhaara jal ki Vander nadi saaje.\nOm Jai Chamunda Mata…\nKrodh roop mein khappar khaali nahin rahta,\nShaant roop jo dhyaave anand bhar deta.\nOm Jai Chamunda Mata…\nHanumat bala yogi thade balshaali,\nKaraj pooran karti Durga Mahakaali.\nOm Jai Chamunda Mata…\nRiddhi-Siddhi dekar jan ke paap hare,\nSharanagat jo hota anand rajya kare.\nOm Jai Chamunda Mata…\nShubh gun mandir wali ‘Om’ kripa kije,\nDukh jeevan ke sankat aakar har lije.\nOm Jai Chamunda Mata…\nOm Jai Chamunda Mata,\nMaiya Jai Chamunda Mata.\nSharan aaye jo tere,\nSab kuch pa jaata.\nOm Jai Chamunda Mata…\nIti Chamunda Mata Aarti Sampurnam.`;

    const doc = new Devotional({
      title,
      description: 'Shri Chamunda Mata Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Chamunda',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Chamunda Mata Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Chamunda Mata Aarti:', err);
    process.exit(1);
  }
}

addChamundaAarti();
