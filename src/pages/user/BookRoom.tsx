import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { CalendarDays, Users, Star, MapPin, DollarSign, Bed, Clock, Shield, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
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
  const maxCheckIn = checkOut ? new Date(checkOut).toISOString().split('T')[0] : undefined;

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
      <div className="space-y-8">
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
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Book Your Stay
        </h1>
        <p className="text-muted-foreground text-lg">Reserve your perfect room for a memorable experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-amber-500" />
                Booking Details
              </CardTitle>
              <CardDescription>Fill in your booking information below</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Room Selection */}
                <div className="space-y-2">
                  <Label htmlFor="roomId" className="flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    Select Room <span className="text-rose-500">*</span>
                  </Label>
                  <Select 
                    value={roomId} 
                    onValueChange={(value) => setValue('roomId', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a room..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{option.room.name}</span>
                              <span className="text-xs text-muted-foreground">{option.room.type}</span>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              ₹{option.room.discountPrice || option.room.price}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roomId && (
                    <p className="text-sm text-rose-500">{errors.roomId.message}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Check-in Date <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="checkIn"
                        type="date"
                        className="h-12 pl-10"
                        min={today}
                        {...register('checkIn')}
                      />
                    </div>
                    {errors.checkIn && (
                      <p className="text-sm text-rose-500">{errors.checkIn.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkOut" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Check-out Date <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="checkOut"
                        type="date"
                        className="h-12 pl-10"
                        min={checkIn || today}
                        {...register('checkOut')}
                      />
                    </div>
                    {errors.checkOut && (
                      <p className="text-sm text-rose-500">{errors.checkOut.message}</p>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Number of Guests <span className="text-rose-500">*</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setValue('guests', Math.max(1, parseInt(guests || '1') - 1).toString())}
                      className="h-12 w-12"
                    >
                      <span className="text-xl">-</span>
                    </Button>
                    <div className="flex-1 text-center">
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max={selectedRoomDetails?.capacity || 6}
                        className="h-12 text-center text-lg font-semibold"
                        {...register('guests')}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Max: {selectedRoomDetails?.capacity || 6} guests
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setValue('guests', Math.min(selectedRoomDetails?.capacity || 6, parseInt(guests || '1') + 1).toString())}
                      className="h-12 w-12"
                    >
                      <span className="text-xl">+</span>
                    </Button>
                  </div>
                  {errors.guests && (
                    <p className="text-sm text-rose-500">{errors.guests.message}</p>
                  )}
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequests" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Special Requests
                  </Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requirements, preferences, or notes for your stay..."
                    className="min-h-32"
                    {...register('specialRequests')}
                  />
                </div>

                {/* Terms & Conditions */}
                <Alert className="bg-amber-500/10 border-amber-500/20">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <AlertDescription className="text-sm text-amber-700 dark:text-amber-300">
                    By booking, you agree to our cancellation policy: Free cancellation up to 48 hours before check-in.
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Room Details & Summary */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Selected Room Card */}
          {selectedRoomDetails ? (
            <Card className="border-border/50 shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                {selectedRoomDetails.images && selectedRoomDetails.images.length > 0 ? (
                  <img
                    src={selectedRoomDetails.images[0]}
                    alt={selectedRoomDetails.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bed className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                <Badge className="absolute top-3 right-3 bg-emerald-500 hover:bg-emerald-600">
                  Available
                </Badge>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedRoomDetails.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {selectedRoomDetails.type} Room
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {selectedRoomDetails.discountPrice ? (
                        <>
                          <span className="text-muted-foreground line-through text-sm">
                            ₹{selectedRoomDetails.price}
                          </span>
                          <span className="text-2xl font-bold text-amber-500">
                            ₹{selectedRoomDetails.discountPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-amber-500">
                          ₹{selectedRoomDetails.price}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedRoomDetails.capacity || 2} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedRoomDetails.bedType || 'King Bed'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedRoomDetails.size || 400} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">4.8 Rating</span>
                  </div>
                </div>
                
                {selectedRoomDetails.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedRoomDetails.description}
                  </p>
                )}
                
                {selectedRoomDetails.amenities && selectedRoomDetails.amenities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Amenities Included</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoomDetails.amenities.slice(0, 4).map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {selectedRoomDetails.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedRoomDetails.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
                <CardDescription>Select a room to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bed className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Choose a room from the dropdown to see details</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Summary */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRoomDetails ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room</span>
                      <span className="font-medium">{selectedRoomDetails.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">
                        {checkIn ? formatDate(checkIn) : 'Select date'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium">
                        {checkOut ? formatDate(checkOut) : 'Select date'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {totalNights} night{totalNights !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-medium">{guests} guest{guests !== '1' ? 's' : ''}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per night</span>
                      <div className="flex items-center gap-2">
                        {selectedRoomDetails.discountPrice ? (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{selectedRoomDetails.price}
                            </span>
                            <span className="font-bold text-amber-500">
                              ₹{selectedRoomDetails.discountPrice}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">₹{selectedRoomDetails.price}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-emerald-500">
                        {selectedRoomDetails.discountPrice 
                          ? `₹${selectedRoomDetails.price - selectedRoomDetails.discountPrice} off`
                          : 'None'
                        }
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-amber-500">₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Taxes and fees included
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Select a room to view pricing details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Shield className="w-4 h-4 text-blue-500" />
            <AlertDescription className="text-sm">
              Need help? Contact our support team at akashraikwar763@gmail.com or call +91 96855 33878
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookRoom;