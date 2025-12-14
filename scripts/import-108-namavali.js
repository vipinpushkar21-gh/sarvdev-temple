const mongoose = require('mongoose');
const XLSX = require('xlsx');
const sanscript = require('sanscript');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Sanskrit' },
  deity: { type: String },
  subCategory: { type: String },
  names: [{ sanskrit: String, mantra: String, english: String }],
  audioUrl: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function import108Namavali() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const workbook = XLSX.readFile('data/108-namavali.xlsx');
    console.log('Sheet names:', workbook.SheetNames);

    let totalInserted = 0;

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 3) {
        console.log(`Skipping sheet ${sheetName}: insufficient data`);
        continue;
      }

      console.log(`Processing sheet ${sheetName}`);

      // Group by deity within the sheet
      const deitiesData = {};
      let currentDeity = null;
      let currentNames = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.length === 1 && row[0] && row[0].toString().trim()) {
          // Deity row
          const deityRaw = row[0].toString().trim();
          const deity = deityRaw.replace(/\s*108 Name\s*$/, '').trim();
          if (currentDeity && currentNames.length > 0) {
            deitiesData[currentDeity] = currentNames;
          }
          currentDeity = deity;
          currentNames = [];
        } else if (row.length >= 3 && i >= 1) { // Skip headers row (i=1)
          // Data row
          if (currentDeity) {
            let sanskrit = (row[0] || '').trim();
            const mantra = (row[1] || '').trim();
            let english = (row[2] || '').trim();

            if (mantra && english) {
              if (!sanskrit) {
                sanskrit = sanscript.t(english, 'itrans', 'devanagari');
              }
              currentNames.push({ sanskrit, mantra, english });
            }
          }
        }
      }
      // Last one
      if (currentDeity && currentNames.length > 0) {
        deitiesData[currentDeity] = currentNames;
      }

      // Now insert for each deity
      for (const [deity, names] of Object.entries(deitiesData)) {
        console.log(`Deity: ${deity}, Names: ${names.length}`);
        const doc = {
          title: `108 Namavali — ${deity}`,
          deity,
          category: '108 Namavali',
          status: 'pending-review',
          names
        };

        const existing = await Devotional.findOne({ title: doc.title, deity });
        if (existing) {
          console.log(`108 Namavali for ${deity} already exists (id: ${existing._id}). Skipping.`);
        } else {
          const newDoc = new Devotional(doc);
          await newDoc.save();
          console.log(`✓ Added: ${doc.title} (${names.length} names)`);
          totalInserted++;
        }
      }
    }

    const totalDocs = await Devotional.find({ category: '108 Namavali' });
    console.log(`\nTotal 108 Namavali documents in DB: ${totalDocs.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error importing 108 Namavali:', error);
    process.exit(1);
  }
}

import108Namavali();
