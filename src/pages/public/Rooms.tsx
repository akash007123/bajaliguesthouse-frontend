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
      <section className="bg-primary py-20 md:py-28">
        <div className="container-hotel text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold font-medium mb-2 block">ACCOMMODATIONS</span>
            <h1 className="heading-display text-primary-foreground mb-4">
              Our Rooms & Suites
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Discover our collection of luxuriously appointed rooms and suites, 
              each designed to provide the ultimate in comfort and elegance.
            </p>
          </motion.div>
        </div>
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedType === type
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
