const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String, default: 'Path' },
  language:    { type: String, default: 'Hindi' },
  deity:       { type: String },
  lyrics:      { type: String },
  audio:       { type: String },
  status:      { type: String, default: 'approved' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

// Read lyrics from external file
const lyricsPath = path.join(__dirname, 'sundarkand-path-lyrics.txt');
const lyrics = fs.readFileSync(lyricsPath, 'utf-8');

const sundarkandPath = {
  title: 'सुन्दरकाण्ड पाठ (Sundarkand Path)',
  deity: 'Shri Ram',
  category: 'Path',
  language: 'Hindi',
  status: 'approved',
  description: 'श्रीरामचरितमानस का सुन्दरकाण्ड – सम्पूर्ण पाठ हिंदी में। तुलसीदासजी द्वारा रचित यह काण्ड भगवान हनुमान की लंका यात्रा, माता सीता से भेंट, लंका दहन और समुद्र पर सेतु निर्माण की कथा का वर्णन करता है।',
  lyrics: lyrics,
  audio: ''
};

async function addSundarkandPath() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Devotional.findOne({ title: sundarkandPath.title, category: 'Path' });
    if (existing) {
      // Update lyrics if already exists
      existing.lyrics = sundarkandPath.lyrics;
      existing.description = sundarkandPath.description;
      existing.status = 'approved';
      await existing.save();
      console.log('✓  Updated existing: ' + sundarkandPath.title);
    } else {
      const doc = new Devotional(sundarkandPath);
      await doc.save();
      console.log('✓  Added: ' + sundarkandPath.title);
    }

    const total = await Devotional.countDocuments({ category: 'Path' });
    console.log(`\nTotal Path devotionals in DB: ${total}`);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

addSundarkandPath();
