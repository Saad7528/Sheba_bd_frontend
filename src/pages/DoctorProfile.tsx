import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Doctor, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import DoctorCard from '../components/DoctorCard';
import { Star, MapPin, Award, Calendar, Clock, Stethoscope, AlertCircle, MessageSquare } from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [relatedDoctors, setRelatedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Booking Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    // Prefill form if user is logged in
    if (user) {
      setPatientName(user.name);
      setPatientEmail(user.email);
    }
  }, [user]);

  const loadDoctorProfile = async () => {
    setLoading(true);
    setBookingSuccess(false);
    setBookingError('');
    try {
      // Get doctor details
      const response = await API.get(`/doctors/${id}`);
      const docData: Doctor = response.data;
      setDoctor(docData);

      // Reset slot choice
      if (docData.schedule && docData.schedule.length > 0) {
        setSelectedSlot(docData.schedule[0]);
      }

      // Load related/similar doctors by specialty
      const relatedRes = await API.get(`/doctors?specialty=${encodeURIComponent(docData.specialty)}&limit=3`);
      const list: Doctor[] = relatedRes.data.doctors || [];
      // Filter out current doctor
      setRelatedDoctors(list.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Error fetching doctor details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorProfile();
  }, [id]);

  // Generates date options for the next 7 days
  const getDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const value = `${year}-${month}-${date}`;
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
      dates.push({ value, label });
    }
    return dates;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!appointmentDate || !selectedSlot || !patientName || !patientPhone || !patientEmail) {
      setBookingError('Please fill in all booking fields');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      await API.post('/appointments', {
        doctorId: id,
        patientName,
        patientPhone,
        patientEmail,
        appointmentDate,
        timeSlot: selectedSlot,
        notes: bookingNotes
      });
      setBookingSuccess(true);
      setBookingNotes('');
      // Clean schedule choice but leave info
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Error occurred while booking appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Review comment cannot be empty.');
      return;
    }

    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      const res = await API.post(`/doctors/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      
      // Update local doctor state with new review average and reviews array
      if (doctor) {
        setDoctor({
          ...doctor,
          reviews: res.data.reviews,
          rating: res.data.rating,
          reviewsCount: res.data.reviewsCount
        });
      }

      setReviewComment('');
      setReviewRating(5);
      setReviewSuccess(true);
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-grow">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-semibold">Loading doctor profile details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center flex-grow">
        <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-slate-600 mt-2">The doctor profile you are trying to view does not exist or was deleted.</p>
        <Link to="/explore" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-12">
      
      {/* 1. Doctor Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
        
        {/* Doctor Avatar */}
        <div className="md:col-span-4 h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-100">
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
            }}
          />
        </div>

        {/* Doctor Information */}
        <div className="md:col-span-8 flex flex-col justify-between text-left space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="bg-primary-light text-primary px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {doctor.specialty}
              </span>
              <div className="flex items-center space-x-1 text-sm font-bold text-slate-800">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-500 font-light">({doctor.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 font-sans">{doctor.name}</h1>
            
            <div className="flex items-center space-x-2 text-sm text-slate-700 font-medium">
              <Award className="w-5 h-5 text-slate-400" />
              <span>{doctor.degrees}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-xs font-bold uppercase">Chamber Location</span>
                  <span className="text-slate-800 text-sm font-semibold">{doctor.chamber} ({doctor.location})</span>
                </div>
              </div>
              <div>
                <span className="block text-slate-400 text-xs font-bold uppercase">Visiting Fee</span>
                <span className="text-2xl font-extrabold text-slate-900">৳{doctor.visitingFee}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">About the Doctor</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{doctor.description}</p>
          </div>
        </div>
      </div>

      {/* 2. Main Row: Booking Panel & Chambers / Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Schedule Slots & Reviews */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Visiting Schedule Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 mr-2 text-primary" /> Chamber Visiting Hours
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.schedule.map((slot, index) => (
                <div key={index} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="text-xs font-semibold text-slate-700">{slot}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center border-b border-slate-100 pb-3">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" /> Patient Reviews ({doctor.reviews.length})
            </h3>

            {/* List Reviews */}
            {doctor.reviews.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {doctor.reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                          {rev.patientName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-800">{rev.patientName}</span>
                          <span className="block text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">No reviews yet for this doctor. Be the first to share your experience!</p>
            )}

            {/* Add Review Form */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h4 className="font-bold text-sm text-slate-950">Add a Review</h4>
              
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {reviewSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-100">
                      Review added successfully! Thank you for your feedback.
                    </div>
                  )}
                  {reviewError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100">
                      {reviewError}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div className="flex items-center space-x-3 text-left">
                    <label className="text-xs font-bold text-slate-700 uppercase">Rating</label>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              num <= reviewRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Comment</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share details of your experience with this doctor..."
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-slate-900 hover:bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-xs text-slate-500">
                    You must be logged in to submit a doctor review.{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                      Log In here
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Appointment Booking Widget */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" /> Book Appointment
              </h3>
              <p className="text-xs text-slate-500 mt-1">Fill in the fields below to finalize your booking in BDT.</p>
            </div>

            {bookingSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl text-center border border-emerald-100 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-extrabold text-slate-900">Appointment Booked!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your appointment has been successfully requested. You can view progress under the{' '}
                  <Link to="/manage-appointments" className="text-primary font-bold hover:underline">
                    Dashboard
                  </Link>
                  .
                </p>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="mt-2 text-xs font-bold text-primary hover:underline focus:outline-none"
                >
                  Book another appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {bookingError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100">
                    {bookingError}
                  </div>
                )}

                {/* Patient Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Rahim Uddin"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Patient Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Patient Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Date Picker (Select Next 7 Days) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Appointment Date</label>
                  <select
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-700"
                  >
                    <option value="">Select a date</option>
                    {getDateOptions().map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Slot Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Visiting Session Slot</label>
                  <select
                    required
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-700"
                  >
                    {doctor.schedule.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Brief Symptoms / Notes</label>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Headache, high pressure issues..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary/10 disabled:opacity-50 flex items-center justify-center"
                >
                  {bookingLoading ? 'Processing Request...' : isAuthenticated ? 'Confirm Booking Request' : 'Sign In to Book'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* 3. Related Doctors */}
      {relatedDoctors.length > 0 && (
        <div className="pt-8 border-t border-slate-100 space-y-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Similar Doctors in {doctor.specialty}
            </h2>
            <p className="text-slate-500 text-xs">Explore alternative certified doctors offering chamber visits in the same specialty category.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDoctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorProfile;
