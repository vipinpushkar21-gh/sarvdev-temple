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

const completeLyrics = `श्री महालक्ष्मी चालीसा (Shri Mahalakshmi Chalisa)
॥ दोहा ॥
जय जय श्री महालक्ष्मी,करूँ मात तव ध्यान।
सिद्ध काज मम किजिये,निज शिशु सेवक जान॥
॥ चौपाई ॥
नमो महा लक्ष्मी जय माता।तेरो नाम जगत विख्याता॥
आदि शक्ति हो मात भवानी।पूजत सब नर मुनि ज्ञानी॥

जगत पालिनी सब सुख करनी।निज जनहित भण्डारण भरनी॥
श्वेत कमल दल पर तव आसन।मात सुशोभित है पद्मासन॥

श्वेताम्बर अरू श्वेता भूषण।श्वेतही श्वेत सुसज्जित पुष्पन॥
शीश छत्र अति रूप विशाला।गल सोहे मुक्तन की माला॥

सुंदर सोहे कुंचित केशा।विमल नयन अरु अनुपम भेषा॥
कमलनाल समभुज तवचारि।सुरनर मुनिजनहित सुखकारी॥

अद्भूत छटा मात तव बानी।सकलविश्व कीन्हो सुखखानी॥
शांतिस्वभाव मृदुलतव भवानी।सकल विश्वकी हो सुखखानी॥

महालक्ष्मी धन्य हो माई।पंच तत्व में सृष्टि रचाई॥
जीव चराचर तुम उपजाए।पशु पक्षी नर नारी बनाए॥

क्षितितल अगणित वृक्ष जमाए।अमितरंग फल फूल सुहाए॥
छवि विलोक सुरमुनि नरनारी।करे सदा तव जय-जय कारी॥

सुरपति औ नरपत सब ध्यावैं।तेरे सम्मुख शीश नवावैं॥
चारहु वेदन तब यश गाया।महिमा अगम पार नहिं पाये॥

जापर करहु मातु तुम दाया।सोइ जग में धन्य कहाया॥
पल में राजाहि रंक बनाओ।रंक राव कर बिमल न लाओ॥

जिन घर करहु माततुम बासा।उनका यश हो विश्व प्रकाशा॥
जो ध्यावै से बहु सुख पावै।विमुख रहे हो दुख उठावै॥

महालक्ष्मी जन सुख दाई।ध्याऊं तुमको शीश नवाई॥
निज जन जानीमोहीं अपनाओ।सुखसम्पति दे दुख नसाओ॥

ॐ श्री-श्री जयसुखकी खानी।रिद्धिसिद्ध देउ मात जनजानी॥
ॐह्रीं-ॐह्रीं सब व्याधिहटाओ।जनउन विमल दृष्टिदर्शाओ॥

ॐक्लीं-ॐक्लीं शत्रुन क्षयकीजै।जनहित मात अभय वरदीजै॥
ॐ जयजयति जयजननी।सकल काज भक्तन के सरनी॥

ॐ नमो-नमो भवनिधि तारनी।तरणि भंवर से पार उतारनी॥
सुनहु मात यह विनय हमारी।पुरवहु आशन करहु अबारी॥

ऋणी दुखी जो तुमको ध्यावै।सो प्राणी सुख सम्पत्ति पावै॥
रोग ग्रसित जो ध्यावै कोई।ताकी निर्मल काया होई॥

विष्णु प्रिया जय-जय महारानी।महिमा अमित न जाय बखानी॥
पुत्रहीन जो ध्यान लगावै।पाये सुत अतिहि हुलसावै॥

त्राहि त्राहि शरणागत तेरी।करहु मात अब नेक न देरी॥
आवहु मात विलम्ब न कीजै।हृदय निवास भक्त बर दीजै॥

जानूं जप तप का नहिं भेवा।पार करो भवनिध वन खेवा॥
बिनवों बार-बार कर जोरी।पूरण आशा करहु अब मोरी॥

जानि दास मम संकट टारौ।सकल व्याधि से मोहिं उबारौ॥
जो तव सुरति रहै लव लाई।सो जग पावै सुयश बड़ाई॥

छायो यश तेरा संसारा।पावत शेष शम्भु नहिं पारा॥
गोविंद निशदिन शरण तिहारी।करहु पूरण अभिलाष हमारी॥

॥ दोहा ॥
महालक्ष्मी चालीसा,पढ़ै सुनै चित लाय।
ताहि पदारथ मिलै,अब कहै वेद अस गाय॥`;

async function updateMahalakshmiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Shri Mahalakshmi Chalisa', deity: 'Mahalakshmi' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Shri Mahalakshmi Chalisa - Complete Hindi text with doha, chaupai, and summary.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Shri Mahalakshmi Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Shri Mahalakshmi Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains 'महालक्ष्मी चालीसा,पढ़ै सुनै चित लाय': ${updated.lyrics.includes('महालक्ष्मी चालीसा,पढ़ै सुनै चित लाय')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Mahalakshmi Chalisa:', error);
    process.exit(1);
  }
}

updateMahalakshmiChalisa();
