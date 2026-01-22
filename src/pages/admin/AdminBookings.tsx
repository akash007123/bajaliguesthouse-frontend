import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import ViewBookingModal from '@/components/common/ViewBookingModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';
import {
  Search,
  Filter,
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

const AdminBookings: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);

  const { data: allBookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['adminBookings'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      toast.success('Booking status updated successfully!');
      setSelectedBooking(null);
    },
    onError: () => {
      toast.error('Failed to update booking status');
    }
  });

  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = !searchTerm ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const statusCounts = {
    All: allBookings.length,
    Pending: allBookings.filter(b => b.status === 'Pending').length,
    Approved: allBookings.filter(b => b.status === 'Approved').length,
    Cancelled: allBookings.filter(b => b.status === 'Cancelled').length,
    Completed: allBookings.filter(b => b.status === 'Completed').length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Define columns for DataTable
  const columns = [
    {
      key: 'id',
      header: 'Booking ID',
      render: (item: Booking) => <span className="font-mono text-xs">{item.id.slice(0, 8)}...</span>
    },
    {
      key: 'user',
      header: 'Guest',
      render: (item: Booking) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="font-medium text-sm">{item.userName}</p>
            <p className="text-xs text-muted-foreground">{item.userEmail || 'No email'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'room',
      header: 'Room',
      render: (item: Booking) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">{item.roomName}</span>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (item: Booking) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-emerald-600">In:</span>
            <span>{format(new Date(item.checkIn), 'MMM dd')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Out:</span>
            <span>{format(new Date(item.checkOut), 'MMM dd')}</span>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Total',
      render: (item: Booking) => <span className="font-bold text-sm">₹{item.totalPrice.toLocaleString()}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Booking) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (booking: Booking) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setSelectedBooking(booking)}>
            <Eye className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {booking.status === 'Pending' && (
                <>
                  <DropdownMenuItem className="gap-2 text-emerald-600 focus:text-emerald-700" onClick={() => updateBookingStatus(booking.id, 'Approved')}>
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-700" onClick={() => updateBookingStatus(booking.id, 'Cancelled')}>
                    <XCircle className="w-4 h-4" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="gap-2" onClick={() => updateBookingStatus(booking.id, 'Completed')}>
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-700" onClick={() => updateBookingStatus(booking.id, 'Cancelled')}>
                <XCircle className="w-4 h-4" />
                Cancel Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <DataTable isLoading columns={columns} data={[]} keyExtractor={(item) => item.id} />
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Bookings Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all reservations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['adminBookings'] })}
            className="hover:bg-muted"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <motion.div
            key={status}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            onClick={() => setStatusFilter(status)}
            className={`cursor-pointer transition-all duration-200 ${statusFilter === status ? 'ring-2 ring-gold ring-offset-2 ring-offset-background' : ''}`}
          >
            <Card className="border-border/50 hover:shadow-md h-full bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                    status === 'Approved' ? 'bg-emerald-100 text-emerald-600' :
                      status === 'Cancelled' ? 'bg-rose-100 text-rose-600' :
                        status === 'Completed' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                  }`}>
                  {status === 'Pending' && <AlertCircle className="w-4 h-4" />}
                  {status === 'Approved' && <CheckCircle className="w-4 h-4" />}
                  {status === 'Cancelled' && <XCircle className="w-4 h-4" />}
                  {status === 'Completed' && <Calendar className="w-4 h-4" />}
                  {status === 'All' && <SlidersHorizontal className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-2xl font-bold block">{count}</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{status}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Table */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/40 p-1 rounded-xl">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search guests, rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-background/50 border-input/60 focus:bg-background"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {statusFilter !== 'All' && (
              <Badge variant="secondary" className="px-3 h-8 flex gap-2 items-center cursor-pointer hover:bg-muted" onClick={() => setStatusFilter('All')}>
                {statusFilter}
                <XCircle className="w-3 h-3" />
              </Badge>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          emptyMessage="No bookings found matching your criteria."
          isLoading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: Math.ceil(filteredBookings.length / 10),
            onPageChange: setPage
          }}
        />
      </motion.div>

      <ViewBookingModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </motion.div>
  );
};

export default AdminBookings;