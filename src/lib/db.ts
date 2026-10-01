import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/outpatient_rehab_db';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isFallback: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null, isFallback: false };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<{ isFallback: boolean }> {
  if (cached.conn) {
    return { isFallback: cached.isFallback };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      cached.isFallback = false;
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.isFallback = false;
    return { isFallback: false };
  } catch (e) {
    console.warn('⚠️ MongoDB connection timed out or unreachable. Falling back to in-memory clinical engine.');
    cached.promise = null;
    cached.conn = null;
    cached.isFallback = true;
    return { isFallback: true };
  }
}
