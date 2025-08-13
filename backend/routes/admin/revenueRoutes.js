// ====== backend/routes/admin/revenueRoutes.js ======
const express = require('express');
const router = express.Router();
const revenueController = require('../../controllers/admin/revenueController');
const { requireAuth, requirePermission } = require('../../middleware/adminAuth');

// Revenue reports
router.get('/', requireAuth, requirePermission('reports'), revenueController.getRevenue);

module.exports = router;
