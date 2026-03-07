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

const saraswatiStotram = {
  title: 'श्री सरस्वती स्तोत्रम् (Shri Saraswati Stotram)',
  deity: 'Saraswati',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'A prayer to Goddess Saraswati, the deity of knowledge, music, arts, and learning. This complete 16-verse stotra enhances intellect, wisdom, and removes ignorance.',
  lyrics: `॥ श्री सरस्वती स्तोत्रम् ॥

या कुन्देन्दु-तुषारहार-धवला या शुभ्र-वस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।
या ब्रह्माच्युत-शङ्कर-प्रभृतिभिर्देवैः सदा पूजिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥१॥

दोर्भिर्युक्ता चतुर्भिः स्फटिकमणिमयीमक्षमालां दधाना
हस्तेनैकेन पद्मं सितमपि च शुकं पुस्तकं चापरेण।
भासा कुन्देन्दु-शङ्खस्फटिकमणिनिभा भासमानाऽसमाना
सा मे वाग्देवतेयं निवसतु वदने सर्वदा सुप्रसन्ना॥२॥

आशासु राशी भवदंगवल्लि भासैव दासीकृत-दुग्धसिन्धुम्।
मन्दस्मितैर्निन्दित-शारदेन्दुं वन्देऽरविन्दासन-सुन्दरि त्वाम्॥३॥

शारदा शारदाम्बोजवदना वदनाम्बुजे।
सर्वदा सर्वदास्माकं सन्निधिं सन्निधिं क्रियात्॥४॥

सरस्वतीं च तां नौमि वागधिष्ठातृ-देवताम्।
देवत्वं प्रतिपद्यन्ते यदनुग्रहतो जनाः॥५॥

पातु नो निकषग्रावा मतिहेम्नः सरस्वती।
प्राज्ञेतरपरिच्छेदं वचसैव करोति या॥६॥

शुद्धां ब्रह्मविचारसारपरमा-माद्यां जगद्व्यापिनीं
वीणापुस्तकधारिणीमभयदां जाड्यान्धकारापहाम्।
हस्ते स्पाटिकमालिकां विदधतीं पद्मासने संस्थितां
वन्दे तां परमेश्वरीं भगवतीं बुद्धिप्रदां शारदाम्॥७॥

वीणाधरे विपुलमंगलदानशीले
भक्तार्तिनाशिनि विरिंचिहरीशवन्द्ये।
कीर्तिप्रदेऽखिलमनोरथदे महार्हे
विद्याप्रदायिनि सरस्वति नौमि नित्यम्॥८॥

श्वेताब्जपूर्ण-विमलासन-संस्थिते हे
श्वेताम्बरावृतमनोहरमंजुगात्रे।
उद्यन्मनोज्ञ-सितपंकजमंजुलास्ये
विद्याप्रदायिनि सरस्वति नौमि नित्यम्॥९॥

मातस्त्वदीय-पदपंकज-भक्तियुक्ता
ये त्वां भजन्ति निखिलानपरान्विहाय।
ते निर्जरत्वमिह यान्ति कलेवरेण
भूवह्नि-वायु-गगनाम्बु-विनिर्मितेन॥१०॥

मोहान्धकार-भरिते हृदये मदीये
मातः सदैव कुरु वासमुदारभावे।
स्वीयाखिलावयव-निर्मलसुप्रभाभिः
शीघ्रं विनाशय मनोगतमन्धकारम्॥११॥

ब्रह्मा जगत् सृजति पालयतीन्दिरेशः
शम्भुर्विनाशयति देवि तव प्रभावैः।
न स्यात्कृपा यदि तव प्रकटप्रभावे
न स्युः कथंचिदपि ते निजकार्यदक्षाः॥१२॥

लक्ष्मिर्मेधा धरा पुष्टिर्गौरी तृष्टिः प्रभा धृतिः।
एताभिः पाहि तनुभिरष्टभिर्मां सरस्वती॥१३॥

सरस्वत्यै नमो नित्यं भद्रकाल्यै नमो नमः।
वेद-वेदान्त-वेदांग-विद्यास्थानेभ्य एव च॥१४॥

सरस्वति महाभागे विद्ये कमललोचने।
विद्यारूपे विशालाक्षि विद्यां देहि नमोस्तु ते॥१५॥

यदक्षर-पदभ्रष्टं मात्राहीनं च यद्भवेत्।
तत्सर्वं क्षम्यतां देवि प्रसीद परमेश्वरि॥१६॥

॥ इति श्रीसरस्वती स्तोत्रम् संपूर्णं ॥

---

॥ Shri Saraswati Stotram ॥

Ya Kundendu-Tusharahara-Dhavala Ya Shubhra-Vastravrita
Ya Veena-Vara-Danda-Mandita-Kara Ya Shveta-Padmasana |
Ya Brahmachyuta-Shankara-Prabhritibhir-Devaih Sada Pujita
Sa Mam Patu Sarasvati Bhagavati Nihshesha-Jadyapaha ||1||

Dorbhiryukta Chaturbhih Sphatika-Mani-Mayim-Akshamalam Dadhana
Hastenaikena Padmam Sitamapi Cha Shukam Pustakam Chaparena |
Bhasa Kundendu-Shankha-Sphatika-Mani-Nibha Bhasamana-Asamana
Sa Me Vagdevateyam Nivasatu Vadane Sarvada Suprasanna ||2||

Ashasu Rashi Bhavadanga-Valli Bhasaiva Dasikrita-Dugdha-Sindhum |
Mandasmitair-Nindita-Sharadendu Vande-Arvindasan-Sundari Tvam ||3||

Sharada Sharadamboja-Vadana Vadanambuje |
Sarvada Sarvadasmakam Sannidhim Sannidhim Kriyat ||4||

Sarasvatim Cha Tam Naumi Vagadhishtatri-Devatam |
Devatvam Pratipadyante Yadanugrahato Janah ||5||

Patu No Nikasha-Grava Mati-Hemnah Sarasvati |
Prajnetara-Parichchhedam Vachasaiva Karoti Ya ||6||

Shuddham Brahma-Vichara-Sara-Parama-Madyam Jagadvyapinim
Veena-Pustaka-Dharinim-Abhayadam Jadyandhkarapham |
Haste Spatika-Malikam Vidadhatim Padmasane Samsthitam
Vande Tam Parameshvarim Bhagavatim Buddhipradam Sharadam ||7||

Veenadharae Vipula-Mangala-Dana-Sheele
Bhaktarti-Nashini Virinchi-Harisha-Vandye |
Kirti-Prade-Akhila-Manorathade Maharhe
Vidya-Pradayini Sarasvati Naumi Nityam ||8||

Shvetabja-Purna-Vimalasana-Samsthite He
Shvetambara-Avrita-Manohara-Manju-Gatre |
Udyan-Manojna-Sita-Pankaja-Manjulasye
Vidya-Pradayini Sarasvati Naumi Nityam ||9||

Matas-Tvadiya-Pada-Pankaja-Bhakti-Yukta
Ye Tvam Bhajanti Nikhilan-Aparan-Vihaya |
Te Nirjaratvam-Iha Yanti Kalevarena
Bhuvahni-Vayu-Gaganambu-Vinirmitena ||10||

Mohandhkara-Bharite Hridaye Madiye
Matah Sadaiva Kuru Vasamudara-Bhave |
Sviya-Akhilavayava-Nirmala-Suprabhabhih
Shighram Vinashaya Manogatam-Andhakaram ||11||

Brahma Jagat Srijati Palayatindireshah
Shambhur-Vinashayati Devi Tava Prabhavaih |
Na Syat-Kripa Yadi Tava Prakata-Prabhave
Na Syuh Kathamchid-Api Te Nijakarya-Dakshah ||12||

Lakshmirmedha Dhara Pushtir-Gauri Trishtih Prabha Dhritih |
Etabhih Pahi Tanubhir-Ashtabhirmam Sarasvati ||13||

Sarasvatyai Namo Nityam Bhadrakalyai Namo Namah |
Veda-Vedanta-Vedanga-Vidyasthanebhya Eva Cha ||14||

Sarasvati Mahabhage Vidye Kamala-Lochane |
Vidya-Rupe Vishalakshi Vidyam Dehi Namostu Te ||15||

Yadakshara-Pada-Bhrashtam Matra-Hinam Cha Yad-Bhavet |
Tat-Sarvam Kshamyatam Devi Prasida Parameshvari ||16||

॥ Iti Shri Saraswati Stotram Sampurnam ॥`
};

async function updateSaraswatiStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if Saraswati Stotram already exists
    const existing = await Devotional.findOne({
      title: { $regex: /सरस्वती स्तोत्रम्|Saraswati Stotram/i }
    });

    if (existing) {
      // Update existing record with full 16-verse version
      existing.lyrics = saraswatiStotram.lyrics;
      existing.description = saraswatiStotram.description;
      existing.updatedAt = new Date();
      await existing.save();
      console.log('✅ Updated existing Saraswati Stotram with complete 16-verse version');
      console.log('   ID:', existing._id);
    } else {
      // Insert new
      const doc = await Devotional.create(saraswatiStotram);
      console.log('✅ Inserted new Saraswati Stotram (16 verses)');
      console.log('   ID:', doc._id);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateSaraswatiStotram();
