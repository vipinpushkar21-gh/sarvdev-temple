const mongoose = require('mongoose');

// Connection string (following existing scripts pattern)
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

// Schema aligned with app model fields used by UI
const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  lyrics: { type: String },
  audio: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

// 64 Shlokas – category: Shloka
const shlokaItems = [
  {
    title: 'अगजानन पद्मार्कं (Agajanana Padmarkam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Ganesha',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'अगजानन पद्मार्कं गजाननं अहर्निशम् ।',
      'अनेकदन्तं भक्तानामेकदन्तमुपास्महे ॥',
      '',
      'English:',
      'Agajaanana Padmaarkam Gajananam Aharnisham |',
      'Anekadantam Bhaktaanaam Ekadantam Upaasmhe ||'
    ].join('\n')
  },
  {
    title: 'गजाननं भूतगणादि सेवितं (Gajananam Bhutaganadi Sevitam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Ganesha',
    status: 'approved',
    lyrics: [
      'संस्कृत (Version 1):',
      'गजाननं भूतगणादि सेवितं',
      'कपित्थजम्बूफलसार भक्षितम् ।',
      'उमासुतं शोकविनाशकारणं',
      'नमामि विघ्नेश्वर पादपङ्कजम् ॥',
      '',
      'संस्कृत (Version 2):',
      'गजाननं भूतगणादि सेवितं',
      'कपित्थजम्बूफलचारु भक्षणम् ।',
      'उमासुतं शोकविनाशकारकं',
      'नमामि विघ्नेश्वर पादपङ्कजम् ॥',
      '',
      'English:',
      'Gajananam Bhootaganaadi Sevitam',
      'Kapittha Jambu Phala Saar Bhakshitam |',
      'Umaasutam Shoka Vinaasha Kaaranam',
      'Namaami Vighneshwara Paadapankajam ||'
    ].join('\n')
  },
  {
    title: 'मूषिकवाहन मोदकहस्त (Mushika Vahana Modaka Hasta)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Ganesha',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'मूषिकवाहन मोदकहस्त',
      'चामरकर्ण विलम्बितसूत्र ।',
      'वामनरूप महेश्वरपुत्र',
      'विघ्नविनायक पाद नमस्ते ॥',
      '',
      'English:',
      'Mushika Vaahan Modaka Hasta',
      'Chaamara Karna Vilambita Sutra |',
      'Vaamana Roopa Maheshwara Putra',
      'Vighna Vinaayaka Paada Namaste ||'
    ].join('\n')
  },
  {
    title: 'शुक्लाम्बरधरं विष्णुं (Shuklambaradharam Vishnum)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।',
      'प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥',
      '',
      'English:',
      'Shuklaambaradharam Vishnum Shashivarnam Chaturbhujam |',
      'Prasanna Vadanam Dhyaayet Sarva Vighnopashaantaye ||'
    ].join('\n')
  },
  {
    title: 'वक्रतुण्ड महाकाय (Vakratunda Mahakaya)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Ganesha',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।',
      'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
      '',
      'English:',
      'Vakratunda Mahaakaaya Suryakoti Samaprabha |',
      'Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada ||'
    ].join('\n')
  },
  {
    title: 'अञ्जनीगर्भसम्भूत (Anjani Garbha Sambhuta)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Hanuman',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'अञ्जनीगर्भसम्भूत कपीन्द्र सचिवोत्तम ।',
      'रामप्रिय नमस्तुभ्यं हनुमन् रक्ष सर्वदा ॥',
      '',
      'English:',
      'Anjani Garbha Sambhuta Kapindra Sachivottama |',
      'Raamapriya Namastubhyam Hanuman Raksha Sarvada ||'
    ].join('\n')
  },
  {
    title: 'अतुलितबलधामं (Atulita Bala Dhamam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Hanuman',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'अतुलितबलधामं हेमशैलाभदेहम् ।',
      'दनुजवनकृशानुं ज्ञानिनामग्रगण्यम् ॥',
      'सकलगुणनिधानं वानराणामधीशम् ।',
      'रघुपतिप्रियभक्तं वातात्मजं नमामि ॥',
      '',
      'English:',
      'Atulita Baladhaamam Hemashailaabha Deham |',
      'Danuja Vana Krishaanum Jnaaninam Agraganyam ||',
      'Sakala Guna Nidhaanam Vaanaraanaam Adheesham |',
      'Raghupati Priya Bhaktam Vaatatmajam Namaami ||'
    ].join('\n')
  },
  {
    title: 'बुद्धिर्बलम् यशो धैर्यम् (Buddhir Balam Yasho Dhairyam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Hanuman',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'बुद्धिर्बलम् यशो धैर्यं',
      'निर्भयत्वम् अरोगताम् ।',
      'अजाड्यं वाक्पटुत्वं च',
      'हनुमत्स्मरणाद्भवेत् ॥',
      '',
      'English:',
      'Buddhir Balam Yasho Dhairyam',
      'Nirbhayatvam Arogataam |',
      'Ajaadyam Vaakpatutvam Cha',
      'Hanumat Smaranaad Bhavet ||'
    ].join('\n')
  },
  {
    title: 'मनोजवं मारुततुल्यवेगं (Manojavam Maarutatulyavegam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Hanuman',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'मनोजवं मारुततुल्यवेगं',
      'जितेन्द्रियं बुद्धिमतां वरिष्ठम् ।',
      'वातात्मजं वानरयूथमुख्यं',
      'श्रीरामदूतं शरणं प्रपद्ये ॥',
      '',
      'English:',
      'Manojavam Maarutatulya Vegam',
      'Jitendriyam Buddhimataam Varishtham |',
      'Vaatatmajam Vaanarayuthamukhyam',
      'Shri Ramadootam Sharanam Prapadye ||'
    ].join('\n')
  },
  {
    title: 'यत्र यत्र रघुनाथकीर्तनं (Yatra Yatra Raghunatha Kirtanam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Hanuman',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'यत्र यत्र रघुनाथकीर्तनं',
      'तत्र तत्र कृतमस्तकाञ्जलिम् ।',
      'बाष्पवारिपरिपूर्णलोचनं',
      'मारुतिं नमत राक्षसान्तकम् ॥',
      '',
      'English:',
      'Yatra Yatra Raghunatha Keertanam',
      'Tatra Tatra Kritamastak Anjalim |',
      'Baashpavaari Paripoorna Lochanam',
      'Maarutim Namata Raakshasaantakam ||'
    ].join('\n')
  },
  {
    title: 'कायेन वाचा मनसेन्द्रियैर्वा (Kayena Vaca Manasendriyairvaa)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Narayana',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'कायेन वाचा मनसेन्द्रियैर्वा ।',
      'बुद्ध्यात्मना वा प्रकृतेः स्वभावात् ।',
      'करोमि यद्यत्सकलं परस्मै ।',
      'नारायणायेतिसमर्पयामि ॥',
      '',
      'English:',
      'Kaayena Vaachaa Manasendriyaairvaa |',
      'Buddhyaatmanaa Vaa Prakruteh Swabhaavaat |',
      'Karomi Yadyat Sakalam Parasmai |',
      'Naaraayanayeti Samarpayaami ||'
    ].join('\n')
  },
  {
    title: 'मेघश्यामं पीतकौशेयवासं (Meghashyamam Pita Kausheya Vaasam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'मेघश्यामं पीतकौशेयवासं',
      'श्रीवत्साङ्कं कौस्तुभोद्भासिताङ्गम् ।',
      'पुण्योपेतं पुण्डरीकायताक्षं',
      'विष्णुं वन्दे सर्वलोकैकनाथम् ॥',
      '',
      'English:',
      'Meghashyaamam Pita Kausheya Vaasam',
      'Shrivatsankam Kaustubhodbhaasitangam |',
      'Punyopetam Pundareekaayataaksham',
      'Vishnum Vande Sarvalokaikanatham ||'
    ].join('\n')
  },
  {
    title: 'ॐ अपवित्रः पवित्रो वा (Om Apavitrah Pavitro Va)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'ॐ अपवित्रः पवित्रो वा',
      'सर्वावस्थां गतोऽपि वा ।',
      'यः स्मरेत्पुण्डरीकाक्षं',
      'स बाह्याभ्यन्तरः शुचिः ॥',
      '',
      'English:',
      'Om Apavitrah Pavitro Vaa',
      'Sarvaavasthaam Gato’pi Vaa |',
      'Yah Smaret Pundareekaaksham',
      'Sa Baahyaabhyantarah Shuchih ||'
    ].join('\n')
  },
  {
    title: 'सशङ्खचक्रं सकिरीटकुण्डलं (Sa Sankha Chakram Sa Kirita Kundalam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'सशङ्खचक्रं सकिरीटकुण्डलं',
      'सपीतवस्त्रं सरसीरुहेक्षणम् ।',
      'सहारवक्षःस्थलशोभिकौस्तुभं',
      'नमामि विष्णुं शिरसा चतुर्भुजम् ॥',
      '',
      'English:',
      'Sa Shankha Chakram Sa Kirita Kundalam',
      'Sa Peeta Vastram Sarasiruhekshanam |',
      'Saha Hrivaksha Sthala Shobhikaustubham',
      'Namaami Vishnum Shirasaa Chaturbhujam ||'
    ].join('\n')
  },
  {
    title: 'शान्ताकारं भुजगशयनं (Shaantaakaaram Bhujagashayanam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं',
      'विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।',
      'लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं',
      'वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम् ॥',
      '',
      'English:',
      'Shaantaakaaram Bhujagashayanam Padmanaabham Suresham |',
      'Vishvaadhaaram Gaganasadrisham Meghavarnam Shubhaangam ||',
      'Lakshmikaantam Kamalanayanam Yogibhirdhyaanagamyam |',
      'Vande Vishnum Bhavabhayaharam Sarvalokaikanatham ||'
    ].join('\n')
  },
  {
    title: 'शुक्लाम्बरधरं विष्णुं (Shuklambaradharam Vishnum) — पुनरावृत्ति',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।',
      'प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥',
      '',
      'English:',
      'Shuklaambaradharam Vishnum Shashivarnam Chaturbhujam |',
      'Prasanna Vadanam Dhyaayet Sarvavighnopashaantaye ||'
    ].join('\n')
  },
  {
    title: 'मात्स्य अवतार (Matsya Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Matsya (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'रूपं स जगृहे मात्स्यं चाक्षुषोदधिसम्प्लवे ।',
      'नाव्यारोप्य महीमय्यामपाद्वैवस्वतं मनुम् ॥ (१.३.१५)',
      '',
      'English:',
      'Roopam Sa Jagruhe Maatsyam Chaakshushodadhi Samplave |',
      'Naavyaaropya Mahimayyaam Apaad Vaivasvatam Manum ||'
    ].join('\n')
  },
  {
    title: 'कूर्म अवतार (Kurma Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Kurma (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'सुरासुराणामुदधिं मथ्नतां मन्दराचलम् ।',
      'दध्रे कमठरूपेण पृष्ठ एकादशे विभुः ॥ (१.३.१६)',
      '',
      'English:',
      'Suraasuraanaam Udadhim Mathnataam Mandaraachalam |',
      'Dadhre Kamatharoopena Prishtha Ekaadashe Vibhu ||'
    ].join('\n')
  },
  {
    title: 'वराह अवतार (Varaha Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Varaha (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'द्वितीयं तु भवायास्य रसातलगतां महीम् ।',
      'उद्धरिष्यन्नुपादत्त यज्ञेशः सौकरं वपुः ॥ (१.३.७)',
      '',
      'English:',
      'Dviteeyam Tu Bhavaayaasya Rasaatalagataam Mahim |',
      'Uddharishyannupaadatta Yajneshah Saukaram Vapuh ||'
    ].join('\n')
  },
  {
    title: 'नरसिंह अवतार (Narasimha Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Narasimha (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'चतुर्दशं नारसिंहं बिभ्रद्दैत्येन्द्रमूर्जितम् ।',
      'ददार करजैरूरावेरकं कटकृद्यथा ॥ (१.३.१८)',
      '',
      'English:',
      'Chaturdasham Naarasimham Bibhrad Daityendra Moorjitam |',
      'Dadaara Karajair Ooraaverakam Katakridyathaa ||'
    ].join('\n')
  },
  {
    title: 'वामन अवतार (Vamana Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vamana (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'पञ्चदशं वामनकं कृत्वागादध्वरं बलेः ।',
      'पदत्रयं याचमानः प्रत्यादित्सुस्त्रिपिष्टपम् ॥ (१.३.१९)',
      '',
      'English:',
      'Panchadasham Vaamanakam Kritvaagaad Adhvaram Baleh |',
      'Padatrayam Yaachamaanah Pratyaaditsus Tripishtapam ||'
    ].join('\n')
  },
  {
    title: 'परशुराम अवतार (Parashurama Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Parashurama (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'अवतारे षोडशमे पश्यन् ब्रह्मद्रुहो नृपान् ।',
      'त्रिःसप्तकृत्वः कुपितो निःक्षत्रामकरोन्महीम् ॥ (१.३.२०)',
      '',
      'English:',
      'Avataare Shodashame Pashyan Brahmadruho Nripaan |',
      'Trisaptakrithvah Kupito Nihkshatraamakaron Mahim ||'
    ].join('\n')
  },
  {
    title: 'कस्तूरीतिलकं (Kasturi Tilakam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Krishna',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'कस्तूरीतिलकं ललाटपटले वक्षःस्थले कौस्तुभं',
      'नासाग्रे नवमौक्तिकं करतले वेणुं करे कङ्कणम् ।',
      'सर्वाङ्गे हरिचन्दनं सुललितं कण्ठे च मुक्तावलिं',
      'गोपस्त्री परिवेष्टितो विजयते गोपालचूडामणिः ॥',
      '',
      'English:',
      'Kasturi Tilakam Lalaata Patale Vakshah Sthale Kaustubham |',
      'Naasaagre Navamauktikam Karatale Venun Kare Kankanam ||',
      'Sarvaange Harichandanam Sulalitam Kanthe Cha Muktaavalim |',
      'Gopastri Pariveshtito Vijayate Gopala Choodaamanih ||'
    ].join('\n')
  },
  {
    title: 'कृष्ण अवतार (Krishna Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Krishna',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'एकोनविंशे विंशतिमे वृष्णिषु प्राप्य जन्मनी ।',
      'रामकृष्णाविति भुवो भगवानहरद्भरम् ॥ (१.३.२३)',
      '',
      'English:',
      'Ekonavimshe Vimsatime Vrishnishu Praapya Janmani |',
      'Raamakrishnaaviti Bhuvo Bhagavaan Harad Bharam ||'
    ].join('\n')
  },
  {
    title: 'कृष्णाय वासुदेवाय (Krishnaya Vasudevaya)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Krishna',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'कृष्णाय वासुदेवाय देवकीनन्दनाय च ।',
      'नन्दगोपकुमाराय गोविन्दाय नमो नमः ॥',
      '',
      'English:',
      'Krishnaya Vasudevaya Devaki Nandanaya Cha |',
      'Nandagopa Kumaraaya Govindaaya Namo Namah ||'
    ].join('\n')
  },
  {
    title: 'मूकं करोति वाचालं (Mukam Karoti Vachalam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'मूकं करोति वाचालं पङ्गुं लङ्घयते गिरिम् ।',
      'यत्कृपा तमहं वन्दे परमानन्द माधवम् ॥',
      '',
      'English:',
      'Mukam Karoti Vaachalam Pangum Langhayate Girim |',
      'Yatkripaa Tamaham Vande Paramaananda Maadhavam ||'
    ].join('\n')
  },
  {
    title: 'नमो ब्रह्मण्य देवाय (Namo Brahmanya Devaya)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Krishna',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'नमो ब्रह्मण्य देवाय गोब्राह्मणहिताय च ।',
      'जगत् हिताय कृष्णाय गोविन्दाय नमो नमः ॥',
      '',
      'English:',
      'Namo Brahmanya Devaaya Gobrahmana Hitaaya Cha |',
      'Jagat Hitaaya Krishnaya Govindaaya Namo Namah ||'
    ].join('\n')
  },
  {
    title: 'बुद्ध अवतार (Buddha Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Buddha (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'ततः कलौ सम्प्रवृत्ते सम्मोहाय सुरद्विषाम् ।',
      'बुद्धो नाम्नाञ्जनसुतः कीकटेषु भविष्यति ॥ (१.३.२४)',
      '',
      'English:',
      'Tatah Kalau Sampravritte Sammohaya Suradvishaam |',
      'Buddho Naamnaan Janasutah Keekateshu Bhavishyati ||'
    ].join('\n')
  },
  {
    title: 'कल्कि अवतार (Kalki Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Kalki (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'अथासौ युगसन्ध्यायां दस्युप्रायेषु राजसु ।',
      'जनिता विष्णुयशसो नाम्ना कल्किर्जगत्पतिः ॥ (१.३.२५)',
      '',
      'English:',
      'Athaasau Yugasandhyaayaam Dasyupraayeshurajasu |',
      'Janitaa Vishnuyashaso Naamnaa Kalkir Jagatpatih ||'
    ].join('\n')
  },
  {
    title: 'लोकाभिरामं रणरङ्गधीरं (Lokabhiramam Ranarangadhiram)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Rama',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'लोकाभिरामं रणरङ्गधीरं राजीवनेत्रं रघुवंशनाथम् ।',
      'कारुण्यरूपं करुणाकरं तं श्रीरामचन्द्रं शरणं प्रपद्ये ॥',
      '',
      'English:',
      'Lokabhiramam Ranarangadheeram Rajivanetram Raghuvanshanaatham |',
      'Kaarunyaroopam Karunaakaram Tam Shriramachandram Sharanam Prapadye ||'
    ].join('\n')
  },
  {
    title: 'माता रामो मत्पिता रामचन्द्रः (Mata Ramo Matpita Ramachandrah)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Rama',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'माता रामो मत्पिता रामचन्द्रः ।',
      'स्वामी रामो मत्सखा रामचन्द्रः ॥',
      'सर्वस्वं मे रामचन्द्रो दयालुः ।',
      'नान्यं जाने नैव जाने न जाने ॥',
      '',
      'English:',
      'Mata Ramo Matpita Ramachandrah |',
      'Swami Ramo Matsakha Ramachandrah ||',
      'Sarvasvam Me Ramachandro Dayaluh |',
      'Naanyam Jaane Naiva Jaane Na Jaane ||'
    ].join('\n')
  },
  {
    title: 'राम अवतार (Rama Avatara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Rama',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'नरदेवत्वमापन्नः सुरकार्यचिकीर्षया ।',
      'समुद्रनिग्रहादीनि चक्रे वीर्याण्यतः परम् ॥ (१.३.२२)',
      '',
      'English:',
      'Naradevatvamaapannah Surakaarya Chikirshayaa |',
      'Samudra Nigrahaadeeni Chakre Veeryaanyatah Param ||'
    ].join('\n')
  },
  {
    title: 'राम राम रामेति (Rama Rama Rameti)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Rama',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'राम राम रामेति रमे रामे मनोरमे ।',
      'सहस्रनाम तत्तुल्यं रामनाम वरानने ॥',
      '',
      'English:',
      'Rama Rama Rameti Rame Rame Manorame |',
      'Sahasranaama Tattulyam Ramanama Varaanane ||'
    ].join('\n')
  },
  {
    title: 'माता रामो मत्पिता रामचन्द्रः (Mata Ramo Matpita Ramachandrah) — पुनरावृत्ति',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Rama',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      '(पुनरावृत्ति – वही श्लोक 32 जैसा)'
    ].join('\n')
  },
  {
    title: 'राम अवतार (Rama Avatara) — पुनरावृत्ति',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Rama',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      '(पुनरावृत्ति – वही श्लोक 33 जैसा)'
    ].join('\n')
  },
  {
    title: 'रामो राजमणिः सदा विजयते (Ramo Rajamani Sada Vijayate)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Rama',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'रामो राजमणिः सदा विजयते रामं रमेशं भजे ।',
      'रामेणाभिहता निशाचरचमूः रामाय तस्मै नमः ॥',
      'रामान्नास्ति परायणं परतरं रामस्य दासोऽस्म्यहम् ।',
      'रामे चित्तलयः सदा भवतु मे भो राम मामुद्धर ॥',
      '',
      'English:',
      'Ramo Rajamanih Sadaa Vijayate Ramam Ramesham Bhaje |',
      'Ramenabhihataa Nishaachara Chamooh Ramaaya Tasmai Namah ||',
      'Raamaannaasti Parayanam Parataram Raamasya Daasosmyaham |',
      'Rame Chittalayah Sadaa Bhavatu Me Bho Rama Maamuddhara ||'
    ].join('\n')
  },
  {
    title: 'ॐ उग्रं वीरं महाविष्णुं (Om Ugram Viram Maha-Vishnum)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Narasimha (Vishnu)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'ॐ उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम् ।',
      'नृसिंहं भीषणं भद्रं मृत्योर् मृत्युं नमाम्यहम् ॥',
      '',
      'English:',
      'Om Ugram Veeram Mahaavishnum Jvalantam Sarvatomukham |',
      'Nrisimham Bhishanam Bhadram Mrityor Mrityum Namaamyaham ||'
    ].join('\n')
  },
  {
    title: 'करचरण कृतं (Karacharana Kritam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Shiva',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'करचरणकृतं वाक्कायजं कर्मजं वा ।',
      'श्रवणनयनजं वा मानसं वापराधम् ॥',
      'विहितमविहितं वा सर्वमेतत्क्षमस्व ।',
      'जय जय करुणाब्धे श्रीमहादेव शम्भो ॥',
      '',
      'English:',
      'Karacharana Kritam Vaakkaayajam Karmajam Vaa |',
      'Shravana Nayanajam Vaa Maanasam Vaaparaadham ||',
      'Vihitam Avihitam Vaa Sarvametat Kshamasva |',
      'Jaya Jaya Karunaabdhe Shrimahadeva Shambho ||'
    ].join('\n')
  },
  {
    title: 'कर्पूरगौरं करुणावतारं (Karpura Gauram Karunavataram)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Shiva',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'कर्पूरगौरं करुणावतारं',
      'संसारसारं भुजगेन्द्रहारम् ।',
      'सदावसन्तं हृदयारविन्दे',
      'भवं भवानीसहितं नमामि ॥',
      '',
      'English:',
      'Karpura Gauram Karunaavataraam',
      'Samsaara Saaram Bhujagendra Haaram |',
      'Sadaavasantam Hridayaaravinde',
      'Bhavam Bhavaani Sahitam Namaami ||'
    ].join('\n')
  },
  {
    title: 'नमस्ते शारदे देवी (Namaste Sharade Devi)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Saraswati',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'नमस्ते शारदे देवी काश्मीरपुरवासिनि ।',
      'त्वामहं प्रार्थये नित्यं विद्यादानं च देहि मे ॥',
      '',
      'English:',
      'Namaste Shaarade Devi Kaashmirapura Vaasini |',
      'Tvaamaham Praarthaye Nityam Vidyaadaanam Cha Dehi Me ||'
    ].join('\n')
  },
  {
    title: 'सरस्वति महाभागे (Saraswati Mahabhage)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Saraswati',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'सरस्वति महाभागे विद्ये कमललोचने ।',
      'विद्यारूपे विशालाक्षि विद्यां देहि नमोस्तुते ॥',
      '',
      'English:',
      'Saraswati Mahaabhaage Vidye Kamalalochane |',
      'Vidyaaroop Vishalaakshi Vidyaam Dehi Namostute ||'
    ].join('\n')
  },
  {
    title: 'सरस्वति नमस्तुभ्यं (Saraswati Namastubhyam)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Saraswati',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'सरस्वति नमस्तुभ्यं वरदे कामरूपिणि ।',
      'विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥',
      '',
      'English:',
      'Saraswati Namastubhyam Varade Kaamarupini |',
      'Vidyaarambham Karishyaami Siddhirbhavatu Me Sadaa ||'
    ].join('\n')
  },
  {
    title: 'शुक्लां ब्रह्मविचारसार (Shuklam Brahma Vicara Sara)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Saraswati',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'शुक्लां ब्रह्मविचारसारपरमामाद्यां जगद्व्यापिनीम् ।',
      'वीणापुस्तकधारिणीमभयदां जाड्यान्धकारापहाम् ॥',
      'हस्ते स्फाटिकमालिकां च दधतीं पद्मासने संस्थिताम् ।',
      'वन्दे तां परमेश्वरीं भगवतीं बुद्धिप्रदां शारदाम् ॥',
      '',
      'English:',
      'Shuklaam Brahma Vichaarasaara Paramaam Aadyaam Jagad Vyaapineem |',
      'Veena Pustaka Dhaarineem Abhayadaam Jaadya Andhakaarapahaam ||',
      'Haste Sphatika Maalikaam Cha Dadhateem Padmaasane Samsthitaam |',
      'Vande Taam Parameshwareem Bhagavateem Buddhipradaam Shaaradaam ||'
    ].join('\n')
  },
  {
    title: 'ॐ पृथ्वि त्वया धृता लोका (Om Prthvi Tvaya Dhrita Loka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'ॐ पृथ्वि त्वया धृता लोका',
      'देवि त्वं विष्णुना धृता ।',
      'त्वं च धारय मां देवि',
      'पवित्रं कुरु चासनम् ॥',
      '',
      'English:',
      'Om Prithvi Tvayaa Dhrita Loka',
      'Devi Tvam Vishnuna Dhrita |',
      'Tvam Cha Dhaaraya Maam Devi',
      'Pavitram Kuru Chaasanam ||'
    ].join('\n')
  },
  {
    title: 'समुद्रवसने देवि (Samudra Vasane Devi)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vishnu',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'समुद्रवसने देवि पर्वतस्तनमण्डले ।',
      'विष्णुपत्नि नमस्तुभ्यं पादस्पर्शं क्षमस्व मे ॥',
      '',
      'English:',
      'Samudra Vasane Devi Parvata Stana Mandale |',
      'Vishnupatni Namastubhyam Paadasparsham Kshamasva Me ||'
    ].join('\n')
  },
  {
    title: 'देवी शैलपुत्री (Devi Shailaputri – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Shailaputri)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'वन्दे वाञ्छितलाभाय चन्द्रार्धकृतशेखरां ।',
      'वृषारूढां शूलधरां शैलपुत्री यशस्विनीम् ॥',
      '',
      'English:',
      'Vande Vaanchhita Laabhaaya Chandrardha Krita Shekharaam |',
      'Vrishaaroodhaam Shooladharaam Shailaputri Yashasvineem ||'
    ].join('\n')
  },
  {
    title: 'देवी ब्रह्मचारिणी (Devi Brahmacharini – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Brahmacharini)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'दधाना करपद्माभ्यामक्षमाला कमण्डलू ।',
      'देवी प्रसीदतु मयि ब्रह्मचारिण्यनुत्तमा ॥',
      '',
      'English:',
      'Dadhaanaa Karapadmaabhyaam Akshamaalaa Kamandaloo |',
      'Devi Praseedatu Mayi Brahmacharinyanuttamaa ||'
    ].join('\n')
  },
  {
    title: 'देवी चन्द्रघण्टा (Devi Chandraghanta – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Chandraghanta)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'पिण्डजप्रवरारूढा चन्दकोपास्त्रैर्युता ।',
      'प्रसादं तनुते मह्यं चन्द्रघण्टेति विश्रुता ॥',
      '',
      'English:',
      'Pindaja Pravaraaroodhaa Chandakopa Astrairyutaa |',
      'Prasaadam Tanute Mahyam Chandraghanteti Vishrutaa ||'
    ].join('\n')
  },
  {
    title: 'देवी कूष्माण्डा (Devi Kushmanda – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Kushmanda)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'सुरासम्पूर्णकलशं रुधिराप्लुतमेव च ।',
      'दधाना हस्तपद्माभ्यां कूष्माण्डा शुभदास्तु मे ॥',
      '',
      'English:',
      'Suraasam Poorna Kalasham Rudhiraapluta Meva Cha |',
      'Dadhaanaa Hasta Padmaabhyaam Kushmaandaa Shubhdaastu Me ||'
    ].join('\n')
  },
  {
    title: 'देवी स्कन्दमाता (Devi Skandamata – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Skandamata)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'सिंहासनगता नित्यं पद्माश्रितकरद्वया ।',
      'शुभदास्तु सदा देवी स्कन्दमाता यशस्विनी ॥',
      '',
      'English:',
      'Simhaasana Gataa Nityam Padmaashrita Karadvayaa |',
      'Shubhdaastu Sadaa Devi Skandamaataa Yashasvinee ||'
    ].join('\n')
  },
  {
    title: 'देवी कात्यायनी (Devi Katyayani – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Katyayani)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'चन्द्रहासोज्ज्वलकरा शार्दूलवरवाहना ।',
      'कात्यायनी शुभं दद्यादेवि दानवघातिनी ॥',
      '',
      'English:',
      'Chandrahaaso Jjwala Karaa Shaardoola Vara Vaahanaa |',
      'Kaathyaayanee Shubham Dadyaadevi Daanavaghaatinee ||'
    ].join('\n')
  },
  {
    title: 'देवी कालरात्री (Devi Kalaratri – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Kalaratri)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'एकवेणी जपाकर्णपूरा नग्ना खरस्थिता ।',
      'लम्बौष्ठी कर्णिकाकर्णी तैलाभ्यक्तशरीरिणी ॥',
      'वामपादोल्लसल्लोहलता कण्टकभूषणा ।',
      'वर्धनमूर्ध्वजा कृष्णा कालरात्रिर्भयङ्करी ॥',
      '',
      'English:',
      'Ekaveni Japaakarna Pooraa Nagnaa Kharasthitaa |',
      'Lambaushthee Karnikaakarnee Tailaabhakta Shareerinee ||',
      'Vaamapaadollasal Lohalata Kantaka Bhushanaa |',
      'Vardhana Moordhvajaa Krishnaa Kaalaraatrir Bhayankaree ||'
    ].join('\n')
  },
  {
    title: 'देवी महागौरी (Devi Mahagauri – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Mahagauri)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'श्वेते वृषे समारूढा श्वेताम्बरधरा शुचिः ।',
      'महागौरी शुभं दद्यान्महादेवप्रमोददा ॥',
      '',
      'English:',
      'Shvete Vrishae Samaaroodhaa Shvetaambara Dharaa Shuchih |',
      'Mahagauri Shubham Dadyaan Mahadeva Pramodadaa ||'
    ].join('\n')
  },
  {
    title: 'देवी सिद्धिदात्री (Devi Siddhidatri – Navadurga Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Durga (Siddhidatri)',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'सिद्धगन्धर्वयक्षाद्यैरसुरैरमरैरपि ।',
      'सेव्यमाना सदा भूयात् सिद्धिदा सिद्धिदायिनी ॥',
      '',
      'English:',
      'Siddha Gandharva Yakshaadyair Asurair Amarairapi |',
      'Sevyamaanaa Sadaa Bhooyaat Siddhidaa Siddhidaayinee ||'
    ].join('\n')
  },
  {
    title: 'ब्रह्माणी मातृका (Brahmani Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Brahmani',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'हंसयुक्तविमानस्थे ब्रह्माणीरूपधारिणि ।',
      'कौशाम्भःक्षरिके देवि नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Hamsa Yukta Vimaanasthe Brahmaaneeroopa Dhaarinee |',
      'Kaushambhah Ksharike Devi Naaraayani Namo’stu Te ||'
    ].join('\n')
  },
  {
    title: 'माहेश्वरी मातृका (Maheshwari Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Maheshwari',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'त्रिशूलचन्द्राहिधरे महावृषभवाहिनि ।',
      'माहेश्वरीस्वरूपेण नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Trishoola Chandraahidhare Mahaavrishabha Vaahini |',
      'Maheshwari Swaroopena Naaraayani Namo’stu Te ||'
    ].join('\n')
  },
  {
    title: 'कौमारी मातृका (Kaumari Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Kaumari',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'मयूरकूक्कुटवृते महाशक्तिधरेऽनघे ।',
      'कौमारीरूपसंस्थाने नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Mayura Kookkuta Vrite Mahashakti Dhare’naghe |',
      'Kaumaari Roopa Samsthaane Naaraayani Namo’stu Te ||'
    ].join('\n')
  },
  {
    title: 'वैष्णवी मातृका (Vaishnavi Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Vaishnavi',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'शङ्खचक्रगदाशार्ङ्गगृहीतपरमायुधे ।',
      'प्रसीद वैष्णवीरूपे नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Shankha Chakra Gadaa Shaarngga Grihita Paramaayudhe |',
      'Praseeda Vaishnaveeroope Naaraayani Namo’stu Te ||'
    ].join('\n')
  },
  {
    title: 'वाराही मातृका (Varahi Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Varahi',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'गृहीतोग्रमहाचक्त्रे दंष्ट्रोद्धृतवसुन्धरे ।',
      'वराहरूपिणि शिवे नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Griheeto Gra Mahaa Chaktre Damshtroddhruta Vasundhare |',
      'Varaaha Roopini Shive Naaraayani Namo’stu Te ||'
    ].join('\n')
  },
  {
    title: 'नारसिंही मातृका (Narasimhi Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Narasimhi',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'नृसिंहरूपेणोग्रेण हन्तुं दैत्यान् कृतोद्यमे ।',
      'त्रैलोक्यत्राणसहिते नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Nrisimha Roopena Ogrena Hantum Daityaam Kritodyame |',
      'Trailokya Traana Sahite Naaraayani Namo’stu Te ||'
    ].join('\n')
  },
  {
    title: 'ऐन्द्री मातृका (Aindri Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Aindri',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'किरीटिनि महावज्र सहस्रनयनोज्ज्वले ।',
      'वृत्रप्राणहरे चैन्द्रि नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Kireetini Mahaa Vajra Sahasra Nayanojjvale |',
      'Vritrapraana Hare Cha Indri Naaraayani Namo’stu Te ||'
    ].join('\n')
  },
  {
    title: 'चामुण्डा मातृका (Chamunda Matrika – Matrikas Sloka)',
    category: 'Shloka',
    language: 'Sanskrit',
    deity: 'Chamunda',
    status: 'approved',
    lyrics: [
      'संस्कृत:',
      'दंष्ट्राकरालवदने शिरोमालाविभूषणे ।',
      'चामुण्डे मुण्डमथने नारायणि नमोऽस्तु ते ॥',
      '',
      'English:',
      'Damshtraakaraala Vadane Shiromalaa Vibhooshane |',
      'Chaamunde Mundamathane Naaraayani Namo’stu Te |'
    ].join('\n')
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('Connected to MongoDB');

    let added = 0;
    for (const item of shlokaItems) {
      const existing = await Devotional.findOne({ title: item.title, category: 'Shloka' });
      if (existing) {
        console.log(`Skipped (exists): ${item.title}`);
        continue;
      }
      await Devotional.create(item);
      added++;
      console.log(`Added: ${item.title}`);
    }

    console.log(`Done. Added ${added} Shloka items.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
