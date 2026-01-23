import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Camera } from 'lucide-react';

const UjjainDarshan: React.FC = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDarshans = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/darshans`);
        const data = await response.json();
        setAttractions(data);
      } catch (error) {
        console.error('Error fetching darshans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDarshans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
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
              src="https://hotelimperialujjain.com/wp-content/uploads/2022/12/Mahalok-1.jpg"
              alt="Ujjain Mahakal Lok"
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
              The City of Temples
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
              Divine <span className="text-gold italic">Darshan</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
              Journey through the sacred corridors of time. Experience the spiritual grandeur of Mahakaleshwar and the holy Shipra river.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="bg-gold hover:bg-gold/90 text-navy font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]">
                Explore Attractions
              </button>
            </motion.div>
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

      {/* Introduction Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              The Sacred City of Ujjain
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ujjain, one of India's seven sacred cities, is renowned for its rich cultural heritage, ancient temples, and spiritual significance.
              Known as the "City of Temples," it holds a special place in Hindu mythology and continues to attract pilgrims and tourists from around the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-8 rounded-2xl shadow-lg">
                <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Sacred Geography</h3>
                <p className="text-gray-600">Located on the banks of the Shipra River, Ujjain's geography holds deep spiritual significance in Hindu traditions.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-8 rounded-2xl shadow-lg">
                <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Ancient History</h3>
                <p className="text-gray-600">With a history spanning over 2,000 years, Ujjain has been a center of learning, culture, and spirituality since ancient times.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 rounded-2xl shadow-lg">
                <Camera className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Cultural Heritage</h3>
                <p className="text-gray-600">Home to magnificent temples, palaces, and festivals, Ujjain offers a rich tapestry of cultural experiences.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Must-Visit Attractions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the most revered sites in Ujjain, each telling a story of devotion, history, and architectural marvel.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-2 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading attractions...</p>
              </div>
            ) : attractions.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">No attractions available at the moment.</p>
              </div>
            ) : (
              attractions.map((attraction, index) => (
                <motion.div
                  key={attraction.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {attraction.rating}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-semibold mb-3 text-gray-800">{attraction.name}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{attraction.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {attraction.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {attraction.time}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-yellow-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready for Your Spiritual Journey?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Experience the divine energy of Ujjain. Book your stay at Shri Balaji Home Stay and make your pilgrimage unforgettable.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-lg"
            >
              Book Your Stay Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UjjainDarshan;