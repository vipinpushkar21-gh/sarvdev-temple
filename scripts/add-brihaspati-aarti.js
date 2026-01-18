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

async function addBrihaspatiAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री बृहस्पति देव जी की आरती';
    const existing = await Devotional.findOne({ title, deity: 'Brihaspati', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री बृहस्पति देव जी की आरती\n\nजय वृहस्पति देवा,\nऊँ जय वृहस्पति देवा ।\nछिन छिन भोग लगाऊँ,\nकदली फल मेवा ॥\nऊँ जय वृहस्पति देवा,\nजय वृहस्पति देवा ॥\nतुम पूरण परमात्मा,\nतुम अन्तर्यामी ।\nजगतपिता जगदीश्वर,\nतुम सबके स्वामी ॥\nऊँ जय वृहस्पति देवा,\nजय वृहस्पति देवा ॥\nचरणामृत निज निर्मल,\nसब पातक हर्ता ।\nसकल मनोरथ दायक,\nकृपा करो भर्ता ॥\nऊँ जय वृहस्पति देवा,\nजय वृहस्पति देवा ॥\nतन, मन, धन अर्पण कर,\nजो जन शरण पड़े ।\nप्रभु प्रकट तब होकर,\nआकर द्वार खड़े ॥\nऊँ जय वृहस्पति देवा,\nजय वृहस्पति देवा ॥\nदीनदयाल दयानिधि,\nभक्तन हितकारी ।\nपाप दोष सब हर्ता,\nभव बंधन हारी ॥\nऊँ जय वृहस्पति देवा,\nजय वृहस्पति देवा ॥\nसकल मनोरथ दायक,\nसब संशय हारो ।\nविषय विकार मिटाओ,\nसंतन सुखकारी ॥\nऊँ जय वृहस्पति देवा,\nजय वृहस्पति देवा ॥\nजो कोई आरती तेरी,\nप्रेम सहित गावे ।\nजेठानन्द आनन्दकर,\nसो निश्चय पावे ॥\nऊँ जय वृहस्पति देवा,\nजय वृहस्पति देवा ॥\nसब बोलो विष्णु भगवान की जय ।\nबोलो वृहस्पतिदेव भगवान की जय ॥\n\nShri Brihaspati Dev Ji Ki Aarti \n\nJai Brihaspati Deva,\nOm Jai Brihaspati Deva.\nChhin chhin bhog lagaun,\nKadali phal mewa.\nOm Jai Brihaspati Deva,\nJai Brihaspati Deva.\nTum pooran parmatma,\nTum antaryaami.\nJagatpita Jagdishwar,\nTum sabke Swami.\nOm Jai Brihaspati Deva,\nJai Brihaspati Deva.\nCharanamrit nij nirmal,\nSab paatak harta.\nSakal manorath daayak,\nKripa karo bharta.\nOm Jai Brihaspati Deva,\nJai Brihaspati Deva.\nTan, man, dhan arpan kar,\nJo jan sharan pade.\nPrabhu prakat tab hokar,\nAakar dwaar khade.\nOm Jai Brihaspati Deva,\nJai Brihaspati Deva.\nDeen dayal dayanidhi,\nBhaktan hitkaari.\nPaap dosh sab harta,\nBhav bandhan haari.\nOm Jai Brihaspati Deva,\nJai Brihaspati Deva.\nSakal manorath daayak,\nSab sanshay haaro.\nVishay vikaar mitaao,\nSantan sukhkaari.\nOm Jai Brihaspati Deva,\nJai Brihaspati Deva.\nJo koi aarti teri,\nPrem sahit gaave.\nJethanand anandkar,\nSo nishchay paave.\nOm Jai Brihaspati Deva,\nJai Brihaspati Deva.\nSab bolo Vishnu Bhagwan ki Jai.\nBolo Brihaspati Dev Bhagwan ki Jai.`;

    const doc = new Devotional({
      title,
      description: 'Shri Brihaspati Dev Ji Ki Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Brihaspati',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Brihaspati Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Brihaspati Aarti:', err);
    process.exit(1);
  }
}

addBrihaspatiAarti();
