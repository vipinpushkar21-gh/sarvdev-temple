const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  subCategory: { type: String },
  lyrics: { type: String },
  audioUrl: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const navdurgaMantras = [
  {
    title: 'Devi Shailputri Mantra (Day 1 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: वन्दे वाञ्छितलाभाय चन्द्रार्धकृतशेखराम्।
वृषारूढां शूलधरां शैलपुत्रीं यशस्विनीम् ॥

Transliteration: Vande vāñchitalābhāya chandrārdhakṛtaśekharām।
Vṛṣārūḍhāṁ śūladharāṁ śailaputrīṁ yaśasvinīm ॥

Translation: I bow to Goddess Shailputri for fulfillment of desires, who has a crescent moon on her head, who rides a bull, who holds a trident, and who is glorious.`,
    description: 'First form of Navdurga worshipped on Day 1 of Navratri - daughter of the mountains (Parvati), rides a bull and holds a trident'
  },
  {
    title: 'Devi Brahmacharini Mantra (Day 2 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: दधाना करपद्माभ्यामक्षमाला कमण्डलू।
देवी प्रसीदतु मयि ब्रह्मचारिण्यनुत्तमा ॥

Transliteration: Dadhānā karapadmābhyām akṣamālā kamaṇḍalū।
Devī prasīdatu mayi brahmachāriṇy anuttamā ॥

Translation: Holding a rosary and water pot in her lotus-like hands, may the supreme Goddess Brahmacharini be pleased with me.`,
    description: 'Second form of Navdurga worshipped on Day 2 of Navratri - represents austerity and penance, holds rosary and kamandalu'
  },
  {
    title: 'Devi Chandraghanta Mantra (Day 3 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: पिण्डजप्रवरारूढा चण्डकोपास्त्रकैर्युता।
प्रसादं तनुते मह्यं चन्द्रघण्टेति विश्रुता ॥

Transliteration: Piṇḍaja pravarārūḍhā chaṇḍakopāstrakairyutā।
Prasādaṁ tanute mahyaṁ chandraghaṇṭeti viśrutā ॥

Translation: Riding on a lion, equipped with fierce weapons of anger, may she who is renowned as Chandraghanta bestow grace upon me.`,
    description: 'Third form of Navdurga worshipped on Day 3 of Navratri - has a bell-shaped half moon on forehead, rides a lion'
  },
  {
    title: 'Devi Kushmanda Mantra (Day 4 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: सुरासम्पूर्ण कलशं रुधिराप्लुतमेव च।
दधाना हस्तपद्माभ्यां कूष्माण्डा शुभदास्तु मे ॥

Transliteration: Surāsampūrṇa kalaśaṁ rudhirāplutam eva cha।
Dadhānā hastapadmābhyāṁ kūṣmāṇḍā śubhadāstu me ॥

Translation: Holding a pot full of nectar and blood in her lotus-like hands, may Goddess Kushmanda bestow auspiciousness upon me.`,
    description: 'Fourth form of Navdurga worshipped on Day 4 of Navratri - creator of the universe, resides in the sun, has eight arms'
  },
  {
    title: 'Devi Skandamata Mantra (Day 5 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: सिंहासनगतां नित्यं पद्माञ्चित करद्वयाम्।
शुभदास्तु सदा देवी स्कन्दमाता यशस्विनी ॥

Transliteration: Siṁhāsanagatāṁ nityaṁ padmāñchita karadvayām।
Śubhadāstu sadā devī skandamātā yaśasvinī ॥

Translation: Always seated on a throne, with both hands adorned with lotuses, may the glorious Goddess Skandamata always bestow auspiciousness.`,
    description: 'Fifth form of Navdurga worshipped on Day 5 of Navratri - mother of Kartikeya (Skanda), holds baby Skanda, rides a lion'
  },
  {
    title: 'Devi Katyayani Mantra (Day 6 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: चन्द्रहासोज्ज्वलकरा शार्दूलवरवाहना।
कात्यायनी शुभं दद्याद् देवी दानवघातिनी ॥

Transliteration: Chandrahāsojjvalakarā śārdūlavaravāhanā।
Kātyāyanī śubhaṁ dadyād devī dānavaghātinī ॥

Translation: With hands shining with a curved sword, riding on an excellent lion, may Goddess Katyayani, the destroyer of demons, bestow auspiciousness.`,
    description: 'Sixth form of Navdurga worshipped on Day 6 of Navratri - warrior goddess who destroyed Mahishasura, rides a lion'
  },
  {
    title: 'Devi Kalaratri Mantra (Day 7 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: एकवेणी जपाकर्णपूरा नग्ना खरास्थिता।
लम्बोष्ठी कर्णिकाकर्णी तैलाभ्यक्तशरीरिणी ॥
वामपादोल्लसल्लोहलताकण्टकभूषणा।
वर्धनमूर्धध्वजा कृष्णा कालरात्रिर्भयङ्करी ॥

Transliteration: Ekaveṇī japākarṇapūrā nagnā kharāsthitā।
Lamboṣṭhī karṇikākarṇī tailābhyaktaśarīriṇī ॥
Vāmapādollasallohalatākaṇṭakabhūṣaṇā।
Vardhanamūrdhadhvajā kṛṣṇā kālarātrir bhayaṅkarī ॥

Translation: With one braid, earrings made of corpse, naked, riding on a donkey, with protruding lips and ears, with body smeared with oil, adorned with iron chains and thorns on her left foot, with a flag on her head, dark in complexion - Kalaratri is fearsome.`,
    description: 'Seventh form of Navdurga worshipped on Day 7 of Navratri - fiercest form, destroyer of all demons and negativity'
  },
  {
    title: 'Devi Mahagauri Mantra (Day 8 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: श्वेते वृषे समारूढा श्वेताम्बरधरा शुचिः।
महागौरी शुभं दद्यान्महादेव प्रमोददा ॥

Transliteration: Śvete vṛṣe samārūḍhā śvetāmbaradharā śuchiḥ।
Mahāgaurī śubhaṁ dadyān mahādeva pramodadā ॥

Translation: Riding on a white bull, wearing white clothes, pure one - may Mahagauri bestow auspiciousness, the one who delights Lord Shiva.`,
    description: 'Eighth form of Navdurga worshipped on Day 8 of Navratri - extremely fair complexion, symbol of peace and calmness'
  },
  {
    title: 'Devi Siddhidatri Mantra (Day 9 - Navratri)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: सिद्धगन्धर्वयक्षाद्यैरसुरैरमरैरपि।
सेव्यमाना सदा भूयात् सिद्धिदा सिद्धिदायिनी ॥

Transliteration: Siddha gandharva yakṣādyair asurair amarair api।
Sevyamānā sadā bhūyāt siddhidā siddhidāyinī ॥

Translation: Always worshipped by Siddhas, Gandharvas, Yakshas, Asuras and Devas - may Siddhidatri, the giver of all siddhis (powers), always be present.`,
    description: 'Ninth form of Navdurga worshipped on Day 9 of Navratri - bestows all eight siddhis (supernatural powers), sits on lotus'
  },
  {
    title: 'Chamunda Mantra (Fierce Form of Durga)',
    deity: 'Navdurga',
    category: 'Mantra',
    subCategory: 'Navdurga Mantra',
    status: 'approved',
    lyrics: `Sanskrit: ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे नमः ॥

Transliteration: Om aiṁ hrīṁ klīṁ chāmuṇḍāyai vichche namaḥ ॥

Translation: Om, with seed syllables Aim, Hrim, Klim - salutations to Goddess Chamunda. Vichche (cut/destroy negativity).`,
    description: 'Powerful mantra of Chamunda, the fierce form who destroyed demons Chanda and Munda - removes obstacles and negativity'
  }
];

async function addNavdurgaMantras() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    console.log('Adding Navdurga Mantras in sequence (Day 1-9 + Chamunda):\n');

    for (let i = 0; i < navdurgaMantras.length; i++) {
      const mantra = navdurgaMantras[i];
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Day ${i + 1}: ${mantra.title}`);
    }

    console.log('\n✓ All Navdurga Mantras added successfully in sequence!');
    console.log(`Total mantras added: ${navdurgaMantras.length}`);
    console.log('\nCorrections made:');
    console.log('- वाञ्छितलाभाय (for desired gains, proper compound)');
    console.log('- चन्द्रार्धकृतशेखराम् (crescent moon as crown)');
    console.log('- शैलपुत्रीं (daughter of mountain, correct accusative)');
    console.log('- करपद्माभ्यां (by lotus-like hands, instrumental dual)');
    console.log('- ब्रह्मचारिण्यनुत्तमा (supreme Brahmacharini, compound)');
    console.log('- पिण्डजप्रवरारूढा (riding best lion, proper compound)');
    console.log('- चण्डकोपास्त्रकैः (with fierce anger weapons)');
    console.log('- रुधिराप्लुतम् (smeared with blood, correct accusative)');
    console.log('- कूष्माण्डा (Kushmanda, proper spelling)');
    console.log('- स्कन्दमाता (mother of Skanda, correct)');
    console.log('- शार्दूलवरवाहना (riding excellent lion)');
    console.log('- कालरात्रिः (Kalaratri, correct visarga)');
    console.log('- श्वेताम्बरधरा (wearing white clothes)');
    console.log('- महादेवप्रमोददा (delighting Mahadeva, compound)');
    console.log('- सिद्धदायिनी (giver of siddhis)');
    console.log('- चामुण्डायै विच्चे (to Chamunda, destroy/cut)');
    console.log('- All mantras in sequence: Shailputri → Brahmacharini → Chandraghanta → Kushmanda → Skandamata → Katyayani → Kalaratri → Mahagauri → Siddhidatri → Chamunda');
    console.log('- All mantras set to approved status');
    console.log('- Added to Mantra category with "Navdurga" deity and "Navdurga Mantra" subCategory');

    // Verify total count
    const allNavdurga = await Devotional.find({ 
      deity: 'Navdurga', 
      category: 'Mantra',
      subCategory: 'Navdurga Mantra'
    });
    console.log(`\nTotal Navdurga mantras in database: ${allNavdurga.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Navdurga mantras:', error);
    process.exit(1);
  }
}

addNavdurgaMantras();
