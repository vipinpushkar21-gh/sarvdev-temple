const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Hindi' },
  deity: { type: String },
  lyrics: { type: String },
  audioUrl: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function addHanumatTandavaStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const title = 'श्रीहनुमत्ताण्डवस्तोत्रम्';
    const existing = await Devotional.findOne({ title, deity: 'Hanuman', category: 'Stotra' });
    if (existing) {
      console.log('Stotram already exists:', existing._id);
      await mongoose.connection.close();
      return;
    }

    const lyrics = `॥ श्रीहनुमत्ताण्डवस्तोत्रम् ॥\n\n॥ ध्यान ॥\n\nवन्दे सिन्दूरवर्णाभं लोहिताम्बरभूषितम्।\nरक्ताङ्गरागशोभाढ्यं शोणापुच्छं कपीश्वरम्॥\n\n॥ स्तोत्र पाठ ॥\n\nभजे समीरनन्दनं, सुभक्तचित्तरञ्जनं,\nदिनेशरूपभक्षकं, समस्तभक्तरक्षकम्।\nसुकण्ठकार्यसाधकं, विपक्षपक्षबाधकं,\nसमुद्रपारगामिनं, नमामि सिद्धकामिनम्॥1॥\n\nसुशङ्कितं सुकण्ठभुक्तवान् हि यो हितं\nवचस्त्वमाशु धैर्य्यमाश्रयात्र वो भयं कदापि न।\nइति प्लवङ्गनाथभाषितं निशम्य वान-\nराऽधिनाथ आप शं तदा, स रामदूत आश्रयः॥2॥\n\nसुदीर्घबाहुलोचनेन, पुच्छगुच्छशोभिना,\nभुजद्वयेन सोदरीं निजांसयुग्ममास्थितौ।\nकृतौ हि कोसलाधिपौ, कपीशराजसन्निधौ,\nविदहजेशलक्ष्मणौ, स मे शिवं करोत्वरम्॥3॥\n\nसुशब्दशास्त्रपारगं, विलोक्य रामचन्द्रमाः,\nकपीश नाथसेवकं, समस्तनीतिमार्गगम्।\nप्रशस्य लक्ष्मणं प्रति, प्रलम्बबाहुभूषितः\nकपीन्द्रसख्यमाकरोत्, स्वकार्यसाधकः प्रभुः॥4॥\n\nप्रचण्डवेगधारिणं, नगेन्द्रगर्वहारिणं,\nफणीशमातृगर्वहृद्दृशास्यवासनाशकृत्।\nविभीषणेन सख्यकृद्विदेह जातितापहृत्,\nसुकण्ठकार्यसाधकं, नमामि यातुधतकम्॥5॥\n\nनमामि पुष्पमौलिनं, सुवर्णवर्णधारिणं\nगदायुधेन भूषितं, किरीटकुण्डलान्वितम्।\nसुपुच्छगुच्छतुच्छलंकदाहकं सुनायकं\nविपक्षपक्षराक्षसेन्द्र-सर्ववंशनाशकम्॥6॥\n\nरघूत्तमस्य सेवकं नमामि लक्ष्मणप्रियं\nदिनेशवंशभूषणस्य मुद्रीकाप्रदर्शकम्।\nविदेहजातिशोकतापहारिणम् प्रहारिणम्\nसुसूक्ष्मरूपधारिणं नमामि दीर्घरूपिणम्॥7॥\n\nनभस्वदात्मजेन भास्वता त्वया कृता\nमहासहा यता यया द्वयोर्हितं ह्यभूत्स्वकृत्यतः।\nसुकण्ठ आप तारकां रघूत्तमो विदेहजां\nनिपात्य वालिनं प्रभुस्ततो दशाननं खलम्॥8॥\n\nइमं स्तवं कुजेऽह्नि यः पठेत्सुचेतसा नरः\nकपीशनाथसेवको भुनक्तिसर्वसम्पदः।\nप्लवङ्गराजसत्कृपाकताक्षभाजनस्सदा\nन शत्रुतो भयं भवेत्कदापि तस्य नुस्त्विह॥9॥\n\nनेत्राङ्गनन्दधरणीवत्सरेऽनङ्गवासरे।\nलोकेश्वराख्यभट्टेन हनुमत्ताण्डवं कृतम्॥10॥\n\n॥ इति श्रीहनुमत्ताण्डवस्तोत्रम् सम्पूर्णम् ॥\n\n\n--- Roman English Transliteration ---\n\n॥ Shri Hanumat Tandava Stotram ॥\n\n॥ Dhyanam ॥\n\nVande Sindooravarnaabham Lohitaambarabhushitam.\nRaktaangaraagashobhaadhyam Shonaapuchchham Kapeeshvaram.\n\n॥ Stotra Paath ॥\n\nBhaje Sameeranandanam, Subhaktachittaranjanam,\nDineshroopabhakshakam, Samastabhaktarakshakam.\nSukanthakaryasaadhakam, Vipakshapakshabaadhakam,\nSamudrapaaraagaaminam, Namaami Siddhakaminam. ॥1॥\n\nSushankitam Sukanthabhaktavaan Hi Yo Hitam\nVachastvamAshu Dhairyamaashrayaatra Vo Bhayam Kadaapi Na.\nIti Plavanganathabhashitam Nishamya Vaan-\nRaa'dhinaatha Aapa Sham Tadaa, Sa Ramadoota Aashrayah. ॥2॥\n\nSudeerghaBaahulochanena, Puchchhaguchcshashobhinaa,\nBhujadvayena Sodareem Nijaansayugmamaasthitau.\nKritau Hi Kosalaadhipau, Kapeesharaajasannidhau,\nVidahajeshLakshmanau, Sa Me Shivam Karotvaram. ॥3॥\n\nSushabdashastrapaaragam, Vilokya Raamachandramaah,\nKapeesha Naathasevakam, Samastanitimaarggagam.\nPrashasy Lakshmanam Prati, Pralambabaahubhooshitah\nKapeendrasakhyamaakarot, Svakaryasaadhakah Prabhuh. ॥4॥\n\nPrachandavegadhaarinam, Nagendragarvaharinam,\nPhaneeshamaatrugarvahriddhrishaasyavaasanaashakrit.\nVibheeshanena Sakhyakridvideha Jaatitaapahrit,\nSukanthakaryasaadhakam, Namaami Yaatudhatakam. ॥5॥\n\nNamaami Pushpamaulinam, SuvarnaVarnadharinam\nGadaayudhena Bhooshitam, Kireetakundalaanvitam.\nSupuchchhaguchchtuchChhalankadaahakam Sunaayakam\nVipakshapakshaRakshasendra-Sarvavamshanashakam. ॥6॥\n\nRaghuttamasya Sevakam Namaami Lakshmanapriyam\nDineshavamshaBhooshanasya Mudrikaapradarshaakam.\nVidehajaatishokataapahaarinaam Praharinam\nSusookshmRoopadhaarinaam Namaami Deergharoopinaam. ॥7॥\n\nNabhasvadaatmajena Bhaaswataa Tvayaa Kritaa\nMahaasahaa Yataa Yayaa Dvayorhitam Hyabhuutswakrutyatah.\nSukantha Aapa Taarakaam Raghuttamo Videhajaam\nNipaatya Vaalinam Prabhustato Dashaananam Khalam. ॥8॥\n\nImam Stavam Kuje'hni Yah Pathetsuchetasaa Narah\nKapeeshanaathasevako Bhunaktisarvasampadah.\nPlavangaraajasatkripaakatakshabhaajanassadaa\nNa Shatruto Bhayam Bhavetkadaapi Tasya Nustviha. ॥9॥\n\nNetraanganandadharaneeVatsare'nangaVaasare.\nLokeshvaraakhyaBhattena HanumatTaandavam Kritam. ॥10॥\n\n॥ Iti Shri Hanumat Tandava Stotram Sampoornam ॥`;

    const doc = new Devotional({
      title,
      description: 'Shri Hanumat Tandava Stotram - A powerful stotra dedicated to Lord Hanuman, describing his divine dance (Tandava), composed by Lokeshvara Bhatta. Reciting this stotra on Tuesdays bestows fearlessness, removes enemies, and grants all prosperity by the grace of the monkey king.',
      category: 'Stotra',
      language: 'Hindi',
      deity: 'Hanuman',
      lyrics,
      status: 'approved'
    });

    const saved = await doc.save();
    console.log('✓ Added Hanumat Tandava Stotram with id:', saved._id);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding Hanumat Tandava Stotram:', err);
    process.exit(1);
  }
}

addHanumatTandavaStotram();
