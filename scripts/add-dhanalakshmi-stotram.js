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

const dhanalakshmiStotram = {
  title: 'धनदालक्ष्मी स्तोत्रम् (Dhanada Lakshmi Stotram)',
  deity: 'Lakshmi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Dhanada Lakshmi Stotram is a powerful hymn from a dialogue between Lord Shiva and Goddess Parvati, where Shiva reveals the secret prayer to invoke Dhanada Lakshmi — the wealth-bestowing form of Goddess Lakshmi. Reciting this stotram with devotion is said to swiftly remove poverty (daridrata) and bestow abundant wealth, prosperity and all material comforts upon the devotee.',
  lyrics: `॥ धनदालक्ष्मी स्तोत्रम् ॥

॥ धनदा उवाच ॥

देवी देवमुपागम्य नीलकण्ठं मम प्रियम्।
कृपया पार्वती प्राह शङ्करं करुणाकरम्॥1॥

॥ देव्युवाच ॥

ब्रूहि वल्लभ साधूनां दरिद्राणां कुटुम्बिनाम्।
दरिद्र दलनोपायमञ्जसैव धनप्रदम्॥2॥

॥ शिव उवाच ॥

पूजयन् पार्वतीवाक्यमिदमाह महेश्वरः।
उचितं जगदम्बासि तव भूतानुकम्पया॥3॥

ससीतं सानुजं रामं साञ्जनेयं सहानुगम्।
प्रणम्य परमानन्दं वक्ष्येऽहं स्तोत्रमुत्तमम्॥4॥

धनदं श्रद्धानानां सद्यः सुलभकारकम्।
योगक्षेमकरं सत्यं सत्यमेव वचो मम॥5॥

पठन्तः पाठयन्तोऽपि ब्रह्मणैरास्तिकोत्तमैः।
धनलाभो भवेदाशु नाशमेति दरिद्रता॥6॥

भूभवांशभवां भूत्यै भक्तिकल्पलतां शुभाम्।
प्रार्थयत्तां यथाकामं कामधेनुस्वरूपिणीम्॥7॥

धनदे धनदे देवि दानशीले दयाकरे।
त्वं प्रसीद महेशानि! यदर्थं प्रार्थयाम्यहम्॥8॥

धराऽमरप्रिये पुण्ये धन्ये धनदपूजिते।
सुधनं धार्मिके देहि यजमानाय सत्वरम्॥9॥

रम्ये रुद्रप्रिये रूपे रामरूपे रतिप्रिये।
शिखीसखमनोमूर्त्ते प्रसीद प्रणते मयि॥10॥

आरक्त-चरणाम्भोजे सिद्धि-सर्वार्थदायिके।
दिव्याम्बरधरे दिव्ये दिव्यमाल्यानुशोभिते॥11॥

समस्तगुणसम्पन्ने सर्वलक्षणलक्षिते।
शरच्चन्द्रमुखे नीले नील नीरज लोचने॥12॥

चञ्चरीक चमू चारु श्रीहार कुटिलालके।
मत्ते भगवती मातः कलकण्ठरवामृते॥13॥

हासाऽवलोकनैर्दिव्यैर्भक्तचिन्तापहारिके।
रूप लावण्य तारूण्य कारूण्य गुणभाजने॥14॥

क्वणत्कङ्कणमञ्जीरे लसल्लीलाकराम्बुजे।
रुद्रप्रकाशिते तत्त्वे धर्माधरे धरालये॥15॥

प्रयच्छ यजमानाय धनं धर्मेकसाधनम्।
मातस्त्वं मेऽविलम्बेन दिशस्व जगदम्बिके॥16॥

कृपया करुरागारे प्रार्थितं कुरु मे शुभे।
वसुधे वसुधारूपे वसु वासव वन्दिते॥17॥

धनदे यजमानाय वरदे वरदा भव।
ब्रह्मण्यैर्ब्राह्मणैः पूज्ये पार्वतीशिवशङ्करे॥18॥

स्तोत्रं दरिद्रताव्याधिशमनं सुधनप्रदम्।
श्रीकरे शङ्करे श्रीदे प्रसीद मयिकिङ्करे॥19॥

पार्वतीशप्रसादेन सुरेश किङ्करेरितम्।
श्रद्धया ये पठिष्यन्ति पाठयिष्यन्ति भक्तितः॥20॥

सहस्रमयुतं लक्षं धनलाभो भवेद् ध्रुवम्।

धनदाय नमस्तुभ्यं निधिपद्माधिपाय च।
भवन्तु त्वत्प्रसादान्मे धन-धान्यादिसम्पदः॥21॥

॥ इति श्री धनलक्ष्मी स्तोत्रं सम्पूर्णम् ॥

---

॥ Dhanada Lakshmi Stotram ॥

॥ Dhanada Uvacha ॥

Devi Devamupagamya Neelakantham Mama Priyam.
Kripaya Parvati Praha Shankaram Karunakaram. ||1||

॥ Devyuvacha ॥

Bruhi Vallabha Sadhunam Daridranam Kutumbinam.
Daridra Dalanopaayamanjasaiva Dhanaapradam. ||2||

॥ Shiva Uvacha ॥

Poojayan Parvateevakyamidamaha Maheshwarah.
Uchitam Jagadambaasi Tava Bhootanukampaya. ||3||

Saseetam Saanujam Ramam Saanjaneyam Sahaanugam.
Pranamya Paramaanandam Vakshyeham Stotramuttamam. ||4||

Dhanadam Shraddhaanaanaam Sadyah Sulabhakaarakam.
Yogakshemakaram Satyam Satyameva Vacho Mama. ||5||

Pathantah Paathayantopi Brahmanairastikottamaih.
Dhanalabho Bhavedaashu Naashameti Daridrata. ||6||

Bhoobhavaamshabhavaam Bhootyai Bhaktikalpalaataam Shubhaam.
Prarthayattaam Yathaakaamam Kaamadhenuaswaroopineem. ||7||

Dhanade Dhanade Devi Daanasheele Dayaakare.
Tvam Praseeda Maheshaani! Yadartham Prarthayaamyaham. ||8||

Dharaamarapriye Punye Dhanye Dhanadapoojite.
Sudhanam Dharmike Dehi Yajamanaaya Satvaram. ||9||

Ramye Rudrapriye Roope Raamaroope Ratipriye.
Shikheesakhanomooorte Praseeda Pranate Mayi. ||10||

Aarakta-Charanaamabhoje Siddhi-Sarvaarthadaayike.
Divyaambaradhare Divye Divyamaalyaanushobhite. ||11||

Samastagunaasampanne Sarvalakshanaalakshite.
Sharachchandramukhe Neele Neela Neeraja Lochane. ||12||

Chanchareeka Chamoo Chaaru Shreehaara Kutilaalake.
Matte Bhagavati Maatah Kalakantharavaaamrite. ||13||

Haasaavalokanairdivyairbhaktachintaapaahaarike.
Roopa Laavanya Taaroonya Kaaroonya Gunabhaajane. ||14||

Kvanatkankanamanjeere Lasalleelaakaraamabuje.
Rudraprakaashite Tattve Dharmaadhare Dharaalaye. ||15||

Prayachchha Yajamanaaya Dhanam Dharmekasaadhanam.
Maatastvam Mevilambena Dishasva Jagadambike. ||16||

Kripaya Karunaagarae Praarthitam Kuru Me Shubhe.
Vasudhe Vasudharoope Vasu Vaasava Vandite. ||17||

Dhanade Yajamanaaya Varade Varadaa Bhava.
Brahmanyairbrahmanaaih Poojye Parvatee Shiva Shankare. ||18||

Stotram Daridratavyadhishamanam Sudhanapradam.
Shreekare Shankare Shreede Praseeda Mayikinkare. ||19||

Parvateesha Prasaadena Suresha Kinkareriitam.
Shraddhaya Ye Pathishyanti Paathayishyanti Bhaktitah. ||20||

Sahasramayutam Laksham Dhanalabho Bhaved Dhruvam.

Dhanadaaya Namastubhyam Nidhipadmaadhipaaya Cha.
Bhavantu Tvatprasaadaanme Dhana-Dhaanyaadisaampadah. ||21||

॥ Iti Shri Dhanalakshmi Stotram Sampoornam ॥`
};

async function addDhanalakshmiStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: dhanalakshmiStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('Dhanada Lakshmi Stotram already exists, updating...');
      await Devotional.updateOne({ _id: existing._id }, { $set: dhanalakshmiStotram });
      console.log('Updated successfully!');
    } else {
      const doc = new Devotional(dhanalakshmiStotram);
      await doc.save();
      console.log('Dhanada Lakshmi Stotram added successfully!');
    }

    const totalStotras = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`Total Stotras in database: ${totalStotras}`);

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDhanalakshmiStotram();
