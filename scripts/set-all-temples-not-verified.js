// Script to set all existing temples to "not-verified" status
// Run with: node scripts/set-all-temples-not-verified.js

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const templeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  descriptionHi: { type: String },
  image: { type: String },
  location: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  pincode: { type: String },
  deity: { type: String },
  establishedYear: { type: String },
  templeType: { type: String },
  speciality: { type: String },
  categories: { type: [String], default: [] },
  timings: { type: String },
  contact: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verified: { type: String, enum: ['verified', 'not-verified'], default: 'not-verified' },
  createdAt: { type: Date, default: Date.now }
});

const Temple = mongoose.models.Temple || mongoose.model('Temple', templeSchema);

async function setAllTemplesNotVerified() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    console.log('Updating all temples to "not-verified" status...\n');
    
    const result = await Temple.updateMany(
      {}, // Match all temples
      { $set: { verified: 'not-verified' } }
    );
    
    console.log('🎉 Update Complete!');
    console.log(`\n📊 Results:`);
    console.log(`   • Total temples found: ${result.matchedCount}`);
    console.log(`   • Temples updated: ${result.modifiedCount}`);
    console.log(`   • Already not-verified: ${result.matchedCount - result.modifiedCount}`);
    console.log('\n✅ All temples are now marked as "not-verified"');
    console.log('💡 Admin can now verify temples individually from admin panel');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setAllTemplesNotVerified();
