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

async function addChandraAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'चन्द्र देव आरती (Chandra Dev Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Chandra', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `चन्द्र देव आरती 

ॐ जय सोम देवा, स्वामी जय सोम देवा ।
दुःख हरता सुख करता, जय आनन्दकारी ।
रजत सिंहासन राजत, ज्योति तेरी न्यारी ।
दीन दयाल दयानिधि, भव बन्धन हारी ॥
जो कोई आरती तेरी, प्रेम सहित गावे ।
सकल मनोरथ दायक, निर्गुण सुखराशि ॥
योगीजन हृदय में, तेरा ध्यान धरें ।
ब्रह्मा विष्णु सदाशिव, सन्त करें सेवा ॥
वेद पुराण बखानत, भय पातक हारी ।
प्रेमभाव से पूजें, सब जग के नारी ॥
शरणागत प्रतिपालक, भक्तन हितकारी ।
धन सम्पत्ति और वैभव, सहजे सो पावे ॥
विश्व चराचर पालक, ईश्वर अविनाशी ।
सब जग के नर नारी, पूजा पाठ करें ॥
ॐ जय सोम देवा, स्वामी जय सोम देवा ॥

Chandra Dev Aarti

Om Jai Som Deva, Swami Jai Som Deva.
Dukh harta sukh karta, Jai Anandkaari.
Rajat singhasan rajat, Jyoti teri nyaari.
Deen dayal dayaanidhi, Bhav bandhan haari.
Jo koi aarti teri, Prem sahit gaave.
Sakal manorath daayak, Nirgun sukharashi.
Yogijan hriday mein, Tera dhyaan dharen.
Brahma Vishnu Sadashiv, Sant karen seva.
Ved Puraan bakhanat, Bhay paatak haari.
Prem-bhaav se poojen, Sab jag ke naari.
Sharanagat pratipaalak, Bhaktan hitkaari.
Dhan sampatti aur vaibhav, Sahje so paave.
Vishva charaachar paalak, Ishwar avinaashi.
Sab jag ke nar naari, Pooja paath karen.
Om Jai Som Deva, Swami Jai Som Deva.`;

    const doc = new Devotional({
      title,
      description: 'Chandra Dev Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Chandra',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Chandra Dev Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Chandra Dev Aarti:', err);
    process.exit(1);
  }
}

addChandraAarti();
