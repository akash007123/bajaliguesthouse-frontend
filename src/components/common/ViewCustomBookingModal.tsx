import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {formatDateTime} from '../../utils/common';

interface CustomBooking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  aadharCard?: string;
  profilePic?: string;
  roomAmount: number;
  numberOfRooms: number;
  numberOfGuests: number;
  roomNo: string;
  createdAt: string;
}

interface ViewCustomBookingModalProps {
  booking: CustomBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCustomBookingModal: React.FC<ViewCustomBookingModalProps> = ({ booking, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        {booking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {booking.name}
              </div>
              <div>
                <strong>Email:</strong> {booking.email}
              </div>
              <div>
                <strong>Mobile:</strong> {booking.mobile}
              </div>
              <div>
                <strong>Address:</strong> {booking.address}
              </div>
              <div>
                <strong>Room Amount:</strong> ₹{booking.roomAmount.toLocaleString()}
              </div>
              <div>
                <strong>Number of Rooms:</strong> {booking.numberOfRooms}
              </div>
              <div>
                <strong>Number of Guests:</strong> {booking.numberOfGuests}
              </div>
              <div>
                <strong>Room No:</strong> {booking.roomNo}
              </div>
              <div>
                <strong>Created At:</strong> {formatDateTime(booking.createdAt)
            }
              </div>
            </div>
            <div className="flex gap-4">
              {booking.profilePic && (
                <div>
                  <strong>Profile Picture:</strong>
                  <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${booking.profilePic}`} alt="Profile" className="w-32 h-32 object-cover rounded mt-2" />
                </div>
              )}
              {booking.aadharCard && (
                <div>
                  <strong>Aadhar Card:</strong>
                  <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${booking.aadharCard}`} alt="Aadhar" className="w-32 h-32 object-cover rounded mt-2" />
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomBookingModal;