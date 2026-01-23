import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  BedDouble,
  ArrowUpRight,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardRecentBookingsProps {
  bookings: Booking[];
  setSelectedBooking: (booking: Booking | null) => void;
  setIsModalOpen: (open: boolean) => void;
}

const DashboardRecentBookings: React.FC<DashboardRecentBookingsProps> = ({
  bookings,
  setSelectedBooking,
  setIsModalOpen,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={itemVariants} className="lg:col-span-2">
      <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300 h-full bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-serif font-bold">Recent Bookings</CardTitle>
            <CardDescription>Latest transactions and reservation requests.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-border/50">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Guest & Room</th>
                  <th className="px-6 py-4 font-medium text-center">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {bookings.slice(0, 6).map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/50">
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">{booking.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{booking.userName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <BedDouble className="w-3 h-3" />
                            {booking.roomName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-foreground">{new Date(booking.checkIn).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                        <span className="text-xs text-muted-foreground">to {new Date(booking.checkOut).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">
                      ₹{booking.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); setIsModalOpen(true); }}>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No bookings found</h3>
                <p className="text-muted-foreground text-sm">Wait for new reservations to appear here.</p>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link to="/admin/dashboard/bookings">
              <Button variant="link" className="text-muted-foreground hover:text-gold transition-colors">View All Transactions <ArrowUpRight className="ml-1 w-3 h-3" /></Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardRecentBookings;