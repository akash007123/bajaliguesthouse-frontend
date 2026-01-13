import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BadgeIndianRupee, CalendarIcon, RefreshCw, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';

interface CustomBooking {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  roomAmount: number;
  numberOfRooms: number;
}

const RevenueDashboard: React.FC = () => {
  const [revenueType, setRevenueType] = useState('day');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [dateError, setDateError] = useState('');
  const [bookingFromDate, setBookingFromDate] = useState<Date>();
  const [bookingToDate, setBookingToDate] = useState<Date>();
  const [bookingDateError, setBookingDateError] = useState('');

  const { data, refetch, isLoading } = useQuery({
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

  const handleReset = () => {
    setRevenueType('day');
    setFromDate(undefined);
    setToDate(undefined);
    setSearch('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
    // Dates will be set by useEffect
  };

  const handleBookingReset = () => {
    setBookingFromDate(undefined);
    setBookingToDate(undefined);
    setSearch('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  useEffect(() => {
    if (fromDate && toDate && fromDate > toDate) {
      setDateError('From date must be before or equal to To date');
    } else {
      setDateError('');
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (bookingFromDate && bookingToDate && bookingFromDate > bookingToDate) {
      setBookingDateError('From date must be before or equal to To date');
    } else {
      setBookingDateError('');
    }
  }, [bookingFromDate, bookingToDate]);

  useEffect(() => {
    if (fromDate && toDate) return; // Don't override if dates are already set
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
    { key: 'id', header: 'Booking ID', render: (item: CustomBooking) => item.id },
    { key: 'name', header: 'Customer Name' },
    {
      key: 'createdAt',
      header: (
        <Button variant="ghost" onClick={() => handleSort('createdAt')} className="h-auto p-0 font-semibold">
          Booking Date
          {sortBy === 'createdAt' ? (
            sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      ),
      render: (item: CustomBooking) => format(new Date(item.createdAt), 'PPP')
    },
    { key: 'checkIn', header: 'Check-in Date', render: () => 'N/A' },
    { key: 'checkOut', header: 'Check-out Date', render: () => 'N/A' },
    {
      key: 'amount',
      header: (
        <Button variant="ghost" onClick={() => handleSort('roomAmount')} className="h-auto p-0 font-semibold">
          Amount
          {sortBy === 'roomAmount' ? (
            sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      ),
      render: (item: CustomBooking) => formatCurrency(item.roomAmount * item.numberOfRooms)
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Revenue Type</label>
              <Select value={revenueType} onValueChange={setRevenueType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {dateError && (
              <div className="col-span-full text-red-500 text-sm">{dateError}</div>
            )}

            <div className="flex items-end">
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <BadgeIndianRupee className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(data?.kpis?.today || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week Revenue</CardTitle>
            <BadgeIndianRupee className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(data?.kpis?.thisWeek || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
            <BadgeIndianRupee className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(data?.kpis?.thisMonth || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year Revenue</CardTitle>
            <BadgeIndianRupee className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(data?.kpis?.thisYear || 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Total Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue for Selected Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center">
            {isLoading ? '...' : formatCurrency(data?.totalRevenue || 0)}
          </div>
        </CardContent>
      </Card>

      {/* Booking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Bookings</CardTitle>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleBookingReset} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingFromDate ? format(bookingFromDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={bookingFromDate} onSelect={setBookingFromDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingToDate ? format(bookingToDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={bookingToDate} onSelect={setBookingToDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              {bookingDateError && (
                <div className="flex items-end text-red-500 text-sm">{bookingDateError}</div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={bookingsData?.bookings || []}
            keyExtractor={(item) => item.id}
            emptyMessage="No bookings found for the selected period"
            isLoading={bookingsLoading}
            pagination={
              bookingsData?.pagination
                ? {
                    currentPage: bookingsData.pagination.currentPage,
                    totalPages: bookingsData.pagination.totalPages,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueDashboard;