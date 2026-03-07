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

const kanakadhara = {
  title: 'कनकधारा स्तोत्रम् (Kanakadhara Stotram)',
  deity: 'Lakshmi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Kanakadhara Stotram is composed by Jagadguru Adi Shankaracharya and dedicated to Goddess Lakshmi. It is recited to invoke the blessings of Goddess Lakshmi for wealth and prosperity. The word "Kanakadhara" means a stream of gold.',
  lyrics: `॥ कनकधारा स्तोत्रम् ॥
॥ श्रीमदाद्यशङ्कराचार्यविरचितम् ॥

अङ्गं हरेः पुलकभूषणमाश्रयन्ती
भृङ्गाङ्गनेव मुकुलाभरणं तमालम् ।
अङ्गीकृताऽखिल-विभूतिरपाङ्गलीला
माङ्गल्यदाऽस्तु मम मङ्गळदेवतायाः ॥१॥

मुग्धा मुहुर्विदधती वदने मुरारेः
प्रेमत्रपा-प्रणहितानि गताऽऽगतानि ।
मालादृशोर्मधुकरीव महोत्पले या
सा मे श्रियं दिशतु सागरसम्भवायाः ॥२॥

विश्वामरेन्द्रपद-वीभ्रमदानदक्ष
आनन्द-हेतुरधिकं मुरविद्विषोऽपि ।
ईषन्निषीदतु मयि क्षणमीक्षणर्द्ध-
मिन्दीवरोदर-सहोदरमिन्दिरायाः ॥३॥

आमीलिताक्षमधिगम्य मुदा मुकुन्द-
आनन्दकन्दमनिमेषमनङ्गतन्त्रम् ।
आकेकरस्थित-कनीनिकपक्ष्मनेत्रं
भूत्यै भवेन्मम भुजङ्गशयाङ्गनायाः ॥४॥

बाह्वन्तरे मधुजितः श्रित कौस्तुभे या
हारावलीव हरिनीलमयी विभाति ।
कामप्रदा भगवतोऽपि कटाक्षमाला
कल्याणमावहतु मे कमलालयायाः ॥५॥

कालाम्बुदाळि-ललितोरसि कैटभारे-
धाराधरे स्फुरति या तडिदङ्गनेव ।
मातुः समस्तजगतां महनीयमूर्ति-
भद्राणि मे दिशतु भार्गवनन्दनायाः ॥६॥

प्राप्तं पदं प्रथमतः किल यत् प्रभावान्
माङ्गल्यभाजि मधुमाथिनि मन्मथेन ।
मय्यापतेत्तदिह मन्थर-मीक्षणार्धं
मन्दाऽलसञ्च मकरालय-कन्यकायाः ॥७॥

दद्याद् दयानुपवनो द्रविणाम्बुधारा-
मस्मिन्नकिञ्चन विहङ्गशिशौ विषण्णे ।
दुष्कर्म-घर्ममपनीय चिराय दूरं
नारायण-प्रणयिनी नयनाम्बुवाहः ॥८॥

इष्टाविशिष्टमतयोऽपि यया दयार्द्र-
दृष्ट्या त्रिविष्टपपदं सुलभं लभन्ते ।
दृष्टिः प्रहृष्ट-कमलोदर-दीप्तिरिष्टां
पुष्टिं कृषीष्ट मम पुष्करविष्टरायाः ॥९॥

गीर्देवतेति गरुडध्वजभामिनीति
शाकम्भरीति शशिशेखर-वल्लभेति ।
सृष्टि-स्थिति-प्रलय-केलिषु संस्थितायै
तस्यै नमस्त्रिभुवनैकगुरोस्तरुण्यै ॥१०॥

श्रुत्यै नमोऽस्तु शुभकर्मफलप्रसूत्यै
रत्यै नमोऽस्तु रमणीय गुणाश्रयायै ।
शक्त्यै नमोऽस्तु शतपत्र निकेतनायै
पुष्ट्यै नमोऽस्तु पुरुषोत्तम-वल्लभायै ॥११॥

नमोऽस्तु नालीक-निभाननायै
नमोऽस्तु दुग्धोदधि-जन्मभूत्यै ।
नमोऽस्तु सोमामृत-सोदरायै
नमोऽस्तु नारायण-वल्लभायै ॥१२॥

नमोऽस्तु हेमाम्बुजपीठिकायै
नमोऽस्तु भूमण्डलनायिकायै ।
नमोऽस्तु देवादिदयापरायै
नमोऽस्तु शार्ङ्गायुधवल्लभायै ॥१३॥

नमोऽस्तु देव्यै भृगुनन्दनायै
नमोऽस्तु विष्णोरुरसि स्थितायै ।
नमोऽस्तु लक्ष्म्यै कमलालयायै
नमोऽस्तु दामोदरवल्लभायै ॥१४॥

नमोऽस्तु कान्त्यै कमलेक्षणायै
नमोऽस्तु भूत्यै भुवनप्रसूत्यै ।
नमोऽस्तु देवादिभिरर्चितायै
नमोऽस्तु नन्दात्मजवल्लभायै ॥१५॥

सम्पत्कराणि सकलेन्द्रिय-नन्दनानि
साम्राज्यदान विभवानि सरोरुहाक्षि ।
त्वद्-वन्दनानि दुरिताहरणोद्यतानि
मामेव मातरनिशं कलयन्तु नान्यत् ॥१६॥

यत्कटाक्ष-समुपासनाविधिः
सेवकस्य सकलार्थसम्पदः ।
सन्तनोति वचनाऽङ्गमानसैः
त्वां मुरारि-हृदयेश्वरीं भजे ॥१७॥

सरसिज-निलये सरोजहस्ते
धवळतरांशुक-गन्ध-माल्यशोभे ।
भगवति हरिवल्लभे मनोज्ञे
त्रिभुवन-भूतिकरि प्रसीद मह्यम् ॥१८॥

दिग्घस्तिभिः कनककुम्भमुखावसृष्ट-
स्वर्वाहिनीविमलचारु-जलप्लुताङ्गीम् ।
प्रातर्नमामि जगतां जननीमशेष-
लोकाधिराजगृहिणीममृताब्धिपुत्रीम् ॥१९॥

कमले कमलाक्षवल्लभे त्वं
करुणापूर-तरङ्गितैरपाङ्गैः ।
अवलोकय मामकिञ्चनानां
प्रथमं पात्रमकृत्रिमं दयायाः ॥२०॥

स्तुवन्ति ये स्तुतिभिरमीभिरन्वहं
त्रयीमयीं त्रिभुवनमातरं रमाम् ।
गुणाधिका गुरुतरभाग्यभागिनो
भवन्ति ते भुविबुधभाविताशयाः ॥२१॥

॥ श्रीमदाद्यशङ्कराचार्यविरचितं श्री कनकधारा स्तोत्रम् समाप्तम् ॥

---

॥ Kanakadhara Stotram ॥
॥ Composed by Jagadguru Adi Shankaracharya ॥

Angam Hareh Pulakabhushanamashrayanti
Bhringanganeva Mukulabharanam Tamalam |
Angikritakhila-Vibhutirapangalila
Mangalyadastu Mama Mangaladevtayah ||1||

Mugdha Muhurvidadhati Vadane Murarerh
Prematrapa-Pranahitani Gatagatani |
Maladrishormadhukariiva Mahotpale Ya
Sa Me Shriyam Dishatu Sagarasambhavayah ||2||

Vishvamarendrapada-Vibhramadanadaksha
Ananda-Heturadhikam Muravidvisho'pi |
Ishannishidatu Mayi Kshanamikshanarddha-
Mindiivarodara-Sahodaramindirayah ||3||

Amilitakshamadhigamya Muda Mukunda-
Anandakandanimeshamanangantantram |
Akekarasthita-Kaninikapakshmanetram
Bhutyai Bhavenmama Bhujangashayanganayah ||4||

Bahvantare Madhujitah Shrita Kaustubhe Ya
Haravaliva Hariniilamayii Vibhati |
Kamaprada Bhagavato'pi Katakshamala
Kalyanamavahatu Me Kamalalayayah ||5||

Kalambudali-Lalitorasi Kaitabhare-
Dharadhare Sphurati Ya Tadidanganeva |
Matuh Samasta Jagatam Mahaniyamurti-
Bhadrani Me Dishatu Bhargavanandanayah ||6||

Praptam Padam Prathamatah Kila Yat Prabhavan
Mangalyabhaji Madhumathini Manmathena |
Mayyapatettadiha Manthara-Mikshanardham
Mandalasancha Makaralaya-Kanyakayah ||7||

Dadyad Dayanupavano Dravinambudhara-
Masminnakimchana Vihangashishau Vishanne |
Dushkarma-Gharmamapaniya Chiraya Duram
Narayana-Pranayini Nayanambuvahah ||8||

Ishtavishishtamatayo'pi Yaya Dayardra-
Drishtya Trivishtapapadam Sulabham Labhante |
Drishtih Prahrishta-Kamalodara-Diptiristam
Pushtim Krishishta Mama Pushkaravishitarayah ||9||

Girdevateti Garudadhvajabhaminiti
Shakambahriti Shashishekhara-Vallabheti |
Srishti-Sthiti-Pralaya-Kelishu Samsthitayai
Tasyai Namastribhuvanaikagurostaurunyai ||10||

Shrutyai Namo'stu Shubhakarmaphala Prasutyai
Ratyai Namo'stu Ramaniya Gunashrayai |
Shaktyai Namo'stu Shatapatra Niketanayai
Pushtyai Namo'stu Purushottama-Vallabhayai ||11||

Namo'stu Nalika-Nibhananayai
Namo'stu Dugdhodadhi-Janmabhutyai |
Namo'stu Somamrita-Sodarayai
Namo'stu Narayana-Vallabhayai ||12||

Namo'stu Hemambujapithikayai
Namo'stu Bhumandala Nayikayai |
Namo'stu Devadidayaparayai
Namo'stu Sharngayudha Vallabhayai ||13||

Namo'stu Devyai Bhrigunandanayai
Namo'stu Vishnorurasi Sthitayai |
Namo'stu Lakshmyai Kamalalayai
Namo'stu Damodaravallabhayai ||14||

Namo'stu Kantyai Kamalekshanayai
Namo'stu Bhutyai Bhuvanaprasutyai |
Namo'stu Devadibhirarchitayai
Namo'stu Nandatmajavallabhayai ||15||

Sampatkarani Sakalendriya-Nandanani
Samrajyadana Vibhavani Sarohakshi |
Tvad-Vandanani Duritaharanodhyatani
Mameva Mataranisham Kalayantu Nanyat ||16||

Yatkataksha-Samupasanavidhih
Sevakasya Sakalarthasampadah |
Santanoti Vachanaangamanasaih
Tvam Murari-Hridayeshvarim Bhaje ||17||

Sarasija-Nilaye Sarojahaste
Dhavalataraamshuka-Gandha-Malyashobhe |
Bhagavati Harivallabhe Manojne
Tribhuvana-Bhutikari Prasida Mahyam ||18||

Diggastibhih Kanakakumbhamukhaavasrishta-
Svarvahiniivimalacharu-Jalaplutangiim |
Pratarnamami Jagatam Jananiimashesha-
Lokadhirajagrihiniim Amritabdhiputriim ||19||

Kamale Kamalakshavallabhe Tvam
Karunapura-Tarangitairapangaih |
Avalokaya Mamakinchanam
Prathamam Patramakritrimam Dayayah ||20||

Stuvanti Ye Stutibhiramiibhiranvaham
Trayiimayiim Tribhuvanamataaram Ramaam |
Gunadhika Gurutarabhagyabhagino
Bhavanti Te Bhuvi Budhabhavitasayah ||21||

॥ Shrimadadyashankaracharyavirachitam Shri Kanakadhara Stotram Samaptam ॥`
};

async function addKanakadhara() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: kanakadhara.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Kanakadhara Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(kanakadhara);
      await doc.save();
      console.log('✓  Added: ' + kanakadhara.title);
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

addKanakadhara();
