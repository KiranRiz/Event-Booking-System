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
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-indigo-200 mt-1">Manage your events</p>
          </div>
          <Link
            to="/organizer/create-event"
            className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-full font-semibold hover:bg-indigo-50 transition"
          >
            <Plus className="w-4 h-4" />
            New Event
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">My Events</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEvents}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Ticket className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* My Events Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">My Events</h2>
            <Link
              to="/organizer/my-events"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
            >
              View All
            </Link>
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🎭</p>
              <p className="text-gray-400 text-lg mb-4">No events created yet</p>
              <Link to="/organizer/create-event">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
                  Create Your First Event
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.slice(0, 5).map((event) => (
                <div key={event._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={event.image || 'https://via.placeholder.com/50?text=E'}
                      alt={event.title}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{event.title}</p>
                      <p className="text-gray-400 text-xs">
                        {event.category} • ${event.price} • {event.availableSeats} seats left
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/events/${event._id}`}>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link to={`/organizer/edit-event/${event._id}`}>
                      <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
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
      </div>
    </div>
  );
};

export default OrganizerDashboard;