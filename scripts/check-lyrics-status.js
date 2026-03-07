const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: String, lyrics: String, category: String
});
const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  const all = await Devotional.find({});
  const devRe = /[\u0900-\u097F]/;
  let withLyrics = 0, mixed = 0, devOnly = 0, engOnly = 0, noLyrics = 0;
  const devOnlyList = [];

  for (const d of all) {
    const l = d.lyrics || '';
    if (!l.trim()) { noLyrics++; continue; }
    withLyrics++;
    const hasDev = devRe.test(l);
    const hasEng = /[a-zA-Z]{3,}/.test(l);
    if (hasDev && hasEng) mixed++;
    else if (hasDev) { devOnly++; devOnlyList.push(d.category + ' | ' + d.title); }
    else if (hasEng) engOnly++;
  }

  console.log('Total:', all.length);
  console.log('With lyrics:', withLyrics);
  console.log('Mixed (Hindi+English):', mixed);
  console.log('Devanagari only (need Roman):', devOnly);
  console.log('English only:', engOnly);
  console.log('No lyrics:', noLyrics);

  if (devOnlyList.length > 0) {
    console.log('\n--- Devanagari-only (sample, max 20): ---');
    devOnlyList.slice(0, 20).forEach(t => console.log('  ' + t));
    if (devOnlyList.length > 20) console.log('  ... and', devOnlyList.length - 20, 'more');
  }

  await mongoose.connection.close();
}
run();
