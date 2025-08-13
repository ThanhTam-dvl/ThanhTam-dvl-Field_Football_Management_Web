// ====== backend/routes/admin/dashboardRoutes.js ======
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');
const { requireAuth } = require('../../middleware/adminAuth');

// Dashboard routes
router.get('/', requireAuth, dashboardController.getDashboard);
router.get('/recent-bookings', requireAuth, dashboardController.getRecentBookings);

module.exports = router;
