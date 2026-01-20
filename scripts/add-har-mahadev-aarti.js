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

async function addHarMahadevAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'हर महादेव आरती: सत्य, सनातन, सुंदर (Har Mahadev Aarti: Satya Sanatan Sundar)';
    const existing = await Devotional.findOne({ title, deity: 'Shiva', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `हर महादेव आरती: सत्य, सनातन, सुंदर \n\nसत्य, सनातन, सुंदर,\nशिव! सबके स्वामी ।\nअविकारी, अविनाशी,\nअज, अंतर्यामी ॥\nॐ हर हर हर महादेव..॥\nआदि अनंत, अनामय,\nअकल, कलाधारी ।\nअमल, अरूप, अगोचर,\nअविचल अघहारी ॥\nॐ हर हर हर महादेव..॥\nब्रह्मा, विष्णु, महेश्वर,\nतुम त्रिमूर्तिधारी ।\nकर्ता, भर्ता, धर्ता,\nतुम ही संहारी ॥\nॐ हर हर हर महादेव..॥\nरक्षक, भक्षक, प्रेरक,\nतुम औढरदानी ।\nसाक्षी, परम अकर्ता,\nकर्ता अभिमानी ॥\nॐ हर हर हर महादेव..॥\nमणिमय भवन निवासी,\nअति भोगी, रागी ।\nसदा मसानबिहारी,\nयोगी वैरागी ॥\nॐ हर हर हर महादेव..॥\nछाल, कपाल, गरल,\nगल, मुंडमाल व्याली ।\nचिताभस्म तन, त्रिनयन,\nअयन महाकाली ॥\nॐ हर हर हर महादेव..॥\nप्रेत-पिशाच सुसेवित,\nपीत जटाधारी ।\nविवसन, विकट रूपधर,\nरुद्र प्रलयकारी ॥\nॐ हर हर हर महादेव..॥\nशुभ्र, सौम्य, सुरसरिधर,\nशशिधर, सुखकारी ।\nअतिकमनीय, शान्तिकर,\nशिव मुनि मन हारी ॥\nॐ हर हर हर महादेव..॥\nनिर्गुण, सगुण, निरंजन,\nजगमय नित्य प्रभो ।\nकालरूप केवल, हर!\nकालातीत विभो ॥\nॐ हर हर हर महादेव..॥\nसत-चित-आनंद, रसमय,\nकरुणामय, धाता ।\nप्रेम-सुधा-निधि, प्रियतम,\nअखिल विश्व-त्राता ॥\nॐ हर हर हर महादेव..॥\nहम अति दीन, दयामय!\nचरण-शरण दीजै ।\nसब विधि निर्मल मति,\nकर अपना कर लीजै ॥\nॐ हर हर हर महादेव..॥\n\nHar Mahadev Aarti: Satya Sanatan Sundar \n\nSatya, Sanatan, Sundar,\nShiv! Sabke Swami.\nAvikari, Avinashi,\nAj, Antaryaami.\nOm Har Har Har Mahadev..\nAadi Anant, Anamay,\nAkal, Kaladhaari.\nAmal, Aroop, Agochar,\nAvichal Aghahaari.\nOm Har Har Har Mahadev..\nBrahma, Vishnu, Maheshwar,\nTum Trimurti dhaari.\nKarta, Bharta, Dharta,\nTum hi Sanhaari.\nOm Har Har Har Mahadev..\nRakshak, Bhakshak, Prerak,\nTum Audhardaani.\nSaakshi, Param Akarta,\nKarta Abhimaani.\nOm Har Har Har Mahadev..\nManimay Bhavan Nivaasi,\nAti Bhogi, Raagi.\nSada Masaanbihari,\nYogi Vairaagi.\nOm Har Har Har Mahadev..\nChhaal, Kapal, Garal,\nGal, Mundmaal Vyaali.\nChitabhasm Tan, Trinayan,\nAyan Mahakaali.\nOm Har Har Har Mahadev..\nPret-Pishaach Susevit,\nPeet Jataadhaari.\nVivasan, Vikat Roopdhar,\nRudra Pralaykaari.\nOm Har Har Har Mahadev..\nShubhra, Saumya, Sursaridhar,\nShashidhar, Sukhkaari.\nAtikamaniya, Shaantikar,\nShiv Muni Man Haari.\nOm Har Har Har Mahadev..\nNirgun, Sagun, Niranjan,\nJagmay Nitya Prabho.\nKaalroop Keval, Har!\nKaalateet Vibho.\nOm Har Har Har Mahadev..\nSat-Chit-Anand, Rasmay,\nKarunamay, Dhaata.\nPrem-Sudha-Nidhi, Priyatam,\nAkhil Vishw-Trata.\nOm Har Har Har Mahadev..\nHum Ati Deen, Dayamay!\nCharan-Sharan Deeje.\nSab Vidhi Nirmal Mati,\nKar Apna Kar Leeje.\nOm Har Har Har Mahadev..`;

    const doc = new Devotional({
      title,
      description: 'Har Mahadev Aarti: Satya Sanatan Sundar',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Shiva',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Har Mahadev Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Har Mahadev Aarti:', err);
    process.exit(1);
  }
}

addHarMahadevAarti();
