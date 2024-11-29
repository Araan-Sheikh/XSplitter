import { NextResponse } from 'next/server';
import { extractHistoricalLogs } from '@/lib/extractLogs';

export async function POST() {
  try {
    const result = await extractHistoricalLogs();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: result.count,
      breakdown: result.breakdown
    });

  } catch (error) {
    console.error('Log extraction API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to extract logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 
