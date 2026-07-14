export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface Review {
  _id?: string;
  patientId: string;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Doctor {
  _id: string;
  userId?: string;
  name: string;
  specialty: string;
  degrees: string;
  visitingFee: number;
  location: string;
  chamber: string;
  schedule: string[];
  imageUrl: string;
  description: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  createdAt?: string;
}

export interface Appointment {
  _id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  timeSlot: string;
  visitingFee: number;
  status: 'pending' | 'approved' | 'cancelled';
  notes?: string;
  prescription?: {
    diagnosis: string;
    medicines: string;
    advice: string;
  };
  createdAt: string;
}

export interface OverviewStats {
  activeDoctors: number;
  happyPatients: number;
  totalAppointments: number;
  telemedicineChambers: number;
}

export interface WeeklyStats {
  date: string;
  dateKey: string;
  appointments: number;
}

// End of Application TypeScript Interfaces
