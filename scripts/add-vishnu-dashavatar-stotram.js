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
  title: 'श्री विष्णु दशावतार स्तोत्रम् (Shri Vishnu Dashavatar Stotram)',
  deity: 'Vishnu',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Vishnu Dashavatar Stotram is the celebrated hymn by the great poet Jayadeva (author of Gita Govindam) glorifying the ten incarnations (Dashavatara) of Lord Vishnu. Each verse addresses Keshava as having assumed a particular form — Matsya (Fish) who saved the Vedas from the deluge, Kurma (Tortoise) who bore the mountain on his back, Varaha (Boar) who lifted the earth on his tusks, Narasimha (Man-Lion) who tore apart Hiranyakashipu, Vamana (Dwarf) who deceived King Bali, Parashurama (Bhrigupati) who cleansed the world of warrior-oppression, Rama (Raghupati) who conquered the ten-headed Ravana, Balarama (Haladhara) who wore dark garments and tamed Yamuna, Buddha who showed compassion against animal sacrifice, and Kalki who shall wield the sword at the end of the age. Each verse ends with the stirring refrain "Keshava Dhruta... Rupa Jaya Jagadeesha Hare." The concluding verse urges listeners to hear this auspicious and delightful hymn as the essence of worldly existence.',
  lyrics: `॥ श्री विष्णु दशावतार स्तोत्रम् ॥

प्रलयपयोधिजले धृतवानसि वेदम्।
विहितवहित्रचरित्रमखेदम्॥
केशव धृतमीनशरीर जय जगदीश हरे॥1॥

क्षितिरतिविपुलतरे तव तिष्ठति पृष्ठे।
धरणिधरणकिणचक्रगरिष्ठे॥
केशव धृतकच्छपरूप जय जगदीश हरे॥2॥

वसति दशनशिखरे धरणी तव लग्ना।
शशिनि कलङ्ककलेव निमग्ना॥
केशव धृतसूकररूप जय जगदीश हरे॥3॥

तव करकमलवरे नखमद्भुतश‍ृङ्गं।
दलितहिरण्यकशिपुतनुभृङ्गम्॥
केशव धृतनरहरिरूप जय जगदीश हरे॥4॥

छलयसि विक्रमणे बलिमद्भुतवामन।
पदनखनीरजनितजनपावन॥
केशव धृतवामनरूप जय जगदीश हरे॥5॥

क्षत्रियरुधिरमये जगदपगतपापम्।
स्नपयसि पयसि शमितभवतापम्॥
केशव धृतभृगुपतिरूप जय जगदीश हरे॥6॥

वितरसि दिक्षु रणे दिक्पतिकमनीयम्।
दशमुखमौलिबलिं रमणीयम्॥
केशव धृतरघुपतिवेष जय जगदीश हरे॥7॥

वहसि वपुषि विशदे वसनं जलदाभम्।
हलहतिभीतिमिलितयमुनाभम्॥
केशव धृतहलधररूप जय जगदीश हरे॥8॥

निन्दसि यज्ञविधेरहह श्रुतिजातम्।
सदयहृदयदर्शितपशुघातम्॥
केशव धृतबुद्धशरीर जय जगदीश हरे॥9॥

म्लेच्छनिवहनिधने कलयसि करवालम्।
धूमकेतुमिव किमपि करालम्॥
केशव धृतकल्किशरीर जय जगदीश हरे॥10॥

श्रीजयदेवकवेरिदमुदितमुदारम्।
श‍ृणु सुखदं शुभदं भवसारम्॥
केशव धृतदशविधरूप जय जगदीश हरे॥11॥

॥ इति श्रीजयदेवविरचितं श्रीदशावतारस्तोत्रं सम्पूर्णम्। ॥

---

॥ Shri Vishnu Dashavatar Stotram ॥

Pralayapayodhijale dhrutavaanasi vedam.
Vihitavahitracharitramakhedam.
Keshava dhrutameenashareera jaya jagadeesha hare.||1||

Kshitiratipivulatare tava tishthati prushthe.
Dharanidharanakinachakragarishteh.
Keshava dhrutakachchhaparoopa jaya jagadeesha hare.||2||

Vasati dashanashikhare dharanee tava lagnaa.
Shashini kalankaakaleva nimagnaa.
Keshava dhrutasookarahoopa jaya jagadeesha hare.||3||

Tava karakamalavare nakhamadbhutashrungam.
Dalitahiranyakashiputanubhrungam.
Keshava dhrutanarahariroopa jaya jagadeesha hare.||4||

Chhalayasi vikramane balimadbhutavaamana.
Padanakhaneera janitajanapaaavana.
Keshava dhrutavaamanaroopa jaya jagadeesha hare.||5||

Kshatriyarudhiramaye jagadapagatapaapm.
Snapayasi payasi shamitabhavataapm.
Keshava dhrutabhrugupatiroopa jaya jagadeesha hare.||6||

Vitarasi dikshu rane dikpatikamaneeyam.
Dashamukhamaulibalam ramaneeyam.
Keshava dhrutaraghupativesha jaya jagadeesha hare.||7||

Vahasi vapushi vishade vasanam jaladaabham.
Halahatibheetimilitayamunaabham.
Keshava dhrutahaladharahoopa jaya jagadeesha hare.||8||

Nindasi yajnyavidherahaha shrutijaatam.
Sadayahrudayadardshitapashughaatam.
Keshava dhrutabuddhashareera jaya jagadeesha hare.||9||

Mlechchhanivahanidahane kalayasi karavaalam.
Dhoomaketumiva kimapi karaalam.
Keshava dhrutakalkishareera jaya jagadeesha hare.||10||

Shreejayadevakaaveridamudditamudaraam.
Shrunu sukhadam shubhadam bhavasaaram.
Keshava dhrutadashavidharoopa jaya jagadeesha hare.||11||

॥ Iti Shri Jayadeva Virachitam Shri Dashavatara Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      await Devotional.updateOne({ _id: existing._id }, { $set: newStotra });
      console.log('🔄 Vishnu Dashavatar Stotram updated successfully!');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Vishnu Dashavatar Stotram added successfully!');
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
