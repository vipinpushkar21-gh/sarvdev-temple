const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: String, description: String, category: String, language: String,
  deity: String, lyrics: String, audio: String, status: String,
  createdAt: Date, updatedAt: Date
});
const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

const updates = [
  {
    id: '6935cf8255597882f239e4ae',
    roman: `|| Shri Hanuman Chalisa ||

|| Doha ||
Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhari.
Baranaun Raghubar Bimal Jasu, Jo Dayaku Phal Chari.

Buddhiheen Tanu Jaanike, Sumirau Pavan Kumar.
Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Bikaar.

|| Chaupai ||
Jai Hanuman Gyan Gun Sagar, Jai Kapis Tihun Lok Ujagar.
Ram Doot Atulit Bal Dhama, Anjani Putra Pavan Sut Nama ||1||

Mahabir Bikram Bajrangi, Kumati Nivar Sumati Ke Sangi.
Kanchan Baran Biraj Subesa, Kanan Kundal Kunchit Kesa ||2||

Hath Bajra Aur Dhwaja Biraje, Kandhe Moonj Janeu Saaje.
Shankar Suvan Kesari Nandan, Tej Pratap Maha Jag Bandan ||3||

Vidyavan Guni Ati Chatur, Ram Kaj Karibe Ko Aatur.
Prabhu Charitra Sunibe Ko Rasiya, Ram Lakhan Sita Man Basiya ||4||

Sukshma Roop Dhari Siyahi Dikhawa, Bikat Roop Dhari Lanka Jarawa.
Bhim Roop Dhari Asur Sanhare, Ramachandra Ke Kaj Sanvare ||5||

Laye Sanjivan Lakhan Jiyaye, Shri Raghubir Harashi Ur Laye.
Raghupati Kinhi Bahut Badai, Tum Mam Priye Bharatahi Sam Bhai ||6||

Sahas Badan Tumharo Jas Gaave, As Kahi Shripati Kanth Lagave.
Sankadhik Brahmaadi Muneesa, Narad Sarad Sahit Aheesa ||7||

Yam Kuber Digpal Jahan Te, Kabi Kobid Kahi Sake Kahan Te.
Tum Upkar Sugrivahi Keenha, Ram Milaye Rajpad Deenha ||8||

Tumharo Mantra Vibhishan Maana, Lankeshwar Bhaye Sab Jag Jana.
Yug Sahastra Jojan Par Bhanu, Leelyo Tahi Madhur Phal Janu ||9||

Prabhu Mudrika Meli Mukh Maheen, Jaladhi Langhi Gaye Achraj Naheen.
Durgam Kaj Jagat Ke Jete, Sugam Anugraha Tumhre Tete ||10||

Ram Duare Tum Rakhware, Hot Na Agya Binu Paisare.
Sab Sukh Lahey Tumhari Sarna, Tum Rakshak Kahu Ko Darna ||11||

Aapan Tej Samharo Aapey, Teenon Lok Hank Te Kanpey.
Bhoot Pisach Nikat Nahin Aave, Mahabir Jab Naam Sunave ||12||

Nase Rog Hare Sab Peera, Japat Nirantar Hanumat Beera.
Sankat Te Hanuman Chhudave, Man Kram Bachan Dhyan Jo Lave ||13||

Sab Par Ram Tapaswi Raja, Tin Ke Kaj Sakal Tum Saja.
Aur Manorath Jo Koi Lave, Soi Amit Jivan Phal Pave ||14||

Charon Yug Partap Tumhara, Hai Parsiddh Jagat Ujiyara.
Sadhu Sant Ke Tum Rakhware, Asur Nikandan Ram Dulare ||15||

Ashta Siddhi Nav Nidhi Ke Data, As Bar Deen Janaki Mata.
Ram Rasayan Tumhare Pasa, Sada Raho Raghupati Ke Dasa ||16||

Tumhare Bhajan Ram Ko Pavey, Janam Janam Ke Dukh Bisravey.
Ant Kaal Raghubar Pur Jayee, Jahan Janam Hari Bhakt Kahayee ||17||

Aur Devta Chitt Na Dharayee, Hanumat Sei Sarv Sukh Karayee.
Sankat Katey Mitey Sab Peera, Jo Sumirey Hanumat Balbira ||18||

Jai Jai Jai Hanuman Gosai, Kripa Karahu Gurudev Ki Naai.
Jo Sat Baar Paath Kar Koi, Chhutahi Bandi Maha Sukh Hoi ||19||

Jo Yah Padhe Hanuman Chalisa, Hoy Siddhi Sakhi Gaurisa.
Tulsidas Sada Hari Chera, Keejey Nath Hriday Mah Dera ||20||

|| Doha ||
Pavan Tanay Sankat Haran, Mangal Murti Roop.
Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop.

|| Iti Shri Hanuman Chalisa Sampurnam ||`
  },
  {
    id: '6935cf8255597882f239e4b0',
    roman: `|| Shri Ganesh Chalisa ||

|| Doha ||
Jai Ganpati Sadgun Sadan, Kavivar Badan Kripaal.
Vighn Haran Mangal Karan, Jai Jai Girijaalaal.

|| Chaupai ||
Jai Jai Jai Ganpati Ganadeva, Mangal Murti Karahu Man Seva.
Vighna Vinashak Mangal Kari, Modak Priya Mukh Chandra Ujari ||1||

Parvati Nandan Shankar Suvana, Vishwa Vinayak Buddhi Nidhana.
Vakratund Shuchishundarvala, Sarvadev Ko Rakhvala ||2||

Riddhi Siddhi Ke Tu Dato, Bhaktan Ko Tu Rakhvaro.
Sindur Charha Mukh Shobhit, Kanan Kundal Jhalkat ||3||

Tan Mein Chandar Har Hai Saaje, Mastakpar Mukut Hai Viraje.
Tej Punchh Shubh Sinhan Saaje, Mahatir Shir Nag Chandana Laaje ||4||

Modak Laddu Bhojan Karat, Muskil Sab Tan Ki Harat.
Chalisa Padhe Ganapati Ghara Aave, Sankat Kate Rog Mitaave ||5||

Karahu Anugraha Deen Ko Data, Sab Mein Ati Priya Teri Bata.
Dhanya Dhanya Tum Dev Ganraja, Karte Sab Ke Purn Hai Kaaja ||6||

Keeta Paaphi Bhujangaroop Dhari, Lanka Langhi Gaye Sab Paar Kari.
Riddhisiddhi Tere Charanki Daasi, Aisi Kripa Karo Ganapati Rasi ||7||

Mushakroop Karahu Sawari, Devtan Mein Pujye Sabse Pyaari.
Kamal Nayanam Vilambi Karna, Karo Kripa Jan Ko Nirvana ||8||

Amrit Leela Tum Darshayo, Karahu Kripa Bhari Layo.
Bal Samay Tum Thahrayo Ravi Ko, Paap Taap Sab Harahu Sab Hi Ko ||9||

Paarvati Putra Maha Sukhkari, Ganpati Gajanand Gunkaari.
Tera Mangal Naam Sunaye, Kathin Se Kathin Sankat Tul Jaaye ||10||

Ganapati Mohey Darsh Dikhavo, Vighn Vinashak Man Bhayo Aavo.
Tumhare Darsh Mujhe Sukh Hove, Dukhon Ka Jab Antar Khove ||11||

Dosh Daridra Dur Karahu Dev, Jo Nit Kare Tumhari Sev.
Teri Sharan Mein Main Aayo, Mangal Naam Sada Gun Gayo ||12||

Deen Dayalu Suno Mere Swami, Karahu Kripa Antaryami.
Sukh Sampatti De Mere Ghara Mein, Amrit Barasao Mere Man Mein ||13||

Mangal Mein Mangal Karnewaale, Aavo Ganpati Ek Nirale.
Dhanya Dhanya Sab Jan Suchaye, Jin Jin Ganpati Tum Man Bhaye ||14||

Ganpati Gajaanand Gunkaari, Mangal Karo Brahmaachaari.
Vinay Sunahu Ganapati Dayala, Charan Sharan Rakhahu Kripa Nala ||15||

Jai Jai Jai Shri Ganesh Gundhama, Paar Karahu Mero Bhav Sagar Rama.
Tulsidas Sharan Tumhari, Meti Sankat Ho Sukhakaari ||16||

Ashtanayak Ashta Bhujadhari, Vighna Vinashak Mangalakaari.
Keejey Kripa Sharanmein Aaye, Ganpati Jan Maan Mein Tum Chaaye ||17||

Kaama Krodh Lobh Moha Mithayo, Prem Bhakti Ke Beej Jamayo.
Gun Gaao Ganpati Ke Bhai, Vighna Mitein Karein Bhalai ||18||

Ashtasiddhi Nav Nidhi Ke Data, Ganpati Tumse Na Koi Aata.
Jo Yah Paath Kare Man Laai, Taako Siddhi Phalthi Bhai ||19||

Chalisa Padhe Jo Koi Ganesh Ka, Hove Siddhi Sakhi Umesh Ka.
Ganapati Murti Maan Mein Dharei, Sarv Karya Siddha Ho Karei ||20||

|| Doha ||
Yah Chalisa Ganesh Ki, Paath Kare Dhari Dhyaan.
Nit Nav Mangal Ghar Basey, Lahe Param Sukh Gyaan.

|| Iti Shri Ganesh Chalisa Sampurnam ||`
  },
  {
    id: '6935d729a41c13fcdcbb13b6',
    roman: `|| Shri Shiv Chalisa ||

|| Doha ||
Shri Ganesh Girija Suvan, Mangal Mul Sujaan.
Kahiye Ram Siya Sang Madhu, Gurupad Padma Paraan.

|| Chaupai ||
Jai Girijapati Deendayala, Sada Karat Santan Pratipala.
Bhal Chandrama Sohati Nike, Kanan Kundal Nagaphani Ke ||1||

Ang Gaur Shira Ganga Bahai, Mundamal Tan Chhaar Lagaai.
Vastra Khaal Baghambar Sohain, Chhavi Ko Dekh Naag Man Mohein ||2||

Maina Matu Ki Hvai Dulari, Bam Ang Sohat Chhavi Nyari.
Kar Mein Trishul Sohat Chhavi Bhari, Karat Sada Shatrun Kshayakari ||3||

Nandi Ganesh Sohain Tahan Kaise, Sagar Madhy Kamal Hai Jaise.
Kartik Shyam Aur Ganrau, Ya Chhavi Ko Kahi Jaat Na Kau ||4||

Devanheen Jab Bhayo Pukaara, Tab Shankar Kinha Sahaara.
Vishya Visha Ko Pee Liya Nila, Neelkanth Tab Naam Padila ||5||

Pujan Ramchandra Jab Keenha, Lanka Vidhvans Tab Tehi Keenha.
Sahas Kamal Mein Ho Rahe Dhari, Keenha Pariksha Tab Tripurari ||6||

Ek Kamal Prabhu Raakheu Joi, Nain Kamal So Pooja Soi.
Kathin Bhakti Dekhi Prabhu Shankar, Daeu Ichha Dhan Jayadhanu Dhar ||7||

Tej Pratap Adbhut Sansara, Kashi Mein Ho Mahadev Tumhara.
Rigved Yajurved Sam Gaawe, Atharvaved Shir Dhunawaye ||8||

Naag Lok Mein Sab Milkar, Gaave Puran Veda Upanisad.
Trigunswami Ki Arti Gaave, Hari Brahma Shiv Dhyan Lagave ||9||

Jo Yah Padhe Mahashivratri Ko, Sarv Siddhi Hoi Naath Prabhuthi Ko.
Graha Peera Aur Dukh Naashai, Shiv Charitra Man Mein Prakaashai ||10||

Shankarachalisa Jo Koi Gave, Man Vanchhit Phal Paave.
Yah Shiv Chalisa Jo Padhe, Shiv Kripa Se Sab Dukh Kadhe ||11||

Shambhu Nath Ke Man Mein Lave, Nirmal Buddhi Pavey Sukh Pave.
Sab Sukh Lahe Jo Man Layee, Kari Shiv Puja Man Mein Dhare ||12||

Jai Jai Mahesh Sada Sukhdani, Pahi Pahi Kripa Nidhi Gunkhani.
Kal Kaal Ka Sab Dukh Naashe, Sankat Mite Aur Ridhi Siddhi Raashe ||13||

Rogi Chinta Sab Dur Bhaage, Ganapati Ko Tum Man Laage.
Chaalis Pad Ka Yah Gungan, Karahu Nath Ab Apna Baan ||14||

Shankar Ko Nit Dhyaan Laayein, Sada Shiv Ki Kripa Paayein.
Mantra Tantra Sab Siddhi Karat Hai, Shankar Ji Man Ko Harat Hai ||15||

Yah Chalisa Shiv Ji Ki Gaave, Ghar Mein Shanti Sada Sukh Paave.
Grah Dosh Dur Hote Jaaye, Bhoot Pret Sab Door Nasaye ||16||

Keejey Kripa Shankar Dayala, Karo Prabhu Hamare Pratipala.
Namo Namo Jai Namah Shivaya, Sab Sankat Se Rakhahu Chhaya ||17||

Shankar Mahadeva Tripurari, Keejey Nath Hamare Atkaari.
Vighna Vinashak Mangalkari, Karo Prabhu Ab Kripa Humari ||18||

Mahasaktishali Mahadeva, Karat Sada Shankar Ji Seva.
Jata Mein Gang Athi Suhavani, Naag Gale Mein Sohe Suhani ||19||

Namo Namo Bhole Shankar Ko, Namo Namo Jai Shashi Dhar Ko.
Teri Mahima Ko Koi Na Jane, Tum Sab Ke Antarayami Mane ||20||

|| Doha ||
Shankar Chalisa Jo Padhe, Prem Sahit Nar Laaye.
Mangal Sab Vidhi Hoy Jag, Sankat Sab Mitjaaye.

|| Iti Shri Shiv Chalisa Sampurnam ||`
  },
  {
    id: '693e89d4e6eb34298954f822',
    roman: `|| Shri Brahma Chalisa ||

|| Doha ||
Shri Ganesh Sharada Sumir, Guru Charan Ko Dhyaan.
Brahma Chalisa Likhi Rahi, Dejo Buddhi Vidhaan.

|| Chaupai ||
Jai Jai Jai Shri Brahma Bhagwan, Charon Veda Ke Gyaan Nidhan.
Char Mukh Char Bhuja Dhari, Kamandal Kar Mein Shobhakari ||1||

Veda Pustak Karmandal Dhari, Aksharmala Kar Mein Sohahi.
Svet Vastra Dhari Shubh Kaaya, Satvik Gun Se Jagat Rachaya ||2||

Hans Vahini Sushobhit Sundara, Gyaan Jyoti Se Bhare Andara.
Pushkar Kshetra Tumhara Hai Pyara, Janame Prabhu Kamal Se Nyara ||3||

Brahma Lok Mein Hai Tav Vaasa, Poori Karo Jan Jan Ki Aasa.
Srishti Rachana Kari Tum Keenhi, Jivandata Sab Jiiv Ko Deenhi ||4||

Saraswati Tumhari Hai Rani, Buddhi Vidhata Veda Ki Gyaani.
Savituri Gayatri Sukhdaata, Sab Vidya Ki Tum Ho Vidhata ||5||

Aadi Dev Tum Adi Vichara, Tum Bina Srishti Ka Koi Na Sahara.
Ridhi Siddhi Mangal Phal Daata, Sab Sankat Ke Dur Karta ||6||

Sab Deva Kare Tumhari Vandana, Vedmurti Tum Gyaan Ke Nandana.
Hari Shankar Sab Tumko Dhyave, Brahma Gyaan Tumse Sab Pave ||7||

Srishti Sthiti Parlaya Ke Karta, Paramatma Ke Roop Nidharta.
Char Yug Mein Tumhari Mahima, Apar Anant Agam Gariima ||8||

Jo Karai Tumhara Dhyaan Nit Nit, Sadbuddhi Pave Mann Nishchit.
Jo Tumhari Sharnaai Aave, Sab Dukh Kashtse Chhut Jaave ||9||

Magh Mein Pushkar Mela Aave, Brahma Darshan Ko Man Lalchave.
Dharti Par Ek Hi Mandir Tera, Pushkar Mein Hai Darshan Tera ||10||

Vidya Daan Tum Sab Ko Dete, Gyaan Jyoti Sab Mein Tum Bharte.
Karahu Kripa Sabpar Brahma Dev, Kare Sab Jan Tumhari Sev ||11||

Vishwa Vidyalay Ke Tum Swami, Sab Ghatmein Birajey Antaryami.
Jo Nit Dhyaan Tumhara Karey, Vidya Riddhi Siddhi Sab Bharey ||12||

Prabhu Tumhe Pranam Hazaaron, Sankat Se Sab Ko Ubaaaron.
Tumhari Kripa Se Mati Badhey, Buddhi Vivek Sada Mann Radhey ||13||

Sab Jiivon Mein Tum Samaye, Janma Mritu Ka Chakra Chalaye.
Brahma Dev Pranam Tumhein, Chalisa Padhe Shradha Se Amein ||14||

Ridhi Siddhi Tum Sab Ko Dete, Vidyarthee Ka Mann Harlete.
Gyaan Vigyan Buddhi Vardhaana, Karein Satya Ka Nit Pramaana ||15||

Apaar Mahima Tumhari Devaa, Karo Sada Tumhari Sevaa.
Jai Jai Brahma Jai Jagdishaa, Poori Karo Meri Manosha ||16||

Jo Nit Prem Se Chalisa Gaave, Sab Sankat Se Mukti Paave.
Brahma Deva Ki Jo Sev Kare, Man Vanchhit Sab Phal Bhare ||17||

Teri Mahima Anant Anantta, Gaave Muni Jan Sesh Mahanta.
Pragat Prakaash Karo Jagadisha, Brahma Chalisa Padhe Jo Nisha ||18||

Jan Jan Ke Antar Mein Basiye, Mangal Karein Sab Kasht Nasiye.
Deen Dayal Daya Karo Devaa, Kare Nirmmal Tan Man Meri Sevaa ||19||

Sankat Kate Mitein Sab Peera, Brahma Bhajan Karein Mann Dheera.
Aasa Puran Ho Sabki Swami, Karahu Kripa He Antaryami ||20||

|| Doha ||
Yah Chalisa Brahma Ji Ki, Padhe So Lahe Sukh Chain.
Brahma Kripa Se Vidya Lahe, Riddhi Siddhi Nau Nidhi Gain.

|| Iti Shri Brahma Chalisa Sampurnam ||`
  },
  {
    id: '694232d6d7816e73f6dadc7f',
    roman: `|| Shri Rani Sati Chalisa ||

|| Doha ||
Rani Sati Ke Charan Mein, Koti Koti Pranam.
Daya Drishti Nij Dason Par, Keejey Subh Subh Kaam.

|| Chaupai ||
Jai Jai Jai Shri Rani Sati Maata, Tum Ho Jagat Janani Vikhyata.
Jhunjhunu Nagari Mein Virajey, Bhakton Ke Sankat Sab Tajey ||1||

Narayani Namo Narayani, Tum Ho Jagat Ki Jan Kalyani.
Shradha Bhakti Se Jo Tum Dhyave, Sab Sankat Se Mukti Pave ||2||

Maha Sati Tum Maha Tapasvini, Sankat Haran Sada Sukhdayini.
Pativrata Dharm Ko Nibhaaya, Agni Mein Prakat Ho Sati Kahlaaya ||3||

Mahasati Ka Prabhav Nirala, Jagat Mein Tera Naam Ujala.
Jo Teri Sharan Mein Aave, Sab Dukh Sankat Door Bhagave ||4||

Anant Mahima Teri Maiyya, Karo Kripa Rakho Apni Chhaiyya.
Deen Dayal Daya Karo Mata, Tum Ho Sab Ki Sukhadaata ||5||

Bhakton Ko Tum Deti Sahara, Karte Sab Ka Beda Para.
Rani Sati Maa Tum Ho Pyari, Tumpe Sab Ki Aas Hamari ||6||

Teri Jyoti Jagat Mein Chhaai, Pavitra Tav Mukh Ki Shobha Nyaari.
Sada Suhagan Saubhagya Dayini, Mangal Karo Sada Sukhdayini ||7||

Chalisa Tumhara Jo Nit Gave, Riddhi Siddhi Sampatti Pave.
Ghar Mein Sukh Shanti Ho Aaye, Dukh Daridra Sab Door Nasaye ||8||

Rani Sati Ki Jai Jai Bolo, Bhakti Bhav Se Mann Ko Kholo.
Tumhare Charan Ki Sharan Mein Aaye, Sab Manokamna Purn Ho Jaaye ||9||

Pooja Archana Jo Nit Kare, Sab Sankat Tere Door Kare.
Teri Mahima Aparampar, Karo Maa Hamara Uddhaar ||10||

Jai Rani Sati Maharani, Teri Katha Amrit Ki Baani.
Jo Sunein Shradha Se Prani, Hoye Purn Sab Ki Kahani ||11||

Sada Suhaag Bharo Ki Jholi, Bhakton Se Tum Ras Ki Boli.
Dharam Karam Ke Path Chalaye, Nij Dason Ko Sharan Mein Laye ||12||

Dhan Daulat Dey Gharmein Maata, Sukh Sampatti Ki Tum Ho Daata.
Vrat Niyam Jo Bhi Karey, Maata Sab Manorath Purey ||13||

Jhunjhunu Nagari Tera Dham, Tere Darshan Se Purey Kaam.
Triveni Sangam Sa Pavitra, Tera Mandir Adbhut Vichitra ||14||

Teri Pooja Jo Nit Kare Maiya, Uspe Rahe Sada Teri Chhaiya.
Maata Rani Sati Maharani, Teri Jai Ho Teri Kahani ||15||

Chalisa Jo Padhe Man Laai, Sab Sukh Pave Sankat Jaai.
Rani Sati Ki Jai Bolo Bhai, Teri Kripa Se Nahi Koi Parai ||16||

Maata Rani Tum Sabki Pyari, Tum Bina Suni Hai Jag Sari.
Karahu Kripa Maata Tum Humpar, Rahe Sada Teri Chhaya Ghar Par ||17||

Sab Dukh Haro Maa Rani Sati, Bhakton Ki Rakhiyo Laaj Sati.
Sada Suhagan Raakhiyo Maata, Karahu Kripa He Prem Ki Data ||18||

Rani Sati Tumhari Mahima, Anant Anant Agam Garima.
Jo Nit Tumhara Naam Jaape, Sab Sankat Se Mukt Ho Aape ||19||

Chalisa Padho Shradha Poorvak, Rani Sati Rakhein Sadaa Sarthak.
Bhakti Bhav Se Jas Gun Gaavo, Maata Ki Kripa Sada Paavo ||20||

|| Doha ||
Rani Sati Chalisa Padhe, Prem Sahit Jo Koi.
Sab Sankat Se Chhut Karey, Mangal Mein Sab Hoi.

|| Iti Shri Rani Sati Chalisa Sampurnam ||`
  },
  {
    id: '69861eff8a129c3c8ca87cf3',
    roman: `Mata Ramo Matpita Ramachandrah
Svami Ramo Matsakhaa Ramachandrah.
Sarvasvam Me Ramachandro Dayaluh
Naanyam Jaane Naiva Jaane Na Jaane ||

|| Iti Shri Rama Shloka Sampurnam ||`
  },
  {
    id: '69861eff8a129c3c8ca87cf6',
    roman: `Rama Avatara — Shri Rama the Seventh Incarnation of Lord Vishnu.
Born in Ayodhya as the son of King Dasharatha and Queen Kausalya.

|| Iti Shri Rama Avatara Shloka Sampurnam ||`
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    for (const u of updates) {
      const doc = await Devotional.findById(u.id);
      if (!doc) { console.log('❌ Not found ID:', u.id); continue; }
      const oldLyrics = doc.lyrics || '';
      if (/Iti.*Sampurnam/i.test(oldLyrics)) {
        console.log('⏭  Already has Roman:', doc.title);
        continue;
      }
      doc.lyrics = oldLyrics + '\n\n---\n\n' + u.roman;
      await doc.save();
      console.log('✅ Updated:', doc.title);
    }
    console.log('\nAll remaining done.');
  } catch (err) { console.error('Error:', err); process.exitCode = 1; }
  finally { await mongoose.connection.close(); console.log('Done.'); }
}
run();
