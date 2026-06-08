import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import EventCard from '../components/ui/EventCard';
import Loader from '../components/ui/Loader';
import { getAllEvents } from '../utils/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: '',
    minPrice: '',
    maxPrice: '',
    sort: 'date'
  });

  const categories = [
    'All', 'Concerts', 'Sports', 'Conference', 'Wedding', 'Festival', 'Theatre'
  ];

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;

      const res = await getAllEvents(params);
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      sort: 'date'
    });
  };

  return (
    <div className="min-h-screen bg-black">

      {/* Header */}
      <div className="bg-gray-900 border-b border-orange-500/30 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">All Events</h1>
          <p className="text-orange-200 text-sm md:text-base">Discover amazing events near you</p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-950 rounded-2xl sm:rounded-full shadow-2xl shadow-orange-500/10 overflow-hidden mt-6 max-w-2xl">
            <div className="flex items-center flex-1">
              <Search className="w-5 h-5 text-orange-400 ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="flex-1 px-4 py-4 text-white bg-transparent outline-none text-base sm:text-lg"
              />
            </div>
            <button
              onClick={fetchEvents}
              className="bg-orange-500 text-black px-8 py-4 font-semibold hover:bg-orange-600 transition text-center"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters Row */}
        <div className="theme-card rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-col gap-4">

            {/* Top row: Filter label + category pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                <Filter className="w-4 h-4" />
                Filters:
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange('category', cat === 'All' ? '' : cat)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      (cat === 'All' && !filters.category) || filters.category === cat
                        ? 'bg-orange-500 text-black'
                        : 'bg-gray-100 text-gray-600 hover:bg-surface-soft'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom row: City, Price, Sort, Clear */}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="City..."
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-sm outline-none focus:border-orange-400 w-full sm:w-32"
              />
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-sm outline-none focus:border-orange-400 w-full sm:w-28"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-sm outline-none focus:border-orange-400 w-full sm:w-28"
              />
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-sm outline-none focus:border-orange-400 w-full sm:w-auto"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="title">Sort by Name</option>
              </select>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-semibold"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>

          </div>
        </div>

        {/* Results Count */}
        <p className="text-theme-text-muted mb-6">
          {loading ? 'Loading...' : `${events.length} events found`}
        </p>

        {/* Events Grid */}
        {loading ? (
          <Loader />
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎭</p>
            <p className="text-gray-400 text-xl font-semibold">No events found</p>
            <p className="text-gray-300 mt-2">Try changing your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-orange-500 text-black px-6 py-2 rounded-full hover:bg-orange-600 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;