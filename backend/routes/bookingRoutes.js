// backend/routes/bookingRoutes.js - ADD RECENT BOOKINGS ROUTE
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== CUSTOMER BOOKING ROUTES ===============
router.post('/', bookingController.createBooking);
router.get('/date', bookingController.getBookingsByDate);
router.get('/user/:userId', bookingController.getUserBookings);

// =============== ADMIN BOOKING ROUTES ===============
router.get('/admin', requireAuth, requirePermission('bookings'), bookingController.getAllBookings);
router.get('/admin/recent', requireAuth, bookingController.getRecentBookings); // ADD THIS LINE
router.post('/admin/manual', requireAuth, requirePermission('bookings'), bookingController.createManualBooking);
router.put('/admin/:bookingId/status', requireAuth, requirePermission('bookings'), bookingController.updateBookingStatus);
router.put('/admin/:bookingId', requireAuth, requirePermission('bookings'), bookingController.updateBooking);
router.delete('/admin/:bookingId', requireAuth, requirePermission('bookings'), bookingController.deleteBooking);

module.exports = router;