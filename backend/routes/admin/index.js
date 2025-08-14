const express = require('express');
const router = express.Router();

// Import sub-routes
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const bookingRoutes = require('./bookingRoutes');
const customerRoutes = require('./customerRoutes');
const fieldRoutes = require('./fieldRoutes');
const revenueRoutes = require('./revenueRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const matchRoutes = require('./matchRoutes');
const teamJoinRoutes = require('./teamJoinRoutes');

// Mount sub-routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/bookings', bookingRoutes);
router.use('/customers', customerRoutes);
router.use('/fields', fieldRoutes);
router.use('/revenue', revenueRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/matches', matchRoutes);
router.use('/team-joins', teamJoinRoutes);

module.exports = router;