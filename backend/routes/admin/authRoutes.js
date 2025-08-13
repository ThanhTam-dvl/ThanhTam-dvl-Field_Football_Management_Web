// ====== backend/routes/admin/authRoutes.js ======
const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/adminAuthController');
const { requireAuth } = require('../../middleware/adminAuth');

// Auth routes (không cần xác thực)
router.post('/login', adminAuthController.login);
router.post('/logout', adminAuthController.logout);
router.get('/verify', adminAuthController.verifySession);
router.post('/change-password', requireAuth, adminAuthController.changePassword);

module.exports = router;