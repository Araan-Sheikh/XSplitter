'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users2,
  Activity,
  Clock,
  BarChart3,
  ArrowUpRight,
  CircleDot,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

interface DashboardData {
  groups: Array<{
    id: string;
    name: string;
    type: string;
    memberCount: number;
    currency: string;
    createdAt: string;
    status: 'active' | 'inactive';
    slug: string;
    groupId: string;
  }>;
  stats: {
    totalGroups: number;
    activeGroups: number;
    recentActivities: number;
    memberDistribution: {
      empty: number;
      small: number;
      medium: number;
      large: number;
    };
  };
  latestActivities: Array<{
    id: string;
    name: string;
    type: string;
    timestamp: string;
    details: string;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchDashboardData();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <h3 className="text-3xl font-bold mt-2">{data.stats.totalGroups}</h3>
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
                    <p className="text-sm font-medium text-green-600">Active Groups</p>
                    <h3 className="text-3xl font-bold mt-2">{data.stats.activeGroups}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Groups with members
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden"
          >
            <Card className="bg-gradient-to-br from-purple-50 via-white to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Recent Activities</p>
                    <h3 className="text-3xl font-bold mt-2">{data.stats.recentActivities}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last 7 days
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Clock className="h-7 w-7 text-purple-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden"
          >
            <Card className="bg-gradient-to-br from-orange-50 via-white to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Distribution</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {Object.values(data.stats.memberDistribution).reduce((a, b) => a + b, 0)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total categories
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <BarChart3 className="h-7 w-7 text-orange-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/20 via-orange-500/40 to-orange-500/20" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* All Groups Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5 text-blue-500" />
                All Groups
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Complete list of all groups in the system
              </p>
            </CardHeader>
            <ScrollArea className="h-[500px]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Members</TableHead>
                      <TableHead className="hidden lg:table-cell">Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.groups.map((group) => (
                      <TableRow key={group.id} className="group">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <CircleDot className="h-4 w-4 text-blue-500" />
                            {group.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="capitalize">{group.type}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {group.memberCount}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {new Date(group.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={group.status === 'active' ? 'success' : 'secondary'}
                            className="group-hover:animate-pulse"
                          >
                            {group.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {group.groupId ? (
                            <Link
                              href={`/groups/${encodeURIComponent(group.groupId)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                            >
                              <span className="hidden sm:inline">Visit</span>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          ) : (
                            <span className="text-sm text-muted-foreground">No link available</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </Card>
        </motion.div>

        {/* Latest Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Latest Activities
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Recent actions and events in the system
              </p>
            </CardHeader>
            <ScrollArea className="h-[300px]">
              <div className="p-6 space-y-6">
                {data.latestActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
} 