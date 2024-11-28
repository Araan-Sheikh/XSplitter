import { useMemo, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Expense } from '@/types';
import { formatCurrency } from '@/utils/currency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ListOrdered,
  Calendar,
  ArrowUpDown,
  ArrowUpRight,
  Tag,
  Split,
  Receipt,
  Coins,
  Wallet,
  CreditCard,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isSameDay, eachMonthOfInterval, addDays } from 'date-fns';
import { 
  FIAT_CURRENCIES, 
  CRYPTO_CURRENCIES, 
  type CurrencyCode,
  getCurrencySymbol 
} from '@/utils/currency';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

interface ExpenseAnalyticsProps {
  expenses: Expense[];
  baseCurrency: string;
}

const CHART_COLORS = [
  'hsl(210, 100%, 50%)', // Blue
  'hsl(280, 100%, 50%)', // Purple
  'hsl(340, 100%, 50%)', // Pink
  'hsl(10, 100%, 50%)',  // Red
  'hsl(40, 100%, 50%)',  // Orange
  'hsl(70, 100%, 50%)',  // Yellow-Green
  'hsl(150, 100%, 50%)', // Green
  'hsl(180, 100%, 50%)', // Cyan
  'hsl(240, 100%, 50%)', // Indigo
  'hsl(310, 100%, 50%)'  // Magenta
];

export function ExpenseAnalytics({ expenses, baseCurrency }: ExpenseAnalyticsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency);
  const [timePeriod, setTimePeriod] = useState<'all' | 'year' | 'month' | 'week'>('all');

  const availableCurrencies = useMemo(() => {
    const currencyTotals = expenses.reduce((acc, expense) => {
      if (!acc[expense.currency]) {
        acc[expense.currency] = {
          total: 0,
          count: 0
        };
      }
      acc[expense.currency].total += expense.amount;
      acc[expense.currency].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return Object.entries(currencyTotals)
      .map(([currency, stats]) => ({
        currency,
        total: stats.total,
        count: stats.count
      }))
      .sort((a, b) => b.count - a.count);
  }, [expenses]);

  const filterExpensesByTimePeriod = (expenses: Expense[]) => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (timePeriod) {
        case 'week':
          return expenseDate >= startOfWeek;
        case 'month':
          return expenseDate >= startOfMonth;
        case 'year':
          return expenseDate >= startOfYear;
        default:
          return true; // 'all' time period
      }
    });
  };

  const filteredExpenses = useMemo(() => filterExpensesByTimePeriod(expenses), [expenses, timePeriod]);

  // Calculate statistics based on filtered expenses
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expenseCount = filteredExpenses.length;

  // Helper functions for trend calculations
  const getLast7DaysTrend = (expenses: Expense[]) => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return days.map(date => ({
      label: format(date, 'EEE'),
      amount: expenses
        .filter(e => isSameDay(new Date(e.date), date))
        .reduce((sum, e) => sum + e.amount, 0)
    }));
  };

  const getMonthTrend = (expenses: Expense[]) => {
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      return date;
    }).reverse();

    return weeks.map((date, i) => ({
      label: `Week ${i + 1}`,
      amount: expenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate >= date && expenseDate < addDays(date, 7);
        })
        .reduce((sum, e) => sum + e.amount, 0)
    }));
  };

  const getYearTrend = (expenses: Expense[]) => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    return months.map(date => ({
      label: format(date, 'MMM'),
      amount: expenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return (
            expenseDate.getMonth() === date.getMonth() &&
            expenseDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, e) => sum + e.amount, 0)
    }));
  };

  const getAllTimeTrend = (expenses: Expense[]) => {
    if (expenses.length === 0) return [];

    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstDate = new Date(sortedExpenses[0].date);
    const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].date);
    const months = eachMonthOfInterval({ start: firstDate, end: lastDate });

    return months.map(date => ({
      label: format(date, 'MMM yyyy'),
      amount: expenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return (
            expenseDate.getMonth() === date.getMonth() &&
            expenseDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, e) => sum + e.amount, 0)
    }));
  };

  // Calculate enhanced statistics based on filtered expenses
  const enhancedStatistics = useMemo(() => {
    const filteredExpenses = filterExpensesByTimePeriod(expenses);

    // Filter expenses by selected currency
    const expensesInCurrency = filteredExpenses.filter(
      expense => expense.currency === selectedCurrency
    );

    // Calculate category distribution with transaction counts
    const categoryTotals = expensesInCurrency.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      if (!acc[category]) {
        acc[category] = {
          amount: 0,
          count: 0
        };
      }
      acc[category].amount += expense.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const total = expensesInCurrency.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryDistribution = Object.entries(categoryTotals)
      .map(([category, { amount, count }]) => ({
        category,
        amount,
        count,
        percentage: (amount / total) * 100
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategories = categoryDistribution.slice(0, 5);

    // Calculate trends based on time period
    let trends = [];
    switch (timePeriod) {
      case 'week':
        trends = getLast7DaysTrend(expensesInCurrency);
        break;
      case 'month':
        trends = getMonthTrend(expensesInCurrency);
        break;
      case 'year':
        trends = getYearTrend(expensesInCurrency);
        break;
      default:
        trends = getAllTimeTrend(expensesInCurrency);
    }

    // Get highest expense in selected currency
    const highestExpense = expensesInCurrency.length > 0
      ? Math.max(...expensesInCurrency.map(e => e.amount))
      : 0;

    return {
      total,
      expenseCount: expensesInCurrency.length,
      categoryDistribution,
      topCategories,
      trends,
      highestExpense,
      currencySymbol: getCurrencySymbol(selectedCurrency)
    };
  }, [expenses, timePeriod, selectedCurrency]);

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex justify-between items-center gap-4">
        <Select
          value={timePeriod}
          onValueChange={(value: 'all' | 'year' | 'month' | 'week') => setTimePeriod(value)}
        >
          <SelectTrigger className="w-[160px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedCurrency}
          onValueChange={(value: CurrencyCode) => setSelectedCurrency(value)}
        >
          <SelectTrigger className="w-[180px]">
            <Coins className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {availableCurrencies.map(({ currency, total, count }) => (
              <SelectItem key={currency} value={currency}>
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <span className="font-mono">{getCurrencySymbol(currency)}</span>
                    <span>{currency}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({count} expenses)
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10">
                <Receipt className="h-4 w-4 text-primary" />
              </div>
              Total {selectedCurrency} Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedStatistics.currencySymbol} {enhancedStatistics.total.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <ArrowUpDown className="h-3 w-3" />
              {enhancedStatistics.expenseCount} transactions in {selectedCurrency}
            </div>
          </CardContent>
        </Card>

        {/* Average Per Transaction */}
        <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-md bg-blue-500/10">
                <CreditCard className="h-4 w-4 text-blue-500" />
              </div>
              Average Per Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                enhancedStatistics.expenseCount > 0 
                  ? enhancedStatistics.total / enhancedStatistics.expenseCount 
                  : 0,
                selectedCurrency
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              Per transaction average
            </div>
          </CardContent>
        </Card>

        {/* Highest Expense */}
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-md bg-green-500/10">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
              Highest {selectedCurrency} Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                enhancedStatistics.highestExpense,
                selectedCurrency
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Wallet className="h-3 w-3" />
              Largest single expense in {selectedCurrency}
            </div>
          </CardContent>
        </Card>

        {/* Most Active Category */}
        <Card className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-md bg-purple-500/10">
                <Tag className="h-4 w-4 text-purple-500" />
              </div>
              Most Active Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {enhancedStatistics.categoryDistribution[0]?.category || 'N/A'}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(
                enhancedStatistics.categoryDistribution[0]?.amount || 0,
                selectedCurrency
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Expense Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Expense Distribution
            </CardTitle>
            <CardDescription>
              Breakdown by category for {timePeriod === 'all' ? 'all time' : `this ${timePeriod}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square">
              <Pie
                data={{
                  labels: enhancedStatistics.categoryDistribution.map(item => item.category),
                  datasets: [{
                    data: enhancedStatistics.categoryDistribution.map(item => item.amount),
                    backgroundColor: CHART_COLORS.map(color => `${color}/0.8`),
                    borderColor: CHART_COLORS,
                    borderWidth: 2,
                    hoverBackgroundColor: CHART_COLORS.map(color => `${color}/0.9`),
                    hoverBorderColor: CHART_COLORS,
                    hoverBorderWidth: 3,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'hsl(var(--foreground))',
                        padding: 20,
                        font: {
                          size: 12,
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    tooltip: {
                      backgroundColor: 'hsl(var(--background))',
                      titleColor: 'hsl(var(--foreground))',
                      bodyColor: 'hsl(var(--foreground))',
                      borderColor: 'hsl(var(--border))',
                      borderWidth: 1,
                      padding: 12,
                      boxPadding: 4,
                      usePointStyle: true,
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return ` ${formatCurrency(value, selectedCurrency)}`;
                        },
                      },
                    },
                  },
                  elements: {
                    arc: {
                      borderWidth: 2,
                    },
                  },
                  cutout: '60%',
                  radius: '90%',
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Expense Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Expense Trends
            </CardTitle>
            <CardDescription>
              Spending patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square">
              <Line
                data={{
                  labels: enhancedStatistics.trends?.map(item => item.label) || [],
                  datasets: [{
                    label: `${selectedCurrency} Expenses`,
                    data: enhancedStatistics.trends?.map(item => item.amount) || [],
                    borderColor: 'hsl(var(--primary))',
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    tension: 0.4,
                    fill: true,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return formatCurrency(value, selectedCurrency);
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: 'hsl(var(--border) / 0.3)',
                      },
                      ticks: {
                        color: 'hsl(var(--foreground))',
                      },
                    },
                    y: {
                      grid: {
                        color: 'hsl(var(--border) / 0.3)',
                      },
                      ticks: {
                        color: 'hsl(var(--foreground))',
                        callback: (value) => formatCurrency(value as number, selectedCurrency),
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-primary" />
            Top Categories in {selectedCurrency}
          </CardTitle>
          <CardDescription>
            Your highest spending categories for {timePeriod === 'all' ? 'all time' : `this ${timePeriod}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enhancedStatistics.topCategories.length > 0 ? (
              enhancedStatistics.topCategories.map(({ category, amount, percentage }) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(amount, selectedCurrency)}
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% of {selectedCurrency} expenses</span>
                    <span>
                      {enhancedStatistics.categoryDistribution.find(c => c.category === category)?.count || 0} transactions
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-6">
                No expenses in {selectedCurrency} yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 