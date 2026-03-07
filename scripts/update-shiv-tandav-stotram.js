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

const fullLyrics = `॥ शिव ताण्डव स्तोत्रम् ॥

जटाटवीगलज्जल प्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥1॥

जटा टवी गलज् जल प्रवाह पावितस्थले (पावितः थले)
गले अवलंब्य लम्बितां भुजङ्ग तुङ्ग मालिकाम्।
डमड् डमड् डमड् डमन्नि नाद वड्ड मर्वयं
चकार चण्ड ताण्डवं तनोतु नः शिवः शिवम्॥1॥

उनके बालों से बहने वाले जल से उनका कंठ पवित्र है,
और उनके गले में सांप है जो हार की तरह लटका है,
और डमरू से डमट् डमट् डमट् की ध्वनि निकल रही है,
भगवान शिव शुभ तांडव नृत्य कर रहे हैं, वे हम सबको संपन्नता प्रदान करें।॥1॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी-
विलोलवीचिवल्लरीविराजमानमूर्धनि।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम॥2॥

जटा कटाह सम्भ्रम भ्रमन्नि लिम्प निर्झरी
विलोल वीचि वल्लरी विराज मान मूर्धनि।
धगद धगद धगज् ज्वल ललाट पट्ट पावके
किशोर चन्द्र शेखरे रतिः प्रतिक्षणं मम॥2॥

मेरी शिव में गहरी रुचि है,
जिनका सिर अलौकिक गंगा नदी की बहती लहरों की धाराओं से सुशोभित है,
जो उनकी बालों की उलझी जटाओं की गहराई में उमड़ रही हैं?
जिनके मस्तक की सतह पर चमकदार अग्नि प्रज्वलित है,
और जो अपने सिर पर अर्ध-चंद्र का आभूषण पहने हैं।॥2॥

धराधरेन्द्रनन्दिनीविलासबन्धुबन्धुर-
स्फुरद्दिगन्तसन्ततिप्रमोदमानमानसे।
कृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि
क्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि॥3॥

धरा धरेन्द्र नन्दिनी विलास बन्धु बन्धुर
स्फ़ुरद दिगंत सन्तति प्रमोद मान मानसे।
कृपा कटाक्ष धोरणी निरुद्ध दुर्धर आपदि
क्वचिद् दिगम्बरे मनो विनोद मेतु वस्तुनि॥3॥

मेरा मन भगवान शिव में अपनी खुशी खोजे,
अद्भुत ब्रह्माण्ड के सारे प्राणी जिनके मन में मौजूद हैं,
जिनकी अर्धांगिनी पर्वतराज की पुत्री पार्वती हैं,
जो अपनी करुणा दृष्टि से असाधारण आपदा को नियंत्रित करते हैं, जो सर्वत्र व्याप्त है,
और जो दिव्य लोकों को अपनी पोशाक की तरह धारण करते हैं।॥3॥

जटाभुजङ्गपिङ्गलस्फुरत्फणामणिप्रभा-
कदम्बकुङ्कुमद्रवप्रलिप्तदिग्वधूमुखे।
मदान्धसिन्धुरस्फुरत्त्वगुत्तरीयमेदुरे मनो
विनोदमद्भुतं बिभर्तु भूतभर्तरि॥4॥

जटा भुजंग पिंगल स्फुरत् फ़णा मणि प्रभा
कदम्ब कुङ्कुम द्रव प्रलिप्त दिग् वधू मुखे।
मदान्ध सिन्धुर स्फुरत्त् त्व गुत्तरीय मेदुरे (त्वग उत्तरीय मेदुरे)
मनो विनोद मद्भूतं बिभर्तु भूत भर्तरि॥4॥

मुझे भगवान शिव में अनोखा सुख मिले, जो सारे जीवन के रक्षक हैं,
उनके रेंगते हुए सांप का फन लाल-भूरा है और मणि चमक रही है,
ये दिशाओं की देवियों के सुंदर चेहरों पर विभिन्न रंग बिखेर रहा है,
जो विशाल मदमस्त हाथी की खाल से बने जगमगाते दुशाले से ढंका है।॥4॥

सहस्रलोचनप्रभृत्यशेषलेखशेखर-
प्रसूनधूलिधोरणीविधूसराङ्घ्रिपीठभूः।
भुजङ्गराजमालया निबद्धजाटजूटकः
श्रियै चिराय जायतां चकोरबन्धुशेखरः॥5॥

सहस्रलोचन प्रभृत्य शेष लेख शेखर-
प्रसून धूलि धोरणी विधू सराङ्ग़ ध्रि पीठभूः।
भुजङ्ग राज मालया निबद्ध जाट जूटकः
श्रियै चिराय जायतां चकोर बन्धु शेखरः॥5॥

भगवान शिव हमें संपन्नता दें,
जिनका मुकुट चंद्रमा है,
जिनके बाल लाल नाग के हार से बंधे हैं,
जिनका पायदान फूलों की धूल के बहने से गहरे रंग का हो गया है,
जो इंद्र, विष्णु और अन्य देवताओं के सिर से गिरती है।॥5॥

ललाटचत्वरज्वलद्धनञ्जयस्फुलिङ्गभा-
निपीतपञ्चसायकं नमन्निलिम्पनायकम्।
सुधामयूखलेखया विराजमान शेखरं
महाकपालि सम्पदे शिरो जटालमस्तु नः॥6॥

ललाट चत्वर ज्वलद् धनञ्जय स्फु लिङ्गभा-
निपीत पञ्च सायकं नमन्नि लिम्प नायकम्।
सुधा मयूख लेखया विराज मान शेखरं
महाकपालि सम्पदे शिरो जटाल मस्तु नः॥6॥

शिव के बालों की उलझी जटाओं से हम सिद्धि की दौलत प्राप्त करें,
जिन्होंने कामदेव को अपने मस्तक पर जलने वाली अग्नि की चिनगारी से नष्ट किया था,
जो सारे देवलोकों के स्वामियों द्वारा आदरणीय हैं,
जो अर्ध-चंद्र से सुशोभित हैं।॥6॥

करालभालपट्टिकाधगद्धगद्धगज्ज्वलद्-
धनञ्जयाहुतीकृतप्रचण्डपञ्चसायके।
धराधरेन्द्रनन्दिनीकुचाग्रचित्रपत्रक
प्रकल्पनैकशिल्पिनि त्रिलोचने रतिर्मम॥7॥

कराल भाल पट्टिका धगद् धगद् धगज् ज्वल्ल् (ज्वल्ल्द)
धनंजय आहुतिकृत प्रचण्ड पञ्च सायके।
धराधरेन्द्र नन्दिनी कुचाग्र चित्र पत्रक
प्रकल्प नैक शिल्पिनि त्रिलोचने रति र्मम॥7॥

मेरी रुचि भगवान शिव में है, जिनके तीन नेत्र हैं,
जिन्होंने शक्तिशाली कामदेव को अग्नि को अर्पित कर दिया,
उनके भीषण मस्तक की सतह डगद् डगद्... की घ्वनि से जलती है,
वे ही एकमात्र कलाकार है जो पर्वतराज की पुत्री पार्वती के स्तन की नोक पर,
सजावटी रेखाएं खींचने में निपुण हैं।॥7॥

नवीनमेघमण्डलीनिरुद्धदुर्धरस्फुरत्-
कुहूनिशीथिनीतमःप्रबन्धबद्धकन्धरः।
निलिम्पनिर्झरीधरस्तनोतु कृत्तिसिन्धुरः
कलानिधानबन्धुरः श्रियं जगद्धुरन्धरः॥8॥

नवीन मेघ मण्डली निरुद्ध दुर्धर स्फुरत्-
कुहू निशी थिनी तमः प्रबन्धबद्ध कन्धरः।
निलिम्प निर्झरी धरस्तनोतु कृत्ति सिन्धुरः
कलानिधान बन्धुरः श्रियं जगद धुरंधरः॥8॥

भगवान शिव हमें संपन्नता दें,
वे ही पूरे संसार का भार उठाते हैं,
जिनकी शोभा चंद्रमा है,
जिनके पास अलौकिक गंगा नदी है,
जिनकी गर्दन गला बादलों की पर्तों से ढंकी अमावस्या की अर्धरात्रि की तरह काली है।॥8॥

प्रफुल्लनीलपङ्कजप्रपञ्चकालिमप्रभा-
वलम्बिकण्ठकन्दलीरुचिप्रबद्धकन्धरम्।
स्मरच्छिदं पुरच्छिदं भवच्छिदं मखच्छिदं
गजच्छिदान्धकच्छिदं तमन्तकच्छिदं भजे॥9॥

प्रफुल्ल नील पङ्कज प्रपञ्च कालिम प्रभा-
वलम्बि कण्ठ कन्दली रुचि प्रबद्ध कन्धरम्।
स्मरच्छिदं पुरच्छिदं भवच्छिदं मखच्छिदं
गजच्छिद आन्धकच्छिदं तमन्त कच्छिदं भजे॥9॥

मैं भगवान शिव की प्रार्थना करता हूं, जिनका कंठ मंदिरों की चमक से बंधा है,
पूरे खिले नीले कमल के फूलों की गरिमा से लटकता हुआ,
जो ब्रह्माण्ड की कालिमा सा दिखता है।
जो कामदेव को मारने वाले हैं, जिन्होंने त्रिपुर का अंत किया,
जिन्होंने सांसारिक जीवन के बंधनों को नष्ट किया, जिन्होंने बलि का अंत किया,
जिन्होंने अंधक दैत्य का विनाश किया, जो हाथियों को मारने वाले हैं,
और जिन्होंने मृत्यु के देवता यम को पराजित किया।॥9॥

अखर्वसर्वमङ्गलाकलाकदम्बमञ्जरी-
रसप्रवाहमाधुरीविजृम्भणामधुव्रतम्।
स्मरान्तकं पुरान्तकं भवान्तकं मखान्तकं
गजान्तकान्धकान्तकं तमन्तकान्तकं भजे॥10॥

अखर्व सर्व मङ्गला कला कदम्ब मञ्जरी-
रसप्रवाह माधुरी विजृम्भणा मधु व्रतम्।
स्मरान्तकं पुरान्तकं भवान्तकं मखान्तकं
गजान्त कान्ध कान्तकं तमन्त कान्तकं भजे॥10॥

मैं भगवान शिव की प्रार्थना करता हूं, जिनके चारों ओर मधुमक्खियां उड़ती रहती हैं
शुभ कदंब के फूलों के सुंदर गुच्छे से आने वाली शहद की मधुर सुगंध के कारण,
जो कामदेव को मारने वाले हैं, जिन्होंने त्रिपुर का अंत किया,
जिन्होंने सांसारिक जीवन के बंधनों को नष्ट किया, जिन्होंने बलि का अंत किया,
जिन्होंने अंधक दैत्य का विनाश किया, जो हाथियों को मारने वाले हैं,
और जिन्होंने मृत्यु के देवता यम को पराजित किया।॥10॥

जयत्वदभ्रविभ्रमभ्रमद्भुजङ्गमश्वस-
द्विनिर्गमत्क्रमस्फुरत्करालभालहव्यवाट्
धिमिद्धिमिद्धिमिद्ध्वनन्मृदङ्गतुङ्गमङ्गल-
ध्वनिक्रमप्रवर्तितप्रचण्डताण्डवः शिवः॥11॥

जय त्वद भ्र विभ्रम भ्रमद् भुजङ्गम अश्वस (अश्वसद्-)
विनिर् गमत् क्रम स्फ़ुरत कराल भाल हव्य वाट।
धिमिद धिमिद धिमिद् ध्वन मृदंग तुङ्ग मङ्गल-
ध्वनि क्रम प्रवर्तित प्रचण्ड ताण्डवः शिवः॥11॥

शिव, जिनका तांडव नृत्य नगाड़े की ढिमिड ढिमिड
तेज आवाज श्रंखला के साथ लय में है,
जिनके महान मस्तक पर अग्नि है, वो अग्नि फैल रही है नाग की सांस के कारण,
गरिमामय आकाश में गोल-गोल घूमती हुई।॥11॥

दृषद्विचित्रतल्पयोर्भुजङ्गमौक्तिकस्रजो-
र्वरिष्ठरत्नलोष्ठयोः सुहृद्विपक्षपक्षयोः।
तृणारविन्दचक्षुषोः प्रजामहीमहेन्द्रयोः
समप्रवृत्तिकः कदा सदाशिवं भजाम्यहम्॥12॥

दृषद् विचित्र तल्पयोर् भुज़ँग मौक्ति कस्रजोर्-
गरिष्ठ रत्न लोष्ठयोः सुहृद् विपक्ष पक्षयोः।
तृणार विन्द चक्षुषोः प्रजा मही महेन्द्रयोः
सम प्रवृत्तिकः कदा सदाशिवं भजाम्यहम्॥12॥

मैं भगवान सदाशिव की पूजा कब कर सकूंगा, शाश्वत शुभ देवता,
जो रखते हैं सम्राटों और लोगों के प्रति समभाव दृष्टि,
घास के तिनके और कमल के प्रति, मित्रों और शत्रुओं के प्रति,
सर्वाधिक मूल्यवान रत्न और धूल के ढेर के प्रति,
सांप और हार के प्रति और विश्व में विभिन्न रूपों के प्रति?॥12॥

कदा निलिम्पनिर्झरीनिकुञ्जकोटरे वसन्
विमुक्तदुर्मतिः सदा शिरःस्थमञ्जलिं वहन्।
विलोललोललोचनो ललामभाललग्नकः
शिवेति मन्त्रमुच्चरन् कदा सुखी भवाम्यहम्॥13॥

कदा निलिम्प निर्झरी निकुञ्ज कोटरे वसन्
विमुक्त दुर्मतिः सदा शिरःस्थ मञ्जलिं वहन्।
विलोल लोल लोचनो ललाम भाल लग्नकः
शिवेति मन्त्र मुच्चरन् कदा सुखी भवाम्यहम्॥13॥

मैं कब प्रसन्न हो सकता हूं, अलौकिक नदी गंगा के निकट गुफा में रहते हुए,
अपने हाथों को हर समय बांधकर अपने सिर पर रखे हुए,
अपने दूषित विचारों को धोकर दूर करके, शिव मंत्र को बोलते हुए,
महान मस्तक और जीवंत नेत्रों वाले भगवान को समर्पित?॥13॥

इमं हि नित्यमेवमुक्तमुत्तमोत्तमं स्तवं
पठन्स्मरन्ब्रुवन्नरो विशुद्धिमेति सन्ततम्।
हरे गुरौ सुभक्तिमाशु याति नान्यथा गतिं
विमोहनं हि देहिनां सुशङ्करस्य चिन्तनम्॥14॥

इमं हि नित्यमेव मुक्त मुत् मौत्तमम स्तवं
(इमं हि नित्यम एवं उक्तम उत्मोत्तमम स्तवं)
पठन् स्मरन् ब्रुवन्नरो विशुद्धि मेति संततम्।
हरे गुरौ सुभक्ति माशु याति नान्यथा गतिं
विमोहनं हि देहिनां सुशङ्करस्य चिन्तनम्॥14॥

इस स्तोत्र को, जो भी पढ़ता है, याद करता है और सुनाता है,
वह सदैव के लिए पवित्र हो जाता है और महान गुरु शिव की भक्ति पाता है।
इस भक्ति के लिए कोई दूसरा मार्ग या उपाय नहीं है।
बस शिव का विचार ही भ्रम को दूर कर देता है।॥14॥

पूजावसानसमये दशवक्त्रगीतं
यः शम्भुपूजनपरं पठति प्रदोषे।
तस्य स्थिरां रथगजेन्द्रतुरङ्गयुक्तां लक्ष्मीं
सदैवसुमुखिं प्रददाति शम्भुः॥15॥

पूजावसान (पूजा अवसान) समये दशवक्त्रगीतं
यः शम्भुपूजन परं पठति प्रदोषे।
तस्य स्थिरां रथ गजेन्द्रतुरङ्ग युक्तां
लक्ष्मीं सदैव सुमुखीं प्रददाति शम्भुः॥15॥

---

|| Shiv Tandav Stotram ||

Jatatavigalajjala Pravahapavitasthale
Gale'valambya Lambitam Bhujangatungamalikam.
Damaddamaddamaddamanninadavaddamarvayam
Chakara Chandatandavam Tanotu Nah Shivah Shivam. ||1||

Jatakataha-sambhrama-bhramannilimpanirjhari-
Vilolavichivallari-virajamana-murdhani.
Dhagaddhagaddhagajjvalal-lalatapattapavake
Kishorachandrashekhere Ratih Pratikshanam Mama. ||2||

Dharadharendranandini-vilasabandhubandhura-
Sphuraddigan-tasantatipramodamana-manase.
Kripakataksha-dhorani-niruddha-durdharapadi
Kvachiddigambare Mano Vinodametu Vastuni. ||3||

Jatabhujangapingala-sphuratphanamani-prabha-
Kadambakunkumadrava-praliptadigva-dhumukhe.
Madandhasindhura-sphurattvaguttariya-medure Mano
Vinodamadbhutam Bibhartu Bhutabhartari. ||4||

Sahasralochana-prabhritya-sheshalekha-shekhara-
Prasuna-dhuli-dhorani-vidhusara-anghri-pithabhooh.
Bhujangaraja-malaya Nibaddha-jatajootakah
Shriyai Chiraya Jayatam Chakora-bandhu-shekharah. ||5||

Lalatachatvara-jvaladdhananjaya-sphulingabha-
Nipitapanchasayakam Namannilimpa-nayakam.
Sudha-mayukha-lekhaya Virajamana Shekharam
Mahakapali Sampade Shiro Jatalam-astu Nah. ||6||

Karalabhala-pattika-dhagaddhagaddhagajjvalad-
Dhananjaya-ahutikrita-prachanda-panchasayake.
Dharadharendranandini-kuchagra-chitra-patraka
Prakalpa-naika-shilpini Trilochane Ratirmama. ||7||

Navinamegha-mandali-niruddha-durdhara-sphurat-
Kuhu-nishithini-tamah-prabandha-baddha-kandharah.
Nilimpanirjhari-dharas-tanotu Kritti-sindhurah
Kalanidhana-bandhurah Shriyam Jagaddhurarandharah. ||8||

Praphulla-nila-pankaja-prapancha-kalima-prabha-
Valambi-kantha-kandali-ruchi-prabaddha-kandharam.
Smarachchhidam Purachchhidam Bhavachchhidam Makhachchhidam
Gajachchhidandhaka-chchhidam Tamantaka-chchhidam Bhaje. ||9||

Akharvasarva-mangala-kala-kadamba-manjari-
Rasapravaha-madhuri-vijrimbhana-madhuvratam.
Smarantakam Purantakam Bhavantakam Makhantakam
Gajantakandhakantakam Tamantakantakam Bhaje. ||10||

Jayatvadabhravibhrama-bhramad-bhujangama-shvasa-
Dvinirgamatkrama-sphurat-karala-bhala-havyavat.
Dhimiddhimiddhimid-dhvanan-mridanga-tunga-mangala-
Dhvanikrama-pravartita-prachanda-tandavah Shivah. ||11||

Drishadvichitra-talpayorbhujanga-mauktikasrajo-
Rvarishtha-ratna-loshthayoh Suhridvipaksha-pakshayoh.
Trinaaravinda-chakshusoh Prajamahi-mahendrayoh
Samapravrittikaah Kada Sadashivam Bhajamyaham. ||12||

Kada Nilimpanirjhari-nikunjakotare Vasan
Vimuktadurmatih Sada Shirahstham-anjalim Vahan.
Vilolalola-lochano Lalama-bhala-lagnakah
Shiveti Mantram-uchcharan Kada Sukhi Bhavamyaham. ||13||

Imam Hi Nityam-evam-uktam-uttamottamam Stavam
Pathansmaranbruvannaro Vishuddhimeti Santatam.
Hare Gurau Subhaktim-ashu Yati Nanyatha Gatim
Vimohanam Hi Dehinam Sushankarsya Chintanam. ||14||

Pujavasana-samaye Dashavaktrageetam
Yah Shambhupujana-param Pathati Pradoshe.
Tasya Sthiram Rathagajendra-turangayuktam Lakshmim
Sadaivasmukhim Pradadati Shambhuh. ||15||`;

async function updateShivTandavStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({
      title: { $regex: /शिव ताण्डव स्तोत्रम्|Shiv Tandav Stotram/i },
      category: 'Stotra'
    });

    if (existing) {
      existing.title = 'शिव ताण्डव स्तोत्रम् (Shiv Tandav Stotram)';
      existing.description = 'Shiv Tandav Stotram is a powerful and dynamic hymn composed by Ravana, the ten-headed king of Lanka, in praise of Lord Shiva. It describes the cosmic dance (Tandava) of Lord Shiva with vivid imagery of his matted hair, the serpents adorning him, the crescent moon, and the sacred Ganga flowing from his locks. This stotra has 15 verses and is one of the most powerful Shiva stotras. Reciting it during Pradosha Kala (evening twilight) is said to bestow lasting wealth and prosperity by the grace of Lord Shambhu.';
      existing.lyrics = fullLyrics;
      existing.deity = 'Shiva';
      existing.language = 'Sanskrit';
      existing.updatedAt = new Date();
      await existing.save();
      console.log('✓  Updated: शिव ताण्डव स्तोत्रम् (Shiv Tandav Stotram) with full 15 verses + Hindi meaning + Roman English');
    } else {
      const doc = new Devotional({
        title: 'शिव ताण्डव स्तोत्रम् (Shiv Tandav Stotram)',
        deity: 'Shiva',
        category: 'Stotra',
        language: 'Sanskrit',
        status: 'approved',
        description: 'Shiv Tandav Stotram is a powerful and dynamic hymn composed by Ravana, the ten-headed king of Lanka, in praise of Lord Shiva. It describes the cosmic dance (Tandava) of Lord Shiva with vivid imagery of his matted hair, the serpents adorning him, the crescent moon, and the sacred Ganga flowing from his locks. This stotra has 15 verses and is one of the most powerful Shiva stotras. Reciting it during Pradosha Kala (evening twilight) is said to bestow lasting wealth and prosperity by the grace of Lord Shambhu.',
        lyrics: fullLyrics
      });
      await doc.save();
      console.log('✓  Added: शिव ताण्डव स्तोत्रम् (Shiv Tandav Stotram)');
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

updateShivTandavStotram();
