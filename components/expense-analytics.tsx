import { useMemo } from 'react';
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
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    expenses.forEach(expense => {
      if (expense.currency === baseCurrency) {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
      }
    });
    return categories;
  }, [expenses, baseCurrency]);

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
      .filter(expense => expense.currency === baseCurrency)
      .forEach(expense => {
        const date = new Date(expense.date).toISOString().split('T')[0];
        dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
      });

    const sortedDates = Object.keys(dailyTotals).sort();
    
    return {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
      values: sortedDates.map(date => dailyTotals[date])
    };
  }, [expenses, baseCurrency]);

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
      .filter(expense => expense.currency === baseCurrency)
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
  }, [expenses, baseCurrency]);

  const statistics = useMemo(() => {
    const validExpenses = expenses.filter(expense => expense.currency === baseCurrency);
    const total = validExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avg = total / validExpenses.length || 0;
    const sorted = [...validExpenses].sort((a, b) => b.amount - a.amount);
    const highest = sorted[0] || null;
    const lowest = sorted[sorted.length - 1] || null;

    return { total, avg, highest, lowest };
  }, [expenses, baseCurrency]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(statistics.total, baseCurrency)}
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
              {formatCurrency(statistics.avg, baseCurrency)}
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
              {statistics.highest ? formatCurrency(statistics.highest.amount, baseCurrency) : '-'}
            </div>
            {statistics.highest && (
              <p className="text-sm text-muted-foreground mt-1">
                {statistics.highest.description}
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
              {statistics.lowest ? formatCurrency(statistics.lowest.amount, baseCurrency) : '-'}
            </div>
            {statistics.lowest && (
              <p className="text-sm text-muted-foreground mt-1">
                {statistics.lowest.description}
              </p>
            )}
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
                        return formatCurrency(value, baseCurrency);
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => formatCurrency(value as number, baseCurrency),
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
                        return formatCurrency(value, baseCurrency);
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => formatCurrency(value as number, baseCurrency),
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
                        return `${context.label}: ${formatCurrency(value, baseCurrency)}`;
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