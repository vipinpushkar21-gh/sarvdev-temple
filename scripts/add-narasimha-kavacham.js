const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  audio: { type: String },
  lyrics: { type: String },
  duration: { type: String },
  artist: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  createdAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const narasimhaKavacham = {
  title: 'Narasimha Kavacham',
  description: 'Sacred protective armor (Kavacham) of Lord Narasimha as recited by Prahlada. This powerful hymn grants protection from all dangers, diseases, evil forces, and planetary afflictions. Chanting this kavacham brings victory, prosperity, long life, and fulfillment of all desires. It is considered one of the most potent protective mantras in Vedic tradition.',
  category: 'Mantra',
  language: 'Sanskrit',
  deity: 'Narasimha',
  lyrics: `Sanskrit:
नरसिंहकवचं वक्ष्ये प्रह्लादेनोदितं पुरा ।
सर्वरक्षाकरं पुण्यं सर्वोपद्रवनाशनम् ॥

सर्वसम्पत्करं चैव स्वर्गमोक्षप्रदायकम् ।
ध्यात्वा नरसिंहं देवेशं हेमसिंहासनस्थितम् ॥

विवृतास्यं त्रिनयनं शरदिन्दुसमप्रभम् ।
लक्ष्म्यालिङ्गितवामाङ्गं विभूतिभिरुपाश्रितम् ॥

चतुर्भुजं कोमलाङ्गं स्वर्णकुण्डलशोभितम् ।
सरोजशोभितोरस्कं रत्नकेयूरमुद्रितम् ॥

तप्तकाञ्चनसङ्काशं पीतनिर्मलवाससम् ।
इन्द्रादिसुरमौलिस्थः स्फुरन्मणिक्यदीप्तिभिः ॥

विराजितपदद्वन्द्वं शङ्खचक्रादिहेतिभिः ।
गरुत्मता च विनयात् स्तुयमानं मुदान्वितम् ॥

स्वहृत्कमलसंवासं कृत्वा तु कवचं पठेत् ।
नृसिंहो मे शिरः पातु लोकरक्षार्थसम्भवः ॥

सर्वगोऽपि स्तम्भवासः फालं मे रक्षतु ध्वनिम् ।
नृसिंहो मे दृशौ पातु सोमसूर्याग्निलोचनः ॥

स्मृतं मे पातु नारहरिः मुनिवर्यस्तुतिप्रियः ।
नासां मे सिंहनासस्तु मुखं लक्ष्मीमुखप्रियः ॥

सर्वविद्याधिपः पातु नृसिंहो रसनां मम ।
वक्त्रं पात्विन्दुवदनं सदा प्रह्लादवन्दितः ॥

नरसिंहः पातु मे कण्ठं स्कन्धौ भूभृदनन्तकृत् ।
दिव्यास्त्रशोभितभुजः नरसिंहः पातु मे भुजौ ॥

करौ मे देववरदो नरसिंहः पातु सर्वतः ।
हृदयं योगिसाध्यश्च निवासं पातु मे हरिः ॥

मध्यं पातु हिरण्याक्षवक्षःकुक्षिविदारणः ।
नाभिं मे पातु नारहरिः स्वनाभिब्रह्मसंस्तुतः ॥

ब्रह्माण्डकोटयः कट्यां यस्यासौ पातु मे कटिम् ।
गुह्यं मे पातु गुह्यानां मन्त्राणां गुह्यरूपदृक् ॥

ऊरू मनोभवः पातु जानुनी नररूपदृक् ।
जङ्घे पातु धराभारहर्ता योऽसौ नृकेशरी ॥

सुरराज्यप्रदः पातु पादौ मे नृहरीश्वरः ।
सहस्रशीर्षपुरुषः पातु मे सर्वशस्तनुम् ॥

मनोग्रहः पूर्वतः पातु महावीराग्रजोऽग्नितः ।
महाविष्णुर्दक्षिणे तु महाज्वालस्तु नैर्ऋतः ॥

पश्चिमे पातु सर्वेशो दिशि मे सर्वतोमुखः ।
नरसिंहः पातु वायव्यं सौम्यं भूषणविग्रहः ॥

ईशान्यं पातु भद्रो मे सर्वमङ्गलदायकः ।
संसारभयतः पातु मृत्योर्मृत्युर्नृकेशरी ॥

इदं नरसिंहकवचं प्रह्लादमुखमण्डितम् ।
भक्तिमान्यः पठेनैत्यं सर्वपापैः प्रमुच्यते ॥

पुत्रवान्धनवान्लोके दीर्घायुरुपजायते ।
यं यं कामयते कामं तं तं प्राप्नोत्यसंशयम् ॥

सर्वत्र जयमाप्नोति सर्वत्र विजयी भवेत् ।
भूम्यन्तरिक्षदिव्यानां ग्रहाणां विनिवारणम् ॥

वृश्चिकोरगसम्भूतविषापहरणं परम् ।
ब्रह्मराक्षसयक्षाणां दूरोत्सारणकारणम् ॥

भुजे वा तालपत्रे वा कवचं लिखितं शुभम् ।
करमूले धृतं येन सिध्येयुः कर्मसिद्धयः ॥

देवासुरमनुष्येषु स्वं स्वं एव जयं लभेत् ।
एकसन्ध्यं त्रिसन्ध्यं वा यः पठेन्नियतो नरः ॥

सर्वमङ्गलमाङ्गल्यं भुक्तिं मुक्तिं च विन्दति ।
द्वात्रिंशत्सहस्राणि पठेत्शुद्धात्मनं नृणाम् ॥

कवचस्यास्य मन्त्रस्य मन्त्रसिद्धिः प्रजायते ।
अनेन मन्त्रराजेन कृत्वा भस्माभिर्मन्त्रणाम् ॥

तिलकं बिभ्रियाद्यस्तु तस्य ग्रहभयं हरेत् ।
त्रिवारं जपमानस्तु दत्तं वार्यभिमन्त्र्य च ॥

प्रसयेद्यो नरो मन्त्रं नरसिंहध्यानमाचरेत् ।
तस्य रोगाः प्रणश्यन्ति ये च स्युः कुक्षिसम्भवाः ॥

किमत्र बहुनोक्तेन नरसिंहसदृशो भवेत् ।
मनसा चिन्तितं यत्तु स तच्छाप्नोत्य संशयम् ॥

गर्जन्तं गर्जयन्तं निजभुजपटलं स्फोटयन्तं हतन्तं
दीप्यन्तं तापयन्तं दिवि भुवि दितिजं क्षेपयन्तं क्षिपन्तम् ।
क्रन्दन्तं रोषयन्तं दिशि दिशि सततं संहरन्तं भरन्तं
विक्षन्तं पूर्णयन्तं करनिकरशतैर्दिव्यसिंहं नमामि ॥

इति श्रीब्रह्माण्डपुराणे प्रह्लादोक्तं श्रीनरसिंहकवचं सम्पूर्णम् ॥

Transliteration:
narasimha-kavacham vakshye prahladenoditam pura
sarva-raksha-karam punyam sarvopadrava-nashanam

sarva-sampat-karam chaiva svarga-moksha-pradayakam
dhyatva narasimham devesham hema-simhasana-sthitam

vivrtasyam tri-nayanam sharad-indu-sama-prabham
lakshmyalingita-vamangam vibhutibhir upashritam

catur-bhujam komalangam svarna-kundala-shobhitam
saroja-shobitoraskam ratna-keyura-mudritam

tapta-kancana-sankasham pita-nirmala-vasasam
indradi-sura-maulishthah sphuran manikya-diptibhih

virajita-pada-dvandvam shankha-chakradi-hetibhih
garutmata cha vinayat stuyamanam mudanvitam

sva-hrt-kamala-samvasam krtva tu kavacham pathet
nrsimho me shirah patu loka-rakshartha-sambhavah

sarvago 'pi stambha-vasah phalam me rakshatu dhvanim
nrsimho me drshau patu soma-suryagni-lochanah

smrtam me patu naraharih muni-varya-stuti-priyah
nasam me simha-nashas tu mukham lakshmi-mukha-priyah

sarva-vidyadhipah patu nrsimho rasanam mama
vaktram patv indu-vadanam sada prahlada-vanditah

narasimhah patu me kantham skandhau bhu-bhrd ananta-krt
divyastra-shobhita-bhujah narasimhah patu me bhujau

karau me deva-varado narasimhah patu sarvatah
hrdayam yogi-sadhyash cha nivasam patu me harih

madhyam patu hiranyaksha-vakshah-kukshi-vidaranah
nabhim me patu naraharih sva-nabhi-brahma-samstutah

brahmanda-kotayah katyam yasyasau patu me katim
guhyam me patu guhyanam mantranam guhya-rupa-drk

uru manobhavah patu januni nara-rupa-drk
janghe patu dhara-bhara-harta yo 'sau nr-keshari

sura-rajya-pradah patu padau me nrharishvarah
sahasra-shirsha-purushah patu me sarvashas tanum

manograh purvatah patu maha-viragrajo 'gnitah
maha-vishnur dakshine tu maha-jvalas tu nairrtah

pashchime patu sarvesho dishi me sarvatomukhah
narasimhah patu vayavyam saumyam bhushana-vigrahah

ishanyam patu bhadro me sarva-mangala-dayakah
samsara-bhayatah patu mrtyor mrtyur nr-keshari

idam narasimha-kavacham prahlada-mukha-manditam
bhaktiman yah pathenaityam sarva-papaih pramucyate

putravan dhanavan loke dirghayur upajayate
yam yam kamayate kamam tam tam prapnoty asamshayam

sarvatra jayam apnoti sarvatra vijayi bhavet
bhumy antariksha-divyanam grahanam vinivaranam

vrshchikoraga-sambhuta-vishapaharanam param
brahma-rakshasa-yakshanam durotsarana-karanam

bhuje va tala-patre va kavacam likhitam shubham
kara-mule dhrtam yena sidhyeyuh karma-siddhayah

devasura-manushyeshu svam svam eva jayam labhet
eka-sandhyam tri-sandhyam va yah pathen niyato narah

sarva-mangala-mangalyam bhuktim muktim cha vindati
dva-trimshati-sahasrani pathet shuddhatmanam nrnam

kavachasyasya mantrasya mantra-siddhih prajayate
anena mantra-rajena krtva bhasmabhir mantranam

tilakam bibhriyad yas tu tasya graha-bhayam haret
tri-varam japamanas tu dattam varyabhimantrya ca

prasayed yo naro mantram narasimha-dhyanam acharet
tasya rogah pranashyanti ye cha syuh kukshi-sambhavah

kimatra bahunoktena narasimha sadrsho bhavet
manasa chintitam yattu sa tacchapnotya samshayam

garjantam garjayantam nija-bhuja-patalam sphotayantam hatantam
dipyantam tapayantam divi bhuvi ditijam kshepayantam kshipantam
krandantam roshayantam dishi dishi satatam samharantam bharantam
vikshantam purnayantam kara-nikara-shatair divya-simham namami

Iti shri-brahmanda-purane prahladoktam shri-narasimha-kavacham sampurnam

Translation:
I shall now recite the Narasimha Kavacham, which was spoken by Prahlada in ancient times. It is most auspicious, grants all protection, and destroys all calamities.

It bestows all wealth and prosperity, and grants heaven and liberation. Meditate upon Lord Narasimha, the Supreme Lord, seated on a golden throne.

With open mouth, three eyes, shining like the autumn moon, His left side embraced by Lakshmi, adorned with all divine powers.

Four-armed, with tender limbs, decorated with golden earrings, His chest adorned with lotus garlands, marked with gem-studded armlets.

Shining like molten gold, wearing spotless yellow garments, the crown jewels of Indra and other gods reflecting His effulgent ruby-like radiance.

His lotus feet beautified by divine weapons like conch and discus, being praised with devotion by Garuda, filled with bliss.

Having meditated thus on the Lord dwelling in the lotus of one's heart, one should recite this protective armor (Kavacham):

May Narasimha protect my head - He who appeared for the protection of the worlds.
May He who pervades everywhere yet resided in a pillar protect my forehead.
May Narasimha protect my eyes - He whose eyes are the moon, sun and fire.

May Narahari, who is pleased by the prayers of great sages, protect my memory.
May He with the lion's nose protect my nose, and He who is dear to Lakshmi's face protect my face.

May Narasimha, the master of all knowledge, protect my tongue.
May He with the moon-like face, always worshipped by Prahlada, protect my mouth.

May Narasimha protect my neck, may the infinite Lord protect my shoulders.
May Narasimha with arms adorned with divine weapons protect my arms.

May Narasimha, the bestower of boons to gods, protect my hands from all directions.
May Hari, attainable by yogis, protect my heart and dwelling place.

May He who tore open the chest and belly of Hiranyaksha protect my middle.
May Narahari, praised by Brahma from His own navel, protect my navel.

May He in whose waist rest millions of universes protect my waist.
May He who sees the secret form of secret mantras protect my private parts.

May Manobhava protect my thighs, may He of human form protect my knees.
May Nrikeshari, who removes the burden of the earth, protect my legs.

May Nriharishvara, the bestower of celestial kingdoms, protect my feet.
May the thousand-headed Supreme Person protect my entire body from all sides.

May the fierce one protect me from the east, may the great hero protect me from the southeast (fire).
May Maha-Vishnu protect me from the south, may the great flame protect me from the southwest.

May Sarvesa protect me from the west, may the all-faced one protect me in all directions.
May Narasimha protect me from the northwest, may the jewel-adorned one protect me from the north.

May the auspicious one protect me from the northeast, the bestower of all good fortune.
May Nrikeshari, death unto death itself, protect me from the fear of worldly existence.

This Narasimha Kavacham, adorned by Prahlada's words - whoever recites it with devotion is freed from all sins.

One becomes blessed with sons and wealth in this world, and attains long life.
Whatever desires one cherishes, those are fulfilled without doubt.

One attains victory everywhere and becomes victorious in all endeavors.
It removes the evil effects of planets in earth, atmosphere and heaven.

It is supreme in neutralizing poison from scorpions and serpents.
It causes the removal of Brahma-Rakshasas and Yakshas to far distances.

This auspicious Kavacham written on one's arm or palm leaf, and worn at the base of the hand, accomplishes all karmic perfections.

Among gods, demons and humans, one achieves victory in one's own sphere.
A disciplined person who recites this once or thrice daily (at dawn, noon, dusk):

Attains all auspiciousness of auspiciousness, and gains both material enjoyment and liberation.
If one recites this 32,000 times with a pure heart, mantra-siddhi (perfection in mantras) occurs.

With this king of mantras, having prepared sacred ash with mantras and wearing it as tilak, all planetary afflictions are removed.

One who recites this mantra three times, meditating on Narasimha while sprinkling consecrated water - all diseases, especially those originating in the stomach, are destroyed.

What more can be said? One becomes like Narasimha himself.
Whatever one contemplates in the mind is certainly obtained without doubt.

I bow to the divine Lion who roars and makes others roar, who strikes His own arms making them resound, who kills;
Who blazes and scorches, who hurls the demons across heaven and earth;
Who cries out and angers, who in all directions constantly destroys and protects;
Who sees and fulfills everything with hundreds of hands - to that divine Narasimha I offer my salutations!

Thus ends the Sri Narasimha Kavacham as spoken by Prahlada in the Brahmanda Purana.`,
  status: 'approved'
};

async function addNarasimhaKavacham() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding Narasimha Kavacham ---\n');

    const newDevotional = new Devotional(narasimhaKavacham);
    await newDevotional.save();
    
    console.log('✓ Added: Narasimha Kavacham');
    console.log('\nDetails:');
    console.log('- Category: Mantra');
    console.log('- Deity: Narasimha (Lion-Man avatar of Vishnu)');
    console.log('- Language: Sanskrit');
    console.log('- Type: Protective Armor (Kavacham)');
    console.log('- Source: Brahmanda Purana (spoken by Prahlada)');
    console.log('\nBenefits:');
    console.log('- Protection from all dangers and evil forces');
    console.log('- Victory in all endeavors');
    console.log('- Removal of diseases and planetary afflictions');
    console.log('- Fulfillment of all desires');
    console.log('- Material prosperity and spiritual liberation');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addNarasimhaKavacham();
