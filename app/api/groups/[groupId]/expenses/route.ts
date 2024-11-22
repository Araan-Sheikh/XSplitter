import { NextResponse } from 'next/server';
import mongoose, { Document, Model } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Group from '@/models/Group';
import { validateCurrency } from '@/utils/currency';
import type { Expense, Member } from '@/types';

interface IGroup {
  members: Member[];
  expenses: Expense[];
  name: string;
  description?: string;
  baseCurrency: string;
}

interface GroupDocument extends Document, IGroup {
  // Additional instance methods can be declared here if needed
}

interface GroupModel extends Model<GroupDocument> {
  // Static methods can be declared here if needed
}

export async function POST(
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

    const expenseData = await request.json();

    // Validate the expense data
    if (!expenseData.description || 
        !expenseData.amount || 
        !expenseData.currency || 
        !expenseData.paidBy ||
        !expenseData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate currency
    try {
      validateCurrency(expenseData.currency);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid currency' },
        { status: 400 }
      );
    }

    const group = await Group.findById(groupId).lean() as IGroup | null;
    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Create new expense with generated ID
    const newExpense: Expense = {
      id: new mongoose.Types.ObjectId().toString(),
      description: expenseData.description,
      amount: expenseData.amount,
      currency: expenseData.currency,
      paidBy: expenseData.paidBy,
      category: expenseData.category,
      splitMethod: expenseData.splitMethod || 'equal',
      customSplit: expenseData.customSplit,
      date: expenseData.date || new Date().toISOString(),
      participants: expenseData.participants || group.members.map((member: Member) => member.id)
    };

    // Add expense to group using updateOne instead of save()
    await Group.updateOne(
      { _id: groupId },
      { $push: { expenses: newExpense } }
    );

    return NextResponse.json({ 
      success: true,
      expense: newExpense 
    });

  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; expenseId: string } }
) {
  try {
    await connectToDatabase();
    const { groupId, expenseId } = params;

    if (!mongoose.isValidObjectId(groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID format' },
        { status: 400 }
      );
    }

    const group = await Group.findById(groupId) as GroupDocument | null;
    
    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Remove expense from group
    group.expenses = group.expenses.filter((expense: Expense) => expense.id !== expenseId);
    await group.save();

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const group = await Group.findById(groupId);

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: group.expenses || []
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch expenses' 
      },
      { status: 500 }
    );
  }
} 