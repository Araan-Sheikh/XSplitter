import { connectToDatabase } from '@/lib/mongodb';

export async function createLog(data: {
  action: string;
  type: 'group' | 'member';
  details: string;
  userId: string;
  status: 'success' | 'pending' | 'failed';
}) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    await db.collection('logs').insertOne({
      ...data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Logging Error:', error);
  }
} 