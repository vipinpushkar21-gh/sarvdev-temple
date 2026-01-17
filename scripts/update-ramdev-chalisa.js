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

const completeLyrics = `रामदेव चालीसा (Ramdev Chalisa)
॥ दोहा ॥
श्री गुरु पद नमन करि,गिरा गनेश मनाय ।
कथूं रामदेव विमल यश,सुने पाप विनशाय ॥
द्वार केश से आय कर,लिया मनुज अवतार ।
अजमल गेह बधावणा,जग में जय जयकार ॥
॥ चौपाई ॥
जय जय रामदेव सुर राया।अजमल पुत्र अनोखी माया॥
विष्णु रूप सुर नर के स्वामी।परम प्रतापी अन्तर्यामी॥

ले अवतार अवनि पर आये।तंवर वंश अवतंश कहाये॥
संत जनों के कारज सारे।दानव दैत्य दुष्ट संहारे॥

परच्या प्रथम पिता को दीन्हा।दूध परीण्डा मांही कीन्हा॥
कुमकुम पद पोली दर्शाये।ज्योंही प्रभु पलने प्रगटाये॥

परचा दूजा जननी पाया।दूध उफणता चरा उठाया॥
परचा तीजा पुरजन पाया।चिथड़ों का घोड़ा ही साया॥

परच्या चौथा भैरव मारा।भक्त जनों का कष्ट निवारा॥
पंचम परच्या रतना पाया।पुंगल जा प्रभु फंद छुड़ाया॥

परच्या छठा विजयसिंह पाया।जला नगर शरणागत आया॥
परच्या सप्तम् सुगना पाया।मुवा पुत्र हंसता भग आया॥

परच्या अष्टम् बौहित पाया।जा परदेश द्रव्य बहु लाया॥
भंवर डूबती नाव उबारी।प्रगत टेर पहुँचे अवतारी॥

नवमां परच्या वीरम पाया।बनियां आ जब हाल सुनाया॥
दसवां परच्या पा बिनजारा।मिश्री बनी नमक सब खारा॥

परच्या ग्यारह किरपा थारी।नमक हुआ मिश्री फिर सारी॥
परच्या द्वादश ठोकर मारी।निकलंग नाड़ी सिरजी प्यारी॥

परच्या तेरहवां पीर परी पधारया।ल्याय कटोरा कारज सारा॥
चौदहवां परच्या जाभो पाया।निजसर जल खारा करवाया॥

परच्या पन्द्रह फिर बतलाया।राम सरोवर प्रभु खुदवाया॥
परच्या सोलह हरबू पाया।दर्श पाय अतिशय हरषाया॥

परच्या सत्रह हर जी पाया।दूध थणा बकरया के आया॥
सुखी नाडी पानी कीन्हों।आत्म ज्ञान हरजी ने दीन्हों॥

परच्या अठारहवां हाकिम पाया।सूते को धरती लुढ़काया॥
परच्या उन्नीसवां दल जी पाया।पुत्र पाय मन में हरषाया॥

परच्या बीसवां पाया सेठाणी।आये प्रभु सुन गदगद वाणी॥
तुरंत सेठ सरजीवण कीन्हा।उक्त उजागर अभय वर दीन्हा॥

परच्या इक्कीसवां चोर जो पाया।हो अन्धा करनी फल पाया॥
परच्या बाईसवां मिर्जो चीहां।सातो तवा बेध प्रभु दीन्हां॥

परच्या तेईसवां बादशाह पाया।फेर भक्त को नहीं सताया॥
परच्या चैबीसवां बख्शी पाया।मुवा पुत्र पल में उठ धाया॥

जब-जब जिसने सुमरण कीन्हां।तब-तब आ तुम दर्शन दीन्हां॥
भक्त टेर सुन आतुर धाते।चढ़ लीले पर जल्दी आते॥

जो जन प्रभु की लीला गावें।मनवांछित कारज फल पावें॥
यह चालीसा सुने सुनावे।ताके कष्ट सकल कट जावे॥

जय जय जय प्रभु लीला धारी।तेरी महिमा अपरम्पारी॥
मैं मूरख क्या गुण तब गाऊँ।कहाँ बुद्धि शारद सी लाऊँ॥

नहीं बुद्धि बल घट लव लेशा।मती अनुसार रची चालीसा॥
दास सभी शरण में तेरी।रखियों प्रभु लज्जा मेरी॥`;

async function updateRamdevChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Ramdev Chalisa', deity: 'Ramdev' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Ramdev Chalisa - Complete Hindi text with doha, chaupai, and summary.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Ramdev Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Ramdev Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains 'रखियों प्रभु लज्जा मेरी': ${updated.lyrics.includes('रखियों प्रभु लज्जा मेरी')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Ramdev Chalisa:', error);
    process.exit(1);
  }
}

updateRamdevChalisa();
