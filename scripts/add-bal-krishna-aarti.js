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

async function addBalKrishnaAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'आरती बाल कृष्ण की कीजै (Aarti Bal Krishna Ki Keejai)';
    const existing = await Devotional.findOne({ title, deity: 'Krishna', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `आरती बाल कृष्ण की कीजै 

आरती बाल कृष्ण की कीजै,
अपना जन्म सफल कर लीजै ॥
श्री यशोदा का परम दुलारा,
बाबा के अँखियन का तारा।
गोपियन के प्राणन से प्यारा,
इन पर प्राण न्योछावर कीजै ॥
॥ आरती बाल कृष्ण की कीजै...॥
बलदाऊ के छोटे भैया,
कनुआ कहि कहि बोले मैया।
परम मुदित मन लेत बलैया,
अपना सर्वस्व इनको दीजै ॥
॥ आरती बाल कृष्ण की कीजै...॥
श्री राधावर कृष्ण कन्हैया,
ब्रज जन को नवनीत खवैया।
देखत ही मन लेत चुरैया,
यह छवि नैनन में भरि लीजै ॥
॥ आरती बाल कृष्ण की कीजै...॥
तोतली बोलन मधुर सुहावै,
सखिन संग खेलत सुख पावै।
सोई सुक्ति जो इनको ध्यावे,
अब इनको अपना करि लीजै ॥
॥ आरती बाल कृष्ण की कीजै...॥
आरती बाल कृष्ण की कीजै,
अपना जन्म सफल कर लीजै ॥
✍️ पंडित गयाप्रसाद जी महाराज

Aarti Bal Krishna Ki Keejai

Aarti Bal Krishna ki keeje,
Apna janm safal kar leeje.
Shri Yashoda ka param dulaara,
Baba ke ankhiyan ka taara.
Gopiyan ke praanan se pyaara,
In par praan nyochhavar keeje.
Aarti Bal Krishna ki keeje…
Baldaau ke chhote bhaiya,
Kanua kahi kahi bole Maiya.
Param mudit man let balaiya,
Apna sarvas inko deeje.
Aarti Bal Krishna ki keeje…
Shri Radhavar Krishna Kanhaaiya,
Braj jan ko navneet khavaiya.
Dekhat hi man let churaiya,
Yeh chhavi nainan mein bhari leeje.
Aarti Bal Krishna ki keeje…
Totli bolan madhur suhaavai,
Sakhan sang khelat sukh paavai.
Soi sukti jo inko dhyaavai,
Ab inko apna kari leeje.
Aarti Bal Krishna ki keeje…
Aarti Bal Krishna ki keeje,
Apna janm safal kar leeje.
✍️ Pandit Gayaprasad Ji Maharaj`;

    const doc = new Devotional({
      title,
      description: 'Aarti Bal Krishna Ki Keejai',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Krishna',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Bal Krishna Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Bal Krishna Aarti:', err);
    process.exit(1);
  }
}

addBalKrishnaAarti();
