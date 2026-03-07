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

const shivManasPujaStotram = {
  title: 'शिव मानस पूजा स्तोत्रम् (Shiv Manas Puja Stotram)',
  deity: 'Shiva',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shiv Manas Puja Stotram is a sublime hymn composed by Adi Shankaracharya for performing a mental worship (Manas Puja) of Lord Shiva. In this stotram, the devotee offers everything to Lord Shiva through the power of imagination — a jeweled throne, holy water for bathing, divine garments, sandalwood paste, flowers, incense, lamps, food offerings, and all rituals — all within the mind. The final verse is a beautiful prayer seeking forgiveness for all sins committed through hands, feet, speech, body, actions, ears, eyes, or mind.',
  lyrics: `॥ शिव मानस पूजा स्तोत्रम् ॥

रत्नैः कल्पितमासनं हिमजलैः स्नानं च दिव्याम्बरं
नानारत्नविभूषितं मृगमदामोदाङ्कितं चन्दनम्।
जातीचम्पकबिल्वपत्ररचितं पुष्पं च धूपं तथा
दीपं देव दयानिधे पशुपते हृत्कल्पितं गृह्यताम्॥1॥

सौवर्णे नवरत्नखण्डरचिते पात्रे घृतं पायसं
भक्ष्यं पञ्चविधं पयोदधियुतं रम्भाफलं पानकम्।
शाकानामयुतं जलं रुचिकरं कर्पूरखण्डोज्ज्वलं
ताम्बूलं मनसा मया विरचितं भक्त्या प्रभो स्वीकुरु॥2॥

छत्रं चामरयोर्युगं व्यजनकं चादर्शकं निर्मलं
वीणाभेरिमृदङ्गकाहलकला गीतं च नृत्यं तथा।
साष्टाङ्गं प्रणतिः स्तुतिर्बहुविधा ह्येतत्समस्तं मया
सङ्कल्पेन समर्पितं तव विभो पूजां गृहाण प्रभो॥3॥

आत्मा त्वं गिरिजा मतिः सहचराः प्राणाः शरीरं गृहं
पूजा ते विषयोपभोगरचना निद्रा समाधिस्थितिः।
सञ्चारः पदयोः प्रदक्षिणविधिः स्तोत्राणि सर्वा गिरो
यद्यत्कर्म करोमि तत्तदखिलं शम्भो तवाराधनम्॥4॥

करचरणकृतं वाक्कायजं कर्मजं वा।
श्रवणनयनजं वा मानसं वापराधम्।
विदितमविदितं वा सर्वमेतत्क्षमस्व।
जय जय करुणाब्धे श्रीमहादेवशम्भो॥5॥

॥ इति श्रीमच्छङ्कराचार्यविरचिता शिवमानसपूजा समाप्ता ॥

---

|| Shiv Manas Puja Stotram ||

Ratnaih Kalpitam-asanam Himajalais Snanam Cha Divyambaram
Nanaratna-vibhushitam Mrigamada-modankitam Chandanam.
Jati-champaka-bilvapatrarachitam Pushpam Cha Dhupam Tatha
Dipam Deva Dayanidhe Pashupate Hritkalpitam Grihyatam. ||1||

Sauvarne Navaratna-khanda-rachite Patre Ghritam Payasam
Bhakshyam Panchavidham Payodadhi-yutam Rambhaphalam Panakam.
Shakanam-ayutam Jalam Ruchikaram Karpura-khandojjvalam
Tambulam Manasa Maya Virachitam Bhaktya Prabho Svikuru. ||2||

Chhatram Chamarayor-yugam Vyajanakam Chadarshakam Nirmalam
Vina-bheri-mridanga-kahala-kala Gitam Cha Nrityam Tatha.
Sashtangam Pranatih Stutir-bahuvidha Hyetatssamastam Maya
Sankalpena Samarpitam Tava Vibho Pujam Grihana Prabho. ||3||

Atma Tvam Girija Matih Sahacharah Pranah Shariram Griham
Puja Te Vishayopabhoga-rachana Nidra Samadhi-sthitih.
Sancharah Padayoh Pradakshina-vidhih Stotrani Sarva Giro
Yadyatkarma Karomi Tattadakhilam Shambho Tavaradhanam. ||4||

Karacharana-kritam Vak-kayajam Karmajam Va.
Shravana-nayanajam Va Manasam Vaparadham.
Viditam-aviditam Va Sarvametat-kshamasva.
Jaya Jaya Karunabdhe Shri Mahadeva Shambho. ||5||

|| Iti Shrimach-chhankaracharya-virachita Shiv Manas Puja Samapta ||`
};

async function addShivManasPujaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: shivManasPujaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shiv Manas Puja Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(shivManasPujaStotram);
      await doc.save();
      console.log('✓  Added: ' + shivManasPujaStotram.title);
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

addShivManasPujaStotram();
