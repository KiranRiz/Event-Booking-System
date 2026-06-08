import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, DollarSign, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import API from '../../utils/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/organizer/dashboard');
      setStats(res.data.stats);
      setMyEvents(res.data.events || []);
    } catch (error) {
      toast.error('Failed to load dashboard!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/organizer/events/${id}`);
      toast.success('Event deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete event!');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Organizer Dashboard</h1>
            <p className="text-theme-text-muted mt-1">Manage your events</p>
          </div>
          <Link
            to="/organizer/create-event"
            className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-full font-semibold hover:bg-accent-strong transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Event
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="theme-card rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-surface-soft p-3 rounded-full">
              <Calendar className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-theme-text-muted text-sm">My Events</p>
              <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
            </div>
          </div>
          <div className="theme-card rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-surface-soft p-3 rounded-full">
              <Ticket className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-theme-text-muted text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="theme-card rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-surface-soft p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-theme-text-muted text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* My Events Table */}
<div className="theme-card rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">My Events</h2>
              <Link
                to="/organizer/my-events"
                className="text-accent hover:text-accent-strong text-sm font-semibold"
            >
              View All
            </Link>
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🎭</p>
              <p className="text-theme-text-muted text-lg mb-4">No events created yet</p>
              <Link to="/organizer/create-event">
                <button className="bg-orange-500 text-black px-6 py-2 rounded-full hover:bg-orange-600 transition">
                  Create Your First Event
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.slice(0, 5).map((event) => (
                <div key={event._id} className="flex items-center justify-between p-4 theme-card-soft rounded-xl gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={event.image || 'https://via.placeholder.com/50?text=E'}
                      alt={event.title}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{event.title}</p>
                      <p className="text-theme-text-muted text-xs truncate">
                        {event.category} • ${event.price} • {event.availableSeats} seats left
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Link to={`/events/${event._id}`}>
                      <button className="p-2 text-blue-400 hover:bg-surface rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link to={`/organizer/edit-event/${event._id}`}>
                      <button className="p-2 text-green-400 hover:bg-surface rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 text-red-400 hover:bg-surface rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;