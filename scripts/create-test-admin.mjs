#!/usr/bin/env node
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

async function createTestAdmin() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not configured');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', UserSchema, 'users');

    // Delete any existing test admin
    await User.deleteMany({ email: 'smoketest@sarvdev.local' });

    const password = 'SmokeTest123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const testAdmin = {
      name: 'Smoke Test Admin',
      email: 'smoketest@sarvdev.local',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    };

    const result = await User.insertOne(testAdmin);
    
    console.log('✅ Test admin created successfully');
    console.log(`   Email: smoketest@sarvdev.local`);
    console.log(`   Password: SmokeTest123!`);
    console.log(`   Role: admin`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

createTestAdmin();
