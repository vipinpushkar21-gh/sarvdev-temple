"use client"

import { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'hi'

type TranslationContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.temples': 'Temples',
    'nav.dailyDarshan': 'Daily Darshan',
    'nav.events': 'Upcoming Events',
    'nav.booking': 'Online Booking',
    'nav.devotionals': 'Devotionals',
    'nav.blog': 'Blog',
    'nav.listTemple': 'List Temple',
    'nav.login': 'Login',
    
    // Homepage
    'home.title': 'Discover temples. Deepen devotion.',
    'home.subtitle': 'Sarvdev connects seekers with temples, live darshan, and devotional resources — thoughtfully curated and accessible.',
    'home.search': 'Search temples, events, blogs...',
    'home.upcomingEvents': 'Upcoming Events',
    'home.virtualDarshan': 'Virtual Darshan',
    'home.exploreFeatures': 'Explore Features',
    
    // Search
    'search.noResults': 'No results found for',
    
    // Features
    'features.templesNear': 'Temples Near You',
    'features.templesDesc': 'Find nearby temples and their timings.',
    'features.liveDarshan': 'Live Darshan',
    'features.liveDarshanDesc': 'Watch live rituals and ceremonies.',
    'features.bookOnline': 'Book Online',
    'features.bookOnlineDesc': 'Reserve slots for darshan or rituals.',
    'features.community': 'Community',
    'features.communityDesc': 'Join groups and devotional communities.',
    'features.explore': 'Explore',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.temples': 'Temples',
    'footer.devotionals': 'Devotionals',
    'footer.events': 'Events',
    'footer.listTemple': 'List Your Temple',
    'footer.contact': 'Contact Us',
    'footer.help': 'Help Center',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.about': 'About the Directory',
    'footer.aboutText': 'Search and discover temples across regions, read about traditions, and find ways to participate in rituals and events. Sarvdev aims to make spiritual resources accessible to everyone.',
    'footer.rights': 'All rights reserved.',
    
    // Temples Page
    'temples.title': 'Temples',
    'temples.subtitle': 'Explore our temple directory and learn about each sacred site.',
    'temples.noTemples': 'No approved temples yet. Check back soon!',
    'temples.loading': 'Loading temples...',
    
    // Temple Detail
    'temple.about': 'About',
    'temple.deity': 'Deity',
    'temple.location': 'Location',
    'temple.templeType': 'Temple Type',
    'temple.established': 'Established',
    'temple.timings': 'Timings',
    'temple.speciality': 'Speciality',
    'temple.contact': 'Contact Information',
    'temple.phone': 'Phone',
    'temple.email': 'Email',
    'temple.website': 'Website',
    'temple.contactPerson': 'Contact Person',
    'temple.socialMedia': 'Social Media',
    'temple.locationMap': 'Location Map',
    'temple.openMaps': 'Open in Google Maps',
    'temple.visitWebsite': 'Visit Website',
    'temple.backToTemples': 'Back to temples',
    'temple.notFound': 'Temple not found',
    'temple.notFoundDesc': 'We couldn\'t find this temple.',
    'temple.noDescription': 'No description available.',
    'temple.viewOnMaps': 'View on Google Maps',
    'temple.openInMaps': 'Open in Google Maps',
    'temple.contactInfo': 'Contact Information',
    
    // List Temple Form
    'form.listTemple': 'List a Temple',
    'form.subtitle': 'Share details about a temple you\'d like to add. We\'ll review submissions before publishing.',
    'form.basicInfo': 'Basic Information',
    'form.templeName': 'Temple Name',
    'form.deity': 'Deity/God',
    'form.selectDeity': 'Select Deity',
    'form.templeType': 'Temple Type',
    'form.selectType': 'Select Type',
    'form.description': 'Description',
    'form.descPlaceholder': 'Describe the temple\'s history, significance, and features...',
    'form.establishedYear': 'Established Year',
    'form.speciality': 'Speciality',
    'form.locationDetails': 'Location Details',
    'form.streetAddress': 'Street Address',
    'form.city': 'City',
    'form.state': 'State',
    'form.selectState': 'Select State',
    'form.pincode': 'Pincode',
    'form.visitInfo': 'Visit Information',
    'form.timings': 'Timings',
    'form.imageUrl': 'Image URL',
    'form.contactInfo': 'Contact Information',
    'form.phone': 'Phone',
    'form.email': 'Email',
    'form.generalContact': 'General Contact',
    'form.website': 'Website',
    'form.facebook': 'Facebook',
    'form.instagram': 'Instagram',
    'form.submit': 'Submit Temple',
    'form.submitting': 'Submitting...',
    'form.success': 'Thank you! Your temple submission has been received and is pending approval.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.getInTouch': 'Get in Touch',
    'contact.message': 'We\'d love to hear from you! Whether you have questions, feedback, or want to list your temple on our platform, feel free to reach out.',
    'contact.sendMessage': 'Send us a Message',
    'contact.name': 'Name',
    'contact.yourName': 'Your name',
    'contact.yourEmail': 'your@email.com',
    'contact.yourMessage': 'Your message...',
    'contact.send': 'Send Message',
  },
  hi: {
    // Header
    'nav.home': 'होम',
    'nav.temples': 'मंदिर',
    'nav.dailyDarshan': 'दैनिक दर्शन',
    'nav.events': 'आगामी कार्यक्रम',
    'nav.booking': 'ऑनलाइन बुकिंग',
    'nav.devotionals': 'भक्ति सामग्री',
    'nav.blog': 'ब्लॉग',
    'nav.listTemple': 'मंदिर सूचीबद्ध करें',
    'nav.login': 'लॉगिन',
    
    // Homepage
    'home.title': 'मंदिरों की खोज करें। भक्ति को गहरा करें।',
    'home.subtitle': 'सर्वदेव साधकों को मंदिरों, लाइव दर्शन और भक्ति संसाधनों से जोड़ता है - सोच-समझकर तैयार और सुलभ।',
    'home.search': 'मंदिर, कार्यक्रम, ब्लॉग खोजें...',
    'home.upcomingEvents': 'आगामी कार्यक्रम',
    'home.virtualDarshan': 'वर्चुअल दर्शन',
    'home.exploreFeatures': 'सुविधाएं देखें',
    
    // Search
    'search.noResults': 'कोई परिणाम नहीं मिला',
    
    // Features
    'features.templesNear': 'आपके पास के मंदिर',
    'features.templesDesc': 'नजदीकी मंदिर और उनका समय खोजें।',
    'features.liveDarshan': 'लाइव दर्शन',
    'features.liveDarshanDesc': 'लाइव अनुष्ठान और समारोह देखें।',
    'features.bookOnline': 'ऑनलाइन बुक करें',
    'features.bookOnlineDesc': 'दर्शन या अनुष्ठान के लिए स्लॉट बुक करें।',
    'features.community': 'समुदाय',
    'features.communityDesc': 'समूहों और भक्ति समुदायों में शामिल हों।',
    'features.explore': 'देखें',
    
    // Footer
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.temples': 'मंदिर',
    'footer.devotionals': 'भक्ति सामग्री',
    'footer.events': 'कार्यक्रम',
    'footer.listTemple': 'अपना मंदिर सूचीबद्ध करें',
    'footer.contact': 'संपर्क करें',
    'footer.help': 'सहायता केंद्र',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.about': 'निर्देशिका के बारे में',
    'footer.aboutText': 'क्षेत्रों में मंदिरों को खोजें, परंपराओं के बारे में पढ़ें, और अनुष्ठानों और कार्यक्रमों में भाग लेने के तरीके खोजें। सर्वदेव का उद्देश्य आध्यात्मिक संसाधनों को सभी के लिए सुलभ बनाना है।',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
    
    // Temples Page
    'temples.title': 'मंदिर',
    'temples.subtitle': 'हमारी मंदिर निर्देशिका का अन्वेषण करें और प्रत्येक पवित्र स्थल के बारे में जानें।',
    'temples.noTemples': 'अभी तक कोई स्वीकृत मंदिर नहीं। जल्द ही वापस आएं!',
    'temples.loading': 'मंदिर लोड हो रहे हैं...',
    
    // Temple Detail
    'temple.about': 'के बारे में',
    'temple.deity': 'देवता',
    'temple.location': 'स्थान',
    'temple.templeType': 'मंदिर का प्रकार',
    'temple.established': 'स्थापित',
    'temple.timings': 'समय',
    'temple.speciality': 'विशेषता',
    'temple.contact': 'संपर्क जानकारी',
    'temple.phone': 'फोन',
    'temple.email': 'ईमेल',
    'temple.website': 'वेबसाइट',
    'temple.contactPerson': 'संपर्क व्यक्ति',
    'temple.socialMedia': 'सोशल मीडिया',
    'temple.locationMap': 'स्थान मानचित्र',
    'temple.openMaps': 'गूगल मैप्स में खोलें',
    'temple.visitWebsite': 'वेबसाइट पर जाएं',
    'temple.backToTemples': 'मंदिरों पर वापस जाएं',
    'temple.notFound': 'मंदिर नहीं मिला',
    'temple.notFoundDesc': 'हम इस मंदिर को नहीं ढूंढ सके।',
    'temple.noDescription': 'कोई विवरण उपलब्ध नहीं।',
    'temple.viewOnMaps': 'गूगल मैप्स पर देखें',
    'temple.openInMaps': 'गूगल मैप्स में खोलें',
    'temple.contactInfo': 'संपर्क जानकारी',
    
    // List Temple Form
    'form.listTemple': 'मंदिर सूचीबद्ध करें',
    'form.subtitle': 'एक मंदिर के बारे में विवरण साझा करें जिसे आप जोड़ना चाहते हैं। हम प्रकाशित करने से पहले सबमिशन की समीक्षा करेंगे।',
    'form.basicInfo': 'बुनियादी जानकारी',
    'form.templeName': 'मंदिर का नाम',
    'form.deity': 'देवता/भगवान',
    'form.selectDeity': 'देवता चुनें',
    'form.templeType': 'मंदिर का प्रकार',
    'form.selectType': 'प्रकार चुनें',
    'form.description': 'विवरण',
    'form.descPlaceholder': 'मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें...',
    'form.establishedYear': 'स्थापना वर्ष',
    'form.speciality': 'विशेषता',
    'form.locationDetails': 'स्थान विवरण',
    'form.streetAddress': 'पता',
    'form.city': 'शहर',
    'form.state': 'राज्य',
    'form.selectState': 'राज्य चुनें',
    'form.pincode': 'पिनकोड',
    'form.visitInfo': 'यात्रा जानकारी',
    'form.timings': 'समय',
    'form.imageUrl': 'छवि URL',
    'form.contactInfo': 'संपर्क जानकारी',
    'form.phone': 'फोन',
    'form.email': 'ईमेल',
    'form.generalContact': 'सामान्य संपर्क',
    'form.website': 'वेबसाइट',
    'form.facebook': 'फेसबुक',
    'form.instagram': 'इंस्टाग्राम',
    'form.submit': 'मंदिर सबमिट करें',
    'form.submitting': 'सबमिट हो रहा है...',
    'form.success': 'धन्यवाद! आपका मंदिर सबमिशन प्राप्त हुआ और स्वीकृति के लिए लंबित है।',
    
    // Contact
    'contact.title': 'संपर्क करें',
    'contact.getInTouch': 'संपर्क में रहें',
    'contact.message': 'हमें आपसे सुनना अच्छा लगेगा! चाहे आपके पास प्रश्न हों, फीडबैक हो, या अपने मंदिर को हमारे प्लेटफॉर्म पर सूचीबद्ध करना चाहते हों, बेझिझक संपर्क करें।',
    'contact.sendMessage': 'हमें संदेश भेजें',
    'contact.name': 'नाम',
    'contact.yourName': 'आपका नाम',
    'contact.yourEmail': 'आपका@email.com',
    'contact.yourMessage': 'आपका संदेश...',
    'contact.send': 'संदेश भेजें',
  }
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLanguage(saved)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return context
}
