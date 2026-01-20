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

async function addShivGangadharAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'शिव आरती – ॐ जय गंगाधर (Shiv Aarti – Om Jai Gangadhar)';
    const existing = await Devotional.findOne({ title, deity: 'Shiva', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `शिव आरती – ॐ जय गंगाधर

ॐ जय गंगाधर जय हर,
जय गिरिजाधीशा ।
त्वं मां पालय नित्यं,
कृपया जगदीशा ॥
ॐ हर हर हर महादेव ॥
कैलासे गिरिशिखरे,
कल्पद्रुम विपिने ।
गुंजति मधुकर पुंजे,
कुंजवने गहने ॥
ॐ हर हर हर महादेव ॥
कोकिल कूजित खेलत,
हंसावन ललिता ।
रचयति कलाकलापं,
नृत्यति मुदसहिता ॥
ॐ हर हर हर महादेव ॥
तस्मिंल्ललित सुदेशे,
शाला मणिरचिता ।
तन्मध्ये हर निकटे,
गौरी मुदसहिता ॥
क्रीडा रचयति,
भूषा रंचित निजमीशम् ।
इंद्रादिक सुर सेवत,
नामयते शीशम् ॥
ॐ हर हर हर महादेव ॥
बिबुध बधू बहु नृत्यत,
हृदये मुदसहिता ।
किन्नर गायन कुरुते,
सप्त स्वर सहिता ॥
धिनकत थै थै धिनकत,
मृदंग वादयते ।
क्वण क्वण ललिता वेणुं,
मधुरं नाटयते ॥
ॐ हर हर हर महादेव ॥
रुण रुण चरणे रचयति,
नूपुर उज्ज्वलिता ।
चक्रावर्ते भ्रमयति,
कुरुते तां धिक तां ॥
ॐ हर हर हर महादेव ॥
तां तां लुप चुप,
तां तां डमरू वादयते ।
अंगुष्ठांगुलि नादं,
लासकतां कुरुते ॥
ॐ हर हर हर महादेव ॥
कपूरद्युतिगौरं,
पञ्चानन सहितम् ।
त्रिनयन शशिधर मौलिं,
विषधर कण्ठ युतम् ॥
ॐ हर हर हर महादेव ॥
सुन्दर जटाय कलापं,
पावक युत भालम् ।
डमरु त्रिशूल पिनाकं,
करधृत नृकपालम् ॥
ॐ हर हर हर महादेव ॥
मुण्डै रचयति माला,
पन्नगम उपवीतम् ।
वाम विभागे गिरिजा,
रूपं अतिललितम् ॥
ॐ हर हर हर महादेव ॥
सुन्दर सकल शरीरे,
कृत भस्माभरणम् ।
इति वृषभध्वज रूपं,
तापत्रय हरणम् ॥
ॐ हर हर हर महादेव ॥
शंखनिनादं कृत्वा,
झल्लरि नादयते ।
नीराजयते ब्रह्मा,
वेद ऋचां पठते ॥
ॐ हर हर हर महादेव ॥
अति मृदु चरण सरोजं,
हृत्कमले धृत्वा ।
अवलोकयति महेशं,
ईशं अभिनत्वा ॥
ॐ हर हर हर महादेव ॥
ध्यानं आरति समये,
हृदये अति कृत्वा ।
रामस्त्रिजटानाथं,
ईशं अभिनत्वा ॥
ॐ हर हर हर महादेव ॥
संगतिमेवं प्रतिदिन,
पठनं यः कुरुते ।
शिवसायुज्यं गच्छति,
भक्त्या यः श्रृणुते ॥
ॐ हर हर हर महादेव ॥

Shiv Aarti – Om Jai Gangadhar

Om Jai Gangadhar Jai Har,
Jai Girijaadhisha.
Tvam maam paalay nityam,
Kripaya Jagadisha.
Om Har Har Har Mahadev.
Kailase girishikhare,
Kalpadrum vipine.
Gunjati madhukar punje,
Kunjavane gahane.
Om Har Har Har Mahadev.
Kokila kujit khelat,
Hansavan lalita.
Rachayati kalakalapam,
Nrityati mudsahita.
Om Har Har Har Mahadev.
Tasmim lalita sudeshe,
Shaala manirachita.
Tanmadhye Har nikate,
Gauri mudsahita.
Krida rachayati,
Bhusha ranchit nijmeesham.
Indradik sur sevat,
Namayate sheesham.
Om Har Har Har Mahadev.
Bibudh badhu bahu nrityat,
Hridaye mudsahita.
Kinnar gaayan kurute,
Sapt swar sahita.
Dhinkat thai thai dhinkat,
Mridang vaadayate.
Kwan kwan lalita venu,
Madhuram natayate.
Om Har Har Har Mahadev.
Run run charane rachayati,
Noopur ujjwalita.
Chakravaarte bhramayati,
Kurute taam dhik taam.
Om Har Har Har Mahadev.
Taam taam lup chup,
Taam taam damru vaadayate.
Angushthanguli naadam,
Laaskataam kurute.
Om Har Har Har Mahadev.
Kapooradyuti gauram,
Panchanan sahitam.
Trinayan shashidhar maulim,
Vishadhar kanthayutam.
Om Har Har Har Mahadev.
Sundar jataya kalapam,
Paavak yut bhaalam.
Damru trishul pinakam,
Kar dhrit nrikapalam.
Om Har Har Har Mahadev.
Mundai rachayati maala,
Pannagam upaveetam.
Vaam vibhaage Girija,
Roopam atilalitam.
Om Har Har Har Mahadev.
Sundar sakal shareere,
Krit bhasmabharanam.
Iti Vrishabhadhwaj roopam,
Taapatray haranam.
Om Har Har Har Mahadev.
Shankh ninadam kritva,
Jhallari naadayate.
Neerajayate Brahma,
Vedaricham pathate.
Om Har Har Har Mahadev.
Ati mridu charan sarojam,
Hritkamale dhritva.
Avalokayati Mahesham,
Isham abhinatva.
Om Har Har Har Mahadev.
Dhyaanam aarti samaye,
Hridaye ati kritva.
Ramstri Jataanatham,
Isham abhinatva.
Om Har Har Har Mahadev.
Sangatimevam pratidin,
Pathanam yah kurute.
Shivsayujyam gacchhati,
Bhaktya yah shrunute.
Om Har Har Har Mahadev.`;

    const doc = new Devotional({
      title,
      description: 'Shiv Aarti – Om Jai Gangadhar',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Shiva',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Shiv Gangadhar Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Shiv Gangadhar Aarti:', err);
    process.exit(1);
  }
}

addShivGangadharAarti();
