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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, Filter, Activity, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";

interface Log {
  id: string;
  action: string;
  type: 'group' | 'member';
  details: string;
  userId: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/admin/logs', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(Array.isArray(data.logs) ? data.logs : []);
    } catch (error) {
      console.error('Logs fetch error:', error);
      toast.error('Failed to load logs');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, []);

  // Set up polling for updates
  useEffect(() => {
    // Poll every 5 seconds for new logs
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  // Set up WebSocket connection if available
  useEffect(() => {
    // Check if WebSocket is supported and configured
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (wsUrl) {
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLogs(prevLogs => [newLog, ...prevLogs]);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        ws.close();
      };
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLogs();
  };

  const extractHistoricalLogs = async () => {
    setIsExtracting(true);
    try {
      const response = await fetch('/api/admin/logs/extract', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to extract logs');
      toast.success('Historical logs extracted successfully');
      fetchLogs(); // Refresh logs after extraction
    } catch (error) {
      toast.error('Failed to extract historical logs');
    } finally {
      setIsExtracting(false);
    }
  };

  const filteredLogs = Array.isArray(logs) ? logs.filter(log => {
    const matchesSearch = 
      (log.action?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.details?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.userId?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  }) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'group': return 'bg-blue-500/10 text-blue-500';
      case 'member': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-2 md:p-6 space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 md:space-y-6"
      >
        {/* Header with Refresh Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold">System Logs</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Filters Card */}
        <Card className="bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Filter className="h-5 w-5 text-blue-500" />
              Log Filters
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Search and filter system logs
            </p>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Tabs value={filterType} className="w-full sm:w-auto" onValueChange={setFilterType}>
                  <TabsList className="grid w-full grid-cols-3 h-9">
                    <TabsTrigger value="all" className="text-xs md:text-sm">All Types</TabsTrigger>
                    <TabsTrigger value="group" className="text-xs md:text-sm">Groups</TabsTrigger>
                    <TabsTrigger value="member" className="text-xs md:text-sm">Members</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Tabs value={filterStatus} className="w-full sm:w-auto" onValueChange={setFilterStatus}>
                  <TabsList className="grid w-full grid-cols-4 h-9">
                    <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
                    <TabsTrigger value="success" className="text-xs md:text-sm">Success</TabsTrigger>
                    <TabsTrigger value="pending" className="text-xs md:text-sm">Pending</TabsTrigger>
                    <TabsTrigger value="failed" className="text-xs md:text-sm">Failed</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="outline"
                  onClick={extractHistoricalLogs}
                  disabled={isExtracting}
                  className="flex items-center gap-2 whitespace-nowrap w-full sm:w-auto"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs md:text-sm">Extracting...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span className="text-xs md:text-sm">Extract Logs</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Activity className="h-5 w-5 text-green-500" />
              System Logs
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Detailed log entries of system activities
            </p>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-24rem)]">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-4 md:p-8 text-center">
                <AlertCircle className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mb-4" />
                <h3 className="text-base md:text-lg font-semibold">No logs found</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-sm mt-1">
                  Try adjusting your filters or extract historical logs to see more entries
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px] md:w-[180px]">Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="w-[90px] md:w-[100px]">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Details</TableHead>
                      <TableHead className="hidden sm:table-cell">User</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="group">
                        <TableCell className="whitespace-nowrap text-xs md:text-sm">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-xs md:text-sm">
                          {log.action}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getTypeColor(log.type)} text-[10px] md:text-xs`}>
                            {log.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate text-xs md:text-sm">
                          {log.details}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell whitespace-nowrap text-xs md:text-sm">
                          {log.userId}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusColor(log.status)} 
                            className="text-[10px] md:text-xs group-hover:animate-pulse"
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
        </Card>
      </motion.div>
    </div>
  );
} 