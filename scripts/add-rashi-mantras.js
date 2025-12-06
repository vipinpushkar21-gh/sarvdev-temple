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

const rashiMantras = [
  // Mesh (Aries) - 2 mantras
  {
    title: 'Mesh Rashi Beej Mantra 1 (Aries)',
    description: 'Beej mantra for Mesh (Aries) zodiac sign. Chant this mantra to strengthen favorable planetary influences and enhance positive traits of Aries sign.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ऐं क्लीं सौः |

Transliteration:
Om Aing Kleeng Sauh |

Translation:
Sacred seed syllables for Aries (Mesh) Rashi to invoke blessings and balance zodiac energies.`,
    status: 'approved'
  },
  {
    title: 'Mesh Rashi Beej Mantra 2 (Aries)',
    description: 'Vishnu mantra for Mesh (Aries) Rashi. Invokes Lord Lakshmi-Narayana for prosperity and protection for those born under Aries sign.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ह्रीं श्रीं लक्ष्मीनारायणाभ्यां नमः ||

Transliteration:
Om Hreeng Shreeng Lakshmi-Narayanabhyam Namah ||

Translation:
Salutations to Lakshmi and Narayana (Vishnu), invoking their divine blessings for Aries natives.`,
    status: 'approved'
  },

  // Vrishabh (Taurus) - 2 mantras
  {
    title: 'Vrishabh Rashi Beej Mantra 1 (Taurus)',
    description: 'Beej mantra for Vrishabh (Taurus) zodiac sign. Chanting this brings stability, prosperity and material comforts for Taurus natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Krishna',
    lyrics: `Sanskrit:
ॐ ह्रीं क्लीं श्रीं |

Transliteration:
Om Hreeng Kleeng Shreeng |

Translation:
Sacred seed syllables for Taurus (Vrishabh) Rashi to invoke abundance and strength.`,
    status: 'approved'
  },
  {
    title: 'Vrishabh Rashi Beej Mantra 2 (Taurus)',
    description: 'Gopala mantra for Vrishabh (Taurus) Rashi. Invokes Lord Krishna as Gopala for love, devotion and divine protection.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Krishna',
    lyrics: `Sanskrit:
ॐ गोपालाय उत्तरध्वजाय नमः ||

Transliteration:
Om Gopalay Uttardhvajay Namah ||

Translation:
Salutations to Gopala (Krishna), the protector with the northern flag, for Taurus natives.`,
    status: 'approved'
  },

  // Mithun (Gemini) - 2 mantras
  {
    title: 'Mithun Rashi Beej Mantra 1 (Gemini)',
    description: 'Beej mantra for Mithun (Gemini) zodiac sign. Enhances communication skills, intellect and adaptability for Gemini natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Krishna',
    lyrics: `Sanskrit:
ॐ श्रीं ऐं सौः |

Transliteration:
Om Shreeng Aing Sauh |

Translation:
Sacred seed syllables for Gemini (Mithun) Rashi to enhance wisdom and communication.`,
    status: 'approved'
  },
  {
    title: 'Mithun Rashi Beej Mantra 2 (Gemini)',
    description: 'Krishna mantra for Mithun (Gemini) Rashi. Invokes Lord Krishna for knowledge, creativity and divine guidance.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Krishna',
    lyrics: `Sanskrit:
ॐ क्लीं कृष्णाय नमः ||

Transliteration:
Om Kleeng Krishnay Namah ||

Translation:
Salutations to Lord Krishna, invoking his blessings for Gemini natives.`,
    status: 'approved'
  },

  // Kark (Cancer) - 2 mantras
  {
    title: 'Kark Rashi Beej Mantra 1 (Cancer)',
    description: 'Beej mantra for Kark (Cancer) zodiac sign. Brings emotional balance, nurturing energy and intuition for Cancer natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ऐं क्लीं श्रीं |

Transliteration:
Om Aing Kleeng Shreeng |

Translation:
Sacred seed syllables for Cancer (Kark) Rashi to invoke emotional strength and protection.`,
    status: 'approved'
  },
  {
    title: 'Kark Rashi Beej Mantra 2 (Cancer)',
    description: 'Hiranyagarbha mantra for Kark (Cancer) Rashi. Invokes the cosmic womb for creation, nurturing and spiritual growth.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ हिरण्यगर्भाय अव्यक्तरूपिणे नमः ||

Transliteration:
Om Hiranyagarbhay Avyaktroopine Namah ||

Translation:
Salutations to Hiranyagarbha (the golden womb), the unmanifest form, for Cancer natives.`,
    status: 'approved'
  },

  // Singh (Leo) - 2 mantras
  {
    title: 'Singh Rashi Beej Mantra 1 (Leo)',
    description: 'Beej mantra for Singh (Leo) zodiac sign. Enhances leadership, confidence and royal qualities for Leo natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ह्रीं श्रीं सौः |

Transliteration:
Om Hreeng Shreeng Sauh |

Translation:
Sacred seed syllables for Leo (Singh) Rashi to invoke power and brilliance.`,
    status: 'approved'
  },
  {
    title: 'Singh Rashi Beej Mantra 2 (Leo)',
    description: 'Brahma mantra for Singh (Leo) Rashi. Invokes Lord Brahma as the support of the universe for creative power and authority.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Brahma',
    lyrics: `Sanskrit:
ॐ क्लीं ब्रह्मणे जगदाधाराय नमः ||

Transliteration:
Om Kleeng Brahmane Jagadadharay Namah ||

Translation:
Salutations to Lord Brahma, the support of the universe, for Leo natives.`,
    status: 'approved'
  },

  // Kanya (Virgo) - 2 mantras
  {
    title: 'Kanya Rashi Beej Mantra 1 (Virgo)',
    description: 'Beej mantra for Kanya (Virgo) zodiac sign. Enhances analytical skills, perfection and service orientation for Virgo natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ श्रीं ऐं सौः |

Transliteration:
Om Shreeng Aing Sauh |

Translation:
Sacred seed syllables for Virgo (Kanya) Rashi to invoke purity and precision.`,
    status: 'approved'
  },
  {
    title: 'Kanya Rashi Beej Mantra 2 (Virgo)',
    description: 'Pitambara mantra for Kanya (Virgo) Rashi. Invokes Lord Vishnu in yellow garments for wisdom and prosperity.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ पीं पीताम्बराय नमः ||

Transliteration:
Om Peeng Pitambray Namah ||

Translation:
Salutations to Pitambara (Vishnu in yellow garments), for Virgo natives.`,
    status: 'approved'
  },

  // Tula (Libra) - 2 mantras
  {
    title: 'Tula Rashi Beej Mantra 1 (Libra)',
    description: 'Beej mantra for Tula (Libra) zodiac sign. Brings balance, harmony and justice for Libra natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ह्रीं क्लीं श्रीं |

Transliteration:
Om Hreeng Kleeng Shreeng |

Translation:
Sacred seed syllables for Libra (Tula) Rashi to invoke equilibrium and beauty.`,
    status: 'approved'
  },
  {
    title: 'Tula Rashi Beej Mantra 2 (Libra)',
    description: 'Tattvaniranjana mantra for Tula (Libra) Rashi. Invokes the pure essence of truth and reality for spiritual clarity.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ तत्त्वनिरञ्जनाय नमः ||

Transliteration:
Om Tattvaniranjnay Namah ||

Translation:
Salutations to the unstained essence of truth, for Libra natives.`,
    status: 'approved'
  },

  // Vrishchik (Scorpio) - 2 mantras
  {
    title: 'Vrishchik Rashi Beej Mantra 1 (Scorpio)',
    description: 'Beej mantra for Vrishchik (Scorpio) zodiac sign. Enhances intensity, transformation and hidden power for Scorpio natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ऐं क्लीं सौः |

Transliteration:
Om Aing Kleeng Sauh |

Translation:
Sacred seed syllables for Scorpio (Vrishchik) Rashi to invoke transformative energy.`,
    status: 'approved'
  },
  {
    title: 'Vrishchik Rashi Beej Mantra 2 (Scorpio)',
    description: 'Narayana mantra for Vrishchik (Scorpio) Rashi. Invokes Lord Narayana as the lion among gods for courage and strength.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ नारायणाय सुरसिंहाय नमः ||

Transliteration:
Om Narayanay Sursinhay Namah ||

Translation:
Salutations to Narayana (Vishnu), the lion among deities, for Scorpio natives.`,
    status: 'approved'
  },

  // Dhanu (Sagittarius) - 2 mantras
  {
    title: 'Dhanu Rashi Beej Mantra 1 (Sagittarius)',
    description: 'Beej mantra for Dhanu (Sagittarius) zodiac sign. Enhances wisdom, adventure and philosophical nature for Sagittarius natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Krishna',
    lyrics: `Sanskrit:
ॐ ह्रीं क्लीं सौः |

Transliteration:
Om Hreeng Kleeng Sauh |

Translation:
Sacred seed syllables for Sagittarius (Dhanu) Rashi to invoke knowledge and expansion.`,
    status: 'approved'
  },
  {
    title: 'Dhanu Rashi Beej Mantra 2 (Sagittarius)',
    description: 'Devakrishna mantra for Dhanu (Sagittarius) Rashi. Invokes Lord Krishna with upward-pointing teeth for higher wisdom.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Krishna',
    lyrics: `Sanskrit:
ॐ श्रीं देवकृष्णाय ऊर्ध्वदन्ताय नमः ||

Transliteration:
Om Shreeng Devakrishnay Oordhwadantay Namah ||

Translation:
Salutations to Devakrishna with upward teeth, for Sagittarius natives.`,
    status: 'approved'
  },

  // Makar (Capricorn) - 2 mantras
  {
    title: 'Makar Rashi Beej Mantra 1 (Capricorn)',
    description: 'Beej mantra for Makar (Capricorn) zodiac sign. Enhances discipline, ambition and practical wisdom for Capricorn natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ऐं क्लीं ह्रीं श्रीं सौः |

Transliteration:
Om Aing Kleeng Hreeng Shreeng Sauh |

Translation:
Sacred seed syllables for Capricorn (Makar) Rashi to invoke determination and success.`,
    status: 'approved'
  },
  {
    title: 'Makar Rashi Beej Mantra 2 (Capricorn)',
    description: 'Vatsala mantra for Makar (Capricorn) Rashi. Invokes the loving and protective form of Lord Vishnu.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ श्रीं वत्सलाय नमः ||

Transliteration:
Om Shreeng Vatsalay Namah ||

Translation:
Salutations to Vatsala (the loving protector), for Capricorn natives.`,
    status: 'approved'
  },

  // Kumbha (Aquarius) - 2 mantras
  {
    title: 'Kumbha Rashi Beej Mantra 1 (Aquarius)',
    description: 'Beej mantra for Kumbha (Aquarius) zodiac sign. Enhances innovation, humanitarian spirit and independence for Aquarius natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ह्रीं ऐं क्लीं श्रीं |

Transliteration:
Om Hreeng Aing Kleeng Shreeng |

Translation:
Sacred seed syllables for Aquarius (Kumbha) Rashi to invoke progressive energy.`,
    status: 'approved'
  },
  {
    title: 'Kumbha Rashi Beej Mantra 2 (Aquarius)',
    description: 'Upendra mantra for Kumbha (Aquarius) Rashi. Invokes Lord Upendra (Vamana avatar) for infallible blessings.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ श्रीं उपेन्द्राय अच्युताय नमः ||

Transliteration:
Om Shreeng Upendray Achyutay Namah ||

Translation:
Salutations to Upendra (Vamana) the infallible one, for Aquarius natives.`,
    status: 'approved'
  },

  // Meen (Pisces) - 2 mantras
  {
    title: 'Meen Rashi Beej Mantra 1 (Pisces)',
    description: 'Beej mantra for Meen (Pisces) zodiac sign. Enhances intuition, compassion and spiritual sensitivity for Pisces natives.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ ह्रीं क्लीं सौः |

Transliteration:
Om Hreeng Kleeng Sauh |

Translation:
Sacred seed syllables for Pisces (Meen) Rashi to invoke mystical wisdom.`,
    status: 'approved'
  },
  {
    title: 'Meen Rashi Beej Mantra 2 (Pisces)',
    description: 'Uddhrita mantra for Meen (Pisces) Rashi. Invokes Lord Vishnu as the uplifter and savior.',
    category: 'Rashi',
    language: 'Sanskrit',
    deity: 'Vishnu',
    lyrics: `Sanskrit:
ॐ आं क्लीं उद्धृताय नमः ||

Transliteration:
Om Aang Kleeng Uddhritay Namah ||

Translation:
Salutations to Uddhrita (the uplifter), for Pisces natives.`,
    status: 'approved'
  }
];

async function addRashiMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding Rashi Mantras ---\n');

    for (const mantra of rashiMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 24 Rashi Mantras added successfully!');
    console.log(`Total mantras added: ${rashiMantras.length}`);
    console.log('\nRashi Signs covered:');
    console.log('- Mesh (Aries) - 2 mantras');
    console.log('- Vrishabh (Taurus) - 2 mantras');
    console.log('- Mithun (Gemini) - 2 mantras');
    console.log('- Kark (Cancer) - 2 mantras');
    console.log('- Singh (Leo) - 2 mantras');
    console.log('- Kanya (Virgo) - 2 mantras');
    console.log('- Tula (Libra) - 2 mantras');
    console.log('- Vrishchik (Scorpio) - 2 mantras');
    console.log('- Dhanu (Sagittarius) - 2 mantras');
    console.log('- Makar (Capricorn) - 2 mantras');
    console.log('- Kumbha (Aquarius) - 2 mantras');
    console.log('- Meen (Pisces) - 2 mantras');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addRashiMantras();
