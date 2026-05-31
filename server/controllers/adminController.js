const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    // Count total events, users, bookings
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();

    // Calculate total revenue from confirmed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.status(200).json({
      totalEvents,
      totalUsers,
      totalBookings,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events (admin)
// @route   GET /api/admin/events
// @access  Admin
const getAllEvents = async (req, res) => {
  try {
    // Get all events with creator info
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: events.length,
      events
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/admin/events
// @access  Admin
const createEvent = async (req, res) => {
  try {
    const {
      title, description, category,
      date, time, venue, city,
      price, totalSeats, image
    } = req.body;

    // Create event with logged in admin as creator
    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      city,
      price,
      totalSeats,
      image,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Admin
const updateEvent = async (req, res) => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event fields
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Admin
const deleteEvent = async (req, res) => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await Booking.deleteMany({ event: req.params.id });
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: 'Event deleted successfully' 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('event', 'title date venue city price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id
// @access  Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cannot delete admin account
    if (user.role === 'admin') {
      return res.status(400).json({ 
        message: 'Cannot delete admin account' 
      });
    }
    await Booking.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: 'User deleted successfully' 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Check valid role
    if (!['user', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update role
    user.role = role;
    await user.save();

    res.status(200).json({
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  deleteUser,
  updateUserRole
};