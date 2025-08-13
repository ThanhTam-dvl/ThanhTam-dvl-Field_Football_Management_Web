// ====== backend/routes/admin/fieldRoutes.js ======
const express = require('express');
const router = express.Router();
const fieldController = require('../../controllers/admin/fieldController');
const { requireAuth, requirePermission } = require('../../middleware/adminAuth');

// Field management routes
router.get('/', requireAuth, requirePermission('fields'), fieldController.getFields);
router.get('/with-bookings', requireAuth, requirePermission('fields'), fieldController.getFieldsWithBookings);
router.post('/', requireAuth, requirePermission('fields'), fieldController.createField);
router.put('/:fieldId', requireAuth, requirePermission('fields'), fieldController.updateField);

module.exports = router;
