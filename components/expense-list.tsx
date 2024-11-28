'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  validateCurrency,
  formatCurrency,
  convertAmount,
  FIAT_CURRENCIES,
  CRYPTO_CURRENCIES,
  type CurrencyCode,
  isCryptoCurrency,
  startRateUpdates,
} from '@/utils/currency';
import type { Member, Expense } from '@/types';
import { 
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  PieChart,
  Download,
  Share2,
  X,
  Trash2,
  Receipt,
  Loader2,
  ArrowUpDown,
  ArrowRight,
  Check
} from "lucide-react";
import { ExpenseAnalytics } from './expense-analytics';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExpenseListProps {
  expenses: Expense[];
  groupMembers: Member[];
  baseCurrency: CurrencyCode;
  onDeleteExpense: (expenseId: string) => void;
  groupId: string;
  groupName: string;
}

interface Balance {
  paid: number;
  owed: number;
  net: number;
}

interface CurrencyBalance {
  [currency: string]: Balance;
}

interface MemberSummary {
  member: Member;
  balances: CurrencyBalance;
  totalInPreferredCurrency: number;
  totalInBaseCurrency: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
  currency: CurrencyCode;
  amountInPreferredCurrency: number;
  preferredCurrency: CurrencyCode;
  amountInCreditorCurrency: number;
  creditorPreferredCurrency: CurrencyCode;
}

export function ExpenseList({ 
  expenses, 
  groupMembers, 
  baseCurrency,
  onDeleteExpense,
  groupId,
  groupName 
}: ExpenseListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Initialize and update rates
  useEffect(() => {
    const initRates = async () => {
      try {
        setIsLoadingRates(true);
        await startRateUpdates(5);
        setIsLoadingRates(false);
      } catch (err) {
        console.error('Failed to initialize rates:', err);
        setError('Failed to load currency rates');
        setIsLoadingRates(false);
      }
    };

    initRates();
  }, []);

  // Add back the handleDeleteExpense function
  const handleDeleteExpense = async (expenseId: string) => {
    try {
      setIsDeleting(expenseId);
      setError(null);

      const response = await fetch(`/api/groups/${groupId}/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete expense');
      }

      // Call the parent component's handler
      await onDeleteExpense(expenseId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      console.error('Error deleting expense:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const calculateBalances = useCallback(() => {
    console.log('Current rates:', {
      fiat: FIAT_CURRENCIES,
      crypto: CRYPTO_CURRENCIES
    });

    // Initialize member summaries with empty balances
    const summaries: MemberSummary[] = groupMembers.map(member => ({
      member,
      balances: {},
      totalInPreferredCurrency: 0,
      totalInBaseCurrency: 0
    }));

    // Process each expense
    expenses.forEach(expense => {
      const { amount, currency, paidBy, participants, splitMethod, customSplit } = expense;

      // Handle payer
      const payerSummary = summaries.find(s => s.member.id === paidBy);
      if (!payerSummary) return;

      if (!payerSummary.balances[currency]) {
        payerSummary.balances[currency] = { paid: 0, owed: 0, net: 0 };
      }
      payerSummary.balances[currency].paid += amount;

      // Calculate individual shares
      let shares: Record<string, number> = {};
      if (splitMethod === 'equal') {
        const perPersonAmount = amount / participants.length;
        participants.forEach(participantId => {
          shares[participantId] = perPersonAmount;
        });
      } else if (splitMethod === 'custom' && customSplit) {
        participants.forEach(participantId => {
          shares[participantId] = amount * (customSplit[participantId] || 0);
        });
      }

      // Update participant balances
      participants.forEach(participantId => {
        const participantSummary = summaries.find(s => s.member.id === participantId);
        if (!participantSummary) return;

        // Initialize currency balance if needed
        if (!participantSummary.balances[currency]) {
          participantSummary.balances[currency] = { paid: 0, owed: 0, net: 0 };
        }

        // Add to owed amount
        participantSummary.balances[currency].owed += shares[participantId];
      });
    });

    // Calculate net amounts and convert to preferred currencies
    summaries.forEach(summary => {
      let totalInPreferred = 0;
      let totalInBase = 0;

      // Calculate net for each currency and convert to preferred currency
      Object.entries(summary.balances).forEach(([currency, balance]) => {
        // Calculate net in original currency
        balance.net = balance.paid - balance.owed;

        // Convert to member's preferred currency
        if (currency !== summary.member.preferredCurrency) {
          const amountInPreferred = convertAmount(
            balance.net,
            currency as CurrencyCode,
            summary.member.preferredCurrency as CurrencyCode
          );
          totalInPreferred += amountInPreferred;
        } else {
          totalInPreferred += balance.net;
        }

        // Convert to group's base currency for settlements
        if (currency !== baseCurrency) {
          const amountInBase = convertAmount(
            balance.net,
            currency as CurrencyCode,
            baseCurrency
          );
          totalInBase += amountInBase;
        } else {
          totalInBase += balance.net;
        }
      });

      summary.totalInPreferredCurrency = totalInPreferred;
      summary.totalInBaseCurrency = totalInBase;
    });

    // Calculate optimal settlements
    const settlements: Settlement[] = [];
    const debtors = summaries
      .filter(s => s.totalInBaseCurrency < -0.01) // Use small threshold to handle floating point
      .sort((a, b) => a.totalInBaseCurrency - b.totalInBaseCurrency);
    const creditors = summaries
      .filter(s => s.totalInBaseCurrency > 0.01)
      .sort((a, b) => b.totalInBaseCurrency - a.totalInBaseCurrency);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const debtAmount = Math.abs(debtor.totalInBaseCurrency);
      const creditAmount = creditor.totalInBaseCurrency;
      const settlementAmount = Math.min(debtAmount, creditAmount);

      if (settlementAmount > 0.01) {
        // Create settlement in both base and preferred currencies
        const settlement: Settlement = {
          from: debtor.member.id,
          to: creditor.member.id,
          amount: settlementAmount,
          currency: baseCurrency,
          // Convert settlement amount to debtor's preferred currency
          amountInPreferredCurrency: convertAmount(
            settlementAmount,
            baseCurrency,
            debtor.member.preferredCurrency as CurrencyCode
          ),
          preferredCurrency: debtor.member.preferredCurrency as CurrencyCode,
          // Convert to creditor's preferred currency
          amountInCreditorCurrency: convertAmount(
            settlementAmount,
            baseCurrency,
            creditor.member.preferredCurrency as CurrencyCode
          ),
          creditorPreferredCurrency: creditor.member.preferredCurrency as CurrencyCode
        };
        settlements.push(settlement);

        // Update remaining balances
        if (debtAmount > creditAmount) {
          debtor.totalInBaseCurrency += creditAmount;
          j++;
        } else if (debtAmount < creditAmount) {
          creditor.totalInBaseCurrency -= debtAmount;
          i++;
        } else {
          i++;
          j++;
        }
      }
    }

    return { summaries, settlements };
  }, [expenses, groupMembers, baseCurrency]);

  // Calculate balances using the callback
  const { summaries, settlements } = useMemo(() => calculateBalances(), [calculateBalances]);

  // Get unique categories
  const categories = useMemo(() => 
    Array.from(new Set(expenses.map(e => e.category))),
    [expenses]
  );

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || expense.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [expenses, searchTerm, filterCategory, sortOrder]);

  // Export expenses to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Currency', 'Category', 'Paid By', 'Split Method'];
    const rows = filteredExpenses.map(expense => [
      new Date(expense.date).toLocaleDateString(),
      expense.description,
      expense.amount,
      expense.currency,
      expense.category,
      groupMembers.find(m => m.id === expense.paidBy)?.name,
      expense.splitMethod
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${groupName}-expenses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Expenses exported successfully!');
  };

  // Filter expenses for history tab
  const filteredHistoryExpenses = useMemo(() => {
    return expenses
      .filter(expense => 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupMembers.find(m => m.id === expense.paidBy)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm, groupMembers]);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;

    try {
      setIsDeleting(expenseToDelete);
      setError(null);

      const response = await fetch(`/api/groups/${groupId}/expenses/${expenseToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete expense');
      }

      await onDeleteExpense(expenseToDelete);
      toast.success('Expense deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      toast.error('Failed to delete expense');
    } finally {
      setIsDeleting(null);
      setExpenseToDelete(null);
    }
  };

  // Loading state with improved UI
  if (isLoadingRates) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Initializing Currencies</h3>
            <p className="text-sm text-muted-foreground">
              Fetching latest exchange rates...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state with improved UI
  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="p-3 rounded-full bg-destructive/10">
            <X className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-destructive">Error Loading Rates</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="balances" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
            <TabsTrigger value="balances" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Balances
            </TabsTrigger>
            <TabsTrigger value="settlements" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Settlements
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px]"
              leftIcon={<Search className="h-4 w-4" />}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2 text-sm font-medium">Categories</div>
                <DropdownMenuItem onClick={() => setFilterCategory(null)}>
                  <Check className={cn("mr-2 h-4 w-4", !filterCategory && "opacity-100")} />
                  All Categories
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                    <Check className={cn("mr-2 h-4 w-4", filterCategory === category && "opacity-100")} />
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="balances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summaries.map(({ member, balances, totalInBaseCurrency, totalInPreferredCurrency }) => (
              <Card 
                key={member.id}
                className={cn(
                  "transition-colors",
                  totalInBaseCurrency > 0 ? "bg-green-500/5" : 
                  totalInBaseCurrency < 0 ? "bg-red-500/5" : "bg-muted/50"
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base font-medium">{member.name}</span>
                    <Badge variant="outline">{member.preferredCurrency}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Original Currency Balances */}
                    {Object.entries(balances).map(([currency, { paid, owed, net }]) => (
                      <div key={currency} className="space-y-2 p-2 rounded-lg border bg-background/50">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{currency}</span>
                          <span className={cn(
                            "font-medium text-sm",
                            net > 0 ? "text-green-600" : 
                            net < 0 ? "text-red-600" : "text-muted-foreground"
                          )}>
                            {formatCurrency(net, currency)}
                          </span>
                        </div>

                        {/* Original Currency Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>Paid: {formatCurrency(paid, currency)}</div>
                          <div>Owed: {formatCurrency(owed, currency)}</div>
                        </div>

                        {/* Converted to Preferred Currency */}
                        {currency !== member.preferredCurrency && (
                          <div className="pt-1 mt-1 border-t border-border">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">In {member.preferredCurrency}:</span>
                              <span className={cn(
                                "font-medium",
                                net > 0 ? "text-green-600" : 
                                net < 0 ? "text-red-600" : "text-muted-foreground"
                              )}>
                                {formatCurrency(
                                  convertAmount(net, currency as CurrencyCode, member.preferredCurrency as CurrencyCode),
                                  member.preferredCurrency as CurrencyCode
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Converted to Base Currency */}
                        {currency !== baseCurrency && (
                          <div className="pt-1 border-t border-border">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">In {baseCurrency}:</span>
                              <span className={cn(
                                "font-medium",
                                net > 0 ? "text-green-600" : 
                                net < 0 ? "text-red-600" : "text-muted-foreground"
                              )}>
                                {formatCurrency(
                                  convertAmount(net, currency as CurrencyCode, baseCurrency),
                                  baseCurrency
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <Separator className="my-2" />

                    {/* Total Balances */}
                    <div className="space-y-2">
                      {/* Total in Preferred Currency */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total ({member.preferredCurrency})</span>
                        <span className={cn(
                          "text-sm font-bold",
                          totalInPreferredCurrency > 0 ? "text-green-600" : 
                          totalInPreferredCurrency < 0 ? "text-red-600" : "text-muted-foreground"
                        )}>
                          {formatCurrency(totalInPreferredCurrency, member.preferredCurrency as CurrencyCode)}
                        </span>
                      </div>

                      {/* Total in Base Currency */}
                      {member.preferredCurrency !== baseCurrency && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Total ({baseCurrency})</span>
                          <span className={cn(
                            "font-bold",
                            totalInBaseCurrency > 0 ? "text-green-600" : 
                            totalInBaseCurrency < 0 ? "text-red-600" : "text-muted-foreground"
                          )}>
                            {formatCurrency(totalInBaseCurrency, baseCurrency)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          {settlements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="p-3 rounded-full bg-muted">
                  <Check className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">All Settled Up!</h3>
                  <p className="text-sm text-muted-foreground">
                    Everyone has been paid back.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {settlements.map((settlement, index) => {
                const from = groupMembers.find(m => m.id === settlement.from);
                const to = groupMembers.find(m => m.id === settlement.to);
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600">{from?.name}</span>
                            <ArrowRight className="h-4 w-4" />
                            <span className="text-green-600">{to?.name}</span>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 rounded-lg bg-muted">
                          <span className="text-sm">Group Currency</span>
                          <Badge variant="secondary" className="font-mono">
                            {formatCurrency(settlement.amount, settlement.currency)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">
                              {from?.name}'s Currency
                            </span>
                            <div className="p-2 rounded-lg border">
                              <span className="font-mono text-sm">
                                {formatCurrency(
                                  settlement.amountInPreferredCurrency,
                                  settlement.preferredCurrency
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">
                              {to?.name}'s Currency
                            </span>
                            <div className="p-2 rounded-lg border">
                              <span className="font-mono text-sm">
                                {formatCurrency(
                                  settlement.amountInCreditorCurrency,
                                  settlement.creditorPreferredCurrency
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {/* Search bar only for history tab */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by description, category, or payer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {filteredHistoryExpenses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="p-3 rounded-full bg-muted">
                    <Receipt className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">
                      {searchTerm ? 'No matching expenses found' : 'No expenses yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search terms' : 'Add your first expense to get started!'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredHistoryExpenses.map(expense => (
                  <Card key={expense.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            {expense.description}
                            <Badge variant="outline">{expense.category}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {new Date(expense.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {formatCurrency(expense.amount, expense.currency)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Paid by</div>
                            <Badge variant="outline" className="bg-green-500/5">
                              {groupMembers.find(m => m.id === expense.paidBy)?.name}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Split Method</div>
                            <Badge variant="outline">
                              {expense.splitMethod === 'equal' ? 'Equal Split' : 'Custom Split'}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Split between</div>
                          <div className="flex flex-wrap gap-2">
                            {expense.participants
                              .map(id => groupMembers.find(m => m.id === id)?.name)
                              .filter(Boolean)
                              .map((name, index) => (
                                <Badge key={index} variant="secondary">
                                  {name}
                                </Badge>
                              ))}
                          </div>
                        </div>
                        {expense.splitMethod === 'custom' && expense.customSplit && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-2">Split Details</div>
                            <div className="grid gap-1.5">
                              {Object.entries(expense.customSplit).map(([userId, percentage]) => {
                                const user = groupMembers.find(m => m.id === userId);
                                return (
                                  <div key={userId} className="flex justify-between items-center p-2 rounded-lg bg-muted">
                                    <span className="text-sm">{user?.name}</span>
                                    <span className="text-sm font-mono">
                                      {(percentage * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          navigator.clipboard.writeText(
                            `${expense.description}: ${formatCurrency(expense.amount, expense.currency)}`
                          );
                          toast.success('Expense details copied to clipboard!');
                        }}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setExpenseToDelete(expense.id)}
                        disabled={isDeleting === expense.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!expenseToDelete} onOpenChange={() => setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}