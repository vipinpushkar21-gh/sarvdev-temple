const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Stotra' },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const newStotra = {
  title: 'श्री हरि स्तोत्रम् (Shri Hari Stotram)',
  deity: 'Vishnu',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Hari Stotram is a magnificent 8-verse hymn (ashtakam) in praise of Lord Vishnu (Hari), composed in elegant Sanskrit. Each verse ends with the refrain "Bhaje\'ham Bhaje\'ham" — "I worship, I worship." The stotram glorifies Vishnu as the protector of the cosmic web, wielder of the blue-hued celestial body, slayer of great demons, and the one adorned with Goddess Lakshmi (Padma). It describes Him as the essence of the Vedas, the one who sports in cosmic waters, bearer of the mace and discus, wearing golden garments, the root of the world-tree, beyond birth and old age, ever-blissful, the cause of creation, and the bridge of the three worlds. The phala-shruti declares that one who recites this ashtakam with focused mind attains the eternal, grief-free abode of Lord Vishnu and is freed from the sorrows of birth and death.',
  lyrics: `॥ श्री हरि स्तोत्रम् ॥

जगज्जालपालं चलत्कण्ठमालं
शरच्चन्द्रभालं महादैत्यकालं।
नभोनीलकायं दुरावारमायं
सुपद्मासहायम् भजेऽहं भजेऽहं॥1॥

सदाम्भोधिवासं गलत्पुष्पहासं
जगत्सन्निवासं शतादित्यभासं।
गदाचक्रशस्त्रं लसत्पीतवस्त्रं
हसच्चारुवक्त्रं भजेऽहं भजेऽहं॥2॥

रमाकण्ठहारं श्रुतिव्रातसारं
जलान्तर्विहारं धराभारहारं।
चिदानन्दरूपं मनोज्ञस्वरूपं
ध्रुतानेकरूपं भजेऽहं भजेऽहं॥3॥

जराजन्महीनं परानन्दपीनं
समाधानलीनं सदैवानवीनं।
जगज्जन्महेतुं सुरानीककेतुं
त्रिलोकैकसेतुं भजेऽहं भजेऽहं॥4॥

कृताम्नायगानं खगाधीशयानं
विमुक्तेर्निदानं हरारातिमानं।
स्वभक्तानुकूलं जगद्व्रुक्षमूलं
निरस्तार्तशूलं भजेऽहं भजेऽहं॥5॥

समस्तामरेशं द्विरेफाभकेशं
जगद्विम्बलेशं ह्रुदाकाशदेशं।
सदा दिव्यदेहं विमुक्ताखिलेहं
सुवैकुण्ठगेहं भजेऽहं भजेऽहं॥6॥

सुरालिबलिष्ठं त्रिलोकीवरिष्ठं
गुरूणां गरिष्ठं स्वरूपैकनिष्ठं।
सदा युद्धधीरं महावीरवीरं
महाम्भोधितीरं भजेऽहं भजेऽहं॥7॥

रमावामभागं तलानग्रनागं
कृताधीनयागं गतारागरागं।
मुनीन्द्रैः सुगीतं सुरैः संपरीतं
गुणौधैरतीतं भजेऽहं भजेऽहं॥8॥

॥ फलश्रुति ॥
इदं यस्तु नित्यं समाधाय चित्तं
पठेदष्टकं कण्ठहारम् मुरारेः।
स विष्णोर्विशोकं ध्रुवं याति लोकं
जराजन्मशोकं पुनर्विन्दते नो॥9॥

॥ इति श्री हरि स्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Hari Stotram ॥

Jagajjaalapalam chalatkanthamaalam
Sharachchandrabhalam mahadaityakaalam.
Nabhoneelakayam duravaramaayam
Supadmaasahaayam bhaje'ham bhaje'ham.||1||

Sadaambhodhivaasam galatpushpahaasam
Jagatsannivaasam shataadityabhaasam.
Gadaachakrashastram lasatpeetavastram
Hasachcharuvaktram bhaje'ham bhaje'ham.||2||

Ramaakanthaharam shrutivraatasaaram
Jalaantarviharam dharaabhaarahaaram.
Chidaanandaroopam manojnasvaroopam
Dhrutaanekaroopam bhaje'ham bhaje'ham.||3||

Jarajanmaheenam paraanandapeenam
Samaadhaanaleenaam sadaivaannaveenam.
Jagajjanmahetum suraaneekaaketum
Trilokaikaasetum bhaje'ham bhaje'ham.||4||

Krutaamnaayagaanam khagaadheeshayaanam
Vimukternidaanam haraaaratimanam.
Svabhaktaanukoolam jagadvrukshamoolam
Nirastaartashoolam bhaje'ham bhaje'ham.||5||

Samastaamaresham dvirephaabhakesham
Jagadvimblalesham hrudaakaashadesham.
Sadaa divyadeham vimuktaakhileham
Suvaikunthaageham bhaje'ham bhaje'ham.||6||

Suraalibalishtam trilokeevarishtam
Guroonaam garishtam svaroopaikanish-tham.
Sadaa yuddhadheeram mahaaveeraveeraam
Mahaambhodhiteeram bhaje'ham bhaje'ham.||7||

Ramaavaama bhaagam talaanagranagam
Krutaadheenayaagam gataaragaragam.
Muneendraiah sugeetam suraih sampareetam
Gunaughairaateetam bhaje'ham bhaje'ham.||8||

॥ Phalashruti ॥
Idam yastu nityam samaadhaaya chittam
Pathedashtakam kanthahaaram muraareh.
Sa vishnorvisokam dhruvam yaati lokam
Jarajanmashokam punarvindate no.||9||

॥ Iti Shri Hari Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      await Devotional.updateOne({ _id: existing._id }, { $set: newStotra });
      console.log('🔄 Shri Hari Stotram updated successfully!');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Shri Hari Stotram added successfully!');
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`📜 Total Stotras in DB: ${total}`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addStotra();
