import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '../../utils/common';
import { 
  Calendar,
  Building,
  DollarSign,
  Clock,
  Eye,
  XCircle,
  Download,
  Filter,
  RefreshCw,
  CalendarDays,
  User,
  Star,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const BookingHistory: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('All');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/users/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        toast.success('Booking cancelled successfully');
        queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Error cancelling booking');
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    // Navigate to booking details or open modal
    console.log('View details:', booking.id);
    toast.info('Booking details feature coming soon!');
  };

  const handleDownloadInvoice = (booking: Booking) => {
    toast.success('Invoice download feature coming soon!');
  };

  const handleLeaveReview = (booking: Booking) => {
    if (booking.status === 'Completed' && !booking.reviewed) {
      toast.success('Review feature coming soon!');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter === 'All') return true;
    return booking.status === statusFilter;
  });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'Approved').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'Completed': return <CalendarDays className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
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
        <Skeleton className="h-10 w-full" />
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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Booking History
          </h1>
          <p className="text-muted-foreground text-lg">Track and manage all your hotel reservations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? 'Grid View' : 'List View'}
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <motion.div
            key={key}
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    key === 'total' ? 'bg-blue-500/10' :
                    key === 'upcoming' ? 'bg-emerald-500/10' :
                    key === 'pending' ? 'bg-amber-500/10' :
                    key === 'completed' ? 'bg-blue-500/10' :
                    'bg-rose-500/10'
                  }`}>
                    {getStatusIcon(
                      key === 'total' ? 'All' :
                      key === 'upcoming' ? 'Approved' :
                      key.charAt(0).toUpperCase() + key.slice(1)
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Controls */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by:</span>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Bookings</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Upcoming</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bookings Display */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Bookings</CardTitle>
                      <CardDescription>Your complete booking history</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Booking</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Room</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Dates</th>
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
                                <div className="flex flex-col">
                                  {/* <span className="font-mono text-sm font-semibold">#{booking.id}</span> */}
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(booking.createdAt || booking.checkIn)}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center">
                                    <Building className="w-5 h-5 text-slate-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{booking.roomName}</p>
                                    <p className="text-xs text-muted-foreground">{booking.roomType || 'Standard Room'}</p>
                                  </div>
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
                                  <span className="font-bold">₹{booking.totalPrice.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col gap-1">
                                  <StatusBadge status={booking.status} />
                                  {booking.status === 'Completed' && !booking.reviewed && (
                                    <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                                      Review Pending
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetails(booking)}
                                    className="gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    Details
                                  </Button>
                                  
                                  {booking.status === 'Completed' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDownloadInvoice(booking)}
                                      className="gap-1"
                                    >
                                      <Download className="w-3 h-3" />
                                      Invoice
                                    </Button>
                                  )}
                                  
                                  {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          className="gap-1"
                                          disabled={cancellingId === booking.id}
                                        >
                                          {cancellingId === booking.id ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          ) : (
                                            <XCircle className="w-3 h-3" />
                                          )}
                                          Cancel
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to cancel your booking for "{booking.roomName}"? 
                                            This action cannot be undone and may be subject to cancellation fees.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleCancel(booking.id)}
                                            className="bg-rose-500 hover:bg-rose-600"
                                          >
                                            Yes, Cancel Booking
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                  
                                  {booking.status === 'Completed' && !booking.reviewed && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleLeaveReview(booking)}
                                      className="gap-1 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                    >
                                      <Star className="w-3 h-3" />
                                      Review
                                    </Button>
                                  )}
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
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="border-border/50 hover:shadow-xl transition-all duration-300 h-full group overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge 
                              variant="secondary" 
                              className="font-mono text-xs mb-2"
                            >
                              #{booking.id}
                            </Badge>
                            <CardTitle className="text-lg mb-1">{booking.roomName}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Building className="w-3 h-3" />
                              {booking.roomType || 'Standard Room'}
                            </CardDescription>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Dates */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Check-in</span>
                            </div>
                            <span className="font-medium">
                              {new Date(booking.checkIn).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Check-out</span>
                            </div>
                            <span className="font-medium">
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>Total Amount</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-amber-500">
                              ₹{booking.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Booking Info */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.guests || 1} guest{booking.guests !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 3600 * 24))} nights
                            </span>
                          </div>
                        </div>
                        
                        {booking.specialRequests && (
                          <div className="pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>Special Requests</span>
                            </div>
                            <p className="text-sm line-clamp-2">{booking.specialRequests}</p>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="pt-4 border-t border-border/50">
                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-1"
                            onClick={() => handleViewDetails(booking)}
                          >
                            <Eye className="w-3 h-3" />
                            Details
                          </Button>
                          
                          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1"
                                  disabled={cancellingId === booking.id}
                                >
                                  {cancellingId === booking.id ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  ) : (
                                    <XCircle className="w-3 h-3" />
                                  )}
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel your booking for "{booking.roomName}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancel(booking.id)}
                                    className="bg-rose-500 hover:bg-rose-600"
                                  >
                                    Cancel Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          
                          {booking.status === 'Completed' && !booking.reviewed && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                              onClick={() => handleLeaveReview(booking)}
                            >
                              <Star className="w-3 h-3" />
                              Review
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {statusFilter !== 'All' 
                ? `You don't have any ${statusFilter.toLowerCase()} bookings. Try changing the filter.`
                : "You haven't made any bookings yet. Start your journey by booking a room!"}
            </p>
            {statusFilter !== 'All' ? (
              <Button
                variant="outline"
                onClick={() => setStatusFilter('All')}
              >
                View All Bookings
              </Button>
            ) : (
              <Button
                className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600"
                onClick={() => window.location.href = '/user/dashboard/book'}
              >
                <Calendar className="w-4 h-4" />
                Book Your First Room
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Cancellation Policy</h4>
                  <p className="text-sm text-muted-foreground">Free cancellation up to 48 hours before check-in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Invoice Download</h4>
                  <p className="text-sm text-muted-foreground">Download invoices for completed bookings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Need Help?</h4>
                  <p className="text-sm text-muted-foreground">Contact support for any booking issues</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BookingHistory;