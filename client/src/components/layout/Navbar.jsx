import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Calendar, User, LogOut, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="text-white w-8 h-8" />
            <span className="text-white text-xl font-bold">EventHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-purple-200 transition">
              Home
            </Link>
            <Link to="/events" className="text-white hover:text-purple-200 transition">
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="text-white hover:text-purple-200 transition flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold hover:bg-yellow-300 transition">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="text-white hover:text-purple-200 transition flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {user?.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-white hover:text-purple-200 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-100 transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-white hover:text-purple-200 py-2">Home</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="block text-white hover:text-purple-200 py-2">Events</Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block text-white hover:text-purple-200 py-2">My Bookings</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-white hover:text-purple-200 py-2">Profile</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-yellow-400 py-2">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="block text-red-400 py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-white hover:text-purple-200 py-2">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block text-white hover:text-purple-200 py-2">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;