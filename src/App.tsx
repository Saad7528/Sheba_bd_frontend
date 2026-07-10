import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import DoctorProfile from './pages/DoctorProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import AddDoctor from './pages/AddDoctor';
import ManageDoctors from './pages/ManageDoctors';
import ManageAppointments from './pages/ManageAppointments';
import About from './pages/About';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <Router>
      {/* Stick navbar on top, make container flex column */}
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Client Dashboard Routes */}
            <Route
              path="/manage-appointments"
              element={
                <ProtectedRoute>
                  <ManageAppointments />
                </ProtectedRoute>
              }
            />

            {/* Protected Add Doctor (Doctor/Admin roles only) */}
            <Route
              path="/add-doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                  <AddDoctor />
                </ProtectedRoute>
              }
            />

            {/* Protected Items Routes (All logged in users as per requirements) */}
            <Route
              path="/items/add"
              element={
                <ProtectedRoute>
                  <AddDoctor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/items/manage"
              element={
                <ProtectedRoute>
                  <ManageDoctors />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
