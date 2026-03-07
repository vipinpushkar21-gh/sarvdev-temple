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

const shanaishcharaStotram = {
  title: 'शनैश्चर स्तोत्रम् (Shanaishchara Stotram)',
  deity: 'Shani',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shanaishchara Stotram is a powerful hymn from the Brahmanda Purana, recited by King Dasharatha in praise of Lord Shani (Saturn). This sacred stotram contains the Shani Ashtakam (8 main verses) along with 10 divine names of Shani Dev. It is believed that regular chanting of this stotra removes the afflictions caused by Shani\'s unfavourable transit (Sade Sati, Dhaiyya, etc.), bestows happiness, prosperity, and ultimately leads to liberation. Saturday is considered the most auspicious day to recite this stotra.',
  lyrics: `॥ शनैश्चरस्तोत्रम् ॥

॥ विनियोग ॥

श्रीगणेशाय नमः॥

अस्य श्रीशनैश्चरस्तोत्रस्य। दशरथ ऋषिः॥
शनैश्चरो देवता। त्रिष्टुप् छन्दः॥
शनैश्चरप्रीत्यर्थ जपे विनियोगः॥

॥ दशरथ उवाच ॥

कोणोऽन्तको रौद्रयमोऽथ बभ्रुः कृष्णः शनिः पिङ्गलमन्दसौरिः।
नित्यं स्मृतो यो हरते च पीडां तस्मै नमः श्रीरविनन्दनाय॥1॥

सुरासुराः किंपुरुषोरगेन्द्रा गन्धर्वविद्याधरपन्नगाश्च।
पीड्यन्ति सर्वे विषमस्थितेन तस्मै नमः श्रीरविनन्दनाय॥2॥

नरा नरेन्द्राः पशवो मृगेन्द्रा वन्याश्च ये कीटपतङ्गभृङ्गाः।
पीड्यन्ति सर्वे विषमस्थितेन तस्मै नमः श्रीरविनन्दनाय॥3॥

देशाश्च दुर्गाणि वनानि यत्र सेनानिवेशाः पुरपत्तनानि।
पीड्यन्ति सर्वे विषमस्थितेन तस्मै नमः श्रीरविनन्दनाय॥4॥

तिलैर्यवैर्माषगुडान्नदानैर्लोहेन नीलाम्बरदानतो वा।
प्रीणाति मन्त्रैर्निजवासरे च तस्मै नमः श्रीरविनन्दनाय॥5॥

प्रयागकूले यमुनातटे च सरस्वतीपुण्यजले गुहायाम्।
यो योगिनां ध्यानगतोऽपि सूक्ष्मस्तस्मै नमः श्रीरविनन्दनाय॥6॥

अन्यप्रदेशात्स्वगृहं प्रविष्टस्तदीयवारे स नरः सुखी स्यात्।
गृहाद् गतो यो न पुनः प्रयाति तस्मै नमः श्रीरविनन्दनाय॥7॥

स्रष्टा स्वयंभूर्भुवनत्रयस्य त्राता हरीशो हरते पिनाकी।
एकस्त्रिधा ऋग्यजुःसाममूर्तिस्तस्मै नमः श्रीरविनन्दनाय॥8॥

शन्यष्टकं यः प्रयतः प्रभाते नित्यं सुपुत्रैः पशुबान्धवैश्च।
पठेत्तु सौख्यं भुवि भोगयुक्तः प्राप्नोति निर्वाणपदं तदन्ते॥9॥

कोणस्थः पिङ्गलो बभ्रुः कृष्णो रौद्रोऽन्तको यमः।
सौरिः शनैश्चरो मन्दः पिप्पलादेन संस्तुतः॥10॥

एतानि दश नामानि प्रातरुत्थाय यः पठेत्।
शनैश्चरकृता पीडा न कदाचिद्भविष्यति॥11॥

॥ इति श्रीब्रह्माण्डपुराणे श्रीशनैश्चरस्तोत्रं सम्पूर्णम् ॥

---

॥ Shanaishchara Stotram ॥

॥ Viniyoga ॥

Shri Ganeshaya Namah.

Asya Shri Shanaishchara Stotrasya. Dasharatha Rishah.
Shanaishcharo Devata. Trishtup Chhandah.
Shanaishchara Prityartha Jape Viniyogah.

॥ Dasharatha Uvacha ॥

Kono'ntako Raudrayamo'tha Babhruh Krishnah Shanih Pingalamanda-Saurih.
Nityam Smrito Yo Harate Cha Pidam Tasmai Namah Shri Ravinandanaya. ||1||

Surasurah Kimpurushoragendra Gandharva-Vidyadhara-Pannagashcha.
Pidyanti Sarve Vishamasthitena Tasmai Namah Shri Ravinandanaya. ||2||

Nara Narendrah Pashavo Mrigendra Vanyashcha Ye Kita-Patanga-Bhringah.
Pidyanti Sarve Vishamasthitena Tasmai Namah Shri Ravinandanaya. ||3||

Deshashcha Durgani Vanani Yatra Senaniveshah Pura-Pattanani.
Pidyanti Sarve Vishamasthitena Tasmai Namah Shri Ravinandanaya. ||4||

Tilairyavairmashagun-Dannadanair-Lohena Nilambaradanato Va.
Prinati Mantrairnija-Vasare Cha Tasmai Namah Shri Ravinandanaya. ||5||

Prayagakule Yamunatate Cha Saraswati-Punyajale Guhayam.
Yo Yoginam Dhyanagato'pi Sukshmas-Tasmai Namah Shri Ravinandanaya. ||6||

Anyapradeshat-Svagraham Pravishtas-Tadiya-Vare Sa Narah Sukhi Syat.
Grihad Gato Yo Na Punah Prayati Tasmai Namah Shri Ravinandanaya. ||7||

Srashta Svayambhur-Bhuvanatrayasya Trata Harisho Harate Pinaki.
Ekastridha Rig-Yajuh-Sama-Murtis-Tasmai Namah Shri Ravinandanaya. ||8||

Shanyashtakam Yah Prayatah Prabhate Nityam Suputraih Pashu-Bandhavaishcha.
Pathettu Saukhyam Bhuvi Bhogayuktah Prapnoti Nirvaanapadam Tadante. ||9||

Konasthah Pingalo Babhruh Krishno Raudro'ntako Yamah.
Saurih Shanaishcharo Mandah Pippaladena Samstutah. ||10||

Etani Dasha Namani Pratarutthaya Yah Pathet.
Shanaishcharakrita Pida Na Kadachid-Bhavishyati. ||11||

॥ Iti Shri Brahmanda Purane Shri Shanaishchara Stotram Sampurnam ॥`
};

async function addShanaishcharaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: shanaishcharaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shanaishchara Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(shanaishcharaStotram);
      await doc.save();
      console.log('✓  Added: ' + shanaishcharaStotram.title);
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

addShanaishcharaStotram();
