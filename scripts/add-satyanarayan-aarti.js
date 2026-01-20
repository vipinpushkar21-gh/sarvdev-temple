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

async function addSatyanarayanAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री सत्यनारायण जी की आरती (Shri Satyanarayan Ji Ki Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Satyanarayan', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री सत्यनारायण जी की आरती

जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ।
सत्यनारायण स्वामी,
जन पातक हरणा ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
रत्न जड़ित सिंहासन,
अद्भुत छवि राजै ।
नारद करत निराजन,
घण्टा ध्वनि बाजै ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
प्रकट भये कलि कारण,
द्विज को दर्श दियो ।
बूढ़ा ब्राह्मण बनकर,
कंचन महल कियो ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
दुर्बल भील कठारो,
जिन पर कृपा करी ।
चन्द्रचूड़ एक राजा,
तिनकी विपत्ति हरी ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
वैश्य मनोरथ पायो,
श्रद्धा तज दीन्ही ।
सो फल भोग्यो प्रभुजी,
फिर-स्तुति कीन्हीं ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
भाव भक्ति के कारण,
छिन-छिन रूप धरयो ।
श्रद्धा धारण कीन्हीं,
तिनको काज सरयो ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
ग्वाल-बाल संग राजा,
वन में भक्ति करी ।
मनवांछित फल दीन्हों,
दीनदयाल हरी ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
चढ़त प्रसाद सवायो,
कदली फल, मेवा ।
धूप दीप तुलसी से,
राजी सत्यदेवा ॥
ॐ जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ॥
श्री सत्यनारायण जी की आरती,
जो कोई नर गावै ।
ऋद्धि-सिद्धि सुख-संपत्ति,
सहज रूप पावे ॥
जय लक्ष्मी रमणा,
स्वामी जय लक्ष्मी रमणा ।
सत्यनारायण स्वामी,
जन पातक हरणा ॥

Shri Satyanarayan Ji Ki Aarti

Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Satyanarayan Swami,
Jan paatak harana.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Ratna jadit singhasan,
Adbhut chhavi raajai.
Narad karat nirajan,
Ghanta dhvani bajai.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Prakat bhaye Kali kaaran,
Dwij ko darsh diyo.
Boodha Brahman bankar,
Kanchan mahal kiyo.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Durbal Bhil katharo,
Jin par kripa kari.
Chandrachood ek raja,
Tinki vipatti hari.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Vaishya manorath paayo,
Shraddha taj dinhi.
So phal bhogyo Prabhuji,
Phir-stuti kinhi.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Bhav bhakti ke kaaran,
Chhin-chhin roop dharyo.
Shraddha dhaaran kinhi,
Tinko kaaj saryo.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Gwaal-baal sang raja,
Van mein bhakti kari.
Manvaanchhit phal dinho,
Deen Dayal Hari.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Chadhat prasad savaayo,
Kadali phal, mewa.
Dhoop deep Tulsi se,
Raaji Satyadeva.
Om Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Shri Satyanarayan Ji ki Aarti,
Jo koi nar gaavai.
Riddhi-siddhi sukh-sampatti,
Sahaj roop paave.
Jai Laxmi Ramana,
Swami Jai Laxmi Ramana.
Satyanarayan Swami,
Jan paatak harana.`;

    const doc = new Devotional({
      title,
      description: 'Shri Satyanarayan Ji Ki Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Satyanarayan',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Satyanarayan Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Satyanarayan Aarti:', err);
    process.exit(1);
  }
}

addSatyanarayanAarti();
