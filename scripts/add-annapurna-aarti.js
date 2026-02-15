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

async function addAnnapurnaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'अन्नपूर्णा माता आरती (Annapurna Mata Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Annapurna', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `अन्नपूर्णा माता आरती 

बारम्बार प्रणाम,
मैया बारम्बार प्रणाम ।
जो नहीं ध्यावे तुम्हें अम्बिके,
कहाँ उसे विश्राम ।
अन्नपूर्णा देवी नाम तिहारो,
लेत होत सब काम ॥
बारम्बार प्रणाम,
मैया बारम्बार प्रणाम ।
प्रलय युगान्तर और जन्मान्तर,
कालान्तर तक नाम ।
सुर सुरों की रचना करती,
कहाँ कृष्ण कहाँ राम ॥
बारम्बार प्रणाम,
मैया बारम्बार प्रणाम ।
चूमहि चरण चतुर चतुरानन,
चारु चक्रधर श्याम ।
चंद्रचूड़ चन्द्रानन चाकर,
शोभा लखहि ललाम ॥
बारम्बार प्रणाम,
मैया बारम्बार प्रणाम ।
देवि देव! दयनीय दशा में,
दया-दया तब नाम ।
त्राहि-त्राहि शरणागत वत्सल,
शरण रूप तब धाम ॥
बारम्बार प्रणाम,
मैया बारम्बार प्रणाम ।
श्रीं, ह्रीं श्रद्धा श्री ऐ विद्या,
श्री क्लीं कमला काम ।
कांति, भ्रांतिमयी, कांति शांतिमयी,
वर दे तू निष्काम ॥
बारम्बार प्रणाम,
मैया बारम्बार प्रणाम ।
॥ माता अन्नपूर्णा की जय ॥

Annapurna Mata Aarti

Barambar pranaam,
Maiya barambar pranaam.
Jo nahin dhyaave tumhe Ambike,
Kahan use vishraam.
Annapurna Devi naam tiharo,
Let hot sab kaam.
Barambar pranaam,
Maiya barambar pranaam.
Pralay yugantar aur janmantar,
Kaalantar tak naam.
Sur suron ki rachna karti,
Kahan Krishna kahan Ram.
Barambar pranaam,
Maiya barambar pranaam.
Choomahi charan chatur chaturanan,
Charu Chakradhar Shyaam.
Chandrachood Chandranan chaakar,
Shobha lakhahi lalaam.
Barambar pranaam,
Maiya barambar pranaam.
Devi Dev! Dayaneeya dasha mein,
Daya-daya tab naam.
Traahi-traahi sharanagat vatsal,
Sharan roop tab dhaam.
Barambar pranaam,
Maiya barambar pranaam.
Shreem, Hreem Shraddha Shri Ai Vidya,
Shri Kleem Kamala Kaam.
Kaanti, bhrantimayi, kaanti shaantimayi,
Var de tu nishkaam.
Barambar pranaam,
Maiya barambar pranaam.
॥ Mata Annapurna ki Jai ॥`;

    const doc = new Devotional({
      title,
      description: 'Annapurna Mata Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Annapurna',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Annapurna Mata Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Annapurna Mata Aarti:', err);
    process.exit(1);
  }
}

addAnnapurnaAarti();
