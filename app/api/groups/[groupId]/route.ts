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

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ group });

  } catch (error) {
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
    const updates = await request.json();

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $set: updates },
      { new: true }
    );

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ group });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update group' },
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
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    );
  }
} 