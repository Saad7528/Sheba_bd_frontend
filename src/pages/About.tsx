import React from 'react';
import { Heart, ShieldCheck, Stethoscope, Video, Calendar, MapPin } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-16 text-left">
      
      {/* Hero Banner Details */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 rounded-3xl p-8 md:p-12 text-white shadow-xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-500/5 rounded-3xl blur-3xl"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold uppercase tracking-wider">
            About Our Platform
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans">
            Revolutionizing Doctor Booking in Bangladesh
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
            ShebaBD is built to bridge the gap between certified medical experts and patients in Bangladesh. We bring trust, convenience, and direct digital booking access right to your fingertips.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Our Healthcare Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Finding the right doctor in Bangladesh shouldn't involve standing in long morning lines, waiting for hours in diagnostic counters, or facing telephone booking confusion. 
          </p>
          <p className="text-slate-600 text-sm leading-relaxed font-light">
            We aim to organize doctor chamber timings and telemedicine consultations, giving patients immediate access to verify degrees, check visiting fees in BDT (৳), examine feedback reviews, and lock in slot schedules.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <span className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Certified Physicians</h4>
              <p className="text-slate-500 text-xs">Every doctor profile is validated using BMDC license listings.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded-3xl overflow-hidden shadow-inner h-80 relative">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"
            alt="Medical Team Bangladesh"
            className="object-cover w-full h-full opacity-90"
          />
        </div>
      </div>

      {/* Core Platform Offerings */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 font-sans">Why Choose ShebaBD?</h2>
          <p className="text-slate-500 text-xs mt-1">Key advantages we offer to patients and healthcare facilities in Bangladesh.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <span className="inline-flex p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Instant Chamber Serials</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-light">
              Skip lines. Choose from active available schedules, book in real-time, and get absolute timing confirmations.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <span className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Video className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Online Telemedicine</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-light">
              Consult with top medical specialists via secure built-in video rooms without leaving your hometown division.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <span className="inline-flex p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Stethoscope className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Transparent BDT Pricing</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-light">
              We promote honest treatment details. Doctor visiting fees are shown in BDT currency with zero added charges.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
