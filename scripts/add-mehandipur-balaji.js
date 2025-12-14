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

const mehandipur = {
  title: 'Mehandipur Balaji Chalisa',
  deity: 'Hanuman',
  category: 'Chalisa',
  status: 'approved',
  language: 'Hindi',
  lyrics: `दोहा:
श्री गुरु चरण चितलाय, के धरें ध्यान हनुमान।
बालाजी चालीसा लिखे, दास स्नेही कल्याण॥

Śrī guru charaṇa chitalāya, ke dharēṁ dhyāna hanumāna।
Bālājī chālīsā likhē, dāsa snēhī kalyāṇa॥

(Focusing on the holy feet of the Guru and meditating on Hanuman, servant Snehi Kalyan writes this Balaji Chalisa)

विश्व विदित वर दानी, संकट हरण हनुमान।
मैंहदीपुर में प्रगट भये, बालाजी भगवान॥

Viśva vidita vara dānī, saṅkaṭa haraṇa hanumāna।
Maīṁhadīpura mēṁ pragaṭa bhayē, bālājī bhagavāna॥

(Known worldwide as giver of boons, remover of troubles Hanuman. In Mehandipur manifested Lord Balaji)

चौपाई:
जय हनुमान बालाजी देवा। प्रगट भये यहां तीनों देवा॥
Jaya hanumāna bālājī dēvā। Pragaṭa bhayē yahāṁ tīnōṁ dēvā॥
(Victory to Hanuman Balaji God, all three deities manifested here)

प्रेतराज भैरव बलवाना। कोतवाल कप्तानी हनुमाना॥
Prētarāja bhairava balavānā। Kōtavāla kaptānī hanumānā॥
(Pretraj Bhairav the mighty, Kotwal (police chief) and Captain Hanuman)

मैंहदीपुर अवतार लिया है। भक्तों का उध्दार किया है॥
Maīṁhadīpura avatāra liyā hai। Bhaktōṁ kā uddhāra kiyā hai॥
(Took incarnation in Mehandipur, uplifted the devotees)

बालरूप प्रगटे हैं यहां पर। संकट वाले आते जहाँ पर॥
Bālarūpa pragaṭē haiṁ yahāṁ para। Saṅkaṭa vālē ātē jahāṁ para॥
(Manifested in child form here, where troubled ones come)

डाकनि शाकनि अरु जिन्दनीं। मशान चुड़ैल भूत भूतनीं॥
Ḍākani śākani aru jindanīṁ। Maśāna churail bhūta bhūtanīṁ॥
(Dakini, Shakini and evil spirits, cremation ground witches, ghosts male and female)

जाके भय ते सब भाग जाते। स्याने भोपे यहाँ घबराते॥
Jākē bhaya tē saba bhāga jātē। Syānē bhōpē yahāṁ ghabarātē॥
(Fearing whom all run away, even clever exorcists get scared here)

चौकी बन्धन सब कट जाते। दूत मिले आनन्द मनाते॥
Chaukī bandhana saba kaṭa jātē। Dūta milē ānanda manātē॥
(All bindings and restrictions are cut, messengers meet and celebrate)

सच्चा है दरबार तिहारा। शरण पड़े सुख पावे भारा॥
Sachchā hai darabāra tihārā। Śaraṇa paṛē sukha pāvē bhārā॥
(True is your court, taking refuge one finds great happiness)

रूप तेज बल अतुलित धामा। सन्मुख जिनके सिय रामा॥
Rūpa tēja bala atulita dhāmā। Sanmukha jinakē siya rāmā॥
(Form, radiance, strength incomparable abode, before whom are Sita and Ram)

कनक मुकुट मणि तेज प्रकाशा। सबकी होवत पूर्ण आशा॥
Kanaka mukuṭa maṇi tēja prakāśā। Sabakī hōvata pūrṇa āśā॥
(Golden crown, jewel's brilliant light, everyone's hopes are fulfilled) [10]

महन्त गणेशपुरी गुणीले। भये सुसेवक राम रंगीले॥
Mahanta gaṇēśapurī guṇīlē। Bhayē susēvaka rāma raṅgīlē॥
(Mahant Ganeshpuri the virtuous, became excellent servant of delightful Ram)

अद्भुत कला दिखाई कैसी। कलयुग ज्योति जलाई जैसी॥
Adbhuta kalā dikhāī kaisī। Kalayuga jyōti jalāī jaisī॥
(What wonderful art he showed, like lighting a flame in Kaliyuga)

ऊँची ध्वजा पताका नभ में। स्वर्ण कलश हैं उन्नत जग में॥
Ūṁchī dhvajā patākā nabha mēṁ। Svarṇa kalaśa haiṁ unnata jaga mēṁ॥
(High flag and banner in the sky, golden pinnacle elevated in the world)

धर्म सत्य का डंका बाजे। सियाराम जय शंकर राजे॥
Dharma satya kā ḍaṅkā bājē। Siyārāma jaya śaṅkara rājē॥
(Drum of righteous truth beats, victory to Sita-Ram and Shankar)

आन फिराया मुगदर घोटा। भूत जिन्द पर पड़ते सोटा॥
Āna phirāyā mugadara ghōṭā। Bhūta jinda para paṛatē sōṭā॥
(Swing the mace and club, stick falls upon ghosts and evil spirits)

राम लक्ष्मन सिय ह्रदय कल्याणा। बाल रूप प्रगटे हनुमाना॥
Rāma lakṣmana siya hṛdaya kalyāṇā। Bāla rūpa pragaṭē hanumānā॥
(Ram, Lakshman, Sita in the auspicious heart, Hanuman manifested in child form)

जय हनुमन्त हठीले देवा। पुरी परिवार करत हैं सेवा॥
Jaya hanumanta haṭhīlē dēvā। Purī parivāra karata haiṁ sēvā॥
(Victory to determined Hanuman God, Puri family does service)

लड्डू चूरमा मिश्री मेवा। अर्जी दरखास्त लगाऊ देवा॥
Laḍḍū chūramā miśrī mēvā। Arjī darakhāsta lagāū dēvā॥
(Laddus, churma, sugar candy, dry fruits, I submit my petition O God)

दया करे सब विधि बालाजी। संकट हरण प्रगटे बालाजी॥
Dayā karē saba vidhi bālājī। Saṅkaṭa haraṇa pragaṭē bālājī॥
(Show mercy in every way Balaji, manifested as remover of troubles Balaji)

जय बाबा की जन जन ऊचारे। कोटिक जन तेरे आये द्वारे॥
Jaya bābā kī jana jana ūchārē। Kōṭika jana tērē āyē dvārē॥
(Victory to Baba everyone proclaims, millions have come to your door) [20]

बाल समय रवि भक्षहि लीन्हा। तिमिर मय जग कीन्हो तीन्हा॥
Bāla samaya ravi bhakṣahi līnhā। Timira maya jaga kīnhō tīnhā॥
(In childhood swallowed the sun, made the world full of darkness)

देवन विनती की अति भारी। छाँड़ दियो रवि कष्ट निहारी॥
Dēvana vinatī kī ati bhārī। Chhāṁṛa diyō ravi kaṣṭa nihārī॥
(Gods made great entreaty, released the sun seeing their distress)

लांघि उदधि सिया सुधि लाये। लक्ष्मन हित संजीवन लाये॥
Lāṅghi udadhi siyā sudhi lāyē। Lakṣmana hita sañjīvana lāyē॥
(Leapt across ocean brought news of Sita, for Lakshman brought Sanjeevani)

रामानुज प्राण दिवाकर। शंकर सुवन माँ अंजनी चाकर॥
Rāmānuja prāṇa divākara। Śaṅkara suvana māṁ añjanī chākara॥
(Life-breath of Ram's brother, son of Shankar, servant of mother Anjani)

केशरी नन्दन दुख भव भंजन। रामानन्द सदा सुख सन्दन॥
Kēśarī nandana dukha bhava bhañjana। Rāmānanda sadā sukha sandana॥
(Son of Kesari, destroyer of worldly sorrows, always bestower of bliss of Ram)

सिया राम के प्राण पियारे। जब बाबा की भक्त ऊचारे॥
Siyā rāma kē prāṇa piyārē। Jaba bābā kī bhakta ūchārē॥
(Beloved life of Sita-Ram, when devotees proclaim Baba's name)

संकट दुख भंजन भगवाना। दया करहु हे कृपा निधाना॥
Saṅkaṭa dukha bhañjana bhagavānā। Dayā karahu hē kṛpā nidhānā॥
(Destroyer of troubles and sorrows O Lord, show mercy O treasure of compassion)

सुमर बाल रूप कल्याणा। करे मनोरथ पूर्ण कामा॥
Sumara bāla rūpa kalyāṇā। Karē manōratha pūrṇa kāmā॥
(Remembering the auspicious child form, fulfills all heart's desires)

अष्ट सिद्धि नव निधि दातारी। भक्त जन आवे बहु भारी॥
Aṣṭa siddhi nava nidhi dātārī। Bhakta jana āvē bahu bhārī॥
(Giver of eight siddhis and nine treasures, countless devotees come)

मेवा अरु मिष्ठान प्रवीना। भैंट चढ़ावें धनि अरु दीना॥
Mēvā aru miṣṭhāna pravīnā। Bhaiṁṭa chaṛhāvēṁ dhani aru dīnā॥
(Dry fruits and sweets skillfully, rich and poor offer gifts) [30]

नृत्य करे नित न्यारे न्यारे। रिद्धि सिद्धियां जाके द्वारे॥
Nṛtya karē nita nyārē nyārē। Riddhi siddhiyāṁ jākē dvārē॥
(Daily perform unique dances, riches and powers at whose door)

अर्जी का आदेश मिलते ही। भैरव भूत पकड़ते तबही॥
Arjī kā ādēśa milatē hī। Bhairava bhūta pakaṛatē tabahī॥
(As soon as petition is ordered, Bhairav catches the ghosts immediately)

कोतवाल कप्तान कृपाणी। प्रेतराज संकट कल्याणी॥
Kōtavāla kaptāna kṛpāṇī। Prētarāja saṅkaṭa kalyāṇī॥
(Kotwal Captain with sword, Pretraj auspicious remover of troubles)

चौकी बन्धन कटते भाई। जो जन करते हैं सेवकाई॥
Chaukī bandhana kaṭatē bhāī। Jō jana karatē haiṁ sēvakāī॥
(Restrictions and bindings are cut brother, for those who do service)

रामदास बाल भगवन्ता। मैंहदीपुर प्रगटे हनुमन्ता॥
Rāmadāsa bāla bhagavantā। Maīṁhadīpura pragaṭē hanumantā॥
(Child form of Ram's servant Lord, in Mehandipur manifested Hanuman)

जो जन बालाजी में आते। जन्म जन्म के पाप नशाते॥
Jō jana bālājī mēṁ ātē। Janma janma kē pāpa naśātē॥
(Those who come to Balaji, sins of many births are destroyed)

जल पावन लेकर घर जाते। निर्मल हो आनन्द मनाते॥
Jala pāvana lēkara ghara jātē। Nirmala hō ānanda manātē॥
(Taking sacred water home, become pure and celebrate with joy)

क्रूर कठिन संकट भग जावे। सत्य धर्म पथ राह दिखावे॥
Krūra kaṭhina saṅkaṭa bhaga jāvē। Satya dharma patha rāha dikhāvē॥
(Cruel difficult troubles flee, shows the path of truth and righteousness)

जो सत पाठ करे चालीसा। तापर प्रसन्न होय बागीसा॥
Jō sata pāṭha karē chālīsā। Tāpara prasanna hōya bāgīsā॥
(One who recites this Chalisa seven times, Lord of monkeys becomes pleased)

कल्याण स्नेही, स्नेह से गावे। सुख समृद्धि रिद्धि सिद्धि पावे॥
Kalyāṇa snēhī, snēha sē gāvē। Sukha samṛddhi riddhi siddhi pāvē॥
(Kalyan Snehi sings with love, attains happiness, prosperity, riches and powers) [40]

दोहा:
मन्द बुद्धि मम जानके, क्षमा करो गुणखान।
संकट मोचन क्षमहु मम, दास स्नेही कल्याण॥

Manda buddhi mama jānakē, kṣamā karō guṇakhāna।
Saṅkaṭa mōchana kṣamahu mama, dāsa snēhī kalyāṇa॥

(Knowing my dull intellect, forgive me O treasure of virtues. O remover of troubles, forgive me, servant Snehi Kalyan)`,
  description: 'Mehandipur Balaji Chalisa - 40 verses dedicated to Lord Hanuman who manifested at Mehandipur Balaji Temple in Rajasthan. This powerful Chalisa is especially known for removing negative energies, evil spirits (bhoot-pret), black magic, and severe troubles. The temple has three deities: Balaji (Hanuman), Pretraj (King of spirits), and Bhairav (Kotwal/Guardian). Composed by Das Snehi Kalyan. Reciting removes sins of many births and grants protection from all supernatural and worldly problems.'
};

async function addMehandipurBalaji() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const newChalisa = new Devotional(mehandipur);
    await newChalisa.save();
    console.log(`✓ Added: ${mehandipur.title}`);

    console.log('\n✓ Mehandipur Balaji Chalisa added successfully!');
    console.log('\nDetails:');
    console.log('- Category: Chalisa');
    console.log('- Deity: Hanuman (Balaji)');
    console.log('- Language: Hindi with English transliteration and translation');
    console.log('- Composed by: Das Snehi Kalyan');
    console.log('- Sacred Place: Mehandipur Balaji Temple, Rajasthan');
    console.log('- Three Deities: Balaji (Hanuman), Pretraj, Bhairav Kotwal');
    console.log('\nSpecial Powers:');
    console.log('- Removes black magic and evil spirits');
    console.log('- Destroys negative energies (bhoot-pret-shakini-dakini)');
    console.log('- Breaks all supernatural bindings');
    console.log('- Removes sins of many births');
    console.log('- Cures mental and physical afflictions');
    console.log('- Grants protection from all troubles');
    console.log('\nHow to Recite:');
    console.log('- Recite 7 times (sat path) for full effect');
    console.log('- Offer laddus, churma, sugar candy, dry fruits');
    console.log('- Take sacred water (jal) home for purification');
    console.log('- Best for those suffering from supernatural troubles');
    console.log('\nNote: This is the most powerful Hanuman Chalisa for');
    console.log('removing supernatural problems and black magic effects.');

    // Verify total count
    const allChalisas = await Devotional.find({ category: 'Chalisa' });
    const hanumanChalisas = await Devotional.find({ category: 'Chalisa', deity: 'Hanuman' });
    console.log(`\nTotal Chalisas in database: ${allChalisas.length}`);
    console.log(`Hanuman Chalisas: ${hanumanChalisas.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error adding Mehandipur Balaji Chalisa:', error);
    process.exit(1);
  }
}

addMehandipurBalaji();
