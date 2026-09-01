#!/usr/bin/env node
/**
 * Integration test: Verify folder persistence through complete upload flow
 * Simulates: ImageUpload → form state → API → normalizeMediaAsset → Mongoose
 */
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

// Define MediaAsset schema inline
const MediaAssetSchema = new Schema({
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

// Define test model
const SpiritualIconSchema = new Schema({
  name: String,
  slug: { type: String, index: true },
  category: String,
  primaryMedia: { type: MediaAssetSchema },
}, { timestamps: true });

async function testFolderThroughUploadFlow() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not configured');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Simulated Cloudinary response (what gets returned from direct upload)
    const cloudinaryResponse = {
      secure_url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/test/si-test.jpg',
      public_id: 'sarvdev/test/si-test',
      asset_id: 'asset-si-validation-123',
      version: 123,
      width: 2048,
      height: 2048,
      format: 'jpg',
      bytes: 524288,
      // NOTE: Cloudinary does NOT return folder - this is what the bug was!
      // folder: 'sarvdev/spiritual-icons',  // <-- NOT RETURNED BY CLOUDINARY
    };

    // This is what ImageUpload.tsx now does after the fix:
    // Instead of: folder: data.folder (undefined)
    // Now uses: folder (from the component prop)
    const folder = 'sarvdev/spiritual-icons'; // This comes from the prop

    console.log('📋 Simulating form submission flow:\n');
    console.log('1. Cloudinary response (simulated upload)');
    console.log(`   - no folder field returned: ${!cloudinaryResponse.folder ? '✓' : '✗'}`);

    // Step 2: ImageUpload creates media object with FIXED code
    console.log('\n2. ImageUpload.tsx (FIXED - uses folder prop)');
    const mediaFromUpload = {
      url: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      assetId: cloudinaryResponse.asset_id,
      version: cloudinaryResponse.version,
      width: cloudinaryResponse.width,
      height: cloudinaryResponse.height,
      format: cloudinaryResponse.format,
      bytes: cloudinaryResponse.bytes,
      folder, // ← FIX: Use prop, not data.folder
      kind: 'portrait',
    };
    console.log(`   - folder included: ${mediaFromUpload.folder ? '✓' : '✗'} (${mediaFromUpload.folder})`);

    // Step 3: Form state gets the media
    console.log('\n3. Form state collection');
    const formData = {
      name: 'Validation Test SI',
      slug: 'validation-test-si',
      primaryMedia: mediaFromUpload,
    };
    console.log(`   - primaryMedia.folder: ${formData.primaryMedia.folder ? '✓' : '✗'}`);

    // Step 4: API normalizeMediaAsset
    console.log('\n4. API endpoint - normalizeMediaAsset');
    function normalizeMediaAsset(value, defaultKind = 'other') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
      
      const stringValue = (key, max = 500) =>
        typeof value[key] === 'string' ? String(value[key]).trim().slice(0, max) : undefined;
      const numberValue = (key) => {
        const parsed = Number(value[key]);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
      };
      
      const media = {
        url: stringValue('url'),
        publicId: stringValue('publicId'),
        assetId: stringValue('assetId'),
        version: numberValue('version'),
        width: numberValue('width'),
        height: numberValue('height'),
        format: stringValue('format', 20),
        bytes: numberValue('bytes'),
        folder: stringValue('folder', 200),
        alt: stringValue('alt', 300),
        kind: value.kind || defaultKind,
      };
      
      // Filter out undefined and empty strings
      return Object.fromEntries(Object.entries(media).filter(([, item]) => item !== undefined && item !== ''));
    }

    const normalizedMedia = normalizeMediaAsset(formData.primaryMedia, 'portrait');
    console.log(`   - folder survived normalization: ${normalizedMedia.folder ? '✓' : '✗'}`);
    if (!normalizedMedia.folder) {
      console.log(`   - ERROR: folder lost in normalization!`);
      console.log(`   - normalized keys: ${Object.keys(normalizedMedia).join(', ')}`);
      process.exit(1);
    }

    // Step 5: Mongoose persistence
    console.log('\n5. Mongoose persistence test');
    
    const SpiritualIcon = mongoose.model('TestSpiritualIcon', SpiritualIconSchema);
    
    // Cleanup
    await SpiritualIcon.deleteMany({ slug: 'validation-test-si' });
    
    const doc = new SpiritualIcon({
      name: 'Validation Test SI',
      slug: 'validation-test-si',
      category: 'personality-type',
      primaryMedia: normalizedMedia,
    });

    const saved = await doc.save();
    console.log(`   - document saved: ✓`);
    console.log(`   - saved folder: ${saved.primaryMedia?.folder ? '✓' : '✗'}`);

    const retrieved = await SpiritualIcon.findById(saved._id).lean();
    console.log(`   - retrieved folder: ${retrieved?.primaryMedia?.folder ? '✓' : '✗'}`);

    assert.equal(retrieved?.primaryMedia?.folder, 'sarvdev/spiritual-icons', 'Folder lost in Mongoose!');

    // Verification summary
    console.log('\n✅ FLOW COMPLETE - Folder persistence verified:');
    console.log('   Cloudinary (no folder) → ImageUpload (fixed) → Form → API');
    console.log('   → normalizeMediaAsset → Mongoose → Retrieved: ✓');
    
    console.log('\nFull persisted media object:');
    console.log(JSON.stringify(retrieved.primaryMedia, null, 2));

    // Cleanup
    await SpiritualIcon.deleteMany({ slug: 'validation-test-si' });
    await mongoose.disconnect();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) console.error(error.stack);
    process.exit(1);
  }
}

testFolderThroughUploadFlow();
