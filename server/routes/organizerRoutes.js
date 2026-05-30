const express = require('express');
const router = express.Router();
const { getDashboard, getMyEvents, createEvent, updateEvent, deleteEvent, getEventBookings } = require('../controllers/organizerController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/organizerMiddleware');

router.get('/dashboard', protect, isOrganizer, getDashboard);
router.get('/events', protect, isOrganizer, getMyEvents);
router.post('/events', protect, isOrganizer, createEvent);
router.put('/events/:id', protect, isOrganizer, updateEvent);
router.delete('/events/:id', protect, isOrganizer, deleteEvent);
router.get('/bookings', protect, isOrganizer, getEventBookings);

module.exports = router;