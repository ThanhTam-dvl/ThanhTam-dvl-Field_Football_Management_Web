// backend/routes/userRoutes.js - User Management (Legacy - có thể deprecated)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== USER PROFILE ROUTES ===============
router.get('/:id', authController.getUserProfile);
router.put('/:id', authController.updateUserProfile);

// =============== ADMIN USER ROUTES (Legacy - nên dùng customerRoutes thay thế) ===============
// Các routes này có thể deprecated vì đã có customerRoutes
// router.get('/', requireAuth, requirePermission('users'), userController.getAllUsers);
// router.delete('/:id', requireAuth, requirePermission('users'), userController.deleteUser);

module.exports = router;