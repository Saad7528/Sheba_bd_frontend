import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../types';
import { Star, MapPin, Award } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="group flex flex-col justify-between h-[450px] w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden premium-card hover:border-primary/20">
      
      {/* Doctor Image Header */}
      <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback if image URL is invalid
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
          }}
        />
        
        {/* Rating tag */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-slate-800">{doctor.rating}</span>
          <span className="text-[10px] text-slate-500 font-light">({doctor.reviewsCount})</span>
        </div>

        {/* Specialty tag */}
        <div className="absolute bottom-3 left-3 bg-primary text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-md shadow-primary/20">
          {doctor.specialty}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-grow flex flex-col justify-between text-left">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {doctor.name}
          </h3>
          
          <div className="flex items-start space-x-1 text-xs text-slate-600">
            <Award className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{doctor.degrees}</span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-500 pt-1">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">{doctor.chamber.split(',')[0]} ({doctor.location})</span>
          </div>
        </div>

        {/* Footer row within card body */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Visiting Fee</span>
            <span className="text-lg font-extrabold text-slate-900">৳{doctor.visitingFee}</span>
          </div>
          
          <Link
            to={`/doctors/${doctor._id}`}
            className="premium-btn bg-slate-900 hover:bg-primary text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1"
          >
            <span>View Profile</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DoctorCard;
