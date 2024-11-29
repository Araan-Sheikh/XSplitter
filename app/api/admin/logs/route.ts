import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Fetch all logs with related data
    const logs = await db.collection('logs').find({})
      .sort({ timestamp: -1 })
      .limit(100) // Limit to last 100 logs for performance
      .toArray();

    const transformedLogs = logs.map(log => ({
      id: log._id.toString(),
      action: log.action,
      type: log.type,
      details: log.details,
      userId: log.userId,
      timestamp: log.timestamp,
      status: log.status
    }));

    return NextResponse.json({
      success: true,
      logs: transformedLogs
    });

  } catch (error) {
    console.error('Logs API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 