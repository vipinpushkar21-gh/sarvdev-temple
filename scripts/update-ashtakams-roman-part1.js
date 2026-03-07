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
    titleMatch: 'Shri Ganesh Ashtakam',
    roman: `|| Atha Shri Ganeshashtakam ||
Shri Ganeshaya Namah.

Sarve Uchuh.

Yato'nantashakteranantashcha Jeeva-
Yato Nirgunadaprameya Gunaste.
Yato Bhati Sarvam Tridha Bhedabhinnam
Sada Tam Ganesham Namamo Bhajamah ||1||

Yatashchavirasijjagatsarvametat-
Tatha'bjasanovishvago Vishvagopta.
Tathendradayo Devasangha Manushyah
Sada Tam Ganesham Namamo Bhajamah ||2||

Yato Vahnibhanu Bhavo Bhurjalam Cha-
Yatah Sagarashchandrama Vyoma Vayuh.
Yatah Sthavara Jangama Vrikshasangha
Sada Tam Ganesham Namamo Bhajamah ||3||

Yato Danavah Kinnara Yakshasangha-
Yatashcharana Varanah Shvapadashcha.
Yatah Pakshikeeta Yato Veerudhashcha
Sada Tam Ganesham Namamo Bhajamah ||4||

Yato Buddhirajnananasho Mumukshor-
Yatahsampado Bhaktasantoshikah Syuh.
Yato Vighnanasho Yatah Karyasiddhih
Sada Tam Ganesham Namamo Bhajamah ||5||

Yatah Putrasampadyato Vanchhitartho-
Yato'bhaktavighnastatha'nekarupah.
Yatah Shokamohau Yatah Kama Eva
Sada Tam Ganesham Namamo Bhajamah ||6||

Yato'nantashaktih Sa Shesho Babhuva-
Dharadharane'nekarupe Cha Shaktah.
Yato'nekadha Svargaloka Hi Nana
Sada Tam Ganesham Namamo Bhajamah ||7||

Yato Vedavacho Vikuntha Manobhih-
Sada Neti Netiti Yatta Grinanti.
Parabrahmarupam Chidanandabhutam
Sada Tam Ganesham Namamo Bhajamah ||8||

|| Phala Shruti ||
Shri Ganesha Uvacha.
Punruche Ganadhishah Stotrametatpathennara.
Trisandhyam Tridinam Tasya Sarvam Karyam Bhavishyati ||9||

Yo Japedashtadivasam Shlokashtakam Idam Shubham.
Ashtavaram Chaturthyam Tu So'shtasiddhiravapnuyat ||10||

Yah Pathenmasamatram Tu Dashavaram Dine Dine.
Sa Mochayedvandhgatam Rajavdhyam Na Samshayah ||11||

Vidyakamo Labhedvidyam Putrarthi Putramapnuyat.
Vanchhitanllabtesarva Nekavimshativaaratah ||12||

Yo Japetparaya Bhaktya Gajananparo Narah.
Evamuktvaa Tato Devashchantardhanam Gatah Prabhuh ||13||

|| Iti Shri Ganeshapurane Upasanakhande Shri Ganeshashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Shri Krishnashtakam',
    roman: `|| Atha Shri Krishnashtakam ||

Vasudeva Sutam Devam Kamsa Chanura Mardanam.
Devaki Paramanandaam Krishnam Vande Jagadgurum ||1||

Atasi Pushpa Sankasham Hara Nupura Shobhitam.
Ratna Kankana Keyuram Krishnam Vande Jagadgurum ||2||

Kutilalaka Samyuktam Purnachandra Nibhananam.
Vilasat Kundaldharam Krishnam Vande Jagadgurum ||3||

Mandara Gandha Samyuktam Charuhasam Chaturbhujam.
Barhi Pinchchhava Chudangam Krishnam Vande Jagadgurum ||4||

Utphulla Padmapatrakasham Neela Jimuta Sannibham.
Yadavanam Shiroratnam Krishnam Vande Jagadgurum ||5||

Rukmini Keli Samyuktam Pitambara Sushobhitam.
Avapta Tulasi Gandham Krishnam Vande Jagadgurum ||6||

Gopikanam Kuchadvandva Kunkumankita Vakshasam.
Shriniketam Maheshvasam Krishnam Vande Jagadgurum ||7||

Shrivatsankam Mahoraskam Vanamala Virajitam.
Shankhachakradharam Devam Krishnam Vande Jagadgurum ||8||

Krishnashtaka Midam Punyam Pratarutthaya Yah Pathet.
Kotijanma Kritam Papam Smaranena Vinashyati ||

|| Iti Shri Krishnashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Madhurashtakam',
    roman: `|| Madhurashtakam ||

Adharam Madhuram Vadanam Madhuram
Nayanam Madhuram Hasitam Madhuram.
Hridayam Madhuram Gamanam Madhuram
Madhuradhipaterakhilam Madhuram ||1||

Vachanam Madhuram Charitam Madhuram
Vasanam Madhuram Valitam Madhuram.
Chalitam Madhuram Bhramitam Madhuram
Madhuradhipaterakhilam Madhuram ||2||

Venurmadhuro Renurmadhrah
Panirmadhurh Padau Madhurau.
Nrityam Madhuram Sakhyam Madhuram
Madhuradhipaterakhilam Madhuram ||3||

Geetam Madhuram Peetam Madhuram
Bhuktam Madhuram Suptam Madhuram.
Rupam Madhuram Tilakam Madhuram
Madhuradhipaterakhilam Madhuram ||4||

Karanam Madhuram Taranam Madhuram
Haranam Madhuram Ramanam Madhuram.
Vamitam Madhuram Shamitam Madhuram
Madhuradhipaterakhilam Madhuram ||5||

Gunja Madhura Mala Madhura
Yamuna Madhura Veechi Madhura.
Salilam Madhuram Kamalam Madhuram
Madhuradhipaterakhilam Madhuram ||6||

Gopi Madhura Leela Madhura
Yuktam Madhuram Muktam Madhuram.
Drishtam Madhuram Shishtam Madhuram
Madhuradhipaterakhilam Madhuram ||7||

Gopa Madhura Gavo Madhura
Yashtirmadhura Srishtirmadhura.
Dalitam Madhuram Phalitam Madhuram
Madhuradhipaterakhilam Madhuram ||8||

|| Iti Shrimadvallabhacharyakritam Madhurashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Shri Govindashtakam',
    roman: `|| Shri Govindashtakam ||

Satyam Jnanamanantam Nityamanaakasham Paramakasham
Goshthapranganringanalolam Anayasam Paramayasam.
Mayakalpitananakaramanakaram Bhuvanakaram
Kshama Nathamanatham Pranamata Govindam Paramanandam ||1||

Mritsnamatseeheti Yashodataadanashaishavasamtrasam
Vyaditavaktralokitalokaalokachaturdashalokaalim.
Lokatrayapuramulastambham Lokalokamanaalokam
Lokesham Parameshm Pranamata Govindam Paramanandam ||2||

Traivishtaparipuveeraghnam Kshitibharaghnam Bhavarogaghnam
Kaivalyam Navaneetaharamanaharam Bhuvanaaharam.
Vaimalyasphutachetovrittivisheshabhaasamanaabhasam
Shaivam Kevalashantam Pranamata Govindam Paramanandam ||3||

Gopalam Bhuleelaavigrahagopaalam Kulagopaalam
Gopikelanagovardhanadhritleelaalaalitagopaalam.
Gobhirnigaditagovindasphutanaamanam Bahunamanam
Gopigocharaduram Pranamata Govindam Paramanandam ||4||

Gopimandalagoshthibhedam Bhedaavasthamabhedaabham
Shashvadgokhurnirdhuutoddhatadhulidhoosarasaubhagyam.
Shraddhabhaktigriheeta Anandamachintyam Chintitasadbhavam
Chintaamanimimaanam Pranamata Govindam Paramanandam ||5||

Snanavyaakulayoshidvastramupaaadaayaagamupaarudham
Vyaaditsantiiratha Digvastraa Hyupadaatumupaakarshantam.
Nirdhutadvayashokavimmoham Buddham Buddherantahstham
Sattaamaatrashareeeram Pranamata Govindam Paramanandam ||6||

Kantam Kaaranakaaranmaadimanaadim Kaalamanaabhasam
Kaalindeegatakaaliyashirasi Muhurnrityantam Nrityantam.
Kaalam Kaalakalaatetam Kalitaashesham Kalidoshaghnam
Kaalatrayagatihetum Pranamata Govindam Paramanandam ||7||

Vrindavanabhuvi Vrindaarakaganaavrindaaraadhyam Vande'ham
Kundaabhaamalamandhasmerasudhanandam Suhridaanandam.
Vandyaasheshamahamunimanaasavandyanandapadadvandvam
Vandyaasheshagunaabdhim Pranamata Govindam Paramanandam ||8||

Govindaashtakametadadheete Govindarpitacheta Yo
Govindaachyuta Madhavavishno Gokulanaayaka Krishneti.
Govindaanghrisarojadhyaanasudhaajaldhauta Samastaagho
Govindam Paramanandaamritamantahstham Sa Samabhyeti ||9||

|| Iti Shrimachchhankaraacharyavirachitam Shri Govindashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Achyuta Ashtakam',
    roman: `|| Achyutashtakam ||

Achyutam Keshavam Ramanarayanam
Krishnadamodaram Vasudevam Harim.
Shridharam Madhavam Gopikavallabham
Janakinayakam Ramachandram Bhaje ||1||

Achyutam Keshavam Satyabhamadhavam
Madhavam Shridharam Radhikaradhitam.
Indiramandiram Chetasa Sundaram
Devakinandanam Nandajam Sandadhe ||2||

Vishnave Jishnave Shankhine Chakrine
Rukminiragine Janakijanaye.
Vallavivallabhayarchitayaatmane
Kamsavidhvamsine Vamshine Te Namah ||3||

Krishna Govinda He Rama Narayana
Shripate Vasudevajita Shrinidhe.
Achyutananta He Madhavadhokshaja
Dvarakanayaka Draupadeerakshaka ||4||

Rakshasakshobhitah Sitaya Shobhito
Dandakaranyabhuupunyataakaaranah.
Lakshmanenānvito Vanaraihi Sevito
Agastya-Sampujito Raghavah Patu Mam ||5||

Dhenukaarishtakaanishtakridvdveshiha
Keshiha Kamsahradvamshikaavaadakah.
Putanakopakah Surajakhhelano
Balagopalakah Patu Mam Sarvada ||6||

Vidyududyotavatprasphuradvasasam
Pravridambhodavatprollasadvigraham.
Vanyaya Malaya Shobhitorahsthalam
Lohitanghridvayam Varijakasham Bhaje ||7||

Kunchitaih Kuntalairbhrajamanananam
Ratnmaulim Lasatkkundalam Gandayoh.
Harakeyurakam Kankanaprochvalam
Kinkinimanjulam Shyamalam Tam Bhaje ||8||

Achyutasyashtakam Yah Pathedishtadam
Prematah Pratyaham Purushah Saspriham.
Vrittatah Sundaram Kartrivishvambharas-
Tasyavashyo Harirjayate Satvaram ||9||

|| Iti Shrimachchhankaracharyakritam Achyutashtakam Sampurnam ||`
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
      // Only add Roman if not already present
      if (oldLyrics.includes('Iti') && oldLyrics.includes('Sampurnam')) {
        console.log('⏭  Already has Roman:', u.titleMatch);
        continue;
      }
      doc.lyrics = oldLyrics + '\n\n---\n\n' + u.roman;
      await doc.save();
      console.log('✅ Updated:', doc.title);
    }
    console.log('\nPart 1 done.');
  } catch (err) { console.error('Error:', err); process.exitCode = 1; }
  finally { await mongoose.connection.close(); console.log('Done.'); }
}
run();
