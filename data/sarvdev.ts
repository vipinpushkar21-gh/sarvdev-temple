export type Temple = {
  id: string
  title: string
  description: string
  image?: string
}

export type DailyDarshan = {
  id: string
  title: string
  description: string
  time?: string
  video?: string
}

export type EventItem = {
  id: string
  title: string
  description: string
  date?: string
  image?: string
}

export type Devotional = {
  id: string
  title: string
  description: string
  audio?: string
}

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date?: string
  image?: string
  body?: string
}

const sarvdev = {
  temples: <Temple[]>[
    {
      id: 't1',
      title: 'Kshetra Mandir',
      description: 'A historic temple known for its serene atmosphere and daily rituals.',
      image: '/images/temples/kshetra.jpg',
    },
    {
      id: 't2',
      title: 'Shiva Kovil',
      description: 'Famous for evening aartis and special Mahashivaratri celebrations.',
      image: '/images/temples/shiva-kovil.jpg',
    },
  ],

  dailyDarshan: <DailyDarshan[]>[
    {
      id: 'd1',
      title: 'Morning Aarti - Kshetra Mandir',
      description: 'Daily morning aarti streamed live from the main sanctum.',
      time: '06:00 AM IST',
      video: '/media/daily/morning-aarti.mp4',
    },
    {
      id: 'd2',
      title: 'Evening Aarti - Shiva Kovil',
      description: 'Join the evening aarti with devotional bhajans.',
      time: '07:30 PM IST',
    },
  ],

  events: <EventItem[]>[
    {
      id: 'e1',
      title: 'Rath Yatra Festival',
      description: 'Annual chariot festival with processions and cultural programs.',
      date: '2026-06-21',
      image: '/images/events/rathyatra.jpg',
    },
  ],

  devotionals: <Devotional[]>[
    {
      id: 'v1',
      title: 'Shiva Tandava Stotram',
      description: 'A powerful hymn praising Lord Shiva.',
      audio: '/media/devotionals/shiva-tandava.mp3',
    },
    {
      id: 'v2',
      title: 'Hanuman Chalisa',
      description: 'A devotional hymn to Lord Hanuman.',
    },
  ],

  blogs: <BlogPost[]>[
    {
      id: 'b1',
      title: 'Temple Architecture: A Short Guide',
      excerpt: 'An introduction to common elements of traditional temple architecture and symbolism.',
      date: '2025-09-01',
      image: '/images/blogs/architecture.jpg',
      body: 'Temples often incorporate symbolism... (sample content)\n\nMore text here describing the architecture, history, and significance.'
    },
    {
      id: 'b2',
      title: 'How to Prepare for Darshan',
      excerpt: 'Practical tips for visitors attending darshan and aarti at temples.',
      date: '2025-10-05',
      body: 'Start with a calm mind and dress modestly... (sample guidance)\n\nInclude tips for travel, offerings, and etiquette.'
    },
  ],
}

export default sarvdev
