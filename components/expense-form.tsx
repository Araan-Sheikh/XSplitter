'use client';

import { useState } from 'react';
import type { Member, Expense } from '@/types';
import type { CurrencyCode } from '@/utils/currency';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/utils/currency';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

// Expense categories
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !currency || !paidBy || participants.length === 0) return;

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
        splitMethod: 'equal'
      });

      // Reset form
      setDescription('');
      setAmount('');
      setCurrency(baseCurrency);
      setPaidBy('');
      setCategory('Other');
      setDate(new Date());
      setParticipants(groupMembers.map(m => m.id));
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
              />
              <Select
                value={currency}
                onValueChange={(value: CurrencyCode) => setCurrency(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fiat Currencies</SelectLabel>
                    {Object.entries(FIAT_CURRENCIES).map(([code, currency]) => (
                      <SelectItem key={code} value={code}>
                        {currency.symbol} {code}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Cryptocurrencies</SelectLabel>
                    {Object.entries(CRYPTO_CURRENCIES).map(([code, currency]) => (
                      <SelectItem key={code} value={code}>
                        {currency.symbol} {code}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={category}
              onValueChange={(value: ExpenseCategory) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Paid By */}
          <Select
            value={paidBy}
            onValueChange={setPaidBy}
          >
            <SelectTrigger>
              <SelectValue placeholder="Paid by" />
            </SelectTrigger>
            <SelectContent>
              {groupMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} ({member.preferredCurrency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Participants */}
          <div className="space-y-2">
            <Label>Participants</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {groupMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
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
                  <Label htmlFor={member.id}>{member.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !description || !amount || !currency || !paidBy || participants.length === 0}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 