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

const govindaDamodaraStotram = {
  title: 'गोविन्द दामोदर स्तोत्रम् (Govinda Damodara Stotram)',
  deity: 'Krishna',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Govinda Damodara Stotram is a deeply devotional hymn composed by Sri Bilvamanagalacharya (Lilashuka). It consists of 71 verses, each ending with the refrain "Govinda Damodara Madhaveti". The stotram beautifully depicts the divine pastimes (lilas) of Lord Krishna in Vrindavan - His childhood pranks, butter-stealing, flute-playing, and the intense love of the Gopis and Yashoda. It also covers episodes from the Ramayana and urges the tongue to always chant the nectarean names of the Lord. This stotram is considered supremely purifying and is chanted for devotion, peace, and liberation.',
  lyrics: `॥ श्री गोविन्द दामोदर स्तोत्रम् ॥

अग्रे कुरूणामथ पाण्डवानां
दुःशासनेनाहृतवस्त्रकेशा।
कृष्णा तदाक्रोशदनन्यनाथा
गोविन्द दामोदर माधवेति॥1॥

Agre Kuroonaam Atha Paandavaanaam
Duhshaasanenaahrta-Vastra-Keshaa.
Krishnaa Tadaakroshad-Ananya-Naathaa
Govinda Daamodara Maadhaveti. ||1||

---

श्रीकृष्ण विष्णो मधुकैटभारे
भक्तानुकम्पिन् भगवन् मुरारे।
त्रायस्व मां केशव लोकनाथ
गोविन्द दामोदर माधवेति॥2॥

Shri Krishna Vishno Madhu-Kaitabhare
Bhaktaanukampin Bhagavan Muraare.
Traayasva Maam Keshava Lokanaatha
Govinda Daamodara Maadhaveti. ||2||

---

विक्रेतुकामाखिलगोपकन्या
मुरारिपादार्पितचित्तवृत्तिः।
दध्यादिकं मोहवशादवोचद्
गोविन्द दामोदर माधवेति॥3॥

Vikretukaamaa-Akhila-Gopakanyaa
Muraari-Paadaarpita-Chitta-Vrtttih.
Dadhyaadikam Mohavashad-Avochad
Govinda Daamodara Maadhaveti. ||3||

---

उलूखले सम्भृततण्डुलांश्च
संघट्टयन्त्यो मुसलैः प्रमुग्धाः।
गायन्ति गोप्यो जनितानुरागा
गोविन्द दामोदर माधवेति॥4॥

Ulookhale Sambhrta-Tandulaamsh-Cha
Samghattayantyo Musalaih Pramugdhaah.
Gaayanti Gopyo Janitaanuraagaa
Govinda Daamodara Maadhaveti. ||4||

---

काचित्कराम्भोजपुटे निषण्णं
क्रीडाशुकं किंशुकरक्ततुण्डम्।
अध्यापयामास सरोरुहाक्षी
गोविन्द दामोदर माधवेति॥5॥

Kaachit-Karaambhoja-Pute Nishannam
Kreedaashukam Kimshuka-Rakta-Tundam.
Adhyaapayaamaasa Saroruhakshee
Govinda Daamodara Maadhaveti. ||5||

---

गृहे गृहे गोपवधूसमूहः
प्रतिक्षणं पिञ्जरसारिकाणाम्।
स्खलद्गिरं वाचयितुं प्रवृत्तो
गोविन्द दामोदर माधवेति॥6॥

Grhe Grhe Gopavadhoo-Samoohah
Pratikshanam Pinjara-Saarikaanam.
Skhalad-Giram Vaachayitum Pravrttto
Govinda Daamodara Maadhaveti. ||6||

---

पर्य्यङ्किकाभाजमलं कुमारं
प्रस्वापयन्त्योऽखिलगोपकन्याः।
जगुः प्रबन्धं स्वरतालबन्धं
गोविन्द दामोदर माधवेति॥7॥

Paryyankikaabhaajam-Alam Kumaaram
Prasvaapayantyo-Akhila-Gopakanyaah.
Jaguh Prabandham Svarataalabandham
Govinda Daamodara Maadhaveti. ||7||

---

रामानुजं वीक्षणकेलिलोलं
गोपी गृहीत्वा नवनीतगोलम्।
आबालकं बालकमाजुहाव
गोविन्द दामोदर माधवेति॥8॥

Raamaanujam Veekshana-Keli-Lolam
Gopee Grheetvaa Navaneeta-Golam.
Aabaalacham Baalakamaajuhaava
Govinda Daamodara Maadhaveti. ||8||

---

विचित्रवर्णाभरणाभिरामे
ऽभिधेहिवक्त्राम्बुजराजहंसि।
सदा मदीये रसनेऽग्ररङ्गे
गोविन्द दामोदर माधवेति॥9॥

Vichitra-Varnaabharanaa-Bhiraame
Abhidhehi-Vaktraambuja-Raajahamsi.
Sadaa Madeeye Rasane-Agra-Range
Govinda Daamodara Maadhaveti. ||9||

---

अङ्काधिरूढं शिशुगोपगूढं
स्तनं धयन्तं कमलैककान्तम्।
सम्बोधयामास मुदा यशोदा
गोविन्द दामोदर माधवेति॥10॥

Ankaadhi-Roodham Shishu-Gopa-Goodham
Stanam Dhayantam Kamalaika-Kaantam.
Sambodha-Yaamaasa Mudaa Yashodaa
Govinda Daamodara Maadhaveti. ||10||

---

क्रीडन्तमन्तर्व्रजमात्मजं स्वं
समं वयस्यैः पशुपालबालैः।
प्रेम्णा यशोदा प्रजुहाव कृष्णं
गोविन्द दामोदर माधवेति॥11॥

Kreedantam-Antar-Vrajam-Aatmajam Svam
Samam Vayasyaih Pashupaalabalaih.
Premnaa Yashodaa Prajuhaava Krishnam
Govinda Daamodara Maadhaveti. ||11||

---

यशोदया गाढमुलूखलेन
गोकण्ठपाशेन निबध्यमानः।
रुरोद मन्दं नवनीतभोजी
गोविन्द दामोदर माधवेति॥12॥

Yashodayaa Gaadham-Ulookhalena
Go-Kantha-Paashena Nibadhyamaanah.
Ruroda Mandam Navaneeta-Bhojee
Govinda Daamodara Maadhaveti. ||12||

---

निजाङ्गणे कङ्कणकेलिलोलं
गोपी गृहीत्वा नवनीतगोलम्।
आमर्दयत्पाणितलेन नेत्रे
गोविन्द दामोदर माधवेति॥13॥

Nijaangane Kankana-Keli-Lolam
Gopee Grheetvaa Navaneeta-Golam.
Aamardayat-Paanitalen Netre
Govinda Daamodara Maadhaveti. ||13||

---

गृहे गृहे गोपवधूकदम्बाः
सर्वे मिलित्वा समवाययोगे।
पुण्यानि नामानि पठन्ति नित्यं
गोविन्द दामोदर माधवेति॥14॥

Grhe Grhe Gopavadhoo-Kadambaah
Sarve Militvaa Samavaaya-Yoge.
Punyaani Naamaani Pathanti Nityam
Govinda Daamodara Maadhaveti. ||14||

---

मन्दारमूले वदनाभिरामं
बिम्बाधरे पूरितवेणुनादम्।
गोगोपगोपीजनमध्यसंस्थं
गोविन्द दामोदर माधवेति॥15॥

Mandaara-Moole Vadanaabhiraamam
Bimbaadhere Poorita-Venu-Naadam.
Go-Gopa-Gopee-Jana-Madhya-Samstham
Govinda Daamodara Maadhaveti. ||15||

---

उत्थाय गोप्योऽपररात्रभागे
स्मृत्वा यशोदासुतबालकेलिम्।
गायन्ति प्रोच्चैर्दधि मन्थयन्त्यो
गोविन्द दामोदर माधवेति॥16॥

Utthaaya Gopyo-Apara-Raatra-Bhaage
Smrtvaa Yashodaa-Suta-Baala-Kelim.
Gaayanti Prochchhair-Dadhi Manthayantyo
Govinda Daamodara Maadhaveti. ||16||

---

जग्धोऽथ दत्तो नवनीतपिण्डो
गृहे यशोदा विचिकित्सयन्ती।
उवाच सत्यं वद हे मुरारे
गोविन्द दामोदर माधवेति॥17॥

Jagdho-Atha Datto Navaneeta-Pindo
Grhe Yashodaa Vichikitsa-Yantee.
Uvaacha Satyam Vada He Muraare
Govinda Daamodara Maadhaveti. ||17||

---

अभ्यर्च्य गेहं युवतिःप्रवृद्ध-
प्रेमप्रवाहा दधि निर्ममन्थ।
गायन्ति गोप्योऽथ सखीसमेता
गोविन्द दामोदर माधवेति॥18॥

Abhyarchya Geham Yuvatih-Pravrddha-
Prema-Pravaahaa Dadhi Nirmamantha.
Gaayanti Gopyo-Atha Sakhee-Sametaa
Govinda Daamodara Maadhaveti. ||18||

---

क्वचित् प्रभाते दधिपूर्णपात्रे
निक्षिप्य मन्थं युवती मुकुन्दम्।
आलोक्य गानं विविधं करोति
गोविन्द दामोदर माधवेति॥19॥

Kvachit Prabhaate Dadhi-Poorna-Paatre
Nikshipya Mantham Yuvatee Mukundam.
Aalokya Gaanam Vividham Karoti
Govinda Daamodara Maadhaveti. ||19||

---

क्रीडापरं भोजनमज्जनार्थं
हितैषिणी स्त्री तनुजं यशोदा।
आजूहवत् प्रेमपरिप्लुताक्षी
गोविन्द दामोदर माधवेति॥20॥

Kreedaaparam Bhojanam-Ajjanaartham
Hitaishini Stree Tanujam Yashodaa.
Aajoohavat Prema-Pariplutaakshee
Govinda Daamodara Maadhaveti. ||20||

---

सुखं शयानं निलये च विष्णुं
देवर्षिमुख्या मुनयः प्रपन्नाः।
तेनाच्युते तन्मयतां व्रजन्ति
गोविन्द दामोदर माधवेति॥21॥

Sukham Shayaanam Nilaye Cha Vishnum
Devarshi-Mukhyaa Munayah Prapannaah.
Tenaachyute Tanmayataam Vrajanti
Govinda Daamodara Maadhaveti. ||21||

---

विहाय निद्रामरुणोदये च
विधाय कृत्यानि च विप्रमुख्याः।
वेदावसाने प्रपठन्ति नित्यं
गोविन्द दामोदर माधवेति॥22॥

Vihaaya Nidraam-Arunodaye Cha
Vidhaaya Krtyaani Cha Vipra-Mukhyaah.
Vedaavasaane Prapathanti Nityam
Govinda Daamodara Maadhaveti. ||22||

---

वृन्दावने गोपगणाश्च गोप्यो
विलोक्य गोविन्दवियोगखिन्नाम्।
राधां जगुः साश्रुविलोचनाभ्यां
गोविन्द दामोदर माधवेति॥23॥

Vrndaavane Gopa-Ganaashcha Gopyo
Vilokya Govinda-Viyoga-Khinnaam.
Raadhaam Jaguh Saashru-Vilochanaa-Bhyaam
Govinda Daamodara Maadhaveti. ||23||

---

प्रभातसञ्चारगता नुगावस्
तद्रक्षणार्थं तनयं यशोदा।
प्राबोधयत् पाणितलेन मन्दं
गोविन्द दामोदर माधवेति॥24॥

Prabhaata-Sanchaaragataa Nu-Gaavas-
Tad-Rakshanaar-tham Tanayam Yashodaa.
Praabodhayat Paanitalen Mandam
Govinda Daamodara Maadhaveti. ||24||

---

प्रवालशोभा इव दीर्घकेशा
वाताम्बुपर्णाशनपूतदेहाः।
मूले तरूणां मुनयः पठन्ति
गोविन्द दामोदर माधवेति॥25॥

Pravaala-Shobhaa Iva Deergha-Keshaa
Vaataambu-Parnaashana-Poota-Dehaah.
Moole Taroonaam Munayah Pathanti
Govinda Daamodara Maadhaveti. ||25||

---

एवं ब्रुवाणा विरहातुरा भृशं
व्रजस्त्रियः कृष्णविषक्तमानसाः।
विसृज्य लज्जां रुरुदुः स्म सुस्वरं
गोविन्द दामोदर माधवेति॥26॥

Evam Bruvaanaa Virahaaturaa Bhrsham
Vraja-Striyah Krishna-Vishakta-Maanasaah.
Visrjya Lajjaam Ruruduh Sma Susvaram
Govinda Daamodara Maadhaveti. ||26||

---

गोपी कदाचिन्मणिपिञ्जरस्थं
शुकं वचो वाचयितुं प्रवृत्ता।
आनन्दकन्द व्रजचन्द्र कृष्ण
गोविन्द दामोदर माधवेति॥27॥

Gopee Kadaachin-Mani-Pinjara-Stham
Shukam Vacho Vaachayitum Pravrttaa.
Aananda-Kanda Vraja-Chandra Krishna
Govinda Daamodara Maadhaveti. ||27||

---

गोवत्सबालैः शिशुकाकपक्षं
बध्नन्तमम्भोजदलायताक्षम्।
उवाच माता चिबुकं गृहीत्वा
गोविन्द दामोदर माधवेति॥28॥

Govatsa-Baalaih Shishu-Kaaka-Paksham
Badhnantam-Ambhoja-Dalaayataaksham.
Uvaacha Maataa Chibukam Grheetvaa
Govinda Daamodara Maadhaveti. ||28||

---

प्रभातकाले वरवल्लवौघा
गोरक्षणार्थं धृतवेत्रदण्डाः।
आकारयामासुरनन्तमाद्यं
गोविन्द दामोदर माधवेति॥29॥

Prabhaata-Kaale Vara-Vallavaughaa
Go-Rakshanaar-tham Dhrta-Vetra-Dandaah.
Aakaarayaamaasur-Anantam-Aadyam
Govinda Daamodara Maadhaveti. ||29||

---

जलाशये कालियमर्दनाय
यदा कदम्बादपतन्मुरारिः।
गोपाङ्गनाश्चुक्रुशुरेत्य गोपा
गोविन्द दामोदर माधवेति॥30॥

Jalaashaye Kaaliya-Mardanaaya
Yadaa Kadambaad-Apatan-Muraarih.
Gopaanganaa-Shchukrushur-Etya Gopaa
Govinda Daamodara Maadhaveti. ||30||

---

अक्रूरमासाद्य यदा मुकुन्दश्
चापोत्सवार्थं मथुरां प्रविष्टः।
तदा स पौरैर्जयतीत्यभाषि
गोविन्द दामोदर माधवेति॥31॥

Akrooram-Aasaadya Yadaa Mukundash-
Chaapotsavaar-tham Mathuraam Pravishtah.
Tadaa Sa Paurair-Jayateety-Abhaashi
Govinda Daamodara Maadhaveti. ||31||

---

कंसस्य दूतेन यदैव नीतौ
वृन्दावनान्ताद् वसुदेवसूनू।
रुरोद गोपी भवनस्य मध्ये
गोविन्द दामोदर माधवेति॥32॥

Kamsasya Dootena Yadaiva Neetau
Vrndaavaanaantaad Vasudeva-Soonoo.
Ruroda Gopee Bhavanasya Madhye
Govinda Daamodara Maadhaveti. ||32||

---

सरोवरे कालियनागबद्धं
शिशुं यशोदातनयं निशम्य।
चक्रुर्लुठन्त्यः पथि गोपबाला
गोविन्द दामोदर माधवेति॥33॥

Sarovare Kaaliya-Naaga-Baddham
Shishum Yashodaa-Tanayam Nishamya.
Chakrur-Luthantyah Pathi Gopa-Baalaa
Govinda Daamodara Maadhaveti. ||33||

---

अक्रूरयाने यदुवंशनाथं
संगच्छमानं मथुरां निरीक्ष्य।
ऊचुर्वियोगात् किल गोपबाला
गोविन्द दामोदर माधवेति॥34॥

Akroora-Yaane Yadu-Vamsha-Naatham
Samgachchhamaanaam Mathuraam Nireekshya.
Oochur-Viyogaat Kila Gopa-Baalaa
Govinda Daamodara Maadhaveti. ||34||

---

चक्रन्द गोपी नलिनीवनान्ते
कृष्णेन हीना कुसुमे शयाना।
प्रफुल्लनीलोत्पललोचनाभ्यां
गोविन्द दामोदर माधवेति॥35॥

Chakranda Gopee Nalinee-Vanaante
Krishnena Heenaa Kusume Shayaanaa.
Praphulla-Neelotpala-Lochanaa-Bhyaam
Govinda Daamodara Maadhaveti. ||35||

---

मातापितृभ्यां परिवार्यमाणा
गेहं प्रविष्टा विललाप गोपी।
आगत्य मां पालय विश्वनाथ
गोविन्द दामोदर माधवेति॥36॥

Maataa-Pitrbhyaam Parivaaryamaanaa
Geham Pravishtaa Vilalaapa Gopee.
Aagatya Maam Paalaya Vishvanaatha
Govinda Daamodara Maadhaveti. ||36||

---

वृन्दावनस्थं हरिमाशु बुद्ध्वा
गोपी गता कापि वनं निशायाम्।
तत्राप्यदृष्ट्वातिभयादवोचद्
गोविन्द दामोदर माधवेति॥37॥

Vrndaavana-Stham Harim-Aashu Buddhvaa
Gopee Gataa Kaapi Vanam Nishaayaam.
Tatraapya-Drshtvaati-Bhayaad-Avochad
Govinda Daamodara Maadhaveti. ||37||

---

सुखं शयाना निलये निजेऽपि
नामानि विष्णोः प्रवदन्ति मर्त्याः।
ते निश्चितं तन्मयतां व्रजन्ति
गोविन्द दामोदर माधवेति॥38॥

Sukham Shayaanaa Nilaye Nije-Api
Naamaani Vishnoh Pravadanti Martyaah.
Te Nishchitam Tanmayataam Vrajanti
Govinda Daamodara Maadhaveti. ||38||

---

सा नीरजाक्षीमवलोक्यराधां
रुरोद गोविन्द वियोगखिन्नाम्।
सखी प्रफुल्लोत्पललोचनाभ्यां
गोविन्द दामोदर माधवेति॥39॥

Saa Neerajaaksheem-Avalokya-Raadhaam
Ruroda Govinda Viyoga-Khinnaam.
Sakhee Praphullotpala-Lochanaa-Bhyaam
Govinda Daamodara Maadhaveti. ||39||

---

जिह्वे रसज्ञे मधुरप्रियात्वं
सत्यं हितं त्वां परमं वदामि।
आवर्णयेथा मधुराक्षराणि
गोविन्द दामोदर माधवेति॥40॥

Jihve Rasajne Madhura-Priyaatvam
Satyam Hitam Tvaam Paramam Vadaami.
Aavarnayethaa Madhuraaksharaani
Govinda Daamodara Maadhaveti. ||40||

---

आत्यन्तिकव्याधिहरं जनानां
चिकित्सकं वेदविदो वदन्ति।
संसारतापत्रयनाशबीजं
गोविन्द दामोदर माधवेति॥41॥

Aatyantika-Vyaadhi-Haram Janaanaam
Chikitsakam Vedavido Vadanti.
Samsaara-Taapatraya-Naasha-Beejam
Govinda Daamodara Maadhaveti. ||41||

---

ताताज्ञया गच्छति रामचन्द्रे
सलक्ष्मणेऽरण्यचये ससीते।
चक्रन्द रामस्य निजा जनित्री
गोविन्द दामोदर माधवेति॥42॥

Taataajnayaa Gachchhati Raamachandra
Sa-Lakshmane-Aranya-Chaye Sa-Seete.
Chakranda Raamasya Nijaa Janitree
Govinda Daamodara Maadhaveti. ||42||

---

एकाकिनी दण्डककाननान्तात्
सा नीयमाना दशकन्धरेण।
सीता तदाक्रन्ददनन्यनाथा
गोविन्द दामोदर माधवेति॥43॥

Ekaakinee Dandaka-Kaananaantaat
Saa Neeyamaanaa Dasha-Kandharena.
Seetaa Tadaakrandad-Ananya-Naathaa
Govinda Daamodara Maadhaveti. ||43||

---

रामाद्वियुक्ता जनकात्मजासा
विचिन्तयन्ती हृदि रामरूपम्।
रुरोद सीता रघुनाथ पाहि
गोविन्द दामोदर माधवेति॥44॥

Raamaad-Viyuktaa Janakaatmajaa-Saa
Vichintayantee Hrdi Raama-Roopam.
Ruroda Seetaa Raghunaatha Paahi
Govinda Daamodara Maadhaveti. ||44||

---

प्रसीद विष्णो रघुवंशनाथ
सुरासुराणां सुखदुःखहेतो।
रुरोद सीता तु समुद्रमध्ये
गोविन्द दामोदर माधवेति॥45॥

Praseeda Vishno Raghu-Vamsha-Naatha
Suraasuraanaam Sukha-Duhkha-Heto.
Ruroda Seetaa Tu Samudra-Madhye
Govinda Daamodara Maadhaveti. ||45||

---

अन्तर्जले ग्राहगृहीतपादो
विसृष्टविक्लिष्टसमस्तबन्धुः।
तदा राजेन्द्रो नितरां जगाद
गोविन्द दामोदर माधवेति॥46॥

Antar-Jale Graaha-Grheeta-Paado
Visrshta-Viklishta-Samasta-Bandhuh.
Tadaa Raajendro Nitaraam Jagaada
Govinda Daamodara Maadhaveti. ||46||

---

हंसध्वजः शङ्खयुतो ददर्श
पुत्रं कटाहे प्रपतन्तमेनम्।
पुण्यानि नामानि हरेर्जपन्तं
गोविन्द दामोदर माधवेति॥47॥

Hamsa-Dhvajah Shankha-Yuto Dadarsha
Putram Kataahe Prapatantam-Enam.
Punyaani Naamaani Harer-Japantam
Govinda Daamodara Maadhaveti. ||47||

---

दुर्वाससो वाक्यमुपेत्य कृष्णा
सा चाब्रवीत् काननवासिनीशम्।
अन्तः प्रविष्टं मनसा जुहाव
गोविन्द दामोदर माधवेति॥48॥

Durvaasaso Vaakyam-Upetya Krishnaa
Saa Chaabraveet Kaanana-Vaasineesham.
Antah Pravishtam Manasaa Juhaava
Govinda Daamodara Maadhaveti. ||48||

---

ध्येयः सदा योगिभिरप्रमेयश्
चिन्ता-हरश्चिन्तितपारिजातः।
कस्तूरिकाकल्पितनीलवर्णो
गोविन्द दामोदर माधवेति॥49॥

Dhyeyah Sadaa Yogibhir-Aprameyash-
Chintaa-Harash-Chintita-Paarijaatah.
Kastoorikaa-Kalpita-Neela-Varno
Govinda Daamodara Maadhaveti. ||49||

---

संसारकूपे पतितोऽत्यगाधे
मोहान्धपूर्णे विषयाभितप्ते।
करावलम्बं मम देहि विष्णो
गोविन्द दामोदर माधवेति॥50॥

Samsaara-Koope Patito-Atyagaadhe
Mohaandha-Poorne Vishayaabhi-Tapte.
Karaava-Lambam Mama Dehi Vishno
Govinda Daamodara Maadhaveti. ||50||

---

त्वामेव याचे मम देहिजिह्वे
समागते दण्डधरे कृतान्ते।
वक्तव्यमेवं मधुरं सुभक्त्या
गोविन्द दामोदर माधवेति॥51॥

Tvaameva Yaache Mama Dehi-Jihve
Samaagate Danda-Dhare Krtaante.
Vaktavyam-Evam Madhuram Subhaktyaa
Govinda Daamodara Maadhaveti. ||51||

---

भजस्व मन्त्रं भवबन्धमुक्त्यै
जिह्वे रसज्ञे सुलभं मनोज्ञम्।
द्वैपायनाद्यैर्मुनिभिः प्रजप्तं
गोविन्द दामोदर माधवेति॥52॥

Bhajasva Mantram Bhava-Bandha-Muktyai
Jihve Rasajne Sulabham Manojnam.
Dvaipaayanaadyair-Munibhih Prajaptam
Govinda Daamodara Maadhaveti. ||52||

---

गोपाल वंशीधर रूपसिन्धो
लोकेश नारायण दीनबन्धो।
उच्चस्वरैस्त्वं वद सर्वदैव
गोविन्द दामोदर माधवेति॥53॥

Gopaala Vamshee-Dhara Roopa-Sindho
Lokesha Naaraayana Deena-Bandho.
Uchchasvarais-Tvam Vada Sarvadaiva
Govinda Daamodara Maadhaveti. ||53||

---

जिह्वे सदैवं भज सुन्दराणि
नामानि कृष्णस्य मनोहराणि।
समस्तभक्तार्तिविनाशनानि
गोविन्द दामोदर माधवेति॥54॥

Jihve Sadaivam Bhaja Sundaraani
Naamaani Krishnasya Manoharaani.
Samasta-Bhaktaarti-Vinaashanaani
Govinda Daamodara Maadhaveti. ||54||

---

गोविन्द गोविन्द हरे मुरारे
गोविन्द गोविन्द मुकुन्द कृष्ण।
गोविन्द गोविन्द रथाङ्गपाणे
गोविन्द दामोदर माधवेति॥55॥

Govinda Govinda Hare Muraare
Govinda Govinda Mukunda Krishna.
Govinda Govinda Rathaanga-Paane
Govinda Daamodara Maadhaveti. ||55||

---

सुखावसाने त्विदमेव सारं
दुःखावसाने त्विदमेव गेयम्।
देहावसाने त्विदमेव जाप्यं
गोविन्द दामोदर माधवेति॥56॥

Sukhavasaane Tvidam-Eva Saaram
Duhkhavasaane Tvidam-Eva Geyam.
Dehavasaane Tvidam-Eva Jaapyam
Govinda Daamodara Maadhaveti. ||56||

---

दुर्वारवाक्यं परिगृह्य कृष्णा
मृगीव भीता तु कथं कथञ्चित्।
सभां प्रविष्टा मनसाजुहाव
गोविन्द दामोदर माधवेति॥57॥

Durvaara-Vaakyam Parigrihya Krishnaa
Mrgee-Iva Bheetaa Tu Katham Kathanchit.
Sabhaam Pravishtaa Manasaa-Juhaava
Govinda Daamodara Maadhaveti. ||57||

---

श्रीकृष्ण राधावर गोकुलेश
गोपाल गोवर्धन नाथ विष्णो।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥58॥

Shree-Krishna Raadhaavara Gokulesha
Gopaala Govardhana Naatha Vishno.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||58||

---

श्रीनाथ विश्वेश्वर विश्वमूर्ते
श्रीदेवकीनन्दन दैत्यशत्रो।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥59॥

Shree-Naatha Vishveshwara Vishva-Moorte
Shree-Devakee-Nandana Daitya-Shatro.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||59||

---

गोपीपते कंसरिपो मुकुन्द
लक्ष्मीपते केशव वासुदेव।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥60॥

Gopee-Pate Kamsa-Ripo Mukunda
Lakshmee-Pate Keshava Vaasudeva.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||60||

---

गोपीजनाह्लादकर व्रजेश
गोचारणारण्यकृतप्रवेश।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥61॥

Gopee-Janaahlaadakara Vrajesha
Go-Chaaranaaranya-Krta-Pravesha.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||61||

---

प्राणेश विश्वम्भर कैटभारे
वैकुण्ठ नारायण चक्रपाणे।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥62॥

Praanesha Vishvam-Bhara Kaitabhare
Vaikuntha Naaraayana Chakra-Paane.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||62||

---

हरे मुरारे मधुसूदनाद्य
श्रीराम सीतावर रावणारे।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥63॥

Hare Muraare Madhusoodanaadya
Shree-Raama Seetaavara Raavanaare.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||63||

---

श्रीयादवेन्द्राद्रिधराम्बुजाक्ष
गोगोपगोपी सुखदानदक्ष।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥64॥

Shree-Yaadavendraadri-Dharaambujaar-ksha
Go-Gopa-Gopee Sukha-Daana-Daksha.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||64||

---

धराभरोत्तारणगोपवेष
विहारलीलाकृतबन्धुशेष।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥65॥

Dharaa-Bharottaarana-Gopa-Vesha
Vihaara-Leelaa-Krta-Bandhu-Shesha.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||65||

---

बकीबकाघासुरधेनुकारे
केशीतृणावर्तविघातदक्ष।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥66॥

Bakee-Bakaaghaasura-Dhenukaare
Keshee-Trnaavarta-Vighaata-Daksha.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||66||

---

श्रीजानकीजीवन रामचन्द्र
निशाचरारे भरताग्रजेश।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥67॥

Shree-Jaanakee-Jeevana Raamachandra
Nishaacharaare Bharataa-Grajesha.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||67||

---

नारायणानन्त हरे नृसिंह
प्रह्लादबाधाहर हे कृपालो।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥68॥

Naaraayanaananta Hare Nrsimha
Prahlaada-Baadhaa-Hara He Krpaalo.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||68||

---

लीलामनुष्याकृतिरामरूप
प्रतापदासीकृतसर्वभूप।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥69॥

Leelaa-Manushyaakrti-Raama-Roopa
Prataapa-Daaseekrta-Sarva-Bhoopa.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||69||

---

श्रीकृष्ण गोविन्द हरे मुरारे
हे नाथ नारायण वासुदेव।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥70॥

Shree-Krishna Govinda Hare Muraare
He Naatha Naaraayana Vaasudeva.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||70||

---

वक्तुं समर्थोऽपि न वक्ति कश्चिद्
अहो जनानां व्यसनाभिमुख्यम्।
जिह्वे पिबस्वामृतमेतदेव
गोविन्द दामोदर माधवेति॥71॥

Vaktum Samartho-Api Na Vakti Kashchid
Aho Janaanaam Vyasanaabhi-Mukhyam.
Jihve Pibasvaamrtam-Etad-Eva
Govinda Daamodara Maadhaveti. ||71||

---

॥ इति श्रीबिल्वमङ्गलाचार्यविरचितं श्रीगोविन्ददामोदरस्तोत्रं सम्पूर्णम् ॥

Iti Shree-Bilvamangalaachaarya-Virachitam Shree-Govinda-Daamodara-Stotram Sampoornam.`
};

async function addGovindaDamodaraStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: govindaDamodaraStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Govinda Damodara Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(govindaDamodaraStotram);
      await doc.save();
      console.log('✓  Added: ' + govindaDamodaraStotram.title);
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

addGovindaDamodaraStotram();
