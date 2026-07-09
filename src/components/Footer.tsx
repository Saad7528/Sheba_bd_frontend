import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand/About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="p-1.5 bg-primary text-white rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                Sheba<span className="text-primary">BD</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              ShebaBD is Bangladesh's premium online healthcare portal, connecting patients with top-rated medical specialists for chamber and telemedicine appointments.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-primary text-slate-400 hover:text-white rounded-lg transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-primary text-slate-400 hover:text-white rounded-lg transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-primary text-slate-400 hover:text-white rounded-lg transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">Find Doctors</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About Our Platform</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">Client Login</Link>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Top Specialties</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Cardiology (Heart Care)</li>
              <li>Gynecology (Maternal Health)</li>
              <li>Pediatrics (Child Health)</li>
              <li>Dermatology (Skin & Hair)</li>
              <li>Neurology (Brain Specialists)</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">Contact Support</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-slate-400">Hotline:</span>
                  <a href="tel:+8809612123456" className="hover:text-white font-medium text-white transition-colors">+880 9612 123456</a>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-slate-400">Support Email:</span>
                  <a href="mailto:support@shebabd.com" className="hover:text-white font-medium text-white transition-colors">support@shebabd.com</a>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 leading-normal">
                  Level 7, Venture Tower, Banani C/A, Dhaka-1213, Bangladesh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {currentYear} ShebaBD. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
