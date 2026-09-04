#!/usr/bin/env node
/**
 * Batch validation: Create minimal test records for Spiritual Icon, Blog, Darshan, Event
 * Verifies folder persistence across all content types
 */
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

async function batchValidateAllEntities() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not configured');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Define MediaAsset schema
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

    const testCases = [
      {
        name: 'Spiritual Icon',
        folder: 'sarvdev/spiritual-icons',
        schema: new Schema({
          name: String,
          slug: { type: String, index: true },
          category: String,
          primaryMedia: { type: MediaAssetSchema },
        }),
        record: {
          name: 'Validation SI',
          slug: 'validation-si',
          category: 'personality-type',
          primaryMedia: {
            url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/spiritual-icons/test.jpg',
            publicId: 'sarvdev/spiritual-icons/test',
            assetId: 'asset-si-123',
            version: 123,
            width: 1024,
            height: 1024,
            format: 'jpg',
            bytes: 262144,
            folder: 'sarvdev/spiritual-icons',
            kind: 'portrait',
          },
        },
      },
      {
        name: 'Blog',
        folder: 'sarvdev/blogs',
        schema: new Schema({
          title: String,
          slug: { type: String, index: true },
          cardMedia: { type: MediaAssetSchema },
          heroMedia: { type: MediaAssetSchema },
        }),
        record: {
          title: 'Validation Blog',
          slug: 'validation-blog',
          cardMedia: {
            url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/blogs/card.jpg',
            publicId: 'sarvdev/blogs/card',
            assetId: 'asset-blog-card-123',
            version: 123,
            width: 1600,
            height: 900,
            format: 'jpg',
            bytes: 393216,
            folder: 'sarvdev/blogs',
            kind: 'blog-photo',
          },
          heroMedia: {
            url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/blogs/hero.jpg',
            publicId: 'sarvdev/blogs/hero',
            assetId: 'asset-blog-hero-123',
            version: 123,
            width: 1920,
            height: 1080,
            format: 'jpg',
            bytes: 524288,
            folder: 'sarvdev/blogs',
            kind: 'blog-photo',
          },
        },
      },
      {
        name: 'Darshan',
        folder: 'sarvdev/darshan',
        schema: new Schema({
          title: String,
          slug: { type: String, index: true },
          primaryMedia: { type: MediaAssetSchema },
          cardMedia: { type: MediaAssetSchema },
        }),
        record: {
          title: 'Validation Darshan',
          slug: 'validation-darshan',
          primaryMedia: {
            url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/darshan/thumb.jpg',
            publicId: 'sarvdev/darshan/thumb',
            assetId: 'asset-darshan-thumb-123',
            version: 123,
            width: 400,
            height: 300,
            format: 'jpg',
            bytes: 131072,
            folder: 'sarvdev/darshan',
            kind: 'darshan',
          },
          cardMedia: {
            url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/darshan/card.jpg',
            publicId: 'sarvdev/darshan/card',
            assetId: 'asset-darshan-card-123',
            version: 123,
            width: 1600,
            height: 900,
            format: 'jpg',
            bytes: 262144,
            folder: 'sarvdev/darshan',
            kind: 'darshan',
          },
        },
      },
      {
        name: 'Event',
        folder: 'sarvdev/events',
        schema: new Schema({
          title: String,
          slug: { type: String, index: true },
          cardMedia: { type: MediaAssetSchema },
        }),
        record: {
          title: 'Validation Event',
          slug: 'validation-event',
          cardMedia: {
            url: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/events/card.jpg',
            publicId: 'sarvdev/events/card',
            assetId: 'asset-event-card-123',
            version: 123,
            width: 1600,
            height: 900,
            format: 'jpg',
            bytes: 327680,
            folder: 'sarvdev/events',
            kind: 'other',
          },
        },
      },
    ];

    console.log('📝 Creating validation records for all entities:\n');
    const results = [];

    for (const testCase of testCases) {
      console.log(`🔹 ${testCase.name}`);
      
      const Model = mongoose.model(`Test${testCase.name}`, testCase.schema);
      
      // Cleanup
      await Model.deleteMany({ slug: testCase.record.slug });
      
      // Create record
      const doc = new Model(testCase.record);
      const saved = await doc.save();
      
      // Verify each media field
      const mediaFields = ['primaryMedia', 'cardMedia', 'heroMedia'].filter(
        (field) => testCase.record[field]
      );
      
      let allFieldsValid = true;
      for (const field of mediaFields) {
        const media = saved[field];
        const hasFolder = media?.folder === testCase.folder;
        const hasPublicId = !!media?.publicId;
        const hasAssetId = !!media?.assetId;
        
        console.log(`   ✓ ${field}:`);
        console.log(`     - folder: ${hasFolder ? '✓' : '✗'} (${media?.folder})`);
        console.log(`     - publicId: ${hasPublicId ? '✓' : '✗'}`);
        console.log(`     - assetId: ${hasAssetId ? '✓' : '✗'}`);
        
        allFieldsValid = allFieldsValid && (hasFolder && hasPublicId && hasAssetId);
      }
      
      // Verify retrieval
      const retrieved = await Model.findById(saved._id).lean();
      const retrievedValid = mediaFields.every(
        (field) => retrieved?.[field]?.folder === testCase.folder
      );
      
      const status = allFieldsValid && retrievedValid ? '✓ PASS' : '✗ FAIL';
      results.push({ name: testCase.name, status });
      console.log(`   ${status}\n`);
      
      // Cleanup
      await Model.deleteMany({ slug: testCase.record.slug });
    }

    // Summary
    console.log('═══════════════════════════════════════════\n✅ VALIDATION SUMMARY\n═══════════════════════════════════════════\n');
    for (const { name, status } of results) {
      console.log(`${status} ${name}`);
    }

    const allPass = results.every((r) => r.status === '✓ PASS');
    if (allPass) {
      console.log('\n🎉 ALL ENTITIES VALIDATED - Folder persistence works across all content types!');
    } else {
      console.log('\n❌ Some validations failed');
      process.exit(1);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) console.error(error.stack);
    process.exit(1);
  }
}

batchValidateAllEntities();
