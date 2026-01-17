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

const completeLyrics = `॥ दोहा ॥
श्री गुरु पद पंकज नमन,
दुषित भाव सुधार,
राणी सती सू विमल यश,
बरणौ मति अनुसार,
काम क्रोध मद लोभ मै,
भरम रह्यो संसार,
शरण गहि करूणामई,
सुख सम्पति संसार॥

॥ चौपाई ॥
नमो नमो श्री सती भवानी।
जग विख्यात सभी मन मानी ॥

नमो नमो संकट कू हरनी।
मनवांछित पूरण सब करनी ॥

नमो नमो जय जय जगदंबा।
भक्तन काज न होय विलंबा ॥

नमो नमो जय जय जगतारिणी।
सेवक जन के काज सुधारिणी ॥4

दिव्य रूप सिर चूनर सोहे ।
जगमगात कुन्डल मन मोहे ॥

मांग सिंदूर सुकाजर टीकी ।
गजमुक्ता नथ सुंदर नीकी ॥

गल वैजंती माल विराजे ।
सोलहूं साज बदन पे साजे ॥

धन्य भाग गुरसामलजी को ।
महम डोकवा जन्म सती को ॥8

तनधनदास पति वर पाये ।
आनंद मंगल होत सवाये ॥

जालीराम पुत्र वधु होके ।
वंश पवित्र किया कुल दोके ॥

पति देव रण मॉय जुझारे ।
सति रूप हो शत्रु संहारे ॥

पति संग ले सद् गती पाई ।
सुर मन हर्ष सुमन बरसाई ॥12

धन्य भाग उस राणा जी को ।
सुफल हुवा कर दरस सती का ॥

विक्रम तेरह सौ बावन कूं ।
मंगसिर बदी नौमी मंगल कूं ॥

नगर झून्झूनू प्रगटी माता ।
जग विख्यात सुमंगल दाता ॥

दूर देश के यात्री आवै ।
धुप दिप नैवैध्य चढावे ॥16

उछाङ उछाङते है आनंद से ।
पूजा तन मन धन श्रीफल से ॥

जात जङूला रात जगावे ।
बांसल गोत्री सभी मनावे ॥

पूजन पाठ पठन द्विज करते ।
वेद ध्वनि मुख से उच्चरते ॥

नाना भाँति भाँति पकवाना ।
विप्र जनो को न्यूत जिमाना ॥20

श्रद्धा भक्ति सहित हरसाते ।
सेवक मनवांछित फल पाते ॥

जय जय कार करे नर नारी ।
श्री राणी सतीजी की बलिहारी ॥

द्वार कोट नित नौबत बाजे ।
होत सिंगार साज अति साजे ॥

रत्न सिंघासन झलके नीको ।
पलपल छिनछिन ध्यान सती को ॥24

भाद्र कृष्ण मावस दिन लीला ।
भरता मेला रंग रंगीला ॥

भक्त सूजन की सकल भीङ है ।
दरशन के हित नही छीङ है ॥

अटल भुवन मे ज्योति तिहारी ।
तेज पूंज जग मग उजियारी ॥

आदि शक्ति मे मिली ज्योति है ।
देश देश मे भवन भौति है ॥28

नाना विधी से पूजा करते ।
निश दिन ध्यान तिहारो धरते ॥

कष्ट निवारिणी दुख: नासिनी ।
करूणामयी झुन्झुनू वासिनी ॥

प्रथम सती नारायणी नामा ।
द्वादश और हुई इस धामा ॥

तिहूं लोक मे कीरति छाई ।
राणी सतीजी की फिरी दुहाई ॥32

सुबह शाम आरती उतारे ।
नौबत घंटा ध्वनि टंकारे ॥

राग छत्तीसों बाजा बाजे ।
तेरहु मंड सुन्दर अति साजे ॥

त्राहि त्राहि मै शरण आपकी ।
पुरी मन की आस दास की ॥

मुझको एक भरोसो तेरो ।
आन सुधारो मैया कारज मेरो ॥36

पूजा जप तप नेम न जानू ।
निर्मल महिमा नित्य बखानू ॥

भक्तन की आपत्ति हर लिनी ।
पुत्र पौत्र सम्पत्ति वर दीनी ॥ 40

पढे चालीसा जो शतबारा ।
होय सिद्ध मन माहि विचारा ॥

टिबरिया ली शरण तिहारी।
क्षमा करो सब चूक हमारी ॥

॥ दोहा ॥
दुख आपद विपदा हरण,
जन जीवन आधार ।
बिगङी बात सुधारियो,
सब अपराध बिसार ॥

॥ मात श्री राणी सतीजी की जय ॥`;

async function updateRaniSatiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Shri Rani Sati Chalisa', deity: 'Rani Sati' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Shri Rani Sati Chalisa - Complete Hindi text with opening doha, 40+ chaupai verses, and closing invocation.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Shri Rani Sati Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Shri Rani Sati Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains final invocation: ${updated.lyrics.includes('मात श्री राणी सतीजी की जय')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Rani Sati Chalisa:', error);
    process.exit(1);
  }
}

updateRaniSatiChalisa();
