import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Building, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminBookings: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const statusColors = {
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    Completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Bookings Management
          </h1>
          <p className="text-muted-foreground text-lg">Manage and monitor all hotel bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['adminBookings'] })}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <motion.div
            key={status}
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{status}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    status === 'Pending' ? 'bg-amber-500/10' :
                    status === 'Approved' ? 'bg-emerald-500/10' :
                    status === 'Cancelled' ? 'bg-rose-500/10' :
                    status === 'Completed' ? 'bg-blue-500/10' :
                    'bg-slate-500/10'
                  }`}>
                    {status === 'Pending' && <AlertCircle className="w-6 h-6 text-amber-500" />}
                    {status === 'Approved' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                    {status === 'Cancelled' && <XCircle className="w-6 h-6 text-rose-500" />}
                    {status === 'Completed' && <Calendar className="w-6 h-6 text-blue-500" />}
                    {status === 'All' && <RefreshCw className="w-6 h-6 text-slate-500" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search bookings by guest, room, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusCounts).map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center justify-between w-full">
                          <span>{status}</span>
                          <Badge variant="secondary" className="ml-2">
                            {statusCounts[status as keyof typeof statusCounts]}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(searchTerm || statusFilter !== 'All') && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('All');
                    }}
                    className="text-muted-foreground"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bookings Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>
                  {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                Total Revenue: ₹{filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    {/* <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Booking ID</th> */}
                    <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Guest</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Room</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Duration</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                      >

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium">{booking.userName}</p>
                              <p className="text-xs text-muted-foreground">{booking.userEmail || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{booking.roomName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-500" />
                            <span className="font-bold">₹{booking.totalPrice.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {(booking.status === 'Pending' || booking.status === 'New') && (
                              <>
                                <Button
                                  size="sm"
                                  className="gap-1 bg-emerald-500 hover:bg-emerald-600"
                                  onClick={() => updateBookingStatus(booking.id, 'Approved')}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1"
                                  onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <XCircle className="w-3 h-3" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-emerald-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Mark as Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-blue-600">
                                  <Calendar className="w-4 h-4" />
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-rose-600">
                                  <XCircle className="w-4 h-4" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'No bookings have been made yet. Bookings will appear here once customers make reservations.'}
            </p>
            {(searchTerm || statusFilter !== 'All') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                }}
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminBookings;