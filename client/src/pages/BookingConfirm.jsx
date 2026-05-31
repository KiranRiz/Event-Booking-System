import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Ticket } from 'lucide-react';
import Button from '../components/ui/Button';

const BookingConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  // Agar direct URL se aaye (koi booking nahi)
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🎟️</p>
          <h2 className="text-2xl font-bold text-white mb-2">No Booking Found</h2>
          <p className="text-theme-text-muted mb-6">Please book an event first</p>
          <Link to="/events">
            <Button variant="primary" size="lg">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="theme-card rounded-3xl shadow-xl w-full max-w-lg p-8">

        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400">
            Your tickets have been booked successfully
          </p>
        </div>

        {/* Booking ID */}
        <div className="theme-card-soft rounded-2xl p-4 mb-6 text-center">
          <p className="text-theme-text-muted text-sm mb-1">Booking ID</p>
          <p className="text-accent font-bold text-xl tracking-wider">
            #{booking.bookingId}
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Booking Details
          </h2>

          {/* Event Name */}
          <div className="flex items-center gap-3">
            <div className="bg-surface-soft p-2 rounded-full">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Event</p>
              <p className="text-gray-700 font-semibold">
                {booking.event?.title}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="bg-surface-soft p-2 rounded-full">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Date</p>
              <p className="text-gray-700 font-semibold">
                {new Date(booking.event?.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-3">
            <div className="bg-surface-soft p-2 rounded-full">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Venue</p>
              <p className="text-gray-700 font-semibold">
                {booking.event?.venue}, {booking.event?.city}
              </p>
            </div>
          </div>

          {/* Tickets */}
          <div className="flex items-center gap-3">
            <div className="bg-surface-soft p-2 rounded-full">
              <Ticket className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Tickets</p>
              <p className="text-gray-700 font-semibold">
                {booking.numberOfTickets} ticket(s)
              </p>
            </div>
          </div>

          {/* Total Price */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Total Paid</span>
              <span className="text-2xl font-bold text-accent">
                ${booking.totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <span className="bg-green-100 text-green-600 px-6 py-2 rounded-full font-semibold text-sm">
            ✅ Status: Confirmed
          </span>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/my-bookings')}
            fullWidth
            size="lg"
          >
            <Ticket className="w-4 h-4 mr-2 inline" />
            View My Bookings
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            fullWidth
            size="lg"
          >
            <Home className="w-4 h-4 mr-2 inline" />
            Back to Home
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirm;