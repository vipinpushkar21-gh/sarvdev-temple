const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  subCategory: { type: String },
  lyrics: { type: String },
  audioUrl: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const suryaChalisa = {
  title: 'Surya Chalisa',
  deity: 'Surya',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `श्री सूर्य देव चालीसा ॥

॥ दोहा ॥
कनक बदन कुण्डल मकर, मुक्ता माला अङ्ग,
पद्मासन स्थित ध्याइए, शंख चक्र के सङ्ग॥

Kanak badan kundal makar, mukta mālā aṅg,
Padmāsana sthit dhyāie, śaṅkh cakra ke saṅg.

(Golden visage, earrings, crocodile as mount, pearls as garland;
Meditate on Him seated on the lotus, carrying conch and discus.)

॥ चौपाई ॥
जय सविता जय जयति दिवाकर,
सहस्त्रांशु सप्ताश्व तिमिरहर॥

Jaya Savitā jaya jayati Divākara,
Sahasrāṅśu saptāśva timirahara.

(Hail Savita, hail the rising sun Divākara;
Thousand-rayed, with seven horses, dispeller of darkness.)

भानु पतंग मरीची भास्कर,
सविता हंस सुनूर विभाकर॥

Bhānu patanga Marīchī Bhāskara,
Savitā haṁsa sunūra vibhākara.

(Bhānu, the shining one; like Marīci and Bhāskara;
Savitā, radiant as a swan, the glorious illuminer.)

विवस्वान आदित्य विकर्तन,
मार्तण्ड हरिरूप विरोचन॥

Vivasvān āditya vikartana,
Mārtanḍa harirūpa virocan.

(Vivasvan, Aditya, who scatters brilliance;
Mārtaṇḍa, shining in the form of Hari.)

अम्बरमणि खग रवि कहलाते,
वेद हिरण्यगर्भ कह गाते॥

Ambara-maṇi khaga ravi kahi-lāte,
Veda hiraṇyagarbha kaha gāte.

(Called the gem of the sky, the bird-like sun;
The Vedas praise Him as Hiranyagarbha.)

सहस्त्रांशु प्रद्योतन, कहिकहि,
मुनिगन होत प्रसन्न मोदलहि॥

Sahasrāṅśu pradyotana, kahikahi,
Munigana hota prasanna moda-lahi.

(Thousand-rayed radiance shines; sages and celestial beings become pleased.)

अरुण सदृश सारथी मनोहर,
हांकत हय साता चढ़ि रथ पर॥

Aruṇa sadṛśa sārathī manohara,
Hāṅkata haya sātā chaṛhi ratha par.

(Handsome charioteer like Aruna; horses neigh and mount the chariot.)

मंडल की महिमा अति न्यारी,
तेज रूप केरी बलिहारी॥

Maṇḍala kī mahimā ati nyārī,
Teja rūpa kerī bali-hārī.

(The circle's glory is unique; His radiant form is supreme.)

उच्चैःश्रवा सदृश हय जोते,
देखी पुरन्दर लज्जित होते॥

Uccaiḥśravā sadṛśa haya jote,
Dekhī Purandara lajita hote.

(Horses like Ucchaisrava shine; even Purandara (Vishnu) looks shy to see Him.)

मित्र मरीचि, भानु, अरुण, भास्कर,
सविता सूर्य अर्क खग कलिकर॥

Mitra Marīci, Bhānu, Aruna, Bhāskara,
Savitā Sūrya arka khaga kalikara.

(Mitra, Marīci, Bhānu, Aruna, Bhāskara, Savita—names of the Sun;
The sun, the ark, the bird; dispeller of darkness.)

पूषा रवि आदित्य नाम लै,
हिरण्यगर्भाय नमः कहिकै॥

Pūṣā Ravi Aditya nāma lai,
Hiraṇyagarbhāya namaḥ kahikai.

(Chant the names Pusha, Ravi, Aditya; bow to Hiranyagarbha.)

द्वादस नाम प्रेम सों गावैं,
मस्तक बारह बार नवावैं॥

Dvādas nāma prema soṁ gāvaiṁ,
Mastaka bārah bār navāvaiṁ.

(Sing the twelve names with devotion; recite them on the head twelve times.)

चार पदारथ जन सो पावै,
दुःख दारिद्र अघ पुंज नसावै॥

Cār padārtha jana so pāvai,
Duḥkha dāridra agha puñja nasāvai.

(One attains the four goals of life; heaps of sorrow, poverty and sin are removed.)

नमस्कार को चमत्कार यह,
विधि हरिहर को कृपासार यह॥

Namaskāra ko camatkāra yah,
Vidhi Harihar ko kr̥pāsār yah.

(The salutations to the Sun are miraculous; they are a merciful method pleasing to Hari and Hara.)

सेवै भानु तुमहिं मन लाई,
अष्टसिद्धि नवनिधि तेहिं पाई॥

Sevai Bhānu tumahiṁ mana lāi,
Aṣṭasiddhi navanidhi tehiṁ pāī.

(Serve the Sun with devotion and attain eight siddhis and nine treasures.)

बारह नाम उच्चारन करते,
सहस जनम के पातक टरते॥

Bārah nāma uccāran karte,
Sahas janma ke pātaka tarte.

(Pronounce the twelve names; sins of a thousand lifetimes are removed.)

उपाख्यान जो करते तवजन,
रिपु सों जमलहते सोतेहि छन॥

Upākhyāna jo karte tavajana,
Ripu soṁ jamalahate sotehi chana.

(Whoever tells this story of the Sun destroys enemies in an instant.)

धन सुत जुत परिवार बढ़तु है,
प्रबल मोह को फंद कटतु है॥

Dhana sut juta parivār baḍhatu hai,
Prabal moha ko phanda kaṭatu hai.

(Wealth, children and family increase; strong attachments are cut away.)

अर्क शीश को रक्षा करते,
रवि ललाट पर नित्य बिहरते॥

Arka śīśa ko rakṣā karte,
Ravi lalāṭ par nitya biharate.

(The Sun protects the crown; He daily dwells on the brow.)

सूर्य नेत्र पर नित्य विराजत,
कर्ण देस पर दिनकर छाजत॥

Sūrya netra par nitya virājata,
Karna desa par dinkara chājata.

(The Sun constantly shines upon the eyes;
He shelters the ear with radiance.)

भानु नासिका वासकरहुनित,
भास्कर करत सदा मुखको हित॥

Bhānu nāsikā vāskarahunit,
Bhāskara karat sadā mukhako hita.

(Bhanu sits near the nose; Bhaskara always does good to the face.)

ओंठ रहैं पर्जन्य हमारे,
रसना बीच तीक्ष्ण बस प्यारे॥

Oṁṭh rahaiṁ parjanya hamāre,
Rasanā bīc tīkṣṇa bas pyāre.

(Our lips are like the rains; the tongue is sharp and dear.)

कंठ सुवर्ण रेत की शोभा,
तिग्म तेजसः कांधे लोभा॥

Kantha suvarṇa ret kī śobhā,
Tigma tejasah kāndhe lobhā.

(The throat shines like golden sand; the powerful brilliance on the shoulders is attractive.)

पूषां बाहू मित्र पीठहिं पर,
त्वष्टा वरुण रहत सुउष्णकर॥

Pūṣāṁ bāhū mitra pīṭhahiṁ par,
Tvaṣṭā varuṇa rahat su-uṣṇakar.

(Pusha and his arms, friends at the rear; Tvashta and Varuna remain warm.)

युगल हाथ पर रक्षा कारन,
भानुमान उरसर्म सुउदरचन॥

Yugal hāth par rakṣā kāran,
Bhānumān urasarm sau-dara-cana.

(Protection rests on twin hands; Bhanu's powerful chest is beautifully formed.)

बसत नाभि आदित्य मनोहर,
कटिमंह, रहत मन मुदभर॥

Basat nābhi āditya manohar,
Kaṭimaṁh, rahat mana mudabhar.

(Aditya delightfully dwells at the navel; the waist and mind remain joyful.)

जंघा गोपति सविता बासा,
गुप्त दिवाकर करत हुलासा॥

Jaṅghā gopati Savitā bāsā,
Gupta Divākara karat hulāsā.

(The thighs are like a herdsman's; hidden Divākara causes delight.)

विवस्वान पद की रखवारी,
बाहर बसते नित तम हारी॥

Vivasvān pada kī rakhvārī,
Bāhar basate nit tama hārī.

(Vivasvan guards the place of the feet; outside He dwells as the vanquisher of darkness.)

सहस्त्रांशु सर्वांग सम्हारै,
रक्षा कवच विचित्र विचारे॥

Sahasrāṅśu sarvāṅga samharai,
Rakṣā kavach vichitra vicāre.

(Thousand rays embrace the whole body; a wondrous protective armor is seen.)

अस जोजन अपने मन माहीं,
भय जगबीच करहुं तेहि नाहीं ॥

Asa jōjan apane man māhīṁ,
Bhaya jagabīch karahuṁ tehi nāhīṁ.

(Within these yojanas of His mind, there is no fear among the world.)

दद्रु कुष्ठ तेहिं कबहु न व्यापै,
जोजन याको मन मंह जापै॥

Dadru kuṣṭha tehiṁ kabahu na vyāpai,
Jōjan yāko man mah jāpai.

(Leprosy never afflicts there; if one meditates on these measures disease departs.)

अंधकार जग का जो हरता,
नव प्रकाश से आनन्द भरता॥

Andhakāra jag kā jo haratā,
Nava prakāś se ānanda bharatā.

(He removes the world's darkness and fills it with new light and joy.)

ग्रह गन ग्रसि न मिटावत जाही,
कोटि बार मैं प्रनवौं ताही॥

Graha gana grasi na miṭāvat jāhī,
Koṭi bār maiṁ pranavauṁ tāhī.

(The planets and stars cannot devour one who chants; I repeat the pranava (Om) a crore times thus.)

मंद सदृश सुत जग में जाके,
धर्मराज सम अद्भुत बांके॥

Mand sadṛśa sut jag meṁ jāke,
Dharmarāj sama adbhut bānke.

(Going as a son like Mand, one stands wondrous like Dharmaraj.)

धन्य-धन्य तुम दिनमनि देवा,
किया करत सुरमुनि नर सेवा॥

Dhanya-dhanya tum dinamani devā,
Kiyā karat suramuni nara sevā.

(Blest are You, O radiant Sun; the gods, sages and men serve You.)

भक्ति भावयुत पूर्ण नियम सों,
दूर हटतसो भवके भ्रम सों॥

Bhakti bhāvayut pūrṇa niyama soṁ,
Dūr haṭataso bhavake bhrama soṁ.

(With devotion and complete discipline, one moves far from worldly delusion.)

परम धन्य सों नर तनधारी,
हैं प्रसन्न जेहि पर तम हारी॥

Param dhanya soṁ nara tanadhārī,
Hain prasanna jehi par tama hārī.

(Extremely blessed is the mortal who bears this body; He is pleased and dispels darkness.)

अरुण माघ महं सूर्य फाल्गुन,
मधु वेदांग नाम रवि उदयन॥

Aruṇa Māgha mahaṁ Sūrya Phālguna,
Madhu Vedāṅga nāma Ravi udayan.

(In Magha and Phalguna, the Sun rises; the Vedic limb names the Sun's ascent.)

भानु उदय बैसाख गिनावै,
ज्येष्ठ इन्द्र आषाढ़ रवि गावै॥

Bhānu uday Baisākh gināvai,
Jyeṣṭha Indra Āṣādh Ravi gāvai.

(Bhanu's rise is counted in Vaishakha; in Jyeshtha Indra and in Ashadha the Sun is sung.)

यम भादों आश्विन हिमरेता,
कातिक होत दिवाकर नेता॥

Yama Bhādōṁ Āśvin Himaretā,
Kātik hot Divākara netā.

(In Bhadrapada and Ashwin Yama, Himaretā; in Kartika the Sun leads.)

अगहन भिन्न विष्णु हैं पूसहिं,
पुरुष नाम रविहैं मलमासहिं॥

Agahana bhinna Viṣṇu hain Pūsahi,
Puruṣa nāma Ravihaiṁ malamāsahi.

(Seasonal differences and names of months vary; the Sun is invoked across times.)

॥ दोहा ॥
भानु चालीसा प्रेम युत, गावहिं जे नर नित्य,
सुख सम्पत्ति लहि बिबिध, होंहिं सदा कृतकृत्य॥

Bhānu Chālīsā prema yut, gāvahiṁ je nara nitya,
Sukha sampatti lahi vibidh, honhiṁ sadā kṛtakṛtya.

(If a mortal sings the Surya Chalisa daily with love,
He receives varied happiness and wealth and remains ever grateful.)
` ,
  description: 'Surya Chalisa - 40-verse Chalisa praising Surya Dev (Sun). Includes Hindi lyrics, transliteration and English translation. Benefits: removes darkness, grants health, prosperity, siddhis, and liberation. Insert logic avoids duplicates by title+deity.'
};

async function addSuryaChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: suryaChalisa.title, deity: 'Surya' });
    if (existing) {
      console.log(`Surya Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(suryaChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${suryaChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const suryaCount = await Devotional.find({ category: 'Chalisa', deity: 'Surya' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Surya Chalisas: ${suryaCount.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Surya Chalisa:', error);
    process.exit(1);
  }
}

addSuryaChalisa();
