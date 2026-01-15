import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { hotelInfo } from "@/data/mockData";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-hotel section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex gap-2 mb-4">
              <img src="./icon.png" className="w-20" alt="logo" />
              <div className="data">
                <h3 className="font-serif text-2xl font-bold">
                  {hotelInfo.name}
                </h3>
                <p className="">{hotelInfo.subname}</p>
              </div>
            </div>

            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {hotelInfo.tagline}. Experience authentic Indian hospitality in the
              spiritual heart of Ujjain, Madhya Pradesh.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.facebook.com"
                className="text-primary-foreground/80 hover:text-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-gold transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "Rooms", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-primary-foreground/80 hover:text-gold transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {["Temple Tours", "Traditional Cuisine", "Cultural Events", "Spiritual Guidance"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-primary-foreground/80 text-sm">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-gold" />
                <span className="text-primary-foreground/80 text-sm">
                  {hotelInfo.address}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold" />
                <span className="text-primary-foreground/80 text-sm">
                  {hotelInfo.phone}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold" />
                <span className="text-primary-foreground/80 text-sm">
                  {hotelInfo.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} {hotelInfo.name}. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Design & Develope By <a href="https://sosapient.in/" target="_blank" className="text-pink-500">❤️Sosapient</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
