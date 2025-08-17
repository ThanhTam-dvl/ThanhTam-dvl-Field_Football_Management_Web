// backend/routes/authRoutes.js - Customer & Admin Auth
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/adminAuth');

// =============== CUSTOMER AUTH ROUTES ===============
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

// =============== USER PROFILE ROUTES ===============
router.get('/profile/:id', authController.getUserProfile);
router.put('/profile/:id', authController.updateUserProfile);

// =============== ADMIN AUTH ROUTES ===============
router.post('/admin/login', authController.adminLogin);
router.post('/admin/logout', authController.adminLogout);
router.get('/admin/verify', authController.verifyAdminSession);
router.post('/admin/change-password', requireAuth, authController.changeAdminPassword);

module.exports = router;