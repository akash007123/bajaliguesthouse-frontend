import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Wifi, Coffee, Car, Waves, Utensils, Dumbbell, Users, Award, Clock, MapPin, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/common/RoomCard';
import { Room, HotelInfo } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import heroImage from '@/assets/hero-hotel.jpg';
import spaImage from '@/assets/amenity-spa.jpg';
import restaurantImage from '@/assets/amenity-restaurant.jpg';
import deluxeImage from '@/assets/room-deluxe.jpg';
import executiveImage from '@/assets/room-executive.jpg';
import presidentialImage from '@/assets/room-presidential.jpg';

const amenities = [
  { name: 'Free WiFi', icon: Wifi, description: 'High-speed internet throughout the property' },
  { name: 'Room Service', icon: Coffee, description: '24/7 in-room dining service' },
  { name: 'Valet Parking', icon: Car, description: 'Complimentary secure parking' },
  { name: '24/7 Concierge', icon: Clock, description: 'Round-the-clock assistance for all your needs' },
  { name: 'Prime Location', icon: MapPin, description: 'Conveniently located in the heart of the city' },
];

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const { data: hotelInfo } = useQuery<HotelInfo>({
    queryKey: ['hotelInfo'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/info`).then(res => res.json())
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms`).then(res => res.json())
  });

  const featuredRooms = rooms.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={heroImage}
            alt="Shri Balaji"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          {/* Floating elements for luxury feel */}
          <motion.div
            className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full opacity-60"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.div
            className="absolute top-32 right-20 w-1 h-1 bg-gold rounded-full opacity-40"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: 1 }}
          />
          <motion.div
            className="absolute bottom-40 left-1/4 w-3 h-3 bg-gold rounded-full opacity-50"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              className="inline-flex items-center gap-1 text-gold mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Star className="w-5 h-5 fill-current" />
                </motion.div>
              ))}
            </motion.span>
            <motion.h1
              className="heading-display text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Experience Luxury
              <br />
              <span className="text-gold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Beyond Compare
              </span>
            </motion.h1>
            <motion.p
              className="text-white/90 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {hotelInfo?.description || 'Discover unparalleled elegance and comfort at Shri Balaji, where every moment is crafted for your indulgence.'}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <Link to="/rooms">
                <Button variant="hotel" size="lg" className="text-lg px-10 py-4 shadow-gold hover:shadow-xl transition-all duration-300">
                  Explore Rooms
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="hotel-outline" size="lg" className="text-lg px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            className="w-8 h-12 border-2 border-white/60 rounded-full flex items-start justify-center p-3 cursor-pointer hover:border-white transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-navy to-navy-light">
        <div className="container-hotel">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '5000+', label: 'Happy Guests', color: 'text-gold' },
              { icon: Award, value: '15+', label: 'Years of Excellence', color: 'text-gold' },
              { icon: Clock, value: '24/7', label: 'Concierge Service', color: 'text-gold' },
              { icon: MapPin, value: 'Prime', label: 'Location', color: 'text-gold' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </motion.div>
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-white/80 text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="section-padding bg-muted">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold font-medium mb-2 block">OUR AMENITIES</span>
            <h2 className="heading-section text-foreground">Facilities</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden bg-card rounded-2xl shadow-soft hover:shadow-elegant text-center p-8 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <amenity.icon className="w-7 h-7 text-gold" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                  {amenity.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {amenity.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="section-padding">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <span className="text-gold font-medium mb-2 block">ACCOMMODATIONS</span>
              <h2 className="heading-section text-foreground">Featured Rooms & Suites</h2>
            </div>
            <Link to="/rooms" className="mt-4 md:mt-0">
              <Button variant="ghost" className="text-gold hover:text-gold-dark">
                View All Rooms <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium mb-2 block">GUEST REVIEWS</span>
            <h2 className="heading-section text-foreground">What Our Guests Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Business Traveler',
                rating: 5,
                text: 'An absolutely exceptional experience. The attention to detail and personalized service made our stay unforgettable.',
                avatar: 'SJ'
              },
              {
                name: 'Michael Chen',
                role: 'Family Vacation',
                rating: 5,
                text: 'Perfect for families! The rooms were spacious, staff was amazing, and the amenities exceeded our expectations.',
                avatar: 'MC'
              },
              {
                name: 'Emma Rodriguez',
                role: 'Honeymoon',
                rating: 5,
                text: 'Our honeymoon was magical thanks to Shri Balaji. Every moment was perfect, from the romantic dinner to the spa treatments.',
                avatar: 'ER'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elegant transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-gold mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
              Ready to Experience Luxury?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Book your stay at Shri Balaji and discover a world of unparalleled
              comfort and sophistication. Your journey to luxury begins here.
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
