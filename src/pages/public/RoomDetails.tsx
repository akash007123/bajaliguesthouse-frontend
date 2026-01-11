import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Maximize,
  Snowflake,
  Bed,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: room, isLoading, error } = useQuery({
    queryKey: ['room', id],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms/${id}`).then(res => {
      if (!res.ok) throw new Error('Room not found');
      return res.json();
    }),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
          <Link to="/rooms">
            <Button variant="hotel">Back to Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = room.discountPrice && room.discountPrice < room.price;
  const effectivePrice = room.discountPrice || room.price;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${room.id}` } });
    } else if (user?.role === 'user') {
      navigate('/user/dashboard/book', { state: { selectedRoom: room } });
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="container-hotel">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-hotel">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="relative rounded-xl overflow-hidden mb-8">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={room.images[currentImageIndex]}
                  alt={room.name}
                  className="w-full aspect-[16/10] object-cover"
                />
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === 0 ? room.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === room.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium">
                    Save ₹{room.price - room.discountPrice!}
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="bg-muted px-3 py-1 rounded text-xs font-medium">{room.type}</span>
                </div>
                <h1 className="heading-section text-foreground mb-4">{room.name}</h1>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold" />
                    <span className="text-foreground">{room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-gold" />
                    <span className="text-foreground">{room.bedType} Bed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-gold" />
                    <span className="text-foreground">{room.size} sq ft</span>
                  </div>
                  {room.isAC && (
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-5 h-5 text-gold" />
                      <span className="text-foreground">Air Conditioned</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif font-semibold mb-4">About This Room</h2>
                  <p className="text-muted-foreground leading-relaxed">{room.description}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-xl font-serif font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-gold" />
                        </div>
                        <span className="text-foreground text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <div className="mb-6">
                  {hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gold">₹{room.discountPrice}</span>
                      <span className="text-lg text-muted-foreground line-through">₹{room.price}</span>
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gold">₹{room.price}</span>
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-5 h-5 text-gold" />
                      <span className="font-medium">Flexible Booking</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Free cancellation up to 24 hours before check-in
                    </p>
                  </div>
                </div>

                {room.available ? (
                  <Button
                    variant="hotel"
                    size="lg"
                    className="w-full"
                    onClick={handleBookNow}
                  >
                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" className="w-full" disabled>
                    Not Available
                  </Button>
                )}

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Taxes and fees calculated at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetails;
