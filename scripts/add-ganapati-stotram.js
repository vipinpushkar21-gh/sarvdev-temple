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
  title: 'श्री गणपति स्तोत्रम् (Shri Ganapati Stotram)',
  deity: 'Ganesh',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Ganapati Stotram is a grand 19-verse hymn glorifying Lord Ganesha (Naganana / Ekadanta / Heramba) in all his magnificence. The stotram opens by recounting how Ganesha was meditated upon by Shiva to destroy Tripura, by Vishnu to bind Bali, by Brahma to create the universe, by Shesha to bear the earth, by Parvati to slay Mahishasura, by the Siddhas for spiritual attainment, and by Kamadeva for universal conquest. It describes Ganesha as the destroyer of all obstacles — comparing him to the sun dispelling darkness, fire consuming the forest of obstacles, Garuda over the serpents of obstacles, a lion among the elephants of obstacles, a thunderbolt splitting the mountain of obstacles, a submarine fire in the ocean of obstacles, and a mighty wind scattering the clouds of obstacles. The hymn includes beautiful physical descriptions of the stout, elephant-faced, pot-bellied Lord, and profound philosophical verses declaring him as the non-dual Brahman accessible through niralamba samadhi. It concludes with prayers for the removal of all fears and obstacles.',
  lyrics: `॥ श्री गणपति स्तोत्रम् ॥

जेतुं यस्त्रिपुरं हरेण हरिणा व्याजाद्बलिं बध्नता
स्रष्टुं वारिभवोद्भवेन भुवनं शेषेण धर्तुं धराम्।
पार्वत्या महिषासुरप्रमथने सिद्धाधिपैः सिद्धये
ध्यातः पञ्चशरेण विश्वजितये पायात्स नागाननः॥1॥

विघ्नध्वान्तनिवारणैकतरणि-र्विघ्नाटवीहव्यवाड्
विघ्नव्यालकुलाभिमानगरुडो विघ्नेभपञ्चाननः।
विघ्नोत्तुङ्गगिरिप्रभेदन-पवि-र्विघ्नाम्बुधेर्वाडवो
विघ्नाघौघघनप्रचण्डपवनो विघ्नेश्वरः पातु नः॥2॥

खर्वं स्थूलतनुं गजेन्द्रवदनं लम्बोदरं सुन्दरं
प्रस्यन्दन्मदगन्धलुब्धम-धुपव्यालोलगण्डस्थलम्।
दन्ताघातविदारितारिरुधिरैः सिन्दूरशोभाकरं
वन्दे शैलसुतासुतं गणपतिं सिद्धिप्रदं कामदम्॥3॥

गजाननाय महसे प्रत्यूहतिमिरच्छिदे।
अपारकरुणा-पूर-तरङ्गितदृशे नमः॥4॥

अगजाननपद्मार्कं गजाननमहर्निशम्।
अनेकदन्तं भक्तानामेक-दन्तमुपास्महे॥5॥

श्वेताङ्गं श्वेतवस्त्रं सितकु-सुमगणैः पूजितं श्वेतगन्धैः
क्षीराब्धौ रत्नदीपैः सुरनर-तिलकं रत्नसिंहासनस्थम्।
दोर्भिः पाशाङ्कुशाब्जा-भयवरमनसं चन्द्रमौलिं त्रिनेत्रं
ध्यायेच्छान्त्यर्थमीशं गणपति-ममलं श्रीसमेतं प्रसन्नम्॥6॥

आवाहये तं गणराजदेवं रक्तोत्पलाभासमशेषवन्द्यम्।
विघ्नान्तकं विघ्नहरं गणेशं भजामि रौद्रं सहितं च सिद्ध्या॥7॥

यं ब्रह्म वेदान्तविदो वदन्ति परं प्रधानं पुरुषं तथान्ये।
विश्वोद्गतेः कारणमीश्वरं वा तस्मै नमो विघ्नविनाशनाय॥8॥

विघ्नेश वीर्याणि विचित्रकाणि वन्दीजनैर्मागधकैः स्मृतानि।
श्रुत्वा समुत्तिष्ठ गजानन त्वं ब्राह्मे जगन्मङ्गलकं कुरुष्व॥9॥

गणेश हेरम्ब गजाननेति महोदर स्वानुभवप्रकाशिन्।
वरिष्ठ सिद्धिप्रिय बुद्धिनाथ वदन्त एवं त्यजत प्रभीतीः॥10॥

अनेकविघ्नान्तक वक्रतुण्ड स्वसंज्ञवासिंश्च चतुर्भुजेति।
कवीश देवान्तकनाशकारिन् वदन्त एवं त्यजत प्रभीतीः॥11॥

अनन्तचिद्रूपमयं गणेशं ह्यभेदभेदादिविहीनमाद्यम्।
हृदि प्रकाशस्य धरं स्वधीस्थं तमेकदन्तं शरणम् व्रजामः॥12॥

विश्वादिभूतं हृदि योगिनां वै प्रत्यक्षरूपेण विभान्तमेकम्।
सदा निरालम्बसमाधिगम्यं तमेकदन्तं शरणम् व्रजामः॥13॥

यदीयवीर्येण समर्थभूता मायातया संरचितं च विश्वम्।
नागात्मकं ह्यात्मतया प्रतीतं तमेकदन्तं शरणम् व्रजामः॥14॥

सर्वान्तरे संस्थितमेकमूढं यदाज्ञया सर्वमिदं विभाति।
अनन्तरूपं हृदि बोधकं वै तमेकदन्तं शरणम् व्रजामः॥15॥

यं योगिनो योगबलेन साध्यं कुर्वन्ति तं कः स्तवनेन नौति।
अतः प्रणामेन सुसिद्धिदोऽस्तु तमेकदन्तं शरणम् व्रजामः॥16॥

देवेन्द्रमौलिमन्दार-मकरन्दकणारुणाः।
विघ्नान् हरन्तु हेरम्ब-चरणाम्बुजरेणवः॥17॥

एकदन्तं महाकायं लम्बोदरगजाननम्।
विघ्ननाशकरं देवं हेरम्बं प्रणमाम्यहम्॥18॥

यदक्षरं पदं भ्रष्टं मात्राहीनं च यद्भवेत्।
तत्सर्वं क्षम्यतां देव प्रसीद परमेश्वर॥19॥

॥ इति श्रीगणपतिस्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Ganapati Stotram ॥

Jetum yastripuram harena harina vyajadbalism badhnata
Srashtum varibhavodbhavena bhuvanam sheshena dhartum dharaam.
Parvatya mahishasurapramathane siddhadhipaih siddhaye
Dhyatah panchsharena vishvajitaye payatsa nagananah॥1॥

Vighnadhvantanivaranaaikatarani-rvighnatavihavyavad
Vighnavyalakulabhimangarudo vighnebhapanchannanah.
Vighnottungagiripprabhedana-pavi-rvighnambudhervaadavo
Vighnaughaughaganaprachandapavano vighneshvarah patu nah॥2॥

Kharvam sthulatanum gajendravadanam lambodaram sundaram
Prasyandanmadagandhalubdham-adhupavyalolagandhasthalam.
Dantaghatavidaritarirudhiraih sindurashobhakaram
Vande shailasutasutam ganapatim siddhipradam kamadam॥3॥

Gajananaya mahase pratyuhatimirachchhide.
Aparakaruna-pura-tarangitadrishe namah॥4॥

Agajananpadmarkam gajananamaharnisham.
Anekadantam bhaktanaameka-dantamupaasmahe॥5॥

Shvetangam shvetavastram sitaku-sumaganaih pujitam shvetagandhaih
Kshirabdhau ratnadipaih suranara-tilakam ratnasinhasanastham.
Dorbhih pashankushabja-bhayavaramansam chandramaulim trinetram
Dhyayechchhantyarthmisham ganapati-mamalam shrissametam prasannam॥6॥

Avahaye tam ganarajadevam raktotpalabhasamasheshavandyam.
Vighnantakam vighnaharam ganesham bhajami raudram sahitam cha siddhya॥7॥

Yam brahma vedantavido vadanti param pradhanam purusham tathannye.
Vishvodgateh karanasmishvaram va tasmai namo vighnavinashanaya॥8॥

Vighnesha viryani vichitrakani vandijanarmagadhakaih smritani.
Shrutva samuttishtha gajanana tvam brahme jaganmangalakam kurushva॥9॥

Ganesha heramba gajananeti mahodara svanubhavaprakashin.
Varishtha siddhipriya buddhinatha vadanta evam tyajata prabhitih॥10॥

Anekvighnantaka vakratunda svasamjnavasimshcha chaturbhujeti.
Kavisha devantakanashakarin vadanta evam tyajata prabhitih॥11॥

Anantachidrupmayam ganesham hyabhedabhedaadivihinamadyam.
Hridi prakashasya dharam svadhhistham tamekadantam sharanam vrajamah॥12॥

Vishvadibhutam hridi yoginam vai pratyaksharupena vibhantamekam.
Sada niralambasamadhigamyam tamekadantam sharanam vrajamah॥13॥

Yadiyaviryena samarthabhuta mayataya samrachitam cha vishvam.
Nagatmakam hyatmataya pratitam tamekadantam sharanam vrajamah॥14॥

Sarvantare samsthitamekamudham yadajnaya sarvamidam vibhati.
Anantarupam hridi bodhakam vai tamekadantam sharanam vrajamah॥15॥

Yam yogino yogabalena sadhyam kurvanti tam kah stavanena nauti.
Atah pranamena susiddhidostu tamekadantam sharanam vrajamah॥16॥

Devendramaulimandara-makarandakaanarunaah.
Vighnan harantu heramba-charanaambujarennavah॥17॥

Ekadantam mahakayam lambodaraghajananam.
Vighnanashakaram devam herambam pranaamamyaham॥18॥

Yadaksharam padam bhrashtam matraheenam cha yadbhavet.
Tatsarvam kshamyatam deva prasida parameshvara॥19॥

॥ Iti Shri Ganapati Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shri Ganapati Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Shri Ganapati Stotram added successfully!');
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
