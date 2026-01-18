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

async function addSantoshiAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'संतोषी माता आरती';
    const existing = await Devotional.findOne({ title, deity: 'Santoshi', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `संतोषी माता आरती \n\nजय सन्तोषी माता,\nमैया जय सन्तोषी माता ।\nअपने सेवक जन की,\nसुख सम्पति दाता ॥\nजय सन्तोषी माता,\nमैया जय सन्तोषी माता ॥\nसुन्दर चीर सुनहरी,\nमां धारण कीन्हो ।\nहीरा पन्ना दमके,\nतन श्रृंगार लीन्हो ॥\nजय सन्तोषी माता...॥\nगेरू लाल छटा छबि,\nबदन कमल सोहे ।\nमंद हंसत करुणामयी,\nत्रिभुवन जन मोहे ॥\nजय सन्तोषी माता...॥\nस्वर्ण सिंहासन बैठी,\nचंवर दुरे प्यारे ।\nधूप, दीप, मधु, मेवा,\nभोज धरे न्यारे ॥\nजय सन्तोषी माता...॥\nगुड़ अरु चना परम प्रिय,\nतामें संतोष कियो ।\nसंतोषी कहलाई,\nभक्तन वैभव दियो ॥\nजय सन्तोषी माता...॥\nशुक्रवार प्रिय मानत,\nआज दिवस सोही ।\nभक्त मंडली छाई,\nकथा सुनत मोही ॥\nजय सन्तोषी माता...॥\nमंदिर जगमग ज्योति,\nमंगल ध्वनि छाई ।\nविनय करें हम सेवक,\nचरनन सिर नाई ॥\nजय सन्तोषी माता...॥\nभक्ति भावमय पूजा,\nअंगीकृत कीजै ।\nजो मन बसे हमारे,\nइच्छित फल दीजै ॥\nजय सन्तोषी माता...॥\nदुखी दारिद्री रोगी,\nसंकट मुक्त किए ।\nबहु धन धान्य भरे घर,\nसुख सौभाग्य दिए ॥\nजय सन्तोषी माता...॥\nध्यान धरे जो तेरा,\nवांछित फल पायो ।\nपूजा कथा श्रवण कर,\nघर आनन्द आयो ॥\nजय सन्तोषी माता...॥\nचरण गहे की लज्जा,\nरखियो जगदम्बे ।\nसंकट तू ही निवारे,\nदयामयी अम्बे ॥\nजय सन्तोषी माता...॥\nसन्तोषी माता की आरती,\nजो कोई जन गावे ।\nरिद्धि सिद्धि सुख सम्पति,\nजी भर के पावे ॥\nजय सन्तोषी माता,\nमैया जय सन्तोषी माता ।\nअपने सेवक जन की,\nसुख सम्पति दाता ॥\n\nSantoshi Mata Aarti\n\nJai Santoshi Mata,\nMaiya Jai Santoshi Mata.\nApne sevak jan ki,\nSukh sampati daata.\nJai Santoshi Mata,\nMaiya Jai Santoshi Mata.\nSundar cheer sunahari,\nMaa dhaaran keenho.\nHeera panna damke,\nTan shringar leenho.\nJai Santoshi Mata…\nGeru laal chhata chhabi,\nBadan kamal sohe.\nMand hansat karunamayi,\nTribhuvan jan mohe.\nJai Santoshi Mata…\nSwarn singhasan baithi,\nChamar dure pyaare.\nDhoop, deep, madhu, mewa,\nBhoj dhare nyaare.\nJai Santoshi Mata…\nGud aru chana param priya,\nTaamein santosh kiyo.\nSantoshi kehlaai,\nBhaktan vaibhav diyo.\nJai Santoshi Mata…\nShukravaar priya maanat,\nAaj divas sohi.\nBhakt mandali chhaai,\nKatha sunat mohi.\nJai Santoshi Mata…\nMandir jagmag jyoti,\nMangal dhvani chhaai.\nVinay karen hum sevak,\nCharanan sir naai.\nJai Santoshi Mata…\nBhakti bhaavamay pooja,\nAngikrit kije.\nJo man base hamaare,\nIchchhit phal dije.\nJai Santoshi Mata…\nDukhi daaridri rogi,\nSankat mukt kiye.\nBahu dhan dhaanya bhare ghar,\nSukh saubhagya diye.\nJai Santoshi Mata…\nDhyaan dhare jo tera,\nVaanchhit phal paayo.\nPooja katha shravan kar,\nGhar anand aayo.\nJai Santoshi Mata…\nCharan gahe ki lajja,\nRakhiya Jagdambe.\nSankat tu hi nivaare,\nDayamayi Ambe.\nJai Santoshi Mata…\nSantoshi Mata ki Aarti,\nJo koi jan gaave.\nRiddhi siddhi sukh sampati,\nJee bhar ke paave.\nJai Santoshi Mata,\nMaiya Jai Santoshi Mata.\nApne sevak jan ki,\nSukh sampati daata.`;

    const doc = new Devotional({
      title,
      description: 'Santoshi Mata Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Santoshi',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Santoshi Mata Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Santoshi Mata Aarti:', err);
    process.exit(1);
  }
}

addSantoshiAarti();
