import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, Image, ArrowLeft } from 'lucide-react';
import API from '../../utils/api';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const categories = [
  'Concerts', 'Sports', 'Conference', 'Wedding', 'Festival', 'Theatre'
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    price: '',
    totalSeats: '',
    image: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        const event = res.data.event;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          category: event.category || '',
          date: event.date ? event.date.split('T')[0] : '',
          time: event.time || '',
          venue: event.venue || '',
          city: event.city || '',
          price: event.price || '',
          totalSeats: event.totalSeats || '',
          image: event.image || ''
        });
      } catch (error) {
        toast.error('Unable to load event details');
        navigate('/admin/manage-events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.totalSeats) newErrors.totalSeats = 'Total seats is required';
    else if (formData.totalSeats < 1) newErrors.totalSeats = 'Seats must be at least 1';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await API.put(`/admin/events/${id}`, formData);
      toast.success('Event updated successfully!');
      navigate('/admin/manage-events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/admin/manage-events')}
            className="flex items-center gap-2 text-orange-200 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-orange-200 mt-1">Update event details and save changes.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="theme-card rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className={`w-full px-4 py-3 border rounded-xl outline-none transition ${errors.title ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl outline-none transition resize-none ${errors.description ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl outline-none transition ${errors.category ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>
          </div>

          <div className="theme-card rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Event Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.date ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                  />
                </div>
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Event Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-400 transition"
                />
              </div>
            </div>
          </div>

          <div className="theme-card rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Venue *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Venue name"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.venue ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                  />
                </div>
                {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
              </div>

              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City name"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                  />
                </div>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          <div className="theme-card rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Tickets & Price</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Ticket Price ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.price ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="text-gray-600 text-sm font-semibold mb-1 block">
                  Total Seats *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${errors.totalSeats ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                  />
                </div>
                {errors.totalSeats && <p className="text-red-500 text-xs mt-1">{errors.totalSeats}</p>}
              </div>
            </div>
          </div>

          <div className="theme-card rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Event Image</h2>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-400 transition"
              />
            </div>
            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={saving} fullWidth>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('/admin/manage-events')} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
