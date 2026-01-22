import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BadgeIndianRupee, CalendarIcon, RefreshCw, Search, ArrowUpDown, ArrowUp, ArrowDown, Download, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { motion } from 'framer-motion';

interface CustomBooking {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  roomAmount: number;
  numberOfRooms: number;
}

const RevenueDashboard: React.FC = () => {
  const [revenueType, setRevenueType] = useState('month');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [bookingFromDate, setBookingFromDate] = useState<Date>();
  const [bookingToDate, setBookingToDate] = useState<Date>();

  const { data, isLoading } = useQuery({
    queryKey: ['revenue', revenueType, fromDate, toDate],
    queryFn: async () => {
      const params = new URLSearchParams({ type: revenueType });
      if (fromDate && toDate) {
        params.append('from', fromDate.toISOString());
        params.append('to', toDate.toISOString());
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/revenue?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.json();
    },
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['customBookings', bookingFromDate, bookingToDate, search, sortBy, sortOrder, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder
      });
      if (bookingFromDate && bookingToDate) {
        params.append('from', bookingFromDate.toISOString());
        params.append('to', bookingToDate.toISOString());
      }
      if (search) {
        params.append('search', search);
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/bookings/custom?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.json();
    },
  });

  // Date Logic Effect (Simplified)
  useEffect(() => {
    if (fromDate && toDate) return;
    const now = new Date();
    if (revenueType === 'day') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      setFromDate(start);
      setToDate(end);
    } else if (revenueType === 'week') {
      const dayOfWeek = now.getDay();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - dayOfWeek) + 1);
      setFromDate(start);
      setToDate(end);
    } else if (revenueType === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      setFromDate(start);
      setToDate(end);
    } else if (revenueType === 'year') {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear() + 1, 0, 1);
      setFromDate(start);
      setToDate(end);
    }
  }, [revenueType, fromDate, toDate]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const columns = [
    { key: 'id', header: 'Booking ID', render: (item: CustomBooking) => <span className="font-mono text-xs">{item.id.slice(0, 8)}...</span> },
    { key: 'name', header: 'Customer Name', render: (item: CustomBooking) => <div className="font-medium">{item.name}</div> },
    {
      key: 'createdAt',
      header: (
        <Button variant="ghost" onClick={() => handleSort('createdAt')} className="h-auto p-0 font-semibold hover:bg-transparent">
          Date
          {sortBy === 'createdAt' && (
            sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      ),
      render: (item: CustomBooking) => format(new Date(item.createdAt), 'MMM dd, yyyy')
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'text-right',
      render: (item: CustomBooking) => <div className="text-right font-medium text-emerald-600">₹{(item.roomAmount * item.numberOfRooms).toLocaleString()}</div>
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Revenue Analytics</h1>
          <p className="text-muted-foreground mt-1">Track financial performance and growth.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: data?.kpis?.today, color: "from-blue-500 to-blue-600" },
          { label: "This Week", value: data?.kpis?.thisWeek, color: "from-emerald-500 to-emerald-600" },
          { label: "This Month", value: data?.kpis?.thisMonth, color: "from-amber-500 to-amber-600" },
          { label: "This Year", value: data?.kpis?.thisYear, color: "from-purple-500 to-purple-600" },
        ].map((kpi, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="overflow-hidden border-none shadow-md group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />
              <CardContent className="p-6 relative z-10 text-white">
                <p className="text-sm font-medium text-white/80 mb-2">{kpi.label}</p>
                <div className="text-3xl font-bold flex items-baseline gap-1">
                  <span className="text-xl opacity-70">₹</span>
                  {isLoading ? '...' : (kpi.value || 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Income overtime visualization</CardDescription>
              </div>
              <Select value={revenueType} onValueChange={setRevenueType}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.chartData || []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#d97706"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Breakdown Chart */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Sources</CardTitle>
              <CardDescription>Revenue by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.chartData ? data.chartData.slice(0, 7) : []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" hide />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="revenue" fill="hsl(var(--navy))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transactions Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Detailed booking logs and custom entries.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64 hidden md:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9 bg-muted/30"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Date Range</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={bookingFromDate}
                    onSelect={setBookingFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setSearch(''); setBookingFromDate(undefined); setBookingToDate(undefined); }}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={bookingsData?.bookings || []}
              keyExtractor={(item) => item.id}
              emptyMessage="No transactions found."
              isLoading={bookingsLoading}
              pagination={bookingsData?.pagination ? {
                currentPage: bookingsData.pagination.currentPage,
                totalPages: bookingsData.pagination.totalPages,
                onPageChange: setPage,
              } : undefined}
            />
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
};

export default RevenueDashboard;