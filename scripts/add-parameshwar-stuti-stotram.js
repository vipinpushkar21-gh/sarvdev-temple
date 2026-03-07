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
  title: 'परमेश्वर स्तुति स्तोत्रम् (Parameshwar Stuti Stotram)',
  deity: 'Vishnu',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Parameshwar Stuti Sara Stotram is a profound 15-verse devotional hymn composed by Brahmananda, a disciple of Shri Mauktika Ramodaseena. This deeply philosophical stotram is a heartfelt prayer to the Supreme Lord (Parameshwar/Vishnu) seeking liberation from the cycle of birth and death (samsara). The devotee implores the Lord to remove the veil of Maya, grant the vision of non-dual Brahman, bestow Vedantic wisdom (tattva-jnana), and reveal the path across the ocean of worldly existence. The verses touch upon Advaitic themes — declaring the identity of the individual self (Atman) with Brahman, while humbly acknowledging that Maya causes the illusion of separation. The stotram references the Lord\'s saving of Gajendra and other devotees, and appeals for the same grace. It culminates in a beautiful plea for viveka (discrimination), vairagya (dispassion), and the six-fold virtues leading to moksha.',
  lyrics: `॥ परमेश्वर स्तुति स्तोत्रम् ॥

त्वमेकः शुद्धोऽसि त्वयि निगमबाह्या मलमयं
प्रपञ्चं पश्यन्ति भ्रमपरवशाः पापनिरताः।
बहिस्तेभ्यः कृत्वा स्वपदशरणं मानय विभो
गजेन्द्रे दृष्टं ते शरणद वदान्यं स्वपददम्॥1॥

न सृष्टेस्ते हानिर्यदि हि कृपयातोऽवसि च मां
त्वयानेके गुप्ता व्यसनमिति तेऽस्ति श्रुतिपथे।
अतो मामुद्धर्तुं घटय मयि दृष्टि सुविमलां
न रिक्तां मे याच्ञां स्वजनरत कर्तुं भव हरे॥2॥

कदाहं भो स्वामिन्नियतमनसा त्वां हृदि
भजन्नभद्रे संसारे ह्यनवरतदुःखेऽतिविरसः।
लभेयं तां शान्तिं परममुनिभिर्या ह्यधिगता
दयां कृत्वा मे त्वं वितर परशान्तिं भवहर॥3॥

विधाता चेद्विश्वं सृजति सृजतां मे शुभकृतिं
विधुश्चेत्पाता मावतु जनिमृतेर्दुःखजलधेः।
हरः संहर्ता संहरतु मम शोकं सजनकं
यथाहं मुक्तः स्यां किमपि तु तथा ते विदधताम्॥4॥

अहं ब्रह्मानन्दस्त्वमपि च तदाख्यः सुविदित
स्ततोऽहं भिन्नो नो कथमपि भवत्तः श्रुतिदृशा।
तथा चेदानीं त्वं त्वयि मम विभेदस्य जननीं
स्वमायां संवार्य प्रभव मम भेदं निरसितुम्॥5॥

कदाहं हे स्वामिञ्जनिमृतिमयं दुःखनिबिडं
भवं हित्वा सत्येऽनवरतसुखे स्वात्मवपुषि।
रमे तस्मिन्नित्यं निखिलमुनयो ब्रह्मरसिका
रमन्ते यस्मिंस्ते कृतसकलकृत्या यतिवरा॥6॥

पठन्त्येके शास्त्रं निगममपरे तत्परतया
यजन्त्यन्ये त्वां वै ददति च पदार्थांस्तव हितान्।
अहं तु स्वामिंस्ते शरणमगमं संसृतिभयाद्यथा
ते प्रीतिः स्याद्धितकर तथा त्वं कुरु विभो॥7॥

अहं ज्योतिर्नित्यो गगनमिव तृप्तः सुखमयः
श्रुतौ सिद्धोऽद्वैतः कथमपि न भिन्नोऽस्मि विधुतः।
इति ज्ञाते तत्त्वे भवति च परः संसृतिलया
दतस्तत्त्वज्ञानं मयि सुघटयेस्त्वं हि कृपया॥8॥

अनादौ संसारे जनिमृतिमये दुःखितमना
मुमुक्षुः सन्कश्चिद्भजति हि गुरुं ज्ञानपरमम्।
ततो ज्ञात्वा यं वै तुदति न पुनः क्लेशनिवहै
भजेऽहं तं देवं भवति च परो यस्य भजनात्॥9॥

विवेको वैराग्यो न च शमदमाद्याः षडपरे
मुमुक्षा मे नास्ति प्रभवति कथं ज्ञानममलम्।
अतः संसाराब्धेस्तरणसरणिं मामुपदिशन्
स्वबुद्धिं श्रौतीं मे वितर भगवंस्त्वं हि कृपया॥10॥

कदाहं भो स्वामिन्निगममतिवेद्यं शिवमयं
चिदानन्दं नित्यं श्रुतिहृतपरिच्छेदनिवहम्।
त्वमर्थाभिन्नं त्वामभिरम इहात्मन्यविरतं
मनीषामेवं मे सफलय वदान्य स्वकृपया॥11॥

यदर्थं सर्वं वै प्रियमसुधनादि प्रभवति
स्वयं नान्यार्थो हि प्रिय इति च वेदे प्रविदितम्।
स आत्मा सर्वेषां जनिमृतिमतां वेदगदित
स्ततोऽहं तं वेद्यं सततममलं यामि शरणम्॥12॥

मया त्यक्तं सर्वं कथमपि भवेत्स्वात्मनि मतिस्त्वदीया
माया मां प्रति तु विपरीतं कृतवती।
ततोऽहं किं कुर्यां न हि मम मतिः क्वापि चरति
दयां कृत्वा नाथ स्वपदशरणं देहि शिवदम्॥13॥

नगा दैत्याः कीशा भवजलधिपारं हि गमितास्त्वया
चान्ये स्वामिन्किमिति समयेऽस्मिञ्छयितवान्।
न हेलां त्वं कुर्यास्त्वयि निहितसर्वे मयि विभो
न हि त्वाहं हित्वा कमपि शरणं चान्यमगमम्॥14॥

अनन्ताद्या विज्ञा न गुणजलधेस्तेऽन्तमगमन्नतः
न पारं यायात्तव गुणगणानां कथमयम्।
गुणवद्धि त्वां जनिमृतिहरं याति परमां
गतिं योगिप्राप्यामिति मनसि बुद्ध्वाहमनवम्॥15॥

॥ इति श्रीमन्मौक्तिकरामोदासीनशिष्यब्रह्मानन्दविरचितं
परमेश्वरस्तुतिसारस्तोत्रं सम्पूर्णम् ॥

---

॥ Parameshwar Stuti Stotram ॥

Tvamekah shuddho'si tvayi nigambaahya malamayam
Prapancham pashyanti bhramaparavashsaah paapaniratah.
Bahistebhyah krutvaa svapadashsaranam maanaya vibho
Gajendre drushtam te sharanada vadaanyam svapaddam.||1||

Na srushtestehaaniryadi hi krupayato'vasi cha maam
Tvayaaneke guptaa vyasanamiti te'sti shrutipathei.
Ato maamuddhartum ghataya mayi drushti suvimalaam
Na riktaam me yaachnyaam svajanarata kartum bhava hare.||2||

Kadaaham bho svaaminniayatamanasaa tvaam hrudi
Bhajannabhadre samsaare hyanavarataduhkhe'tivirasah.
Labheyam taam shaantim paramamunibhiryaa hyadhigataa
Dayaam krutvaa me tvam vitara parashaantim bhavahara.||3||

Vidhaataa chedvishvam srujati srujataam me shubhakrutim
Vidhushchetpaataa maavatu janimmruter-duhkhajaladheih.
Harah samhartaa samharatu mama shokam sajanakam
Yathaaham muktah syaam kimapi tu tathaa te vidadhataaam.||4||

Aham brahmaanandatvamapi cha tadaakhyah suvidita
Stato'ham bhinno no kathamapi bhavattah shrutidrusha.
Tathaa chedaaneem tvam tvayi mama vibhedasya jananeem
Svamaayaam samvaarya prabhava mama bhedam nirasitum.||5||

Kadaaham he svaaminjanimrtimayam duhkhanibidam
Bhavam hitvaa satye'navaratatsukhe svaatmavapushi.
Rame tasminnityam nikhilamunayo brahmarasikaa
Ramante yasminste krutasakalakrutyaa yativaraa.||6||

Pathantyeke shaastram nigamamapare tatparatayaa
Yajantyanye tvaam vai dadati cha padaarthaanstava hitaan.
Aham tu svaamimste sharanaamagamam samsrutibhayaadyathaa
Te preetih syaaddhitakara tathaa tvam kuru vibho.||7||

Aham jyotirnnityo gaganamiva truptah sukhamayah
Shrutau siddho'dvaitah kathamapi na bhinno'smi vidhutah.
Iti jnyaate tattve bhavati cha parah samsrutilayaa
Datasttatvajnyaanam mayi sughatayestvam hi krupayaa.||8||

Anaadau samsaare janimrtimaye duhkhitamanaa
Mumukshuh sankashchidbhajati hi gurum jnyaanaparamam.
Tato jnyaatvaa yam vai tudati na punah kleshanivahai
Bhaje'ham tam devam bhavati cha paro yasya bhajanaat.||9||

Viveko vairaagyo na cha shamadamaadyaah shadapare
Mumukshaa me naasti prabhavati katham jnyaanamamalam.
Atah samsaaraabdhestaaranasaranim maamupadishsan
Svabuddhim shrauteem me vitara bhagavanstvam hi krupayaa.||10||

Kadaaham bho svaaminniigamamativedyam shivamayam
Chidaanandam nityam shrutihrataparicchhedanivahm.
Tvamarthaabhinnam tvaamabhirama ihaatmanyaviratam
Maneeshaamevam me saphalaya vadaanya svakrupayaa.||11||

Yadartham sarvam vai priyamasudhanadi prabhavati
Svayam naanyaartho hi priya iti cha vede praviditam.
Sa aatmaa sarveshaam janimrtimataam vedagadita
Stato'ham tam vedyam satatamamalam yaami sharanam.||12||

Mayaa tyaktam sarvam kathamapi bhavettsvaatmani matisttvadeeyaa
Maayaa maam prati tu vipareetam krutavatee.
Tato'ham kim kuryaam na hi mama matih kvaapi charati
Dayaam krutvaa naatha svapadashsaranam dehi shivadam.||13||

Nagaa daityaah keeshaa bhavajaladdhiparam hi gamitaastvayaa
Chaanye svaaminikimiti samaye'sminchhayitavaan.
Na helaam tvam kuryaastvo'yi nihitasarve mayi vibho
Na hi tvaaham hitvaa kamapi sharanam chaanyamagamam.||14||

Anantaadyaa vijnyaa na gunajaladhesteantamagamanntatah
Na paaram yaayaattava gunaganaanam kathamayam.
Gunavaddhi tvaam janimmrutiharam yaati paramaam
Gatim yogipraapyaamiti manasi buddhvaahmanavam.||15||

॥ Iti Shrimaan Mauktika Ramodaaseena Shishya Brahmananda Virachitam
Parameshwar Stuti Sara Stotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      await Devotional.updateOne({ _id: existing._id }, { $set: newStotra });
      console.log('🔄 Parameshwar Stuti Stotram updated successfully!');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Parameshwar Stuti Stotram added successfully!');
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
