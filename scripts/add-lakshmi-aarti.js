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

async function addLakshmiAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री लक्ष्मी माता आरती (Shri Lakshmi Mata Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Lakshmi', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `लक्ष्मी माता आरती

महालक्ष्मी नमस्तुभ्यं,
नमस्तुभ्यं सुरेश्वरि ।
हरि प्रिये नमस्तुभ्यं,
नमस्तुभ्यं दयानिधे ॥
पद्मालये नमस्तुभ्यं,
नमस्तुभ्यं च सर्वदे ।
सर्वभूत हितार्थाय,
वसु सृष्टिं सदा कुरुं ॥
ॐ जय लक्ष्मी माता,
मैया जय लक्ष्मी माता ।
तुमको निसदिन सेवत,
हरि विष्णु विधाता ॥
उमा, रमा, ब्रह्माणी,
तुम ही जग माता ।
सूर्य चंद्रमा ध्यावत,
नारद ऋषि गाता ॥
॥ ॐ जय लक्ष्मी माता...॥
दुर्गा रूप निरंजनि,
सुख-संपत्ति दाता ।
जो कोई तुमको ध्याता,
ऋद्धि-सिद्धि धन पाता ॥
॥ ॐ जय लक्ष्मी माता...॥
तुम ही पाताल निवासनी,
तुम ही शुभदाता ।
कर्म-प्रभाव-प्रकाशनी,
भव निधि की त्राता ॥
॥ ॐ जय लक्ष्मी माता...॥
जिस घर तुम रहती हो,
ताँहि में हैं सद्गुण आता ।
सब संभव हो जाता,
मन नहीं घबराता ॥
॥ ॐ जय लक्ष्मी माता...॥
तुम बिन यज्ञ ना होता,
वस्त्र न कोई पाता ।
खान-पान का वैभव,
सब तुमसे आता ॥
॥ ॐ जय लक्ष्मी माता...॥
शुभ गुण मंदिर सुंदर,
क्षीरोदधि जाता ।
रत्न चतुर्दश तुम बिन,
कोई नहीं पाता ॥
॥ ॐ जय लक्ष्मी माता...॥
महालक्ष्मी जी की आरती,
जो कोई नर गाता ।
उर आनंद समाता,
पाप उतर जाता ॥
॥ ॐ जय लक्ष्मी माता...॥
ॐ जय लक्ष्मी माता,
मैया जय लक्ष्मी माता ।
तुमको निसदिन सेवत,
हरि विष्णु विधाता ॥

Laxmi Mata Aarti

Mahalaxmi namastubhyam,
Namastubhyam sureshwari.
Hari priye namastubhyam,
Namastubhyam dayanidhe.
Padmaalaye namastubhyam,
Namastubhyam cha sarvade.
Sarvabhoot hitaarthaya,
Vasu srishtim sada kurum.
Om Jai Laxmi Mata,
Maiya Jai Laxmi Mata.
Tumko nisdin sevat,
Hari Vishnu Vidhata.
Uma, Rama, Brahmani,
Tum hi jag mata.
Surya Chandrama dhyaavat,
Narad rishi gaata.
Om Jai Laxmi Mata…
Durga roop niranjani,
Sukh-sampatti daata.
Jo koi tumko dhyaata,
Riddhi-siddhi dhan paata.
Om Jai Laxmi Mata…
Tum hi paataal nivaasni,
Tum hi shubhdaata.
Karm-prabhav-prakashni,
Bhav nidhi ki traata.
Om Jai Laxmi Mata…
Jis ghar tum rahti ho,
Taahi mein hain sadgun aata.
Sab sambhav ho jaata,
Man nahin ghabraata.
Om Jai Laxmi Mata…
Tum bin yagya na hota,
Vastr na koi paata.
Khaan-paan ka vaibhav,
Sab tumse aata.
Om Jai Laxmi Mata…
Shubh gun mandir sundar,
Ksheerodadhi jaata.
Ratna chaturdash tum bin,
Koi nahin paata.
Om Jai Laxmi Mata…
Mahalaxmi ji ki aarti,
Jo koi nar gaata.
Ur anand samaata,
Paap utar jaata.
Om Jai Laxmi Mata…
Om Jai Laxmi Mata,
Maiya Jai Laxmi Mata.
Tumko nisdin sevat,
Hari Vishnu Vidhata.`;

    const doc = new Devotional({
      title,
      description: 'Lakshmi Mata Aarti (Om Jai Lakshmi Mata)',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Lakshmi',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Lakshmi Mata Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Lakshmi Mata Aarti:', err);
    process.exit(1);
  }
}

addLakshmiAarti();
