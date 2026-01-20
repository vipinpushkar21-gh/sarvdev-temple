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

async function addGauriNandanAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'जय हो जय जय है गौरी नंदन – आरती (Jai Ho Jai Jai Hai Gauri Nandan – Aarti)';
    const existing = await Devotional.findOne({ title, deity: 'Ganesha', category: 'Aarti' });
    if (existing) {
      console.log('Aarti already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `जय हो जय जय है गौरी नंदन \n\nजय हो जय जय है गौरी नंदन,\nदेवा गणेशा गजानन।\nचरणों को तेरे हम पखारते,\nहो देवा आरती तेरी हम उतारते॥\nशुभ कार्यो में सबसे पहले,\nतेरा पूजन करते।\nविघ्न हटाते, काज बनाते,\nसभी अमंगल हरते॥\nओ देवा सिद्धि और बुद्धि बाटे,\nचुनते राहों के काटे।\nखुशियों के रंग को बिखारते,\nहो देवा आरती तेरी हम उतारते॥\nजय हो जय जय है गौरी नंदन…\nओमकार है रूप तिहारा,\nअलौकिक है माया।\nलम्बकर्ण तेरे उज्ज्वल नैना,\nधूम्रवर्ण है काया॥\nओ देवा शम्भू के लाल दुलारे,\nसंतों के नैनन तारे।\nमस्तक पे चन्द्रमा को वारते,\nहो देवा आरती तेरी हम उतारते॥\nजय हो जय जय है गौरी नंदन…\nगणपति बाप्पा घर में आना,\nसुख वैभव कर जाना।\nएकदन्त लम्बोदर स्वामी,\nसारे कष्ट मिटाना॥\nदेवा लड्डूअन का भोग लगाते,\nमूषक वाहन पे आते।\nभक्तों की बिगड़ी संवारते,\nहो देवा आरती तेरी हम उतारते॥\nजय हो जय जय है गौरी नंदन…\nधन कुबेर चरणों के चाकर,\nलक्ष्मी संग विराजे।\nदसों दिशा नवखण्ड में देवा,\nडंका तेरा बाजे॥\nदेवा तुझमें ध्यान लगाये,\nमन चाहा फल वो पाये।\nनैया भंवर से उबारते,\nहो देवा आरती तेरी हम उतारते॥\nजय हो जय जय है गौरी नंदन…\nबांझों की गोदे भर देना,\nनिर्धन को धन देना।\nदीनों को सम्मान दिलाना,\nनिर्बल को बल देना॥\nओ देवा सुन लो अरदास हमारी,\nविनती करते नर-नारी।\nसेवा में तन-मन वारते,\nहो देवा आरती तेरी हम उतारते॥\nजय हो जय जय है गौरी नंदन…\n\nJai Ho Jai Jai Hai Gauri Nandan – Aarti\n\nJai ho Jai Jai hai Gauri Nandan,\nDeva Ganesha Gajanan.\nCharanon ko tere hum pakhaarte,\nHo Deva aarti teri hum utaarte.\nShubh kaaryo mein sabse pehle,\nTera poojan karte.\nVighn hataate, kaaj banaate,\nSabhi amangal harte.\nO Deva Siddhi aur Buddhi baate,\nChunte raahon ke kaate.\nKhushiyon ke rang ko bikhaarte,\nHo Deva aarti teri hum utaarte.\nJai ho Jai Jai hai Gauri Nandan…\nOmkaar hai roop tihara,\nAlaukik hai maaya.\nLamb karan tere ujjwal naina,\nDhoomravarn hai kaaya.\nO Deva Shambhu ke laal dulaare,\nSanton ke nainan taare.\nMastak pe Chandrama ko vaarte,\nHo Deva aarti teri hum utaarte.\nJai ho Jai Jai hai Gauri Nandan…\nGanpati Bappa ghar mein aana,\nSukh vaibhav kar jaana.\nEk-dant Lambodar Swami,\nSaare kasht mitaana.\nDeva laddooan ka bhog lagaate,\nMooshak vahan pe aate.\nBhakton ki bigdi sanwaarte,\nHo Deva aarti teri hum utaarte.\nJai ho Jai Jai hai Gauri Nandan…\nDhan Kuber charanon ke chaakar,\nLakshmi sang viraaje.\nDaso disha navkhand mein Deva,\nDanka tera baaje.\nDeva tujh mein dhyaan lagaaye,\nMan chaha phal vo paaye.\nNaiya bhanwar se ubaarte,\nHo Deva aarti teri hum utaarte.\nJai ho Jai Jai hai Gauri Nandan…\nBaanjhon ki gode bhar dena,\nNirdhan ko dhan dena.\nDeenon ko sammaan dilaana,\nNirbal ko bal dena.\nO Deva sun lo ardaas humaari,\nVinti karte nar-naari.\nSeva mein tan-man vaarthe,\nHo Deva aarti teri hum utaarte.\nJai ho Jai Jai hai Gauri Nandan…`;

    const doc = new Devotional({
      title,
      description: 'Jai Ho Jai Jai Hai Gauri Nandan – Aarti',
      category: 'Aarti',
      language: 'Hindi',
      deity: 'Ganesha',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Gauri Nandan Ganesha Aarti with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Gauri Nandan Ganesha Aarti:', err);
    process.exit(1);
  }
}

addGauriNandanAarti();
