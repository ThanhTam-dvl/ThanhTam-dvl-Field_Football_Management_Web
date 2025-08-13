// ====== backend/routes/admin/customerRoutes.js ======
const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/admin/customerController');
const { requireAuth, requirePermission } = require('../../middleware/adminAuth');

// Customer management routes
router.get('/', requireAuth, requirePermission('users'), customerController.getCustomers);
router.get('/stats', requireAuth, requirePermission('users'), customerController.getCustomerStats);
router.get('/:customerId', requireAuth, requirePermission('users'), customerController.getCustomerById);
router.post('/', requireAuth, requirePermission('users'), customerController.createCustomer);
router.put('/:customerId', requireAuth, requirePermission('users'), customerController.updateCustomer);
router.delete('/:customerId', requireAuth, requirePermission('users'), customerController.deleteCustomer);
router.patch('/bulk', requireAuth, requirePermission('users'), customerController.bulkUpdateCustomers);

module.exports = router;
