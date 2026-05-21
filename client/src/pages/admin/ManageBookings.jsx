import React, { useState, useEffect } from 'react';
import { Search, Ticket, CheckCircle, X, Clock } from 'lucide-react';
import API from '../../utils/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/admin/bookings');
      setBookings(res.data.bookings || []);
    } catch (error) {
      toast.error('Failed to load bookings!');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await API.put(`/admin/bookings/${bookingId}`, { status: newStatus });
      toast.success('Booking status updated!');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status!');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
      booking.bookingId?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <p className="text-purple-200 mt-1">{bookings.length} total bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

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
              <p className="text-2xl font-bold text-gray-800">{confirmedCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Ticket className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, event, booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-400 transition"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'confirmed', 'cancelled', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition capitalize ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-6xl mb-4">🎟️</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Bookings Found</h2>
            <p className="text-gray-400">Try changing your filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
              <div>Booking ID</div>
              <div className="col-span-2">Event & User</div>
              <div>Tickets</div>
              <div>Amount</div>
              <div>Status</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-50">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition"
                >

                  {/* Booking ID */}
                  <div>
                    <p className="text-purple-600 font-semibold text-xs">
                      #{booking.bookingId}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Event & User */}
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">
                      {booking.event?.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      👤 {booking.user?.name} • {booking.user?.email}
                    </p>
                  </div>

                  {/* Tickets */}
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <Ticket className="w-4 h-4 text-purple-400" />
                    {booking.numberOfTickets}
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="font-bold text-purple-600">${booking.totalPrice}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold border-0 outline-none cursor-pointer ${getStatusStyle(booking.status)}`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="pending">Pending</option>
                    </select>
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

export default ManageBookings;