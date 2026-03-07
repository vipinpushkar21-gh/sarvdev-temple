// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // If cached connection is stale/disconnected, reset it
  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    }).then((mongoose) => mongoose)
      .catch((err) => {
        cached.promise = null;
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.conn = null;
    throw e;
  }
  return cached.conn;
}
