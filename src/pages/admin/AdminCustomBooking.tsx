import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CustomBookingForm from '@/components/forms/CustomBookingForm';
import CustomBookingsTable from '@/components/tables/CustomBookingsTable';
import { Plus, Download } from 'lucide-react';

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
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
    // View booking logic handled by the table internal modal for now
    // or we can implement page level modal if needed
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Custom Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage offline and manual booking entries.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gold hover:bg-gold-dark text-white shadow-gold hover:shadow-lg transition-all duration-300">
                <Plus className="w-4 h-4" />
                Add New Booking
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
        </div>

        {/* Edit Modal (Hidden initially) */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Booking Details</DialogTitle>
              <DialogDescription>
                Update information for {selectedBooking?.name}'s booking
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