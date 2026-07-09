import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Heart, User, LogOut, Calendar, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-200 py-2 border-b-2 ${
      isActive
        ? 'border-primary text-primary'
        : 'border-transparent text-slate-600 hover:text-primary hover:border-slate-300'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block text-base font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary-light text-primary'
        : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="p-2 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart className="w-6 h-6 fill-current animate-pulse" />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Sheba<span className="text-primary">BD</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/explore" className={linkClass}>
              Find Doctors
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/manage-appointments" className={linkClass}>
                Appointments
              </NavLink>
            )}
            {(user?.role === 'doctor' || user?.role === 'admin') && (
              <NavLink to="/add-doctor" className={linkClass}>
                Add Doctor
              </NavLink>
            )}
            <NavLink to="/about" className={linkClass}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact Support
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary text-white rounded-md">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-accent border border-slate-200 hover:border-accent-light px-3.5 py-1.5 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-primary px-3.5 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg shadow-md shadow-primary/10 transition-all duration-200 flex items-center space-x-1"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-xl animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/explore" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
              Find Doctors
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/manage-appointments" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
                Appointments
              </NavLink>
            )}
            {(user?.role === 'doctor' || user?.role === 'admin') && (
              <NavLink to="/add-doctor" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
                Add Doctor
              </NavLink>
            )}
            <NavLink to="/about" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
              Contact Support
            </NavLink>
          </div>

          <div className="pt-4 pb-4 border-t border-slate-100 px-4">
            {isAuthenticated && user ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-full">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                  <span className="ml-auto px-2 py-0.5 text-[9px] font-bold uppercase bg-primary text-white rounded-md">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-accent border border-accent-light px-4 py-2.5 rounded-lg hover:bg-accent-light/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-medium text-slate-700 hover:text-primary py-2.5 rounded-lg border border-slate-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-medium text-white bg-primary hover:bg-primary-dark py-2.5 rounded-lg shadow-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
