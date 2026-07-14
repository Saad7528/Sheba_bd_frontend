import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { User, Clipboard, AlertCircle, FileText, ChevronRight, X, Heart, PlusCircle, CheckCircle2 } from 'lucide-react';

interface PatientGroup {
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointments: Appointment[];
}

const MyPatients: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal & History state
  const [selectedPatient, setSelectedPatient] = useState<PatientGroup | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Prescription editing state
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [diagText, setDiagText] = useState('');
  const [medText, setMedText] = useState('');
  const [advText, setAdvText] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/appointments');
      setAppointments(response.data || []);
    } catch (err: any) {
      console.error('Error fetching patients appointments:', err);
      setError('Failed to fetch patient history logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  // Group appointments by unique patient (only approved appointments count as treated)
  const patientGroups: PatientGroup[] = [];
  const map: { [key: string]: PatientGroup } = {};

  appointments.forEach((app) => {
    if (app.status !== 'approved') return; // only display patient history if treatment was approved/conducted
    const key = app.patientId || app.patientEmail;
    if (!map[key]) {
      map[key] = {
        patientId: app.patientId,
        patientName: app.patientName,
        patientEmail: app.patientEmail,
        patientPhone: app.patientPhone,
        appointments: []
      };
      patientGroups.push(map[key]);
    }
    map[key].appointments.push(app);
  });

  // Sort appointments in each group by date descending
  patientGroups.forEach((g) => {
    g.appointments.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  });

  const handleOpenHistory = (patient: PatientGroup) => {
    setSelectedPatient(patient);
    setShowHistoryModal(true);
    setEditingAppointmentId(null);
  };

  const handleStartPrescribe = (app: Appointment) => {
    setEditingAppointmentId(app._id);
    setDiagText(app.prescription?.diagnosis || '');
    setMedText(app.prescription?.medicines || '');
    setAdvText(app.prescription?.advice || '');
  };

  const handleSavePrescription = async (e: React.FormEvent, appId: string) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    try {
      const res = await API.put(`/appointments/${appId}/prescription`, {
        diagnosis: diagText,
        medicines: medText,
        advice: advText
      });

      setSuccessMsg('Prescription updated successfully.');
      
      // Update local appointments list state
      setAppointments(
        appointments.map((app) => (app._id === appId ? { ...app, prescription: res.data.appointment.prescription } : app))
      );

      // Update currently selected patient appointments list as well
      if (selectedPatient) {
        setSelectedPatient({
          ...selectedPatient,
          appointments: selectedPatient.appointments.map((app) =>
            app._id === appId ? { ...app, prescription: res.data.appointment.prescription } : app
          )
        });
      }

      setEditingAppointmentId(null);
      
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save prescription.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-grow">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-semibold">Loading patient records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8">
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans flex items-center">
          <Heart className="w-8 h-8 mr-2 text-rose-500 fill-rose-50" /> My Treated Patients
        </h1>
        <p className="text-slate-600 text-sm">
          Access complete medical consultation history and write prescriptions for patients you have consulted.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 text-sm font-semibold rounded-2xl border border-rose-100 flex items-start space-x-2 text-left">
          <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-2xl border border-emerald-100 flex items-center space-x-2 text-left">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Unique Patients Grid/Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="font-extrabold text-slate-900 text-base flex items-center">
            <Clipboard className="w-5 h-5 mr-2 text-primary" /> Active Medical Directory ({patientGroups.length} Patients)
          </span>
          <button 
            onClick={fetchAppointments}
            className="text-xs font-semibold text-primary hover:underline focus:outline-none"
          >
            Refresh records
          </button>
        </div>

        {patientGroups.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4 text-center">Consultations</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {patientGroups.map((p) => (
                  <tr key={p.patientId || p.patientEmail} className="hover:bg-slate-50/50 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                          <User className="w-4 h-4" />
                        </div>
                        <span>{p.patientName}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-600">
                      {p.patientEmail}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {p.patientPhone}
                    </td>

                    {/* Visits Count */}
                    <td className="px-6 py-4 text-center font-bold text-slate-700">
                      {p.appointments.length} visit(s)
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenHistory(p)}
                        className="inline-flex items-center px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary font-bold rounded-xl text-xs transition-colors space-x-1"
                      >
                        <span>Medical History</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Clipboard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No Treated Patients Logged</h3>
            <p className="text-slate-500 text-xs mt-1">Once you approve doctor bookings, patients will display in this list.</p>
          </div>
        )}
      </div>

      {/* Patient Medical History Modal */}
      {showHistoryModal && selectedPatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 relative text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Close */}
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                Medical Consultation History
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-bold text-slate-700">{selectedPatient.patientName}</span> ({selectedPatient.patientPhone}) | {selectedPatient.patientEmail}
              </p>
            </div>

            {/* Visits History Timeline */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {selectedPatient.appointments.map((app, index) => (
                <div 
                  key={app._id} 
                  className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl relative space-y-4 text-xs"
                >
                  {/* Timeline Badge */}
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="font-bold text-slate-900 text-xs">
                      Consultation #{selectedPatient.appointments.length - index}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                      {new Date(app.appointmentDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} | {app.timeSlot}
                    </span>
                  </div>

                  {/* Booking Symptoms */}
                  <div className="space-y-1.5 text-left">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Symptoms / Symptoms Notes</span>
                    <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-100">
                      {app.notes || 'No symptoms notes provided by patient.'}
                    </p>
                  </div>

                  {/* Prescription Section */}
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="font-extrabold text-slate-900 text-xs flex items-center">
                        <FileText className="w-4 h-4 mr-1 text-primary" /> Diagnosis & Prescription
                      </span>
                      {editingAppointmentId !== app._id && (
                        <button
                          onClick={() => handleStartPrescribe(app)}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center"
                        >
                          <PlusCircle className="w-3.5 h-3.5 mr-1" />
                          {app.prescription ? 'Edit Prescription' : 'Write Prescription'}
                        </button>
                      )}
                    </div>

                    {/* Display existing prescription */}
                    {editingAppointmentId !== app._id ? (
                      app.prescription ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-1">
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
                      ) : (
                        <div className="text-center py-4 text-slate-400">
                          No treatment prescription written yet for this visit.
                        </div>
                      )
                    ) : (
                      /* Sub-Form for prescribing */
                      <form onSubmit={(e) => handleSavePrescription(e, app._id)} className="space-y-3 text-left pt-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Diagnosis */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Diagnosis / Condition</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Acute Viral Fever, Gastric Spasm"
                              value={diagText}
                              onChange={(e) => setDiagText(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          {/* Advice */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Advice / Precautions</label>
                            <input
                              type="text"
                              placeholder="e.g. Drink plenty of warm water, Bed rest 3 days"
                              value={advText}
                              onChange={(e) => setAdvText(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Medicines textarea */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Medicines & Dosage Instructions</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="e.g. Tab. Napa Extend 665mg - 1+0+1 (After meal) - 5 Days&#10;Cap. Maxpro 20mg - 1+0+1 (Before meal) - 14 Days"
                            value={medText}
                            onChange={(e) => setMedText(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                          ></textarea>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingAppointmentId(null)}
                            className="px-3 py-1.5 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={saveLoading}
                            className="px-4 py-1.5 bg-primary text-white font-bold rounded-lg text-[10px] disabled:opacity-50"
                          >
                            {saveLoading ? 'Saving...' : 'Save Prescription'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPatients;
