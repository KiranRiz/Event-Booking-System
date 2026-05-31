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

  
  return (
    <div className="min-h-screen bg-black">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white min-h-screen flex items-center py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Discover & Book
            <span className="text-orange-400"> Amazing Events</span>
          </h1>
          <p className="text-xl text-orange-200 mb-10">
            Find the best concerts, sports, conferences and more near you
          </p>

          {/* Search Bar */}
          <div className="flex items-center bg-slate-950 rounded-full shadow-2xl shadow-orange-500/10 overflow-hidden max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-orange-400 ml-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-4 text-white bg-transparent outline-none text-lg"
            />
            <Link
              to={`/events?search=${search}`}
              className="bg-orange-500 text-black px-8 py-4 font-semibold hover:bg-orange-600 transition"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-950 py-16 px-4 border-t border-orange-500/10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="theme-card rounded-3xl p-10 border border-orange-500/10 shadow-lg bg-slate-900">
            <div className="flex items-center gap-4 mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-black">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Easy Booking</h3>
            </div>
            <p className="text-theme-text-muted">Find and book tickets in seconds with a clean and fast experience.</p>
          </div>

          <div className="theme-card rounded-3xl p-10 border border-orange-500/10 shadow-lg bg-slate-900">
            <div className="flex items-center gap-4 mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-black">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Top Venues</h3>
            </div>
            <p className="text-theme-text-muted">Discover events from the best venues across your city and beyond.</p>
          </div>

          <div className="theme-card rounded-3xl p-10 border border-orange-500/10 shadow-lg bg-slate-900">
            <div className="flex items-center gap-4 mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-black">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Community Trusted</h3>
            </div>
            <p className="text-theme-text-muted">Book with confidence thanks to reviews, ratings, and trusted organizers.</p>
          </div>

          <div className="theme-card rounded-3xl p-10 border border-orange-500/10 shadow-lg bg-slate-900">
            <div className="flex items-center gap-4 mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-black">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Premium Support</h3>
            </div>
            <p className="text-theme-text-muted">Get help when you need it with 24/7 support and easy order management.</p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">
              Featured Events
            </h2>
            <Link
              to="/events"
              className="flex items-center gap-2 text-accent hover:text-accent-strong font-semibold"
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
      <section className="bg-gradient-to-r from-brand-900 to-brand-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Book Your Next Event?
          </h2>
          <p className="text-orange-200 mb-8 text-lg">
            Join thousands of happy users who book events with EventHub
          </p>
          <Link
            to="/register"
            className="bg-orange-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition duration-300"
          >
            Get Started Free
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;