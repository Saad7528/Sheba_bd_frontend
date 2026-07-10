import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserCheck, ShieldAlert, Award, FileText, MapPin, DollarSign, Clock, Image, Stethoscope } from 'lucide-react';

const AddDoctor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form Fields State
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('General Medicine');
  const [degrees, setDegrees] = useState('');
  const [visitingFee, setVisitingFee] = useState('');
  const [location, setLocation] = useState('Dhaka');
  const [chamber, setChamber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Schedule inputs (Starts with 2 default slot strings)
  const [schedules, setSchedules] = useState<string[]>([
    'Saturday: 05:00 PM - 08:00 PM',
    'Monday: 05:00 PM - 08:00 PM'
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newDoctorId, setNewDoctorId] = useState('');

  const specialtiesList = ['Cardiology', 'Gynecology', 'Pediatrics', 'Dermatology', 'Neurology', 'General Medicine'];
  const locationsList = ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal', 'Rangpur', 'Mymensingh'];

  const handleScheduleChange = (index: number, val: string) => {
    const updated = [...schedules];
    updated[index] = val;
    setSchedules(updated);
  };

  const addScheduleField = () => {
    setSchedules([...schedules, '']);
  };

  const removeScheduleField = (index: number) => {
    const updated = schedules.filter((_, i) => i !== index);
    setSchedules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !degrees || !visitingFee || !chamber || !imageUrl || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    // Filter out empty schedule slots
    const filteredSchedules = schedules.filter((s) => s.trim() !== '');
    if (filteredSchedules.length === 0) {
      setError('Please provide at least one active schedule slot.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await API.post('/doctors', {
        name,
        specialty,
        degrees,
        visitingFee: Number(visitingFee),
        location,
        chamber,
        schedule: filteredSchedules,
        imageUrl,
        description
      });

      setSuccess(true);
      setNewDoctorId(res.data.doctor._id);
      
      // Reset form fields
      setName('');
      setDegrees('');
      setVisitingFee('');
      setChamber('');
      setImageUrl('');
      setDescription('');
      setSchedules(['Saturday: 05:00 PM - 08:00 PM', 'Monday: 05:00 PM - 08:00 PM']);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error occurred while saving doctor profile.');
    } finally {
      setLoading(false);
    }
  };

  // Allowed for any logged in user as per standard items/add requirement

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      
      <div className="text-left mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Add Doctor Profile</h1>
        <p className="text-slate-600 text-sm">Register a new specialist profile in the ShebaBD database directory.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-left">
        
        {success ? (
          <div className="p-6 bg-emerald-50 rounded-2xl text-center border border-emerald-100 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Doctor Profile Saved!</h3>
            <p className="text-sm text-slate-600">
              The doctor profile was saved successfully. You can view the public profile or proceed to add another.
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setSuccess(false)}
                className="px-5 py-2.5 bg-slate-950 text-white font-semibold rounded-xl text-xs"
              >
                Add Another Doctor
              </button>
              <button
                onClick={() => navigate(`/doctors/${newDoctorId}`)}
                className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-xs shadow-md shadow-primary/10"
              >
                View Profile Page
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100 flex items-start space-x-2">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-500 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Doctor Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Doctor Name</label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. Dr. Rahim Uddin"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Specialty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Specialty Category</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-700 font-medium"
                  >
                    {specialtiesList.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Degrees */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Degrees & Qualifications</label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={degrees}
                    onChange={(e) => setDegrees(e.target.value)}
                    placeholder="e.g. MBBS, FCPS (Medicine), MD"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Visiting Fee */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Visiting Fee (BDT ৳)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">৳</span>
                  <input
                    type="number"
                    required
                    value={visitingFee}
                    onChange={(e) => setVisitingFee(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Chamber Location (District)</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-700"
                  >
                    {locationsList.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chamber Clinic Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Chamber Clinic / Hospital Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={chamber}
                    onChange={(e) => setChamber(e.target.value)}
                    placeholder="e.g. Labaid Specialized Hospital, Dhanmondi"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Image URL</label>
                <div className="relative">
                  <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio/Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Full Description / Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter qualifications, expertise, medical achievements..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Schedules slots list */}
              <div className="space-y-3 md:col-span-2 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-primary" /> Active Chamber Schedules
                  </label>
                  <button
                    type="button"
                    onClick={addScheduleField}
                    className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                  >
                    + Add New Slot
                  </button>
                </div>

                <div className="space-y-2">
                  {schedules.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={slot}
                        onChange={(e) => handleScheduleChange(index, e.target.value)}
                        placeholder="e.g. Saturday: 05:00 PM - 08:00 PM"
                        className="flex-grow px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      />
                      {schedules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScheduleField(index)}
                          className="p-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs transition-colors font-bold"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10 disabled:opacity-50"
            >
              {loading ? 'Saving Doctor Profile...' : 'Save Doctor Profile'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default AddDoctor;
