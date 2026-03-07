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
    titleMatch: 'Adi Shankara Krit Shivashtakam',
    roman: `|| Shivashtakam ||

Tasmai Namah Paramkarankaranaya
Diptojjvalajjvalitapingalallochanaya.
Nagendraharakritakundalabhushanaya
Brahmendrvishnuvaradaya Namah Shivaya ||1||

Shrimatprasannashashpannagabhushanaya
Shailendrajavadanachumbitalochanaya.
Kailasmandarmahendraniketanaya
Lokatrayartiharnaya Namah Shivaya ||2||

Padmavadatamanikundalgovrishaya
Krishnagaruprachurchandanarchitaya.
Bhasmanushaktavikachotpalamallikaya
Neelabjaknthsadrishaya Namah Shivaya ||3||

Lambatsapingalajataamukutotkataya
Damshtrakaraalvikatotkatbhairavaya.
Vyaghrajinambaradharaya Manoharaya
Trailokyanaathnamitaya Namah Shivaya ||4||

Dakshaprajapatimahaamakhanashanaya
Kshipram Mahatripurdaanavaghatanaya.
Brahmorjitordhvgakarotinikriantanaya
Yogaya Yognamitaya Namah Shivaya ||5||

Samsarasrishtighatanaparivartnaya
Rakshah Pishachganasiddhasamaakulaya.
Siddhoraggrahaganendraniishevitaya
Shardulcharmavasanaya Namah Shivaya ||6||

Bhasmangraagkritrupmanoharaya
Saumyavdaatvanamashritamashritaya.
Gaurikatakshanyanardhnirikshnaaya
Gokshirdhardhavalaya Namah Shivaya ||7||

Adityasomvarunanilasevitaya
Yajnaagnihotravaradhumniketanaya
Riksaamvedmunibhih Stutisanyutaya
Gopaya Gopnamitaya Namah Shivaya ||8||

Shivashtakamidam Punyam Yah Pathet Shivasannidhau.
Shivalokamavapnoti Shivena Saha Modate ||

|| Iti Shri Shankaracharyakritam Shivashtakam Sampurnam ||`
  },
  {
    titleMatch: 'श्री शिवाष्टकम् (Shiva Ashtakam)',
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
    titleMatch: 'Shri Rudra Ashtakam',
    roman: `|| Shri Rudrashtakam ||

Namamishamishan Nirvaanarupam Vibhum
Vyapakam Brahmavedasvarupam.
Nijam Nirgunam Nirvikalpam Nireeham
Chidakashamakashvasam Bhaje'ham ||1||

Nirakaramomkaramoolam Tureeyam
Giraajnanagotetameshm Girisham.
Karalam Mahakalkalam Kripalam
Gunagarsamsarparam Nato'ham ||2||

Tusharadrisankashgauram Gabhiram
Manobhutakotiprabhashrshriram.
Sphuranmaulikallolini Charuganga
Lasadbhalbaalendukanthe Bhujanga ||3||

Chalatkkundalam Bhrusaunetram Vishalam
Prasannaananam Neelakntham Dayalam.
Mrigadheeshcharmmabaram Mundmalam
Priyam Shankaram Sarvanatham Bhajami ||4||

Prachandam Prakrishtam Pragalbham Paresham-
Akhandamajam Bhanukotiprakasham.
Trayahshulanirmoolanam Shulapanim
Bhaje'ham Bhavanipatim Bhavagamyam ||5||

Kalatitakalyanakalpantakari
Sadasajjananandadata Purari.
Chidanandasandohamohpahari
Prasida Prasida Prabho Manmathari ||6||

Na Yavad Umanath Padaaravindam
Bhajantih Loke Pare Va Naranam.
Na Tavatsukham Shantisantapanasham
Prasida Prabho Sarvabhutadhivasam ||7||

Na Janami Yogam Japam Naiva Pujam
Nato'ham Sada Sarvada Shambhu Tubhyam.
Jarajanmaduhkhaughtatapyamanam
Prabho Pahi Apannamameesh Shambho ||8||

Rudrashtakamidam Proktam Viprena Hartoshaye.
Ye Pathanti Nara Bhaktya Tesham Shambhuh Prasidati ||9||

|| Iti Shri Ramcharitmanse Uttarkande Shri Goswami Tulsidasakritam Shri Rudrashtakam Sampurnam ||`
  },
  {
    titleMatch: 'Shri Gaurishashtakam',
    roman: `|| Shri Gaurishashtakam ||

Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate.
Jalabhavadustarajaldhisutaranam
Dhyeyam Chitte Shivaharacharanam.
Anyopayam Na Hi Na Hi Satyam
Geyam Shankara Shankara Nityam.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||1||

Darapatyam Kshetram Vittam
Deham Geham Sarvamanityam.
Iti Paribhavaya Sarvamasaram
Garbhavikritya Svapnavicharam.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||2||

Malavachitrye Punaravritih
Punarapi Jananijatharotpattih.
Punarapyashaakulitam Jatharam Kim
Nahi Munchasi Kathayeshchittam.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||3||

Mayakalpitamaindram Jalam
Nahi Tatsatyam Drishtivikaram.
Jnate Tattve Sarvamasaram
Ma Kuru Ma Kuru Vishayavicharam.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||4||

Rajjau Sarpabhramana-Ropas-
Tadvadbrahmani Jagadaropah.
Mithyaamayaamohavikaram
Manasi Vicharaya Barambaram.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||5||

Adhvarakotiigangaagamanam
Kurute Yogam Chendriyandamanam.
Jnaanaviheenh Sarvamatena
Na Bhavati Mukto Janmashatena.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||6||

So'ham Hamso Brahmaivaaham
Shuddhanandastattvaaparo'ham.
Advaito'ham Sangaviheene
Chendriya Aatmani Nikhile Leene.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||7||

Shankarakinkara Ma Kuru Chintam
Chintaamanina Virachitametat.
Yah Sadbhaktya Pathati Hi Nityam
Brahmani Leeno Bhavati Hi Satyam.
Bhaja Gaurisham Bhaja Gaurisham
Gaurisham Bhaja Mandamate ||8||

|| Iti Shri Chintamanivirachitam Gaurishashtakam Sampurnam ||`
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
    console.log('\nPart 2 done.');
  } catch (err) { console.error('Error:', err); process.exitCode = 1; }
  finally { await mongoose.connection.close(); console.log('Done.'); }
}
run();
