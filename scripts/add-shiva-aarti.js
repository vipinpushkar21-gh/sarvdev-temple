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

async function addShivaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'शिव आरती (ॐ जय शिव ओंकारा)';
    const existing = await Devotional.findOne({ title, deity: 'Shiva', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `शिव आरती \n\nॐ जय शिव ओंकारा,\nस्वामी जय शिव ओंकारा।\nब्रह्मा, विष्णु, सदाशिव,\nअर्द्धांगी धारा ॥\nॐ जय शिव ओंकारा...॥\nएकानन चतुरानन,\nपंचानन राजे।\nहंसासन गरुड़ासन,\nवृषवाहन साजे ॥\nॐ जय शिव ओंकारा...॥\nदो भुज चार चतुर्भुज,\nदसभुज अति सोहे।\nत्रिगुण रूप निरखते,\nत्रिभुवन जन मोहे ॥\nॐ जय शिव ओंकारा...॥\nअक्षमाला वनमाला,\nमुण्डमाला धारी।\nचंदन मृगमद सोहै,\nभाले शशिधारी ॥\nॐ जय शिव ओंकारा...॥\nश्वेताम्बर पीताम्बर,\nबाघम्बर अंगे।\nसनकादिक गरुणादिक,\nभूतादिक संगे ॥\nॐ जय शिव ओंकारा...॥\nकर के मध्य कमंडल,\nचक्र त्रिशूलधारी।\nसुखकारी दुखहारी,\nजगपालन कारी ॥\nॐ जय शिव ओंकारा...॥\nब्रह्मा विष्णु सदाशिव,\nजानत अविवेका।\nप्रणवाक्षर में शोभित,\nये तीनों एका ॥\nॐ जय शिव ओंकारा...॥\nत्रिगुणस्वामी जी की आरति,\nजो कोइ नर गावे।\nकहत शिवानंद स्वामी,\nसुख संपति पावे ॥\nॐ जय शिव ओंकारा...॥\nलक्ष्मी व सावित्री,\nपार्वती संगा।\nपार्वती अर्द्धांगी,\nशिवलहरी गंगा ॥\nॐ जय शिव ओंकारा...॥\nपर्वत सोहैं पार्वती,\nशंकर कैलासा।\nभांग धतूर का भोजन,\nभस्मी में वासा ॥\nॐ जय शिव ओंकारा...॥\nजटा में गंग बहत है,\nगल मुण्डन माला।\nशेष नाग लिपटावत,\nओढ़त मृगछाला ॥\nजय शिव ओंकारा...॥\nकाशी में विराजे विश्वनाथ,\nनंदी ब्रह्मचारी।\nनित उठ दर्शन पावत,\nमहिमा अति भारी ॥\nॐ जय शिव ओंकारा...॥\nॐ जय शिव ओंकारा,\nस्वामी जय शिव ओंकारा।\nब्रह्मा, विष्णु, सदाशिव,\nअर्द्धांगी धारा ॥\n\nShiv Aarti – Om Jai Shiv Omkara (Hinglish – Roman Hindi)\n\nOm Jai Shiv Omkara,\nSwami Jai Shiv Omkara.\nBrahma, Vishnu, Sadashiv,\nArddhangi dhaara.\nOm Jai Shiv Omkara…\nEkanan chaturanan,\nPanchanan raaje.\nHansasan Garudasana,\nVrishvahan saaje.\nOm Jai Shiv Omkara…\nDo bhuj chaar chaturbhuj,\nDasbhuj ati sohe.\nTrigun roop nirakhate,\nTribhuvan jan mohe.\nOm Jai Shiv Omkara…\nAkshmala vanmala,\nMundmala dhaari.\nChandan mrugmad sohai,\nBhaale Shashidhari.\nOm Jai Shiv Omkara…\nShwetambar Peetambar,\nBaghambar ange.\nSanakadik Garunadik,\nBhootadik sange.\nOm Jai Shiv Omkara…\nKar ke madhya kamandal,\nChakra Trishul dhaari.\nSukhkari dukhhari,\nJagpalan kaari.\nOm Jai Shiv Omkara…\nBrahma Vishnu Sadashiv,\nJanat aviveka.\nPranavakshar mein shobhit,\nYe teeno eka.\nOm Jai Shiv Omkara…\nTrigunswami ji ki aarti,\nJo koi nar gaave.\nKahat Shivanand Swami,\nSukh sampati paave.\nOm Jai Shiv Omkara…\nLakshmi va Savitri,\nParvati sanga.\nParvati Arddhangi,\nShivalahari Ganga.\nOm Jai Shiv Omkara…\nParvat sohai Parvati,\nShankar Kailasa.\nBhaang dhatoor ka bhojan,\nBhasmi mein vaasa.\nOm Jai Shiv Omkara…\nJata mein Gang bahat hai,\nGal mundan maala.\nShesh Naag liptaavat,\nOdhata mrugchaala.\nJai Shiv Omkara…\nKashi mein viraaje Vishwanath,\nNandi Brahmachaari.\nNit uth darshan paavat,\nMahima ati bhaari.\nOm Jai Shiv Omkara…\nOm Jai Shiv Omkara,\nSwami Jai Shiv Omkara.\nBrahma, Vishnu, Sadashiv,\nArddhangi dhaara.`;

    const doc = new Devotional({
      title,
      description: 'Shiv Aarti – Om Jai Shiv Omkara',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Shiva',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Shiva Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Shiva Aarti:', err);
    process.exit(1);
  }
}

addShivaAarti();
