const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Sukt' },
  language: { type: String, default: 'Hindi' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const title = 'श्री सूक्त (Shri Suktam)';

const hindiLyrics = `॥ वैभव प्रदाता श्री सूक्त ॥

हरिः ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्र​जाम्।
चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥1॥

तां म आवह जातवेदो लक्ष्मीमनपगामिनीम्।
यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम्॥2॥

अश्वपूर्वां रथमध्यां हस्तिनादप्रबोधिनीम्।
श्रियं देवीमुपह्वये श्रीर्मा देवी जुषताम्॥3॥

कां सोस्मितां हिरण्यप्राकारामार्द्रां ज्वलन्तीं तृप्तां तर्पयन्तीम्।
पद्मे स्थितां पद्मवर्णां तामिहोपह्वये श्रियम्॥4॥

चन्द्रां प्रभासां यशसा ज्वलन्तीं श्रियं लोके देवजुष्टामुदाराम्।
तां पद्मिनीमीं शरणमहं प्रपद्येऽलक्ष्मीर्मे नश्यतां त्वां वृणे॥5॥

आदित्यवर्णे तपसोऽधिजातो वनस्पतिस्तव वृक्षोऽथ बिल्वः।
तस्य फलानि तपसानुदन्तु मायान्तरायाश्च बाह्या अलक्ष्मीः॥6॥

उपैतु मां देवसखः कीर्तिश्च मणिना सह।
प्रादुर्भूतोऽस्मि राष्ट्रेऽस्मिन् कीर्तिमृद्धिं ददातु मे॥7॥

क्षुत्पिपासामलां ज्येष्ठामलक्ष्मीं नाशयाम्यहम्।
अभूतिमसमृद्धिं च सर्वां निर्णुद मे गृहात्॥8॥

गन्धद्वारां दुराधर्षां नित्यपुष्टां करीषिणीम्।
ईश्वरीं सर्वभूतानां तामिहोपह्वये श्रियम्॥9॥

मनसः काममाकूतिं वाचः सत्यमशीमहि।
पशूनां रूपमन्नस्य मयि श्रीः श्रयतां यशः॥10॥

कर्दमेन प्रजाभूता मयि सम्भव कर्दम।
श्रियं वासय मे कुले मातरं पद्ममालिनीम्॥11॥

आपः सृजन्तु स्निग्धानि चिक्लीत वस मे गृहे।
नि च देवीं मातरं श्रियं वासय मे कुले॥12॥

आर्द्रां पुष्करिणीं पुष्टिं पिङ्गलां पद्ममालिनीम्।
चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥13॥

आर्द्रां यः करिणीं यष्टिं सुवर्णां हेममालिनीम्।
सूर्यां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥14॥

तां म आवह जातवेदो लक्ष्मीमनपगामिनीम्।
यस्यां हिरण्यं प्रभूतं गावो दास्योऽश्वान् विन्देयं पुरुषानहम्॥15॥

यः शुचिः प्रयतो भूत्वा जुहुयादाज्यमन्वहम्।
सूक्तं पञ्चदशर्चं च श्रीकामः सततं जपेत्॥16॥

पद्मानने पद्म ऊरू पद्माक्षी पद्मसम्भवे।
त्वं मां भजस्व पद्माक्षी येन सौख्यं लभाम्यहम्॥17॥

अश्वदायि गोदायि धनदायि महाधने।
धनं मे जुषतां देवि सर्वकामांश्च देहि मे॥18॥

पुत्रपौत्र धनं धान्यं हस्त्यश्वादिगवे रथम्।
प्रजानां भवसि माता आयुष्मन्तं करोतु माम्॥19॥

धनमग्निर्धनं वायुर्धनं सूर्यो धनं वसुः।
धनमिन्द्रो बृहस्पतिर्वरुणं धनमश्नुते॥20॥

वैनतेय सोमं पिब सोमं पिबतु वृत्रहा।
सोमं धनस्य सोमिनो मह्यं ददातु सोमिनः॥21॥

न क्रोधो न च मात्सर्य न लोभो नाशुभा मतिः।
भवन्ति कृतपुण्यानां भक्तानां श्रीसूक्तं जपेत्सदा॥22॥

वर्षन्तु ते विभावरि दिवो अभ्रस्य विद्युतः।
रोहन्तु सर्वबीजान्यव ब्रह्म द्विषो जहि॥23॥

पद्मप्रिये पद्मिनि पद्महस्ते पद्मालये पद्मदलायताक्षि।
विश्वप्रिये विष्णु मनोऽनुकूले त्वत्पादपद्मं मयि सन्निधत्स्व॥24॥

या सा पद्मासनस्था विपुलकटितटी पद्मपत्रायताक्षी।
गम्भीरा वर्तनाभिः स्तनभर नमिता शुभ्र वस्त्रोत्तरीया॥25॥

लक्ष्मीर्दिव्यैर्गजेन्द्रैर्मणिगणखचितैस्स्नापिता हेमकुम्भैः।
नित्यं सा पद्महस्ता मम वसतु गृहे सर्वमाङ्गल्ययुक्ता॥26॥

लक्ष्मीं क्षीरसमुद्र राजतनयां श्रीरङ्गधामेश्वरीम्।
दासीभूतसमस्त देव वनितां लोकैक दीपांकुराम्॥27॥

श्रीमन्मन्दकटाक्षलब्ध विभव ब्रह्मेन्द्रगङ्गाधराम्।
त्वां त्रैलोक्य कुटुम्बिनीं सरसिजां वन्दे मुकुन्दप्रियाम्॥28॥

सिद्धलक्ष्मीर्मोक्षलक्ष्मीर्जयलक्ष्मीस्सरस्वती।
श्रीलक्ष्मीर्वरलक्ष्मीश्च प्रसन्ना मम सर्वदा॥29॥

वरांकुशौ पाशमभीतिमुद्रां करैर्वहन्तीं कमलासनस्थाम्।
बालार्क कोटि प्रतिभां त्रिणेत्रां भजेहमाद्यां जगदीश्वरीं त्वाम्॥30॥

सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थ साधिके।
शरण्ये त्र्यम्बके देवि नारायणि नमोऽस्तु ते॥31॥

सरसिजनिलये सरोजहस्ते धवलतरांशुक गन्धमाल्यशोभे।
भगवति हरिवल्लभे मनोज्ञे त्रिभुवनभूतिकरि प्रसीद मह्यम्॥32॥

विष्णुपत्नीं क्षमां देवीं माधवीं माधवप्रियाम्।
विष्णोः प्रियसखीं देवीं नमाम्यच्युतवल्लभाम्॥33॥

महालक्ष्मी च विद्महे विष्णुपत्नीं च धीमहि।
तन्नो लक्ष्मीः प्रचोदयात्॥34॥

श्रीवर्चस्यमायुष्यमारोग्यमाविधात् पवमानं महियते।
धनं धान्यं पशुं बहुपुत्रलाभं शतसंवत्सरं दीर्घमायुः॥35॥

ऋणरोगादिदारिद्र्यपापक्षुदपमृत्यवः।
भयशोकमनस्तापा नश्यन्तु मम सर्वदा॥36॥

य एवं वेद ॐ महादेव्यै च विद्महे विष्णुपत्नीं च धीमहि।
तन्नो लक्ष्मीः प्रचोदयात् ॐ शान्तिः शान्तिः शान्तिः॥37॥`;

const englishLyrics = `Shri Suktam (Hymn of Wealth and Prosperity)

Harih Om Hiranyavarnam Harinim Suvarnarajatasrajam.
Chandraam Hiranmayim Lakshmim Jatavedo Ma Avaha.||1||

Taam Ma Avaha Jatavedo Lakshmim Anapagaminim.
Yasyam Hiranyam Vindeyam Gaamashvam Purushaanaham.||2||

Ashvapoorvam Rathamadhyam Hastinaadaprabodhinim.
Shriyam Devimupahvaye Shrirmaa Devi Jushataam.||3||

Kaam Sosmitam Hiranyapraakaaramaardraam Jwalantim Truptaam Tarpayantim.
Padme Sthitaam Padmavarnam Taamihopahvaye Shriyam.||4||

Chandraam Prabhaasam Yashasaa Jwalantim Shriyam Loke Devajushtaamudaaraam.
Taam Padminiimeem Sharanam Aham Prapadye Alakshmirme Nashyataam Tvaam Vrune.||5||

Adityavarne Tapaso'dhijaato Vanaspatistava Vrukshotha Bilvah.
Tasya Phalaani Tapasaanudantu Maayaantaraayaashcha Baahyaa Alakshmih.||6||

Upaitu Maam Devasakhah Keertishcha Maninaa Saha.
Praadurbhooto'smi Raashtre'smin Keertimruddhim Dadaatu Me.||7||

Kshutpipaasaamalaam Jyeshthaamalakshmim Naashayaamyaham.
Abhootim Asamruddhim Cha Sarvaam Nirnuda Me Gruhaat.||8||

Gandhadvaaraam Duraadharshaam Nityapushtaam Kareeshinim.
Eeshvareem Sarvabhootaanaam Taamihopahvaye Shriyam.||9||

Manasah Kaamamaakootim Vaachah Satyamashimahi.
Pashoonaam Roopam Annasya Mayi Shreeh Shrayataam Yashah.||10||

Kardamena Prajaabhoota Mayi Sambhava Kardama.
Shriyam Vaasaya Me Kule Maataram Padmamaalineem.||11||

Aapah Srijantu Snigdhaani Chikleeta Vasa Me Gruhe.
Ni Cha Devim Maataram Shriyam Vaasaya Me Kule.||12||

Aardraam Pushkarinim Pushtim Pingalaam Padmamaalineem.
Chandraam Hiranmayim Lakshmim Jatavedo Ma Avaha.||13||

Aardraam Yah Karinim Yashtim Suvarnaam Hemamaalineem.
Sooryaam Hiranmayim Lakshmim Jatavedo Ma Avaha.||14||

Taam Ma Avaha Jatavedo Lakshmim Anapagaminim.
Yasyaam Hiranyam Prabhootam Gaavo Daasyo'shvaan Vindeyam Purushaanaham.||15||

Yah Shuchih Prayato Bhootvaa Juhuyaadaajyamanvaham.
Suktam Panchadashar'cham Cha Shreekaamah Satatam Japet.||16||

Padmaanane Padma Ooroo Padmaakshi Padmasambhave.
Tvam Maam Bhajasva Padmaakshi Yena Saukhyam Labhaamy Aham.||17||

Ashvadaayi Godaayi Dhanadaayi Mahaadhane.
Dhanam Me Jushataam Devi Sarvakaamaanshcha Dehi Me.||18||

Putrapautra Dhanam Dhaanyam Hastyashvaadiga Ve Ratham.
Prajaanaam Bhavasi Maata Aayushman Tam Karotu Maam.||19||

Dhanam Agnir Dhanam Vaayur Dhanam Sooryo Dhanam Vasuh.
Dhanam Indro Bruhaspatir Varunam Dhanam Ashnute.||20||

Vainateya Somam Piba Somam Pibatu Vrutrahaa.
Somam Dhanasya Somino Mahyam Dadaatu Sominah.||21||

Na Krodho Na Cha Maatsarya Na Lobho Naashubhaa Matih.
Bhavanti Krutapunyaanaam Bhaktaanaam Shri Suktam Japet Sadaa.||22||

Varshantu Te Vibhaavari Divo Abhrasya Vidyutah.
Rohantu Sarva Beejaany Ava Brahma Dvisho Jahi.||23||

Padmapriye Padmini Padmahaste Padmaalaye Padmadalaayataakshi.
Vishvapriye Vishnu Mano'nukoole Tvatpaadapadmam Mayi Sannidhatsva.||24||

Yaa Saa Padmaasanasthaa Vipulakatitati Padmapatraayataakshi.
Gambheeraa Vartanaabhih Stanabhara Namitaa Shubhra Vastrottareeyaa.||25||

Lakshmirdivyairgajendrairmaniganakhachitaissnaa Pitaa Hemakumbhaih.
Nityam Saa Padmahastaa Mama Vasatu Gruhe Sarva Maangalyayuktaa.||26||

Lakshmim Kshirasamudra Raajatanayaam Shreerangadhaameshvareem.
Daaseebhootasamasta Deva Vanitaam Lokaika Deepaankuraam.||27||

Shreeman Mandakataakshalabdha Vibhava Brahmendragangaadharaam.
Tvaam Trailokya Kutumbineem Sarasijaam Vande Mukundapriyaam.||28||

Siddhalakshmirmokshalakshmirjayalakshmissarasvati.
Shreelakshmirvaralakshmishcha Prasannaa Mama Sarvadaa.||29||

Varaankushau Paashamabheetimudram Karairvahanteem Kamalaasanasthaam.
Baalarka Koti Pratibhaam Trinetram Bhajehamaadyaam Jagadeeshvareem Tvaam.||30||

Sarvamangalamaangalye Shive Sarvaartha Saadhike.
Sharanye Tryambake Devi Naaraayani Namo'stu Te.||31||

Sarasijanilaye Sarojahaste Dhavalataraamshuka Gandhamaaly Ashobhe.
Bhagavati Harivallabhe Manojne Tribhuvanabhootikari Praseeda Mahyam.||32||

Vishnupatneem Kshamaam Deveem Maadhaveem Maadhavapriyaam.
Vishnoh Priyasakheem Deveem Namaamy Achyutavallabhaam.||33||

Mahaalakshmi Cha Vidmahe Vishnupatneem Cha Dheemahi.
Tanno Lakshmih Prachodayaat.||34||

Shreevarchasyamaayushyamaarogyamaavidhaat Pavamaanam Mahiyate.
Dhanam Dhaanyam Pashum Bahuputralaabham Shatasamvatsaram Deerghamaayuh.||35||

Runarogaadidaaridryapaapaakshu Dapamrutyavah.
Bhayashokamanastaapaa Nashyantu Mama Sarvadaa.||36||

Ya Evam Veda Om Mahaadevy Ai Cha Vidmahe Vishnupatneem Cha Dheemahi.
Tanno Lakshmih Prachodayaat Om Shaantih Shaantih Shaantih.||37||`;

const shriSukt = {
  title,
  deity: 'Lakshmi',
  category: 'Stotra/Suktam',
  status: 'approved',
  language: 'Hindi',
  description: 'श्री सूक्त ऋग्वेद का एक प्रसिद्ध सूक्त है जो देवी लक्ष्मी की स्तुति में गाया जाता है। यह सूक्त धन, समृद्धि, सौभाग्य और आध्यात्मिक उन्नति के लिए पाठ किया जाता है। इसमें 37 मंत्र हैं।',
  lyrics: `${hindiLyrics}\n\n${englishLyrics}`,
};

async function addShriSukt() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title, deity: 'Lakshmi', category: 'Stotra/Suktam' });
    if (existing) {
      console.log(`Shri Sukt already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const doc = new Devotional(shriSukt);
      await doc.save();
      console.log(`✓ Added: ${shriSukt.title}`);
    }

    const count = await Devotional.countDocuments({ category: 'Stotra/Suktam' });
    console.log(`Sukts in database: ${count}`);
  } catch (err) {
    console.error('Error adding Shri Sukt:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

addShriSukt();
