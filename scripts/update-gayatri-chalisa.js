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

const completeLyrics = `गायत्री चालीसा (Gayatri Chalisa)
॥ दोहा ॥
हीं श्रीं, क्लीं, मेधा, प्रभा, जीवन ज्योति प्रचण्ड ।
शांति, क्रांति, जागृति, प्रगति, रचना शक्ति अखण्ड ॥
जगत जननि, मंगल करनि, गायत्री सुखधाम ।
प्रणवों सावित्री, स्वधा, स्वाहा पूरन काम ॥
॥ चालीसा ॥
भूर्भुवः स्वः ॐ युत जननी ।
गायत्री नित कलिमल दहनी ॥१॥

अक्षर चौबिस परम पुनीता ।
इनमें बसें शास्त्र, श्रुति, गीता ॥

शाश्वत सतोगुणी सतरुपा ।
सत्य सनातन सुधा अनूपा ॥

हंसारुढ़ सितम्बर धारी ।
स्वर्णकांति शुचि गगन बिहारी ॥४॥

पुस्तक पुष्प कमंडलु माला ।
शुभ्र वर्ण तनु नयन विशाला ॥

ध्यान धरत पुलकित हिय होई ।
सुख उपजत, दुःख दुरमति खोई ॥

कामधेनु तुम सुर तरु छाया ।
निराकार की अदभुत माया ॥

तुम्हरी शरण गहै जो कोई ।
तरै सकल संकट सों सोई ॥८॥

सरस्वती लक्ष्मी तुम काली ।
दिपै तुम्हारी ज्योति निराली ॥

तुम्हरी महिमा पारन पावें ।
जो शारद शत मुख गुण गावें ॥

चार वेद की मातु पुनीता ।
तुम ब्रहमाणी गौरी सीता ॥

महामंत्र जितने जग माहीं ।
कोऊ गायत्री सम नाहीं ॥१२॥

सुमिरत हिय में ज्ञान प्रकासै ।
आलस पाप अविघा नासै ॥

सृष्टि बीज जग जननि भवानी ।
काल रात्रि वरदा कल्यानी ॥

ब्रहमा विष्णु रुद्र सुर जेते ।
तुम सों पावें सुरता तेते ॥

तुम भक्तन की भक्त तुम्हारे ।
जननिहिं पुत्र प्राण ते प्यारे ॥१६॥

महिमा अपरम्पार तुम्हारी ।
जै जै जै त्रिपदा भय हारी ॥

पूरित सकल ज्ञान विज्ञाना ।
तुम सम अधिक न जग में आना ॥

तुमहिं जानि कछु रहै न शेषा ।
तुमहिं पाय कछु रहै न क्लेषा ॥

जानत तुमहिं, तुमहिं है जाई ।
पारस परसि कुधातु सुहाई ॥२०॥

तुम्हरी शक्ति दिपै सब ठाई ।
माता तुम सब ठौर समाई ॥

ग्रह नक्षत्र ब्रहमाण्ड घनेरे ।
सब गतिवान तुम्हारे प्रेरे ॥

सकलसृष्टि की प्राण विधाता ।
पालक पोषक नाशक त्राता ॥

मातेश्वरी दया व्रत धारी ।
तुम सन तरे पतकी भारी ॥२४॥

जापर कृपा तुम्हारी होई ।
तापर कृपा करें सब कोई ॥

मंद बुद्घि ते बुधि बल पावें ।
रोगी रोग रहित है जावें ॥

दारिद मिटै कटै सब पीरा ।
नाशै दुःख हरै भव भीरा ॥

गृह कलेश चित चिंता भारी ।
नासै गायत्री भय हारी ॥२८ ॥

संतिति हीन सुसंतति पावें ।
सुख संपत्ति युत मोद मनावें ॥

भूत पिशाच सबै भय खावें ।
यम के दूत निकट नहिं आवें ॥

जो सधवा सुमिरें चित लाई ।
अछत सुहाग सदा सुखदाई ॥

घर वर सुख प्रद लहैं कुमारी ।
विधवा रहें सत्य व्रत धारी ॥३२॥

जयति जयति जगदम्ब भवानी ।
तुम सम और दयालु न दानी ॥

जो सदगुरु सों दीक्षा पावें ।
सो साधन को सफल बनावें ॥

सुमिरन करें सुरुचि बड़भागी ।
लहैं मनोरथ गृही विरागी ॥

अष्ट सिद्घि नवनिधि की दाता ।
सब समर्थ गायत्री माता ॥३६॥

ऋषि, मुनि, यती, तपस्वी, जोगी ।
आरत, अर्थी, चिंतित, भोगी ॥

जो जो शरण तुम्हारी आवें ।
सो सो मन वांछित फल पावें ॥

बल, बुद्घि, विघा, शील स्वभाऊ ।
धन वैभव यश तेज उछाऊ ॥

सकल बढ़ें उपजे सुख नाना ।
जो यह पाठ करै धरि ध्याना ॥४०॥

॥ दोहा ॥
यह चालीसा भक्तियुत, पाठ करे जो कोय ।
तापर कृपा प्रसन्नता, गायत्री की होय ॥`;

async function updateGayatriChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const result = await Devotional.updateOne(
      { title: 'Gayatri Chalisa', deity: 'Gayatri' },
      { 
        $set: { 
          lyrics: completeLyrics,
          description: 'Gayatri Chalisa - Complete Hindi text with doha and chaupai.',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✓ Updated Gayatri Chalisa with complete lyrics`);
      console.log(`  Modified: ${result.modifiedCount} document(s)`);
      
      // Verify the update
      const updated = await Devotional.findOne({ title: 'Gayatri Chalisa' });
      console.log(`\n✓ Verification:`);
      console.log(`  Lyrics length: ${updated.lyrics.length} characters`);
      console.log(`  Contains 'यह चालीसा भक्तियुत, पाठ करे जो कोय': ${updated.lyrics.includes('यह चालीसा भक्तियुत, पाठ करे जो कोय')}`);
    } else {
      console.log('No document found to update');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error updating Gayatri Chalisa:', error);
    process.exit(1);
  }
}

updateGayatriChalisa();
