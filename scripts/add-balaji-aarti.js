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

async function addBalajiAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री बालाजी जी की आरती (Shri Balaji Ji Ki Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Hanuman', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री बालाजी जी की आरती 

ॐ जय हनुमत वीरा,
स्वामी जय हनुमत वीरा ।
संकट मोचन स्वामी,
तुम हो रनधीरा ॥
॥ ॐ जय हनुमत वीरा..॥
पवन पुत्र अंजनी सूत,
महिमा अति भारी ।
दुःख दरिद्र मिटाओ,
संकट सब हारी ॥
॥ ॐ जय हनुमत वीरा..॥
बाल समय में तुमने,
रवि को भक्ष लियो ।
देवन स्तुति किन्ही,
तुरतहिं छोड़ दियो ॥
॥ ॐ जय हनुमत वीरा..॥
कपि सुग्रीव राम संग,
मैत्री करवाई।
अभिमानी बलि मेटयो,
कीर्ति रही छाई ॥
॥ ॐ जय हनुमत वीरा..॥
जारि लंक सिय-सुधि ले आए,
वानर हर्षाये ।
कारज कठिन सुधारे,
रघुबर मन भाये ॥
॥ ॐ जय हनुमत वीरा..॥
शक्ति लगी लक्ष्मण को,
भारी सोच भयो ।
लाय संजीवन बूटी,
दुःख सब दूर कियो ॥
॥ ॐ जय हनुमत वीरा..॥
रामहि ले अहिरावण,
जब पाताल गयो ।
ताहि मारी प्रभु लाय,
जय जयकार भयो ॥
॥ ॐ जय हनुमत वीरा..॥
राजत मेहंदीपुर में,
दर्शन सुखकारी ।
मंगल और शनिश्चर,
मेला है जारी ॥
॥ ॐ जय हनुमत वीरा..॥
श्री बालाजी की आरती,
जो कोई नर गावे ।
कहत इन्द्र हर्षित,
मनवांछित फल पावे ॥
॥ ॐ जय हनुमत वीरा..॥

Shri Balaji Ji Ki Aarti

Om Jai Hanumat Veera,
Swami Jai Hanumat Veera.
Sankat mochan Swami,
Tum ho Randheera.
Om Jai Hanumat Veera…
Pavan putra Anjani soot,
Mahima ati bhaari.
Dukh daridra mitaao,
Sankat sab haari.
Om Jai Hanumat Veera…
Baal samay mein tumne,
Ravi ko bhaksh liyo.
Devan stuti kinhi,
Turatahi chhod diyo.
Om Jai Hanumat Veera…
Kapi Sugreev Ram sang,
Maitri karvaayi.
Abhimani Bali metayo,
Kirti rahi chhaayi.
Om Jai Hanumat Veera…
Jaari Lank Siya-sudhi le aaye,
Vaanar harshaaye.
Karaj kathin sudhaare,
Raghubar man bhaaye.
Om Jai Hanumat Veera…
Shakti lagi Lakshman ko,
Bhaari soch bhayo.
Laay Sanjeevan booti,
Dukh sab door kiyo.
Om Jai Hanumat Veera…
Ramahi le Ahiravan,
Jab Pataal gayo.
Tahi maari Prabhu laay,
Jai Jaikaar bhayo.
Om Jai Hanumat Veera…
Rajat Mehandipur mein,
Darshan sukhkaari.
Mangal aur Shanischara,
Mela hai jaari.
Om Jai Hanumat Veera…
Shri Balaji ki Aarti,
Jo koi nar gaave.
Kahat Indra harshit,
Manvaanchhit phal paave.
Om Jai Hanumat Veera…`;

    const doc = new Devotional({
      title,
      description: 'Shri Balaji Ji Ki Aarti (Mehandipur Balaji)',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Hanuman',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Balaji Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Balaji Aarti:', err);
    process.exit(1);
  }
}

addBalajiAarti();
