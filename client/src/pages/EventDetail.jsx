import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag, Clock, ArrowLeft } from 'lucide-react';
import { getEventById, createBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await getEventById(id);
      setEvent(res.data.event);
    } catch (error) {
      toast.error('Event not found!');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets!');
      navigate('/login');
      return;
    }
    setBooking(true);
    try {
      const res = await createBooking({
        eventId: id,
        numberOfTickets: tickets
      });
      toast.success('Booking Successful!');
      navigate('/booking-confirm', { state: { booking: res.data.booking } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed!');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!event) return null;

  return (
    <div className="min-h-screen">

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-accent hover:text-accent-strong font-semibold mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side — Event Info */}
          <div className="lg:col-span-2">

            {/* Event Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
              <img
                src={event.image || 'https://via.placeholder.com/800x400?text=Event'}
                alt={event.title}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Event Title & Category */}
            <div className="theme-card rounded-2xl shadow-sm p-6 mb-6">
              <span className="bg-surface-soft text-accent text-sm px-3 py-1 rounded-full font-semibold">
                {event.category}
              </span>
              <h1 className="text-3xl font-bold text-white mt-3 mb-4">
                {event.title}
              </h1>
              <p className="text-theme-text-muted leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="theme-card rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="bg-surface-soft p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-gray-700 font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-surface-soft p-2 rounded-full">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-gray-700 font-semibold">{event.time || '7:00 PM'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-surface-soft p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Venue</p>
                    <p className="text-gray-700 font-semibold">{event.venue}, {event.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-surface-soft p-2 rounded-full">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Available Seats</p>
                    <p className="text-gray-700 font-semibold">{event.availableSeats} seats left</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-surface-soft p-2 rounded-full">
                    <Tag className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Price per Ticket</p>
                    <p className="text-gray-700 font-semibold">${event.price}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side — Booking Card */}
          <div className="lg:col-span-1">
            <div className="theme-card rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-2">Book Tickets</h2>
              <p className="text-theme-text-muted text-sm mb-6">Select number of tickets</p>

              {/* Price */}
              <div className="theme-card-soft rounded-xl p-4 mb-6">
                <p className="text-theme-text-muted text-sm">Price per ticket</p>
                <p className="text-3xl font-bold text-accent">${event.price}</p>
              </div>

              {/* Ticket Selector */}
              <div className="mb-6">
                <label className="text-gray-600 text-sm font-semibold mb-2 block">
                  Number of Tickets
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTickets(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 bg-surface-soft text-accent rounded-full font-bold text-xl hover:bg-surface transition"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-800 w-8 text-center">
                    {tickets}
                  </span>
                  <button
                    onClick={() => setTickets(prev => Math.min(event.availableSeats, prev + 1))}
                    className="w-10 h-10 bg-surface-soft text-accent rounded-full font-bold text-xl hover:bg-surface transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-accent">
                    ${(event.price * tickets).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                disabled={booking || event.availableSeats === 0}
                fullWidth
                size="lg"
              >
                {booking ? 'Booking...' : event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
              </Button>

              {/* Seats Warning */}
              {event.availableSeats < 10 && event.availableSeats > 0 && (
                <p className="text-red-500 text-sm text-center mt-3">
                   Only {event.availableSeats} seats left!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;