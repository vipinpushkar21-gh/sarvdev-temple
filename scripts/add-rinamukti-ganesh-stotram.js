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
  title: 'ऋणमुक्ति श्री गणेश स्तोत्रम् (Rinamukti Shri Ganesh Stotram)',
  deity: 'Ganesh',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Rinamukti Shri Ganesh Stotram is a powerful 10-verse hymn from the Rudra Yamala Tantra, composed by Shukracharya (the preceptor of the Asuras). This stotram is dedicated to Lord Maha Ganapati in his debt-liberating form (Rina Vimochana Maha Ganapati). Each verse invokes Ganesha in a different colour and form — white (shukla), red (rakta), black (krishna), yellow (pita), and universal (sarva) — offering salutations for freedom from debts. The stotra promises that one who recites it at the three sandhyas (dawn, noon, dusk) daily will be freed from all debts within six months, and performing 10,000 repetitions bestows wealth and financial freedom.',
  lyrics: `॥ ऋणमुक्ति श्री गणेश स्तोत्रम् ॥

॥ विनियोग ॥

ॐ अस्य श्रीऋणविमोचनमहागणपति-स्तोत्रमन्त्रस्य
शुक्राचार्य ऋषिः ऋणविमोचनमहागणपतिर्देवता
अनुष्टुप् छन्दः ऋणविमोचनमहागणपतिप्रीत्यर्थे जपे विनियोगः।

॥ स्तोत्र पाठ ॥

ॐ स्मरामि देवदेवेशं वक्रतुण्डं महाबलम्।
षडक्षरं कृपासिन्धुं नमामि ऋणमुक्तये॥1॥

महागणपतिं वन्दे महासेतुं महाबलम्।
एकमेवाद्वितीयं तु नमामि ऋणमुक्तये॥2॥

एकाक्षरं त्वेकदन्तमेकं ब्रह्म सनातनम्।
महाविघ्नहरं देवं नमामि ऋणमुक्तये॥3॥

शुक्लाम्बरं शुक्लवर्णं शुक्लगन्धानुलेपनम्।
सर्वशुक्लमयं देवं नमामि ऋणमुक्तये॥4॥

रक्ताम्बरं रक्तवर्णं रक्तगन्धानुलेपनम्।
रक्तपुष्पैः पूज्यमानं नमामि ऋणमुक्तये॥5॥

कृष्णाम्बरं कृष्णवर्णं कृष्णगन्धानुलेपनम्।
कृष्णयज्ञोपवीतं च नमामि ऋणमुक्तये॥6॥

पीताम्बरं पीतवर्णं पीतगन्धानुलेपनम्।
पीतपुष्पैः पूज्यमानं नमामि ऋणमुक्तये॥7॥

सर्वात्मकं सर्ववर्णं सर्वगन्धानुलेपनम्।
सर्वपुष्पैः पूज्यमानं नमामि ऋणमुक्तये॥8॥

एतद् ऋणहरं स्तोत्रं त्रिसन्ध्यं यः पठेन्नरः।
षण्मासाभ्यन्तरे तस्य ऋणच्छेदो न संशयः॥9॥

सहस्रदशकं कृत्वा ऋणमुक्तो धनी भवेत्॥

॥ इति रुद्रयामले ऋणमुक्ति श्री गणेशस्तोत्रम् सम्पूर्णम् ॥

---

॥ Rinamukti Shri Ganesh Stotram ॥

॥ Viniyoga ॥

Om asya shri-rinavimochana-maha-ganapati-stotramantrasya
Shukracharya rishih Rinavimochana-maha-ganapatirdevata
Anushtup chhandah Rinavimochana-maha-ganapati-prityarthe jape viniyogah.

॥ Stotra Patha ॥

Om smarami devadeveshan vakratundam mahabalam.
Shadaksharam kripaasindhum namami rinamuktaye॥1॥

Maha-ganapatim vande mahasetum mahabalam.
Ekamevadvitiyam tu namami rinamuktaye॥2॥

Ekaksharam tvekadantamekam brahma sanatanam.
Mahavighnaharam devam namami rinamuktaye॥3॥

Shuklambaram shuklavarnam shuklagandhanulepanam.
Sarvashuklamayam devam namami rinamuktaye॥4॥

Raktambaram raktavarnam raktagandhanulepanam.
Raktapushpaih pujyamanam namami rinamuktaye॥5॥

Krishnambaram krishnavarnam krishnagandhanulepanam.
Krishnayajnopavitam cha namami rinamuktaye॥6॥

Pitambaram pitavarnam pitagandhanulepanam.
Pitapushpaih pujyamanam namami rinamuktaye॥7॥

Sarvatmakam sarvavarnam sarvagandhanulepanam.
Sarvapushpaih pujyamanam namami rinamuktaye॥8॥

Etad rinaharam stotram trisandhyam yah pathennarah.
Shanmasabhyantare tasya rinachcchedo na samshayah॥9॥

Sahasradashakam kritva rinamukto dhani bhavet॥

॥ Iti Rudrayamale Rinamukti Shri Ganesh Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Rinamukti Shri Ganesh Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Rinamukti Shri Ganesh Stotram added successfully!');
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
