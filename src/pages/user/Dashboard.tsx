import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BedDouble, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/users/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-blue-500' },
    { label: 'Upcoming Stays', value: bookings.filter(b => b.status === 'Approved').length, icon: BedDouble, color: 'text-emerald-500' },
    { label: 'Total Spent', value: `₹${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`, icon: DollarSign, color: 'text-gold' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of your bookings</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
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
            <Link to="/user/dashboard/history"><Button variant="ghost" className="text-gold">View All</Button></Link>
          </div>
          <div className="space-y-4">
            {bookings.slice(0, 3).map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{booking.roomName}</p>
                  <p className="text-sm text-muted-foreground">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
