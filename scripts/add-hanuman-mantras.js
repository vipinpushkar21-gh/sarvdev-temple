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

const hanumanMantras = [
  {
    title: 'Hanuman Mantra - 1 (Om Hanumate Namah)',
    description: 'Simple and powerful mantra for Lord Hanuman. This is the most basic salutation to Hanuman, invoking his blessings and protection.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Hanuman',
    lyrics: `Sanskrit:
ॐ हनुमते नमः |

Transliteration:
Om Hanumate Namah |

Translation:
Salutations to Lord Hanuman`,
    status: 'approved'
  },
  {
    title: 'Hanuman Mantra - 2 (Pawan Nandana)',
    description: 'Mantra addressing Hanuman as the son of Vayu (Wind God). Chanting this mantra invokes the blessings of Hanuman for strength and courage.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Hanuman',
    lyrics: `Sanskrit:
हं पवन नन्दनाय स्वाहा |

Transliteration:
Hang Pawan Nandanaay Swaahaa |

Translation:
Offering to the son of Vayu (Wind God)`,
    status: 'approved'
  },
  {
    title: 'Hanuman Mantra - 3 (Rudratmaka)',
    description: 'Powerful beej mantra invoking Hanuman as the manifestation of Lord Rudra (Shiva). This mantra is chanted for protection and removing obstacles.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Hanuman',
    lyrics: `Sanskrit:
हं हनुमते रुद्रात्मकाय हुं फट् |

Transliteration:
Hang Hanumate Rudraatmakaay Hung Phatt |

Translation:
Salutations to Hanuman, the embodiment of Rudra`,
    status: 'approved'
  },
  {
    title: 'Hanuman Mantra - 4 (Aanjaneyaay Mahaabalaay)',
    description: 'Mantra praising Hanuman as Anjaneya (son of Anjani) and the one with immense strength. Chanting this gives physical and mental strength.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Hanuman',
    lyrics: `Sanskrit:
ॐ नमो भगवते आंजनेयाय महाबलाय स्वाहा |

Transliteration:
Om Namo Bhagvate Aanjaneyaay Mahaabalaay Swaahaa |

Translation:
Salutations to Lord Anjaneya, the one with supreme strength`,
    status: 'approved'
  },
  {
    title: 'Hanuman Mantra - 5 (Maha Mantra)',
    description: 'The most powerful and complete Hanuman mantra. This mantra invokes Hanuman as the messenger of Lord Rama, destroyer of Lanka, and protector against all evil forces.',
    category: 'Mantra',
    language: 'Sanskrit',
    deity: 'Hanuman',
    lyrics: `Sanskrit:
ॐ ऐं ह्रीं हनुमते रामदूताय लंकाविध्वंसनाय अंजनी गर्भ संभूताय शाकिनी डाकिनी विध्वंसनाय किलिकिलि बुबुकारेण विभीषणाय हनुमद्देवाय ॐ ह्रीं श्रीं हौं फट् स्वाहा ||

Transliteration:
Om Aing Hring Hanumate Raamdootaay Lankavidhvansanaay Anjani Garbha Sambhootaay Shakini Dakini Vidhvansanaay Kilikili Bubukaren Vibheeshanaay Hanumadd evaay Om Hring Shring Haung Phat Swaahaa ||

Translation:
Salutations to Hanuman, the messenger of Rama, destroyer of Lanka, born from the womb of Anjani, destroyer of Shakini and Dakini (evil forces), terrifying to demons, the divine Hanuman - offering oblations with sacred seed syllables`,
    status: 'approved'
  }
];

async function addHanumanMantras() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    console.log('\n--- Adding Hanuman Mantras ---\n');

    for (const mantra of hanumanMantras) {
      const newMantra = new Devotional(mantra);
      await newMantra.save();
      console.log(`✓ Added: ${mantra.title}`);
    }

    console.log('\n✓ All 5 Hanuman Mantras added successfully!');
    console.log(`Total mantras added: ${hanumanMantras.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addHanumanMantras();
