import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, Users } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group">
      
      {/* Event Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={event.image || 'https://via.placeholder.com/400x200?text=Event'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
          {event.category}
        </span>
        {/* Price Badge */}
        <span className="absolute top-3 right-3 bg-white text-purple-700 text-xs px-3 py-1 rounded-full font-bold shadow">
          ${event.price}
        </span>
      </div>

      {/* Event Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4 text-purple-500" />
            <span>{event.venue}, {event.city}</span>
          </div>

          {/* Available Seats */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Users className="w-4 h-4 text-purple-500" />
            <span>{event.availableSeats} seats left</span>
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/events/${event._id}`}
          className="block w-full text-center bg-purple-600 text-white py-2 rounded-full font-semibold hover:bg-purple-700 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;