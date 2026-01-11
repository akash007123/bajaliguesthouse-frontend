import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BedDouble, DollarSign, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Booking, Room } from '@/types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['adminBookings'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['adminRooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/rooms`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-blue-500' },
    { label: 'Available Rooms', value: rooms.filter(r => r.available).length, icon: BedDouble, color: 'text-emerald-500' },
    { label: 'Revenue', value: `$${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`, icon: DollarSign, color: 'text-gold' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, icon: Users, color: 'text-amber-500' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user?.name}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-semibold">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map(booking => (
                  <tr key={booking.id} className="border-b border-border">
                    <td className="py-3 px-4 text-sm">{booking.id}</td>
                    <td className="py-3 px-4 text-sm">{booking.userName}</td>
                    <td className="py-3 px-4 text-sm">{booking.roomName}</td>
                    <td className="py-3 px-4 text-sm">${booking.totalPrice}</td>
                    <td className="py-3 px-4"><StatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
