import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CustomBookingForm from '@/components/forms/CustomBookingForm';
import CustomBookingsTable from '@/components/tables/CustomBookingsTable';
import { Plus } from 'lucide-react';

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

const AdminCustomBooking: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CustomBooking | null>(null);

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

  const handleFormSuccess = () => {
    setIsModalOpen(false);
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
  };

  const handleEditFormSuccess = () => {
    setEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleEditFormCancel = () => {
    setEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleViewBooking = (booking: CustomBooking) => {
    // TODO: Implement view booking modal
    console.log('View booking:', booking);
  };

  const handleEditBooking = (booking: CustomBooking) => {
    setSelectedBooking(booking);
    setEditModalOpen(true);
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Custom Bookings
          </h1>
          <p className="text-muted-foreground text-lg">Manage offline and custom booking entries</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
              <Plus className="w-4 h-4" />
              Add Custom Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Custom Booking</DialogTitle>
              <DialogDescription>
                Enter customer information and booking details for offline bookings
              </DialogDescription>
            </DialogHeader>
            <CustomBookingForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Custom Booking</DialogTitle>
              <DialogDescription>
                Update customer information and booking details
              </DialogDescription>
            </DialogHeader>
            <CustomBookingForm
              booking={selectedBooking}
              onSuccess={handleEditFormSuccess}
              onCancel={handleEditFormCancel}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Bookings Table */}
      <motion.div variants={itemVariants}>
        <CustomBookingsTable
          onView={handleViewBooking}
          onEdit={handleEditBooking}
        />
      </motion.div>
    </motion.div>
  );
};

export default AdminCustomBooking;