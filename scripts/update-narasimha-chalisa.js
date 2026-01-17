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

const completeLyrics = `श्री नरसिंह चालीसा (Shri Narasimha Chalisa)
॥ दोहा ॥
मास वैशाख कृतिका युत,हरण मही को भार।
शुक्ल चतुर्दशी सोम दिन,लियो नरसिंह अवतार॥
धन्य तुम्हारो सिंह तनु,धन्य तुम्हारो नाम।
तुमरे सुमरन से प्रभु,पूरन हो सब काम॥

॥ चौपाई ॥
नरसिंह देव मैं सुमरों तोहि।धन बल विद्या दान दे मोहि॥
जय जय नरसिंह कृपाला।करो सदा भक्तन प्रतिपाला॥

विष्णु के अवतार दयाला।महाकाल कालन को काला॥
नाम अनेक तुम्हारो बखानो।अल्प बुद्धि मैं ना कछु जानों॥

हिरणाकुश नृप अति अभिमानी।तेहि के भार मही अकुलानी॥
हिरणाकुश कयाधू के जाये।नाम भक्त प्रहलाद कहाये॥

भक्त बना बिष्णु को दासा।पिता कियो मारन परसाया॥
अस्त्र-शस्त्र मारे भुज दण्डा।अग्निदाह कियो प्रचण्डा॥

भक्त हेतु तुम लियो अवतारा।दुष्ट-दलन हरण महिभारा॥
तुम भक्तन के भक्त तुम्हारे।प्रह्लाद के प्राण पियारे॥

प्रगट भये फाड़कर तुम खम्भा।देख दुष्ट-दल भये अचम्भा॥
खड्ग जिह्व तनु सुन्दर साजा।ऊर्ध्व केश महादष्ट्र विराजा॥

तप्त स्वर्ण सम बदन तुम्हारा।को वरने तुम्हरों विस्तारा॥
रूप चतुर्भुज बदन विशाला।नख जिह्वा है अति विकराला॥

स्वर्ण मुकुट बदन अति भारी।कानन कुण्डल की छवि न्यारी॥
भक्त प्रहलाद को तुमने उबारा।हिरणा कुश खल क्षण मह मारा॥

ब्रह्मा, बिष्णु तुम्हे नित ध्यावे।इन्द्र महेश सदा मन लावे॥
वेद पुराण तुम्हरो यश गावे।शेष शारदा पारन पावे॥

जो नर धरो तुम्हरो ध्याना।ताको होय सदा कल्याना॥
त्राहि-त्राहि प्रभु दुःख निवारो।भव बन्धन प्रभु आप ही टारो॥

नित्य जपे जो नाम तिहारा।दुःख व्याधि हो निस्तारा॥
सन्तान-हीन जो जाप कराये।मन इच्छित सो नर सुत पावे॥

बन्ध्या नारी सुसन्तान को पावे।नर दरिद्र धनी होई जावे॥
जो नरसिंह का जाप करावे।ताहि विपत्ति सपनें नही आवे॥

जो कामना करे मन माही।सब निश्चय सो सिद्ध हुयी जाही॥
जीवन मैं जो कछु सङ्कट होयी।निश्चय नरसिंह सुमरे सोयी॥

रोग ग्रसित जो ध्यावे कोई।ताकि काया कञ्चन होई॥
डाकिनी-शाकिनी प्रेत बेताला।ग्रह-व्याधि अरु यम विकराला॥

प्रेत पिशाच सबे भय खाये।यम के दूत निकट नहीं आवे॥
सुमर नाम व्याधि सब भागे।रोग-शोक कबहूँ नही लागे॥

जाको नजर दोष हो भाई।सो नरसिंह चालीसा गाई॥
हटे नजर होवे कल्याना।बचन सत्य साखी भगवाना॥

जो नर ध्यान तुम्हारो लावे।सो नर मन वाञ्छित फल पावे॥
बनवाये जो मन्दिर ज्ञानी।हो जावे वह नर जग मानी॥

नित-प्रति पाठ करे इक बारा।सो नर रहे तुम्हारा प्यारा॥
नरसिंह चालीसा जो जन गावे।दुःख दरिद्र ताके निकट न आवे॥

चालीसा जो नर पढ़े-पढ़ावे।सो नर जग में सब कुछ पावे॥
यह श्री नरसिंह चालीसा।पढ़े रङ्क होवे अवनीसा॥

जो ध्यावे सो नर सुख पावे।तोही विमुख बहु दुःख उठावे॥
शिव स्वरूप है शरण तुम्हारी।हरो नाथ सब विपत्ति हमारी॥

॥ दोहा ॥
चारों युग गायें तेरी,महिमा अपरम्पार।
निज भक्तनु के प्राण हित,लियो जगत अवतार॥

नरसिंह चालीसा जो पढ़े,प्रेम मगन शत बार।
उस घर आनन्द रहे,वैभव बढ़े अपार॥`;

async function updateNarasimhaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Shri Narasimha Chalisa', deity: 'Narasimha' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Shri Narasimha Chalisa - Complete Hindi text with doha and chaupai.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Shri Narasimha Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Shri Narasimha Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains 'नरसिंह चालीसा जो पढ़े,प्रेम मगन शत बार।': ${updated.lyrics.includes('नरसिंह चालीसा जो पढ़े,प्रेम मगन शत बार।')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Shri Narasimha Chalisa:', error);
    process.exit(1);
  }
}

updateNarasimhaChalisa();
