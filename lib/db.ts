// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

const DB_SERVER_SELECTION_TIMEOUT_MS = Number(
  process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS ?? 5000,
);
const DB_SOCKET_TIMEOUT_MS = Number(process.env.MONGODB_SOCKET_TIMEOUT_MS ?? 15000);

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
    const _t0 = performance.now();
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      // Fail quickly when Atlas is paused, its IP allow-list blocks the host, or
      // the network cannot reach port 27017. Pages can then render their
      // database-free fallback instead of leaving only the streamed layout visible.
      serverSelectionTimeoutMS: DB_SERVER_SELECTION_TIMEOUT_MS,
      connectTimeoutMS: DB_SERVER_SELECTION_TIMEOUT_MS,
      socketTimeoutMS: DB_SOCKET_TIMEOUT_MS,
    }).then((mongoose) => { console.log("[db] connectDB: " + (performance.now() - _t0).toFixed(0) + "ms"); return mongoose })
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
