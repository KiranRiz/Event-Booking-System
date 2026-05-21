import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import EventCard from '../components/ui/EventCard';
import Loader from '../components/ui/Loader';
import { getAllEvents } from '../utils/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Concerts', icon: '🎵', color: 'bg-pink-100 text-pink-600' },
    { name: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-600' },
    { name: 'Conference', icon: '💼', color: 'bg-blue-100 text-blue-600' },
    { name: 'Wedding', icon: '💍', color: 'bg-purple-100 text-purple-600' },
    { name: 'Festival', icon: '🎉', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Theatre', icon: '🎭', color: 'bg-red-100 text-red-600' },
  ];

  const stats = [
    { number: '500+', label: 'Events', icon: <Calendar className="w-6 h-6" /> },
    { number: '10K+', label: 'Happy Users', icon: <Users className="w-6 h-6" /> },
    { number: '50+', label: 'Cities', icon: <MapPin className="w-6 h-6" /> },
    { number: '4.9', label: 'Rating', icon: <Star className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Discover & Book
            <span className="text-yellow-400"> Amazing Events</span>
          </h1>
          <p className="text-xl text-purple-200 mb-10">
            Find the best concerts, sports, conferences and more near you
          </p>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full shadow-xl overflow-hidden max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-4 text-gray-800 outline-none text-lg"
            />
            <Link
              to={`/events?search=${search}`}
              className="bg-purple-600 text-white px-8 py-4 font-semibold hover:bg-purple-700 transition"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center text-purple-600 mb-2">
                  {stat.icon}
                </div>
                <p className="text-3xl font-extrabold text-gray-800">{stat.number}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/events?category=${cat.name}`}
                className={`${cat.color} rounded-2xl p-4 text-center hover:shadow-md transition duration-300 cursor-pointer`}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <p className="font-semibold text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Events
            </h2>
            <Link
              to="/events"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 6).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Book Your Next Event?
          </h2>
          <p className="text-purple-200 mb-8 text-lg">
            Join thousands of happy users who book events with EventHub
          </p>
          <Link
            to="/register"
            className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition duration-300"
          >
            Get Started Free
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;