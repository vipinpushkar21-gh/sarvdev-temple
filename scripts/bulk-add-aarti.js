/*
Bulk import 15+ Aarti entries from a single numbered paste.

Usage examples:
  node scripts/bulk-add-aarti.js --file=tmp_bulk_aarti.txt --dry-run
  node scripts/bulk-add-aarti.js --file=tmp_bulk_aarti.txt --deity=Hanuman
  node scripts/bulk-add-aarti.js --file=tmp_bulk_aarti.txt --status=approved

Paste format (flexible):
  1
  Jai Ambe Gauri Aarti | Durga
  [Hindi lyrics...]
  
  [English transliteration/translation...]
  2
  Hanuman Ji Ki Aarti | Hanuman
  [lyrics...]
  ...

Parsing rules:
- A new segment starts at a line beginning with a number (e.g., "1", "2.", "3)").
- The first non-empty line after the number is the title. If it contains "|", the part after "|" is used as deity.
- Everything until the next numbered line is captured as `lyrics` (you can include Hindi + English together).
- If no deity in title and `--deity` is provided, use that as default; else leave undefined.
- Category defaults to "Aarti"; status defaults to "approved".
*/

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const argv = process.argv.slice(2);
function getArg(name, def) {
  const found = argv.find(a => a.startsWith(`--${name}=`));
  if (!found) return def;
  return found.split('=')[1];
}
function hasFlag(name) {
  return argv.includes(`--${name}`);
}

const FILE_PATH = getArg('file', 'tmp_bulk_aarti.txt');
const DEFAULT_DEITY = getArg('deity', undefined);
const DEFAULT_CATEGORY = getArg('category', 'Aarti');
const DEFAULT_LANGUAGE = getArg('language', 'Hindi');
const DEFAULT_STATUS = getArg('status', 'approved');
const DRY_RUN = hasFlag('dry-run');

// Reuse the same URI pattern as other scripts for consistency
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  language: { type: String, default: 'Hindi' },
  deity: { type: String },
  lyrics: { type: String },
  audioUrl: { type: String },
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Devotional = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);

function parseSegments(text) {
  const lines = text.split(/\r?\n/);
  const segments = [];
  let current = null;

  // matches ASCII numbers like "1", "2.", "3)" and Devanagari digits like "१", "२", "३)"
  const numberRegex = /^\s*([0-9०-९]{1,3})\s*[\)\.:\-]?\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (numberRegex.test(line)) {
      // start new segment
      if (current) {
        segments.push(current);
      }
      current = { index: parseInt(line), title: '', deity: undefined, bodyLines: [] };
      // consume following blank lines
      continue;
    }
    if (!current) {
      // skip preamble until first number
      continue;
    }
    if (!current.title) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        continue; // still looking for title
      }
      // Title may include optional deity part after '|'
      const pipeIdx = trimmed.indexOf('|');
      if (pipeIdx !== -1) {
        current.title = trimmed.slice(0, pipeIdx).trim();
        const deityPart = trimmed.slice(pipeIdx + 1).trim();
        current.deity = deityPart || undefined;
      } else {
        current.title = trimmed;
      }
      continue;
    }
    // Collect lyrics/body
    current.bodyLines.push(line);
  }
  if (current) segments.push(current);

  // Finalize into objects
  return segments
    .filter(seg => seg.title && seg.bodyLines.length > 0)
    .map(seg => ({
      index: seg.index,
      title: seg.title,
      deity: seg.deity || DEFAULT_DEITY,
      lyrics: seg.bodyLines.join('\n').trim()
    }));
}

async function main() {
  const absPath = path.resolve(FILE_PATH);
  if (!fs.existsSync(absPath)) {
    console.error(`Input file not found: ${absPath}`);
    process.exit(1);
  }
  const text = fs.readFileSync(absPath, 'utf8');
  const entries = parseSegments(text);

  if (entries.length === 0) {
    console.error('No entries parsed. Ensure lines start with numbers (e.g., 1, 2., 3)).');
    process.exit(1);
  }

  console.log(`Parsed ${entries.length} aarti segment(s):`);
  for (const e of entries) {
    const previewTitle = e.deity ? `${e.title} | ${e.deity}` : e.title;
    console.log(`- #${e.index}: ${previewTitle} (lines: ${e.lyrics.split(/\r?\n/).length})`);
  }

  if (DRY_RUN) {
    console.log('\nDry-run mode: no database writes performed.');
    process.exit(0);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let inserted = 0, skipped = 0;
    for (const e of entries) {
      // Check existing by exact title + category + deity
      const existing = await Devotional.findOne({ title: e.title, deity: e.deity, category: DEFAULT_CATEGORY });
      if (existing) {
        console.log(`Skip (exists): ${e.title} | ${e.deity || '—'} -> ${existing._id}`);
        skipped++;
        continue;
      }
      const doc = new Devotional({
        title: e.title,
        description: e.title,
        category: DEFAULT_CATEGORY,
        language: DEFAULT_LANGUAGE,
        deity: e.deity,
        lyrics: e.lyrics,
        status: DEFAULT_STATUS
      });
      const saved = await doc.save();
      console.log(`✓ Inserted: ${e.title} | ${e.deity || '—'} -> ${saved._id}`);
      inserted++;
    }

    await mongoose.connection.close();
    console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}.`);
  } catch (err) {
    console.error('Error during import:', err);
    process.exit(1);
  }
}

main();
