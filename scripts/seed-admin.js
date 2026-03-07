// scripts/seed-admin.js
// Creates the initial admin user in MongoDB.
// Usage:  node scripts/seed-admin.js
//
// Reads MONGODB_URI from .env.local (or environment).
// Default admin credentials (change after first login):
//   Email:    admin@sarvdev.com
//   Password: admin123

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')

// ─── Load .env.local ──────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set. Add it to .env.local')
  process.exit(1)
}

// ─── Hash password (same algo as lib/auth.ts) ─────────
function hashPassword(plain) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(plain, salt, 64, (err, key) => {
      if (err) return reject(err)
      resolve(`${salt}:${key.toString('hex')}`)
    })
  })
}

// ─── User schema (matches models/User.ts) ─────────────
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['guest', 'admin'], default: 'guest' },
  createdAt: { type: Date, default: Date.now },
})

async function main() {
  const adminEmail = process.argv[2] || 'admin@sarvdev.com'
  const adminPassword = process.argv[3] || 'admin123'
  const adminName = process.argv[4] || 'Admin'

  console.log(`Connecting to MongoDB...`)
  await mongoose.connect(MONGODB_URI)

  const User = mongoose.models.User || mongoose.model('User', UserSchema)

  // Check if admin already exists
  const existing = await User.findOne({ email: adminEmail })
  if (existing) {
    console.log(`Admin user "${adminEmail}" already exists (role: ${existing.role}).`)
    if (existing.role !== 'admin') {
      existing.role = 'admin'
      await existing.save()
      console.log(`  → Updated role to admin.`)
    }
    await mongoose.disconnect()
    return
  }

  const hashed = await hashPassword(adminPassword)
  await User.create({
    name: adminName,
    email: adminEmail,
    password: hashed,
    role: 'admin',
  })

  console.log(`Admin user created successfully!`)
  console.log(`  Email:    ${adminEmail}`)
  console.log(`  Password: ${adminPassword}`)
  console.log(`  → Change this password after first login.`)

  await mongoose.disconnect()
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
