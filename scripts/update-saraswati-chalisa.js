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

const completeLyrics = `सरस्वती चालीसा (Saraswati Chalisa)
॥ दोहा ॥
जनक जननि पद्मरज,
निज मस्तक पर धरि ।
बन्दौं मातु सरस्वती,
बुद्धि बल दे दातारि ॥
पूर्ण जगत में व्याप्त तव,
महिमा अमित अनंतु।
दुष्जनों के पाप को,
मातु तु ही अब हन्तु ॥

॥ चालीसा ॥
जय श्री सकल बुद्धि बलरासी ।
जय सर्वज्ञ अमर अविनाशी ॥

जय जय जय वीणाकर धारी ।
करती सदा सुहंस सवारी ॥

रूप चतुर्भुज धारी माता ।
सकल विश्व अन्दर विख्याता ॥4

जग में पाप बुद्धि जब होती ।
तब ही धर्म की फीकी ज्योति ॥

तब ही मातु का निज अवतारी ।
पाप हीन करती महतारी ॥

वाल्मीकिजी थे हत्यारा ।
तव प्रसाद जानै संसारा ॥

रामचरित जो रचे बनाई ।
आदि कवि की पदवी पाई ॥8

कालिदास जो भये विख्याता ।
तेरी कृपा दृष्टि से माता ॥

तुलसी सूर आदि विद्वाना ।
भये और जो ज्ञानी नाना ॥

तिन्ह न और रहेउ अवलम्बा ।
केव कृपा आपकी अम्बा ॥

करहु कृपा सोइ मातु भवानी ।
दुखित दीन निज दासहि जानी ॥12

पुत्र करहिं अपराध बहूता ।
तेहि न धरई चित माता ॥

राखु लाज जननि अब मेरी ।
विनय करउं भांति बहु तेरी ॥

मैं अनाथ तेरी अवलंबा ।
कृपा करउ जय जय जगदंबा ॥

मधुकैटभ जो अति बलवाना ।
बाहुयुद्ध विष्णु से ठाना ॥16

समर हजार पाँच में घोरा ।
फिर भी मुख उनसे नहीं मोरा ॥

मातु सहाय कीन्ह तेहि काला ।
बुद्धि विपरीत भई खलहाला ॥

तेहि ते मृत्यु भई खल केरी ।
पुरवहु मातु मनोरथ मेरी ॥

चंड मुण्ड जो थे विख्याता ।
क्षण महु संहारे उन माता ॥20

रक्त बीज से समरथ पापी ।
सुरमुनि हदय धरा सब काँपी ॥

काटेउ सिर जिमि कदली खम्बा ।
बारबार बिन वउं जगदंबा ॥

जगप्रसिद्ध जो शुंभनिशुंभा ।
क्षण में बाँधे ताहि तू अम्बा ॥

भरतमातु बुद्धि फेरेऊ जाई ।
रामचन्द्र बनवास कराई ॥24

एहिविधि रावण वध तू कीन्हा ।
सुर नरमुनि सबको सुख दीन्हा ॥

को समरथ तव यश गुन गाना ।
निगम अनादि अनंत बखाना ॥

विष्णु रुद्र जस कहिन मारी ।
जिनकी हो तुम रक्षाकारी ॥

रक्त दन्तिका और शताक्षी ।
नाम अपार है दानव भक्षी ॥28

दुर्गम काज धरा पर कीन्हा ।
दुर्गा नाम सकल जग लीन्हा ॥

दुर्ग आदि हरनी तू माता ।
कृपा करहु जब जब सुखदाता ॥

नृप कोपित को मारन चाहे ।
कानन में घेरे मृग नाहे ॥

सागर मध्य पोत के भंजे ।
अति तूफान नहिं कोऊ संगे ॥32

भूत प्रेत बाधा या दुःख में ।
हो दरिद्र अथवा संकट में ॥

नाम जपे मंगल सब होई ।
संशय इसमें करई न कोई ॥

पुत्रहीन जो आतुर भाई ।
सबै छांड़ि पूजें एहि भाई ॥

करै पाठ नित यह चालीसा ।
होय पुत्र सुन्दर गुण ईशा ॥36

धूपादिक नैवेद्य चढ़ावै ।
संकट रहित अवश्य हो जावै ॥

भक्ति मातु की करैं हमेशा ।
निकट न आवै ताहि कलेशा ॥

बंदी पाठ करें सत बारा ।
बंदी पाश दूर हो सारा ॥

रामसागर बाँधि हेतु भवानी ।
कीजै कृपा दास निज जानी ॥40

॥दोहा॥
मातु सूर्य कान्ति तव,
अन्धकार मम रूप ।
डूबन से रक्षा करहु,
परूँ न मैं भव कूप ॥

बलबुद्धि विद्या देहु मोहि,
सुनहु सरस्वती मातु ।
राम सागर अधम को,
आश्रय तू ही देदातु ॥`;

async function updateSaraswatiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Saraswati Chalisa', deity: 'Saraswati' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Saraswati Chalisa - Complete Hindi text with doha and chaupai.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Saraswati Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Saraswati Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains 'राम सागर अधम को,\nआश्रय तू ही देदातु': ${updated.lyrics.includes('राम सागर अधम को,\nआश्रय तू ही देदातु')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Saraswati Chalisa:', error);
    process.exit(1);
  }
}

updateSaraswatiChalisa();
