//MONGODB LIBRARY Checker 
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null
  };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env'
    );
  }

  try {
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      const uri: string = MONGODB_URI;
      cached.promise = mongoose.connect(uri).then(() => mongoose);
    }
    
    cached.conn = await cached.promise;
    console.log('New database connection established');
    return cached.conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

declare global {
  var mongoose: MongooseCache | undefined;
} 
