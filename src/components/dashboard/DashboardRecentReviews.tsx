import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  ArrowUpRight,
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardRecentReviewsProps {
  bookings: Booking[];
  setSelectedBooking: (booking: Booking | null) => void;
  setIsModalOpen: (open: boolean) => void;
}

const DashboardRecentReviews: React.FC<DashboardRecentReviewsProps> = ({
  bookings,
  setSelectedBooking,
  setIsModalOpen,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Filter bookings with reviews and sort by createdAt descending
  const reviews = bookings
    .filter(booking => booking.rating !== undefined || booking.feedback)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300 bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-serif font-bold">Recent Reviews</CardTitle>
            <CardDescription>Latest guest feedback and ratings.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors group cursor-pointer"
                onClick={() => {
                  setSelectedBooking(booking);
                  setIsModalOpen(true);
                }}
              >
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs">
                    {booking.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{booking.userName}</span>
                      <Badge
                        variant={booking.reviewApproved ? "default" : "secondary"}
                        className={booking.reviewApproved ? "bg-emerald-500" : "bg-amber-500"}
                      >
                        {booking.reviewApproved ? "Approved" : "New"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (booking.rating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {booking.roomName} • {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  {booking.feedback && (
                    <p className="text-sm text-foreground line-clamp-2">
                      {booking.feedback}
                    </p>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); setIsModalOpen(true); }}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
            {reviews.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No reviews yet</h3>
                <p className="text-muted-foreground text-sm">Reviews will appear here once guests leave feedback.</p>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link to="/admin/dashboard/bookings">
              <Button variant="link" className="text-muted-foreground hover:text-gold transition-colors">
                View All Reviews <ArrowUpRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardRecentReviews;