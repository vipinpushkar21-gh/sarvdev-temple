// One-time seed: Approve Tulsi Mata (already created with pending status)
// Run: node scripts/seed-tulsi-mata.mjs

import mongoose from 'mongoose';
import fs from 'fs';

// Read MONGODB_URI from .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const uriMatch = envFile.match(/MONGODB_URI=(.+)/);
if (!uriMatch) { console.error('No MONGODB_URI'); process.exit(1); }

await mongoose.connect(uriMatch[1].trim());

const result = await mongoose.connection.db.collection('deities').updateOne(
  { slug: 'tulsi-mata' },
  { $set: { status: 'approved' } }
);
console.log(result.modifiedCount ? '✅ Tulsi Mata approved' : '⚠️ Already approved or not found');
await mongoose.disconnect();
