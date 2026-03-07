/* ─── Spiritual Icons Data ─── */

export interface SpiritualIcon {
  id: string
  name: string
  nameHi: string
  slug: string
  type: 'katha-vachak' | 'bhajan-gayak' | 'pandit'
  image: string
  description: string
  speciality: string
  state: string
  famousFor: string[]
}

export const categories = [
  { id: 'katha-vachak', label: 'Katha Vachak', labelHi: 'कथा वाचक', desc: 'Renowned narrators of sacred epics and scriptures' },
  { id: 'bhajan-gayak', label: 'Bhajan Gayak', labelHi: 'भजन गायक', desc: 'Celebrated devotional singers and musicians' },
  { id: 'pandit', label: 'Pandit / Purohit', labelHi: 'पंडित / पुरोहित', desc: 'Respected priests and Vedic scholars' },
] as const

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export const spiritualIcons: SpiritualIcon[] = [
  // ─── Katha Vachak ───
  {
    id: '1', name: 'Morari Bapu', nameHi: 'मोरारी बापू', slug: generateSlug('Morari Bapu'), type: 'katha-vachak',
    image: '', description: 'Renowned Ram Katha narrator from Gujarat, known for his simple and universal interpretation of Ramcharitmanas.',
    speciality: 'Ram Katha', state: 'Gujarat', famousFor: ['Ram Katha', 'Ramcharitmanas', 'Manas Parayan'],
  },
  {
    id: '2', name: 'Devkinandan Thakur Ji', nameHi: 'देवकीनंदन ठाकुर जी', slug: generateSlug('Devkinandan Thakur Ji'), type: 'katha-vachak',
    image: '', description: 'Popular Bhagwat Katha narrator known for engaging storytelling and devotion to Lord Krishna.',
    speciality: 'Bhagwat Katha', state: 'Uttar Pradesh', famousFor: ['Bhagwat Katha', 'Shrimad Bhagwat'],
  },
  {
    id: '3', name: 'Prembhushan Ji Maharaj', nameHi: 'प्रेमभूषण जी महाराज', slug: generateSlug('Prembhushan Ji Maharaj'), type: 'katha-vachak',
    image: '', description: 'Esteemed Katha Vachak known for deep knowledge of scriptures and soulful narration.',
    speciality: 'Bhagwat Katha', state: 'Uttar Pradesh', famousFor: ['Bhagwat Katha', 'Shiv Puran'],
  },
  {
    id: '4', name: 'Jaya Kishori', nameHi: 'जया किशोरी', slug: generateSlug('Jaya Kishori'), type: 'katha-vachak',
    image: '', description: 'Young and dynamic spiritual speaker known for Sunderkand and motivational discourses.',
    speciality: 'Sunderkand', state: 'Rajasthan', famousFor: ['Sunderkand', 'Motivational Katha', 'Bhajans'],
  },
  {
    id: '5', name: 'Mridul Krishna Shastri', nameHi: 'मृदुल कृष्ण शास्त्री', slug: generateSlug('Mridul Krishna Shastri'), type: 'katha-vachak',
    image: '', description: 'Renowned Bhagwat Katha narrator known for combining devotion with deep scriptural knowledge.',
    speciality: 'Bhagwat Katha', state: 'Uttar Pradesh', famousFor: ['Bhagwat Katha', 'Krishna Leela'],
  },
  {
    id: '6', name: 'Aniruddhacharya Ji', nameHi: 'अनिरुद्धाचार्य जी', slug: generateSlug('Aniruddhacharya Ji'), type: 'katha-vachak',
    image: '', description: 'Popular spiritual leader known for insightful Bhagwat Katha and social media presence.',
    speciality: 'Bhagwat Katha', state: 'Madhya Pradesh', famousFor: ['Bhagwat Katha', 'Social Media Discourses'],
  },
  {
    id: 'kv7', name: 'Rameshbhai Oza', nameHi: 'रमेशभाई ओझा', slug: generateSlug('Rameshbhai Oza'), type: 'katha-vachak',
    image: '', description: 'Renowned Bhagwat Katha narrator from Gujarat known for scholarly interpretation and melodious narration.',
    speciality: 'Bhagwat Katha', state: 'Gujarat', famousFor: ['Bhagwat Katha', 'Shrimad Bhagwat', 'Spiritual Discourses'],
  },
  {
    id: 'kv8', name: 'Gaurav Krishna Goswami', nameHi: 'गौरव कृष्ण गोस्वामी', slug: generateSlug('Gaurav Krishna Goswami'), type: 'katha-vachak',
    image: '', description: 'Young and popular Bhagwat Katha narrator known for connecting with youth through modern storytelling.',
    speciality: 'Bhagwat Katha', state: 'Uttar Pradesh', famousFor: ['Bhagwat Katha', 'Youth Outreach', 'Krishna Bhakti'],
  },
  {
    id: 'kv9', name: 'Swami Avdheshanand Giri', nameHi: 'स्वामी अवधेशानंद गिरि', slug: generateSlug('Swami Avdheshanand Giri'), type: 'katha-vachak',
    image: '', description: 'Acharya Mahamandaleshwar of Juna Akhara, renowned for spiritual discourses on Vedanta and Gita.',
    speciality: 'Vedanta & Gita', state: 'Uttarakhand', famousFor: ['Gita Pravachan', 'Vedanta', 'Juna Akhara'],
  },
  {
    id: 'kv10', name: 'Pandit Vijay Shankar Mehta', nameHi: 'पंडित विजय शंकर मेहता', slug: generateSlug('Pandit Vijay Shankar Mehta'), type: 'katha-vachak',
    image: '', description: 'Celebrated Bhagwat Katha narrator from Madhya Pradesh known for mesmerizing narration style.',
    speciality: 'Bhagwat Katha', state: 'Madhya Pradesh', famousFor: ['Bhagwat Katha', 'Ram Katha', 'Spiritual Pravachan'],
  },
  {
    id: 'kv11', name: 'Pujya Bhaishri Rameshbhai', nameHi: 'पूज्य भाईश्री रमेशभाई', slug: generateSlug('Pujya Bhaishri Rameshbhai'), type: 'katha-vachak',
    image: '', description: 'Spiritual leader and katha narrator known for Shrimad Rajchandra Mission and Jain-Hindu unity.',
    speciality: 'Spiritual Discourses', state: 'Gujarat', famousFor: ['Shrimad Rajchandra', 'Spiritual Unity', 'Dharma Katha'],
  },
  {
    id: 'kv12', name: 'Indresh Upadhyay', nameHi: 'इंद्रेश उपाध्याय', slug: generateSlug('Indresh Upadhyay'), type: 'katha-vachak',
    image: '', description: 'Popular young Katha Vachak known for Shiv Mahapuran and engaging storytelling on YouTube.',
    speciality: 'Shiv Mahapuran', state: 'Uttar Pradesh', famousFor: ['Shiv Mahapuran', 'YouTube Katha', 'Shiv Bhakti'],
  },
  {
    id: 'kv13', name: 'Rajendra Das Ji Maharaj', nameHi: 'राजेंद्र दास जी महाराज', slug: generateSlug('Rajendra Das Ji Maharaj'), type: 'katha-vachak',
    image: '', description: 'Revered saint from Vrindavan known for Ram Katha and deep devotion to Lord Krishna.',
    speciality: 'Ram Katha', state: 'Uttar Pradesh', famousFor: ['Ram Katha', 'Vrindavan', 'Krishna Bhakti'],
  },
  {
    id: 'kv14', name: 'Shri Dongreji Maharaj', nameHi: 'श्री डोंगरेजी महाराज', slug: generateSlug('Shri Dongreji Maharaj'), type: 'katha-vachak',
    image: '', description: 'Legendary Bhagwat Katha narrator whose tradition continues to inspire millions worldwide.',
    speciality: 'Bhagwat Katha', state: 'Gujarat', famousFor: ['Bhagwat Katha', 'Bhakti Tradition', 'Gujarati Katha'],
  },
  {
    id: 'kv15', name: 'Pandit Pradeep Mishra', nameHi: 'पंडित प्रदीप मिश्रा', slug: generateSlug('Pandit Pradeep Mishra KV'), type: 'katha-vachak',
    image: '', description: 'Famous Shiv Mahapuran narrator and spiritual guide from Sehore, Madhya Pradesh.',
    speciality: 'Shiv Mahapuran', state: 'Madhya Pradesh', famousFor: ['Shiv Mahapuran', 'Shiv Katha', 'Pravachan'],
  },
  {
    id: 'kv16', name: 'Swami Chinmayananda', nameHi: 'स्वामी चिन्मयानंद', slug: generateSlug('Swami Chinmayananda'), type: 'katha-vachak',
    image: '', description: 'Founder of Chinmaya Mission, renowned for Geeta Gyan Yagya and Vedantic teachings worldwide.',
    speciality: 'Gita Gyan Yagya', state: 'Kerala', famousFor: ['Chinmaya Mission', 'Gita Pravachan', 'Vedanta'],
  },
  {
    id: 'kv17', name: 'Devi Chitralekha', nameHi: 'देवी चित्रलेखा', slug: generateSlug('Devi Chitralekha'), type: 'katha-vachak',
    image: '', description: 'Young and vibrant spiritual speaker known for Bhagwat Katha and inspiring discourses for youth.',
    speciality: 'Bhagwat Katha', state: 'Uttar Pradesh', famousFor: ['Bhagwat Katha', 'Youth Inspiration', 'Devi Bhakti'],
  },
  {
    id: 'kv18', name: 'Acharya Mahashraman', nameHi: 'आचार्य महाश्रमण', slug: generateSlug('Acharya Mahashraman'), type: 'katha-vachak',
    image: '', description: 'Head of Jain Terapanth sect, known for promoting non-violence and spiritual discourses worldwide.',
    speciality: 'Jain Discourses', state: 'Rajasthan', famousFor: ['Ahimsa Yatra', 'Jain Pravachan', 'Terapanth'],
  },
  {
    id: 'kv19', name: 'Govind Dev Giri Ji', nameHi: 'गोविंद देव गिरि जी', slug: generateSlug('Govind Dev Giri Ji'), type: 'katha-vachak',
    image: '', description: 'Treasurer of Shri Ram Janmabhoomi Trust and renowned Bhagwat Katha narrator.',
    speciality: 'Bhagwat Katha', state: 'Maharashtra', famousFor: ['Ram Mandir Trust', 'Bhagwat Katha', 'Vedantic Talks'],
  },
  {
    id: 'kv20', name: 'Swami Krushnaswarup Dasji', nameHi: 'स्वामी कृष्णस्वरूप दासजी', slug: generateSlug('Swami Krushnaswarup Dasji'), type: 'katha-vachak',
    image: '', description: 'Head of Swaminarayan Gadi Sansthan, known for spiritual pravachans and community service.',
    speciality: 'Swaminarayan Katha', state: 'Gujarat', famousFor: ['Swaminarayan Katha', 'Spiritual Pravachan', 'Community Service'],
  },
  {
    id: 'kv21', name: 'Sushri Didi Maa Sadhvi Ritambhara', nameHi: 'सुश्री दीदी माँ साध्वी ऋतंभरा', slug: generateSlug('Sushri Didi Maa Sadhvi Ritambhara'), type: 'katha-vachak',
    image: '', description: 'Renowned spiritual leader and orator known for powerful Katha and social activism.',
    speciality: 'Spiritual Discourses', state: 'Uttar Pradesh', famousFor: ['Ram Katha', 'Social Activism', 'Vatsalya Gram'],
  },
  {
    id: 'kv22', name: 'Shri Satpal Ji Maharaj', nameHi: 'श्री सतपाल जी महाराज', slug: generateSlug('Shri Satpal Ji Maharaj'), type: 'katha-vachak',
    image: '', description: 'Spiritual leader and founder of Manav Utthan Sewa Samiti, known for Gita and Vedic discourses.',
    speciality: 'Gita Pravachan', state: 'Uttarakhand', famousFor: ['Gita Pravachan', 'Vedic Knowledge', 'Manav Utthan'],
  },
  {
    id: 'kv23', name: 'Swami Ramsukhdas Ji', nameHi: 'स्वामी रामसुखदास जी', slug: generateSlug('Swami Ramsukhdas Ji'), type: 'katha-vachak',
    image: '', description: 'Revered saint from Gita Press Gorakhpur tradition, known for simple Gita teachings.',
    speciality: 'Gita Pravachan', state: 'Uttar Pradesh', famousFor: ['Gita Press', 'Sadhak Sanjivani', 'Gita Pravachan'],
  },
  {
    id: 'kv24', name: 'Asaram Bapu', nameHi: 'आसाराम बापू', slug: generateSlug('Asaram Bapu'), type: 'katha-vachak',
    image: '', description: 'Once popular spiritual leader known for satsangs and ashrams worldwide.',
    speciality: 'Satsang', state: 'Gujarat', famousFor: ['Satsang', 'Ashrams', 'Spiritual Discourses'],
  },
  {
    id: 'kv25', name: 'Sudhanshu Ji Maharaj', nameHi: 'सुधांशु जी महाराज', slug: generateSlug('Sudhanshu Ji Maharaj'), type: 'katha-vachak',
    image: '', description: 'Founder of Vishwa Jagriti Mission, known for Bhagwat Katha and TV discourses.',
    speciality: 'Bhagwat Katha', state: 'Delhi', famousFor: ['Vishwa Jagriti Mission', 'Bhagwat Katha', 'TV Pravachan'],
  },
  {
    id: 'kv26', name: 'Shri Sureshanand Ji', nameHi: 'श्री सुरेशानंद जी', slug: generateSlug('Shri Sureshanand Ji'), type: 'katha-vachak',
    image: '', description: 'Popular katha narrator known for soulful rendition of Shrimad Bhagwat and Ramayan.',
    speciality: 'Bhagwat Katha', state: 'Gujarat', famousFor: ['Bhagwat Katha', 'Ramayan Katha', 'Satsang'],
  },
  {
    id: 'kv27', name: 'Bageshwar Dham Sarkar (Dhirendra Shastri)', nameHi: 'बागेश्वर धाम सरकार (धीरेंद्र शास्त्री)', slug: generateSlug('Bageshwar Dham Sarkar'), type: 'katha-vachak',
    image: '', description: 'Head of Bageshwar Dham, extremely popular for Divya Darbar and Hanuman Katha.',
    speciality: 'Hanuman Katha', state: 'Madhya Pradesh', famousFor: ['Divya Darbar', 'Hanuman Katha', 'Bageshwar Dham'],
  },
  {
    id: 'kv28', name: 'Swami Gyananand Ji', nameHi: 'स्वामी ज्ञानानंद जी', slug: generateSlug('Swami Gyananand Ji'), type: 'katha-vachak',
    image: '', description: 'Known for detailed narration of Devi Bhagwat and Shiv Puran worldwide.',
    speciality: 'Devi Bhagwat', state: 'Uttar Pradesh', famousFor: ['Devi Bhagwat', 'Shiv Puran', 'Navdurga Katha'],
  },
  {
    id: 'kv29', name: 'Kaushik Ji Maharaj', nameHi: 'कौशिक जी महाराज', slug: generateSlug('Kaushik Ji Maharaj'), type: 'katha-vachak',
    image: '', description: 'Bhagwat Katha narrator known for emotional and devotional rendering of Krishna Leela.',
    speciality: 'Krishna Leela', state: 'Uttar Pradesh', famousFor: ['Krishna Leela', 'Bhagwat Katha', 'Vrindavan'],
  },
  {
    id: 'kv30', name: 'Pujya Komal Krushnashankar', nameHi: 'पूज्य कोमल कृष्णशंकर', slug: generateSlug('Pujya Komal Krushnashankar'), type: 'katha-vachak',
    image: '', description: 'Popular Gujarati Katha Vachak known for melodious Ram Katha renditions.',
    speciality: 'Ram Katha', state: 'Gujarat', famousFor: ['Ram Katha', 'Gujarati Katha', 'Bhajan'],
  },
  {
    id: 'kv31', name: 'Mahatma Purnachaitanya Das', nameHi: 'महात्मा पूर्णचैतन्य दास', slug: generateSlug('Mahatma Purnachaitanya Das'), type: 'katha-vachak',
    image: '', description: 'ISKCON spiritual leader known for Bhagavad Gita discourses and Hare Krishna movement.',
    speciality: 'Bhagavad Gita', state: 'Maharashtra', famousFor: ['Bhagavad Gita', 'ISKCON', 'Hare Krishna'],
  },
  {
    id: 'kv32', name: 'Shri Hit Premanand Govind Sharan Ji', nameHi: 'श्री हित प्रेमानंद गोविंद शरण जी', slug: generateSlug('Shri Hit Premanand Govind Sharan Ji'), type: 'katha-vachak',
    image: '', description: 'Renowned Pushti Marg Katha narrator known for devotion to Shrinathji.',
    speciality: 'Pushti Marg Katha', state: 'Rajasthan', famousFor: ['Pushti Marg', 'Shrinathji', 'Vallabh Katha'],
  },
  {
    id: 'kv33', name: 'Acharya Shri Yugbhushan Suri', nameHi: 'आचार्य श्री युगभूषण सूरि', slug: generateSlug('Acharya Shri Yugbhushan Suri'), type: 'katha-vachak',
    image: '', description: 'Jain Acharya known for interfaith spiritual discourses and promoting peace.',
    speciality: 'Jain Katha', state: 'Rajasthan', famousFor: ['Jain Pravachan', 'Peace Discourses', 'Interfaith'],
  },
  {
    id: 'kv34', name: 'Radha Mohan Das Ji', nameHi: 'राधा मोहन दास जी', slug: generateSlug('Radha Mohan Das Ji'), type: 'katha-vachak',
    image: '', description: 'Vrindavan-based katha narrator devoted to Radha-Krishna and Bhagwat Katha.',
    speciality: 'Radha-Krishna Katha', state: 'Uttar Pradesh', famousFor: ['Radha-Krishna Katha', 'Vrindavan', 'Bhagwat'],
  },
  {
    id: 'kv35', name: 'Avadh Kishore Sharan Ji', nameHi: 'अवध किशोर शरण जी', slug: generateSlug('Avadh Kishore Sharan Ji'), type: 'katha-vachak',
    image: '', description: 'Respected narrator of Ram Charit Manas and spiritual teacher from Ayodhya.',
    speciality: 'Ram Charit Manas', state: 'Uttar Pradesh', famousFor: ['Ram Charit Manas', 'Ayodhya', 'Ram Bhakti'],
  },

  // ─── Bhajan Gayak ───
  {
    id: '7', name: 'Anuradha Paudwal', nameHi: 'अनुराधा पौडवाल', slug: generateSlug('Anuradha Paudwal'), type: 'bhajan-gayak',
    image: '', description: 'Legendary devotional singer known for iconic bhajans and aartis across all Hindu traditions.',
    speciality: 'Devotional Singing', state: 'Maharashtra', famousFor: ['Om Jai Jagdish Hare', 'Hanuman Chalisa', 'Durga Aarti'],
  },
  {
    id: '8', name: 'Anup Jalota', nameHi: 'अनूप जलोटा', slug: generateSlug('Anup Jalota'), type: 'bhajan-gayak',
    image: '', description: 'Known as the "Bhajan Samrat", master of classical devotional music and ghazals.',
    speciality: 'Classical Bhajans', state: 'Punjab', famousFor: ['Aisi Laagi Lagan', 'Main Neer Bhari', 'Krishna Bhajans'],
  },
  {
    id: '9', name: 'Lakhbir Singh Lakkha', nameHi: 'लखबीर सिंह लक्खा', slug: generateSlug('Lakhbir Singh Lakkha'), type: 'bhajan-gayak',
    image: '', description: 'Beloved devotional singer famous for jagrans and powerful renditions of bhajans.',
    speciality: 'Jagran Singing', state: 'Delhi', famousFor: ['Bhor Bhai Din', 'Mata Ki Bhentein', 'Jagran Bhajans'],
  },
  {
    id: '10', name: 'Hansraj Raghuwanshi', nameHi: 'हंसराज रघुवंशी', slug: generateSlug('Hansraj Raghuwanshi'), type: 'bhajan-gayak',
    image: '', description: 'Trending devotional singer known for powerful and modern renditions of Shiv bhajans.',
    speciality: 'Shiv Bhajans', state: 'Madhya Pradesh', famousFor: ['Bam Bhole', 'Mahakal', 'Modern Devotional'],
  },
  {
    id: '11', name: 'Gulshan Kumar (T-Series)', nameHi: 'गुलशन कुमार', slug: generateSlug('Gulshan Kumar T-Series'), type: 'bhajan-gayak',
    image: '', description: 'Late music mogul who revolutionized devotional music distribution through T-Series.',
    speciality: 'Devotional Music Production', state: 'Delhi', famousFor: ['Hanuman Chalisa', 'Shiv Bhajans', 'T-Series Bhakti'],
  },
  {
    id: '12', name: 'Narendra Chanchal', nameHi: 'नरेंद्र चंचल', slug: generateSlug('Narendra Chanchal'), type: 'bhajan-gayak',
    image: '', description: 'Legendary Mata bhajan singer known for powerful renditions at Vaishno Devi and jagrans.',
    speciality: 'Mata Bhajans', state: 'Punjab', famousFor: ['Chalo Bulawa Aaya Hai', 'Tune Mujhe Bulaya', 'Mata Bhajans'],
  },
  {
    id: 'bg7', name: 'Kumar Vishu', nameHi: 'कुमार विशु', slug: generateSlug('Kumar Vishu'), type: 'bhajan-gayak',
    image: '', description: 'Popular devotional singer known for soulful Krishna bhajans and Shyam kirtan.',
    speciality: 'Krishna Bhajans', state: 'Haryana', famousFor: ['Shyam Bhajans', 'Krishna Kirtan', 'Khatu Shyam'],
  },
  {
    id: 'bg8', name: 'Maithili Thakur', nameHi: 'मैथिली ठाकुर', slug: generateSlug('Maithili Thakur'), type: 'bhajan-gayak',
    image: '', description: 'Young folk and devotional singer from Bihar known for melodious bhajans and viral performances.',
    speciality: 'Folk Devotional', state: 'Bihar', famousFor: ['Folk Bhajans', 'Maithili Songs', 'YouTube Devotional'],
  },
  {
    id: 'bg9', name: 'Kailash Kher', nameHi: 'कैलाश खेर', slug: generateSlug('Kailash Kher'), type: 'bhajan-gayak',
    image: '', description: 'Acclaimed singer known for Sufi-devotional fusion and powerful spiritual compositions.',
    speciality: 'Sufi Devotional', state: 'Delhi', famousFor: ['Teri Deewani', 'Allah Ke Bande', 'Sufi Bhajans'],
  },
  {
    id: 'bg10', name: 'Jubin Nautiyal', nameHi: 'जुबिन नौटियाल', slug: generateSlug('Jubin Nautiyal'), type: 'bhajan-gayak',
    image: '', description: 'Popular playback singer who has also rendered chart-topping devotional tracks.',
    speciality: 'Modern Devotional', state: 'Uttarakhand', famousFor: ['Lut Gaye', 'Shiv Tandav Stotram', 'Modern Bhajans'],
  },
  {
    id: 'bg11', name: 'Sachet-Parampara', nameHi: 'सचेत-परमपरा', slug: generateSlug('Sachet Parampara'), type: 'bhajan-gayak',
    image: '', description: 'Musical duo known for viral devotional hits and contemporary spiritual music.',
    speciality: 'Contemporary Devotional', state: 'Delhi', famousFor: ['Mere Ghar Ram Aaye Hain', 'Shiv Tandav', 'Devotional Hits'],
  },
  {
    id: 'bg12', name: 'Shankar Mahadevan', nameHi: 'शंकर महादेवन', slug: generateSlug('Shankar Mahadevan'), type: 'bhajan-gayak',
    image: '', description: 'Legendary singer and composer known for devotional masterpieces and Breathless fame.',
    speciality: 'Devotional & Classical', state: 'Maharashtra', famousFor: ['Ganpati Bappa Morya', 'Breathless', 'Devotional Albums'],
  },
  {
    id: 'bg13', name: 'Hariharan', nameHi: 'हरिहरन', slug: generateSlug('Hariharan'), type: 'bhajan-gayak',
    image: '', description: 'Ghazal maestro and playback singer known for soulful devotional and Sufi renditions.',
    speciality: 'Ghazal & Devotional', state: 'Kerala', famousFor: ['Sufi Music', 'Ghazals', 'Devotional Albums'],
  },
  {
    id: 'bg14', name: 'Sonu Nigam', nameHi: 'सोनू निगम', slug: generateSlug('Sonu Nigam'), type: 'bhajan-gayak',
    image: '', description: 'Versatile singer who has rendered numerous devotional albums including bhajans and aartis.',
    speciality: 'Versatile Devotional', state: 'Delhi', famousFor: ['Hanuman Chalisa', 'Krishna Bhajans', 'Devotional Albums'],
  },
  {
    id: 'bg15', name: 'Jagjit Singh', nameHi: 'जगजीत सिंह', slug: generateSlug('Jagjit Singh'), type: 'bhajan-gayak',
    image: '', description: 'Ghazal king who also created timeless devotional and spiritual music.',
    speciality: 'Ghazal & Spiritual', state: 'Punjab', famousFor: ['Hey Ram', 'Spiritual Ghazals', 'Devotional Albums'],
  },
  {
    id: 'bg16', name: 'Kavita Krishnamurthy', nameHi: 'कविता कृष्णमूर्ति', slug: generateSlug('Kavita Krishnamurthy'), type: 'bhajan-gayak',
    image: '', description: 'Renowned playback singer known for devotional tracks and classical vocal excellence.',
    speciality: 'Classical Devotional', state: 'Delhi', famousFor: ['Aarti Kunj Bihari Ki', 'Devi Bhajans', 'Classical Bhajans'],
  },
  {
    id: 'bg17', name: 'Suresh Wadkar', nameHi: 'सुरेश वाडकर', slug: generateSlug('Suresh Wadkar'), type: 'bhajan-gayak',
    image: '', description: 'Acclaimed Marathi and Hindi devotional singer known for Ganpati and Vitthal bhajans.',
    speciality: 'Marathi Devotional', state: 'Maharashtra', famousFor: ['Ganpati Bhajans', 'Vitthal Bhajans', 'Abhang'],
  },
  {
    id: 'bg18', name: 'Ravindra Jain', nameHi: 'रवींद्र जैन', slug: generateSlug('Ravindra Jain'), type: 'bhajan-gayak',
    image: '', description: 'Legendary blind composer and singer known for timeless Ramayan and devotional music.',
    speciality: 'Devotional Composition', state: 'Madhya Pradesh', famousFor: ['Ramayan Music', 'Devotional Compositions', 'Film Bhajans'],
  },

  // ─── Pandit / Purohit ───
  {
    id: '15', name: 'Acharya Balkrishna', nameHi: 'आचार्य बालकृष्ण', slug: generateSlug('Acharya Balkrishna'), type: 'pandit',
    image: '', description: 'Renowned Ayurveda scholar and spiritual leader associated with Patanjali Yogpeeth.',
    speciality: 'Ayurveda & Vedic Knowledge', state: 'Uttarakhand', famousFor: ['Ayurveda', 'Patanjali', 'Vedic Teachings'],
  },
  {
    id: '16', name: 'Swami Rambhadracharya', nameHi: 'स्वामी रामभद्राचार्य', slug: generateSlug('Swami Rambhadracharya'), type: 'pandit',
    image: '', description: 'Jagadguru and Sanskrit scholar, visually impaired yet holder of extraordinary vedic knowledge.',
    speciality: 'Sanskrit & Vedic Scholarship', state: 'Uttar Pradesh', famousFor: ['Ram Katha', 'Sanskrit Scholarship', 'Tulsi Peeth'],
  },
  {
    id: '17', name: 'Pandit Rajesh Sharma', nameHi: 'पंडित राजेश शर्मा', slug: generateSlug('Pandit Rajesh Sharma'), type: 'pandit',
    image: '', description: 'Respected Vedic pandit from Varanasi known for performing traditional rituals and yagyas.',
    speciality: 'Vedic Rituals', state: 'Uttar Pradesh', famousFor: ['Vedic Yagya', 'Hindu Rituals', 'Kashi Traditions'],
  },
  {
    id: '18', name: 'Shankaracharya Swami Nischalananda', nameHi: 'शंकराचार्य निश्चलानंद', slug: generateSlug('Shankaracharya Swami Nischalananda'), type: 'pandit',
    image: '', description: 'Shankaracharya of Govardhan Peeth, Puri — one of the four principal Shankaracharya seats.',
    speciality: 'Advaita Vedanta', state: 'Odisha', famousFor: ['Govardhan Peeth', 'Advaita Philosophy', 'Vedantic Teachings'],
  },
  {
    id: 'p7', name: 'Shankaracharya Avimukteshwaranand', nameHi: 'शंकराचार्य अविमुक्तेश्वरानंद', slug: generateSlug('Shankaracharya Avimukteshwaranand'), type: 'pandit',
    image: '', description: 'Shankaracharya of Jyotir Math, vocal advocate of Sanatan Dharma and Vedic traditions.',
    speciality: 'Sanatan Dharma', state: 'Uttarakhand', famousFor: ['Jyotir Math', 'Sanatan Dharma', 'Vedic Advocacy'],
  },
  {
    id: 'p8', name: 'Swami Vasudevanand Saraswati', nameHi: 'स्वामी वासुदेवानंद सरस्वती', slug: generateSlug('Swami Vasudevanand Saraswati'), type: 'pandit',
    image: '', description: 'Revered saint and Vedic scholar known for promoting traditional Hindu rituals and Dharma.',
    speciality: 'Vedic Rituals', state: 'Maharashtra', famousFor: ['Vedic Rituals', 'Dharma Prachar', 'Sanskrit Scholarship'],
  },
  {
    id: 'p9', name: 'Pandit Jasraj', nameHi: 'पंडित जसराज', slug: generateSlug('Pandit Jasraj'), type: 'bhajan-gayak',
    image: '', description: 'Legendary Indian classical vocalist and Mewati Gharana maestro, known for devotional ragas.',
    speciality: 'Classical Vocal & Devotional', state: 'Rajasthan', famousFor: ['Mewati Gharana', 'Haveli Sangeet', 'Om Namah Shivaya'],
  },
  {
    id: 'p10', name: 'Swami Dayananda Saraswati', nameHi: 'स्वामी दयानंद सरस्वती', slug: generateSlug('Swami Dayananda Saraswati Vedanta'), type: 'pandit',
    image: '', description: 'Founder of Arsha Vidya Gurukulam, renowned Vedanta teacher who trained hundreds of swamis.',
    speciality: 'Vedanta Teaching', state: 'Tamil Nadu', famousFor: ['Arsha Vidya', 'Vedanta', 'Guru Parampara'],
  },
  {
    id: 'p11', name: 'Acharya Pramod Krishnam', nameHi: 'आचार्य प्रमोद कृष्णम', slug: generateSlug('Acharya Pramod Krishnam'), type: 'pandit',
    image: '', description: 'Spiritual leader and social commentator known for progressive interpretation of Hindu scriptures.',
    speciality: 'Progressive Spirituality', state: 'Uttar Pradesh', famousFor: ['Social Commentary', 'Spiritual Discourses', 'Media Presence'],
  },
  {
    id: 'p12', name: 'Shankaracharya Swami Bharati Krishna Tirtha', nameHi: 'शंकराचार्य स्वामी भारती कृष्ण तीर्थ', slug: generateSlug('Shankaracharya Bharati Krishna Tirtha'), type: 'pandit',
    image: '', description: 'Former Shankaracharya of Govardhan Math, renowned for Vedic Mathematics and scholarly contributions.',
    speciality: 'Vedic Mathematics', state: 'Odisha', famousFor: ['Vedic Mathematics', 'Govardhan Math', 'Sanskrit Scholarship'],
  },
  {
    id: 'p13', name: 'Swami Swaroopanand Saraswati', nameHi: 'स्वामी स्वरूपानंद सरस्वती', slug: generateSlug('Swami Swaroopanand Saraswati'), type: 'pandit',
    image: '', description: 'Former Shankaracharya of Dwarka and Jyotir Math, champion of traditional Hindu values.',
    speciality: 'Shankaracharya Tradition', state: 'Madhya Pradesh', famousFor: ['Dwarka Peeth', 'Hindu Advocacy', 'Vedantic Tradition'],
  },
  {
    id: 'p14', name: 'Swami Ramdev', nameHi: 'स्वामी रामदेव', slug: generateSlug('Swami Ramdev'), type: 'pandit',
    image: '', description: 'Yoga guru and spiritual leader who popularized yoga and Ayurveda across the world.',
    speciality: 'Yoga & Ayurveda', state: 'Haryana', famousFor: ['Patanjali Yogpeeth', 'Yoga Movement', 'Pranayam'],
  },
  {
    id: 'p15', name: 'Shankaracharya Swami Sadananda Saraswati', nameHi: 'शंकराचार्य स्वामी सदानंद सरस्वती', slug: generateSlug('Shankaracharya Sadananda Saraswati'), type: 'pandit',
    image: '', description: 'Shankaracharya of Jyotir Math tradition, known for preserving Advaita Vedanta teachings.',
    speciality: 'Advaita Vedanta', state: 'Uttarakhand', famousFor: ['Jyotir Math', 'Advaita Vedanta', 'Vedic Tradition'],
  },
  {
    id: 'p16', name: 'Pandit Ram Narayan', nameHi: 'पंडित राम नारायण', slug: generateSlug('Pandit Ram Narayan Purohit'), type: 'pandit',
    image: '', description: 'Renowned Vedic priest from Kashi known for performing elaborate yagyas and Vedic ceremonies.',
    speciality: 'Vedic Yagya', state: 'Uttar Pradesh', famousFor: ['Vedic Yagya', 'Kashi Rituals', 'Agnihotra'],
  },
  {
    id: 'p17', name: 'Acharya Lokesh Muni', nameHi: 'आचार्य लोकेश मुनि', slug: generateSlug('Acharya Lokesh Muni'), type: 'pandit',
    image: '', description: 'Jain spiritual leader and founder of Ahimsa Vishwa Bharti, known for promoting non-violence globally.',
    speciality: 'Ahimsa & Peace', state: 'Delhi', famousFor: ['Ahimsa Vishwa Bharti', 'Interfaith Dialogue', 'Peace Advocacy'],
  },
]

/** Find a spiritual icon by slug */
export function getSpiritualIconBySlug(slug: string): SpiritualIcon | undefined {
  return spiritualIcons.find(icon => icon.slug === slug)
}

/** Get related icons (same type, excluding current) */
export function getRelatedIcons(icon: SpiritualIcon, limit = 3): SpiritualIcon[] {
  return spiritualIcons
    .filter(i => i.type === icon.type && i.id !== icon.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
}
