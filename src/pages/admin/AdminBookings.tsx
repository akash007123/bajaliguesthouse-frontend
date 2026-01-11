import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const AdminBookings: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: allBookings = [] } = useQuery<Booking[]>({
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
      toast.success('Booking status updated');
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Bookings Management</h1>
      <p className="text-muted-foreground mb-8">Manage all hotel bookings</p>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by guest name, room, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Guest</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Room</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Check-in</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Check-out</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="border-b border-border">
                  <td className="py-3 px-4 text-sm">{booking.id}</td>
                  <td className="py-3 px-4 text-sm">{booking.userName}</td>
                  <td className="py-3 px-4 text-sm">{booking.roomName}</td>
                  <td className="py-3 px-4 text-sm">{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm">{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm">${booking.totalPrice}</td>
                  <td className="py-3 px-4"><StatusBadge status={booking.status} /></td>
                  <td className="py-3 px-4">
                    {booking.status === 'New' || booking.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'Approved')}>Confirm</Button>
                        <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(booking.id, 'Cancelled')}>Cancel</Button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBookings;