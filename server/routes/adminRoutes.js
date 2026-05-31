const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/stats', protect, isAdmin, getDashboardStats);
router.get('/events', protect, isAdmin, getAllEvents);
router.post('/events', protect, isAdmin, createEvent);
router.put('/events/:id', protect, isAdmin, updateEvent);
router.delete('/events/:id', protect, isAdmin, deleteEvent);
router.get('/bookings', protect, isAdmin, getAllBookings);
router.put('/bookings/:id', protect, isAdmin, updateBookingStatus);
router.get('/users', protect, isAdmin, getAllUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;