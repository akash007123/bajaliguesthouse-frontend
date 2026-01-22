import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Users, Clock } from 'lucide-react';
import { hotelInfo } from '@/data/mockData';
import heroImage from '@/assets/hero-hotel.jpg';
import spaImage from '@/assets/amenity-spa.jpg';
import restaurantImage from '@/assets/amenity-restaurant.jpg';

const stats = [
  { icon: Star, value: '4.8/5', label: 'Guest Rating' },
  { icon: Award, value: '10+', label: 'Years of Service' },
  { icon: Users, value: '5000+', label: 'Pilgrims Served' },
  { icon: Clock, value: '24/7', label: 'Spiritual Support' },
];

const About: React.FC = () => {
  return (
    <div>
      {/* Header */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80 z-10" />
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
              alt="Hotel Lobby Luxury"
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
              About Us
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
              A Legacy of <span className="text-gold italic">Service</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Discover the spiritual legacy and traditional hospitality of Shri Balaji Home Stay,
              where every guest is treated like family.
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

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-hotel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold font-medium mb-2 block">ESTABLISHED 2014</span>
              <h2 className="heading-section text-foreground mb-6">
                A Legacy of Spiritual Hospitality
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {hotelInfo.description}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded with a vision to provide authentic Indian hospitality to pilgrims and travelers
                visiting the sacred city of Ujjain, Shri Balaji Home Stay has become a sanctuary for
                those seeking spiritual rejuvenation and cultural experiences. Our commitment to traditional
                values is reflected in every detail, from our culturally inspired decor to our personalized service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our dedicated family ensures that every guest experience is warm, authentic, and memorable.
                Whether you're here for spiritual pilgrimage, cultural exploration, or simply to experience
                the heart of Madhya Pradesh, we promise an unforgettable stay filled with traditional hospitality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="Shri Balaji "
                className="rounded-xl shadow-elegant w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold p-6 rounded-xl shadow-gold">
                <p className="text-white font-serif text-2xl font-bold">15+</p>
                <p className="text-white/90 text-sm">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container-hotel">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-gold" />
                </div>
                <p className="text-3xl font-serif font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold font-medium mb-2 block">OUR VALUES</span>
            <h2 className="heading-section text-foreground">What Makes Us Special</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Authentic Hospitality',
                description: 'Experience genuine Indian hospitality with traditional values, warm family atmosphere, and personalized care that makes you feel at home.',
                image: spaImage
              },
              {
                title: 'Spiritual Guidance',
                description: 'Our local experts provide authentic guidance for temple visits, rituals, and cultural experiences in the sacred city of Ujjain.',
                image: restaurantImage
              },
              {
                title: 'Cultural Immersion',
                description: 'Immerse yourself in rich Indian traditions, local cuisine, and cultural performances that showcase the heritage of Madhya Pradesh.',
                image: heroImage
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-hotel overflow-hidden"
              >
                <img
                  src={value.image}
                  alt={value.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities List */}
      <section className="section-padding bg-primary">
        <div className="container-hotel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold font-medium mb-2 block">AMENITIES</span>
            <h2 className="heading-section text-primary-foreground">Resort Facilities</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {hotelInfo.amenities.map((amenity, index) => (
              <motion.div
                key={amenity}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-primary-foreground/10 rounded-lg p-4 text-center"
              >
                <span className="text-primary-foreground text-sm font-medium">{amenity}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
