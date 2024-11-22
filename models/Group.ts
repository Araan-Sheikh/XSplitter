import mongoose, { Schema, model, Model } from 'mongoose';
import type { Member, Expense } from '@/types';
import type { CurrencyCode } from '@/utils/currency';

interface IGroup {
  members: Member[];
  expenses: Expense[];
  name: string;
  description?: string;
  baseCurrency: CurrencyCode;
}

interface GroupDocument extends Document, IGroup {}

interface GroupModel extends Model<GroupDocument> {}

const expenseSchema = new Schema({
  id: String,
  description: String,
  amount: Number,
  currency: String,
  paidBy: String,
  category: {
    type: String,
    required: true,
    default: 'Other'
  },
  splitMethod: {
    type: String,
    enum: ['equal', 'custom'],
    default: 'equal'
  },
  customSplit: {
    type: Map,
    of: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  participants: [String]
});

const memberSchema = new Schema({
  id: String,
  name: String,
  email: String,
  preferredCurrency: String
});

const groupSchema = new Schema({
  name: String,
  description: String,
  members: [memberSchema],
  expenses: [expenseSchema],
  baseCurrency: {
    type: String,
    required: true,
    default: 'USD'
  }
}, {
  timestamps: true
});

const Group = (mongoose.models.Group || model<GroupDocument, GroupModel>('Group', groupSchema)) as Model<GroupDocument>;

export default Group; 