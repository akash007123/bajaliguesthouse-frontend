import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Users,
  Hash
} from 'lucide-react';

interface CustomBookingFormData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  aadharCard: File | string | null;
  profilePic: File | string | null;
  roomAmount: number;
  numberOfRooms: number;
  numberOfGuests: number;
  roomNo: string;
}

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

interface CustomBookingFormProps {
  booking?: CustomBooking | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CustomBookingForm: React.FC<CustomBookingFormProps> = ({ booking, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CustomBookingFormData>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    aadharCard: null,
    profilePic: null,
    roomAmount: 0,
    numberOfRooms: 1,
    numberOfGuests: 1,
    roomNo: ''
  });

  const isEdit = !!booking;

  useEffect(() => {
    if (booking) {
      setFormData({
        name: booking.name,
        email: booking.email,
        mobile: booking.mobile,
        address: booking.address,
        aadharCard: booking.aadharCard || null,
        profilePic: booking.profilePic || null,
        roomAmount: booking.roomAmount,
        numberOfRooms: booking.numberOfRooms,
        numberOfGuests: booking.numberOfGuests,
        roomNo: booking.roomNo
      });
    } else {
      resetForm();
    }
  }, [booking]);

  const createCustomBookingMutation = useMutation({
    mutationFn: async (data: CustomBookingFormData) => {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'number') {
            formDataToSend.append(key, value.toString());
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/bookings/custom`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to create custom booking');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Custom booking created successfully!');
      resetForm();
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create custom booking');
    }
  });

  const updateCustomBookingMutation = useMutation({
    mutationFn: async (data: CustomBookingFormData) => {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'number') {
            formDataToSend.append(key, value.toString());
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/bookings/custom/${booking!.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to update custom booking');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Custom booking updated successfully!');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to update custom booking');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateCustomBookingMutation.mutate(formData);
    } else {
      createCustomBookingMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof CustomBookingFormData, value: string | number | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'aadharCard' | 'profilePic', file: File | null) => {
    handleChange(field, file);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      address: '',
      aadharCard: null,
      profilePic: null,
      roomAmount: 0,
      numberOfRooms: 1,
      numberOfGuests: 1,
      roomNo: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Customer Information</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Full Name <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter customer's full name"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                Email Address <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="customer@example.com"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mobile" className="text-sm font-medium mb-2 block">
                Mobile Number <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="Enter mobile number"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                Address <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter customer's address"
                  className="pl-10 min-h-32"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="aadharCard" className="text-sm font-medium mb-2 block">
              Aadhar Card Upload
            </Label>
            <div className="relative">
              <Input
                id="aadharCard"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange('aadharCard', e.target.files?.[0] || null)}
                className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
            </div>
            {formData.aadharCard && typeof formData.aadharCard === 'object' && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {(formData.aadharCard as File).name}
              </p>
            )}
            {typeof formData.aadharCard === 'string' && (
              <p className="text-sm text-muted-foreground mt-2">
                Current file: {formData.aadharCard}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="profilePic" className="text-sm font-medium mb-2 block">
              Profile Picture Upload
            </Label>
            <div className="relative">
              <Input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('profilePic', e.target.files?.[0] || null)}
                className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
            </div>
            {formData.profilePic && typeof formData.profilePic === 'object' && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {(formData.profilePic as File).name}
              </p>
            )}
            {typeof formData.profilePic === 'string' && (
              <div className="mt-2">
                <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${formData.profilePic}`} alt="Current profile" className="w-16 h-16 rounded-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Booking Details</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="roomAmount" className="text-sm font-medium mb-2 block">
                Room Amount (₹) <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="roomAmount"
                  type="number"
                  value={formData.roomAmount || ''}
                  onChange={(e) => handleChange('roomAmount', parseInt(e.target.value) || 0)}
                  placeholder="Enter room amount"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="numberOfRooms" className="text-sm font-medium mb-2 block">
                Number of Rooms <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="numberOfRooms"
                  type="number"
                  min="1"
                  value={formData.numberOfRooms}
                  onChange={(e) => handleChange('numberOfRooms', parseInt(e.target.value) || 1)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfGuests" className="text-sm font-medium mb-2 block">
                Number of Guests <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="numberOfGuests"
                  type="number"
                  min="1"
                  value={formData.numberOfGuests}
                  onChange={(e) => handleChange('numberOfGuests', parseInt(e.target.value) || 1)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="roomNo" className="text-sm font-medium mb-2 block">
                Room Number <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="roomNo"
                  value={formData.roomNo}
                  onChange={(e) => handleChange('roomNo', e.target.value)}
                  placeholder="e.g., 101, 201"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            onCancel?.();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          disabled={createCustomBookingMutation.isPending}
        >
          {isEdit ? (updateCustomBookingMutation.isPending ? 'Updating...' : 'Update Booking') : (createCustomBookingMutation.isPending ? 'Creating...' : 'Create Booking')}
        </Button>
      </div>
    </form>
  );
};

export default CustomBookingForm;