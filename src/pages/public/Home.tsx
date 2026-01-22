import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Wifi, Coffee, Car, Waves, Utensils, Dumbbell, Users, Award, Clock, MapPin, Quote, Calendar, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/common/RoomCard';
import { Room, HotelInfo, Booking } from '@/types';

interface PopulatedReview {
  id: string;
  userName: string;
  rating: number;
  feedback: string;
  userId?: {
    profilePicture?: string;
    name: string;
  };
}
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import heroImage from '@/assets/hero-hotel.jpg';
import spaImage from '@/assets/amenity-spa.jpg';
import restaurantImage from '@/assets/amenity-restaurant.jpg';
import deluxeImage from '@/assets/room-deluxe.jpg';
import executiveImage from '@/assets/room-executive.jpg';
import presidentialImage from '@/assets/room-presidential.jpg';

const amenities = [
  { name: 'Temple Tours', icon: MapPin, description: 'Guided tours to Mahakaleshwar and other sacred sites' },
  { name: 'Traditional Meals', icon: Utensils, description: 'Authentic Indian cuisine with local specialties' },
  { name: 'Cultural Experiences', icon: Users, description: 'Traditional music, dance, and cultural performances' },
  { name: '24/7 Support', icon: Clock, description: 'Round-the-clock assistance for pilgrims and guests' },
  { name: 'Spiritual Guidance', icon: Award, description: 'Local guides for temple rituals and ceremonies' },
];

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { data: hotelInfo } = useQuery<HotelInfo>({
    queryKey: ['hotelInfo'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/info`).then(res => res.json())
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms`).then(res => res.json())
  });

  const { data: reviews = [] } = useQuery<PopulatedReview[]>({
    queryKey: ['reviews'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/reviews`).then(res => res.json())
  });

  const featuredRooms = rooms.slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10" />
          <img
            src={heroImage}
            alt="Shri Balaji Luxury Stay"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto w-full pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* 5-Star Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <span className="text-white/90 text-sm font-medium tracking-wide uppercase">Premium Hospitality</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Experience Divine <br />
              <span className="text-gold italic">Luxury</span> in Ujjain
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Discover a sanctuary of peace and comfort at Shri Balaji Home Stay.
              Where traditional Indian hospitality meets modern elegance.
            </motion.p>

            {/* Booking Bar - Glassmorphism */}
            <motion.div
              className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, type: "spring", stiffness: 50 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                {/* Check In */}
                <div className="md:col-span-3 bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/20 rounded-lg text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Check In</p>
                      <p className="text-white font-medium">Select Date</p>
                    </div>
                  </div>
                </div>

                {/* Check Out */}
                <div className="md:col-span-3 bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/20 rounded-lg text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Check Out</p>
                      <p className="text-white font-medium">Select Date</p>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="md:col-span-3 bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gold/20 rounded-lg text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Guests</p>
                        <p className="text-white font-medium">2 Adults, 1 Room</p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-3">
                  <Link to="/rooms" className="w-full">
                    <Button className="w-full h-full py-4 text-lg bg-gold hover:bg-gold-light text-black font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                      Check Availability
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-white/50 text-xs uppercase tracking-widest font-light">Scroll Down</span>
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5"
            whileHover={{ borderColor: "rgba(255,255,255,0.8)" }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-gold rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Decorative Blur Elements */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy text-white overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" width="100%" height="100%">
            <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" className="text-white" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>

        <div className="container-hotel relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[
              { icon: Users, value: '2k+', label: 'Happy Pilgrims' },
              { icon: Award, value: '15+', label: 'Years of Service' },
              { icon: Clock, value: '24/7', label: 'Spiritual Support' },
              { icon: MapPin, value: '0km', label: 'From Mahakal' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Vertical Divider for lg screens */}
                {index !== 3 && (
                  <div className="hidden lg:block absolute right-[-1rem] top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                )}

                <motion.div
                  className="mb-6 p-4 rounded-full border border-gold/30 bg-gold/5 group-hover:bg-gold/10 transition-colors duration-500"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <stat.icon className="w-8 h-8 text-gold" />
                </motion.div>

                <motion.div
                  className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tight"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                >
                  {stat.value}
                </motion.div>

                <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="section-padding bg-[#FAFAFA] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container-hotel relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-2xl mx-auto"
          >
            <span className="text-gold uppercase tracking-[0.2em] text-sm font-semibold mb-3 block">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">Curated Facilities</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6" />
            <p className="text-muted-foreground leading-relaxed">
              Designed for your comfort and spiritual peace. Every detail at Shri Balaji Home Stay is crafted to enhance your pilgrimage experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-xl p-8 shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] transition-all duration-300 border border-transparent hover:border-gold/20"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold/5 group-hover:bg-gold/10 flex items-center justify-center transition-colors duration-300">
                  <amenity.icon className="w-8 h-8 text-gold stroke-[1.5]" />
                </div>

                <h3 className="text-xl font-serif font-medium text-navy mb-3 group-hover:text-gold transition-colors">
                  {amenity.name}
                </h3>

                <p className="text-sm text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors">
                  {amenity.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="section-padding bg-white relative">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
          >
            <div className="max-w-2xl">
              <span className="text-gold uppercase tracking-[0.2em] text-sm font-semibold mb-3 block">Accommodations</span>
              <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">Stay in Comfort</h2>
              <div className="w-24 h-1 bg-gold mb-6" />
              <p className="text-muted-foreground leading-relaxed">
                From cozy deluxe rooms to expansive presidential suites, discover the perfect sanctuary for your spiritual retreat.
              </p>
            </div>
            <Link to="/rooms" className="mt-8 md:mt-0 group">
              <Button variant="outline" className="text-gold border-gold/50 hover:bg-gold hover:text-white transition-all duration-300 rounded-full px-8">
                View All Rooms <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-navy relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-navy via-navy-light/20 to-navy opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[100px]" />

        <div className="container-hotel relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold uppercase tracking-[0.2em] text-sm font-semibold mb-3 block">Guest Stories</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Voices of Devotion</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 relative group"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/10 group-hover:text-gold/20 transition-colors" />

                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-gold text-gold' : 'fill-white/20 text-white/20'}`}
                    />
                  ))}
                </div>

                <p className="text-white/80 text-lg font-serif italic mb-8 leading-relaxed">
                  "{review.feedback}"
                </p>

                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  {review.userId?.profilePicture ? (
                    <img
                      src={review.userId.profilePicture}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark text-navy flex items-center justify-center font-bold text-lg shadow-lg">
                      {review.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-white">{review.userName}</h4>
                    <p className="text-sm text-gold/80">Guest</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium mb-2 block">OUR GALLERY</span>
            <h2 className="heading-section text-foreground">A Glimpse of Luxury</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { src: heroImage, alt: 'Hotel Exterior', span: 'md:col-span-2 md:row-span-2' },
              { src: deluxeImage, alt: 'Deluxe Room', span: '' },
              { src: executiveImage, alt: 'Executive Suite', span: '' },
              { src: presidentialImage, alt: 'Presidential Suite', span: '' }
            ].map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${image.span}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="text-white text-center"
                  >
                    <h3 className="font-semibold text-lg">{image.alt}</h3>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-primary">
        <div className="container-hotel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold font-medium mb-2 block">THE EXPERIENCE</span>
              <h2 className="heading-section text-primary-foreground mb-6">
                Experience Luxury Accommodations
              </h2>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                Our luxurious rooms and suites offer a sanctuary of comfort where modern elegance meets personalized service. Immerse yourself in spacious accommodations designed to provide the ultimate relaxation and convenience.
              </p>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                From deluxe rooms to presidential suites, our attentive staff crafts personalized experiences that leave you feeling refreshed and satisfied.
              </p>
              <Link to="/rooms">
                <Button variant="hotel" size="lg">
                  Explore Rooms
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-1 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl shadow-elegant"
                >
                  <img
                    src={deluxeImage}
                    alt="Deluxe Room"
                    className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">Deluxe Room</h3>
                    <p className="text-sm opacity-90">Experience unparalleled comfort</p>
                  </div>
                </motion.div>
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl shadow-elegant"
                  >
                    <img
                      src={executiveImage}
                      alt="Executive Suite"
                      className="w-full h-48 object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold">Executive Suite</h4>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl shadow-elegant"
                  >
                    <img
                      src={presidentialImage}
                      alt="Presidential Suite"
                      className="w-full h-48 object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold">Presidential Suite</h4>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-primary opacity-90" />
        <div className="absolute inset-0">
          {/* Decorative elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-32 h-32 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 w-24 h-24 border border-gold/20 rounded-full"
          />
        </div>
        <div className="container-hotel relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16 md:py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-8"
            >
              <Star className="w-10 h-10 text-gold fill-current" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="heading-section text-white mb-6"
            >
              Ready for Your Ujjain Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Book your stay at Shri Balaji Home Stay and experience the spiritual
              heart of India. Your sacred journey in Ujjain begins here.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              {isAuthenticated ? (
                <Link to="/rooms">
                  <Button variant="hotel" size="lg" className="text-lg px-10 py-4 shadow-gold hover:shadow-xl transition-all duration-300">
                    Book Room
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button variant="hotel" size="lg" className="text-lg px-10 py-4 shadow-gold hover:shadow-xl transition-all duration-300">
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Link to="/contact">
                <Button variant="hotel-outline" size="lg" className="text-lg px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
