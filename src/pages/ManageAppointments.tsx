import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Appointment, WeeklyStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Calendar, Trash2, Check, Clock, User, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const ManageAppointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for expanded detail view per appointment ID
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Get user appointments
      const appRes = await API.get('/appointments');
      setAppointments(appRes.data || []);

      // If user is doctor or admin, fetch weekly growth metrics
      if (user && (user.role === 'doctor' || user.role === 'admin')) {
        const statsRes = await API.get('/stats/weekly');
        setWeeklyStats(statsRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard info:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'cancelled') => {
    try {
      await API.put(`/appointments/${id}/status`, { status: newStatus });
      // Update local state
      setAppointments(
        appointments.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel/delete this appointment booking?')) {
      return;
    }

    try {
      await API.delete(`/appointments/${id}`);
      setAppointments(appointments.filter((app) => app._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting appointment');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: 'pending' | 'approved' | 'cancelled') => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Approved
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-grow">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-semibold">Loading appointments dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-10">
      
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Manage Appointments</h1>
        <p className="text-slate-600 text-sm">
          {user?.role === 'patient' 
            ? 'Track your upcoming clinic bookings and telemedicine video slots.' 
            : 'Review patient consult schedules, update approval status, and view weekly graphs.'}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 text-sm font-semibold rounded-2xl border border-rose-100 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Analytics graph (Only for Doctor / Admin) */}
      {user && (user.role === 'doctor' || user.role === 'admin') && weeklyStats.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between text-left">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg font-sans">Appointments over the last 7 days</h3>
            <p className="text-xs text-slate-500">Visual chart showing clinic visits registered daily.</p>
          </div>

          <div className="h-60 mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="appointments" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWeekly)" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 2. Appointments Listing Table/Cards Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="font-extrabold text-slate-900 text-base flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" /> Active Bookings List ({appointments.length})
          </span>
          <button 
            onClick={fetchDashboardData}
            className="text-xs font-semibold text-primary hover:underline focus:outline-none"
          >
            Refresh List
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full hidden md:table">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient Details</th>
                  <th className="px-6 py-4">Doctor / Specialty</th>
                  <th className="px-6 py-4">Consultation Date / Slot</th>
                  <th className="px-6 py-4">Visiting Fee</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {appointments.map((app) => (
                  <React.Fragment key={app._id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      {/* Patient Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900">{app.patientName}</span>
                            <span className="block text-[10px] text-slate-400">{app.patientPhone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Doctor Info */}
                      <td className="px-6 py-4">
                        <div>
                          <span className="block font-bold text-slate-800">{app.doctorName}</span>
                          <span className="block text-[10px] text-slate-400">{app.doctorSpecialty}</span>
                        </div>
                      </td>

                      {/* Date & Slot */}
                      <td className="px-6 py-4">
                        <div>
                          <span className="block font-bold text-slate-800">
                            {new Date(app.appointmentDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="block text-[10px] text-slate-400 truncate max-w-[150px]">{app.timeSlot}</span>
                        </div>
                      </td>

                      {/* Visiting Fee */}
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ৳{app.visitingFee}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          
                          {/* Details Toggle */}
                          <button
                            onClick={() => toggleExpand(app._id)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold transition-colors flex items-center space-x-1"
                            title="View Details"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Details</span>
                          </button>

                          {/* Approval Actions (For Doctors / Admin) */}
                          {user && (user.role === 'doctor' || user.role === 'admin') && app.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'approved')}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors"
                              title="Approve Booking"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Cancellation Actions */}
                          <button
                            onClick={() => handleDeleteAppointment(app._id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>

                    {/* Collapsing Detail Row */}
                    {expandedId === app._id && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={6} className="px-8 py-4 border-t border-slate-100">
                          <div className="space-y-2 text-left">
                            <h4 className="font-bold text-xs text-slate-900">Additional Booking Details</h4>
                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                              <span className="font-bold text-slate-700">Patient Email:</span> {app.patientEmail}
                            </p>
                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                              <span className="font-bold text-slate-700">Patient Phone:</span> {app.patientPhone}
                            </p>
                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                              <span className="font-bold text-slate-700">Symptoms Notes:</span>{' '}
                              <span className="italic">{app.notes || 'None provided.'}</span>
                            </p>
                            {app.prescription && (
                              <div className="mt-4 pt-3 border-t border-slate-200/50 space-y-2">
                                <h5 className="font-bold text-xs text-slate-900 flex items-center">
                                  <FileText className="w-4 h-4 mr-1 text-primary" /> Diagnosis & Prescription Details
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-100">
                                  <div>
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Diagnosis</span>
                                    <span className="font-bold text-slate-800">{app.prescription.diagnosis}</span>
                                  </div>
                                  <div className="md:col-span-2">
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Medicines / Dosage</span>
                                    <span className="font-medium text-slate-800 whitespace-pre-line">{app.prescription.medicines}</span>
                                  </div>
                                  <div className="md:col-span-3 border-t border-slate-100 pt-2">
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Doctor Advice</span>
                                    <span className="font-light text-slate-600">{app.prescription.advice || 'None'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {appointments.map((app) => (
                <div key={app._id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-slate-900 text-sm">{app.patientName}</span>
                      <span className="block text-[10px] text-slate-400">{app.patientPhone}</span>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="text-xs space-y-1 text-slate-700">
                    <p><span className="font-bold text-slate-500">Doctor:</span> {app.doctorName} ({app.doctorSpecialty})</p>
                    <p>
                      <span className="font-bold text-slate-500">Schedule:</span>{' '}
                      {new Date(app.appointmentDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} | {app.timeSlot}
                    </p>
                    <p><span className="font-bold text-slate-500">Fee:</span> ৳{app.visitingFee}</p>
                    {app.notes && (
                      <p><span className="font-bold text-slate-500">Notes:</span> <span className="italic font-light">{app.notes}</span></p>
                    )}
                    {app.prescription && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50 space-y-1 text-left">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Prescription</span>
                        <p><span className="font-bold text-slate-500">Diagnosis:</span> {app.prescription.diagnosis}</p>
                        <p className="whitespace-pre-line"><span className="font-bold text-slate-500">Meds:</span> {app.prescription.medicines}</p>
                        {app.prescription.advice && <p><span className="font-bold text-slate-500">Advice:</span> {app.prescription.advice}</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/50">
                    {user && (user.role === 'doctor' || user.role === 'admin') && app.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'approved')}
                        className="flex-grow py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAppointment(app._id)}
                      className="flex-grow py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs flex items-center justify-center space-x-1 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Visit</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No Appointments Scheduled</h3>
            <p className="text-slate-500 text-xs mt-1">Book doctor chamber visits from the directory page to get started.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageAppointments;
