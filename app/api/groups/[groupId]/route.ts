import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Group from '@/models/Group';

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    await connectToDatabase();
    const { groupId } = params;

    if (!mongoose.isValidObjectId(groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID' },
        { status: 400 }
      );
    }

    const group = await Group.findById(groupId);
    console.log('Group found:', group); // Debug log

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ group });

  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch group' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    await connectToDatabase();
    
    const { groupId } = params;
    const updateData = await request.json();

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedGroup });
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update group' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    await connectToDatabase();
    
    const { groupId } = params;

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Group deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete group' 
      },
      { status: 500 }
    );
  }
} 