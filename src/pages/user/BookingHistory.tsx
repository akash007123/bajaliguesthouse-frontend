import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import ViewBookingModal from '@/components/common/ViewBookingModal';
import ReviewModal from '@/components/common/ReviewModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '../../utils/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

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
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleDownloadInvoice = (booking: Booking) => {
    setInvoiceBooking(booking);
    setTimeout(async () => {
      if (!invoiceRef.current) return;
      try {
        toast.info('Generating invoice...');
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`invoice-${booking.id}.pdf`);
        toast.success('Invoice downloaded successfully');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Error generating invoice');
      }
    }, 500);
  };

  const handleLeaveReview = (booking: Booking) => {
    if (booking.status === 'Completed' && !booking.reviewed) {
      setSelectedBookingForReview(booking);
      setIsReviewModalOpen(true);
    }
  };

  const handleSubmitReview = async (rating: number, feedback: string) => {
    if (!selectedBookingForReview) return;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/bookings/${selectedBookingForReview.id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ rating, feedback })
    });

    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    } else {
      throw new Error('Failed to submit review');
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
      case 'Approved': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'Completed': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
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
      className="space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-navy-900">
            Booking History
          </h1>
          <p className="text-muted-foreground text-lg">Track and manage all your homestay reservations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 border-gold-200 hover:bg-gold-50 text-navy-900"
            onClick={() => refetch()}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-gold-200 hover:bg-gold-50 text-navy-900"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <>
                <Building className="w-4 h-4" /> Grid View
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" /> List View
              </>
            )}
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
            <Card className="glass-card border-gold-100/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{key}</p>
                    <p className="text-2xl font-bold text-navy-900 mt-1">{value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${key === 'total' ? 'bg-blue-100' :
                      key === 'upcoming' ? 'bg-emerald-100' :
                        key === 'pending' ? 'bg-amber-100' :
                          key === 'completed' ? 'bg-blue-100' :
                            'bg-rose-100'
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
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-lg border border-gold-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-navy-900 whitespace-nowrap">
              <Filter className="w-4 h-4 text-gold-500" />
              Filter by:
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[200px] bg-white border-gold-200 focus:ring-gold-500/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Bookings</SelectItem>
                <SelectItem value="Pending">Pending Approval</SelectItem>
                <SelectItem value="Approved">Upcoming Stays</SelectItem>
                <SelectItem value="Completed">Completed Stays</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground w-full lg:w-auto text-right">
            Showing <span className="font-semibold text-navy-900">{filteredBookings.length}</span> of {bookings.length} bookings
          </div>
        </div>
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
              <Card className="glass-card border-none overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold-100 bg-gold-50/30">
                          <th className="text-left py-4 px-6 text-xs font-bold text-navy-900 uppercase tracking-wider">Booking Info</th>
                          <th className="text-left py-4 px-6 text-xs font-bold text-navy-900 uppercase tracking-wider">Room Details</th>
                          <th className="text-left py-4 px-6 text-xs font-bold text-navy-900 uppercase tracking-wider">Dates</th>
                          <th className="text-left py-4 px-6 text-xs font-bold text-navy-900 uppercase tracking-wider">Amount</th>
                          <th className="text-left py-4 px-6 text-xs font-bold text-navy-900 uppercase tracking-wider">Status</th>
                          <th className="text-right py-4 px-6 text-xs font-bold text-navy-900 uppercase tracking-wider">Actions</th>
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
                              className="border-b border-gold-100/50 hover:bg-gold-50/20 transition-colors group"
                            >
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <span className="font-mono text-xs font-medium text-muted-foreground">#{booking.id.slice(0, 8)}</span>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    Booked on {formatDate(booking.createdAt || new Date().toISOString())}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-600">
                                    <Building className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-navy-900">{booking.roomName}</p>
                                    <p className="text-xs text-muted-foreground">{booking.roomType || 'Deluxe Room'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-navy-900">
                                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                                    <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5 opacity-0" />
                                    <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-bold text-navy-900">₹{booking.totalPrice.toLocaleString()}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col items-start gap-1">
                                  <StatusBadge status={booking.status} />
                                  {booking.status === 'Completed' && !booking.reviewed && (
                                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                      Rate Your Stay
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewDetails(booking)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-navy-900 hover:bg-navy-50"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>

                                  {booking.status === 'Completed' && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDownloadInvoice(booking)}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-navy-900 hover:bg-navy-50"
                                      title="Download Invoice"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  )}

                                  {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                          disabled={cancellingId === booking.id}
                                          title="Cancel Booking"
                                        >
                                          {cancellingId === booking.id ? (
                                            <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                                          ) : (
                                            <XCircle className="w-4 h-4" />
                                          )}
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to cancel your booking for "{booking.roomName}"?
                                            This action cannot be undone.
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
                                      variant="ghost"
                                      onClick={() => handleLeaveReview(booking)}
                                      className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                      title="Leave a Review"
                                    >
                                      <Star className="w-4 h-4" />
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
                    <Card className="glass-card border-none hover:shadow-xl transition-all duration-300 h-full group overflow-hidden flex flex-col">
                      <div className="h-2 bg-gradient-to-r from-navy-900 via-gold-500 to-navy-900" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge
                              variant="secondary"
                              className="font-mono text-[10px] mb-2 bg-navy-50 text-navy-600"
                            >
                              #{booking.id.slice(0, 8)}
                            </Badge>
                            <CardTitle className="text-lg font-serif text-navy-900">{booking.roomName}</CardTitle>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 flex-1">
                        <div className="flex items-center justify-between text-sm py-2 border-b border-dashed border-gold-200/50">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-gold-500" />
                            <span>Check-in</span>
                          </div>
                          <span className="font-medium text-navy-900">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-2 border-b border-dashed border-gold-200/50">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-gold-500" />
                            <span>Check-out</span>
                          </div>
                          <span className="font-medium text-navy-900">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-muted-foreground">Total Paid</span>
                          <span className="text-xl font-bold text-navy-900">
                            ₹{booking.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-4 border-t border-gold-100/50 bg-gold-50/20">
                        <div className="flex gap-2 w-full justify-between">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-gold-200 hover:bg-white"
                            onClick={() => handleViewDetails(booking)}
                          >
                            Details
                          </Button>

                          <div className="flex gap-2">
                            {booking.status === 'Completed' && !booking.reviewed && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                                onClick={() => handleLeaveReview(booking)}
                              >
                                Review
                              </Button>
                            )}

                            {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                  >
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancel(booking.id)}
                                      className="bg-rose-500"
                                    >
                                      Yes
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
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
            className="text-center py-16 bg-white/30 rounded-2xl border-2 border-dashed border-gold-200"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-50 flex items-center justify-center">
              <CalendarDays className="w-10 h-10 text-gold-400" />
            </div>
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {statusFilter !== 'All'
                ? `You don't have any ${statusFilter.toLowerCase()} bookings. Try changing the filter.`
                : "You haven't made any bookings yet. Start your journey by booking a room!"}
            </p>
            {statusFilter !== 'All' ? (
              <Button
                variant="outline"
                className="btn-gold-outline"
                onClick={() => setStatusFilter('All')}
              >
                View All Bookings
              </Button>
            ) : (
              <Button
                className="btn-gold gap-2"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-none hover:shadow-lg transition-all">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 mb-1">Cancellation Policy</h4>
                <p className="text-sm text-muted-foreground">Free cancellation up to 48 hours before check-in. Manage comfortably.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none hover:shadow-lg transition-all">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 mb-1">Invoice Info</h4>
                <p className="text-sm text-muted-foreground">Download detailed tax invoices for all your completed stays instantly.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none hover:shadow-lg transition-all">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 mb-1">Help & Support</h4>
                <p className="text-sm text-muted-foreground">Having trouble? Our support team is available 24/7 to assist you.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Modals */}
      <ViewBookingModal
        booking={selectedBooking}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <ReviewModal
        booking={selectedBookingForReview}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />

      {/* Hidden Invoice Template */}
      <div ref={invoiceRef} className="absolute -left-[9999px] -top-[9999px] bg-white p-8 space-y-6">
        {invoiceBooking && (
          <>
            {/* Hotel Header */}
            <div className="text-center border-b pb-4">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-navy-900">Shri Bajali Home Stay</h1>
                <p className="text-sm text-muted-foreground">123 Main Street, City, State, PIN 123456</p>
                <p className="text-sm text-muted-foreground">Phone: +91 96855 33878 | Email: akashraikwar763@gmail.com</p>
              </div>
              <h2 className="text-2xl font-semibold text-gold-600">Hotel Booking Invoice</h2>
              <p className="text-muted-foreground">Thank you for choosing Shri Balaji Home Stay</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Invoice To:</h3>
                <div className="space-y-1">
                  <p className="font-medium">{invoiceBooking.userName}</p>
                  <p className="text-sm text-muted-foreground">{invoiceBooking.userEmail}</p>
                  {invoiceBooking.userMobile && (
                    <p className="text-sm text-muted-foreground">{invoiceBooking.userMobile}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Invoice Details:</h3>
                <div className="space-y-1">
                  <p className="text-sm">Invoice #: INV-{invoiceBooking.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm">Date: {formatDate(new Date().toISOString())}</p>
                  <div className="text-sm">Status: <span className="uppercase font-bold">{invoiceBooking.status}</span></div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Booking Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Booking Details
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Room:</span>
                  <span>{invoiceBooking.roomName} {invoiceBooking.roomType && `(${invoiceBooking.roomType})`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-in:</span>
                  <span>{formatDate(invoiceBooking.checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-out:</span>
                  <span>{formatDate(invoiceBooking.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Guests:</span>
                  <span>{invoiceBooking.guests}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Nights:</span>
                  <span>{Math.floor((new Date(invoiceBooking.checkOut).getTime() - new Date(invoiceBooking.checkIn).getTime()) / (1000 * 3600 * 24))}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Rate × {Math.floor((new Date(invoiceBooking.checkOut).getTime() - new Date(invoiceBooking.checkIn).getTime()) / (1000 * 3600 * 24))} nights</span>
                  <span>₹{invoiceBooking.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total Amount</span>
                  <span>₹{invoiceBooking.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {invoiceBooking.specialRequests && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Special Requests</h3>
                  <p className="text-sm bg-muted p-3 rounded-md">{invoiceBooking.specialRequests}</p>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Thank you for your business!</p>
              <p>For any questions, please contact our support team.</p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default BookingHistory;