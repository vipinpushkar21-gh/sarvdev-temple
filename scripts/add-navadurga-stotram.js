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

const navadurgaStotram = {
  title: 'नवदुर्गा स्तोत्रम् (Navadurga Stotram)',
  deity: 'Durga',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Navadurga Stotram is a sacred hymn dedicated to the nine forms of Goddess Durga worshipped during the nine nights of Navratri. Each verse invokes one of the nine divine manifestations — Shailputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kaalratri, Mahagauri, and Siddhidatri — seeking their blessings for protection, wisdom, prosperity, and spiritual liberation.',
  lyrics: `॥ नवदुर्गा स्तोत्रम् ॥

॥ देवी शैलपुत्री ॥
वन्दे वाञ्छितलाभाय चन्द्रार्धकृतशेखराम्।
वृषारूढाम् शूलधरां शैलपुत्री यशस्विनीम्॥1॥

॥ देवी ब्रह्मचारिणी ॥
दधाना करपद्माभ्याम् अक्षमाला कमण्डलू।
देवी प्रसीदतु मयि ब्रह्मचारिण्यनुत्तमा॥2॥

॥ देवी चन्द्रघण्टा ॥
पिण्डजप्रवरारूढा चन्दकोपास्त्रकैर्युता।
प्रसादं तनुते मह्यम् चन्द्रघण्टेति विश्रुता॥3॥

॥ देवी कूष्माण्डा ॥
सुरासम्पूर्णकलशम् रुधिराप्लुतमेव च।
दधाना हस्तपद्माभ्याम् कूष्माण्डा शुभदास्तु मे॥4॥

॥ देवी स्कन्दमाता ॥
सिंहासनगता नित्यम् पद्माश्रितकरद्वया।
शुभदास्तु सदा देवी स्कन्दमाता यशस्विनी॥5॥

॥ देवी कात्यायनी ॥
चन्द्रहासोज्ज्वलकरा शार्दूलवरवाहना।
कात्यायनी शुभं दद्याद् देवि दानवघातिनी॥6॥

॥ देवी कालरात्रि ॥
एकवेणी जपाकर्णपूरा नग्ना खरास्थिता।
लम्बोष्ठी कर्णिकाकर्णी तैलभ्यक्तशरीरिणी॥
वामपादोल्लसल्लोह लताकण्टकभूषणा।
वर्धनमूर्धध्वजा कृष्णा कालरात्रिर्भयङ्करी॥7॥

॥ देवी महागौरी ॥
श्वेते वृषे समारूढा श्वेताम्बरधरा शुचिः।
महागौरी शुभं दद्यान् महादेवप्रमोददा॥8॥

॥ देवी सिद्धिदात्रि ॥
सिद्धगन्धर्वयक्षाद्यैर् असुरैर् अमरैरपि।
सेव्यमाना सदा भूयात् सिद्धिदा सिद्धिदायिनी॥9॥

॥ इति श्री नवदुर्गा स्तोत्रम् सम्पूर्णम् ॥

---

॥ Navadurga Stotram ॥

॥ Devi Shailputri ॥
Vande vāñchhitalābhāya chandrārdhakṛtashekharām.
Vṛṣhārūḍhām shūladharāṃ shailaputrī yashasvinīm.॥1॥

॥ Devi Brahmacharini ॥
Dadhānā karapadmābhyām akṣhamālā kamaṇḍalū.
Devī prasīdatu mayi brahmachāriṇyanuttamā.॥2॥

॥ Devi Chandraghanta ॥
Piṇḍajapravarārūḍhā chandakopāstrakairyutā.
Prasādaṃ tanute mahyam chandraghaṇṭeti vishrutā.॥3॥

॥ Devi Kushmanda ॥
Surāsampūrṇakalasham rudhirāplutameva cha.
Dadhānā hastapadmābhyām kūṣhmāṇḍā shubhadāstu me.॥4॥

॥ Devi Skandamata ॥
Siṃhāsanagatā nityam padmāshritakaradvayā.
Shubhadāstu sadā devī skandamātā yashasvinī.॥5॥

॥ Devi Katyayani ॥
Chandrahāsojjvalakarā shārdūlavaravāhanā.
Kātyāyanī shubhaṃ dadyād devi dānavaghātinī.॥6॥

॥ Devi Kaalratri ॥
Ekaveṇī japākarṇapūrā nagnā kharāsthitā.
Lamboṣhṭhī karṇikākarṇī tailabhyaktasharīriṇī.
Vāmapādollasalloha latākaṇṭakabhūṣhaṇā.
Vardhanamūrdhdhvajā kṛṣhṇā kālarātrirhhayaṅkarī.॥7॥

॥ Devi Mahagauri ॥
Shvete vṛṣhe samārūḍhā shvetāmbaradharā shuchiḥ.
Mahāgaurī shubhaṃ dadyān mahādevapramodadā.॥8॥

॥ Devi Siddhidatri ॥
Siddhagandharva-yakṣhādyair asurair amarairapi.
Sevyamānā sadā bhūyāt siddhidā siddhidāyinī.॥9॥

॥ Iti shrī Navadurga Stotram sampūrṇam ॥`
};

async function addNavadurgaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: navadurgaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Navadurga Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(navadurgaStotram);
      await doc.save();
      console.log('✓  Added: ' + navadurgaStotram.title);
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

addNavadurgaStotram();
