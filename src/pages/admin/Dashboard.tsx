import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BedDouble, DollarSign, Users, TrendingUp, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Booking, Room } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['adminBookings'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const { data: rooms = [], isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ['adminRooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/rooms`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const isLoading = bookingsLoading || roomsLoading;

  const stats = [
    { 
      label: 'Total Bookings', 
      value: bookings.length, 
      icon: Calendar, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Available Rooms', 
      value: rooms.filter(r => r.available).length, 
      icon: BedDouble, 
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      change: `${rooms.length > 0 ? ((rooms.filter(r => r.available).length / rooms.length) * 100).toFixed(0) : 0}% available`,
      trend: 'neutral'
    },
    { 
      label: 'Total Revenue', 
      value: `₹${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      change: '+18%',
      trend: 'up'
    },
    { 
      label: 'Pending Actions', 
      value: bookings.filter(b => b.status === 'Pending').length, 
      icon: AlertCircle, 
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      change: 'Requires attention',
      trend: 'attention'
    },
  ];

  const statusStats = [
    { status: 'Approved', count: bookings.filter(b => b.status === 'Approved').length, color: 'bg-emerald-500' },
    { status: 'Pending', count: bookings.filter(b => b.status === 'Pending').length, color: 'bg-amber-500' },
    { status: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length, color: 'bg-rose-500' },
    { status: 'Completed', count: bookings.filter(b => b.status === 'Approved' && new Date(b.checkOut) < new Date()).length, color: 'bg-blue-500' },
  ];

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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-xl" />
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
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/dashboard/bookings">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Manage Bookings
              </Button>
            </Link>
            <Link to="/admin/dashboard/rooms/add">
              <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600">
                <BedDouble className="w-4 h-4" />
                Add Room
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant={stat.trend === 'attention' ? 'destructive' : 'secondary'} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border/50 hover:shadow-xl transition-shadow duration-300 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking requests</CardDescription>
                </div>
                <Link to="/admin/dashboard/bookings">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View All
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Guest</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Room</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{booking.userName}</p>
                            <p className="text-xs text-muted-foreground">#{booking.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="font-medium">{booking.roomName}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">₹{booking.totalPrice.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="py-3 px-4">
                          <Link to={`/admin/dashboard/bookings/${booking.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground">Waiting for customer bookings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Overview & Quick Stats */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Status Overview */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Booking Status</CardTitle>
              <CardDescription>Distribution overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusStats.map((stat) => (
                  <div key={stat.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stat.status}</span>
                      <span className="text-sm font-bold">{stat.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.count / Math.max(bookings.length, 1)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${stat.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                    <p className="text-lg font-bold">
                      {rooms.length > 0 
                        ? (((rooms.length - rooms.filter(r => r.available).length) / rooms.length) * 100).toFixed(1)
                        : '0'}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                    <p className="text-lg font-bold">
                      ₹{bookings.length > 0 
                        ? (bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length).toFixed(0)
                        : '0'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Growth</p>
                    <p className="text-lg font-bold text-emerald-500">+18.2%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/dashboard/rooms/add">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-2 text-sm">
                    <BedDouble className="w-4 h-4" />
                    Add Room
                  </Button>
                </Link>
                <Link to="/admin/dashboard/rooms">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    View Rooms
                  </Button>
                </Link>
                <Link to="/admin/dashboard/bookings">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    All Bookings
                  </Button>
                </Link>
                <Link to="/admin/dashboard/profile">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;