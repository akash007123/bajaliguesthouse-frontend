import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, User, Building, Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ViewReviewModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewReviewModal: React.FC<ViewReviewModalProps> = ({ booking, isOpen, onClose }) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Review Details - #{booking.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-1">
          {/* User Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{booking.userName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{booking.userEmail}{booking.userMobile ? ` (${booking.userMobile})` : ''}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Room Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Room Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Room Name</label>
                <p className="text-sm">{booking.roomName}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Review Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Review Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rating</label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (booking.rating || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">
                    {booking.rating}/5
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge
                    variant={booking.reviewApproved ? "default" : "secondary"}
                    className={booking.reviewApproved ? "bg-emerald-500" : "bg-amber-500"}
                  >
                    {booking.reviewApproved ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        New
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {booking.feedback && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </h3>
                <p className="text-sm bg-muted p-3 rounded-md">{booking.feedback}</p>
              </div>
            </>
          )}

          {/* Booking Dates */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Stay Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check-in Date</label>
                <p className="text-sm">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check-out Date</label>
                <p className="text-sm">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewModal;