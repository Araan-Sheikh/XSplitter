'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users2,
  Activity,
  Calendar,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Line,
  Bar,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  dailyActivity: {
    dates: string[];
    groups: number[];
  };
  membershipStats: {
    labels: string[];
    data: number[];
  };
  overview: {
    totalGroups: number;
    activeUsers: number;
  };
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeFilter]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?filter=${timeFilter}`);
      if (!response.ok) throw new Error('Failed to fetch analytics data');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-4 md:p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden"
          >
            <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Groups</p>
                    <h3 className="text-3xl font-bold mt-2">{data.overview.totalGroups}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Active communities
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users2 className="h-7 w-7 text-blue-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-blue-500/40 to-blue-500/20" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden"
          >
            <Card className="bg-gradient-to-br from-green-50 via-white to-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Active Users</p>
                    <h3 className="text-3xl font-bold mt-2">{data.overview.activeUsers}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Engaged members
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Activity className="h-7 w-7 text-green-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/20 via-green-500/40 to-green-500/20" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Activity Timeline
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Group creation trends over time
                  </p>
                </div>
                <Tabs defaultValue={timeFilter} className="w-full sm:w-auto" onValueChange={setTimeFilter}>
                  <TabsList className="grid w-full sm:w-auto grid-cols-4 h-9">
                    <TabsTrigger value="week" className="text-xs sm:text-sm">Week</TabsTrigger>
                    <TabsTrigger value="month" className="text-xs sm:text-sm">Month</TabsTrigger>
                    <TabsTrigger value="year" className="text-xs sm:text-sm">Year</TabsTrigger>
                    <TabsTrigger value="all" className="text-xs sm:text-sm">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] md:h-[400px] w-full">
                  <Line
                    data={{
                      labels: data.dailyActivity.dates,
                      datasets: [
                        {
                          label: 'Groups Created',
                          data: data.dailyActivity.groups,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          fill: true,
                          tension: 0.4,
                          borderWidth: 2,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        intersect: false,
                        mode: 'index',
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: 'white',
                          titleColor: 'black',
                          bodyColor: 'black',
                          borderColor: 'rgb(229, 231, 235)',
                          borderWidth: 1,
                          padding: 12,
                          boxPadding: 6,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                          },
                          ticks: {
                            maxTicksLimit: 5,
                          }
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            maxTicksLimit: window.innerWidth < 768 ? 5 : 10,
                            maxRotation: 45,
                            minRotation: 45,
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Group Size Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Group Size Distribution
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Breakdown of groups by member count
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] md:h-[400px] w-full">
                  <Bar
                    data={{
                      labels: data.membershipStats.labels,
                      datasets: [{
                        label: 'Groups',
                        data: data.membershipStats.data,
                        backgroundColor: [
                          'rgba(239, 68, 68, 0.8)',   // Empty - Red
                          'rgba(59, 130, 246, 0.8)',  // 1-3 - Blue
                          'rgba(16, 185, 129, 0.8)',  // 4-6 - Green
                          'rgba(168, 85, 247, 0.8)',  // 7+ - Purple
                        ],
                        borderWidth: 0,
                        borderRadius: 4,
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
                          backgroundColor: 'white',
                          titleColor: 'black',
                          bodyColor: 'black',
                          borderColor: 'rgb(229, 231, 235)',
                          borderWidth: 1,
                          padding: 12,
                          callbacks: {
                            label: function(context) {
                              return `${context.parsed.y} groups`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                          },
                          ticks: {
                            maxTicksLimit: 5,
                          }
                        },
                        x: {
                          grid: {
                            display: false,
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ScrollArea>
  );
} 