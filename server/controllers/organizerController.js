const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get organizer dashboard stats and recent events
// @route   GET /api/organizer/dashboard
// @access  Organizer
const getDashboard = async (req, res) => {
  try {
    // Get all events created by this organizer
    const events = await Event.find({ createdBy: req.user.id });

    // Get all bookings for organizer events
    const eventIds = events.map(event => event._id);
    const bookings = await Booking.find({ 
      event: { $in: eventIds },
      status: 'confirmed'
    });

    // Calculate total revenue
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice, 0
    );

    res.status(200).json({
      stats: {
        totalEvents: events.length,
        totalBookings: bookings.length,
        totalRevenue
      },
      events
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all organizer events
// @route   GET /api/organizer/events
// @access  Organizer
const getMyEvents = async (req, res) => {
  try {
    // Get only events created by this organizer
    const events = await Event.find({ createdBy: req.user.id })
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
// @route   POST /api/organizer/events
// @access  Organizer
const createEvent = async (req, res) => {
  try {
    const {
      title, description, category,
      date, time, venue, city,
      price, totalSeats, image
    } = req.body;

    // Create event with logged in organizer as creator
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

// @desc    Update organizer event
// @route   PUT /api/organizer/events/:id
// @access  Organizer
const updateEvent = async (req, res) => {
  try {
    // Find event
    const event = await Event.findById(req.params.id);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if this event belongs to this organizer
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to update this event' 
      });
    }

    // Update event
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

// @desc    Delete organizer event
// @route   DELETE /api/organizer/events/:id
// @access  Organizer
const deleteEvent = async (req, res) => {
  try {
    // Find event
    const event = await Event.findById(req.params.id);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if this event belongs to this organizer
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this event' 
      });
    }

    // Delete all bookings of this event
    await Booking.deleteMany({ event: req.params.id });

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: 'Event deleted successfully' 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for organizer events
// @route   GET /api/organizer/bookings
// @access  Organizer
const getEventBookings = async (req, res) => {
  try {
    // Get all organizer events
    const events = await Event.find({ createdBy: req.user.id });
    const eventIds = events.map(event => event._id);

    // Get all bookings for these events
    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate('user', 'name email phone')
      .populate('event', 'title date venue city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventBookings
};