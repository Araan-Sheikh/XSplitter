'use client';

import { useState, useEffect } from 'react';
import type { Group, Member, Expense } from '@/types';
import type { CurrencyCode } from '@/utils/currency';
import { ExpenseList } from './expense-list';
import { ExpenseForm } from './expense-form';
import { UserManagement } from './user-management';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GroupData {
  _id: string;
  name: string;
  description?: string;
  members: Member[];
  expenses: Expense[];
  baseCurrency: CurrencyCode;
  createdAt: string;
  updatedAt: string;
}

export function ExpenseSplitterApp({ groupId }: { groupId: string }) {
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/groups/${groupId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch group');
        }

        const data = await response.json();
        console.log('Fetched group data:', data); // Debug log
        
        if (!data.group) {
          throw new Error('Group not found');
        }

        setGroup(data.group);
      } catch (err) {
        console.error('Error fetching group:', err);
        setError(err instanceof Error ? err.message : 'Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleMemberAdded = async (newMember: Member) => {
    if (!group) return;

    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        throw new Error('Failed to add member');
      }

      setGroup(prevGroup => ({
        ...prevGroup!,
        members: [...prevGroup!.members, newMember]
      }));
    } catch (err) {
      console.error('Error adding member:', err);
      // Handle error (maybe show a toast notification)
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!group) return;

    try {
      const response = await fetch(`/api/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add expense');
      }

      const { expense } = await response.json();

      // Update local state with the new expense
      setGroup(prevGroup => ({
        ...prevGroup!,
        expenses: [...prevGroup!.expenses, expense]
      }));

    } catch (err) {
      console.error('Error adding expense:', err);
      // You might want to show an error toast here
    }
  };

  const handleShareGroupLink = () => {
    const groupUrl = `${window.location.origin}/groups/${groupId}`;
    navigator.clipboard.writeText(groupUrl).then(() => {
      alert('Group link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy group link. Please try again.');
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // No group found
  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>No group found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {group.description && (
            <p className="text-muted-foreground">{group.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline">
            Base Currency: {group.baseCurrency}
          </Badge>
          <Button onClick={handleShareGroupLink}>
            Share Group Link
          </Button>
        </div>
      </div>

      <UserManagement 
        members={group.members} 
        onMemberAdded={handleMemberAdded} 
      />

      <ExpenseForm
        groupMembers={group.members}
        onAddExpense={handleAddExpense}
        baseCurrency={group.baseCurrency}
      />

      <ExpenseList
        expenses={group.expenses}
        groupMembers={group.members}
        baseCurrency={group.baseCurrency}
        onDeleteExpense={async (expenseId) => {
          // Implement delete logic
          console.log('Deleting expense:', expenseId);
        }}
        groupId={groupId}
        groupName={group.name}
      />
    </div>
  );
}

export default ExpenseSplitterApp;
