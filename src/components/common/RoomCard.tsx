import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Maximize, Snowflake, Tag } from 'lucide-react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';

interface RoomCardProps {
  room: Room;
  index?: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, index = 0 }) => {
  const hasDiscount = room.discountPrice && room.discountPrice < room.price;
  const discountPercentage = hasDiscount
    ? Math.round(((room.price - room.discountPrice!) / room.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-hotel overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {discountPercentage}% OFF
          </div>
        )}
        {!room.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">{room.type}</span>
          {room.isAC && (
            <span className="flex items-center gap-1 text-xs">
              <Snowflake className="w-3 h-3" /> AC
            </span>
          )}
        </div>

        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{room.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{room.shortDescription}</p>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {room.capacity} Guests
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-4 h-4" /> {room.size} sq ft
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gold">${room.discountPrice}</span>
                <span className="text-sm text-muted-foreground line-through">${room.price}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gold">${room.price}</span>
            )}
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <Link to={`/rooms/${room.id}`}>
            <Button variant="hotel" size="sm" disabled={!room.available}>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
