import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Calendar, MapPin, DollarSign } from 'lucide-react';
import API from '../../utils/api';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get('/organizer/events');
      setEvents(res.data.events || []);
    } catch (error) {
      toast.error('Failed to load events!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setDeleting(id);
    try {
      await API.delete(`/organizer/events/${id}`);
      toast.success('Event deleted successfully!');
      fetchMyEvents();
    } catch (error) {
      toast.error('Failed to delete event!');
    } finally {
      setDeleting(null);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(search.toLowerCase()) ||
    event.category?.toLowerCase().includes(search.toLowerCase()) ||
    event.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-indigo-200 mt-1">{events.length} total events</p>
          </div>
          <Link to="/organizer/create-event">
            <Button variant="outline" size="md">
              <Plus className="w-4 h-4 mr-2 inline" />
              New Event
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, category, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition"
            />
          </div>
        </div>

        {/* Events Table */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-6xl mb-4">🎭</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Events Found</h2>
            <p className="text-gray-400 mb-6">Create your first event!</p>
            <Link to="/organizer/create-event">
              <Button variant="primary">Create Event</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
              <div className="col-span-2">Event</div>
              <div>Date</div>
              <div>Price</div>
              <div>Seats</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-50">
              {filteredEvents.map((event) => (
                <div key={event._id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition">

                  {/* Event Info */}
                  <div className="col-span-2 flex items-center gap-3">
                    <img
                      src={event.image || 'https://via.placeholder.com/60?text=E'}
                      alt={event.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.city}
                      </div>
                      <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span>{event.price}</span>
                  </div>

                  {/* Seats */}
                  <div className="text-sm">
                    <span className={`font-semibold ${
                      event.availableSeats < 10 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {event.availableSeats}
                    </span>
                    <span className="text-gray-400"> / {event.totalSeats}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/organizer/edit-event/${event._id}`)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deleting === event._id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;