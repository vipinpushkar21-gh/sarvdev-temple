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

async function addHanumanAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्री हनुमान आरती (शुद्ध हिंदी रूप)';
    const existing = await Devotional.findOne({ title, deity: 'Hanuman', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `श्री हनुमान आरती (शुद्ध हिंदी रूप)\n\nश्री हनुमंत स्तुति\nमनोजवं मारुत तुल्यवेगं,\nजितेन्द्रियं बुद्धिमतां वरिष्ठम् ।\nवातात्मजं वानरयूथमुख्यं,\nश्रीरामदूतं शरणं प्रपद्ये ॥\n\nआरती\n\nआरती कीजै हनुमान लला की ।\nदुष्ट दलन रघुनाथ कला की ॥\nजाके बल से गिरवर काँपे ।\nरोग-दोष जाके निकट न झाँके ॥\nअंजनि पुत्र महाबलदाई ।\nसंतन के प्रभु सदा सहाई ॥\nआरती कीजै हनुमान लला की ॥\nदे वीरा रघुनाथ पठाए ।\nलंका जारि सिया सुधि लाए ॥\nलंका सो कोट समुद्र सी खाई ।\nजात पवनसुत बार न लाई ॥\nआरती कीजै हनुमान लला की ॥\nलंका जारि असुर संहारे ।\nसियाराम जी के काज सँवारे ॥\nलक्ष्मण मूर्छित पड़े सकारे ।\nलाए संजीवन प्राण उबारे ॥\nआरती कीजै हनुमान लला की ॥\nपैठि पाताल तोरि जमकारे ।\nअहिरावण की भुजा उखारे ॥\nबाईं भुजा असुर दल मारे ।\nदाहिने भुजा संतजन तारे ॥\nआरती कीजै हनुमान लला की ॥\nसुर-नर-मुनिजन आरती उतरें ।\nजय जय जय हनुमान उचारें ॥\nकंचन थार कपूर लौ छाई ।\nआरती करत अंजना माई ॥\nआरती कीजै हनुमान लला की ॥\nजो हनुमानजी की आरती गावे ।\nबसहिं बैकुंठ परम पद पावे ॥\nलंका विध्वंस किये रघुराई ।\nतुलसीदास स्वामी कीर्ति गाई ॥\nआरती कीजै हनुमान लला की ।\nदुष्ट दलन रघुनाथ कला की ॥\n॥ इति संपूर्णम् ॥\n\nShri Hanuman Aarti\n\nShri Hanumant Stuti\nManojavam Marut Tulyavegam,\nJitendriyam Buddhimataam Varishtham.\nVaatatmajam Vanarayuth Mukhyam,\nShri Ramdootam Sharanam Prapadye.\n\nAarti kije Hanuman Lala ki,\nDusht dalan Raghunath kala ki.\nJake bal se Girvar kaampe,\nRog-dosh jake nikat na jhaanke.\nAnjani putra maha baldaai,\nSantana ke Prabhu sada sahai.\nAarti kije Hanuman Lala ki.\nDe veera Raghunath pathaaye,\nLanka jari Siya sudhi laaye.\nLanka so kot samudra si khai,\nJaat Pavansut baar na laai.\nAarti kije Hanuman Lala ki.\nLanka jari asur sanhaare,\nSiyaram ji ke kaaj sanvaare.\nLakshman moorchhit pade sakaare,\nLaaye Sanjeevan praan ubaare.\nAarti kije Hanuman Lala ki.\nPaithi Pataal tori Jamkaare,\nAhiravan ki bhuja ukhaare.\nBaayin bhuja asur dal maare,\nDaahine bhuja santjan taare.\nAarti kije Hanuman Lala ki.\nSur-nar-muni jan aarti utaren,\nJai Jai Jai Hanuman uchaaren.\nKanchan thaar kapoor lau chhaai,\nAarti karat Anjana maai.\nAarti kije Hanuman Lala ki.\nJo Hanumanji ki aarti gaave,\nBasahin Vaikunth param pad paave.\nLanka vidhvans kiye Raghurai,\nTulsidas Swami kirti gaai.\nAarti kije Hanuman Lala ki,\nDusht dalan Raghunath kala ki.\nIti Sampurnam.`;

    const doc = new Devotional({
      title,
      description: 'Shri Hanuman Aarti (Shuddh Hindi Roop)',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Hanuman',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Hanuman Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Hanuman Aarti:', err);
    process.exit(1);
  }
}

addHanumanAarti();
