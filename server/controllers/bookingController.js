const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.status !== 'active') {
      return res.status(400).json({ message: 'Event is not available' });
    }

    // Check if enough seats are available
    if (event.availableSeats < numberOfTickets) {
      return res.status(400).json({ 
        message: `Only ${event.availableSeats} seats available` 
      });
    }

    // Calculate total price
    const totalPrice = event.price * numberOfTickets;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      numberOfTickets,
      totalPrice
    });

    // Update available seats
    event.availableSeats -= numberOfTickets;
    await event.save();

    // Populate event and user details
    await booking.populate('event', 'title date venue city image');
    await booking.populate('user', 'name email');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    // Find all bookings of logged in user
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date venue city image price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to logged in user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to cancel this booking' 
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Booking is already cancelled' 
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Return seats back to event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.numberOfTickets;
      await event.save();
    }

    res.status(200).json({ 
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking };