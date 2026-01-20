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
  Trash2
} from 'lucide-react';
import { formatDate } from '@/utils/common';

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
          {booking.profilePic ? (
            <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${booking.profilePic}`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{booking.name}</p>
            <p className="text-xs text-muted-foreground">{booking.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'mobile',
      header: 'Contact',
      render: (booking: CustomBooking) => (
        <div>
          <p className="font-medium">{booking.mobile}</p>
          <p className="text-xs text-muted-foreground">{booking.address.substring(0, 30)}...</p>
        </div>
      )
    },
    {
      key: 'roomAmount',
      header: 'Amount',
      render: (booking: CustomBooking) => (
        <span className="font-bold">₹{booking.roomAmount.toLocaleString()}</span>
      )
    },
    {
      key: 'roomNo',
      header: 'Room',
      render: (booking: CustomBooking) => (
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{booking.roomNo}</span>
        </div>
      )
    },
    {
      key: 'numberOfGuests',
      header: 'Guests',
      render: (booking: CustomBooking) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{booking.numberOfGuests}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (booking: CustomBooking) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(booking.createdAt)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (booking: CustomBooking) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
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
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit?.(booking)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600"
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
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Custom Bookings</CardTitle>
          <CardDescription>
            {customBookingsData?.pagination?.totalBookings || 0} custom booking{(customBookingsData?.pagination?.totalBookings || 0) !== 1 ? 's' : ''} found
          </CardDescription>
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