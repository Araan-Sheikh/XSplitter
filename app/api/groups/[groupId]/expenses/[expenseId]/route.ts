import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Group from '@/models/Group';
import type { Expense } from '@/types';

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; expenseId: string } }
) {
  try {
    await connectToDatabase();
    const { groupId, expenseId } = params;

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

    // Find and remove the expense with proper typing
    const expenseIndex = group.expenses.findIndex((expense: Expense) => expense.id === expenseId);
    if (expenseIndex === -1) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Remove the expense
    group.expenses.splice(expenseIndex, 1);
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