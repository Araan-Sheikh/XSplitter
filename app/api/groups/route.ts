import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Group from '@/models/Group';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    console.log('Received data:', data);
    
    const group = await Group.create({
      name: data.name,
      description: data.description || '',
      baseCurrency: 'USD',
      members: [],
      expenses: []
    });

    console.log('Group created:', group);

    return NextResponse.json({
      success: true,
      data: group
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create group'
    }, { status: 500 });
  }
} 