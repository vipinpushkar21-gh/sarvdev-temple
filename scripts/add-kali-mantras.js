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

const kaliMantras = [
  {
    title: 'Kali Beej Mantra',
    description: 'The most powerful and essential seed (beej) mantra of Goddess Kali. This short yet potent mantra invokes the fierce protective energy of Maa Kali. Chanting this mantra helps destroy negativity, remove obstacles, and grants spiritual power.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ क्रीं कालीं

Transliteration:
Om Kreem Kali

Translation:
Om, salutations to the dark Goddess Kali through her seed syllable Kreem.`,
    status: 'approved'
  },
  {
    title: 'Kali Mantra',
    description: 'Primary mantra for worshipping Goddess Kali. This mantra offers salutations to Kalikaye (another name of Kali) and is chanted for protection, courage, and removal of fear and negativity.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ क्रीं कालिकायै नमः

Transliteration:
Om Kreem Kalikayai Namah

Translation:
Om, I bow to Goddess Kalika (Kali) with the seed syllable Kreem.`,
    status: 'approved'
  },
  {
    title: 'Maha Kali Mantra',
    description: 'Mantra to invoke the great (Maha) form of Goddess Kali. This powerful mantra is chanted to seek blessings of the supreme Mother Kali for protection from evil forces and spiritual liberation.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ श्री महाकालिकायै नमः

Transliteration:
Om Shri Mahakalikayai Namah

Translation:
Om, salutations to the great Goddess Kalika (Maha Kali).`,
    status: 'approved'
  },
  {
    title: 'Kalika-Yei Mantra',
    description: 'Ancient mantra combining the seed syllable "Kleem" with Kalika\'s name. This mantra attracts divine grace and destroys obstacles on the spiritual path.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ क्लीं कालिकायै नमः

Transliteration:
Om Kleem Kalikayai Namaha

Translation:
Om, I bow to Goddess Kalika with the seed syllable Kleem (syllable of attraction and power).`,
    status: 'approved'
  },
  {
    title: 'Fifteen Syllable Kali Mantra (Pancha-Dashi Mantra)',
    description: 'The sacred fifteen-syllable mantra of Goddess Kali, also known as Kali Pancha-Dashi. This is one of the most powerful mantras for invoking the supreme energy of Adya Kalika (Primordial Kali). Grants both material and spiritual blessings.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ ह्रीं श्रीं क्लीं आद्या कालिका परमेश्वरी स्वाहा

Transliteration:
Om Hreem Shreem Kleem Adya Kalika Parameshwari Swaha

Translation:
Om, to the primordial Goddess Kalika, the supreme divine Mother, I offer this oblation (Swaha).`,
    status: 'approved'
  },
  {
    title: 'Kali Mantra for Worship (Dakshina Kali)',
    description: 'Powerful tantric mantra for worship of Dakshina Kali (Kali facing south). This mantra combines multiple seed syllables and is chanted during tantric worship and rituals for protection and spiritual powers.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
क्रीं क्रीं क्रीं हीं क्रीं दक्षिणे कालिके क्रीं क्रीं क्रीं ह्रीं ह्रीं हुं हुं स्वाहा

Transliteration:
Kreem Kreem Kreem Heem Kreem Dakshine Kalike Kreem Kreem Kreem Hreem Hreem Hum Hum Swaha

Translation:
With the seed syllables Kreem, Heem, Hreem and Hum, salutations to Dakshina Kali (the southern-facing form of Kali).`,
    status: 'approved'
  },
  {
    title: 'Kali Gayatri Mantra',
    description: 'Gayatri mantra dedicated to Goddess Kali. This mantra follows the traditional Gayatri structure and meditates on Maha Kali who dwells in the cremation grounds, seeking her divine guidance and illumination.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ महाकाल्यै च विद्महे श्मशानवासिन्यै च धीमहि तन्नो काली प्रचोदयात्

Transliteration:
Om Mahakalyai Cha Vidmahe Smashanvasinyai Cha Dhimahi Tanno Kali Prachodayat

Translation:
Om, we meditate on the Great Kali, we contemplate the dweller of cremation grounds. May Goddess Kali inspire and guide our intellect.`,
    status: 'approved'
  },
  {
    title: 'Dakshina Kali Dhyan Mantra (Karpuradi Stotram)',
    description: 'Meditation mantra (Dhyan Mantra) for visualizing Dakshina Kali from the famous Karpuradi Stotram. This mantra describes the fearsome yet compassionate form of Kali with four arms, wearing a garland of skulls, holding sword and severed head, giving blessings and fearlessness.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ कराळवदनां घोरां मुक्तकेशीं चतुर्भुजाम् ।
कालिकां दक्षिणां दिव्यां मुण्डमालाविभूषिताम् ॥
सद्यश्छिन्नशिरःखड्गवामदोर्द्धकराम्बुजाम् ।
अभयं वरदां चैव दक्षिणादोर्द्धपाणिकाम् ॥

Transliteration:
Om Karalavadanam Ghoram Muktakeshim Chaturbhujam
Kalikam Dakshinam Divyam Mundamalavihhushitam
Sadyachchhinnashirahkhadgavamdordhakarambujam
Abhayam Varadam Chaiva Dakshinadordhapanikam

Translation:
Om, (I meditate upon) She who has a fearsome face with tongue protruding, disheveled hair, four arms, the divine Dakshina Kalika adorned with a garland of skulls. In Her left hands She holds a freshly severed head and a sword, and in Her right hands She grants fearlessness and boons.`,
    status: 'approved'
  },
  {
    title: 'Maha Kali Dhyan Mantra',
    description: 'Detailed meditation mantra describing the fierce form of Maha Kali holding ten weapons in her ten hands, with dark complexion like blue stone, who was praised by Lord Shiva, Vishnu and Brahma when she destroyed the demons Madhu and Kaitabha.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ खड्गं चक्रगदेषुचापपरिघान् शूलं भुशुण्डीं शिरः
शङ्खं सन्दधतीं करैस्त्रिनयनां सर्वाङ्गभूषावृताम् ।
नीलाश्मद्युतिमास्यपाददशकां सेवे महाकालिकां
यामस्तौच्छैत्र हरौ कमलजो हन्तुं मधुं कैटभम् ॥

Transliteration:
Om Khadgam Chakra-Gadeshu-Chapa-Parighan Shulam Bhushundim Shirah
Shankhang Sandadhatim Karaistri-Nayanam Sarvanga-Bhushavritam
Nilashma-Dyutim-Asya-Pada-Dashakam Seve Mahakalikam
Yam-Astou-Chchhaitra Harou Kamalajo Hantum Madhum Kaitabham

Translation:
Om, I worship Maha Kali who holds in her ten hands - sword, discus, mace, arrow, bow, iron club, trident, shield, severed head and conch shell; who has three eyes and is adorned with ornaments all over her body; whose complexion shines like blue stone; whom Lord Shiva, Vishnu (Kamalaja/lotus-born) praised when she destroyed the demons Madhu and Kaitabha.`,
    status: 'approved'
  },
  {
    title: 'Kali Devotional Chant',
    description: 'Popular devotional chant expressing love and surrender to Mother Kali. This simple yet powerful chant creates a joyful connection with Maa Kali and is often sung in bhajan style. Brings peace, bliss (Ananda) and divine protection.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Kali',
    lyrics: `Sanskrit:
ॐ काली काली ॐ काली काली
नमोस्तुते नमोस्तुते नमः
नमोस्तुते नमोस्तुते नमः

आनन्द मा आनन्द मा काली
आनन्द मा आनन्द मा काली
आनन्द मा आनन्द मा काली
ॐ काली मा

Transliteration:
Om Kali Kali Om Kali Kali
Namostute Namostute Namah
Namostute Namostute Namah

Ananda Ma Ananda Ma Kali
Ananda Ma Ananda Ma Kali
Ananda Ma Ananda Ma Kali
Om Kali Ma

Translation:
Om Kali, Kali! Om Kali, Kali! Salutations to you, salutations to you, salutations! (repeat)
Blissful Mother, Blissful Mother Kali (repeat thrice) - Om Mother Kali!`,
    status: 'approved'
  }
];

async function addKaliMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding Kali Mantras ---\n');

    for (const mantra of kaliMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 10 Kali Mantras added successfully!');
    console.log(`Total mantras added: ${kaliMantras.length}`);
    console.log('\nKali Mantras included:');
    console.log('1. Kali Beej Mantra - ॐ क्रीं कालीं');
    console.log('2. Kali Mantra - ॐ क्रीं कालिकायै नमः');
    console.log('3. Maha Kali Mantra - ॐ श्री महाकालिकायै नमः');
    console.log('4. Kalika-Yei Mantra - ॐ क्लीं कालिकायै नमः');
    console.log('5. Fifteen Syllable Kali Mantra (Pancha-Dashi)');
    console.log('6. Kali Worship Mantra (Dakshina Kali)');
    console.log('7. Kali Gayatri Mantra');
    console.log('8. Dakshina Kali Dhyan Mantra (Karpuradi Stotram)');
    console.log('9. Maha Kali Dhyan Mantra');
    console.log('10. Kali Devotional Chant');
    console.log('\nNote: Removed unrelated Krishna/Radha mantras from Kali Puja section');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addKaliMantras();
