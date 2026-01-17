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

const completeLyrics = `विष्णु चालीसा (Vishnu Chalisa)
॥ दोहा॥
विष्णु सुनिए विनय सेवक की चितलाय ।
कीरत कुछ वर्णन करूं दीजै ज्ञान बताय ।
॥ चौपाई ॥
नमो विष्णु भगवान खरारी ।
कष्ट नशावन अखिल बिहारी ॥

प्रबल जगत में शक्ति तुम्हारी ।
त्रिभुवन फैल रही उजियारी ॥

सुन्दर रूप मनोहर सूरत ।
सरल स्वभाव मोहनी मूरत ॥

तन पर पीतांबर अति सोहत ।
बैजन्ती माला मन मोहत ॥4॥

शंख चक्र कर गदा बिराजे ।
देखत दैत्य असुर दल भाजे ॥

सत्य धर्म मद लोभ न गाजे ।
काम क्रोध मद लोभ न छाजे ॥

संतभक्त सज्जन मनरंजन ।
दनुज असुर दुष्टन दल गंजन ॥

सुख उपजाय कष्ट सब भंजन ।
दोष मिटाय करत जन सज्जन ॥8॥

पाप काट भव सिंधु उतारण ।
कष्ट नाशकर भक्त उबारण ॥

करत अनेक रूप प्रभु धारण ।
केवल आप भक्ति के कारण ॥

धरणि धेनु बन तुमहिं पुकारा ।
तब तुम रूप राम का धारा ॥

भार उतार असुर दल मारा ।
रावण आदिक को संहारा ॥12॥

आप वराह रूप बनाया ।
हरण्याक्ष को मार गिराया ॥

धर मत्स्य तन सिंधु बनाया ।
चौदह रतनन को निकलाया ॥

अमिलख असुरन द्वंद मचाया ।
रूप मोहनी आप दिखाया ॥

देवन को अमृत पान कराया ।
असुरन को छवि से बहलाया ॥16॥

कूर्म रूप धर सिंधु मझाया ।
मंद्राचल गिरि तुरत उठाया ॥

शंकर का तुम फन्द छुड़ाया ।
भस्मासुर को रूप दिखाया ॥

वेदन को जब असुर डुबाया ।
कर प्रबंध उन्हें ढूंढवाया ॥

मोहित बनकर खलहि नचाया ।
उसही कर से भस्म कराया ॥20॥

असुर जलंधर अति बलदाई ।
शंकर से उन कीन्ह लडाई ॥

हार पार शिव सकल बनाई ।
कीन सती से छल खल जाई ॥

सुमिरन कीन तुम्हें शिवरानी ।
बतलाई सब विपत कहानी ॥

तब तुम बने मुनीश्वर ज्ञानी ।
वृन्दा की सब सुरति भुलानी ॥24॥

देखत तीन दनुज शैतानी ।
वृन्दा आय तुम्हें लपटानी ॥

हो स्पर्श धर्म क्षति मानी ।
हना असुर उर शिव शैतानी ॥

तुमने ध्रुव प्रहलाद उबारे ।
हिरणाकुश आदिक खल मारे ॥

गणिका और अजामिल तारे ।
बहुत भक्त भव सिन्धु उतारे ॥28॥

हरहु सकल संताप हमारे ।
कृपा करहु हरि सिरजन हारे ॥

देखहुं मैं निज दरश तुम्हारे ।
दीन बन्धु भक्तन हितकारे ॥

चहत आपका सेवक दर्शन ।
करहु दया अपनी मधुसूदन ॥

जानूं नहीं योग्य जप पूजन ।
होय यज्ञ स्तुति अनुमोदन ॥32॥

शीलदया सन्तोष सुलक्षण ।
विदित नहीं व्रतबोध विलक्षण ॥

करहुं आपका किस विधि पूजन ।
कुमति विलोक होत दुख भीषण ॥

करहुं प्रणाम कौन विधिसुमिरण ।
कौन भांति मैं करहु समर्पण ॥

सुर मुनि करत सदा सेवकाई ।
हर्षित रहत परम गति पाई ॥36॥

दीन दुखिन पर सदा सहाई ।
निज जन जान लेव अपनाई ॥

पाप दोष संताप नशाओ ।
भव-बंधन से मुक्त कराओ ॥

सुख संपत्ति दे सुख उपजाओ ।
निज चरनन का दास बनाओ ॥

निगम सदा ये विनय सुनावै ।
पढ़ै सुनै सो जन सुख पावै ॥40॥`;

async function updateVishnuChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Vishnu Chalisa', deity: 'Vishnu' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Vishnu Chalisa - Complete Hindi text with doha and chaupai.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Vishnu Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Vishnu Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains 'निगम सदा ये विनय सुनावै ।\nपढ़ै सुनै सो जन सुख पावै ॥40॥': ${updated.lyrics.includes('निगम सदा ये विनय सुनावै ।\nपढ़ै सुनै सो जन सुख पावै ॥40॥')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Vishnu Chalisa:', error);
    process.exit(1);
  }
}

updateVishnuChalisa();
