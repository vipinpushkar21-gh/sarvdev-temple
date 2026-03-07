const mongoose = require('mongoose');
const crypto = require('crypto');
const MONGODB_URI = 'mongodb+srv://sarvdev:Vipin1_pushkar@sarvdev.meedqkf.mongodb.net/sarvdev-temple?retryWrites=true&w=majority&appName=Sarvdev';

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

function hashPassword(plain) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(plain, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const email = 'admin@sarvdev.com';
  const password = 'admin123';

  // Check if already exists
  const existing = await User.findOne({ email });
  if (existing) {
    // Update to admin role if not already
    existing.role = 'admin';
    existing.password = await hashPassword(password);
    await existing.save();
    console.log('Updated existing user to admin:', email);
  } else {
    const hashed = await hashPassword(password);
    await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
    console.log('Created admin user:', email);
  }

  console.log('\n--- Admin Credentials ---');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('-------------------------');

  await mongoose.connection.close();
}
run();
