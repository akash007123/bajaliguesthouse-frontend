import React, { useState } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { RoomCard } from '@/components/common/RoomCard';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/FormInput';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const roomTypes = ['All', 'Standard', 'Deluxe', 'Executive', 'Presidential', 'Family', 'Honeymoon'];

const Rooms: React.FC = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Number.MAX_SAFE_INTEGER]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const { data: allRooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms`).then(res => res.json()),
    refetchOnMount: true
  });

  console.log(`Fetched ${allRooms.length} rooms`);
  console.log('allRooms:', allRooms);

  const filteredRooms = allRooms.filter((room: Room) => {
    // Normalize type comparison (case-insensitive, allow partial includes)
    const roomType = (room.type ?? '').toString().trim().toLowerCase();
    const selType = selectedType.trim().toLowerCase();
    const matchesType = selType === 'all' || roomType === selType || roomType.includes(selType);

    // Search only when query provided; case-insensitive on name/description
    const q = searchQuery.trim().toLowerCase();
    const name = (room.name ?? '').toString().toLowerCase();
    const desc = (room.description ?? '').toString().toLowerCase();
    const matchesSearch = !q || name.includes(q) || desc.includes(q);

    // Price: parse safely; include room if price missing/invalid
    const rawPrice = room.discountPrice ?? room.price;
    const effectivePrice = Number(rawPrice);
    const hasValidPrice = Number.isFinite(effectivePrice);
    const matchesPrice = !hasValidPrice || (effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1]);

    console.log(`Room ${room.name}: matchesType=${matchesType}, matchesSearch=${matchesSearch}, matchesPrice=${matchesPrice}, effectivePrice=${hasValidPrice ? effectivePrice : 'N/A'}`);
    return matchesType && matchesSearch && matchesPrice;
  });

  console.log('filteredRooms:', filteredRooms);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const SkeletonCard = () => (
    <div className="card-hotel overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <div className="p-6">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );

  const headerSection = (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          style={{ transformStyle: 'preserve-3d', rotateX, y: yBg }}
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
          whileHover={{ rotateY: 5, scale: 1.02 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.span
            className="inline-block text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 px-4 py-1 border border-gold/30 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Accommodations
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            Our Rooms <span className="text-gold italic">&</span> Suites
          </motion.h1>

          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Discover our comfortable homestay rooms in the heart of Ujjain,
            each designed to provide authentic Indian hospitality with modern amenities.
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent opacity-50" />
      </motion.div>
    </section>
  );

  const loadingFiltersAndRooms = (
    <section className="section-padding">
      <div className="container-hotel">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-hotel pl-12"
            />
          </motion.div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showFilters ? 'auto' : window.innerWidth >= 1024 ? 'auto' : 0 }}
          className="overflow-hidden lg:overflow-visible"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-2 mb-8"
          >
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
          </motion.div>
        </motion.div>

        <p className="text-muted-foreground mb-6">Loading rooms...</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </section>
  );

  const normalFiltersAndRooms = (
    <section className="section-padding">
      <div className="container-hotel">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-hotel pl-12"
            />
          </motion.div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showFilters ? 'auto' : window.innerWidth >= 1024 ? 'auto' : 0 }}
          className="overflow-hidden lg:overflow-visible"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-2 mb-8"
          >
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
          </motion.div>
        </motion.div>

        <p className="text-muted-foreground mb-6">
          Showing {filteredRooms.length} rooms
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ perspective: '1000px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredRooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} variants={itemVariants} />
          ))}
        </motion.div>

        {filteredRooms.length === 0 && (
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
  );

  return (
    <div>
      {headerSection}
      {isLoading ? loadingFiltersAndRooms : normalFiltersAndRooms}
    </div>
  );
};

export default Rooms;
