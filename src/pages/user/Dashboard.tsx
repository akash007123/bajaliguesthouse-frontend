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
      description: 'All your bookings'
    },
    {
      label: 'Upcoming Stays',
      value: bookings.filter(b => b.status === 'Approved').length,
      icon: BedDouble,
      description: 'Confirmed stays'
    },
    {
      label: 'Total Spent',
      value: `₹${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`,
      icon: IndianRupee,
      description: 'Total amount spent'
    },
    {
      label: 'Pending Reviews',
      value: bookings.filter(b => b.status === 'Approved' && new Date(b.checkOut) < new Date()).length,
      icon: Clock,
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
      <div className="space-y-8 p-6">
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
      className="space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-navy-900">
              Welcome back, <span className="text-gold-600">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground text-lg">Here's your booking overview</p>
          </div>
          <Link to="/user/dashboard/book">
            <Button className="btn-gold shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
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
            <Card className="glass-card border-gold-200/50 hover:border-gold-400 transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className="bg-gold-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-gold-600" />
                  </div>
                </div>
                {stat.label === 'Total Spent' && bookings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gold-100">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                      <span>Avg: ₹{(bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length).toFixed(0)} / stay</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bookings */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card border-none shadow-lg h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gold-100/50 pb-4">
              <div>
                <CardTitle className="text-xl font-serif text-navy-900">Upcoming Stays</CardTitle>
                <CardDescription>Your confirmed upcoming reservations</CardDescription>
              </div>
              <Link to="/user/dashboard/history">
                <Button variant="ghost" className="gap-2 text-gold-600 hover:text-gold-700 hover:bg-gold-50">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/50 border border-gold-100 hover:border-gold-300 hover:shadow-md transition-all duration-300">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <p className="font-serif font-semibold text-lg text-navy-900">{booking.roomName}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gold-500" />
                              <span>{formatDate(booking.checkIn)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gold-500" />
                              <span>{Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 3600 * 24))} Nights</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 text-gold-500" />
                              <span className="font-medium text-navy-700">₹{booking.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <StatusBadge status={booking.status} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/30 rounded-xl border-2 border-dashed border-gold-200">
                  <BedDouble className="w-16 h-16 mx-auto text-gold-300 mb-4" />
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">No upcoming stays</h3>
                  <p className="text-muted-foreground mb-6">Ready for your next luxury experience?</p>
                  <Link to="/user/dashboard/book">
                    <Button className="btn-gold">
                      <BedDouble className="w-4 h-4 mr-2" />
                      Explore Rooms
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="glass-card border-none shadow-lg h-full">
            <CardHeader className="border-b border-gold-100/50 pb-4">
              <CardTitle className="text-xl font-serif text-navy-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4">
                <Link to="/user/dashboard/book">
                  <Button variant="outline" className="w-full h-auto py-4 justify-start px-6 gap-4 border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 text-navy-900 transition-all duration-300 group">
                    <div className="p-2 rounded-lg bg-gold-100 text-gold-600 group-hover:bg-gold-200 transition-colors">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold">Book a Room</span>
                      <span className="text-xs text-muted-foreground">Find your perfect stay</span>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/user/dashboard/history">
                  <Button variant="outline" className="w-full h-auto py-4 justify-start px-6 gap-4 border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 text-navy-900 transition-all duration-300 group">
                    <div className="p-2 rounded-lg bg-navy-100 text-navy-600 group-hover:bg-navy-200 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold">Booking History</span>
                      <span className="text-xs text-muted-foreground">View past stays</span>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/user/dashboard/profile">
                  <Button variant="outline" className="w-full h-auto py-4 justify-start px-6 gap-4 border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 text-navy-900 transition-all duration-300 group">
                    <div className="p-2 rounded-lg bg-gold-100 text-gold-600 group-hover:bg-gold-200 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold">My Profile</span>
                      <span className="text-xs text-muted-foreground">Update your details</span>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full h-auto py-4 justify-start px-6 gap-4 border-gold-200 hover:border-gold-400 hover:bg-gold-50/50 text-navy-900 transition-all duration-300 group">
                    <div className="p-2 rounded-lg bg-navy-100 text-navy-600 group-hover:bg-navy-200 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold">Contact Support</span>
                      <span className="text-xs text-muted-foreground">We're here to help</span>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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

export default UserDashboard;