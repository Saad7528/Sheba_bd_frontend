import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { Doctor } from '../types';
import DoctorCard from '../components/DoctorCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { Search, MapPin, DollarSign, Filter, Stethoscope, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter local states
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const specialtiesList = ['Cardiology', 'Gynecology', 'Pediatrics', 'Dermatology', 'Neurology', 'General Medicine'];
  const locationsList = ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal', 'Rangpur', 'Mymensingh'];

  const fetchDoctorsList = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 8,
        sortBy
      };

      if (searchVal) params.search = searchVal;
      if (selectedSpecialty) params.specialty = selectedSpecialty;
      if (selectedLocation) params.location = selectedLocation;
      if (maxFee) params.maxFee = maxFee;

      const response = await API.get('/doctors', { params });
      setDoctors(response.data.doctors || []);
      setTotalDocs(response.data.total || 0);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      console.error('Error loading doctors list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsList();
  }, [page, sortBy, searchParams]);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const newParams: any = { page: '1' };
    if (searchVal) newParams.search = searchVal;
    if (selectedSpecialty) newParams.specialty = selectedSpecialty;
    if (selectedLocation) newParams.location = selectedLocation;
    if (maxFee) newParams.maxFee = maxFee;
    if (sortBy) newParams.sortBy = sortBy;

    setSearchParams(newParams);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchVal('');
    setSelectedSpecialty('');
    setSelectedLocation('');
    setMaxFee('');
    setSortBy('rating');
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      const currentParams = Object.fromEntries(searchParams);
      setSearchParams({ ...currentParams, page: String(newPage) });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      
      {/* Page Title */}
      <div className="text-left mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Explore BD Doctors</h1>
        <p className="text-slate-600 text-sm">Find verified healthcare practitioners near you and book appointments in BDT.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center">
              <Filter className="w-4 h-4 mr-2 text-primary" /> Filter Options
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Reset All
            </button>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-5">
            {/* Search Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 uppercase">Doctor Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="e.g. Rafiqul"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Specialty Dropdown */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 uppercase">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
              >
                <option value="">All Specialties</option>
                {specialtiesList.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 uppercase">District / Division</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                >
                  <option value="">All Locations</option>
                  {locationsList.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Max Visiting Fee Slider */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase">Max Visiting Fee</label>
                <span className="text-xs font-extrabold text-primary">৳{maxFee || '2000'}</span>
              </div>
              <input
                type="range"
                min="500"
                max="2000"
                step="100"
                value={maxFee || '2000'}
                onChange={(e) => setMaxFee(e.target.value)}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>৳500</span>
                <span>৳2000</span>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-primary/10 flex items-center justify-center space-x-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </form>
        </div>

        {/* Right Column: Search Results Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Grid control bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm gap-4">
            <span className="text-sm text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-800">{doctors.length}</span> of{' '}
              <span className="font-bold text-slate-800">{totalDocs}</span> doctors available
            </span>

            {/* Sorting controls */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const currentParams = Object.fromEntries(searchParams);
                  setSearchParams({ ...currentParams, sortBy: e.target.value, page: '1' });
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 bg-white"
              >
                <option value="rating">Rating: High to Low</option>
                <option value="fee_low">Fee: Low to High</option>
                <option value="fee_high">Fee: High to Low</option>
              </select>
            </div>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <SkeletonGrid count={8} />
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
                We couldn't find any doctor matching your search filters. Try adjusting your specialties or district location.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center px-4 py-2 border border-slate-200 hover:border-slate-300 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 text-sm font-bold rounded-xl transition-colors ${
                    page === i + 1
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-slate-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Explore;
