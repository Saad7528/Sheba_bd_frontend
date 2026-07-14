import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Doctor } from '../types';
import { useAuth } from '../context/AuthContext';
import { Eye, Trash2, Plus, Stethoscope, AlertCircle, Search, Edit2, Clock, X } from 'lucide-react';

const ManageDoctors: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  const [editName, setEditName] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editDegrees, setEditDegrees] = useState('');
  const [editVisitingFee, setEditVisitingFee] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editChamber, setEditChamber] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSchedule, setEditSchedule] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  const handleEditClick = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setEditName(doc.name);
    setEditSpecialty(doc.specialty);
    setEditDegrees(doc.degrees);
    setEditVisitingFee(String(doc.visitingFee));
    setEditLocation(doc.location);
    setEditChamber(doc.chamber);
    setEditImageUrl(doc.imageUrl);
    setEditDescription(doc.description);
    setEditSchedule(doc.schedule);
    setShowEditModal(true);
  };

  const handleScheduleChange = (index: number, val: string) => {
    const updated = [...editSchedule];
    updated[index] = val;
    setEditSchedule(updated);
  };

  const addScheduleField = () => {
    setEditSchedule([...editSchedule, '']);
  };

  const removeScheduleField = (index: number) => {
    const updated = editSchedule.filter((_, i) => i !== index);
    setEditSchedule(updated);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setEditLoading(true);
    setError('');
    try {
      await API.put(`/doctors/${selectedDoctor._id}`, {
        name: editName,
        specialty: editSpecialty,
        degrees: editDegrees,
        visitingFee: Number(editVisitingFee),
        location: editLocation,
        chamber: editChamber,
        imageUrl: editImageUrl,
        description: editDescription,
        schedule: editSchedule.filter(s => s.trim() !== '')
      });

      setSuccessMsg('Doctor profile updated successfully.');
      setShowEditModal(false);
      fetchDoctors();

      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update doctor profile.');
    } finally {
      setEditLoading(false);
    }
  };

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

  // Filter local doctors by role ownership, name or specialty search
  const filteredDoctors = doctors.filter((doc) => {
    // If user is a doctor, they can only see and manage their own profile
    if (user?.role === 'doctor' && doc.userId !== user.id) {
      return false;
    }
    return (
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
                        onClick={() => handleEditClick(doc)}
                        className="inline-flex items-center p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(doc._id, doc.name)}
                          className="inline-flex items-center p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleEditClick(doc)}
                    className="p-2 bg-white text-slate-600 hover:text-primary rounded-lg border border-slate-200"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(doc._id, doc.name)}
                      className="p-2 bg-white text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
      {/* Edit Doctor Profile Modal */}
      {showEditModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 relative text-left animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans mb-1">
              Edit Doctor Profile
            </h3>
            <p className="text-xs text-slate-500 mb-6">Update the chamber registration details for {selectedDoctor.name}.</p>

            <form onSubmit={handleEditSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Doctor Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Doctor Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Specialty */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Specialty Category</label>
                  <select
                    value={editSpecialty}
                    onChange={(e) => setEditSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-700 font-medium"
                  >
                    {['Cardiology', 'Gynecology', 'Pediatrics', 'Dermatology', 'Neurology', 'General Medicine'].map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Degrees */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Degrees / Credentials</label>
                  <input
                    type="text"
                    required
                    value={editDegrees}
                    onChange={(e) => setEditDegrees(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Visiting Fee */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Visiting Fee (BDT)</label>
                  <input
                    type="number"
                    required
                    min="500"
                    max="2000"
                    value={editVisitingFee}
                    onChange={(e) => setEditVisitingFee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">District Location</label>
                  <select
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-700 font-medium"
                  >
                    {['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal', 'Rangpur', 'Mymensingh'].map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Profile Image URL</label>
                  <input
                    type="url"
                    required
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Chamber Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Chamber Full Address</label>
                <input
                  type="text"
                  required
                  value={editChamber}
                  onChange={(e) => setEditChamber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">About the Doctor / Biography</label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                ></textarea>
              </div>

              {/* Schedule Slots */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Chamber Schedule Slots</label>
                  <button
                    type="button"
                    onClick={addScheduleField}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    + Add Slot
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {editSchedule.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className="relative flex-grow">
                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type="text"
                          required
                          value={slot}
                          onChange={(e) => handleScheduleChange(index, e.target.value)}
                          placeholder="e.g. Saturday: 05:00 PM - 08:00 PM"
                          className="w-full pl-8 pr-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      {editSchedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScheduleField(index)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel buttons */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  {editLoading ? 'Saving changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
