import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BedDouble, IndianRupee, TrendingUp, ArrowRight, Clock, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '../../utils/common';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/users/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const stats = [
    { 
      label: 'Total Bookings', 
      value: bookings.length, 
      icon: Calendar, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'All your bookings'
    },
    { 
      label: 'Upcoming Stays', 
      value: bookings.filter(b => b.status === 'Approved').length, 
      icon: BedDouble, 
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      description: 'Confirmed stays'
    },
    { 
      label: 'Total Spent', 
      value: `₹${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`, 
      icon: IndianRupee, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      description: 'Total amount spent'
    },
    {
      label: 'Pending Reviews',
      value: bookings.filter(b => b.status === 'Approved' && new Date(b.checkOut) < new Date()).length,
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Awaiting your review'
    },
  ];

  const upcomingBookings = bookings
    .filter(b => b.status === 'Approved' && new Date(b.checkIn) > new Date())
    .slice(0, 3);

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
        <Skeleton className="h-96 rounded-xl" />
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
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground text-lg">Here's your booking overview</p>
          </div>
          <Link to="/user/dashboard/book">
            <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <BedDouble className="w-4 h-4" />
              Book New Room
            </Button>
          </Link>
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
            <Card className="border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/50 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                {stat.label === 'Total Spent' && bookings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
                      <span>Average: ₹{(bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length).toFixed(0)} per booking</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Upcoming Bookings */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Upcoming Stays</CardTitle>
              <CardDescription>Your confirmed upcoming reservations</CardDescription>
            </div>
            <Link to="/user/dashboard/history">
              <Button variant="ghost" className="gap-2 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent hover:from-muted border border-border/50 hover:border-border transition-all duration-300 group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="font-semibold text-lg">{booking.roomName}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Check-in: {formatDate(booking.checkIn)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Check-out: {formatDate(booking.checkOut)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>₹{booking.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BedDouble className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming stays</h3>
                <p className="text-muted-foreground mb-6">Book your next adventure!</p>
                <Link to="/user/dashboard/book">
                  <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600">
                    <BedDouble className="w-4 h-4" />
                    Explore Rooms
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/user/dashboard/book">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-muted/50 transition-all duration-300">
                  <BedDouble className="w-6 h-6 text-blue-500" />
                  <span>Book Room</span>
                </Button>
              </Link>
              <Link to="/user/dashboard/history">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-muted/50 transition-all duration-300">
                  <Calendar className="w-6 h-6 text-emerald-500" />
                  <span>View History</span>
                </Button>
              </Link>
              <Link to="/user/dashboard/profile">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-muted/50 transition-all duration-300">
                  <User className="w-6 h-6 text-purple-500" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-muted/50 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-amber-500" />
                  <span>Contact Support</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;