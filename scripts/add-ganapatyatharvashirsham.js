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

const newStotra = {
  title: 'श्री गणपत्यथर्वशीर्षम् (Shri Ganapatyatharvashirsham)',
  deity: 'Ganesh',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Shri Ganapatyatharvashirsham (Ganapati Atharvashirsha Upanishad) is one of the most sacred and complete hymns dedicated to Lord Ganesha. This Upanishadic text from the Atharvaveda declares Ganesha as the supreme reality — the Brahman itself. It identifies Ganesha with all five elements (earth, water, fire, air, ether), the four levels of speech, the three gunas, the three states of consciousness, and the three aspects of time. The text includes the Shanti Patha (peace invocation), the celebrated declaration "Tvameva pratyaksham tattvamasi" (You alone are the visible truth), the Ganapati Gayatri mantra "Ekadantaya vidmahe vakratundaya dhimahi", and the powerful dhyana shloka describing the red-complexioned, one-tusked, four-armed Lord seated on a mouse. Benefits of recitation include removal of all obstacles, destruction of the five great sins, attainment of eloquence, knowledge, and all desires. It is especially potent when recited during solar eclipses or near holy rivers.',
  lyrics: `॥ श्री गणपत्यथर्वशीर्षम् ॥

ॐ भद्रं कर्णेभिः शृणुयाम देवाः भद्रं पश्येमाक्षभिर्यजत्राः।
स्थिरैरङ्गैस्तुष्टुवाꣳ सस्तनूभिः व्यशेम देवहितं यदायुः॥

स्वस्ति न इन्द्रो वृद्धश्रवाः स्वस्ति नः पूषा विश्ववेदाः।
स्वस्ति नस्तार्क्ष्यो अरिष्टनेमिः स्वस्ति नो बृहस्पतिर्दधातु॥

ॐ शान्तिः! शान्तिः!! शान्तिः!!!

हरिः ॐ नमस्ते गणपतये। त्वमेव प्रत्यक्षं तत्त्वमसि।
त्वमेव केवलं कर्तासि। त्वमेव केवलं धर्तासि।
त्वमेव केवलं हर्तासि। त्वमेव सर्वं खल्विदं ब्रह्मासि।
त्वं साक्षादात्मासि नित्यम्॥1॥

ऋतं वच्मि। सत्यं वच्मि॥2॥

अव त्वं माम्। अव वक्तारम्। अव श्रोतारम्।
अव दातारम्। अव धातारम्। अवानूचानमव शिष्यम्।
अव पश्चात्तात्। अव पुरस्तात्। अवोत्तरात्तात्।
अव दक्षिणात्तात्। अव चोर्ध्वात्तात्।
अवाधरात्तात्। सर्वतो मां पाहि पाहि समन्तात्॥3॥

त्वं वाङ्मयस्त्वं चिन्मयः।
त्वमानन्दमयस्त्वं ब्रह्ममयः।
त्वं सच्चिदानन्दाद्वितीयोऽसि।
त्वं प्रत्यक्षं ब्रह्मासि।
त्वं ज्ञानमयो विज्ञानमयोऽसि॥4॥

सर्वं जगदिदं त्वत्तो जायते।
सर्वं जगदिदं त्वत्तस्तिष्ठति।
सर्वं जगदिदं त्वयि लयमेष्यति।
सर्वं जगदिदं त्वयि प्रत्येति।
त्वं भूमिरापोऽनलोऽनिलो नभः।
त्वं चत्वारि वाक्पदानि॥5॥

त्वं गुणत्रयातीतः। त्वं अवस्थात्रयातीतः।
त्वं देहत्रयातीतः। त्वं कालत्रयातीतः।
त्वं मूलाधारस्थितोऽसि नित्यम्।
त्वं शक्तित्रयात्मकः। त्वां योगिनो ध्यायन्ति नित्यम्।
त्वं ब्रह्मा त्वं विष्णुस्त्वं रुद्रस्त्वमिन्द्रस्त्वमग्निस्त्वं
वायुस्त्वं सूर्यस्त्वं चन्द्रमास्त्वं ब्रह्म भूर्भुवः स्वरोम्॥6॥

गणादिं पूर्वमुच्चार्य वर्णादिं स्तदनन्तरम्। अनुस्वारः परतरः।
अर्धेन्दुलसितम्। तारेण ऋद्धम्। एतत्तव मनुस्वरूपम्।
गकारः पूर्वरूपम्। अकारो मध्यमरूपम्। अनुस्वारश्चान्त्यरूपम्।
बिन्दुरुत्तररूपम् नादः सन्धानम्। संहिता सन्धिः।
सैषा गणेशविद्या। गणक ऋषिः। निचृद्गायत्री छन्दः।
श्रीमहागणपतिर्देवता। ॐ गं गणपतये नमः॥7॥

एकदन्ताय विद्महे वक्रतुण्डाय धीमहि।
तन्नो दन्तिः प्रचोदयात्॥8॥

एकदन्तं चतुर्हस्तं पाशमङ्कुशधारिणम्।
रदं च वरदं हस्तैर्बिभ्राणं मूषकध्वजम्॥
रक्तं लम्बोदरं शूर्पकर्णकं रक्तवाससम्।
रक्तगन्धानुलिप्ताङ्गं रक्तपुष्पैः सुपूजितम्॥
भक्तानुकम्पिनं देवं जगत्कारणमच्युतम्।
आविर्भूतं च सृष्ट्यादौ प्रकृतेः पुरुषात्परम्॥
एवं ध्यायति यो नित्यं स योगी योगिनां वरः॥9॥

नमो व्रातपतये नमो गणपतये नमः
प्रमथपतये नमस्तेऽस्तु लम्बोदराय एकदन्ताय
विघ्नविनाशिने शिवसुताय श्रीवरदमूर्तये नमः॥10॥

एतदथर्वशीर्षं योऽधीते। स ब्रह्मभूयाय कल्पते।
स सर्वविघ्नैर्न बाध्यते। स सर्वतः सुखमेधते।
स पञ्चमहापापात् प्रमुच्यते।
सायमधीयानो दिवसकृतं पापं नाशयति।
प्रातरधीयानो रात्रिकृतं पापं नाशयति।
सायं प्रातः प्रयुञ्जानः पापोऽपापो भवति।
धर्मार्थकाममोक्षं च विन्दति।
इदमथर्वशीर्षमशिष्याय न देयम्।
यो यदि मोहाद् दास्यति। स पापीयान् भवति।
सहस्रावर्तनाद्यं यं काममधीते। तं तमनेन साधयेत्॥11॥

अनेन गणपतिमभिषिञ्चति। स वाग्मी भवति।
चतुर्थ्यामनश्नन् जपति। स विद्यावान् भवति।
इत्यथर्वणवाक्यम्। ब्रह्माद्याचरणं विद्यान्न बिभेति कदाचनेति॥12॥

यो दूर्वाङ्कुरैर्यजति स वैश्रवणोपमो भवति।
यो लाजैर्यजति। स यशोवान् भवति। स मेधावान् भवति।
यो मोदकसहस्रेण यजति स वाञ्छितफलमवाप्नोति।
यः साज्य समिद्भिर्यजति। स सर्वं लभते स सर्वं लभते॥13॥

अष्टौ ब्राह्मणान् सम्यग्
ग्राहयित्वा सूर्यवर्चस्वी भवति।
सूर्यग्रहे महानद्यां प्रतिमासन्निधौ
वा जप्त्वा सिद्धमन्त्रो भवति।
महाविघ्नात् प्रमुच्यते। महादोषात् प्रमुच्यते।
महापापात् प्रमुच्यते। महाप्रत्यवायात् प्रमुच्यते।
स सर्वविद्भवति स सर्वविद्भवति।
य एवं वेद। इत्युपनिषत्॥14॥

ॐ भद्रं कर्णेभिः शृणुयाम देवाः भद्रं पश्येमाक्षभिर्यजत्राः।
स्थिरैरङ्गैस्तुष्टुवाꣳ सस्तनूभिः व्यशेम देवहितं यदायुः॥

स्वस्ति न इन्द्रो वृद्धश्रवाः स्वस्ति नः पूषा विश्ववेदाः।
स्वस्ति नस्तार्क्ष्यो अरिष्टनेमिः स्वस्ति नो बृहस्पतिर्दधातु॥

ॐ शान्तिः! शान्तिः!! शान्तिः!!!

॥ इति श्रीगणपत्यथर्वशीर्षं समाप्तम् ॥

---

॥ Shri Ganapatyatharvashirsham ॥

Om bhadram karnebhih shrinuyama devah bhadram pashyemakshabhiryajatrah.
Sthirairangaistushtuva-gum-sastanubhih vyashema devahitam yadayuh॥

Svasti na indro vriddhashravaah svasti nah pusha vishvavedaah.
Svasti nastaarkshyo arishtanemih svasti no brihaspatirdadhaatu॥

Om Shantih! Shantih!! Shantih!!!

Harih Om namaste ganapataye. Tvameva pratyaksham tattvamasi.
Tvameva kevalam kartasi. Tvameva kevalam dhartasi.
Tvameva kevalam hartasi. Tvameva sarvam khalvidam brahmasi.
Tvam sakshadadatmasi nityam॥1॥

Ritam vachmi. Satyam vachmi॥2॥

Ava tvam mam. Ava vaktaram. Ava shrotaram.
Ava dataram. Ava dhataram. Avanuchanamava shishyam.
Ava pashchattat. Ava purastat. Avottarattat.
Ava dakshinattat. Ava chordhvattat.
Avadharattat. Sarvato mam pahi pahi samantat॥3॥

Tvam vangmayastvam chinmayah.
Tvamanandamayastvam brahmamayah.
Tvam sachchidanandadvitiyosi.
Tvam pratyaksham brahmasi.
Tvam jnanamayo vijnanamayosi॥4॥

Sarvam jagadidam tvatto jayate.
Sarvam jagadidam tvattastishthati.
Sarvam jagadidam tvayi layameshyati.
Sarvam jagadidam tvayi pratyeti.
Tvam bhumiraponalonilo nabhah.
Tvam chatvari vakpadani॥5॥

Tvam gunatrayatitah. Tvam avasthatrayatitah.
Tvam dehatrayatitah. Tvam kalatrayatitah.
Tvam muladharasthitosi nityam.
Tvam shaktitrayatmakah. Tvam yogino dhyayanti nityam.
Tvam brahma tvam vishnustvam rudrastvamindrastvamagnistvam
vayustvam suryastvam chandramastvam brahma bhurbhuvah svarom॥6॥

Ganadim purvamuchcharya varnadim stadanantaram. Anusvarah paratarah.
Ardhendulasitam. Tarena riddham. Etattava manusvarupam.
Gakarah purvarupam. Akaro madhyamarupam. Anusvarashchantyarupam.
Binduruttararupam nadah sandhanam. Samhita sandhih.
Saisha ganeshavidya. Ganaka riship. Nichridgayatri chhandah.
Shrimahaganapatirdevata. Om gam ganapataye namah॥7॥

Ekadantaya vidmahe vakratundaya dhimahi.
Tanno dantih prachodayat॥8॥

Ekadantam chaturhastam pashamankushadhaarinam.
Radam cha varadam haistairbibhranam mushakadhhvajam॥
Raktam lambodaram shurpakarnakam raktavasasam.
Raktagandhanuliptangam raktapushpaih supujitam॥
Bhaktanukampinam devam jagatkaaranamachyutam.
Avirbhutam cha srishtyaadau prakriteh purushatparam॥
Evam dhyayati yo nityam sa yogi yoginam varah॥9॥

Namo vratapataye namo ganapataye namah
pramathapataye namostestu lambodaraya ekadantaya
vighnavinashane shivasutaya shrivaradamurtaye namah॥10॥

Etadatharvashirsham yodhite. Sa brahmabhuyaya kalpate.
Sa sarvavighnairna badhyate. Sa sarvatah sukhamedhate.
Sa panchamahapapat pramuchyate.
Sayamadhiyano divasakritam papam nashayati.
Prataradhiyano ratrikritam papam nashayati.
Sayam pratah prayunjanah papopaapo bhavati.
Dharmarthakamamoksham cha vindati.
Idamatharvashirshamashishyaya na deyam.
Yo yadi mohad dasyati. Sa papeeyan bhavati.
Sahasravartanadyam yam kamamadhite. Tam tamanena sadhayet॥11॥

Anena ganapatimabhishinjchati. Sa vagmi bhavati.
Chaturthyamanashnan japati. Sa vidyavan bhavati.
Ityatharvanavaakyam. Brahmadyacharanam vidyanna bibheti kadachaneti॥12॥

Yo durvankurairyajati sa vaishravanopamo bhavati.
Yo lajairyajati. Sa yashovan bhavati. Sa medhavan bhavati.
Yo modakasahasrena yajati sa vanchitaphalamavaapnoti.
Yah sajya samiddhiryajati. Sa sarvam labhate sa sarvam labhate॥13॥

Ashtau brahmanan samyag
grahayitva suryavarchasvi bhavati.
Suryagrahe mahanadyam pratimasannidhau
va japtva siddhamantro bhavati.
Mahavighnat pramuchyate. Mahadoshat pramuchyate.
Mahapapat pramuchyate. Mahapratyavayat pramuchyate.
Sa sarvavidbhavati sa sarvavidbhavati.
Ya evam veda. Ityupanishat॥14॥

Om bhadram karnebhih shrinuyama devah bhadram pashyemakshabhiryajatrah.
Sthirairangaistushtuva-gum-sastanubhih vyashema devahitam yadayuh॥

Svasti na indro vriddhashravaah svasti nah pusha vishvavedaah.
Svasti nastaarkshyo arishtanemih svasti no brihaspatirdadhaatu॥

Om Shantih! Shantih!! Shantih!!!

॥ Iti Shri Ganapatyatharvashirsham Samaptam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Ganapatyatharvashirsham already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Ganapatyatharvashirsham added successfully!');
    }

    const total = await Devotional.countDocuments({ category: 'Stotra' });
    console.log(`📜 Total Stotras in DB: ${total}`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addStotra();
