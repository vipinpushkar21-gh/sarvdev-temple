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

const completeLyrics = `पार्वती चालीसा (Parvati Chalisa)
॥ दोहा ॥
जय गिरी तनये दक्षजे
शम्भू प्रिये गुणखानि ।
गणपति जननी पार्वती
अम्बे! शक्ति! भवानि ॥
॥ चौपाई ॥
ब्रह्मा भेद न तुम्हरो पावे ।
पंच बदन नित तुमको ध्यावे ॥

षड्मुख कहि न सकत यश तेरो ।
सहसबदन श्रम करत घनेरो ॥

तेऊ पार न पावत माता ।
स्थित रक्षा लय हिय सजाता ॥

अधर प्रवाल सदृश अरुणारे ।
अति कमनीय नयन कजरारे ॥

ललित ललाट विलेपित केशर ।
कुंकुंम अक्षत शोभा मनहर ॥

कनक बसन कंचुकि सजाए ।
कटी मेखला दिव्य लहराए ॥

कंठ मदार हार की शोभा ।
जाहि देखि सहजहि मन लोभा ॥

बालारुण अनंत छबि धारी ।
आभूषण की शोभा प्यारी ॥

नाना रत्न जड़ित सिंहासन ।
तापर राजति हरि चतुरानन ॥

इन्द्रादिक परिवार पूजित ।
जग मृग नाग यक्ष रव कूजित ॥ 10

गिर कैलास निवासिनी जय जय ।
कोटिक प्रभा विकासिनी जय जय ॥

त्रिभुवन सकल कुटुंब तिहारी ।
अणु अणु महं तुम्हारी उजियारी ॥

हैं महेश प्राणेश तुम्हारे ।
त्रिभुवन के जो नित रखवारे ॥

उनसो पति तुम प्राप्त कीन्ह जब ।
सुकृत पुरातन उदित भए तब ॥

बूढ़ा बैल सवारी जिनकी ।
महिमा का गावे कोउ तिनकी ॥

सदा श्मशान बिहारी शंकर ।
आभूषण हैं भुजंग भयंकर ॥

कण्ठ हलाहल को छबि छायी ।
नीलकण्ठ की पदवी पायी ॥

देव मगन के हित अस किन्हो ।
विष लै आपु तिनहि अमि दिन्हो ॥

ताकी तुम पत्नी छवि धारिणी ।
दुरित विदारिणी मंगल कारिणी ॥

देखि परम सौंदर्य तिहारो ।
त्रिभुवन चकित बनावन हारो ॥ 20

भय भीता सो माता गंगा ।
लज्जा मय है सलिल तरंगा ॥

सौत समान शम्भू पहआयी ।
विष्णु पदाब्ज छोड़ि सो धायी ॥

तेहि कों कमल बदन मुरझायो ।
लखी सत्वर शिव शीश चढ़ायो ॥

नित्यानंद करी बरदायिनी ।
अभय भक्त कर नित अनपायिनी ॥

अखिल पाप त्रयताप निकन्दिनी ।
माहेश्वरी हिमालय नन्दिनी ॥

काशी पुरी सदा मन भायी ।
सिद्ध पीठ तेहि आपु बनायी ॥

भगवती प्रतिदिन भिक्षा दात्री ।
कृपा प्रमोद सनेह विधात्री ॥

रिपुक्षय कारिणी जय जय अम्बे ।
वाचा सिद्ध करि अवलम्बे ॥

गौरी उमा शंकरी काली ।
अन्नपूर्णा जग प्रतिपाली ॥

सब जन की ईश्वरी भगवती ।
पतिप्राणा परमेश्वरी सती ॥ 30

तुमने कठिन तपस्या कीनी ।
नारद सों जब शिक्षा लीनी ॥

अन्न न नीर न वायु अहारा ।
अस्थि मात्रतन भयउ तुम्हारा ॥

पत्र घास को खाद्य न भायउ ।
उमा नाम तब तुमने पायउ ॥

तप बिलोकी ऋषि सात पधारे ।
लगे डिगावन डिगी न हारे ॥

तब तब जय जय जय उच्चारेउ ।
सप्तऋषि निज गेह सिद्धारेउ ॥

सुर विधि विष्णु पास तब आए ।
वर देने के वचन सुनाए ॥

मांगे उमा वर पति तुम तिनसों ।
चाहत जग त्रिभुवन निधि जिनसों ॥

एवमस्तु कही ते दोऊ गए ।
सुफल मनोरथ तुमने लए ॥

करि विवाह शिव सों भामा ।
पुनः कहाई हर की बामा ॥

जो पढ़िहै जन यह चालीसा ।
धन जन सुख देइहै तेहि ईसा ॥ 40

॥ दोहा ॥
कूटि चंद्रिका सुभग शिर,
जयति जयति सुख खा‍नि
पार्वती निज भक्त हित,
रहहु सदा वरदानि ।
॥ इति श्री पार्वती चालीसा ॥`;

async function updateParvatiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Parvati Chalisa', deity: 'Parvati' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Parvati Chalisa - Complete Hindi text with doha and chaupai.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Parvati Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Parvati Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains '॥ इति श्री पार्वती चालीसा ॥': ${updated.lyrics.includes('॥ इति श्री पार्वती चालीसा ॥')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Parvati Chalisa:', error);
    process.exit(1);
  }
}

updateParvatiChalisa();
