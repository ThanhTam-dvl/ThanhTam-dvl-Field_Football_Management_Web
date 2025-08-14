// backend/routes/admin/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const InventoryController = require('../../controllers/admin/inventoryController');
const { requireAuth } = require('../../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(requireAuth);

// Product routes
router.get('/products', InventoryController.getProducts);
router.get('/products/:id', InventoryController.getProduct);
router.post('/products', InventoryController.createProduct);
router.put('/products/:id', InventoryController.updateProduct);
router.delete('/products/:id', InventoryController.deleteProduct);

// Statistics
router.get('/stats', InventoryController.getStats);

// Transaction routes
router.post('/transactions', InventoryController.createTransaction);
router.get('/transactions', InventoryController.getTransactionHistory);
router.post('/quick-update', InventoryController.quickStockUpdate);

module.exports = router;