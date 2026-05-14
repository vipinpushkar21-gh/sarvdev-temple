import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';
import Deity from '../models/Deity.js';

// Deity data from the deities page
const DEITY_CATEGORIES = [
  {
    id: 'tridev',
    categoryId: 'tridev',
    title: 'Tridev',
    titleHi: 'त्रिदेव',
    subtitle: 'The Supreme Trinity — Creators, Preservers & Transformers of the Universe',
    subtitleHi: 'सृष्टि के संचालक — ब्रह्मा, विष्णु, महेश',
    emoji: '🕉️',
    deities: [
      {
        name: 'Brahma Ji',
        nameHi: 'ब्रह्मा जी',
        description: 'The Creator of the universe. Brahma Ji is the first god of the Hindu Trinity (Trimurti). He created all living beings and the cosmos. He is depicted with four heads facing four directions, symbolizing the four Vedas. He sits on a lotus that grows from the navel of Lord Vishnu.',
        descriptionHi: 'सृष्टि के रचयिता। ब्रह्मा जी हिन्दू त्रिमूर्ति के प्रथम देवता हैं। उन्होंने सभी जीवों और ब्रह्माण्ड की रचना की। उनके चार मुख चारों दिशाओं की ओर हैं जो चारों वेदों का प्रतीक हैं। वे भगवान विष्णु की नाभि से उत्पन्न कमल पर विराजमान हैं।',
        mantra: 'ॐ वेदात्मनाय विद्महे हिरण्यगर्भाय धीमहि तन्नो ब्रह्मा प्रचोदयात्',
        attributes: ['Creator', 'Four Vedas', 'Lotus', 'Swan (Hamsa)'],
        slug: 'brahma-ji',
        category: 'Tridev',
      },
      {
        name: 'Vishnu Ji',
        nameHi: 'विष्णु जी',
        description: 'The Preserver and protector of the universe. Vishnu Ji maintains the cosmic order (dharma) and takes avatars whenever evil threatens the world. He rests on the serpent Shesha in the cosmic ocean. He holds the Sudarshana Chakra, Shankha, Gada, and Padma.',
        descriptionHi: 'सृष्टि के पालनहार और रक्षक। विष्णु जी धर्म की रक्षा करते हैं और जब-जब अधर्म बढ़ता है, वे अवतार लेते हैं। वे क्षीरसागर में शेषनाग पर विराजमान हैं। उनके हाथों में सुदर्शन चक्र, शंख, गदा और पद्म हैं।',
        mantra: 'ॐ नमो भगवते वासुदेवाय',
        attributes: ['Preserver', 'Dashavatar', 'Sudarshana Chakra', 'Garuda'],
        slug: 'vishnu-ji',
        category: 'Tridev',
      },
      {
        name: 'Shiva Ji (Mahadev)',
        nameHi: 'शिव जी (महादेव)',
        description: 'The Destroyer and Transformer. Mahadev is the supreme being who destroys the universe at the end of each cycle to enable recreation. He is the lord of meditation, yoga, and arts. He resides on Mount Kailash with Mata Parvati. The Ganga flows from his matted hair.',
        descriptionHi: 'सृष्टि के संहारक और कल्याणकारी। महादेव प्रत्येक युग के अंत में सृष्टि का संहार करते हैं ताकि नई सृष्टि हो सके। वे ध्यान, योग और कलाओं के स्वामी हैं। वे माता पार्वती के साथ कैलाश पर्वत पर निवास करते हैं। गंगा उनकी जटाओं से बहती है।',
        mantra: 'ॐ नमः शिवाय',
        attributes: ['Destroyer', 'Trishul', 'Damru', 'Third Eye', 'Mount Kailash'],
        slug: 'shiva-ji-mahadev',
        category: 'Tridev',
      },
    ],
  },
  {
    id: 'tridevi',
    categoryId: 'tridevi',
    title: 'Tridevi',
    titleHi: 'त्रिदेवी',
    subtitle: 'The Divine Feminine Trinity — The Supreme Shakti Powers',
    subtitleHi: 'सृष्टि की शक्ति — तीन परम देवियाँ',
    emoji: '🙏',
    deities: [
      {
        name: 'Saraswati Ji',
        nameHi: 'सरस्वती जी',
        description: 'The goddess of knowledge, music, arts, wisdom, and learning. She is the consort of Brahma and is depicted playing the veena.',
        descriptionHi: 'ज्ञान, संगीत, कला, बुद्धि और शिक्षा की देवी। वे ब्रह्मा जी की पत्नी हैं और वीणा बजाते हुए दिखाई जाती हैं।',
        mantra: 'ॐ श्री सरस्वत्यै नमः',
        attributes: ['Knowledge', 'Music', 'Arts', 'Wisdom', 'Veena'],
        slug: 'saraswati-ji',
        category: 'Tridevi',
      },
      {
        name: 'Lakshmi Ji',
        nameHi: 'लक्ष्मी जी',
        description: 'The goddess of wealth, prosperity, fortune, and power. She is the consort of Vishnu and is depicted with lotus flowers and gold coins.',
        descriptionHi: 'धन, समृद्धि, सौभाग्य और शक्ति की देवी। वे विष्णु जी की पत्नी हैं और कमल के फूल और सोने के सिक्कों के साथ दिखाई जाती हैं।',
        mantra: 'ॐ श्री महालक्ष्म्यै नमः',
        attributes: ['Wealth', 'Prosperity', 'Fortune', 'Lotus', 'Gold'],
        slug: 'lakshmi-ji',
        category: 'Tridevi',
      },
      {
        name: 'Durga Ji',
        nameHi: 'दुर्गा जी',
        description: 'The goddess of war, strength, and protection. She is the fierce form of Parvati who battles evil forces and protects the righteous.',
        descriptionHi: 'युद्ध, शक्ति और रक्षा की देवी। वे पार्वती की भयावह रूप हैं जो दुष्ट शक्तियों से लड़ती हैं और धर्म की रक्षा करती हैं।',
        mantra: 'ॐ दुं दुर्गायै नमः',
        attributes: ['War', 'Strength', 'Protection', 'Lion', 'Weapons'],
        slug: 'durga-ji',
        category: 'Tridevi',
      },
    ],
  },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function seedDeities() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing deities
    await Deity.deleteMany({});
    console.log('Cleared existing deities');

    let totalDeities = 0;

    for (const category of DEITY_CATEGORIES) {
      for (const deity of category.deities) {
        const deitySlug = deity.slug || slugify(deity.name);
        
        const newDeity = await Deity.create({
          name: deity.name,
          nameHi: deity.nameHi,
          description: deity.description,
          descriptionHi: deity.descriptionHi,
          mantra: deity.mantra,
          attributes: deity.attributes,
          category: category.title,
          categoryId: category.categoryId,
          slug: deitySlug,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`Created deity: ${deity.name} (${deitySlug})`);
        totalDeities++;
      }
    }

    console.log(`\n✅ Successfully seeded ${totalDeities} deities`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding deities:', error);
    process.exit(1);
  }
}

seedDeities();
