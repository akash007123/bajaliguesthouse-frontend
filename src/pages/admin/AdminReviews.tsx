import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Booking } from '@/types';
import ViewReviewModal from '@/components/common/ViewReviewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/tables/DataTable';
import {
  Search,
  Filter,
  Star,
  User,
  Building,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  MessageSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminReviews: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReview, setSelectedReview] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: allReviews = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['adminReviews'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/reviews`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const updateReviewStatusMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string, approved: boolean }) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ approved })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      toast.success('Review status updated successfully!');
      setSelectedReview(null);
    },
    onError: () => {
      toast.error('Failed to update review status');
    }
  });

  const filteredReviews = allReviews.filter(review => {
    const matchesSearch = !searchTerm ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'New' && !review.reviewApproved) ||
      (statusFilter === 'Approved' && review.reviewApproved);
    return matchesSearch && matchesStatus;
  });

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const updateReviewStatus = (id: string, approved: boolean) => {
    updateReviewStatusMutation.mutate({ id, approved });
  };

  const statusCounts = {
    All: allReviews.length,
    New: allReviews.filter(r => !r.reviewApproved).length,
    Approved: allReviews.filter(r => r.reviewApproved).length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const columns = [
    {
      key: 'user',
      header: 'Guest',
      render: (review: Booking) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{review.userName}</p>
            <p className="text-xs text-muted-foreground">{review.userEmail || 'No email'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'room',
      header: 'Room',
      render: (review: Booking) => (
        <div className="flex items-center gap-2 text-sm">
          <Building className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium">{review.roomName}</span>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (review: Booking) => (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${star <= (review.rating || 0)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted/30'
                }`}
            />
          ))}
          <span className="ml-2 text-xs font-semibold">{review.rating}/5</span>
        </div>
      )
    },
    {
      key: 'feedback',
      header: 'Feedback',
      render: (review: Booking) => (
        <div className="flex items-start gap-2 max-w-xs">
          <MessageSquare className="w-3 h-3 text-muted-foreground mt-1 flex-shrink-0" />
          <p className="text-sm text-muted-foreground line-clamp-2 italic">
            "{review.feedback || 'No written feedback'}"
          </p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (review: Booking) => (
        <Badge
          variant={review.reviewApproved ? "default" : "secondary"}
          className={`${review.reviewApproved
            ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20"
            : "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20"}`}
        >
          {review.reviewApproved ? 'Approved' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (review: Booking) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => setSelectedReview(review)}>
            <Eye className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!review.reviewApproved ? (
                <DropdownMenuItem
                  onClick={() => updateReviewStatus(review.id, true)}
                  className="text-emerald-600 focus:text-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Review
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => updateReviewStatus(review.id, false)}
                  className="text-amber-600 focus:text-amber-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Pending
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div><Skeleton className="h-10 w-64 mb-2" /><Skeleton className="h-4 w-96" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Reviews</h1>
          <p className="text-muted-foreground mt-1">Moderate user reviews and ratings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['adminReviews'] })} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <motion.div key={status} variants={itemVariants}>
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{status} Reviews</p>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                </div>
                <div className={`p-3 rounded-xl ${status === 'New' ? 'bg-amber-500/10 text-amber-500' :
                    status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-slate-500/10 text-slate-500'
                  }`}>
                  {status === 'New' && <AlertCircle className="w-6 h-6" />}
                  {status === 'Approved' && <CheckCircle className="w-6 h-6" />}
                  {status === 'All' && <Star className="w-6 h-6" />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Table */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card/50">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Reviews</SelectItem>
              <SelectItem value="New">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={paginatedReviews}
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
              emptyMessage="No reviews found matching your criteria."
              onRowClick={(item) => setSelectedReview(item)}
              pagination={{
                currentPage,
                totalPages,
                onPageChange: setCurrentPage
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* View Review Modal */}
      <ViewReviewModal
        booking={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </motion.div>
  );
};

export default AdminReviews;