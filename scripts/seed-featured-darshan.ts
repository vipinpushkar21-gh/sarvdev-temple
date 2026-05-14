import { connectDB } from '../lib/db'
import Darshan from '../models/Darshan'

const featuredDarshans = [
  {
    title: "श्री विठ्ठल दर्शन पंढरपूर",
    temple: "Vitthal Temple Pandharpur",
    youtubeId: "OHF9DiR60G8",
    description: "Live darshan of Lord Vitthal from Pandharpur",
    status: "approved",
    isLive: true
  },
  {
    title: "Mahakaleshwar Jyotirlinga Temple",
    temple: "Mahakaleshwar Jyotirlinga Temple",
    youtubeId: "AWzzP7_ZsQY",
    description: "Live darshan of Mahakaleshwar Jyotirlinga from Ujjain",
    status: "approved",
    isLive: true
  },
  {
    title: "Kashi Vishwanath Temple",
    temple: "Kashi Vishwanath Temple",
    youtubeId: "djAqGUJEvuc",
    description: "Live darshan of Kashi Vishwanath from Varanasi",
    status: "approved",
    isLive: true
  },
  {
    title: "Shirdi Sai Baba Darshan",
    temple: "Shirdi Sai Baba Temple",
    youtubeId: "SezNZqScc0Y",
    description: "Live darshan of Shirdi Sai Baba",
    status: "approved",
    isLive: true
  },
  {
    title: "Siddhivinayak Live Darshan",
    temple: "Siddhivinayak Temple Mumbai",
    youtubeId: "q5zTnhvPBHQ",
    description: "Live darshan of Siddhivinayak Temple from Mumbai",
    status: "approved",
    isLive: true
  },
  {
    title: "Shree KasthBhanjandev Hanumanji Mandir Salangpur",
    temple: "Kasthbhanjan Hanuman Mandir Salangpur",
    youtubeId: "SrDCZCWmz1U",
    description: "Live darshan of Kasthbhanjan Hanuman Mandir from Salangpur",
    status: "approved",
    isLive: true
  },
  {
    title: "सालासर बालाजी लाइव दर्शन",
    temple: "Salasar Balaji Temple",
    youtubeId: "wIScZcVMgYk",
    description: "Live darshan of Salasar Balaji",
    status: "approved",
    isLive: true
  },
  {
    title: "ठाकुरजी श्री बॉंकेबिहारी जी मंदिर",
    temple: "Banke Bihari Temple Vrindavan",
    youtubeId: "_TreAwpnfyI",
    description: "Live darshan of Banke Bihari Ji from Vrindavan",
    status: "approved",
    isLive: true
  },
  {
    title: "Daily Darshan",
    temple: "Various Temples",
    youtubeId: "mhazhZtzzoI",
    description: "Daily darshan from various temples",
    status: "approved",
    isLive: true
  }
]

async function seedFeaturedDarshan() {
  try {
    await connectDB()
    
    for (const darshan of featuredDarshans) {
      const existing = await Darshan.findOne({ youtubeId: darshan.youtubeId })
      if (!existing) {
        await Darshan.create(darshan)
        console.log(`✅ Added: ${darshan.title}`)
      } else {
        console.log(`⏭️  Skipped (already exists): ${darshan.title}`)
      }
    }
    
    console.log('\n🎉 Featured darshan seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding featured darshan:', error)
    process.exit(1)
  }
}

seedFeaturedDarshan()
