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

async function addSitaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री सीता माता आरती (Shri Sita Mata Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Sita', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री सीता माता आरती 

आरती श्री जनक दुलारी की,
सीता जी रघुवर प्यारी की ॥
जगत जननी जग की विस्तारिणी,
नित्य सत्य साकेत विहारिणी,
परम दयामयी दिनोधारिणी,
सीता मैया भक्तन हितकारी की ॥
आरती श्री जनक दुलारी की,
सीता जी रघुवर प्यारी की ॥
सती श्रोमणि पति हित कारिणी,
पति सेवा वित्त वन वन चारिणी,
पति हित पति वियोग स्वीकारिणी,
त्याग धर्म मूर्ति धरी की ॥
आरती श्री जनक दुलारी की,
सीता जी रघुवर प्यारी की ॥
विमल कीर्ति सब लोकन छाई,
नाम लेत पवन मति आई,
सुमीरात काटत कष्ट दुख दाई,
शरणागत जन भय हरी की ॥
आरती श्री जनक दुलारी की,
सीता जी रघुवर प्यारी की ॥

Shri Sita Mata Aarti

Aarti Shri Janak Dulaari ki,
Sita Ji Raghubar Pyaari ki.
Jagat Janani jag ki vistarini,
Nitya satya Saket vihaarini,
Param dayamayi dinodhaarini,
Sita Maiya bhaktan hitkaari ki.
Aarti Shri Janak Dulaari ki,
Sita Ji Raghubar Pyaari ki.
Sati shromani pati hit kaarini,
Pati seva vitt van van chaarini,
Pati hit pati viyog svikaarini,
Tyag dharm murti dhari ki.
Aarti Shri Janak Dulaari ki,
Sita Ji Raghubar Pyaari ki.
Vimal kirti sab lokan chhaayi,
Naam let pavan mati aayi,
Sumirat kaatat kasht dukh daayi,
Sharanagat jan bhay hari ki.
Aarti Shri Janak Dulaari ki,
Sita Ji Raghubar Pyaari ki.`;

    const doc = new Devotional({
      title,
      description: 'Shri Sita Mata Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Sita',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Sita Mata Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Sita Mata Aarti:', err);
    process.exit(1);
  }
}

addSitaAarti();
