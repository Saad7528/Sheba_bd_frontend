import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Doctor, OverviewStats } from '../types';
import DoctorCard from '../components/DoctorCard';
import { 
  Search, ShieldAlert, Award, Calendar, Video, CheckCircle, 
  ChevronDown, ChevronUp, Users, HeartHandshake, Stethoscope,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState<OverviewStats>({
    activeDoctors: 12,
    happyPatients: 245,
    totalAppointments: 48,
    telemedicineChambers: 8
  });
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  
  // FAQs Accordion states
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch top rated doctors (sort by rating, limit 4)
        const docRes = await API.get('/doctors?sortBy=rating&limit=4');
        setTopDoctors(docRes.data.doctors || []);
        
        // Fetch stats
        const statsRes = await API.get('/stats/overview');
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchVal)}`);
    } else {
      navigate('/explore');
    }
  };

  const specialties = [
    { name: 'Cardiology', icon: '❤️', description: 'Heart & cardiovascular care', color: 'bg-rose-50 text-rose-600' },
    { name: 'Gynecology', icon: '🤰', description: 'Maternal health & pregnancy', color: 'bg-pink-50 text-pink-600' },
    { name: 'Pediatrics', icon: '👶', description: 'Newborn & child healthcare', color: 'bg-amber-50 text-amber-600' },
    { name: 'Dermatology', icon: '✨', description: 'Skin disorders & laser care', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Neurology', icon: '🧠', description: 'Brain, stroke & spinal care', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'General Medicine', icon: '🩺', description: 'All general ailments & diagnostics', color: 'bg-teal-50 text-teal-600' }
  ];

  const faqs = [
    {
      q: "How do I book an appointment on ShebaBD?",
      a: "Simply search for your preferred doctor or specialty on the directory page, select an available chamber or telemedicine slot, enter the patient details, and click book. It takes less than 2 minutes!"
    },
    {
      q: "What is the fee payment process?",
      a: "Visiting fees are shown in BDT (৳) and are paid directly at the doctor's chamber reception or online via bKash/Nagad prior to a Telemedicine session."
    },
    {
      q: "Can I cancel or reschedule my appointment?",
      a: "Yes! You can cancel or change your appointment up to 4 hours before the scheduled time slot from your 'Appointments' dashboard after logging in."
    },
    {
      q: "How does the Telemedicine video session work?",
      a: "Upon booking a Telemedicine slot, you will receive a secure video chamber room link. Simply join using any phone or laptop browser at the scheduled time."
    }
  ];

  // Recharts Chart Mock Growth Data (representing patient satisfaction and appointment growth)
  const chartData = [
    { name: 'Jan', appointments: 120, satisfaction: 94 },
    { name: 'Feb', appointments: 210, satisfaction: 95 },
    { name: 'Mar', appointments: 340, satisfaction: 96 },
    { name: 'Apr', appointments: 490, satisfaction: 96 },
    { name: 'May', appointments: 680, satisfaction: 98 },
    { name: 'Jun', appointments: 850, satisfaction: 99 },
  ];

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION - Height limited to 60-70% of screen */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
        {/* Decorative subtle background blobs */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/10 text-teal-300 border border-teal-500/20">
                ⭐ Trusted Healthcare Portal in Bangladesh
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
                Find and Book the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">Best Doctors</span> in BD
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light">
                Connect with certified medical specialists in Dhaka, Chittagong, Sylhet, and more. Access instant chamber visits and secure 24/7 video consultations from home.
              </p>

              {/* Interactive Search Bar in Hero */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 max-w-md">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search doctor name or specialty..."
                    className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  <span>Search</span>
                </button>
              </form>

              {/* CTA Link */}
              <div className="flex items-center space-x-4 pt-2">
                <Link
                  to="/explore"
                  className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-white/5"
                >
                  Find a Doctor
                </Link>
                <Link
                  to="/about"
                  className="text-slate-300 hover:text-white text-sm font-semibold transition-colors flex items-center"
                >
                  Learn how it works &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Graphic or Banner Stats */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative bg-slate-800/40 border border-white/10 p-6 rounded-3xl backdrop-blur-md shadow-2xl">
                <div className="absolute -top-6 -left-6 bg-teal-500 text-white p-3 rounded-2xl shadow-xl">
                  <Video className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <div className="h-44 rounded-2xl overflow-hidden bg-slate-700 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600" 
                      alt="Bangladesh Telemedicine" 
                      className="object-cover w-full h-full opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-4">
                      <p className="text-xs font-semibold text-white">24/7 Digital Consultation Chamber</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-2xl font-bold text-teal-400">{stats.activeDoctors}+</p>
                      <p className="text-xs text-slate-400">Verified Specialists</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-2xl font-bold text-teal-400">{stats.happyPatients}+</p>
                      <p className="text-xs text-slate-400">Happy Patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. SPECIALTIES/CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Find Doctors by Specialty</h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Consult with certified healthcare experts in Bangladesh categorized by primary medical divisions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((spec) => (
            <Link
              key={spec.name}
              to={`/explore?specialty=${encodeURIComponent(spec.name)}`}
              className="group flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className={`text-4xl p-4 rounded-2xl ${spec.color} transition-transform group-hover:scale-110 mb-4`}>
                {spec.icon}
              </span>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">{spec.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{spec.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. TOP RATED DOCTORS SECTION */}
      <section className="bg-slate-100/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Top Rated Specialists</h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Meet our highly recommended doctors based on real patient reviews and feedback.
              </p>
            </div>
            <Link
              to="/explore"
              className="text-primary hover:text-primary-dark font-semibold text-sm mt-4 sm:mt-0 flex items-center group"
            >
              <span>View All Doctors</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : topDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDoctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No doctors loaded. Seed data or check database connection.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Easy Booking in 3 Simple Steps</h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Get your healthcare consultation set up in just a couple of minutes without leaving home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Visual link line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-200 z-0"></div>

          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <span className="w-16 h-16 rounded-2xl bg-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-teal-500/20">
              1
            </span>
            <h3 className="text-lg font-bold text-slate-900">Find Your Doctor</h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Search by name, category, or division. Use filters to match budget fees and chamber locations.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <span className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/20">
              2
            </span>
            <h3 className="text-lg font-bold text-slate-900">Choose Available Slot</h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Check qualifications, chamber schedules, and select your preferred timing date and slot.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <span className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-rose-500/20">
              3
            </span>
            <h3 className="text-lg font-bold text-slate-900">Book Instantly</h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Fill in patient name and phone number. Receive a confirmation voucher immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TELEMEDICINE SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-600 to-primary p-8 md:p-12 rounded-3xl text-white shadow-xl shadow-teal-600/10 relative overflow-hidden">
          {/* Background overlay circles */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-slate-900/10 rounded-full blur-2xl"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Telehealth Chamber
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight font-sans">
                Book 24/7 Digital Telemedicine Video Consultations
              </h2>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                Connect with specialist physicians online. Ideal for remote follow-ups, reports analysis, pediatric health guidance, and skin/dermatology consultations. Save time and travel costs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-teal-200" />
                  <span>HQ Secure Video Connection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-teal-200" />
                  <span>Digital Prescription Download</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/explore?specialty=General%20Medicine"
                  className="inline-block bg-white hover:bg-slate-100 text-primary font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-lg"
                >
                  Start Telemedicine Consultation
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-1 rounded-2xl bg-white/20 blur animate-pulse"></div>
                <div className="relative bg-slate-950 p-4 rounded-2xl border border-white/10">
                  <img 
                    src="https://images.unsplash.com/photo-1584981424260-bd894bc1966d?auto=format&fit=crop&q=80&w=400" 
                    alt="Telemedicine Consultation" 
                    className="rounded-xl object-cover w-full h-56"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION (Recharts Charts) */}
      <section className="bg-slate-100/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Growth & Patient Satisfaction</h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Explore how ShebaBD is scaling up medical consultations and patient feedback monthly.
            </p>
          </div>

          {/* Grid showing both Recharts graphs and numbers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visual numbers panel */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="p-4 bg-teal-50 text-teal-600 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Doctors</h4>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeDoctors}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
                  <HeartHandshake className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Happy Patients</h4>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.happyPatients}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Appointments</h4>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalAppointments}</p>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart Panel */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">Monthly Consultation Bookings</h3>
                <p className="text-slate-500 text-xs mt-1">Growth chart showing successful appointments booked since January.</p>
              </div>

              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Area type="monotone" dataKey="appointments" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" name="Consultations" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PATIENT TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">What Patients Say About Us</h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Read positive experiences shared by patients from Dhaka, Chittagong, and Sylhet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between">
            <p className="text-slate-600 italic text-sm leading-relaxed mb-6">
              "Booking Prof. Baqui was extremely easy through ShebaBD. Previously, we had to visit the Labaid counter at 7 AM to get a serial. This platform saved us hours!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                SH
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Sajid Hasan</h4>
                <p className="text-xs text-slate-500">Dhaka, Bangladesh</p>
              </div>
              <span className="ml-auto text-yellow-400">★★★★★</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between">
            <p className="text-slate-600 italic text-sm leading-relaxed mb-6">
              "I scheduled a Gynecology video call session with Dr. Tasnim Ara for my mother. She reviewed our medical reports and explained the dosage carefully. Highly satisfied!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-sm">
                MB
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Mariam Begum</h4>
                <p className="text-xs text-slate-500">Chattogram, Bangladesh</p>
              </div>
              <span className="ml-auto text-yellow-400">★★★★★</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between">
            <p className="text-slate-600 italic text-sm leading-relaxed mb-6">
              "Excellent skin treatment recommendations by Dr. Nawsheen in Sylhet. Very fast appointment serial allocation. The chamber visiting fee is reasonably low too."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center font-bold text-rose-600 text-sm">
                NA
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Nabil Ahmed</h4>
                <p className="text-xs text-slate-500">Sylhet, Bangladesh</p>
              </div>
              <span className="ml-auto text-yellow-400">★★★★★</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Frequently Asked Questions</h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-light">
            Need help? Here are answers to common questions about doctor bookings.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:text-primary transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                {faqOpen === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>

              {faqOpen === index && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-50 text-slate-600 text-sm leading-relaxed animate-slide-down">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
