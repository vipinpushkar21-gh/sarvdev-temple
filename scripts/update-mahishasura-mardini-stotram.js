const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String, default: 'Stotra' },
  language:    { type: String, default: 'Sanskrit' },
  deity:       { type: String },
  lyrics:      { type: String },
  audio:       { type: String },
  status:      { type: String, default: 'approved' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const fullLyrics = `॥ महिषासुरमर्दिनी स्तोत्रम् ॥

अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दिनुते
गिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते।
भगवति हे शितिकण्ठकुटुम्बिनि भूरिकुटुम्बिनि भूरिकृते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥1॥

सुरवरवर्षिणि दुर्धरधर्षिणि दुर्मुखमर्षिणि हर्षरते
त्रिभुवनपोषिणि शङ्करतोषिणि किल्बिषमोषिणि घोषरते।
दनुजनिरोषिणि दितिसुतरोषिणि दुर्मदशोषिणि सिन्धुसुते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥2॥

अयि जगदम्ब मदम्ब कदम्ब वनप्रियवासिनि हासरते
शिखरि शिरोमणि तुङ्गहिमलय शृङ्गनिजालय मध्यगते।
मधुमधुरे मधुकैटभगञ्जिनि कैटभभञ्जिनि रासरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥3॥

अयि शतखण्ड विखण्डितरुण्ड वितुण्डितशुण्द गजाधिपते
रिपुगजगण्ड विदारणचण्ड पराक्रमशुण्ड मृगाधिपते।
निजभुजदण्ड निपातितखण्ड विपातितमुण्ड भटाधिपते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥4॥

अयि रणदुर्मद शत्रुवधोदित दुर्धरनिर्जर शक्तिभृते
चतुरविचार धुरीणमहाशिव दूतकृत प्रमथाधिपते।
दुरितदुरीह दुराशयदुर्मति दानवदुत कृतान्तमते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥5॥

अयि शरणागत वैरिवधुवर वीरवराभय दायकरे
त्रिभुवनमस्तक शुलविरोधि शिरोऽधिकृतामल शुलकरे।
दुमिदुमितामर धुन्दुभिनादमहोमुखरीकृत दिङ्मकरे
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥6॥

अयि निजहुङ्कृति मात्रनिराकृत धूम्रविलोचन धूम्रशते
समरविशोषित शोणितबीज समुद्भवशोणित बीजलते।
शिवशिवशुम्भ निशुम्भमहाहव तर्पितभूत पिशाचरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥7॥

धनुरनुषङ्ग रणक्षणसङ्ग परिस्फुरदङ्ग नटत्कटके
कनकपिशङ्ग पृषत्कनिषङ्ग रसद्भटशृङ्ग हताबटुके।
कृतचतुरङ्ग बलक्षितिरङ्ग घटद्बहुरङ्ग रटद्बटुके
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥8॥

सुरललना ततथेयि तथेयि कृताभिनयोदर नृत्यरते
कृत कुकुथः कुकुथो गडदादिकताल कुतूहल गानरते।
धुधुकुट धुक्कुट धिंधिमित ध्वनि धीर मृदंग निनादरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥9॥

जय जय जप्य जयेजयशब्द परस्तुति तत्परविश्वनुते
झणझणझिञ्झिमि झिङ्कृत नूपुरशिञ्जितमोहित भूतपते।
नटित नटार्ध नटी नट नायक नाटितनाट्य सुगानरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥10॥

अयि सुमनःसुमनःसुमनः सुमनःसुमनोहरकान्तियुते
श्रितरजनी रजनीरजनी रजनीरजनी करवक्त्रवृते।
सुनयनविभ्रमर भ्रमरभ्रमर भ्रमरभ्रमराधिपते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥11॥

सहितमहाहव मल्लमतल्लिक मल्लितरल्लक मल्लरते
विरचितवल्लिक पल्लिकमल्लिक झिल्लिकभिल्लिक वर्गवृते।
शितकृतफुल्ल समुल्लसितारुण तल्लजपल्लव सल्ललिते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥12॥

अविरलगण्ड गलन्मदमेदुर मत्तमतङ्ग जराजपते
त्रिभुवनभुषण भूतकलानिधि रूपपयोनिधि राजसुते।
अयि सुदतीजन लालसमानस मोहन मन्मथराजसुते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥13॥

कमलदलामल कोमलकान्ति कलाकलितामल भाललते
सकलविलास कलानिलयक्रम केलिचलत्कल हंसकुले।
अलिकुलसङ्कुल कुवलयमण्डल मौलिमिलद्बकुलालिकुले
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥14॥

करमुरलीरव वीजितकूजित लज्जितकोकिल मञ्जुमते
मिलितपुलिन्द मनोहरगुञ्जित रञ्जितशैल निकुञ्जगते।
निजगणभूत महाशबरीगण सद्गुणसम्भृत केलितले
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥15॥

कटितटपीत दुकूलविचित्र मयुखतिरस्कृत चन्द्ररुचे
प्रणतसुरासुर मौलिमणिस्फुर दंशुलसन्नख चन्द्ररुचे।
जितकनकाचल मौलिमदोर्जित निर्भरकुञ्जर कुम्भकुचे
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥16॥

विजितसहस्रकरैक सहस्रकरैक सहस्रकरैकनुते
कृतसुरतारक सङ्गरतारक सङ्गरतारक सूनुसुते।
सुरथसमाधि समानसमाधि समाधिसमाधि सुजातरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥17॥

पदकमलं करुणानिलये वरिवस्यति योऽनुदिनं सुशिवे
अयि कमले कमलानिलये कमलानिलयः स कथं न भवेत्।
तव पदमेव परम्पदमित्यनुशीलयतो मम किं न शिवे
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥18॥

कनकलसत्कलसिन्धुजलैरनुषिञ्चति तेगुणरङ्गभुवम्
भजति स किं न शचीकुचकुम्भतटीपरिरम्भसुखानुभवम्।
तव चरणं शरणं करवाणि नतामरवाणि निवासि शिवम्
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥19॥

तव विमलेन्दुकुलं वदनेन्दुमलं सकलं ननु कूलयते
किमु पुरुहूतपुरीन्दु मुखी सुमुखीभिरसौ विमुखीक्रियते।
मम तु मतं शिवनामधने भवती कृपया किमुत क्रियते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥20॥

अयि मयि दीन दयालुतया कृपयैव त्वया भवितव्यमुमे
अयि जगतो जननी कृपयासि यथासि तथानुमितासिरते।
यदुचितमत्र भवत्युररीकुरुतादुरुतापमपाकुरुते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥21॥

॥ इति श्री महिषासुरमर्दिनी स्तोत्रम् सम्पूर्णम् ॥

---

॥ Mahishasura Mardini Stotram ॥

Ayi Girinandini Nanditamedini Vishwavinodini Nandinute
Girivaravindhyashiro'dhinivasini Vishnuvilasini Jishnunute.
Bhagavati He Shitikanthakutumbini Bhoorikutumbini Bhoorikrite
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥1॥

Suravaravarshini Durdharadharshini Durmukhamarshini Harsharate
Tribhuvanaposhini Shankaratoshini Kilbishamoshini Ghosharate.
Danujaniroshini Ditisutaroshini Durmadashoshini Sindhusute
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥2॥

Ayi Jagadamba Madamba Kadamba Vanapriyavasini Hasarate
Shikhari Shiromani Tungahimalaya Shringanijaalaya Madhyagate.
Madhumadhure Madhukaitabhaganjini Kaitabhabhanjini Rasarate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥3॥

Ayi Shatakhanda Vikhanditarunda Vitunditashunda Gajadhipate
Ripugajaganda Vidaranachanda Parakramashunda Mrigadhipate.
Nijabhujadanda Nipatitakhanda Vipatitamunda Bhatadhipate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥4॥

Ayi Ranadurmada Shatruvadhodita Durdharanirjara Shaktibhrite
Chaturavichara Dhureenamahashiva Dootakrita Pramathadhipate.
Duritadureeha Durashayarurmati Danavaduta Kritantamate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥5॥

Ayi Sharanagata Vairivadhuvara Veeravarabhaya Dayakare
Tribhuvanamastak Shulavirodhi Shiro'dhikritamala Shulakare.
Dumidumitamar Dhundubhinaadamahomukharikrita Dingmakare
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥6॥

Ayi Nijahumkriti Matranirakrita Dhoomravilochana Dhoomrashate
Samaravishoshita Shonitabeeja Samudbhavashonita Beejalate.
Shivashivashumbha Nishumbhamahaahava Tarpitabhoota Pishacharate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥7॥

Dhanuranushanga Ranakshanasanga Parisphuradanga Natatkadake
Kanakapishanga Prishatkanishanga Rasadbhatashrunga Hataabatuke.
Kritachaturanga Balakshitiranga Ghatadbahuranga Ratadbatuke
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥8॥

Suralalana Tatathei Tathei Kritabhinayodara Nrityarate
Krita Kukuthah Kukutho Gadadaadikataala Kutoohala Gaanarate.
Dhudhukuta Dhukkuta Dhindhimita Dhvani Dheera Mridanga Ninadarate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥9॥

Jaya Jaya Japya Jayejayashabda Parastuti Tatparavishwanute
Jhanajhanajhinjhimi Jhinkrita Noopurashinjitamohita Bhootapate.
Natita Nataardha Natee Nata Nayaka Natitanatya Sugaanarate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥10॥

Ayi Sumanah-Sumanah-Sumanah Sumanah-Sumanoharakantiyute
Shritarajanee Rajaneerajanee Rajaneerajanee Karavaktravrite.
Sunayanavibramar Bhramarabhramar Bhramarabhramaradhipate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥11॥

Sahitamahahava Mallamatallika Mallitarallaka Mallarate
Virachitavallika Pallikamallik Jhillikabhillik Vargavrite.
Shitakritaphulla Samullasitaruna Tallajapallava Sallalite
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥12॥

Aviralaganda Galanmadamedura Mattamatanga Jaraajapate
Tribhuvanabhushana Bhootakalaanidhi Roopapayonidhi Raajasute.
Ayi Sudateejana Laalsamanasa Mohana Manmatharajasute
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥13॥

Kamaladaalaamal Komalakanti Kalakalitaamala Bhaaldate
Sakalavilaasa Kalanilayakrama Kelichalatkala Hansakule.
Alikulasankula Kuvalayamandala Maulimiladbakualaalikule
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥14॥

Karamuraaleereeva Veejitakoojita Lajjitakokila Manjumate
Militapulinda Manoharaguinjita Ranjitashaila Nikunjgate.
Nijaganabhoota Mahashabareegana Sadgunasambhrita Kelitale
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥15॥

Katitataapeeta Dukoolavichitra Mayukhatirakrita Chandraruchey
Pranatsurasur Maulismanisphura Danshulasannakha Chandraruchey.
Jitkanakachal Maulimadorjita Nirbharakunjara Kumbhakuchey
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥16॥

Vijitasahasrakaraika Sahasrakaraika Sahasrakaraikanute
Kritasurataraka Sangarataraka Sangarataraka Soonusute.
Surathasamadhi Samanasamadhi Samadhisamadhi Sujaatarate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥17॥

Padakamalam Karunaalaye Varivasyati Yo'nudinam Sushive
Ayi Kamale Kamalanilaye Kamalanilayah Sa Katham Na Bhavet.
Tava Padameva Parampadamityanushilayato Mama Kim Na Shive
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥18॥

Kanakalasatkalasindhujalairanushinchati Tegunarangabhuvam
Bhajati Sa Kim Na Shacheekuchakumbhatateeperirambhasukhaanubhavam.
Tava Charanam Sharanam Karavaani Natamaravaani Nivaasi Shivam
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥19॥

Tava Vimalendukulam Vadanendumalam Sakalam Nanu Koolayate
Kimu Puruhootapureeindu Mukhee Sumukheebhirasau Vimukheekriate.
Mama Tu Matam Shivanamadhane Bhavatee Kripaya Kimuta Kriyate
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥20॥

Ayi Mayi Deena Dayalutaya Kripayaiva Tvaya Bhavitavyamume
Ayi Jagato Jananee Kripayasi Yathasi Tathanumitaasirate.
Yaduchitamatra Bhavatyurareekurutaadurutaapamapaakurute
Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute.॥21॥

॥ Iti Shri Mahishasura Mardini Stotram Sampoornam ॥`;

const updatedDescription = 'Mahishasura Mardini Stotram is a magnificent hymn composed by Adi Shankaracharya, glorifying Goddess Durga (Chamundeshwari) who vanquished the mighty buffalo-demon Mahishasura. This 21-verse masterpiece is renowned for its powerful rhythmic metre and devotional intensity. Each verse ends with the exalted refrain "Jaya Jaya He Mahishasuramardini Ramyakapardini Shailasute," celebrating the Daughter of the Mountains who adorns beautiful braided hair. The stotram is chanted during Navratri and Durga Puja for divine protection, courage, and the destruction of inner and outer evils.';

async function updateMahishasuraMardiniStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Devotional.findOneAndUpdate(
      { title: /महिषासुरमर्दिनी/i, category: 'Stotra' },
      {
        $set: {
          lyrics: fullLyrics,
          description: updatedDescription,
          deity: 'Durga',
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (result) {
      console.log('✓  Updated: ' + result.title);
      console.log('   Lyrics length: ' + result.lyrics.length + ' chars');
    } else {
      console.log('✗  Mahishasura Mardini Stotram not found in DB!');
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

updateMahishasuraMardiniStotram();
