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

async function addGangaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री गंगा मैया आरती (Shri Ganga Maiya Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Ganga', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री गंगा मैया आरती\n\nनमामि गंगे ! तव पाद पंकजम्,\nसुरासुरैः वंदित दिव्य रूपम् ।\nभक्तिं मुक्तिं च ददासि नित्यं,\nभावानुसारेण सदा नराणाम् ॥\nहर हर गंगे, जय माँ गंगे,\nहर हर गंगे, जय माँ गंगे ॥\n\nॐ जय गंगे माता,\nश्री जय गंगे माता ।\nजो नर तुमको ध्याता,\nमनवांछित फल पाता ॥\n\nचंद्र सी जोत तुम्हारी,\nजल निर्मल आता ।\nशरण पड़े जो तेरी,\nसो नर तर जाता ॥\n॥ ॐ जय गंगे माता..॥\n\nपुत्र सगर के तारे,\nसब जग को ज्ञाता ।\nकृपा दृष्टि तुम्हारी,\nत्रिभुवन सुख दाता ॥\n॥ ॐ जय गंगे माता..॥\n\nएक ही बार जो तेरी,\nशरणागति आता ।\nयम की त्रास मिटाकर,\nपरमगति पाता ॥\n॥ ॐ जय गंगे माता..॥\n\nआरती मात तुम्हारी,\nजो जन नित्य गाता ।\nदास वही सहज में,\nमुक्ति को पाता ॥\n॥ ॐ जय गंगे माता..॥\n\nॐ जय गंगे माता,\nश्री जय गंगे माता ।\nजो नर तुमको ध्याता,\nमनवांछित फल पाता ॥\nॐ जय गंगे माता,\nश्री जय गंगे माता \n\nShri Ganga Maiya Aarti\n\nNamami Gange, tav paad pankajam,\nSuraasurai vandit divya roopam.\nBhaktim muktim cha dadasi nityam,\nBhavaanusaarena sadaa naraanaam.\nHar Har Gange, Jai Maa Gange,\nHar Har Gange, Jai Maa Gange.\n\nOm Jai Gange Mata,\nShri Jai Gange Mata.\nJo nar tumko dhyata,\nManvaanchhit phal paata.\n\nChandra si jyot tumhaari,\nJal nirmal aata.\nSharan pade jo teri,\nSo nar tar jaata.\n\nOm Jai Gange Mata, Shri Jai Gange Mata.\n\nPutra Sagar ke taare,\nSab jag ko jnaata.\nKripa drishti tumhaari,\nTribhuvan sukh daata.\n\nOm Jai Gange Mata, Shri Jai Gange Mata.\n\nEk hi baar jo teri,\nSharanagati aata.\nYam ki traas mitaakar,\nParamgati paata.\n\nOm Jai Gange Mata, Shri Jai Gange Mata.\n\nAarti maat tumhaari,\nJo jan nitya gaata.\nDaas wahi sahaj mein,\nMukti ko paata.\n\nOm Jai Gange Mata, Shri Jai Gange Mata.\n\nOm Jai Gange Mata,\nShri Jai Gange Mata.\nJo nar tumko dhyata,\nManvaanchhit phal paata.\n\nOm Jai Gange Mata,\nShri Jai Gange Mata.`;

    const doc = new Devotional({
      title,
      description: 'Shri Ganga Maiya Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Ganga',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Ganga Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Ganga Aarti:', err);
    process.exit(1);
  }
}

addGangaAarti();
