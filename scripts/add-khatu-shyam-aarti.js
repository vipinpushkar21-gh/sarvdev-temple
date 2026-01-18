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

async function addKhatuShyamAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'खाटू श्याम जी की आरती';
    const existing = await Devotional.findOne({ title, deity: 'Khatu Shyam', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `खाटू श्याम जी की आरती\n\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ।\nखाटू धाम विराजत,\nअनुपम रूप धरे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nरतन जड़ित सिंहासन,\nसिर पर चंवर ढुरे ।\nतन केसरिया बागो,\nकुण्डल श्रवण पड़े ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nगल पुष्पों की माला,\nसिर पार मुकुट धरे ।\nखेवत धूप अग्नि पर,\nदीपक ज्योति जले ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nमोदक खीर चूरमा,\nसुवर्ण थाल भरे ।\nसेवक भोग लगावत,\nसेवा नित्य करे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nझांझ कटोरा और घडियावल,\nशंख मृदंग घुरे ।\nभक्त आरती गावे,\nजय-जयकार करे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nजो ध्यावे फल पावे,\nसब दुःख से उबरे ।\nसेवक जन निज मुख से,\nश्री श्याम-श्याम उचरे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nश्री श्याम बिहारी जी की आरती,\nजो कोई नर गावे ।\nकहत भक्त-जन,\nमनवांछित फल पावे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nजय श्री श्याम हरे,\nबाबा जी श्री श्याम हरे ।\nनिज भक्तों के तुमने,\nपूरण काज करे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ।\nखाटू धाम विराजत,\nअनुपम रूप धरे ॥\nॐ जय श्री श्याम हरे,\nबाबा जय श्री श्याम हरे ॥\n\nKhatu Shyam Ji Ki Aarti\n\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nKhatu dhaam viraajat,\nAnupam roop dhare.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nRatan jadit singhasan,\nSir par chamvar dhure.\nTan kesariya baago,\nKundal shravan pade.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nGal pushpon ki maala,\nSir par mukut dhare.\nKhevat dhoop agni par,\nDeepak jyoti jale.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nModak kheer choorma,\nSuvarn thaal bhare.\nSevak bhog lagavat,\nSeva nitya kare.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nJhanjh katora aur ghadiyaaval,\nShankh mridang ghure.\nBhakt aarti gaave,\nJai-jaykaar kare.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nJo dhyaave phal paave,\nSab dukh se ubre.\nSevak jan nij mukh se,\nShri Shyam-Shyam uchre.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nShri Shyam Bihari Ji ki aarti,\nJo koi nar gaave.\nKahat bhakt-jan,\nManvaanchhit phal paave.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nJai Shri Shyam Hare,\nBaba Ji Shri Shyam Hare.\nNij bhakton ke tumne,\nPooran kaaj kare.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.\nKhatu dhaam viraajat,\nAnupam roop dhare.\nOm Jai Shri Shyam Hare,\nBaba Jai Shri Shyam Hare.`;

    const doc = new Devotional({
      title,
      description: 'Khatu Shyam Ji Ki Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Khatu Shyam',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Khatu Shyam Ji Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Khatu Shyam Ji Aarti:', err);
    process.exit(1);
  }
}

addKhatuShyamAarti();
