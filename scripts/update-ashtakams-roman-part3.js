const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: String, description: String, category: String, language: String,
  deity: String, lyrics: String, audio: String, status: String,
  createdAt: Date, updatedAt: Date
});
const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const updates = [
  {
    titleMatch: 'Shri Vishvanath Ashtakam',
    roman: `|| Shri Vishvanathashtakam ||

Gangataranga Ramaniya Jatakalapam
Gaurirantara Vibhushita Vamabhagam.
Narayana Priyam Ananga Madapaharam
Varanasipurapatim Bhaja Vishvanatham ||1||

Vachamagocharamanekagunasvarupam
Vagishvishnusurasevitapadapeetham.
Vamena Vigrahavarena Kalatravantam
Varanasipurapatim Bhaja Vishvanatham ||2||

Bhutadhipam Bhujagabhushana Bhushitangam
Vyaghrajinambaradharam Jatilam Trinetram.
Pashankushabhayyavarapradashulapanim
Varanasipurapatim Bhaja Vishvanatham ||3||

Shitamshushobhita Kiritavirajmanam
Bhalekshananalvishoshitapanchabanam.
Nagadhipaarchitabhasurakrnapuram
Varanasipurapatim Bhaja Vishvanatham ||4||

Panchaananam Duritamattamatangajanam
Nagantakam Danujapungavapannaganam.
Davanalm Maranashokjaratavenam
Varanasipurapatim Bhaja Vishvanatham ||5||

Tejomayam Sagunanirguna Madvitiya-
Manandakandamparajitamaprameyam.
Nagatmakam Sakalanishkalamatmarupam
Varanasipurapatim Bhaja Vishvanatham ||6||

Ragadidosharahitam Svajananurgam
Vairagyashantinilayam Girijasahayam.
Madhurydhairyasubhagam Garalabhiramam
Varanasipurapatim Bhaja Vishvanatham ||7||

Asham Vihaya Parihritya Parasya Nindam
Pape Ratim Cha Sunivarya Manah Samadhau.
Adaya Hritkamalmadhyagatam Paresham
Varanasipurapatim Bhaja Vishvanatham ||8||

Varanasipurapateh Stavanam Shivasya
Vyakhyatamshtakamidam Pathate Manushyah.
Vidyam Shriyam Vipulasaukhyamanantakirtim
Samprapya Dehavilaye Labhate Cha Moksham ||9||

Vishvanathashtakamidam Yah Pathechchhivasannidhau.
Shivalokamavapnoti Shivena Saha Modate ||10||

|| Iti Shri Maharshivyasapranitam Shri Vishvanathashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Shri Linga Ashtakam',
    roman: `|| Shri Lingashtakam ||

Brahmamurarsuarchitalingam
Nirmalabhasitashobhitalingam.
Janmajaduhkhavinashkalingam
Tat Pranamami Sadashivalingam ||1||

Devamunipravararchitalingam
Kamadahamkarunakara Lingam.
Ravanadarpvinashanalingam
Tat Pranamami Sadashiva Lingam ||2||

Sarvasugandhi Sulepitalingam
Buddhivavardhankaranlingam.
Siddhasurasuravanditalingam
Tat Pranamami Sadashiva Lingam ||3||

Kanakmahamani Bhushitalingam
Phanipatveshtita Shobhita Lingam.
Dakshasuyajnavinashana Lingam
Tat Pranamami Sadashiva Lingam ||4||

Kunkumachandanalepitalingam
Pankajaharasushobhitalingam.
Sanchitapapavinashanalingam
Tat Pranamami Sadashiva Lingam ||5||

Devganarchita Sevitalingam
Bhavairbhaktibhireva Cha Lingam.
Dinakrakotiprabhakaralingam
Tat Pranamami Sadashiva Lingam ||6||

Ashtadaloparivestitalingam
Sarvasamudbhavakaranlingam.
Ashtadaridravinashanalingam
Tat Pranamami Sadashiva Lingam ||7||

Surgurusuravarpujita Lingam
Survanpushpa Sadarchita Lingam.
Paratparam Paramatmaka Lingam
Tat Pranamami Sadashiva Lingam ||8||

Lingashtakamidam Punyam Yah Pathet Shivasannidhau.
Shivalokamavapnoti Shivena Saha Modate ||9||

|| Iti Shri Shiva Lingashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Shiva Ramashtakam',
    roman: `|| Shri Shivaramashtaka Stotram ||

Shivahare Shivarama Sakhe Prabho,
Trividhatapa-Nivarana He Vibho.
Aja Janeshvara Yadava Pahi Mam,
Shiva Hare Vijayam Kuru Me Varam ||1||

Kamala Lochana Rama Dayanidhe,
Hara Guro Gajarakshaka Gopate.
Shivatano Bhava Shankara Pahimam,
Shiva Hare Vijayam Kuru Me Varam ||2||

Svajanaranjana Mangalamandir,
Bhajati Tam Purusham Param Padam.
Bhavati Tasya Sukham Paramadbhutam,
Shivahare Vijayam Kuru Me Varam ||3||

Jaya Yudhishthira-Vallabha Bhupate,
Jaya Jayarjita-Punyapayonidhe.
Jaya Kripamaya Krishna Namo'stute,
Shiva Hare Vijayam Kuru Me Varam ||4||

Bhavavimochana Madhava Mapate,
Sukavi-Manasa Hamsa Shivarte.
Janaka Jarata Madhava Rakshmam,
Shiva Hare Vijayam Kuru Me Varam ||5||

Avani-Mandala-Mangala Mapate,
Jalada Sundara Rama Ramapate.
Nigama-Kirti-Gunarnava Gopate,
Shiva Hare Vijayam Kuru Me Varam ||6||

Patita-Pavana-Namamayee Lata,
Tava Yasho Vimalam Parigiyate.
Tadapi Madhava Mam Kimupekshase,
Shiva Hare Vijayam Kuru Me Varam ||7||

Amara Tapara Deva Ramapate,
Vinayatastva Nama Dhanopamam.
Mayi Katham Karunarnava Jayate,
Shiva Hare Vijayam Kuru Me Varam ||8||

Hanumatah Priya Chapa Kara Prabho,
Surasarid-Dhritashekhar He Guro.
Mama Vibho Kimu Vismaranam Kritam,
Shiva Hare Vijayam Kuru Me Varam ||9||

Nara Hareti Param Jana Sundaram,
Pathati Yah Shivaramakritastavam.
Vishati Rama-Rama Charanambuje,
Shiva Hare Vijayam Kuru Me Varam ||10||

Prataruuthaya Yo Bhaktya Pathadekagramanasah.
Vijayo Jayate Tasya Vishnu Sannidhyamapnuyat ||11||

|| Iti Shri Ramanandswamina Virachitam Shri Shivaramashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Shri Pashupati Ashtakam',
    roman: `|| Shri Pashupatyashtakam ||

|| Dhyanam ||
Dhyayennityam Mahesham Rajatagirinibham Charuchandravatamsam
Ratnakalpojjvalangam Parashumrigavarabhitihastam Prasannam.
Padmasinam Samantatstutatamaraganairvyaghrakrttim Vasanam
Vishvadyam Vishvabijam Nikhilabhayaharam Panchavaktram Trinetram ||

|| Atha Stotram ||
Pashupatim Dyupatim Dharanipatim
Bhujagalokapatim Cha Satipatim.
Pranatabhaktajanartiharam Param
Bhajata Re Manuja Girijapatim ||1||

Na Janako Janani Na Cha Sodaro
Na Tanayo Na Cha Bhuribalam Kulam.
Avati Ko'pi Na Kalavasham Gatam
Bhajata Re Manuja Girijapatim ||2||

Murajadindimavadyavilakshanam
Madhurapanchamanaadavisharadam.
Pramathbhutaganairapi Sevitam
Bhajata Re Manuja Girijapatim ||3||

Sharanadam Sukhadam Sharananvitam
Shiva Shiveti Shiveti Natam Nrinam.
Abhayadam Karunaavarunaalayam
Bhajata Re Manuja Girijapatim ||4||

Narashirorachitam Manikundalam
Bhujagaharamudam Vrishabhadhvajam.
Chitirajodhavalekritavigraham
Bhajata Re Manuja Girijapatim ||5||

Makhavinashakaram Shashishehkaram
Satatmadhvarabhajiphalapradam.
Pralayadagdhasurasuramanavam
Bhajata Re Manuja Girijapatim ||6||

Madamapasya Chiram Hridi Samsthitam
Maranajanmajarabhayapeeditam.
Jagadudikshya Sameepabhayaakulam
Bhajata Re Manuja Girijapatim ||7||

Hariviranchisuradhipapujitam
Yamajaneshdhanaeshnamaskritam.
Trinayanam Bhuvanatritayadhipam
Bhajata Re Manuja Girijapatim ||8||

Pashupateridamashtakmadbhutam
Virachitam Prithivipatisurina.
Pathati Samshrinute Manujah Sada
Shivapurim Vasate Labhate Mudam ||9||

|| Iti Shri Prithvipatisuri Virachitam Shri Pashupatyashtakam Sampurnam ||`
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    for (const u of updates) {
      const doc = await Devotional.findOne({ title: { $regex: u.titleMatch }, category: 'Ashtaka' });
      if (!doc) { console.log('❌ Not found:', u.titleMatch); continue; }
      const oldLyrics = doc.lyrics || '';
      if (oldLyrics.match(/Iti.*Sampurnam/i)) {
        console.log('⏭  Already has Roman:', u.titleMatch);
        continue;
      }
      doc.lyrics = oldLyrics + '\n\n---\n\n' + u.roman;
      await doc.save();
      console.log('✅ Updated:', doc.title);
    }
    console.log('\nPart 3 done.');
  } catch (err) { console.error('Error:', err); process.exitCode = 1; }
  finally { await mongoose.connection.close(); console.log('Done.'); }
}
run();
