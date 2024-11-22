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
  isCryptoCurrency
} from '@/utils/currency';
import type { Member, Expense } from '@/types';
import { Loader2 } from "lucide-react";
import { ExpenseAnalytics } from './expense-analytics';

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

      // Initialize or update currency balance for payer
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

  // Use the calculation results
  const { summaries, settlements } = useMemo(() => calculateBalances(), [calculateBalances]);

  // Render function with improved display
  return (
    <Tabs defaultValue="summary" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-4">
  <TabsTrigger value="summary">Summary</TabsTrigger>
  <TabsTrigger value="analytics">Analytics</TabsTrigger>
  <TabsTrigger value="settlements">Settlements</TabsTrigger>
  <TabsTrigger value="history">History</TabsTrigger>
</TabsList>

      <TabsContent value="summary" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{groupName} - Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {summaries.map(({ member, balances, totalInPreferredCurrency }) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{member.name}</span>
                      <Badge 
                        variant={totalInPreferredCurrency >= 0 ? "secondary" : "destructive"}
                        className="text-lg"
                      >
                        {formatCurrency(
                          Math.abs(totalInPreferredCurrency), 
                          member.preferredCurrency as CurrencyCode
                        )}
                        {totalInPreferredCurrency < 0 ? ' (owes)' : ' (gets)'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Preferred Currency: {member.preferredCurrency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      {Object.entries(balances)
                        .filter(([_, balance]) => balance.paid !== 0 || balance.owed !== 0)
                        .map(([currency, balance]) => (
                          <div key={currency} className="mb-4 p-3 rounded-lg bg-muted/30">
                            <div className="font-medium mb-2">{currency}</div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Paid:</span>
                                <span className="text-green-600">
                                  {formatCurrency(balance.paid, currency as CurrencyCode)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Owed:</span>
                                <span className="text-red-600">
                                  {formatCurrency(balance.owed, currency as CurrencyCode)}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-medium">
                                <span>Net in {currency}:</span>
                                <span className={balance.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {formatCurrency(balance.net, currency as CurrencyCode)}
                                </span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>In {member.preferredCurrency}:</span>
                                <span className={balance.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {formatCurrency(
                                    convertAmount(
                                      balance.net,
                                      currency as CurrencyCode,
                                      member.preferredCurrency as CurrencyCode
                                    ),
                                    member.preferredCurrency as CurrencyCode
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics" className="space-y-4">
   <ExpenseAnalytics 
    expenses={expenses}
    baseCurrency={baseCurrency}
   />
</TabsContent>

      <TabsContent value="settlements" className="space-y-4">
        {settlements.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">All settled up! No payments needed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {settlements.map((settlement, index) => {
              const from = groupMembers.find(m => m.id === settlement.from);
              const to = groupMembers.find(m => m.id === settlement.to);
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">Settlement #{index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-red-600">{from?.name}</span>
                          <span>→</span>
                          <span className="font-medium text-green-600">{to?.name}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Group Currency ({baseCurrency}):</span>
                          <Badge variant="secondary">
                            {formatCurrency(settlement.amount, settlement.currency)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {from?.name}'s Currency ({settlement.preferredCurrency}):
                          </span>
                          <Badge variant="outline">
                            {formatCurrency(
                              settlement.amountInPreferredCurrency,
                              settlement.preferredCurrency
                            )}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {to?.name}'s Currency ({settlement.creditorPreferredCurrency}):
                          </span>
                          <Badge variant="outline">
                            {formatCurrency(
                              settlement.amountInCreditorCurrency,
                              settlement.creditorPreferredCurrency
                            )}
                          </Badge>
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
        <div className="grid gap-4">
          {expenses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No expenses yet. Add your first expense!</p>
              </CardContent>
            </Card>
          ) : (
            expenses.map(expense => {
              const payer = groupMembers.find(m => m.id === expense.paidBy);
              const participantNames = expense.participants
                .map(id => groupMembers.find(m => m.id === id)?.name)
                .filter(Boolean);
              
              return (
                <Card key={expense.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{expense.description}</CardTitle>
                        <CardDescription>
                          {new Date(expense.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        {formatCurrency(expense.amount, expense.currency)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Paid by</div>
                        <div className="font-medium">{payer?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Split between</div>
                        <div className="flex flex-wrap gap-2">
                          {participantNames.map((name, index) => (
                            <Badge key={index} variant="outline">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {expense.splitMethod === 'custom' && expense.customSplit && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Custom split</div>
                          <div className="grid gap-1">
                            {Object.entries(expense.customSplit).map(([userId, percentage]) => {
                              const user = groupMembers.find(m => m.id === userId);
                              return (
                                <div key={userId} className="flex justify-between text-sm">
                                  <span>{user?.name}</span>
                                  <span>{(percentage * 100).toFixed(1)}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      disabled={isDeleting === expense.id}
                    >
                      {isDeleting === expense.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}