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

async function addSuryaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री सूर्य देव जी की आरती (Shri Surya Dev Ji Ki Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Surya', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री सूर्य देव जी की आरती

ऊँ जय कश्यप नन्दन, प्रभु जय अदिति नन्दन।
त्रिभुवन तिमिर निकंदन, भक्त हृदय चन्दन॥
॥ ऊँ जय कश्यप...॥
सप्त अश्वरथ राजित, एक चक्रधारी।
दुःखहारी, सुखकारी, मानस मलहारी॥
॥ ऊँ जय कश्यप...॥
सुर मुनि भूसुर वन्दित, विमल विभवशाली।
अघ-दल-दलन दिवाकर, दिव्य किरण माली॥
॥ ऊँ जय कश्यप...॥
सकल सुकर्म प्रसविता, सविता शुभकारी।
विश्व विलोचन मोचन, भव-बंधन भारी॥
॥ ऊँ जय कश्यप...॥
कमल समूह विकासक, नाशक त्रय तापा।
सेवत सहज हरत अति, मनसिज संतापा॥
॥ ऊँ जय कश्यप...॥
नेत्र व्याधि हर सुरवर, भू-पीड़ा हारी।
वृष्टि विमोचन संतत, परहित व्रतधारी॥
॥ ऊँ जय कश्यप...॥
सूर्यदेव करुणाकर, अब करुणा कीजै।
हर अज्ञान मोह सब, तत्वज्ञान दीजै॥
ऊँ जय कश्यप नन्दन, प्रभु जय अदिति नन्दन।
त्रिभुवन तिमिर निकंदन, भक्त हृदय चन्दन॥

Shri Surya Dev Ji Ki Aarti 

Om Jai Kashyap Nandan, Prabhu Jai Aditi Nandan.
Tribhuvan timir nikandan, Bhakt hriday chandan.
Om Jai Kashyap…
Sapt ashw rath raajit, Ek chakradhari.
Dukhhaari, Sukhkaari, Manas malhaari.
Om Jai Kashyap…
Sur muni bhusur vandit, Vimal vibhavshaali.
Agh-dal-dalan Divakar, Divya kiran maali.
Om Jai Kashyap…
Sakal sukarm prasavita, Savita shubha-kaari.
Vishva vilochan mochan, Bhav-bandhan bhaari.
Om Jai Kashyap…
Kamal samuh vikasak, Naashak tray taapa.
Sevat sahaj harat ati, Manasij santaapa.
Om Jai Kashyap…
Netra vyadhi har survar, Bhoo-peeda haari.
Vrishti vimochan santat, Parhit vratdhaari.
Om Jai Kashyap…
Suryadev Karunakar, Ab karuna kije.
Har agyaan moh sab, Tatvagyaan dije.
Om Jai Kashyap Nandan, Prabhu Jai Aditi Nandan.
Tribhuvan timir nikandan, Bhakt hriday chandan`;

    const doc = new Devotional({
      title,
      description: 'Shri Surya Dev Ji Ki Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Surya',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Surya Dev Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Surya Dev Aarti:', err);
    process.exit(1);
  }
}

addSuryaAarti();
