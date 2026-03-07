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
  title: 'नाग स्तोत्रम् (Nag Stotram)',
  deity: 'Nag',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Nag Stotram is an ancient 11-verse hymn dedicated to the divine serpents (Nagas) revered in Hindu tradition. The stotram offers salutations to the great serpents dwelling in various lokas (realms) — Brahma Loka (led by Shesha Nag), Vishnu Loka (led by Vasuki), Rudra Loka (led by Takshaka), Swarga (those who escaped the Khandava forest fire), and Dharma Loka (dwelling near the Vaitarani river). It also pays homage to serpents protected by Sage Astika during the great Sarpa Satra (serpent sacrifice), those led by Karkotaka during Pralaya (cosmic dissolution), and serpents residing in mountains, forests, villages, on the earth\'s surface, in burrows, and in Rasatala (the netherworld) led by Ananta. Each verse concludes with the prayer "May they be pleased and gracious to me always," seeking blessings and protection from the Nag Devatas. This stotram is especially chanted on Nag Panchami and other occasions to invoke divine serpent blessings.',
  lyrics: `॥ नाग स्तोत्रम् ॥

ब्रह्म लोके च ये सर्पाः शेषनागाः पुरोगमाः।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥1॥

विष्णु लोके च ये सर्पाः वासुकि प्रमुखाश्चये।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥2॥

रुद्र लोके च ये सर्पाः तक्षकः प्रमुखास्तथा।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥3॥

खाण्डवस्य तथा दाहे स्वर्गन्च ये च समाश्रिताः।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥4॥

सर्प सत्रे च ये सर्पाः अस्थिकेनाभि रक्षिताः।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥5॥

प्रलये चैव ये सर्पाः कार्कोट प्रमुखाश्चये।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥6॥

धर्म लोके च ये सर्पाः वैतरण्यां समाश्रिताः।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥7॥

ये सर्पाः पर्वत येषु धारि सन्धिषु संस्थिताः।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥8॥

ग्रामे वा यदि वारण्ये ये सर्पाः प्रचरन्ति च।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥9॥

पृथिव्याम् चैव ये सर्पाः ये सर्पाः बिल संस्थिताः।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥10॥

रसातले च ये सर्पाः अनन्तादि महाबलाः।
नमोऽस्तु तेभ्यः सुप्रीताः प्रसन्नाः सन्तु मे सदा॥11॥

॥ इति नाग स्तोत्रम् संपूर्णं ॥

---

॥ Nag Stotram ॥

Brahma loke cha ye sarpaah Sheshanaagaah purogamaah.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥1॥

Vishnu loke cha ye sarpaah Vaasuki pramukhaashchaye.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥2॥

Rudra loke cha ye sarpaah Takshakaah pramukhaastathaa.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥3॥

Khaandavasya tathaa daahe swarganche ye cha samaashritaah.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥4॥

Sarpa satre cha ye sarpaah Asthikenaabhi rakshitaah.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥5॥

Pralaye chaiva ye sarpaah Kaarkota pramukhaashchaye.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥6॥

Dharma loke cha ye sarpaah Vaitaranyaam samaashritaah.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥7॥

Ye sarpaah parvata yeshu dhaari sandhishu samsthitaah.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥8॥

Graame vaa yadi vaarannye ye sarpaah pracharanti cha.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥9॥

Prithivyaam chaiva ye sarpaah ye sarpaah bila samsthitaah.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥10॥

Rasaatale cha ye sarpaah Anantaadi mahaabalaaah.
Namostu tebhyah supreetaah prasannaah santu me sadaa॥11॥

॥ Iti Nag Stotram Sampoornam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Nag Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Nag Stotram added successfully!');
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
