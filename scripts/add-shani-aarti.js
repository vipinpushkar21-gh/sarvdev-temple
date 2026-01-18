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

async function addShaniAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री शनिदेव आरती';
    const existing = await Devotional.findOne({ title, deity: 'Shani', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री शनिदेव आरती\n\nजय जय श्री शनिदेव भक्तन हितकारी ।\nसूरज के पुत्र प्रभु छाया महतारी ॥\n॥ जय जय श्री शनिदेव..॥\nश्याम अंक वक्र दृष्ट चतुर्भुजा धारी ।\nनीलाम्बर धार नाथ गज की असवारी ॥\n॥ जय जय श्री शनिदेव..॥\nक्रीट मुकुट शीश रजित दिपत है लिलारी ।\nमुक्तन की माला गले शोभित बलिहारी ॥\n॥ जय जय श्री शनिदेव..॥\nमोदक मिष्ठान पान चढ़त हैं सुपारी ।\nलोहा तिल तेल उड़द महिषी अति प्यारी ॥\n॥ जय जय श्री शनिदेव..॥\nदेव दनुज ऋषि मुनि सुमरिन नर नारी ।\nविश्वनाथ धरत ध्यान शरण हैं तुम्हारी ॥\n॥ जय जय श्री शनिदेव..॥\n\nShri Shani Dev Aarti\n\nJai Jai Shri Shanidev bhaktan hitkaari,\nSuraj ke putra Prabhu, Chaaya mahtaari.\nJai Jai Shri Shanidev…\nShyaam ank vakra drishti chaturbhuja dhaari,\nNeelambar dhaar Naath, gaj ki aswaari.\nJai Jai Shri Shanidev…\nKreet mukut sheesh rajit dipat hai lilaari,\nMuktan ki maala gale shobhit balihaari.\nJai Jai Shri Shanidev…\nModak mishthaan paan chadhat hain supari,\nLoha til tel urad mahishi ati pyaari.\nJai Jai Shri Shanidev…\nDev danuj rishi muni sumarin nar naari,\nVishwanath dharat dhyaan sharan hain tumhaari.\nJai Jai Shri Shanidev…`;

    const doc = new Devotional({
      title,
      description: 'Shri Shani Dev Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Shani',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Shani Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Shani Aarti:', err);
    process.exit(1);
  }
}

addShaniAarti();
