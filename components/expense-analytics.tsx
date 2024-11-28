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
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expense } from '@/types';
import { formatCurrency } from '@/utils/currency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
);

interface ExpenseAnalyticsProps {
  expenses: Expense[];
  baseCurrency: string;
}

export function ExpenseAnalytics({ expenses, baseCurrency }: ExpenseAnalyticsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency);
  const [timePeriod, setTimePeriod] = useState('all'); // 'all' | 'year' | 'month' | 'week'

  const availableCurrencies = useMemo(() => {
    return Array.from(new Set(expenses.map(expense => expense.currency))).sort();
  }, [expenses]);

  const filterExpensesByTimePeriod = (expenses: Expense[]) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (timePeriod) {
        case 'week':
          return expenseDate >= startOfWeek;
        case 'month':
          return expenseDate.getMonth() === now.getMonth() && 
                 expenseDate.getFullYear() === now.getFullYear();
        case 'year':
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const categoryData = useMemo(() => {
    const filteredExpenses = filterExpensesByTimePeriod(
      expenses.filter(expense => expense.currency === selectedCurrency)
    );
    const categories: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
    return categories;
  }, [expenses, selectedCurrency, timePeriod]);

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const timeSeriesData = useMemo(() => {
    const dailyTotals: Record<string, number> = {};
    
    expenses
      .filter(expense => expense.currency === selectedCurrency)
      .forEach(expense => {
        const date = new Date(expense.date).toISOString().split('T')[0];
        dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
      });

    const sortedDates = Object.keys(dailyTotals).sort();
    
    return {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
      values: sortedDates.map(date => dailyTotals[date])
    };
  }, [expenses, selectedCurrency]);

  const lineChartData = {
    labels: timeSeriesData.labels,
    datasets: [{
      label: 'Daily Expenses',
      data: timeSeriesData.values,
      borderColor: '#36A2EB',
      tension: 0.4,
      fill: false,
    }],
  };

  const monthlyData = useMemo(() => {
    const monthlyTotals: Record<string, number> = {};
    
    expenses
      .filter(expense => expense.currency === selectedCurrency)
      .forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount;
      });

    const sortedMonths = Object.keys(monthlyTotals).sort();
    
    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString(undefined, { 
          month: 'short', 
          year: 'numeric' 
        });
      }),
      values: sortedMonths.map(month => monthlyTotals[month])
    };
  }, [expenses, selectedCurrency]);

  const enhancedStatistics = useMemo(() => {
    const validExpenses = expenses.filter(expense => expense.currency === selectedCurrency);
    const total = validExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avg = total / validExpenses.length || 0;
    const sorted = [...validExpenses].sort((a, b) => b.amount - a.amount);
    const highest = sorted[0] || null;
    const lowest = sorted[sorted.length - 1] || null;

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const monthlyExpenses = validExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
    });

    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyAvg = monthlyTotal / monthlyExpenses.length || 0;

    const categoryTotals = validExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / total) * 100
      }));

    return { 
      total, 
      avg, 
      highest, 
      lowest,
      monthlyTotal,
      monthlyAvg,
      topCategories,
      expenseCount: validExpenses.length,
      monthlyExpenseCount: monthlyExpenses.length
    };
  }, [expenses, selectedCurrency]);

  const splitMethodStats = useMemo(() => {
    const filteredExpenses = filterExpensesByTimePeriod(
      expenses.filter(expense => expense.currency === selectedCurrency)
    );
    
    const stats = {
      equal: 0,
      custom: 0,
      totalAmount: {
        equal: 0,
        custom: 0
      }
    };

    filteredExpenses.forEach(expense => {
      if (expense.splitMethod === 'equal') {
        stats.equal++;
        stats.totalAmount.equal += expense.amount;
      } else if (expense.splitMethod === 'custom') {
        stats.custom++;
        stats.totalAmount.custom += expense.amount;
      }
    });

    return stats;
  }, [expenses, selectedCurrency, timePeriod]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Financial Analytics</h2>
          <p className="text-muted-foreground">
            Track and analyze your spending patterns
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Select
            value={timePeriod}
            onValueChange={setTimePeriod}
          >
            <SelectTrigger className="w-[160px]">
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
            onValueChange={setSelectedCurrency}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {availableCurrencies.map(currency => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(enhancedStatistics.total, selectedCurrency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {enhancedStatistics.expenseCount} total transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {formatCurrency(enhancedStatistics.monthlyAvg, selectedCurrency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              per expense this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Highest Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {enhancedStatistics.highest ? formatCurrency(enhancedStatistics.highest.amount, selectedCurrency) : '-'}
            </div>
            {enhancedStatistics.highest && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {enhancedStatistics.highest.description}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {formatCurrency(enhancedStatistics.monthlyTotal, selectedCurrency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {enhancedStatistics.monthlyExpenseCount} expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Expense Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track your spending patterns over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Line 
                data={{
                  labels: monthlyData.labels,
                  datasets: [{
                    label: 'Monthly Total',
                    data: monthlyData.values,
                    borderColor: 'hsl(215, 100%, 50%)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'hsl(var(--background))',
                      titleColor: 'hsl(var(--foreground))',
                      bodyColor: 'hsl(var(--foreground))',
                      borderColor: 'hsl(var(--border))',
                      borderWidth: 1,
                      padding: 16,
                      callbacks: {
                        label: (context) => {
                          return formatCurrency(context.raw as number, selectedCurrency);
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value as number, selectedCurrency),
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Breakdown of expenses by category
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie 
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                    tooltip: {
                      backgroundColor: 'hsl(var(--background))',
                      titleColor: 'hsl(var(--foreground))',
                      bodyColor: 'hsl(var(--foreground))',
                      borderColor: 'hsl(var(--border))',
                      borderWidth: 1,
                      padding: 16,
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return `${context.label}: ${formatCurrency(value, selectedCurrency)}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Split Methods</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution of expense splitting methods
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie 
                data={{
                  labels: ['Equal Split', 'Custom Split'],
                  datasets: [{
                    data: [
                      splitMethodStats.totalAmount.equal,
                      splitMethodStats.totalAmount.custom
                    ],
                    backgroundColor: [
                      'hsl(215, 100%, 50%)',
                      'hsl(345, 100%, 50%)'
                    ],
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                    tooltip: {
                      backgroundColor: 'hsl(var(--background))',
                      titleColor: 'hsl(var(--foreground))',
                      bodyColor: 'hsl(var(--foreground))',
                      borderColor: 'hsl(var(--border))',
                      borderWidth: 1,
                      padding: 16,
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return `${context.label}: ${formatCurrency(value, selectedCurrency)}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your highest spending categories
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enhancedStatistics.topCategories.map(({ category, amount, percentage }) => (
              <div key={category} className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium">{category}</p>
                </div>
                <div className="w-2/3">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(amount, selectedCurrency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 