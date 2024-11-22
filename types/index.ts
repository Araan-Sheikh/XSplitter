import type { CurrencyCode } from '@/utils/currency';

export type { CurrencyCode };

export interface Member {
  id: string;
  name: string;
  email: string;
  preferredCurrency: CurrencyCode;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  paidBy: string;
  category: string;
  date: string;
  participants: string[];
  splitMethod: 'equal' | 'custom';
  customSplit?: Record<string, number>;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  expenses: Expense[];
  baseCurrency: CurrencyCode;
}

export interface ExpenseListProps {
  expenses: Expense[];
  groupMembers: Member[];
  baseCurrency: CurrencyCode;
  onDeleteExpense: (expenseId: string) => Promise<void>;
  groupId: string;
  groupName: string;
}

export interface UserManagementProps {
  members: Member[];
  onMemberAdded: (member: Member) => void;
}

export interface ExpenseFormProps {
  groupMembers: Member[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  baseCurrency: CurrencyCode;
} 