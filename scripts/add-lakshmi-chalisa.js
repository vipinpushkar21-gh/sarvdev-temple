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

const lakshmiChalisa = {
  title: 'Shri Lakshmi Chalisa',
  deity: 'Lakshmi',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `॥ दोहा॥
मातु लक्ष्मी करि कृपा,
करो हृदय में वास ।
मनोकामना सिद्घ करि,
परुवहु मेरी आस ॥

Mātu Lakṣmī kari kṛpā,
Karo hṛday meṁ vās.
Manokāmanā siddha kari,
Paruvahu merī āśā.

(Mother Lakshmi show mercy, dwell in my heart;
Fulfill my wishes and grant my hope.)

॥ सोरठा॥
यही मोर अरदास,
हाथ जोड़ विनती करुं ।
सब विधि करौ सुवास,
जय जननि जगदंबिका ॥

Yahī mora aradāsa,
Hātha joṛa vinatī karūṁ.
Sab vidhi karao suvāsa,
Jaya jananī Jagadambikā.

(This is my humble prayer with folded hands;
Bless all rites with fragrance — victory to Mother Jagadambika.)

॥ चौपाई ॥
सिन्धु सुता मैं सुमिरौ तोही ।
ज्ञान बुद्घि विघा दो मोही ॥

Sindhu sutā maiṁ sumirau tohī.
Jñāna buddhi vighā do mohī.

(I remember you, daughter of the ocean; grant me wisdom and intellect.)

तुम समान नहिं कोई उपकारी ।
सब विधि पुरवहु आस हमारी ॥

Tum samān nahīṁ koī upakārī.
Sab vidhi puravahu āśā hamārī.

(None is as benevolent as you; fulfill our hopes in every way.)

जय जय जगत जननि जगदम्बा ।
सबकी तुम ही हो अवलम्बा ॥

Jaya jaya jagat janani Jagadambā.
Sabkī tum hī ho avalambā.

(Hail, hail Mother of the world Jagadamba; you are everyone's support.)

तुम ही हो सब घट घट वासी ।
विनती यही हमारी खासी ॥

Tum hī ho sab ghaṭ ghaṭ vāsī.
Vinatī yahī hamārī khāsī.

(You dwell in every heart; this is our earnest plea.)

जगजननी जय सिन्धु कुमारी ।
दीनन की तुम हो हितकारी ॥

Jagajanani jaya Sindhu kumārī.
Dīnan kī tum ho hitakārī.

(Hail mother of the world, daughter of the ocean; you are benefactor to the humble.)

विनवौं नित्य तुमहिं महारानी ।
कृपा करौ जग जननि भवानी ॥

Vinavauṁ nitya tumahiṁ mahārānī.
Kṛpā karo jagajanani Bhavānī.

(I beseech you daily, O great queen; show mercy, Mother Bhavani.)

केहि विधि स्तुति करौं तिहारी ।
सुधि लीजै अपराध बिसारी ॥

Kehi vidhi stuti karauṁ tihārī.
Sudhi lījai aparādha bisārī.

(Allow me some praise of you; grant discernment so faults are forgotten.)

कृपा दृष्टि चितववो मम ओरी ।
जगजननी विनती सुन मोरी ॥

Kṛpā dṛṣṭi citavavo mama orī.
Jagajanani vinatī sun morī.

(Direct your merciful gaze to me; O world-mother hear my plea.)

ज्ञान बुद्घि जय सुख की दाता ।
संकट हरो हमारी माता ॥

Jñāna buddhi jaya sukha kī dātā.
Saṅkaṭ haro hamārī mātā.

(You give knowledge, intellect and bliss; O Mother remove our difficulties.)

क्षीरसिन्धु जब विष्णु मथायो ।
चौदह रत्न सिन्धु में पायो ॥

Kṣīra-sindhu jab Viṣṇu mathāyo.
Chaudah ratna sindhu meṁ pāyo.

(When Vishnu churned the ocean of milk, fourteen jewels were found.)

चौदह रत्न में तुम सुखरासी ।
सेवा कियो प्रभु बनि दासी ॥

Chaudah ratna meṁ tum sukharāsī.
Sevā kiyo prabhu bani dāsī.

(Among the fourteen gems you are the one who grants joy; you served the Lord as maid.)

जब जब जन्म जहां प्रभु लीन्हा ।
रुप बदल तहं सेवा कीन्हा ॥

Jab jab janma jahāṁ prabhu līnhā.
Rup badal tahaṁ sevā kīnhā.

(Whenever the Lord took birth, you changed form and served Him.)

स्वयं विष्णु जब नर तनु धारा ।
लीन्हेउ अवधपुरी अवतारा ॥

Svayam Viṣṇu jab nara tanu dhārā.
Līnheu Avadhapurī avatārā.

(When Vishnu himself assumed human form, He took incarnation in Ayodhya.)

तब तुम प्रगट जनकपुर माहीं ।
सेवा कियो हृदय पुलकाहीं ॥

Tab tum pragaṭ Janakapur māhīṁ.
Sevā kiyo hṛday pulakāhīṁ.

(Then you manifested in Janakpur and served with heartfelt devotion.)

अपनाया तोहि अन्तर्यामी ।
विश्व विदित त्रिभुवन की स्वामी ॥

Apnāyā tohi antaryāmī.
Viśva vidita tribhuvan kī svāmī.

(You accepted the inner-knower; known throughout the three worlds as sovereign.)

तुम सम प्रबल शक्ति नहीं आनी ।
कहं लौ महिमा कहौं बखानी ॥

Tum sam prabal śakti nahīṁ ānī.
Kahaṁ lau mahimā kahauṁ bakhānī.

(No power equals yours; how shall I sing or describe your glory?)

मन क्रम वचन करै सेवकाई ।
मन इच्छित वांछित फल पाई ॥

Man kram vacan karai sevakāī.
Man icchit vāṁchit phal pāī.

(Those who serve in thought, word and deed receive their desired fruits.)

तजि छल कपट और चतुराई ।
पूजहिं विविध भांति मनलाई ॥

Taji chala kapaṭ aur chaturāī.
Pūjahiṁ vividh bhānti manlāī.

(Abandon deceit and cunning; worship in diverse ways with devotion.)

और हाल मैं कहौं बुझाई ।
जो यह पाठ करै मन लाई ॥

Aur hāl maiṁ kahauṁ bujhāī.
Jo yah pāṭh karai man lāī.

(Let me say plainly that whoever reads this with heart...)

ताको कोई कष्ट नोई ।
मन इच्छित पावै फल सोई ॥

Tāko koī kaṣṭ noī.
Man icchit pāvai phal soī.

(No trouble reaches them; they obtain the fruit they desire.)

त्राहि त्राहि जय दुःख निवारिणि ।
त्रिविध ताप भव बंधन हारिणी ॥

Trāhi trāhi jaya duḥkha nivāriṇī.
Trividha tāpa bhava bandhana hāriṇī.

(Hail rescuer who removes suffering; destroyer of the threefold pains and bondage.)

जो चालीसा पढ़ै पढ़ावै ।
ध्यान लगाकर सुनै सुनावै ॥

Jo chālīsā paṛhai paṛāvai.
Dhyān lagākar sunai sunāvai.

(Whoever reads or has this Chalisa recited with focus and listens,) 

ताकौ कोई न रोग सतावै ।
पुत्र आदि धन सम्पत्ति पावै ॥

Tākau koī na roga satāvai.
Putra ādi dhana sampatti pāvai.

(No disease afflicts them; they gain sons, wealth and prosperity.)

पुत्रहीन अरु संपति हीना ।
अन्ध बधिर कोढ़ी अति दीना ॥

Putrahīn aru sampatti hīnā.
Andha badhiro koḍhī ati dīnā.

(Those childless or impoverished, blind, deaf or leprous are restored.)

विप्र बोलाय कै पाठ करावै ।
शंका दिल में कभी न लावै ॥

Vipra bolāya kai pāṭh karāvai.
Śaṅkā dil meṁ kabhī na lāvai.

(Have a priest recite; let doubt never enter the heart.)

पाठ करावै दिन चालीसा ।
ता पर कृपा करैं गौरीसा ॥

Pāṭh karāvai dina chālīsā.
Tā par kṛpā karaiṁ Gaurīsā.

(If the Chalisa is recited for a day, Gauri grants mercy.)

सुख सम्पत्ति बहुत सी पावै ।
कमी नहीं काहू की आवै ॥

Sukha sampatti bahut sī pāvai.
Kamī nahīṁ kāhū kī āvai.

(They receive abundant happiness and wealth; no lack befalls them.)

बारह मास करै जो पूजा ।
तेहि सम धन्य और नहिं दूजा ॥

Bārah mās karai jo pūjā.
Tehi sam dhanya aur nahīṁ dūjā.

(Those who worship for twelve months are especially blessed.)

प्रतिदिन पाठ करै मन माही ।
उन सम कोइ जग में कहुं नाहीं ॥

Pratidin pāṭh karai man māhī.
Un sam koi jag meṁ kahūṁ nāhīṁ.

(Whoever reads daily are incomparable in the world.)

बहुविधि क्या मैं करौं बड़ाई ।
लेय परीक्षा ध्यान लगाई ॥

Bahuvidhi kyā maiṁ karauṁ baṛāī.
Leiya parīkṣā dhyān lagāī.

(How many praises shall I give? I examine and fix my meditation.)

करि विश्वास करै व्रत नेमा ।
होय सिद्घ उपजै उर प्रेमा ॥

Kari viśvāsa karai vrat nēmā.
Hoye siddha upajai ura premā.

(By faith and vows results manifest and love arises in the heart.)

जय जय जय लक्ष्मी भवानी ।
सब में व्यापित हो गुण खानी ॥

Jaya jaya jaya Lakṣmī Bhavānī.
Sab meṁ vyāpita ho guṇa khānī.

(Hail Lakshmi Bhavani — may your virtues pervade all.)

तुम्हरो तेज प्रबल जग माहीं ।
तुम सम कोउ दयालु कहुं नाहिं ॥

Tumharo tej prabal jag māhīṁ.
Tum sam kou dayālu kahuṁ nāhīṁ.

(Your radiance is strong in the world; none is as merciful as you.)

मोहि अनाथ की सुधि अब लीजै ।
संकट काटि भक्ति मोहि दीजै ॥

Mohi anāth kī sudhi ab lījai.
Saṅkaṭ kāṭi bhakti mohi dījai.

(Grant care to the orphaned and remove my difficulties; give me devotion.)

बिन दर्शन व्याकुल अधिकारी ।
तुमहि अछत दुःख सहते भारी ॥

Bin darśan vyākula adhikārī.
Tumhi achhat duḥkha sahate bhārī.

(Without your sight the anguished suffer heavily.)

रुप चतुर्भुज करके धारण ।
कष्ट मोर अब करहु निवारण ॥

Rup caturbhuja karke dhāraṇa.
Kaṣṭa mora ab karahu nivāraṇa.

(Assume four-armed form and remove my troubles.)

॥ दोहा॥
त्राहि त्राहि दुख हारिणी,
हरो वेगि सब त्रास ।
जयति जयति जय लक्ष्मी,
करो शत्रु को नाश ॥

Trāhi trāhi duḥkha hāriṇī,
Haro vegi sab trāsa.
Jayati jayati jaya Lakṣmī,
Karo śatru ko nāśa.

(Rescue, O remover of sorrow; quickly take away all fears.
Victory, victory to Lakshmi — destroy the enemies.)

रामदास धरि ध्यान नित,
विनय करत कर जोर ।
मातु लक्ष्मी दास पर,
करहु दया की कोर ॥

Rāmadāsa dhari dhyān nit,
Vinaya karata kara jora.
Mātu Lakṣmī dāsa par,
Karahu dayā kī kor.

(Ramadass keeps constant meditation with humility; Mother Lakshmi show mercy to your servant.)

(End of Shri Lakshmi Chalisa)` ,
  description: 'Shri Lakshmi Chalisa - 40-verse Chalisa praising Goddess Lakshmi (Lakshmi-Bhavani). Includes Hindi original, Roman transliteration and concise English translations. Benefits: wealth, prosperity, removal of poverty and illness, knowledge, devotion. Duplicate-check before insert.'
};

async function addLakshmiChalisa() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const existing = await Devotional.findOne({ title: lakshmiChalisa.title, deity: 'Lakshmi' });
    if (existing) {
      console.log(`Lakshmi Chalisa already exists (id: ${existing._id}). Skipping insert.`);
    } else {
      const newChalisa = new Devotional(lakshmiChalisa);
      await newChalisa.save();
      console.log(`✓ Added: ${lakshmiChalisa.title}`);
    }

    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const lakshmiCount = await Devotional.find({ category: 'Chalisa', deity: 'Lakshmi' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Lakshmi Chalisas: ${lakshmiCount.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error adding Lakshmi Chalisa:', error);
    process.exit(1);
  }
}

addLakshmiChalisa();
