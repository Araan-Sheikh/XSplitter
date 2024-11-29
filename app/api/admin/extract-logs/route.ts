import { NextResponse } from 'next/server';
import { extractHistoricalLogs } from '@/lib/extractLogs';

export async function POST() {
  try {
    const result = await extractHistoricalLogs();

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully extracted ${result.count} historical logs`,
      count: result.count
    });

  } catch (error) {
    console.error('Extract Logs API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to extract historical logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 