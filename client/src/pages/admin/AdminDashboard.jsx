import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Ticket, DollarSign,
  Plus, Eye, Trash2, Edit
} from 'lucide-react';
import API from '../../utils/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, eventsRes, bookingsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/events'),
        API.get('/admin/bookings')
      ]);
      setStats(statsRes.data);
      setRecentEvents(eventsRes.data.events?.slice(0, 5) || []);
      setRecentBookings(bookingsRes.data.bookings?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/admin/events/${id}`);
      toast.success('Event deleted successfully!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete event!');
    }
  };

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-orange-500',
      lightColor: 'bg-surface-soft text-accent'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Ticket className="w-8 h-8" />,
      color: 'bg-green-500',
      lightColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100 text-yellow-600'
    },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-orange-200 mt-1">Manage your events and bookings</p>
          </div>
          <Link
            to="/admin/create-event"
            className="flex items-center gap-2 bg-white text-accent px-4 py-2 rounded-full font-semibold hover:bg-surface-soft transition"
          >
            <Plus className="w-4 h-4" />
            New Event
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="theme-card rounded-2xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${card.lightColor} p-3 rounded-full`}>
                {card.icon}
              </div>
              <div>
                <p className="text-theme-text-muted text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Events */}
          <div className="theme-card rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Events</h2>
              <Link
                to="/admin/manage-events"
                className="text-accent hover:text-accent-strong text-sm font-semibold"
              >
                View All
              </Link>
            </div>

            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No events yet</p>
                <Link to="/admin/create-event">
                  <button className="mt-3 bg-orange-500 text-black px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition">
                    Create Event
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-3 bg-surface-soft rounded-xl">
                    <div className="flex items-center gap-3">
                      <img
                        src={event.image || 'https://via.placeholder.com/50?text=E'}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white text-sm">{event.title}</p>
                          <p className="text-theme-text-muted text-xs">{event.category} • ${event.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/events/${event._id}`}>
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link to={`/admin/edit-event/${event._id}`}>
                        <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="theme-card rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
              <Link
                to="/admin/manage-bookings"
                className="text-accent hover:text-accent-strong text-sm font-semibold"
              >
                View All
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {booking.user?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {booking.event?.title} • {booking.numberOfTickets} ticket(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">${booking.totalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;