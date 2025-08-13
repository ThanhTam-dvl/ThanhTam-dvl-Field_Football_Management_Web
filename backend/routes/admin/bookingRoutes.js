// ====== backend/routes/admin/bookingRoutes.js ======
const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/admin/bookingController');
const { requireAuth, requirePermission } = require('../../middleware/adminAuth');

// Booking management routes
router.get('/', requireAuth, requirePermission('bookings'), bookingController.getAllBookings);
router.put('/:bookingId/status', requireAuth, requirePermission('bookings'), bookingController.updateBookingStatus);
router.put('/:bookingId', requireAuth, requirePermission('bookings'), bookingController.updateBooking);
router.delete('/:bookingId', requireAuth, requirePermission('bookings'), bookingController.deleteBooking);
router.post('/manual', requireAuth, requirePermission('bookings'), bookingController.createManualBooking);

module.exports = router;
