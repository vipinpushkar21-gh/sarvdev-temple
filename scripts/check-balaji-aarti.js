const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  deity: { type: String },
  language: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function checkBalajiAarti() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const entries = await Devotional.find({ title: /बालाजी|Balaji/i, category: 'Aarti' }).sort({ createdAt: -1 });
    console.log(`\nBalaji Aarti entries: ${entries.length}`);
    entries.forEach((d, i) => {
      console.log(`${i + 1}. ${d.title} — deity: ${d.deity} — status: ${d.status}`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error checking Balaji Aarti:', err);
    process.exit(1);
  }
}

checkBalajiAarti();
