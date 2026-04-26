"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Deity Data ─── */

interface Deity {
  name: string
  nameHi: string
  description: string
  descriptionHi: string
  mantra?: string
  attributes?: string[]
}

interface DeityCategory {
  id: string
  title: string
  titleHi: string
  subtitle: string
  subtitleHi: string
  emoji: string
  deities: Deity[]
}

const DEITY_CATEGORIES: DeityCategory[] = [
  {
    id: 'tridev',
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
      },
      {
        name: 'Vishnu Ji',
        nameHi: 'विष्णु जी',
        description: 'The Preserver and protector of the universe. Vishnu Ji maintains the cosmic order (dharma) and takes avatars whenever evil threatens the world. He rests on the serpent Shesha in the cosmic ocean. He holds the Sudarshana Chakra, Shankha, Gada, and Padma.',
        descriptionHi: 'सृष्टि के पालनहार और रक्षक। विष्णु जी धर्म की रक्षा करते हैं और जब-जब अधर्म बढ़ता है, वे अवतार लेते हैं। वे क्षीरसागर में शेषनाग पर विराजमान हैं। उनके हाथों में सुदर्शन चक्र, शंख, गदा और पद्म हैं।',
        mantra: 'ॐ नमो भगवते वासुदेवाय',
        attributes: ['Preserver', 'Dashavatar', 'Sudarshana Chakra', 'Garuda'],
      },
      {
        name: 'Shiva Ji (Mahadev)',
        nameHi: 'शिव जी (महादेव)',
        description: 'The Destroyer and Transformer. Mahadev is the supreme being who destroys the universe at the end of each cycle to enable recreation. He is the lord of meditation, yoga, and arts. He resides on Mount Kailash with Mata Parvati. The Ganga flows from his matted hair.',
        descriptionHi: 'सृष्टि के संहारक और कल्याणकारी। महादेव प्रत्येक युग के अंत में सृष्टि का संहार करते हैं ताकि नई सृष्टि हो सके। वे ध्यान, योग और कलाओं के स्वामी हैं। वे माता पार्वती के साथ कैलाश पर्वत पर निवास करते हैं। गंगा उनकी जटाओं से बहती है।',
        mantra: 'ॐ नमः शिवाय',
        attributes: ['Destroyer', 'Trishul', 'Damru', 'Third Eye', 'Mount Kailash'],
      },
    ],
  },
  {
    id: 'tridevi',
    title: 'Tridevi',
    titleHi: 'त्रिदेवी',
    subtitle: 'The Divine Feminine Trinity — The Supreme Shakti Powers',
    subtitleHi: 'सृष्टि की शक्ति — तीन परम देवियाँ',
    emoji: '🙏',
    deities: [
      {
        name: 'Mata Saraswati',
        nameHi: 'माता सरस्वती',
        description: 'Goddess of knowledge, music, arts, and learning. She is the shakti (power) of Brahma Ji. She is depicted in white attire, seated on a white lotus, holding a veena, book, mala, and water pot. She is worshipped especially on Vasant Panchami.',
        descriptionHi: 'विद्या, संगीत, कला और ज्ञान की देवी। वे ब्रह्मा जी की शक्ति हैं। श्वेत वस्त्र धारण कर श्वेत कमल पर विराजमान, हाथों में वीणा, पुस्तक, माला और कमण्डल। वसंत पंचमी पर विशेष पूजा होती है।',
        mantra: 'ॐ ऐं सरस्वत्यै नमः',
        attributes: ['Knowledge', 'Veena', 'White Lotus', 'Swan'],
      },
      {
        name: 'Mata Lakshmi',
        nameHi: 'माता लक्ष्मी',
        description: 'Goddess of wealth, fortune, prosperity, and beauty. She is the shakti of Vishnu Ji. She emerged from the Samudra Manthan (churning of the ocean). She is depicted standing on a lotus with gold coins flowing from her hands. Worshipped on Diwali and every Friday.',
        descriptionHi: 'धन, वैभव, समृद्धि और सौन्दर्य की देवी। वे विष्णु जी की शक्ति हैं। समुद्र मंथन से उनका प्रकट्य हुआ। कमल पर खड़ी, हाथों से स्वर्ण मुद्राएँ बरसती हैं। दीपावली और प्रत्येक शुक्रवार को विशेष पूजा होती है।',
        mantra: 'ॐ श्रीं महालक्ष्म्यै नमः',
        attributes: ['Wealth', 'Prosperity', 'Lotus', 'Owl'],
      },
      {
        name: 'Mata Parvati (Gauri/Uma)',
        nameHi: 'माता पार्वती (गौरी/उमा)',
        description: 'Goddess of power, love, devotion, and fertility. She is the shakti of Shiva Ji and the daughter of Himavan (the Himalayas). She represents the divine feminine creative power (Adi Parashakti). She is the mother of Ganesh and Kartikeya.',
        descriptionHi: 'शक्ति, प्रेम, समर्पण और सौभाग्य की देवी। वे शिव जी की शक्ति और हिमवान (हिमालय) की पुत्री हैं। वे आदि पराशक्ति का स्वरूप हैं। गणेश और कार्तिकेय की माता हैं।',
        mantra: 'ॐ ह्रीं उमायै नमः',
        attributes: ['Shakti', 'Devotion', 'Fertility', 'Lion/Tiger'],
      },
    ],
  },
  {
    id: 'pramukh-devta',
    title: 'Pramukh Devta',
    titleHi: 'प्रमुख देवता',
    subtitle: 'Major Deities worshipped across the World',
    subtitleHi: 'सम्पूर्ण विश्व में पूजित प्रमुख देवता',
    emoji: '✨',
    deities: [
      {
        name: 'Ganesh Ji',
        nameHi: 'गणेश जी',
        description: 'The Vighnaharta (remover of obstacles) and the first deity to be worshipped before any auspicious occasion. Son of Shiva and Parvati. He has an elephant head and is the lord of wisdom, success, and new beginnings. His vahana is a mouse (Mushak).',
        descriptionHi: 'विघ्नहर्ता, प्रथम पूज्य। शिव-पार्वती के पुत्र। गजानन बुद्धि, सफलता और शुभ आरम्भ के देवता हैं। उनका वाहन मूषक है। किसी भी शुभ कार्य से पहले सबसे पहले गणेश जी की पूजा की जाती है।',
        mantra: 'ॐ गं गणपतये नमः',
        attributes: ['Vighnaharta', 'Wisdom', 'Pratham Poojya', 'Mushak'],
      },
      {
        name: 'Kartikeya Ji (Murugan/Skanda)',
        nameHi: 'कार्तिकेय जी (मुरुगन/स्कन्द)',
        description: 'The commander of the army of the gods (Devasena Pati). Son of Shiva and Parvati, and the brother of Ganesh. He defeated the demon Tarakasura. He is the god of war, victory, and wisdom. His vahana is a peacock (Paravani).',
        descriptionHi: 'देवताओं के सेनापति (देवसेनापति)। शिव-पार्वती के पुत्र और गणेश जी के भ्राता। उन्होंने तारकासुर का वध किया। युद्ध, विजय और शौर्य के देवता। उनका वाहन मयूर (परवानी) है।',
        mantra: 'ॐ शरवणभवाय नमः',
        attributes: ['Senapati', 'Vel (Spear)', 'Peacock', 'Victory'],
      },
      {
        name: 'Hanuman Ji',
        nameHi: 'हनुमान जी',
        description: 'The supreme devotee of Lord Rama and the embodiment of strength, devotion, and selfless service. Son of Vayu Dev and Anjani. He played a central role in the Ramayana, burning Lanka and carrying the Sanjeevani mountain. He is immortal (Chiranjeevi).',
        descriptionHi: 'भगवान राम के परम भक्त, बल, भक्ति और निःस्वार्थ सेवा के प्रतीक। वायुदेव और अंजनी के पुत्र। रामायण में उनकी केन्द्रीय भूमिका — लंका दहन और संजीवनी पर्वत लाना। वे चिरंजीवी हैं।',
        mantra: 'ॐ हनुमते नमः',
        attributes: ['Ram Bhakt', 'Chiranjeevi', 'Bal', 'Buddhi'],
      },
      {
        name: 'Dattatreya Ji',
        nameHi: 'दत्तात्रेय जी',
        description: 'The combined incarnation of Brahma, Vishnu, and Mahesh. Son of Rishi Atri and Anasuya. He is the Adi-Guru (first teacher) and is depicted with three heads representing the Trimurti, accompanied by four dogs and a cow.',
        descriptionHi: 'ब्रह्मा, विष्णु और महेश का समन्वित रूप। ऋषि अत्रि और अनसूया के पुत्र। वे आदि-गुरु हैं और तीन मुखों से त्रिमूर्ति का प्रतिनिधित्व करते हैं। चार श्वान और एक गाय उनके साथ हैं।',
        mantra: 'ॐ द्रां दत्तात्रेयाय नमः',
        attributes: ['Trimurti Swaroop', 'Adi-Guru', 'Three Heads', 'Cow'],
      },
      {
        name: 'Khatu Shyam Ji (Barbarik)',
        nameHi: 'खाटू श्याम जी (बर्बरीक)',
        description: 'The deity of Kalyug, known as "Hare ka Sahara" (support of the defeated). Grandson of Bhima and son of Ghatotkacha. He had the power to end the Mahabharata war in one minute with his three divine arrows. Lord Krishna took his head as a sacrifice before the war and granted him the boon of being worshipped by his name in Kalyug.',
        descriptionHi: 'कलयुग के अवतारी देवता, "हारे का सहारा"। भीम के पौत्र और घटोत्कच के पुत्र। तीन दिव्य बाणों से महाभारत युद्ध एक मिनट में समाप्त कर सकते थे। श्री कृष्ण ने युद्ध से पहले उनका शीश बलिदान लिया और कलयुग में उनके नाम से पूजे जाने का वरदान दिया।',
        mantra: 'ॐ श्री श्याम देवाय नमः',
        attributes: ['Hare ka Sahara', 'Barbarik', 'Three Arrows', 'Kalyug'],
      },
      {
        name: 'Shani Dev',
        nameHi: 'शनि देव',
        description: 'The god of justice and karma. Son of Surya Dev and Chhaya. He delivers results strictly based on one\'s deeds — rewarding the righteous and correcting the errant. His gaze is considered extremely powerful. Saturday (Shanivar) is dedicated to his worship. Shani Shingnapur and Shaneshwar temples are major pilgrimage sites.',
        descriptionHi: 'न्याय और कर्मफल के देवता। सूर्यदेव और छाया के पुत्र। कर्मों के अनुसार कड़ा फल देते हैं — सत्कर्मी को पुरस्कार, पापी को दण्ड। उनकी दृष्टि अत्यन्त प्रभावशाली मानी जाती है। शनिवार उनकी उपासना का दिन है। शनि शिंगणापुर और शनेश्वर मन्दिर प्रमुख तीर्थ हैं।',
        mantra: 'ॐ शं शनैश्चराय नमः',
        attributes: ['Karmafal Data', 'Nyayadhish', 'Saturday', 'Surya Putra'],
      },
      {
        name: 'Ayyappa Swami',
        nameHi: 'अय्यप्पा स्वामी',
        description: 'Born from the union of Lord Shiva and Mohini (the female form of Vishnu), also known as Hariharaputra. The presiding deity of Sabarimala temple in Kerala, one of the most visited pilgrimage sites in the world. Devotees observe 41 days of strict penance (Vratham) before the pilgrimage. He is the embodiment of dharma, truth, and celibacy.',
        descriptionHi: 'भगवान शिव और मोहिनी (विष्णु का स्त्री रूप) के पुत्र, हरिहरपुत्र। केरल के सबरीमाला मन्दिर के अधिष्ठाता देवता — विश्व के सबसे अधिक दर्शन किए जाने वाले तीर्थों में से एक। भक्त तीर्थयात्रा से पहले 41 दिन का कठोर व्रत करते हैं। धर्म, सत्य और ब्रह्मचर्य के प्रतीक।',
        mantra: 'स्वामिये शरणम् अय्यप्पा',
        attributes: ['Hariharaputra', 'Sabarimala', '41-Day Vratham', 'Dharma Sastha'],
      },
      {
        name: 'Balram Ji',
        nameHi: 'बलराम जी',
        description: 'The elder brother of Lord Krishna and the incarnation of Shesha Naga (Ananta). He is the god of agriculture and immense strength. His weapons are the plough (Hala) and mace (Musala). He taught both Duryodhana and Bhima the art of mace fighting. He is also known as Dauji, Haldhar, and Sankarshana.',
        descriptionHi: 'श्री कृष्ण के बड़े भ्राता और शेषनाग (अनन्त) के अवतार। कृषि और अपार बल के देवता। हल (हला) और मूसल उनके शस्त्र हैं। दुर्योधन और भीम दोनों को गदायुद्ध सिखाया। दाऊजी, हलधर और संकर्षण नाम से भी प्रसिद्ध।',
        mantra: 'ॐ नमो भगवते बलभद्राय नमः',
        attributes: ['Sheshnag Avatar', 'Haldhar', 'Krishna Brother', 'Strength'],
      },
      {
        name: 'Chitragupta Ji',
        nameHi: 'चित्रगुप्त जी',
        description: 'The divine record-keeper who maintains the account of every human\'s good and bad deeds (karma). He assists Yama (god of death) in delivering justice after death. He is considered the progenitor of the Kayastha community and the inventor of the script (Lipi). He holds a pen and book.',
        descriptionHi: 'प्रत्येक मनुष्य के पुण्य-पाप कर्मों का लेखा-जोखा रखने वाले दिव्य लेखक। मृत्यु के पश्चात् यमराज को न्याय देने में सहायता करते हैं। कायस्थ समुदाय के प्रजनक और लिपि के आविष्कारक माने जाते हैं। कलम और पुस्तक धारण करते हैं।',
        mantra: 'ॐ श्री चित्रगुप्ताय नमः',
        attributes: ['Karma Lekhak', 'Yama Sahayak', 'Pen & Book', 'Kayastha'],
      },
      {
        name: 'Sheshnag (Anant)',
        nameHi: 'शेषनाग (अनन्त)',
        description: 'The king of all Nagas (serpents) with a thousand hoods. Lord Vishnu rests on his coils in the cosmic ocean (Ksheer Sagar). He holds the entire universe on his hoods. At the end of each cosmic cycle, he destroys creation with fire from his mouths. Lakshman and Balram are his incarnations.',
        descriptionHi: 'सहस्र फणों वाले समस्त नागों के राजा। भगवान विष्णु क्षीरसागर में उनकी शैय्या पर विश्राम करते हैं। अपने फणों पर सम्पूर्ण ब्रह्माण्ड को धारण करते हैं। प्रत्येक कल्प के अन्त में मुखों से अग्नि से सृष्टि का संहार। लक्ष्मण और बलराम उनके अवतार हैं।',
        mantra: 'ॐ नमो भगवते अनन्ताय नमः',
        attributes: ['Nag Raj', 'Vishnu Shayya', 'Thousand Hoods', 'Ksheer Sagar'],
      },
      {
        name: 'Santoshi Mata',
        nameHi: 'सन्तोषी माता',
        description: 'The goddess of satisfaction, happiness, and contentment. Daughter of Lord Ganesh. Her worship became widely popular through the 1975 film "Jai Santoshi Maa". Devotees observe 16 consecutive Friday fasts (vrat) for her blessings. She grants fulfillment of desires and family harmony.',
        descriptionHi: 'सन्तोष, सुख और तृप्ति की देवी। गणेश जी की पुत्री। 1975 की फ़िल्म "जय सन्तोषी माँ" से उनकी पूजा व्यापक रूप से लोकप्रिय हुई। भक्त उनकी कृपा के लिए लगातार 16 शुक्रवार का व्रत रखते हैं। मनोकामना पूर्ति और पारिवारिक सद्भाव प्रदान करती हैं।',
        mantra: 'ॐ श्री सन्तोषी माता नमः',
        attributes: ['Ganesh Putri', 'Friday Vrat', 'Contentment', 'Family Harmony'],
      },
      {
        name: 'Sheetala Mata',
        nameHi: 'शीतला माता',
        description: 'The goddess of coolness who protects from diseases, especially smallpox, measles, and fevers. She rides a donkey and carries a broom, water pot, and neem leaves. Sheetala Ashtami (8 days after Holi) is her main festival. Food is cooked a day before and eaten cold (Basoda) on her day.',
        descriptionHi: 'शीतलता प्रदान करने वाली और रोगों — विशेषकर चेचक, खसरा और ज्वर — से रक्षा करने वाली देवी। गधे पर सवार, हाथों में झाड़ू, जल कलश और नीम पत्तियाँ। शीतला अष्टमी (होली के 8 दिन बाद) प्रमुख पर्व। बासोड़ा — एक दिन पहले भोजन बनाकर ठण्डा खाया जाता है।',
        mantra: 'ॐ श्री शीतलायै नमः',
        attributes: ['Rog Nivarak', 'Sheetala Ashtami', 'Basoda', 'Neem'],
      },
      {
        name: 'Tulsi Mata',
        nameHi: 'तुलसी माता',
        description: 'The sacred basil plant worshipped as a goddess and considered the most beloved of Lord Vishnu. Every Hindu household traditionally has a Tulsi plant in the courtyard. Tulsi Vivah (her marriage to Shaligram/Vishnu) marks the beginning of the wedding season. She symbolizes purity, devotion, and medicinal healing.',
        descriptionHi: 'पवित्र तुलसी का पौधा जो देवी रूप में पूजित और भगवान विष्णु को सर्वाधिक प्रिय हैं। परम्परागत रूप से प्रत्येक हिन्दू घर के आँगन में तुलसी का पौधा होता है। तुलसी विवाह (शालिग्राम/विष्णु से विवाह) विवाह ऋतु का आरम्भ। पवित्रता, भक्ति और औषधीय गुणों का प्रतीक।',
        mantra: 'ॐ श्री तुलस्यै नमः',
        attributes: ['Vishnu Priya', 'Tulsi Vivah', 'Purity', 'Medicinal'],
      },
      {
        name: 'Radha Rani',
        nameHi: 'राधा रानी',
        description: 'The Ahladini Shakti (bliss-giving power) of Lord Krishna and the supreme goddess of divine love (Prema). She is the queen of Vrindavan and inseparable from Krishna — hence always worshipped together as "Radha-Krishna". Barsana is her birthplace. In many traditions, she is considered superior even to Krishna in devotion.',
        descriptionHi: 'श्री कृष्ण की आह्लादिनी शक्ति और दिव्य प्रेम (प्रेमा) की सर्वोच्च देवी। वृन्दावन की रानी और कृष्ण से अभिन्न — इसलिए सदा "राधा-कृष्ण" के रूप में पूजित। बरसाना उनका जन्मस्थान। अनेक सम्प्रदायों में भक्ति में कृष्ण से भी श्रेष्ठ मानी जाती हैं।',
        mantra: 'राधे राधे गोविन्दा गोविन्दा राधे',
        attributes: ['Ahladini Shakti', 'Vrindavan', 'Prema', 'Barsana'],
      },
      {
        name: 'Sai Baba (Shirdi)',
        nameHi: 'साईं बाबा (शिर्डी)',
        description: 'The revered saint of Shirdi, Maharashtra who is worshipped as a deity by millions. He preached "Sabka Malik Ek" (One God for all) and promoted Hindu-Muslim unity. He lived in a dilapidated mosque (Dwarkamai) and kept a sacred fire (Dhuni) burning perpetually. His teachings emphasize faith (Shraddha) and patience (Saburi).',
        descriptionHi: 'शिर्डी, महाराष्ट्र के पूज्य सन्त जिन्हें करोड़ों भक्त देवता के रूप में पूजते हैं। "सबका मालिक एक" का सन्देश और हिन्दू-मुस्लिम एकता के पक्षधर। जीर्ण मस्जिद (द्वारकामाई) में रहे और धूनी सदा प्रज्वलित रखी। उनकी शिक्षाओं का सार — श्रद्धा और सबूरी (धैर्य)।',
        mantra: 'ॐ साईं नाथाय नमः',
        attributes: ['Sabka Malik Ek', 'Shraddha-Saburi', 'Shirdi', 'Dhuni'],
      },
    ],
  },
  {
    id: 'dashavatar',
    title: 'Bhagwan Vishnu ke Dashavatar',
    titleHi: 'भगवान विष्णु के दशावतार',
    subtitle: 'The 10 Divine Incarnations of Lord Vishnu',
    subtitleHi: 'भगवान विष्णु के दस दिव्य अवतार',
    emoji: '🔱',
    deities: [
      {
        name: 'Matsya',
        nameHi: 'मत्स्य',
        description: 'The Fish Avatar. The first avatar of Vishnu who saved the Vedas and Manu (the first man) from a great deluge (Pralaya). He guided Manu\'s boat through the flood to safety.',
        descriptionHi: 'मछली रूप। विष्णु का प्रथम अवतार जिसने वेदों और मनु (प्रथम मानव) को प्रलय से बचाया। उन्होंने मनु की नाव को बाढ़ से सुरक्षित स्थान पर पहुँचाया।',
        attributes: ['First Avatar', 'Saved Vedas', 'Great Flood'],
      },
      {
        name: 'Kurma',
        nameHi: 'कूर्म',
        description: 'The Tortoise Avatar. Vishnu took the form of a giant tortoise to support Mount Mandara on his back during the Samudra Manthan (churning of the ocean) by the Devas and Asuras.',
        descriptionHi: 'कछुआ रूप। समुद्र मंथन के समय विष्णु ने विशाल कछुए का रूप लेकर मंदराचल पर्वत को अपनी पीठ पर धारण किया।',
        attributes: ['Tortoise Form', 'Samudra Manthan', 'Mount Mandara'],
      },
      {
        name: 'Varaha',
        nameHi: 'वराह',
        description: 'The Boar Avatar. Vishnu incarnated as a giant boar to rescue the Earth (Bhudevi) from the demon Hiranyaksha who had dragged her to the bottom of the cosmic ocean.',
        descriptionHi: 'वराह (सूअर) रूप। विष्णु ने विशाल वराह का रूप लेकर पृथ्वी (भूदेवी) को राक्षस हिरण्याक्ष से बचाया जिसने पृथ्वी को ब्रह्माण्डीय समुद्र की तलहटी में छिपा दिया था।',
        attributes: ['Boar Form', 'Saved Earth', 'Defeated Hiranyaksha'],
      },
      {
        name: 'Narasimha',
        nameHi: 'नरसिंह',
        description: 'The Half-Man Half-Lion Avatar. Vishnu appeared in this fierce form to protect his devotee Prahlada and destroy the demon king Hiranyakashipu, who had gained a boon of near-invincibility.',
        descriptionHi: 'आधा नर, आधा सिंह रूप। विष्णु ने इस उग्र रूप में प्रकट होकर अपने भक्त प्रह्लाद की रक्षा की और राक्षस राजा हिरण्यकशिपु का वध किया जिसे लगभग अमरता का वरदान प्राप्त था।',
        mantra: 'ॐ उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्',
        attributes: ['Half-Man Half-Lion', 'Protected Prahlada', 'Fierce Form'],
      },
      {
        name: 'Vamana',
        nameHi: 'वामन',
        description: 'The Dwarf Brahmin Avatar. Vishnu appeared as a small brahmin boy and asked the demon king Bali for just three steps of land. He then grew to cosmic size and covered the three worlds in three steps.',
        descriptionHi: 'बौना ब्राह्मण रूप। विष्णु ने छोटे ब्राह्मण बालक के रूप में प्रकट होकर राक्षस राजा बलि से तीन पग भूमि माँगी। फिर विराट रूप धारण कर तीन पगों में तीनों लोकों को नाप लिया।',
        attributes: ['Dwarf Form', 'Three Steps', 'King Bali'],
      },
      {
        name: 'Parashurama',
        nameHi: 'परशुराम',
        description: 'The Warrior Sage with an axe. The sixth avatar born to sage Jamadagni and Renuka. He rid the world of corrupt Kshatriya kings 21 times. He is one of the seven Chiranjeevis (immortals).',
        descriptionHi: 'परशु (फरसा) धारी योद्धा ब्राह्मण। ऋषि जमदग्नि और रेणुका के पुत्र। उन्होंने 21 बार पृथ्वी को अत्याचारी क्षत्रिय राजाओं से मुक्त किया। वे सात चिरंजीवियों में से एक हैं।',
        attributes: ['Warrior Sage', 'Axe (Parashu)', 'Chiranjeevi'],
      },
      {
        name: 'Rama',
        nameHi: 'राम',
        description: 'Maryada Purushottam — the ideal man and king. The prince of Ayodhya who defeated the demon king Ravana to rescue Mata Sita. His life story is told in the great epic Ramayana. He is the embodiment of dharma, virtue, and righteousness.',
        descriptionHi: 'मर्यादा पुरुषोत्तम — आदर्श पुरुष और राजा। अयोध्या के राजकुमार जिन्होंने माता सीता को बचाने के लिए राक्षस राजा रावण का वध किया। उनकी जीवन गाथा महाकाव्य रामायण में है। वे धर्म, सदाचार और मर्यादा के प्रतीक हैं।',
        mantra: 'श्री राम जय राम जय जय राम',
        attributes: ['Maryada Purushottam', 'Ayodhya', 'Ramayana', 'Bow & Arrow'],
      },
      {
        name: 'Krishna',
        nameHi: 'कृष्ण',
        description: 'Leela Purushottam — the complete (Purna) avatar of Vishnu. Born in Mathura, raised in Vrindavan. He delivered the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra. The divine flute player, the butter thief, the protector of Dharma.',
        descriptionHi: 'लीलापुरुषोत्तम — विष्णु के पूर्ण अवतार। मथुरा में जन्म, वृन्दावन में पालन। कुरुक्षेत्र के रणभूमि में अर्जुन को भगवद्गीता का उपदेश दिया। बांसुरीधर, माखनचोर, धर्म के रक्षक।',
        mantra: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे',
        attributes: ['Purna Avatar', 'Bhagavad Gita', 'Flute', 'Vrindavan'],
      },
      {
        name: 'Buddha',
        nameHi: 'बुद्ध',
        description: 'The Enlightened One. The avatar of peace, compassion, and wisdom. He taught the middle path, non-violence, and the way to end suffering through the Eightfold Path.',
        descriptionHi: 'प्रबुद्ध। शान्ति, करुणा और ज्ञान के अवतार। उन्होंने मध्यम मार्ग, अहिंसा और अष्टांगिक मार्ग से दुःख निवारण का उपदेश दिया।',
        attributes: ['Enlightenment', 'Peace', 'Non-violence', 'Middle Path'],
      },
      {
        name: 'Kalki',
        nameHi: 'कल्कि',
        description: 'The future and final avatar of Vishnu. According to Hindu prophecy, Kalki will appear at the end of Kali Yuga riding a white horse, wielding a blazing sword, to destroy evil and restore Dharma, beginning a new Satya Yuga.',
        descriptionHi: 'विष्णु के भविष्य और अंतिम अवतार। हिन्दू भविष्यवाणी के अनुसार, कल्कि कलियुग के अंत में श्वेत अश्व पर सवार होकर, तलवार लेकर प्रकट होंगे, अधर्म का नाश कर सतयुग का आरम्भ करेंगे।',
        attributes: ['Future Avatar', 'White Horse', 'End of Kali Yuga', 'Sword'],
      },
    ],
  },
  {
    id: 'navadurga',
    title: 'Maa Durga ke Navadurga Roop',
    titleHi: 'माँ दुर्गा के नवदुर्गा रूप',
    subtitle: 'The Nine Divine Forms of Goddess Durga — Worshipped during Navratri',
    subtitleHi: 'माँ दुर्गा के नौ दिव्य रूप — नवरात्रि में पूजित',
    emoji: '🌺',
    deities: [
      {
        name: 'Shailputri',
        nameHi: 'शैलपुत्री',
        description: 'Daughter of the mountains (Himavan). The first form of Navadurga worshipped on the first day of Navratri. She rides a bull (Nandi) and holds a trident and lotus.',
        descriptionHi: 'पर्वतराज हिमवान की पुत्री। नवरात्रि के प्रथम दिन पूजित नवदुर्गा का प्रथम रूप। वे वृषभ (नंदी) पर सवार हैं और त्रिशूल व कमल धारण करती हैं।',
        attributes: ['Day 1', 'Bull (Nandi)', 'Trident', 'Lotus'],
      },
      {
        name: 'Brahmacharini',
        nameHi: 'ब्रह्मचारिणी',
        description: 'The ascetic form of Goddess Parvati. Worshipped on the second day. She performed severe penance to attain Lord Shiva as her husband. She holds a rosary (Japa Mala) and Kamandalu.',
        descriptionHi: 'देवी पार्वती का तपस्विनी रूप। दूसरे दिन पूजित। उन्होंने भगवान शिव को पति रूप में प्राप्त करने के लिए कठोर तपस्या की। हाथों में जपमाला और कमण्डल।',
        attributes: ['Day 2', 'Penance', 'Japa Mala', 'Kamandalu'],
      },
      {
        name: 'Chandraghanta',
        nameHi: 'चन्द्रघण्टा',
        description: 'She who has a half-moon shaped like a bell on her forehead. Worshipped on the third day. She rides a tiger and has ten hands carrying various weapons. She represents bravery and grace.',
        descriptionHi: 'मस्तक पर घण्टे के आकार का अर्धचन्द्र धारण करने वाली। तीसरे दिन पूजित। वे बाघ पर सवार हैं और दस हाथों में विभिन्न शस्त्र धारण करती हैं। शौर्य और सौन्दर्य का प्रतीक।',
        attributes: ['Day 3', 'Half-Moon Bell', 'Tiger', 'Ten Arms'],
      },
      {
        name: 'Kushmanda',
        nameHi: 'कूष्माण्डा',
        description: 'The creator of the cosmic egg (Brahmanda). Worshipped on the fourth day. Her divine smile created the universe. She rides a lion and has eight hands. She resides in the core of the Sun.',
        descriptionHi: 'ब्रह्माण्ड की रचना करने वाली। चौथे दिन पूजित। उनकी दिव्य मुस्कान से सृष्टि का निर्माण हुआ। वे सिंह पर सवार हैं और आठ हाथ हैं। वे सूर्य के केन्द्र में निवास करती हैं।',
        attributes: ['Day 4', 'Cosmic Egg', 'Lion', 'Eight Arms'],
      },
      {
        name: 'Skandamata',
        nameHi: 'स्कन्दमाता',
        description: 'Mother of Skanda (Kartikeya). Worshipped on the fifth day. She holds baby Kartikeya in her lap. She rides a lion and grants wisdom and salvation to her devotees.',
        descriptionHi: 'स्कन्द (कार्तिकेय) की माता। पाँचवें दिन पूजित। वे शिशु कार्तिकेय को गोद में लिए हैं। सिंह पर सवार, भक्तों को बुद्धि और मोक्ष प्रदान करती हैं।',
        attributes: ['Day 5', 'Mother of Kartikeya', 'Lion', 'Wisdom'],
      },
      {
        name: 'Katyayani',
        nameHi: 'कात्यायनी',
        description: 'Born as the daughter of sage Katyayana. Worshipped on the sixth day. She is a warrior form of Durga who slayed the demon Mahishasura. She rides a lion and has four arms.',
        descriptionHi: 'ऋषि कात्यायन की पुत्री के रूप में जन्मी। छठे दिन पूजित। वे दुर्गा का योद्धा रूप हैं जिन्होंने महिषासुर का वध किया। सिंह पर सवार, चार भुजाएँ हैं।',
        attributes: ['Day 6', 'Warrior Form', 'Slayed Mahishasura', 'Lion'],
      },
      {
        name: 'Kaalratri',
        nameHi: 'कालरात्री',
        description: 'The most fierce form of Durga, destroyer of darkness and ignorance. Worshipped on the seventh day. She has a dark complexion, disheveled hair, and rides a donkey. She destroys all demons and negativity.',
        descriptionHi: 'दुर्गा का सबसे भयंकर रूप, अन्धकार और अज्ञान का नाश करने वाली। सातवें दिन पूजित। श्याम वर्ण, बिखरे केश, गदहे पर सवार। सभी राक्षसों और नकारात्मकता का नाश करती हैं।',
        attributes: ['Day 7', 'Fierce Form', 'Destroyer of Darkness', 'Donkey'],
      },
      {
        name: 'Mahagauri',
        nameHi: 'महागौरी',
        description: 'The extremely fair and radiant form. Worshipped on the eighth day. She represents purity and calmness. She rides a white bull and has four arms. She cleanses the sins of her devotees.',
        descriptionHi: 'अत्यन्त गौर वर्ण और तेजस्वी रूप। आठवें दिन पूजित। पवित्रता और शान्ति की प्रतीक। श्वेत वृषभ पर सवार, चार भुजाएँ। भक्तों के पापों को धो देती हैं।',
        attributes: ['Day 8', 'Purity', 'White Bull', 'Radiance'],
      },
      {
        name: 'Siddhidatri',
        nameHi: 'सिद्धिदात्री',
        description: 'The granter of all Siddhis (supernatural powers). Worshipped on the ninth day. She sits on a lotus and has four arms. She grants the eight Siddhis and is worshipped by devas, asuras, and humans alike.',
        descriptionHi: 'सभी सिद्धियाँ प्रदान करने वाली। नवें दिन पूजित। कमल पर विराजमान, चार भुजाएँ। वे आठ सिद्धियाँ प्रदान करती हैं और देव, असुर और मनुष्य सभी उनकी उपासना करते हैं।',
        attributes: ['Day 9', 'Siddhis', 'Lotus', 'All Powers'],
      },
    ],
  },
  {
    id: 'das-mahavidya',
    title: 'Das Mahavidya',
    titleHi: 'दस महाविद्या',
    subtitle: 'The Ten Tantric Forms of the Divine Mother',
    subtitleHi: 'माता के दस तान्त्रिक रूप',
    emoji: '🔥',
    deities: [
      {
        name: 'Kali',
        nameHi: 'काली',
        description: 'The fierce goddess of time, destruction, and liberation. The first and foremost Mahavidya. She stands on Lord Shiva, wears a garland of skulls, and has a protruding tongue. She destroys evil and ego.',
        descriptionHi: 'काल, संहार और मोक्ष की उग्र देवी। प्रथम और प्रमुख महाविद्या। शिव पर खड़ी, मुण्डमाला धारण, जिह्वा बाहर। अहंकार और बुराई का नाश करती हैं।',
        attributes: ['Time', 'Liberation', 'Skull Garland', 'Fierce'],
      },
      {
        name: 'Tara',
        nameHi: 'तारा',
        description: 'The goddess who guides and protects. She saves devotees from the ocean of worldly suffering. Similar to Kali in appearance but more compassionate. She grants knowledge and eloquence.',
        descriptionHi: 'मार्गदर्शन और रक्षा की देवी। भवसागर से भक्तों को तारने वाली। काली के समान रूप किन्तु अधिक करुणामयी। ज्ञान और वाक् सिद्धि प्रदान करती हैं।',
        attributes: ['Guide', 'Compassion', 'Eloquence', 'Protection'],
      },
      {
        name: 'Tripura Sundari (Shodashi)',
        nameHi: 'त्रिपुर सुन्दरी (षोडशी)',
        description: 'The most beautiful goddess in the three worlds. She represents the beauty of pure consciousness. She is sixteen years old eternally, seated on a lotus, and embodies grace and spiritual knowledge.',
        descriptionHi: 'तीनों लोकों में सबसे सुन्दर देवी। शुद्ध चेतना के सौन्दर्य का प्रतिनिधित्व। शाश्वत सोलह वर्ष की आयु, कमल पर विराजमान, सौन्दर्य और आध्यात्मिक ज्ञान की मूर्ति।',
        attributes: ['Beauty', 'Sixteen', 'Three Worlds', 'Consciousness'],
      },
      {
        name: 'Bhuvaneshvari',
        nameHi: 'भुवनेश्वरी',
        description: 'The Queen of the Universe. She is the ruler of all worlds and embodies the cosmic space. She creates the material world and grants her devotees sovereignty and worldly success.',
        descriptionHi: 'ब्रह्माण्ड की रानी। सभी लोकों की शासक और आकाश तत्व का प्रतिनिधित्व। भौतिक संसार की रचना और भक्तों को सम्प्रभुता और सांसारिक सफलता प्रदान करती हैं।',
        attributes: ['Universe', 'Space', 'Sovereignty', 'Material World'],
      },
      {
        name: 'Bhairavi',
        nameHi: 'भैरवी',
        description: 'The fierce goddess of destruction. She represents the power of speech and the fire of tapas (penance). She is worshipped for courage, strength, and victory over enemies.',
        descriptionHi: 'संहार की उग्र देवी। वाक् शक्ति और तपस अग्नि का प्रतिनिधित्व। साहस, बल और शत्रुओं पर विजय के लिए पूजित।',
        attributes: ['Fire', 'Speech', 'Courage', 'Tapas'],
      },
      {
        name: 'Chhinnamasta',
        nameHi: 'छिन्नमस्ता',
        description: 'The self-decapitated goddess. She holds her own severed head and drinks the blood flowing from her neck. She represents self-sacrifice, the awakening of Kundalini, and the transcendence of body consciousness.',
        descriptionHi: 'स्व-शिरच्छेदित देवी। अपना कटा हुआ शीश धारण करती हैं और गले से बहते रक्त का पान करती हैं। आत्म-त्याग, कुण्डलिनी जागरण और देह चेतना से ऊपर उठने का प्रतीक।',
        attributes: ['Self-sacrifice', 'Kundalini', 'Transcendence'],
      },
      {
        name: 'Dhumavati',
        nameHi: 'धूमावती',
        description: 'The widow goddess, the smoky one. She represents the void, inauspiciousness, and the power of poverty and deprivation. She teaches detachment and the transient nature of worldly pleasures.',
        descriptionHi: 'विधवा देवी, धूम्र रूपा। शून्यता, अमंगल और दरिद्रता की शक्ति का प्रतिनिधित्व। वैराग्य और सांसारिक सुखों की क्षणभंगुरता का शिक्षण।',
        attributes: ['Void', 'Detachment', 'Smoke', 'Wisdom'],
      },
      {
        name: 'Bagalamukhi',
        nameHi: 'बगलामुखी',
        description: 'The goddess who paralyzes enemies. She has the power to stop the speech, movement, and action of opponents. She is invoked to win court cases, defeat enemies, and overcome obstacles.',
        descriptionHi: 'शत्रुओं को स्तम्भित करने वाली देवी। शत्रुओं की वाणी, गति और क्रिया रोकने की शक्ति। मुकदमे जीतने, शत्रुओं को परास्त करने और बाधाओं को दूर करने के लिए पूजित।',
        attributes: ['Stambhana', 'Paralyze', 'Victory', 'Obstacles'],
      },
      {
        name: 'Matangi',
        nameHi: 'मातंगी',
        description: 'The tantric form of Saraswati. She governs speech, music, knowledge, and the arts. She is dark-complexioned and is worshipped for mastery over fine arts and supernatural powers of speech.',
        descriptionHi: 'सरस्वती का तान्त्रिक रूप। वाणी, संगीत, ज्ञान और कलाओं की अधिष्ठात्री। श्याम वर्ण, ललित कलाओं में निपुणता और वाक् सिद्धि के लिए पूजित।',
        attributes: ['Speech', 'Music', 'Arts', 'Tantric Saraswati'],
      },
      {
        name: 'Kamala',
        nameHi: 'कमला',
        description: 'The tantric form of Lakshmi. She represents wealth, beauty, and spiritual abundance. She sits on a lotus and is bathed by elephants. She grants material and spiritual prosperity.',
        descriptionHi: 'लक्ष्मी का तान्त्रिक रूप। धन, सौन्दर्य और आध्यात्मिक समृद्धि का प्रतिनिधित्व। कमल पर विराजमान, गजों द्वारा अभिषिक्त। भौतिक और आध्यात्मिक समृद्धि प्रदान करती हैं।',
        attributes: ['Wealth', 'Lotus', 'Elephants', 'Tantric Lakshmi'],
      },
    ],
  },
  {
    id: 'shiva-roop',
    title: 'Bhagwan Shiva ke Pramukh Roop',
    titleHi: 'भगवान शिव के प्रमुख रूप',
    subtitle: 'The Major Manifestations of Lord Shiva',
    subtitleHi: 'भगवान शिव के प्रमुख प्रकट रूप',
    emoji: '🔱',
    deities: [
      {
        name: 'Mahakaal',
        nameHi: 'महाकाल',
        description: 'The Lord of Time and Death. Shiva in his most fearsome form as the ruler of time itself. The Mahakaleshwar Jyotirlinga in Ujjain is dedicated to this form. He transcends and controls time.',
        descriptionHi: 'समय और मृत्यु के स्वामी। काल के शासक के रूप में शिव का सबसे भयंकर रूप। उज्जैन का महाकालेश्वर ज्योतिर्लिंग इसी रूप को समर्पित है। वे काल से परे हैं और काल को नियन्त्रित करते हैं।',
        attributes: ['Time', 'Death', 'Ujjain', 'Jyotirlinga'],
      },
      {
        name: 'Nataraja',
        nameHi: 'नटराज',
        description: 'The Cosmic Dancer. Shiva as the Lord of Dance (Tandava). His dance represents the cosmic cycles of creation, preservation, and destruction. The Nataraja form is one of the most iconic images in Hindu art.',
        descriptionHi: 'ब्रह्माण्डीय नर्तक। नृत्य (ताण्डव) के स्वामी शिव। उनका नृत्य सृष्टि, पालन और संहार के ब्रह्माण्डीय चक्रों का प्रतीक है। नटराज हिन्दू कला की सबसे प्रतिष्ठित प्रतिमाओं में से एक है।',
        attributes: ['Dance', 'Tandava', 'Cosmic Cycles', 'Chidambaram'],
      },
      {
        name: 'Kaal Bhairav',
        nameHi: 'काल भैरव',
        description: 'The fierce guardian of Kashi (Varanasi). He is the Kotwal (protector/police chief) of Kashi. He is Shiva in his most fearsome and wrathful form. He punishes sinners and protects devotees. His vahana is a dog.',
        descriptionHi: 'काशी (वाराणसी) के उग्र रक्षक, काशी के कोतवाल। शिव का सबसे भयंकर और क्रोधित रूप। पापियों को दण्ड और भक्तों की रक्षा। उनका वाहन श्वान है।',
        attributes: ['Kashi Kotwal', 'Fierce', 'Dog', 'Protector'],
      },
      {
        name: 'Dakshinamurthy',
        nameHi: 'दक्षिणामूर्ति',
        description: 'Shiva as the Supreme Guru (Teacher). He is the first guru who taught the rishis through silence (Chin Mudra). He faces south (Dakshina) and teaches yoga, music, and all forms of knowledge.',
        descriptionHi: 'परम गुरु के रूप में शिव। वे प्रथम गुरु हैं जिन्होंने मौन (चिन् मुद्रा) के माध्यम से ऋषियों को शिक्षा दी। दक्षिण (दक्षिणा) की ओर मुख, योग, संगीत और समस्त ज्ञान के शिक्षक।',
        attributes: ['Supreme Guru', 'Silence', 'South-Facing', 'Knowledge'],
      },
    ],
  },
  {
    id: 'vedic-devta',
    title: 'Vedic aur Anya Devta',
    titleHi: 'वैदिक एवं अन्य देवता',
    subtitle: 'Vedic Deities — Lords of Nature, Elements & Directions',
    subtitleHi: 'प्रकृति, तत्वों और दिशाओं के स्वामी — वैदिक देवता',
    emoji: '☀️',
    deities: [
      {
        name: 'Surya Dev',
        nameHi: 'सूर्य देव',
        description: 'The Sun God — the source of light, energy, and life. He rides a chariot driven by seven horses representing the seven days of the week. Surya Namaskar (Sun Salutation) is dedicated to him. He is the eye of the universe.',
        descriptionHi: 'सूर्य देवता — प्रकाश, ऊर्जा और जीवन के स्रोत। सात घोड़ों द्वारा खींचे जाने वाले रथ पर सवार, जो सप्ताह के सात दिनों का प्रतीक हैं। सूर्य नमस्कार उन्हें समर्पित है। वे ब्रह्माण्ड की आँख हैं।',
        mantra: 'ॐ सूर्याय नमः',
        attributes: ['Light', 'Energy', 'Seven Horses', 'Chariot'],
      },
      {
        name: 'Chandra Dev',
        nameHi: 'चन्द्र देव',
        description: 'The Moon God — lord of the mind, emotions, and vegetation. He has 16 phases (Kalas) and influences the tides and human psychology. He adorns the head of Lord Shiva.',
        descriptionHi: 'चन्द्र देवता — मन, भावनाओं और वनस्पति के स्वामी। उनकी 16 कलाएँ हैं और ज्वार-भाटा व मानव मनोविज्ञान को प्रभावित करते हैं। भगवान शिव के मस्तक पर विराजमान हैं।',
        mantra: 'ॐ चन्द्राय नमः',
        attributes: ['Mind', 'Emotions', '16 Kalas', 'Night'],
      },
      {
        name: 'Indra Dev',
        nameHi: 'इन्द्र देव',
        description: 'The King of the Gods and lord of heaven (Swarga). He controls rain, thunder, lightning, and storms. He wields the Vajra (thunderbolt) and rides the divine elephant Airavata.',
        descriptionHi: 'देवताओं के राजा और स्वर्ग के स्वामी। वर्षा, गर्जना, बिजली और तूफ़ान के नियन्त्रक। वज्र (वज्रायुध) धारण करते हैं और दिव्य हाथी ऐरावत पर सवार हैं।',
        mantra: 'ॐ इन्द्राय नमः',
        attributes: ['King of Gods', 'Vajra', 'Airavata', 'Rain'],
      },
      {
        name: 'Agni Dev',
        nameHi: 'अग्नि देव',
        description: 'The God of Fire — the divine messenger between gods and humans. All offerings in yajnas and havans are carried to the gods through Agni. He has seven tongues and is ever-present in every home.',
        descriptionHi: 'अग्नि देवता — देवताओं और मनुष्यों के बीच दिव्य दूत। यज्ञों और हवनों में सभी आहुतियाँ अग्नि के माध्यम से देवताओं तक पहुँचती हैं। उनकी सात जिह्वाएँ हैं और प्रत्येक गृह में विद्यमान हैं।',
        mantra: 'ॐ अग्नये नमः',
        attributes: ['Fire', 'Messenger', 'Yajna', 'Seven Tongues'],
      },
      {
        name: 'Vayu Dev',
        nameHi: 'वायु देव',
        description: 'The God of Wind — the breath of life (Prana). Father of Hanuman and Bhima. He is one of the Pancha Mahabhutas (five great elements) and sustains all living beings through breath.',
        descriptionHi: 'वायु देवता — प्राण (जीवन श्वास)। हनुमान और भीम के पिता। पंच महाभूतों में से एक, श्वास के माध्यम से सभी जीवों का पोषण करते हैं।',
        mantra: 'ॐ वायवे नमः',
        attributes: ['Wind', 'Prana', 'Father of Hanuman', 'Breath'],
      },
      {
        name: 'Varuna Dev',
        nameHi: 'वरुण देव',
        description: 'The God of Water and the cosmic ocean. He is the guardian of moral law (Rita) and oversees the celestial order. He controls the seas, rivers, and all water bodies.',
        descriptionHi: 'जल और ब्रह्माण्डीय सागर के देवता। ऋत (नैतिक नियम) के रक्षक और दिव्य व्यवस्था के निरीक्षक। सागर, नदियों और समस्त जल निकायों के नियन्त्रक।',
        mantra: 'ॐ वरुणाय नमः',
        attributes: ['Water', 'Cosmic Ocean', 'Moral Law', 'Rita'],
      },
      {
        name: 'Yama Dev',
        nameHi: 'यम देव',
        description: 'The God of Death and Justice (Dharmaraj). He judges the souls of the dead and sends them to heaven or hell based on their karma. He is the son of Surya and brother of Yamuna.',
        descriptionHi: 'मृत्यु और न्याय के देवता (धर्मराज)। मृत आत्माओं का कर्मानुसार न्याय करते हैं और स्वर्ग या नरक भेजते हैं। सूर्य के पुत्र और यमुना के भ्राता।',
        mantra: 'ॐ यमाय नमः',
        attributes: ['Death', 'Justice', 'Dharmaraj', 'Son of Surya'],
      },
      {
        name: 'Kubera Dev',
        nameHi: 'कुबेर देव',
        description: 'The God of Wealth and the king of Yakshas. He is the divine treasurer and guards the wealth of the gods. He resides in the golden city of Alkapuri near Mount Kailash.',
        descriptionHi: 'धन के देवता और यक्षों के राजा। दिव्य कोषाध्यक्ष और देवताओं के धन के रक्षक। कैलाश पर्वत के निकट स्वर्णिम नगरी अलकापुरी में निवास करते हैं।',
        mantra: 'ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये नमः',
        attributes: ['Wealth', 'Yakshas', 'Alkapuri', 'Treasurer'],
      },
      {
        name: 'Kamadeva',
        nameHi: 'कामदेव',
        description: 'The God of Love and Desire. He carries a bow made of sugarcane with a string of honeybees, and arrows tipped with five flowers. He was burnt by Shiva\'s third eye and later revived.',
        descriptionHi: 'प्रेम और आकर्षण के देवता। गन्ने का धनुष, मधुमक्खियों की प्रत्यंचा और पाँच पुष्पों से सजे बाण। शिव की तीसरी आँख से भस्म हुए और बाद में पुनर्जीवित।',
        attributes: ['Love', 'Desire', 'Sugarcane Bow', 'Flower Arrows'],
      },
      {
        name: 'Vishwakarma',
        nameHi: 'विश्वकर्मा',
        description: 'The Divine Architect and craftsman of the gods. He built Lanka for Kubera (later taken by Ravana), Dwarka for Krishna, Indraprastha for the Pandavas, and designed the weapons of the gods including Vishnu\'s Sudarshana Chakra.',
        descriptionHi: 'देवताओं के दिव्य वास्तुकार एवं शिल्पकार। कुबेर के लिए लंका (बाद में रावण ने ली), कृष्ण के लिए द्वारका, पाण्डवों के लिए इन्द्रप्रस्थ का निर्माण किया। विष्णु के सुदर्शन चक्र सहित देवताओं के अस्त्र-शस्त्रों का निर्माण किया।',
        attributes: ['Architect', 'Craftsman', 'Lanka', 'Dwarka', 'Weapons'],
      },
    ],
  },
  {
    id: 'navagraha',
    title: 'Navagraha',
    titleHi: 'नवग्रह',
    subtitle: 'The Nine Planetary Deities that influence human destiny',
    subtitleHi: 'नौ ग्रह देवता जो मानव भाग्य को प्रभावित करते हैं',
    emoji: '🪐',
    deities: [
      {
        name: 'Surya (Sun)',
        nameHi: 'सूर्य',
        description: 'The Sun God — king of all planets and the soul of the universe. He governs vitality, authority, father, government, and fame. His day is Sunday and gemstone is Ruby (Manik).',
        descriptionHi: 'सूर्य देवता — सभी ग्रहों के राजा और ब्रह्माण्ड की आत्मा। जीवनशक्ति, अधिकार, पिता, सरकार और यश के कारक। वार — रविवार, रत्न — माणिक्य (Ruby), रंग — लाल/केसरिया।',
        mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
        attributes: ['Sunday', 'Ruby (माणिक्य)', 'Red/Saffron', 'Soul'],
      },
      {
        name: 'Chandra (Moon)',
        nameHi: 'चन्द्र',
        description: 'The Moon God — lord of the mind, emotions, and mother. He controls mental peace, imagination, and fertility. His day is Monday and gemstone is Pearl (Moti).',
        descriptionHi: 'चन्द्र देवता — मन, भावनाओं और माता के कारक। मानसिक शान्ति, कल्पनाशक्ति और प्रजनन के नियन्त्रक। वार — सोमवार, रत्न — मोती (Pearl), रंग — श्वेत।',
        mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
        attributes: ['Monday', 'Pearl (मोती)', 'White', 'Mind'],
      },
      {
        name: 'Mangal (Mars)',
        nameHi: 'मंगल',
        description: 'The Mars God — commander of the celestial army. He governs courage, strength, siblings, land, and energy. His day is Tuesday and gemstone is Red Coral (Moonga).',
        descriptionHi: 'मंगल ग्रह — देवसेना के सेनापति। साहस, बल, भाई-बहन, भूमि और ऊर्जा के कारक। वार — मंगलवार, रत्न — मूँगा (Red Coral), रंग — लाल।',
        mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
        attributes: ['Tuesday', 'Red Coral (मूँगा)', 'Red', 'Courage'],
      },
      {
        name: 'Budh (Mercury)',
        nameHi: 'बुध',
        description: 'The Mercury God — prince among planets. He governs intelligence, communication, business, and education. His day is Wednesday and gemstone is Emerald (Panna).',
        descriptionHi: 'बुध ग्रह — ग्रहों के राजकुमार। बुद्धि, संवाद, व्यापार और शिक्षा के कारक। वार — बुधवार, रत्न — पन्ना (Emerald), रंग — हरा।',
        mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
        attributes: ['Wednesday', 'Emerald (पन्ना)', 'Green', 'Intelligence'],
      },
      {
        name: 'Brihaspati (Jupiter)',
        nameHi: 'बृहस्पति',
        description: 'The Jupiter God — Guru of the Devas. He governs wisdom, dharma, wealth, children, and spirituality. His day is Thursday and gemstone is Yellow Sapphire (Pukhraj).',
        descriptionHi: 'बृहस्पति ग्रह — देवताओं के गुरु। ज्ञान, धर्म, धन, सन्तान और आध्यात्मिकता के कारक। वार — गुरुवार (बृहस्पतिवार), रत्न — पुखराज (Yellow Sapphire), रंग — पीला।',
        mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
        attributes: ['Thursday', 'Yellow Sapphire (पुखराज)', 'Yellow', 'Wisdom'],
      },
      {
        name: 'Shukra (Venus)',
        nameHi: 'शुक्र',
        description: 'The Venus God — Guru of the Asuras. He governs love, beauty, luxury, marriage, and arts. His day is Friday and gemstone is Diamond (Heera).',
        descriptionHi: 'शुक्र ग्रह — असुरों के गुरु। प्रेम, सौन्दर्य, विलासिता, विवाह और कलाओं के कारक। वार — शुक्रवार, रत्न — हीरा (Diamond), रंग — श्वेत/चमकीला।',
        mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
        attributes: ['Friday', 'Diamond (हीरा)', 'White', 'Love & Beauty'],
      },
      {
        name: 'Shani (Saturn)',
        nameHi: 'शनि',
        description: 'The Saturn God — the judge and karmic enforcer. He governs discipline, longevity, hardship, justice, and karma. His day is Saturday and gemstone is Blue Sapphire (Neelam).',
        descriptionHi: 'शनि ग्रह — न्यायाधीश और कर्मफल दाता। अनुशासन, दीर्घायु, कष्ट, न्याय और कर्म के कारक। वार — शनिवार, रत्न — नीलम (Blue Sapphire), रंग — काला/नीला।',
        mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
        attributes: ['Saturday', 'Blue Sapphire (नीलम)', 'Black/Blue', 'Karma'],
      },
      {
        name: 'Rahu',
        nameHi: 'राहु',
        description: 'The North Node — the shadow planet of illusion and obsession. He has no physical form but exerts powerful influence on ambition, foreign travel, and material desires. Gemstone is Hessonite (Gomed).',
        descriptionHi: 'राहु — छाया ग्रह, भ्रम और जुनून का कारक। कोई भौतिक रूप नहीं पर महत्वाकांक्षा, विदेश यात्रा और भौतिक इच्छाओं पर शक्तिशाली प्रभाव। रत्न — गोमेद (Hessonite)।',
        mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
        attributes: ['No Day', 'Hessonite (गोमेद)', 'Smoky', 'Illusion'],
      },
      {
        name: 'Ketu',
        nameHi: 'केतु',
        description: 'The South Node — the shadow planet of spirituality and detachment. He governs moksha, past karma, occult knowledge, and liberation. Gemstone is Cat\'s Eye (Lehsunia).',
        descriptionHi: 'केतु — छाया ग्रह, आध्यात्मिकता और वैराग्य का कारक। मोक्ष, पूर्वजन्म कर्म, तान्त्रिक ज्ञान और मुक्ति के कारक। रत्न — लहसुनिया (Cat\'s Eye)।',
        mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
        attributes: ['No Day', "Cat's Eye (लहसुनिया)", 'Grey', 'Moksha'],
      },
    ],
  },
  {
    id: 'ashta-lakshmi',
    title: 'Ashta Lakshmi',
    titleHi: 'अष्ट लक्ष्मी',
    subtitle: 'The Eight Divine Forms of Goddess Lakshmi',
    subtitleHi: 'माता लक्ष्मी के आठ दिव्य स्वरूप',
    emoji: '🪷',
    deities: [
      {
        name: 'Adi Lakshmi',
        nameHi: 'आदि लक्ष्मी',
        description: 'The primeval form of Lakshmi — the daughter of sage Bhrigu. She serves Lord Narayana and represents the original, eternal form of the goddess. She fulfills all wishes of her devotees.',
        descriptionHi: 'लक्ष्मी का आदि (मूल) स्वरूप — ऋषि भृगु की पुत्री। भगवान नारायण की सेवा में रत। देवी का शाश्वत और मूल रूप। भक्तों की सभी मनोकामनाएँ पूर्ण करती हैं।',
        mantra: 'ॐ श्रीं आदि लक्ष्म्यै नमः',
        attributes: ['Primeval', 'Eternal', 'Bhrigu Daughter'],
      },
      {
        name: 'Dhana Lakshmi',
        nameHi: 'धन लक्ष्मी',
        description: 'The form that bestows wealth, gold, and material prosperity. She has six hands carrying various weapons, lotus, and gold. She grants fearlessness along with abundance.',
        descriptionHi: 'धन, स्वर्ण और भौतिक समृद्धि प्रदान करने वाला रूप। छह हाथों में विभिन्न शस्त्र, कमल और स्वर्ण। निर्भयता के साथ सम्पन्नता प्रदान करती हैं।',
        mantra: 'ॐ श्रीं धन लक्ष्म्यै नमः',
        attributes: ['Wealth', 'Gold', 'Prosperity'],
      },
      {
        name: 'Dhanya Lakshmi',
        nameHi: 'धान्य लक्ष्मी',
        description: 'The form that bestows agricultural wealth and food grains. She ensures that no one goes hungry and blesses with abundance of crops and food.',
        descriptionHi: 'कृषि सम्पदा और अन्न-धान्य प्रदान करने वाला रूप। कोई भूखा न रहे — फसलों और खाद्य पदार्थों की प्रचुरता का आशीर्वाद।',
        mantra: 'ॐ श्रीं धान्य लक्ष्म्यै नमः',
        attributes: ['Food Grains', 'Agriculture', 'Nourishment'],
      },
      {
        name: 'Gaja Lakshmi',
        nameHi: 'गज लक्ष्मी',
        description: 'The form flanked by elephants (Gaja) who shower her with water. She represents royalty, power, and animal wealth. She restored Indra\'s lost wealth.',
        descriptionHi: 'गजों (हाथियों) द्वारा अभिषिक्त रूप। राजसी वैभव, शक्ति और पशु-सम्पदा की प्रतीक। इन्द्र के खोये हुए ऐश्वर्य को पुनः प्रदान किया।',
        mantra: 'ॐ श्रीं गज लक्ष्म्यै नमः',
        attributes: ['Elephants', 'Royalty', 'Power'],
      },
      {
        name: 'Santana Lakshmi',
        nameHi: 'सन्तान लक्ष्मी',
        description: 'The form that blesses with children and progeny. She carries a child in her arms and grants the boon of healthy and worthy offspring.',
        descriptionHi: 'सन्तान और वंश वृद्धि का आशीर्वाद देने वाला रूप। गोद में शिशु को धारण करती हैं और स्वस्थ एवं योग्य सन्तान का वरदान देती हैं।',
        mantra: 'ॐ श्रीं सन्तान लक्ष्म्यै नमः',
        attributes: ['Children', 'Progeny', 'Family'],
      },
      {
        name: 'Veera Lakshmi',
        nameHi: 'वीर लक्ष्मी',
        description: 'The form that bestows courage, strength, and valor. She gives the power to overcome obstacles and enemies. Also known as Dhairya Lakshmi.',
        descriptionHi: 'साहस, बल और वीरता प्रदान करने वाला रूप। बाधाओं और शत्रुओं पर विजय की शक्ति देती हैं। धैर्य लक्ष्मी के नाम से भी जानी जाती हैं।',
        mantra: 'ॐ श्रीं वीर लक्ष्म्यै नमः',
        attributes: ['Courage', 'Valor', 'Strength'],
      },
      {
        name: 'Vijaya Lakshmi',
        nameHi: 'विजय लक्ष्मी',
        description: 'The form that grants victory in all endeavors — battles, competitions, exams, and life challenges. Also known as Jaya Lakshmi.',
        descriptionHi: 'सभी प्रयासों में विजय प्रदान करने वाला रूप — युद्ध, प्रतियोगिता, परीक्षा और जीवन की चुनौतियों में। जय लक्ष्मी के नाम से भी प्रसिद्ध।',
        mantra: 'ॐ श्रीं विजय लक्ष्म्यै नमः',
        attributes: ['Victory', 'Success', 'Achievement'],
      },
      {
        name: 'Vidya Lakshmi',
        nameHi: 'विद्या लक्ष्मी',
        description: 'The form that bestows knowledge, education, and learning. She grants mastery of arts, sciences, and all forms of wisdom.',
        descriptionHi: 'ज्ञान, शिक्षा और विद्या प्रदान करने वाला रूप। कला, विज्ञान और समस्त प्रकार की बुद्धि में निपुणता का वरदान।',
        mantra: 'ॐ श्रीं विद्या लक्ष्म्यै नमः',
        attributes: ['Knowledge', 'Education', 'Wisdom'],
      },
    ],
  },
  {
    id: 'sapta-chiranjeevi',
    title: 'Sapta Chiranjeevi',
    titleHi: 'सप्त चिरंजीवी',
    subtitle: 'The Seven Immortals of Hindu Dharma who live until the end of Kali Yuga',
    subtitleHi: 'हिन्दू धर्म के सात अमर व्यक्ति जो कलियुग के अंत तक जीवित हैं',
    emoji: '⚔️',
    deities: [
      {
        name: 'Ashwatthama',
        nameHi: 'अश्वत्थामा',
        description: 'Son of Guru Dronacharya. Cursed by Krishna to roam the earth immortally with festering wounds for his sin of using the Brahmastra on the unborn child of Abhimanyu. His immortality is a curse, not a boon.',
        descriptionHi: 'गुरु द्रोणाचार्य के पुत्र। अभिमन्यु के अजन्मे शिशु पर ब्रह्मास्त्र चलाने के पाप के कारण कृष्ण द्वारा शापित — सड़ते घावों के साथ अनन्तकाल तक पृथ्वी पर भटकने का श्राप। उनकी अमरता शाप है, वरदान नहीं।',
        attributes: ['Cursed', 'Dronacharya\'s Son', 'Mahabharata'],
      },
      {
        name: 'Raja Bali',
        nameHi: 'राजा बलि',
        description: 'The righteous demon king who was pushed to Patala (netherworld) by Vamana avatar. Vishnu, pleased by his devotion and charity, granted him immortality and the kingship of Sutala Loka. He returns as Indra in the next Manvantara.',
        descriptionHi: 'धर्मात्मा दैत्य राजा जिन्हें वामन अवतार ने पाताल में भेजा। विष्णु ने उनकी भक्ति और दान से प्रसन्न होकर अमरता और सुतल लोक का राज्य दिया। अगले मन्वन्तर में वे इन्द्र बनेंगे।',
        attributes: ['Righteous King', 'Vamana', 'Sutala Loka'],
      },
      {
        name: 'Veda Vyasa',
        nameHi: 'वेद व्यास',
        description: 'The author of the Mahabharata, compiler of the Vedas, and writer of the 18 Puranas. Son of Rishi Parashara and Satyavati. He divided the single Veda into four parts. Also known as Krishna Dvaipayana.',
        descriptionHi: 'महाभारत के रचयिता, वेदों के संकलनकर्ता और 18 पुराणों के लेखक। ऋषि पराशर और सत्यवती के पुत्र। उन्होंने एक वेद को चार भागों में विभाजित किया। कृष्ण द्वैपायन के नाम से भी प्रसिद्ध।',
        attributes: ['Mahabharata Author', 'Vedas Compiler', '18 Puranas'],
      },
      {
        name: 'Hanuman Ji',
        nameHi: 'हनुमान जी',
        description: 'The supreme devotee of Lord Rama. He is immortal by the blessings of Sita Mata and Lord Rama. He will remain on earth as long as the name of Rama is chanted. He protects and guides devotees in Kali Yuga.',
        descriptionHi: 'भगवान राम के परम भक्त। सीता माता और भगवान राम के वरदान से अमर। जब तक राम नाम का जाप होता रहेगा, वे पृथ्वी पर रहेंगे। कलियुग में भक्तों की रक्षा और मार्गदर्शन करते हैं।',
        mantra: 'ॐ हनुमते नमः',
        attributes: ['Ram Bhakt', 'Protector', 'Kali Yuga Guardian'],
      },
      {
        name: 'Vibhishana',
        nameHi: 'विभीषण',
        description: 'The righteous brother of Ravana who sided with Lord Rama during the Lanka war. After Ravana\'s defeat, Rama crowned him as the king of Lanka and granted him immortality to uphold dharma.',
        descriptionHi: 'रावण के धर्मात्मा भ्राता जिन्होंने लंका युद्ध में भगवान राम का साथ दिया। रावण की पराजय के बाद राम ने उन्हें लंका का राजा बनाया और धर्म की रक्षा के लिए अमरता प्रदान की।',
        attributes: ['Ravana\'s Brother', 'King of Lanka', 'Dharma'],
      },
      {
        name: 'Kripacharya',
        nameHi: 'कृपाचार्य',
        description: 'The royal teacher (Kulguru) of the Kuru dynasty. He fought in the Mahabharata war on the Kaurava side but survived. He is one of the few warriors who survived the great war and continues as an immortal.',
        descriptionHi: 'कुरु वंश के राजगुरु (कुलगुरु)। महाभारत युद्ध में कौरवों की ओर से लड़े पर जीवित रहे। महायुद्ध से बचे कुछ योद्धाओं में से एक, चिरंजीवी के रूप में अमर।',
        attributes: ['Kulguru', 'Kuru Dynasty', 'Mahabharata Survivor'],
      },
      {
        name: 'Parashurama',
        nameHi: 'परशुराम',
        description: 'The sixth avatar of Vishnu — the warrior sage with an axe. He rid the world of corrupt Kshatriya kings 21 times. He will be the martial guru of Kalki, the final avatar of Vishnu, at the end of Kali Yuga.',
        descriptionHi: 'विष्णु के छठे अवतार — परशु (फरसा) धारी योद्धा ब्राह्मण। 21 बार पृथ्वी को अत्याचारी क्षत्रियों से मुक्त किया। कलियुग के अंत में कल्कि अवतार के शस्त्र गुरु बनेंगे।',
        mantra: 'ॐ भार्गवाय विद्महे जामदग्न्याय धीमहि तन्नो रामः प्रचोदयात्',
        attributes: ['Vishnu Avatar', 'Axe (Parashu)', 'Kalki\'s Guru'],
      },
    ],
  },
  {
    id: 'krishna-roop',
    title: 'Bhagwan Krishna ke Pramukh Roop',
    titleHi: 'भगवान कृष्ण के प्रमुख रूप',
    subtitle: 'The Major Forms of Lord Krishna worshipped across the World',
    subtitleHi: 'सम्पूर्ण विश्व में पूजित भगवान कृष्ण के प्रमुख स्वरूप',
    emoji: '🦚',
    deities: [
      {
        name: 'Bal Gopal',
        nameHi: 'बाल गोपाल',
        description: 'The child form of Krishna — the adorable butter thief of Vrindavan. Worshipped for the protection and well-being of children.',
        descriptionHi: 'कृष्ण का बाल रूप — वृन्दावन के प्यारे माखनचोर। बच्चों की रक्षा और कल्याण के लिए पूजित।',
        mantra: 'ॐ क्लीं कृष्णाय नमः',
        attributes: ['Child Form', 'Butter Thief', 'Vrindavan'],
      },
      {
        name: 'Murlidhar',
        nameHi: 'मुरलीधर',
        description: 'Krishna the divine flute player. Standing in his iconic Tribhanga pose, playing the enchanting flute that mesmerizes all of creation.',
        descriptionHi: 'दिव्य बाँसुरीवादक कृष्ण। त्रिभंग मुद्रा में खड़े, मोहक बाँसुरी बजाते हुए जिसकी धुन से समस्त सृष्टि मोहित हो जाती है।',
        attributes: ['Flute', 'Tribhanga Pose', 'Enchanting Music'],
      },
      {
        name: 'Govardhandhari',
        nameHi: 'गोवर्धनधारी',
        description: 'Krishna lifting the Govardhan mountain on his little finger to protect Vrindavan from Indra\'s wrath and torrential rains for seven days and nights.',
        descriptionHi: 'गोवर्धन पर्वत को छोटी उँगली पर उठाकर वृन्दावन को इन्द्र के क्रोध और सात दिन-रात की मूसलाधार बारिश से बचाने वाले कृष्ण।',
        attributes: ['Govardhan Mountain', 'Protector', 'Little Finger'],
      },
      {
        name: 'Ranchhodrai',
        nameHi: 'रणछोड़राय',
        description: 'The form of Krishna who strategically left the battlefield against Jarasandha (not out of fear but wisdom). Worshipped prominently at the Dakor temple in Gujarat.',
        descriptionHi: 'जरासंध से रणनीतिक रूप से रणभूमि छोड़ने वाले कृष्ण (भय से नहीं, बुद्धिमत्ता से)। गुजरात के डाकोर मन्दिर में प्रमुखता से पूजित।',
        attributes: ['Strategic Retreat', 'Gujarat', 'Dakor Temple'],
      },
      {
        name: 'Jagannath',
        nameHi: 'जगन्नाथ',
        description: 'Lord of the Universe — worshipped in Puri, Odisha. The famous Rath Yatra is held in his honor. Depicted with large round eyes, along with Balabhadra and Subhadra.',
        descriptionHi: 'जगत के नाथ — पुरी, ओडिशा में पूजित। प्रसिद्ध रथ यात्रा उनके सम्मान में। बड़ी गोल आँखें, बलभद्र और सुभद्रा के साथ।',
        attributes: ['Puri', 'Rath Yatra', 'Lord of Universe'],
      },
      {
        name: 'Dwarkadhish',
        nameHi: 'द्वारकाधीश',
        description: 'The King of Dwarka — Krishna in his royal form as the ruler of the golden city of Dwarka in Gujarat.',
        descriptionHi: 'द्वारका के अधीश्वर — गुजरात में स्वर्णिम नगरी द्वारका के शासक के रूप में कृष्ण का राजसी स्वरूप।',
        attributes: ['Dwarka', 'King', 'Gujarat'],
      },
      {
        name: 'Shrinathji',
        nameHi: 'श्रीनाथजी',
        description: 'The seven-year-old form of Krishna lifting Govardhan, worshipped at Nathdwara, Rajasthan. The Pushti Marg sampradaya is centered around this form.',
        descriptionHi: 'गोवर्धन उठाने वाले सात वर्षीय कृष्ण, नाथद्वारा, राजस्थान में पूजित। पुष्टि मार्ग सम्प्रदाय इसी स्वरूप पर केन्द्रित।',
        attributes: ['Nathdwara', 'Pushti Marg', 'Seven-year-old Form'],
      },
    ],
  },
  {
    id: 'ram-parivar',
    title: 'Ram Parivar',
    titleHi: 'राम परिवार',
    subtitle: 'The Divine Family of Lord Rama — Embodiment of Dharma',
    subtitleHi: 'भगवान राम का दिव्य परिवार — धर्म का प्रतीक',
    emoji: '🏹',
    deities: [
      {
        name: 'Bhagwan Ram',
        nameHi: 'भगवान राम',
        description: 'Maryada Purushottam — the ideal man, son, husband, brother, and king. The prince of Ayodhya who defeated Ravana and established Ram Rajya.',
        descriptionHi: 'मर्यादा पुरुषोत्तम — आदर्श पुरुष, पुत्र, पति, भ्राता और राजा। अयोध्या के राजकुमार जिन्होंने रावण का वध कर रामराज्य की स्थापना की।',
        mantra: 'श्री राम जय राम जय जय राम',
        attributes: ['Maryada Purushottam', 'Ayodhya', 'Ram Rajya'],
      },
      {
        name: 'Mata Sita',
        nameHi: 'माता सीता',
        description: 'Daughter of King Janaka and the earth goddess Bhumi Devi. The ideal wife and incarnation of Goddess Lakshmi. She represents patience, devotion, and sacrifice.',
        descriptionHi: 'राजा जनक और भूमि देवी की पुत्री। आदर्श पत्नी और देवी लक्ष्मी का अवतार। धैर्य, भक्ति और त्याग की प्रतीक।',
        attributes: ['Janaka Daughter', 'Lakshmi Avatar', 'Patience'],
      },
      {
        name: 'Lakshman',
        nameHi: 'लक्ष्मण',
        description: 'The loyal younger brother of Rama and incarnation of Shesha Naga. He accompanied Rama during the 14-year exile and played a crucial role in the Lanka war.',
        descriptionHi: 'राम के वफ़ादार छोटे भ्राता और शेषनाग के अवतार। 14 वर्ष के वनवास में राम के साथ रहे और लंका युद्ध में महत्वपूर्ण भूमिका।',
        attributes: ['Shesha Avatar', 'Loyal Brother', 'Lanka War'],
      },
      {
        name: 'Bharat',
        nameHi: 'भरत',
        description: 'The second brother who refused the throne when Rama went to exile. He placed Rama\'s sandals (Paduka) on the throne and ruled as his representative from Nandigram.',
        descriptionHi: 'राम के वनवास जाने पर सिंहासन अस्वीकार करने वाले द्वितीय भ्राता। राम की पादुकाएँ सिंहासन पर रखकर नन्दिग्राम से उनके प्रतिनिधि के रूप में शासन किया।',
        attributes: ['Ram Paduka', 'Selfless', 'Nandigram'],
      },
      {
        name: 'Shatrughna',
        nameHi: 'शत्रुघ्न',
        description: 'The youngest of the four brothers. He killed the demon Lavanasura and established the city of Mathura. His name means "destroyer of enemies".',
        descriptionHi: 'चारों भ्राताओं में सबसे छोटे। राक्षस लवणासुर का वध कर मथुरा नगरी की स्थापना की। नाम का अर्थ — "शत्रुओं का नाश करने वाला"।',
        attributes: ['Youngest Brother', 'Destroyed Lavanasura', 'Mathura'],
      },
    ],
  },
  {
    id: 'saptarishi',
    title: 'Saptarishi',
    titleHi: 'सप्तऋषि',
    subtitle: 'The Seven Great Sages — Pillars of Vedic Knowledge',
    subtitleHi: 'सात महान ऋषि — वैदिक ज्ञान के स्तम्भ',
    emoji: '🧘',
    deities: [
      {
        name: 'Rishi Kashyapa',
        nameHi: 'ऋषि कश्यप',
        description: 'Father of Devas (through Aditi), Asuras (through Diti), and Nagas (through Kadru). Considered the progenitor of all living beings.',
        descriptionHi: 'देवताओं (अदिति से), असुरों (दिति से) और नागों (कद्रू से) के पिता। सभी जीवों के प्रजनक माने जाते हैं।',
        attributes: ['Father of Devas', 'Progenitor', 'Aditi Husband'],
      },
      {
        name: 'Rishi Atri',
        nameHi: 'ऋषि अत्रि',
        description: 'Father of Dattatreya and Chandra (Moon). He and his wife Anasuya are famous for their devotion and hospitality. Manasputra of Brahma.',
        descriptionHi: 'दत्तात्रेय और चन्द्रमा के पिता। पत्नी अनसूया के साथ भक्ति और अतिथि-सत्कार के लिए प्रसिद्ध। ब्रह्मा के मानसपुत्र।',
        attributes: ['Father of Dattatreya', 'Anasuya Husband', 'Moon Father'],
      },
      {
        name: 'Rishi Vasishtha',
        nameHi: 'ऋषि वसिष्ठ',
        description: 'Rajguru of the Ikshvaku dynasty (Surya Vansh) and teacher of Lord Rama. Owner of the divine cow Kamadhenu (Nandini).',
        descriptionHi: 'इक्ष्वाकु वंश (सूर्य वंश) के राजगुरु और भगवान राम के शिक्षक। दिव्य गाय कामधेनु (नन्दिनी) के स्वामी।',
        attributes: ['Rama Guru', 'Kamadhenu', 'Surya Vansh Rajguru'],
      },
      {
        name: 'Rishi Vishwamitra',
        nameHi: 'ऋषि विश्वामित्र',
        description: 'Originally a Kshatriya king who became a Brahmarishi through severe penance. He taught Rama divine weapons and created Trishanku Swarga.',
        descriptionHi: 'मूलतः क्षत्रिय राजा जो कठोर तपस्या से ब्रह्मर्षि बने। राम को दिव्य अस्त्र सिखाए और त्रिशंकु स्वर्ग की रचना की।',
        attributes: ['Brahmarishi', 'Taught Rama', 'Trishanku Swarga'],
      },
      {
        name: 'Rishi Gautama',
        nameHi: 'ऋषि गौतम',
        description: 'Husband of Ahalya. Author of Nyaya Shastra (science of logic) and discoverer of the Godavari river. Ahalya was freed from his curse by Rama.',
        descriptionHi: 'अहल्या के पति। न्याय शास्त्र (तर्कशास्त्र) के रचयिता और गोदावरी नदी के खोजकर्ता। अहल्या राम के स्पर्श से शाप-मुक्त हुईं।',
        attributes: ['Ahalya Husband', 'Nyaya Shastra', 'Godavari'],
      },
      {
        name: 'Rishi Jamadagni',
        nameHi: 'ऋषि जमदग्नि',
        description: 'Father of Parashurama. Killed by King Kartavirya Arjuna, which led Parashurama to destroy the Kshatriya race 21 times in revenge.',
        descriptionHi: 'परशुराम के पिता। राजा कार्तवीर्य अर्जुन ने उनकी हत्या की, प्रतिशोध में परशुराम ने 21 बार क्षत्रियों का नाश किया।',
        attributes: ['Parashurama Father', 'Killed by Kartavirya', 'Renuka Husband'],
      },
      {
        name: 'Rishi Bharadvaja',
        nameHi: 'ऋषि भरद्वाज',
        description: 'Great Vedic scholar, father of Guru Dronacharya. Credited with Ayurveda and Vimana Shastra. He hosted Lord Rama during his exile.',
        descriptionHi: 'महान वैदिक विद्वान, गुरु द्रोणाचार्य के पिता। आयुर्वेद और विमान शास्त्र का ज्ञान। वनवास में भगवान राम का आतिथ्य किया।',
        attributes: ['Drona Father', 'Vimana Shastra', 'Ayurveda'],
      },
    ],
  },
  {
    id: 'ashta-dikpal',
    title: 'Ashta Dikpal',
    titleHi: 'अष्ट दिक्पाल',
    subtitle: 'The Eight Guardians of the Directions',
    subtitleHi: 'आठ दिशाओं के रक्षक देवता',
    emoji: '🧭',
    deities: [
      {
        name: 'Indra (East)',
        nameHi: 'इन्द्र (पूर्व)',
        description: 'King of the gods and guardian of the East. Controls rain, thunder, and lightning. Wields the Vajra and rides Airavata.',
        descriptionHi: 'देवराज और पूर्व दिशा के रक्षक। वर्षा, गर्जना और बिजली के नियन्त्रक। वज्र धारण, ऐरावत पर सवार।',
        attributes: ['East (पूर्व)', 'Vajra', 'Airavata'],
      },
      {
        name: 'Agni (South-East)',
        nameHi: 'अग्नि (आग्नेय)',
        description: 'God of Fire and guardian of the South-East. Messenger between gods and humans. All yajna offerings pass through him.',
        descriptionHi: 'अग्नि देवता और आग्नेय दिशा के रक्षक। देवताओं-मनुष्यों के बीच दूत। सभी यज्ञ आहुतियाँ उनके माध्यम से।',
        attributes: ['South-East (आग्नेय)', 'Fire', 'Messenger'],
      },
      {
        name: 'Yama (South)',
        nameHi: 'यम (दक्षिण)',
        description: 'God of Death and Justice, guardian of the South. Judges souls based on karma. Also known as Dharmaraj.',
        descriptionHi: 'मृत्यु-न्याय के देवता, दक्षिण दिशा के रक्षक। कर्मानुसार आत्माओं का न्याय। धर्मराज नाम से भी प्रसिद्ध।',
        attributes: ['South (दक्षिण)', 'Justice', 'Dharmaraj'],
      },
      {
        name: 'Nairiti (South-West)',
        nameHi: 'निऋति (नैऋत्य)',
        description: 'Guardian of the South-West. Protects against evil spirits and negative energies from this direction.',
        descriptionHi: 'नैऋत्य दिशा के रक्षक। इस दिशा से आने वाली बुरी आत्माओं और नकारात्मक ऊर्जाओं से रक्षा।',
        attributes: ['South-West (नैऋत्य)', 'Rakshasa Lord', 'Protection'],
      },
      {
        name: 'Varuna (West)',
        nameHi: 'वरुण (पश्चिम)',
        description: 'God of Water and guardian of the West. Controls oceans, rivers, and all water bodies. Guardian of moral law (Rita).',
        descriptionHi: 'जल देवता और पश्चिम दिशा के रक्षक। सागर, नदियों और जल निकायों के नियन्त्रक। ऋत के रक्षक।',
        attributes: ['West (पश्चिम)', 'Water', 'Oceans'],
      },
      {
        name: 'Vayu (North-West)',
        nameHi: 'वायु (वायव्य)',
        description: 'God of Wind and guardian of the North-West. He is the breath of life (Prana) and father of Hanuman.',
        descriptionHi: 'वायु देवता और वायव्य दिशा के रक्षक। प्राण (जीवन श्वास) और हनुमान जी के पिता।',
        attributes: ['North-West (वायव्य)', 'Wind', 'Prana'],
      },
      {
        name: 'Kubera (North)',
        nameHi: 'कुबेर (उत्तर)',
        description: 'God of Wealth and guardian of the North. King of Yakshas and divine treasurer. Resides in the golden city Alkapuri.',
        descriptionHi: 'धन देवता और उत्तर दिशा के रक्षक। यक्षों के राजा और दिव्य कोषाध्यक्ष। स्वर्णिम नगरी अलकापुरी में निवास।',
        attributes: ['North (उत्तर)', 'Wealth', 'Alkapuri'],
      },
      {
        name: 'Ishana (North-East)',
        nameHi: 'ईशान (ईशान्य)',
        description: 'A form of Lord Shiva and guardian of the North-East — the most auspicious direction in Vastu Shastra. Represents purity and divinity.',
        descriptionHi: 'शिव का एक रूप और ईशान्य दिशा के रक्षक — वास्तु शास्त्र में सबसे शुभ दिशा। पवित्रता और दिव्यता के प्रतीक।',
        attributes: ['North-East (ईशान्य)', 'Shiva Form', 'Most Auspicious'],
      },
    ],
  },
  {
    id: 'pavitra-nadi',
    title: 'Pavitra Nadi Deviyan',
    titleHi: 'पवित्र नदी देवियाँ',
    subtitle: 'The Seven Sacred Rivers worshipped as Goddesses',
    subtitleHi: 'सात पवित्र नदियाँ जो देवी रूप में पूजित हैं',
    emoji: '🌊',
    deities: [
      {
        name: 'Ganga',
        nameHi: 'गंगा',
        description: 'The holiest river. Descended from heaven through Shiva\'s matted hair. A bath in the Ganga washes away all sins. Daughter of Himavan and sister of Parvati.',
        descriptionHi: 'सबसे पवित्र नदी। शिव की जटाओं से स्वर्ग से अवतरित। गंगा स्नान से सभी पापों का नाश। हिमवान की पुत्री, पार्वती की बहन।',
        mantra: 'ॐ नमो गंगायै विश्वरूपिण्यै नमः',
        attributes: ['Holiest River', 'Shiva Hair', 'Sin Purifier'],
      },
      {
        name: 'Yamuna',
        nameHi: 'यमुना',
        description: 'Daughter of Surya Dev and sister of Yama. Flows through Mathura-Vrindavan, Krishna\'s land. Bathing frees from fear of death.',
        descriptionHi: 'सूर्य देव की पुत्री और यम की बहन। मथुरा-वृन्दावन (कृष्ण की लीलास्थली) से बहती हैं। स्नान से मृत्यु भय से मुक्ति।',
        attributes: ['Surya Daughter', 'Krishna River', 'Mathura'],
      },
      {
        name: 'Saraswati',
        nameHi: 'सरस्वती',
        description: 'The ancient river now flowing underground (gupt). Joins Ganga-Yamuna at Triveni Sangam in Prayagraj. Represents knowledge and wisdom.',
        descriptionHi: 'प्राचीन नदी, अब भूमिगत (गुप्त)। प्रयागराज में त्रिवेणी संगम पर गंगा-यमुना से मिलती हैं। ज्ञान और विवेक की प्रतीक।',
        attributes: ['Underground', 'Triveni Sangam', 'Knowledge'],
      },
      {
        name: 'Godavari',
        nameHi: 'गोदावरी',
        description: 'The Dakshin Ganga (Ganga of the South). Originates in Nashik from Rishi Gautama\'s ashram. Longest river of South India.',
        descriptionHi: 'दक्षिण की गंगा। ऋषि गौतम के आश्रम से नासिक में उद्गम। दक्षिण भारत की सबसे लम्बी नदी।',
        attributes: ['Dakshin Ganga', 'Nashik', 'Rishi Gautama'],
      },
      {
        name: 'Narmada',
        nameHi: 'नर्मदा',
        description: 'The river whose darshan (sight) alone purifies — unlike others needing a bath. Originates from Amarkantak, Madhya Pradesh. Narmada Parikrama is a sacred pilgrimage.',
        descriptionHi: 'दर्शन मात्र से पवित्र करने वाली नदी। अमरकंटक, मध्य प्रदेश से उद्गम। नर्मदा परिक्रमा पवित्र तीर्थयात्रा है।',
        attributes: ['Darshan Purifies', 'Amarkantak', 'Parikrama'],
      },
      {
        name: 'Sindhu',
        nameHi: 'सिन्धु',
        description: 'The great Indus river — India gets its name from it ("Hindu" from "Sindhu"). One of the most important Rig Vedic rivers. Indus Valley civilization flourished on its banks.',
        descriptionHi: 'महान सिन्धु नदी — भारत (India) का नाम इसी से ("हिन्दू" सिन्धु से)। ऋग्वेद की महत्वपूर्ण नदी। सिन्धु घाटी सभ्यता इसके तट पर फली-फूली।',
        attributes: ['India Namesake', 'Rig Veda', 'Indus Civilization'],
      },
      {
        name: 'Kaveri',
        nameHi: 'कावेरी',
        description: 'Sacred river of South India, the Ganga of the South. Originates in Talakaveri, Coorg, Karnataka. Ranganathaswamy temple in Srirangam is on a Kaveri island.',
        descriptionHi: 'दक्षिण भारत की पवित्र नदी, दक्षिण की गंगा। तलकावेरी, कूर्ग, कर्नाटक से उद्गम। श्रीरंगम का रंगनाथस्वामी मन्दिर कावेरी द्वीप पर।',
        attributes: ['South India', 'Talakaveri', 'Srirangam'],
      },
    ],
  },
  {
    id: 'divya-vahan',
    title: 'Divya Vahan',
    titleHi: 'दिव्य वाहन',
    subtitle: 'The Sacred Mounts of the Gods — Each has deep symbolism',
    subtitleHi: 'देवताओं के पवित्र वाहन — प्रत्येक का गहरा प्रतीकात्मक अर्थ',
    emoji: '🦅',
    deities: [
      {
        name: 'Garuda (Vishnu)',
        nameHi: 'गरुड़ (विष्णु)',
        description: 'The divine eagle — king of birds and mount of Vishnu. Sworn enemy of serpents. Symbolizes speed, power, and the Vedas. Son of Kashyapa and Vinata.',
        descriptionHi: 'दिव्य गरुड़ — पक्षियों के राजा, विष्णु के वाहन। नागों के कट्टर शत्रु। गति, शक्ति और वेदों के प्रतीक। कश्यप और विनता के पुत्र।',
        attributes: ['Vishnu', 'Eagle', 'King of Birds'],
      },
      {
        name: 'Nandi (Shiva)',
        nameHi: 'नंदी (शिव)',
        description: 'The sacred bull — gatekeeper and mount of Shiva. Sits facing the Shivalinga in every Shiva temple. Symbolizes dharma, strength, and devotion.',
        descriptionHi: 'पवित्र वृषभ — शिव के द्वारपाल और वाहन। प्रत्येक शिव मन्दिर में शिवलिंग की ओर मुख। धर्म, बल और भक्ति के प्रतीक।',
        attributes: ['Shiva', 'Bull', 'Gatekeeper'],
      },
      {
        name: 'Mushak (Ganesh)',
        nameHi: 'मूषक (गणेश)',
        description: 'The mouse — mount of Ganesh. Tiny yet carries the massive Ganesh. Symbolizes that even the smallest can carry the greatest burden with devotion.',
        descriptionHi: 'मूषक (चूहा) — गणेश जी के वाहन। छोटा होकर भी विशाल गणेश को वहन करता है। भक्ति से छोटा प्राणी भी बड़ा भार उठा सकता है।',
        attributes: ['Ganesh', 'Mouse', 'Humility'],
      },
      {
        name: 'Hamsa (Brahma/Saraswati)',
        nameHi: 'हंस (ब्रह्मा/सरस्वती)',
        description: 'The divine swan — mount of Brahma and Saraswati. Has the legendary ability to separate milk from water, symbolizing Viveka (discrimination).',
        descriptionHi: 'दिव्य हंस — ब्रह्मा-सरस्वती के वाहन। दूध-पानी अलग करने की क्षमता — विवेक (सत्य-माया भेद) का प्रतीक।',
        attributes: ['Brahma & Saraswati', 'Swan', 'Viveka'],
      },
      {
        name: 'Mayura (Kartikeya)',
        nameHi: 'मयूर (कार्तिकेय)',
        description: 'The peacock (Paravani) — mount of Kartikeya. Symbolizes beauty, grace, and power to destroy serpents (ignorance).',
        descriptionHi: 'मयूर (परवानी) — कार्तिकेय के वाहन। सौन्दर्य, शालीनता और सर्पों (अज्ञान) को नष्ट करने की शक्ति का प्रतीक।',
        attributes: ['Kartikeya', 'Peacock', 'Beauty'],
      },
      {
        name: 'Uluka (Lakshmi)',
        nameHi: 'उलूक (लक्ष्मी)',
        description: 'The owl — mount of Lakshmi. Sees in darkness, symbolizing the ability to find wealth where others see nothing. Also warns against blind greed.',
        descriptionHi: 'उलूक (उल्लू) — लक्ष्मी के वाहन। अन्धकार में देखने की क्षमता — जहाँ दूसरों को कुछ न दिखे वहाँ धन देखना। अन्धी लालसा से चेतावनी भी।',
        attributes: ['Lakshmi', 'Owl', 'Sees in Darkness'],
      },
      {
        name: 'Simha (Durga)',
        nameHi: 'सिंह (दुर्गा)',
        description: 'The lion — mount of Durga. Symbolizes raw power, courage, and ability to overcome evil. Durga rode the lion against Mahishasura.',
        descriptionHi: 'सिंह — दुर्गा के वाहन। अदम्य शक्ति, साहस और बुराई पर विजय का प्रतीक। दुर्गा ने सिंह पर सवार होकर महिषासुर से युद्ध किया।',
        attributes: ['Durga', 'Lion', 'Power & Courage'],
      },
      {
        name: 'Airavata (Indra)',
        nameHi: 'ऐरावत (इन्द्र)',
        description: 'The white elephant with multiple tusks — mount of Indra. Emerged from Samudra Manthan, king of elephants. Can produce clouds and rain.',
        descriptionHi: 'अनेक दन्तों वाला श्वेत हाथी — इन्द्र के वाहन। समुद्र मंथन से प्रकट, गजराज। बादल और वर्षा उत्पन्न कर सकते हैं।',
        attributes: ['Indra', 'White Elephant', 'Cloud Maker'],
      },
    ],
  },
  {
    id: 'vishnu-roop',
    title: 'Bhagwan Vishnu ke Anya Prasiddh Roop',
    titleHi: 'भगवान विष्णु के अन्य प्रसिद्ध रूप',
    subtitle: 'Other Famous Forms of Lord Vishnu at major pilgrimage temples',
    subtitleHi: 'प्रमुख तीर्थ मन्दिरों में पूजित विष्णु के अन्य प्रसिद्ध स्वरूप',
    emoji: '📿',
    deities: [
      {
        name: 'Venkateswara (Tirupati Balaji)',
        nameHi: 'वेंकटेश्वर (तिरुपति बालाजी)',
        description: 'The most visited Hindu temple deity in the world at Tirumala, Andhra Pradesh. Millions visit annually and offer their hair as devotion.',
        descriptionHi: 'विश्व के सबसे अधिक दर्शन किए जाने वाले हिन्दू मन्दिर के देवता, तिरुमला, आन्ध्र प्रदेश। करोड़ों भक्त प्रतिवर्ष बाल अर्पित करते हैं।',
        attributes: ['Tirumala', 'Most Visited', 'Andhra Pradesh'],
      },
      {
        name: 'Ranganatha',
        nameHi: 'रंगनाथ',
        description: 'Vishnu reclining on Shesha at Srirangam, Tamil Nadu — one of the largest Hindu temples. Presiding deity of Sri Vaishnavism.',
        descriptionHi: 'श्रीरंगम, तमिलनाडु में शेषनाग पर शयन मुद्रा में विष्णु। सबसे बड़े हिन्दू मन्दिरों में से एक। श्री वैष्णव सम्प्रदाय के अधिष्ठाता।',
        attributes: ['Srirangam', 'Reclining Pose', 'Sri Vaishnavism'],
      },
      {
        name: 'Padmanabha',
        nameHi: 'पद्मनाभ',
        description: 'Vishnu reclining on Ananta, lotus from navel from which Brahma is born. Padmanabhaswamy temple in Thiruvananthapuram is one of the richest temples.',
        descriptionHi: 'अनन्त शेष पर शयन करते विष्णु, नाभि से कमल और उससे ब्रह्मा। तिरुवनन्तपुरम का पद्मनाभस्वामी मन्दिर सबसे धनी मन्दिरों में से एक।',
        attributes: ['Lotus Navel', 'Thiruvananthapuram', 'Richest Temple'],
      },
      {
        name: 'Badrinath',
        nameHi: 'बद्रीनाथ',
        description: 'Vishnu in meditative form at Badrinath, Uttarakhand — a Char Dham site at 10,279 feet in the Himalayas, open only 6 months a year.',
        descriptionHi: 'बद्रीनाथ, उत्तराखण्ड में ध्यान मुद्रा में विष्णु — चार धाम, हिमालय में 10,279 फ़ीट पर, वर्ष में 6 महीने खुला।',
        attributes: ['Char Dham', 'Uttarakhand', 'Himalayas'],
      },
      {
        name: 'Vitthal (Pandharpur)',
        nameHi: 'विट्ठल (पंढरपुर)',
        description: 'Vishnu/Krishna standing on a brick at Pandharpur, Maharashtra. The Warkari Wari pilgrimage is one of the largest in India.',
        descriptionHi: 'पंढरपुर, महाराष्ट्र में ईंट पर खड़े विष्णु/कृष्ण। वारकरी वारी यात्रा भारत की सबसे बड़ी तीर्थयात्राओं में से एक।',
        attributes: ['Pandharpur', 'Warkari', 'Maharashtra'],
      },
    ],
  },
  {
    id: 'vanar-sena',
    title: 'Vanar Sena ke Pramukh',
    titleHi: 'वानर सेना के प्रमुख',
    subtitle: 'Great Warriors of Rama\'s Monkey Army in Ramayana',
    subtitleHi: 'रामायण में भगवान राम की वानर सेना के महान योद्धा',
    emoji: '🐒',
    deities: [
      {
        name: 'Hanuman',
        nameHi: 'हनुमान',
        description: 'The supreme commander. Son of Vayu Dev. Crossed the ocean, found Sita, burnt Lanka, and carried the Sanjeevani mountain.',
        descriptionHi: 'सर्वोच्च सेनापति। वायुदेव के पुत्र। समुद्र पार किया, सीता को खोजा, लंका जलाई, संजीवनी पर्वत लाए।',
        mantra: 'ॐ हनुमते नमः',
        attributes: ['Supreme Commander', 'Vayu Putra', 'Lanka Dahan'],
      },
      {
        name: 'Sugriva',
        nameHi: 'सुग्रीव',
        description: 'King of Kishkindha. Rama helped him defeat Bali; in return he provided the entire Vanar army for the Lanka campaign.',
        descriptionHi: 'किष्किन्धा के राजा। राम ने बालि वध में सहायता की; बदले में लंका अभियान के लिए पूरी वानर सेना दी।',
        attributes: ['King of Kishkindha', 'Bali Brother', 'Rama Ally'],
      },
      {
        name: 'Angad',
        nameHi: 'अंगद',
        description: 'Son of Bali. Sent as Rama\'s ambassador to Ravana\'s court, he planted his foot and challenged anyone to move it — none could.',
        descriptionHi: 'बालि के पुत्र। राम के दूत के रूप में रावण के दरबार में पैर जमाया — कोई न हिला सका।',
        attributes: ['Bali Son', 'Ambassador', 'Immovable Foot'],
      },
      {
        name: 'Jambavan',
        nameHi: 'जाम्बवन्त',
        description: 'The king of bears (Riksha Raja) and wisest member. He reminded Hanuman of his forgotten powers, motivating the ocean crossing.',
        descriptionHi: 'भालुओं के राजा (ऋक्ष राज) और सबसे बुद्धिमान सदस्य। हनुमान को भुलाई शक्तियों की याद दिलाकर समुद्र पार करने को प्रेरित किया।',
        attributes: ['Bear King', 'Wisest', 'Motivated Hanuman'],
      },
      {
        name: 'Nal',
        nameHi: 'नल',
        description: 'The divine engineer, son of Vishwakarma. Designed and built Ram Setu. Every stone he placed floated on water by divine grace.',
        descriptionHi: 'दिव्य अभियन्ता, विश्वकर्मा के पुत्र। रामसेतु का निर्माण किया। दिव्य कृपा से उनका रखा हर पत्थर जल पर तैरता था।',
        attributes: ['Ram Setu Builder', 'Vishwakarma Son', 'Engineer'],
      },
      {
        name: 'Neel',
        nameHi: 'नील',
        description: 'Commander of the Vanar army, son of Agni Dev. Had the boon that anything he touched in battle would turn to ash.',
        descriptionHi: 'वानर सेना के सेनापति, अग्नि देव के पुत्र। वरदान — युद्ध में उनके स्पर्श से कोई भी वस्तु भस्म हो जाए।',
        attributes: ['Army Commander', 'Agni Son', 'Touch of Fire'],
      },
    ],
  },
]

/* ─── FAQ Data ─── */
const FAQ_DATA = [
  {
    q: '33 कोटि का मतलब क्या है?',
    qEn: 'What does 33 Koti mean?',
    a: '"कोटि" का अर्थ "प्रकार" (type) है, "करोड़" नहीं। बृहदारण्यक उपनिषद् के अनुसार 33 प्रकार: 8 वसु + 11 रुद्र + 12 आदित्य + 1 इन्द्र + 1 प्रजापति = 33।',
  },
  {
    q: 'सबसे पहले किस देवता की पूजा होती है?',
    qEn: 'Which deity is worshipped first?',
    a: 'गणेश जी — वे "प्रथम पूज्य" और "विघ्नहर्ता" हैं। किसी भी शुभ कार्य, पूजा या अनुष्ठान से पहले सबसे पहले गणेश जी की पूजा की जाती है।',
  },
  {
    q: 'त्रिमूर्ति और त्रिदेवी में क्या अंतर है?',
    qEn: 'What is the difference between Trimurti and Tridevi?',
    a: 'त्रिमूर्ति = ब्रह्मा, विष्णु, महेश — सृष्टि के तीन देव। त्रिदेवी = सरस्वती, लक्ष्मी, पार्वती — इन तीनों की शक्तियाँ (consorts)।',
  },
  {
    q: 'चिरंजीवी कौन हैं?',
    qEn: 'Who are the Chiranjeevis?',
    a: 'सात चिरंजीवी जो कलियुग के अंत तक जीवित: अश्वत्थामा, बलि, व्यास, हनुमान, विभीषण, कृपाचार्य, परशुराम। "अश्वत्थामा बलिर्व्यासो हनुमांश्च विभीषणः। कृपः परशुरामश्च सप्तैते चिरंजीविनः॥"',
  },
  {
    q: 'नवग्रह पूजा क्यों करते हैं?',
    qEn: 'Why is Navagraha Puja performed?',
    a: 'नवग्रह पूजा ग्रहों के अशुभ प्रभावों को कम करने और शुभ प्रभावों को बढ़ाने के लिए की जाती है। ये नौ ग्रह मानव जीवन के विभिन्न पहलुओं को प्रभावित करते हैं।',
  },
  {
    q: 'दशावतार का क्रम क्या है?',
    qEn: 'What is the order of Dashavatar?',
    a: 'मत्स्य, कूर्म, वराह, नरसिंह, वामन, परशुराम, राम, कृष्ण, बुद्ध, कल्कि — विष्णु के 10 अवतार। पहले 9 हो चुके, कल्कि भविष्य में आएंगे।',
  },
  {
    q: 'शिव जी के कितने रूप हैं?',
    qEn: 'How many forms does Lord Shiva have?',
    a: 'शिव के अनेक रूप हैं — रुद्र (संहारक), नटराज (नृत्य), दक्षिणामूर्ति (गुरु), अर्धनारीश्वर (शिव-शक्ति), भैरव (रक्षक), पशुपतिनाथ, महाकाल आदि। 11 रुद्र रूप प्रमुख माने जाते हैं।',
  },
  {
    q: 'हनुमान जी को बजरंगबली क्यों कहते हैं?',
    qEn: 'Why is Hanuman called Bajrangbali?',
    a: '"बजरंग" = वज्र अंग (वज्र जैसा शरीर), "बली" = बलशाली। इन्द्र के वज्र प्रहार से भी उनका शरीर अक्षत रहा, तभी से वे बजरंगबली कहलाए। उनके शरीर को कोई शस्त्र भेद नहीं सकता।',
  },
  {
    q: 'माता दुर्गा के नौ रूप कौन से हैं?',
    qEn: 'What are the nine forms of Goddess Durga (Navdurga)?',
    a: 'शैलपुत्री, ब्रह्मचारिणी, चन्द्रघण्टा, कूष्माण्डा, स्कन्दमाता, कात्यायनी, कालरात्रि, महागौरी, सिद्धिदात्री — नवरात्रि के 9 दिनों में इनकी पूजा होती है।',
  },
  {
    q: 'समुद्र मंथन में क्या-क्या निकला?',
    qEn: 'What emerged from Samudra Manthan (Ocean Churning)?',
    a: '14 रत्न: हलाहल (विष), कामधेनु, उच्चैःश्रवा (घोड़ा), ऐरावत (हाथी), कौस्तुभ मणि, कल्पवृक्ष, रम्भा (अप्सरा), लक्ष्मी, वारुणी, धन्वन्तरि, चन्द्रमा, शंख, धनुष, अमृत।',
  },
  {
    q: 'पूजा में कलश क्यों रखते हैं?',
    qEn: 'Why is a Kalash placed during puja?',
    a: 'कलश समुद्र मंथन और सृष्टि का प्रतीक है। जल = सृष्टि का मूल, नारियल = देवताओं का आशीर्वाद, आम के पत्ते = पंचतत्व, कलश = पृथ्वी। यह सम्पूर्ण ब्रह्माण्ड का प्रतिनिधित्व करता है।',
  },
  {
    q: 'शिवलिंग का क्या अर्थ है?',
    qEn: 'What is the meaning of Shivlinga?',
    a: '"लिंग" = चिन्ह/प्रतीक। शिवलिंग निराकार ब्रह्म (परमात्मा) का प्रतीक है। अण्डाकार भाग = ब्रह्माण्ड, जलहरी = प्रकृति (शक्ति)। यह सृजन और विलय दोनों का प्रतीक है। 12 ज्योतिर्लिंग प्रमुख हैं।',
  },
  {
    q: 'भगवान कृष्ण ने गीता में क्या मुख्य सन्देश दिया?',
    qEn: 'What is the main message of the Bhagavad Gita?',
    a: '"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" — कर्म करो, फल की चिन्ता मत करो। गीता में कर्मयोग, भक्तियोग और ज्ञानयोग तीनों मार्गों से मोक्ष प्राप्ति का उपदेश है।',
  },
  {
    q: 'तुलसी का पौधा इतना पवित्र क्यों माना जाता है?',
    qEn: 'Why is the Tulsi plant considered so sacred?',
    a: 'तुलसी भगवान विष्णु को सर्वाधिक प्रिय हैं। बिना तुलसीदल के विष्णु पूजा अधूरी मानी जाती है। तुलसी में औषधीय गुण भी अपार हैं — वायु शोधन, रोग प्रतिरोधक क्षमता, और आध्यात्मिक शुद्धि।',
  },
  {
    q: 'चार धाम कौन से हैं और क्यों महत्वपूर्ण हैं?',
    qEn: 'What are the Char Dham and why are they important?',
    a: 'बद्रीनाथ (उत्तर), रामेश्वरम (दक्षिण), द्वारका (पश्चिम), पुरी (पूर्व) — शंकराचार्य ने चारों दिशाओं में स्थापित किए। इनकी यात्रा से मोक्ष की प्राप्ति मानी जाती है।',
  },
  {
    q: 'प्रसाद का क्या महत्व है?',
    qEn: 'What is the significance of Prasad?',
    a: 'प्रसाद = भगवान की कृपा। पूजा में अर्पित भोग भगवान द्वारा स्वीकार होने के बाद "प्रसाद" बन जाता है। इसे ग्रहण करने से पाप नष्ट, पुण्य प्राप्त और मन शुद्ध होता है। प्रसाद कभी अस्वीकार नहीं करना चाहिए।',
  },
  {
    q: 'ॐ (ओम) का क्या अर्थ है?',
    qEn: 'What is the meaning of Om?',
    a: 'ॐ सृष्टि की प्रथम ध्वनि और परब्रह्म का प्रतीक है। अ = सृष्टि (ब्रह्मा), उ = स्थिति (विष्णु), म = संहार (शिव)। तीनों मिलकर ॐ = सम्पूर्ण ब्रह्माण्ड। सभी मंत्रों का बीज ॐ है।',
  },
]

/* ─── Page Component ─── */

export default function DeitiesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedDeity, setExpandedDeity] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const navRef = useRef<HTMLElement>(null)

  const checkScroll = useCallback(() => {
    const el = navRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }, [])

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scrollNav = (dir: 'left' | 'right') => {
    const el = navRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -250 : 250, behavior: 'smooth' })
  }

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return DEITY_CATEGORIES
    const term = search.trim().toLowerCase()
    return DEITY_CATEGORIES.map(cat => ({
      ...cat,
      deities: cat.deities.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.nameHi.includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.descriptionHi.includes(term) ||
        d.attributes?.some(a => a.toLowerCase().includes(term))
      ),
    })).filter(cat => cat.deities.length > 0)
  }, [search])

  const totalDeities = DEITY_CATEGORIES.reduce((sum, cat) => sum + cat.deities.length, 0)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-border">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dc2qg7bwr/image/upload/v1774363519/hero-bg.jpg.jpg')` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Warm saffron tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/40 via-transparent to-primary/20" />
        <div className="page-container py-14 md:py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-display-lg font-serif text-white leading-tight">
              देवी-देवता <span className="text-primary-300">Deities</span>
            </h1>
            <p className="mt-3 text-body text-white/75 max-w-3xl">
              Hindu dharma mein 33 Koti (33 prakar/types) devi-devta maane jate hain — Explore the divine pantheon of Hindu deities organized by their sacred categories.
            </p>
            <p className="mt-1 text-body-sm text-white/60 max-w-3xl font-devanagari">
              हिन्दू धर्म में ३३ कोटि (३३ प्रकार) देवी-देवता माने जाते हैं — सभी प्रमुख और पूज्य देवी-देवताओं की विस्तृत सूची
            </p>
            <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />

            {/* Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="stat-pill">🕉️ {totalDeities} Deities</span>
              <span className="stat-pill">📂 {DEITY_CATEGORIES.length} Categories</span>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-xl">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search deities by name, description..."
                  className="input pl-12 py-3.5 rounded-2xl w-full text-body"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Category Nav */}
      <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-surface-border/50">
        <div className="page-container py-3">
          <div className="relative flex items-center">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollNav('left')}
                className="absolute left-0 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-surface shadow-md border border-surface-border text-ink-muted hover:text-ink hover:shadow-lg transition-all shrink-0"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Left Fade */}
            {canScrollLeft && (
              <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-surface/80 to-transparent z-10 pointer-events-none" />
            )}

            <nav ref={navRef} className="flex items-center gap-2 overflow-x-auto scrollbar-none px-10" aria-label="Category filter">
              <button
                type="button"
                className="category-pill whitespace-nowrap flex-shrink-0"
                data-active={activeCategory === null ? 'true' : 'false'}
                onClick={() => setActiveCategory(null)}
              >
                🕉️ All
              </button>
              {DEITY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="category-pill whitespace-nowrap flex-shrink-0"
                  data-active={activeCategory === cat.id ? 'true' : 'false'}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    document.getElementById('deity-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  {cat.emoji} {cat.titleHi}
                </button>
              ))}
            </nav>

            {/* Right Fade */}
            {canScrollRight && (
              <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-surface/80 to-transparent z-10 pointer-events-none" />
            )}

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollNav('right')}
                className="absolute right-0 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-surface shadow-md border border-surface-border text-ink-muted hover:text-ink hover:shadow-lg transition-all shrink-0"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 33 Koti Devta Explanation */}
      <section className="page-container py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <span className="text-4xl mb-3 block">🕉️</span>
            <h2 className="text-display-sm font-serif text-secondary-800">३३ कोटि देवता</h2>
            <p className="text-h4 text-primary-700 font-semibold mt-1">33 Koti Devta — The 33 Types of Deities</p>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Explanation Card */}
            <div className="card p-6 sm:p-8 mb-8">
              <p className="text-body text-ink leading-relaxed font-devanagari">
                <strong>&#39;कोटि&#39;</strong> शब्द का अर्थ <strong>&#39;प्रकार&#39;</strong> (type/category) है, न कि &#39;करोड़&#39; (crore)। वेदों के अनुसार, विशेषकर <strong>बृहदारण्यक उपनिषद्</strong> (3.9.1-9) में ऋषि याज्ञवल्क्य ने शाकल्य को बताया कि देवताओं की संख्या <strong>३३</strong> है, जो ३३ प्रकारों/श्रेणियों में विभाजित हैं।
              </p>
              <p className="text-body text-ink leading-relaxed mt-3">
                The word <strong>&lsquo;Koti&rsquo;</strong> means <strong>&lsquo;type&rsquo;</strong> or &lsquo;category&rsquo;, NOT &lsquo;crore&rsquo; (10 million). According to the <strong>Brihadaranyaka Upanishad</strong> (3.9.1-9), Rishi Yajnavalkya told Shakalya that there are exactly <strong>33 deities</strong>, classified into 33 types/categories.
              </p>
            </div>

            {/* The 33 Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* 8 Vasu */}
              <div className="card p-5 border-l-4 border-l-amber-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold text-lg">8</span>
                  <div>
                    <h3 className="text-h4 font-serif text-secondary-800">अष्ट वसु</h3>
                    <p className="text-caption text-primary-600 font-medium">Ashta Vasu</p>
                  </div>
                </div>
                <p className="text-body-sm text-ink-muted mb-3">प्रकृति के मूल तत्व — Elements of Nature that sustain life</p>
                <div className="space-y-1.5">
                  {[
                    { hi: 'धरा (पृथ्वी)', en: 'Dhara — Earth' },
                    { hi: 'अनल (अग्नि)', en: 'Anala — Fire' },
                    { hi: 'अप (जल)', en: 'Apa — Water' },
                    { hi: 'अनिल (वायु)', en: 'Anila — Wind' },
                    { hi: 'ध्रुव (नक्षत्र)', en: 'Dhruva — Pole Star / Stars' },
                    { hi: 'सोम (चन्द्रमा)', en: 'Soma — Moon' },
                    { hi: 'प्रत्यूष (सूर्य)', en: 'Pratyusha — Dawn / Sun' },
                    { hi: 'प्रभास (आकाश)', en: 'Prabhasa — Sky / Light' },
                  ].map((v, i) => (
                    <div key={i} className="flex items-start gap-2 text-body-sm">
                      <span className="text-amber-500 mt-0.5 font-bold">{i + 1}.</span>
                      <div>
                        <span className="font-devanagari text-ink font-medium">{v.hi}</span>
                        <span className="text-ink-muted ml-1.5 text-caption">— {v.en.split('—')[1]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11 Rudra */}
              <div className="card p-5 border-l-4 border-l-red-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-700 font-bold text-lg">11</span>
                  <div>
                    <h3 className="text-h4 font-serif text-secondary-800">एकादश रुद्र</h3>
                    <p className="text-caption text-primary-600 font-medium">Ekadash Rudra</p>
                  </div>
                </div>
                <p className="text-body-sm text-ink-muted mb-3">शिव के ११ रूप — 11 Forms of Rudra (Shiva)</p>
                <div className="space-y-1.5">
                  {[
                    { hi: 'कपाली', en: 'Kapali' },
                    { hi: 'पिंगल', en: 'Pingala' },
                    { hi: 'भीम', en: 'Bheema' },
                    { hi: 'विरूपाक्ष', en: 'Virupaksha' },
                    { hi: 'विलोहित', en: 'Vilohita' },
                    { hi: 'अजपाद', en: 'Ajapaada' },
                    { hi: 'अहिर्बुध्न्य', en: 'Ahirbudhnya' },
                    { hi: 'शम्भु', en: 'Shambhu' },
                    { hi: 'चण्ड', en: 'Chanda' },
                    { hi: 'भव', en: 'Bhava' },
                    { hi: 'महादेव', en: 'Mahadeva' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-body-sm">
                      <span className="text-red-500 mt-0.5 font-bold">{i + 1}.</span>
                      <div>
                        <span className="font-devanagari text-ink font-medium">{r.hi}</span>
                        <span className="text-ink-muted ml-1.5 text-caption">({r.en})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12 Aditya */}
              <div className="card p-5 border-l-4 border-l-orange-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-700 font-bold text-lg">12</span>
                  <div>
                    <h3 className="text-h4 font-serif text-secondary-800">द्वादश आदित्य</h3>
                    <p className="text-caption text-primary-600 font-medium">Dwadash Aditya</p>
                  </div>
                </div>
                <p className="text-body-sm text-ink-muted mb-3">माता अदिति के १२ पुत्र — 12 Solar deities, sons of Aditi</p>
                <div className="space-y-1.5">
                  {[
                    { hi: 'विवस्वान (सूर्य)', en: 'Vivasvan' },
                    { hi: 'अर्यमा', en: 'Aryama' },
                    { hi: 'पूषा', en: 'Pusha' },
                    { hi: 'त्वष्टा', en: 'Tvashta' },
                    { hi: 'सविता', en: 'Savita' },
                    { hi: 'भग', en: 'Bhaga' },
                    { hi: 'धाता', en: 'Dhata' },
                    { hi: 'विधाता', en: 'Vidhata' },
                    { hi: 'वरुण', en: 'Varuna' },
                    { hi: 'मित्र', en: 'Mitra' },
                    { hi: 'इन्द्र', en: 'Indra' },
                    { hi: 'विष्णु (त्रिविक्रम)', en: 'Vishnu (Trivikrama)' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-2 text-body-sm">
                      <span className="text-orange-500 mt-0.5 font-bold">{i + 1}.</span>
                      <div>
                        <span className="font-devanagari text-ink font-medium">{a.hi}</span>
                        <span className="text-ink-muted ml-1.5 text-caption">({a.en})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indra + Prajapati */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="card p-5 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold text-lg">1</span>
                  <div>
                    <h3 className="text-h4 font-serif text-secondary-800">इन्द्र</h3>
                    <p className="text-caption text-primary-600 font-medium">Indra</p>
                  </div>
                </div>
                <p className="text-body-sm text-ink leading-relaxed">
                  <span className="font-devanagari">देवताओं के राजा, स्वर्ग के अधिपति। वज्र (बिजली) के स्वामी, वर्षा के नियन्त्रक।</span>
                </p>
                <p className="text-body-sm text-ink-muted mt-1">King of the gods, lord of heaven. Wielder of the Vajra (thunderbolt), controller of rain and storms.</p>
              </div>

              <div className="card p-5 border-l-4 border-l-violet-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 text-violet-700 font-bold text-lg">1</span>
                  <div>
                    <h3 className="text-h4 font-serif text-secondary-800">प्रजापति</h3>
                    <p className="text-caption text-primary-600 font-medium">Prajapati (Brahma)</p>
                  </div>
                </div>
                <p className="text-body-sm text-ink leading-relaxed">
                  <span className="font-devanagari">प्रजाओं के पालक, सृष्टि के रचयिता। ब्रह्मा जी को प्रजापति भी कहा जाता है।</span>
                </p>
                <p className="text-body-sm text-ink-muted mt-1">Lord of all creatures, the Creator. Brahma Ji is also known as Prajapati — the progenitor of all beings.</p>
              </div>
            </div>

            {/* Total Summary */}
            <div className="mt-8 card p-6 bg-gradient-to-r from-primary-50/80 to-accent-50/50 border-primary-200/50">
              <div className="text-center">
                <p className="text-h3 font-devanagari text-secondary-800">
                  ८ वसु + ११ रुद्र + १२ आदित्य + १ इन्द्र + १ प्रजापति = <span className="text-primary-700 font-bold">३३ देवता</span>
                </p>
                <p className="text-body font-semibold text-primary-700 mt-2">
                  8 Vasu + 11 Rudra + 12 Aditya + 1 Indra + 1 Prajapati = <span className="font-bold">33 Deities</span>
                </p>
                <p className="text-body-sm text-ink-muted mt-3 max-w-2xl mx-auto">
                  <span className="font-devanagari">यह वर्गीकरण बृहदारण्यक उपनिषद् (३.९.१-९) में ऋषि याज्ञवल्क्य द्वारा दिया गया है। ये ३३ देवता ही अनन्त रूपों में प्रकट होते हैं, इसलिए हिन्दू धर्म में अनगिनत देवी-देवता पूजे जाते हैं।</span>
                </p>
                <p className="text-caption text-ink-muted mt-2">
                  This classification is from Brihadaranyaka Upanishad (3.9.1-9) by Rishi Yajnavalkya. These 33 deities manifest in infinite forms — hence the vast pantheon of Hindu gods and goddesses.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="divider mt-12" />
      </section>

      {/* Main Content */}
      <main id="deity-content" className="page-container section-sm min-h-screen scroll-mt-20">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-sunken flex items-center justify-center text-2xl">🔍</div>
            <p className="text-body text-ink-muted">No deities found for &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="btn btn-outline btn-sm mt-4">Clear Search</button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredCategories
              .filter(cat => activeCategory === null || cat.id === activeCategory)
              .map((category, catIdx) => (
                <motion.section
                  key={category.id}
                  id={`cat-${category.id}`}
                  className="scroll-mt-20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: catIdx * 0.05 }}
                >
                  {/* Category Header */}
                  <div className="text-center mb-10">
                    <span className="text-4xl mb-3 block">{category.emoji}</span>
                    <h2 className="text-display-sm font-serif text-secondary-800">
                      {category.titleHi}
                    </h2>
                    <p className="text-h4 text-primary-700 font-semibold mt-1">{category.title}</p>
                    <p className="text-body-sm text-ink-muted mt-2 max-w-2xl mx-auto">{category.subtitle}</p>
                    <p className="text-body-sm text-ink-muted font-devanagari">{category.subtitleHi}</p>
                    <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
                  </div>

                  {/* Deity Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.deities.map((deity, idx) => {
                      const isExpanded = expandedDeity === `${category.id}-${idx}`
                      return (
                        <motion.div
                          key={`${category.id}-${idx}`}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: idx * 0.04 }}
                          className="group"
                        >
                          <div
                            className={`card p-6 cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${isExpanded ? 'ring-2 ring-primary/30 shadow-elevated' : ''}`}
                            onClick={() => setExpandedDeity(isExpanded ? null : `${category.id}-${idx}`)}
                          >
                            {/* Deity Name */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                <h3 className="text-h4 font-serif text-secondary-800 group-hover:text-primary-700 transition-colors">
                                  {deity.nameHi}
                                </h3>
                                <p className="text-body-sm text-primary-600 font-medium">{deity.name}</p>
                              </div>
                              <span className={`text-ink-muted text-sm transition-transform duration-200 mt-1 ${isExpanded ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </div>

                            {/* Attributes */}
                            {deity.attributes && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {deity.attributes.slice(0, isExpanded ? undefined : 3).map((attr, i) => (
                                  <span key={i} className="px-2 py-0.5 text-caption font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                                    {attr}
                                  </span>
                                ))}
                                {!isExpanded && deity.attributes.length > 3 && (
                                  <span className="px-2 py-0.5 text-caption text-ink-muted">+{deity.attributes.length - 3}</span>
                                )}
                              </div>
                            )}

                            {/* Short Description */}
                            <p className={`text-body-sm text-ink-muted leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                              {deity.descriptionHi}
                            </p>

                            {/* Expanded Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 pt-4 border-t border-surface-border space-y-3">
                                    {/* English Description */}
                                    <div>
                                      <p className="text-caption font-semibold text-secondary-600 mb-1">English</p>
                                      <p className="text-body-sm text-ink leading-relaxed">{deity.description}</p>
                                    </div>

                                    {/* Mantra */}
                                    {deity.mantra && (
                                      <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100/50">
                                        <p className="text-caption font-semibold text-primary-700 mb-1">मंत्र / Mantra</p>
                                        <p className="text-body-sm font-devanagari text-secondary-800 font-medium">{deity.mantra}</p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.section>
              ))}
          </div>
        )}
      </main>

      {/* FAQ Section */}
      <section className="page-container py-12 md:py-16 border-t border-surface-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <span className="text-3xl mb-2 block">❓</span>
            <h2 className="text-display-sm font-serif text-secondary-800">अक्सर पूछे जाने वाले प्रश्न</h2>
            <p className="text-h4 text-primary-700 font-semibold mt-1">Frequently Asked Questions</p>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <details key={i} className="group card overflow-hidden">
                <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none select-none hover:bg-surface-sunken/50 transition-colors">
                  <div>
                    <p className="text-body font-semibold text-ink font-devanagari">{faq.q}</p>
                    <p className="text-caption text-ink-muted mt-0.5">{faq.qEn}</p>
                  </div>
                  <svg className="w-5 h-5 text-ink-muted shrink-0 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-0 border-t border-surface-border">
                  <p className="text-body-sm text-ink leading-relaxed mt-3 font-devanagari">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}
