#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

async function listValidationRecords() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not configured');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);

    // List collections to understand what's available
    const collections = await mongoose.connection.db?.listCollections().toArray();
    const validationCollections = collections?.filter(c => 
      ['spiritualicons', 'blogs', 'darshans', 'events'].some(col => c.name.includes(col))
    ) || [];

    console.log('📊 Checking for validation test records...\n');

    // Check Spiritual Icons
    const SpiritualIconSchema = new mongoose.Schema({}, { strict: false });
    const SpiritualIcon = mongoose.model('SpiritualIcon', SpiritualIconSchema, 'spiritual-icons');
    const siCount = await SpiritualIcon.countDocuments({ name: { $regex: /test|validation/i } });
    console.log(`🏞️  Spiritual Icons (test/validation): ${siCount} records`);
    if (siCount > 0) {
      const si = await SpiritualIcon.findOne({ name: { $regex: /test|validation/i } }, { name: 1, slug: 1, primaryMedia: 1 }).lean();
      console.log(`   Sample: ${si?.name} (slug: ${si?.slug})`);
      if (si?.primaryMedia) console.log(`   Media: ${si.primaryMedia.publicId ? 'structured ✓' : 'legacy only'}`);
    }

    // Check Blogs
    const BlogSchema = new mongoose.Schema({}, { strict: false });
    const Blog = mongoose.model('Blog', BlogSchema, 'blogs');
    const blogCount = await Blog.countDocuments({ title: { $regex: /test|validation/i } });
    console.log(`📝 Blogs (test/validation): ${blogCount} records`);
    if (blogCount > 0) {
      const blog = await Blog.findOne({ title: { $regex: /test|validation/i } }, { title: 1, slug: 1, cardMedia: 1, heroMedia: 1 }).lean();
      console.log(`   Sample: ${blog?.title}`);
      if (blog?.cardMedia) console.log(`   Card Media: structured ✓`);
      if (blog?.heroMedia) console.log(`   Hero Media: structured ✓`);
    }

    // Check Darshan
    const DarshanSchema = new mongoose.Schema({}, { strict: false });
    const Darshan = mongoose.model('Darshan', DarshanSchema, 'darshans');
    const dCount = await Darshan.countDocuments({ title: { $regex: /test|validation/i } });
    console.log(`🙏 Darshan (test/validation): ${dCount} records`);
    if (dCount > 0) {
      const d = await Darshan.findOne({ title: { $regex: /test|validation/i } }, { title: 1, primaryMedia: 1 }).lean();
      console.log(`   Sample: ${d?.title}`);
      if (d?.primaryMedia) console.log(`   Primary Media: structured ✓`);
    }

    // Check Events
    const EventSchema = new mongoose.Schema({}, { strict: false });
    const Event = mongoose.model('Event', EventSchema, 'events');
    const eCount = await Event.countDocuments({ title: { $regex: /test|validation/i } });
    console.log(`📅 Events (test/validation): ${eCount} records`);
    if (eCount > 0) {
      const e = await Event.findOne({ title: { $regex: /test|validation/i } }, { title: 1, cardMedia: 1 }).lean();
      console.log(`   Sample: ${e?.title}`);
    }

    console.log('\n✅ Scan complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

listValidationRecords();
