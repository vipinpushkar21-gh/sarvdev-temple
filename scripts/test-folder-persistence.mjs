#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

const mediaAssetSchema = new mongoose.Schema({
  url: String,
  publicId: { type: String, index: true },
  assetId: { type: String, index: true },
  version: Number,
  width: Number,
  height: Number,
  format: String,
  bytes: Number,
  folder: String,
  alt: String,
  kind: { type: String, enum: ['temple-photo', 'deity-artwork', 'devotional-artwork', 'portrait', 'blog-photo', 'darshan', 'icon', 'other'] },
}, { _id: false });

const TestSchema = new mongoose.Schema({
  name: String,
  media: { type: mediaAssetSchema },
  createdAt: { type: Date, default: Date.now },
});

async function testFolderPersistence() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not configured');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);

    const Test = mongoose.model('TestFolderPersistence', TestSchema);

    // Delete any previous test records
    await Test.deleteMany({ name: 'folder-test' });

    console.log('\n📝 Creating test document with folder...');
    const testDoc = new Test({
      name: 'folder-test',
      media: {
        url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/test/file.jpg',
        publicId: 'sarvdev/test/file',
        assetId: 'asset-12345',
        version: 123,
        width: 2048,
        height: 2048,
        format: 'jpg',
        bytes: 524288,
        folder: 'sarvdev/test',
        kind: 'devotional-artwork',
      },
    });

    console.log('Input media object:', JSON.stringify(testDoc.media, null, 2));

    const saved = await testDoc.save();
    console.log('✅ Document saved');
    console.log('Saved media object:', JSON.stringify(saved.media, null, 2));

    console.log('\n🔍 Querying document back from MongoDB...');
    const retrieved = await Test.findById(saved._id).lean();
    
    if (!retrieved) {
      console.error('❌ Document not found');
      process.exit(1);
    }

    console.log('Retrieved media object:', JSON.stringify(retrieved.media, null, 2));

    if (retrieved.media?.folder === 'sarvdev/test') {
      console.log('\n✅ SUCCESS: folder field preserved in MongoDB!');
      console.log('All fields:');
      for (const [key, value] of Object.entries(retrieved.media || {})) {
        console.log(`  ${key}: ${value}`);
      }
    } else {
      console.log('\n❌ FAILURE: folder field NOT in MongoDB');
      console.log('Retrieved fields:', Object.keys(retrieved.media || {}));
    }

    // Cleanup
    await Test.deleteMany({ name: 'folder-test' });
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testFolderPersistence();
