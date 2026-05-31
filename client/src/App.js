import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// User Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import BookingConfirm from './pages/BookingConfirm';


// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';
import ManageEvents from './pages/admin/ManageEvents';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import MyEvents from './pages/organizer/MyEvents';
import OrganizerCreateEvent from './pages/organizer/CreateEvent';
import OrganizerEditEvent from './pages/organizer/EditEvent';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminEditEvent from './pages/admin/EditEvent';

// Auth & Route Protection
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

// Protected Route - Login zaroori hai
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route - Sirf Admin
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? children : <Navigate to="/" />;
};

// Organizer Route - Sirf Organizer
const OrganizerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'organizer' || user?.role === 'admin'
    ? children
    : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route path="/my-bookings" element={
                <ProtectedRoute><MyBookings /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/booking-confirm" element={
                <ProtectedRoute><BookingConfirm /></ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />
              <Route path="/admin/create-event" element={
                <AdminRoute><CreateEvent /></AdminRoute>
              } />
              <Route path="/admin/edit-event/:id" element={
                <AdminRoute><AdminEditEvent /></AdminRoute>
              } />
              <Route path="/admin/manage-events" element={
                <AdminRoute><ManageEvents /></AdminRoute>
              } />
              <Route path="/admin/manage-bookings" element={
                <AdminRoute><ManageBookings /></AdminRoute>
              } />

              <Route path="/admin/manage-users" element={
                <AdminRoute><ManageUsers /></AdminRoute>
              } />
              
              {/* Organizer Routes */}
              <Route path="/organizer" element={
                <OrganizerRoute><OrganizerDashboard /></OrganizerRoute>
              } />
              <Route path="/organizer/my-events" element={
                <OrganizerRoute><MyEvents /></OrganizerRoute>
              } />
              <Route path="/organizer/create-event" element={
                <OrganizerRoute><OrganizerCreateEvent /></OrganizerRoute>
              } />
              <Route path="/organizer/edit-event/:id" element={
                <OrganizerRoute><OrganizerEditEvent /></OrganizerRoute>
              } />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;