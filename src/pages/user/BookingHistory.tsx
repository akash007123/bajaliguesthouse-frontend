import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BookingHistory: React.FC = () => {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/users/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        toast.success('Booking cancelled successfully');
        // Refetch bookings
        window.location.reload();
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Error cancelling booking');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Booking History</h1>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="text-left py-4 px-6 text-sm font-semibold">Booking ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Room</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Check-in</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Check-out</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b border-border">
                  <td className="py-4 px-6 text-sm font-medium">{booking.id}</td>
                  <td className="py-4 px-6 text-sm">{booking.roomName}</td>
                  <td className="py-4 px-6 text-sm">{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-sm">{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-sm font-medium">₹{booking.totalPrice}</td>
                  <td className="py-4 px-6"><StatusBadge status={booking.status} /></td>
                  <td className="py-4 px-6">
                    {booking.status !== 'Cancelled' && (
                      <Button variant="ghost" size="sm" onClick={() => handleCancel(booking.id)} className="text-destructive">Cancel</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
