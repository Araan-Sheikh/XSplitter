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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select
          value={timePeriod}
          onValueChange={setTimePeriod}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select currency" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(enhancedStatistics.total, selectedCurrency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average per Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(enhancedStatistics.avg, selectedCurrency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedStatistics.highest ? formatCurrency(enhancedStatistics.highest.amount, selectedCurrency) : '-'}
            </div>
            {enhancedStatistics.highest && (
              <p className="text-sm text-muted-foreground mt-1">
                {enhancedStatistics.highest.description}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lowest Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedStatistics.lowest ? formatCurrency(enhancedStatistics.lowest.amount, selectedCurrency) : '-'}
            </div>
            {enhancedStatistics.lowest && (
              <p className="text-sm text-muted-foreground mt-1">
                {enhancedStatistics.lowest.description}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month's Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(enhancedStatistics.monthlyTotal, selectedCurrency)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {enhancedStatistics.monthlyExpenseCount} expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enhancedStatistics.topCategories.map(({ category, amount, percentage }) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm">{category}</span>
                  <span className="text-sm font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(enhancedStatistics.monthlyAvg, selectedCurrency)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              per expense this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Split Methods Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Equal Split</div>
                  <div className="text-2xl font-bold">{splitMethodStats.equal}</div>
                  <div className="text-sm text-muted-foreground">
                    Total: {formatCurrency(splitMethodStats.totalAmount.equal, selectedCurrency)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Custom Split</div>
                  <div className="text-2xl font-bold">{splitMethodStats.custom}</div>
                  <div className="text-sm text-muted-foreground">
                    Total: {formatCurrency(splitMethodStats.totalAmount.custom, selectedCurrency)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Equal Split Usage</span>
                  <span>
                    {((splitMethodStats.equal / (splitMethodStats.equal + splitMethodStats.custom)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Custom Split Usage</span>
                  <span>
                    {((splitMethodStats.custom / (splitMethodStats.equal + splitMethodStats.custom)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Split Method Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Pie 
                data={{
                  labels: ['Equal Split', 'Custom Split'],
                  datasets: [{
                    data: [
                      splitMethodStats.totalAmount.equal,
                      splitMethodStats.totalAmount.custom
                    ],
                    backgroundColor: [
                      '#36A2EB',
                      '#FF6384'
                    ],
                  }]
                }}
                options={{
                  plugins: {
                    tooltip: {
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
          <CardTitle>Monthly Expense Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line 
              data={{
                labels: monthlyData.labels,
                datasets: [{
                  label: 'Monthly Total',
                  data: monthlyData.values,
                  borderColor: '#36A2EB',
                  backgroundColor: 'rgba(54, 162, 235, 0.1)',
                  tension: 0.4,
                  fill: true,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
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
          <CardTitle>Daily Expense Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line 
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
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
          <CardTitle>Expense Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Pie 
              data={pieChartData}
              options={{
                plugins: {
                  tooltip: {
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
  );
} 
