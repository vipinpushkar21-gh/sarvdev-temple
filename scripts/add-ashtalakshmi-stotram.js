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

const ashtalakshmiStotram = {
  title: 'अष्टलक्ष्मी स्तोत्रम् (Ashtalakshmi Stotram)',
  deity: 'Lakshmi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Ashtalakshmi Stotram is a devotional hymn dedicated to the eight forms of Goddess Lakshmi — Adi Lakshmi, Dhanya Lakshmi, Dhairya Lakshmi, Gaja Lakshmi, Santana Lakshmi, Vijaya Lakshmi, Vidya Lakshmi and Dhana Lakshmi. Reciting this stotram invokes the blessings of all eight forms of Goddess Lakshmi for wealth, courage, knowledge, progeny and prosperity.',
  lyrics: `॥ अष्टलक्ष्मी स्तोत्रम् ॥

॥ आदिलक्ष्मि ॥

सुमनस वन्दित सुन्दरि माधवि, चन्द्र सहोदरि हेममये
मुनिगणमण्डित मोक्षप्रदायनि, मञ्जुळभाषिणि वेदनुते।
पङ्कजवासिनि देवसुपूजित, सद्गुण वर्षिणि शान्तियुते
जय जय हे मधुसूदन कामिनि, आदिलक्ष्मि सदा पालय माम्॥१॥

॥ धान्यलक्ष्मि ॥

अहिकलि कल्मषनाशिनि कामिनि, वैदिकरूपिणि वेदमये
क्षीरसमुद्भव मङ्गलरूपिणि, मन्त्रनिवासिनि मन्त्रनुते।
मङ्गलदायिनि अम्बुजवासिनि, देवगणाश्रित पादयुते
जय जय हे मधुसूदन कामिनि, धान्यलक्ष्मि सदा पालय माम्॥२॥

॥ धैर्यलक्ष्मि ॥

जयवरवर्णिनि वैष्णवि भार्गवि, मन्त्रस्वरूपिणि मन्त्रमये
सुरगणपूजित शीघ्रफलप्रद, ज्ञानविकासिनि शास्त्रनुते।
भवभयहारिणि पापविमोचनि, साधुजनाश्रित पादयुते
जय जय हे मधुसूधन कामिनि, धैर्यलक्ष्मी सदा पालय माम्॥३॥

॥ गजलक्ष्मि ॥

जय जय दुर्गतिनाशिनि कामिनि, सर्वफलप्रद शास्त्रमये
रधगज तुरगपदाति समावृत, परिजनमण्डित लोकनुते।
हरिहर ब्रह्म सुपूजित सेवित, तापनिवारिणि पादयुते
जय जय हे मधुसूदन कामिनि, गजलक्ष्मी रूपेण पालय माम्॥४॥

॥ सन्तानलक्ष्मि ॥

अहिखग वाहिनि मोहिनि चक्रिणि, रागविवर्धिनि ज्ञानमये
गुणगणवारिधि लोकहितैषिणि, स्वरसप्त भूषित गाननुते।
सकल सुरासुर देवमुनीश्वर, मानववन्दित पादयुते
जय जय हे मधुसूदन कामिनि, सन्तानलक्ष्मी त्वं पालय माम्॥५॥

॥ विजयलक्ष्मि ॥

जय कमलासनि सद्गतिदायिनि, ज्ञानविकासिनि गानमये
अनुदिनमर्चित कुङ्कुमधूसर, भूषित वासित वाद्यनुते।
कनकधरास्तुति वैभव वन्दित, शङ्कर देशिक मान्य पदे
जय जय हे मधुसूदन कामिनि, विजयलक्ष्मी सदा पालय माम्॥६॥

॥ विद्यालक्ष्मि ॥

प्रणत सुरेश्वरि भारति भार्गवि, शोकविनाशिनि रत्नमये
मणिमयभूषित कर्णविभूषण, शान्तिसमावृत हास्यमुखे।
नवनिधिदायिनि कलिमलहारिणि, कामित फलप्रद हस्तयुते
जय जय हे मधुसूदन कामिनि, विद्यालक्ष्मी सदा पालय माम्॥७॥

॥ धनलक्ष्मि ॥

धिमिधिमि धिंधिमि धिंधिमि-धिंधिमि, दुन्दुभि नाद सुपूर्णमये
घुमघुम घुङ्घुम घुङ्घुम घुङ्घुम, शङ्खनिनाद सुवाद्यनुते।
वेदपूराणेतिहास सुपूजित, वैदिकमार्ग प्रदर्शयुते
जय जय हे मधुसूदन कामिनि, धनलक्ष्मि रूपेणा पालय माम्॥८॥

---

॥ Ashtalakshmi Stotram ॥

॥ Adi Lakshmi ॥

Sumanas Vandita Sundari Madhavi, Chandra Sahodari Hemamaye
Munigana Mandita Mokshapradayani, Manjulabhashini Vedanute.
Pankajavasini Devasupujita, Sadguna Varshini Shantiyute
Jaya Jaya He Madhusudana Kamini, Adilakshmi Sada Palaya Mam ||1||

॥ Dhanya Lakshmi ॥

Ahikali Kalmashanashini Kamini, Vaidikarupini Vedamaye
Kshirasamudbhava Mangalarupini, Mantranivasini Mantranute.
Mangaladayini Ambujavasini, Devaganashrita Padayute
Jaya Jaya He Madhusudana Kamini, Dhanyalakshmi Sada Palaya Mam ||2||

॥ Dhairya Lakshmi ॥

Jayavaravarnini Vaishnavi Bhargavi, Mantraswarupini Mantramaye
Suraganapujita Shighraphalaprada, Jnanavikasini Shastranute.
Bhavabhayaharini Papavimochani, Sadhujanashrita Padayute
Jaya Jaya He Madhusudana Kamini, Dhairyalakshmi Sada Palaya Mam ||3||

॥ Gaja Lakshmi ॥

Jaya Jaya Durgatinashini Kamini, Sarvaphalaprada Shastramaye
Radhagaja Turagapadati Samavrita, Parijanamandita Lokanute.
Harihara Brahma Supujita Sevita, Tapanivarini Padayute
Jaya Jaya He Madhusudana Kamini, Gajalakshmi Rupena Palaya Mam ||4||

॥ Santana Lakshmi ॥

Ahikhaga Vahini Mohini Chakrini, Ragavivardhini Jnanamaye
Gunaganavaridhi Lokahitaishini, Svarasapta Bhushita Gananute.
Sakala Surasura Devamunishvara, Manavavandita Padayute
Jaya Jaya He Madhusudana Kamini, Santanalakshmi Tvam Palaya Mam ||5||

॥ Vijaya Lakshmi ॥

Jaya Kamalasani Sadgatidayini, Jnanavikasini Ganamaye
Anudinamarchita Kunkumadhusara, Bhushita Vasita Vadyanute.
Kanakadharastuti Vaibhava Vandita, Shankara Deshika Manya Pade
Jaya Jaya He Madhusudana Kamini, Vijayalakshmi Sada Palaya Mam ||6||

॥ Vidya Lakshmi ॥

Pranata Sureshvari Bharati Bhargavi, Shokavinashini Ratnamaye
Manimayabhushita Karnavibhushana, Shantisamavrita Hasyamukhe.
Navanidhidayini Kalimalaharini, Kamita Phalaprada Hastayute
Jaya Jaya He Madhusudana Kamini, Vidyalakshmi Sada Palaya Mam ||7||

॥ Dhana Lakshmi ॥

Dhimidhimi Dhindhimi Dhindhimi-Dhindhimi, Dundubhi Nada Supurnamaye
Ghumaghuma Ghunghuma Ghunghuma Ghunghuma, Shankhaninada Suvadyanute.
Vedapuranetihasa Supujita, Vaidikamarga Pradarsayute
Jaya Jaya He Madhusudana Kamini, Dhanalakshmi Rupena Palaya Mam ||8||

॥ इति अष्टलक्ष्मी स्तोत्रम् सम्पूर्णम् ॥`
};

async function addAshtalakshmiStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: ashtalakshmiStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Ashtalakshmi Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(ashtalakshmiStotram);
      await doc.save();
      console.log('✓  Added: ' + ashtalakshmiStotram.title);
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`\nTotal Stotras in DB: ${total}`);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

addAshtalakshmiStotram();
