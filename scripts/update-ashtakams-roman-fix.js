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
    titleMatch: 'Shiva Ashtakam',
    roman: `|| Atha Shri Shivashtakam ||

Prabhum Prananantham Vibhum Vishvanatham
Jagannatha Natham Sadananda Bhajam.
Bhavadbhavya Bhuteshvaram Bhutanatham,
Shivam Shankaram Shambhu Meeshanamide ||1||

Gale Rundamalam Tanau Sarpajalam
Mahakal Kalam Ganeshadi Palam.
Jatajut Gangottarangair Vishalam,
Shivam Shankaram Shambhu Meeshanamide ||2||

Mudamakaram Mandanam Mandayantam
Maha Mandalam Bhasma Bhushadharam Tam.
Anadim Hyaparam Maha Mohamaram,
Shivam Shankaram Shambhu Meeshanamide ||3||

Vatadho Nivasam Mahattattahasam
Mahapapa Nasham Sada Suprakasham.
Girisham Ganesham Suresham Mahesham,
Shivam Shankaram Shambhu Meeshanamide ||4||

Girindratmaja Sangrihitardhadheham
Girau Samsthitam Sarvadapanna Geham.
Parabrahma Brahmadibhir-Vandyamanam,
Shivam Shankaram Shambhu Meeshanamide ||5||

Kapalam Trishulam Karabhyam Dadhanam
Padambhoja Namraya Kamam Dadanam.
Balivardhamanam Suranam Pradhanam,
Shivam Shankaram Shambhu Meeshanamide ||6||

Sharachchandra Gatram Gananandapatram
Trinetram Pavitram Dhaneshsya Mitram.
Aparna Kalatram Sada Sachcharitram,
Shivam Shankaram Shambhu Meeshanamide ||7||

Haram Sarpaharam Chita Bhuviharam
Bhavam Vedasaram Sada Nirvikaram.
Shmashane Vasantam Manojam Dahantam,
Shivam Shankaram Shambhu Meeshanamide ||8||

Svayam Yah Prabhate Narshshula Pane
Pathet Stotraratnam Tvihaprapyaratnam.
Suputram Sudhanyam Sumitram Kalatram
Vichitraissamaradhya Moksham Prayati ||

|| Iti Shri Shivashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Dinabandhu Ashtakam',
    roman: `|| Shri Dinabandhu Ashtakam ||

Yasyanugrahadananena Samastadukhair-
Muktah Sada Sukhayute Cha Bhavanti Lokah.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||1||

Sarvasya Jantujagato Hitakaranam Yam
Devah Stuvanti Satateritapujyamanah.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||2||

Yah Patu Vishvamakhilam Charaacharamcha
Dharmasthitistithikarah Pralayodbhavakrit.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||3||

Yo Vai Sureshamavanipa Mareshu Pujyah
Sarveshu Devaganamukhyataraha Preshthah.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||4||

Yasyangabhutamakhilam Bhuvanatrayam Cha
Yasya Prabhavamakhilam Jagadavirbhavah.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||5||

Nityam Sthitam Hridayapankajamdhyanihitam
Vedantvedyamajamekamachintarupam.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||6||

Bhaktapriyancha Sharanagatapalakam Cha
Dinasya Bandhum Amitam Paripurnarupam.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||7||

Nanavataragunakarmanamatmaneyam
Dharivichitracharitah Prithivitalasmin.
Tam Dinabandhumatulam Surasiddhajushtam
Vandamahe Hridayato Narayanam Devam ||8||

Dinabandhashtakam Punyam Yah Pathet Pranato Narah.
Sarvapapaparimuktah Vishnulokam Sa Gacchati ||

|| Iti Shri Dinabandhu Ashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Kamalapati Ashtakam',
    roman: `|| Shri Kamalapati Ashtakam ||

Kamaladalanibham Karuna Sagaram
Sharanaagatajana Paripalakam.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||1||

Jaladhijamalayam Sulalitanibham
Bhuvanatraya Palana Tatparakam.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||2||

Garudasanagatam Gaganeshwaram
Surasiddhaganair Natasevitam.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||3||

Mukutakundalaharavibhushitam
Tulasimalikaanchhrita Kandharam.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||4||

Narakantakam Adbjanetramatulam
Pranatartiiharam Shriniketanam.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||5||

Bhavabhayaharam Purushottamam
Paramatmakamakhaladushitam.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||6||

Kamalasanakam Jagadishvaram
Trigunaatigamaavyayasundaram.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||7||

Sahasranamni Sevitam Anaghapaharam
Jagadekanaatham Pranamami Nityam.
Kamalapati Kamala Nayanam Bhaje
Mama Dehi Varam Varadam Bhavane ||8||

Kamalapatashtakam Idam Punyam Yah Pathet Pranato Narah.
Sarvapapaparimuktah Vishnulokam Sa Gacchati ||

|| Iti Shri Kamalapati Ashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Narayanashtakam',
    roman: `|| Shri Narayanashtakam ||

Vaktataram Varadamanghriijuganam Sharnanyam
Lokaikanathamajamachyutamaprameyam.
Vishnoramitabalavijitaristasangham
Vande Nrisimhavaradam Param Narayanam ||1||

Padmavatilabdhavaram Paramatmarupam
Shrivatsvakshamatiha Shankhagadaaddharam.
Shreesham Shrikaramatulam Shritalokanatham
Vande Sada Kamalapam Param Narayanam ||2||

Sheshadriniilayamanekagunashrayam Tam
Meghashmashyanamupendramakhanda Tejam.
Vedantvedyamajamadvayamaprameyam
Vande Sada Kamalapam Param Narayanam ||3||

Gopalamadbhutabalatamagaadhabodham
Govindaminduvadanagrajanandahetum.
Gopijanapriyatamam Rasamandalesham
Vande Sada Kamalapam Param Narayanam ||4||

Matsyam Kacchapavaraham Narasimharupam
Vamanam Dhanurdharam Balaramarupam.
Buddham Kalkimatulam Dashavataram Tam
Vande Sada Kamalapam Param Narayanam ||5||

Dharaadharasamavapusham Navaghanavarnam
Dantam Daridryadahano Dhanadaadhikam Tam.
Devadideva Makhilam Divijeshanathm
Vande Sada Kamalapam Param Narayanam ||6||

Padmanaabhamajamarchitapadayugmam
Padmaasanaadiganadevaganadhiishevyam.
Padmottaramnijapade Sthitamaadidevam
Vande Sada Kamalapam Param Narayanam ||7||

Sarveshu Jantushutaapaharam Param Yam
Sarvatra Sarvagunamaadinanantarupam.
Sarvaartha Daayakamanantamachintarupam
Vande Sada Kamalapam Param Narayanam ||8||

Narayanashtakamidam Shubham Yah Pathet
Pranato Narah Satatam Bhaktyashraddhaya.
Sarvapapaparimuktah Sukhee Jayate
Ante Cha Vishnupadamapnuyaat Dhruvam ||

|| Iti Shri Narayanashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Hari Sharanashtakam',
    roman: `|| Shri Hari Sharanashtakam ||

Jagajjalapalam Kachela Kadambam
Karaavalambam Nijabhaktavatsalam.
Mukundamanandamakhanda Bodhitam
Harimsharanam Gatosmi Harim Sharanam ||1||

Paraatparam Paramamaadyamanatam
Vibhum Sadaa Sevitamuktarupam.
Daridraduhkhaartiharam Prasannam
Harimsharanam Gatosmi Harim Sharanam ||2||

Sharannagatadinabandhum Asheshaam
Jagatapatimsukhadasaubhagyahetum.
Shuddham Budhaishcha Nigamairviditam Yamesham
Harimsharanam Gatosmi Harim Sharanam ||3||

Samasta Bhutahridayaaranivastavam Yam
Sarvajnasarvagum Anantamanandarupam.
Akshayyamapratihatam Nikhilesvaresham
Harimsharanam Gatosmi Harim Sharanam ||4||

Yogindragamyamajamaadipuranpurusham
Shankhaaripankajagadaadharamashrayeyam.
Naarayanam Cha Vidhimandiradishtadevam
Harimsharanam Gatosmi Harim Sharanam ||5||

Yam Brahmavarunendrarudramarutah Stuvanti
Divyaistavairvedaihi Saangapadakramopanishadaih.
Gaayanti Yam Saamagaahshrutipathairalankritam Yam
Harimsharanam Gatosmi Harim Sharanam ||6||

Samsarasaagaravishaladvayantimatriptyam
Mohantakaaragahanampratham Nimajjantam.
Deena Vilokaya Vibho Karunarasaardram
Harimsharanam Gatosmi Harim Sharanam ||7||

Namaami Narayanam Padanaravindam
Vasishtha Dashathmajakam Jagadekabhandum.
Bhaktapriyam Dhanada Dukhaharam Prasannam
Harimsharanam Gatosmi Harim Sharanam ||8||

Harisharanashtakam Punyam Yah Pathet Pranato Narah.
Sarvapapavinimuktah Harilokamaapnuyat ||

|| Iti Shri Hari Sharanashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Lakshminarayana Ashtakam',
    roman: `|| Shri Lakshminarayana Ashtakam ||

Lakshminarayana Mama Dehi Karavalambam
Samsarasaagaranimitamajasramindoh.
Naanaavidhairduritaduhkhavimohanaughair-
Bheetasya Dehi Kripaya Padapadmasevaam ||1||

Brhmendranaamapitrisiddhaganadhidevai-
Raaradhya Paadayugalam Paramam Padam Te.
Praptam Mahanmuniganaishcha Tadeva Dhanyam
Lakshminarayana Mama Dehi Karavalambam ||2||

Vidyaavinaa Na Cha Tapah Shravanam Cha Naiva
Gyaanam Cha Naasti Na Gunoapi Dayaalunaatha.
Kintu Tvadeeya Charanopagatonumuchye
Lakshminarayana Mama Dehi Karavalambam ||3||

Majjatkalaanichayanaadimahaashubheshun
Mohaavalambashhadhvaantasamiplutaatmaa.
Tvaam Naatha Kaivalyamathopagatosmi Bheetyaa
Lakshminarayana Mama Dehi Karavalambam ||4||

Samsarasaagaravishaalakaraalakaala-
Nakrakramaakulavibheeshanadukhanaasham.
Vyaadhiprabhanjanajataantajalaraavipaatam
Lakshminarayana Mama Dehi Karavalambam ||5||

Samsaarasaagarammahaadripavardhamaana-
Vistrshtaasashatakarogavishaanilena.
Nagnaaya Dagdhashikhine Varavikshitaaya
Lakshminarayana Mama Dehi Karavalambam ||6||

Samsaaravrikshamaghabeejamananatakarma-
Shaakhinamaapadadavahnimadinilam Cha.
Chhitva Tvadeeyakripayaapanayaakhiladuhkham
Lakshminarayana Mama Dehi Karavalambam ||7||

Samsaarajaalamapahartumachintaroopam
Shaantam Sadekamanishamshubhadaarumeshaam.
Naatha Tvadeeyacharanaaravinantabhaktya
Lakshminarayana Mama Dehi Karavalambam ||8||

Lakshminarayanashtakam Punyam Sarvapaapaharamshubham.
Yah Pathetsatatam Bhaktya Sa Labhenmokshmaavyayam ||

|| Iti Shri Lakshminarayana Ashtakam Sampurnam ||`
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    for (const u of updates) {
      // Use escaped regex for title matching
      const escaped = u.titleMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const doc = await Devotional.findOne({ title: { $regex: escaped }, category: 'Ashtaka' });
      if (!doc) { console.log('❌ Not found:', u.titleMatch); continue; }
      const oldLyrics = doc.lyrics || '';
      if (/Iti.*Sampurnam/i.test(oldLyrics)) {
        console.log('⏭  Already has Roman:', doc.title);
        continue;
      }
      doc.lyrics = oldLyrics + '\n\n---\n\n' + u.roman;
      await doc.save();
      console.log('✅ Updated:', doc.title);
    }
    console.log('\nFix done.');
  } catch (err) { console.error('Error:', err); process.exitCode = 1; }
  finally { await mongoose.connection.close(); console.log('Done.'); }
}
run();
