import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Group from '@/models/Group';

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Parse request data
    const data = await request.json();
    console.log('Received data:', data);

    // Create new group
    const group = await Group.create({
      name: data.name,
      members: data.members || [],
      expenses: data.expenses || [],
      baseCurrency: data.baseCurrency || 'USD'
    });

    console.log('Group created:', group);

    return NextResponse.json({
      success: true,
      data: group
    });

  } catch (error) {
    console.error('Error creating group:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 