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
  title: 'वीरविंशतिकाख्यं श्री हनुमत्स्तोत्रम् (Veer Vimshatika Hanuman Stotram)',
  deity: 'Hanuman',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Veer Vimshatika (The Heroic Twenty) is a magnificent 21-verse Sanskrit hymn glorifying Lord Hanuman\'s valorous exploits. Composed by Shri Kavipati Umapati Sharma Dvivedi, the stotram vividly depicts Hanuman\'s legendary leap across the ocean, his devastation of Ashoka Vatika, the slaying of Akshaya Kumara, his fearless encounter with Ravana, the burning of Lanka with his blazing tail, his triumphant return to Lord Rama with Sita\'s Chudamani (crest jewel), and his supreme devotion as the foremost Vaishnava. Each verse is a masterpiece of heroic imagery — portraying Hanuman as the commander of the monkey army, the terror of the Rakshasa hosts, and the eternal brahmachari servant of Lord Rama. The hymn celebrates Hanuman as the son of Vayu, disciple of Shiva, and an incarnation embodying wisdom, courage, and scriptural mastery beyond compare.',
  lyrics: `॥ वीरविंशतिकाख्यं श्री हनुमत्स्तोत्रम् ॥

लाङ्गूलमृष्टवियदम्बुधिमध्यमार्ग-
मुत्प्लुत्ययान्तममरेन्द्रमुदो निदानम्।
आस्फालितस्वकभुजस्फुटिताद्रिकाण्डं
द्राङ्मैथिलीनयननन्दनमद्य वन्दे॥1॥

मध्येनिशाचरमहाभयदुर्विषह्यं
घोराद्भुतव्रतमियं यददश्चचार।
पत्ये तदस्य बहुधापरिणामदूतं
सीतापुरस्कृततनुं हनुमन्तमीडे॥2॥

यः पादपङ्कजयुगं रघुनाथपत्न्या
नैराश्यरूषितविरक्तमपि स्वरागैः।
प्रागेव रागि विदधे बहु वन्दमानो
वन्देञ्जनाजनुषमेष विशेषतुष्ट्यै॥3॥

ताञ्जानकीविरहवेदनहेतुभूतान्
द्रागाकलय्य सदशोकवनीयवृक्षान्।
लङ्कालकानिव घनानुदपाटयद्यस्तं
हेमसुन्दरकपिं प्रणमामि पुष्ट्यै॥4॥

घोषप्रतिध्वनितशैलगुहासहस्र-
सम्भान्तनादितवलन्मृगनाथयूथम्।
अक्षक्षयक्षणविलक्षितराक्षसेन्द्रमिन्द्रं
कपीन्द्रपृतनावलयस्य वन्दे॥5॥

हेलाविलङ्घितमहार्णवमप्यमन्दं
धूर्णद्गदाविहतिविक्षतराक्षसेषु।
स्वम्मोदवारिधिमपारमिवेक्षमाणं
वन्देऽहमक्षयकुमारकमारकेशम्॥6॥

जम्भारिजित्पसभलम्भितपाशबन्धं
ब्रह्मानुरोधमिव तत्क्षणमुद्वहन्तम्।
रौद्रावतारमपि रावणदीर्घदृष्टि-
सङ्कोचकारणमुदारहरिं भजामि॥7॥

दर्पोन्नमन्निशिचरेश्वरमूर्धचञ्चत्-
कोटीरचुम्बिनिजबिम्बमुदीक्ष्य हृष्टम्।
पश्यन्तमात्मभुजयन्त्रणपिष्यमाण-
तत्कायशोणितनिपातमपेक्षि वक्षः॥8॥

अक्षप्रभृत्यमरविक्रमवीरनाश-
क्रोधादिवद्रुतमुदञ्चितचन्द्रहासाम्।
निद्रापिताभ्रघनगर्जनघोरघोषैः
संस्तम्भयन्तमभिनौमि दशास्यमूर्तिम्॥9॥

आशंस्यमानविजयं रघुनाथधाम
शंसन्तमात्मकृतभूरिपराक्रमेण।
दौत्ये समागमसमन्वयमादिशन्तं
वन्दे हरेः क्षितिभृतः पृतनाप्रधानम्॥10॥

यस्यौचितीं समुपदिष्टवतोऽधिपुच्छ-
दम्भान्धितां धियमपेक्ष्य विवर्धमानः।
नक्तञ्चराधिपतिरोषहिरण्यरेता
लङ्कां दिधक्षुरपतत्तमहं वृणोमि॥11॥

क्रन्दन्निशाचरकुलां ज्वलनावलीढैः
साक्षाद्गृहैरिवबहिः परिदेवमानाम्।
स्तब्धस्वपुच्छतटलग्नकृपीटयोनि-
दन्दह्यमाननगरीं परिगाहमानाम्॥12॥

मूर्तैर्गृहासुभिरिव द्युपुरं व्रजद्भिर्-
व्योम्नि क्षणं परिगतं पतगैर्ज्वलद्भिः।
पीताम्बरं दधतमुच्र्छितदीप्ति पुच्छं
सेनां वहद्विहगराजमिवाहमीडे॥13॥

स्तम्भीभवत्स्वगुरुबालधिलग्नवह्नि-
ज्वालोल्ललद्ध्वजपटामिव देवतुष्ट्यै।
वन्दे यथोपरि पुरो दिवि दर्शयन्तमद्यैव
रामविजयाजिकवैजयन्तीम्॥14॥

रक्षश्चयैकचितकक्षकपूश्चितौ यः
सीताशुचो निजविलोकनतो मृतायाः।
दाहं व्यधादिव तदन्त्यविधेयभूतं
लाङ्गूलदत्तदहनेन मुदे स नोऽस्तु॥15॥

आशुद्धये रघुपतिप्रणयैकसाक्ष्ये
वैदेहराजदुहितुः सरिदीश्वराय।
न्यासं ददानमिव पावकमापतन्तमब्धौ
प्रभञ्जनतनूजनुषं भजामि॥16॥

रक्षस्स्वतृप्तिरुडशान्तिविशेषशोण-
मक्षक्षयक्षणविधानमितात्मदाक्ष्यम्।
भास्वत्प्रभातरविभानुभरावभासं
लङ्काभयंकरममुं भगवन्तमीडे॥17॥

तीर्त्वोदधिं जनकजार्पितमाप्य चूडा-
रत्नं रिपोरपि पुरं परमस्य दग्ध्वा।
श्रीरामहर्षगलदश्वभिषिच्यमानं
तं ब्रह्मचारिवरवानरमाश्रयेऽहम्॥18॥

यः प्राणवायुजनितो गिरिशस्य शान्तः
शिष्योऽपि गौतमगुरुर्मुनिशङ्करात्मा।
हृद्यो हरस्य हरिवद्धरितां गतोऽपि
धीधैर्यशास्त्रविभवेऽतुलमाश्रये तम्॥19॥

स्कन्धेऽधिवाह्य जगदुत्तरगीतिरीत्या
यः पार्वतीश्वरमतोषयदाशुतोषम्।
तस्मादवाप च वरानपरानवाप्यान्
तं वानरं परमवैष्णवमीशमीडे॥20॥

उमापतेः कविपतेः स्तुतिर्बाल्यविजृम्भिता।
हनूमतस्तुष्टयेऽस्तु वीरविंशतिकाभिधा॥21॥

॥ इति श्री कविपत्युपनामकोमापति शर्मद्विवेदिविरचितं
वीरविंशतिकाख्यं श्रीहनुमत्स्तोत्रं सम्पूर्णम् ॥

---

॥ Veeravimshatikakhyam Shri Hanumatstotram ॥

Langoolamrishtaviyadambudhimadhyamarga-
Mutplutyayantamamarendramudo nidaanam.
Aasphaalitasvakabhujasphutitaadrikaandam
Draangmaithileenayanandanamadya vande॥1॥

Madhyenishaacharamahabhayadurvishahyam
Ghoradbhutavratamiyam yadadashchachaara.
Patye tadasya bahudhaaparinaamadootam
Seetaapuraskrutatanum hanumantameede॥2॥

Yah paadapankajayugam raghunaathpatnyaa
Nairaashyarooshitaviraktamapi svaraagaih.
Praageva raagi vidadhe bahu vandamaano
Vandenjanaajanuushamesha visheshatushttyai॥3॥

Taanjaanakeevirahavedanahetubhootaan
Draagaakalayya sadashokavaneeyavrikshaan.
Lankaalakaaniva ghanaanudapaatayadyastam
Hemasundarakapim pranamaamipushtyai॥4॥

Ghoshappratidhvanitashailaguhassahasra-
Sambhaantanaaditavalannmriganathayootham.
Akshakshayakshaanavilakshitaraakshsasendram-Indram
Kapeendrapritanavalayasya vande॥5॥

Helaavillanghitamahaarnavamapyamandam
Dhoornadgadaavihatavikshataraakshaseshu.
Svammodavaaradhimapaaramivekshamaanam
Vandehamakshayakumaarakamaarakesham॥6॥

Jambhaarijitpasabhalambhitapaashabandham
Brahmaanurodhamiva tatkshanamuddvahantam.
Raudraavataaramapi raavanadeerrghadrishti-
Sankochakaaranamudaaraharim bhajaami॥7॥

Darponnaman-nishichareshvaramoordhachanchat-
Koteerachumbinijabimbamudikshya hrishtam.
Pashyantamaatmabhujayantranpishyamaana-
Tatkaayashonitanipaatamapekshi vakshah॥8॥

Akshaprabhrittyamaravikramaveeranaasha-
Krodhaadivaadrutamudanchitachandrahaasaam.
Nidraapitaabhraghanargajanaghoghoraghoshaih
Samsthambhayantamabhinoumi dashaasyamoortim॥9॥

Aashamsyamaanavijayam raghunaathadhaama
Shamsantamaatmakritabhooripaaraakramena.
Dautye samaagamasamanvayamaadishantam
Vande Hareh kshitibhritah pritanaapradhanam॥10॥

Yasyauchiteem samupadishtavato'dhipuchchha-
Dambhaandhitaam dhiyamapekshya vivardhamaanah.
Naktancharaadhipatiroshahiranyaretaa
Lankaam didhakshurapatattamaham vrinomi॥11॥

Krandannishaacharakulaam jvalanaavaleeedhaih
Saakshaadgrihairivabahih paridevamaanam.
Stabdhasvapuchchhatataalagnakripeetayoni-
Dandahyamaanangareem parigaahamaanam॥12॥

Moortairgrihasubhiriva dyupuram vrajaddhir-
Vyomni kshanam parigatam patagairjvaladbhih.
Peetambaram dadhatamuchrchhitadeepti puchchham
Senaam vahadvihagaaraajamivaahamide॥13॥

Stambheebhavatsvagurubaaladhilagnvahni-
Jvaalollaladdhvajapataameeva devatushttyai.
Vande yathopari puro divi darshayantamadyaiva
Raamavijayaajikaavaijayanteem॥14॥

Rakshaschayaikachitakakshakpuushchitau yah
Seetaashuchonijavilokanto mritaayaah.
Daaham vyadhaadiva tadantyavidheyabhutam
Laangooladattadahanena mude sa no'stu॥15॥

Aashuddhaye raghupatipranayaikasaakshye
Vaideharaajaaduhituh sarideshvaraaya.
Nyaasam dadaanamiva paavakmaapantam-Abdhau
Prabhanjanatnuujanusham bhajaami॥16॥

Rakshasvatriptirrudashantivisheshashonam-
Akshakshayakshanavidhaanmitaaatmadakshyam.
Bhaasvatprabhaatarravibhaanubharaavabhaasam
Lankaabhayankramamum bhagavantameede॥17॥

Teertvodadhim janakajaarppitamaapya choodaa-
Ratnam riporapi puram paramasya dagdhvaa.
Shreeraamaharshagaladashvabhishichyamaanam
Tam brahmachaarivarvaanarmaashrayeham॥18॥

Yah praanavayujanito girishasya shaantah
Shishyopi gautamagurur-munishankaraatmaa.
Hridyo harasya harivaddharitaam gato'pi
Dheedhairyashaastravibavetulmaashraye tam॥19॥

Skandhe'dhivaahya jagaduttarageetireetyaa
Yah paarvateshvaramatoshayadaashutosham.
Tasmaadavaapa cha varaanaparaanavaapyaan
Tam vaanaram paramavaishnavmeeshamede॥20॥

Umapateh kavipateh stutirbalyavijrimbhitaa.
Hanumatastushtaye'stu veeravimshatikabhidha॥21॥

॥ Iti Shri Kavipatyupaamakompati Sharmadvivedivirachitam
Veeravimshatikakhyam Shri Hanumatstotram Sampurnam ॥`
};

async function addStotra() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Devotional.findOne({ title: newStotra.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Veer Vimshatika Hanuman Stotram already exists, skipping...');
    } else {
      const doc = new Devotional(newStotra);
      await doc.save();
      console.log('✅ Veer Vimshatika Hanuman Stotram added successfully!');
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
