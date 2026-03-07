const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String, default: 'Stotra' },
  language:    { type: String, default: 'Sanskrit' },
  deity:       { type: String },
  lyrics:      { type: String },
  audio:       { type: String },
  status:      { type: String, default: 'approved' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const annapurnaStotram = {
  title: 'अन्नपूर्णा स्तोत्रम् (Annapurna Stotram)',
  deity: 'Annapurna',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Annapurna Stotram is a sublime hymn composed by Adi Shankaracharya in praise of Goddess Annapurna, the divine mother who nourishes all living beings. Worshipped especially in Kashi (Varanasi), She is the consort of Lord Shiva and the embodiment of infinite compassion and abundance. Each of the 12 verses concludes with the heartfelt prayer "Bhiksham Dehi Kripavalambanakari Mata Annapurneshwari" — O Mother Annapurneshwari, bestow upon us the alms of Your grace. This stotram is chanted for spiritual nourishment, food security, and divine blessings.',
  lyrics: `॥ अन्नपूर्णा स्तोत्रम् ॥

नित्यानन्दकरी वराभयकरी सौन्दर्यरत्नाकरी
निर्धूताखिलघोरपावनकरी प्रत्यक्षमाहेश्वरी।
प्रालेयाचलवंशपावनकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥1॥

नानारत्नविचित्रभूषणकरी हेमाम्बराडम्बरी
मुक्ताहारविलम्बमान-विलसद्वक्षोजकुम्भान्तरी।
काश्मीरागरुवासिताङ्गरुचिरे काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥2॥

योगानन्दकरी रिपुक्षयकरी धर्मार्थनिष्ठाकरी
चन्द्रार्कानलभासमानलहरी त्रैलोक्यरक्षाकरी।
सर्वैश्वर्यसमस्तवाञ्छितकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥3॥

कैलासाचलकन्दरालयकरी गौरी उमा शङ्करी
कौमारी निगमार्थगोचरकरी ओङ्कारबीजाक्षरी।
मोक्षद्वारकपाटपाटनकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥4॥

दृश्यादृश्यविभूतिवाहनकरी ब्रह्माण्डभाण्डोदरी
लीलानाटकसूत्रभेदनकरी विज्ञानदीपाङ्कुरी।
श्रीविश्वेशमनःप्रसादनकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥5॥

उर्वीसर्वजनेश्वरी भगवती मातान्नपूर्णेश्वरी
वेणीनीलसमानकुन्तलहरी नित्यान्नदानेश्वरी।
सर्वानन्दकरी सदा शुभकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥6॥

आदिक्षान्तसमस्तवर्णनकरी शम्भोस्त्रिभावाकरी
काश्मीरात्रिजलेश्वरी त्रिलहरी नित्याङ्करा शर्वरी।
कामाकाङ्क्षकरी जनोदयकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥7॥

देवी सर्वविचित्ररत्नरचिता दाक्षायणी सुन्दरी
वामं स्वादुपयोधरप्रियकरी सौभाग्यमाहेश्वरी।
भक्ताभीष्टकरी सदा शुभकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥8॥

चन्द्रार्कानलकोटिकोटिसदृशा चन्द्रांशुबिम्बाधरी
चन्द्रार्काग्निसमानकुन्तलधरी चन्द्रार्कवर्णेश्वरी।
मालापुस्तकपाशसाङ्कुशधरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥9॥

क्षेत्रत्राणकरी महाऽभयकरी माता कृपासागरी
साक्षान्मोक्षकरी सदा शिवकरी विश्वेश्वर श्रीधरी।
दक्षाक्रन्दकरी निरामयकरी काशीपुराधीश्वरी
भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी॥10॥

अन्नपूर्णे सदापूर्णे शङ्करप्राणवल्लभे।
ज्ञानवैराग्यसिद्ध्यर्थं भिक्षां देहि च पार्वति॥11॥

माता च पार्वती देवी पिता देवो महेश्वरः।
बान्धवाः शिवभक्ताश्च स्वदेशो भुवनत्रयम्॥12॥

॥ इति श्रीमच्छङ्कराचार्यविरचितं
श्रीअन्नपूर्णास्तोत्रं सम्पूर्णम् ॥

---

॥ Annapurna Stotram ॥

Nityaanandakari Varaabhayakari Saundaryaratnaakari
Nirdhootaakhilaghorapaavanakari Pratyakshamaaheshwari.
Praaleyaachalavanshapaavanakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥1॥

Naanaaratnavichitrabhooshanakari Hemaambaaraadambari
Muktaahaaravilambamaan-Vilasadvakshojakumbhantari.
Kaashmeeraagaru-vaasitaangaruchire Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥2॥

Yogaanandakari Ripukshayakari Dharmaarthanishthakari
Chandraarkaanalabhaasamaanalahri Trailokyarakshakari.
Sarvaishwaryasamastavanchhitakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥3॥

Kailaasaachalakandaraalayakari Gauri Uma Shankari
Kaumaari Nigamaartha-Gocharakari Onkaarabeejakshari.
Mokshadvaarakapaatapaatanakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥4॥

Drishyaadrishyavibhootivaahanakari Brahmaandabhaandodari
Leelaanaatakasuutrabheedanakari Vijnaanadeepankuri.
Shri Vishweshamanah-Prasaadanakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥5॥

Urveesarvajaneshwari Bhagavati Maataannapurneshwari
Venineelasamaanakuntalhari Nityaannadaaneshwari.
Sarvaanandakari Sadaa Shubhakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥6॥

Aadikshantasamastavarnanakari Shambhostrabhavakari
Kaashmeeraatrijaleshwari Trilahri Nityaankara Sharvari.
Kaamaakankshakari Janodayakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥7॥

Devi Sarvavichitaratnarachitaa Daakshaayani Sundari
Vaamam Svaadupayodharapriyakari Saubhaagyamaaheshwari.
Bhaktaabheeshutakari Sadaa Shubhakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥8॥

Chandraarkaanalakotikotisadrishaa Chandraanshubimbadhari
Chandraarkaagnisamaanakuntaldhari Chandraarkavarnaishwari.
Maalaapustaka-Paashasaankushadhari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥9॥

Kshetratraanakari Mahaa'bhayakari Maataa Kripaasaagari
Saakshaanmokshakari Sadaa Shivakari Vishveshvara Shreedhari.
Dakshaakrandakari Niraamayakari Kashipuraadhishwari
Bhiksham Dehi Kripaavalambanakari Maataannapurneshwari.॥10॥

Annapurne Sadaapurne Shankarapranavallabhe.
Jnaanavairagyasiddhyartham Bhiksham Dehi Cha Parvati.॥11॥

Maata Cha Parvati Devi Pitaa Devo Maheshwarah.
Baandhavaah Shivabhaktaashcha Svadesho Bhuvanatrayam.॥12॥

॥ Iti Shrimach-Shankaracharya-Virachitam
Shri Annapurna Stotram Sampoornam ॥`
};

async function addAnnapurnaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: annapurnaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Annapurna Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(annapurnaStotram);
      await doc.save();
      console.log('✓  Added: ' + annapurnaStotram.title);
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

addAnnapurnaStotram();
