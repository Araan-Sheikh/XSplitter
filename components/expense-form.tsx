'use client';

import { useState, useEffect } from 'react';
import type { Member, Expense } from '@/types';
import type { CurrencyCode } from '@/utils/currency';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/utils/currency';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";

const EXPENSE_CATEGORIES = [
  'Food & Drinks',
  'Transportation',
  'Accommodation',
  'Shopping',
  'Entertainment',
  'Groceries',
  'Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Business',
  'Gifts',
  'Other'
] as const;

type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

interface ExpenseFormProps {
  groupMembers: Member[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  baseCurrency: CurrencyCode;
}

export function ExpenseForm({ groupMembers, onAddExpense, baseCurrency }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>(baseCurrency);
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Other');
  const [date, setDate] = useState<Date>(new Date());
  const [participants, setParticipants] = useState<string[]>(groupMembers.map(m => m.id));
  const [loading, setLoading] = useState(false);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [customSplit, setCustomSplit] = useState<Record<string, number>>({});

  useEffect(() => {
    if (splitMethod === 'custom' && participants.length > 0) {
      const equalShare = 1 / participants.length;
      const newSplit = participants.reduce((acc, participantId) => {
        acc[participantId] = equalShare;
        return acc;
      }, {} as Record<string, number>);
      setCustomSplit(newSplit);
    }
  }, [participants, splitMethod]);

  const validateCustomSplit = (splits: Record<string, number>) => {
    const total = Object.values(splits).reduce((sum, value) => sum + value, 0);
    return Math.abs(total - 1) < 0.0001;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !currency || !paidBy || participants.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (splitMethod === 'custom' && !validateCustomSplit(customSplit)) {
      toast.error('Custom split percentages must sum to 100%');
      return;
    }

    setLoading(true);
    try {
      await onAddExpense({
        description,
        amount: parseFloat(amount),
        currency,
        paidBy,
        category,
        date: date.toISOString(),
        participants,
        splitMethod,
        customSplit: splitMethod === 'custom' ? customSplit : undefined
      });

      toast.success('Expense added successfully');
      resetForm();
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCurrency(baseCurrency);
    setPaidBy('');
    setCategory('Other');
    setDate(new Date());
    setParticipants(groupMembers.map(m => m.id));
    setSplitMethod('equal');
    setCustomSplit({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Expense
        </CardTitle>
        <CardDescription>Add a new expense to split between group members</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Basic Details Section */}
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Input
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Amount & Currency</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="flex-1"
                  />
                  <Select
                    value={currency}
                    onValueChange={(value: CurrencyCode) => setCurrency(value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fiat</SelectLabel>
                        {Object.entries(FIAT_CURRENCIES).map(([code, currency]) => (
                          <SelectItem key={code} value={code}>
                            <span className="flex items-center gap-2">
                              <span className="font-mono">{currency.symbol}</span>
                              <span>{code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Crypto</SelectLabel>
                        {Object.entries(CRYPTO_CURRENCIES).map(([code, currency]) => (
                          <SelectItem key={code} value={code}>
                            <span className="flex items-center gap-2">
                              <span className="font-mono">{currency.symbol}</span>
                              <span>{code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(value: ExpenseCategory) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label>Paid By</Label>
                <Select
                  value={paidBy}
                  onValueChange={setPaidBy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Who paid?" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <span className="flex items-center justify-between w-full">
                          <span>{member.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {member.preferredCurrency}
                          </Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Split Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Split Details</h3>
                <p className="text-sm text-muted-foreground">Choose how to split the expense</p>
              </div>
              <Select
                value={splitMethod}
                onValueChange={(value: 'equal' | 'custom') => setSplitMethod(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Split method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Equal Split</SelectItem>
                  <SelectItem value="custom">Custom Split</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Split Between</Label>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupMembers.map((member) => (
                      <div
                        key={member.id}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg border p-3",
                          "transition-colors hover:bg-accent",
                          participants.includes(member.id) && "bg-accent"
                        )}
                      >
                        <Checkbox
                          id={member.id}
                          checked={participants.includes(member.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setParticipants([...participants, member.id]);
                            } else {
                              setParticipants(participants.filter(id => id !== member.id));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={member.id} className="text-sm font-medium">
                            {member.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Preferred: {member.preferredCurrency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>

            {splitMethod === 'custom' && participants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Custom Split Percentages</CardTitle>
                  <CardDescription>
                    Specify the percentage each person will pay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {participants.map(participantId => {
                      const member = groupMembers.find(m => m.id === participantId);
                      return (
                        <div key={participantId} 
                             className="flex items-center gap-3 rounded-lg border p-3">
                          <span className="flex-1 text-sm font-medium">
                            {member?.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={(customSplit[participantId] * 100 || 0).toFixed(1)}
                              onChange={(e) => {
                                const numValue = parseFloat(e.target.value) / 100;
                                if (isNaN(numValue)) return;
                                setCustomSplit(prev => ({
                                  ...prev,
                                  [participantId]: numValue
                                }));
                              }}
                              className="w-24 text-right"
                            />
                            <span className="text-sm text-muted-foreground w-4">%</span>
                          </div>
                        </div>
                      );
                    })}
                    <div className={cn(
                      "flex justify-between items-center p-3 rounded-lg",
                      validateCustomSplit(customSplit) 
                        ? "bg-accent/50" 
                        : "bg-destructive/10"
                    )}>
                      <span className="text-sm font-medium">Total</span>
                      <span className={cn(
                        "text-sm",
                        !validateCustomSplit(customSplit) && "text-destructive"
                      )}>
                        {Object.values(customSplit)
                          .reduce((sum, value) => sum + value * 100, 0)
                          .toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 bg-muted/50">
        <Button
          variant="outline"
          onClick={resetForm}
          type="button"
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || 
            !description || 
            !amount || 
            !currency || 
            !paidBy || 
            participants.length === 0 ||
            (splitMethod === 'custom' && !validateCustomSplit(customSplit))
          }
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 
