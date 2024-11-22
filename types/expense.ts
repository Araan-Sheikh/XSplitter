export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  participants: string[];
  splits: Record<string, number>;
  date: string;
  category?: string;
}

export interface ExpenseFormProps {
  groupMembers: Member[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  baseCurrency: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  preferredCurrency: string;
} 