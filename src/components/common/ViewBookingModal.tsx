import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Booking } from '@/types';
import { Calendar, User, Building, Users, Clock, MessageSquare } from 'lucide-react';
import { formatDate } from '../../utils/common';

interface ViewBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewBookingModal: React.FC<ViewBookingModalProps> = ({ booking, isOpen, onClose }) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Booking Details - #{booking.id}
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
              {booking.roomType && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Room Type</label>
                  <p className="text-sm">{booking.roomType}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Booking Information
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
              <div>
                <label className="text-sm font-medium text-muted-foreground">Guests</label>
                <p className="text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {booking.guests}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Price</label>
                <p className="text-sm font-semibold flex items-center gap-1">
                  ₹{booking.totalPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant="secondary" className={`mt-1 ${booking.status === 'Approved' ? 'bg-green-100 text-green-500' : ''}`}>
                  {booking.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(booking.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Special Requests
                </h3>
                <p className="text-sm bg-muted p-3 rounded-md">{booking.specialRequests}</p>
              </div>
            </>
          )}

          {/* Reviewed Status */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reviewed</label>
              <p className="text-sm">{booking.reviewed ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBookingModal;