// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminController = require('../controllers/adminController');
const { requireAuth, requirePermission, requireSuperAdmin } = require('../middleware/adminAuth');

// Auth routes (không cần xác thực)
router.post('/auth/login', adminAuthController.login);
router.post('/auth/logout', adminAuthController.logout);
router.get('/auth/verify', adminAuthController.verifySession);
router.post('/auth/change-password', requireAuth, adminAuthController.changePassword);

// Dashboard routes
router.get('/dashboard', requireAuth, adminController.getDashboard);
router.get('/recent-bookings', requireAuth, adminController.getRecentBookings);

// Booking management routes
router.get('/bookings', requireAuth, requirePermission('bookings'), adminController.getAllBookings);
router.put('/bookings/:bookingId/status', requireAuth, requirePermission('bookings'), adminController.updateBookingStatus);

// User management routes
router.get('/users', requireAuth, requirePermission('users'), adminController.getUsers);

// Field management routes
router.get('/fields', requireAuth, requirePermission('fields'), adminController.getFields);
router.post('/fields', requireAuth, requirePermission('fields'), adminController.createField);
router.put('/fields/:fieldId', requireAuth, requirePermission('fields'), adminController.updateField);

// Field management with bookings
router.get('/fields-with-bookings', requireAuth, requirePermission('fields'), adminController.getFieldsWithBookings);
router.post('/manual-booking', requireAuth, requirePermission('bookings'), adminController.createManualBooking);
router.delete('/bookings/:bookingId', requireAuth, requirePermission('bookings'), adminController.deleteBooking);

// Revenue reports
router.get('/revenue', requireAuth, requirePermission('reports'), adminController.getRevenue);

// Admin management routes (chỉ super admin)
router.get('/admins', requireAuth, requireSuperAdmin, (req, res) => {
  const Admin = require('../models/Admin');
  Admin.findAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi lấy danh sách admin' });
    res.json(results);
  });
});

router.post('/admins', requireAuth, requireSuperAdmin, (req, res) => {
  const Admin = require('../models/Admin');
  Admin.create(req.body, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email đã tồn tại' });
      }
      return res.status(500).json({ error: 'Lỗi tạo admin' });
    }
    res.status(201).json({ message: 'Tạo admin thành công', adminId: result.insertId });
  });
});

module.exports = router;