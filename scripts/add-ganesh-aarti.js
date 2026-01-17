const mongoose = require('mongoose');

// Reuse the existing pattern in repo scripts
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Aarti' },
  language: { type: String, default: 'Hindi' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const title = 'श्री गणेश आरती';

const hindiLyrics = `श्री गणेश आरती (Shri Ganesh Aarti)

जय गणेश जय गणेश,
जय गणेश देवा ।
माता जाकी पार्वती,
पिता महादेवा ॥

एक दंत दयावंत,
चार भुजा धारी ।
माथे सिंदूर सोहे,
मूसे की सवारी ॥

जय गणेश जय गणेश,
जय गणेश देवा ।
माता जाकी पार्वती,
पिता महादेवा ॥

पान चढ़े फल चढ़े,
और चढ़े मेवा ।
लड्डुअन का भोग लगे,
संत करें सेवा ॥

जय गणेश जय गणेश,
जय गणेश देवा ।
माता जाकी पार्वती,
पिता महादेवा ॥

अंधन को आंख देत,
कोढ़िन को काया ।
बांझन को पुत्र देत,
निर्धन को माया ॥

जय गणेश जय गणेश,
जय गणेश देवा ।
माता जाकी पार्वती,
पिता महादेवा ॥

'सूर' श्याम शरण आए,
सफल कीजे सेवा ।
माता जाकी पार्वती,
पिता महादेवा ॥

जय गणेश जय गणेश,
जय गणेश देवा ।
माता जाकी पार्वती,
पिता महादेवा ॥

दीनन की लाज रखो,
शंभु सुतकारी ।
कामना को पूर्ण करो,
जाऊं बलिहारी ॥

जय गणेश जय गणेश,
जय गणेश देवा ।
माता जाकी पार्वती,
पिता महादेवा ॥`;

const englishLyrics = `Shri Ganesh Aarti

Jai Ganesh Jai Ganesh,
Jai Ganesh Deva.
Mata Jaki Parvati,
Pita Mahadeva.

Ek Dant Dayavant,
Char Bhuja Dhari.
Mathe Sindoor Sohe,
Moose Ki Sawari.

Jai Ganesh Jai Ganesh,
Jai Ganesh Deva.
Mata Jaki Parvati,
Pita Mahadeva.

Paan Chhade Phal Chhade,
Aur Chhade Mewa.
Laddooan Ka Bhog Lage,
Sant Karen Seva.

Jai Ganesh Jai Ganesh,
Jai Ganesh Deva.
Mata Jaki Parvati,
Pita Mahadeva.

Andhan Ko Aankh Det,
Kodhin Ko Kaya.
Banjhan Ko Putra Det,
Nirdhan Ko Maya.

Jai Ganesh Jai Ganesh,
Jai Ganesh Deva.
Mata Jaki Parvati,
Pita Mahadeva.

'Sur' Shyam Sharan Aaye,
Safal Kije Seva.
Mata Jaki Parvati,
Pita Mahadeva.

Jai Ganesh Jai Ganesh,
Jai Ganesh Deva.
Mata Jaki Parvati,
Pita Mahadeva.

Deenan Ki Laaj Rakho,
Shambhu Sutkari.
Kamna Ko Poorn Karo,
Jaaun Balihari.

Jai Ganesh Jai Ganesh,
Jai Ganesh Deva.
Mata Jaki Parvati,
Pita Mahadeva.`;

const ganeshAarti = {
  title,
  deity: 'Ganesha',
  category: 'Aarti',
  status: 'approved',
  language: 'Hindi',
  description: 'A beloved aarti to Lord Ganesha, sung at the beginning of prayers and auspicious occasions. It praises Ganesha\'s compassion and his blessings for prosperity, health, and success.',
  lyrics: `${hindiLyrics}\n\n${englishLyrics}`,
};

async function addGaneshAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title, deity: 'Ganesha', category: 'Aarti' });
    if (existing) {
      console.log(`Ganesh Aarti already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const doc = new Devotional(ganeshAarti);
      await doc.save();
      console.log(`✓ Added: ${ganeshAarti.title}`);
    }

    const count = await Devotional.countDocuments({ category: 'Aarti', deity: 'Ganesha' });
    console.log(`Ganesha Aartis in database: ${count}`);
  } catch (err) {
    console.error('Error adding Ganesh Aarti:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

addGaneshAarti();
