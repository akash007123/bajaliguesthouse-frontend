import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Wifi, Coffee, Car, Waves, Utensils, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/common/RoomCard';
import { Room, HotelInfo } from '@/types';
import { useQuery } from '@tanstack/react-query';
import heroImage from '@/assets/hero-hotel.jpg';
import spaImage from '@/assets/amenity-spa.jpg';
import restaurantImage from '@/assets/amenity-restaurant.jpg';

const amenities = [
  { name: 'Free WiFi', icon: Wifi },
  { name: 'Infinity Pool', icon: Waves },
  { name: 'Fine Dining', icon: Utensils },
  { name: 'Fitness Center', icon: Dumbbell },
  { name: 'Room Service', icon: Coffee },
  { name: 'Valet Parking', icon: Car },
];

const Home: React.FC = () => {
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
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Shri Balaji"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-overlay" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-1 text-gold mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </span>
            <h1 className="heading-display text-white mb-6">
              Experience Luxury
              <br />
              <span className="text-gold">Beyond Compare</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {hotelInfo?.description || 'Loading...'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/rooms">
                <Button variant="hotel" size="lg" className="text-lg px-8">
                  Explore Rooms
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="hotel-outline" size="lg" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
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
            <h2 className="heading-section text-foreground">World-Class Facilities</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-6 bg-card rounded-xl shadow-soft text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <amenity.icon className="w-6 h-6 text-gold" />
                </div>
                <span className="text-sm font-medium text-foreground">{amenity.name}</span>
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
                Indulge in Pure Relaxation
              </h2>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                Our world-renowned spa offers a sanctuary of tranquility where ancient healing 
                traditions meet modern wellness practices. Immerse yourself in rejuvenating 
                treatments designed to restore your body, mind, and spirit.
              </p>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                From signature massages to holistic therapies, our expert therapists craft 
                personalized experiences that leave you feeling renewed and revitalized.
              </p>
              <Link to="/contact">
                <Button variant="hotel" size="lg">
                  Book a Treatment
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src={spaImage}
                alt="Spa"
                className="rounded-xl shadow-elegant w-full h-64 object-cover"
              />
              <img
                src={restaurantImage}
                alt="Restaurant"
                className="rounded-xl shadow-elegant w-full h-64 object-cover mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-12 md:p-16 text-center"
          >
            <h2 className="heading-section text-white mb-4">
              Ready to Experience Luxury?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Book your stay at Shri Balaji and discover a world of unparalleled 
              comfort and sophistication.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="hotel" size="lg" className="text-lg px-8">
                  Create Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="hotel-outline" size="lg" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
