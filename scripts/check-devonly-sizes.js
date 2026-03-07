const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';
const DevotionalSchema = new mongoose.Schema({ title: String, lyrics: String, category: String });
const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  const all = await Devotional.find({});
  const devRe = /[\u0900-\u097F]/;
  for (const d of all) {
    const l = d.lyrics || '';
    if (!l.trim()) continue;
    const hasDev = devRe.test(l);
    const hasEng = /[a-zA-Z]{3,}/.test(l);
    if (hasDev && !hasEng) {
      console.log(d._id + ' | ' + d.category + ' | ' + d.title + ' | lyrics:' + l.length + 'chars');
    }
  }
  await mongoose.connection.close();
}
run();
