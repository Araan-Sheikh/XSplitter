'use client';

import { useState, useEffect } from 'react';
import type { Group, Member, Expense } from '@/types';
import type { CurrencyCode } from '@/utils/currency';
import { ExpenseList } from './expense-list';
import { ExpenseForm } from './expense-form';
import { UserManagement } from './user-management';
import { ExpenseAnalytics } from './expense-analytics';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Receipt, 
  BarChart,
  Plus,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion } from "framer-motion";
import Image from 'next/image';

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
  const [activeTab, setActiveTab] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(true);

  const shareLink = `${window.location.origin}/groups/${groupId}`;

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

  useEffect(() => {
    // Hide welcome screen after 2.5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

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

      const { member } = await response.json();

      setGroup(prevGroup => ({
        ...prevGroup!,
        members: [...prevGroup!.members, member],
      }));
    } catch (err) {
      console.error('Error adding member:', err);
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

      setGroup(prevGroup => ({
        ...prevGroup!,
        expenses: [...prevGroup!.expenses, expense],
      }));
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const expenseCount = group?.expenses.length || 0;
  const memberCount = group?.members.length || 0;

  if (showWelcome) {
    return (
      <motion.div 
        className="fixed inset-0 bg-black flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-32 opacity-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-primary/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-primary/20 rounded-full blur-2xl" />
          </motion.div>

          <motion.div 
            className="relative flex flex-col items-center"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-8 relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center p-4">
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Image 
                    src="/logo.png" 
                    alt="XSplitter Logo" 
                    width={80} 
                    height={80} 
                    className="w-20 h-20"
                  />
                </motion.div>
              </div>
              <motion.div
                className="absolute inset-0 border-4 border-white/30 rounded-full"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-white/20 rounded-full"
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            </motion.div>

            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              XSplitter
            </motion.h1>
            <motion.div
              className="flex items-center gap-2 text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Loading your expenses</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="rounded-full bg-red-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {error || 'Group not found'}
            </h2>
            <p className="text-muted-foreground mb-4">
              Please try again or contact support if the problem persists.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
                <Badge variant="secondary" className="h-6">
                  {group.baseCurrency}
                </Badge>
              </div>
              {group.description && (
                <p className="text-muted-foreground">{group.description}</p>
              )}
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {memberCount} members
                </span>
                <span className="flex items-center gap-1">
                  <Receipt className="h-4 w-4" />
                  {expenseCount} expenses
                </span>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share {group.name}</DialogTitle>
                  <DialogDescription>
                    Share this link with others to invite them to the group.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input 
                    readOnly 
                    value={shareLink} 
                    className="flex-1 font-mono text-sm"
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
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full md:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity
 </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ExpenseAnalytics 
              expenses={group.expenses} 
              baseCurrency={group.baseCurrency} 
            />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <ExpenseForm
                  groupMembers={group.members}
                  onAddExpense={handleAddExpense}
                  baseCurrency={group.baseCurrency}
                />
              </CardContent>
            </Card>

            <ExpenseList
              expenses={group.expenses}
              groupMembers={group.members}
              baseCurrency={group.baseCurrency}
              onDeleteExpense={async expenseId => {
                console.log('Deleting expense:', expenseId);
              }}
              groupId={groupId}
              groupName={group.name}
            />
          </TabsContent>

          <TabsContent value="members">
            <div className="grid gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">Group Members</h3>
                      <p className="text-sm text-muted-foreground">
                        {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {group.members.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {member.preferredCurrency || group.baseCurrency}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">Add New Member</h3>
                    <p className="text-sm text-muted-foreground">
                      Invite someone new to join the group
                    </p>
                  </div>
                  <User Management 
                    members={group.members} 
                    onMemberAdded={handleMemberAdded} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {group.expenses.slice().reverse().map((expense) => (
                      <div key={expense.id}>
                        <div className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <ArrowUpDown className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>{formatDistanceToNow(new Date(expense.date), { addSuffix: true })}</span>
                                <span>•</span>
                                <span>Paid by {group.members.find(m => m.id === expense.paidBy)?.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {expense.amount} {expense.currency}
                            </Badge>
                            {expense.splits && (
                              <p className="text-xs text-muted-foreground">
                                Split between {expense.splits.length} people
                              </p>
                            )}
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ExpenseSplitterApp;
