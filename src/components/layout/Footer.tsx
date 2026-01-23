import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Send
} from "lucide-react";
import { hotelInfo } from "@/data/mockData";
import { motion } from "framer-motion";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white relative overflow-hidden pt-20 pb-10">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-hotel relative z-10 px-6 md:px-12">
        {/* Newsletter Section */}
        <div className="mb-20 grid md:grid-cols-2 gap-12 items-center border-b border-white/10 pb-16">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl mb-4 text-white">
              Join Our <span className="text-gold italic">Newsletter</span>
            </h3>
            <p className="text-white/60 font-light text-lg max-w-md">
              Subscribe to receive exclusive offers, latest news, and upcoming events curated for you.
            </p>
          </div>
          <div className="relative">
            <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-2 pl-6 focus-within:border-gold/50 transition-colors duration-300">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 w-full outline-none"
              />
              <button className="bg-gold hover:bg-gold/90 text-navy rounded-full p-3 flex-shrink-0 transition-all transform hover:scale-105">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="./icon.png" className="w-16 h-16 object-contain opacity-90" alt="logo" />
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-white">
                  {hotelInfo.name}
                </h3>
                <p className="text-gold text-xs uppercase tracking-[0.2em]">Luxury Homestay</p>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed font-light">
              {hotelInfo.tagline}. <br />
              Experience the divine essence of Ujjain with unmatched hospitality and comfort.
            </p>

            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-navy hover:bg-gold hover:border-gold transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-8 text-gold">Explore</h4>
            <ul className="space-y-4">
              {["Home", "Rooms", "UjjainDarshan", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-gold transition-colors text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 mr-3 group-hover:bg-gold transition-colors" />
                    {item === "UjjainDarshan" ? "Ujjain Darshan" : item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-8 text-gold">Experiences</h4>
            <ul className="space-y-4">
              {["Temple Tours", "Traditional Cuisine", "Cultural Events", "Spiritual Guidance", "Yoga & Meditation"].map(
                (item) => (
                  <li key={item} className="text-white/70 text-sm flex items-center group cursor-default hover:text-white transition-colors">
                    <ArrowRight className="w-3 h-3 mr-2 text-gold/50 group-hover:translate-x-1 transition-transform" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-8 text-gold">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                  <MapPin className="w-4 h-4 text-gold" />
                </div>
                <span className="text-white/70 text-sm leading-relaxed group-hover:text-white transition-colors">
                  {hotelInfo.address}
                </span>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                  <Phone className="w-4 h-4 text-gold" />
                </div>
                <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                  {hotelInfo.phone}
                </span>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                  <Mail className="w-4 h-4 text-gold" />
                </div>
                <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                  {hotelInfo.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
          <p>© {new Date().getFullYear()} {hotelInfo.name}. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gold transition-colors">Terms of Service</Link>
            <span className="flex items-center gap-1">
              Design & Developed By <a href="https://sosapient.in/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400 font-medium">❤️Sosapient</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
