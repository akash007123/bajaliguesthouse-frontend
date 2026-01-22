import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { RoomCard } from '@/components/common/RoomCard';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/FormInput';
import { useQuery } from '@tanstack/react-query';

const roomTypes = ['All', 'Standard', 'Deluxe', 'Executive', 'Presidential'];

const Rooms: React.FC = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: allRooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms`).then(res => res.json())
  });

  const filteredRooms = allRooms.filter((room: Room) => {
    const matchesType = selectedType === 'All' || room.type === selectedType;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const effectivePrice = room.discountPrice || room.price;
    const matchesPrice = effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
    return matchesType && matchesSearch && matchesPrice;
  });

  return (
    <div>
      {/* Header */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/80 z-10" />
            <img
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury Room Interior"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container-hotel relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 px-4 py-1 border border-gold/30 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Accommodations
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
              Our Rooms <span className="text-gold italic">&</span> Suites
            </h1>

            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Discover our comfortable homestay rooms in the heart of Ujjain,
              each designed to provide authentic Indian hospitality with modern amenities.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent opacity-50" />
        </motion.div>
      </section>

      {/* Filters & Rooms */}
      <section className="section-padding">
        <div className="container-hotel">
          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-hotel pl-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Tags */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : window.innerWidth >= 1024 ? 'auto' : 0 }}
            className="overflow-hidden lg:overflow-visible"
          >
            <div className="flex flex-wrap gap-2 mb-8">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedType === type
                      ? 'bg-gold text-white'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Showing {filteredRooms.length} rooms
          </p>

          {/* Rooms Grid */}
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room, index) => (
                <RoomCard key={room.id} room={room} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No rooms match your criteria.</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedType('All');
                  setSearchQuery('');
                }}
                className="mt-4 text-gold"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
