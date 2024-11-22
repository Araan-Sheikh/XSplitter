import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Group from '@/models/Group';
import { ObjectId } from 'mongodb';

interface Member {
  id: string;
  name: string;
  email: string;
  preferredCurrency: string;
}

interface GroupDocument {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  expenses: any[]; // You can define a proper Expense interface if needed
  baseCurrency: string;
}

export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    await connectToDatabase();
    
    if (!ObjectId.isValid(params.groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { name, email, preferredCurrency } = data;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const group = await Group.findById(params.groupId);
    
    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Check if member with same email already exists
    if (group.members.some((member: Member) => member.email === email)) {
      return NextResponse.json(
        { error: 'Member with this email already exists' },
        { status: 400 }
      );
    }

    // Create new member
    const newMember: Member = {
      id: new ObjectId().toString(),
      name,
      email,
      preferredCurrency: preferredCurrency || 'USD'
    };

    // Add member to group
    group.members.push(newMember);
    await group.save();

    return NextResponse.json({
      success: true,
      member: newMember
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
} 