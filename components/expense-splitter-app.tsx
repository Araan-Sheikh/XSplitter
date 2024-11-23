'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExpenseList } from './expense-list';
import { ExpenseForm } from './expense-form';
import { UserManagement } from './user-management';
import type { Group, Member, Expense } from '@/types';
import type { CurrencyCode } from '@/utils/currency';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/groups/${groupId}`;

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/groups/${groupId}`);
        if (!response.ok) throw new Error('Failed to fetch group');
        const data = await response.json();
        if (!data.group) throw new Error('Group not found');
        setGroup(data.group);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

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
          <Badge variant="outline">Base Currency: {group.baseCurrency}</Badge>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                disabled={!groupId}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share {group.name}</DialogTitle>
                <DialogDescription>
                  Anyone with this link can join the group
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={shareLink}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This link will allow others to join your group directly
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <UserManagement 
        members={group.members} 
        onMemberAdded={async (newMember) => {
          if (!group) return;
          try {
            const response = await fetch(`/api/groups/${groupId}/members`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newMember),
            });
            if (!response.ok) throw new Error('Failed to add member');
            setGroup(prevGroup => ({
              ...prevGroup!,
              members: [...prevGroup!.members, newMember],
            }));
          } catch (err) {
            console.error(err);
          }
        }}
      />

      <ExpenseForm
        groupMembers={group.members}
        onAddExpense={async (expenseData) => {
          if (!group) return;
          try {
            const response = await fetch(`/api/groups/${groupId}/expenses`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(expenseData),
            });
            if (!response.ok) throw new Error('Failed to add expense');
            const { expense } = await response.json();
            setGroup(prevGroup => ({
              ...prevGroup!,
              expenses: [...prevGroup!.expenses, expense],
            }));
          } catch (err) {
            console.error(err);
          }
        }}
        baseCurrency={group.baseCurrency}
      />

      <ExpenseList
        expenses={group.expenses}
        groupMembers={group.members}
        baseCurrency={group.baseCurrency}
        onDeleteExpense={async (expenseId) => {
          console.log('Deleting expense:', expenseId);
        }}
        groupId={groupId}
        groupName={group.name}
      />
    </div>
  );
}

export default ExpenseSplitterApp;
