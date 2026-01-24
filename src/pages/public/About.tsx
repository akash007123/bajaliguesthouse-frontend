import React, { useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  Star,
  MapPin,
  CheckCircle,
  Settings,
  Globe,
  ShieldCheck,
  Mountain,
  Users,
  Award,
  Clock,
  ArrowRight,
  Utensils,
  ChevronDown,
  ChevronUp,
  Instagram,
  Linkedin,
  Twitter,
  Plus,
  Landmark,
  Waves,
  Leaf,
  Heart,
  Recycle,
  Coffee,
  Camera
} from 'lucide-react';
import heroImage from '@/assets/hero-hotel.jpg';
import restaurantImage from '@/assets/amenity-restaurant.jpg';

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
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

const About: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-background overflow-hidden">

      {/* 1. Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: "easeOut" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury Hotel"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container-hotel relative z-20 text-center text-white">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-1 border border-gold/50 rounded-full bg-black/20 backdrop-blur-sm text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-semibold">
                Hotel & Resort
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-tight">
              Crafting Unforgettable <br />
              <span className="text-gold italic font-light relative">
                Stays
                <svg className="absolute -bottom-2 w-full h-3 text-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
              Discover the perfect blend of traditional Indian hospitality and modern luxury
              in the heart of the sacred city.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* 2. Stats Bar */}
      <div className="bg-gold/5 border-b border-gold/10 relative z-30 -mt-20 mx-4 md:mx-auto max-w-6xl rounded-t-xl md:rounded-xl backdrop-blur-md shadow-lg">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gold/10">
          {[
            { label: "Guest Satisfaction", value: "4.9/5", icon: Star },
            { label: "Years Experience", value: "10+", icon: Award },
            { label: "Luxury Rooms", value: "25+", icon: Settings },
            { label: "Support", value: "24/7", icon: Clock },
          ].map((stat, idx) => (
            <div key={idx} className="p-6 md:p-8 text-center group hover:bg-white/5 transition-colors">
              <stat.icon className="w-6 h-6 text-gold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-muted-foreground text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Intro & Features with Numbering */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container-hotel">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-gold font-medium mb-4 block tracking-widest text-sm">WHY CHOOSE US</span>
            <h2 className="heading-section mb-6">
              Experience Comfort & Convenience <br />
              <span className="text-gold italic font-serif">Your Perfect Accommodation Awaits</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We go above and beyond to ensure your stay is not just comfortable, but truly memorable.
              Every detail is curated to provide you with a sanctuary of peace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Flexible Search",
                desc: "Explore rooms tailored to your specific spiritual and travel needs with ease.",
              },
              {
                icon: ShieldCheck,
                title: "Trusted Listings",
                desc: "Verified accommodations ensuring safety, hygiene, and authentic hospitality.",
              },
              {
                icon: Mountain,
                title: "Beautiful View",
                desc: "Rooms offering serene views of the temple and the vibrant city life.",
              },
              {
                icon: Users,
                title: "Family Friendly",
                desc: "Spacious suites designed to comfortably accommodate large families.",
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative p-8 rounded-2xl border border-border/50 bg-white/50 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <span className="absolute -top-4 -right-4 text-9xl font-serif font-bold text-foreground/5 opacity-50 z-0 group-hover:text-gold/10 transition-colors pointer-events-none select-none">
                  0{index + 1}
                </span>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold duration-500">
                    <item.icon className="w-8 h-8 text-gold group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-4 text-foreground group-hover:text-gold transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Journey (Timeline) */}
      <section className="section-padding bg-muted/20">
        <div className="container-hotel">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-gold font-medium mb-2 block tracking-widest text-sm">OUR LEGACY</span>
            <h2 className="heading-section">A Decade of Devotion</h2>
          </motion.div>

          <div className="relative">
            {/* Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gold/20 -translate-x-1/2" />

            {[
              { year: "2014", title: "Inception", desc: "Started with a humble vision to serve pilgrims." },
              { year: "2018", title: "Expansion", desc: "Added 25 new luxury suites to accommodate more guests." },
              { year: "2021", title: "Renovation", desc: "Complete modernization while preserving traditional aesthetics." },
              { year: "2024", title: "Excellence", desc: "Recognized as the top pilgrim stay in Ujjain." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 text-center ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <h3 className="text-4xl text-gold font-serif font-bold mb-2">{item.year}</h3>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-muted-foreground max-w-xs mx-auto md:mx-0">{item.desc}</p>
                </div>

                <div className="w-4 h-4 rounded-full bg-gold shrink-0 relative z-10 box-content border-4 border-white shadow-lg" />

                <div className="flex-1" /> {/* Spacer */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Conscious Hospitality (NEW) */}
      <section className="section-padding bg-background">
        <div className="container-hotel">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold font-medium mb-2 block tracking-widest text-sm">SUSTAINABILITY</span>
              <h2 className="heading-section mb-6">Conscious Hospitality</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe in serving our guests while protecting our sacred environment.
                Our commitment to sustainability is woven into every aspect of our operations.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Leaf, title: "Eco-Conscious", desc: "Reducing plastic use and conserving water." },
                  { icon: Heart, title: "Community First", desc: "Supporting local artisans and staff." },
                  { icon: Recycle, title: "Heritage Preservation", desc: "Maintaining traditional architecture." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 bg-muted rounded-2xl p-8 md:p-12 relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-2xl font-serif font-bold mb-4">"Service to man is service to God."</h3>
              <p className="text-muted-foreground italic mb-6">
                - Swami Vivekananda
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-xl text-center">
                  <span className="block text-3xl font-bold text-green-600 mb-1">100%</span>
                  <span className="text-xs text-muted-foreground uppercase">Waste Recycled</span>
                </div>
                <div className="bg-background p-4 rounded-xl text-center">
                  <span className="block text-3xl font-bold text-green-600 mb-1">Local</span>
                  <span className="text-xs text-muted-foreground uppercase">Sourced Food</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Parallax Banner */}
      <section className="relative py-40 bg-fixed bg-center bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-navy/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="container-hotel relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold font-medium mb-4 block tracking-widest text-sm uppercase">Discover Ujjain</span>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
              Unleash Your Inner <br /> <span className="italic text-gold">Explorer</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button className="bg-gold hover:bg-white hover:text-navy text-white px-10 py-4 rounded-full uppercase tracking-wider text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-gold/20">
                Book Your Stay
              </button>
              <button className="px-10 py-4 rounded-full uppercase tracking-wider text-sm font-bold text-white border border-white/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                View Gallery
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. Explore Ujjain */}
      <section className="section-padding bg-background">
        <div className="container-hotel">
          <div className="text-center mb-16">
            <span className="text-gold font-medium mb-2 block tracking-widest text-sm">NEARBY ATTRACTIONS</span>
            <h2 className="heading-section">Explore the Divine City</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Landmark,
                title: "Mahakaleshwar Temple",
                dist: "1.5 km away",
                desc: "One of the twelve Jyotirlingas, the most sacred abode of Lord Shiva."
              },
              {
                icon: Waves,
                title: "Ram Ghat",
                dist: "2.0 km away",
                desc: "The most ancient bathing ghat in connection with the Kumbh Mela."
              },
              {
                icon: Landmark,
                title: "Kal Bhairav Temple",
                dist: "4.5 km away",
                desc: "A unique temple dedicated to Kal Bhairav, the guardian deity of the city."
              }
            ].map((spot, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl border-l-4 border-gold shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gold/10 rounded-lg">
                    <spot.icon className="w-8 h-8 text-gold" />
                  </div>
                  <span className="text-xs font-bold bg-navy text-white px-3 py-1 rounded-full">{spot.dist}</span>
                </div>
                <h3 className="text-xl font-bold font-serif mb-2">{spot.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{spot.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Our Team Section */}
      <section className="section-padding bg-muted/20">
        <div className="container-hotel">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-gold font-medium mb-2 block tracking-widest text-sm">THE TEAM</span>
            <h2 className="heading-section">The Faces Behind Comfort</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rajesh Kumar", role: "General Manager", img: 32 },
              { name: "Priya Sharma", role: "Head of Hospitality", img: 44 },
              { name: "Amit Verma", role: "Guest Relations", img: 68 },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={`https://i.pravatar.cc/600?img=${member.img}`}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Social Overlay */}
                  <div className="absolute top-4 right-4 translate-x-10 group-hover:translate-x-0 transition-transform duration-300 flex flex-col gap-2">
                    {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                      <button key={i} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-gold text-white flex items-center justify-center transition-colors">
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-1">{member.name}</h3>
                  <p className="text-gold text-sm tracking-widest uppercase">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Gallery Preview */}
      <section className="bg-navy overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 h-[400px]">
          {[
            { img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070", title: "Luxury Interiors" },
            { img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1974", title: "Peaceful Ambience" },
            { img: "https://images.unsplash.com/photo-1571896349842-6e5a66a35017?q=80&w=2070", title: "Divine Views" },
            { img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070", title: "Relaxing Spa" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group h-full cursor-pointer overflow-hidden"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Plus className="w-12 h-12 text-gold mx-auto mb-2" />
                  <p className="text-white font-serif text-xl">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 10. Booking Process */}
      <section className="section-padding bg-muted/30">
        <div className="container-hotel">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-gold font-medium mb-2 block tracking-widest text-sm">HOW IT WORKS</span>
            <h2 className="heading-section">Our Booking Process</h2>
          </motion.div>

          <div className="relative">
            {/* Dashed Line */}
            <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[2px] border-t-2 border-dashed border-gold/30 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                {
                  step: "01",
                  icon: MapPin,
                  title: "Choose Destination",
                  desc: "Select Ujjain as your spiritual destination."
                },
                {
                  step: "02",
                  icon: Settings,
                  title: "Select Room",
                  desc: "Browse our luxury accommodations."
                },
                {
                  step: "03",
                  icon: CheckCircle,
                  title: "Customize Stay",
                  desc: "Add meals, puja services, or transport."
                },
                {
                  step: "04",
                  title: "Book & Relax",
                  desc: "Instant confirmation for your peace of mind.",
                  CustomIcon: CheckCircle
                }
              ].map((process, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-background pt-10 pb-8 px-6 rounded-xl shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-gold/30"
                >
                  <div className="w-24 h-24 mx-auto bg-background rounded-full flex items-center justify-center mb-6 relative border-4 border-muted group-hover:border-gold transition-colors duration-300">
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-sm font-bold shadow-md">
                      {process.step}
                    </span>
                    {process.CustomIcon ? (
                      <process.CustomIcon className="w-10 h-10 text-muted-foreground group-hover:text-gold transition-colors" />
                    ) : (
                      process.icon && <process.icon className="w-10 h-10 text-muted-foreground group-hover:text-gold transition-colors" />
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{process.title}</h3>
                  <p className="text-muted-foreground text-sm">{process.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Dining / Passion Section */}
      <section className="py-24 overflow-hidden">
        <div className="container-hotel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-gold" />
                <span className="text-gold font-medium tracking-widest text-sm uppercase">Culinary Delight</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif text-foreground mb-8 leading-tight">
                Passion On <span className="italic text-gold">Plate</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                Experience the divine flavors of Ujjain. Our pure vegetarian kitchen serves
                authentic meals prepared with devotion and the freshest local ingredients.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { title: "Authentic Recipes", desc: "Passed down through generations." },
                  { title: "Pure Ingredients", desc: "Locally sourced, organic produce." },
                  { title: "Devotional Service", desc: "Served with warmth and care." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-1">
                      <Utensils className="w-5 h-5 text-gold" />
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 text-gold font-bold tracking-widest hover:gap-4 transition-all uppercase text-sm border-b-2 border-gold pb-1">
                View Dining Menu <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Image Composition */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2"
            >
              {/* Back Decorative Box */}
              <div className="absolute top-10 -right-10 w-full h-full border-2 border-gold rounded-3xl -z-10 hidden md:block" />
              <div className="absolute -bottom-10 -left-10 w-2/3 h-2/3 bg-muted rounded-3xl -z-10 hidden md:block" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src={restaurantImage}
                  alt="Dining"
                  className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-8 left-8 z-20 text-white">
                  <p className="font-serif text-3xl mb-1">Pure Veg</p>
                  <p className="text-white/80 text-sm tracking-widest uppercase">Restaurant</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 12. Stories / Blog (NEW) */}
      <section className="section-padding bg-background">
        <div className="container-hotel">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
              <span className="text-gold font-medium mb-2 block tracking-widest text-sm">JOURNAL</span>
              <h2 className="heading-section">Stories from Ujjain</h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-gold font-semibold uppercase tracking-wider text-xs border border-gold/30 px-6 py-3 rounded-full hover:bg-gold hover:text-white transition-all">
              Read All Stories <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { date: "Oct 12, 2024", title: "A Guide to Mahakal Bhasma Aarti", img: 1043, cat: "Spiritual" },
              { date: "Sep 28, 2024", title: "Experiencing the Kumbh Mela History", img: 1056, cat: "History" },
              { date: "Aug 15, 2024", title: "Best Street Foods of Ujjain", img: 1025, cat: "Food" },
            ].map((post, idx) => (
              <motion.div
                key={idx}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="overflow-hidden rounded-xl mb-6 relative aspect-[4/3]">
                  <img
                    src={`https://images.unsplash.com/photo-${post.img}?q=80&w=800&auto=format&fit=crop`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-navy px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                    {post.cat}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <Clock className="w-4 h-4" />
                  {post.date}
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  Discover the spiritual significance and rituals that make this experience truly divine for every pilgrim visiting Ujjain.
                </p>
                <span className="text-gold text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQ Section */}
      <section className="section-padding bg-muted/20">
        <div className="container-hotel max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
          >
            <span className="text-gold font-medium mb-2 block tracking-widest text-sm">FAQ</span>
            <h2 className="heading-section">Common Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "How close is the hotel to Mahakaleshwar Temple?", a: "We are located just 1.5km from the temple, a brief 10-minute walk or 5-minute rickshaw ride away." },
              { q: "Do you offer airport pick-up services?", a: "Yes, we provide luxury airport transfers from Indore Airport. Please inform us 24 hours in advance." },
              { q: "Is the food served 100% vegetarian?", a: "Absolutely. In respect of the holy city, our kitchen serves strictly pure vegetarian satvik cuisine." },
              { q: "What are the check-in and check-out timings?", a: "Check-in is at 12:00 PM and check-out is at 10:00 AM. Early check-in is subject to availability." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-border/50 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors text-left"
                >
                  <span className="font-serif font-bold text-lg text-foreground">{item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-gold" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-muted/10"
                    >
                      <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Awards & Testimonials */}
      <section className="section-padding bg-background">
        <div className="container-hotel">
          <div className="text-center mb-16">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 mb-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['TripAdvisor', 'Booking.com', 'Agoda', 'MakeMyTrip'].map((brand, i) => (
                <span key={i} className="text-2xl font-bold font-serif px-6 py-2 border border-foreground/20 rounded-full">{brand}</span>
              ))}
            </div>

            <span className="text-gold font-medium mb-2 block tracking-widest text-sm">TESTIMONIALS</span>
            <h2 className="heading-section">What Our Client’s Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-muted/20 p-10 rounded-2xl shadow-lg border border-border/50 hover:shadow-xl transition-all relative"
              >
                <div className="absolute top-8 right-8 text-gold/10">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.923 14.929 15.081C15.536 14.238 16.536 13.593 17.929 13.146L17.525 10.929C15.821 11.233 14.629 12.186 13.949 13.788L13.14 13.788C11.666 12.115 10.613 9.479 9.981 5.878L12.592 5.372C13.13 8.356 14.026 10.575 15.28 12.028C16.533 13.481 18.232 14.502 20.375 15.091L20.081 17.653C18.291 17.206 16.891 16.368 15.882 15.137C14.872 13.906 14.25 12.288 14.017 10.282L13.75 10.282L14.017 21ZM5.017 21L5.017 18C5.017 16.896 5.321 15.923 5.929 15.081C6.536 14.238 7.536 13.593 8.929 13.146L8.525 10.929C6.821 11.233 5.629 12.186 4.949 13.788L4.14 13.788C2.666 12.115 1.613 9.479 0.981 5.878L3.592 5.372C4.13 8.356 5.026 10.575 6.28 12.028C7.533 13.481 9.232 14.502 11.375 15.091L11.081 17.653C9.291 17.206 7.891 16.368 6.882 15.137C5.872 13.906 5.25 12.288 5.017 10.282L4.75 10.282L5.017 21Z" />
                  </svg>
                </div>

                <div className="flex gap-1 mb-6 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-muted-foreground italic mb-8 leading-relaxed relative z-10">
                  "Our recent trip was flawless, thanks to Shri Balaji. Their expert planning and
                  personalized service made our spiritual journey unforgettable!"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-muted rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={`https://i.pravatar.cc/150?img=${idx + 25}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground font-serif text-lg">Happy Guest</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Pilgrim</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Social Feed (NEW) */}
      <section className="py-12 border-t border-border/50">
        <div className="container-hotel text-center mb-10">
          <p className="text-gold text-sm tracking-widest font-bold uppercase flex items-center justify-center gap-2 mb-8">
            <Camera className="w-4 h-4" /> Follow On Instagram
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div dangerouslySetInnerHTML={{
              __html: `
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DCCea12hqVy/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DCCea12hqVy/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/DCCea12hqVy/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Ahan Sharma (@akkiloverhunt_69)</a></p></div></blockquote>
              `
            }} />
            <div dangerouslySetInnerHTML={{
              __html: `
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DCCeAK5hNlw/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DCCeAK5hNlw/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/DCCeAK5hNlw/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Ahan Sharma (@akkiloverhunt_69)</a></p></div></blockquote>
              `
            }} />
            <div dangerouslySetInnerHTML={{
              __html: `
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DTzZ_8MDJP6/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/DTzZ_8MDJP6/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/DTzZ_8MDJP6/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Nikita Gaikwad (@curlyhairbae)</a></p></div></blockquote>
              `
            }} />
          </div>
        </div>
      </section>

      {/* 16. Newsletter / CTA */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container-hotel relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-serif mb-6">Join Our Newsletter</h2>
            <p className="text-white/70 mb-8">
              Subscribe to receive special offers, spiritual guides, and updates about Ujjain darshan.
            </p>
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <input
                type="email"
                placeholder="Your Email Address"
                className="bg-transparent border-none text-white placeholder:text-white/50 focus:ring-0 flex-1 px-6 py-3"
              />
              <button className="bg-gold text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-navy transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;