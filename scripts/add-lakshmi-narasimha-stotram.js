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

const lakshmiNarasimhaStotram = {
  title: 'श्री लक्ष्मीनृसिंह स्तोत्रम् (Lakshmi Narasimha Stotram)',
  deity: 'Lakshmi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Lakshmi Narasimha Karavalamba Stotram is a powerful hymn composed by Adi Shankaracharya. It is a heartfelt prayer to Lord Lakshmi Narasimha, the half-man half-lion avatar of Lord Vishnu, seeking His divine hand of support (Karavalamba) to cross the ocean of worldly existence (samsara). Each verse describes the perils of samsara through vivid metaphors and concludes with the refrain "Lakshmi Narasimha mama dehi karavalambam" — O Lakshmi Narasimha, grant me the support of Your hand.',
  lyrics: `॥ श्री लक्ष्मीनृसिंह स्तोत्रम् ॥

श्रीमत्पयोनिधिनिकेतन चक्रपाणे
भोगीन्द्रभोगमणिरञ्जितपुण्यमूर्ते।
योगीश शाश्वत शरण्य भवाब्धिपोत
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥1॥

ब्रह्मेन्द्ररुद्रमरुदर्ककिरीटकोटि-
सङ्घट्टिताङ्घ्रिकमलामलकान्तिकान्त।
लक्ष्मीलसत्कुचसरोरुहराजहंस
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥2॥

संसारघोरगहने चरतो मुरारे
मारोग्रभीकरमृगप्रचुरार्दितस्य।
आर्तस्य मत्सरनिदाघनिपीडितस्य
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥3॥

संसारकूपमतिघोरमगाधमूलं
सम्प्राप्य दुःखशतसर्पसमाकुलस्य।
दीनस्य देव कृपणापदमागतस्य
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥4॥

संसारसागरविशालकरालकाल-
नक्रग्रहग्रसननिग्रहविग्रहस्य।
व्यग्रस्य रागनिचयोर्मिनिपीडितस्य
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥5॥

संसारवृक्षमघबीजमनन्तकर्म-
शाखाशतं करणपत्रमनङ्गपुष्पम्।
आरुह्य दुःखफलिनं पततो दयालो
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥6॥

संसारसर्पघनवक्त्रभयोग्रतीव्र-
दंष्ट्राकरालविषदग्धविनष्टमूर्तेः।
नागारिवाहन सुधाब्धिनिवास शौरे
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥7॥

संसारदावदहनातुरभीकरोरु-
ज्वालावलीभिरतिदग्धतनूरुहस्य।
त्वत्पादपद्मसरसीशरणागतस्य
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥8॥

संसारजालपतितस्य जगन्निवास
सर्वेन्द्रियार्तबडिशार्थझषोपमस्य।
प्रोत्खण्डितप्रचुरतालुकमस्तकस्य
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥9॥

संसारभीकरकरीन्द्रकराभिघात-
निष्पिष्टमर्मवपुषः सकलार्तिनाश।
प्राणप्रयाणभवभीतिसमाकुलस्य
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥10॥

अन्धस्य मे हृतविवेकमहाधनस्य
चोरैः प्रभो बलिभिरिन्द्रियनामधेयैः।
मोहान्धकूपकुहरे विनिपातितस्य
लक्ष्मीनृसिंह मम देहि करावलम्बम्॥11॥

लक्ष्मीपते कमलनाभ सुरेश विष्णो
वैकुण्ठ कृष्ण मधुसूदन पुष्कराक्ष।
ब्रह्मण्य केशव जनार्दन वासुदेव
देवेश देहि कृपणस्य करावलम्बम्॥12॥

यन्माययोर्जितवपुः प्रचुरप्रवाह-
मग्नार्थमत्र निवहोरुकरावलम्बम्।
लक्ष्मीनृसिंहचरणाब्जमधुव्रतेन
स्तोत्रं कृतं सुखकरं भुवि शङ्करेण॥13॥

॥ इति श्रीमच्छङ्कराचार्यकृतं श्रीलक्ष्मीनृसिंहस्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Lakshmi Narasimha Stotram ॥

Shrīmatpayonidhiniketana chakrapāṇe
Bhogīndrabhoganmaṇirañjitapuṇyamūrte.
Yogīsha shāshvata sharaṇya bhavābdhipota
Lakshmi Narasimha mama dehi karāvalambam.॥1॥

Brahmendrrudramarudarkkirīṭakoṭi-
Saṅghaṭṭitāṅghrikamalāmalakāntikānta.
Lakshmlastkuchasaroruharājahaṃsa
Lakshmi Narasimha mama dehi karāvalambam.॥2॥

Saṃsāraghoragahane charato murāre
Mārogra-bhīkara-mṛga-prachurārditasya.
Ārtasya matsaranidāghanipīḍitasya
Lakshmi Narasimha mama dehi karāvalambam.॥3॥

Saṃsārakūpamatighora-magādhamūlaṃ
Samprāpya duḥkhashathasarpasamākulasya.
Dīnasya deva kṛpaṇāpadamāgatasya
Lakshmi Narasimha mama dehi karāvalambam.॥4॥

Saṃsārasāgaravishālakarālakāla-
Nakragrahagrasananigrahavigrahsya.
Vyagrasya rāganichayorminipīḍitasya
Lakshmi Narasimha mama dehi karāvalambam.॥5॥

Saṃsāravṛkshamaghabījam-anantakarma-
Shākhāshataṃ karaṇapatram-anaṅgapuṣhpam.
Āruhya duḥkhaphalinaṃ patato dayālo
Lakshmi Narasimha mama dehi karāvalambam.॥6॥

Saṃsārasarpaghanavaktrabha-yogratīvra-
Daṃṣhṭrākarālaviṣhadagdhavinaṣhṭamūrteḥ.
Nāgārivāhana sudhābdhinikvāsa shaure
Lakshmi Narasimha mama dehi karāvalambam.॥7॥

Saṃsāradāvadahanāturabhīkarouru-
Jvālāvalībhiratidagdhatanūruhasya.
Tvatpādapadmasarasīsharaṇāgatasya
Lakshmi Narasimha mama dehi karāvalambam.॥8॥

Saṃsārajālapatitasya jagannivāsa
Sarvendriyārtabaḍishārthajaṣhopmasya.
Protkhaṇḍitaprachura-tālukamastakasya
Lakshmi Narasimha mama dehi karāvalambam.॥9॥

Saṃsārabhīkarakarīndrakarābhighāta-
Niṣhpiṣhṭamarmavapuṣhaḥ sakalārtināsha.
Prāṇaprayāṇabhavabhītisamākulasya
Lakshmi Narasimha mama dehi karāvalambam.॥10॥

Andhasya me hṛtavivekamahādhanasya
Choraiḥ prabho balibhirindrriyanāmadheyaiḥ.
Mohāndhakūpakuhare vinipātitasya
Lakshmi Narasimha mama dehi karāvalambam.॥11॥

Lakshmpate kamalanābha suresha viṣhṇo
Vaikuṇṭha kṛṣhṇa madhusūdana puṣhkarākṣha.
Brahmaṇya keshava janārdana vāsudeva
Devesha dehi kṛpaṇasya karāvalambam.॥12॥

Yanmāyayorjitavapuḥ prachurapravāha-
Magnārthamatra nivahoru-karāvalambam.
Lakshmi-Narasimha-charaṇābja-madhuvratena
Stotraṃ kṛtaṃ sukhakaraṃ bhuvi shaṅkareṇa.॥13॥

॥ Iti shrīmachchhaṅkarāchāryakṛtaṃ shrī-Lakshmi-Narasimha-stotraṃ sampūrṇam ॥`
};

async function addLakshmiNarasimhaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: lakshmiNarasimhaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Lakshmi Narasimha Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(lakshmiNarasimhaStotram);
      await doc.save();
      console.log('✓  Added: ' + lakshmiNarasimhaStotram.title);
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

addLakshmiNarasimhaStotram();
