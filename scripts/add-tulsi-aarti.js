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

async function addTulsiAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'तुलसी माता आरती (Tulsi Mata Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Tulsi', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `तुलसी माता आरती 

तुलसी महारानी नमो-नमो,
हरि की पटरानी नमो-नमो ।
धन तुलसी पूरण तप कीनो,
शालिग्राम बनी पटरानी ।
जाके पत्र मंजरी कोमल,
श्रीपति कमल चरण लपटानी ॥
तुलसी महारानी नमो-नमो,
हरि की पटरानी नमो-नमो ।
धूप-दीप-नवैद्य आरती,
पुष्पन की वर्षा बरसानी ।
छप्पन भोग छत्तीसों व्यंजन,
बिन तुलसी हरि एक ना मानी ॥
तुलसी महारानी नमो-नमो,
हरि की पटरानी नमो-नमो ।
सभी सखी मैया तेरो यश गावें,
भक्तिदान दीजै महारानी ।
नमो-नमो तुलसी महारानी,
तुलसी महारानी नमो-नमो ॥
तुलसी महारानी नमो-नमो,
हरि की पटरानी नमो-नमो ।

Tulsi Mata Aarti

Tulsi Maharani Namo-Namo,
Hari ki Patraani Namo-Namo.
Dhan Tulsi pooran tap keeno,
Shaligram bani Patraani.
Jake patra manjari komal,
Shripati kamal charan lapatani.
Tulsi Maharani Namo-Namo,
Hari ki Patraani Namo-Namo.
Dhoop-deep-navaidy aarti,
Pushpan ki varsha barsani.
Chhappan bhog chhattis vyanjan,
Bin Tulsi Hari ek na maani.
Tulsi Maharani Namo-Namo,
Hari ki Patraani Namo-Namo.
Sabhi sakhi Maiya tero yash gaave,
Bhaktidaan dije Maharani.
Namo-Namo Tulsi Maharani,
Tulsi Maharani Namo-Namo.
Tulsi Maharani Namo-Namo,
Hari ki Patraani Namo-Namo.`;

    const doc = new Devotional({
      title,
      description: 'Tulsi Mata Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Tulsi',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Tulsi Mata Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Tulsi Mata Aarti:', err);
    process.exit(1);
  }
}

addTulsiAarti();
