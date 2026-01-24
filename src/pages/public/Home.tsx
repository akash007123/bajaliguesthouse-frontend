import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import {
  ArrowRight, Star, Wifi, Coffee, Car, Waves, Utensils,
  Dumbbell, Users, Award, Clock, MapPin, Quote, Calendar,
  ChevronDown, CheckCircle, Map, Phone, Mail, Instagram, Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/common/RoomCard';
import { Room, HotelInfo } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

// Assets
import heroImage from '@/assets/hero-hotel.jpg';
import spaImage from '@/assets/amenity-spa.jpg';
import restaurantImage from '@/assets/amenity-restaurant.jpg';
import deluxeImage from '@/assets/room-deluxe.jpg';
import executiveImage from '@/assets/room-executive.jpg';
import presidentialImage from '@/assets/room-presidential.jpg';

// Types
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

// Data
const amenities = [
  { name: 'Temple Tours', icon: MapPin, description: 'Guided accessibility to Mahakaleshwar & sacred sites.' },
  { name: 'Sattvic Dining', icon: Utensils, description: 'Pure, authentic vegetarian cuisine for the soul.' },
  { name: 'Cultural Evenings', icon: Users, description: 'Experience the rich heritage of Ujjain.' },
  { name: '24/7 Concierge', icon: Clock, description: 'Always here to serve your spiritual journey.' },
];

const whyChooseUs = [
  { title: 'Prime Location', desc: 'Walking distance to Mahakal Corridor.', icon: MapPin },
  { title: 'Luxury Comfort', desc: 'Premium bedding and modern amenities.', icon: Star },
  { title: 'Spiritual Vibe', desc: 'Peaceful ambiance for meditation.', icon: Waves },
  { title: 'Secure Stay', desc: '24/7 security and safe environment.', icon: CheckCircle },
];

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax & Scroll Effects
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Data Fetching
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/rooms`).then(res => res.json())
  });

  const { data: reviews = [] } = useQuery<PopulatedReview[]>({
    queryKey: ['reviews'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/reviews`).then(res => res.json())
  });

  const featuredRooms = rooms.slice(0, 3);

  // Animation Variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInUp3D: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: 20 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-background">

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
          <img
            src={heroImage}
            alt="Shri Balaji Luxury Stay"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="flex gap-1 text-gold">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
              </span>
              <span className="text-xs font-medium text-white/90 tracking-widest uppercase">Premium Hospitality</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1]">
              Sanctuary of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold italic pr-2">Divine Luxury</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 font-light leading-relaxed">
              Experience the perfect harmony of spiritual peace and modern comfort in the heart of Ujjain. Your gateway to Mahakal awaits.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/rooms">
                <Button size="lg" className="h-14 px-8 text-lg bg-gold hover:bg-gold-light text-black font-semibold rounded-full transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  Book Your Stay
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white hover:text-navy rounded-full backdrop-blur-sm">
                  Discover More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Booking Bar (Visual Only for now) */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-4 right-4 max-w-5xl mx-auto z-30 hidden md:block"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xl">
            <div className="flex-1 px-4 border-r border-white/10">
              <p className="text-xs text-gold uppercase tracking-wider mb-1">Check In</p>
              <p className="text-white font-medium">Select Date</p>
            </div>
            <div className="flex-1 px-4 border-r border-white/10">
              <p className="text-xs text-gold uppercase tracking-wider mb-1">Check Out</p>
              <p className="text-white font-medium">Select Date</p>
            </div>
            <div className="flex-1 px-4">
              <p className="text-xs text-gold uppercase tracking-wider mb-1">Guests</p>
              <p className="text-white font-medium">2 Adults</p>
            </div>
            <Link to="/rooms">
              <Button className="bg-gold text-black hover:bg-gold-light font-semibold rounded-xl px-8 py-6">
                Check Availability
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="py-24 bg-background relative overflow-hidden perspective-1000">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span variants={fadeInUp3D} className="text-gold font-medium tracking-[0.2em] text-sm uppercase block mb-4">
                Welcome to Shri Balaji
              </motion.span>
              <motion.h2 variants={fadeInUp3D} className="text-4xl md:text-6xl font-serif text-foreground mb-8 leading-tight">
                Where Tradition Meets <span className="italic text-gold">Modern Elegance</span>
              </motion.h2>
              <motion.p variants={fadeInUp3D} className="text-muted-foreground text-lg leading-relaxed mb-6">
                Nestled in the spiritual capital of India, Shri Balaji Home Stay offers more than just a place to rest. We provide a sanctuary where the ancient spiritual energy of Ujjain blends seamlessly with contemporary luxury.
              </motion.p>
              <motion.p variants={fadeInUp3D} className="text-muted-foreground text-lg leading-relaxed mb-8">
                Whether you are here for the Bhasma Aarti at Mahakaleshwar or a peaceful retreat, our dedicated team ensures every moment of your stay is filled with comfort and warmth.
              </motion.p>

              <motion.div variants={fadeInUp3D} className="grid grid-cols-2 gap-8 mb-10">
                <div className="p-4 border-l-2 border-gold/30">
                  <h3 className="text-4xl font-serif text-gold mb-1">2k+</h3>
                  <p className="text-sm font-medium text-foreground/80">Happy Guests</p>
                </div>
                <div className="p-4 border-l-2 border-gold/30">
                  <h3 className="text-4xl font-serif text-gold mb-1">4.9</h3>
                  <p className="text-sm font-medium text-foreground/80">Average Rating</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp3D}>
                <Link to="/about">
                  <Button variant="link" className="text-gold p-0 text-lg hover:text-gold-dark group">
                    Read Our Story <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.img
                  src={restaurantImage}
                  alt="Dining"
                  className="rounded-2xl w-full h-80 object-cover mt-12 shadow-2xl"
                  whileHover={{ scale: 1.05, translateZ: 20 }}
                />
                <motion.img
                  src={spaImage}
                  alt="Interiors"
                  className="rounded-2xl w-full h-80 object-cover shadow-2xl"
                  whileHover={{ scale: 1.05, translateZ: 20 }}
                />
              </div>
              {/* Decorative Circle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-dashed border-gold/40 rounded-full flex items-center justify-center pointer-events-none"
              >
                <div className="w-32 h-32 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                  <div className="text-center">
                    <span className="block text-3xl font-serif text-gold">15+</span>
                    <span className="text-[10px] uppercase tracking-wider text-foreground">Years</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURED ROOMS --- */}
      <section className="py-24 bg-muted/30 perspective-1000">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold font-medium tracking-[0.2em] text-sm uppercase block mb-3">Accommodations</span>
              <h2 className="text-4xl md:text-5xl font-serif text-navy mb-4">Stay in Comfort</h2>
              <div className="h-1 w-20 bg-gold mx-auto rounded-full mb-6" />
              <p className="text-muted-foreground text-lg">
                Choose from our range of meticulously designed rooms, each offering a unique blend of style and relaxation.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -15, transition: { duration: 0.3 } }}
              >
                <div style={{ transformStyle: "preserve-3d" }}>
                  <RoomCard room={room} index={idx} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/rooms">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white px-10 py-6 text-lg rounded-full transition-all">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- AMENITIES --- */}
      <section className="py-24 bg-navy text-white relative overflow-hidden perspective-1000">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <span className="text-gold font-medium tracking-[0.2em] text-sm uppercase block mb-3">Our Services</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6">Curated for Your Comfort</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Every detail at Shri Balaji is aimed at making your pilgrimage stress-free. From guided temple tours to 24/7 support, we handle the details so you can focus on devotion.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {amenities.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.05, rotateX: 5, z: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <motion.div
                      className="mb-4 inline-block origin-center"
                      whileHover={{ rotateY: 180, transition: { duration: 0.6 } }}
                    >
                      <item.icon className="w-8 h-8 text-gold" />
                    </motion.div>
                    <h4 className="text-lg font-serif mb-2">{item.name}</h4>
                    <p className="text-sm text-white/60">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50, rotateY: -20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-[100px]" />
              <img
                src={heroImage}
                alt="Services"
                className="relative rounded-2xl shadow-2xl border border-white/10 w-full"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white text-navy p-6 rounded-xl shadow-xl max-w-xs hidden md:block"
              >
                <p className="font-serif italic text-lg mb-2">"Service is our highest form of worship."</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gold">- Management</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- LOCATION SECTION --- */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Map Placeholder/Embed */}
            <motion.div
              initial={{ opacity: 0, x: -20, rotateY: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl border border-white/20 group perspective-1000"
            >
              {/* Using an iframe for a real map feel, centered on Ujjain generic or specific if known */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58705.54136979603!2d75.7600!3d23.1793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de0052b5%3A0x7d81a966ce8ae45!2sMahakaleshwar%20Jyotirlinga!5e0!3m2!1sen!2sin!4v1645000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                title="Location Map"
                className="group-hover:filter-none transition-all duration-500"
              />
            </motion.div>

            {/* Location Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp3D} className="text-gold font-medium tracking-[0.2em] text-sm uppercase block mb-3">Location</motion.span>
              <motion.h2 variants={fadeInUp3D} className="text-4xl md:text-5xl font-serif text-navy mb-6">In the Heart of Divinity</motion.h2>
              <motion.p variants={fadeInUp3D} className="text-muted-foreground text-lg leading-relaxed mb-8">
                Shri Balaji Home Stay is strategically located to offer you easy access to Ujjain’s most sacred landmarks while maintaining a peaceful atmosphere away from the crowd.
              </motion.p>

              <motion.div variants={fadeInUp3D} className="space-y-6">
                {[
                  { label: "Mahakaleshwar Temple", distance: "800m", time: "10 min walk" },
                  { label: "Ram Ghat", distance: "1.2 km", time: "15 min walk" },
                  { label: "Ujjain Railway Station", distance: "2.5 km", time: "10 min drive" },
                  { label: "Kal Bhairav Temple", distance: "4 km", time: "15 min drive" }
                ].map((place, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border/60 pb-4 last:border-0 hover:border-gold/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gold w-5 h-5" />
                      <span className="font-serif text-lg text-foreground">{place.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-navy">{place.distance}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{place.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp3D} className="mt-8">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white transition-colors rounded-full px-8">
                  Get Directions
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- REVIEWS SLIDER --- */}
      <section className="py-24 bg-background perspective-1000">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold font-medium tracking-[0.2em] text-sm uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-serif text-navy">Guest Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((review, i) => (
              <motion.div
                key={review.id}
                variants={fadeInUp3D}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, rotateX: 5, z: 20 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-muted/20 p-8 rounded-2xl border border-border/50 relative group hover:shadow-2xl transition-all"
              >
                <Quote className="text-gold/20 w-10 h-10 mb-4" />
                <p className="text-muted-foreground italic mb-6 leading-relaxed">"{review.feedback}"</p>

                <div className="flex items-center gap-4">
                  {review.userId?.profilePicture ? (
                    <img src={review.userId.profilePicture} alt={review.userName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                      {review.userName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground">{review.userName}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, r) => (
                        <Star key={r} size={12} className="text-gold fill-gold" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-navy">Why Choose Shri Balaji?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {whyChooseUs.map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-7 h-7 text-gold group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Setup" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/90 z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif text-white mb-6"
          >
            Ready for a Divine Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/80 text-xl max-w-2xl mx-auto mb-10"
          >
            Book your stay today and let us be a part of your spiritual journey in Ujjain.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/rooms">
              <Button size="lg" className="bg-gold text-black hover:bg-gold-light h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                Start Booking Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
