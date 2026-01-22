import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Star, MapPin, DollarSign, Bed, Clock, Shield, Calendar, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '../../utils/common';

const bookingSchema = z.object({
  roomId: z.string().min(1, 'Please select a room'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.string().min(1, 'Number of guests is required'),
  specialRequests: z.string().optional(),
}).refine(
  (data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  },
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  }
);

type BookingFormData = z.infer<typeof bookingSchema>;

const BookRoom: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(null);
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms`).then(res => res.json())
  });

  const selectedRoom = (location.state as { selectedRoom?: Room })?.selectedRoom;

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomId: selectedRoom?.id || '',
      guests: '1'
    },
  });

  const roomId = watch('roomId');
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const guests = watch('guests');

  useEffect(() => {
    if (roomId) {
      const room = rooms.find(r => r.id === roomId);
      setSelectedRoomDetails(room || null);
    }
  }, [roomId, rooms]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const timeDiff = end.getTime() - start.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setTotalNights(nights > 0 ? nights : 0);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (selectedRoomDetails && totalNights > 0) {
      const price = selectedRoomDetails.discountPrice || selectedRoomDetails.price;
      setTotalPrice(price * totalNights);
    } else {
      setTotalPrice(0);
    }
  }, [selectedRoomDetails, totalNights]);

  const roomOptions = rooms
    .filter(r => r.available)
    .map(r => ({
      value: r.id,
      label: `${r.name} - ₹${r.discountPrice || r.price}/night`,
      room: r
    }));

  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[600px] rounded-xl" />
          <Skeleton className="h-[600px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-navy-900">
          Book Your <span className="text-gold-600">Luxury Stay</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Experience comfort and elegance. Choose your perfect room and let us take care of the rest.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Booking Form */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-navy-900/5 border-b border-navy-900/10 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-serif text-navy-900">
                <div className="p-2 bg-gold-100 rounded-lg text-gold-600">
                  <CalendarDays className="w-6 h-6" />
                </div>
                Booking Details
              </CardTitle>
              <CardDescription className="text-base">
                Please fill in your reservation information below
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Room Selection */}
                <div className="space-y-2">
                  <Label htmlFor="roomId" className="flex items-center gap-2 font-medium text-navy-900">
                    <Bed className="w-4 h-4 text-gold-500" />
                    Select Room <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={roomId}
                    onValueChange={(value) => setValue('roomId', value)}
                  >
                    <SelectTrigger className="h-14 bg-white/50 border-gold-200 focus:ring-gold-500/20 focus:border-gold-500 transition-all">
                      <SelectValue placeholder="Choose your sanctuary..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="py-3">
                          <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex flex-col">
                              <span className="font-serif font-medium text-navy-900">{option.room.name}</span>
                              <span className="text-xs text-muted-foreground">{option.room.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {option.room.discountPrice && (
                                <span className="text-xs line-through text-muted-foreground">₹{option.room.price}</span>
                              )}
                              <Badge variant="outline" className="ml-2 border-gold-200 text-gold-700 bg-gold-50">
                                ₹{option.room.discountPrice || option.room.price}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roomId && (
                    <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.roomId.message}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn" className="flex items-center gap-2 font-medium text-navy-900">
                      <Calendar className="w-4 h-4 text-gold-500" />
                      Check-in Date <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gold-500" />
                      </div>
                      <Input
                        id="checkIn"
                        type="date"
                        className="h-14 pl-10 bg-white/50 border-gold-200 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                        min={today}
                        {...register('checkIn')}
                      />
                    </div>
                    {errors.checkIn && (
                      <p className="text-sm text-rose-500 mt-1">{errors.checkIn.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkOut" className="flex items-center gap-2 font-medium text-navy-900">
                      <Calendar className="w-4 h-4 text-gold-500" />
                      Check-out Date <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gold-500" />
                      </div>
                      <Input
                        id="checkOut"
                        type="date"
                        className="h-14 pl-10 bg-white/50 border-gold-200 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium"
                        min={checkIn || today}
                        {...register('checkOut')}
                      />
                    </div>
                    {errors.checkOut && (
                      <p className="text-sm text-rose-500 mt-1">{errors.checkOut.message}</p>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center gap-2 font-medium text-navy-900">
                    <Users className="w-4 h-4 text-gold-500" />
                    Number of Guests <span className="text-rose-500">*</span>
                  </Label>
                  <div className="flex items-center gap-3 p-1 bg-white/50 border border-gold-200 rounded-lg">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setValue('guests', Math.max(1, parseInt(guests || '1') - 1).toString())}
                      className="h-12 w-12 hover:bg-gold-50 text-navy-700"
                    >
                      <span className="text-xl font-medium">-</span>
                    </Button>
                    <div className="flex-1 text-center border-l border-r border-gold-100">
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max={selectedRoomDetails?.capacity || 6}
                        className="h-12 text-center text-lg font-semibold border-none bg-transparent focus-visible:ring-0"
                        {...register('guests')}
                      />
                      <p className="text-xs text-muted-foreground -mt-2 pb-1">
                        Max: {selectedRoomDetails?.capacity || 6} guests
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setValue('guests', Math.min(selectedRoomDetails?.capacity || 6, parseInt(guests || '1') + 1).toString())}
                      className="h-12 w-12 hover:bg-gold-50 text-navy-700"
                    >
                      <span className="text-xl font-medium">+</span>
                    </Button>
                  </div>
                  {errors.guests && (
                    <p className="text-sm text-rose-500 mt-1">{errors.guests.message}</p>
                  )}
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequests" className="flex items-center gap-2 font-medium text-navy-900">
                    <MessageSquare className="w-4 h-4 text-gold-500" />
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="E.g., late check-in, extra pillows, dietary requirements..."
                    className="min-h-32 bg-white/50 border-gold-200 focus:ring-gold-500/20 focus:border-gold-500 resize-none"
                    {...register('specialRequests')}
                  />
                </div>

                {/* Terms of Service */}
                <div className="bg-gold-50/50 border border-gold-200/50 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    By confirming this booking, you agree to our policies. Free cancellation is available up to 48 hours before your check-in date.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-medium gap-2 btn-gold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Reservation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Room Details & Summary */}
        <motion.div variants={itemVariants} className="space-y-6 lg:sticky lg:top-8">
          {/* Selected Room Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gold-100">
            {selectedRoomDetails ? (
              <>
                <div className="relative h-64 overflow-hidden group">
                  {selectedRoomDetails.images && selectedRoomDetails.images.length > 0 ? (
                    <img
                      src={selectedRoomDetails.images[0]}
                      alt={selectedRoomDetails.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Bed className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none shadow-lg px-3 py-1 text-sm">
                      Available Now
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-serif font-bold">{selectedRoomDetails.name}</h3>
                    <p className="text-white/90 flex items-center gap-1.5 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedRoomDetails.type} Suite
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  {/* Price Block */}
                  <div className="flex items-end justify-between mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Price per night</p>
                      <div className="flex items-baseline gap-2">
                        {selectedRoomDetails.discountPrice ? (
                          <>
                            <span className="text-3xl font-bold text-navy-900">
                              ₹{selectedRoomDetails.discountPrice.toLocaleString()}
                            </span>
                            <span className="text-lg text-muted-foreground line-through decoration-rose-500/50">
                              ₹{selectedRoomDetails.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-navy-900">
                            ₹{selectedRoomDetails.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedRoomDetails.discountPrice && (
                      <Badge variant="secondary" className="bg-rose-100 text-rose-600 border-rose-200">
                        {Math.round(((selectedRoomDetails.price - selectedRoomDetails.discountPrice) / selectedRoomDetails.price) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Amenities Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-gold-500" />
                      <span>Up to {selectedRoomDetails.capacity || 2} Guests</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Bed className="w-4 h-4 text-gold-500" />
                      <span>{selectedRoomDetails.bedType || 'King Bed'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-gold-500" />
                      <span>{selectedRoomDetails.size || 400} sqft</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-gold-500" />
                      <span>4.8/5 Rating</span>
                    </div>
                  </div>

                  {selectedRoomDetails.description && (
                    <div className="bg-slate-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {selectedRoomDetails.description}
                      </p>
                    </div>
                  )}

                  {selectedRoomDetails.amenities && selectedRoomDetails.amenities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-navy-900 mb-3 uppercase tracking-wider text-xs">Room Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoomDetails.amenities.slice(0, 5).map((amenity, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-gold-50 text-gold-700 text-xs border border-gold-100">
                            {amenity}
                          </span>
                        ))}
                        {selectedRoomDetails.amenities.length > 5 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs">
                            +{selectedRoomDetails.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center bg-slate-50/50">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <Bed className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-serif font-bold text-navy-900 mb-2">No Room Selected</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Please select a room from the form on the left to view its details and amenities.
                </p>
              </div>
            )}
          </div>

          {/* Booking Summary - Only show if room is selected */}
          <AnimatePresence>
            {selectedRoomDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-card border-none shadow-lg">
                  <CardHeader className="pb-4 border-b border-gold-100/50">
                    <CardTitle className="text-lg font-serif text-navy-900">Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-navy-900">
                          {totalNights} night{totalNights !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guests</span>
                        <span className="font-medium text-navy-900">{guests} guest{guests !== '1' ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate per night</span>
                        <span className="font-medium text-navy-900">
                          ₹{(selectedRoomDetails.discountPrice || selectedRoomDetails.price).toLocaleString()}
                        </span>
                      </div>

                      {selectedRoomDetails.discountPrice && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Total Savings</span>
                          <span className="font-medium">
                            -₹{((selectedRoomDetails.price - selectedRoomDetails.discountPrice) * totalNights).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <Separator className="bg-gold-100" />

                      <div className="flex justify-between items-end pt-2">
                        <span className="font-serif font-bold text-lg text-navy-900">Total Payable</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gold-600">₹{totalPrice.toLocaleString()}</span>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Includes all taxes</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Support Info */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3 items-center">
            <div className="p-2 bg-blue-100 rounded-full shrink-0">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Need immediate assistance?</p>
              <p className="text-xs text-blue-700">Call us at <span className="font-semibold">+91 96855 33878</span> for booking help.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookRoom;