import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Room } from '@/types';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const bookingSchema = z.object({
  roomId: z.string().min(1, 'Please select a room'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.string().min(1, 'Number of guests is required'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookRoom: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms`).then(res => res.json())
  });
  const selectedRoom = (location.state as { selectedRoom?: Room })?.selectedRoom;

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { roomId: selectedRoom?.id || '' },
  });

  const roomOptions = rooms.filter(r => r.available).map(r => ({
    value: r.id,
    label: `${r.name} - $${r.discountPrice || r.price}/night`
  }));

  const onSubmit = async (data: BookingFormData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          roomId: data.roomId,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: parseInt(data.guests),
          specialRequests: data.specialRequests
        })
      });
      if (response.ok) {
        toast.success('Booking submitted successfully! Awaiting approval.');
        navigate('/user/dashboard/history');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to create booking');
      }
    } catch (error) {
      toast.error('Error creating booking');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Book a Room</h1>
      <div className="bg-card rounded-xl border border-border p-8 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormSelect label="Select Room" options={roomOptions} error={errors.roomId?.message} {...register('roomId')} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Check-in Date" type="date" error={errors.checkIn?.message} {...register('checkIn')} required />
            <FormInput label="Check-out Date" type="date" error={errors.checkOut?.message} {...register('checkOut')} required />
          </div>
          <FormInput label="Number of Guests" type="number" min="1" max="6" error={errors.guests?.message} {...register('guests')} required />
          <FormTextarea label="Special Requests" placeholder="Any special requirements..." {...register('specialRequests')} />
          <Button type="submit" variant="hotel" size="lg">Confirm Booking</Button>
        </form>
      </div>
    </div>
  );
};

export default BookRoom;
