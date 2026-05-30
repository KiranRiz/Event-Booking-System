const Event = require('../models/Event');

// @desc    Get all events with search and filters
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const { search, category, city, minPrice, maxPrice, sort } = req.query;

    // Build query object
    let query = { status: 'active' };

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = {};
    if (sort === 'price') sortOption = { price: 1 };
    else if (sort === 'title') sortOption = { title: 1 };
    else sortOption = { date: 1 };

    const events = await Event.find(query)
      .sort(sortOption)
      .populate('createdBy', 'name email');

    res.status(200).json({
      count: events.length,
      events
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEvents, getEventById };