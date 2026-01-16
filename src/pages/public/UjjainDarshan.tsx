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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center text-white px-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Ujjain Darshan
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover the spiritual heart of India - Ujjain, where ancient temples, sacred rivers, and timeless traditions come together in perfect harmony.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Attractions
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-full transition-all duration-300">
              Plan Your Visit
            </button>
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://hotelimperialujjain.com/wp-content/uploads/2022/12/Mahalok-1.jpg)' }} />
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