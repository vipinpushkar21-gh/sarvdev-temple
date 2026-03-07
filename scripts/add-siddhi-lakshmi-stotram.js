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

const siddhiLakshmiStotram = {
  title: 'सिद्धिलक्ष्मीस्तोत्रम् (Siddhi Lakshmi Stotram)',
  deity: 'Lakshmi',
  category: 'Stotra',
  language: 'Sanskrit',
  status: 'approved',
  description: 'Siddhi Lakshmi Stotram is a powerful hymn from the Brahmanda Purana, narrated in a dialogue between Lord Shiva and Lord Vishnu. It invokes Siddhi Lakshmi — the form of Goddess Lakshmi who bestows spiritual accomplishment (siddhi) and removes poverty, sorrow, and all afflictions. Regular recitation for one to six months is said to destroy all miseries accumulated over thousands of lifetimes and grant wealth, progeny, fame, and longevity.',
  lyrics: `॥ श्रीसिद्धिलक्ष्मीस्तोत्रम् ॥

॥ विनियोगः ॥
श्री गणेशाय नमः।

ॐ अस्य श्रीसिद्धिलक्ष्मीस्तोत्रस्य हिरण्यगर्भ ऋषिः,
अनुष्टुप् छन्दः, सिद्धिलक्ष्मीर्देवता, मम समस्त
दुःखक्लेशपीडादारिद्र्यविनाशार्थं
सर्वलक्ष्मीप्रसन्नकरणार्थं
महाकालीमहालक्ष्मीमहासरस्वतीदेवताप्रीत्यर्थं च
सिद्धिलक्ष्मीस्तोत्रजपे विनियोगः।

॥ करन्यासः ॥
ॐ सिद्धिलक्ष्मी अङ्गुष्ठाभ्यां नमः।
ॐ ह्रीं विष्णुहृदये तर्जनीभ्यां नमः।
ॐ क्लीं अमृतानन्दे मध्यमाभ्यां नमः।
ॐ श्रीं दैत्यमालिनी अनामिकाभ्यां नमः।
ॐ तं तेजःप्रकाशिनी कनिष्ठिकाभ्यां नमः।
ॐ ह्रीं क्लीं श्रीं ब्राह्मी वैष्णवी माहेश्वरी करतलकरपृष्ठाभ्यां नमः।

॥ हृदयादिन्यासः ॥
ॐ सिद्धिलक्ष्मी हृदयाय नमः।
ॐ ह्रीं वैष्णवी शिरसे स्वाहा।
ॐ क्लीं अमृतानन्दे शिखायै वौषट्।
ॐ श्रीं दैत्यमालिनी कवचाय हुम्।
ॐ तं तेजःप्रकाशिनी नेत्रद्वयाय वौषट्।
ॐ ह्रीं क्लीं श्रीं ब्राह्मीं वैष्णवीं फट्।

॥ ध्यानम् ॥
ब्राह्मीं च वैष्णवीं भद्रां षड्भुजां च चतुर्मुखाम्।
त्रिनेत्रां च त्रिशूलां च पद्मचक्रगदाधराम्॥१॥

पीताम्बरधरां देवीं नानालङ्कारभूषिताम्।
तेजःपुञ्जधरां श्रेष्ठां ध्यायेद्बालकुमारिकाम्॥२॥

॥ अथ मूलपाठः ॥
ॐकारलक्ष्मीरूपेण विष्णोर्हृदयमव्ययम्।
विष्णुमानन्दमध्यस्थं ह्रींकारबीजरूपिणी॥३॥

ॐ क्लीं अमृतानन्दभद्रे सद्य आनन्ददायिनी।
ॐ श्रीं दैत्यभक्षरदां शक्तिमालिनी शत्रुमर्दिनी॥४॥

तेजःप्रकाशिनी देवी वरदा शुभकारिणी।
ब्राह्मी च वैष्णवी भद्रा कालिका रक्तशाम्भवी॥५॥

आकारब्रह्मरूपेण ॐकारं विष्णुमव्ययम्।
सिद्धिलक्ष्मि परालक्ष्मि लक्ष्यलक्ष्मि नमोऽस्तुते॥६॥

सूर्यकोटिप्रतीकाशं चन्द्रकोटिसमप्रभम्।
तन्मध्ये निकरे सूक्ष्मं ब्रह्मरूपव्यवस्थितम्॥७॥

ॐकारपरमानन्दं क्रियते सुखसम्पदा।
सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके॥८॥

प्रथमे त्र्यम्बका गौरी द्वितीये वैष्णवी तथा।
तृतीये कमला प्रोक्ता चतुर्थे सुरसुन्दरी॥९॥

पञ्चमे विष्णुपत्नी च षष्ठे च वैष्णवी तथा।
सप्तमे च वरारोहा अष्टमे वरदायिनी॥१०॥

नवमे खड्गत्रिशूला दशमे देवदेवता।
एकादशे सिद्धिलक्ष्मीर्द्वादशे ललितात्मिका॥११॥

एतत्स्तोत्रं पठन्तस्त्वां स्तुवन्ति भुवि मानवाः।
सर्वोपद्रवमुक्तास्ते नात्र कार्या विचारणा॥१२॥

एकमासं द्विमासं वा त्रिमासं च चतुर्थकम्।
पञ्चमासं च षण्मासं त्रिकालं यः पठेन्नरः॥१३॥

ब्राह्मणाः क्लेशतो दुःखदरिद्रा भयपीडिताः।
जन्मान्तरसहस्रेषु मुच्यन्ते सर्वक्लेशतः॥१४॥

अलक्ष्मीर्लभते लक्ष्मीमपुत्रः पुत्रमुत्तमम्।
धन्यं यशस्यमायुष्यं वह्निचौरभयेषु च॥१५॥

शाकिनीभूतवेतालसर्वव्याधिनिपातके।
राजद्वारे महाघोरे सङ्ग्रामे रिपुसङ्कटे॥१६॥

सभास्थाने श्मशाने च कारागेहारिबन्धने।
अशेषभयसम्प्राप्तौ सिद्धिलक्ष्मीं जपेन्नरः॥१७॥

ईश्वरेण कृतं स्तोत्रं प्राणिनां हितकारणम्।
स्तुवन्ति ब्राह्मणा नित्यं दारिद्र्यं न च वर्धते॥१८॥

या श्रीः पद्मवने कदम्बशिखरे राजगृहे कुञ्जरे
श्वेते चाश्वयुते वृषे च युगले यज्ञे च यूपस्थिते।
शङ्खे देवकुले नरेन्द्रभवनी गङ्गातटे गोकुले
सा श्रीस्तिष्ठतु सर्वदा मम गृहे भूयात्सदा निश्चला॥१९॥

॥ इति श्रीब्रह्माण्डपुराणे ईश्वरविष्णुसंवादे
दारिद्र्यनाशनं सिद्धिलक्ष्मीस्तोत्रं सम्पूर्णम् ॥

---

|| Shri Siddhi Lakshmi Stotram ||

|| Viniyogah ||
Shri Ganeshaya Namah.

Om Asya Shri Siddhi Lakshmi Stotrasya Hiranyagarbha Rishih,
Anushtup Chhandah, Siddhi Lakshmirdevata, Mama Samasta
Duhkhakleshapiidadaridrya-vinashartham
Sarva Lakshmi Prasanna-karanartham
Mahakali-Mahalakshmi-Mahasarasvati Devata-prityartham Cha
Siddhi Lakshmi Stotra Jape Viniyogah.

|| Karanyasah ||
Om Siddhi Lakshmi Angushthabhyam Namah.
Om Hreem Vishnuhridaye Tarjanibhyam Namah.
Om Kleem Amritanande Madhyamabhyam Namah.
Om Shreem Daityamalini Anamikabhyam Namah.
Om Tam Tejah-prakashini Kanishthi-kabhyam Namah.
Om Hreem Kleem Shreem Brahmi Vaishnavi Maheshvari Karatala-karaprishthabhyam Namah.

|| Hridayadinyasah ||
Om Siddhi Lakshmi Hridayaya Namah.
Om Hreem Vaishnavi Shirase Svaha.
Om Kleem Amritanande Shikhayai Vaushat.
Om Shreem Daityamalini Kavachaya Hum.
Om Tam Tejah-prakashini Netra-dvayaya Vaushat.
Om Hreem Kleem Shreem Brahmim Vaishnavim Phat.

|| Dhyanam ||
Brahmim Cha Vaishnavim Bhadram Shadbhujam Cha Chaturmukham.
Trinetram Cha Trishulam Cha Padma-chakra-gadadharam. ||1||

Pitambaradharam Devim Nanalankara-bhushitam.
Tejah-punjadharam Shreshthaam Dhyayed-balakumarikam. ||2||

|| Atha Mulapaathah ||
Omkaralakshmirupena Vishnor-hridayam-avyayam.
Vishnum-ananda-madhyastham Hrimkara-bijarupinim. ||3||

Om Kleem Amritananda-bhadre Sadya Anandadayini.
Om Shreem Daitya-bhaksha-radam Shakti-malini Shatru-mardini. ||4||

Tejah-prakashini Devi Varada Shubhakarini.
Brahmi Cha Vaishnavi Bhadra Kalika Rakta-shambhavi. ||5||

Akara-brahmarupena Omkaram Vishnum-avyayam.
Siddhi Lakshmi Para Lakshmi Lakshya Lakshmi Namoastute. ||6||

Surya-koti-pratikasham Chandra-koti-samaprabham.
Tanmadhye Nikare Sukshmam Brahmarupa-vyavasthitam. ||7||

Omkara-paramananandam Kriyate Sukha-sampada.
Sarva-mangala-mangalye Shive Sarvartha-sadhike. ||8||

Prathame Tryambaka Gauri Dvitiye Vaishnavi Tatha.
Tritiye Kamala Prokta Chaturthe Surasundari. ||9||

Panchame Vishnu-patni Cha Shashthe Cha Vaishnavi Tatha.
Saptame Cha Vararoha Ashtame Varadayini. ||10||

Navame Khadga-trishula Dashame Deva-devata.
Ekadase Siddhi-Lakshmirdvadase Lalitatmika. ||11||

Etat Stotram Pathantastvam Stuvanti Bhuvi Manavah.
Sarvopadrava-muktaste Natra Karya Vicharana. ||12||

Ekamasam Dvimasam Va Trimasam Cha Chaturthakam.
Panchamasam Cha Shanmasam Trikalam Yah Pathennnarah. ||13||

Brahmanah Kleshato Duhkha-daridra Bhaya-piditah.
Janmantara-sahasreshu Muchyante Sarva-kleshtah. ||14||

Alakshmirabhate Lakshmim-aputrah Putram-uttamam.
Dhanyam Yashasyam-ayushyam Vahni-chaura-bhayeshu Cha. ||15||

Shakini-bhuta-vetala-sarva-vyadhi-nipatake.
Rajadvare Mahaghore Sangrame Ripu-sankate. ||16||

Sabhasthane Shmashane Cha Karagehari-bandhane.
Ashesha-bhaya-sampraptau Siddhi Lakshmim Japennnarah. ||17||

Ishvarena Kritam Stotram Praninam Hitakaranam.
Stuvanti Brahmana Nityam Daridryam Na Cha Vardhate. ||18||

Ya Shrih Padmavane Kadamba-shikhare Rajagruhe Kunjare
Shvete Chashvayute Vrishe Cha Yugale Yajne Cha Yupasthite.
Shankhe Devakule Narendra-bhavani Gangatate Gokule
Sa Shristishthatu Sarvada Mama Grihe Bhuyat Sada Nishchala. ||19||

|| Iti Shri Brahmanda Purane Ishvara-Vishnu-Samvade
Daridrya-nashanam Siddhi Lakshmi Stotram Sampurnam ||`
};

async function addSiddhiLakshmiStotram() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: siddhiLakshmiStotram.title, category: 'Stotra' });
    if (existing) {
      console.log('⏭  Siddhi Lakshmi Stotram already exists, skipping.');
    } else {
      const doc = new Devotional(siddhiLakshmiStotram);
      await doc.save();
      console.log('✓  Added: ' + siddhiLakshmiStotram.title);
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

addSiddhiLakshmiStotram();
