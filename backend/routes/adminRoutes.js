// ====== backend/routes/adminRoutes.js (Updated Main File) ======
const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const adminAuthController = require('../controllers/adminAuthController');
const { requireAuth, requireSuperAdmin } = require('../middleware/adminAuth');

// Mount all admin sub-routes
router.use('/', adminRoutes);

// Legacy user management routes (keep for backward compatibility)
router.get('/users', requireAuth, require('../controllers/admin/customerController').getCustomers);

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