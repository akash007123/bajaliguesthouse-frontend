import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Users, Clock } from 'lucide-react';
import { hotelInfo } from '@/data/mockData';
import heroImage from '@/assets/hero-hotel.jpg';
import spaImage from '@/assets/amenity-spa.jpg';
import restaurantImage from '@/assets/amenity-restaurant.jpg';

const stats = [
  { icon: Star, value: '5-Star', label: 'Rating' },
  { icon: Award, value: '15+', label: 'Years of Excellence' },
  { icon: Users, value: '50K+', label: 'Happy Guests' },
  { icon: Clock, value: '24/7', label: 'Service' },
];

const About: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <section className="bg-primary py-20 md:py-28">
        <div className="container-hotel text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold font-medium mb-2 block">ABOUT US</span>
            <h1 className="heading-display text-primary-foreground mb-4">
              Our Story
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Discover the legacy of luxury and hospitality that defines Azure Haven Resort
            </p>
          </motion.div>
        </div>
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
              <span className="text-gold font-medium mb-2 block">ESTABLISHED 2010</span>
              <h2 className="heading-section text-foreground mb-6">
                A Legacy of Exceptional Hospitality
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {hotelInfo.description}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded with a vision to redefine luxury hospitality, Azure Haven Resort has 
                become a sanctuary for discerning travelers seeking an extraordinary escape. 
                Our commitment to excellence is reflected in every detail, from our meticulously 
                designed rooms to our world-class amenities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our dedicated team of hospitality professionals ensures that every guest 
                experience is personalized and memorable. Whether you're here for a romantic 
                getaway, a family vacation, or a business retreat, we promise an unforgettable stay.
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
                alt="Azure Haven Resort"
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
            <h2 className="heading-section text-foreground">What Sets Us Apart</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Uncompromising Quality',
                description: 'From the thread count of our linens to the selection of our spa products, we never settle for anything less than exceptional.',
                image: spaImage
              },
              {
                title: 'Personalized Service',
                description: 'Our dedicated concierge team anticipates your needs and crafts bespoke experiences tailored to your preferences.',
                image: restaurantImage
              },
              {
                title: 'Sustainable Luxury',
                description: 'We believe luxury and sustainability can coexist. Our eco-friendly practices ensure a greener future without compromising comfort.',
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
