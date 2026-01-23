import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  BedDouble,
  CreditCard,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Booking, Room } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ViewBookingModal from "@/components/common/ViewBookingModal";
import ViewReviewModal from "@/components/common/ViewReviewModal";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardRecentBookings from "@/components/dashboard/DashboardRecentBookings";
import DashboardRecentReviews from "@/components/dashboard/DashboardRecentReviews";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<Booking | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["adminBookings"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => res.json()),
  });

  const { data: rooms = [], isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ["adminRooms"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/rooms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => res.json()),
  });

  const isLoading = bookingsLoading || roomsLoading;

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = bookings.filter(b => b.status === "Approved" && new Date(b.checkOut) >= new Date()).length;
  const pendingBookings = bookings.filter(b => b.status === "Pending").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      change: "+12.5%",
      trend: "up",
      color: "text-emerald-600",
      bg: "bg-emerald-100/50",
      description: "from last month"
    },
    {
      label: "Active Bookings",
      value: activeBookings,
      icon: Calendar,
      change: "+4.3%",
      trend: "up",
      color: "text-blue-600",
      bg: "bg-blue-100/50",
      description: "currently checked in"
    },
    {
      label: "Pending Requests",
      value: pendingBookings,
      icon: Clock,
      change: pendingBookings > 5 ? "High Load" : "Normal",
      trend: pendingBookings > 5 ? "down" : "neutral",
      color: "text-amber-600",
      bg: "bg-amber-100/50",
      description: "requires attention"
    },
    {
      label: "Room Occupancy",
      value: `${rooms.length > 0 ? ((rooms.filter(r => !r.available).length / rooms.length) * 100).toFixed(0) : 0}%`,
      icon: BedDouble,
      change: "-2.1%",
      trend: "down",
      color: "text-purple-600",
      bg: "bg-purple-100/50",
      description: "vs last week"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[500px] rounded-2xl lg:col-span-2" />
          <Skeleton className="h-[500px] rounded-2xl" />
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
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Here's what's happening today.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/dashboard/bookings">
            <Button variant="outline" className="h-11 px-5 rounded-xl border-border/60 hover:bg-muted/50 hover:text-foreground hover:border-border transition-all duration-300">
              <Calendar className="w-4 h-4 mr-2" />
              Manage Bookings
            </Button>
          </Link>
          <Link to="/admin/dashboard/rooms/add">
            <Button className="h-11 px-5 rounded-xl bg-gold hover:bg-gold-dark text-white shadow-gold hover:shadow-lg transition-all duration-300 active:scale-95">
              <BedDouble className="w-4 h-4 mr-2" />
              Add New Room
            </Button>
          </Link>
          <Link to="/admin/dashboard/newsletters">
            <Button variant="outline" className="h-11 px-5 rounded-xl border-border/60 hover:bg-muted/50 hover:text-foreground hover:border-border transition-all duration-300">
              <Users className="w-4 h-4 mr-2" />
              Newsletter Subscribers
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group"
          >
            <Card className="border-border/50 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden relative h-full bg-card/50 backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <stat.icon className="w-24 h-24" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-100' : stat.trend === 'down' ? 'text-rose-600 bg-rose-100' : 'text-gray-600 bg-gray-100'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <DashboardCharts bookings={bookings} rooms={rooms} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <DashboardRecentBookings bookings={bookings} setSelectedBooking={setSelectedBooking} setIsModalOpen={setIsModalOpen} />

        {/* Room Status & Revenue Mini Section */}
        <motion.div variants={itemVariants} className="space-y-6">

          {/* Quick Actions */}
          <Card className="border-border/50 shadow-sm bg-gradient-to-br from-navy to-navy-light text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <CardHeader>
              <CardTitle className="font-serif">Quick Actions</CardTitle>
              <CardDescription className="text-gray-300">Common tasks managed often.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 relative z-10">
              <Link to="/admin/dashboard/rooms/add" className="w-full">
                <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all cursor-pointer flex flex-col items-center text-center gap-2 group border border-white/5 hover:border-white/20">
                  <PlusCircle className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Add Room</span>
                </div>
              </Link>
              <Link to="/admin/dashboard/rooms/custom" className="w-full">
                <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all cursor-pointer flex flex-col items-center text-center gap-2 group border border-white/5 hover:border-white/20">
                  <Users className="w-6 h-6 text-blue-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Create Booking</span>
                </div>
              </Link>
              <Link to="/admin/dashboard/rooms" className="w-full">
                <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all cursor-pointer flex flex-col items-center text-center gap-2 group border border-white/5 hover:border-white/20">
                  <BedDouble className="w-6 h-6 text-emerald-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Manage Rooms</span>
                </div>
              </Link>
              <Link to="/admin/dashboard/messages" className="w-full">
                <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all cursor-pointer flex flex-col items-center text-center gap-2 group border border-white/5 hover:border-white/20">
                  <AlertCircle className="w-6 h-6 text-rose-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Support</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Room Availability */}
          <Card className="border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-serif font-bold">Room Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rooms.slice(0, 4).map(room => (
                  <div key={room.id} className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {room.images && room.images.length > 0 ? (
                          <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
                        ) : (
                          <BedDouble className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{room.name}</p>
                        <p className="text-xs text-muted-foreground">₹{room.price} / night</p>
                      </div>
                    </div>
                    <Badge variant={room.available ? "outline" : "secondary"} className={room.available ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-rose-600 bg-rose-50"}>
                      {room.available ? "Available" : "Occupied"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Link to="/admin/dashboard/rooms" className="block mt-4">
                <Button variant="outline" className="w-full text-xs h-9">View All Rooms</Button>
              </Link>
            </CardContent>
          </Card>

        </motion.div>
      </div>

      <DashboardRecentReviews bookings={bookings} setSelectedBooking={setSelectedReviewBooking} setIsModalOpen={setIsReviewModalOpen} />

      <ViewBookingModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ViewReviewModal
        booking={selectedReviewBooking}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </motion.div>
  );
};

export default AdminDashboard;
