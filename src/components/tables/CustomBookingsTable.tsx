import React, { useState } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ViewCustomBookingModal from '@/components/common/ViewCustomBookingModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  User,
  Hash,
  Users,
  Eye,
  Edit,
  Trash2,
  Phone,
  Calendar
} from 'lucide-react';
import { formatDate } from '../../utils/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CustomBooking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  aadharCard?: string;
  profilePic?: string;
  roomAmount: number;
  numberOfRooms: number;
  numberOfGuests: number;
  roomNo: string;
  createdAt: string;
}

interface CustomBookingsTableProps {
  onView?: (booking: CustomBooking) => void;
  onEdit?: (booking: CustomBooking) => void;
}

const CustomBookingsTable: React.FC<CustomBookingsTableProps> = ({ onView, onEdit }) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CustomBooking | null>(null);

  const { data: customBookingsData, isLoading } = useQuery<{
    bookings: CustomBooking[];
    pagination: { currentPage: number; totalPages: number; totalBookings: number; hasNext: boolean; hasPrev: boolean };
  }>({
    queryKey: ['customBookings', currentPage],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/bookings/custom?page=${currentPage}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const deleteCustomBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/bookings/custom/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete custom booking');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Custom booking deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['customBookings'] });
    },
    onError: () => {
      toast.error('Failed to delete custom booking');
    }
  });

  const customBookings = customBookingsData?.bookings || [];
  const totalPages = customBookingsData?.pagination?.totalPages || 1;

  const handleDelete = (booking: CustomBooking) => {
    if (window.confirm(`Are you sure you want to delete the booking for ${booking.name}?`)) {
      deleteCustomBookingMutation.mutate(booking.id);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (booking: CustomBooking) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/50">
            {booking.profilePic ? (
              <AvatarImage src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${booking.profilePic}`} />
            ) : null}
            <AvatarFallback className="bg-primary/5 text-primary text-xs">{booking.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-foreground">{booking.name}</p>
            <p className="text-xs text-muted-foreground">{booking.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'mobile',
      header: 'Contact',
      render: (booking: CustomBooking) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-sm">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span className="font-medium">{booking.mobile}</span>
          </div>
          <p className="text-xs text-muted-foreground pl-4.5 truncate max-w-[150px]">{booking.address}</p>
        </div>
      )
    },
    {
      key: 'roomAmount',
      header: 'Amount',
      render: (booking: CustomBooking) => (
        <span className="font-bold text-sm">₹{booking.roomAmount.toLocaleString()}</span>
      )
    },
    {
      key: 'roomNo',
      header: 'Room',
      render: (booking: CustomBooking) => (
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">{booking.roomNo}</span>
        </div>
      )
    },
    {
      key: 'numberOfGuests',
      header: 'Guests',
      render: (booking: CustomBooking) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{booking.numberOfGuests}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Create Date',
      render: (booking: CustomBooking) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(booking.createdAt)}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (booking: CustomBooking) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => {
              setSelectedBooking(booking);
              setViewModalOpen(true);
              onView?.(booking);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted text-blue-500 hover:text-blue-600"
            onClick={() => onEdit?.(booking)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-rose-100 text-rose-500 hover:text-rose-600"
            onClick={() => handleDelete(booking)}
            disabled={deleteCustomBookingMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Custom Booking Records</CardTitle>
              <CardDescription>
                {customBookingsData?.pagination?.totalBookings || 0} custom booking{(customBookingsData?.pagination?.totalBookings || 0) !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customBookings}
            keyExtractor={(booking) => booking.id}
            emptyMessage="No custom bookings found"
            isLoading={isLoading}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage
            }}
          />
        </CardContent>
      </Card>
      <ViewCustomBookingModal
        booking={selectedBooking}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </>
  );
};

export default CustomBookingsTable;