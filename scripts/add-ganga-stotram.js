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

const gangaStotram = {
  title: 'गङ्गा स्तोत्रम् (Ganga Stotram)',
  deity: 'Ganga',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Ganga Stotram is a beautiful hymn composed by Jagadguru Adi Shankaracharya in praise of the sacred river Goddess Ganga. This 14-verse stotra glorifies Mother Ganga as the purifier of sins, the bestower of liberation (moksha), and the saviour of all three worlds. Reciting this stotra with devotion is believed to grant spiritual merit, destroy sins, and lead one towards the supreme abode.',
  lyrics: `॥ गङ्गा स्तोत्रम् ॥

देवि सुरेश्वरि भगवति गङ्गे त्रिभुवनतारिणि तरलतरङ्गे।
शङ्करमौलिविहारिणि विमले मम मतिरास्तां तव पदकमले॥1॥

भागीरथि सुखदायिनि मातस्तव जलमहिमा निगमे ख्यातः।
नाहं जाने तव महिमानं पाहि कृपामयि मामज्ञानम्॥2॥

हरिपदपाद्यतरङ्गिणि गङ्गे हिमविधुमुक्ताधवलतरङ्गे।
दूरीकुरु मम दुष्कृतिभारं कुरु कृपया भवसागरपारम्॥3॥

तव जलममलं येन निपीतं परमपदं खलु तेन गृहीतम्।
मातर्गङ्गे त्वयि यो भक्तः किल तं द्रष्टुं न यमः शक्तः॥4॥

पतितोद्धारिणि जाह्नवि गङ्गे खण्डितगिरिवरमण्डितभङ्गे।
भीष्मजननि हे मुनिवरकन्ये पतितनिवारिणि त्रिभुवनधन्ये॥5॥

कल्पलतामिव फलदां लोके प्रणमति यस्त्वां न पतति शोके।
पारावारविहारिणि गङ्गे विमुखयुवतिकृततरलापाङ्गे॥6॥

तव चेन्मातः स्रोतः स्नातः पुनरपि जठरे सोऽपि न जातः।
नरकनिवारिणि जाह्नवि गङ्गे कलुषविनाशिनि महिमोत्तुङ्गे॥7॥

पुनरसदङ्गे पुण्यतरङ्गे जय जय जाह्नवि करुणापाङ्गे।
इन्द्रमुकुटमणिराजितचरणे सुखदे शुभदे भृत्यशरण्ये॥8॥

रोगं शोकं तापं पापं हर हर मे भगवति कुमतिकलापम्।
त्रिभुवनसारे वसुधाहारे त्वमसि गतिर्मम खलु संसारे॥9॥

अलकानन्दे परमानन्दे कुरु करुणामयि कातरवन्द्ये।
तव तटनिकटे यस्य निवासः खलु वैकुण्ठे तस्य निवासः॥10॥

वरमिह नीरे कमठो मीनः किं वा तीरे शरटः क्षीणः।
अथवा श्वपचो मलिनो दीनस्तव न हि दूरे नृपतिकुलीनः॥11॥

भो भुवनेश्वरि पुण्ये धन्ये देवि द्रवमयि मुनिवरकन्ये।
गङ्गास्तवमिमममलं नित्यं पठति नरो यः स जयति सत्यम्॥12॥

येषां हृदये गङ्गाभक्तिस्तेषां भवति सदा सुखमुक्तिः।
मधुराकान्तापञ्झटिकाभिः परमानन्दकलितललिताभिः॥13॥

गङ्गास्तोत्रमिदं भवसारं वाञ्छितफलदं विमलं सारम्।
शङ्करसेवकशङ्कररचितं पठति सुखी तव इति च समाप्तः॥14॥

॥ इति श्रीमच्छङ्कराचार्यविरचितं गङ्गास्तोत्रं सम्पूर्णम् ॥

---

॥ Gaṅgā Stotram ॥

Devi sureshvari bhagavati gaṅge tribhuvanatāriṇi taralataraṅge.
Shaṅkaramaulivihāriṇi vimale mama matirāstāṃ tava padakamale.॥1॥

Bhāgīrathi sukhadāyini mātastava jalamahimā nigame khyātaḥ.
Nāhaṃ jāne tava mahimānaṃ pāhi kṛpāmayi māmajñānam.॥2॥

Haripadapādyataraṅgiṇi gaṅge himavidhumuktādhavalataraṅge.
Dūrīkuru mama duṣhkṛtibhāraṃ kuru kṛpayā bhavasāgarapāram.॥3॥

Tava jalamamalaṃ yena nipītaṃ paramapadaṃ khalu tena gṛhītam.
Mātargaṅge tvayi yo bhaktaḥ kila taṃ draṣhṭuṃ na yamaḥ shaktaḥ.॥4॥

Patitoddhāriṇi jāhnavi gaṅge khaṇḍitagirivaramaṇḍitabhaṅge.
Bhīṣhmajanani he munivarakanye patitanivāriṇi tribhuvanadhānye.॥5॥

Kalpalatāmiva phaladāṃ loke praṇamati yastvāṃ na patati shoke.
Pārāvāravihāriṇi gaṅge vimukhayuvatikṛtataralāpāṅge.॥6॥

Tava chenhmātaḥ srotaḥ snātaḥ punarapi jaṭhare so'pi na jātaḥ.
Narakanivāriṇi jāhnavi gaṅge kaluṣhavināshinī mahimottuṅge.॥7॥

Punarasadaṅge puṇyataraṅge jaya jaya jāhnavi karuṇāpāṅge.
Indramukuṭamaṇirājitacharaṇe sukhade shubhade bhṛtyasharaṇye.॥8॥

Rogaṃ shokaṃ tāpaṃ pāpaṃ hara hara me bhagavati kumatikalāpam.
Tribhuvanasāre vasudhāhāre tvamasi gatirmama khalu saṃsāre.॥9॥

Alakānande paramānande kuru karuṇāmayi kātaravandye.
Tava taṭanikaṭe yasya nivāsaḥ khalu vaikuṇṭhe tasya nivāsaḥ.॥10॥

Varamiha nīre kamaṭho mīnaḥ kiṃ vā tīre sharaṭaḥ kṣhīṇaḥ.
Athavā shvapacho malino dīnastava na hi dūre nṛpatikulīnaḥ.॥11॥

Bho bhuvaneshvari puṇye dhanye devi dravamayi munivarakanye.
Gaṅgāstavamimamamalaṃ nityaṃ paṭhati naro yaḥ sa jayati satyam.॥12॥

Yeṣhāṃ hṛdaye gaṅgābhaktis teṣhāṃ bhavati sadā sukhamuktiḥ.
Madhurākāntāpañjhaṭikābhiḥ paramānandakalitalalitābhiḥ.॥13॥

Gaṅgāstotramidaṃ bhavasāraṃ vāñchhitaphaladaṃ vimalaṃ sāram.
Shaṅkarasevakashaṅkararachitaṃ paṭhati sukhī tava iti cha samāptaḥ.॥14॥

॥ Iti shrīmachchhaṅkarāchāryavirachitaṃ Gaṅgāstotraṃ sampūrṇam ॥`
};

async function addGangaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: gangaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Ganga Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(gangaStotram);
      await doc.save();
      console.log('✓  Added: ' + gangaStotram.title);
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

addGangaStotram();
