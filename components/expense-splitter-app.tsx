'use client';

import { useState, useEffect, useMemo } from 'react';
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
  ArrowUpDown,
  Coins,
  UserPlus,
  MoreHorizontal,
  CalendarDays,
  ArrowUpRight,
  Activity,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion } from "framer-motion";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatCurrency } from "@/utils/currency";

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

  const activityStats = useMemo(() => {
    if (!group?.expenses) return {
      total: 0,
      thisMonth: 0,
      thisWeek: 0,
      latestExpense: null,
      recentTotal: 0
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    // Get the most recent expense by sorting by date
    const sortedExpenses = [...group.expenses].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latestExpense = sortedExpenses[0];

    return {
      total: group.expenses.length,
      thisMonth: group.expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= startOfMonth;
      }).length,
      thisWeek: group.expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= startOfWeek;
      }).length,
      latestExpense,
      recentTotal: group.expenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate >= startOfMonth;
        })
        .reduce((sum, expense) => sum + expense.amount, 0),
    };
  }, [group?.expenses]);

  if (showWelcome) {
    return (
      <motion.div 
        className="fixed inset-0 bg-gradient-to-b from-background to-background/95 flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <div className="relative">
          {/* Enhanced Animated Background */}
          <motion.div
            className="absolute -inset-40 opacity-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.95],
              opacity: [0, 0.2, 0],
              rotate: [0, 90, 180]
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-primary/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-primary/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Enhanced Logo Animation */}
          <motion.div 
            className="relative flex flex-col items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated Logo Container */}
            <motion.div
              className="mb-8 relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center p-4 relative">
                {/* Spinning Ring Animation */}
                <motion.div
                  className="absolute inset-0 border-t-2 border-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Logo */}
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
                    className="w-20 h-20 relative z-10"
                  />
                </motion.div>

                {/* Pulsing Rings */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary/30 rounded-full"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 border-2 border-primary/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                />
              </div>
            </motion.div>

            {/* Enhanced Text Animations */}
            <motion.h1
              className="text-4xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              XSplitter
            </motion.h1>
            <motion.div
              className="flex items-center gap-3 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {/* Loading Dots */}
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              <span className="text-sm">Loading your expenses</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {/* Spinning loader with multiple rings */}
            <motion.div
              className="w-12 h-12 rounded-full border-2 border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-t-2 border-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-t-2 border-primary/50"
              animate={{ rotate: -180 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.p 
            className="text-sm text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading group data...
          </motion.p>
        </motion.div>
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
      {/* Navigation Bar */}
      <div className="border-b bg-card/80 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto">
          {/* Upper Section with Group Info */}
          <div className="px-4 py-3 sm:py-4 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Group Avatar */}
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl font-semibold text-primary">
                      {group.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">
                        {group.name}
                      </h1>
                      <Badge variant="secondary" className="hidden xs:inline-flex">
                        {group.baseCurrency}
                      </Badge>
                    </div>
                    {/* Quick Stats for Mobile */}
                    <div className="flex items-center gap-2 xs:hidden text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {memberCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Receipt className="h-3.5 w-3.5" />
                        {expenseCount}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {group.baseCurrency}
                      </Badge>
                    </div>
                    {group.description && (
                      <p className="hidden xs:block text-xs sm:text-sm text-muted-foreground line-clamp-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Quick Stats for Tablet/Desktop */}
                <div className="hidden xs:flex items-center gap-3 pr-3 border-r border-border/40">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{memberCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Receipt className="h-4 w-4" />
                    <span>{expenseCount}</span>
                  </div>
                </div>

                {/* Share Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hidden sm:inline-flex"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Group
                    </Button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="sm:hidden h-8 w-8"
                    >
                      <Share2 className="h-4 w-4" />
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
                      <div className="relative flex-1">
                        <Input 
                          readOnly 
                          value={shareLink} 
                          className="pr-12 font-mono text-sm"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={copyToClipboard}
                          className="absolute right-1 top-1 h-6 w-6"
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="container mx-auto px-4">
            <div className="flex h-12 w-full justify-start sm:justify-center space-x-2 bg-transparent">
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 border-b-2 transition-colors",
                  activeTab === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart className="h-4 w-4" />
                <span className="hidden xs:inline">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab("expenses")}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 border-b-2 transition-colors",
                  activeTab === "expenses"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Receipt className="h-4 w-4" />
                <span className="hidden xs:inline">Expenses</span>
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 border-b-2 transition-colors",
                  activeTab === "members"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                <span className="hidden xs:inline">Members</span>
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 border-b-2 transition-colors",
                  activeTab === "activity"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock className="h-4 w-4" />
                <span className="hidden xs:inline">Activity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <ExpenseAnalytics 
              expenses={group.expenses} 
              baseCurrency={group.baseCurrency} 
            />
          )}

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <>
              <Card>
                <CardContent className="p-3 sm:p-6">
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
            </>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-6">
              {/* Members Overview Cards */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                        <h3 className="text-2xl font-bold">{group.members.length}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <Receipt className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                        <h3 className="text-2xl font-bold">{expenseCount}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <Coins className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Base Currency</p>
                        <h3 className="text-2xl font-bold">{group.baseCurrency}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Members List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Group Members
                  </CardTitle>
                  <CardDescription>
                    Manage your group members and their preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {group.members.map((member) => (
                      <div 
                        key={member.id}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 border border-border">
                              <span className="text-sm font-semibold text-primary">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{member.name}</p>
                              <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              {member.preferredCurrency || group.baseCurrency}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add New Member */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    Add New Member
                  </CardTitle>
                  <CardDescription>
                    Invite someone new to join the group
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManagement 
                    members={group.members} 
                    onMemberAdded={handleMemberAdded} 
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity/Recent Expenses Tab */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              {/* Activity Overview Cards */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                        <h3 className="text-2xl font-bold">{group.expenses.length}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <CalendarDays className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">This Month</p>
                        <h3 className="text-2xl font-bold">
                          {group.expenses.filter(e => {
                            const date = new Date(e.date);
                            const now = new Date();
                            return date.getMonth() === now.getMonth() && 
                                   date.getFullYear() === now.getFullYear();
                          }).length}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <ArrowUpRight className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Latest Amount</p>
                        <h3 className="text-2xl font-bold">
                          {activityStats.latestExpense ? 
                            formatCurrency(activityStats.latestExpense.amount, activityStats.latestExpense.currency) : 
                            '-'}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activityStats.latestExpense ? 
                            formatDistanceToNow(new Date(activityStats.latestExpense.date), { addSuffix: true }) :
                            'No expenses yet'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Track all group expenses and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-border">
                      {group.expenses.slice().reverse().map((expense) => {
                        // Get the payer's name
                        const payer = group.members.find(m => m.id === expense.paidBy);

                        return (
                          <div 
                            key={expense.id}
                            className="p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-2 rounded-full bg-primary/10 shrink-0">
                                <Receipt className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-medium truncate">
                                    {expense.description}
                                  </p>
                                  <Badge variant="outline" className="shrink-0 font-mono">
                                    {formatCurrency(expense.amount, expense.currency)}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />
                                    {payer?.name || 'Unknown'}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseSplitterApp;