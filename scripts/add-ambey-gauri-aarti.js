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

async function addAmbeGauriAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'जय अम्बे गौरी आरती (Jai Ambe Gauri Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Durga', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `जय अम्बे गौरी आरती (शुद्ध हिंदी रूप)\n\nजय अम्बे गौरी,\nमैया जय श्यामा गौरी ।\nतुमको निशदिन ध्यावत,\nहरि ब्रह्मा शिवरी ॥\nॐ जय अम्बे गौरी..॥\nमांग सिंदूर विराजत,\nटीको मृगमद को ।\nउज्ज्वल से दोउ नैना,\nचंद्रवदन नीको ॥\nॐ जय अम्बे गौरी..॥\nकनक समान कलेवर,\nरक्ताम्बर राजै ।\nरक्तपुष्प गल माला,\nकंठन पर साजै ॥\nॐ जय अम्बे गौरी..॥\nकेहरि वाहन राजत,\nखड्ग खप्पर धारी ।\nसुर-नर-मुनिजन सेवत,\nतिनके दुखहारी ॥\nॐ जय अम्बे गौरी..॥\nकानन कुण्डल शोभित,\nनासाग्रे मोती ।\nकोटिक चंद्र दिवाकर,\nसम राजत ज्योती ॥\nॐ जय अम्बे गौरी..॥\nशुंभ-निशुंभ बिदारे,\nमहिषासुर घाती ।\nधूम्र विलोचन नैना,\nनिशदिन मदमाती ॥\nॐ जय अम्बे गौरी..॥\nचण्ड-मुण्ड संहारे,\nशोणित बीज हरे ।\nमधु-कैटभ दोउ मारे,\nसुर भयहीन करे ॥\nॐ जय अम्बे गौरी..॥\nब्रह्माणी, रूद्राणी,\nतुम कमला रानी ।\nआगम निगम बखानी,\nतुम शिव पटरानी ॥\nॐ जय अम्बे गौरी..॥\nचौंसठ योगिनी मंगल गावत,\nनृत्य करत भैरों ।\nबाजत ताल मृदंगा,\nअरू बाजत डमरू ॥\nॐ जय अम्बे गौरी..॥\nतुम ही जग की माता,\nतुम ही हो भरता,\nभक्तन की दुख हरता ।\nसुख संपति करता ॥\nॐ जय अम्बे गौरी..॥\nभुजा चार अति शोभित,\nवर मुद्रा धारी ।\nमनवांछित फल पावत,\nसेवत नर नारी ॥\nॐ जय अम्बे गौरी..॥\nकंचन थाल विराजत,\nअगर कपूर बाती ।\nश्रीमालकेतु में राजत,\nकोटि रतन ज्योती ॥\nॐ जय अम्बे गौरी..॥\nश्री अंबेजी की आरति,\nजो कोइ नर गावे ।\nकहत शिवानंद स्वामी,\nसुख-संपति पावे ॥\nॐ जय अम्बे गौरी..॥\nजय अम्बे गौरी,\nमैया जय श्यामा गौरी ॥\n\nJai Ambe Gauri Aarti \n\nJai Ambe Gauri,\nMaiya Jai Shyama Gauri.\nTumko nishdin dhyaavat,\nHari Brahma Shivri.\nOm Jai Ambe Gauri…\nMaang sindoor virajat,\nTeeko mrugmad ko.\nUjjwal se dou naina,\nChandravadan neeko.\nOm Jai Ambe Gauri…\nKanak samaan kalevar,\nRaktambar raajai.\nRaktpushp gal maala,\nKanthan par saajai.\nOm Jai Ambe Gauri…\nKehri vaahan raajat,\nKhadag khappar dhaari.\nSur-nar-munijan sevat,\nTinke dukhhaari.\nOm Jai Ambe Gauri…\nKaanan kundal shobhit,\nNaasagre moti.\nKotik chandra divaakar,\nSam raajat jyoti.\nOm Jai Ambe Gauri…\nShumbh-Nishumbh bidaare,\nMahishasur ghaati.\nDhoomra vilochan naina,\nNishdin madmaati.\nOm Jai Ambe Gauri…\nChand-Mund sanhaare,\nShonit beej hare.\nMadhu-Kaitabh dou maare,\nSur bhayheen kare.\nOm Jai Ambe Gauri…\nBrahmani, Rudrani,\nTum Kamla Rani.\nAgam nigam bakhaani,\nTum Shiv Patraani.\nOm Jai Ambe Gauri…\nChaunsath yogini mangal gaavat,\nNritya karat Bhairon.\nBajat taal mridanga,\nAru bajat damru.\nOm Jai Ambe Gauri…\nTum hi jag ki maata,\nTum hi ho bharta.\nBhaktan ki dukh harta,\nSukh sampati karta.\nOm Jai Ambe Gauri…\nBhuja chaar ati shobhit,\nVar mudra dhaari.\nManvaanchhit phal paavat,\nSevat nar naari.\nOm Jai Ambe Gauri…\nKanchan thaal virajat,\nAgar kapoor baati.\nShreemal ketu mein raajat,\nKoti ratan jyoti.\nOm Jai Ambe Gauri…\nShri Ambeji ki aarti,\nJo koi nar gaave.\nKahat Shivanand Swami,\nSukh-sampati paave.\nOm Jai Ambe Gauri…\nJai Ambe Gauri,\nMaiya Jai Shyama Gauri.`;

    const doc = new Devotional({
      title,
      description: 'Jai Ambe Gauri Aarti (Shuddh Hindi Roop)',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Durga',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Ambe Gauri Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Ambe Gauri Aarti:', err);
    process.exit(1);
  }
}

addAmbeGauriAarti();
