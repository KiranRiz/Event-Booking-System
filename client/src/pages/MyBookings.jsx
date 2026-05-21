import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, X, CheckCircle, Clock } from 'lucide-react';
import { getUserBookings, cancelBooking } from '../utils/api';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getUserBookings();
      setBookings(res.data.bookings || []);
    } catch (error) {
      toast.error('Failed to load bookings!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully!');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed!');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-purple-200">Manage all your event bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🎟️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Bookings Yet</h2>
            <p className="text-gray-400 mb-6">You haven't booked any events yet</p>
            <Link to="/events">
              <Button variant="primary" size="lg">
                Browse Events
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Ticket className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {bookings.filter(b => b.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row">

                    {/* Event Image */}
                    <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                      <img
                        src={booking.event?.image || 'https://via.placeholder.com/200x150?text=Event'}
                        alt={booking.event?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Info */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                        {/* Left Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                            </span>
                            <span className="text-gray-400 text-xs">
                              #{booking.bookingId}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            {booking.event?.title}
                          </h3>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              <span>
                                {new Date(booking.event?.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <MapPin className="w-4 h-4 text-purple-500" />
                              <span>{booking.event?.venue}, {booking.event?.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Ticket className="w-4 h-4 text-purple-500" />
                              <span>{booking.numberOfTickets} ticket(s)</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Info */}
                        <div className="flex flex-col items-end gap-4">
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Total Paid</p>
                            <p className="text-2xl font-bold text-purple-600">
                              ${booking.totalPrice}
                            </p>
                          </div>

                          {booking.status === 'confirmed' && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleCancel(booking._id)}
                              disabled={cancelling === booking._id}
                            >
                              {cancelling === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                            </Button>
                          )}

                          <Link to={`/events/${booking.event?._id}`}>
                            <Button variant="outline" size="sm">
                              View Event
                            </Button>
                          </Link>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;