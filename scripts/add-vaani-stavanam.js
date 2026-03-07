const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Stotra' },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const vaaniStavanam = {
  title: 'श्री सरस्वती स्तोत्रम् - वाणी स्तवनं (Shri Saraswati Stotram - Vaani Stavanam)',
  deity: 'Saraswati',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'The sacred Vaani Stavanam (Hymn to Goddess Saraswati) as spoken by Sage Yajnavalkya from the Brahmavaivarta Purana, Prakriti Khanda, Chapter 5. This powerful 30-verse stotra is a prayer for knowledge, memory, wisdom, poetic ability, and intellectual brilliance. Chanting it for one year is said to transform even the dullest person into a great scholar and poet.',
  lyrics: `॥ श्री सरस्वती स्तोत्रम् | वाणी स्तवनं ॥

॥ याज्ञवल्क्य उवाच ॥

कृपां कुरु जगन्मातर्मामेवंहततेजसम्।
गुरुशापात्स्मृतिभ्रष्टं विद्याहीनंच दुःखितम्॥१॥

ज्ञानं देहि स्मृतिं देहिविद्यां देहि देवते।
प्रतिष्ठां कवितां देहिशाक्तं शिष्यप्रबोधिकाम्॥२॥

ग्रन्थनिर्मितिशक्तिं चसच्छिष्यं सुप्रतिष्ठितम्।
प्रतिभां सत्सभायां चविचारक्षमतां शुभाम्॥३॥

लुप्तां सर्वां दैववशान्नवंकुरु पुनः पुनः।
यथाऽङ्कुरं जनयतिभगवान्योगमायया॥४॥

ब्रह्मस्वरूपा परमाज्योतिरूपा सनातनी।
सर्वविद्याधिदेवी यातस्यै वाण्यै नमो नमः॥५॥

यया विना जगत्सर्वंशश्वज्जीवन्मृतं सदा।
ज्ञानाधिदेवी या तस्यैसरस्वत्यै नमो नमः॥६॥

यया विना जगत्सर्वंमूकमुन्मत्तवत्सदा।
वागधिष्ठातृदेवी यातस्यै वाण्यै नमो नमः॥७॥

हिमचन्दनकुन्देन्दुकुमुदाम्भोजसंनिभा।
वर्णाधिदेवी यातस्यै चाक्षरायै नमो नमः॥८॥

विसर्ग बिन्दुमात्राणांयदधिष्ठानमेव च।
इत्थं त्वं गीयसेसद्भिर्भारत्यै ते नमो नमः॥९॥

यया विनाऽत्र संख्याकृत्संख्यांकर्तुं न शक्नुते।
काल संख्यास्वरूपा यातस्यै देव्यै नमो नमः॥१०॥

व्याख्यास्वरूपा या देवीव्याख्याधिष्ठातृदेवता।
भ्रमसिद्धान्तरूपा यातस्यै देव्यै नमो नमः॥११॥

स्मृतिशक्तिर्ज्ञानशक्तिर्बुद्धिशक्तिस्वरूपिणी।
प्रतिभाकल्पनाशक्तिर्या चतस्यै नमो नमः॥१२॥

सनत्कुमारो ब्रह्माणं ज्ञानंपप्रच्छ यत्र वै।
बभूव जडवत्सोऽपिसिद्धान्तं कर्तुमक्षमः॥१३॥

तदाऽऽजगाम भगवानात्माश्रीकृष्ण ईश्वरः।
उवाच स च तं स्तौहिवाणीमिति प्रजापते॥१४॥

स च तुष्टाव तां ब्रह्माचाऽऽज्ञया परमात्मनः।
चकार तत्प्रसादेनतदा सिद्धान्तमुत्तमम्॥१५॥

यदाप्यनन्तं पप्रच्छज्ञानमेकं वसुन्धरा।
बभूव मूकवत्सोऽपिसिद्धान्तं कर्तुमक्षमः॥१६॥

तदा त्वां च स तुष्टावसन्त्रस्तः कश्यपाज्ञया।
ततश्चकार सिद्धान्तंनिर्मलं भ्रमभञ्जनम्॥१७॥

व्यासः पुराणसूत्रं चपप्रच्छ वाल्मिकिं यदा।
मौनीभूतः स सस्मारत्वामेव जगदम्बिकाम्॥१८॥

तदा चकार सिद्धान्तंत्वद्वरेण मुनीश्वरः।
स प्राप निर्मलं ज्ञानंप्रमादध्वंसकारणम्॥१९॥

पुराण सूत्रं श्रुत्वा सव्यासः कृष्णकलोद्भवः।
त्वां सिषेवे च दध्यौ तंशतवर्षं च पुष्क्करे॥२०॥

तदा त्वत्तो वरं प्राप्यस कवीन्द्रो बभूव ह।
तदा वेदविभागं चपुराणानि चकार ह॥२१॥

यदा महेन्द्रे पप्रच्छतत्त्वज्ञानं शिवा शिवम्।
क्षणं त्वामेव सञ्चिन्त्यतस्यै ज्ञानं दधौ विभुः॥२२॥

पप्रच्छ शब्दशास्त्रं चमहेन्द्रस्च बृहस्पतिम्।
दिव्यं वर्षसहस्रं चस त्वां दध्यौ च पुष्करे॥२३॥

तदा त्वत्तो वरं प्राप्यदिव्यं वर्षसहस्रकम्।
उवाच शब्दशास्त्रं चतदर्थं च सुरेश्वरम्॥२४॥

अध्यापिताश्च यैः शिष्याःयैरधीतं मुनीश्वरैः।
ते च त्वां परिसञ्चिन्त्यप्रवर्तन्ते सुरेश्वरि॥२५॥

त्वं संस्तुता पूजिताच मुनीन्द्रमनुमानवैः।
दैत्यैश्च सुरैश्चापिब्रह्मविष्णुशिवादिभिः॥२६॥

जडीभूतः सहस्रास्यःपञ्चवक्त्रश्चतुर्मुखः।
यां स्तोतुं किमहं स्तौमितामेकास्येन मानवः॥२७॥

इत्युक्त्वा याज्ञवल्क्यश्चभक्तिनम्रात्मकन्धरः।
प्रणनाम निराहारोरुरोद च मुहुर्मुहुः॥२८॥

तदा ज्योतिः स्वरूपा सातेनाऽदृष्टाऽप्युवाच तम्।
सुकवीन्द्रो भवेत्युक्त्वावैकुण्ठं च जगाम ह॥२९॥

महामूर्खश्च दुर्मेधावर्षमेकं च यः पठेत्।
स पण्डितश्च मेधावीसुकविश्च भवेद्ध्रुवम्॥३०॥

॥ इति श्रीब्रह्मवैवर्ते महापुराणे प्रकृतिखण्डे नारदनारायणसंवादे
याज्ञवल्क्योक्त वाणीस्तवनं नाम पञ्चमोऽध्यायः संपूर्णं ॥

---

॥ Shri Saraswati Stotram | Vaani Stavanam ॥

॥ Yajnavalkya Uvacha ॥

Kripaam Kuru Jaganmatar-Maam-Evam-Hata-Tejasam |
Guru-Shaapat-Smriti-Bhrashtam Vidya-Heenam Cha Duhkhitam ||1||

Jnaanam Dehi Smritim Dehi Vidyaam Dehi Devate |
Pratishthaam Kavitaam Dehi Shaaktam Shishya-Prabodhikaam ||2||

Grantha-Nirmiti-Shaktim Cha Sachchhishyam Supratishthitam |
Pratibhaam Satsabhaayaam Cha Vichaara-Kshamataam Shubhaam ||3||

Luptaam Sarvaam Daiva-Vashaan-Navam Kuru Punah Punah |
Yathaa-Ankuram Janayati Bhagavaan-Yoga-Maayayaa ||4||

Brahma-Svaroopaa Paramaa-Jyoti-Roopaa Sanaatanee |
Sarva-Vidyaa-Adhi-Devee Yaa Tasyai Vaanyai Namo Namah ||5||

Yayaa Vinaa Jagat-Sarvam Shashvaj-Jeevan-Mritam Sadaa |
Jnaanaa-Adhi-Devee Yaa Tasyai Sarasvatyai Namo Namah ||6||

Yayaa Vinaa Jagat-Sarvam Mookam-Unmattavat-Sadaa |
Vaag-Adhishthaaatri-Devee Yaa Tasyai Vaanyai Namo Namah ||7||

Hima-Chandana-Kundendu-Kumudaa-Ambhoja-Sannibhaa |
Varnaa-Adhi-Devee Yaa Tasyai Cha-Aksharaayai Namo Namah ||8||

Visarga Bindu-Maatraanaam Yad-Adhishthanam-Eva Cha |
Ittham Tvam Geeyase Sadbhir-Bhaaratyai Te Namo Namah ||9||

Yayaa Vinaa-Atra Sankhyaakrit Sankhyaam Kartum Na Shaknute |
Kaala Sankhyaa-Svaroopaa Yaa Tasyai Devyai Namo Namah ||10||

Vyaakhyaa-Svaroopaa Yaa Devee Vyaakhyaa-Adhishthaaatri-Devataa |
Bhrama-Siddhaanta-Roopaa Yaa Tasyai Devyai Namo Namah ||11||

Smriti-Shaktir-Jnaana-Shaktir-Buddhi-Shakti-Svaroopinee |
Pratibhaa-Kalpanaa-Shaktir-Yaa Cha Tasyai Namo Namah ||12||

Sanat-Kumaaro Brahmaanam Jnaanam Paprachchha Yatra Vai |
Babhooova Jadavat-So-Api Siddhaantam Kartum-Akshamah ||13||

Tadaa-Aajagaama Bhagavaan-Aatmaa-Shri-Krishna Eeshvarah |
Uvaacha Sa Cha Tam Stauhi Vaaneem-Iti Prajaapate ||14||

Sa Cha Tushtaava Taam Brahmaa-Cha-Aajnayaa Paramaatmanah |
Chakaara Tat-Prasaadena Tadaa Siddhaantam-Uttamam ||15||

Yadaa-Api-Anantam Paprachchha Jnaanam-Ekam Vasundharaa |
Babhooova Mookavat-So-Api Siddhaantam Kartum-Akshamah ||16||

Tadaa Tvaam Cha Sa Tushtaava Santrastah Kashyapaa-Ajnayaa |
Tatash-Chakaara Siddhaantam Nirmalam Bhrama-Bhanjanam ||17||

Vyaasah Puraana-Sootram Cha Paprachchha Vaalmikeem Yadaa |
Maunee-Bhootah Sa Sasmaara Tvaam-Eva Jagadambikaam ||18||

Tadaa Chakaara Siddhaantam Tvad-Varena Muneeshvarah |
Sa Praapa Nirmalam Jnaanam Pramaada-Dhvamsa-Kaaranam ||19||

Puraana Sootram Shrutvaa Sa Vyaasah Krishna-Kalodbhavah |
Tvaam Sisheve Cha Dadhyau Tam Shata-Varsham Cha Pushkare ||20||

Tadaa Tvatto Varam Praapya Sa Kaveendro Babhooova Ha |
Tadaa Veda-Vibhaagam Cha Puraanaani Chakaara Ha ||21||

Yadaa Mahendre Paprachchha Tattva-Jnaanam Shivaa Shivam |
Kshanam Tvaam-Eva Sanchintya Tasyai Jnaanam Dadhau Vibhuh ||22||

Paprachchha Shabda-Shaastram Cha Mahendrascha Brihaspatim |
Divyam Varsha-Sahasram Cha Sa Tvaam Dadhyau Cha Pushkare ||23||

Tadaa Tvatto Varam Praapya Divyam Varsha-Sahaasrakam |
Uvaacha Shabda-Shaastram Cha Tad-Artham Cha Sureshvaram ||24||

Adhyaapitaash-Cha Yaih Shishyaah Yair-Adheetam Muneeshvaraih |
Te Cha Tvaam Parisanchintya Pravartante Sureshvari ||25||

Tvam Samstutaa Poojitaa-Cha Muneendra-Manu-Maanavaih |
Daityaish-Cha Suraish-Chaapi Brahma-Vishnu-Shivaadibhih ||26||

Jadee-Bhootah Sahasraasyah Pancha-Vaktrash-Chaturmukhah |
Yaam Stotum Kim-Aham Staumi Taam-Ekaasyena Maanavah ||27||

Ity-Uktvaa Yaajnavalkyas-Cha Bhakti-Namra-Aatma-Kandharah |
Prananaam Niraahaaro Ruroda Cha Muhur-Muhuh ||28||

Tadaa Jyotih Svaroopaa Saa Tenaa-Adrishta-Api-Uvaacha Tam |
Sukaveendro Bhavet-Yuktvaa Vaikuntham Cha Jagaama Ha ||29||

Mahaa-Moorkhash-Cha Durmedhaav-Arsham-Ekam Cha Yah Pathet |
Sa Panditash-Cha Medhaavee Sukavish-Cha Bhaved-Dhruvam ||30||

॥ Iti Shri Brahmavaivarte Mahapurane Prakriti-Khande Narada-Narayana-Samvade
Yajnavalkya-Ukta Vaani-Stavanam Nama Panchamo-Adhyayah Sampurnam ॥`
};

async function addVaaniStavanam() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if Vaani Stavanam already exists
    const existing = await Devotional.findOne({
      title: { $regex: /वाणी स्तवनं|Vaani Stavanam/i }
    });

    if (existing) {
      existing.title = vaaniStavanam.title;
      existing.lyrics = vaaniStavanam.lyrics;
      existing.description = vaaniStavanam.description;
      existing.deity = vaaniStavanam.deity;
      existing.category = vaaniStavanam.category;
      existing.language = vaaniStavanam.language;
      existing.updatedAt = new Date();
      await existing.save();
      console.log('✅ Updated existing Vaani Stavanam with complete 30-verse version');
      console.log('   ID:', existing._id);
    } else {
      const doc = await Devotional.create(vaaniStavanam);
      console.log('✅ Inserted new Vaani Stavanam (30 verses)');
      console.log('   ID:', doc._id);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addVaaniStavanam();
