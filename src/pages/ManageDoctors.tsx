import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Doctor } from '../types';
import { Eye, Trash2, Plus, Stethoscope, AlertCircle, Search } from 'lucide-react';

const ManageDoctors: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      // Get all doctors without pagination limit to show them all, or fetch first 50
      const response = await API.get('/doctors?limit=50');
      setDoctors(response.data.doctors || []);
    } catch (err: any) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the profile of ${name}?`)) {
      return;
    }

    try {
      await API.delete(`/doctors/${id}`);
      setSuccessMsg(`Doctor profile of ${name} deleted successfully.`);
      // Refetch
      fetchDoctors();
      
      // Auto clear message after 4s
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      console.error('Error deleting doctor:', err);
      setError(err.response?.data?.message || 'Failed to delete doctor profile.');
    }
  };

  // Filter local doctors by name or specialty search
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Manage Doctor Profiles
          </h1>
          <p className="text-slate-600 text-sm">
            View, inspect, and delete active medical practitioner profiles in the system.
          </p>
        </div>
        <Link
          to="/items/add"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Register New Doctor</span>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3 text-left">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-rose-700">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start space-x-3 text-left">
          <AlertCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-teal-800">{successMsg}</p>
        </div>
      )}

      {/* Search & Actions Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="text-xs font-medium text-slate-500 self-center">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      </div>

      {/* Main Grid/Table Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-white border border-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Doctor</th>
                  <th className="py-4 px-6">Specialty</th>
                  <th className="py-4 px-6">Visiting Fee</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDoctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                      <div>
                        <div className="font-bold text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{doc.degrees}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                        {doc.specialty}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      ৳{doc.visitingFee}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {doc.location}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/doctors/${doc._id}`}
                        className="inline-flex items-center p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(doc._id, doc.name)}
                        className="inline-flex items-center p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid/List View */}
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {filteredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 text-left">
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{doc.name}</h3>
                    <p className="text-xs text-slate-500">{doc.specialty}</p>
                    <p className="text-xs font-bold text-primary mt-0.5">৳{doc.visitingFee}</p>
                  </div>
                </div>
                <div className="flex space-x-1.5">
                  <Link
                    to={`/doctors/${doc._id}`}
                    className="p-2 bg-white text-slate-600 hover:text-primary rounded-lg border border-slate-200"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(doc._id, doc.name)}
                    className="p-2 bg-white text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No doctor profiles found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
