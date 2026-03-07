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

const ramaTandavaStotram = {
  title: 'श्रीरामताण्डवस्तोत्रम् (Shri Rama Tandava Stotram)',
  deity: 'Rama',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Rama Tandava Stotram is a powerful hymn composed by Shri Bhagavatananda Guru, describing the fierce cosmic dance (Tandava) of Lord Rama during the battle of Lanka. Spoken by Indra and the Devas, this stotram glorifies Rama\'s wrathful warrior form as He destroys the Rakshasa armies, protects His devotees, and re-establishes Dharma. It is part of the Shri Raghavendracharita.',
  lyrics: `॥ श्रीरामताण्डवस्तोत्रम् ॥

॥ इन्द्रादयो ऊचुः ॥

जटाकटाहयुक्तमुण्डप्रान्तविस्तृतं हरेः
अपाङ्गक्रुद्धदर्शनोपहार चूर्णकुन्तलः।
प्रचण्डवेगकारणेन पिञ्जलः प्रतिग्रहः
स क्रुद्धताण्डवस्वरूपधृग्विराजते हरिः॥१॥

अथेह व्यूहपार्ष्णिप्राग्वरूथिनी निषङ्गिनः
तथाञ्जनेयऋक्षभूपसौरबालिनन्दनाः।
प्रचण्डदानवानलं समुद्रतुल्यनाशकाः
नमोऽस्तुते सुरारिचक्रभक्षकाय मृत्यवे॥२॥

कलेवरे कषायवासहस्तकार्मुकं हरेः
उपासनोपसङ्गमार्थधृग्विशाखमण्डलम्।
हृदि स्मरन् दशाकृतेः कुचक्रचौर्यपातकं
विदार्यते प्रचण्डताण्डवाकृतिः स राघवः॥३॥

प्रकाण्डकाण्डकाण्डकर्मदेहछिद्रकारणं
कुकूटकूटकूटकौणपात्मजाभिमर्दनम्।
तथागुणङ्गुणङ्गुणङ्गुणङ्गुणेन दर्शयन्
कृपीटकेशलङ्घ्यमीशमेकराघवं भजे॥४॥

सवानरान्वितः तथाप्लुतं शरीरमसृजा
विरोधिमेदसाग्रमांसगुल्मकालखण्डनैः।
महासिपाशशक्तिदण्डधारकैः निशाचरैः
परिप्लुतं कृतं शवैश्च येन भूमिमण्डलम्॥५॥

विशालदंष्ट्रकुम्भकर्णमेघरावकारकैः
तथाहिरावणाद्यकम्पनातिकायजित्वरैः।
सुरक्षितां मनोरमां सुवर्णलङ्कनागरीं
निजास्त्रसङ्कुलैरभेद्यकोटमर्दनं कृतः॥६॥

प्रबुद्धबुद्धयोगिभिः महर्षिसिद्धचारणैः
विदेहजाप्रियः सदानुतो स्तुतो च स्वस्तिभिः।
पुलस्त्यनन्दनात्मजस्य मुण्डरुण्डछेदनं
सुरारियूथभेदनं विलोकयामि साम्प्रतम्॥७॥

करालकालरूपिणं महोग्रचापधारिणं
कुमोहग्रस्तमर्कटाच्छभल्लत्राणकारणम्।
विभीषणादिभिः सदाभिषेणनेऽभिचिन्तकं
भजामि जित्वरं तथोर्मिलापतेः प्रियाग्रजम्॥८॥

इतस्ततः मुहुर्मुहुः परिभ्रमन्ति कौन्तिकाः
अनुप्लवप्रवाहप्रासिकाश्च वैजयन्तिकाः।
मृधे प्रभाकरस्य वंशकीर्तिनोऽपदानतां
अभिक्रमेण राघवस्य ताण्डवाकृतेः गताः॥९॥

निराकृतिं निरामयं तथादिसृष्टिकारणं
महोज्ज्वलं अजं विभुं पुराणपूरुषं हरिम्।
निरङ्कुशं निजात्मभक्तजन्ममृत्युनाशकं
अधर्ममार्गघातकं कपीशव्यूहनायकम्॥१०॥

करालपालिचक्रशूलतीक्ष्णभिन्दिपालकैः
कुठारसर्वलासिधेनुकेलिशल्यमुद्गरैः।
सुपुष्करेण पुष्कराञ्च पुष्करास्त्रमारणैः
सदाप्लुतं निशाचरैः सुपुष्करञ्च पुष्करम्॥११॥

प्रपन्नभक्तरक्षकं वसुन्धरात्मजाप्रियं
कपीशवृन्दसेवितं समस्तदूषणापहम्।
सुरासुराभिवन्दितं निशाचरान्तकं विभुं
जगत्प्रशस्तिकारणं भजेह राममीश्वरम्॥१२॥

॥ इति श्रीभागवतानन्दगुरुणा विरचिते श्रीराघवेन्द्रचरिते
इन्द्रादि देवगणैः कृतं श्रीरामताण्डवस्तोत्रं सम्पूर्णम् ॥

---

॥ Shri Rama Tandava Stotram ॥

॥ Indradayo Uchuh ॥

Jatakatahayuktamundaprantavistritam Hareh
Apangakruddhadarshanopahara Churnakuntlah.
Prachandavegakaranena Pinjalah Pratigrahah
Sa Kruddhatandavasvarupadhrigvirajate Harih ||1||

Atheha Vyuhparshnipraagruuthini Nishanginah
Tathanjaneyrikshabhuupasaurabalinandanah.
Prachandadanavanalam Samudratulyanaashakah
Namo'stute Surarichakrabhakshakaya Mrityave ||2||

Kalevare Kashayavasahastakarmukam Hareh
Upasanopasangamarthadhrigvishakhamandalam.
Hridi Smaran Dashakriteh Kuchakrachauryapatakam
Vidaryate Prachandatandavakritih Sa Raghavah ||3||

Prakandakandakandakarmadehachhidrakaranam
Kukukutakutakutakaunapatmajaabhimardanam.
Tathagunanggunanggunanggunanggunena Darshayan
Kripitakeshalanghyamishamekaraghavam Bhaje ||4||

Savanaranvitah Tathaaplutam Shariramasrija
Virodhimedasagramansagulmakaalakhandanaih.
Mahasipaashashaktidandadharakaih Nishacharaih
Pariplutam Kritam Shavaishcha Yena Bhumimandalam ||5||

Vishaladamshtrakumbhakarnameghaaraavakarakaih
Tathahiravanyadyakampanatikaayajitvbraih.
Surakshitam Manoramam Suvarnalankanagarim
Nijastrasankulairabheedyakotamardanam Kritah ||6||

Prabuddhabuddhayogibhih Maharshisiddhacharanaih
Videhajaapriyah Sadaanuto Stuto Cha Svastibhih.
Pulastyanandanatmajasya Mundarundachheedanam
Surariyuthbhedanam Vilokayami Sampratam ||7||

Karalakalarupinam Mahograchaapadharinam
Kumohagrastamakartaachchhabhalltranakaranam.
Vibhishanadibhih Sadabhishenanebhichintakam
Bhajami Jitvaram Tathormilaapateh Priyagrajam ||8||

Itastatah Muhurmuhu Paribhramanti Kauntikah
Anuplavapravahaprasikashcha Vaijayantikah.
Mridhe Prabhakarasya Vamshakirtinoapadanatam
Abhikramena Raghavasya Tandavakriteh Gatah ||9||

Nirakritim Niramayam Tathadisrishtikanaram
Mahojjvalam Ajam Vibhum Puraanapurusham Harim.
Nirankusham Nijatmabhaktajanmamrityunaashakam
Adharmamargaghatakam Kapishavyuhanayakam ||10||

Karalaapalichakrashulatikshnabhindipalakaih
Kutharasarvalasidhenukeilishalyamudgaraih.
Supushkarena Pushkaranjcha Pushkarastramaaranaih
Sadaplutam Nishacharaih Supushkaranjcha Pushkaram ||11||

Prapannabhaktarakshakam Vasundharatmajapriyam
Kapishavrindasevitam Samastadushanapham.
Surasurabhinvanditam Nishacharantakam Vibhum
Jagatprashastikanaram Bhajeha Ramamisvaram ||12||

॥ Iti Shri Bhagavatananda Guruna Virachite Shri Raghavendracharite
Indradi Devaganaih Kritam Shri Rama Tandava Stotram Sampurnam ॥`
};

async function addRamaTandavaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: ramaTandavaStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Shri Rama Tandava Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(ramaTandavaStotram);
      await doc.save();
      console.log('✓  Added: ' + ramaTandavaStotram.title);
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

addRamaTandavaStotram();
