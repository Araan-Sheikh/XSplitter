import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';  // Disable static optimization
export const revalidate = 0;  // Disable cache

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Fetch all logs with no caching
    const logs = await db.collection('logs')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    const formattedLogs = logs.map(log => ({
      id: log._id.toString(),
      action: log.action,
      type: log.type,
      details: log.details,
      userId: log.userId,
      timestamp: log.timestamp,
      status: log.status
    }));

    return NextResponse.json({ logs: formattedLogs }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Logs API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
} 